// src/story/overlay.js
function cssText() {
    return `
  #stageOverlay {
    position: fixed; inset: 0; z-index: 99999;
    display: grid; place-items: center;
    opacity: 0; pointer-events: none;
    transition: opacity .28s ease;
  }
  #stageOverlay.show { opacity: 1; pointer-events: auto; }
  #stageOverlay.mode-main { place-items: stretch; }

  #stageOverlay .veil {
    position: absolute; inset: 0;
    background: rgba(0,0,0,.72);
    backdrop-filter: blur(10px);
  }

  #stageOverlay .panel {
    position: relative;
    width: min(980px, 92vw);
    border-radius: 24px;
    padding: 34px 34px 26px;
    background: rgba(20,20,24,.72);
    box-shadow: 0 20px 80px rgba(0,0,0,.55);
    border: 1px solid rgba(255,255,255,.14);
  }

  #stageOverlay .top {
    display: flex; gap: 18px; align-items: center;
    margin-bottom: 14px;
  }

  #stageOverlay .emblem {
    width: 84px; height: 84px;
    border-radius: 18px;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.14);
    display: grid; place-items: center;
    overflow: hidden;
    flex: 0 0 auto;
  }

  #stageOverlay .emblem img {
    width: 100%; height: 100%; object-fit: cover;
  }

  #stageOverlay .title {
    font-size: 28px; line-height: 1.15;
    margin: 0; color: #fff;
    letter-spacing: .4px;
  }
  #stageOverlay .subtitle {
    margin: 6px 0 0;
    font-size: 16px; opacity: .78; color: #fff;
  }

  #stageOverlay .body {
    margin-top: 14px;
    color: rgba(255,255,255,.92);
    font-size: 18px; line-height: 1.55;
  }
  #stageOverlay .body p { margin: 0 0 10px; }

  #stageOverlay .footer {
    margin-top: 18px;
    display: flex; justify-content: space-between; gap: 12px;
    color: rgba(255,255,255,.72);
    font-size: 14px;
  }

  #stageOverlay .hint kbd{
    font: inherit;
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,.18);
    background: rgba(255,255,255,.08);
  }

  #stageOverlay .main-visual {
    position: relative;
    inset: 0;
    display: none;
    height: 100%;
  }

  #stageOverlay.mode-main .main-visual {
    display: block;
  }

  #stageOverlay.mode-main .panel {
    display: none;
  }

  #stageOverlay .main-visual__backdrop {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,
      rgba(7, 22, 13, 1) 0%,
      rgba(9, 24, 14, 1) 45%,
      rgba(22, 10, 16, 1) 55%,
      rgba(255, 241, 248, .8) 100%);
    overflow: hidden;
    animation: mainVisualDrift 18s ease-in-out infinite alternate;
    will-change: transform;
  }

  #stageOverlay .main-visual__image {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    opacity: .92;
    filter: contrast(1.08) saturate(1.05);
    transform: scale(1.03);
    animation: mainVisualBreathe 10s ease-in-out infinite;
  }

  #stageOverlay .main-visual__bloom {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: .55;
    filter: blur(26px);
    mix-blend-mode: screen;
    background:
      radial-gradient(46% 58% at 18% 44%, rgba(0, 168, 89, .18), transparent 68%),
      radial-gradient(46% 58% at 84% 28%, rgba(248, 150, 194, .14), transparent 70%),
      radial-gradient(56% 42% at 54% 72%, rgba(197, 160, 89, .10), transparent 72%);
  }

  #stageOverlay .main-visual__vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at center,
      rgba(0,0,0,0) 35%,
      rgba(0,0,0,0.35) 100%);
  }

  #stageOverlay .main-visual__storm {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at 18% 55%,
      rgba(80,255,160,0.18) 0%,
      rgba(80,255,160,0.06) 25%,
      rgba(0,0,0,0) 55%);
    mix-blend-mode: screen;
    animation: mainVisualStorm 3.8s ease-in-out infinite;
    filter: blur(0.4px);
  }

  #stageOverlay .main-visual__bubbles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  #stageOverlay .main-visual__bubble {
    position: absolute;
    bottom: -15vh;
    right: 6vw;
    width: 10vmin;
    height: 10vmin;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%,
      rgba(255,255,255,0.55),
      rgba(255,255,255,0.10) 45%,
      rgba(255,255,255,0.05) 70%,
      rgba(255,255,255,0) 100%);
    filter: blur(0.2px);
    opacity: .55;
    animation: mainVisualFloatUp 12s linear infinite;
  }

  #stageOverlay .main-visual__bubble:nth-child(2){ right: 14vw; width: 6vmin; height: 6vmin; animation-duration: 15s; opacity:.45; }
  #stageOverlay .main-visual__bubble:nth-child(3){ right: 22vw; width: 8vmin; height: 8vmin; animation-duration: 18s; opacity:.35; }
  #stageOverlay .main-visual__bubble:nth-child(4){ right: 10vw; width: 4.5vmin; height: 4.5vmin; animation-duration: 13s; opacity:.35; }
  #stageOverlay .main-visual__bubble:nth-child(5){ right: 26vw; width: 5.5vmin; height: 5.5vmin; animation-duration: 20s; opacity:.30; }

  #stageOverlay .main-visual__spark {
    position: absolute;
    left: 73%;
    top: 52%;
    width: 2.2vmin;
    height: 2.2vmin;
    pointer-events: none;
    background: radial-gradient(circle,
      rgba(255,255,255,0.95),
      rgba(255,255,255,0.2) 55%,
      rgba(255,255,255,0) 75%);
    transform: translate(-50%,-50%);
    mix-blend-mode: screen;
    animation: mainVisualTwinkle 1.6s ease-in-out infinite;
    filter: blur(0.1px);
  }

  #stageOverlay .main-visual__spark::after {
    content:"";
    position:absolute; inset:-120%;
    background: conic-gradient(from 0deg,
      rgba(255,255,255,0) 0 40%,
      rgba(255,255,255,0.55) 45%,
      rgba(255,255,255,0) 50% 100%);
    border-radius:50%;
    animation: mainVisualSpin 3.2s linear infinite;
    opacity:.55;
  }

  #stageOverlay .main-visual__content {
    position: relative;
    inset: 0;
    display: grid;
    place-items: center;
    text-align: center;
    padding: 10vh 10vw;
    z-index: 2;
    color: #fff;
    pointer-events: none;
  }

  #stageOverlay .main-visual__kicker {
    font-family: "Cinzel", serif;
    font-size: clamp(12px, 1.4vw, 18px);
    letter-spacing: 0.6em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-bottom: 16px;
  }

  #stageOverlay .main-visual__title {
    font-family: "Cinzel", serif;
    font-size: clamp(38px, 7.4vw, 120px);
    letter-spacing: 0.18em;
    margin: 0;
    text-transform: uppercase;
    text-shadow: 0 12px 40px rgba(0, 0, 0, 0.65);
  }

  #stageOverlay .main-visual__subtitle {
    margin-top: 16px;
    font-size: clamp(14px, 1.8vw, 22px);
    color: rgba(255,255,255,0.75);
    letter-spacing: 0.28em;
    text-transform: uppercase;
  }

  #stageOverlay .main-visual__divider {
    width: min(420px, 70vw);
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
    margin: 24px auto 0;
  }

  #stageOverlay .main-visual__hint {
    margin-top: 18px;
    font-size: clamp(11px, 1.2vw, 14px);
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }

  @keyframes mainVisualDrift{
    0% { transform: translate3d(-1%, 0, 0); }
    100% { transform: translate3d(1%, -1%, 0); }
  }
  @keyframes mainVisualBreathe{
    0%,100% { transform: scale(1.03); }
    50% { transform: scale(1.06); }
  }
  @keyframes mainVisualStorm{
    0%,100% { opacity: .25; transform: translate3d(0,0,0); }
    40% { opacity: .55; transform: translate3d(-3px, 2px, 0); }
    70% { opacity: .35; transform: translate3d(2px, -2px, 0); }
  }
  @keyframes mainVisualFloatUp{
    0% { transform: translate3d(0,0,0) scale(0.95); opacity:0; }
    10% { opacity:.55; }
    100% { transform: translate3d(-3vw,-120vh,0) scale(1.12); opacity:0; }
  }
  @keyframes mainVisualTwinkle{
    0%,100% { opacity:.25; transform: translate(-50%,-50%) scale(0.9); }
    50% { opacity:.75; transform: translate(-50%,-50%) scale(1.25); }
  }
  @keyframes mainVisualSpin{
    to { transform: rotate(360deg); }
  }

  @media (max-width: 640px){
    #stageOverlay .main-visual__title { letter-spacing: 0.1em; }
    #stageOverlay .main-visual__subtitle,
    #stageOverlay .main-visual__hint { letter-spacing: 0.18em; }
  }

  @media (prefers-reduced-motion: reduce){
    #stageOverlay .main-visual__image,
    #stageOverlay .main-visual__backdrop,
    #stageOverlay .main-visual__storm,
    #stageOverlay .main-visual__bubble,
    #stageOverlay .main-visual__spark {
      animation: none !important;
    }
  }
  `;
}

