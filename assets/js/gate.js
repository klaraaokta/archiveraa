(function () {
  // Kode: tanggal jadian 15 Juni 2025 -> DDMMYY (6 digit)
  const SECRET = "150625";
  const UNLOCK_KEY = "frioUltahUnlocked";

  const gate = document.getElementById("gate");
  const app = document.getElementById("app");
  const dotsEl = document.getElementById("gateDots");
  const keypad = document.getElementById("gateKeypad");
  const hint = document.getElementById("gateHint");

  // Kalau sebelumnya udah pernah berhasil buka PIN, langsung masuk tanpa animasi
  if (sessionStorage.getItem(UNLOCK_KEY) === "1") {
    gate.classList.add("is-hidden");
    app.hidden = false;
    document.body.style.overflow = "";
    return;
  }

  const hints = [
    "coba lagi ya sayang, ini tanggal penting buat kita berdua",
    "hmm bukan itu, coba inget-inget lagi",
    "sabar dikit, kamu pasti inget kok",
  ];
  let attempt = 0;
  let value = "";

  function renderDots() {
    dotsEl.innerHTML = "";
    const count = Math.max(value.length, 1);
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      if (i < value.length) span.classList.add("filled");
      dotsEl.appendChild(span);
    }
  }
  renderDots();

  function pressKey(key) {
    if (key === "clear") {
      value = value.slice(0, -1);
      renderDots();
      return;
    }
    if (key === "ok") {
      submit();
      return;
    }
    if (value.length >= 6) return;
    value += key;
    renderDots();
    if (value.length === 6) {
      setTimeout(submit, 150);
    }
  }

  function submit() {
    if (value === SECRET) {
      unlock();
    } else {
      attempt++;
      hint.textContent = hints[Math.min(attempt - 1, hints.length - 1)];
      hint.classList.remove("shake");
      dotsEl.classList.remove("shake");
      void hint.offsetWidth;
      hint.classList.add("shake");
      dotsEl.classList.add("shake");
      value = "";
      setTimeout(renderDots, 300);
    }
  }

  keypad.addEventListener("click", (e) => {
    const btn = e.target.closest(".key");
    if (!btn) return;
    pressKey(btn.dataset.key);
  });

  document.addEventListener("keydown", (e) => {
    if (gate.classList.contains("is-hidden")) return;
    if (/^[0-9]$/.test(e.key)) pressKey(e.key);
    else if (e.key === "Backspace") pressKey("clear");
    else if (e.key === "Enter") pressKey("ok");
  });

  function unlock() {
    sessionStorage.setItem(UNLOCK_KEY, "1");
    gate.classList.add("is-unlocking");
    const isFirstEver = !localStorage.getItem("frioFirstVisitCelebrated");
    if (isFirstEver) localStorage.setItem("frioFirstVisitCelebrated", "1");
    setTimeout(() => {
      gate.classList.add("is-hidden");
      app.hidden = false;
      document.body.style.overflow = "";
      if (isFirstEver && window.loveEffects) {
        window.loveEffects.launchConfetti(window.innerWidth / 2, window.innerHeight / 3, { count: 120 });
      }
    }, 550);
  }
})();
