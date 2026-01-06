// src/data/teams.js
const B = import.meta.env.BASE_URL || "/";

// teams.js (or inside your wss2.js)
// 约定：assets/teams/t01/1.jpg 是最右；assets/teams/t01/4.jpg 是最左
// 约定：members 顺序 = 右 -> 左（Leader 默认放最右）

export const TEAMS = [
    {
        id: "t01",
        no: 1,
        name: "Black Pink",
        side: "Good",
        group: 1,
        members: [
            { name: "卡其 Kartikeya", role: "G11-2 • Leader", photo: `${B}assets/teams/t01/1.jpg` }, // 最右
            { name: "郑桂滨 PING", role: "G8-2 • Member", photo: `${B}assets/teams/t01/2.jpg` },
            { name: "天贺 Tigger", role: "G11-2 • Member", photo: `${B}assets/teams/t01/3.jpg` },
            { name: "童瑞 Din", role: "G10-2 • Member", photo: `${B}assets/teams/t01/4.jpg` }, // 最左
        ],
    },

    {
        id: "t02",
        no: 2,
        name: "GG EZ",
        side: "Good",
        group: 1,
        members: [
            { name: "胡徐译 Michael", role: "G12-2 • Leader", photo: `${B}assets/teams/t02/1.jpg` },
            { name: "吴方意 Antonio", role: "G12-2 • Member", photo: `${B}assets/teams/t02/2.jpg` },
            { name: "陈城 Alex", role: "G11-2 • Member", photo: `${B}assets/teams/t02/3.jpg` },
            { name: "王捷 James", role: "G8-2 • Member", photo: `${B}assets/teams/t02/4.jpg` },
        ],
    },

    {
        id: "t03",
        no: 3,
        name: "四只猪",
        side: "Wicked",
        group: 1,
        members: [
            { name: "张凯文 Kevin", role: "G8-2 • Leader", photo: `${B}assets/teams/t03/1.jpg` },
            { name: "林城载 Jake", role: "G8-2 • Member", photo: `${B}assets/teams/t03/2.jpg` },
            { name: "楼嘉乐 Ella", role: "G11-2 • Member", photo: `${B}assets/teams/t03/3.jpg` },
            { name: "马翊涵 Serene", role: "G10-3 • Member", photo: `${B}assets/teams/t03/4.jpg` },
        ],
    },

    {
        id: "t04",
        no: 4,
        name: "英语喜欢陈欣怡",
        side: "Wicked",
        group: 1,
        members: [
            { name: "陈欣怡 Cindy", role: "G11-3 • Leader", photo: `${B}assets/teams/t04/1.jpg` },
            { name: "萧莉婉 Proud", role: "G11-3 • Member", photo: `${B}assets/teams/t04/2.jpg` },
            { name: "阿里 Amirali", role: "G11-2 • Member", photo: `${B}assets/teams/t04/3.jpg` },
            { name: "陈锌雨 Viviana", role: "G9-1 • Member", photo: `${B}assets/teams/t04/4.jpg` },
        ],
    },

    {
        id: "t05",
        no: 5,
        name: "Tuff Abdallah",
        side: "Good",
        group: 2,
        members: [
            { name: "林欣怡 Pun Pun", role: "G10-2 • Leader", photo: `${B}assets/teams/t05/1.jpg` },
            { name: "玛丽 Maryam", role: "G10-2 • Member", photo: `${B}assets/teams/t05/2.jpg` },
            { name: "云希荷 Baibua", role: "G10-3 • Member", photo: `${B}assets/teams/t05/3.jpg` },
            { name: "和平 Abdallah", role: "G8-2 • Member", photo: `${B}assets/teams/t05/4.jpg` },
        ],
    },

    {
        id: "t06",
        no: 6,
        name: "HIS最强魔法队",
        side: "Good",
        group: 2,
        members: [
            { name: "范俊杰 Jay", role: "G11-1 • Leader", photo: `${B}assets/teams/t06/1.jpg` },
            { name: "郑南 Nolan", role: "G11-1 • Member", photo: `${B}assets/teams/t06/2.jpg` },
            { name: "朱梦雅 Fayona", role: "G10-2 • Member", photo: `${B}assets/teams/t06/3.jpg` },
            { name: "凯琪 KRITIKA", role: "G9-2 • Member", photo: `${B}assets/teams/t06/4.jpg` },
        ],
    },

    {
        id: "t07",
        no: 7,
        name: "CR7 (cactus rollercoaster)",
        side: "Wicked",
        group: 2,
        members: [
            { name: "何雅 Haya", role: "G8-3 • Leader", photo: `${B}assets/teams/t07/1.jpg` },
            { name: "余静诺 Kitty", role: "G8-3 • Member", photo: `${B}assets/teams/t07/2.jpg` },
            { name: "沈承宣 Leo", role: "G8-2 • Member", photo: `${B}assets/teams/t07/3.jpg` },
            { name: "尹志博 Max", role: "G11-2 • Member", photo: `${B}assets/teams/t07/4.jpg` },
        ],
    },

    {
        id: "t08",
        no: 8,
        name: "Team Elphabrains",
        side: "Wicked",
        group: 2,
        members: [
            { name: "翁琦 Isabella", role: "G9-2 • Leader", photo: `${B}assets/teams/t08/1.jpg` },
            { name: "徐丽玲 Aiko", role: "G9-2 • Member", photo: `${B}assets/teams/t08/2.jpg` },
            { name: "陈小演 Tonkao", role: "G10-2 • Member", photo: `${B}assets/teams/t08/3.jpg` },
            { name: "陈英达 Tanik", role: "G11-2 • Member", photo: `${B}assets/teams/t08/4.jpg` },
        ],
    },

    {
        id: "t09",
        no: 9,
        name: "The Glindas",
        side: "Good",
        group: 3,
        members: [
            { name: "卡莎 Kauthar", role: "G9-2 • Leader", photo: `${B}assets/teams/t09/1.jpg` },
            { name: "王舒涵 Linda", role: "G9-2 • Member", photo: `${B}assets/teams/t09/2.jpg` },
            { name: "千昭允 Sarah", role: "G11-2 • Member", photo: `${B}assets/teams/t09/3.jpg` },
            { name: "马小宝 Rafin", role: "G10-2 • Member", photo: `${B}assets/teams/t09/4.jpg` },
        ],
    },

    {
        id: "t10",
        no: 10,
        name: "Giant Sushi",
        side: "Good",
        group: 3,
        members: [
            { name: "陈劲翰 Nager", role: "G10-1 • Leader", photo: `${B}assets/teams/t10/1.jpg` },
            { name: "陈韦桦 Beyonce", role: "G10-1 • Member", photo: `${B}assets/teams/t10/2.jpg` },
            { name: "艾达 Manda", role: "G11-3 • Member", photo: `${B}assets/teams/t10/3.jpg` },
            { name: "神山胜介 Shosuke", role: "G8-3 • Member", photo: `${B}assets/teams/t10/4.jpg` },
        ],
    },

    {
        id: "t11",
        no: 11,
        name: "Sulseriamente",
        side: "Wicked",
        group: 3,
        members: [
            { name: "任若菲 Angela", role: "G9-1 • Leader", photo: `${B}assets/teams/t11/1.jpg` },
            { name: "陈嘉乐 Jiale", role: "G9-1 • Member", photo: `${B}assets/teams/t11/2.jpg` },
            { name: "胡欣琪 Salina", role: "G11-3 • Member", photo: `${B}assets/teams/t11/3.jpg` },
            { name: "胡天乐 Michele", role: "G11-3 • Member", photo: `${B}assets/teams/t11/4.jpg` },
        ],
    },

    {
        id: "t12",
        no: 12,
        name: "The Tuff Baboons (Tuffest)",
        side: "Wicked",
        group: 3,
        members: [
            { name: "殷启航 Eric", role: "G10-2 • Leader", photo: `${B}assets/teams/t12/1.jpg` },
            { name: "李向前 Time", role: "G10-2 • Member", photo: `${B}assets/teams/t12/2.jpg` },
            { name: "夏乐扬 Priyaan", role: "G8-2 • Member", photo: `${B}assets/teams/t12/3.jpg` },
            { name: "叶晨豪 Enrico", role: "G8-3 • Member", photo: `${B}assets/teams/t12/4.jpg` },
        ],
    },

    {
        id: "t13",
        no: 13,
        name: "PowerPuff Boys",
        side: "Good",
        group: 4,
        members: [
            { name: "姜建宇 Ryan", role: "G10-3 • Leader", photo: `${B}assets/teams/t13/1.jpg` },
            { name: "马茂徳 Mahmood", role: "G10-2 • Member", photo: `${B}assets/teams/t13/2.jpg` },
            { name: "张阳 Aki", role: "G10-2 • Member", photo: `${B}assets/teams/t13/3.jpg` },
            { name: "翁仁杰 Harchi", role: "G9-2 • Member", photo: `${B}assets/teams/t13/4.jpg` },
        ],
    },

    {
        id: "t14",
        no: 14,
        name: "1/16可能winner",
        side: "Good",
        group: 4,
        members: [
            { name: "钟阳哲 Ethan", role: "G11-2 • Leader", photo: `${B}assets/teams/t14/1.jpg` },
            { name: "曹鹤恬 Maria", role: "G11-2 • Member", photo: `${B}assets/teams/t14/2.jpg` },
            { name: "陈佳美 Tanya", role: "G12-2 • Member", photo: `${B}assets/teams/t14/3.jpg` },
            { name: "李致辰 Cecelia", role: "G8-2 • Member", photo: `${B}assets/teams/t14/4.jpg` },
        ],
    },

    {
        id: "t15",
        no: 15,
        name: "Green Rose",
        side: "Wicked",
        group: 4,
        members: [
            { name: "朱馨语 Chloe", role: "G7-2 • Leader", photo: `${B}assets/teams/t15/1.jpg` },
            { name: "傅梦瑶 Emma", role: "G7-2 • Member", photo: `${B}assets/teams/t15/2.jpg` },
            { name: "冬阳 Techin", role: "G11-2 • Member", photo: `${B}assets/teams/t15/3.jpg` },
            { name: "傅璐瑶 Angelina", role: "G10-3 • Member", photo: `${B}assets/teams/t15/4.jpg` },
        ],
    },

    {
        id: "t16",
        no: 16,
        name: "Mr. Halani Team",
        side: "Wicked",
        group: 4,
        members: [
            { name: "阿言 Aryan", role: "G8-2 • Leader", photo: `${B}assets/teams/t16/1.jpg` },
            { name: "李向上 Munich", role: "G8-2 • Member", photo: `${B}assets/teams/t16/2.jpg` },
            { name: "夏乐然 Gaurav", role: "G10-2 • Member", photo: `${B}assets/teams/t16/3.jpg` },
            { name: "杜知远 Daksh", role: "G10-2 • Member", photo: `${B}assets/teams/t16/4.jpg` },
        ],
    },
];
