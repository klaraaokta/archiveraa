(function () {
  if (window.loveEffects) window.loveEffects.doneLoading();
  // ===== CAKE — TIUP LILIN =====
  const cake = document.getElementById("cake");
  const cakeHint = document.getElementById("cakeHint");
  const flames = ["flame1", "flame2", "flame3"].map((id) => document.getElementById(id));
  let candlesLeft = 3;

  cake.addEventListener("click", () => {
    const active = flames.filter((f) => !f.classList.contains("out"));
    if (active.length === 0) return;
    active[0].classList.add("out");
    candlesLeft--;
    if (candlesLeft === 0) {
      cakeHint.textContent = "permohonannya udah terkirim ke semesta 🤍";
      cakeHint.classList.add("granted");
      const rect = cake.getBoundingClientRect();
      if (window.loveEffects) {
        window.loveEffects.launchConfetti(rect.left + rect.width / 2, rect.top + window.scrollY);
      }
    } else {
      cakeHint.textContent = `lilinnya tinggal ${candlesLeft} lagi, tekan sekali lagi`;
    }
  });

  // ===== GIFT BOX =====
  const giftBox = document.getElementById("giftBox");
  const giftMessage = document.getElementById("giftMessage");
  let giftOpened = false;

  giftBox.addEventListener("click", () => {
    if (giftOpened) return;
    giftOpened = true;
    giftBox.classList.add("is-open");
    setTimeout(() => {
      giftMessage.style.display = "block";
      requestAnimationFrame(() => giftMessage.classList.add("in"));
    }, 350);
    const rect = giftBox.getBoundingClientRect();
    if (window.loveEffects) {
      window.loveEffects.launchConfetti(rect.left + rect.width / 2, rect.top + window.scrollY, { count: 40 });
    }
  });

  // ===== SURPRISE ENDING =====
  const surpriseBtn = document.getElementById("surpriseBtn");
  const overlay = document.getElementById("surpriseOverlay");
  const closeBtn = document.getElementById("surpriseClose");

  surpriseBtn.addEventListener("click", () => {
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
    if (window.loveEffects) {
      window.loveEffects.launchConfetti(window.innerWidth / 2, window.innerHeight / 3, { count: 90 });
    }
    document.querySelectorAll(".surprise-line").forEach((line) => {
      const delay = parseInt(line.dataset.d, 10) * 650;
      setTimeout(() => line.classList.add("in"), delay);
    });
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
    document.body.style.overflow = "";
    document.querySelectorAll(".surprise-line").forEach((line) => line.classList.remove("in"));
  });
})();
