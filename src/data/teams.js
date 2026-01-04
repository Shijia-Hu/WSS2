// src/data/teams.js
const B = import.meta.env.BASE_URL || "/";

export const TEAMS = [
    {
        id: "t01",
        name: "队伍 01：档案馆的钥匙",
        tagline: "今晚争夺的不是答案，而是叙事权。",
        members: [
            { name: "右一", role: "Seeker", photo: `${B}assets/teams/t01/1.jpg` }, // 最右
            { name: "右二", role: "Cipher", photo: `${B}assets/teams/t01/2.jpg` },
            { name: "右三", role: "Keeper", photo: `${B}assets/teams/t01/3.jpg` },
            { name: "最左", role: "Witness", photo: `${B}assets/teams/t01/4.jpg` }, // 最左
        ],
    },
    // ... t02 ~ t16
];
