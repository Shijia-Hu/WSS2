// 视差 + 高光跟随（轻量）
    (function () {
      const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const els = Array.from(document.querySelectorAll(".sprite"));
      let tx = 0, ty = 0, cx = 0, cy = 0;

      function setTarget(x, y) {
        const w = innerWidth, h = innerHeight;
        tx = (x / w - .5) * 2;
        ty = (y / h - .5) * 2;

        document.documentElement.style.setProperty("--mx", (x / w * 100).toFixed(2) + "%");
        document.documentElement.style.setProperty("--my", (y / h * 100).toFixed(2) + "%");
      }

      addEventListener("mousemove", e => setTarget(e.clientX, e.clientY), { passive: true });
      addEventListener("touchmove", e => {
        const t = e.touches && e.touches[0]; if (!t) return;
        setTarget(t.clientX, t.clientY);
      }, { passive: true });

      function raf() {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        els.forEach((el, i) => {
          const depth = (i % 7) + 1;
          el.style.setProperty("--px", (cx * depth * 2.3) + "px");
          el.style.setProperty("--py", (cy * depth * 1.8) + "px");
        });
        requestAnimationFrame(raf);
      }
      raf();
    })();

    // 进入：跳转到 WSS2 交互页面
    document.getElementById("enterBtn").addEventListener("click", () => {
      window.location.href = "wss2.html";
    });

// 随机漂浮：小物件漂，大雾/城堡/大光晕不漂
    (() => {
      const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const animations = new WeakMap();
      const rand = (a, b) => a + Math.random() * (b - a);

      function wrapForFloat(sprite) {
        if (sprite.dataset.noFloat === "1") return null;
        if (sprite.classList.contains("overlaySlot") && sprite.dataset.float !== "1") return null;

        const img = sprite.querySelector("img");
        if (!img) return null;

        let wrap = sprite.querySelector(":scope > .floatWrap");
        if (!wrap) {
          wrap = document.createElement("div");
          wrap.className = "floatWrap";
          sprite.insertBefore(wrap, img);
          wrap.appendChild(img);
        }
        return wrap;
      }

      function applyRandomFloat(sprite) {
        const wrap = wrapForFloat(sprite);
        if (!wrap) return;

        const old = animations.get(wrap);
        if (old) old.cancel();

        const rect = sprite.getBoundingClientRect();
        const base = Math.min(rect.width, rect.height);

        const amp = Math.max(7, Math.min(28, base * 0.06));
        const rot = (sprite.dataset.noRotate === "1") ? 0 : Math.max(0.8, Math.min(6, base * 0.012));
        const dur = rand(4.8, 11.0);
        const delay = -rand(0, dur);

        const kf = [
          { transform: `translate(${rand(-amp, amp)}px, ${rand(-amp, amp)}px) rotate(${rand(-rot, rot)}deg)` },
          { transform: `translate(${rand(-amp, amp)}px, ${rand(-amp, amp)}px) rotate(${rand(-rot, rot)}deg)` },
          { transform: `translate(${rand(-amp, amp)}px, ${rand(-amp, amp)}px) rotate(${rand(-rot, rot)}deg)` },
          { transform: `translate(${rand(-amp, amp)}px, ${rand(-amp, amp)}px) rotate(${rand(-rot, rot)}deg)` },
          { transform: `translate(${rand(-amp, amp)}px, ${rand(-amp, amp)}px) rotate(${rand(-rot, rot)}deg)` },
        ];

        const anim = wrap.animate(kf, {
          duration: dur * 1000,
          iterations: Infinity,
          direction: "alternate",
          easing: "ease-in-out",
          delay: delay * 1000,
        });

        animations.set(wrap, anim);
      }

      function refreshAll() {
        document.querySelectorAll(".sprite").forEach(applyRandomFloat);
      }

      window.addEventListener("load", () => {
        refreshAll();
        window.refreshFloat = refreshAll;
      });

      let t = 0;
      window.addEventListener("resize", () => {
        clearTimeout(t);
        t = setTimeout(refreshAll, 180);
      });
    })();

// 轻量氛围光尘
    (() => {
      const atmosphere = document.querySelector(".atmosphere");
      if (!atmosphere) return;

      const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const rand = (min, max) => min + Math.random() * (max - min);
      const count = reduceMotion ? 10 : 22;

      const fragment = document.createDocumentFragment();
      for (let i = 0; i < count; i += 1) {
        const mote = document.createElement("span");
        mote.className = "mote";
        mote.style.left = `${rand(4, 96)}%`;
        mote.style.top = `${rand(10, 92)}%`;
        mote.style.setProperty("--mote-size", `${rand(3, 8)}px`);
        mote.style.setProperty("--mote-opacity", rand(0.18, 0.5).toFixed(2));
        mote.style.setProperty("--mote-duration", `${rand(12, 22).toFixed(1)}s`);
        mote.style.setProperty("--mote-shift-x", `${rand(-24, 24).toFixed(1)}px`);
        mote.style.setProperty("--mote-shift-y", `${rand(-40, 30).toFixed(1)}px`);
        mote.style.animationDelay = `${rand(-10, 0).toFixed(1)}s`;
        fragment.appendChild(mote);
      }
      atmosphere.appendChild(fragment);
    })();

// UI kit interactions
    (() => {
      const feedback = document.getElementById("kit-feedback");
      const actions = {
        invoke: "Emerald sigil awakens.",
        bless: "Rose blessing radiates.",
        inspect: "Neutral pact revealed."
      };

      document.querySelectorAll("[data-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.action;
          if (!feedback || !actions[action]) return;

          feedback.textContent = actions[action];
          feedback.classList.add("is-active");
          window.clearTimeout(feedback._timer);
          feedback._timer = window.setTimeout(() => {
            feedback.classList.remove("is-active");
          }, 1800);
        });
      });
    })();
