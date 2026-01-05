import { TEAMS } from "./data/teams.js";
import { createTeamIntro } from "./story/teamIntro.js";
import { createDirector } from "./story/director.js";

const director = createDirector();
const teamIntro = createTeamIntro();

(() => {
    const wasPortal = sessionStorage.getItem("portal-entered");
    if (!wasPortal) return;
    sessionStorage.removeItem("portal-entered");
    document.body.classList.add("portal-in");
    window.setTimeout(() => document.body.classList.remove("portal-in"), 900);
})();

function startAllTeamsIntro(auto = true) {
    teamIntro.showAll(TEAMS, {
        auto,
        memberDelay: 950,
        teamHold: 550,
        onComplete: () => director.showActIntro("act1"),
    });
}

// 键盘双保险：I 自动全队亮相；Shift+I 手动全队亮相
window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k === "i" && !e.shiftKey) startAllTeamsIntro(true);
    if (k === "i" && e.shiftKey) startAllTeamsIntro(false);

    // 手动推进 / 救场
    if (k === "n") teamIntro.next(); // 下一位（或下一队）
    if (k === "x") teamIntro.stop(); // 立刻结束亮相
});

function replayOneTeam(teamId, auto, memberDelay = 950, teamHold = 550) {
    const team = TEAMS.find(t => t.id === teamId);
    if (!team) return;
    // 用 showAll([team]) 复用同一套“右到左召唤/自动/手动”逻辑
    teamIntro.showAll([team], { auto, memberDelay, teamHold });
}

// 统一指令入口：无论来自 host 还是键盘，都走这里
const COMMAND_HANDLERS = {
    PROCESS: (payload) => director.showProcess(payload.processId),
    TEAMS_INTRO_START: (payload) => startAllTeamsIntro(payload?.auto !== false),
    TEAMS_INTRO_NEXT: () => teamIntro.next(),
    TEAMS_INTRO_STOP: () => teamIntro.stop(),
    TEAMS_SHOW: (payload) => replayOneTeam(payload.teamId, payload.auto !== false, payload.memberDelay, payload.teamHold),
    ACT_INTRO: (payload) => director.showActIntro(payload.actId),
    ROUND_INTRO: (payload) => director.showRoundIntro(payload.roundId),
    SEAL: (payload) => director.showSeal(payload.roundId, payload.winner || "本轮胜队"),
    FINAL: () => director.showFinalReveal(),
};

function applyCommand(type, payload = {}) {
    const handler = COMMAND_HANDLERS[type];
    if (!handler) return;
    return handler(payload);
}

// 1) host 控台消息通道（同机同浏览器标签页）
const bc = new BroadcastChannel("wss2-control");
bc.addEventListener("message", (e) => {
    const { type, payload } = e.data || {};
    if (!type) return;
    applyCommand(type, payload);
});

// 2) 大屏页键盘直控（容错/救场用）
// 建议：加一个“需要按住 Ctrl”才生效，避免误触（可选）
const REQUIRE_CTRL = false;

