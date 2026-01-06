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
  `;
    document.body.appendChild(root);

    // 快捷键：Space 切换隐藏，Esc 强制隐藏
    window.addEventListener("keydown", (e) => {
        if (!root.classList.contains("show")) return;
        if (e.key === "Escape") hide();
        if (e.key === " ") { e.preventDefault(); hide(); }
    });

    function show(payload) {
        const { title, subtitle, lines = [], meta = "", emblemUrl = "" } = payload || {};
        root.querySelector("[data-title]").textContent = title || "";
        root.querySelector("[data-subtitle]").textContent = subtitle || "";
        root.querySelector("[data-meta]").textContent = meta || "";

        const body = root.querySelector("[data-body]");
        body.innerHTML = lines.map(t => `<p>${escapeHtml(t)}</p>`).join("");

        const emblemBox = root.querySelector("[data-emblem]");
        emblemBox.innerHTML = emblemUrl ? `<img alt="" src="${emblemUrl}">` : "";

        root.classList.add("show");
    }

    function hide() { root.classList.remove("show"); }

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
