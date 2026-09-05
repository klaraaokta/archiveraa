/* ===========================================================
   SHARED EFFECTS — love bubbles ambient, confetti launcher,
   loading bar, dan tombol mute efek.
   Dipakai di semua halaman (kecuali admin) lewat
   <script src="assets/js/effects.js">
=========================================================== */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MUTE_KEY = "frioEffectsMuted";
  let muted = localStorage.getItem(MUTE_KEY) === "1";

  window.loveEffects = window.loveEffects || {};

  /* ---------- LOVE BUBBLES (ambient, halus) ---------- */
  let bubbleTimer = null;
  let bubbleLayer = null;

  function ensureBubbleStyle() {
    if (document.getElementById("loveBubbleStyle")) return;
    const style = document.createElement("style");
    style.id = "loveBubbleStyle";
    style.textContent = `
      @keyframes loveBubbleRise {
        0%   { transform: translateY(0) translateX(0); opacity: 0; }
        8%   { opacity: 0.35; }
        92%  { opacity: 0.25; }
        100% { transform: translateY(-105vh) translateX(14px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function spawnBubble() {
    const b = document.createElement("div");
    const size = 10 + Math.random() * 14;
    b.textContent = Math.random() > 0.5 ? "🤍" : "💗";
    b.style.cssText = `
      position:absolute;
      left:${Math.random() * 92}%;
      bottom:-30px;
      font-size:${size}px;
      opacity:0;
      pointer-events:none;
      animation: loveBubbleRise ${11 + Math.random() * 8}s linear forwards;
    `;
    bubbleLayer.appendChild(b);
    setTimeout(() => b.remove(), 20000);
  }

  function startBubbles() {
    if (reduceMotion || muted) return;
    if (!bubbleLayer) {
      bubbleLayer = document.createElement("div");
      bubbleLayer.id = "loveBubbleLayer";
      bubbleLayer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2;overflow:hidden;";
      document.body.appendChild(bubbleLayer);
      ensureBubbleStyle();
    }
    if (bubbleTimer) return;
    bubbleTimer = setInterval(spawnBubble, 4200);
    setTimeout(spawnBubble, 800);
  }

  function stopBubbles() {
    if (bubbleTimer) { clearInterval(bubbleTimer); bubbleTimer = null; }
    if (bubbleLayer) { bubbleLayer.innerHTML = ""; }
  }

  /* ---------- CONFETTI LAUNCHER ---------- */
  function launchConfetti(x, y, opts) {
    if (reduceMotion || muted) return;
    opts = opts || {};
    const count = opts.count || 60;
    const colors = opts.colors || ["#B6555F", "#C9A87C", "#2C3345", "#F7F5F0"];
    const cx = x !== undefined ? x : window.innerWidth / 2;
    const cy = y !== undefined ? y : window.innerHeight / 2;

    let canvas = document.getElementById("confettiCanvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "confettiCanvas";
      canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:300;";
      document.body.appendChild(canvas);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    const pieces = [];
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: cx, y: cy,
        vx: (Math.random() - 0.5) * 9,
        vy: Math.random() * -8 - 2,
        size: 4 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
      });
    }

    let frame = 0;
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      pieces.forEach((p) => {
        p.vy += 0.22;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (frame < 110) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    tick();
  }

  /* ---------- TOMBOL MUTE EFEK (bubbles + confetti) ---------- */
  function initMuteButton() {
    const btn = document.createElement("button");
    btn.id = "effectsMuteBtn";
    btn.type = "button";
    btn.setAttribute("aria-label", muted ? "Nyalakan efek" : "Matikan efek");
    btn.textContent = muted ? "🔇" : "🤍";
    btn.style.cssText = `
      position:fixed; right:14px; bottom:var(--fab-bottom, 78px); z-index:400;
      width:38px; height:38px; border-radius:50%; border:none;
      background:rgba(23,21,18,0.72); color:#fff; font-size:15px;
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      box-shadow:0 6px 18px rgba(23,21,18,0.25);
      transition:transform 0.2s ease, opacity 0.2s ease;
      opacity:0.55;
    `;
    btn.addEventListener("mouseenter", () => { btn.style.opacity = "1"; });
    btn.addEventListener("mouseleave", () => { btn.style.opacity = "0.55"; });
    btn.addEventListener("click", () => {
      muted = !muted;
      localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
      btn.textContent = muted ? "🔇" : "🤍";
      btn.setAttribute("aria-label", muted ? "Nyalakan efek" : "Matikan efek");
      btn.style.transform = "scale(0.85)";
      setTimeout(() => { btn.style.transform = "scale(1)"; }, 150);
      if (muted) stopBubbles(); else startBubbles();
    });
    document.body.appendChild(btn);
  }

  /* ---------- TOMBOL SHARE CEPAT ---------- */
  function initShareButton() {
    const btn = document.createElement("button");
    btn.id = "quickShareBtn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Bagikan halaman ini");
    btn.textContent = "🔗";
    btn.style.cssText = `
      position:fixed; left:14px; bottom:var(--fab-bottom, 78px); z-index:400;
      width:38px; height:38px; border-radius:50%; border:none;
      background:rgba(23,21,18,0.72); color:#fff; font-size:14px;
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      box-shadow:0 6px 18px rgba(23,21,18,0.25);
      transition:transform 0.2s ease, opacity 0.2s ease;
      opacity:0.55;
    `;
    btn.addEventListener("mouseenter", () => { btn.style.opacity = "1"; });
    btn.addEventListener("mouseleave", () => { btn.style.opacity = "0.55"; });

    function toast(msg) {
      const t = document.createElement("div");
      t.textContent = msg;
      t.style.cssText = `
        position:fixed; left:50%; bottom:64px; transform:translateX(-50%);
        background:rgba(23,21,18,0.88); color:#fff; font-size:12.5px;
        padding:8px 16px; border-radius:999px; z-index:401;
        opacity:0; transition:opacity 0.25s ease;
      `;
      document.body.appendChild(t);
      requestAnimationFrame(() => { t.style.opacity = "1"; });
      setTimeout(() => {
        t.style.opacity = "0";
        setTimeout(() => t.remove(), 300);
      }, 1800);
    }

    btn.addEventListener("click", async () => {
      const url = location.href;
      const title = document.title;
      if (navigator.share) {
        try { await navigator.share({ title, url }); } catch (e) { /* dibatalkan, gak apa-apa */ }
        return;
      }
      try {
        await navigator.clipboard.writeText(url);
        toast("Link disalin ✨");
      } catch (e) {
        toast("Gagal nyalin link");
      }
    });
    document.body.appendChild(btn);
  }

  /* ---------- TOP LOADING BAR ---------- */
  (function initLoadBar() {
    const bar = document.createElement("div");
    bar.id = "topLoadBar";
    bar.style.cssText = "position:fixed;top:0;left:0;height:3px;width:0%;background:var(--plum, #B6555F);z-index:9999;transition:width 0.35s ease, opacity 0.4s ease;";
    document.documentElement.appendChild(bar);
    requestAnimationFrame(() => { bar.style.width = "65%"; });

    let done = false;
    function finish() {
      if (done) return;
      done = true;
      bar.style.width = "100%";
      setTimeout(() => { bar.style.opacity = "0"; }, 200);
      setTimeout(() => { bar.remove(); }, 700);
    }
    window.loveEffects.doneLoading = finish;
    // fallback: kalau halaman gak fetch apa-apa / lupa manggil doneLoading
    setTimeout(finish, 3500);
  })();

  /* ---------- VISIT COUNTER (buat Growth Tree) ---------- */
  (function trackVisit() {
    const SESSION_FLAG = "frioVisitCountedThisSession";
    const COUNT_KEY = "frioVisitCount";
    if (!sessionStorage.getItem(SESSION_FLAG)) {
      const current = parseInt(localStorage.getItem(COUNT_KEY) || "0", 10);
      localStorage.setItem(COUNT_KEY, String(current + 1));
      sessionStorage.setItem(SESSION_FLAG, "1");
    }
    window.loveEffects.visitCount = parseInt(localStorage.getItem(COUNT_KEY) || "1", 10);
  })();

  window.loveEffects.launchConfetti = launchConfetti;

  function init() {
    startBubbles();
    initMuteButton();
    initShareButton();
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js").catch(() => {});
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