window.addEventListener("keydown", (e) => {
    if (REQUIRE_CTRL && !e.ctrlKey) return;

    const k = e.key.toLowerCase();

    // 1~4：各轮串词开场
    if (e.key === "1" && !e.ctrlKey && !e.altKey) return applyCommand("ROUND_INTRO", { roundId: "r1" });
    if (e.key === "2" && !e.ctrlKey && !e.altKey) return applyCommand("ROUND_INTRO", { roundId: "r2" });
    if (e.key === "3" && !e.ctrlKey && !e.altKey) return applyCommand("ROUND_INTRO", { roundId: "r3" });
    if (e.key === "4" && !e.ctrlKey && !e.altKey) return applyCommand("ROUND_INTRO", { roundId: "r4" });

    // Shift+1~4：各轮封印仪式
    if (e.shiftKey && e.key === "1") return applyCommand("SEAL", { roundId: "r1", winner: "本轮胜队" });
    if (e.shiftKey && e.key === "2") return applyCommand("SEAL", { roundId: "r2", winner: "本轮胜队" });
    if (e.shiftKey && e.key === "3") return applyCommand("SEAL", { roundId: "r3", winner: "本轮胜队" });
    if (e.shiftKey && e.key === "4") return applyCommand("SEAL", { roundId: "r4", winner: "本轮胜队" });

    // D：Act II 宣言
    if (k === "d") return applyCommand("ACT_INTRO", { actId: "act2" });

    // F：最终反转
    if (k === "f") return applyCommand("FINAL");

    // 7~0：流程卡片
    if (e.key === "7") return applyCommand("PROCESS", { processId: "p7" });
    if (e.key === "8") return applyCommand("PROCESS", { processId: "p8" });
    if (e.key === "9") return applyCommand("PROCESS", { processId: "p9" });
    if (e.key === "0") return applyCommand("PROCESS", { processId: "p10" });

    // Ctrl/Alt + 1~6：流程卡片（避免与 R1~R4 冲突）
    if ((e.ctrlKey || e.altKey) && e.key === "1") return applyCommand("PROCESS", { processId: "p1" });
    if ((e.ctrlKey || e.altKey) && e.key === "2") return applyCommand("PROCESS", { processId: "p2" });
    if ((e.ctrlKey || e.altKey) && e.key === "3") return applyCommand("PROCESS", { processId: "p3" });
    if ((e.ctrlKey || e.altKey) && e.key === "4") return applyCommand("PROCESS", { processId: "p4" });
    if ((e.ctrlKey || e.altKey) && e.key === "5") return applyCommand("PROCESS", { processId: "p5" });
    if ((e.ctrlKey || e.altKey) && e.key === "6") return applyCommand("PROCESS", { processId: "p6" });
});


const DEFAULT_POOL = [
    { "question": "谁唱响了《Defying Gravity》？", "options": ["格琳达", "埃尔法巴", "费耶罗", "男巫"], "correct": 1 },
    { "question": "格琳达最初在希兹大学的名字？", "options": ["格琳达", "格琳迪瓦", "嘉琳达", "格洛丽亚"], "correct": 2 },
    { "question": "埃尔法巴的肤色是什么颜色的？", "options": ["粉色", "绿色", "蓝色", "金色"], "correct": 1 },
    { "question": "费耶罗在剧中变成了什么？", "options": ["狮子", "稻草人", "铁皮人", "飞猴"], "correct": 1 },
    { "question": "《Popular》是谁唱的？", "options": ["埃尔法巴", "格琳达", "费耶罗", "男巫"], "correct": 1 },
    { "question": "奥兹国的首都叫什么名字？", "options": ["翡翠城", "希兹", "芒奇金", "彩虹镇"], "correct": 0 },
    { "question": "格琳达是代表哪个方向的女巫？", "options": ["西方", "东方", "北方", "南方"], "correct": 2 },
    { "question": "男巫是通过什么来到奥兹国的？", "options": ["热气球", "飓风", "银鞋子", "魔法门"], "correct": 0 },
    { "question": "迪拉蒙教授是什么物种？", "options": ["山羊", "猴子", "狮子", "人类"], "correct": 0 },
    { "question": "埃尔法巴的妹妹叫什么？", "options": ["内莎罗丝", "格琳达", "莫里布尔", "多萝西"], "correct": 0 },
    { "question": "费耶罗最初是谁的未婚夫？", "options": ["格琳达", "埃尔法巴", "内莎", "莫里布尔"], "correct": 0 },
    { "question": "博克最后变成了什么？", "options": ["铁皮人", "稻草人", "狮子", "飞猴"], "correct": 0 },
    { "question": "格琳达最初想选修哪门课？", "options": ["咒语课", "炼金术", "魔法史", "占星术"], "correct": 0 },
    { "question": "埃尔法巴的扫帚是从哪来的？", "options": ["自带", "男巫那偷的", "莫里布尔送的", "捡到的"], "correct": 1 },
    { "question": "剧中最后格琳达对奥兹国说埃尔法巴？", "options": ["死了", "隐居了", "去冒险了", "逃跑了"], "correct": 0 },
    { "question": "《For Good》关于什么？", "options": ["友谊", "复仇", "爱情", "权力"], "correct": 0 }
];

