// src/story/config.js
export const STORY = {
    acts: {
        act1: {
            id: "act1",
            title: "Act I：碎页试炼",
            subtitle: "进入“传闻走廊 / 校史穹廊 / 钟楼实验室 / 歌剧回廊”",
            rounds: [
                {
                    id: "r1",
                    title: "第 1 轮：传闻碎页",
                    subtitle: "流行文化与媒体",
                    hostLines: [
                        "奥兹城最擅长用海报、新闻与口号塑造形象。",
                        "你们将进入“传闻走廊”，辨别信息的真假与来龙去脉。"
                    ],
                    focus: "题目偏：流行文化、热点常识、媒体识读、辨谣逻辑",
                    emblemKey: "rumor",
                    maxim: "别急着相信故事，先寻找证据。"
                },
                {
                    id: "r2",
                    title: "第 2 轮：根基碎页",
                    subtitle: "传统与历史",
                    hostLines: [
                        "所有叙事都从历史与传统生长，但历史也常被“选择性记忆”。",
                        "你们要进入“校史穹廊”，找回被忽略的背景。"
                    ],
                    focus: "题目偏：中外历史、传统文化、地理常识",
                    emblemKey: "roots",
                    maxim: "历史不止胜者书写，也有沉默者的回声。"
                },
                {
                    id: "r3",
                    title: "第 3 轮：理性碎页",
                    subtitle: "科学与逻辑",
                    hostLines: [
                        "当口号太响时，理性就是最安静的反抗。",
                        "你们将进入“钟楼实验室”，用逻辑与科学拆穿表象。"
                    ],
                    focus: "题目偏：逻辑推理、科学常识、数学脑筋急转弯",
                    emblemKey: "reason",
                    maxim: "理性不是冷漠，是对真实的尊重。"
                },
                {
                    id: "r4",
                    title: "第 4 轮：心灵碎页",
                    subtitle: "艺术、音乐与语言",
                    hostLines: [
                        "世界不只靠“正确答案”运转，也靠表达与共情。",
                        "你们要进入“歌剧回廊”，证明你们能理解人心与美。"
                    ],
                    focus: "题目偏：艺术、音乐、英语语言文化",
                    emblemKey: "soul",
                    maxim: "理解不是同意，但能让人不被简单定罪。"
                }
            ]
        },

        act2: {
            id: "act2",
            title: "Act II：穹顶审判",
            subtitle: "叙事权很危险。",
            hostLines: [
                "四支晋级队伍来到“穹顶审判场”。",
                "奥兹城只允许一个阵营带走“年度荣誉”。只有冠军能决定最终叙事。",
                "你们争夺的不是奖杯，而是：谁有资格写下别人是谁。"
            ]
        },

        act3: {
            id: "act3",
            title: "Act III：真相揭幕",
            subtitle: "贴合 Wicked 主旨",
            finalLine: "Good 与 Wicked 都不是答案；答案是选择。",
            hostLines: [
                "档案并不评判谁善谁恶，它记录的是——当学校/城市需要一个简单故事时，就会有人被推上“光”，也会有人被推入“暗”。",
                "被称为“善”的人，也可能享受掌声而忽略代价；被称为“恶”的人，也可能只是拒绝妥协、因此被误解。",
                "真正决定你是谁的，从来不是标签，而是你在关键时刻做了什么选择：",
                "选择勇气，还是选择偏见；选择合作，还是选择踩踏；选择理解，还是选择把人写成一个单薄的故事。",
                "你们今天用的不是咒语，而是勇气、智慧与团队合作。",
                "真正的胜利，是在竞争里仍然保持尊重；在强烈立场里仍然保留好奇；在热烈掌声里仍然记得他人也有故事。"
            ]
        }
    },

    // 你可选：把“翡翠封印”相关视觉资源做成 key->路径
    // 建议放在 public/assets/emblems/ 下（或你现有的 public/assets 里）
    emblems: {
        rumor: "assets/emblems/rumor.png",
        roots: "assets/emblems/roots.png",
        reason: "assets/emblems/reason.png",
        soul: "assets/emblems/soul.png"
    }
};
