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
     * 显示正确反馈
     */
    showCorrectFeedback() {
        this.correctCount++;
        this.showFeedback('✓', 'correct');

        // 播放正确音效（可选）
        // this.playSound('correct');
    }

    /**
     * 显示错误反馈
     */
    showWrongFeedback() {
        this.showFeedback('✗', 'wrong');

        // 播放错误音效（可选）
        // this.playSound('wrong');
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
        const accuracy = Math.round((this.correctCount / this.questions.length) * 100);

        // 隐藏导航按钮
        const navButtons = document.querySelector('.nav-buttons');
        if (navButtons) {
            navButtons.style.display = 'none';
        }

        // 保存进度
        window.storage.markCompleted(this.moduleId);
        window.storage.updateStats(this.questions.length, this.correctCount, totalTime);

        this.container.innerHTML = `
            <div class="complete-screen fade-in">
                <div class="complete-icon">🎉</div>
                <h2 class="complete-title">练习完成！</h2>
                <div class="complete-stats">
                    <div class="stat-row">
                        <span class="stat-label">答题数量</span>
                        <span class="stat-value">${this.questions.length} 题</span>
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
                    <button class="btn btn-primary" onclick="location.href='../index.html'">返回首页</button>
                </div>
            </div>
        `;

        // 添加完成页面样式
        this.addCompleteStyles();
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
     * 返回上一页
     */
    goBack() {
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
}

// 导出基类
window.QuizBase = QuizBase;
