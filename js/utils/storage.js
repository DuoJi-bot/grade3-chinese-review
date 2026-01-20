/**
 * 本地存储模块
 * 用于保存和读取学习进度、答题记录等数据
 */
class StorageManager {
    constructor() {
        this.prefix = 'g3_chinese_';
        this.init();
    }

    /**
     * 初始化存储
     */
    init() {
        // 确保进度数据存在
        if (!this.get('progress')) {
            this.set('progress', {});
        }

        // 确保统计数据存在
        if (!this.get('stats')) {
            this.set('stats', {
                totalQuestions: 0,
                correctAnswers: 0,
                totalTime: 0,
                lastStudyDate: null
            });
        }
    }

    /**
     * 获取带前缀的key
     */
    getKey(key) {
        return this.prefix + key;
    }

    /**
     * 存储数据
     * @param {string} key - 键名
     * @param {any} value - 值
     */
    set(key, value) {
        try {
            localStorage.setItem(this.getKey(key), JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('存储失败:', e);
            return false;
        }
    }

    /**
     * 读取数据
     * @param {string} key - 键名
     * @param {any} defaultValue - 默认值
     */
    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(this.getKey(key));
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('读取失败:', e);
            return defaultValue;
        }
    }

    /**
     * 删除数据
     * @param {string} key - 键名
     */
    remove(key) {
        localStorage.removeItem(this.getKey(key));
    }

    /**
     * 保存模块学习进度
     * @param {string} moduleId - 模块ID
     * @param {Object} data - 进度数据
     */
    saveProgress(moduleId, data) {
        const progress = this.get('progress', {});
        progress[moduleId] = {
            ...data,
            lastUpdate: Date.now()
        };
        this.set('progress', progress);
    }

    /**
     * 获取模块学习进度
     * @param {string} moduleId - 模块ID (可选，不传则返回所有)
     */
    getProgress(moduleId = null) {
        const progress = this.get('progress', {});
        return moduleId ? progress[moduleId] : progress;
    }

    /**
     * 更新学习统计
     * @param {number} questions - 答题数量
     * @param {number} correct - 正确数量
     * @param {number} time - 用时(秒)
     */
    updateStats(questions, correct, time = 0) {
        const stats = this.get('stats', {
            totalQuestions: 0,
            correctAnswers: 0,
            totalTime: 0,
            lastStudyDate: null
        });

        stats.totalQuestions += questions;
        stats.correctAnswers += correct;
        stats.totalTime += time;
        stats.lastStudyDate = new Date().toISOString().split('T')[0];

        this.set('stats', stats);
    }

    /**
     * 获取学习统计
     */
    getStats() {
        return this.get('stats', {
            totalQuestions: 0,
            correctAnswers: 0,
            totalTime: 0,
            lastStudyDate: null
        });
    }

    /**
     * 计算正确率
     */
    getAccuracy() {
        const stats = this.getStats();
        if (stats.totalQuestions === 0) return 0;
        return Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
    }

    /**
     * 获取完成度
     * @param {number} totalModules - 总模块数
     */
    getCompletionRate(totalModules) {
        const progress = this.get('progress', {});
        const completedModules = Object.values(progress).filter(p => p.completed).length;
        return Math.round((completedModules / totalModules) * 100);
    }

    /**
     * 标记模块完成
     * @param {string} moduleId - 模块ID
     */
    markCompleted(moduleId) {
        this.saveProgress(moduleId, {
            completed: true,
            completedAt: Date.now()
        });
    }

    /**
     * 检查模块是否完成
     * @param {string} moduleId - 模块ID
     */
    isCompleted(moduleId) {
        const progress = this.getProgress(moduleId);
        return progress?.completed === true;
    }

    /**
     * 重置所有进度
     */
    resetAll() {
        this.set('progress', {});
        this.set('stats', {
            totalQuestions: 0,
            correctAnswers: 0,
            totalTime: 0,
            lastStudyDate: null
        });
    }

    /**
     * 导出数据
     */
    exportData() {
        return {
            progress: this.get('progress'),
            stats: this.get('stats'),
            exportTime: new Date().toISOString()
        };
    }

    /**
     * 导入数据
     * @param {Object} data - 导入的数据
     */
    importData(data) {
        if (data.progress) {
            this.set('progress', data.progress);
        }
        if (data.stats) {
            this.set('stats', data.stats);
        }
    }
}

// 创建全局存储实例
window.storage = new StorageManager();
