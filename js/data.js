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

// ===== 语文课程扩展数据（生字详情、近反义词、成语、易错字等）=====
const CHINESE_EXTRA = {
    "1. 小蝌蚪找妈妈": {
        charDetails: [
            { char: "塘", pinyin: "táng", strokes: 13, radical: "土", groups: ["池塘", "鱼塘"] },
            { char: "脑", pinyin: "nǎo", strokes: 10, radical: "月", groups: ["大脑", "脑筋"] },
            { char: "袋", pinyin: "dài", strokes: 11, radical: "衣", groups: ["口袋", "袋子"] },
            { char: "灰", pinyin: "huī", strokes: 6, radical: "火", groups: ["灰色", "灰尘"] },
            { char: "哇", pinyin: "wa", strokes: 9, radical: "口", groups: ["好哇", "哇哇叫"] },
            { char: "教", pinyin: "jiāo", strokes: 11, radical: "攵", groups: ["教书", "教室"] },
            { char: "捕", pinyin: "bǔ", strokes: 10, radical: "扌", groups: ["捕捉", "捕鱼"] },
            { char: "迎", pinyin: "yíng", strokes: 7, radical: "辶", groups: ["迎接", "欢迎"] },
            { char: "阿", pinyin: "ā", strokes: 8, radical: "阝", groups: ["阿姨", "阿哥"] },
            { char: "姨", pinyin: "yí", strokes: 9, radical: "女", groups: ["阿姨", "姨妈"] },
            { char: "宽", pinyin: "kuān", strokes: 10, radical: "宀", groups: ["宽广", "宽大"] },
            { char: "龟", pinyin: "guī", strokes: 7, radical: "龟", groups: ["乌龟", "海龟"] },
            { char: "顶", pinyin: "dǐng", strokes: 8, radical: "页", groups: ["头顶", "山顶"] },
            { char: "披", pinyin: "pī", strokes: 8, radical: "扌", groups: ["披着", "披风"] },
            { char: "鼓", pinyin: "gǔ", strokes: 13, radical: "鼓", groups: ["打鼓", "鼓声"] }
        ],
        antonyms: [
            { word: "宽", near: "宽广、广阔", opposite: "狭窄、窄小" },
            { word: "迎", near: "迎接、迎面", opposite: "送别、告别" }
        ],
        idioms: ["如鱼得水", "井底之蛙"],
        easyWrong: [
            { word: "迎", tip: "先写里面内容，再写走之底" },
            { word: "披", tip: "左边是提手旁，不是木字旁" }
        ]
    },
    "2. 我是什么": {
        charDetails: [
            { char: "晒", pinyin: "shài", strokes: 10, radical: "日", groups: ["晒太阳", "晾晒"] },
            { char: "极", pinyin: "jí", strokes: 7, radical: "木", groups: ["极小", "北极"] },
            { char: "傍", pinyin: "bàng", strokes: 12, radical: "亻", groups: ["傍晚", "傍边"] },
            { char: "越", pinyin: "yuè", strokes: 12, radical: "走", groups: ["越过", "越来越好"] },
            { char: "滴", pinyin: "dī", strokes: 14, radical: "氵", groups: ["水滴", "一滴"] },
            { char: "溪", pinyin: "xī", strokes: 13, radical: "氵", groups: ["小溪", "溪水"] },
            { char: "奔", pinyin: "bēn", strokes: 8, radical: "大", groups: ["奔跑", "飞奔"] },
            { char: "洋", pinyin: "yáng", strokes: 9, radical: "氵", groups: ["海洋", "大洋"] },
            { char: "坏", pinyin: "huài", strokes: 7, radical: "土", groups: ["坏事", "好坏"] },
            { char: "淹", pinyin: "yān", strokes: 11, radical: "氵", groups: ["淹没", "淹水"] },
            { char: "没", pinyin: "mò", strokes: 7, radical: "氵", groups: ["沉没", "没收"] },
            { char: "冲", pinyin: "chōng", strokes: 6, radical: "冫", groups: ["冲走", "冲刺"] },
            { char: "毁", pinyin: "huǐ", strokes: 13, radical: "殳", groups: ["毁坏", "烧毁"] },
            { char: "屋", pinyin: "wū", strokes: 9, radical: "尸", groups: ["房屋", "屋顶"] },
            { char: "灾", pinyin: "zāi", strokes: 7, radical: "宀", groups: ["灾害", "水灾"] }
        ],
        antonyms: [
            { word: "坏", near: "坏、糟糕", opposite: "好、美好" },
            { word: "硬", near: "坚硬、牢固", opposite: "软、柔软" }
        ],
        idioms: ["滴水成冰", "汪洋大海"],
        easyWrong: [
            { word: "越", tip: "走字底，先写走再写戉" },
            { word: "灾", tip: "上面是宀头，不是穴头" }
        ]
    },
    "3. 植物妈妈有办法": {
        charDetails: [
            { char: "植", pinyin: "zhí", strokes: 12, radical: "木", groups: ["植物", "种植"] },
            { char: "如", pinyin: "rú", strokes: 6, radical: "女", groups: ["如果", "如同"] },
            { char: "为", pinyin: "wéi", strokes: 4, radical: "丶", groups: ["因为", "以为"] },
            { char: "旅", pinyin: "lǚ", strokes: 10, radical: "方", groups: ["旅行", "旅游"] },
            { char: "备", pinyin: "bèi", strokes: 8, radical: "夂", groups: ["准备", "备用"] },
            { char: "纷", pinyin: "fēn", strokes: 7, radical: "纟", groups: ["纷纷", "纷飞"] },
            { char: "刺", pinyin: "cì", strokes: 8, radical: "刂", groups: ["刺刀", "鱼刺"] },
            { char: "底", pinyin: "dǐ", strokes: 8, radical: "广", groups: ["底下", "到底"] },
            { char: "炸", pinyin: "zhà", strokes: 9, radical: "火", groups: ["炸开", "爆炸"] },
            { char: "离", pinyin: "lí", strokes: 10, radical: "亠", groups: ["离开", "距离"] },
            { char: "察", pinyin: "chá", strokes: 14, radical: "宀", groups: ["观察", "警察"] },
            { char: "识", pinyin: "shí", strokes: 7, radical: "讠", groups: ["认识", "知识"] },
            { char: "粗", pinyin: "cū", strokes: 11, radical: "米", groups: ["粗细", "粗心"] },
            { char: "得", pinyin: "dé", strokes: 11, radical: "彳", groups: ["得到", "得分"] }
        ],
        antonyms: [
            { word: "粗", near: "粗大、粗壮", opposite: "细、细致" },
            { word: "离", near: "离开、分离", opposite: "合、相聚" }
        ],
        idioms: ["粗心大意", "四海为家"],
        easyWrong: [
            { word: "察", tip: "中间是祭字变形，不要少写笔画" },
            { word: "刺", tip: "左边是朿，不是束" }
        ]
    },
    "识字1. 场景歌": {
        charDetails: [
            { char: "海", pinyin: "hǎi", strokes: 10, radical: "氵", groups: ["大海", "海边"] },
            { char: "军", pinyin: "jūn", strokes: 6, radical: "冖", groups: ["军队", "军舰"] },
            { char: "舰", pinyin: "jiàn", strokes: 10, radical: "舟", groups: ["军舰", "舰队"] },
            { char: "帆", pinyin: "fān", strokes: 6, radical: "巾", groups: ["帆船", "风帆"] },
            { char: "稻", pinyin: "dào", strokes: 15, radical: "禾", groups: ["水稻", "稻谷"] },
            { char: "园", pinyin: "yuán", strokes: 7, radical: "囗", groups: ["花园", "公园"] },
            { char: "翠", pinyin: "cuì", strokes: 14, radical: "羽", groups: ["翠竹", "翠绿"] },
            { char: "队", pinyin: "duì", strokes: 4, radical: "阝", groups: ["队伍", "排队"] },
            { char: "铜", pinyin: "tóng", strokes: 11, radical: "钅", groups: ["铜号", "铜钱"] },
            { char: "号", pinyin: "hào", strokes: 5, radical: "口", groups: ["口号", "号码"] },
            { char: "领", pinyin: "lǐng", strokes: 11, radical: "页", groups: ["领子", "带领"] },
            { char: "巾", pinyin: "jīn", strokes: 3, radical: "巾", groups: ["毛巾", "红领巾"] }
        ],
        antonyms: [
            { word: "圆", near: "圆形、圆满", opposite: "方、方正" }
        ],
        idioms: ["一帆风顺", "乘风破浪"],
        easyWrong: [
            { char: "舰", tip: "左边是舟字旁，不是月字旁" },
            { char: "翠", tip: "上面是羽字头，不是卒字" }
        ]
    },
    "识字2. 树之歌": {
        charDetails: [
            { char: "杨", pinyin: "yáng", strokes: 7, radical: "木", groups: ["杨树", "白杨"] },
            { char: "壮", pinyin: "zhuàng", strokes: 6, radical: "士", groups: ["壮大", "强壮"] },
            { char: "桐", pinyin: "tóng", strokes: 10, radical: "木", groups: ["梧桐", "油桐"] },
            { char: "枫", pinyin: "fēng", strokes: 8, radical: "木", groups: ["枫树", "枫叶"] },
            { char: "松", pinyin: "sōng", strokes: 8, radical: "木", groups: ["松树", "松果"] },
            { char: "柏", pinyin: "bǎi", strokes: 9, radical: "木", groups: ["柏树", "松柏"] },
            { char: "杉", pinyin: "shān", strokes: 7, radical: "木", groups: ["杉树", "水杉"] },
            { char: "化", pinyin: "huà", strokes: 4, radical: "亻", groups: ["变化", "化石"] },
            { char: "桂", pinyin: "guì", strokes: 10, radical: "木", groups: ["桂花", "桂树"] }
        ],
        antonyms: [
            { word: "壮", near: "强壮、健壮", opposite: "弱、瘦弱" },
            { word: "暖", near: "温暖、暖和", opposite: "冷、寒冷" }
        ],
        idioms: ["岁寒松柏", "叶落归根"],
        easyWrong: [
            { char: "杉", tip: "右边三撇，不是彡" },
            { char: "壮", tip: "左边是丬，不是爿" }
        ]
    },
    "识字3. 拍手歌": {
        charDetails: [
            { char: "世", pinyin: "shì", strokes: 5, radical: "一", groups: ["世界", "世纪"] },
            { char: "界", pinyin: "jiè", strokes: 9, radical: "田", groups: ["世界", "边界"] },
            { char: "雀", pinyin: "què", strokes: 11, radical: "隹", groups: ["孔雀", "麻雀"] },
            { char: "锦", pinyin: "jǐn", strokes: 13, radical: "钅", groups: ["锦鸡", "锦缎"] },
            { char: "雄", pinyin: "xióng", strokes: 12, radical: "隹", groups: ["雄鹰", "英雄"] },
            { char: "鹰", pinyin: "yīng", strokes: 18, radical: "鸟", groups: ["老鹰", "雄鹰"] },
            { char: "翔", pinyin: "xiáng", strokes: 12, radical: "羽", groups: ["飞翔", "滑翔"] },
            { char: "雁", pinyin: "yàn", strokes: 12, radical: "隹", groups: ["大雁", "雁群"] },
            { char: "丛", pinyin: "cóng", strokes: 5, radical: "一", groups: ["树丛", "草丛"] },
            { char: "深", pinyin: "shēn", strokes: 11, radical: "氵", groups: ["深处", "深浅"] },
            { char: "猛", pinyin: "měng", strokes: 11, radical: "犭", groups: ["猛烈", "猛虎"] },
            { char: "灵", pinyin: "líng", strokes: 7, radical: "火", groups: ["灵巧", "机灵"] },
            { char: "休", pinyin: "xiū", strokes: 6, radical: "亻", groups: ["休息", "休想"] }
        ],
        antonyms: [
            { word: "深", near: "深沉、深厚", opposite: "浅、浅显" },
            { word: "猛", near: "猛烈、凶猛", opposite: "温、温和" }
        ],
        idioms: ["鹰击长空", "莺歌燕舞"],
        easyWrong: [
            { char: "鹰", tip: "笔画多，注意下面是鸟字" },
            { char: "休", tip: "左边亻右边木，人靠树休息" }
        ]
    },
    "识字4. 田家四季歌": {
        charDetails: [
            { char: "季", pinyin: "jì", strokes: 8, radical: "子", groups: ["四季", "季节"] },
            { char: "蝴", pinyin: "hú", strokes: 15, radical: "虫", groups: ["蝴蝶", "蝴蝶花"] },
            { char: "蝶", pinyin: "dié", strokes: 15, radical: "虫", groups: ["蝴蝶", "飞蝶"] },
            { char: "麦", pinyin: "mài", strokes: 7, radical: "麦", groups: ["麦苗", "小麦"] },
            { char: "苗", pinyin: "miáo", strokes: 8, radical: "艹", groups: ["麦苗", "树苗"] },
            { char: "嫩", pinyin: "nèn", strokes: 14, radical: "女", groups: ["嫩绿", "娇嫩"] },
            { char: "桑", pinyin: "sāng", strokes: 10, radical: "木", groups: ["桑叶", "桑树"] },
            { char: "肥", pinyin: "féi", strokes: 8, radical: "月", groups: ["肥胖", "化肥"] },
            { char: "农", pinyin: "nóng", strokes: 6, radical: "冖", groups: ["农民", "农田"] },
            { char: "归", pinyin: "guī", strokes: 5, radical: "彐", groups: ["归来", "回归"] },
            { char: "戴", pinyin: "dài", strokes: 17, radical: "戈", groups: ["穿戴", "戴帽"] },
            { char: "场", pinyin: "cháng", strokes: 6, radical: "土", groups: ["场院", "打场"] },
            { char: "粒", pinyin: "lì", strokes: 11, radical: "米", groups: ["一粒", "颗粒"] },
            { char: "虽", pinyin: "suī", strokes: 9, radical: "虫", groups: ["虽然", "虽说"] },
            { char: "苦", pinyin: "kǔ", strokes: 8, radical: "艹", groups: ["辛苦", "苦瓜"] }
        ],
        antonyms: [
            { word: "嫩", near: "娇嫩、柔嫩", opposite: "老、粗老" },
            { word: "苦", near: "辛苦、艰苦", opposite: "甜、甘甜" },
            { word: "忙", near: "忙碌、繁忙", opposite: "闲、清闲" }
        ],
        idioms: ["春华秋实", "辛勤劳动"],
        easyWrong: [
            { char: "戴", tip: "笔画多，注意左下是异字变形" },
            { char: "粒", tip: "左边米字旁，不是立字" }
        ]
    },
    "4. 曹冲称象": {
        charDetails: [
            { char: "柱", pinyin: "zhù", strokes: 9, radical: "木", groups: ["柱子", "石柱"] },
            { char: "议", pinyin: "yì", strokes: 5, radical: "讠", groups: ["议论", "会议"] },
            { char: "论", pinyin: "lùn", strokes: 6, radical: "讠", groups: ["议论", "讨论"] },
            { char: "重", pinyin: "zhòng", strokes: 9, radical: "里", groups: ["重量", "重要"] },
            { char: "秤", pinyin: "chèng", strokes: 10, radical: "禾", groups: ["秤杆", "过秤"] },
            { char: "砍", pinyin: "kǎn", strokes: 9, radical: "石", groups: ["砍树", "砍刀"] },
            { char: "线", pinyin: "xiàn", strokes: 8, radical: "纟", groups: ["毛线", "线条"] },
            { char: "止", pinyin: "zhǐ", strokes: 4, radical: "止", groups: ["停止", "止步"] },
            { char: "量", pinyin: "liàng", strokes: 12, radical: "里", groups: ["重量", "测量"] }
        ],
        antonyms: [
            { word: "重", near: "沉重、重要", opposite: "轻、轻微" },
            { word: "沉", near: "下沉、沉重", opposite: "浮、漂浮" }
        ],
        idioms: ["绞尽脑汁", "灵机一动"],
        easyWrong: [
            { char: "秤", tip: "左边禾字旁，不是木字旁" },
            { char: "论", tip: "右边是仑，不是仓" }
        ]
    },
    "5. 玲玲的画": {
        charDetails: [
            { char: "详", pinyin: "xiáng", strokes: 8, radical: "讠", groups: ["详细", "详谈"] },
            { char: "幅", pinyin: "fú", strokes: 12, radical: "巾", groups: ["一幅画", "篇幅"] },
            { char: "评", pinyin: "píng", strokes: 7, radical: "讠", groups: ["评比", "评分"] },
            { char: "奖", pinyin: "jiǎng", strokes: 9, radical: "大", groups: ["奖状", "获奖"] },
            { char: "候", pinyin: "hòu", strokes: 10, radical: "亻", groups: ["时候", "等候"] },
            { char: "报", pinyin: "bào", strokes: 7, radical: "扌", groups: ["报纸", "报告"] },
            { char: "另", pinyin: "lìng", strokes: 5, radical: "口", groups: ["另外", "另有"] },
            { char: "及", pinyin: "jí", strokes: 3, radical: "丿", groups: ["及时", "及格"] },
            { char: "懒", pinyin: "lǎn", strokes: 16, radical: "忄", groups: ["懒惰", "偷懒"] },
            { char: "并", pinyin: "bìng", strokes: 6, radical: "丷", groups: ["并且", "合并"] }
        ],
        antonyms: [
            { word: "懒", near: "懒惰、偷懒", opposite: "勤、勤奋" },
            { word: "好", near: "美好、良好", opposite: "坏、糟糕" }
        ],
        idioms: ["动脑筋", "画龙点睛"],
        easyWrong: [
            { char: "幅", tip: "左边巾字旁，不是衣字旁" },
            { char: "奖", tip: "下面是大字，不是犬字" }
        ]
    },
    "6. 一封信": {
        charDetails: [
            { char: "封", pinyin: "fēng", strokes: 9, radical: "寸", groups: ["一封信", "封面"] },
            { char: "信", pinyin: "xìn", strokes: 9, radical: "亻", groups: ["写信", "信心"] },
            { char: "今", pinyin: "jīn", strokes: 4, radical: "人", groups: ["今天", "今年"] },
            { char: "支", pinyin: "zhī", strokes: 4, radical: "支", groups: ["一支笔", "支撑"] },
            { char: "圆", pinyin: "yuán", strokes: 10, radical: "囗", groups: ["圆形", "圆珠笔"] },
            { char: "珠", pinyin: "zhū", strokes: 10, radical: "王", groups: ["珠子", "珍珠"] },
            { char: "笔", pinyin: "bǐ", strokes: 10, radical: "竹", groups: ["铅笔", "毛笔"] },
            { char: "灯", pinyin: "dēng", strokes: 6, radical: "火", groups: ["电灯", "台灯"] },
            { char: "削", pinyin: "xiāo", strokes: 9, radical: "刂", groups: ["削铅笔", "削皮"] },
            { char: "锅", pinyin: "guō", strokes: 12, radical: "钅", groups: ["锅子", "铁锅"] },
            { char: "朝", pinyin: "cháo", strokes: 12, radical: "月", groups: ["朝向", "朝代"] },
            { char: "刮", pinyin: "guā", strokes: 8, radical: "刂", groups: ["刮风", "刮脸"] },
            { char: "胡", pinyin: "hú", strokes: 9, radical: "月", groups: ["胡子", "胡说"] },
            { char: "修", pinyin: "xiū", strokes: 9, radical: "亻", groups: ["修理", "修改"] }
        ],
        antonyms: [
            { word: "朝", near: "朝阳、朝前", opposite: "夕、傍晚" },
            { word: "冷", near: "寒冷、冰凉", opposite: "热、温暖" }
        ],
        idioms: ["家书抵万金", "鸿雁传书"],
        easyWrong: [
            { char: "封", tip: "右边是寸字，不是才字" },
            { char: "削", tip: "右边是肖字，不是月字" }
        ]
    },
    "7. 妈妈睡了": {
        charDetails: [
            { char: "哄", pinyin: "hǒng", strokes: 9, radical: "口", groups: ["哄睡", "哄人"] },
            { char: "先", pinyin: "xiān", strokes: 6, radical: "儿", groups: ["首先", "先生"] },
            { char: "闭", pinyin: "bì", strokes: 6, radical: "门", groups: ["闭上", "关闭"] },
            { char: "紧", pinyin: "jǐn", strokes: 10, radical: "糸", groups: ["紧紧", "要紧"] },
            { char: "润", pinyin: "rùn", strokes: 10, radical: "氵", groups: ["湿润", "红润"] },
            { char: "等", pinyin: "děng", strokes: 12, radical: "竹", groups: ["等待", "相等"] },
            { char: "吸", pinyin: "xī", strokes: 6, radical: "口", groups: ["呼吸", "吸气"] },
            { char: "发", pinyin: "fà", strokes: 5, radical: "又", groups: ["头发", "发现"] },
            { char: "粘", pinyin: "zhān", strokes: 11, radical: "米", groups: ["粘贴", "粘住"] },
            { char: "额", pinyin: "é", strokes: 12, radical: "页", groups: ["额头", "额外"] },
            { char: "乏", pinyin: "fá", strokes: 4, radical: "丿", groups: ["乏困", "缺乏"] },
            { char: "沙", pinyin: "shā", strokes: 7, radical: "氵", groups: ["沙子", "沙沙声"] }
        ],
        antonyms: [
            { word: "闭", near: "关闭、合上", opposite: "开、张开" },
            { word: "紧", near: "紧密、紧贴", opposite: "松、松弛" }
        ],
        idioms: ["慈母手中线", "嘘寒问暖"],
        easyWrong: [
            { char: "哄", tip: "左边口字旁，不是言字旁" },
            { char: "粘", tip: "左边米字旁，不是黍字旁" }
        ]
    },
    "8. 古诗二首": {
        charDetails: [
            { char: "楼", pinyin: "lóu", strokes: 13, radical: "木", groups: ["楼房", "城楼"] },
            { char: "依", pinyin: "yī", strokes: 8, radical: "亻", groups: ["依靠", "依山"] },
            { char: "尽", pinyin: "jìn", strokes: 6, radical: "尸", groups: ["尽力", "尽头"] },
            { char: "欲", pinyin: "yù", strokes: 11, radical: "欠", groups: ["欲望", "想要"] },
            { char: "穷", pinyin: "qióng", strokes: 7, radical: "穴", groups: ["穷尽", "贫穷"] },
            { char: "层", pinyin: "céng", strokes: 7, radical: "尸", groups: ["一层", "层次"] },
            { char: "瀑", pinyin: "pù", strokes: 18, radical: "氵", groups: ["瀑布", "飞瀑"] },
            { char: "布", pinyin: "bù", strokes: 5, radical: "巾", groups: ["瀑布", "布匹"] },
            { char: "炉", pinyin: "lú", strokes: 8, radical: "火", groups: ["火炉", "香炉"] },
            { char: "烟", pinyin: "yān", strokes: 10, radical: "火", groups: ["炊烟", "烟囱"] },
            { char: "遥", pinyin: "yáo", strokes: 13, radical: "辶", groups: ["遥远", "遥望"] },
            { char: "川", pinyin: "chuān", strokes: 3, radical: "川", groups: ["山川", "河流"] }
        ],
        antonyms: [
            { word: "穷", near: "穷尽、到底", opposite: "富、丰富" },
            { word: "高", near: "高大、高远", opposite: "低、低矮" }
        ],
        idioms: ["更上一层楼", "飞流直下"],
        easyWrong: [
            { char: "瀑", tip: "笔画多，右边是暴字" },
            { char: "遥", tip: "走之底，先写里面的摇" }
        ]
    },
    "9. 黄山奇石": {
        charDetails: [
            { char: "闻", pinyin: "wén", strokes: 9, radical: "门", groups: ["闻名", "新闻"] },
            { char: "名", pinyin: "míng", strokes: 6, radical: "口", groups: ["名字", "有名"] },
            { char: "景", pinyin: "jǐng", strokes: 12, radical: "日", groups: ["景色", "风景"] },
            { char: "区", pinyin: "qū", strokes: 4, radical: "匚", groups: ["景区", "地区"] },
            { char: "省", pinyin: "shěng", strokes: 9, radical: "目", groups: ["省份", "省事"] },
            { char: "部", pinyin: "bù", strokes: 10, radical: "阝", groups: ["部分", "南部"] },
            { char: "秀", pinyin: "xiù", strokes: 7, radical: "禾", groups: ["秀丽", "优秀"] },
            { char: "尤", pinyin: "yóu", strokes: 4, radical: "尢", groups: ["尤其", "尤为"] },
            { char: "其", pinyin: "qí", strokes: 8, radical: "八", groups: ["其中", "其他"] },
            { char: "仙", pinyin: "xiān", strokes: 5, radical: "亻", groups: ["仙人", "神仙"] },
            { char: "巨", pinyin: "jù", strokes: 4, radical: "工", groups: ["巨大", "巨人"] },
            { char: "位", pinyin: "wèi", strokes: 7, radical: "亻", groups: ["位置", "座位"] },
            { char: "都", pinyin: "dōu", strokes: 10, radical: "阝", groups: ["都是", "首都"] }
        ],
        antonyms: [
            { word: "巨", near: "巨大、巨型", opposite: "小、微小" },
            { word: "奇", near: "奇特、奇异", opposite: "平、平凡" }
        ],
        idioms: ["闻名中外", "奇形怪状"],
        easyWrong: [
            { char: "省", tip: "上面少一目，不是目字" },
            { char: "巨", tip: "注意笔顺，先写横再写竖折" }
        ]
    },
    "10. 日月潭": {
        charDetails: [
            { char: "湾", pinyin: "wān", strokes: 12, radical: "氵", groups: ["海湾", "台湾"] },
            { char: "名", pinyin: "míng", strokes: 6, radical: "口", groups: ["名胜", "名字"] },
            { char: "胜", pinyin: "shèng", strokes: 9, radical: "月", groups: ["名胜", "胜利"] },
            { char: "迹", pinyin: "jì", strokes: 9, radical: "辶", groups: ["古迹", "事迹"] },
            { char: "央", pinyin: "yāng", strokes: 5, radical: "大", groups: ["中央", "央求"] },
            { char: "丽", pinyin: "lì", strokes: 7, radical: "一", groups: ["美丽", "秀丽"] },
            { char: "华", pinyin: "huá", strokes: 6, radical: "十", groups: ["中华", "华丽"] },
            { char: "展", pinyin: "zhǎn", strokes: 10, radical: "尸", groups: ["展现", "展开"] },
            { char: "现", pinyin: "xiàn", strokes: 8, radical: "王", groups: ["展现", "现在"] },
            { char: "披", pinyin: "pī", strokes: 8, radical: "扌", groups: ["披上", "披风"] },
            { char: "纱", pinyin: "shā", strokes: 7, radical: "纟", groups: ["薄纱", "纱巾"] },
            { char: "童", pinyin: "tóng", strokes: 12, radical: "立", groups: ["童话", "儿童"] }
        ],
        antonyms: [
            { word: "胜", near: "名胜、胜利", opposite: "败、失败" },
            { word: "美", near: "美丽、美好", opposite: "丑、丑陋" }
        ],
        idioms: ["湖光山色", "风景如画"],
        easyWrong: [
            { char: "湾", tip: "左边氵，右边弯" },
            { char: "迹", tip: "走之底，先写亦再写辶" }
        ]
    },
    "11. 葡萄沟": {
        charDetails: [
            { char: "沟", pinyin: "gōu", strokes: 7, radical: "氵", groups: ["水沟", "山沟"] },
            { char: "产", pinyin: "chǎn", strokes: 6, radical: "亠", groups: ["出产", "生产"] },
            { char: "份", pinyin: "fèn", strokes: 6, radical: "亻", groups: ["月份", "一份"] },
            { char: "枝", pinyin: "zhī", strokes: 8, radical: "木", groups: ["树枝", "枝叶"] },
            { char: "搭", pinyin: "dā", strokes: 12, radical: "扌", groups: ["搭建", "搭棚"] },
            { char: "淡", pinyin: "dàn", strokes: 11, radical: "氵", groups: ["淡绿", "清淡"] },
            { char: "好", pinyin: "hǎo", strokes: 6, radical: "女", groups: ["好看", "好处"] },
            { char: "收", pinyin: "shōu", strokes: 6, radical: "攵", groups: ["收获", "收成"] },
            { char: "城", pinyin: "chéng", strokes: 9, radical: "土", groups: ["城市", "长城"] },
            { char: "市", pinyin: "shì", strokes: 5, radical: "亠", groups: ["城市", "市场"] },
            { char: "留", pinyin: "liú", strokes: 10, radical: "田", groups: ["留下", "保留"] },
            { char: "钉", pinyin: "dīng", strokes: 7, radical: "钅", groups: ["钉子", "铁钉"] },
            { char: "利", pinyin: "lì", strokes: 7, radical: "刂", groups: ["利用", "锋利"] },
            { char: "分", pinyin: "fēn", strokes: 4, radical: "八", groups: ["分开", "十分"] },
            { char: "味", pinyin: "wèi", strokes: 8, radical: "口", groups: ["味道", "香味"] }
        ],
        antonyms: [
            { word: "淡", near: "清淡、淡色", opposite: "浓、浓郁" },
            { word: "收", near: "收获、收集", opposite: "放、释放" }
        ],
        idioms: ["五光十色", "硕果累累"],
        easyWrong: [
            { char: "搭", tip: "右边是答字，不是塔字少一笔" },
            { char: "份", tip: "左边亻，不是分字" }
        ]
    }
};

