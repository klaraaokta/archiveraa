(function () {
  if (window.loveEffects) window.loveEffects.doneLoading();
  const UNLOCK_DATE = new Date("2027-09-09T00:00:00");
  const STORAGE_KEY = "frioTimeCapsule";

  const writeSection = document.getElementById("capsuleWrite");
  const sealedSection = document.getElementById("capsuleSealed");
  const unlockedSection = document.getElementById("capsuleUnlocked");
  const form = document.getElementById("capsuleForm");
  const input = document.getElementById("capsuleInput");
  const countdownEl = document.getElementById("capsuleCountdown");
  const messageEl = document.getElementById("capsuleMessage");

  function fmtDays(diffMs) {
    const days = Math.max(0, Math.ceil(diffMs / 86400000));
    return `${days} hari lagi sampai bisa dibuka`;
  }

  function render() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      writeSection.hidden = false;
      sealedSection.hidden = true;
      unlockedSection.hidden = true;
      return;
    }
    const now = new Date();
    if (now >= UNLOCK_DATE) {
      writeSection.hidden = true;
      sealedSection.hidden = true;
      unlockedSection.hidden = false;
      messageEl.textContent = saved;
      if (window.loveEffects) {
        window.loveEffects.launchConfetti(window.innerWidth / 2, 160, { count: 50 });
      }
    } else {
      writeSection.hidden = true;
      sealedSection.hidden = false;
      unlockedSection.hidden = true;
      countdownEl.textContent = fmtDays(UNLOCK_DATE - now);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    localStorage.setItem(STORAGE_KEY, val);
    render();
    if (window.loveEffects) {
      const rect = form.getBoundingClientRect();
      window.loveEffects.launchConfetti(rect.left + rect.width / 2, rect.top + window.scrollY, { count: 40 });
    }
  });

  render();
})();
