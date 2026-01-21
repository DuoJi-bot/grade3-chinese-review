/**
 * 主页入口脚本
 * 负责初始化应用、渲染练习入口
 */

// 练习模块配置
const quizModules = {
    // 日积月累
    daily: [
        {
            id: 'idiom-body',
            title: '身体部位成语',
            desc: '摇头晃脑、手忙脚乱...',
            icon: '🧍',
            type: 'idiom-complete',
            dataKey: 'body_parts_idioms'
        },
        {
            id: 'idiom-number',
            title: '数字成语',
            desc: '百发百中、七上八下...',
            icon: '🔢',
            type: 'idiom-complete',
            dataKey: 'number_idioms'
        },
        {
            id: 'action-words',
            title: '动作词语',
            desc: '懒洋洋、慢腾腾...',
            icon: '🏃',
            type: 'idiom-complete',
            dataKey: 'action_words'
        },
        {
            id: 'season-words',
            title: '四季词语分类',
            desc: '春暖花开、烈日炎炎...',
            icon: '🌸',
            type: 'word-classify',
            dataKey: 'seasons'
        },
        {
            id: 'proverbs-treating',
            title: '待人名言',
            desc: '不迁怒，不贰过...',
            icon: '🤝',
            type: 'poem-fill',
            dataKey: 'treating_people'
        },
        {
            id: 'proverbs-unity',
            title: '团结协作谚语',
            desc: '人心齐，泰山移...',
            icon: '💪',
            type: 'poem-fill',
            dataKey: 'unity'
        },
        {
            id: 'proverbs-perseverance',
            title: '坚韧名句',
            desc: '锲而不舍，金石可镂...',
            icon: '⚡',
            type: 'poem-fill',
            dataKey: 'perseverance'
        },
        {
            id: 'mu-radical',
            title: '带"目"的字',
            desc: '睁、眨、瞪、瞅...',
            icon: '👁️',
            type: 'drag-fill',
            dataKey: 'mu_radical'
        }
    ],

    // 课文知识
    lesson: [
        {
            id: 'character-traits',
            title: '人物品质',
            desc: '课文中的优秀人物品质',
            icon: '👤',
            type: 'sentence-fill',
            dataKey: 'character_traits'
        },
        {
            id: 'lesson-morals',
            title: '课文道理',
            desc: '课文告诉我们的道理',
            icon: '💡',
            type: 'sentence-fill',
            dataKey: 'lesson_morals'
        },
        {
            id: 'course-knowledge',
            title: '课文知识点',
            desc: '课文重点知识填空',
            icon: '📚',
            type: 'paragraph-fill',
            dataKey: 'lessons'
        }
    ],

    // 词语训练
    word: [
        {
            id: 'synonyms',
            title: '近反义词配对',
            desc: '翻牌记忆游戏',
            icon: '🎴',
            type: 'card-match',
            dataKey: 'units'
        },
        {
            id: 'polyphones',
            title: '多音字辨析',
            desc: '选择正确的读音',
            icon: '🔤',
            type: 'polyphone',
            dataKey: 'polyphones'
        },
        {
            id: 'collocations',
            title: '修饰词搭配',
            desc: '词语连线练习',
            icon: '🔗',
            type: 'line-match',
            dataKey: 'units'
        },
        {
            id: 'word-patterns',
            title: '词语范式朗读',
            desc: 'AABB、ABB式词语...',
            icon: '🎵',
            type: 'word-read',
            dataKey: 'patterns'
        }
    ],

    // 古诗背诵
    poem: [
        {
            id: 'poems',
            title: '古诗背诵',
            desc: '11首必背古诗文',
            icon: '📜',
            type: 'poem-recite',
            dataKey: 'poems'
        }
    ],

    // 短文练笔
    writing: [
        {
            id: 'writing-examples',
            title: '小练笔示例',
            desc: '句子仿写与段落练习',
            icon: '✍️',
            type: 'text-memory',
            dataKey: 'writing_exercises'
        },
        {
            id: 'oral-communication',
            title: '口语交际',
            desc: '场景对话练习',
            icon: '💬',
            type: 'text-memory',
            dataKey: 'oral_communication'
        }
    ]
};

// 不追踪进度的模块ID列表（自由练习板块）
const FREE_PRACTICE_MODULES = [
    'word-patterns',        // 词语范式朗读
    'poems',                // 古诗背诵
    'writing-examples',     // 小练笔示例
    'oral-communication'    // 口语交际
];

// 各模块题目总数配置（需要根据实际数据文件统计）
const MODULE_TOTAL_QUESTIONS = {
    'idiom-body': 12,           // 身体部位成语
    'idiom-number': 9,          // 数字成语
    'action-words': 8,          // 动作词语
    'season-words': 16,         // 四季词语分类
    'proverbs-treating': 4,     // 待人名言
    'proverbs-unity': 3,        // 团结协作谚语（实际3条）
    'proverbs-perseverance': 3, // 坚韧名句（实际3条）
    'mu-radical': 7,            // 带"目"的字（实际7个词）
    'character-traits': 2,      // 人物品质（共2组）
    'lesson-morals': 2,         // 课文道理（共2组）
    'course-knowledge': 26,        // 课文知识点（按课时计，共26课时）
    'synonyms': 200,            // 近反义词配对（估算总对数）
    'polyphones': 32,           // 多音字辨析
    'collocations': 8           // 修饰词搭配（共8个单元）
};

/**
 * 创建练习卡片
 */
