/**
 * 小学生学习工作台 - 教学内容数据
 * 语文：二年级 人教版
 * 数学：二年级 苏教版
 */

const COURSE_DATA = {
    // ===== 语文（人教版二年级）=====
    chinese: {
        title: "语文",
        subtitle: "二年级 · 人教版",
        icon: "📖",
        color: "#e53e3e",
        gradient: "linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)",
        units: [
            {
                name: "第一单元 · 大自然的秘密",
                lessons: [
                    {
                        title: "1. 小蝌蚪找妈妈",
                        subtitle: "了解青蛙的生长过程",
                        words: ["塘", "脑", "袋", "灰", "哇", "教", "捕", "迎", "阿", "姨", "宽", "龟", "顶", "披", "鼓"],
                        keyPoints: "认识蝌蚪变青蛙的过程，学习用完整的句子描述事物。",
                        points: 10
                    },
                    {
                        title: "2. 我是什么",
                        subtitle: "水的不同形态变化",
                        words: ["晒", "极", "傍", "越", "滴", "溪", "奔", "洋", "坏", "淹", "没", "冲", "毁", "屋", "灾"],
                        keyPoints: "了解水的三态变化：冰、水、水蒸气。学习拟人手法。",
                        points: 10
                    },
                    {
                        title: "3. 植物妈妈有办法",
                        subtitle: "植物的种子传播方式",
                        words: ["植", "如", "为", "旅", "备", "纷", "刺", "底", "炸", "离", "察", "识", "粗", "得"],
                        keyPoints: "蒲公英（风传播）、苍耳（动物传播）、豌豆（弹射传播）。",
                        points: 10
                    }
                ]
            },
            {
                name: "第二单元 · 识字",
                lessons: [
                    {
                        title: "识字1. 场景歌",
                        subtitle: "量词的学习与运用",
                        words: ["海", "军", "舰", "帆", "稻", "园", "翠", "队", "铜", "号", "领", "巾"],
                        keyPoints: "学习量词：一片、一艘、一条、一处。场景描写方法。",
                        points: 10
                    },
                    {
                        title: "识字2. 树之歌",
                        subtitle: "认识不同的树木",
                        words: ["杨", "壮", "桐", "枫", "松", "柏", "杉", "化", "桂"],
                        keyPoints: "杨树高、榕树壮、梧桐树叶像手掌、枫树秋天叶儿红。",
                        points: 10
                    },
                    {
                        title: "识字3. 拍手歌",
                        subtitle: "保护动物的儿歌",
                        words: ["世", "界", "雀", "锦", "雄", "鹰", "翔", "雁", "丛", "深", "猛", "灵", "休"],
                        keyPoints: "学习动物名称，理解保护动物的意义。儿歌的节奏与韵律。",
                        points: 10
                    },
                    {
                        title: "识字4. 田家四季歌",
                        subtitle: "四季农事活动",
                        words: ["季", "蝴", "蝶", "麦", "苗", "嫩", "桑", "肥", "农", "归", "戴", "场", "粒", "虽", "苦"],
                        keyPoints: "春季播种、夏季农忙、秋季收获、冬季休息。",
                        points: 10
                    }
                ]
            },
            {
                name: "第三单元 · 童话故事",
                lessons: [
                    {
                        title: "4. 曹冲称象",
                        subtitle: "聪明的办法称大象",
                        words: ["柱", "议", "论", "重", "秤", "砍", "线", "止", "量"],
                        keyPoints: "曹冲用石头代替大象称重的聪明办法。学习叙述顺序。",
                        points: 10
                    },
                    {
                        title: "5. 玲玲的画",
                        subtitle: "动脑筋解决问题",
                        words: ["详", "幅", "评", "奖", "候", "报", "另", "及", "懒", "并"],
                        keyPoints: "遇到困难要动脑筋，坏事也能变好事。",
                        points: 10
                    },
                    {
                        title: "6. 一封信",
                        subtitle: "给爸爸写信",
                        words: ["封", "信", "今", "支", "圆", "珠", "笔", "灯", "封", "削", "锅", "朝", "刮", "胡", "修"],
                        keyPoints: "学习写信的格式，表达对亲人的思念。",
                        points: 10
                    },
                    {
                        title: "7. 妈妈睡了",
                        subtitle: "感受母爱的温暖",
                        words: ["哄", "先", "闭", "紧", "润", "等", "吸", "发", "粘", "额", "乏", "沙"],
                        keyPoints: "观察妈妈的睡颜，感受妈妈的爱与辛苦。",
                        points: 10
                    }
                ]
            },
            {
                name: "第四单元 · 祖国山河",
                lessons: [
                    {
                        title: "8. 古诗二首",
                        subtitle: "登鹳雀楼 / 望庐山瀑布",
                        words: ["楼", "依", "尽", "欲", "穷", "层", "瀑", "布", "炉", "烟", "遥", "川"],
                        poems: [
                            { title: "登鹳雀楼", author: "王之涣", content: "白日依山尽，黄河入海流。欲穷千里目，更上一层楼。", meaning: "太阳依着山落下，黄河流向大海。想要看到更远的景色，就要再上一层楼。" },
                            { title: "望庐山瀑布", author: "李白", content: "日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。", meaning: "太阳照在香炉峰上生起紫色烟雾，远远望去瀑布像挂在山前。飞流直下很长很长，让人怀疑是银河从天上落下来。" }
                        ],
                        keyPoints: "背诵两首古诗，理解诗意，感受祖国山河的壮美。",
                        points: 15
                    },
                    {
                        title: "9. 黄山奇石",
                        subtitle: "黄山的奇石景观",
                        words: ["闻", "名", "景", "区", "省", "部", "秀", "尤", "其", "仙", "巨", "位", "都"],
                        keyPoints: "黄山的奇石：仙桃石、猴子观海、仙人指路、金鸡叫天都。",
                        points: 10
                    },
                    {
                        title: "10. 日月潭",
                        subtitle: "台湾的日月潭",
                        words: ["湾", "名", "胜", "迹", "央", "丽", "华", "展", "现", "披", "纱", "童"],
                        keyPoints: "日月潭在台湾，北半湖像太阳，南半湖像月亮。",
                        points: 10
                    },
                    {
                        title: "11. 葡萄沟",
                        subtitle: "新疆吐鲁番的葡萄沟",
                        words: ["沟", "产", "份", "枝", "搭", "淡", "好", "收", "城", "市", "留", "钉", "利", "分", "味"],
                        keyPoints: "葡萄沟在新疆，葡萄又多又好，葡萄干在阴房里制成。",
                        points: 10
                    }
                ]
            }
        ],
        poems: [
            { title: "梅花", author: "王安石", content: "墙角数枝梅，凌寒独自开。遥知不是雪，为有暗香来。", grade: "二上", done: false },
            { title: "小儿垂钓", author: "胡令能", content: "蓬头稚子学垂纶，侧坐莓苔草映身。路人借问遥招手，怕得鱼惊不应人。", grade: "二上", done: false },
            { title: "登鹳雀楼", author: "王之涣", content: "白日依山尽，黄河入海流。欲穷千里目，更上一层楼。", grade: "二上", done: false },
            { title: "望庐山瀑布", author: "李白", content: "日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。", grade: "二上", done: false },
            { title: "江雪", author: "柳宗元", content: "千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。", grade: "二上", done: false },
            { title: "夜宿山寺", author: "李白", content: "危楼高百尺，手可摘星辰。不敢高声语，恐惊天上人。", grade: "二上", done: false },
            { title: "敕勒歌", author: "北朝民歌", content: "敕勒川，阴山下。天似穹庐，笼盖四野。天苍苍，野茫茫，风吹草低见牛羊。", grade: "二上", done: false }
        ]
    },

    // ===== 数学（苏教版二年级）=====
    math: {
        title: "数学",
        subtitle: "二年级 · 苏教版",
        icon: "🔢",
        color: "#3182ce",
        gradient: "linear-gradient(135deg, #63b3ed 0%, #3182ce 100%)",
        units: [
            {
                name: "第一单元 · 100以内的加法和减法（三）",
                lessons: [
                    {
                        title: "连加连减",
                        subtitle: "100以内的连加连减运算",
                        examples: ["28+35+16=", "90-25-38=", "45+28+19="],
                        keyPoints: "从左到右依次计算，注意进位和退位。",
                        points: 10,
                        type: "arithmetic"
                    },
                    {
                        title: "加减混合运算",
                        subtitle: "加减混合的两步运算",
                        examples: ["56+28-39=", "82-45+27=", "38+55-66="],
                        keyPoints: "从左到右依次计算，可以列竖式。",
                        points: 10,
                        type: "arithmetic"
                    },
                    {
                        title: "解决问题",
                        subtitle: "用加减法解决实际问题",
                        examples: ["小明有45元，买书用了18元，妈妈又给了他25元，现在有多少钱？"],
                        keyPoints: "理解题意，找出已知条件和问题，列式解答。",
                        points: 15,
                        type: "wordproblem"
                    }
                ]
            },
            {
                name: "第二单元 · 平行四边形的初步认识",
                lessons: [
                    {
                        title: "认识多边形",
                        subtitle: "认识三角形、四边形、五边形",
                        examples: ["三角形有3条边", "四边形有4条边", "五边形有5条边"],
                        keyPoints: "由几条线段围成的图形就是几边形。",
                        points: 10,
                        type: "concept"
                    },
                    {
                        title: "认识平行四边形",
                        subtitle: "平行四边形的特征",
                        examples: ["对边相等", "对边平行", "容易变形"],
                        keyPoints: "平行四边形有4条边，对边相等且平行。",
                        points: 10,
                        type: "concept"
                    }
                ]
            },
            {
                name: "第三单元 · 表内乘法（一）",
                lessons: [
                    {
                        title: "乘法的初步认识",
                        subtitle: "理解乘法的含义",
                        examples: ["3+3+3+3=12 → 3×4=12", "5+5+5=15 → 5×3=15"],
                        keyPoints: "求几个相同加数的和，用乘法计算更简便。",
                        points: 10,
                        type: "concept"
                    },
                    {
                        title: "2~4的乘法口诀",
                        subtitle: "一二得二到四四十六",
                        examples: ["2×1=2", "3×4=12", "4×4=16"],
                        keyPoints: "2的口诀：一二得二、二二得四。3的口诀：一三得三...三三得九。4的口诀：一四得四...四四十六。",
                        points: 10,
                        type: "multiplication"
                    },
                    {
                        title: "5的乘法口诀",
                        subtitle: "一五得五到五五二十五",
                        examples: ["5×1=5", "5×3=15", "5×5=25"],
                        keyPoints: "5的口诀：一五得五、二五一十、三五十五、四五二十、五五二十五。",
                        points: 10,
                        type: "multiplication"
                    },
                    {
                        title: "6的乘法口诀",
                        subtitle: "一六得六到六六三十六",
                        examples: ["6×1=6", "6×4=24", "6×6=36"],
                        keyPoints: "6的口诀：一六得六...六六三十六。",
                        points: 10,
                        type: "multiplication"
                    }
                ]
            },
            {
                name: "第四单元 · 表内除法（一）",
                lessons: [
                    {
                        title: "除法的初步认识",
                        subtitle: "理解平均分和除法",
                        examples: ["12÷3=4", "把12个苹果平均分成3份，每份4个"],
                        keyPoints: "把一些东西平均分成几份，求每份是多少，用除法。",
                        points: 10,
                        type: "concept"
                    },
                    {
                        title: "用乘法口诀求商",
                        subtitle: "利用乘法口诀计算除法",
                        examples: ["15÷5=3（三五十五）", "24÷4=6（四六二十四）"],
                        keyPoints: "想乘法口诀，除数和几相乘等于被除数，商就是几。",
                        points: 10,
                        type: "division"
                    }
                ]
            },
            {
                name: "第五单元 · 厘米和米",
                lessons: [
                    {
                        title: "认识厘米",
                        subtitle: "用厘米作单位测量",
                        examples: ["食指宽约1厘米", "铅笔长约15厘米"],
                        keyPoints: "1厘米是一个统一的长度单位，用cm表示。",
                        points: 10,
                        type: "concept"
                    },
                    {
                        title: "认识米",
                        subtitle: "用米作单位测量",
                        examples: ["1米=100厘米", "门高约2米", "课桌高约70厘米"],
                        keyPoints: "量比较长的物体用米作单位，1米=100厘米。",
                        points: 10,
                        type: "concept"
                    }
                ]
            }
        ],
        multiplicationTable: [
            "1×1=1",
            "1×2=2  2×2=4",
            "1×3=3  2×3=6  3×3=9",
            "1×4=4  2×4=8  3×4=12  4×4=16",
            "1×5=5  2×5=10  3×5=15  4×5=20  5×5=25",
            "1×6=6  2×6=12  3×6=18  4×6=24  5×6=30  6×6=36",
            "1×7=7  2×7=14  3×7=21  4×7=28  5×7=35  6×7=42  7×7=49",
            "1×8=8  2×8=16  3×8=24  4×8=32  5×8=40  6×8=48  7×8=56  8×8=64",
            "1×9=9  2×9=18  3×9=27  4×9=36  5×9=45  6×9=54  7×9=63  8×9=72  9×9=81"
        ]
    },

    // ===== 英语 =====
    english: {
        title: "英语",
        subtitle: "小学英语 · 基础",
        icon: "🔤",
        color: "#805ad5",
        gradient: "linear-gradient(135deg, #b794f4 0%, #805ad5 100%)",
        categories: [
            {
                name: "颜色 Colors",
                icon: "🎨",
                words: [
                    { word: "red", meaning: "红色", example: "I like red apples." },
                    { word: "blue", meaning: "蓝色", example: "The sky is blue." },
                    { word: "yellow", meaning: "黄色", example: "I have a yellow pencil." },
                    { word: "green", meaning: "绿色", example: "The grass is green." },
                    { word: "orange", meaning: "橙色", example: "An orange is orange." },
                    { word: "purple", meaning: "紫色", example: "I like purple flowers." },
                    { word: "pink", meaning: "粉色", example: "My bag is pink." },
                    { word: "black", meaning: "黑色", example: "My shoes are black." },
                    { word: "white", meaning: "白色", example: "The cloud is white." },
                    { word: "brown", meaning: "棕色", example: "The bear is brown." }
                ]
            },
            {
                name: "动物 Animals",
                icon: "🐶",
                words: [
                    { word: "cat", meaning: "猫", example: "I have a cat." },
                    { word: "dog", meaning: "狗", example: "The dog is running." },
                    { word: "bird", meaning: "鸟", example: "A bird can fly." },
                    { word: "fish", meaning: "鱼", example: "Fish swim in water." },
                    { word: "rabbit", meaning: "兔子", example: "The rabbit is white." },
                    { word: "bear", meaning: "熊", example: "The bear is big." },
                    { word: "monkey", meaning: "猴子", example: "The monkey is cute." },
                    { word: "elephant", meaning: "大象", example: "The elephant is huge." },
                    { word: "tiger", meaning: "老虎", example: "The tiger is strong." },
                    { word: "panda", meaning: "熊猫", example: "Pandas are from China." }
                ]
            },
            {
                name: "数字 Numbers",
                icon: "🔢",
                words: [
                    { word: "one", meaning: "一", example: "I have one book." },
                    { word: "two", meaning: "二", example: "Two eyes to see." },
                    { word: "three", meaning: "三", example: "Three little pigs." },
                    { word: "four", meaning: "四", example: "Four seasons a year." },
                    { word: "five", meaning: "五", example: "Five fingers on a hand." },
                    { word: "six", meaning: "六", example: "Six is a lucky number." },
                    { word: "seven", meaning: "七", example: "Seven days a week." },
                    { word: "eight", meaning: "八", example: "Eight is my lucky number." },
                    { word: "nine", meaning: "九", example: "Nine players on a team." },
                    { word: "ten", meaning: "十", example: "I have ten toes." }
                ]
            },
            {
                name: "食物 Food",
                icon: "🍎",
                words: [
                    { word: "apple", meaning: "苹果", example: "I eat an apple every day." },
                    { word: "banana", meaning: "香蕉", example: "Monkeys love bananas." },
                    { word: "bread", meaning: "面包", example: "I have bread for breakfast." },
                    { word: "milk", meaning: "牛奶", example: "I drink milk every morning." },
                    { word: "cake", meaning: "蛋糕", example: "Happy birthday! Have some cake." },
                    { word: "rice", meaning: "米饭", example: "We eat rice every day." },
                    { word: "egg", meaning: "鸡蛋", example: "I like boiled eggs." },
                    { word: "water", meaning: "水", example: "Drink more water." }
                ]
            },
            {
                name: "日常用语 Daily English",
                icon: "💬",
                words: [
                    { word: "Hello", meaning: "你好", example: "Hello! How are you?" },
                    { word: "Goodbye", meaning: "再见", example: "Goodbye! See you tomorrow." },
                    { word: "Thank you", meaning: "谢谢", example: "Thank you very much!" },
                    { word: "Sorry", meaning: "对不起", example: "Sorry, I'm late." },
                    { word: "Good morning", meaning: "早上好", example: "Good morning, teacher!" },
                    { word: "Good night", meaning: "晚安", example: "Good night, Mom!" },
                    { word: "Please", meaning: "请", example: "Please help me." },
                    { word: "Yes", meaning: "是的", example: "Yes, I can." },
                    { word: "No", meaning: "不是", example: "No, thank you." }
                ]
            }
        ],
        sentences: [
            { en: "What's your name?", cn: "你叫什么名字？", answer: "My name is..." },
            { en: "How old are you?", cn: "你几岁了？", answer: "I'm 8 years old." },
            { en: "What color is it?", cn: "它是什么颜色的？", answer: "It's red/blue/green." },
            { en: "What's this?", cn: "这是什么？", answer: "It's a book/cat/dog." },
            { en: "Can you swim?", cn: "你会游泳吗？", answer: "Yes, I can. / No, I can't." },
            { en: "Do you like apples?", cn: "你喜欢苹果吗？", answer: "Yes, I do. / No, I don't." }
        ]
    },

    // ===== 劳动 =====
    labor: {
        title: "劳动",
        subtitle: "劳动最光荣",
        icon: "🧹",
        tasks: [
            { name: "整理书包", desc: "自己整理明天的书包", icon: "🎒", points: 5, frequency: "每日" },
            { name: "叠被子", desc: "起床后自己叠好被子", icon: "🛏️", points: 5, frequency: "每日" },
            { name: "扫地", desc: "帮忙打扫房间地面", icon: "🧹", points: 8, frequency: "每周" },
            { name: "擦桌子", desc: "饭后帮忙擦干净桌子", icon: "🪣", points: 5, frequency: "每日" },
            { name: "洗碗", desc: "帮忙洗自己的碗筷", icon: "🍽️", points: 10, frequency: "每周" },
            { name: "倒垃圾", desc: "把垃圾扔到垃圾桶里", icon: "🗑️", points: 5, frequency: "每日" },
            { name: "浇花", desc: "给家里的花浇水", icon: "🪴", points: 5, frequency: "每周" },
            { name: "洗袜子", desc: "自己洗小袜子", icon: "🧦", points: 10, frequency: "每周" },
            { name: "收衣服", desc: "帮忙把晒干的衣服收好", icon: "👕", points: 5, frequency: "每周" },
            { name: "帮拿快递", desc: "帮家人拿快递", icon: "📦", points: 5, frequency: "偶尔" }
        ]
    },

    // ===== 运动 =====
    sports: {
        title: "运动",
        subtitle: "我运动，我健康",
        icon: "⚽",
        activities: [
            { name: "跳绳", desc: "每天跳绳锻炼身体", icon: "🪢", points: 10, target: 100, unit: "个" },
            { name: "跑步", desc: "户外跑步增强体质", icon: "🏃", points: 10, target: 800, unit: "米" },
            { name: "仰卧起坐", desc: "锻炼腹部力量", icon: "💪", points: 8, target: 30, unit: "个" },
            { name: "坐位体前屈", desc: "拉伸身体提高柔韧性", icon: "🤸", points: 8, target: 10, unit: "次" },
            { name: "广播体操", desc: "跟着音乐做广播操", icon: "🎵", points: 5, target: 1, unit: "套" },
            { name: "踢毽子", desc: "练习踢毽子", icon: "🦶", points: 8, target: 20, unit: "个" },
            { name: "打球", desc: "篮球/羽毛球/乒乓球", icon: "🏀", points: 15, target: 30, unit: "分钟" },
            { name: "骑自行车", desc: "户外骑行运动", icon: "🚴", points: 12, target: 20, unit: "分钟" }
        ]
    },

    // ===== 奖励商店 =====
    rewards: [
        { id: "r1", name: "看动画片30分钟", desc: "可以看喜欢的动画片", icon: "📺", cost: 30, category: "娱乐" },
        { id: "r2", name: "吃冰淇淋", desc: "奖励一个美味的冰淇淋", icon: "🍦", cost: 20, category: "美食" },
        { id: "r3", name: "玩游戏30分钟", desc: "可以玩手机/平板游戏", icon: "🎮", cost: 40, category: "娱乐" },
        { id: "r4", name: "去公园玩", desc: "全家去公园玩耍", icon: "🌳", cost: 50, category: "出行" },
        { id: "r5", name: "买一本课外书", desc: "挑选一本喜欢的书", icon: "📚", cost: 60, category: "学习" },
        { id: "r6", name: "吃一顿大餐", desc: "选择喜欢的大餐", icon: "🍔", cost: 80, category: "美食" },
        { id: "r7", name: "去游乐园", desc: "周末去游乐园玩", icon: "🎡", cost: 150, category: "出行" },
        { id: "r8", name: "买一个小玩具", desc: "挑选一个心仪的玩具", icon: "🧸", cost: 100, category: "购物" },
        { id: "r9", name: "晚睡30分钟", desc: "今晚可以晚睡30分钟", icon: "🌙", cost: 25, category: "特权" },
        { id: "r10", name: "免做一次家务", desc: "可以免做一次家务", icon: "🛋️", cost: 35, category: "特权" },
        { id: "r11", name: "看一场电影", desc: "去电影院看一场电影", icon: "🎬", cost: 120, category: "出行" },
        { id: "r12", name: "养一只小宠物", desc: "积攒很多积分后的大奖", icon: "🐹", cost: 500, category: "大奖" }
    ],

    // ===== 游戏列表 =====
    games: [
        { id: "g1", name: "口算大挑战", desc: "快速计算加减乘除", icon: "🧮", tag: "数学", color: "bg-blue", points: 20 },
        { id: "g2", name: "乘法口诀大冒险", desc: "闯关背乘法口诀", icon: "✖️", tag: "数学", color: "bg-purple", points: 20 },
        { id: "g3", name: "单词消消乐", desc: "匹配英语单词和中文", icon: "🔗", tag: "英语", color: "bg-pink", points: 15 },
        { id: "g4", name: "古诗拼拼乐", desc: "把打乱的诗句排好", icon: "📜", tag: "语文", color: "bg-orange", points: 15 },
        { id: "g5", name: "算24点", desc: "用四个数字算出24", icon: "🎯", tag: "数学", color: "bg-teal", points: 25 },
        { id: "g6", name: "生字连连看", desc: "连接汉字和拼音", icon: "✏️", tag: "语文", color: "bg-green", points: 15 }
    ],

    // ===== 萌宠进化表 =====
    petEvolution: [
        { level: 1, name: "蛋宝宝", emoji: "🥚", minExp: 0, desc: "刚出生的蛋宝宝，需要你的关爱才能孵化哦！" },
        { level: 2, name: "小雏鸟", emoji: "🐥", minExp: 50, desc: "破壳而出的小雏鸟，毛茸茸的可爱极了！" },
        { level: 3, name: "小鸟", emoji: "🐤", minExp: 150, desc: "长出羽毛的小鸟，正在学习飞翔。" },
        { level: 4, name: "小精灵", emoji: "🦜", minExp: 300, desc: "五彩斑斓的小精灵，会唱歌啦！" },
        { level: 5, name: "小飞龙", emoji: "🐲", minExp: 500, desc: "进化成小飞龙，可以带你飞翔！" },
        { level: 6, name: "独角兽", emoji: "🦄", minExp: 800, desc: "传说中的独角兽，闪闪发光！" },
        { level: 7, name: "凤凰", emoji: "🦅", minExp: 1200, desc: "浴火重生的凤凰，美丽而强大！" },
        { level: 8, name: "神龙", emoji: "🐉", minExp: 2000, desc: "最高形态的神龙，无所不能！" }
    ],

    // ===== 成就徽章 =====
    badges: [
        { id: "b1", name: "初次打卡", desc: "完成第一次打卡", icon: "🌟", condition: { type: "checkin", value: 1 } },
        { id: "b2", name: "坚持7天", desc: "连续打卡7天", icon: "🔥", condition: { type: "streak", value: 7 } },
        { id: "b3", name: "坚持30天", desc: "连续打卡30天", icon: "👑", condition: { type: "streak", value: 30 } },
        { id: "b4", name: "学霸", desc: "完成10个学习任务", icon: "🎓", condition: { type: "tasks", value: 10 } },
        { id: "b5", name: "劳动小能手", desc: "完成10次劳动", icon: "🧹", condition: { type: "labor", value: 10 } },
        { id: "b6", name: "运动健将", desc: "完成10次运动", icon: "🏃", condition: { type: "sports", value: 10 } },
        { id: "b7", name: "积分达人", desc: "累计获得100积分", icon: "💎", condition: { type: "totalPoints", value: 100 } },
        { id: "b8", name: "小诗人", desc: "背诵5首古诗", icon: "📜", condition: { type: "poems", value: 5 } },
        { id: "b9", name: "口算高手", desc: "口算正确50题", icon: "🧮", condition: { type: "mathCorrect", value: 50 } },
        { id: "b10", name: "萌宠主人", desc: "萌宠进化到3级", icon: "🐾", condition: { type: "petLevel", value: 3 } },
        { id: "b11", name: "游戏达人", desc: "玩10次游戏", icon: "🎮", condition: { type: "gamesPlayed", value: 10 } },
        { id: "b12", name: "全能王", desc: "每个模块都使用过", icon: "🏆", condition: { type: "allModules", value: 1 } }
    ]
};