let MASTER_POOL = JSON.parse(JSON.stringify(DEFAULT_POOL));
let SELECTED_16 = [];
let UPLOADED_IMAGES = [];
let gatheredCount = 0;
let currentView = 'view-intro';
let CURRENT_PICK = null;
let smoothedX = 0.5;
const LERP_FACTOR = 0.08;
const HOOK_THRESHOLD = 0.32;
const THUMB_SEPARATION = 0.45;
let hookActive = false;
let timerInterval = null;
const TIMER_BASE = 20;
const TIMER_CAP = 30;
const TIMER_BOOST = 5;
let timerRemaining = 0;
let timerMax = 0;

function getRemainingQuestions() {
    const picked = new Set(SELECTED_16.map(q => q.question));
    return MASTER_POOL.filter(q => !picked.has(q.question));
}

function safeSetText(id, text) { const el = document.getElementById(id); if (el) el.innerText = text; }
function safeToggleClass(id, className, force) { const el = document.getElementById(id); if (el) el.classList.toggle(className, force); }

function updatePoolUI() {
    safeSetText('pool-size', MASTER_POOL.length);
    safeSetText('pool-count-text', `题库量: ${MASTER_POOL.length}`);
    if (MASTER_POOL.length >= 16) {
        const btn = document.getElementById('start-btn');
        if (btn) btn.classList.remove('opacity-30', 'pointer-events-none');
    }
}

async function loadJsonAsset(url) {
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load ${url}`);
        return await res.json();
    } catch (err) {
        console.warn(err);
        return null;
    }
}

function normalizeImages(list, targetCount = 16) {
    if (!Array.isArray(list)) return [];
    const images = list.filter(Boolean);
    if (images.length === 0) return [];
    const output = [];
    for (let i = 0; i < targetCount; i += 1) {
        output.push(images[i % images.length]);
    }
    return output;
}

async function loadInitialAssets() {
    const [questions, images] = await Promise.all([
        loadJsonAsset("/data/questions.json"),
        loadJsonAsset("/data/images.json"),
    ]);

    if (Array.isArray(questions) && questions.length >= 16) {
        MASTER_POOL = questions.map((item, index) => ({
            id: Date.now() + index,
            question: item.question,
            options: item.options,
            correct: item.correct,
        }));
    }

    UPLOADED_IMAGES = normalizeImages(images, 16);
}

function switchView(id, callback) {
    const cur = document.querySelector('.view-container.active');
    if (cur) cur.classList.add('blur');
    setTimeout(() => {
        document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active', 'blur'));
        const target = document.getElementById(id);
        if (target) target.classList.add('active');
        currentView = id;
        if (callback) callback();
    }, 800);
}

// --- 核心渲染逻辑 ---
function initCarouselDOM(el, isGathering = false) {
    if (!el) return;
    el.innerHTML = '';
    const leftPad = document.createElement('div'); leftPad.className = 'carousel-padding'; el.appendChild(leftPad);

    const baseItems = isGathering ? Array.from({ length: 32 }) : SELECTED_16;
    const repeatCount = 3;
    const items = Array.from({ length: repeatCount }, () => baseItems).flat();
    if (!isGathering) safeSetText('round-count', baseItems.length);
    items.forEach((q, i) => {
        const baseIndex = i % baseItems.length;
        const item = document.createElement('div');
        item.className = 'carousel-item';
        const card = document.createElement('div');
        card.className = 'arched-card cursor-pointer';

        // 图片背景层
        const imgLayer = document.createElement('div');
        imgLayer.className = 'card-img-bg';

        if (UPLOADED_IMAGES.length > 0) {
            const imgIndex = baseIndex % UPLOADED_IMAGES.length;
            imgLayer.style.backgroundImage = `url(${UPLOADED_IMAGES[imgIndex]})`;
        }

        card.appendChild(imgLayer);
        card.innerHTML += `<div class="glass-shards"></div><div class="art-nouveau-frame"></div><div class="glass-glow"></div>`;

        if (isGathering) {
            const color = Math.random() > 0.5 ? 'var(--elphaba)' : 'var(--glinda)';
            const shard = document.createElement('div');
            shard.className = 'absolute inset-0 opacity-40 z-[1]';
            shard.style.background = `radial-gradient(circle at center, ${color} 0%, black 100%)`;
            card.prepend(shard);
            card.innerHTML += `<span class="opacity-30 text-[8px] uppercase tracking-[0.5em] cinzel text-white z-10">ENERGY</span>`;
            card.onclick = () => { if (isCenter(card)) performSelectionMagic(card, el, () => handleGather(color), true); };
        } else {
            const color = q.soulColor;
            if (!UPLOADED_IMAGES[i]) { // 如果没图，用颜色渐变兜底
                const shard = document.createElement('div');
                shard.className = 'absolute inset-0 opacity-50 z-[1]';
                shard.style.background = `radial-gradient(circle at center, ${color} 0%, #000 100%)`;
                card.prepend(shard);
            }
            card.innerHTML += `
                        <div class="z-10 flex flex-col items-center">
                            <span class="opacity-40 text-[9px] cinzel mb-1 text-white">VESSEL</span>
                            <span class="text-4xl font-bold cinzel text-white" style="text-shadow: 0 0 15px ${color}">${baseIndex + 1}</span>
                        </div>
                    `;
            card.onclick = () => { if (isCenter(card)) { CURRENT_PICK = q; performSelectionMagic(card, el, startQuiz, false); } };
        }
        item.appendChild(card);
        el.appendChild(item);
    });

    const rightPad = document.createElement('div'); rightPad.className = 'carousel-padding'; el.appendChild(rightPad);
    requestAnimationFrame(() => {
        const segmentWidth = el.scrollWidth / repeatCount;
        el.dataset.segmentWidth = `${segmentWidth}`;
        el.scrollLeft = segmentWidth;
        updateFisheye(el);
    });
}

