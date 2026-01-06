// src/story/teamIntro.js
import "../styles/teamIntro.css";
function baseUrl(path) {
    const base = import.meta.env.BASE_URL || "/";
    return base.replace(/\/?$/, "/") + path.replace(/^\//, "");
}

function createDOM() {
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
          <div class="groupPhotoSlot" aria-hidden="true"></div>
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
