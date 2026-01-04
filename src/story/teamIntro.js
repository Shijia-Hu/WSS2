// src/story/teamIntro.js
function baseUrl(path) {
    const base = import.meta.env.BASE_URL || "/";
    return base.replace(/\/?$/, "/") + path.replace(/^\//, "");
}

function injectCSS() {
    if (document.getElementById("teamIntroCSS")) return;
    const style = document.createElement("style");
    style.id = "teamIntroCSS";
    style.textContent = `
  #teamIntro {
    position: fixed; inset: 0; z-index: 100000;
    display: none;
  }
  #teamIntro.show { display: block; }

  #teamIntro .veil{
    position:absolute; inset:0;
    background: rgba(0,0,0,.78);
    backdrop-filter: blur(10px);
  }

  #teamIntro .stage{
    position:absolute; inset:0;
    display:grid; place-items:center;
    padding: 6vh 5vw;
  }

  #teamIntro .panel{
    width: min(1200px, 94vw);
    border-radius: 26px;
    border: 1px solid rgba(255,255,255,.14);
    background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04));
    box-shadow: 0 30px 120px rgba(0,0,0,.55);
    overflow: hidden;
  }

  #teamIntro .head{
    padding: 20px 26px 14px;
    border-bottom: 1px solid rgba(255,255,255,.12);
    background: linear-gradient(180deg, rgba(0,0,0,.38), rgba(0,0,0,.08));
    display:flex; justify-content:space-between; align-items:flex-end; gap:16px;
  }
  #teamIntro .kicker{
    font-size: 12px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(255,255,255,.7);
  }
  #teamIntro .teamName{
    margin-top: 6px;
    font-size: 34px;
    line-height: 1.12;
    color: rgba(255,255,255,.96);
  }
  #teamIntro .teamTagline{
    margin-top: 6px;
    font-size: 14px;
    color: rgba(255,255,255,.72);
  }
  #teamIntro .hint{
    font-size: 13px;
    color: rgba(255,255,255,.65);
    white-space: nowrap;
  }
  #teamIntro .hint kbd{
    font: inherit;
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,.18);
    background: rgba(255,255,255,.08);
    margin-left: 6px;
  }

  #teamIntro .body{
    position: relative;
    padding: 22px 22px 26px;
  }

  /* Grid slots */
  #teamIntro .grid{
    display:grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
      direction: rtl;          /* 关键：让第 0 个卡片落在最右边 */
  }
  @media (max-width: 980px){
    #teamIntro .grid{ grid-template-columns: repeat(2, 1fr); }
  }

  /* Member card base */
  #teamIntro .member{
    position: relative;
    border-radius: 22px;
    border: 1px solid rgba(255,255,255,.14);
    background: rgba(0,0,0,.24);
    overflow: hidden;
    min-height: 260px;
    isolation: isolate;
    direction: ltr;          /* 关键：只影响卡片内部文字方向，不被 rtl 影响 */
  }

  /* Photo layer */
  #teamIntro .photo{
    position:absolute; inset:0;
    opacity: 0;
    transform: translateY(10px) scale(.98);
    transition: opacity .45s ease, transform .7s cubic-bezier(.2,.8,.2,1);
    will-change: transform, opacity;
  }
  #teamIntro .photo img{
    width:100%; height:100%;
    object-fit: cover;
    filter: saturate(1.04) contrast(1.02);
    transform: scale(1.06);
    filter: blur(10px) brightness(.7) contrast(1.05); transition: filter .6s ease;
  }

  /* Name layer */
  #teamIntro .namebar{
    position:absolute; left:0; right:0; bottom:0;
    padding: 14px 14px 12px;
    background: linear-gradient(180deg, transparent, rgba(0,0,0,.62));
    opacity: 0;
    transform: translateY(8px);
    transition: opacity .35s ease .15s, transform .5s ease .15s;
  }
  #teamIntro .namebar .name{
    font-size: 18px;
    color: rgba(255,255,255,.94);
    letter-spacing: .02em;
  }
  #teamIntro .namebar .role{
    margin-top: 4px;
    font-size: 12px;
    color: rgba(255,255,255,.68);
  }

  /* Portal FX layer (rune ring + glow) */
  #teamIntro .portal{
    position:absolute; inset:0;
    display:grid; place-items:center;
    pointer-events:none;
  }
  #teamIntro .ring{
    width: 180px; height: 180px;
    border-radius: 999px;
    opacity: 0;
    transform: scale(.7);
    filter: drop-shadow(0 0 28px rgba(180,140,255,.20));
  }

  /* The ring is a conic gradient masked to look like arcane metal */
  #teamIntro .ring::before{
    content:"";
    position:absolute; inset:0;
    border-radius:999px;
    background:
      conic-gradient(from 0deg,
        rgba(255,255,255,.00),
        rgba(255,255,255,.20),
        rgba(255,255,255,.00),
        rgba(255,255,255,.12),
        rgba(255,255,255,.00)
      );
    -webkit-mask: radial-gradient(circle at 50% 50%, transparent 58%, #000 60%);
            mask: radial-gradient(circle at 50% 50%, transparent 58%, #000 60%);
    border: 1px solid rgba(255,255,255,.16);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
  }
  #teamIntro .member::after{
    content:"";
    position:absolute; left:50%; bottom:14px;
    width:72%; height:26%;
    transform: translateX(-50%);
    background: radial-gradient(circle at 50% 50%, rgba(255,255,255,.18), transparent 62%);
    opacity: 0;
    transition: opacity .35s ease;
    pointer-events:none;
  }
#teamIntro .member.active::after{ opacity: 1; }
  /* Inner glow */
  #teamIntro .ring::after{
    content:"";
    position:absolute; inset:10%;
    border-radius:999px;
    background: radial-gradient(circle, rgba(180,140,255,.22), transparent 62%);
    opacity:.9;
  }

  /* Summon animation */
  @keyframes summonRing {
    0% { opacity: 0; transform: scale(.65) rotate(-30deg); }
    30%{ opacity: 1; transform: scale(1.02) rotate(10deg); }
    100%{ opacity: .0; transform: scale(1.35) rotate(160deg); }
  }
  @keyframes runeSpin {
    from{ transform: rotate(0deg); }
    to{ transform: rotate(360deg); }
  }

  /* When active */
  #teamIntro .member.active .ring{
    opacity: 1;
    animation: summonRing 1.1s ease-out forwards;
  }
  #teamIntro .member.active .ring::before{
    animation: runeSpin .55s linear infinite;
  }

  #teamIntro .member.revealed .photo{
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0) brightness(1) contrast(1.02);
  }
  #teamIntro .member.revealed .namebar{
    opacity: 1;
    transform: translateY(0);
  }

  /* Canvas particles */
  #teamIntro canvas.particles{
    position:absolute; inset:0;
    width:100%; height:100%;
    pointer-events:none;
    opacity: 0;
    transition: opacity .25s ease;
  }
  #teamIntro .member.active canvas.particles{ opacity: 1; }
  `;
    document.head.appendChild(style);
}

function createDOM() {
    injectCSS();
    let root = document.getElementById("teamIntro");
    if (root) return root;

    root = document.createElement("div");
    root.id = "teamIntro";
    root.innerHTML = `
    <div class="veil"></div>
    <div class="stage">
      <div class="panel" role="dialog" aria-modal="true">
        <div class="head">
          <div>
            <div class="kicker">TEAM ENTRANCE</div>
            <div class="teamName" data-teamname>—</div>
            <div class="teamTagline" data-tagline></div>
          </div>
          <div class="hint">继续 <kbd>Space</kbd> / 关闭 <kbd>Esc</kbd></div>
        </div>
        <div class="body">
          <div class="grid" data-grid></div>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(root);
    return root;
}

function preload(urls = []) {
    return Promise.all(urls.map(u => new Promise(res => {
        const img = new Image();
        img.onload = () => res(true);
        img.onerror = () => res(false);
        img.src = u;
    })));
}

function makeParticles(canvas) {
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0;
    let particles = [];
    let running = false;
    let start = 0;

    function resize() {
        const rect = canvas.getBoundingClientRect();
        W = Math.max(1, Math.floor(rect.width));
        H = Math.max(1, Math.floor(rect.height));
        canvas.width = W * devicePixelRatio;
        canvas.height = H * devicePixelRatio;
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function burst() {
        resize();
        particles = [];
        const cx = W / 2, cy = H / 2;
        const n = 120;
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const sp = 80 + Math.random() * 220;
            particles.push({
                x: cx, y: cy,
                vx: Math.cos(a) * sp,
                vy: Math.sin(a) * sp,
                life: 650 + Math.random() * 450,
                r: 1 + Math.random() * 2.2
            });
        }
        start = performance.now();
        running = true;
        requestAnimationFrame(tick);
    }

    function tick(t) {
        if (!running) return;
        const dt = Math.min(40, t - (tick._last || t));
        tick._last = t;

        ctx.clearRect(0, 0, W, H);
        const elapsed = t - start;

        // 不指定颜色：用白光粒子，交给整体舞台色调决定
        ctx.globalCompositeOperation = "lighter";

        for (const p of particles) {
            const age = elapsed;
            const k = Math.max(0, 1 - age / p.life);
            if (k <= 0) continue;

            p.x += (p.vx * dt) / 1000;
            p.y += (p.vy * dt) / 1000;
            p.vx *= 0.985;
            p.vy *= 0.985;

            ctx.globalAlpha = 0.85 * k;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,1)";
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";

        if (elapsed < 950) requestAnimationFrame(tick);
        else running = false;
    }

    return { burst, resize };
}

export function createTeamIntro() {
    const root = createDOM();
    const grid = root.querySelector("[data-grid]");
    const nameEl = root.querySelector("[data-teamname]");
    const tagEl = root.querySelector("[data-tagline]");
    let current = null;
    let idx = 0;

    function build(team) {
        grid.innerHTML = "";
        const members = team.members || [];
        members.forEach((m, i) => {
            const card = document.createElement("div");
            card.className = "member";
            card.dataset.index = String(i);
            card.innerHTML = `
        <div class="portal"><div class="ring"></div></div>
        <canvas class="particles"></canvas>
        <div class="photo"><img alt="" /></div>
        <div class="namebar">
          <div class="name"></div>
          <div class="role"></div>
        </div>
      `;
            const img = card.querySelector(".photo img");
            img.src = m.photo || "";
            card.querySelector(".name").textContent = m.name || "";
            card.querySelector(".role").textContent = m.role || "";

            // canvas particles
            const canvas = card.querySelector("canvas.particles");
            const fx = makeParticles(canvas);
            card._fx = fx;

            grid.appendChild(card);
        });
    }

    async function show(team) {
        current = team;
        idx = 0;

        nameEl.textContent = team.name || "—";
        tagEl.textContent = team.tagline || "";

        const urls = (team.members || []).map(m => m.photo).filter(Boolean);
        await preload(urls);

        build(team);
        root.classList.add("show");

        // 自动开始召唤第一个成员
        summon(idx);
    }

    function hide() {
        root.classList.remove("show");
        current = null;
        idx = 0;
    }

    function summon(i) {
        const card = grid.querySelector(`.member[data-index="${i}"]`);
        if (!card) return;

        // 先清掉其它 active
        grid.querySelectorAll(".member").forEach(el => el.classList.remove("active"));
        card.classList.add("active");
        card._fx?.burst();

        // 0.35s 后照片显形（像“传送完成”）
        setTimeout(() => {
            card.classList.add("revealed");
        }, 350);
    }

    // Space：推进到下一位成员；如果到头就关闭
    function next() {
        if (!current) return;
        const total = (current.members || []).length;
        if (idx < total - 1) {
            idx++;
            summon(idx);
        } else {
            hide();
        }
    }

    // 键盘：只在 show 时接管
    window.addEventListener("keydown", (e) => {
        if (!root.classList.contains("show")) return;
        if (e.key === "Escape") hide();
        if (e.key === " ") { e.preventDefault(); next(); }
    });

    // 点击背景也可关闭（可选）
    root.addEventListener("click", (e) => {
        if (e.target.classList.contains("veil")) hide();
    });
    let queue = null;
    let timers = [];

    function clearTimers() {
        timers.forEach(t => clearTimeout(t));
        timers = [];
    }

    function stop() {
        clearTimers();
        hide();
        queue = null;
    }

    // 切队伍时做一个很短的淡出/淡入（不闪、不突兀）
    function switchTeam(team) {
        const panel = root.querySelector(".panel");
        panel.style.transition = "opacity .22s ease, transform .22s ease";
        panel.style.opacity = "0";
        panel.style.transform = "translateY(6px)";

        setTimeout(() => {
            nameEl.textContent = team.name || "—";
            tagEl.textContent = team.tagline || "";
            build(team);
            panel.style.opacity = "1";
            panel.style.transform = "translateY(0)";
            idx = 0;
            summon(0);
        }, 220);
    }

    // 自动播放：每个人登场等待 memberDelay，再推进下一位；队伍结束等 teamHold 再切下一队
    function autoAdvance(options) {
        const { memberDelay = 1150, teamHold = 650 } = options || {};
        clearTimers();

        // 当前队伍当前成员推进
        const t1 = setTimeout(() => {
            // 如果已经被 stop/关闭了
            if (!root.classList.contains("show") || !queue) return;

            const team = queue.teams[queue.teamIndex];
            const total = (team.members || []).length;

            if (idx < total - 1) {
                idx++;
                summon(idx);
                autoAdvance(options);
            } else {
                // 一队结束，稍等后切下一队
                const t2 = setTimeout(() => {
                    if (!root.classList.contains("show") || !queue) return;

                    if (queue.teamIndex < queue.teams.length - 1) {
                        queue.teamIndex++;
                        const nextTeam = queue.teams[queue.teamIndex];
                        switchTeam(nextTeam);
                        autoAdvance(options);
                    } else {
                        // 全部结束
                        const done = queue.onComplete;
                        stop();
                        if (typeof done === "function") done();
                    }
                }, teamHold);
                timers.push(t2);
            }
        }, memberDelay);

        timers.push(t1);
    }

    async function showAll(teams, options = {}) {
        if (!Array.isArray(teams) || teams.length === 0) return;

        current = null;
        idx = 0;
        queue = {
            teams,
            teamIndex: 0,
            onComplete: options.onComplete || null,
            options,
        };

        const first = teams[0];

        // 1) 只等第一队 4 张图，立即开演
        const firstUrls = (first.members || []).map(m => m.photo).filter(Boolean);
        await preload(firstUrls);

        // 2) 后台预加载全部（不 await）
        const allUrls = teams.flatMap(t => (t.members || []).map(m => m.photo).filter(Boolean));
        preload(allUrls);

        nameEl.textContent = first.name || "—";
        tagEl.textContent = first.tagline || "";

        build(first);
        root.classList.add("show");
        summon(0);

        if (options.auto) autoAdvance(options);
    }


    // 手动 next：如果正在队列模式，就“人→人→队→队”
    function next() {
        if (!root.classList.contains("show")) return;

        if (queue) {
            clearTimers(); // 手动介入时先停掉自动计时（避免双推进）
            const team = queue.teams[queue.teamIndex];
            const total = (team.members || []).length;

            if (idx < total - 1) {
                idx++;
                summon(idx);
                return;
            }

            // 当前队伍结束，切下一队
            if (queue.teamIndex < queue.teams.length - 1) {
                queue.teamIndex++;
                switchTeam(queue.teams[queue.teamIndex]);
                return;
            }

            // 全部结束
            const done = queue.onComplete;
            stop();
            if (typeof done === "function") done();
            return;
        }

        // 非队列：保留你原来的逻辑（单队 show 时的 next）
        if (!current) return;
        const total = (current.members || []).length;
        if (idx < total - 1) { idx++; summon(idx); }
        else hide();
    }

    return { show, showAll, hide, next, stop };
}
