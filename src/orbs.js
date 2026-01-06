const orbs = [
    {
        title: "时间停滞",
        desc: "使用后，本队答题时间额外延长 10 秒。",
    },
    {
        title: "魔咒反弹",
        desc: "若对方答错，本队额外获得 1 分。",
    },
    {
        title: "禁言术",
        desc: "指定某一队伍下一题不能抢答。",
    },
    {
        title: "智慧共享",
        desc: "可邀请现场一名观众提供提示（限 10 秒）。",
    },
    {
        title: "幸运骰子",
        desc: "掷骰子决定本队本题得分倍数（1-3 倍）。",
    },
    {
        title: "魔法窃取",
        desc: "随机复制对方一个未使用的魔力球。",
    },
    {
        title: "智慧泉水",
        desc: "本题回答正确后，本队所有队员下一题自动抢答优先。",
    },
    {
        title: "魔法契约",
        desc: "与另一队暂时结盟，共享下一题积分。如下一题结盟队伍答对，本队也获得积分。",
    },
    {
        title: "镜像对决",
        desc: "下一题由每队派代表 1v1 抢答，队员不能给提示。",
    },
    {
        title: "双倍积分卡",
        desc: "本题答对得 2 分，答错道具失效。",
    },
    {
        title: "元素召唤",
        desc: "随机召唤一位老师提供一句话提示。",
    },
];

const grid = document.getElementById("orbsGrid");
const counter = document.getElementById("orbCounter");
const focusPanel = document.getElementById("orbFocus");
const focusTitle = document.getElementById("orbFocusTitle");
const focusDesc = document.getElementById("orbFocusDesc");
let revealTimer = null;

const bc = new BroadcastChannel("wss2-control");
const revealedSet = new Set();

function sendPause() {
    bc.postMessage({ type: "QUIZ_PAUSE", payload: { paused: true }, at: Date.now() });
}

function renderOrbs() {
    grid.innerHTML = "";
    orbs.forEach((orb, index) => {
        const card = document.createElement("article");
        card.className = "orb-card";
        card.dataset.index = index;
        card.innerHTML = `
            <div class="orb-core" aria-hidden="true"></div>
            <h2 class="orb-title">${orb.title}</h2>
            <p class="orb-desc">${orb.desc}</p>
        `;
        grid.appendChild(card);
    });
}

function updateCounter() {
    counter.textContent = `${revealedSet.size} / ${orbs.length}`;
}

function showAll() {
    if (revealTimer) {
        clearInterval(revealTimer);
        revealTimer = null;
    }
    focusPanel.classList.add("hidden");
    grid.classList.remove("hidden");
    revealedSet.clear();
    grid.querySelectorAll(".orb-card").forEach((card, index) => {
        card.classList.add("is-revealed");
        revealedSet.add(index);
    });
    updateCounter();
}

function showAllSequential() {
    if (revealTimer) {
        clearInterval(revealTimer);
    }
    focusPanel.classList.add("hidden");
    grid.classList.remove("hidden");
    revealedSet.clear();
    grid.querySelectorAll(".orb-card").forEach((card) => {
        card.classList.remove("is-revealed");
    });
    updateCounter();
    let index = 0;
    revealTimer = setInterval(() => {
        if (index >= orbs.length) {
            clearInterval(revealTimer);
            revealTimer = null;
            return;
        }
        revealOrb(index);
        index += 1;
    }, 350);
}

function showSingle(index) {
    const orb = orbs[index];
    if (!orb) return;
    if (revealTimer) {
        clearInterval(revealTimer);
        revealTimer = null;
    }
    grid.classList.add("hidden");
    focusPanel.classList.remove("hidden");
    focusTitle.textContent = orb.title;
    focusDesc.textContent = orb.desc;
    revealedSet.add(index);
    updateCounter();
    sendPause();
}

function revealOrb(index) {
    const card = grid.querySelector(`.orb-card[data-index="${index}"]`);
    if (!card || revealedSet.has(index)) return;
    card.classList.add("is-revealed");
    revealedSet.add(index);
    updateCounter();
}

function resetOrbs() {
    if (revealTimer) {
        clearInterval(revealTimer);
        revealTimer = null;
    }
    revealedSet.clear();
    grid.querySelectorAll(".orb-card").forEach((card) => {
        card.classList.remove("is-revealed");
    });
    focusPanel.classList.add("hidden");
    grid.classList.remove("hidden");
    updateCounter();
}

renderOrbs();
showAll();
focusPanel.classList.add("hidden");

bc.addEventListener("message", (event) => {
    const { type, payload } = event.data || {};
    if (type === "ORB_SHOW_ALL") {
        showAll();
    }
    if (type === "ORB_SHOW_ALL_SEQUENTIAL") {
        showAllSequential();
    }
    if (type === "ORB_SHOW_SINGLE") {
        const index = Number(payload?.index);
        if (Number.isInteger(index)) {
            showSingle(index);
        }
    }
    if (type === "ORB_REVEAL") {
        const index = Number(payload?.index);
        if (Number.isInteger(index)) {
            revealOrb(index);
        }
    }
    if (type === "ORB_RESET") {
        resetOrbs();
    }
});