export function createOverlay() {
    let root = document.getElementById("stageOverlay");
    if (root) return overlayAPI(root);

    const style = document.createElement("style");
    style.textContent = cssText();
    document.head.appendChild(style);

    root = document.createElement("div");
    root.id = "stageOverlay";
    root.innerHTML = `
    <div class="veil"></div>
    <div class="panel" role="dialog" aria-modal="true">
      <div class="top">
        <div class="emblem" data-emblem></div>
        <div>
          <h2 class="title" data-title></h2>
          <div class="subtitle" data-subtitle></div>
        </div>
      </div>
      <div class="body" data-body></div>
      <div class="footer">
        <div class="meta" data-meta></div>
        <div class="hint">按 <kbd>Space</kbd> 继续 / <kbd>Esc</kbd> 关闭</div>
      </div>
    </div>
    <div class="main-visual" aria-hidden="true">
      <div class="main-visual__backdrop">
        <div class="main-visual__image" data-main-image></div>
        <div class="main-visual__bloom"></div>
      </div>
      <div class="main-visual__storm"></div>
      <div class="main-visual__bubbles">
        <div class="main-visual__bubble"></div>
        <div class="main-visual__bubble"></div>
        <div class="main-visual__bubble"></div>
        <div class="main-visual__bubble"></div>
        <div class="main-visual__bubble"></div>
      </div>
      <div class="main-visual__spark"></div>
      <div class="main-visual__vignette"></div>
      <div class="main-visual__content">
        <div>
          <div class="main-visual__kicker" data-main-kicker></div>
          <h1 class="main-visual__title" data-main-title></h1>
          <div class="main-visual__subtitle" data-main-subtitle></div>
          <div class="main-visual__divider"></div>
          <div class="main-visual__hint" data-main-hint></div>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(root);

    // 快捷键：Space 切换隐藏，Esc 强制隐藏
    window.addEventListener("keydown", (e) => {
        if (!root.classList.contains("show")) return;
        if (e.key === "Escape") hide();
        if (e.key === " ") { e.preventDefault(); hide(); }
    });

    function show(payload) {
        const {
            title,
            subtitle,
            lines = [],
            meta = "",
            emblemUrl = "",
            mode = "",
            kicker = "",
            hint = "",
            backgroundImage = ""
        } = payload || {};

        root.classList.remove("mode-main");

        root.querySelector("[data-title]").textContent = title || "";
        root.querySelector("[data-subtitle]").textContent = subtitle || "";
        root.querySelector("[data-meta]").textContent = meta || "";

        const body = root.querySelector("[data-body]");
        body.innerHTML = lines.map(t => `<p>${escapeHtml(t)}</p>`).join("");

        const emblemBox = root.querySelector("[data-emblem]");
        emblemBox.innerHTML = emblemUrl ? `<img alt="" src="${emblemUrl}">` : "";

        if (mode === "main") {
            root.classList.add("mode-main");
            root.querySelector("[data-main-kicker]").textContent = kicker || "";
            root.querySelector("[data-main-title]").textContent = title || "";
            root.querySelector("[data-main-subtitle]").textContent = subtitle || "";
            root.querySelector("[data-main-hint]").textContent = hint || "";
            const image = root.querySelector("[data-main-image]");
            image.style.backgroundImage = backgroundImage ? `url("${backgroundImage}")` : "";
        }

        root.classList.add("show");
    }

    function hide() {
        root.classList.remove("show");
        root.classList.remove("mode-main");
    }

    return { show, hide };
}

function overlayAPI(root) {
    return {
        show: (payload) => root && root.__overlayShow && root.__overlayShow(payload),
        hide: () => root && root.__overlayHide && root.__overlayHide()
    };
}

function escapeHtml(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
