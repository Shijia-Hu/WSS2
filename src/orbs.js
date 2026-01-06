import { ORBS } from "./data/orbs.js";

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
    ORBS.forEach((orb, index) => {
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
    counter.textContent = `${revealedSet.size} / ${ORBS.length}`;
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
        if (index >= ORBS.length) {
            clearInterval(revealTimer);
            revealTimer = null;
            return;
        }
        revealOrb(index);
        index += 1;
    }, 350);
}

function showSingle(index) {
    const orb = ORBS[index];
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
    if (type === "ORB_SHOW_ALL_SEQUENTIAL") {
        showAllSequential();
    }
    if (type === "ORB_SHOW_ALL") {
        showAll();
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
