(function () {
  if (window.loveEffects) window.loveEffects.doneLoading();
  const audio = document.getElementById("voiceAudio");
  const orb = document.getElementById("voiceOrb");
  const icon = document.getElementById("voiceIcon");
  const waveEl = document.getElementById("voiceWave");
  const timeCurrent = document.getElementById("timeCurrent");
  const timeTotal = document.getElementById("timeTotal");

  const PLAY_ICON = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M10 8.5v9l7.5-4.5-7.5-4.5z" fill="currentColor"/></svg>`;
  const PAUSE_ICON = `<svg width="24" height="24" viewBox="0 0 26 26" fill="none"><rect x="8" y="7" width="3.5" height="12" rx="1" fill="currentColor"/><rect x="14.5" y="7" width="3.5" height="12" rx="1" fill="currentColor"/></svg>`;

  // build static waveform bars
  const BAR_COUNT = 40;
  const heights = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    const h = 6 + Math.round(Math.abs(Math.sin(i * 0.5)) * 26 + Math.random() * 6);
    heights.push(h);
    const bar = document.createElement("span");
    bar.style.height = `${h}px`;
    waveEl.appendChild(bar);
  }
  const bars = waveEl.querySelectorAll("span");

  function fmt(t) {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  audio.addEventListener("loadedmetadata", () => {
    timeTotal.textContent = fmt(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    timeCurrent.textContent = fmt(audio.currentTime);
    const progress = audio.duration ? audio.currentTime / audio.duration : 0;
    const activeBars = Math.floor(progress * BAR_COUNT);
    bars.forEach((b, i) => { b.style.opacity = i <= activeBars ? "1" : "0.35"; });
  });

  audio.addEventListener("ended", () => {
    orb.classList.remove("is-playing");
    icon.innerHTML = PLAY_ICON;
  });

  orb.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {
        // file belum ada — beri tanda visual saja
      });
      orb.classList.add("is-playing");
      icon.innerHTML = PAUSE_ICON;
    } else {
      audio.pause();
      orb.classList.remove("is-playing");
      icon.innerHTML = PLAY_ICON;
    }
  });
})();