// 轻量氛围光尘
(() => {
    const atmosphere = document.querySelector(".atmosphere");
    if (!atmosphere) return;

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = (min, max) => min + Math.random() * (max - min);
    const count = reduceMotion ? 8 : 14;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i += 1) {
        const mote = document.createElement("span");
        mote.className = "mote";
        mote.style.left = `${rand(4, 96)}%`;
        mote.style.top = `${rand(10, 92)}%`;
        mote.style.setProperty("--mote-size", `${rand(3, 7)}px`);
        mote.style.setProperty("--mote-opacity", rand(0.18, 0.5).toFixed(2));
        mote.style.setProperty("--mote-duration", `${rand(12, 22).toFixed(1)}s`);
        mote.style.setProperty("--mote-shift-x", `${rand(-24, 24).toFixed(1)}px`);
        mote.style.setProperty("--mote-shift-y", `${rand(-40, 30).toFixed(1)}px`);
        mote.style.animationDelay = `${rand(-10, 0).toFixed(1)}s`;
        fragment.appendChild(mote);
    }
    atmosphere.appendChild(fragment);
})();

function isCenter(card) {
    const item = card.closest('.carousel-item');
    const carousel = card.closest('.carousel');
    if (!item || !carousel) return false;
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
    return Math.abs(itemCenter - center) < 120;
}

function updateFisheye(el) {
    if (!el) return;
    const items = el.querySelectorAll('.arched-card');
    const center = window.innerWidth / 2;
    items.forEach(card => {
        const rect = card.getBoundingClientRect();
        const dist = Math.abs(center - (rect.left + rect.width / 2));
        const s = Math.max(1, 1.45 - dist / 350);
        const o = Math.max(0.3, 1 - dist / 450);
        if (!card.classList.contains('card-selected-vanish')) { card.style.transform = `scale(${s})`; card.style.opacity = o; }
        card.parentElement.style.zIndex = Math.round(s * 10);
    });
}