// ===== 课文原文 =====
const LESSON_TEXTS = {
    "1. 小蝌蚪找妈妈": "池塘里有一群小蝌蚪，大大的脑袋，黑灰色的身子，甩着长长的尾巴，快活地游来游去。\n\n小蝌蚪游哇游，过了几天，长出了两条前腿。他们看见鲤鱼妈妈在教小鲤鱼捕食，就迎上去，叫着：“妈妈，妈妈！”鲤鱼妈妈说：“我不是你们的妈妈。你们的妈妈四条腿，宽嘴巴，你们到那边去找吧！”\n\n小蝌蚪游哇游，过了几天，长出了两条后腿。他们看见一只乌龟摆动着四条腿，在水里游，就追上去，叫着：“妈妈，妈妈！”乌龟说：“我不是你们的妈妈。你们的妈妈头顶上有两只大眼睛，披着绿衣裳。你们到那边去找吧！”\n\n小蝌蚪游哇游，过了几天，尾巴变短了。他们看见荷叶上蹲着一只大青蛙，披着碧绿的衣裳，露着雪白的肚皮，鼓着一对大眼睛。\n\n不知什么时候，小青蛙的尾巴不见了。他们跟着妈妈，天天去捉害虫。",
    "2. 我是什么": "我会变成什么？\n\n我会变。太阳一晒，我就变成气体飞到空中。我在空中越升越高，碰到冷气就变成无数小水滴。小水滴聚在一起落下来，人们叫我“雨”。有时候我变成小硬球打下来，人们叫我“冰雹”。到了冬天，我变成小花朵飘下来，人们叫我“雪”。\n\n我在池子里睡觉，在小溪里散步，在江河里奔跑，在海洋里跳舞，唱歌，开会。\n\n有时候我很温和，有时候我很暴躁。我做过许多好事，灌溉田地，发动机器，帮助人们工作。我也做过许多坏事，淹没庄稼，冲毁房屋，给人们带来灾害。\n\n小朋友，你们猜猜，我是什么？",
    "3. 植物妈妈有办法": "孩子如果已经长大，就得告别妈妈，四海为家。牛马有脚，鸟有翅膀，植物旅行又用什么办法？\n\n蒲公英妈妈准备了降落伞，把它送给自己的娃娃。只要有风轻轻吹过，孩子们就乘着风纷纷出发。\n\n苍耳妈妈有个好办法，她给孩子穿上带刺的铠甲。只要挂住动物的皮毛，孩子们就能去田野、山洼。\n\n豌豆妈妈更有办法，她让豆荚晒在太阳底下。啪的一声，豆荚炸开，孩子们就蹦跳着离开妈妈。\n\n植物妈妈的办法很多很多，不信你就仔细观察。那里有许许多多的知识，粗心的小朋友却得不到它。",
    "识字1. 场景歌": "一只海鸥，一片沙滩，一艘军舰，一条帆船。\n\n一方鱼塘，一块稻田，一行垂柳，一座花园。\n\n一道小溪，一孔石桥，一竿翠竹，一群飞鸟。\n\n一面队旗，一把铜号，一队“红领巾”，一片欢笑。",
    "识字2. 树之歌": "杨树高，榕树壮，梧桐树叶像手掌。枫树秋天叶儿红，松柏四季披绿装。\n\n木棉喜暖在南方，桦树耐寒守北疆。银杏水杉活化石，金桂开花满院香。",
    "识字3. 拍手歌": "你拍一，我拍一，保护动物要牢记。\n\n你拍二，我拍二，孔雀锦鸡是伙伴。\n\n你拍三，我拍三，雄鹰飞翔在蓝天。\n\n你拍四，我拍四，天空雁群会写字。\n\n你拍五，我拍五，丛林深处有猛虎。\n\n你拍六，我拍六，黄鹂百灵唱不休。\n\n你拍七，我拍七，竹林熊猫在嬉戏。\n\n你拍八，我拍八，大小动物都有家。\n\n你拍九，我拍九，人和动物是朋友。\n\n你拍十，我拍十，保护动物是大事。",
    "识字4. 田家四季歌": "春季里，春风吹，花开草长蝴蝶飞。麦苗儿多嫩，桑叶儿正肥。\n\n夏季里，农事忙，采了蚕桑又插秧。早起勤耕作，归来戴月光。\n\n秋季里，稻上场，谷像黄金粒粒香。身体虽辛苦，心里喜洋洋。\n\n冬季里，雪初晴，新制棉衣暖又轻。一年农事了，大家笑盈盈。",
    "4. 曹冲称象": "有人送给曹操一头大象。曹操想知道这头大象有多重，可是他和大臣们都想不出称大象的办法。\n\n曹操的儿子曹冲才七岁，他站出来，说：“我有个办法。把大象赶到一艘大船上，看船身沉下多少，就在水面齐着船身画一条线。再把大象牵上岸，往船上装石头，装到画线的地方为止。然后称一称船上的石头。石头有多重，大象就有多重。”\n\n曹操微笑着点了点头。他叫人按照曹冲说的办法去做，果然称出了大象的重量。",
    "5. 玲玲的画": "玲玲得意地端详着自己画的《我家的一角》。这幅画明天就要参加评奖了。\n\n可是，水彩笔叭的一掉，把画弄脏了。玲玲哇地哭了起来。\n\n爸爸拿起画，仔细地看了看，说：“别哭，孩子。在这儿画点什么，不是很好吗？”\n\n玲玲想了想，拿起笔，在弄脏的地方画了一只小花狗。小花狗眯着眼睛懒洋洋地趴在楼梯上，整幅画看上去更好了。\n\n爸爸说：“看到了吧，孩子。好多事情并不像我们想象的那么糟。只要肯动脑筋，坏事往往能变成好事。”",
    "6. 一封信": "爸爸出国了，要过半年才能回来。今天妈妈对露西说：“我们给爸爸写一封信吧。”\n\n露西一边写信，一边对妈妈说：“爸爸不在，我们一点也不开心。以前每天爸爸回家，都会抱我，给我讲故事。还有我的台灯坏了，修不好。”\n\n妈妈说：“可以把不开心的事写给爸爸，也可以把开心的事写给爸爸。”\n\n露西重新写信。她写道：“亲爱的爸爸，我们挺好的。这里有太阳花开了，好漂亮！我还学会了自己削铅笔。周末我要和希希一起去看电影。请你不要太为我们担心。” \n\n妈妈在信的结尾写下：一人一个微笑。",
    "7. 妈妈睡了": "妈妈睡了。妈妈哄我午睡的时候，自己先睡着了，睡得好熟，好香。\n\n睡梦中的妈妈真美丽。妈妈明亮的眼睛闭上了，紧紧地闭着。妈妈的嘴巴弯弯的，像是在笑。\n\n睡梦中的妈妈好温柔。妈妈在微微地笑着，嘴巴、眼角都笑弯了。好像在睡梦中，妈妈又想好了一个故事，等会儿讲给我听。\n\n睡梦中的妈妈好累。妈妈的呼吸那么沉，细密的汗珠渗在额头上。窗外，小鸟在唱着歌，风儿在树叶间散步，发出沙沙的响声。可是妈妈全听不到。她干了好多活儿，累了，乏了，她真该好好睡一觉。",
    "8. 古诗二首": "",
    "9. 黄山奇石": "中外闻名的黄山风景区在我国安徽省南部。那里的景色秀丽神奇，尤其是那些怪石，有趣极了。\n\n就说“仙桃石”吧，它好像从天上飞下来的一个大桃子，落在山顶的石盘上。\n\n在一座陡峭的山峰上，有一只“猴子”。它两只胳膊抱着腿，一动不动地蹲在山头，望着翻滚的云海。这就是有趣的“猴子观海”。\n\n“仙人指路”就更有趣了！远远望去，那巨石真像一位仙人站在高高的山峰上，伸着手臂指向前方。\n\n每当太阳升起，山峰上的几块巨石，就变成了一只金光闪闪的雄鸡。它伸着脖子，对着天都峰不住地啼叫。这就是著名的“金鸡叫天都”了。\n\n黄山的奇石还有很多很多，如“天狗望月”“狮子抢球”“仙女弹琴”……那些叫不出名字的奇形怪状的岩石，正等你去给它们起名字呢！",
    "10. 日月潭": "日月潭是我国台湾省最大的一个湖。它在高山上，群山环绕，树木茂盛，周围有许多名胜古迹。\n\n日月潭很深，湖水碧绿。湖中央有个美丽的小岛，叫光华岛。小岛把湖水分成两半，北边像圆圆的太阳，叫日潭；南边像弯弯的月亮，叫月潭，所以人们称它为日月潭。\n\n清晨，湖面上飘着薄薄的雾。天边的晨星和山上的点点灯光，隐隐约约地倒映在湖水中。\n\n中午，太阳高照，整个日月潭的美景和周围的建筑，都清晰地展现在眼前。\n\n要是下起蒙蒙细雨，日月潭好像披上轻纱，周围的景物一片朦胧，就像童话中的仙境。\n\n日月潭风光秀丽，吸引了许许多多的中外游客。",
    "11. 葡萄沟": "新疆吐鲁番有个地方叫葡萄沟。那里出产水果。五月有桑椹，六月有杏子、无花果，到了七月份，人们最喜爱的葡萄成熟了。\n\n葡萄种在山坡的梯田上。茂密的枝叶向四面展开，就像搭起了一个绿色的凉棚。到了秋季，葡萄一大串一大串地挂在绿叶底下，有红的、白的、紫的、暗红的、淡绿的，五光十色，美丽极了。要是这时候你到葡萄沟去，热情好客的维吾尔族老乡，准会摘下最甜的葡萄，让你吃个够。\n\n收下来的葡萄有的运到城市去，有的运到阴房里制成葡萄干。阴房修在山坡上，样子很像碉堡，四壁留着许多小孔，里面钉着许多木架子。成串的葡萄挂在架子上，利用流动的热空气，把水分蒸发掉，就成了葡萄干。这里生产的葡萄干颜色鲜，味道甜，非常有名。"
};

