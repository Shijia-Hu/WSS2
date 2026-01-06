import { createDirector } from "./story/director.js";

const director = createDirector();

const COMMAND_HANDLERS = {
    PROCESS: (payload) => director.showProcess(payload.processId),
    ACT_INTRO: (payload) => director.showActIntro(payload.actId),
    ROUND_INTRO: (payload) => director.showRoundIntro(payload.roundId),
    SEAL: (payload) => director.showSeal(payload.roundId, payload.winner || "本轮胜队"),
    FINAL: () => director.showFinalReveal(),
    OVERLAY_HIDE: () => director.hideOverlay(),
};

function applyCommand(type, payload = {}) {
    const handler = COMMAND_HANDLERS[type];
    if (!handler) return;
    return handler(payload);
}

const bc = new BroadcastChannel("wss2-control");
bc.addEventListener("message", (e) => {
    const { type, payload } = e.data || {};
    if (!type) return;
    applyCommand(type, payload);
});

const REQUIRE_CTRL = false;

window.addEventListener("keydown", (e) => {
    if (REQUIRE_CTRL && !e.ctrlKey) return;

    const k = e.key.toLowerCase();

    if (e.key === "1" && !e.ctrlKey && !e.altKey) return applyCommand("ROUND_INTRO", { roundId: "r1" });
    if (e.key === "2" && !e.ctrlKey && !e.altKey) return applyCommand("ROUND_INTRO", { roundId: "r2" });
    if (e.key === "3" && !e.ctrlKey && !e.altKey) return applyCommand("ROUND_INTRO", { roundId: "r3" });
    if (e.key === "4" && !e.ctrlKey && !e.altKey) return applyCommand("ROUND_INTRO", { roundId: "r4" });

    if (e.shiftKey && e.key === "1") return applyCommand("SEAL", { roundId: "r1", winner: "本轮胜队" });
    if (e.shiftKey && e.key === "2") return applyCommand("SEAL", { roundId: "r2", winner: "本轮胜队" });
    if (e.shiftKey && e.key === "3") return applyCommand("SEAL", { roundId: "r3", winner: "本轮胜队" });
    if (e.shiftKey && e.key === "4") return applyCommand("SEAL", { roundId: "r4", winner: "本轮胜队" });

    if (k === "d") return applyCommand("ACT_INTRO", { actId: "act2" });
    if (k === "f") return applyCommand("FINAL");

    if (e.key === "7") return applyCommand("PROCESS", { processId: "p7" });
    if (e.key === "8") return applyCommand("PROCESS", { processId: "p8" });
    if (e.key === "9") return applyCommand("PROCESS", { processId: "p9" });
    if (e.key === "0") return applyCommand("PROCESS", { processId: "p10" });

    if ((e.ctrlKey || e.altKey) && e.key === "1") return applyCommand("PROCESS", { processId: "p1" });
    if ((e.ctrlKey || e.altKey) && e.key === "2") return applyCommand("PROCESS", { processId: "p2" });
    if ((e.ctrlKey || e.altKey) && e.key === "3") return applyCommand("PROCESS", { processId: "p3" });
    if ((e.ctrlKey || e.altKey) && e.key === "4") return applyCommand("PROCESS", { processId: "p4" });
    if ((e.ctrlKey || e.altKey) && e.key === "5") return applyCommand("PROCESS", { processId: "p5" });
    if ((e.ctrlKey || e.altKey) && e.key === "6") return applyCommand("PROCESS", { processId: "p6" });
});
