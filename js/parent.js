/**
 * 家长模式模块
 * - 家长PIN验证
 * - 打卡审核（照片/视频）
 * - 任务管理（增删改）
 * - 学习报告
 * - 奖励管理
 */
const Parent = {
    // ===== 进入/退出家长模式 =====
    toggle() {
        if (App.isParentMode) {
            // 退出家长模式
            App.isParentMode = false;
            document.body.classList.remove('parent-mode');
            document.getElementById('parentToggleText').textContent = '家长模式';
            App.navigate('home');
            UI.toast('已退出家长模式', 'info');
        } else {
            // 进入家长模式 - 需要PIN
            this.showPinInput();
        }
    },

    showPinInput() {
        const pin = Store.data.parentPin || '1234';
        UI.modal('🔐 家长验证', `
            <div style="text-align:center;padding:20px 0;">
                <div style="font-size:48px;margin-bottom:12px;">🔐</div>
                <p style="font-size:14px;color:#666;margin-bottom:16px;">请输入家长密码进入家长模式</p>
                <input type="password" id="parentPinInput" maxlength="6" placeholder="输入密码"
                    style="width:160px;height:50px;text-align:center;font-size:24px;border:3px solid #E0E0E0;border-radius:12px;outline:none;letter-spacing:8px;"
                    onkeyup="if(event.key==='Enter') Parent.verifyPin()">
                <p style="font-size:12px;color:#999;margin-top:12px;">默认密码：1234（可在家长模式中修改）</p>
            </div>
        `, `<button class="lego-btn lego-btn-green" onclick="Parent.verifyPin()">✅ 确认</button>
           <button class="lego-btn" onclick="UI.closeModal()">取消</button>`);
        setTimeout(() => {
            const input = document.getElementById('parentPinInput');
            if (input) input.focus();
        }, 200);
    },

    verifyPin() {
        const input = document.getElementById('parentPinInput');
        if (!input) return;
        const entered = input.value.trim();
        const correct = Store.data.parentPin || '1234';

        if (entered === correct) {
            App.isParentMode = true;
            document.body.classList.add('parent-mode');
            document.getElementById('parentToggleText').textContent = '退出家长';
            UI.closeModal();
            UI.toast('✅ 已进入家长模式', 'success');
            App.navigate('parent-review');
            this.updateReviewBadge();
        } else {
            UI.toast('❌ 密码错误', 'error');
            input.value = '';
            input.focus();
        }
    },

    // ===== 更新审核徽章 =====
    updateReviewBadge() {
        const badge = document.getElementById('reviewBadge');
        if (!badge) return;
        const pending = (Store.data.pendingReviews || []).filter(r => r.status === 'pending').length;
        if (pending > 0) {
            badge.textContent = pending;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    },

    // ===== 打卡审核页面 =====
    review() {
        const reviews = Store.data.pendingReviews || [];
        const pending = reviews.filter(r => r.status === 'pending');
        const reviewed = reviews.filter(r => r.status !== 'pending').slice(0, 20);

        let pendingHtml = '';
        if (pending.length === 0) {
            pendingHtml = '<div class="empty-state"><div class="empty-icon">✅</div><div class="empty-text">暂无待审核的打卡</div></div>';
        } else {
            pendingHtml = pending.map(r => this.renderReviewCard(r)).join('');
        }

        let reviewedHtml = '';
        if (reviewed.length > 0) {
            reviewedHtml = `
                <div class="lego-divider"></div>
                <h3 style="font-size:16px;font-weight:700;color:#2C2C2C;margin-bottom:12px;">📜 近期已审核 (${reviewed.length})</h3>
                ${reviewed.map(r => this.renderReviewCard(r)).join('')}
            `;
        }

        return `
            <div class="fade-in">
                <h1 class="page-title">🔍 打卡审核</h1>
                <p class="page-subtitle">审核孩子的任务打卡 · 通过后自动发放积木币</p>

                <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px;">
                    <div class="lego-panel stat-card" style="cursor:default;">
                        <div class="stat-icon-lg bg-orange">⏳</div>
                        <div class="stat-info"><h3>${pending.length}</h3><p>待审核</p></div>
                    </div>
                    <div class="lego-panel stat-card" style="cursor:default;">
                        <div class="stat-icon-lg bg-green">✅</div>
                        <div class="stat-info"><h3>${reviews.filter(r=>r.status==='approved').length}</h3><p>已通过</p></div>
                    </div>
                    <div class="lego-panel stat-card" style="cursor:default;">
                        <div class="stat-icon-lg bg-red">❌</div>
                        <div class="stat-info"><h3>${reviews.filter(r=>r.status==='rejected').length}</h3><p>已拒绝</p></div>
                    </div>
                </div>

                <h3 style="font-size:16px;font-weight:700;color:#2C2C2C;margin-bottom:12px;">⏳ 待审核 (${pending.length})</h3>
                ${pendingHtml}
                ${reviewedHtml}
            </div>
        `;
    },

    renderReviewCard(r) {
        const date = new Date(r.date);
        const timeStr = `${date.getMonth()+1}月${date.getDate()}日 ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
        const statusTag = r.status === 'pending' ? '<span class="task-status-tag pending">待审核</span>' :
                          r.status === 'approved' ? '<span class="task-status-tag approved">已通过</span>' :
                          '<span class="task-status-tag rejected">已拒绝</span>';

        let mediaHtml = '';
        if (r.mediaType === 'photo' && r.mediaData) {
            mediaHtml = `<img src="${r.mediaData}" class="review-media" alt="打卡照片">`;
        } else if (r.mediaType === 'video' && r.mediaData) {
            mediaHtml = `<video src="${r.mediaData}" class="review-media" controls></video>`;
        } else if (r.mediaType === 'none') {
            mediaHtml = '<div style="text-align:center;padding:20px;color:#999;background:#F5F5F5;border-radius:12px;">📝 无照片/视频（文字打卡）</div>';
        }

        let actionsHtml = '';
        if (r.status === 'pending') {
            actionsHtml = `
                <div class="review-actions">
                    <button class="lego-btn lego-btn-red" style="font-size:13px;padding:8px 16px;" onclick="Parent.rejectReview('${r.id}')">❌ 拒绝</button>
                    <button class="lego-btn lego-btn-green" style="font-size:13px;padding:8px 16px;" onclick="Parent.approveReview('${r.id}')">✅ 通过 +${r.points}💎</button>
                </div>
            `;
        } else if (r.reviewNote) {
            actionsHtml = `<div class="review-reason">💬 ${r.reviewNote}</div>`;
        }

        return `
            <div class="review-card ${r.status}">
                <div class="review-header">
                    <span class="review-icon">${r.icon || '📋'}</span>
                    <span class="review-title">${r.taskName}</span>
                    ${statusTag}
                    <span class="review-time">${timeStr}</span>
                </div>
                <div class="review-body">
                    ${mediaHtml}
                    ${r.note ? `<div class="review-reason">📝 孩子备注：${r.note}</div>` : ''}
                    <div style="font-size:13px;color:#888;margin-top:8px;">
                        类型：${r.taskType} · 奖励：${r.points} 💎
                    </div>
                </div>
                ${actionsHtml}
            </div>
        `;
    },

    approveReview(id) {
        const reviews = Store.data.pendingReviews || [];
        const review = reviews.find(r => r.id === id);
        if (!review || review.status !== 'pending') return;

        review.status = 'approved';
        review.reviewDate = new Date().toISOString();
        review.reviewNote = '审核通过，做得好！';

        // 发放积分
        Store.addPoints(review.points, '审核通过：' + review.taskName);
        Store.addPetExp(5);
        Store.save();

        // 标记任务完成
        if (review.taskType === 'plan') {
            const today = Store.todayKey();
            if (!Store.data.planProgress[today]) Store.data.planProgress[today] = [];
            if (!Store.data.planProgress[today].includes(review.taskIndex)) {
                Store.data.planProgress[today].push(review.taskIndex);
            }
            Store.save();
        } else if (review.taskType === 'labor') {
            Store.data.laborRecords.push({
                date: review.date,
                taskName: review.taskName,
                points: review.points
            });
            Store.save();
        } else if (review.taskType === 'sports') {
            Store.data.sportsRecords.push({
                date: review.date,
                activity: review.taskName,
                count: review.target || 0,
                points: review.points
            });
            Store.save();
        }

        Store.checkBadges();
        Store.save();

        UI.toast('✅ 审核通过！孩子获得 ' + review.points + ' 💎', 'success');
        UI.fireworks();
        App.render();
        this.updateReviewBadge();
        UI.updateTopbar();
    },

    rejectReview(id) {
        const reviews = Store.data.pendingReviews || [];
        const review = reviews.find(r => r.id === id);
        if (!review || review.status !== 'pending') return;

        UI.modal('❌ 拒绝打卡', `
            <p style="font-size:14px;color:#666;margin-bottom:12px;">请输入拒绝原因（孩子会看到）：</p>
            <textarea id="rejectReason" placeholder="例如：照片不够清晰，请重新拍照打卡"
                style="width:100%;height:80px;padding:10px;border:2px solid #E0E0E0;border-radius:8px;font-size:14px;resize:none;outline:none;"></textarea>
        `, `<button class="lego-btn lego-btn-red" onclick="Parent.confirmReject('${id}')">确认拒绝</button>
           <button class="lego-btn" onclick="UI.closeModal()">取消</button>`);
    },

    confirmReject(id) {
        const reason = document.getElementById('rejectReason').value.trim() || '请重新完成并打卡';
        const reviews = Store.data.pendingReviews || [];
        const review = reviews.find(r => r.id === id);
        if (!review) return;

        review.status = 'rejected';
        review.reviewDate = new Date().toISOString();
        review.reviewNote = reason;
        Store.save();

        UI.closeModal();
        UI.toast('已拒绝打卡', 'info');
        App.render();
        this.updateReviewBadge();
    },

    // ===== 任务管理页面 =====
    tasks() {
        const customTasks = Store.data.customTasks || {};
        const hiddenPreset = Store.data.hiddenPreset || {plan:[], labor:[], sports:[], rewards:[]};
        const planTasks = Utils.isWeekend() ? PLAN_TEMPLATES.weekend : PLAN_TEMPLATES.weekday;
        const customPlan = customTasks.plan || [];
        const allPlanTasks = [...planTasks, ...customPlan];

        const laborTasks = [...COURSE_DATA.labor.tasks, ...(customTasks.labor || [])];
        const sportTasks = [...COURSE_DATA.sports.activities, ...(customTasks.sports || [])];
        const rewardItems = [...COURSE_DATA.rewards, ...(customTasks.rewards || [])];

        return `
            <div class="fade-in">
                <h1 class="page-title">📝 任务管理</h1>
                <p class="page-subtitle">添加、修改、删除孩子的学习任务和奖励</p>

                <!-- 每日任务管理 -->
                <div class="lego-panel" style="margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <h3 style="font-size:16px;font-weight:700;color:#2C2C2C;">📋 每日任务 (${allPlanTasks.length})</h3>
                        <button class="lego-btn lego-btn-blue" style="font-size:12px;padding:6px 14px;" onclick="Parent.showAddTaskForm('plan')">➕ 添加任务</button>
                    </div>
                    ${allPlanTasks.map((t, i) => {
                        const isCustom = i >= planTasks.length;
                        const customIdx = i - planTasks.length;
                        const isHidden = !isCustom && hiddenPreset.plan && hiddenPreset.plan.includes(t.name);
                        return `
                            <div class="edit-task-item" ${isHidden ? 'style="opacity:0.5;"' : ''}>
                                <span style="font-size:20px;">${t.icon}</span>
                                <div class="edit-task-info">
                                    <div class="edit-task-name">${t.name} ${isHidden ? '🚫' : ''}</div>
                                    <div class="edit-task-meta">${t.time} · ${t.desc} · +${t.points}💎 ${isCustom ? '· ⭐自定义' : ''}</div>
                                </div>
                                <div style="display:flex;gap:6px;">
                                    ${isCustom
                                        ? `<button class="edit-btn edit" onclick="Parent.showEditTaskForm('plan',${customIdx})">✏️ 编辑</button>
                                           <button class="edit-btn delete" onclick="Parent.deleteTask('plan', ${customIdx})">🗑 删除</button>`
                                        : `<button class="edit-btn ${isHidden ? '' : 'edit'}" onclick="Parent.togglePresetTask('plan','${t.name.replace(/'/g,"\\'")}')">${isHidden ? '👁 显示' : '🚫 隐藏'}</button>`
                                    }
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- 劳动任务管理 -->
                <div class="lego-panel" style="margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <h3 style="font-size:16px;font-weight:700;color:#2C2C2C;">🧹 劳动任务 (${laborTasks.length})</h3>
                        <button class="lego-btn lego-btn-green" style="font-size:12px;padding:6px 14px;" onclick="Parent.showAddTaskForm('labor')">➕ 添加任务</button>
                    </div>
                    ${laborTasks.map((t, i) => {
                        const isCustom = i >= COURSE_DATA.labor.tasks.length;
                        const customIdx = i - COURSE_DATA.labor.tasks.length;
                        const isHidden = !isCustom && hiddenPreset.labor && hiddenPreset.labor.includes(t.name);
                        return `
                            <div class="edit-task-item" ${isHidden ? 'style="opacity:0.5;"' : ''}>
                                <span style="font-size:20px;">${t.icon}</span>
                                <div class="edit-task-info">
                                    <div class="edit-task-name">${t.name} ${isHidden ? '🚫' : ''}</div>
                                    <div class="edit-task-meta">${t.desc} · ${t.frequency} · +${t.points}💎 ${isCustom ? '· ⭐自定义' : ''}</div>
                                </div>
                                <div style="display:flex;gap:6px;">
                                    ${isCustom
                                        ? `<button class="edit-btn edit" onclick="Parent.showEditTaskForm('labor',${customIdx})">✏️ 编辑</button>
                                           <button class="edit-btn delete" onclick="Parent.deleteTask('labor', ${customIdx})">🗑 删除</button>`
                                        : `<button class="edit-btn ${isHidden ? '' : 'edit'}" onclick="Parent.togglePresetTask('labor','${t.name.replace(/'/g,"\\'")}')">${isHidden ? '👁 显示' : '🚫 隐藏'}</button>`
                                    }
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- 运动任务管理 -->
                <div class="lego-panel" style="margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <h3 style="font-size:16px;font-weight:700;color:#2C2C2C;">⚽ 运动项目 (${sportTasks.length})</h3>
                        <button class="lego-btn lego-btn-orange" style="font-size:12px;padding:6px 14px;" onclick="Parent.showAddTaskForm('sports')">➕ 添加项目</button>
                    </div>
                    ${sportTasks.map((t, i) => {
                        const isCustom = i >= COURSE_DATA.sports.activities.length;
                        const customIdx = i - COURSE_DATA.sports.activities.length;
                        const isHidden = !isCustom && hiddenPreset.sports && hiddenPreset.sports.includes(t.name);
                        return `
                            <div class="edit-task-item" ${isHidden ? 'style="opacity:0.5;"' : ''}>
                                <span style="font-size:20px;">${t.icon}</span>
                                <div class="edit-task-info">
                                    <div class="edit-task-name">${t.name} ${isHidden ? '🚫' : ''}</div>
                                    <div class="edit-task-meta">目标：${t.target}${t.unit} · +${t.points}💎 ${isCustom ? '· ⭐自定义' : ''}</div>
                                </div>
                                <div style="display:flex;gap:6px;">
                                    ${isCustom
                                        ? `<button class="edit-btn edit" onclick="Parent.showEditTaskForm('sports',${customIdx})">✏️ 编辑</button>
                                           <button class="edit-btn delete" onclick="Parent.deleteTask('sports', ${customIdx})">🗑 删除</button>`
                                        : `<button class="edit-btn ${isHidden ? '' : 'edit'}" onclick="Parent.togglePresetTask('sports','${t.name.replace(/'/g,"\\'")}')">${isHidden ? '👁 显示' : '🚫 隐藏'}</button>`
                                    }
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- 奖励管理 -->
                <div class="lego-panel" style="margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <h3 style="font-size:16px;font-weight:700;color:#2C2C2C;">🎁 奖励管理 (${rewardItems.length})</h3>
                        <button class="lego-btn lego-btn-yellow" style="font-size:12px;padding:6px 14px;" onclick="Parent.showAddTaskForm('rewards')">➕ 添加奖励</button>
                    </div>
                    ${rewardItems.map((r, i) => {
                        const isCustom = i >= COURSE_DATA.rewards.length;
                        const customIdx = i - COURSE_DATA.rewards.length;
                        const isHidden = !isCustom && hiddenPreset.rewards && hiddenPreset.rewards.includes(r.id);
                        return `
                            <div class="edit-task-item" ${isHidden ? 'style="opacity:0.5;"' : ''}>
                                <span style="font-size:20px;">${r.icon}</span>
                                <div class="edit-task-info">
                                    <div class="edit-task-name">${r.name} ${isHidden ? '🚫' : ''}</div>
                                    <div class="edit-task-meta">${r.desc} · ${r.cost}💎 ${isCustom ? '· ⭐自定义' : ''}</div>
                                </div>
                                <div style="display:flex;gap:6px;">
                                    ${isCustom
                                        ? `<button class="edit-btn edit" onclick="Parent.showEditTaskForm('rewards',${customIdx})">✏️ 编辑</button>
                                           <button class="edit-btn delete" onclick="Parent.deleteTask('rewards', ${customIdx})">🗑 删除</button>`
                                        : `<button class="edit-btn ${isHidden ? '' : 'edit'}" onclick="Parent.togglePresetTask('rewards','${r.id}')">${isHidden ? '👁 显示' : '🚫 隐藏'}</button>`
                                    }
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- 修改密码 -->
                <div class="lego-panel">
                    <h3 style="font-size:16px;font-weight:700;color:#2C2C2C;margin-bottom:12px;">🔐 家长密码</h3>
                    <p style="font-size:13px;color:#888;margin-bottom:10px;">当前密码：${Store.data.parentPin || '1234'}</p>
                    <button class="lego-btn lego-btn-purple" onclick="Parent.showChangePin()">修改密码</button>
                </div>
            </div>
        `;
    },

    showAddTaskForm(type) {
        let formHtml = '';

        if (type === 'plan') {
            formHtml = `
                <div class="task-edit-form">
                    <div>
                        <label>任务名称</label>
                        <input type="text" id="newTaskName" placeholder="如：练字15分钟">
                    </div>
                    <div class="task-edit-row">
                        <div>
                            <label>时间</label>
                            <input type="text" id="newTaskTime" placeholder="如：18:00-18:15">
                        </div>
                        <div>
                            <label>积木币奖励</label>
                            <input type="number" id="newTaskPoints" value="5" min="1" max="100">
                        </div>
                    </div>
                    <div>
                        <label>描述</label>
                        <input type="text" id="newTaskDesc" placeholder="任务说明">
                    </div>
                    <div>
                        <label>图标（输入emoji）</label>
                        <input type="text" id="newTaskIcon" value="📝" maxlength="2">
                    </div>
                </div>
            `;
        } else if (type === 'labor') {
            formHtml = `
                <div class="task-edit-form">
                    <div>
                        <label>任务名称</label>
                        <input type="text" id="newTaskName" placeholder="如：整理书架">
                    </div>
                    <div>
                        <label>描述</label>
                        <input type="text" id="newTaskDesc" placeholder="任务说明">
                    </div>
                    <div class="task-edit-row">
                        <div>
                            <label>积木币奖励</label>
                            <input type="number" id="newTaskPoints" value="5" min="1" max="100">
                        </div>
                        <div>
                            <label>频率</label>
                            <select id="newTaskFreq">
                                <option value="每日">每日</option>
                                <option value="每周">每周</option>
                                <option value="偶尔">偶尔</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>图标（输入emoji）</label>
                        <input type="text" id="newTaskIcon" value="🧹" maxlength="2">
                    </div>
                </div>
            `;
        } else if (type === 'sports') {
            formHtml = `
                <div class="task-edit-form">
                    <div>
                        <label>运动名称</label>
                        <input type="text" id="newTaskName" placeholder="如：跳高">
                    </div>
                    <div>
                        <label>描述</label>
                        <input type="text" id="newTaskDesc" placeholder="运动说明">
                    </div>
                    <div class="task-edit-row">
                        <div>
                            <label>目标数量</label>
                            <input type="number" id="newTaskTarget" value="20" min="1">
                        </div>
                        <div>
                            <label>单位</label>
                            <input type="text" id="newTaskUnit" value="个" maxlength="4">
                        </div>
                        <div>
                            <label>积木币奖励</label>
                            <input type="number" id="newTaskPoints" value="8" min="1" max="100">
                        </div>
                    </div>
                    <div>
                        <label>图标（输入emoji）</label>
                        <input type="text" id="newTaskIcon" value="⚽" maxlength="2">
                    </div>
                </div>
            `;
        } else if (type === 'rewards') {
            formHtml = `
                <div class="task-edit-form">
                    <div>
                        <label>奖励名称</label>
                        <input type="text" id="newTaskName" placeholder="如：周末睡懒觉">
                    </div>
                    <div>
                        <label>描述</label>
                        <input type="text" id="newTaskDesc" placeholder="奖励说明">
                    </div>
                    <div class="task-edit-row">
                        <div>
                            <label>消耗积木币</label>
                            <input type="number" id="newTaskPoints" value="30" min="1" max="9999">
                        </div>
                        <div>
                            <label>分类</label>
                            <select id="newTaskCategory">
                                <option value="娱乐">娱乐</option>
                                <option value="美食">美食</option>
                                <option value="出行">出行</option>
                                <option value="学习">学习</option>
                                <option value="购物">购物</option>
                                <option value="特权">特权</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>图标（输入emoji）</label>
                        <input type="text" id="newTaskIcon" value="🎁" maxlength="2">
                    </div>
                </div>
            `;
        }

        const titles = {
            plan: '➕ 添加每日任务',
            labor: '➕ 添加劳动任务',
            sports: '➕ 添加运动项目',
            rewards: '➕ 添加奖励'
        };

        UI.modal(titles[type], formHtml,
            `<button class="lego-btn lego-btn-green" onclick="Parent.saveNewTask('${type}')">✅ 保存</button>
             <button class="lego-btn" onclick="UI.closeModal()">取消</button>`);
    },

    saveNewTask(type) {
        const name = document.getElementById('newTaskName').value.trim();
        if (!name) { UI.toast('请输入名称', 'warning'); return; }
        const desc = document.getElementById('newTaskDesc').value.trim() || '';
        const points = parseInt(document.getElementById('newTaskPoints').value) || 5;
        const icon = document.getElementById('newTaskIcon').value.trim() || '📝';

        if (!Store.data.customTasks) Store.data.customTasks = {};
        if (!Store.data.customTasks[type]) Store.data.customTasks[type] = [];

        if (type === 'plan') {
            const time = document.getElementById('newTaskTime').value.trim() || '自由安排';
            Store.data.customTasks.plan.push({ time, name, type: 'custom', desc, icon, points });
        } else if (type === 'labor') {
            const freq = document.getElementById('newTaskFreq').value;
            Store.data.customTasks.labor.push({ name, desc, icon, points, frequency: freq });
        } else if (type === 'sports') {
            const target = parseInt(document.getElementById('newTaskTarget').value) || 10;
            const unit = document.getElementById('newTaskUnit').value.trim() || '个';
            Store.data.customTasks.sports.push({ name, desc, icon, points, target, unit });
        } else if (type === 'rewards') {
            const category = document.getElementById('newTaskCategory').value;
            const id = 'custom_' + Date.now();
            Store.data.customTasks.rewards.push({ id, name, desc, icon, cost: points, category });
        }

        Store.save();
        UI.closeModal();
        UI.toast('✅ 添加成功！', 'success');
        App.render();
    },

    deleteTask(type, index) {
        UI.confirm('确定要删除这个自定义任务吗？', () => {
            if (Store.data.customTasks && Store.data.customTasks[type] && Store.data.customTasks[type][index]) {
                Store.data.customTasks[type].splice(index, 1);
                Store.save();
                UI.toast('已删除', 'info');
                App.render();
            }
        });
    },

    // ===== 编辑自定义任务 =====
    showEditTaskForm(type, index) {
        const task = Store.data.customTasks[type][index];
        if (!task) { UI.toast('任务不存在', 'error'); return; }

        let formHtml = '';

        if (type === 'plan') {
            formHtml = `
                <div class="task-edit-form">
                    <div>
                        <label>任务名称</label>
                        <input type="text" id="editTaskName" value="${this._esc(task.name)}">
                    </div>
                    <div class="task-edit-row">
                        <div>
                            <label>时间</label>
                            <input type="text" id="editTaskTime" value="${this._esc(task.time || '')}">
                        </div>
                        <div>
                            <label>积木币奖励</label>
                            <input type="number" id="editTaskPoints" value="${task.points}" min="1" max="100">
                        </div>
                    </div>
                    <div>
                        <label>描述</label>
                        <input type="text" id="editTaskDesc" value="${this._esc(task.desc || '')}">
                    </div>
                    <div>
                        <label>图标（输入emoji）</label>
                        <input type="text" id="editTaskIcon" value="${task.icon || '📝'}" maxlength="2">
                    </div>
                </div>
            `;
        } else if (type === 'labor') {
            formHtml = `
                <div class="task-edit-form">
                    <div>
                        <label>任务名称</label>
                        <input type="text" id="editTaskName" value="${this._esc(task.name)}">
                    </div>
                    <div>
                        <label>描述</label>
                        <input type="text" id="editTaskDesc" value="${this._esc(task.desc || '')}">
                    </div>
                    <div class="task-edit-row">
                        <div>
                            <label>积木币奖励</label>
                            <input type="number" id="editTaskPoints" value="${task.points}" min="1" max="100">
                        </div>
                        <div>
                            <label>频率</label>
                            <select id="editTaskFreq">
                                <option value="每日" ${task.frequency==='每日'?'selected':''}>每日</option>
                                <option value="每周" ${task.frequency==='每周'?'selected':''}>每周</option>
                                <option value="偶尔" ${task.frequency==='偶尔'?'selected':''}>偶尔</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>图标（输入emoji）</label>
                        <input type="text" id="editTaskIcon" value="${task.icon || '🧹'}" maxlength="2">
                    </div>
                </div>
            `;
        } else if (type === 'sports') {
            formHtml = `
                <div class="task-edit-form">
                    <div>
                        <label>运动名称</label>
                        <input type="text" id="editTaskName" value="${this._esc(task.name)}">
                    </div>
                    <div>
                        <label>描述</label>
                        <input type="text" id="editTaskDesc" value="${this._esc(task.desc || '')}">
                    </div>
                    <div class="task-edit-row">
                        <div>
                            <label>目标数量</label>
                            <input type="number" id="editTaskTarget" value="${task.target || 10}" min="1">
                        </div>
                        <div>
                            <label>单位</label>
                            <input type="text" id="editTaskUnit" value="${this._esc(task.unit || '个')}" maxlength="4">
                        </div>
                        <div>
                            <label>积木币奖励</label>
                            <input type="number" id="editTaskPoints" value="${task.points}" min="1" max="100">
                        </div>
                    </div>
                    <div>
                        <label>图标（输入emoji）</label>
                        <input type="text" id="editTaskIcon" value="${task.icon || '⚽'}" maxlength="2">
                    </div>
                </div>
            `;
        } else if (type === 'rewards') {
            formHtml = `
                <div class="task-edit-form">
                    <div>
                        <label>奖励名称</label>
                        <input type="text" id="editTaskName" value="${this._esc(task.name)}">
                    </div>
                    <div>
                        <label>描述</label>
                        <input type="text" id="editTaskDesc" value="${this._esc(task.desc || '')}">
                    </div>
                    <div class="task-edit-row">
                        <div>
                            <label>消耗积木币</label>
                            <input type="number" id="editTaskPoints" value="${task.cost || task.points || 30}" min="1" max="9999">
                        </div>
                        <div>
                            <label>分类</label>
                            <select id="editTaskCategory">
                                <option value="娱乐" ${task.category==='娱乐'?'selected':''}>娱乐</option>
                                <option value="美食" ${task.category==='美食'?'selected':''}>美食</option>
                                <option value="出行" ${task.category==='出行'?'selected':''}>出行</option>
                                <option value="学习" ${task.category==='学习'?'selected':''}>学习</option>
                                <option value="购物" ${task.category==='购物'?'selected':''}>购物</option>
                                <option value="特权" ${task.category==='特权'?'selected':''}>特权</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>图标（输入emoji）</label>
                        <input type="text" id="editTaskIcon" value="${task.icon || '🎁'}" maxlength="2">
                    </div>
                </div>
            `;
        }

        const titles = {
            plan: '✏️ 修改每日任务',
            labor: '✏️ 修改劳动任务',
            sports: '✏️ 修改运动项目',
            rewards: '✏️ 修改奖励'
        };

        UI.modal(titles[type], formHtml,
            `<button class="lego-btn lego-btn-green" onclick="Parent.saveEditTask('${type}',${index})">✅ 保存修改</button>
             <button class="lego-btn" onclick="UI.closeModal()">取消</button>`);
    },

    _esc(str) {
        if (!str) return '';
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    },

    saveEditTask(type, index) {
        const name = document.getElementById('editTaskName').value.trim();
        if (!name) { UI.toast('请输入名称', 'warning'); return; }
        const desc = document.getElementById('editTaskDesc').value.trim() || '';
        const points = parseInt(document.getElementById('editTaskPoints').value) || 5;
        const icon = document.getElementById('editTaskIcon').value.trim() || '📝';

        const task = Store.data.customTasks[type][index];
        if (!task) { UI.toast('任务不存在', 'error'); return; }

        if (type === 'plan') {
            const time = document.getElementById('editTaskTime').value.trim() || '自由安排';
            task.name = name; task.desc = desc; task.points = points;
            task.icon = icon; task.time = time;
        } else if (type === 'labor') {
            const freq = document.getElementById('editTaskFreq').value;
            task.name = name; task.desc = desc; task.points = points;
            task.icon = icon; task.frequency = freq;
        } else if (type === 'sports') {
            const target = parseInt(document.getElementById('editTaskTarget').value) || 10;
            const unit = document.getElementById('editTaskUnit').value.trim() || '个';
            task.name = name; task.desc = desc; task.points = points;
            task.icon = icon; task.target = target; task.unit = unit;
        } else if (type === 'rewards') {
            const category = document.getElementById('editTaskCategory').value;
            task.name = name; task.desc = desc; task.icon = icon;
            task.cost = points; task.category = category;
        }

        Store.save();
        UI.closeModal();
        UI.toast('✅ 修改成功！', 'success');
        App.render();
    },

    // ===== 隐藏/显示预设任务 =====
    togglePresetTask(type, identifier) {
        if (!Store.data.hiddenPreset) Store.data.hiddenPreset = {plan:[], labor:[], sports:[], rewards:[]};
        if (!Store.data.hiddenPreset[type]) Store.data.hiddenPreset[type] = [];

        const arr = Store.data.hiddenPreset[type];
        const idx = arr.indexOf(identifier);
        if (idx >= 0) {
            arr.splice(idx, 1);
            UI.toast('已显示该任务', 'info');
        } else {
            arr.push(identifier);
            UI.toast('已隐藏该任务', 'info');
        }
        Store.save();
        App.render();
    },

    showChangePin() {
        UI.modal('🔐 修改家长密码', `
            <div class="task-edit-form">
                <div>
                    <label>新密码（4-6位数字）</label>
                    <input type="password" id="newPin" maxlength="6" placeholder="输入新密码"
                        style="text-align:center;letter-spacing:4px;font-size:20px;">
                </div>
                <div>
                    <label>确认密码</label>
                    <input type="password" id="confirmPin" maxlength="6" placeholder="再次输入"
                        style="text-align:center;letter-spacing:4px;font-size:20px;">
                </div>
            </div>
        `, `<button class="lego-btn lego-btn-purple" onclick="Parent.saveNewPin()">保存</button>
           <button class="lego-btn" onclick="UI.closeModal()">取消</button>`);
    },

    saveNewPin() {
        const newPin = document.getElementById('newPin').value.trim();
        const confirmPin = document.getElementById('confirmPin').value.trim();
        if (!/^\d{4,6}$/.test(newPin)) { UI.toast('密码必须是4-6位数字', 'warning'); return; }
        if (newPin !== confirmPin) { UI.toast('两次输入不一致', 'error'); return; }
        Store.data.parentPin = newPin;
        Store.save();
        UI.closeModal();
        UI.toast('✅ 密码已修改', 'success');
    },

    // ===== 学习报告 =====
    stats() {
        const d = Store.data;
        const totalTasks = Object.values(d.planProgress).reduce((s, arr) => s + (arr ? arr.length : 0), 0);
        const laborTotal = d.laborRecords.length;
        const sportsTotal = d.sportsRecords.length;
        const mathAccuracy = d.mathProgress.total > 0 ? Math.round(d.mathProgress.correct / d.mathProgress.total * 100) : 0;
        const reviewStats = {
            pending: (d.pendingReviews || []).filter(r => r.status === 'pending').length,
            approved: (d.pendingReviews || []).filter(r => r.status === 'approved').length,
            rejected: (d.pendingReviews || []).filter(r => r.status === 'rejected').length,
        };

        // 近7天任务完成趋势
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 86400000);
            const key = date.toISOString().split('T')[0];
            const done = (d.planProgress[key] || []).length;
            last7Days.push({ date: `${date.getMonth()+1}/${date.getDate()}`, done });
        }

        const maxDone = Math.max(...last7Days.map(x => x.done), 1);

        return `
            <div class="fade-in">
                <h1 class="page-title">📊 学习报告</h1>
                <p class="page-subtitle">孩子的学习数据总览</p>

                <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px;">
                    <div class="lego-panel stat-card" style="cursor:default;">
                        <div class="stat-icon-lg bg-blue">📋</div>
                        <div class="stat-info"><h3>${totalTasks}</h3><p>完成任务</p></div>
                    </div>
                    <div class="lego-panel stat-card" style="cursor:default;">
                        <div class="stat-icon-lg bg-green">💎</div>
                        <div class="stat-info"><h3>${d.totalPoints}</h3><p>累计积木币</p></div>
                    </div>
                    <div class="lego-panel stat-card" style="cursor:default;">
                        <div class="stat-icon-lg bg-orange">🔥</div>
                        <div class="stat-info"><h3>${d.streak}</h3><p>连续天数</p></div>
                    </div>
                    <div class="lego-panel stat-card" style="cursor:default;">
                        <div class="stat-icon-lg bg-red">🏅</div>
                        <div class="stat-info"><h3>${d.badges.length}</h3><p>获得徽章</p></div>
                    </div>
                </div>

                <div class="grid grid-2" style="margin-bottom:16px;">
                    <div class="lego-panel">
                        <h3 style="font-size:16px;font-weight:700;color:#2C2C2C;margin-bottom:12px;">📈 近7天任务完成</h3>
                        <div style="display:flex;align-items:flex-end;gap:6px;height:120px;padding:0 4px;">
                            ${last7Days.map(day => `
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <span style="font-size:11px;font-weight:700;color:#0057B8;">${day.done}</span>
                                    <div style="width:100%;background:linear-gradient(to top, #0057B8, #1E77D0);border-radius:6px 6px 0 0;height:${day.done/maxDone*80}px;min-height:4px;transition:height 0.3s;"></div>
                                    <span style="font-size:10px;color:#888;">${day.date}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="lego-panel">
                        <h3 style="font-size:16px;font-weight:700;color:#2C2C2C;margin-bottom:12px;">📊 学习分布</h3>
                        <div style="display:flex;flex-direction:column;gap:10px;">
                            <div>
                                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
                                    <span>📖 课文完成</span>
                                    <span style="font-weight:700;">${Object.keys(d.lessonProgress).filter(k => d.lessonProgress[k] === 'done').length} 篇</span>
                                </div>
                                <div class="progress-bar"><div class="progress-fill blue" style="width:${Math.min(100, Object.keys(d.lessonProgress).length * 10)}%"></div></div>
                            </div>
                            <div>
                                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
                                    <span>📜 古诗背诵</span>
                                    <span style="font-weight:700;">${Object.keys(d.poemProgress).length} 首</span>
                                </div>
                                <div class="progress-bar"><div class="progress-fill yellow" style="width:${Object.keys(d.poemProgress).length / COURSE_DATA.chinese.poems.length * 100}%"></div></div>
                            </div>
                            <div>
                                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
                                    <span>🧮 口算正确率</span>
                                    <span style="font-weight:700;">${mathAccuracy}%</span>
                                </div>
                                <div class="progress-bar"><div class="progress-fill ${mathAccuracy>=80?'':'red'}" style="width:${mathAccuracy}%"></div></div>
                            </div>
                            <div>
                                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
                                    <span>🧹 劳动次数</span>
                                    <span style="font-weight:700;">${laborTotal} 次</span>
                                </div>
                                <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100, laborTotal * 5)}%"></div></div>
                            </div>
                            <div>
                                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
                                    <span>⚽ 运动次数</span>
                                    <span style="font-weight:700;">${sportsTotal} 次</span>
                                </div>
                                <div class="progress-bar"><div class="progress-fill orange" style="width:${Math.min(100, sportsTotal * 5)}%"></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lego-panel">
                    <h3 style="font-size:16px;font-weight:700;color:#2C2C2C;margin-bottom:12px;">🔍 打卡审核统计</h3>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
                        <div style="padding:16px;background:#FFF3E0;border-radius:12px;">
                            <div style="font-size:28px;font-weight:700;color:#FF6F00;">${reviewStats.pending}</div>
                            <div style="font-size:12px;color:#888;">待审核</div>
                        </div>
                        <div style="padding:16px;background:#E8F5E9;border-radius:12px;">
                            <div style="font-size:28px;font-weight:700;color:#00852B;">${reviewStats.approved}</div>
                            <div style="font-size:12px;color:#888;">已通过</div>
                        </div>
                        <div style="padding:16px;background:#FFEBEE;border-radius:12px;">
                            <div style="font-size:28px;font-weight:700;color:#CE1126;">${reviewStats.rejected}</div>
                            <div style="font-size:12px;color:#888;">已拒绝</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // ===== 奖励管理（简单版，复用任务管理中的奖励部分） =====
    rewards() {
        return this.tasks();
    }
};