function initMouseDrag(el) {
    if (!el) return;
    let isDown = false, startX, scrollLeft;
    let isWrapping = false;
    const handleInfiniteScroll = () => {
        const segmentWidth = Number(el.dataset.segmentWidth || 0);
        if (!segmentWidth) return;
        if (el.scrollLeft <= segmentWidth * 0.5) {
            isWrapping = true;
            el.scrollLeft += segmentWidth;
            isWrapping = false;
            return;
        }
        if (el.scrollLeft >= segmentWidth * 1.5) {
            isWrapping = true;
            el.scrollLeft -= segmentWidth;
            isWrapping = false;
        }
    };
    const wrapCarouselScroll = () => {
        const maxScroll = el.scrollWidth - el.clientWidth;
        const threshold = 4;
        if (maxScroll <= threshold) return;
        if (el.scrollLeft <= threshold) {
            isWrapping = true;
            el.scrollLeft = maxScroll - threshold;
            isWrapping = false;
            return;
        }
        if (el.scrollLeft >= maxScroll - threshold) {
            isWrapping = true;
            el.scrollLeft = threshold;
            isWrapping = false;
        }
    };
    const startDrag = (pageX) => {
        isDown = true;
        startX = pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
    };
    const stopDrag = () => { isDown = false; };
    const moveDrag = (pageX) => {
        if (!isDown) return;
        el.scrollLeft = scrollLeft - (pageX - el.offsetLeft - startX) * 1.5;
        updateFisheye(el);
    };
    el.addEventListener('mousedown', (e) => { startDrag(e.pageX); });
    el.addEventListener('mouseleave', stopDrag);
    el.addEventListener('mouseup', stopDrag);
    el.addEventListener('mousemove', (e) => {
        e.preventDefault();
        moveDrag(e.pageX);
    });
    el.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        startDrag(e.touches[0].pageX);
    }, { passive: true });
    el.addEventListener('touchend', stopDrag);
    el.addEventListener('touchcancel', stopDrag);
    el.addEventListener('touchmove', (e) => {
        if (!isDown || e.touches.length !== 1) return;
        e.preventDefault();
        moveDrag(e.touches[0].pageX);
    }, { passive: false });
    el.addEventListener('scroll', () => {
        if (!isWrapping) handleInfiniteScroll();
        updateFisheye(el);
    });
}

function startRitual() {
    gatheredCount = 0; SELECTED_16 = [];
    if (MASTER_POOL.length === 16) {
        SELECTED_16 = MASTER_POOL.map((item, idx) => ({
            ...JSON.parse(JSON.stringify(item)),
            soulColor: idx % 2 === 0 ? 'var(--elphaba)' : 'var(--glinda)',
            uid: Date.now() + Math.random(),
        }));
        gatheredCount = 16;
        safeSetText('gather-count', `${gatheredCount} / 16`);
        const prog = document.getElementById('gather-progress');
        if (prog) {
            prog.style.width = '100%';
            prog.style.backgroundColor = 'var(--oz-gold)';
        }
        setTimeout(() => switchView('view-shuffling', startShuffle), 200);
        return;
    }
    switchView('view-gathering', () => {
        const el = document.getElementById('gatherCarousel');
        initCarouselDOM(el, true);
        initMouseDrag(el);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-btn")?.addEventListener("click", startRitual);
});

function performSelectionMagic(element, carousel, onComplete, shouldRemove = false) {
    if (carousel.classList.contains('focus-mode')) return;
    carousel.classList.add('focus-mode');
    element.classList.add('card-selected-vanish');
    setTimeout(() => {
        carousel.classList.remove('focus-mode');
        if (shouldRemove) element.parentElement.remove();
        else element.classList.remove('card-selected-vanish');
        onComplete();
    }, 900);
}

function handleGather(color) {
    if (gatheredCount >= 16) return;
    const remaining = getRemainingQuestions();
    if (remaining.length === 0) return;
    gatheredCount++;
    safeSetText('gather-count', `${gatheredCount} / 16`);
    const prog = document.getElementById('gather-progress');
    if (prog) {
        prog.style.width = `${(gatheredCount / 16) * 100}%`;
        prog.style.backgroundColor = `var(${color.includes('elphaba') ? '--elphaba' : '--glinda'})`;
    }
    const ridx = Math.floor(Math.random() * remaining.length);
    const q = JSON.parse(JSON.stringify(remaining[ridx]));
    q.soulColor = color;
    q.uid = Date.now() + Math.random();
    SELECTED_16.push(q);
    if (gatheredCount === 16) setTimeout(() => switchView('view-shuffling', startShuffle), 400);
}

function startShuffle() {
    const deck = document.getElementById('shuffle-deck');
    if (!deck) return;
    deck.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        const c = document.createElement('div');
        c.className = 'absolute inset-0 arched-card';
        c.style.borderColor = 'var(--lead)';
        c.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 150}px) rotate(${(Math.random() - 0.5) * 80}deg) scale(0.7)`;
        deck.appendChild(c);
    }
    setTimeout(() => { const el = document.getElementById('selectCarousel'); initCarouselDOM(el, false); initMouseDrag(el); switchView('view-selection'); }, 3000);
}

function startQuiz() {
    safeSetText('quiz-text', CURRENT_PICK.question);
    safeSetText('quiz-tag', `CHAMBER #${Math.floor(CURRENT_PICK.uid % 10000)}`);
    const opts = document.getElementById('quiz-options');
    if (opts) {
        opts.innerHTML = '';
        CURRENT_PICK.options.forEach((opt, i) => {
            const b = document.createElement('button');
            b.className = 'quiz-opt-btn w-full py-6 px-8 bg-white/5 border-2 border-[var(--lead)] rounded-2xl hover:bg-white/10 hover:border-oz-gold transition-all text-left text-sm outline-none active:scale-95 cinzel tracking-widest';
            b.innerText = opt; b.onclick = () => checkAnswer(i); opts.appendChild(b);
        });
    }
    setQuizFeedbackVisible(false);
    switchView('view-quiz', initTimer);
}

