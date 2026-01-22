/**
 * 题型基类
 * 提供所有题型的公共功能
 */
class QuizBase {
    constructor(options = {}) {
        this.moduleId = options.moduleId || '';
        this.dataKey = options.dataKey || '';
        this.questions = [];
        this.currentIndex = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.answered = new Set();
        this.startTime = Date.now();

        // DOM 元素
        this.container = document.getElementById('quizContent');
        this.progressBar = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');

        // 绑定方法
        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.prevQuestion = this.prevQuestion.bind(this);
    }

    /**
     * 初始化题目
     */
    async init() {
        try {
            await this.loadData();
            this.shuffleQuestions();
            this.render();
            this.updateProgress();
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('加载数据失败，请刷新页面重试');
        }
    }

    /**
     * 加载数据 - 子类需要重写
     */
    async loadData() {
        throw new Error('loadData 方法需要子类实现');
    }

    /**
     * 渲染题目 - 子类需要重写
     */
    render() {
        throw new Error('render 方法需要子类实现');
    }

    /**
     * 检查答案 - 子类需要重写
     */
    checkAnswer(answer) {
        throw new Error('checkAnswer 方法需要子类实现');
    }

    /**
     * 打乱题目顺序
     */
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    /**
     * 打乱数组
     */
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /**
     * 下一题
     */
    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.render();
            this.updateProgress();
        } else {
            this.showComplete();
        }
    }

    /**
     * 上一题
     */
    prevQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.render();
            this.updateProgress();
        }
    }

    /**
     * 更新进度
     */
    updateProgress() {
        const progress = Math.round(((this.currentIndex + 1) / this.questions.length) * 100);

        if (this.progressBar) {
            this.progressBar.style.width = progress + '%';
        }

        if (this.progressText) {
            this.progressText.textContent = `${this.currentIndex + 1} / ${this.questions.length}`;
        }
    }

    /**
     * 显示正确反馈（仅视觉效果，不修改计数器）
     */
    showCorrectFeedbackOnly() {
        this.showFeedback('✓', 'correct');
    }

    /**
     * 显示错误反馈（仅视觉效果，不修改计数器）
     */
    showWrongFeedbackOnly() {
        this.showFeedback('✗', 'wrong');
    }

    /**
     * 显示正确反馈并增加计数
     */
    showCorrectFeedback() {
        this.correctCount++;
        this.showFeedback('✓', 'correct');
    }

    /**
     * 显示错误反馈并增加计数
     */
    showWrongFeedback() {
        this.wrongCount++;
        this.showFeedback('✗', 'wrong');
    }

    /**
     * 显示反馈动画
     */
    showFeedback(text, type) {
        const feedback = document.createElement('div');
        feedback.className = `feedback-icon ${type}`;
        feedback.textContent = text;
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 600);
    }

    /**
     * 显示完成页面
     */
    showComplete() {
        const totalTime = Math.round((Date.now() - this.startTime) / 1000);
        // 根据对勾和叉号的实际次数计算
        const totalAnswered = this.correctCount + this.wrongCount;
        const accuracy = totalAnswered > 0 ? Math.round((this.correctCount / totalAnswered) * 100) : 0;

        // 隐藏导航按钮
        const navButtons = document.querySelector('.nav-buttons');
        if (navButtons) {
            navButtons.style.display = 'none';
        }

        // 保存进度
        window.storage.markCompleted(this.moduleId);
        window.storage.updateStats(totalAnswered, this.correctCount, totalTime);

        // 根据正确率决定图标样式和交互
        const isPerfect = accuracy === 100;
        const iconStyle = isPerfect ? 'cursor: pointer;' : 'cursor: default; opacity: 0.5;';
        const iconTitle = isPerfect ? '点击庆祝！🎊' : '全部答对才能庆祝哦~';

        this.container.innerHTML = `
            <div class="complete-screen fade-in">
                <div class="complete-icon" id="celebrateIcon" style="${iconStyle}" title="${iconTitle}">🎉</div>
                <h2 class="complete-title">练习完成！</h2>
                <div class="complete-stats">
                    <div class="stat-row">
                        <span class="stat-label">答题数量</span>
                        <span class="stat-value">${totalAnswered} 题</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">正确数量</span>
                        <span class="stat-value">${this.correctCount} 题</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">正确率</span>
                        <span class="stat-value ${accuracy >= 80 ? 'good' : accuracy >= 60 ? 'ok' : 'bad'}">${accuracy}%</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">用时</span>
                        <span class="stat-value">${this.formatTime(totalTime)}</span>
                    </div>
                </div>
                <div class="complete-actions">
                    <button class="btn btn-outline" onclick="location.reload()">再练一次</button>
                    <button class="btn btn-primary" id="backToHomeBtn">返回首页</button>
                </div>
            </div>
        `;

        // 添加完成页面样式
        this.addCompleteStyles();

        // 绑定返回首页按钮事件
        const backToHomeBtn = document.getElementById('backToHomeBtn');
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', () => this.goBack());
        }

        // 只有正确率100%时才绑定庆祝图标点击事件
        if (isPerfect) {
            const celebrateIcon = document.getElementById('celebrateIcon');
            if (celebrateIcon) {
                celebrateIcon.addEventListener('click', () => {
                    this.triggerConfetti();
                });
            }
            // 自动触发一次五彩纸屑特效
            setTimeout(() => this.triggerConfetti(), 300);
        }
    }

    /**
     * 添加完成页面样式
     */
    addCompleteStyles() {
        if (document.getElementById('complete-styles')) return;

        const style = document.createElement('style');
        style.id = 'complete-styles';
        style.textContent = `
            .complete-screen {
                text-align: center;
                padding: 2rem;
            }
            .complete-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            .complete-title {
                font-size: 1.5rem;
                color: var(--text-primary);
                margin-bottom: 1.5rem;
            }
            .complete-stats {
                background: var(--bg-color);
                border-radius: var(--radius-lg);
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            .stat-row {
                display: flex;
                justify-content: space-between;
                padding: 0.75rem 0;
                border-bottom: 1px solid var(--border-color);
            }
            .stat-row:last-child {
                border-bottom: none;
            }
            .stat-label {
                color: var(--text-secondary);
            }
            .stat-value {
                font-weight: 600;
                color: var(--text-primary);
            }
            .stat-value.good {
                color: var(--success-color);
            }
            .stat-value.ok {
                color: var(--warning-color);
            }
            .stat-value.bad {
                color: var(--error-color);
            }
            .complete-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 格式化时间
     */
    formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds} 秒`;
        }
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes} 分 ${secs} 秒`;
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        this.container.innerHTML = `
            <div class="error-screen fade-in">
                <div class="error-icon">😕</div>
                <p class="error-message">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">重新加载</button>
            </div>
        `;
    }

    /**
     * 显示 Toast 提示
     */
    showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, duration);
    }

    /**
     * 朗读文本
     */
    speak(text, options = {}) {
        if (window.tts) {
            window.tts.speak(text, options);
        }
    }

    /**
     * 停止朗读
     */
    stopSpeak() {
        if (window.tts) {
            window.tts.stop();
        }
    }

    /**
     * 获取 URL 参数
     */
    getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * 加载 JSON 数据
     */
    async fetchJson(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    /**
     * 返回首页
     */
    goBack() {
        // 直接跳转到首页，避免history.back()可能导致的问题
        window.location.href = '../index.html';
    }

    /**
     * 绑定导航按钮事件
     */
    bindNavButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const backBtn = document.getElementById('backBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', this.prevQuestion);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', this.nextQuestion);
        }

        if (backBtn) {
            backBtn.addEventListener('click', this.goBack);
        }
    }

    /**
     * 触发五彩纸屑特效
     * 模拟🎉抛洒效果：从一个点向外爆炸扩散
     */
    triggerConfetti() {
        // 随机起点位置
        const originX = window.innerWidth * (0.2 + Math.random() * 0.6);
        const originY = window.innerHeight * (0.3 + Math.random() * 0.3);

        // 彩色配置
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#a29bfe', '#00b894', '#fdcb6e', '#e17055', '#74b9ff', '#55efc4'];

        // 创建纸屑容器
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        // 生成纸屑和彩带（使用物理模拟）
        const pieceCount = 80;  // 纸屑数量
        const ribbonCount = 20; // 彩带数量
        const pieces = [];
        const gravity = 0.15;
        const friction = 0.99;

        // 生成纸屑
        for (let i = 0; i < pieceCount; i++) {
            const piece = document.createElement('div');

            // 随机形状：圆形、方形、长条
            const shapeType = Math.floor(Math.random() * 3);
            const size = 6 + Math.random() * 10;
            const color = colors[Math.floor(Math.random() * colors.length)];

            piece.style.position = 'absolute';
            piece.style.backgroundColor = color;
            piece.style.left = originX + 'px';
            piece.style.top = originY + 'px';

            if (shapeType === 0) {
                piece.style.width = size + 'px';
                piece.style.height = size + 'px';
                piece.style.borderRadius = '50%';
            } else if (shapeType === 1) {
                piece.style.width = size + 'px';
                piece.style.height = size + 'px';
            } else {
                piece.style.width = (size * 0.4) + 'px';
                piece.style.height = (size * 1.5) + 'px';
            }

            container.appendChild(piece);

            const angle = (-30 + Math.random() * 240) * (Math.PI / 180);
            const velocity = 8 + Math.random() * 15;

            pieces.push({
                element: piece,
                x: originX,
                y: originY,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 15,
                opacity: 1,
                isRibbon: false
            });
        }

        // 生成彩带
        for (let i = 0; i < ribbonCount; i++) {
            const ribbon = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const width = 3 + Math.random() * 3;
            const height = 25 + Math.random() * 35;

            ribbon.style.cssText = `
                position: absolute;
                width: ${width}px;
                height: ${height}px;
                background: linear-gradient(180deg, ${color} 0%, ${color}88 50%, ${color}44 100%);
                border-radius: ${width}px;
                left: ${originX}px;
                top: ${originY}px;
                transform-origin: center top;
            `;

            container.appendChild(ribbon);

            const angle = (-30 + Math.random() * 240) * (Math.PI / 180);
            const velocity = 6 + Math.random() * 12;

            pieces.push({
                element: ribbon,
                x: originX,
                y: originY,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 8,
                opacity: 1,
                isRibbon: true,
                wavePhase: Math.random() * Math.PI * 2,
                waveSpeed: 0.15 + Math.random() * 0.1
            });
        }

        // 动画循环
        let frameCount = 0;
        const maxFrames = 180; // 约3秒

        const animate = () => {
            frameCount++;

            pieces.forEach(p => {
                // 应用物理
                p.vy += gravity; // 重力
                p.vx *= friction;
                p.vy *= friction;

                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                // 渐渐消失
                if (frameCount > maxFrames * 0.6) {
                    p.opacity -= 0.02;
                }

                // 更新DOM - 彩带有额外的波浪效果
                if (p.isRibbon) {
                    p.wavePhase += p.waveSpeed;
                    const wave = Math.sin(p.wavePhase) * 20;
                    p.element.style.transform = `translate(${p.x - originX}px, ${p.y - originY}px) rotate(${p.rotation}deg) skewX(${wave}deg)`;
                } else {
                    p.element.style.transform = `translate(${p.x - originX}px, ${p.y - originY}px) rotate(${p.rotation}deg)`;
                }
                p.element.style.opacity = Math.max(0, p.opacity);
            });

            if (frameCount < maxFrames) {
                requestAnimationFrame(animate);
            } else {
                container.remove();
            }
        };

        requestAnimationFrame(animate);
    }
}

// 导出基类
window.QuizBase = QuizBase;
