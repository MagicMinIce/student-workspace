/**
 * 学习积木世界 - 乐高积木风格小学生学习工作台
 * 主应用逻辑
 */

// ===== 状态管理 =====
const Store = {
    data: null,
    defaultData: {
        points: 0,
        totalPoints: 0,
        streak: 0,
        lastCheckin: null,
        checkinDates: [],
        completedTasks: {},
        planProgress: {},
        lessonProgress: {},
        poemProgress: {},
        vocabProgress: {},
        mathProgress: { correct: 0, total: 0, streak: 0 },
        laborRecords: [],
        sportsRecords: [],
        pointsHistory: [],
        rewardHistory: [],
        pet: { level: 1, exp: 0, mood: 100, lastFeed: null, lastPlay: null },
        gamesPlayed: 0,
        badges: [],
        modulesUsed: [],
        playerName: "",
        createdAt: null,
        pendingReviews: [],
        customTasks: {plan:[], labor:[], sports:[], rewards:[]},
        hiddenPreset: {plan:[], labor:[], sports:[], rewards:[]},
        parentPin: '1234',
        // 语文扩展
        currentLesson: null,
        dictationProgress: {},
        readingRecords: [],
        excerptRecords: [],
        writingRecords: [],
        mistakeBook: [],
        reviewProgress: {},
        punctuationProgress: {}
    },

    init() {
        this.load();
        if (!this.data.createdAt) {
            this.data.createdAt = new Date().toISOString();
            this.save();
        }
    },

    load() {
        const saved = localStorage.getItem('mcStudentWorkspace');
        if (saved) {
            try {
                this.data = { ...JSON.parse(JSON.stringify(this.defaultData)), ...JSON.parse(saved) };
            } catch (e) {
                this.data = JSON.parse(JSON.stringify(this.defaultData));
            }
        } else {
            this.data = JSON.parse(JSON.stringify(this.defaultData));
        }
    },

    save() {
        localStorage.setItem('mcStudentWorkspace', JSON.stringify(this.data));
        // 触发云端同步（如果已启用）
        if (typeof CloudSync !== 'undefined' && !CloudSync.isPulling) {
            CloudSync.onLocalChange();
        }
    },

    addPoints(amount, reason) {
        this.data.points += amount;
        if (amount > 0) this.data.totalPoints += amount;
        this.data.pointsHistory.unshift({
            date: new Date().toISOString(),
            amount, reason, type: amount > 0 ? 'plus' : 'minus'
        });
        if (this.data.pointsHistory.length > 200) {
            this.data.pointsHistory = this.data.pointsHistory.slice(0, 200);
        }
        this.save();
        UI.updateTopbar();
        this.checkBadges();
    },

    addPetExp(amount) {
        const pet = this.data.pet;
        pet.exp += amount;
        const evo = COURSE_DATA.petEvolution;
        let newLevel = 1;
        for (let i = evo.length - 1; i >= 0; i--) {
            if (pet.exp >= evo[i].minExp) { newLevel = evo[i].level; break; }
        }
        if (newLevel > pet.level) {
            pet.level = newLevel;
            const e = evo.find(e => e.level === newLevel);
            UI.toast('🎉 你的伙伴进化了！变成了 ' + e.name + '！', 'success');
            UI.fireworks();
        }
        // 心情恢复
        pet.mood = Math.min(100, pet.mood + amount * 2);
        this.save();
        UI.updateTopbar();
        this.checkBadges();
    },

    checkBadges() {
        const d = this.data;
        const newBadges = [];
        for (const badge of COURSE_DATA.badges) {
            if (d.badges.includes(badge.id)) continue;
            const c = badge.condition;
            let met = false;
            switch (c.type) {
                case 'checkin': met = d.checkinDates.length >= c.value; break;
                case 'streak': met = d.streak >= c.value; break;
                case 'tasks':
                    const total = Object.values(d.planProgress).reduce((s, arr) => s + (arr ? arr.length : 0), 0);
                    met = total >= c.value; break;
                case 'labor': met = d.laborRecords.length >= c.value; break;
                case 'sports': met = d.sportsRecords.length >= c.value; break;
                case 'totalPoints': met = d.totalPoints >= c.value; break;
                case 'poems': met = Object.keys(d.poemProgress).length >= c.value; break;
                case 'mathCorrect': met = d.mathProgress.correct >= c.value; break;
                case 'petLevel': met = d.pet.level >= c.value; break;
                case 'gamesPlayed': met = d.gamesPlayed >= c.value; break;
                case 'allModules':
                    const required = ['chinese','math','english','labor','sports','checkin','points','rewards','pet','games'];
                    met = required.every(m => d.modulesUsed.includes(m)); break;
            }
            if (met) {
                d.badges.push(badge.id);
                newBadges.push(badge);
            }
        }
        if (newBadges.length) {
            this.save();
            newBadges.forEach(b => {
                UI.toast('🏅 获得成就：' + b.name + '！', 'success');
            });
            UI.fireworks();
        }
    },

    markModuleUsed(name) {
        if (!this.data.modulesUsed.includes(name)) {
            this.data.modulesUsed.push(name);
            this.save();
            this.checkBadges();
        }
    },

    todayKey() {
        return new Date().toISOString().split('T')[0];
    }
};

// ===== 工具函数 =====
const Utils = {
    formatDate(d) {
        const days = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 ${days[d.getDay()]}`;
    },

    isWeekend() {
        const day = new Date().getDay();
        return day === 0 || day === 6;
    },

    getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },

    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

// ===== UI 组件 =====
const UI = {
    toast(msg, type = 'info', duration = 2500) {
        const container = document.getElementById('toastContainer');
        const el = document.createElement('div');
        el.className = 'toast ' + type;
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        el.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
        container.appendChild(el);
        setTimeout(() => {
            el.style.animation = 'toastOut 0.3s forwards';
            setTimeout(() => el.remove(), 300);
        }, duration);
    },

    modal(title, bodyHtml, footerHtml = '') {
        const c = document.getElementById('modalContainer');
        c.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="UI.closeModal()">✕</button>
                </div>
                <div class="modal-body">${bodyHtml}</div>
                ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
            </div>
        `;
        c.classList.add('show');
        c.onclick = (e) => { if (e.target === c) this.closeModal(); };
    },

    closeModal() {
        document.getElementById('modalContainer').classList.remove('show');
        document.getElementById('modalContainer').innerHTML = '';
    },

    fireworks() {
        const container = document.getElementById('fireworkContainer');
        const colors = ['#FCD116','#00852B','#0057B8','#CE1126','#FCD116','#FFFFFF'];
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        for (let i = 0; i < 30; i++) {
            const f = document.createElement('div');
            f.className = 'firework';
            f.style.left = cx + 'px';
            f.style.top = cy + 'px';
            f.style.background = colors[i % colors.length];
            const angle = (i / 30) * Math.PI * 2;
            const dist = 100 + Math.random() * 150;
            f.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
            f.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
            container.appendChild(f);
            setTimeout(() => f.remove(), 1000);
        }
    },

    updateTopbar() {
        document.getElementById('topPoints').textContent = Store.data.points;
        document.getElementById('topStreak').textContent = Store.data.streak;
        const evo = COURSE_DATA.petEvolution.find(e => e.level === Store.data.pet.level);
        document.getElementById('topbarPet').textContent = evo ? evo.emoji : '🥚';
        document.getElementById('pointsBadge').textContent = Store.data.points;
    },

    confirm(msg, onConfirm) {
        this.modal('⚠️ 确认', `<p style="font-size:16px;color:#3A3A3A;margin-bottom:8px;">${msg}</p>`,
            `<button class="lego-btn lego-btn-green" onclick="UI.closeModal(); (${onConfirm.toString()})();">确定</button>
             <button class="lego-btn" onclick="UI.closeModal()">取消</button>`);
    }
};