function updateTimerUI() {
    const bar = document.getElementById('timer-bar');
    const text = document.getElementById('timer-text');
    if (bar && timerMax > 0) bar.style.width = `${(timerRemaining / timerMax) * 100}%`;
    if (text) text.innerText = `剩余 ${Math.max(0, Math.ceil(timerRemaining))}s`;
}

function setExtraTimeButtonState(enabled) {
    const btn = document.querySelector('[data-action="addExtraTime"]');
    if (btn) btn.disabled = !enabled;
}

function initTimer() {
    timerRemaining = TIMER_BASE;
    timerMax = TIMER_BASE;
    if (timerInterval) clearInterval(timerInterval);
    updateTimerUI();
    setExtraTimeButtonState(true);
    timerInterval = setInterval(() => {
        timerRemaining -= 0.1;
        updateTimerUI();
        if (timerRemaining <= 0) { clearInterval(timerInterval); handleTimeout(); }
    }, 100);
}

function addExtraTime() {
    if (timerRemaining <= 0 || !timerInterval) return;
    timerRemaining = Math.min(timerRemaining + TIMER_BOOST, TIMER_CAP);
    timerMax = Math.max(timerMax, timerRemaining);
    updateTimerUI();
}

function handleTimeout() {
    document.querySelectorAll('.quiz-opt-btn').forEach(b => b.disabled = true);
    const m = document.getElementById('feedback-msg');
    if (m) { m.innerText = "MAGIC DEPLETED! THE SEAL REMAINS."; m.style.color = "var(--glinda)"; }
    setQuizFeedbackVisible(true);
    timerRemaining = 0;
    updateTimerUI();
    setExtraTimeButtonState(false);
}

function checkAnswer(idx) {
    clearInterval(timerInterval);
    const m = document.getElementById('feedback-msg');
    document.querySelectorAll('.quiz-opt-btn').forEach(b => b.disabled = true);
    if (idx === CURRENT_PICK.correct) {
        if (m) { m.innerText = "POPULAR! THE ENERGY IS RELEASED."; m.style.color = "var(--elphaba)"; }
        MASTER_POOL = MASTER_POOL.filter(q => q.question !== CURRENT_PICK.question);
        SELECTED_16 = SELECTED_16.filter(q => q.uid !== CURRENT_PICK.uid);
    } else {
        if (m) { m.innerText = "FAILED. THE SEAL IS RETIGHTENED."; m.style.color = "var(--glinda)"; }
    }
    setQuizFeedbackVisible(true);
    setExtraTimeButtonState(false);
}