// ===== 生字笔顺数据 =====
const STROKE_ORDER = {
    // 1. 小蝌蚪找妈妈
    "塘": "横、竖、提、点、横、竖折、横、横、竖、横折、横、横、竖、横",
    "脑": "撇、横折钩、横、横、点、横、撇、点、竖弯钩",
    "袋": "撇、竖、横、横、竖、横、撇、点、竖、横折、横",
    "灰": "横、撇、点、撇、撇、捺",
    "哇": "竖、横折、横、横、竖、横、横、横、竖、横",
    "教": "横、竖、横、竖、横折、横、撇、捺、横、竖、横",
    "捕": "横、竖钩、提、横、竖、横折、横、横、竖、点",
    "迎": "撇、竖提、横折钩、竖、点、横折折撇、捺",
    "阿": "横折折折、竖、横、竖、横折、横",
    "姨": "撇点、撇、横、横、横折、横、横折、撇、捺",
    "宽": "点、点、横撇、横、竖、竖、竖、横折、撇、竖弯钩",
    "龟": "撇、横折、横、横、竖弯钩、竖、横折、横",
    "顶": "横、竖、竖、横折、横、横、横、撇、竖折折钩",
    "披": "横、竖钩、提、横撇、撇、竖、横撇、捺",
    "鼓": "横、竖、竖、横、横、横、竖折折、横、竖、横折、横、横、竖、横",
    // 2. 我是什么
    "晒": "竖、横折、横、横、竖、横折、横、横、横、竖、横",
    "极": "横、竖、撇、点、撇、横折折撇、捺",
    "傍": "撇、竖、横、点、横、点、撇、点、横撇、竖、横、竖、横折",
    "越": "横、竖、横、竖、横、撇、捺、横、竖、横折、横、竖、横",
    "滴": "点、点、提、点、横、撇、横折、竖、横折、横、竖、横、横、横",
    "溪": "点、点、提、撇、点、点、撇、横撇、横、撇、横折、横、竖",
    "奔": "横、撇、捺、横、撇、竖、横、竖、横",
    "洋": "点、点、提、点、撇、横、横、横、竖",
    "坏": "横、竖、提、横、撇、竖、点、竖",
    "淹": "点、点、提、横、撇、竖弯钩、竖、横折、横、横、竖弯钩",
    "没": "点、点、提、撇、横折、横、横、捺",
    "冲": "点、提、竖、横折、横、竖",
    "毁": "撇、竖、横折、横、横、横、竖、横折、横、竖、横、撇、捺",
    "屋": "横折、横、撇、横、撇、捺、横、竖、横折、横",
    "灾": "点、点、横撇、撇、捺、横、撇、点",
    // 3. 植物妈妈有办法
    "植": "横、竖、横折、横、竖、横、竖、横、竖、横折、横、横",
    "如": "撇点、撇、横、竖、横折、横",
    "为": "点、撇、横折钩、点",
    "旅": "点、横、横折、撇、点、撇、横、撇、竖提、撇、捺、横、撇、竖",
    "备": "撇、横撇、横、竖、横、撇、捺",
    "纷": "撇折、撇折、提、撇、横折、横、竖、撇",
    "刺": "横、竖、横折、横、竖、竖、竖、竖、横折钩、竖、竖",
    "底": "点、横、撇、撇、竖提、横、斜钩、点",
    "炸": "点、撇、撇、捺、竖、横折、横、横、竖、横",
    "离": "点、横、撇、点、撇折、撇折、点、竖、竖、横折钩、竖",
    "察": "点、点、横撇、撇、横撇、竖、横、横、横、竖、横、撇、捺",
    "识": "点、横折提、竖、横折、横、撇、点",
    "粗": "点、撇、横、竖、撇、点、竖、横、横、横、横",
    "得": "撇、撇、竖、竖、横折、横、横、横、横、竖、横",
    // 识字1. 场景歌
    "海": "点、点、提、撇、横折、横、竖、横折、横、竖",
    "军": "点、横撇、横、竖、横、撇、捺",
    "舰": "撇、竖、横折钩、横、竖、竖、横折、横、横、撇、竖弯钩",
    "帆": "竖、横折钩、横、竖、横折、撇、竖弯钩",
    "稻": "撇、横、竖、点、撇、横、竖、撇、点、横折、横、横、竖、横折、横",
    "园": "竖、横折、横、横、撇、竖弯钩、横、横、横",
    "翠": "横折、点、提、横折、点、提、竖、横、撇、捺、横、竖、横、撇",
    "队": "横折折折、竖、撇、捺",
    "铜": "撇、横、横、横、竖提、横折钩、横、竖、横折、横、竖",
    "号": "竖、横折、横、横、竖折折钩",
    "领": "撇、点、点、撇、竖、横、撇、竖、横折、撇、点",
    "巾": "竖、横折钩、竖",
    // 识字2. 树之歌
    "杨": "横、竖、撇、点、横折折折钩、撇、撇",
    "壮": "点、提、竖、横、竖、横",
    "桐": "横、竖、撇、点、竖、横折、横、竖、横折、横",
    "枫": "横、竖、撇、点、撇、横折、撇、点",
    "松": "横、竖、撇、点、撇、捺、撇、捺",
    "柏": "横、竖、撇、点、撇、竖、横折、横、横",
    "杉": "横、竖、撇、撇、撇、撇、撇",
    "化": "撇、竖、撇、竖弯钩",
    "桂": "横、竖、撇、点、横、竖、横、横、横、竖、横",
    // 识字3. 拍手歌
    "世": "横、竖、竖、横、竖折",
    "界": "竖、横折、横、竖、横、撇、捺、撇、竖",
    "雀": "竖、撇、竖、点、横、横、横、竖、横、横、横",
    "锦": "撇、横、横、横、竖提、撇、竖、横折、横、横、竖、横折、横、横、横",
    "雄": "横、撇、捺、撇、竖、点、横、竖、横折、横、撇、竖弯钩、横、竖、横",
    "鹰": "点、横、竖、横折、撇、横折钩、横、竖、撇、捺、撇、横折钩、横、竖、横折、横、横、横、横",
    "翔": "点、撇、横折钩、点、竖、横折、横、横、竖、横折、横、竖、横",
    "雁": "横、撇、竖、撇、竖、横折、横、横、竖、竖、横、竖、横",
    "丛": "撇、捺、撇、捺、横",
    "深": "点、点、提、点、横撇、撇、点、横、竖、撇、捺",
    "猛": "撇、弯钩、撇、横、撇、横折、横、竖、横折、横、竖、横、横、横",
    "灵": "横折、横、横、撇、捺、横、撇、捺",
    "休": "撇、竖、横、竖、撇、捺",
    // 识字4. 田家四季歌
    "季": "撇、横撇、横、竖、横折、横、竖、横、横",
    "蝴": "竖、横折、横、竖、横、竖、提、横、竖、竖、横折、横、竖、横折、横",
    "蝶": "竖、横折、横、竖、横、竖、提、横、竖、竖、横、横折、横、竖、横",
    "麦": "横、横、竖、横、撇、捺、横、竖、撇、捺",
    "苗": "横、竖、竖、竖、横折、横、竖、横",
    "嫩": "撇点、撇、点、横、竖、横折、横、撇、撇、点、撇、横撇、横、横",
    "桑": "横折、横、横、竖、横、横、横、竖、撇、捺",
    "肥": "撇、横折钩、横、横、撇、横折钩、竖、横、横、横",
    "农": "点、横撇、撇、竖、横、撇、捺",
    "归": "竖、横折、横、竖、横、横",
    "戴": "横、竖、横、竖、横折、横、竖、横、横、竖、横、撇、斜钩、撇、点、横、竖、横折、横",
    "场": "横、竖、提、横、撇、横折、撇、横折钩",
    "粒": "点、撇、横、竖、撇、点、竖、横折、横、竖、横",
    "虽": "竖、横折、横、竖、横、横、横、竖、横",
    "苦": "横、竖、竖、横、竖、竖、横、竖、横、横",
    // 4. 曹冲称象
    "柱": "横、竖、撇、点、横、横、横、竖、横",
    "议": "点、横折提、点、撇、捺",
    "论": "点、横折提、撇、捺、撇、竖弯钩",
    "重": "撇、横、竖、横折、横、横、竖、横、横",
    "秤": "撇、横、竖、撇、点、横、横、竖、横、横、横",
    "砍": "横、撇、竖、横折、横、撇、横、撇、捺",
    "线": "撇折、撇折、提、横、横、竖、撇、捺",
    "止": "竖、横、竖、横、横",
    "量": "竖、横折、横、横、横、横、横、竖、横、竖、横、横",
    // 5. 玲玲的画
    "详": "点、横折提、点、撇、横、竖、横折、横、竖",
    "幅": "竖、横折钩、横、横、竖、横折、横、竖、横折、横、横、竖、横",
    "评": "点、横折提、横、横、竖、横、横、竖",
    "奖": "点、提、撇、横、竖、横、撇、捺、大",
    "候": "撇、竖、竖、横折、横、横、撇、捺、横、竖",
    "报": "横、竖钩、提、横折钩、竖、横、横、捺",
    "另": "竖、横折、横、横折钩、撇、竖弯钩",
    "及": "撇、横折折撇、捺",
    "懒": "点、点、竖、横、竖、横折、横、竖、撇、横、竖、撇、点、撇、捺、点、点、点、点",
    "并": "点、撇、横、横、撇、竖",
    // 6. 一封信
    "封": "横、横、横、竖、提、横、竖、横折、横、竖、横、点",
    "信": "撇、竖、横、横、横、竖、横折、横、横、横",
    "今": "撇、捺、横折、横、横、横",
    "支": "横、竖、横撇、捺",
    "圆": "竖、横折、横、竖、横折、横、竖、横、横、横",
    "珠": "横、横、竖、提、撇、横、横、竖、撇、捺",
    "笔": "撇、横、点、撇、横、点、横、竖、撇、捺",
    "灯": "点、撇、撇、捺、点、撇、横折弯钩",
    "削": "竖、竖、横折、横、横、竖、竖钩",
    "锅": "撇、横、横、横、竖提、竖、横折、横、撇、横折钩、竖、横",
    "朝": "横、竖、竖、横折、横、横、横、竖、撇、横折钩、横、横、横",
    "刮": "撇、横、横、竖钩、竖、竖、竖、竖、横折钩",
    "胡": "横、竖、竖、横折、横、横、横、竖、横折钩、横、横、横",
    "修": "撇、竖、竖、横折、横、横、横、撇、捺、横、竖、横、竖、横、横、横、撇、捺",
    // 7. 妈妈睡了
    "哄": "竖、横折、横、横、竖、竖、横撇、捺",
    "先": "撇、撇、横、竖、横、撇、竖弯钩",
    "闭": "点、竖、横折钩、竖、横、横、横",
    "紧": "竖、竖、横撇、撇、点、撇折、撇折、点、横、撇、捺",
    "润": "点、点、提、点、竖、横折、横、横、竖、横",
    "等": "撇、横、横、竖、横、竖、横、横、竖、横折、横、竖、横",
    "吸": "竖、横折、横、撇、横撇、横、撇、横折弯钩",
    "发": "撇折、撇折、提、撇、横、撇、捺",
    "粘": "点、撇、横、竖、撇、点、竖、横、竖、横、横、横",
    "额": "点、点、横撇、撇、点、撇、横、竖、横折、撇、点、横、撇、点、横、撇、点、横、撇、点",
    "乏": "撇、横、撇、捺",
    "沙": "点、点、提、竖、撇、捺、撇",
    // 8. 古诗二首
    "楼": "横、竖、撇、点、点、撇、横、竖、撇、捺、撇、横、竖、撇、捺、横、竖、横",
    "依": "撇、竖、横、撇、竖提、横、撇、捺",
    "尽": "横、撇、捺、竖、横折、横、横、横",
    "欲": "撇、点、横、撇、捺、竖、横折、横、横、竖、横",
    "穷": "点、点、横撇、撇、横折钩、撇、竖弯钩",
    "层": "横、撇、捺、横、撇、捺、横、撇、捺",
    "瀑": "点、点、提、横、竖、竖、横、横折、横、横、竖、横折、横、横、竖、横、竖、横折、横",
    "布": "横、撇、竖、横折钩、竖",
    "炉": "点、撇、撇、捺、横、横、撇、横折钩、撇、点、横、横、横",
    "烟": "点、撇、撇、捺、横、竖、横折、横、横、竖、横",
    "遥": "撇、撇、竖、横折、横、横、横、竖、横折、横、横、横、横折折撇、捺",
    "川": "撇、竖、竖",
    // 9. 黄山奇石
    "闻": "点、横、竖、竖、横折、横、横、横、竖",
    "名": "撇、横折、横、横、横、竖、横折、横",
    "景": "竖、横折、横、横、横、竖、横、竖、撇、捺",
    "区": "横、撇、横折、竖折、竖",
    "省": "竖、横折、横、横、撇、竖、横折、横、横、横",
    "部": "点、横、横、竖、横折、横、竖、横折、横、横、竖",
    "秀": "撇、横、竖、撇、捺、横、撇、竖弯钩",
    "尤": "横、撇、竖弯钩、横、撇、捺",
    "其": "横、竖、竖、横、横、横、撇、点",
    "仙": "撇、竖、竖、横折、横、竖、横、横",
    "巨": "横、横折、横、横折、横",
    "位": "撇、竖、点、横、竖、横、横",
    "都": "横、竖、横、横折、横、竖、横折、横、横、竖、竖折折钩",
    // 10. 日月潭
    "湾": "点、点、提、点、横、竖、竖、撇、横撇、撇、竖弯钩、横、竖、横",
    "名": "撇、横折、横、横、横、竖、横折、横",
    "胜": "撇、横折钩、横、横、横、竖、横、横、竖、横",
    "迹": "点、横、撇、捺、竖、横折、横、横、横、竖折折撇、捺",
    "央": "竖、横折、横、撇、捺",
    "丽": "横、竖、横折、横、竖、横折、横、撇、横折钩、竖",
    "华": "撇、竖、横、横、横、竖、横",
    "展": "横折、横、撇、横、竖、竖、横折、横、竖提、撇、捺",
    "现": "横、横、竖、提、竖、横折、撇、竖弯钩",
    "披": "横、竖钩、提、横撇、撇、竖、横撇、捺",
    "纱": "撇折、撇折、提、竖、撇、捺、撇",
    "童": "点、横、点、撇、横、竖、横折、横、横、竖、横、横",
    // 11. 葡萄沟
    "沟": "点、点、提、横、横撇、撇、捺",
    "产": "点、横、撇、点、撇、横、撇、捺",
    "份": "撇、竖、横、撇、捺、竖、横折钩",
    "枝": "横、竖、撇、点、横、竖、横撇、捺",
    "搭": "横、竖钩、提、横、竖、竖、横、撇、捺、横、竖、横、口",
    "淡": "点、点、提、横、撇、横、撇、捺、横、撇、横、捺",
    "好": "撇点、撇、横、横撇、竖钩",
    "收": "竖提、撇、横、撇、捺",
    "城": "横、竖、提、横、撇、横折、横、横、竖、横、斜钩",
    "市": "点、横、竖、横折、横、横、撇、竖",
    "留": "撇、竖、横折、横、横、横、竖、横折、横、竖、横",
    "钉": "撇、横、横、横、竖提、横、竖钩",
    "利": "撇、横、竖、撇、点、竖、竖钩",
    "分": "撇、捺、横、撇、捺",
    "味": "竖、横折、横、横、横、竖、撇、捺"
};

// ===== 写话写作提示 =====
const WRITING_PROMPTS = [
    { id: "w1", title: "看图写话：课间活动", desc: "仔细看图，用几句话写一写课间同学们在做什么。注意写清时间、地点、人物、事件。", tip: "句式参考：下课后，同学们在___（地点）___（做什么）。有的___，有的___，还有的___。大家玩得真开心！", icon: "🏃" },
    { id: "w2", title: "看图写话：春天来了", desc: "观察春天的图片，写一段话描述春天的景色。", tip: "句式参考：春天来了，___（哪里）的___怎么样了。小草___，花朵___，小鸟___。", icon: "🌸" }
];

// ===== 标点符号练习 =====
const PUNCTUATION_EXERCISES = [
    { id: "p1", sentence: "今天天气真好啊", answer: "今天天气真好啊！", options: ["。", "！", "？"], explain: "表示感叹语气，用感叹号。" },
    { id: "p2", sentence: "你叫什么名字", answer: "你叫什么名字？", options: ["。", "！", "？"], explain: "表示疑问语气，用问号。" }
];

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