// ===== 模块渲染器 =====
const Modules = {
    // ===== 首页 =====
    home() {
        const d = Store.data;
        const todayTasks = d.planProgress[Store.todayKey()] || [];
        const todayPlan = Utils.isWeekend() ? PLAN_TEMPLATES.weekend : PLAN_TEMPLATES.weekday;
        const customPlan = (d.customTasks && d.customTasks.plan) || [];
        const hiddenPreset = (d.hiddenPreset && d.hiddenPreset.plan) || [];
        const visiblePresetCount = todayPlan.filter(t => !hiddenPreset.includes(t.name)).length;
        const totalCount = visiblePresetCount + customPlan.length;
        const doneCount = todayTasks.filter(i => i < todayPlan.length ? !hiddenPreset.includes(todayPlan[i].name) : true).length;
        const petEvo = COURSE_DATA.petEvolution.find(e => e.level === d.pet.level);
        const nextEvo = COURSE_DATA.petEvolution.find(e => e.level === d.pet.level + 1);
        const expPercent = nextEvo ? Math.round((d.pet.exp - petEvo.minExp) / (nextEvo.minExp - petEvo.minExp) * 100) : 100;

        const lessonsDone = Object.keys(d.lessonProgress).filter(k => d.lessonProgress[k] === 'done').length;
        const poemsDone = Object.keys(d.poemProgress).length;
        const laborDone = d.laborRecords.length;
        const sportsDone = d.sportsRecords.length;

        return `
            <div class="fade-in">
                <div class="home-hero">
                    <h1>🧱 欢迎来到学习积木世界！</h1>
                    <p>${Utils.formatDate(new Date())} · 今天也要努力拼搭（学习）哦！</p>
                    ${d.playerName ? `<p style="margin-top:6px;font-size:13px;">👋 你好，${d.playerName}！</p>` : ''}
                    <div class="hero-emoji">🧱</div>
                </div>

                <div class="stats-grid">
                    <div class="lego-panel stat-card" onclick="App.navigate('plan')">
                        <div class="stat-icon-lg bg-grass">📋</div>
                        <div class="stat-info">
                            <h3>${doneCount}/${totalCount}</h3>
                            <p>今日任务</p>
                        </div>
                    </div>
                    <div class="lego-panel stat-card" onclick="App.navigate('points')">
                        <div class="stat-icon-lg bg-emerald">💎</div>
                        <div class="stat-info">
                            <h3>${d.points}</h3>
                            <p>积木币</p>
                        </div>
                    </div>
                    <div class="lego-panel stat-card" onclick="App.navigate('checkin')">
                        <div class="stat-icon-lg bg-gold">🔥</div>
                        <div class="stat-info">
                            <h3>${d.streak}</h3>
                            <p>连续天数</p>
                        </div>
                    </div>
                    <div class="lego-panel stat-card" onclick="App.navigate('pet')">
                        <div class="stat-icon-lg bg-diamond">${petEvo.emoji}</div>
                        <div class="stat-info">
                            <h3>Lv.${d.pet.level}</h3>
                            <p>${petEvo.name}</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="lego-panel">
                        <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">📊 今日进度</h3>
                        <div style="margin-bottom:8px;display:flex;justify-content:space-between;font-size:13px;color:#666;">
                            <span>完成 ${doneCount} / ${totalCount} 项任务</span>
                            <span>${Math.round(doneCount/totalCount*100)}%</span>
                        </div>
                        <div class="progress-bar"><div class="progress-fill" style="width:${doneCount/totalCount*100}%"></div></div>
                        <div class="lego-divider"></div>
                        <h3 style="font-size:14px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">🐾 伙伴状态</h3>
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                            <span style="font-size:28px;">${petEvo.emoji}</span>
                            <div style="flex:1;">
                                <div style="font-size:14px;font-weight:bold;color:#3A3A3A;">${petEvo.name} · Lv.${d.pet.level}</div>
                                <div style="font-size:12px;color:#666;">经验值: ${d.pet.exp}${nextEvo ? ' / ' + nextEvo.minExp : ' (满级)'}</div>
                            </div>
                        </div>
                        <div class="progress-bar"><div class="progress-fill gold" style="width:${expPercent}%"></div></div>
                        <div style="font-size:12px;color:#666;margin-top:6px;">😊 心情: ${'█'.repeat(Math.floor(d.pet.mood/10))}${'░'.repeat(10-Math.floor(d.pet.mood/10))} ${d.pet.mood}%</div>
                    </div>

                    <div class="lego-panel">
                        <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">🏅 成就统计</h3>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                            <div style="text-align:center;padding:10px;background:#0057B8;color:#FFF;border:2px solid #E0E0E0;">
                                <div style="font-size:24px;font-weight:bold;">${lessonsDone}</div>
                                <div style="font-size:11px;">课文完成</div>
                            </div>
                            <div style="text-align:center;padding:10px;background:#0057B8;color:#FFF;border:2px solid #E0E0E0;">
                                <div style="font-size:24px;font-weight:bold;">${poemsDone}</div>
                                <div style="font-size:11px;">古诗背诵</div>
                            </div>
                            <div style="text-align:center;padding:10px;background:#0057B8;color:#FFF;border:2px solid #E0E0E0;">
                                <div style="font-size:24px;font-weight:bold;">${laborDone}</div>
                                <div style="font-size:11px;">劳动次数</div>
                            </div>
                            <div style="text-align:center;padding:10px;background:#0057B8;color:#FFF;border:2px solid #E0E0E0;">
                                <div style="font-size:24px;font-weight:bold;">${sportsDone}</div>
                                <div style="font-size:11px;">运动次数</div>
                            </div>
                        </div>
                        <div class="lego-divider"></div>
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:13px;color:#666;">已获徽章</span>
                            <span style="font-size:14px;font-weight:bold;color:#3A3A3A;">${d.badges.length} / ${COURSE_DATA.badges.length}</span>
                        </div>
                        <div class="progress-bar" style="margin-top:4px;"><div class="progress-fill diamond" style="width:${d.badges.length/COURSE_DATA.badges.length*100}%"></div></div>
                    </div>
                </div>

                <div style="margin-top:16px;">
                    <h3 style="font-size:16px;font-weight:bold;color:#FFF;margin-bottom:12px;">🚀 快捷入口</h3>
                    <div class="grid grid-4">
                        <div class="lego-slot" style="text-align:center;cursor:pointer;" onclick="App.navigate('chinese')">
                            <div style="font-size:32px;">📖</div>
                            <div style="font-size:13px;font-weight:bold;color:#3A3A3A;margin-top:4px;">语文</div>
                            <div style="font-size:11px;color:#666;">人教版</div>
                        </div>
                        <div class="lego-slot" style="text-align:center;cursor:pointer;" onclick="App.navigate('math')">
                            <div style="font-size:32px;">🔢</div>
                            <div style="font-size:13px;font-weight:bold;color:#3A3A3A;margin-top:4px;">数学</div>
                            <div style="font-size:11px;color:#666;">苏教版</div>
                        </div>
                        <div class="lego-slot" style="text-align:center;cursor:pointer;" onclick="App.navigate('english')">
                            <div style="font-size:32px;">🔤</div>
                            <div style="font-size:13px;font-weight:bold;color:#3A3A3A;margin-top:4px;">英语</div>
                            <div style="font-size:11px;color:#666;">单词句型</div>
                        </div>
                        <div class="lego-slot" style="text-align:center;cursor:pointer;" onclick="App.navigate('games')">
                            <div style="font-size:32px;">🎮</div>
                            <div style="font-size:13px;font-weight:bold;color:#3A3A3A;margin-top:4px;">小游戏</div>
                            <div style="font-size:11px;color:#666;">边玩边学</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // ===== 每日学习计划 =====
    plan() {
        const today = Store.todayKey();
        const basePlan = Utils.isWeekend() ? PLAN_TEMPLATES.weekend : PLAN_TEMPLATES.weekday;
        const customPlan = (Store.data.customTasks && Store.data.customTasks.plan) || [];
        const allPlan = [...basePlan, ...customPlan];
        const hiddenPreset = (Store.data.hiddenPreset && Store.data.hiddenPreset.plan) || [];
        // 过滤隐藏的预设任务，但保留原始索引
        const plan = allPlan.map((task, originalIdx) => ({ task, originalIdx }))
            .filter(({ task, originalIdx }) => originalIdx >= basePlan.length || !hiddenPreset.includes(task.name));
        const done = Store.data.planProgress[today] || [];
        const reviews = Store.data.pendingReviews || [];

        const tasksHtml = plan.map(({ task, originalIdx }) => {
            const isDone = done.includes(originalIdx);
            const pending = reviews.find(r => r.taskType === 'plan' && r.taskIndex === originalIdx && r.status === 'pending');
            const approved = reviews.find(r => r.taskType === 'plan' && r.taskIndex === originalIdx && r.status === 'approved');

            let statusHtml = '';
            let clickHandler = '';
            let completedClass = '';

            if (isDone || approved) {
                completedClass = 'completed';
                statusHtml = '<span style="font-size:13px;font-weight:bold;color:#00852B;">✅ 已完成</span>';
            } else if (pending) {
                statusHtml = '<span class="task-status-tag pending">⏳ 待审核</span>';
            } else {
                clickHandler = `onclick="Modules.togglePlanTask(${originalIdx})"`;
                statusHtml = `<span style="font-size:13px;color:#999;">点击打卡</span>`;
            }

            return `
                <div class="task-item ${completedClass}" ${clickHandler}>
                    <div class="task-checkbox">${(isDone || approved) ? '✓' : (pending ? '⏳' : '')}</div>
                    <div class="task-info">
                        <div class="task-name">${task.icon} ${task.name}</div>
                        <div class="task-meta">
                            <span>🕐 ${task.time}</span>
                            <span>${task.desc}</span>
                        </div>
                    </div>
                    <div class="task-points">${statusHtml}</div>
                </div>
            `;
        }).join('');

        const percent = plan.length > 0 ? Math.round(done.filter(i => i < allPlan.length).length / plan.length * 100) : 0;
        const allDone = plan.length > 0 && plan.every(({ originalIdx }) => done.includes(originalIdx));

        return `
            <div class="fade-in">
                <h1 class="page-title">📋 每日任务</h1>
                <p class="page-subtitle">${Utils.formatDate(new Date())} · ${Utils.isWeekend() ? '周末计划' : '工作日计划'}</p>

                <div class="lego-panel" style="margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span style="font-size:16px;font-weight:bold;color:#3A3A3A;">📊 今日完成度</span>
                        <span style="font-size:20px;font-weight:bold;color:${percent===100?'#00852B':'#0057B8'};">${done.filter(i => i < allPlan.length).length} / ${plan.length}</span>
                    </div>
                    <div class="progress-bar"><div class="progress-fill ${percent===100?'':'diamond'}" style="width:${percent}%;"></div></div>
                    ${allDone ? '<p style="margin-top:10px;font-size:14px;color:#00852B;font-weight:bold;text-align:center;">🎉 太棒了！今天的任务全部完成！</p>' : ''}
                </div>

                <div class="task-list">${tasksHtml}</div>

                <div style="margin-top:16px;text-align:center;">
                    <button class="lego-btn lego-btn-red" onclick="Modules.resetPlan()">🔄 重置今日任务</button>
                </div>
            </div>
        `;
    },

    togglePlanTask(idx) {
        const basePlan = Utils.isWeekend() ? PLAN_TEMPLATES.weekend : PLAN_TEMPLATES.weekday;
        const customPlan = (Store.data.customTasks && Store.data.customTasks.plan) || [];
        const plan = [...basePlan, ...customPlan];
        const task = plan[idx];
        if (!task) return;

        // Check if already pending
        if (this.hasPendingReview('plan', task.name)) {
            UI.toast('该任务已提交打卡，等待家长审核中', 'warning');
            return;
        }

        // Show photo checkin modal
        this.showPhotoCheckin('plan', task.name, task.points, task.icon, { taskIndex: idx });
    },

    resetPlan() {
        UI.confirm('确定要重置今天的任务吗？已获得的积分会扣除，待审核的打卡也会取消。', () => {
            const today = Store.todayKey();
            const basePlan = Utils.isWeekend() ? PLAN_TEMPLATES.weekend : PLAN_TEMPLATES.weekday;
            const customPlan = (Store.data.customTasks && Store.data.customTasks.plan) || [];
            const plan = [...basePlan, ...customPlan];
            const done = Store.data.planProgress[today] || [];
            done.forEach(i => {
                if (plan[i]) Store.addPoints(-plan[i].points, '重置任务');
            });
            Store.data.planProgress[today] = [];
            // Remove pending plan reviews
            Store.data.pendingReviews = (Store.data.pendingReviews || []).filter(r =>
                !(r.taskType === 'plan' && r.status === 'pending')
            );
            Store.save();
            App.render();
            if (typeof Parent !== 'undefined') Parent.updateReviewBadge();
            UI.toast('今日任务已重置', 'info');
        });
    },

    // ===== 语文 =====
    chinese() {
        Store.markModuleUsed('chinese');
        const data = COURSE_DATA.chinese;
        const tab = App.currentTab || 'textbook';
        const allLessons = data.units.flatMap(u => u.lessons);
        if (!Store.data.currentLesson && allLessons.length > 0) {
            const doneLessons = allLessons.filter(l => Store.data.lessonProgress[l.title] === 'done');
            const nextLesson = allLessons[doneLessons.length] || allLessons[0];
            Store.data.currentLesson = nextLesson.title;
        }
        const currentLesson = allLessons.find(l => l.title === Store.data.currentLesson) || allLessons[0];

        let tabsHtml = `
            <div class="tabs">
                <div class="tab ${tab==='textbook'?'active':''}" onclick="App.setTab('textbook')">📖 课本同步</div>
                <div class="tab ${tab==='words'?'active':''}" onclick="App.setTab('words')">✏️ 字词积累</div>
                <div class="tab ${tab==='reading'?'active':''}" onclick="App.setTab('reading')">📚 阅读学习</div>
                <div class="tab ${tab==='writing'?'active':''}" onclick="App.setTab('writing')">✍️ 写话写作</div>
                <div class="tab ${tab==='review'?'active':''}" onclick="App.setTab('review')">🔄 复习错题</div>
            </div>
        `;

        let content = '';

        if (tab === 'textbook') {
            content = Modules.renderChineseTextbook(data, currentLesson, allLessons);
        } else if (tab === 'words') {
            content = Modules.renderChineseWords(currentLesson);
        } else if (tab === 'reading') {
            content = Modules.renderChineseReading(currentLesson, data);
        } else if (tab === 'writing') {
            content = Modules.renderChineseWriting();
        } else if (tab === 'review') {
            content = Modules.renderChineseReview(data, allLessons);
        }

        return `
            <div class="fade-in">
                <h1 class="page-title">📖 语文</h1>
                <p class="page-subtitle">${data.subtitle} · 人教版二年级</p>
                ${tabsHtml}
                ${content}
            </div>
        `;
    },

    // 课本同步学习
    renderChineseTextbook(data, currentLesson, allLessons) {
        const banner = `
            <div class="current-lesson-banner">
                <div class="lesson-icon">📖</div>
                <div class="lesson-info">
                    <div class="lesson-name">${currentLesson.title}</div>
                    <div class="lesson-hint">${currentLesson.subtitle} · 每天一课，按顺序学习</div>
                </div>
                <button class="lego-btn lego-btn-yellow" style="font-size:13px;padding:8px 16px;" onclick="Modules.openLessonDetail('${currentLesson.title.replace(/'/g,"\\'")}')">查看详情</button>
            </div>
        `;

        const lessonKey = currentLesson.title;
        const studySteps = [
            { title: '预习读课文', desc: '朗读课文2-3遍，了解大意', icon: '📖' },
            { title: '圈出生字', desc: '在课文中圈出本课生字，尝试认读', icon: '✏️' },
            { title: '朗读背诵', desc: '流利朗读课文，尝试背诵精彩段落', icon: '🗣️' },
            { title: '完成课后习题', desc: '完成课后练习题，巩固所学', icon: '📝' }
        ];
        const stepPoints = 5;
        const stepsHtml = studySteps.map((s, i) => {
            const stepId = lessonKey + '_step_' + i;
            const approved = Modules.hasApprovedReview('chinese_step', stepId);
            const pending = Modules.hasPendingReview('chinese_step', stepId);
            let statusHtml = '';
            let stepClass = '';
            if (approved) {
                stepClass = 'done';
                statusHtml = '<span style="font-size:12px;color:#00852B;font-weight:700;">✅ 已通过</span>';
            } else if (pending) {
                stepClass = 'pending';
                statusHtml = '<span style="font-size:12px;color:#FF9800;font-weight:700;">⏳ 待审核</span>';
            } else {
                statusHtml = `<button class="lego-btn lego-btn-blue" style="font-size:11px;padding:4px 12px;" onclick="Modules.showPhotoCheckin('chinese_step','${stepId.replace(/'/g,"\\'")}',${stepPoints},'${s.icon}',{stepIndex:${i},lessonTitle:'${lessonKey.replace(/'/g,"\\'")}'})">📸 打卡</button>`;
            }
            return `
                <div class="study-step ${stepClass}">
                    <div class="step-number">${approved?'✓':i+1}</div>
                    <div class="step-content">
                        <div class="step-title">${s.icon} ${s.title}</div>
                        <div class="step-desc">${s.desc}</div>
                    </div>
                    ${statusHtml}
                </div>
            `;
        }).join('');

        const approvedSteps = studySteps.filter((_, i) => Modules.hasApprovedReview('chinese_step', lessonKey + '_step_' + i)).length;
        const allDone = approvedSteps === 4;
        const completeBtn = allDone && Store.data.lessonProgress[lessonKey] !== 'done'
            ? `<button class="lego-btn lego-btn-green" style="width:100%;margin-top:12px;" onclick="Modules.completeLesson('${lessonKey.replace(/'/g,"\\'")}')">🎉 全部步骤完成！领取奖励 +${currentLesson.points}💎</button>`
            : (Store.data.lessonProgress[lessonKey] === 'done'
                ? '<div style="text-align:center;padding:12px;background:#E8F5E9;border-radius:12px;color:#00852B;font-weight:700;">✅ 本课已完成</div>'
                : `<div style="text-align:center;padding:8px;background:#FFF3E0;border-radius:8px;color:#E65100;font-size:13px;font-weight:600;">已完成 ${approvedSteps}/4 步骤，需全部通过家长审核</div>`);

        const unitsHtml = data.units.map(unit => {
            const lessons = unit.lessons.map(lesson => {
                const isDone = Store.data.lessonProgress[lesson.title] === 'done';
                const isCurrent = lesson.title === currentLesson.title;
                return `
                    <div class="lesson-card" style="${isCurrent?'border:3px solid #FCD116;':''}" onclick="Modules.setCurrentLesson('${lesson.title.replace(/'/g,"\\'")}')">
                        <div class="lesson-header" style="background:${data.gradient};">
                            <div class="lesson-status ${isDone?'done':''}">${isDone?'✓':isCurrent?'📍':'📖'}</div>
                            <div class="lesson-title">${lesson.title}</div>
                            <div class="lesson-subtitle">${lesson.subtitle}</div>
                        </div>
                        <div class="lesson-body">
                            <div class="lesson-content">${lesson.keyPoints}</div>
                            <div class="lesson-tags">
                                <span class="lesson-tag">+${lesson.points} 💎</span>
                                <span class="lesson-tag">${lesson.words.length} 生字</span>
                                ${isCurrent?'<span class="lesson-tag" style="background:#FCD116;color:#333;">当前课文</span>':''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            return `
                <div style="margin-bottom:20px;">
                    <h3 style="font-size:16px;font-weight:bold;color:#FFF;margin-bottom:12px;">📦 ${unit.name}</h3>
                    <div class="subject-grid">${lessons}</div>
                </div>
            `;
        }).join('');

        let poemsHtml = '';
        if (currentLesson.poems) {
            poemsHtml = currentLesson.poems.map(p => {
                const isDone = Store.data.poemProgress[p.title];
                return `
                    <div class="lego-panel" style="margin-top:12px;${isDone?'border-color:#FCD116 #B8860B #B8860B #FCD116;':''}">
                        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                            <div>
                                <h3 style="font-size:18px;font-weight:bold;color:#3A3A3A;">${p.title}</h3>
                                <p style="font-size:12px;color:#666;">${p.author}</p>
                            </div>
                            ${isDone ? '<span style="font-size:24px;">✅</span>' : ''}
                        </div>
                        <div style="font-size:15px;color:#3A3A3A;line-height:2;text-align:center;padding:12px;background:#FCD116;color:#333;border:2px solid #E0E0E0;border-radius:8px;">
                            ${p.content}
                        </div>
                        <div style="font-size:12px;margin-top:8px;color:#666;text-align:center;">${p.meaning}</div>
                        ${isDone
                            ? '<p style="margin-top:8px;font-size:13px;color:#00852B;font-weight:bold;text-align:center;">✅ 已背诵</p>'
                            : `<button class="lego-btn lego-btn-gold" style="width:100%;margin-top:10px;" onclick="Modules.recitePoem('${p.title}')">📜 标记已背诵 +10💎</button>`
                        }
                    </div>
                `;
            }).join('');
        }

        return `
            ${banner}
            <div class="lego-panel" style="margin-bottom:16px;">
                <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">📋 今日学习步骤（拍照打卡→家长审核→获得积分）</h3>
                ${stepsHtml}
                ${completeBtn}
            </div>
            ${currentLesson.poems ? `<div class="lego-panel" style="margin-bottom:16px;"><h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">📜 本课古诗</h3>${poemsHtml}</div>` : ''}
            <h3 style="font-size:16px;font-weight:bold;color:#FFF;margin-bottom:12px;">📚 全部课文（点击切换当前课文）</h3>
            ${unitsHtml}
        `;
    },

    // 字词积累
    renderChineseWords(currentLesson) {
        const extra = CHINESE_EXTRA[currentLesson.title] || {};
        const charDetails = extra.charDetails || currentLesson.words.map(w => ({ char: w, pinyin: '', strokes: 0, radical: '', groups: [] }));
        const learned = charDetails.filter(c => Store.data.vocabProgress[c.char]).length;

        const charsHtml = charDetails.map(c => {
            const isLearned = Store.data.vocabProgress[c.char];
            const strokeCount = c.strokes || 0;
            const hwId = 'hw-' + c.char + '-' + Math.random().toString(36).slice(2, 8);
            return `
                <div class="char-card">
                    <div class="char-card-header">
                        <div class="tianzi-grid"><div class="tianzi-char">${c.char}</div></div>
                        <div class="char-card-info">
                            <div class="char-card-pinyin">${c.pinyin || ''}</div>
                            <div class="char-card-meta">${strokeCount ? strokeCount + '画' : ''} ${c.radical ? '\u00B7 ' + c.radical + '部' : ''}</div>
                            <div style="margin-top:6px;">
                                ${isLearned
                                    ? '<span style="font-size:12px;color:#00852B;font-weight:700;">\u2705 已学会</span>'
                                    : `<button class="lego-btn lego-btn-green" style="font-size:11px;padding:4px 12px;" onclick="Modules.learnChar('${c.char}')">标记已学 +2\u{1F48E}</button>`
                                }
                            </div>
                        </div>
                    </div>
                    ${c.groups && c.groups.length > 0 ? `<div class="char-card-groups">${c.groups.map(g => `<span class="char-group-tag">${g}</span>`).join('')}</div>` : ''}
                    <div class="stroke-order-section">
                        <div class="stroke-order-header" onclick="Modules.toggleStrokeOrder(this, '${c.char}', '${hwId}')">
                            <span style="font-size:13px;font-weight:700;color:#0057B8;">\u270D 笔顺动画（点击展开）</span>
                            <span style="font-size:12px;color:#888;">${strokeCount ? strokeCount + '笔' : ''}</span>
                        </div>
                        <div class="stroke-order-body" style="display:none;">
                            <div id="${hwId}" class="hanzi-writer-target"></div>
                            <div class="stroke-order-controls">
                                <button class="lego-btn lego-btn-blue" style="font-size:12px;padding:4px 14px;" onclick="Modules.playStrokeAnim('${hwId}','${c.char}',event)">\u25B6 播放笔顺</button>
                                <button class="lego-btn lego-btn-yellow" style="font-size:12px;padding:4px 14px;" onclick="Modules.quizStroke('${hwId}','${c.char}',event)">\u270F 练习书写</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 听写
        const dictKey = currentLesson.title;
        const dictationDone = Store.data.dictationProgress[dictKey];
        const dictationHtml = `
            <div class="lego-panel" style="margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;">🎤 听写巩固</h3>
                    ${dictationDone ? '<span style="font-size:13px;color:#00852B;font-weight:700;">✅ 已完成听写</span>' : ''}
                </div>
                <p style="font-size:14px;color:#666;margin-bottom:12px;">点击"开始听写"，屏幕依次显示拼音，请在纸上写出对应的生字，写完后点击"显示答案"对照。</p>
                <div class="dictation-card" id="dictationArea">
                    <div class="dictation-char-display" id="dictationChar">点击下方按钮开始听写</div>
                    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                        <button class="lego-btn lego-btn-blue" onclick="Modules.startDictation('${dictKey.replace(/'/g,"\\'")}')">开始听写</button>
                        <button class="lego-btn lego-btn-green" id="dictationReveal" style="display:none;" onclick="Modules.revealDictation()">显示答案</button>
                        <button class="lego-btn lego-btn-yellow" id="dictationNext" style="display:none;" onclick="Modules.nextDictation()">下一个</button>
                    </div>
                    <div id="dictationProgress" style="margin-top:10px;font-size:14px;color:#666;"></div>
                </div>
            </div>
        `;

        // 近反义词
        let antonymsHtml = '';
        if (extra.antonyms && extra.antonyms.length > 0) {
            antonymsHtml = `
                <div class="lego-panel" style="margin-bottom:16px;">
                    <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">🔄 近反义词积累</h3>
                    ${extra.antonyms.map(a => `
                        <div class="antonym-card">
                            <div class="antonym-word">${a.word}</div>
                            <div class="antonym-pair">
                                <span class="antonym-near">近义：${a.near}</span>
                                <span class="antonym-opposite">反义：${a.opposite}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // 成语
        let idiomsHtml = '';
        if (extra.idioms && extra.idioms.length > 0) {
            idiomsHtml = `
                <div class="lego-panel" style="margin-bottom:16px;">
                    <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">🌟 成语积累</h3>
                    <div>${extra.idioms.map(i => `<span class="idiom-tag">${i}</span>`).join('')}</div>
                </div>
            `;
        }

        // 易错字
        let easyWrongHtml = '';
        if (extra.easyWrong && extra.easyWrong.length > 0) {
            easyWrongHtml = `
                <div class="lego-panel" style="margin-bottom:16px;">
                    <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">⚠️ 易错字提醒</h3>
                    ${extra.easyWrong.map(e => `
                        <div class="easy-wrong-card">
                            <span class="easy-wrong-char">${e.word}</span>
                            <span class="easy-wrong-tip">${e.tip}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        return `
            <div class="lego-panel" style="margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:16px;font-weight:bold;color:#3A3A3A;">✏️ ${currentLesson.title} · 生字学习</span>
                    <span style="font-size:14px;color:#666;">已学 ${learned} / ${charDetails.length} 字</span>
                </div>
                <div class="progress-bar" style="margin-top:8px;"><div class="progress-fill red" style="width:${charDetails.length > 0 ? learned/charDetails.length*100 : 0}%"></div></div>
            </div>
            <div class="grid grid-2" style="margin-bottom:16px;">
                ${charsHtml}
            </div>
            ${dictationHtml}
            ${antonymsHtml}
            ${idiomsHtml}
            ${easyWrongHtml}
        `;
    },

    // 阅读学习
    renderChineseReading(currentLesson, data) {
        // 课外阅读记录
        const readingRecords = Store.data.readingRecords || [];
        const todayKey = Store.todayKey();
        const todayRead = readingRecords.find(r => r.date === todayKey);

        const readingForm = `
            <div class="lego-panel" style="margin-bottom:16px;">
                <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">📘 每日课外阅读（15-20分钟）</h3>
                ${todayRead
                    ? `<div style="padding:12px;background:#E8F5E9;border-radius:8px;color:#00852B;font-weight:600;">✅ 今日已阅读《${todayRead.bookName}》${todayRead.minutes}分钟 +5💎</div>`
                    : `
                        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
                            <input type="text" id="readingBookName" placeholder="书名" style="flex:1;min-width:150px;padding:10px 14px;border:2px solid #E0E0E0;border-radius:8px;font-size:14px;outline:none;">
                            <select id="readingMinutes" style="padding:10px 14px;border:2px solid #E0E0E0;border-radius:8px;font-size:14px;outline:none;">
                                <option value="15">15分钟</option>
                                <option value="20">20分钟</option>
                                <option value="30">30分钟</option>
                            </select>
                        </div>
                        <button class="lego-btn lego-btn-green" style="width:100%;" onclick="Modules.saveReadingRecord()">📝 记录今日阅读 +5💎</button>
                    `
                }
                <div style="margin-top:12px;font-size:13px;color:#888;">本周已阅读 ${readingRecords.filter(r => { const d = new Date(r.date); const now = new Date(); return (now - d) / 86400000 < 7; }).length} 天</div>
            </div>
        `;

        // 摘抄好词好句
        const excerpts = Store.data.excerptRecords || [];
        const excerptList = excerpts.slice(-5).reverse().map(e => `
            <div class="excerpt-card">
                <div class="excerpt-text">${e.text}</div>
                <div class="excerpt-source">—— ${e.source || '课外阅读'} · ${e.date || ''}</div>
            </div>
        `).join('');

        const excerptForm = `
            <div class="lego-panel" style="margin-bottom:16px;">
                <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">✨ 摘抄好词好句</h3>
                <textarea id="excerptText" class="writing-textarea" style="min-height:60px;margin-bottom:10px;" placeholder="抄写阅读中发现的好词好句..."></textarea>
                <input type="text" id="excerptSource" placeholder="来源（书名/课文）" style="width:100%;padding:10px 14px;border:2px solid #E0E0E0;border-radius:8px;font-size:14px;margin-bottom:10px;outline:none;">
                <button class="lego-btn lego-btn-yellow" style="width:100%;" onclick="Modules.saveExcerpt()">✨ 保存摘抄 +3💎</button>
                ${excerptList ? `<div style="margin-top:14px;"><h4 style="font-size:14px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">最近的摘抄</h4>${excerptList}</div>` : ''}
            </div>
        `;

        // 课内阅读理解
        const inClassReading = `
            <div class="lego-panel" style="margin-bottom:16px;">
                <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">📖 课内阅读：${currentLesson.title}</h3>
                <p style="font-size:14px;color:#555;line-height:1.8;margin-bottom:10px;">${currentLesson.keyPoints}</p>
                <div style="padding:12px;background:#E3F2FD;border-radius:8px;border-left:4px solid #0057B8;">
                    <p style="font-size:14px;color:#0057B8;line-height:1.8;">
                        <strong>阅读要求：</strong><br>
                        1. 流利朗读课文，注意停顿和语气<br>
                        2. 读懂课文内容，能回答问题<br>
                        3. 体会作者表达的感情<br>
                        4. 能用自己的话复述课文大意
                    </p>
                </div>
                <button class="lego-btn lego-btn-blue" style="width:100%;margin-top:10px;" onclick="Modules.openLessonDetail('${currentLesson.title.replace(/'/g,"\\'")}')">📖 查看课文详情</button>
            </div>
        `;

        // 口头复述
        const retellForm = `
            <div class="lego-panel" style="margin-bottom:16px;">
                <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">🗣️ 口头复述故事</h3>
                <p style="font-size:14px;color:#666;line-height:1.8;">读完课文后，试着用自己的话把故事讲给爸爸妈妈听。</p>
                <div style="display:flex;gap:10px;margin-top:10px;">
                    <button class="lego-btn lego-btn-green" style="flex:1;" onclick="Modules.markRetellDone('${currentLesson.title.replace(/'/g,"\\'")}')">✅ 已完成复述 +3💎</button>
                </div>
            </div>
        `;

        // 古诗背诵（如果有）
        let poemsHtml = '';
        if (currentLesson.poems) {
            poemsHtml = `
                <div class="lego-panel" style="margin-bottom:16px;">
                    <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">📜 古诗背诵</h3>
                    ${currentLesson.poems.map(p => {
                        const isDone = Store.data.poemProgress[p.title];
                        return `
                            <div class="lego-panel" style="${isDone?'border-color:#FCD116 #B8860B #B8860B #FCD116;':''}margin-bottom:10px;">
                                <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                                    <h4 style="font-size:16px;font-weight:bold;color:#3A3A3A;">${p.title} · ${p.author}</h4>
                                    ${isDone ? '<span style="font-size:20px;">✅</span>' : ''}
                                </div>
                                <div style="font-size:15px;color:#3A3A3A;line-height:2;text-align:center;padding:12px;background:#FCD116;color:#333;border:2px solid #E0E0E0;border-radius:8px;">${p.content}</div>
                                <div style="font-size:12px;margin-top:6px;color:#666;text-align:center;">${p.meaning}</div>
                                ${isDone
                                    ? '<p style="margin-top:8px;font-size:13px;color:#00852B;font-weight:bold;text-align:center;">✅ 已背诵</p>'
                                    : `<button class="lego-btn lego-btn-gold" style="width:100%;margin-top:10px;" onclick="Modules.recitePoem('${p.title}')">📜 标记已背诵 +10💎</button>`
                                }
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        return inClassReading + readingForm + retellForm + excerptForm + poemsHtml;
    },

    // 写话写作
    renderChineseWriting() {
        // 看图写话
        const writingPrompts = (typeof WRITING_PROMPTS !== 'undefined' ? WRITING_PROMPTS : []).map(p => {
            const saved = Store.data.writingRecords.find(w => w.promptId === p.id);
            return `
                <div class="writing-prompt-card">
                    <div class="writing-prompt-icon">${p.icon}</div>
                    <div class="writing-prompt-title">${p.title}</div>
                    <div class="writing-prompt-desc">${p.desc}</div>
                    <div class="writing-prompt-tip">${p.tip}</div>
                    <textarea class="writing-textarea" id="writing_${p.id}" placeholder="在这里写话...">${saved ? saved.content : ''}</textarea>
                    <button class="lego-btn lego-btn-green" style="width:100%;margin-top:10px;" onclick="Modules.saveWriting('${p.id}')">${saved ? '💾 更新保存' : '📝 保存写话 +5💎'}</button>
                </div>
            `;
        }).join('');

        // 标点练习
        const punctuationExercises = (typeof PUNCTUATION_EXERCISES !== 'undefined' ? PUNCTUATION_EXERCISES : []).map(ex => {
            const answered = Store.data.punctuationProgress[ex.id];
            return `
                <div class="punctuation-card" id="punct_${ex.id}">
                    <h4 style="font-size:15px;font-weight:bold;color:#3A3A3A;">✏️ ${ex.sentence}</h4>
                    <div style="font-size:13px;color:#888;margin-top:4px;">选择正确的标点填入：</div>
                    <div class="punctuation-options" style="margin-top:10px;">
                        ${ex.options.map((opt, i) => `
                            <div class="punctuation-option ${answered && answered.correct === i ? 'correct' : answered && answered.selected === i && answered.correct !== i ? 'wrong' : ''}" onclick="Modules.checkPunctuation('${ex.id}', ${i})">${opt}</div>
                        `).join('')}
                    </div>
                    <div id="punct_explain_${ex.id}" style="margin-top:8px;font-size:13px;${answered ? '' : 'display:none;'}">${answered ? '<span style="color:' + (answered.selected === answered.correct ? '#00852B' : '#CE1126') + ';">' + (answered.selected === answered.correct ? '✅ 正确！' : '❌ 再想想') + '</span> ' + ex.explain : ''}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="lego-panel" style="margin-bottom:16px;">
                <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">✍️ 看图写话练习</h3>
                <p style="font-size:14px;color:#666;margin-bottom:12px;">抓住时间、地点、人物、事件四要素，正确使用标点符号。</p>
            </div>
            ${writingPrompts}
            <div class="lego-panel" style="margin-bottom:16px;">
                <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">🔖 标点符号练习</h3>
                <p style="font-size:14px;color:#666;margin-bottom:12px;">学会正确使用句号、问号、感叹号、逗号、冒号、引号、顿号。</p>
            </div>
            ${punctuationExercises}
        `;
    },

    // 复习与错题
    renderChineseReview(data, allLessons) {
        // 单元复习
        const unitsReview = data.units.map((unit, ui) => {
            const lessons = unit.lessons.map(l => {
                const isDone = Store.data.lessonProgress[l.title] === 'done';
                return `
                    <div class="review-item">
                        <span style="font-size:16px;">${isDone ? '✅' : '⬜'}</span>
                        <span class="review-item-name">${l.title}</span>
                        <span style="font-size:12px;color:#888;">${l.words.length}字</span>
                    </div>
                `;
            }).join('');
            const unitKey = 'unit_' + ui;
            const reviewDone = Store.data.reviewProgress[unitKey];
            return `
                <div class="review-unit-card">
                    <div class="review-unit-title">
                        📦 ${unit.name}
                        ${reviewDone ? '<span style="font-size:12px;color:#00852B;font-weight:700;">✅ 已复习</span>' : ''}
                    </div>
                    ${lessons}
                    <div style="display:flex;gap:8px;margin-top:10px;">
                        <button class="lego-btn lego-btn-blue" style="flex:1;font-size:13px;padding:8px;" onclick="Modules.markUnitReview(${ui})">${reviewDone ? '重新复习' : '标记已复习'} +5💎</button>
                        <button class="lego-btn lego-btn-yellow" style="flex:1;font-size:13px;padding:8px;" onclick="Modules.startUnitDictation(${ui})">🎤 默写练习</button>
                    </div>
                </div>
            `;
        }).join('');

        // 错题本
        const mistakes = Store.data.mistakeBook || [];
        const mistakesHtml = mistakes.length > 0
            ? mistakes.map((m, i) => `
                <div class="mistake-card">
                    <span class="mistake-type ${m.type}">${m.type === 'word' ? '字词' : '阅读'}</span>
                    <div class="mistake-content">${m.content}</div>
                    <span class="mistake-date">${m.date || ''}</span>
                    <button class="edit-btn delete" onclick="Modules.removeMistake(${i})">删除</button>
                </div>
            `).join('')
            : '<div style="text-align:center;padding:20px;color:#888;">暂无错题，继续加油！</div>';

        const addMistakeForm = `
            <div class="lego-panel" style="margin-bottom:16px;">
                <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">📝 添加错题</h3>
                <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
                    <select id="mistakeType" style="padding:10px 14px;border:2px solid #E0E0E0;border-radius:8px;font-size:14px;outline:none;">
                        <option value="word">字词错题</option>
                        <option value="reading">阅读错题</option>
                    </select>
                    <input type="text" id="mistakeContent" placeholder="输入错题内容..." style="flex:1;min-width:200px;padding:10px 14px;border:2px solid #E0E0E0;border-radius:8px;font-size:14px;outline:none;">
                </div>
                <button class="lego-btn lego-btn-red" style="width:100%;" onclick="Modules.addMistake()">➕ 添加到错题本</button>
                <p style="font-size:12px;color:#999;margin-top:8px;">提示：隔几天重复练习错题，加深记忆</p>
            </div>
        `;

        return `
            <div class="lego-panel" style="margin-bottom:16px;">
                <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">🔄 单元复习与默写</h3>
                <p style="font-size:14px;color:#666;margin-bottom:12px;">学完一个单元后，及时复习和默写，巩固所学知识。</p>
            </div>
            ${unitsReview}
            ${addMistakeForm}
            <div class="lego-panel">
                <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">📋 错题本（${mistakes.length}条）</h3>
                ${mistakesHtml}
            </div>
        `;
    },

    // 语文辅助方法
    setCurrentLesson(title) {
        Store.data.currentLesson = title;
        Store.save();
        App.setTab('textbook');
    },

    openLessonDetail(title) {
        const lesson = COURSE_DATA.chinese.units.flatMap(u => u.lessons).find(l => l.title === title);
        if (!lesson) return;
        const isDone = Store.data.lessonProgress[title] === 'done';
        const wordsHtml = lesson.words.map(w => `<span style="display:inline-block;padding:4px 10px;margin:3px;background:#0057B8;color:#FFF;border:2px solid #E0E0E0;font-size:16px;border-radius:6px;">${w}</span>`).join('');
        let poemsHtml = '';
        if (lesson.poems) {
            poemsHtml = lesson.poems.map(p => `
                <div style="margin-top:12px;padding:12px;background:#FCD116;color:#333;border:2px solid #E0E0E0;text-align:center;border-radius:8px;">
                    <div style="font-size:16px;font-weight:bold;margin-bottom:4px;">${p.title} · ${p.author}</div>
                    <div style="font-size:15px;line-height:2;">${p.content}</div>
                    <div style="font-size:12px;margin-top:8px;opacity:0.9;">${p.meaning}</div>
                </div>
            `).join('');
        }
        UI.modal(lesson.title, `
            <div style="margin-bottom:12px;">
                <strong style="font-size:15px;color:#3A3A3A;">📌 学习要点</strong>
                <p style="margin-top:6px;font-size:14px;color:#555;line-height:1.8;">${lesson.keyPoints}</p>
            </div>
            <div style="margin-bottom:12px;">
                <strong style="font-size:15px;color:#3A3A3A;">✏️ 生字词（${lesson.words.length}个）</strong>
                <div style="margin-top:8px;">${wordsHtml}</div>
            </div>
            ${poemsHtml}
            <div style="margin-top:16px;padding:12px;background:#FCD116;color:#333;border:2px solid #E0E0E0;border-radius:8px;">
                <strong>🎁 完成奖励：</strong>+${lesson.points} 积木币 + 伙伴经验
            </div>
        `, isDone ? '<button class="lego-btn" onclick="UI.closeModal()">关闭</button>' : `<button class="lego-btn lego-btn-green" onclick="Modules.completeLesson('${title.replace(/'/g,"\\'")}')">✅ 标记完成 +${lesson.points}💎</button><button class="lego-btn" onclick="UI.closeModal()">关闭</button>`);
    },

    toggleStudyStep(lessonKey, stepIndex) {
        // 已废弃：现在使用拍照打卡 + 家长审核流程
        // 保留方法以防其他地方调用
        console.log('[toggleStudyStep] deprecated, use photo check-in instead');
    },

    completeLesson(title) {
        // 检查4个学习步骤是否全部通过家长审核
        for (let i = 0; i < 4; i++) {
            const stepId = title + '_step_' + i;
            if (!Modules.hasApprovedReview('chinese_step', stepId)) {
                UI.toast('请先完成并通过所有学习步骤的家长审核', 'error');
                return;
            }
        }
        Store.data.lessonProgress[title] = 'done';
        const lesson = COURSE_DATA.chinese.units.flatMap(u => u.lessons).find(l => l.title === title);
        Store.addPoints(lesson.points, '完成课文：' + title);
        Store.addPetExp(10);
        Store.save();
        UI.toast('🎉 完成课文学习！+' + lesson.points + ' 💎', 'success');
        UI.fireworks();
        App.render();
    },

    learnChar(char) {
        Store.data.vocabProgress[char] = true;
        Store.addPoints(2, '学习生字：' + char);
        Store.addPetExp(2);
        Store.save();
        UI.toast('✅ 学会了 "' + char + '" +2 💎', 'success');
        App.render();
    },

    // HanziWriter 笔顺动画
    _hwWriters: {},

    toggleStrokeOrder(headerEl, char, hwId) {
        const body = headerEl.nextElementSibling;
        const expanded = body.style.display === 'none';
        body.style.display = expanded ? 'block' : 'none';
        if (expanded && !Modules._hwWriters[hwId]) {
            Modules._createHanziWriter(hwId, char);
        }
    },

    _createHanziWriter(hwId, char) {
        if (typeof HanziWriter === 'undefined') {
            document.getElementById(hwId).innerHTML = '<p style="font-size:13px;color:#999;text-align:center;padding:20px;">笔顺库加载失败，请检查网络</p>';
            return null;
        }
        var writer = HanziWriter.create(hwId, char, {
            width: 120,
            height: 120,
            padding: 5,
            showOutline: true,
            strokeColor: '#333',
            radicalColor: '#168F16',
            outlineColor: '#DDD',
            strokeAnimationSpeed: 1,
            delayBetweenStrokes: 300,
            showCharacter: false
        });
        Modules._hwWriters[hwId] = writer;
        return writer;
    },

    playStrokeAnim(hwId, char, ev) {
        if (ev) ev.stopPropagation();
        var writer = Modules._hwWriters[hwId];
        if (!writer) {
            writer = Modules._createHanziWriter(hwId, char);
            if (!writer) return;
        }
        writer.hideCharacter();
        writer.hideOutline();
        setTimeout(function() {
            writer.showOutline();
            writer.animateCharacter();
        }, 100);
    },

    quizStroke(hwId, char, ev) {
        if (ev) ev.stopPropagation();
        var writer = Modules._hwWriters[hwId];
        if (!writer) {
            writer = Modules._createHanziWriter(hwId, char);
            if (!writer) return;
        }
        writer.hideCharacter();
        writer.showOutline();
        writer.quiz({
            onMistake: function() {},
            onComplete: function() {
                UI.toast('🎉 太棒了！"' + char + '"写对了！', 'success');
            }
        });
    },

    recitePoem(title) {
        Store.data.poemProgress[title] = true;
        Store.addPoints(10, '背诵古诗：' + title);
        Store.addPetExp(8);
        Store.save();
        UI.toast('🎉 古诗背诵完成！+10 💎', 'success');
        UI.fireworks();
        App.render();
    },

    // 听写功能
    _dictationState: null,

    startDictation(dictKey) {
        const lesson = COURSE_DATA.chinese.units.flatMap(u => u.lessons).find(l => l.title === dictKey);
        if (!lesson) return;
        const extra = CHINESE_EXTRA[dictKey] || {};
        const charDetails = extra.charDetails || lesson.words.map(w => ({ char: w, pinyin: '' }));
        const chars = charDetails.map(c => ({ c: c.char, p: c.pinyin }));
        Modules._dictationState = { dictKey, chars, index: 0, revealed: false };
        Modules._showDictationChar();
    },

    _showDictationChar() {
        const st = Modules._dictationState;
        if (!st) return;
        const el = document.getElementById('dictationChar');
        const reveal = document.getElementById('dictationReveal');
        const next = document.getElementById('dictationNext');
        const progress = document.getElementById('dictationProgress');
        if (!el) return;
        if (st.index >= st.chars.length) {
            el.innerHTML = '🎉 听写完成！';
            el.style.color = '#00852B';
            reveal.style.display = 'none';
            next.style.display = 'none';
            progress.textContent = `${st.chars.length}/${st.chars.length} 全部完成`;
            Store.data.dictationProgress[st.dictKey] = true;
            Store.addPoints(5, '完成听写：' + st.dictKey);
            Store.addPetExp(5);
            Store.save();
            UI.toast('🎉 听写完成！+5 💎', 'success');
            return;
        }
        const c = st.chars[st.index];
        el.innerHTML = st.revealed ? c.c : `<span style="font-size:36px;color:#999;">${c.p || '拼音'}</span>`;
        el.style.color = st.revealed ? '#0057B8' : '#999';
        reveal.style.display = st.revealed ? 'none' : 'inline-flex';
        next.style.display = st.revealed ? 'inline-flex' : 'none';
        progress.textContent = `第 ${st.index + 1} / ${st.chars.length} 个`;
    },

    revealDictation() {
        if (!Modules._dictationState) return;
        Modules._dictationState.revealed = true;
        Modules._showDictationChar();
    },

    nextDictation() {
        if (!Modules._dictationState) return;
        Modules._dictationState.index++;
        Modules._dictationState.revealed = false;
        Modules._showDictationChar();
    },

    // 阅读记录
    saveReadingRecord() {
        const bookName = document.getElementById('readingBookName').value.trim();
        const minutes = document.getElementById('readingMinutes').value;
        if (!bookName) { UI.toast('请输入书名', 'warning'); return; }
        const todayKey = Store.todayKey();
        if (!Store.data.readingRecords) Store.data.readingRecords = [];
        Store.data.readingRecords.push({ date: todayKey, bookName, minutes: parseInt(minutes) });
        Store.addPoints(5, '课外阅读：' + bookName);
        Store.addPetExp(3);
        Store.save();
        UI.toast('✅ 阅读记录已保存 +5 💎', 'success');
        App.render();
    },

    markRetellDone(lessonTitle) {
        Store.addPoints(3, '口头复述：' + lessonTitle);
        Store.addPetExp(2);
        Store.save();
        UI.toast('✅ 复述完成 +3 💎', 'success');
        App.render();
    },

    // 摘抄
    saveExcerpt() {
        const text = document.getElementById('excerptText').value.trim();
        const source = document.getElementById('excerptSource').value.trim();
        if (!text) { UI.toast('请输入摘抄内容', 'warning'); return; }
        if (!Store.data.excerptRecords) Store.data.excerptRecords = [];
        const today = new Date();
        const dateStr = (today.getMonth()+1) + '月' + today.getDate() + '日';
        Store.data.excerptRecords.push({ text, source, date: dateStr });
        Store.addPoints(3, '摘抄好词好句');
        Store.addPetExp(2);
        Store.save();
        UI.toast('✅ 摘抄已保存 +3 💎', 'success');
        App.render();
    },

    // 写话
    saveWriting(promptId) {
        const textarea = document.getElementById('writing_' + promptId);
        if (!textarea) return;
        const content = textarea.value.trim();
        if (!content) { UI.toast('请先写一些内容', 'warning'); return; }
        if (!Store.data.writingRecords) Store.data.writingRecords = [];
        const existing = Store.data.writingRecords.findIndex(w => w.promptId === promptId);
        const isNew = existing === -1;
        const record = { promptId, content, date: new Date().toISOString() };
        if (isNew) {
            Store.data.writingRecords.push(record);
            Store.addPoints(5, '完成写话练习');
            Store.addPetExp(5);
        } else {
            Store.data.writingRecords[existing] = record;
        }
        Store.save();
        UI.toast(isNew ? '✅ 写话已保存 +5 💎' : '✅ 写话已更新', 'success');
        App.render();
    },

    // 标点练习
    checkPunctuation(exId, selected) {
        const ex = (typeof PUNCTUATION_EXERCISES !== 'undefined' ? PUNCTUATION_EXERCISES : []).find(e => e.id === exId);
        if (!ex) return;
        const correct = ex.options.indexOf(ex.answer);
        Store.data.punctuationProgress[exId] = { selected, correct };
        if (selected === correct) {
            Store.addPoints(2, '标点练习正确');
            Store.addPetExp(1);
            UI.toast('✅ 正确！+2 💎', 'success');
        } else {
            UI.toast('❌ 再想想', 'warning');
        }
        Store.save();
        App.render();
    },

    // 单元复习
    markUnitReview(unitIndex) {
        const key = 'unit_' + unitIndex;
        const wasDone = Store.data.reviewProgress[key];
        Store.data.reviewProgress[key] = true;
        if (!wasDone) {
            Store.addPoints(5, '单元复习');
            Store.addPetExp(3);
        }
        Store.save();
        UI.toast('✅ 复习记录已保存 +5 💎', 'success');
        App.render();
    },

    startUnitDictation(unitIndex) {
        const unit = COURSE_DATA.chinese.units[unitIndex];
        if (!unit) return;
        App.setTab('words');
        setTimeout(() => {
            const firstLesson = unit.lessons[0];
            if (firstLesson) {
                Modules.setCurrentLesson(firstLesson.title);
            }
        }, 100);
        UI.toast('请在此页进行听写练习', 'info');
    },

    // 错题本
    addMistake() {
        const type = document.getElementById('mistakeType').value;
        const content = document.getElementById('mistakeContent').value.trim();
        if (!content) { UI.toast('请输入错题内容', 'warning'); return; }
        if (!Store.data.mistakeBook) Store.data.mistakeBook = [];
        const today = new Date();
        const dateStr = (today.getMonth()+1) + '/' + today.getDate();
        Store.data.mistakeBook.push({ type, content, date: dateStr });
        Store.save();
        UI.toast('✅ 已添加到错题本', 'success');
        App.render();
    },

    removeMistake(index) {
        if (!Store.data.mistakeBook) return;
        Store.data.mistakeBook.splice(index, 1);
        Store.save();
        App.render();
    },

    // ===== 数学 =====
    math() {
        Store.markModuleUsed('math');
        const data = COURSE_DATA.math;
        const tab = App.currentTab || 'lessons';

        let tabsHtml = `
            <div class="tabs">
                <div class="tab ${tab==='lessons'?'active':''}" onclick="App.setTab('lessons')">📚 单元学习</div>
                <div class="tab ${tab==='practice'?'active':''}" onclick="App.setTab('practice')">🧮 口算练习</div>
                <div class="tab ${tab==='multiply'?'active':''}" onclick="App.setTab('multiply')">✖️ 乘法口诀</div>
            </div>
        `;

        let content = '';

        if (tab === 'lessons') {
            content = data.units.map(unit => {
                const lessons = unit.lessons.map(lesson => {
                    const isDone = Store.data.lessonProgress[lesson.title] === 'done';
                    return `
                        <div class="lesson-card" onclick="Modules.openMathLesson('${lesson.title.replace(/'/g,"\\'")}')">
                            <div class="lesson-header" style="background:${data.gradient};">
                                <div class="lesson-status ${isDone?'done':''}">${isDone?'✓':'🔢'}</div>
                                <div class="lesson-title">${lesson.title}</div>
                                <div class="lesson-subtitle">${lesson.subtitle}</div>
                            </div>
                            <div class="lesson-body">
                                <div class="lesson-content">${lesson.keyPoints}</div>
                                <div class="lesson-tags">
                                    <span class="lesson-tag">+${lesson.points} 💎</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
                return `
                    <div style="margin-bottom:20px;">
                        <h3 style="font-size:16px;font-weight:bold;color:#FFF;margin-bottom:12px;">📦 ${unit.name}</h3>
                        <div class="subject-grid">${lessons}</div>
                    </div>
                `;
            }).join('');
        } else if (tab === 'practice') {
            const mp = Store.data.mathProgress;
            const accuracy = mp.total > 0 ? Math.round(mp.correct / mp.total * 100) : 0;
            content = `
                <div class="lego-panel" style="margin-bottom:16px;">
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center;">
                        <div>
                            <div style="font-size:24px;font-weight:bold;color:#3A3A3A;">${mp.correct}</div>
                            <div style="font-size:12px;color:#666;">答对题数</div>
                        </div>
                        <div>
                            <div style="font-size:24px;font-weight:bold;color:#3A3A3A;">${mp.total}</div>
                            <div style="font-size:12px;color:#666;">总题数</div>
                        </div>
                        <div>
                            <div style="font-size:24px;font-weight:bold;color:${accuracy>=80?'#00852B':accuracy>=60?'#FCD116':'#CE1126'};">${accuracy}%</div>
                            <div style="font-size:12px;color:#666;">正确率</div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-3">
                    <div class="lego-slot" style="text-align:center;cursor:pointer;" onclick="Games.startMathQuiz('add')">
                        <div style="font-size:40px;margin-bottom:8px;">➕</div>
                        <div style="font-size:16px;font-weight:bold;color:#3A3A3A;">加法练习</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">100以内加法</div>
                    </div>
                    <div class="lego-slot" style="text-align:center;cursor:pointer;" onclick="Games.startMathQuiz('sub')">
                        <div style="font-size:40px;margin-bottom:8px;">➖</div>
                        <div style="font-size:16px;font-weight:bold;color:#3A3A3A;">减法练习</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">100以内减法</div>
                    </div>
                    <div class="lego-slot" style="text-align:center;cursor:pointer;" onclick="Games.startMathQuiz('mixed')">
                        <div style="font-size:40px;margin-bottom:8px;">🧮</div>
                        <div style="font-size:16px;font-weight:bold;color:#3A3A3A;">混合运算</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">加减混合挑战</div>
                    </div>
                    <div class="lego-slot" style="text-align:center;cursor:pointer;" onclick="Games.startMathQuiz('mul')">
                        <div style="font-size:40px;margin-bottom:8px;">✖️</div>
                        <div style="font-size:16px;font-weight:bold;color:#3A3A3A;">乘法练习</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">表内乘法</div>
                    </div>
                    <div class="lego-slot" style="text-align:center;cursor:pointer;" onclick="Games.startMathQuiz('div')">
                        <div style="font-size:40px;margin-bottom:8px;">➗</div>
                        <div style="font-size:16px;font-weight:bold;color:#3A3A3A;">除法练习</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">表内除法</div>
                    </div>
                    <div class="lego-slot" style="text-align:center;cursor:pointer;" onclick="Games.startMathQuiz('all')">
                        <div style="font-size:40px;margin-bottom:8px;">🏆</div>
                        <div style="font-size:16px;font-weight:bold;color:#3A3A3A;">综合挑战</div>
                        <div style="font-size:12px;color:#666;margin-top:4px;">全部混合</div>
                    </div>
                </div>
            `;
        } else if (tab === 'multiply') {
            content = `
                <div class="lego-panel" style="margin-bottom:16px;text-align:center;">
                    <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">✖️ 乘法口诀表</h3>
                    <p style="font-size:13px;color:#666;">点击开始背诵挑战，边玩边记！</p>
                    <button class="lego-btn lego-btn-diamond" style="margin-top:10px;" onclick="Games.startMultiplyGame()">🎮 开始口诀大冒险</button>
                </div>
                <div class="lego-panel-dark">
                    ${data.multiplicationTable.map((row, i) => `
                        <div style="font-family:'Fredoka','Nunito',sans-serif;font-size:13px;color:#FCD116;padding:6px 0;border-bottom:1px solid #E0E0E0;">
                            ${row}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        return `
            <div class="fade-in">
                <h1 class="page-title">🔢 数学</h1>
                <p class="page-subtitle">${data.subtitle} · 苏教版二年级</p>
                ${tabsHtml}
                ${content}
            </div>
        `;
    },

    openMathLesson(title) {
        const lesson = COURSE_DATA.math.units.flatMap(u => u.lessons).find(l => l.title === title);
        if (!lesson) return;
        const isDone = Store.data.lessonProgress[title] === 'done';

        const examplesHtml = lesson.examples.map(ex => `
            <div style="padding:10px;margin:6px 0;background:#0057B8;color:#FFF;border:2px solid #E0E0E0;font-size:16px;font-weight:bold;">${ex}</div>
        `).join('');

        UI.modal(lesson.title, `
            <div style="margin-bottom:12px;">
                <strong style="font-size:15px;color:#3A3A3A;">📌 学习要点</strong>
                <p style="margin-top:6px;font-size:14px;color:#555;line-height:1.8;">${lesson.keyPoints}</p>
            </div>
            <div style="margin-bottom:12px;">
                <strong style="font-size:15px;color:#3A3A3A;">💡 例题</strong>
                <div style="margin-top:8px;">${examplesHtml}</div>
            </div>
            <div style="padding:12px;background:#FCD116;color:#333;border:2px solid #E0E0E0;">
                <strong>🎁 完成奖励：</strong>+${lesson.points} 积木币 + 伙伴经验
            </div>
        `, isDone ? '' : `<button class="lego-btn lego-btn-green" onclick="Modules.completeMathLesson('${title.replace(/'/g,"\\'")}')">✅ 标记完成 +${lesson.points}💎</button><button class="lego-btn" onclick="UI.closeModal()">关闭</button>`);
    },

    completeMathLesson(title) {
        Store.data.lessonProgress[title] = 'done';
        const lesson = COURSE_DATA.math.units.flatMap(u => u.lessons).find(l => l.title === title);
        Store.addPoints(lesson.points, '完成数学：' + title);
        Store.addPetExp(10);
        Store.save();
        UI.closeModal();
        UI.toast('🎉 完成数学学习！+' + lesson.points + ' 💎', 'success');
        UI.fireworks();
        App.render();
    },

    // ===== 英语 =====
    english() {
        Store.markModuleUsed('english');
        const data = COURSE_DATA.english;
        const tab = App.currentTab || 'words';

        let tabsHtml = `
            <div class="tabs">
                <div class="tab ${tab==='words'?'active':''}" onclick="App.setTab('words')">📝 单词学习</div>
                <div class="tab ${tab==='sentences'?'active':''}" onclick="App.setTab('sentences')">💬 常用句型</div>
            </div>
        `;

        let content = '';

        if (tab === 'words') {
            content = data.categories.map(cat => {
                const words = cat.words.map(w => {
                    const isLearned = Store.data.vocabProgress['en_'+w.word];
                    return `
                        <div class="vocab-card" style="${isLearned?'border-color:#00852B #006B1F #006B1F #00852B;':''}">
                            <div class="vocab-word" style="font-family:'Fredoka','Nunito',sans-serif;font-size:20px;color:#805ad5;">${w.word}</div>
                            <div class="vocab-pinyin" style="font-size:16px;color:#3A3A3A;font-weight:bold;">${w.meaning}</div>
                            <div class="vocab-example">${w.example}</div>
                            <div style="margin-top:8px;">
                                ${isLearned
                                    ? '<span style="font-size:12px;color:#00852B;font-weight:bold;">✅ 已学习</span>'
                                    : `<button class="lego-btn lego-btn-green" style="font-size:12px;padding:6px 14px;" onclick="Modules.learnEnglishWord('${w.word}')">标记已学 +3💎</button>`
                                }
                            </div>
                        </div>
                    `;
                }).join('');
                const learned = cat.words.filter(w => Store.data.vocabProgress['en_'+w.word]).length;
                return `
                    <div style="margin-bottom:20px;">
                        <h3 style="font-size:16px;font-weight:bold;color:#FFF;margin-bottom:4px;">${cat.icon} ${cat.name}</h3>
                        <p style="font-size:12px;color:#FFF;margin-bottom:12px;opacity:0.8;">已学 ${learned} / ${cat.words.length}</p>
                        <div class="grid grid-3">${words}</div>
                    </div>
                `;
            }).join('');
        } else if (tab === 'sentences') {
            content = `
                <div class="grid grid-2">
                    ${data.sentences.map((s, i) => `
                        <div class="lego-panel">
                            <div style="font-family:'Fredoka','Nunito',sans-serif;font-size:14px;color:#805ad5;margin-bottom:8px;line-height:1.6;">${s.en}</div>
                            <div style="font-size:15px;color:#3A3A3A;font-weight:bold;margin-bottom:6px;">${s.cn}</div>
                            <div style="font-size:13px;color:#666;padding:8px;background:#0057B8;color:#FFF;border:2px solid #E0E0E0;">
                                💡 回答：${s.answer}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top:16px;text-align:center;">
                    <button class="lego-btn lego-btn-diamond" onclick="Games.startWordMatch()">🎮 玩单词消消乐</button>
                </div>
            `;
        }

        return `
            <div class="fade-in">
                <h1 class="page-title">🔤 英语</h1>
                <p class="page-subtitle">小学英语 · 基础词汇与句型</p>
                ${tabsHtml}
                ${content}
            </div>
        `;
    },

    learnEnglishWord(word) {
        Store.data.vocabProgress['en_'+word] = true;
        Store.addPoints(3, '学习英语单词：' + word);
        Store.addPetExp(3);
        Store.save();
        UI.toast('✅ 学会了 "' + word + '" +3 💎', 'success');
        App.render();
    },

    // ===== 劳动 =====
    labor() {
        Store.markModuleUsed('labor');
        const data = COURSE_DATA.labor;
        const customLabor = (Store.data.customTasks && Store.data.customTasks.labor) || [];
        const hiddenPreset = (Store.data.hiddenPreset && Store.data.hiddenPreset.labor) || [];
        const visiblePreset = data.tasks.filter(t => !hiddenPreset.includes(t.name));
        const allTasks = [...visiblePreset, ...customLabor];
        const today = Store.todayKey();
        const todayRecords = Store.data.laborRecords.filter(r => r.date.startsWith(today));
        const reviews = Store.data.pendingReviews || [];

        const tasksHtml = allTasks.map(task => {
            const doneToday = todayRecords.find(r => r.taskName === task.name);
            const pending = reviews.find(r => r.taskType === 'labor' && r.taskName === task.name && r.status === 'pending');

            let actionHtml = '';
            if (doneToday) {
                actionHtml = '<span style="font-size:13px;font-weight:bold;color:#00852B;">✅ 今日已完成</span>';
            } else if (pending) {
                actionHtml = '<span class="task-status-tag pending">⏳ 待审核</span>';
            } else {
                actionHtml = `<button class="lego-btn lego-btn-green" style="font-size:13px;padding:8px 16px;" onclick="Modules.doLabor('${task.name.replace(/'/g,"\\'")}',${task.points},'${task.icon}')">拍照打卡 +${task.points}💎</button>`;
            }

            return `
                <div class="activity-card">
                    <div class="activity-icon bg-dirt">${task.icon}</div>
                    <div class="activity-info">
                        <div class="activity-name">${task.name}</div>
                        <div class="activity-desc">${task.desc} · ${task.frequency} · +${task.points}💎</div>
                    </div>
                    <div class="activity-action">${actionHtml}</div>
                </div>
            `;
        }).join('');

        const totalLabor = Store.data.laborRecords.length;
        const weekRecords = Store.data.laborRecords.filter(r => {
            const d = new Date(r.date);
            const now = new Date();
            return (now - d) < 7 * 24 * 60 * 60 * 1000;
        });

        return `
            <div class="fade-in">
                <h1 class="page-title">🧹 劳动</h1>
                <p class="page-subtitle">劳动最光荣！帮家人做家务，获得积木币奖励</p>

                <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px;">
                    <div class="lego-panel stat-card">
                        <div class="stat-icon-lg bg-dirt">🧹</div>
                        <div class="stat-info"><h3>${totalLabor}</h3><p>总劳动次数</p></div>
                    </div>
                    <div class="lego-panel stat-card">
                        <div class="stat-icon-lg bg-gold">📅</div>
                        <div class="stat-info"><h3>${todayRecords.length}</h3><p>今日完成</p></div>
                    </div>
                    <div class="lego-panel stat-card">
                        <div class="stat-icon-lg bg-emerald">📊</div>
                        <div class="stat-info"><h3>${weekRecords.length}</h3><p>本周完成</p></div>
                    </div>
                </div>

                <div class="lego-panel">
                    <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">📦 劳动任务清单</h3>
                    ${tasksHtml}
                </div>
            </div>
        `;
    },

    doLabor(taskName, points, icon) {
        if (this.hasPendingReview('labor', taskName)) {
            UI.toast('该任务已提交打卡，等待家长审核中', 'warning');
            return;
        }
        this.showPhotoCheckin('labor', taskName, points, icon);
    },

    // ===== 运动 =====
    sports() {
        Store.markModuleUsed('sports');
        const data = COURSE_DATA.sports;
        const customSports = (Store.data.customTasks && Store.data.customTasks.sports) || [];
        const hiddenPreset = (Store.data.hiddenPreset && Store.data.hiddenPreset.sports) || [];
        const visiblePreset = data.activities.filter(t => !hiddenPreset.includes(t.name));
        const allActivities = [...visiblePreset, ...customSports];
        const today = Store.todayKey();
        const todayRecords = Store.data.sportsRecords.filter(r => r.date.startsWith(today));
        const reviews = Store.data.pendingReviews || [];

        const activitiesHtml = allActivities.map(act => {
            const doneToday = todayRecords.find(r => r.activity === act.name);
            const pending = reviews.find(r => r.taskType === 'sports' && r.taskName === act.name && r.status === 'pending');

            let actionHtml = '';
            if (doneToday) {
                actionHtml = `<span style="font-size:13px;font-weight:bold;color:#00852B;">✅ ${doneToday.count}${act.unit}</span>`;
            } else if (pending) {
                actionHtml = '<span class="task-status-tag pending">⏳ 待审核</span>';
            } else {
                actionHtml = `<button class="lego-btn lego-btn-green" style="font-size:13px;padding:8px 16px;" onclick="Modules.doSport('${act.name.replace(/'/g,"\\'")}',${act.points},'${act.icon}',${act.target})">拍照打卡 +${act.points}💎</button>`;
            }

            return `
                <div class="activity-card">
                    <div class="activity-icon bg-grass">${act.icon}</div>
                    <div class="activity-info">
                        <div class="activity-name">${act.name}</div>
                        <div class="activity-desc">目标：${act.target}${act.unit} · +${act.points}💎</div>
                    </div>
                    <div class="activity-action">${actionHtml}</div>
                </div>
            `;
        }).join('');

        const totalSports = Store.data.sportsRecords.length;

        return `
            <div class="fade-in">
                <h1 class="page-title">⚽ 运动</h1>
                <p class="page-subtitle">我运动，我健康！每天锻炼身体好</p>

                <div class="stats-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:16px;">
                    <div class="lego-panel stat-card">
                        <div class="stat-icon-lg bg-grass">🏃</div>
                        <div class="stat-info"><h3>${totalSports}</h3><p>总运动次数</p></div>
                    </div>
                    <div class="lego-panel stat-card">
                        <div class="stat-icon-lg bg-gold">📅</div>
                        <div class="stat-info"><h3>${todayRecords.length}</h3><p>今日完成</p></div>
                    </div>
                </div>

                <div class="lego-panel">
                    <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">📦 运动项目</h3>
                    ${activitiesHtml}
                </div>
            </div>
        `;
    },

    doSport(actName, points, icon, target) {
        if (this.hasPendingReview('sports', actName)) {
            UI.toast('该任务已提交打卡，等待家长审核中', 'warning');
            return;
        }
        this.showPhotoCheckin('sports', actName, points, icon, { target: target });
    },

    // ===== 打卡 =====
    checkin() {
        Store.markModuleUsed('checkin');
        const d = Store.data;
        const today = Store.todayKey();
        const isCheckedIn = d.checkinDates.includes(today);
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = Utils.getDaysInMonth(year, month);
        const firstDay = new Date(year, month, 1).getDay();

        let calendarHtml = '<div class="calendar-header"><div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div></div><div class="checkin-calendar">';
        for (let i = 0; i < firstDay; i++) calendarHtml += '<div></div>';
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const checked = d.checkinDates.includes(dateStr);
            const isToday = dateStr === today;
            calendarHtml += `<div class="calendar-day ${checked?'checked':''} ${isToday?'today':''}">
                <span class="day-num">${day}</span>
                ${checked ? '<span class="day-check">✓</span>' : ''}
            </div>`;
        }
        calendarHtml += '</div>';

        const monthChecked = d.checkinDates.filter(date => date.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)).length;

        return `
            <div class="fade-in">
                <h1 class="page-title">📅 每日签到</h1>
                <p class="page-subtitle">坚持打卡，养成好习惯！连续打卡有额外奖励</p>

                <div class="lego-panel" style="margin-bottom:16px;text-align:center;">
                    <div style="font-size:48px;margin-bottom:8px;">${isCheckedIn?'✅':'📋'}</div>
                    ${isCheckedIn
                        ? `<p style="font-size:18px;font-weight:bold;color:#00852B;">今天已签到！</p><p style="font-size:13px;color:#666;margin-top:4px;">已连续打卡 ${d.streak} 天 🔥</p>`
                        : `<button class="lego-btn lego-btn-gold" style="font-size:18px;padding:14px 36px;margin-top:8px;" onclick="Modules.doCheckin()">📅 立即签到 +5💎</button>
                           <p style="font-size:13px;color:#666;margin-top:8px;">已连续打卡 ${d.streak} 天 🔥</p>`
                    }
                </div>

                <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px;">
                    <div class="lego-panel stat-card">
                        <div class="stat-icon-lg bg-redstone">🔥</div>
                        <div class="stat-info"><h3>${d.streak}</h3><p>连续天数</p></div>
                    </div>
                    <div class="lego-panel stat-card">
                        <div class="stat-icon-lg bg-emerald">📊</div>
                        <div class="stat-info"><h3>${d.checkinDates.length}</h3><p>累计签到</p></div>
                    </div>
                    <div class="lego-panel stat-card">
                        <div class="stat-icon-lg bg-gold">📆</div>
                        <div class="stat-info"><h3>${monthChecked}</h3><p>本月签到</p></div>
                    </div>
                </div>

                <div class="lego-panel">
                    <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">📆 ${year}年${month+1}月签到日历</h3>
                    ${calendarHtml}
                </div>

                <div class="lego-panel" style="margin-top:16px;">
                    <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">🎁 连续打卡奖励</h3>
                    <div style="font-size:14px;color:#555;line-height:2;">
                        🔥 连续 7 天 → 额外 +20 💎<br>
                        🔥 连续 14 天 → 额外 +50 💎<br>
                        🔥 连续 30 天 → 额外 +200 💎 + 伙伴大升级！<br>
                    </div>
                </div>
            </div>
        `;
    },

    doCheckin() {
        const today = Store.todayKey();
        if (Store.data.checkinDates.includes(today)) {
            UI.toast('今天已经签到过了！', 'warning');
            return;
        }

        Store.data.checkinDates.push(today);

        // 计算连续天数
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (Store.data.lastCheckin === yesterday) {
            Store.data.streak++;
        } else {
            Store.data.streak = 1;
        }
        Store.data.lastCheckin = today;

        // 基础奖励
        Store.addPoints(5, '每日签到');
        Store.addPetExp(5);

        // 连续打卡奖励
        if (Store.data.streak === 7) {
            Store.addPoints(20, '连续签到7天奖励');
            UI.toast('🔥 连续签到7天！额外 +20 💎', 'success');
        } else if (Store.data.streak === 14) {
            Store.addPoints(50, '连续签到14天奖励');
            UI.toast('🔥 连续签到14天！额外 +50 💎', 'success');
        } else if (Store.data.streak === 30) {
            Store.addPoints(200, '连续签到30天奖励');
            Store.addPetExp(50);
            UI.toast('👑 连续签到30天！额外 +200 💎 + 伙伴大升级！', 'success');
        } else if (Store.data.streak > 0 && Store.data.streak % 7 === 0) {
            Store.addPoints(20, '连续签到奖励');
            UI.toast('🔥 连续签到' + Store.data.streak + '天！额外 +20 💎', 'success');
        }

        Store.save();
        UI.toast('📅 签到成功！+5 💎', 'success');
        UI.fireworks();
        App.render();
        UI.updateTopbar();
    },

    // ===== 积分 =====
    points() {
        Store.markModuleUsed('points');
        const d = Store.data;
        const history = d.pointsHistory.slice(0, 50);

        const historyHtml = history.length ? history.map(h => {
            const date = new Date(h.date);
            const timeStr = `${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
            return `
                <div class="list-item">
                    <div class="list-item-icon">${h.type === 'plus' ? '💎' : '📦'}</div>
                    <div class="list-item-content">
                        <div class="list-item-title">${h.reason}</div>
                        <div class="list-item-subtitle">${timeStr}</div>
                    </div>
                    <div class="list-item-value ${h.type}">${h.type === 'plus' ? '+' : ''}${h.amount}</div>
                </div>
            `;
        }).join('') : '<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">还没有积分记录</div></div>';

        // 成就徽章
        const badgesHtml = COURSE_DATA.badges.map(b => {
            const earned = d.badges.includes(b.id);
            return `
                <div class="badge-item ${earned?'earned':'locked'}">
                    <div class="badge-icon">${b.icon}</div>
                    <div class="badge-name">${b.name}</div>
                    <div class="badge-desc">${b.desc}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="fade-in">
                <h1 class="page-title">💎 积木币</h1>
                <p class="page-subtitle">你的学习财富 · 累计获得 ${d.totalPoints} 积木币</p>

                <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px;">
                    <div class="lego-panel stat-card">
                        <div class="stat-icon-lg bg-emerald">💎</div>
                        <div class="stat-info"><h3>${d.points}</h3><p>当前积木币</p></div>
                    </div>
                    <div class="lego-panel stat-card">
                        <div class="stat-icon-lg bg-gold">🏆</div>
                        <div class="stat-info"><h3>${d.totalPoints}</h3><p>累计获得</p></div>
                    </div>
                    <div class="lego-panel stat-card">
                        <div class="stat-icon-lg bg-diamond">🏅</div>
                        <div class="stat-info"><h3>${d.badges.length}</h3><p>已获徽章</p></div>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="lego-panel">
                        <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">📊 积分明细</h3>
                        ${historyHtml}
                    </div>
                    <div class="lego-panel">
                        <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">🏅 成就徽章 (${d.badges.length}/${COURSE_DATA.badges.length})</h3>
                        <div class="badge-grid">${badgesHtml}</div>
                    </div>
                </div>
            </div>
        `;
    },

    // ===== 奖励商店 =====
    rewards() {
        Store.markModuleUsed('rewards');
        const d = Store.data;
        const customRewards = (Store.data.customTasks && Store.data.customTasks.rewards) || [];
        const hiddenPreset = (Store.data.hiddenPreset && Store.data.hiddenPreset.rewards) || [];
        const visiblePreset = COURSE_DATA.rewards.filter(r => !hiddenPreset.includes(r.id));
        const allRewards = [...visiblePreset, ...customRewards];
        const rewardsHtml = allRewards.map(r => {
            const canAfford = d.points >= r.cost;
            return `
                <div class="reward-card">
                    <div class="reward-icon">${r.icon}</div>
                    <div class="reward-name">${r.name}</div>
                    <div class="reward-desc">${r.desc}</div>
                    <div class="reward-cost">💎 ${r.cost}</div>
                    <button class="reward-btn" ${canAfford?'':'disabled'} onclick="Modules.buyReward('${r.id}')">
                        ${canAfford ? '兑换' : '积木币不足'}
                    </button>
                </div>
            `;
        }).join('');

        const redeemHistory = d.rewardHistory.slice(0, 10);
        const historyHtml = redeemHistory.length ? redeemHistory.map(h => {
            const date = new Date(h.date);
            return `
                <div class="list-item">
                    <div class="list-item-icon">🎁</div>
                    <div class="list-item-content">
                        <div class="list-item-title">${h.name}</div>
                        <div class="list-item-subtitle">${date.getMonth()+1}月${date.getDate()}日</div>
                    </div>
                    <div class="list-item-value minus">-${h.cost}</div>
                </div>
            `;
        }).join('') : '<div class="empty-state"><div class="empty-icon">📦</div><div class="empty-text">还没有兑换记录</div></div>';

        return `
            <div class="fade-in">
                <h1 class="page-title">🎁 交易商店</h1>
                <p class="page-subtitle">用积木币兑换奖励 · 当前拥有 ${d.points} 💎</p>

                <div class="lego-panel" style="margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div class="stat-icon-lg bg-emerald" style="width:48px;height:48px;font-size:24px;">💎</div>
                        <div>
                            <div style="font-size:28px;font-weight:bold;color:#3A3A3A;">${d.points}</div>
                            <div style="font-size:13px;color:#666;">可用积木币</div>
                        </div>
                    </div>
                    <button class="lego-btn lego-btn-gold" onclick="App.navigate('plan')">📋 去做任务赚积木币</button>
                </div>

                <div class="reward-grid" style="margin-bottom:16px;">${rewardsHtml}</div>

                <div class="lego-panel">
                    <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">📦 兑换记录</h3>
                    ${historyHtml}
                </div>
            </div>
        `;
    },

    buyReward(rewardId) {
        const customRewards = (Store.data.customTasks && Store.data.customTasks.rewards) || [];
        const reward = [...COURSE_DATA.rewards, ...customRewards].find(r => r.id === rewardId);
        if (!reward) return;
        if (Store.data.points < reward.cost) {
            UI.toast('积木币不足！', 'error');
            return;
        }

        UI.confirm(`确定要花 ${reward.cost} 💎 兑换「${reward.name}」吗？`, () => {
            Store.data.points -= reward.cost;
            Store.data.pointsHistory.unshift({
                date: new Date().toISOString(),
                amount: -reward.cost,
                reason: '兑换奖励：' + reward.name,
                type: 'minus'
            });
            Store.data.rewardHistory.unshift({
                date: new Date().toISOString(),
                rewardId, name: reward.name, cost: reward.cost
            });
            Store.save();
            UI.updateTopbar();
            UI.toast('🎉 兑换成功！' + reward.name, 'success');
            UI.fireworks();
            App.render();

            // 弹出兑换券
            UI.modal('🎉 兑换成功！', `
                <div style="text-align:center;padding:20px;">
                    <div style="font-size:64px;margin-bottom:12px;">${reward.icon}</div>
                    <h3 style="font-size:20px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">${reward.name}</h3>
                    <p style="font-size:14px;color:#666;margin-bottom:16px;">${reward.desc}</p>
                    <div style="padding:16px;background:#FCD116;color:#333;border:3px solid #E0E0E0;font-size:14px;">
                        请找爸爸妈妈领取奖励吧！<br>
                        消耗了 ${reward.cost} 💎 积木币
                    </div>
                </div>
            `, `<button class="lego-btn lego-btn-green" onclick="UI.closeModal()">太棒了！</button>`);
        });
    },

    // ===== 萌宠 =====
    pet() {
        Store.markModuleUsed('pet');
        const d = Store.data;
        const pet = d.pet;
        const evo = COURSE_DATA.petEvolution.find(e => e.level === pet.level);
        const nextEvo = COURSE_DATA.petEvolution.find(e => e.level === pet.level + 1);
        const expPercent = nextEvo ? Math.round((pet.exp - evo.minExp) / (nextEvo.minExp - evo.minExp) * 100) : 100;

        const evolutionPath = COURSE_DATA.petEvolution.map(e => {
            const isCurrent = e.level === pet.level;
            const isPast = e.level < pet.level;
            return `
                <div style="display:flex;align-items:center;gap:8px;padding:8px;border:2px solid ${isCurrent?'#FCD116':isPast?'#00852B':'#E0E0E0'};background:${isCurrent?'#FFF8C4':isPast?'#D4F4D4':'#F5F5F5'};margin-bottom:4px;">
                    <span style="font-size:28px;${!isPast && !isCurrent?'filter:grayscale(1);opacity:0.4;':''}">${e.emoji}</span>
                    <div>
                        <div style="font-size:13px;font-weight:bold;color:#3A3A3A;">Lv.${e.level} ${e.name}</div>
                        <div style="font-size:11px;color:#666;">${e.minExp} 经验</div>
                    </div>
                    ${isCurrent ? '<span style="margin-left:auto;font-size:12px;font-weight:bold;color:#B8860B;">当前</span>' : ''}
                    ${isPast ? '<span style="margin-left:auto;font-size:16px;">✅</span>' : ''}
                </div>
            `;
        }).join('');

        const now = Date.now();
        const canFeed = !pet.lastFeed || (now - new Date(pet.lastFeed).getTime()) > 2 * 60 * 60 * 1000; // 2小时
        const canPlay = !pet.lastPlay || (now - new Date(pet.lastPlay).getTime()) > 1 * 60 * 60 * 1000; // 1小时

        return `
            <div class="fade-in">
                <h1 class="page-title">🐾 伙伴</h1>
                <p class="page-subtitle">你的学习伙伴 · 一起成长，一起进化！</p>

                <div class="pet-stage">
                    <div class="pet-avatar">${evo.emoji}</div>
                    <div class="pet-info">
                        <div class="pet-name">${evo.name}</div>
                        <div class="pet-level">Lv.${pet.level} · ${nextEvo ? '距离进化还需要 ' + (nextEvo.minExp - pet.exp) + ' 经验' : '已达到最高形态！'}</div>
                        <div class="pet-exp-bar"><div class="pet-exp-fill" style="width:${expPercent}%"></div></div>
                        <div class="pet-mood">😊 心情：${pet.mood}% ${pet.mood >= 80 ? '开心' : pet.mood >= 50 ? '一般' : '需要关爱'}</div>
                    </div>
                    <div class="pet-actions">
                        <button class="pet-action-btn" ${canFeed?'':'disabled'} onclick="Modules.feedPet()">
                            🍖 喂食 ${canFeed?'':'(冷却中)'}
                        </button>
                        <button class="pet-action-btn" ${canPlay?'':'disabled'} onclick="Modules.playPet()">
                            🎾 玩耍 ${canPlay?'':'(冷却中)'}
                        </button>
                    </div>
                </div>

                <div class="grid grid-2" style="margin-top:16px;">
                    <div class="lego-panel">
                        <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">📊 伙伴状态</h3>
                        <div style="font-size:14px;color:#555;line-height:2;">
                            🏅 等级：Lv.${pet.level}<br>
                            💡 经验值：${pet.exp}${nextEvo ? ' / ' + nextEvo.minExp : ''}<br>
                            😊 心情值：${pet.mood}%<br>
                            🍖 上次喂食：${pet.lastFeed ? new Date(pet.lastFeed).toLocaleString('zh-CN') : '还未喂过'}<br>
                            🎾 上次玩耍：${pet.lastPlay ? new Date(pet.lastPlay).toLocaleString('zh-CN') : '还未玩过'}
                        </div>
                        <div class="lego-divider"></div>
                        <p style="font-size:13px;color:#666;">💬 ${evo.desc}</p>
                        <p style="font-size:12px;color:#999;margin-top:8px;">💡 完成学习任务、打卡、运动都能获得伙伴经验！</p>
                    </div>

                    <div class="lego-panel">
                        <h3 style="font-size:16px;font-weight:bold;color:#3A3A3A;margin-bottom:12px;">🔄 进化路径</h3>
                        ${evolutionPath}
                    </div>
                </div>
            </div>
        `;
    },

    feedPet() {
        const pet = Store.data.pet;
        if (Store.data.points < 5) {
            UI.toast('需要 5 💎 来购买食物', 'error');
            return;
        }
        pet.lastFeed = new Date().toISOString();
        pet.mood = Math.min(100, pet.mood + 20);
        Store.addPetExp(10);
        Store.addPoints(-5, '购买伙伴食物');
        Store.save();
        UI.toast('🍖 喂食成功！伙伴心情 +20，经验 +10', 'success');
        App.render();
        UI.updateTopbar();
    },

    playPet() {
        const pet = Store.data.pet;
        pet.lastPlay = new Date().toISOString();
        pet.mood = Math.min(100, pet.mood + 15);
        Store.addPetExp(15);
        Store.save();
        UI.toast('🎾 和伙伴玩耍！心情 +15，经验 +15', 'success');
        UI.fireworks();
        App.render();
    },

    // ===== 游戏 =====
    games() {
        Store.markModuleUsed('games');
        const gamesHtml = COURSE_DATA.games.map(g => `
            <div class="game-card" onclick="Games.start('${g.id}')">
                <div class="game-cover ${g.color}">${g.icon}</div>
                <div class="game-info">
                    <div class="game-name">${g.name}</div>
                    <div class="game-desc">${g.desc}</div>
                    <span class="game-tag">${g.tag} · +${g.points}💎</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="fade-in">
                <h1 class="page-title">🎮 小游戏</h1>
                <p class="page-subtitle">边玩边学，赢取积木币！已玩游戏 ${Store.data.gamesPlayed} 次</p>
                <div class="game-grid">${gamesHtml}</div>
            </div>
        `;
    },

    // ===== 拍照打卡 =====
    _checkinMedia: null,
    _checkinExtra: null,

    showPhotoCheckin(taskType, taskName, points, icon, extraData) {
        this._checkinMedia = null;
        this._checkinExtra = Object.assign({ taskType, taskName, points, icon }, extraData || {});
        UI.modal('📸 打卡验证', `
            <div style="text-align:center;padding:12px 0;">
                <div style="font-size:48px;margin-bottom:8px;">${icon || '📸'}</div>
                <h3 style="font-size:18px;font-weight:700;color:#2C2C2C;margin-bottom:6px;">${taskName}</h3>
                <p style="font-size:14px;color:#888;margin-bottom:16px;">完成后请拍照或录视频打卡，家长审核通过后获得 ${points} 积木币</p>

                <div class="checkin-photo-area" id="checkinPhotoArea">
                    <div style="font-size:40px;">📷</div>
                    <p style="font-size:13px;color:#999;margin-top:8px;">点击下方按钮拍照/选择照片</p>
                </div>
                <div id="checkinPhotoPreview" class="checkin-photo-preview" style="display:none;"></div>

                <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                    <label class="lego-btn lego-btn-blue" style="cursor:pointer;font-size:13px;padding:10px 20px;">
                        📷 拍照
                        <input type="file" accept="image/*" capture="environment" style="display:none;" onchange="Modules.handleCheckinPhoto(event,'photo')">
                    </label>
                    <label class="lego-btn lego-btn-purple" style="cursor:pointer;font-size:13px;padding:10px 20px;">
                        🎬 录视频
                        <input type="file" accept="video/*" capture="environment" style="display:none;" onchange="Modules.handleCheckinPhoto(event,'video')">
                    </label>
                    <button class="lego-btn" style="font-size:13px;padding:10px 20px;" onclick="Modules.handleCheckinPhoto(null,'none')">
                        📝 仅文字
                    </button>
                </div>

                <div style="margin-top:12px;">
                    <textarea id="checkinNote" placeholder="说点什么吧（选填）..." style="width:100%;min-height:50px;padding:10px;border:2px solid #E0E0E0;border-radius:10px;font-size:14px;resize:none;font-family:inherit;outline:none;"></textarea>
                </div>
            </div>
        `, `<button class="lego-btn lego-btn-green" onclick="Modules.submitCheckin()">✅ 提交打卡</button>
           <button class="lego-btn" onclick="UI.closeModal()">取消</button>`);
    },

    handleCheckinPhoto(event, type) {
        if (type === 'none') {
            this._checkinMedia = { data: null, type: 'none' };
            const preview = document.getElementById('checkinPhotoPreview');
            const area = document.getElementById('checkinPhotoArea');
            if (area) area.style.display = 'none';
            if (preview) {
                preview.style.display = 'block';
                preview.innerHTML = '<div style="text-align:center;padding:16px;color:#999;background:#F5F5F5;border-radius:10px;">📝 文字打卡（无照片/视频）</div>';
            }
            return;
        }

        const file = event.target.files[0];
        if (!file) return;

        const maxSize = type === 'video' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            UI.toast(type === 'video' ? '视频不能超过10MB' : '照片不能超过5MB', 'error');
            return;
        }

        if (type === 'photo') {
            // 压缩图片，减少同步数据量
            this.compressImage(file, 640, 0.7).then(compressed => {
                this._checkinMedia = { data: compressed, type: 'photo' };
                const preview = document.getElementById('checkinPhotoPreview');
                const area = document.getElementById('checkinPhotoArea');
                if (area) area.style.display = 'none';
                if (preview) {
                    preview.style.display = 'block';
                    preview.innerHTML = `<img src="${compressed}" style="max-width:100%;max-height:200px;border-radius:10px;object-fit:cover;">`;
                }
            }).catch(err => {
                console.error('Image compress error:', err);
                UI.toast('图片处理失败，请重试', 'error');
            });
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                this._checkinMedia = { data: e.target.result, type: type };
                const preview = document.getElementById('checkinPhotoPreview');
                const area = document.getElementById('checkinPhotoArea');
                if (area) area.style.display = 'none';
                if (preview) {
                    preview.style.display = 'block';
                    if (type === 'video') {
                        preview.innerHTML = `<video src="${e.target.result}" controls style="max-width:100%;max-height:200px;border-radius:10px;"></video>`;
                    } else {
                        preview.innerHTML = `<img src="${e.target.result}" style="max-width:100%;max-height:200px;border-radius:10px;object-fit:cover;">`;
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    },

    // 压缩图片：缩小尺寸 + JPEG压缩
    compressImage(file, maxSize, quality) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let w = img.width, h = img.height;
                    if (w > maxSize || h > maxSize) {
                        if (w > h) {
                            h = Math.round(h * maxSize / w);
                            w = maxSize;
                        } else {
                            w = Math.round(w * maxSize / h);
                            h = maxSize;
                        }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    submitCheckin() {
        if (!this._checkinMedia) {
            UI.toast('请先拍照、录视频或选择文字打卡！', 'warning');
            return;
        }

        const note = document.getElementById('checkinNote') ? document.getElementById('checkinNote').value.trim() : '';
        const extra = this._checkinExtra || {};

        const review = {
            id: 'r_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            taskType: extra.taskType || 'plan',
            taskName: extra.taskName || '',
            points: extra.points || 0,
            mediaData: this._checkinMedia.data,
            mediaType: this._checkinMedia.type,
            note: note,
            date: new Date().toISOString(),
            status: 'pending',
            icon: extra.icon || '📋'
        };

        if (extra.taskIndex !== undefined) review.taskIndex = extra.taskIndex;
        if (extra.target !== undefined) review.target = extra.target;

        Store.data.pendingReviews = Store.data.pendingReviews || [];
        Store.data.pendingReviews.unshift(review);
        Store.save();

        this._checkinMedia = null;
        this._checkinExtra = null;
        UI.closeModal();
        UI.toast('📸 打卡已提交，等待家长审核！', 'success');

        if (typeof Parent !== 'undefined') {
            Parent.updateReviewBadge();
        }

        App.render();
    },

    // 检查某任务是否已有待审核的打卡
    hasPendingReview(taskType, taskName) {
        return (Store.data.pendingReviews || []).some(r =>
            r.taskType === taskType && r.taskName === taskName && r.status === 'pending'
        );
    },

    // 检查某任务是否已通过审核
    hasApprovedReview(taskType, taskName) {
        return (Store.data.pendingReviews || []).some(r =>
            r.taskType === taskType && r.taskName === taskName && r.status === 'approved'
        );
    }
};

// ===== 游戏引擎 =====
const Games = {
    start(gameId) {
        switch (gameId) {
            case 'g1': this.startMathQuiz('all'); break;
            case 'g2': this.startMultiplyGame(); break;
            case 'g3': this.startWordMatch(); break;
            case 'g4': this.startPoemPuzzle(); break;
            case 'g5': this.start24Game(); break;
            case 'g6': this.startCharMatch(); break;
        }
    },

    // 口算大挑战
    mathState: null,

    startMathQuiz(mode) {
        this.mathState = {
            mode, score: 0, correct: 0, wrong: 0, total: 0,
            currentQ: null, timeLeft: 60, timer: null
        };
        this.nextMathQuestion();
    },

    nextMathQuestion() {
        const s = this.mathState;
        if (!s) return;
        let a, b, op, answer;
        const mode = s.mode;

        if (mode === 'add' || (mode === 'all' && Math.random() < 0.25)) {
            a = Utils.randInt(10, 50); b = Utils.randInt(10, 49); op = '+'; answer = a + b;
        } else if (mode === 'sub' || (mode === 'all' && Math.random() < 0.25)) {
            a = Utils.randInt(20, 99); b = Utils.randInt(1, a); op = '-'; answer = a - b;
        } else if (mode === 'mul' || (mode === 'all' && Math.random() < 0.25)) {
            a = Utils.randInt(2, 9); b = Utils.randInt(2, 9); op = '×'; answer = a * b;
        } else if (mode === 'div' || mode === 'all') {
            b = Utils.randInt(2, 9); answer = Utils.randInt(2, 9); a = b * answer; op = '÷';
        } else {
            a = Utils.randInt(10, 50); b = Utils.randInt(10, 49); op = '+'; answer = a + b;
        }

        s.currentQ = { a, b, op, answer };
        s.timeLeft = 60;

        this.renderMathQuiz();

        if (s.timer) clearInterval(s.timer);
        s.timer = setInterval(() => {
            s.timeLeft--;
            const timerEl = document.getElementById('quizTimer');
            if (timerEl) {
                timerEl.textContent = s.timeLeft;
                if (s.timeLeft <= 10) timerEl.style.color = '#CE1126';
            }
            if (s.timeLeft <= 0) this.endMathQuiz();
        }, 1000);
    },

    renderMathQuiz() {
        const s = this.mathState;
        const q = s.currentQ;
        const accuracy = s.total > 0 ? Math.round(s.correct / s.total * 100) : 100;

        App.content.innerHTML = `
            <div class="fade-in">
                <h1 class="page-title">🧮 口算大挑战</h1>
                <p class="page-subtitle">60秒内尽可能多地答题！每答对1题 +2💎</p>
                <div class="math-quiz">
                    <div class="quiz-stats">
                        <div class="quiz-stat"><div class="label">⏱ 时间</div><div class="value" id="quizTimer">${s.timeLeft}</div></div>
                        <div class="quiz-stat"><div class="label">✅ 答对</div><div class="value" style="color:#00852B;">${s.correct}</div></div>
                        <div class="quiz-stat"><div class="label">❌ 答错</div><div class="value" style="color:#CE1126;">${s.wrong}</div></div>
                        <div class="quiz-stat"><div class="label">📊 正确率</div><div class="value">${accuracy}%</div></div>
                    </div>
                    <div class="quiz-question">${q.a} ${q.op} ${q.b} = ?</div>
                    <input type="number" class="quiz-input" id="quizInput" autofocus
                        onkeyup="if(event.key==='Enter') Games.checkMathAnswer()"
                        placeholder="?" autocomplete="off">
                    <div style="margin-top:16px;">
                        <button class="lego-btn lego-btn-green" onclick="Games.checkMathAnswer()">提交答案</button>
                        <button class="lego-btn lego-btn-red" onclick="Games.endMathQuiz()">结束</button>
                    </div>
                </div>
            </div>
        `;
        setTimeout(() => {
            const input = document.getElementById('quizInput');
            if (input) input.focus();
        }, 100);
    },

    checkMathAnswer() {
        const s = this.mathState;
        if (!s || !s.currentQ) return;
        const input = document.getElementById('quizInput');
        if (!input) return;
        const userAnswer = parseInt(input.value);
        if (isNaN(userAnswer)) return;

        s.total++;
        Store.data.mathProgress.total++;

        if (userAnswer === s.currentQ.answer) {
            s.correct++;
            s.score += 2;
            Store.data.mathProgress.correct++;
            Store.data.mathProgress.streak++;
            input.classList.add('correct');
            UI.toast('✅ 正确！+2💎', 'success', 800);
        } else {
            s.wrong++;
            Store.data.mathProgress.streak = 0;
            input.classList.add('wrong');
            UI.toast('❌ 答案是 ' + s.currentQ.answer, 'error', 1000);
        }

        Store.save();
        Store.checkBadges();

        setTimeout(() => this.nextMathQuestion(), 600);
    },

    endMathQuiz() {
        const s = this.mathState;
        if (!s) return;
        if (s.timer) clearInterval(s.timer);

        const earned = s.correct * 2;
        if (earned > 0) {
            Store.addPoints(earned, '口算挑战答对' + s.correct + '题');
            Store.addPetExp(s.correct * 3);
        }
        Store.data.gamesPlayed++;
        Store.save();
        Store.checkBadges();

        const accuracy = s.total > 0 ? Math.round(s.correct / s.total * 100) : 0;
        const stars = accuracy >= 90 ? '⭐⭐⭐' : accuracy >= 70 ? '⭐⭐' : accuracy >= 50 ? '⭐' : '';

        App.content.innerHTML = `
            <div class="fade-in">
                <div class="math-quiz">
                    <div style="font-size:48px;margin-bottom:8px;">${accuracy >= 80 ? '🎉' : accuracy >= 50 ? '💪' : '📚'}</div>
                    <h2 style="font-size:24px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">挑战结束！</h2>
                    <div style="font-size:32px;margin:12px 0;">${stars}</div>
                    <div class="quiz-stats">
                        <div class="quiz-stat"><div class="label">✅ 答对</div><div class="value" style="color:#00852B;">${s.correct}</div></div>
                        <div class="quiz-stat"><div class="label">❌ 答错</div><div class="value" style="color:#CE1126;">${s.wrong}</div></div>
                        <div class="quiz-stat"><div class="label">📊 正确率</div><div class="value">${accuracy}%</div></div>
                        <div class="quiz-stat"><div class="label">💎 获得</div><div class="value" style="color:#FCD116;">+${earned}</div></div>
                    </div>
                    <div style="margin-top:20px;display:flex;gap:10px;justify-content:center;">
                        <button class="lego-btn lego-btn-green" onclick="Games.startMathQuiz('${s.mode}')">🔄 再来一次</button>
                        <button class="lego-btn" onclick="App.navigate('games')">返回游戏列表</button>
                    </div>
                </div>
            </div>
        `;

        if (accuracy >= 80) UI.fireworks();
        this.mathState = null;
        UI.updateTopbar();
    },

    // 乘法口诀大冒险
    startMultiplyGame() {
        const questions = [];
        for (let i = 1; i <= 9; i++) {
            for (let j = i; j <= 9; j++) {
                questions.push({ a: i, b: j, answer: i * j });
            }
        }
        const shuffled = Utils.shuffle(questions).slice(0, 15);
        this.mulState = { questions: shuffled, index: 0, correct: 0, score: 0 };
        this.nextMultiplyQuestion();
    },

    nextMultiplyQuestion() {
        const s = this.mulState;
        if (!s) return;
        if (s.index >= s.questions.length) { this.endMultiplyGame(); return; }
        const q = s.questions[s.index];

        App.content.innerHTML = `
            <div class="fade-in">
                <h1 class="page-title">✖️ 乘法口诀大冒险</h1>
                <p class="page-subtitle">第 ${s.index + 1} / ${s.questions.length} 关 · 答对 ${s.correct} 题</p>
                <div class="math-quiz">
                    <div class="quiz-stats">
                        <div class="quiz-stat"><div class="label">📍 关卡</div><div class="value">${s.index+1}/${s.questions.length}</div></div>
                        <div class="quiz-stat"><div class="label">✅ 答对</div><div class="value" style="color:#00852B;">${s.correct}</div></div>
                    </div>
                    <div class="quiz-question">${q.a} × ${q.b} = ?</div>
                    <input type="number" class="quiz-input" id="mulInput" autofocus
                        onkeyup="if(event.key==='Enter') Games.checkMultiplyAnswer()"
                        placeholder="?" autocomplete="off">
                    <div style="margin-top:16px;">
                        <button class="lego-btn lego-btn-green" onclick="Games.checkMultiplyAnswer()">提交</button>
                        <button class="lego-btn lego-btn-red" onclick="Games.endMultiplyGame()">放弃</button>
                    </div>
                </div>
            </div>
        `;
        setTimeout(() => { const el = document.getElementById('mulInput'); if (el) el.focus(); }, 100);
    },

    checkMultiplyAnswer() {
        const s = this.mulState;
        if (!s) return;
        const input = document.getElementById('mulInput');
        if (!input) return;
        const ans = parseInt(input.value);
        if (isNaN(ans)) return;
        const q = s.questions[s.index];

        if (ans === q.answer) {
            s.correct++;
            s.score += 2;
            input.classList.add('correct');
            UI.toast('✅ ' + q.a + '×' + q.b + '=' + q.answer + ' 正确！', 'success', 800);
        } else {
            input.classList.add('wrong');
            UI.toast('❌ ' + q.a + '×' + q.b + '=' + q.answer, 'error', 1000);
        }
        s.index++;
        setTimeout(() => this.nextMultiplyQuestion(), 700);
    },

    endMultiplyGame() {
        const s = this.mulState;
        if (!s) return;
        const earned = s.score;
        if (earned > 0) {
            Store.addPoints(earned, '乘法口诀大冒险');
            Store.addPetExp(s.correct * 4);
        }
        Store.data.gamesPlayed++;
        Store.save();
        Store.checkBadges();

        const accuracy = Math.round(s.correct / s.questions.length * 100);
        App.content.innerHTML = `
            <div class="fade-in">
                <div class="math-quiz">
                    <div style="font-size:48px;margin-bottom:8px;">${accuracy >= 80 ? '🎉' : '💪'}</div>
                    <h2 style="font-size:24px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">大冒险完成！</h2>
                    <div class="quiz-stats">
                        <div class="quiz-stat"><div class="label">✅ 答对</div><div class="value" style="color:#00852B;">${s.correct}</div></div>
                        <div class="quiz-stat"><div class="label">📊 正确率</div><div class="value">${accuracy}%</div></div>
                        <div class="quiz-stat"><div class="label">💎 获得</div><div class="value" style="color:#FCD116;">+${earned}</div></div>
                    </div>
                    <div style="margin-top:20px;display:flex;gap:10px;justify-content:center;">
                        <button class="lego-btn lego-btn-green" onclick="Games.startMultiplyGame()">🔄 再来一次</button>
                        <button class="lego-btn" onclick="App.navigate('games')">返回</button>
                    </div>
                </div>
            </div>
        `;
        if (accuracy >= 80) UI.fireworks();
        this.mulState = null;
        UI.updateTopbar();
    },

    // 单词消消乐
    startWordMatch() {
        const allWords = [];
        COURSE_DATA.english.categories.forEach(cat => {
            cat.words.forEach(w => allWords.push(w));
        });
        const selected = Utils.shuffle(allWords).slice(0, 6);
        this.wordState = { words: selected, matched: [], selected: null, score: 0, attempts: 0 };

        this.renderWordMatch();
    },

    renderWordMatch() {
        const s = this.wordState;
        if (!s) return;
        const cards = [];
        s.words.forEach((w, i) => {
            cards.push({ id: 'en_'+i, text: w.word, type: 'en', pairId: i });
            cards.push({ id: 'cn_'+i, text: w.meaning, type: 'cn', pairId: i });
        });
        const shuffled = Utils.shuffle(cards);

        App.content.innerHTML = `
            <div class="fade-in">
                <h1 class="page-title">🔗 单词消消乐</h1>
                <p class="page-subtitle">点击配对英文单词和中文意思 · 已配对 ${s.matched.length}/6</p>
                <div class="lego-panel" style="text-align:center;margin-bottom:16px;">
                    <span style="font-size:14px;color:#666;">尝试次数：${s.attempts}</span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:600px;margin:0 auto;">
                    ${shuffled.map(c => {
                        const isMatched = s.matched.includes(c.pairId);
                        const isSelected = s.selected && s.selected.id === c.id;
                        return `
                            <div class="lego-slot" style="
                                text-align:center;padding:16px 8px;cursor:pointer;
                                ${isMatched ? 'opacity:0.3;background:#555;' : ''}
                                ${isSelected ? 'border-color:#FCD116 #B8860B #B8860B #FCD116;background:#FFF8C4;' : ''}
                                font-size:${c.type==='en'?'14px':'16px'};
                                font-weight:bold;color:#3A3A3A;
                                font-family:${c.type==='en'?"'Press Start 2P',monospace":'inherit'};
                            " onclick="${isMatched?'':'Games.selectWordCard(\''+c.id+'\','+c.pairId+',\''+c.type+'\')'}">
                                ${isMatched ? '✅' : c.text}
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="text-align:center;margin-top:20px;">
                    <button class="lego-btn lego-btn-red" onclick="Games.endWordMatch()">结束游戏</button>
                </div>
            </div>
        `;
    },

    selectWordCard(id, pairId, type) {
        const s = this.wordState;
        if (!s) return;
        if (!s.selected) {
            s.selected = { id, pairId, type };
            this.renderWordMatch();
        } else {
            if (s.selected.id === id) return;
            s.attempts++;
            if (s.selected.pairId === pairId && s.selected.type !== type) {
                s.matched.push(pairId);
                s.score += 5;
                UI.toast('✅ 配对成功！+5💎', 'success', 800);
                s.selected = null;
                if (s.matched.length === 6) {
                    setTimeout(() => this.endWordMatch(true), 500);
                    return;
                }
            } else {
                UI.toast('❌ 不匹配，再试试', 'error', 800);
                s.selected = null;
            }
            this.renderWordMatch();
        }
    },

    endWordMatch(complete = false) {
        const s = this.wordState;
        if (!s) return;
        const earned = s.score;
        if (earned > 0) {
            Store.addPoints(earned, '单词消消乐');
            Store.addPetExp(s.score);
        }
        Store.data.gamesPlayed++;
        Store.save();
        Store.checkBadges();

        if (complete) UI.fireworks();
        UI.toast(`${complete?'🎉 全部配对完成！':'游戏结束'} 获得 ${earned} 💎`, 'success');

        App.navigate('games');
        this.wordState = null;
        UI.updateTopbar();
    },

    // 古诗拼拼乐
    startPoemPuzzle() {
        const poems = COURSE_DATA.chinese.poems;
        const poem = poems[Utils.randInt(0, poems.length - 1)];
        const lines = poem.content.split(/[，。！？]/).filter(l => l.trim());
        const allChars = poem.content.replace(/[，。！？\s]/g, '').split('');
        const shuffled = Utils.shuffle(allChars);
        this.poemState = { poem, chars: shuffled, original: allChars, selected: [], correct: 0 };

        App.content.innerHTML = `
            <div class="fade-in">
                <h1 class="page-title">📜 古诗拼拼乐</h1>
                <p class="page-subtitle">把打乱的字按顺序拼回去！</p>
                <div class="lego-panel" style="margin-bottom:16px;text-align:center;">
                    <h3 style="font-size:18px;font-weight:bold;color:#3A3A3A;">${poem.title} · ${poem.author}</h3>
                    <p style="font-size:13px;color:#666;margin-top:4px;">按正确顺序点击下面的字</p>
                </div>
                <div class="lego-panel" style="margin-bottom:16px;text-align:center;min-height:60px;">
                    <div id="puzzleResult" style="font-size:20px;font-weight:bold;color:#3A3A3A;letter-spacing:4px;"></div>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:600px;margin:0 auto;">
                    ${shuffled.map((ch, i) => `
                        <div class="lego-slot" style="width:50px;height:50px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:bold;cursor:pointer;" id="puzzleChar${i}" onclick="Games.selectPuzzleChar(${i})">
                            ${ch}
                        </div>
                    `).join('')}
                </div>
                <div style="text-align:center;margin-top:20px;">
                    <button class="lego-btn lego-btn-gold" onclick="Games.startPoemPuzzle()">换一首</button>
                    <button class="lego-btn lego-btn-red" onclick="App.navigate('games')">返回</button>
                </div>
            </div>
        `;
    },

    selectPuzzleChar(idx) {
        const s = this.poemState;
        if (!s) return;
        const el = document.getElementById('puzzleChar' + idx);
        if (!el || el.style.opacity === '0.3') return;

        s.selected.push(s.chars[idx]);
        el.style.opacity = '0.3';
        el.style.pointerEvents = 'none';

        const resultEl = document.getElementById('puzzleResult');
        resultEl.textContent = s.selected.join('');

        // 检查是否正确
        const currentStr = s.selected.join('');
        const originalStr = s.original.join('');
        if (currentStr === originalStr) {
            // 完成
            Store.addPoints(15, '古诗拼拼乐');
            Store.addPetExp(15);
            Store.data.gamesPlayed++;
            Store.save();
            Store.checkBadges();
            UI.toast('🎉 拼对了！+15 💎', 'success');
            UI.fireworks();
            resultEl.innerHTML = '✅ ' + s.poem.content + '<br><span style="font-size:14px;color:#00852B;">+15 💎</span>';
            setTimeout(() => App.navigate('games'), 2000);
        } else if (!originalStr.startsWith(currentStr)) {
            // 错了
            UI.toast('❌ 顺序不对，重新开始', 'error');
            setTimeout(() => this.startPoemPuzzle(), 800);
        }
    },

    // 算24点
    start24Game() {
        const nums = [];
        for (let i = 0; i < 4; i++) nums.push(Utils.randInt(1, 9));
        this.game24State = { nums, solved: false };

        // 简化版：显示4个数字，让用户输入算式
        App.content.innerHTML = `
            <div class="fade-in">
                <h1 class="page-title">🎯 算24点</h1>
                <p class="page-subtitle">用 +、-、×、÷ 和这4个数字算出24</p>
                <div class="math-quiz">
                    <div style="display:flex;justify-content:center;gap:16px;margin:20px 0;">
                        ${nums.map((n, i) => `
                            <div style="width:60px;height:60px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:bold;color:#FFF;background:#0057B8;border:3px solid #3E75E8 #147F92 #147F92 #3E75E8;">${n}</div>
                        `).join('')}
                    </div>
                    <p style="font-size:14px;color:#555;margin:16px 0 8px;">在纸上算一算，想好了点"我知道了"！</p>
                    <div style="display:flex;gap:10px;justify-content:center;margin-top:16px;">
                        <button class="lego-btn lego-btn-green" onclick="Games.answer24(true)">✅ 算出来了！</button>
                        <button class="lego-btn lego-btn-gold" onclick="Games.start24Game()">🔄 换一题</button>
                        <button class="lego-btn lego-btn-red" onclick="App.navigate('games')">返回</button>
                    </div>
                    <div style="margin-top:16px;padding:12px;background:#0057B8;color:#FFF;border:2px solid #E0E0E0;font-size:13px;">
                        💡 提示：每个数字只能用一次，可以用括号哦！
                    </div>
                </div>
            </div>
        `;
    },

    answer24(correct) {
        if (correct) {
            Store.addPoints(25, '算24点');
            Store.addPetExp(20);
            Store.data.gamesPlayed++;
            Store.save();
            Store.checkBadges();
            UI.toast('🎉 太聪明了！+25 💎', 'success');
            UI.fireworks();
            setTimeout(() => App.navigate('games'), 1500);
        }
    },

    // 生字连连看
    startCharMatch() {
        const allWords = [];
        COURSE_DATA.chinese.units.forEach(u => u.lessons.forEach(l => l.words.forEach(w => allWords.push(w))));
        const selected = Utils.shuffle(allWords).slice(0, 6);
        // 生成拼音
        const pinyinMap = {
            '塘':'táng','脑':'nǎo','袋':'dài','灰':'huī','哇':'wā','教':'jiāo','捕':'bǔ','迎':'yíng',
            '阿':'ā','姨':'yí','宽':'kuān','龟':'guī','顶':'dǐng','披':'pī','鼓':'gǔ',
            '晒':'shài','极':'jí','傍':'bàng','越':'yuè','滴':'dī','溪':'xī','奔':'bēn','洋':'yáng',
            '坏':'huài','淹':'yān','没':'mò','冲':'chōng','毁':'huǐ','屋':'wū','灾':'zāi',
            '植':'zhí','如':'rú','为':'wèi','旅':'lǚ','备':'bèi','纷':'fēn','刺':'cì','底':'dǐ',
            '炸':'zhà','离':'lí','察':'chá','识':'shí','粗':'cū','得':'dé',
            '海':'hǎi','军':'jūn','舰':'jiàn','帆':'fān','稻':'dào','园':'yuán','翠':'cuì',
            '队':'duì','铜':'tóng','号':'hào','领':'lǐng','巾':'jīn',
            '杨':'yáng','壮':'zhuàng','桐':'tóng','枫':'fēng','松':'sōng','柏':'bǎi','杉':'shān','化':'huà','桂':'guì',
            '世':'shì','界':'jiè','雀':'què','锦':'jǐn','雄':'xióng','鹰':'yīng','翔':'xiáng',
            '雁':'yàn','丛':'cóng','深':'shēn','猛':'měng','灵':'líng','休':'xiū',
            '季':'jì','蝴':'hú','蝶':'dié','麦':'mài','苗':'miáo','嫩':'nèn','桑':'sāng','肥':'féi',
            '农':'nóng','归':'guī','戴':'dài','场':'chǎng','粒':'lì','虽':'suī','苦':'kǔ',
            '柱':'zhù','议':'yì','论':'lùn','重':'zhòng','秤':'chèng','砍':'kǎn','线':'xiàn','止':'zhǐ','量':'liáng',
            '详':'xiáng','幅':'fú','评':'píng','奖':'jiǎng','候':'hòu','报':'bào','另':'lìng','及':'jí','懒':'lǎn','并':'bìng',
            '封':'fēng','信':'xìn','今':'jīn','支':'zhī','圆':'yuán','珠':'zhū','笔':'bǐ','灯':'dēng',
            '削':'xiāo','锅':'guō','朝':'cháo','刮':'guā','胡':'hú','修':'xiū',
            '哄':'hǒng','先':'xiān','闭':'bì','紧':'jǐn','润':'rùn','等':'děng','吸':'xī','发':'fā',
            '粘':'zhān','额':'é','乏':'fá','沙':'shā',
            '楼':'lóu','依':'yī','尽':'jìn','欲':'yù','穷':'qióng','层':'céng',
            '瀑':'pù','布':'bù','炉':'lú','烟':'yān','遥':'yáo','川':'chuān',
            '闻':'wén','名':'míng','景':'jǐng','区':'qū','省':'shěng','部':'bù','秀':'xiù','尤':'yóu',
            '其':'qí','仙':'xiān','巨':'jù','位':'wèi','都':'dōu',
            '湾':'wān','胜':'shèng','迹':'jì','央':'yāng','丽':'lì','华':'huá','展':'zhǎn','现':'xiàn',
            '披':'pī','纱':'shā','童':'tóng',
            '沟':'gōu','产':'chǎn','份':'fèn','枝':'zhī','搭':'dā','淡':'dàn','好':'hǎo','收':'shōu',
            '城':'chéng','市':'shì','留':'liú','钉':'dīng','利':'lì','分':'fēn','味':'wèi'
        };

        this.charState = {
            chars: selected.map(c => ({ char: c, pinyin: pinyinMap[c] || '?' })),
            matched: [], selected: null, score: 0, attempts: 0
        };

        this.renderCharMatch();
    },

    renderCharMatch() {
        const s = this.charState;
        if (!s) return;
        const cards = [];
        s.chars.forEach((c, i) => {
            cards.push({ id: 'ch_'+i, text: c.char, type: 'ch', pairId: i });
            cards.push({ id: 'py_'+i, text: c.pinyin, type: 'py', pairId: i });
        });
        const shuffled = Utils.shuffle(cards);

        App.content.innerHTML = `
            <div class="fade-in">
                <h1 class="page-title">✏️ 生字连连看</h1>
                <p class="page-subtitle">配对汉字和拼音 · 已配对 ${s.matched.length}/6</p>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:600px;margin:0 auto;">
                    ${shuffled.map(c => {
                        const isMatched = s.matched.includes(c.pairId);
                        const isSelected = s.selected && s.selected.id === c.id;
                        return `
                            <div class="lego-slot" style="
                                text-align:center;padding:16px 8px;cursor:pointer;
                                ${isMatched ? 'opacity:0.3;background:#555;' : ''}
                                ${isSelected ? 'border-color:#FCD116 #B8860B #B8860B #FCD116;background:#FFF8C4;' : ''}
                                font-size:${c.type==='ch'?'24px':'16px'};
                                font-weight:bold;color:#3A3A3A;
                                font-family:${c.type==='py'?"'Press Start 2P',monospace":'inherit'};
                            " onclick="${isMatched?'':'Games.selectCharCard(\''+c.id+'\','+c.pairId+',\''+c.type+'\')'}">
                                ${isMatched ? '✅' : c.text}
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="text-align:center;margin-top:20px;">
                    <button class="lego-btn lego-btn-red" onclick="Games.endCharMatch()">结束</button>
                </div>
            </div>
        `;
    },

    selectCharCard(id, pairId, type) {
        const s = this.charState;
        if (!s) return;
        if (!s.selected) {
            s.selected = { id, pairId, type };
            this.renderCharMatch();
        } else {
            if (s.selected.id === id) return;
            s.attempts++;
            if (s.selected.pairId === pairId && s.selected.type !== type) {
                s.matched.push(pairId);
                s.score += 5;
                UI.toast('✅ 配对成功！+5💎', 'success', 800);
                s.selected = null;
                if (s.matched.length === 6) {
                    setTimeout(() => this.endCharMatch(true), 500);
                    return;
                }
            } else {
                UI.toast('❌ 不匹配', 'error', 800);
                s.selected = null;
            }
            this.renderCharMatch();
        }
    },

    endCharMatch(complete = false) {
        const s = this.charState;
        if (!s) return;
        const earned = s.score;
        if (earned > 0) {
            Store.addPoints(earned, '生字连连看');
            Store.addPetExp(s.score);
        }
        Store.data.gamesPlayed++;
        Store.save();
        Store.checkBadges();
        if (complete) UI.fireworks();
        UI.toast(`${complete?'🎉 全部配对完成！':'游戏结束'} 获得 ${earned} 💎`, 'success');
        App.navigate('games');
        this.charState = null;
        UI.updateTopbar();
    }
};

// ===== 主应用 =====
const App = {
    currentModule: 'home',
    currentTab: null,
    content: null,
    isParentMode: false,

    init() {
        Store.init();
        this.content = document.getElementById('contentArea');

        // 导航事件
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                this.navigate(item.dataset.module);
                if (window.innerWidth <= 768) this.closeSidebar();
            });
        });

        // 菜单按钮
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebarClose').addEventListener('click', () => this.closeSidebar());
        document.getElementById('overlay').addEventListener('click', () => this.closeSidebar());

        // 顶部萌宠
        document.getElementById('topbarPet').addEventListener('click', () => this.navigate('pet'));

        // 同步按钮
        document.getElementById('syncBtn').addEventListener('click', () => this.sync());

        // 家长模式按钮
        const parentBtn = document.getElementById('parentToggleBtn');
        if (parentBtn) {
            parentBtn.addEventListener('click', () => {
                if (typeof Parent !== 'undefined') Parent.toggle();
            });
        }

        // 日期
        document.getElementById('topbarDate').textContent = Utils.formatDate(new Date());

        // 渲染首页
        this.render();
        UI.updateTopbar();

        // 更新计划徽章
        this.updatePlanBadge();

        // 更新审核徽章
        if (typeof Parent !== 'undefined') Parent.updateReviewBadge();

        // 初始化云端同步
        CloudSync.init();
    },

    navigate(module) {
        this.currentModule = module;
        this.currentTab = null;
        this.render();
        // 更新导航高亮
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.module === module);
        });
        // 滚动到顶部
        window.scrollTo(0, 0);
    },

    setTab(tab) {
        this.currentTab = tab;
        this.render();
    },

    render() {
        const renderers = {
            home: () => Modules.home(),
            plan: () => Modules.plan(),
            chinese: () => Modules.chinese(),
            math: () => Modules.math(),
            english: () => Modules.english(),
            labor: () => Modules.labor(),
            sports: () => Modules.sports(),
            checkin: () => Modules.checkin(),
            points: () => Modules.points(),
            rewards: () => Modules.rewards(),
            pet: () => Modules.pet(),
            games: () => Modules.games(),
            'parent-review': () => Parent.review(),
            'parent-tasks': () => Parent.tasks(),
            'parent-stats': () => Parent.stats(),
            'parent-rewards': () => Parent.rewards()
        };

        const renderer = renderers[this.currentModule] || renderers.home;
        this.content.innerHTML = renderer();
        this.updatePlanBadge();
        if (typeof Parent !== 'undefined') Parent.updateReviewBadge();
    },

    updatePlanBadge() {
        const today = Store.todayKey();
        const done = Store.data.planProgress[today] || [];
        const basePlan = Utils.isWeekend() ? PLAN_TEMPLATES.weekend : PLAN_TEMPLATES.weekday;
        const customPlan = (Store.data.customTasks && Store.data.customTasks.plan) || [];
        const hiddenPreset = (Store.data.hiddenPreset && Store.data.hiddenPreset.plan) || [];
        const visiblePresetCount = basePlan.filter(t => !hiddenPreset.includes(t.name)).length;
        const totalCount = visiblePresetCount + customPlan.length;
        const visibleDone = done.filter(i => i < basePlan.length ? !hiddenPreset.includes(basePlan[i].name) : true).length;
        const remaining = totalCount - visibleDone;
        document.getElementById('planBadge').textContent = remaining;
    },

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('overlay').classList.toggle('show');
    },

    closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
    },

    // ===== 云端同步 =====
    sync() {
        if (CloudSync.enabled && CloudSync.blobId) {
            this.showSyncStatus();
        } else {
            this.showSyncSetup();
        }
    },

    // 同步设置（未连接时）
    showSyncSetup() {
        const supabaseReady = (typeof window.SUPABASE_CONFIG !== 'undefined' && window.SUPABASE_CONFIG.url && !window.SUPABASE_CONFIG.url.includes('YOUR_PROJECT'));
        const configWarning = supabaseReady ? '' : `
            <div style="background:#FFF3E0;border:2px solid #FF9800;border-radius:12px;padding:12px;margin-bottom:12px;">
                <p style="font-size:13px;color:#E65100;line-height:1.6;">
                    \u26A0\uFE0F \u9996\u6B21\u4F7F\u7528\u9700\u914D\u7F6E Supabase\uFF1A<br>
                    1. \u6253\u5F00 <code style="background:#f0f0f0;padding:2px 6px;border-radius:4px;">js/supabase-config.js</code><br>
                    2. \u6309\u6587\u4EF6\u5185\u8BF4\u660E\u586B\u5165 Supabase \u914D\u7F6E<br>
                    3. \u5237\u65B0\u9875\u9762\u5373\u53EF\u4F7F\u7528
                </p>
            </div>
        `;
        UI.modal('\uD83C\uDF10 云端同步', `
            ${configWarning}
            <div style="margin-bottom:16px;">
                <div style="background:#E8F5E9;border:2px solid #00852B;border-radius:12px;padding:14px;margin-bottom:16px;">
                    <h4 style="font-size:15px;font-weight:bold;color:#2E7D32;margin-bottom:6px;">\u26A1 自动实时同步</h4>
                    <p style="font-size:13px;color:#555;line-height:1.6;">
                        \u5F00\u542F\u540E\uFF0C\u5B66\u4E60\u6570\u636E\u4F1A\u81EA\u52A8\u540C\u6B65\u5230\u4E91\u7AEF\u3002\u5728\u5176\u4ED6\u8BBE\u5907\u6253\u5F00\u5206\u4EAB\u94FE\u63A5\u5373\u53EF\u81EA\u52A8\u540C\u6B65\uFF0C\u65E0\u9700\u624B\u52A8\u64CD\u4F5C\u3002
                    </p>
                </div>

                <button class="lego-btn lego-btn-green" style="width:100%;font-size:14px;padding:14px;" onclick="App.enableCloudSync()">
                    <span>\u2601\uFE0F</span> <span>\u5F00\u542F\u4E91\u7AEF\u540C\u6B65</span>
                </button>
            </div>

            <div class="lego-divider"></div>

            <div style="margin-bottom:16px;">
                <h4 style="font-size:15px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">\uD83D\uDD17 \u52A0\u5165\u5DF2\u6709\u540C\u6B65</h4>
                <p style="font-size:13px;color:#666;margin-bottom:8px;">\u8F93\u5165\u540C\u6B65\u7801\u6216\u7C98\u8D34\u5206\u4EAB\u94FE\u63A5\uFF0C\u52A0\u5165\u5176\u4ED6\u8BBE\u5907\u7684\u540C\u6B65</p>
                <div style="display:flex;gap:8px;">
                    <input type="text" id="joinSyncInput" placeholder="\u8F93\u5165\u540C\u6B65\u7801\u6216\u94FE\u63A5" style="flex:1;padding:10px;border:3px solid #E0E0E0;background:#F5F5F5;font-size:13px;font-family:monospace;">
                    <button class="lego-btn lego-btn-diamond" style="white-space:nowrap;" onclick="App.joinCloudSync()">\u52A0\u5165</button>
                </div>
            </div>

            <div class="lego-divider"></div>

            <div style="margin-bottom:8px;">
                <h4 style="font-size:15px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">\uD83D\uDCC1 \u624B\u52A8\u5B58\u6863\uFF08\u5907\u7528\uFF09</h4>
                <p style="font-size:12px;color:#999;margin-bottom:8px;">\u5BFC\u51FA/\u5BFC\u5165\u5B58\u6863\u6587\u4EF6\uFF0C\u9002\u7528\u4E8E\u65E0\u7F51\u7EDC\u65F6\u4F7F\u7528</p>
                <div style="display:flex;gap:8px;">
                    <button class="lego-btn" style="flex:1;font-size:12px;" onclick="App.exportData()">\uD83D\uDCE5 \u5BFC\u51FA</button>
                    <input type="file" id="importFile" accept=".json" style="display:none;" onchange="App.importData(event)">
                    <button class="lego-btn" style="flex:1;font-size:12px;" onclick="document.getElementById('importFile').click()">\uD83D\uDCE4 \u5BFC\u5165</button>
                </div>
            </div>
        `, '<button class="lego-btn" onclick="UI.closeModal()">\u5173\u95ED</button>');
    },

    // 同步状态（已连接时）
    showSyncStatus() {
        const shareLink = CloudSync.getShareLink();
        const code = CloudSync.blobId || '';
        const shortCode = code.length > 12 ? code.substring(0, 8) + '...' + code.substring(code.length - 4) : code;

        UI.modal('\uD83C\uDF10 \u4E91\u7AEF\u540C\u6B65 - \u5DF2\u8FDE\u63A5', `
            <div style="background:#E8F5E9;border:2px solid #00852B;border-radius:12px;padding:14px;margin-bottom:16px;text-align:center;">
                <div style="font-size:40px;margin-bottom:8px;">\u2705</div>
                <p style="font-size:14px;color:#2E7D32;font-weight:bold;">\u4E91\u7AEF\u540C\u6B65\u5DF2\u5F00\u542F</p>
                <p style="font-size:12px;color:#666;margin-top:4px;">\u6570\u636E\u5B9E\u65F6\u540C\u6B65\uFF0C\u672C\u5730\u66F4\u6539\u540E1\u79D2\u81EA\u52A8\u4E0A\u4F20</p>
            </div>

            <div style="margin-bottom:16px;">
                <h4 style="font-size:14px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">\uD83D\uDD17 \u5206\u4EAB\u94FE\u63A5\uFF08\u5176\u4ED6\u8BBE\u5907\u6253\u5F00\u5373\u53EF\u540C\u6B65\uFF09</h4>
                <div style="display:flex;gap:8px;">
                    <input type="text" readonly value="${shareLink || ''}" id="shareLinkInput" style="flex:1;padding:8px;border:3px solid #E0E0E0;background:#F5F5F5;font-size:11px;font-family:monospace;">
                    <button class="lego-btn lego-btn-diamond" style="white-space:nowrap;font-size:12px;" onclick="App.copyShareLink()">\u590D\u5236</button>
                </div>
            </div>

            <div style="margin-bottom:16px;">
                <h4 style="font-size:14px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">\uD83D\uDD11 \u540C\u6B65\u7801</h4>
                <div style="display:flex;gap:8px;align-items:center;">
                    <code style="flex:1;padding:8px;border:3px solid #E0E0E0;background:#F5F5F5;color:#0057B8;font-size:12px;font-family:monospace;word-break:break-all;">${code}</code>
                    <button class="lego-btn lego-btn-green" style="white-space:nowrap;font-size:12px;" onclick="App.copySyncCode()">\u590D\u5236</button>
                </div>
                <p style="font-size:11px;color:#999;margin-top:6px;">\u5728\u5176\u4ED6\u8BBE\u5907\u7684\u201C\u52A0\u5165\u540C\u6B65\u201D\u4E2D\u7C98\u8D34\u6B64\u7801</p>
            </div>

            <div class="lego-divider"></div>

            <div style="margin-bottom:16px;">
                <h4 style="font-size:14px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">\uD83D\uDD04 \u540C\u6B65\u64CD\u4F5C</h4>
                <button class="lego-btn lego-btn-green" style="width:100%;font-size:14px;padding:12px;" onclick="App.refreshFromCloud()">
                    <span>\uD83D\uDD04</span> <span>\u4ECE\u4E91\u7AEF\u5237\u65B0\u6570\u636E</span>
                </button>
                <p style="font-size:11px;color:#999;margin-top:6px;text-align:center;">\u70B9\u51FB\u7ACB\u5373\u4ECE\u4E91\u7AEF\u62C9\u53D6\u6700\u65B0\u6570\u636E\uFF08\u5B9E\u65F6\u540C\u6B65 + 10\u79D2\u8F6E\u8BE2\u5145\u95F4\uFF09</p>
            </div>

            <div class="lego-divider"></div>

            <div style="margin-bottom:8px;">
                <h4 style="font-size:14px;font-weight:bold;color:#3A3A3A;margin-bottom:8px;">\uD83D\uDCC1 \u624B\u52A8\u5B58\u6863\uFF08\u5907\u7528\uFF09</h4>
                <div style="display:flex;gap:8px;">
                    <button class="lego-btn" style="flex:1;font-size:12px;" onclick="App.exportData()">\uD83D\uDCE5 \u5BFC\u51FA</button>
                    <input type="file" id="importFile2" accept=".json" style="display:none;" onchange="App.importData(event)">
                    <button class="lego-btn" style="flex:1;font-size:12px;" onclick="document.getElementById('importFile2').click()">\uD83D\uDCE4 \u5BFC\u5165</button>
                </div>
            </div>

            <div class="lego-divider"></div>

            <button class="lego-btn" style="width:100%;color:#CE1126;border-color:#CE1126;margin-top:8px;" onclick="App.disableCloudSync()">\u274C \u5173\u95ED\u4E91\u7AEF\u540C\u6B65</button>
        `, '<button class="lego-btn" onclick="UI.closeModal()">\u5173\u95ED</button>');
    },

    // 开启云端同步
    async enableCloudSync() {
        try {
            UI.toast('\u23F3 \u6B63\u5728\u521B\u5EFA\u4E91\u7AEF\u540C\u6B65...', 'info', 2000);
            const code = await CloudSync.create();
            UI.closeModal();
            UI.toast('\u2705 \u4E91\u7AEF\u540C\u6B65\u5DF2\u5F00\u542F\uFF01', 'success');
            // 显示同步状态
            setTimeout(() => this.showSyncStatus(), 500);
        } catch (e) {
            UI.toast('\u274C ' + e.message, 'error', 4000);
            console.error('Enable cloud sync error:', e);
        }
    },

    // 加入云端同步
    async joinCloudSync() {
        const input = document.getElementById('joinSyncInput');
        if (!input) return;
        let code = input.value.trim();
        if (!code) {
            UI.toast('\u8BF7\u8F93\u5165\u540C\u6B65\u7801\u6216\u94FE\u63A5', 'warning');
            return;
        }
        // 从链接中提取同步码
        if (code.includes('#sync=')) {
            code = code.split('#sync=')[1];
        }
        try {
            UI.toast('\u23F3 \u6B63\u5728\u8FDE\u63A5\u4E91\u7AEF\u540C\u6B65...', 'info', 2000);
            await CloudSync.join(code);
            UI.closeModal();
            UI.toast('\u2705 \u5DF2\u52A0\u5165\u540C\u6B65\uFF01\u6570\u636E\u5DF2\u540C\u6B65', 'success');
        } catch (e) {
            UI.toast('\u274C ' + e.message, 'error', 4000);
            console.error('Join cloud sync error:', e);
        }
    },

    // 复制分享链接
    async copyShareLink() {
        const link = CloudSync.getShareLink();
        if (!link) return;
        try {
            await navigator.clipboard.writeText(link);
            UI.toast('\uD83D\uDCCB \u5206\u4EAB\u94FE\u63A5\u5DF2\u590D\u5236\uFF01', 'success');
        } catch (e) {
            // 备用方案
            const input = document.getElementById('shareLinkInput');
            if (input) {
                input.select();
                document.execCommand('copy');
                UI.toast('\uD83D\uDCCB \u5206\u4EAB\u94FE\u63A5\u5DF2\u590D\u5236\uFF01', 'success');
            }
        }
    },

    // 复制同步码
    async copySyncCode() {
        const code = CloudSync.blobId;
        if (!code) return;
        try {
            await navigator.clipboard.writeText(code);
            UI.toast('\uD83D\uDCCB \u540C\u6B65\u7801\u5DF2\u590D\u5236\uFF01', 'success');
        } catch (e) {
            UI.toast('\u8BF7\u624B\u52A8\u590D\u5236\u540C\u6B65\u7801', 'warning');
        }
    },

    // 关闭云端同步
    disableCloudSync() {
        UI.confirm('\u5173\u95ED\u540E\u5C06\u505C\u6B62\u81EA\u52A8\u540C\u6B65\uFF0C\u672C\u5730\u6570\u636E\u4ECD\u4F1A\u4FDD\u7559\u3002\u786E\u8BA4\u5173\u95ED\uFF1F', () => {
            CloudSync.disable();
            UI.closeModal();
            UI.toast('\u4E91\u7AEF\u540C\u6B65\u5DF2\u5173\u95ED', 'info');
        });
    },

    // 从云端强制刷新数据
    async refreshFromCloud() {
        if (!CloudSync.enabled || !CloudSync.roomId) {
            UI.toast('\u8BF7\u5148\u5F00\u542F\u4E91\u7AEF\u540C\u6B65', 'warning');
            return;
        }
        UI.toast('\u23F3 \u6B63\u5728\u4ECE\u4E91\u7AEF\u62C9\u53D6...', 'info', 2000);
        const updated = await CloudSync.pull(true);
        if (updated) {
            UI.toast('\u2705 \u5DF2\u4ECE\u4E91\u7AEF\u540C\u6B65\u6700\u65B0\u6570\u636E\uFF01', 'success');
            // 刷新弹窗内容
            setTimeout(() => this.showSyncStatus(), 300);
        } else {
            UI.toast('\u2705 \u672C\u5730\u5DF2\u662F\u6700\u65B0\u6570\u636E\uFF0C\u65E0\u9700\u66F4\u65B0', 'info');
        }
    },

    exportData() {
        const data = JSON.stringify(Store.data, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '\u5B66\u4E60\u65B9\u5757\u4E16\u754C_\u5B58\u6863_' + Store.todayKey() + '.json';
        a.click();
        URL.revokeObjectURL(url);
        UI.toast('\uD83D\uDCE5 \u5B58\u6863\u5DF2\u4E0B\u8F7D\uFF01', 'success');
    },

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                Store.data = Object.assign(JSON.parse(JSON.stringify(Store.defaultData)), imported);
                Store.save();
                UI.closeModal();
                UI.toast('\u2705 \u5B58\u6863\u5BFC\u5165\u6210\u529F\uFF01', 'success');
                UI.updateTopbar();
                App.render();
            } catch (err) {
                UI.toast('\u274C \u5B58\u6863\u6587\u4EF6\u683C\u5F0F\u9519\u8BEF', 'error');
            }
        };
        reader.readAsText(file);
    }
};

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
