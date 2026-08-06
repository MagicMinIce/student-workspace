/**
 * 云端同步模块 - 多设备自动实时同步
 * 使用 jsonblob.com 免费 JSON 云存储 API
 * 无需注册账号，无需配置，开箱即用
 */
const CloudSync = {
    API_BASE: 'https://jsonblob.com/api/jsonBlob',
    blobId: null,
    pollTimer: null,
    pushTimer: null,
    isPushing: false,
    isPulling: false,
    enabled: false,
    lastCloudTimestamp: 0,
    hasUnsyncedChanges: false,
    lastError: null,

    // ===== 初始化 =====
    init() {
        // 从 localStorage 加载同步设置
        try {
            const settings = JSON.parse(localStorage.getItem('mcCloudSync') || '{}');
            this.blobId = settings.blobId || null;
            this.enabled = settings.enabled || false;
            this.lastCloudTimestamp = settings.lastCloudTimestamp || 0;
        } catch (e) {
            console.error('CloudSync init error:', e);
        }

        // 检查 URL hash 是否包含同步码
        const hash = window.location.hash;
        if (hash.startsWith('#sync=')) {
            const code = hash.substring(6).trim();
            if (code && code.length > 10 && code !== this.blobId) {
                // 自动加入同步
                setTimeout(() => {
                    this.join(code).catch(err => {
                        console.error('Auto-join failed:', err);
                    });
                }, 1500);
            }
        }

        // 如果已启用，开始轮询
        if (this.enabled && this.blobId) {
            this.startPolling();
            // 延迟1秒后首次拉取
            setTimeout(() => this.pull(), 1500);
        }
    },

    // ===== 创建新的云端同步 =====
    async create() {
        const payload = {
            data: Store.data,
            timestamp: Date.now(),
            device: this.getDeviceId()
        };

        const res = await fetch(this.API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('创建云端同步失败 (HTTP ' + res.status + ')');

        // 从 Location 头获取 blob ID
        let blobId = null;
        const location = res.headers.get('Location');
        if (location) {
            blobId = location.split('/').pop();
        }

        // 备用：从响应体获取
        if (!blobId) {
            try {
                const body = await res.json();
                blobId = body._id || body.id || null;
            } catch (e) {}
        }

        if (!blobId) throw new Error('无法获取同步ID');

        this.blobId = blobId;
        this.enabled = true;
        this.lastCloudTimestamp = payload.timestamp;
        this.hasUnsyncedChanges = false;
        this.saveSettings();
        this.updateUrlHash();
        this.startPolling();
        this.updateStatus('synced');

        return blobId;
    },

    // ===== 加入已有的云端同步 =====
    async join(code) {
        code = code.trim();
        if (!code) throw new Error('请输入同步码');

        // 尝试从云端拉取数据
        const res = await fetch(this.API_BASE + '/' + code);
        if (!res.ok) throw new Error('同步码无效或数据不存在');

        const payload = await res.json();
        if (!payload || !payload.data) throw new Error('云端数据格式错误');

        // 合并云端数据到本地
        this.isPulling = true;
        Store.data = Object.assign(
            JSON.parse(JSON.stringify(Store.defaultData)),
            payload.data
        );
        Store.save();
        this.lastCloudTimestamp = payload.timestamp || 0;
        this.isPulling = false;

        // 更新 UI
        UI.updateTopbar();
        App.render();

        this.blobId = code;
        this.enabled = true;
        this.hasUnsyncedChanges = false;
        this.saveSettings();
        this.updateUrlHash();
        this.startPolling();
        this.updateStatus('synced');

        return true;
    },

    // ===== 推送本地数据到云端 =====
    async push() {
        if (!this.enabled || !this.blobId || this.isPushing || this.isPulling) return;

        this.isPushing = true;
        this.updateStatus('syncing');

        try {
            const payload = {
                data: Store.data,
                timestamp: Date.now(),
                device: this.getDeviceId()
            };

            const res = await fetch(this.API_BASE + '/' + this.blobId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                this.lastCloudTimestamp = payload.timestamp;
                this.hasUnsyncedChanges = false;
                this.saveSettings();
                this.updateStatus('synced');
                this.lastError = null;
            } else {
                throw new Error('推送失败 (HTTP ' + res.status + ')');
            }
        } catch (e) {
            console.error('CloudSync push error:', e);
            this.lastError = e.message;
            this.updateStatus('error');
        }

        this.isPushing = false;
    },

    // ===== 从云端拉取数据 =====
    async pull(force) {
        if (!this.enabled || !this.blobId || this.isPulling) return;

        // 如果有未同步的本地更改，先推送而不是拉取
        if (this.hasUnsyncedChanges && !force) {
            this.push();
            return;
        }

        this.isPulling = true;

        try {
            const res = await fetch(this.API_BASE + '/' + this.blobId, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                const payload = await res.json();
                if (payload && payload.data) {
                    const cloudTime = payload.timestamp || 0;
                    if (force || cloudTime > this.lastCloudTimestamp) {
                        // 云端数据更新，更新本地
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
                    }
                }
            } else if (res.status === 404) {
                this.lastError = '云端数据不存在';
                this.updateStatus('error');
            }
        } catch (e) {
            console.error('CloudSync pull error:', e);
            this.lastError = e.message;
            this.updateStatus('error');
        }

        this.isPulling = false;
    },

    // ===== 本地数据变化时触发 =====
    onLocalChange() {
        if (this.isPulling) return;
        this.hasUnsyncedChanges = true;
        // 防抖：1秒后推送
        clearTimeout(this.pushTimer);
        this.pushTimer = setTimeout(() => this.push(), 1000);
    },

    // ===== 开始轮询 =====
    startPolling() {
        if (this.pollTimer) clearInterval(this.pollTimer);
        // 每5秒拉取一次
        this.pollTimer = setInterval(() => this.pull(), 5000);
        this.updateStatus('synced');
    },

    // ===== 停止轮询 =====
    stopPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
        this.updateStatus('disabled');
    },

    // ===== 关闭同步 =====
    disable() {
        this.enabled = false;
        this.stopPolling();
        clearTimeout(this.pushTimer);
        this.saveSettings();
        this.clearUrlHash();
    },

    // ===== 保存设置 =====
    saveSettings() {
        localStorage.setItem('mcCloudSync', JSON.stringify({
            blobId: this.blobId,
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
        if (this.blobId) {
            history.replaceState(null, '', '#sync=' + this.blobId);
        }
    },

    clearUrlHash() {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    },

    // ===== 获取分享链接 =====
    getShareLink() {
        if (!this.blobId) return null;
        const base = window.location.origin + window.location.pathname;
        return base + '#sync=' + this.blobId;
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

    // ===== 格式化同步码（方便显示） =====
    formatCode(code) {
        if (!code) return '';
        return code;
    }
};