function backToSelection() {
    if (SELECTED_16.length === 0) {
        if (MASTER_POOL.length === 0) showMessage("VICTORY", "ALL RIDDLES ARE SOLVED.");
        else { showMessage("ROUND ENDED", "THE ENERGY HAS FADED. GATHER MORE."); setTimeout(startRitual, 2000); }
    } else { const el = document.getElementById('selectCarousel'); initCarouselDOM(el, false); switchView('view-selection'); }
    updatePoolUI();
}

function showMessage(t, c) { safeSetText('msg-title', t); safeSetText('msg-content', c); document.getElementById('message-box').style.display = 'flex'; }
function hideMessage() { document.getElementById('message-box').style.display = 'none'; }

function setQuizFeedbackVisible(visible) {
    const feedback = document.getElementById('quiz-feedback');
    if (!feedback) return;
    feedback.style.opacity = visible ? '1' : '0';
    feedback.style.pointerEvents = visible ? 'auto' : 'none';
    feedback.style.transform = visible ? 'translateY(0)' : 'translateY(8px)';
}

async function initMediaPipe() {
    if (typeof window.Hands === 'undefined') { setTimeout(initMediaPipe, 500); return; }
    try {
        const hands = new window.Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.75, minTrackingConfidence: 0.75 });
        const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
        hands.onResults(res => {
            const cursor = document.getElementById('hand-cursor'), prog = document.getElementById('pinch-progress');
            if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
                const marks = res.multiHandLandmarks[0];
                smoothedX += ((1 - marks[9].x) - smoothedX) * LERP_FACTOR;
                if (cursor) { cursor.style.display = 'block'; cursor.style.left = `${smoothedX * window.innerWidth}px`; cursor.style.top = `${marks[9].y * window.innerHeight}px`; }
                if (prog) { prog.style.display = 'block'; prog.style.left = `${smoothedX * window.innerWidth}px`; prog.style.top = `${marks[9].y * window.innerHeight}px`; }
                const ac = document.querySelector('.view-container.active .carousel');
                if (ac && !ac.classList.contains('focus-mode')) ac.scrollLeft = smoothedX * (ac.scrollWidth - ac.clientWidth);
                const handSize = distance(marks[0], marks[9]);
                const isIndexHooked = distance(marks[8], marks[6]) < handSize * HOOK_THRESHOLD;
                const isThumbSeparated = distance(marks[4], marks[8]) > handSize * THUMB_SEPARATION;
                if (isIndexHooked && isThumbSeparated) {
                    if (!hookActive) {
                        hookActive = true;
                        const bar = document.getElementById('pinch-bar');
                        if (bar) bar.style.clipPath = `inset(0 0 0 0)`;
                        handleConfirm();
                        if (prog) prog.style.display = 'none';
                    }
                } else {
                    hookActive = false;
                    const bar = document.getElementById('pinch-bar');
                    if (bar) bar.style.clipPath = `inset(100% 0 0 0)`;
                }
            } else { if (cursor) cursor.style.display = 'none'; if (prog) prog.style.display = 'none'; }
        });
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.onloadedmetadata = () => { video.play(); safeSetText('status-text', "CONSTELLATIONS ALIGNED: READY"); const update = async () => { try { await hands.send({ image: video }); } catch (e) { } requestAnimationFrame(update); }; update(); };
    } catch (err) { safeSetText('status-text', "CAMERA NOT DETECTED"); }
}

function handleConfirm() {
    const el = document.querySelector('.view-container.active .carousel');
    if (!el) return;
    const center = window.innerWidth / 2;
    const items = el.querySelectorAll('.arched-card');
    let closest = null, minDist = Infinity;
    items.forEach(it => {
        const rect = it.getBoundingClientRect();
        const d = Math.abs((rect.left + rect.width / 2) - center);
        if (d < minDist) { minDist = d; closest = it; }
    });
    if (closest && minDist < 120) closest.click();
}

async function initApp() {
    await loadInitialAssets();
    updatePoolUI();
    initMediaPipe();
}

window.onload = () => { initApp(); };

const actions = {
    startRitual,
    addExtraTime,
    backToSelection,
    hideMessage,
};

document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;

    const fn = actions[el.dataset.action];
    if (typeof fn !== "function") {
        console.error("No handler for action:", el.dataset.action);
        return;
    }
    fn(e);
});
