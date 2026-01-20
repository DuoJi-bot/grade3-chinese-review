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

/**
 * 创建练习卡片
 */
function createQuizCard(module) {
    const isCompleted = window.storage.isCompleted(module.id);

    const card = document.createElement('div');
    card.className = 'quiz-card fade-in';
    card.innerHTML = `
        <div class="quiz-card-icon">${module.icon}</div>
        <h3 class="quiz-card-title">${module.title}</h3>
        <p class="quiz-card-desc">${module.desc}</p>
        ${isCompleted ? '<span class="quiz-card-badge">✓ 已完成</span>' : ''}
    `;

    card.addEventListener('click', () => {
        navigateToQuiz(module);
    });

    return card;
}

/**
 * 跳转到练习页面
 */
function navigateToQuiz(module) {
    const url = `pages/${module.type}.html?id=${module.id}&data=${module.dataKey}`;
    window.location.href = url;
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

    document.getElementById('totalQuestions').textContent = stats.totalQuestions;
    document.getElementById('accuracy').textContent = window.storage.getAccuracy() + '%';

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

    console.log('🎓 三年级语文复习应用已启动');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
