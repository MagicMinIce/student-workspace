/**
 * 云端同步模块 - 多设备实时同步
 * 使用 Firebase Realtime Database
 * 需要 firebase-config.js 配置
 *
 * 优势：
 * - 真正的实时同步（无需轮询，数据变化即时推送）
 * - 离线缓存（断网可用，联网自动同步）
 * - Google 维护，稳定可靠
 * - 免费额度充足（1GB存储 + 每月10GB流量）
 */
const CloudSync = {
    db: null,
    roomId: null,
    listeningRef: null,
    pushTimer: null,
    isPushing: false,
    isPulling: false,
    enabled: false,
    lastCloudTimestamp: 0,
    hasUnsyncedChanges: false,
    lastError: null,
    isInitialized: false,

    // 兼容 app.js 中对 blobId 的引用
    get blobId() { return this.roomId; },

    // ===== 初始化 =====
    init() {
        // 从 localStorage 加载同步设置
        try {
            const settings = JSON.parse(localStorage.getItem('mcCloudSync') || '{}');
            this.roomId = settings.blobId || settings.roomId || null;
            this.enabled = settings.enabled || false;
            this.lastCloudTimestamp = settings.lastCloudTimestamp || 0;
        } catch (e) {
            console.error('CloudSync init error:', e);
        }

        // 检查 URL hash 是否包含同步码
        const hash = window.location.hash;
        if (hash.startsWith('#sync=')) {
            const code = hash.substring(6).trim().toUpperCase();
            if (code && code.length >= 4 && code !== this.roomId) {
                setTimeout(() => {
                    this.join(code).catch(err => {
                        console.error('Auto-join failed:', err);
                    });
                }, 1500);
            }
        }

        // 如果已启用，初始化 Firebase 并开始监听
        if (this.enabled && this.roomId) {
            this.initFirebase().then(ok => {
                if (ok) this.startListening();
            });
        }
    },

    // ===== 初始化 Firebase =====
    async initFirebase() {
        if (this.isInitialized) return true;

        if (typeof firebase === 'undefined') {
            this.lastError = 'Firebase SDK 未加载';
            this.updateStatus('error');
            return false;
        }

        if (!window.FIREBASE_CONFIG || !window.FIREBASE_CONFIG.apiKey || window.FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
            this.lastError = 'Firebase 未配置';
            this.updateStatus('error');
            return false;
        }

        try {
            firebase.initializeApp(window.FIREBASE_CONFIG);
            this.db = firebase.database();
            this.isInitialized = true;
            return true;
        } catch (e) {
            // 如果已经初始化过，直接获取实例
            if (e.code === 'app/duplicate-app') {
                this.db = firebase.database();
                this.isInitialized = true;
                return true;
            }
            console.error('Firebase init error:', e);
            this.lastError = e.message;
            this.updateStatus('error');
            return false;
        }
    },

    // ===== 生成6位同步码 =====
    generateRoomId() {
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
    },

    // ===== 创建新的云端同步 =====
    async create() {
        if (!(await this.initFirebase())) {
            throw new Error(this.lastError || 'Firebase 初始化失败');
        }

        const roomId = this.generateRoomId();

        const payload = {
            data: this.stripLargeMedia(Store.data),
            timestamp: Date.now(),
            device: this.getDeviceId()
        };

        await this.db.ref('workspaces/' + roomId).set(payload);

        this.roomId = roomId;
        this.enabled = true;
        this.lastCloudTimestamp = payload.timestamp;
        this.hasUnsyncedChanges = false;
        this.saveSettings();
        this.updateUrlHash();
        this.startListening();
        this.updateStatus('synced');

        return roomId;
    },

    // ===== 加入已有的云端同步 =====
    async join(code) {
        code = code.trim().toUpperCase();
        if (!code) throw new Error('请输入同步码');

        if (!(await this.initFirebase())) {
            throw new Error(this.lastError || 'Firebase 初始化失败');
        }

        const snapshot = await this.db.ref('workspaces/' + code).once('value');
        const payload = snapshot.val();

        if (!payload || !payload.data) throw new Error('同步码无效或数据不存在');

        // 合并云端数据到本地
        this.isPulling = true;
        Store.data = Object.assign(
            JSON.parse(JSON.stringify(Store.defaultData)),
            payload.data
        );
        Store.save();
        this.lastCloudTimestamp = payload.timestamp || 0;
        this.isPulling = false;

        UI.updateTopbar();
        App.render();

        this.roomId = code;
        this.enabled = true;
        this.hasUnsyncedChanges = false;
        this.saveSettings();
        this.updateUrlHash();
        this.startListening();
        this.updateStatus('synced');

        return true;
    },

    // ===== 推送本地数据到云端 =====
    async push() {
        if (!this.enabled || !this.roomId || this.isPushing || this.isPulling || !this.db) return;

        this.isPushing = true;
        this.updateStatus('syncing');

        try {
            const payload = {
                data: this.stripLargeMedia(Store.data),
                timestamp: Date.now(),
                device: this.getDeviceId()
            };

            await this.db.ref('workspaces/' + this.roomId).set(payload);

            this.lastCloudTimestamp = payload.timestamp;
            this.hasUnsyncedChanges = false;
            this.saveSettings();
            this.updateStatus('synced');
            this.lastError = null;
        } catch (e) {
            console.error('CloudSync push error:', e);
            this.lastError = e.message;
            this.updateStatus('error');
        }

        this.isPushing = false;
    },

    // ===== 实时监听云端数据变化 =====
    startListening() {
        if (this.listeningRef) {
            this.listeningRef.off();
        }

        this.listeningRef = this.db.ref('workspaces/' + this.roomId);

        this.listeningRef.on('value', (snapshot) => {
            if (this.isPushing) return;

            const payload = snapshot.val();
            if (payload && payload.data) {
                const cloudTime = payload.timestamp || 0;
                if (cloudTime > this.lastCloudTimestamp) {
                    // 云端数据更新，更新本地
                    this.isPulling = true;
                    Store.data = Object.assign(
                        JSON.parse(JSON.stringify(Store.defaultData)),
                        payload.data
                    );
                    Store.save();
                    this.lastCloudTimestamp = cloudTime;
                    this.hasUnsyncedChanges = false;
                    this.saveSettings();
                    UI.updateTopbar();
                    App.render();
                    this.updateStatus('synced');
                    this.lastError = null;
                    this.isPulling = false;
                }
            }
        }, (err) => {
            console.error('CloudSync listen error:', err);
            this.lastError = err.message;
            this.updateStatus('error');
        });

        this.updateStatus('synced');
    },

    // ===== 停止监听 =====
    stopListening() {
        if (this.listeningRef) {
            this.listeningRef.off();
            this.listeningRef = null;
        }
        this.updateStatus('disabled');
    },

    // ===== 本地数据变化时触发 =====
    onLocalChange() {
        if (this.isPulling) return;
        this.hasUnsyncedChanges = true;
        // 防抖：1秒后推送
        clearTimeout(this.pushTimer);
        this.pushTimer = setTimeout(() => this.push(), 1000);
    },

    // ===== 兼容旧接口 =====
    startPolling() { this.startListening(); },
    stopPolling() { this.stopListening(); },

    // ===== 关闭同步 =====
    disable() {
        this.enabled = false;
        this.stopListening();
        clearTimeout(this.pushTimer);
        this.saveSettings();
        this.clearUrlHash();
        this.updateStatus('disabled');
    },

    // ===== 剥离过大的媒体数据（视频不同步，仅保留标记） =====
    stripLargeMedia(data) {
        if (!data || !data.pendingReviews) return data;
        const cleaned = JSON.parse(JSON.stringify(data));
        cleaned.pendingReviews = (cleaned.pendingReviews || []).map(r => {
            if (r.media && r.media.type === 'video' && r.media.data) {
                // 视频太大不同步，仅保留类型标记
                r.media = { type: 'video', data: null, note: '视频仅在本地保存' };
            }
            return r;
        });
        return cleaned;
    },

    // ===== 保存设置 =====
    saveSettings() {
        localStorage.setItem('mcCloudSync', JSON.stringify({
            blobId: this.roomId,
            roomId: this.roomId,
            enabled: this.enabled,
            lastCloudTimestamp: this.lastCloudTimestamp
        }));
    },

    // ===== 获取设备ID =====
    getDeviceId() {
        let id = localStorage.getItem('mcDeviceId');
        if (!id) {
            id = 'dev_' + Math.random().toString(36).substring(2, 11);
            localStorage.setItem('mcDeviceId', id);
        }
        return id;
    },

    // ===== URL Hash 管理 =====
    updateUrlHash() {
        if (this.roomId) {
            history.replaceState(null, '', '#sync=' + this.roomId);
        }
    },

    clearUrlHash() {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    },

    // ===== 获取分享链接 =====
    getShareLink() {
        if (!this.roomId) return null;
        const base = window.location.origin + window.location.pathname;
        return base + '#sync=' + this.roomId;
    },

    // ===== 更新状态指示器 =====
    updateStatus(status) {
        const indicator = document.getElementById('syncIndicator');
        if (!indicator) return;

        const statuses = {
            synced:   { icon: '\u2601\uFE0F', text: '\u5DF2\u540C\u6B65', cls: 'sync-ok' },
            syncing:  { icon: '\uD83D\uDD04', text: '\u540C\u6B65\u4E2D', cls: 'sync-active' },
            error:    { icon: '\u26A0\uFE0F', text: '\u540C\u6B65\u5F02\u5E38', cls: 'sync-error' },
            disabled: { icon: '\u2B24',       text: '\u672A\u8FDE\u63A5', cls: 'sync-off' }
        };

        const s = statuses[status] || statuses.disabled;
        indicator.className = 'sync-indicator ' + s.cls;
        indicator.innerHTML = '<span class="sync-dot"></span><span>' + s.text + '</span>';
    },

    // ===== 格式化同步码 =====
    formatCode(code) {
        if (!code) return '';
        return code;
    }
};
