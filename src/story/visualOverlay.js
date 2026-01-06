// src/story/visualOverlay.js
function cssText() {
    return `
  #mainVisualOverlay {
    position: fixed;
    inset: 0;
    z-index: 99998;
    opacity: 0;
    pointer-events: none;
    transition: opacity .32s ease;
    background: rgba(0, 0, 0, 0.72);
  }
  #mainVisualOverlay.show {
    opacity: 1;
    pointer-events: auto;
  }
  #mainVisualOverlay iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
  `;
}

function baseUrl(path) {
    const base = import.meta.env.BASE_URL || "/";
    return base.replace(/\/?$/, "/") + path.replace(/^\//, "");
}

export function createMainVisualOverlay() {
    let root = document.getElementById("mainVisualOverlay");
    if (root) return overlayAPI(root);

    const style = document.createElement("style");
    style.textContent = cssText();
    document.head.appendChild(style);

    root = document.createElement("div");
    root.id = "mainVisualOverlay";
    root.innerHTML = `<iframe title="Main Visual Overlay" src="${baseUrl("main-visual.html")}"></iframe>`;
    document.body.appendChild(root);

    function show() {
        root.classList.add("show");
    }

    function hide() {
        root.classList.remove("show");
    }

    window.addEventListener("keydown", (e) => {
        if (!root.classList.contains("show")) return;
        if (e.key === "Escape") hide();
    });

    root.__overlayShow = show;
    root.__overlayHide = hide;

    return { show, hide };
}

function overlayAPI(root) {
    return {
        show: () => root && root.__overlayShow && root.__overlayShow(),
        hide: () => root && root.__overlayHide && root.__overlayHide()
    };
}