// ===== 每日学习计划模板 =====
const PLAN_TEMPLATES = {
    weekday: [
        { time: "07:00-07:30", name: "晨读语文", type: "chinese", desc: "朗读课文或背诵古诗", icon: "📖", points: 5 },
        { time: "07:30-07:50", name: "英语晨练", type: "english", desc: "跟读英语单词和句子", icon: "🔤", points: 5 },
        { time: "16:30-17:00", name: "数学练习", type: "math", desc: "完成数学口算和练习", icon: "🔢", points: 10 },
        { time: "17:00-17:20", name: "劳动时间", type: "labor", desc: "完成一项家务劳动", icon: "🧹", points: 5 },
        { time: "17:20-17:50", name: "运动锻炼", type: "sports", desc: "跳绳或户外运动", icon: "⚽", points: 10 },
        { time: "19:00-19:30", name: "语文复习", type: "chinese", desc: "复习当天课文，预习明日内容", icon: "📚", points: 5 },
        { time: "19:30-19:50", name: "英语复习", type: "english", desc: "复习英语单词和句型", icon: "✏️", points: 5 },
        { time: "20:00-20:15", name: "课外阅读", type: "reading", desc: "阅读课外书15分钟", icon: "📘", points: 5 }
    ],
    weekend: [
        { time: "08:00-08:30", name: "晨读时间", type: "chinese", desc: "朗读课文和古诗", icon: "📖", points: 5 },
        { time: "09:00-09:40", name: "数学提升", type: "math", desc: "数学拓展练习和游戏", icon: "🔢", points: 10 },
        { time: "10:00-10:30", name: "英语动画", type: "english", desc: "看英语动画片并跟读", icon: "📺", points: 5 },
        { time: "14:00-14:30", name: "劳动时间", type: "labor", desc: "帮家人做家务", icon: "🧹", points: 8 },
        { time: "15:00-16:00", name: "户外运动", type: "sports", desc: "户外运动一小时", icon: "⚽", points: 15 },
        { time: "16:30-17:00", name: "兴趣学习", type: "reading", desc: "阅读课外书或画画", icon: "🎨", points: 5 },
        { time: "19:00-19:30", name: "趣味游戏", type: "games", desc: "玩学习小游戏", icon: "🎮", points: 10 },
        { time: "20:00-20:30", name: "今日总结", type: "review", desc: "总结今天的收获，照顾萌宠", icon: "📝", points: 5 }
    ]
};
