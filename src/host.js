// src/host.js
import { TEAMS } from "./data/teams.js";

const bc = new BroadcastChannel("wss2-control");

const elLog = document.getElementById("log");
const elMemberDelay = document.getElementById("memberDelay");
const elTeamHold = document.getElementById("teamHold");
const elWinner = document.getElementById("winnerName");
const teamGrid = document.getElementById("teamGrid");
const chanState = document.getElementById("chanState");

chanState.textContent = "ready";

function nowTime() {
    const d = new Date();
    return d.toLocaleTimeString();
}

function logLine(s) {
    elLog.textContent = `[${nowTime()}] ${s}\n` + elLog.textContent;
}

function send(type, payload = {}) {
    bc.postMessage({ type, payload, at: Date.now() });
    logLine(`→ ${type} ${JSON.stringify(payload)}`);
}

function timings() {
    return {
        memberDelay: Number(elMemberDelay.value) || 950,
        teamHold: Number(elTeamHold.value) || 550,
    };
}

// 渲染 16 支队伍按钮
function renderTeams() {
    teamGrid.innerHTML = "";
    TEAMS.forEach((t, i) => {
        const btn = document.createElement("button");
        btn.className = "btn teamBtn";
        btn.dataset.team = t.id;
        btn.innerHTML = `
      <div>
        <div class="name">${String(i + 1).padStart(2, "0")} · ${t.name}</div>
        <div class="meta">${(t.members?.[0]?.name || "")}${t.members?.[1]?.name ? " / " + t.members[1].name : ""} …</div>
      </div>
      <div class="meta">重放</div>
    `;
        teamGrid.appendChild(btn);
    });
}

renderTeams();

// 点击按钮发送指令
document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    // 单队重放
    const teamId = btn.dataset.team;
    if (teamId) {
        const auto = true; // 默认自动重放单队（你也可以改成读取某个开关）
        send("TEAM_SHOW", { teamId, auto, ...timings() });
        return;
    }

    const cmd = btn.dataset.cmd;
    if (!cmd) return;

    const win = elWinner.value.trim() || "本轮胜队";

    if (cmd === "introStartAuto") return send("TEAMS_INTRO_START", { auto: true, ...timings() });
    if (cmd === "introStartManual") return send("TEAMS_INTRO_START", { auto: false, ...timings() });
    if (cmd === "introNext") return send("TEAMS_INTRO_NEXT");
    if (cmd === "introStop") return send("TEAMS_INTRO_STOP");

    if (cmd === "act1") return send("ACT_INTRO", { actId: "act1" });
    if (cmd === "r1") return send("ROUND_INTRO", { roundId: "r1" });
    if (cmd === "r2") return send("ROUND_INTRO", { roundId: "r2" });
    if (cmd === "r3") return send("ROUND_INTRO", { roundId: "r3" });
    if (cmd === "r4") return send("ROUND_INTRO", { roundId: "r4" });
    if (cmd === "process1") return send("PROCESS", { processId: "p1" });
    if (cmd === "process2") return send("PROCESS", { processId: "p2" });
    if (cmd === "process3") return send("PROCESS", { processId: "p3" });
    if (cmd === "process4") return send("PROCESS", { processId: "p4" });
    if (cmd === "process5") return send("PROCESS", { processId: "p5" });
    if (cmd === "process6") return send("PROCESS", { processId: "p6" });
    if (cmd === "process7") return send("PROCESS", { processId: "p7" });
    if (cmd === "process8") return send("PROCESS", { processId: "p8" });
    if (cmd === "process9") return send("PROCESS", { processId: "p9" });
    if (cmd === "process10") return send("PROCESS", { processId: "p10" });

    if (cmd === "seal1") return send("SEAL", { roundId: "r1", winner: win });
    if (cmd === "seal2") return send("SEAL", { roundId: "r2", winner: win });
    if (cmd === "seal3") return send("SEAL", { roundId: "r3", winner: win });
    if (cmd === "seal4") return send("SEAL", { roundId: "r4", winner: win });

    if (cmd === "act2") return send("ACT_INTRO", { actId: "act2" });
    if (cmd === "final") return send("FINAL");
    if (cmd === "actExit") return send("OVERLAY_HIDE");

    if (cmd === "quizPause") return send("QUIZ_PAUSE", { paused: true });
    if (cmd === "quizResume") return send("QUIZ_PAUSE", { paused: false });
});

// Host 页键盘快捷键（更顺手）
window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    const win = elWinner.value.trim() || "本轮胜队";

    if (k === "i" && !e.shiftKey) return send("TEAMS_INTRO_START", { auto: true, ...timings() });
    if (k === "i" && e.shiftKey) return send("TEAMS_INTRO_START", { auto: false, ...timings() });

    if (k === "n") return send("TEAMS_INTRO_NEXT");
    if (k === "x") return send("TEAMS_INTRO_STOP");

    if (e.key === "1" && !e.shiftKey && !e.ctrlKey && !e.altKey) return send("ROUND_INTRO", { roundId: "r1" });
    if (e.key === "2" && !e.shiftKey && !e.ctrlKey && !e.altKey) return send("ROUND_INTRO", { roundId: "r2" });
    if (e.key === "3" && !e.shiftKey && !e.ctrlKey && !e.altKey) return send("ROUND_INTRO", { roundId: "r3" });
    if (e.key === "4" && !e.shiftKey && !e.ctrlKey && !e.altKey) return send("ROUND_INTRO", { roundId: "r4" });

    if (e.shiftKey && e.key === "1") return send("SEAL", { roundId: "r1", winner: win });
    if (e.shiftKey && e.key === "2") return send("SEAL", { roundId: "r2", winner: win });
    if (e.shiftKey && e.key === "3") return send("SEAL", { roundId: "r3", winner: win });
    if (e.shiftKey && e.key === "4") return send("SEAL", { roundId: "r4", winner: win });

    if (k === "d") return send("ACT_INTRO", { actId: "act2" });
    if (k === "f") return send("FINAL");

    if (e.key === "7") return send("PROCESS", { processId: "p7" });
    if (e.key === "8") return send("PROCESS", { processId: "p8" });
    if (e.key === "9") return send("PROCESS", { processId: "p9" });
    if (e.key === "0") return send("PROCESS", { processId: "p10" });

    if ((e.ctrlKey || e.altKey) && e.key === "1") return send("PROCESS", { processId: "p1" });
    if ((e.ctrlKey || e.altKey) && e.key === "2") return send("PROCESS", { processId: "p2" });
    if ((e.ctrlKey || e.altKey) && e.key === "3") return send("PROCESS", { processId: "p3" });
    if ((e.ctrlKey || e.altKey) && e.key === "4") return send("PROCESS", { processId: "p4" });
    if ((e.ctrlKey || e.altKey) && e.key === "5") return send("PROCESS", { processId: "p5" });
    if ((e.ctrlKey || e.altKey) && e.key === "6") return send("PROCESS", { processId: "p6" });
});