function createQuizCard(module) {
    const isCompleted = window.storage.isCompleted(module.id);
    const isTrackable = !FREE_PRACTICE_MODULES.includes(module.id);
    const totalQuestions = MODULE_TOTAL_QUESTIONS[module.id] || 0;

    const card = document.createElement('div');
    card.className = 'quiz-card fade-in';
    card.dataset.moduleId = module.id; // 存储模块ID用于刷新进度

    // 使用 DOM 方式创建徽章，避免 innerHTML 可能的问题
    const icon = document.createElement('div');
    icon.className = 'quiz-card-icon';
    icon.textContent = module.icon;

    const title = document.createElement('h3');
    title.className = 'quiz-card-title';
    title.textContent = module.title;

    const desc = document.createElement('p');
    desc.className = 'quiz-card-desc';
    desc.textContent = module.desc;

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(desc);

    // 可追踪模块显示进度百分比
    if (isTrackable && totalQuestions > 0) {
        const progress = window.storage.getModuleProgress(module.id, totalQuestions);
        const progressBadge = document.createElement('span');
        progressBadge.className = 'quiz-card-progress';
        progressBadge.textContent = progress + '%';

        // 根据进度设置颜色
        if (progress >= 100) {
            progressBadge.classList.add('complete');
        } else if (progress > 0) {
            progressBadge.classList.add('partial');
        }

        card.appendChild(progressBadge);
    }

    if (isCompleted) {
        const badge = document.createElement('span');
        badge.className = 'quiz-card-badge';
        badge.textContent = '✓ 已完成';
        card.appendChild(badge);
    }

    card.addEventListener('click', () => {
        navigateToQuiz(module);
    });

    return card;
}

/**
 * 跳转到练习页面
 */
function navigateToQuiz(module) {
    // 保存当前滚动位置
    saveScrollPosition();

    const url = `pages/${module.type}.html?id=${module.id}&data=${module.dataKey}`;
    window.location.href = url;
}

/**
 * 保存滚动位置到 sessionStorage
 */
function saveScrollPosition() {
    const scrollY = window.scrollY || window.pageYOffset;
    sessionStorage.setItem('homeScrollPosition', scrollY);
}

/**
 * 恢复滚动位置
 */
function restoreScrollPosition() {
    const savedPosition = sessionStorage.getItem('homeScrollPosition');
    if (savedPosition !== null) {
        // 使用 requestAnimationFrame 确保页面渲染完成后再滚动
        requestAnimationFrame(() => {
            window.scrollTo({
                top: parseInt(savedPosition, 10),
                behavior: 'instant' // 立即滚动，不使用平滑动画
            });
        });

        // 清除保存的位置（可选：如果希望每次都从保存位置开始，可以注释掉这行）
        // sessionStorage.removeItem('homeScrollPosition');
    }
}

/**
 * 渲染练习分类
 */
function renderCategories() {
    // 日积月累
    const dailyGrid = document.getElementById('dailyGrid');
    quizModules.daily.forEach(module => {
        dailyGrid.appendChild(createQuizCard(module));
    });

    // 课文知识
    const lessonGrid = document.getElementById('lessonGrid');
    quizModules.lesson.forEach(module => {
        lessonGrid.appendChild(createQuizCard(module));
    });

    // 词语训练
    const wordGrid = document.getElementById('wordGrid');
    quizModules.word.forEach(module => {
        wordGrid.appendChild(createQuizCard(module));
    });

    // 古诗背诵
    const poemGrid = document.getElementById('poemGrid');
    quizModules.poem.forEach(module => {
        poemGrid.appendChild(createQuizCard(module));
    });

    // 短文练笔
    const writingGrid = document.getElementById('writingGrid');
    quizModules.writing.forEach(module => {
        writingGrid.appendChild(createQuizCard(module));
    });
}

/**
 * 更新统计显示
 */
function updateStats() {
    const stats = window.storage.getStats();

    document.getElementById('totalQuestions').textContent = window.storage.getTotalCompletedCount();

    // 计算总完成率
    const modulesConfig = Object.entries(MODULE_TOTAL_QUESTIONS).map(([id, total]) => ({
        id: id,
        totalQuestions: total
    }));
    const totalProgress = window.storage.getTotalProgress(modulesConfig);
    document.getElementById('accuracy').textContent = totalProgress + '%';

    if (stats.lastStudyDate) {
        const date = new Date(stats.lastStudyDate);
        const today = new Date();
        const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            document.getElementById('lastStudy').textContent = '今天';
        } else if (diffDays === 1) {
            document.getElementById('lastStudy').textContent = '昨天';
        } else {
            document.getElementById('lastStudy').textContent = `${diffDays}天前`;
        }
    }
}

/**
 * 初始化应用
 */
function init() {
    renderCategories();
    updateStats();

    // 恢复滚动位置（如果从其他页面返回）
    restoreScrollPosition();

    console.log('🎓 三年级语文复习应用已启动');
}

/**
 * 刷新进度显示（不重新渲染卡片，只更新进度数值）
 */
function refreshProgress() {
    // 更新各板块进度徽章
    document.querySelectorAll('.quiz-card').forEach(card => {
        const progressBadge = card.querySelector('.quiz-card-progress');
        if (progressBadge) {
            const moduleId = card.dataset.moduleId;
            const totalQuestions = MODULE_TOTAL_QUESTIONS[moduleId] || 0;
            if (totalQuestions > 0) {
                const progress = window.storage.getModuleProgress(moduleId, totalQuestions);
                progressBadge.textContent = progress + '%';

                // 更新样式
                progressBadge.classList.remove('partial', 'complete');
                if (progress >= 100) {
                    progressBadge.classList.add('complete');
                } else if (progress > 0) {
                    progressBadge.classList.add('partial');
                }
            }
        }
    });

    // 更新总统计
    updateStats();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 从其他页面返回时刷新进度（解决浏览器缓存问题）
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // 页面是从缓存中恢复的（bfcache）
        refreshProgress();
    }
});

