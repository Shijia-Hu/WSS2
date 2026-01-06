// src/story/director.js
import { STORY } from "./config.js";
import { createOverlay } from "./overlay.js";
import { createMainVisualOverlay } from "./visualOverlay.js";

function baseUrl(path) {
    // 兼容 GitHub Pages 子路径（/WSS2/）
    // Vite 会注入 import.meta.env.BASE_URL
    const base = import.meta.env.BASE_URL || "/";
    return base.replace(/\/?$/, "/") + path.replace(/^\//, "");
}

export function createDirector() {
    const overlay = createOverlay();
    const mainVisualOverlay = createMainVisualOverlay();

    function showActIntro(actId) {
        const act = STORY.acts[actId];
        if (!act) return;
        mainVisualOverlay.hide();
        overlay.show({
            title: act.title,
            subtitle: act.subtitle || "",
            lines: act.hostLines || [],
            meta: "Act Intro"
        });
    }

    function showProcess(processId) {
        const process = STORY.processes?.find(item => item.id === processId);
        if (!process) return;
        mainVisualOverlay.hide();
        overlay.show({
            title: process.title,
            subtitle: process.subtitle || "",
            lines: process.lines || [],
            meta: "Process"
        });
    }

    function showRoundIntro(roundId) {
        const r = STORY.acts.act1.rounds.find(x => x.id === roundId);
        if (!r) return;
        mainVisualOverlay.hide();
        overlay.show({
            title: `${r.title}：${r.subtitle}`,
            subtitle: r.focus || "",
            lines: r.hostLines || [],
            meta: "Round Intro",
            emblemUrl: r.emblemKey ? baseUrl(STORY.emblems[r.emblemKey] || "") : ""
        });
    }

    function showSeal(roundId, winnerName = "胜队") {
        const r = STORY.acts.act1.rounds.find(x => x.id === roundId);
        if (!r) return;
        mainVisualOverlay.hide();
        overlay.show({
            title: "封印已触发：碎页归档",
            subtitle: `${winnerName} 上台触摸“翡翠封印”`,
            lines: [
                "（舞台出现对应碎页纹章）",
                `“${r.maxim}”`
            ],
            meta: `Seal · ${r.id.toUpperCase()}`,
            emblemUrl: r.emblemKey ? baseUrl(STORY.emblems[r.emblemKey] || "") : ""
        });
    }

    function showFinalReveal() {
        const act3 = STORY.acts.act3;
        mainVisualOverlay.hide();
        overlay.show({
            title: act3.title,
            subtitle: act3.subtitle || "",
            lines: [act3.finalLine, "", ...(act3.hostLines || [])],
            meta: "Final Reveal"
        });
    }

    function hideOverlay() {
        overlay.hide();
        mainVisualOverlay.hide();
    }

    function showOverlay(payload) {
        mainVisualOverlay.hide();
        overlay.show(payload);
    }

    function showMainVisual() {
        overlay.hide();
        mainVisualOverlay.show();
    }

    function hideMainVisual() {
        mainVisualOverlay.hide();
    }

    return {
        showActIntro,
        showProcess,
        showRoundIntro,
        showSeal,
        showFinalReveal,
        hideOverlay,
        showOverlay,
        showMainVisual,
        hideMainVisual
    };
}
