(function () {
  const sb = window.supabaseClient;

  // ===== FALLBACK DATA =====
  const fallbackTracks = [
    { title: "lagu favorit kita #1", artist: "-", audio_url: "assets/audio/track1.mp3", reason: "lagu ini muter terus pas awal-awal kita deket, tiap denger langsung inget kamu." },
    { title: "lagu favorit kita #2", artist: "-", audio_url: "assets/audio/track2.mp3", reason: "lagu yang sering kita kirim bolak-balik pas lagi kangen." },
    { title: "lagu waktu jadian", artist: "-", audio_url: "assets/audio/track3.mp3", reason: "lagi muter pas kamu nembak aku, jadi otomatis 'lagu kita'." },
    { title: "lagu random tengah malem", artist: "-", audio_url: "assets/audio/track4.mp3", reason: "hasil nemenin video call sampe pagi, receh tapi nempel banget." },
  ];
  let tracks = fallbackTracks;

  const audio = document.getElementById("musicAudio");
  const art = document.getElementById("npArt");
  const titleEl = document.getElementById("npTitle");
  const artistEl = document.getElementById("npArtist");
  const playBtn = document.getElementById("npPlay");
  const playIcon = document.getElementById("npPlayIcon");
  const bar = document.getElementById("npBar");
  const fill = document.getElementById("npFill");
  const currentEl = document.getElementById("npCurrent");
  const durationEl = document.getElementById("npDuration");
  const reasonEl = document.getElementById("npReason");
  const list = document.getElementById("trackList");

  const PLAY = `<path d="M7 5v10l8-5-8-5z"/>`;
  const PAUSE = `<rect x="6" y="5" width="3" height="10" rx="1"/><rect x="11" y="5" width="3" height="10" rx="1"/>`;

  let index = 0;

  function fmt(t) {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function renderList() {
    list.innerHTML = "";
    tracks.forEach((t, i) => {
      const item = document.createElement("div");
      item.className = "track-item" + (i === index ? " is-active" : "");
      item.innerHTML = `
        <div class="track-thumb">${t.cover_url ? `<img src="${t.cover_url}" alt="cover ${t.title}" loading="lazy">` : ""}</div>
        <div class="track-info">
          <p class="track-name">${t.title}</p>
          <p class="track-artist">${t.artist}</p>
        </div>
        <span class="track-playing-dot"></span>
      `;
      item.addEventListener("click", () => loadTrack(i, true));
      list.appendChild(item);
    });
  }

  function loadTrack(i, autoplay) {
    index = i;
    const t = tracks[index];
    audio.src = t.audio_url;
    art.innerHTML = t.cover_url ? `<img src="${t.cover_url}" alt="cover ${t.title}">` : "";
    titleEl.textContent = t.title;
    artistEl.textContent = t.artist;
    reasonEl.classList.remove("in");
    setTimeout(() => {
      reasonEl.textContent = t.reason || "";
      reasonEl.classList.add("in");
    }, 180);
    renderList();
    if (autoplay) {
      audio.play().catch(() => {});
    }
  }

  function updatePlayUI(playing) {
    playIcon.innerHTML = playing ? PAUSE : PLAY;
    art.classList.toggle("is-playing", playing);
  }

  playBtn.addEventListener("click", () => {
    if (!audio.src) loadTrack(0, false);
    if (audio.paused) { audio.play().catch(() => {}); }
    else { audio.pause(); }
  });

  audio.addEventListener("play", () => updatePlayUI(true));
  audio.addEventListener("pause", () => updatePlayUI(false));
  audio.addEventListener("ended", () => loadTrack((index + 1) % tracks.length, true));

  document.getElementById("npNext").addEventListener("click", () => loadTrack((index + 1) % tracks.length, true));
  document.getElementById("npPrev").addEventListener("click", () => loadTrack((index - 1 + tracks.length) % tracks.length, true));

  audio.addEventListener("loadedmetadata", () => { durationEl.textContent = fmt(audio.duration); });
  audio.addEventListener("timeupdate", () => {
    currentEl.textContent = fmt(audio.currentTime);
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    fill.style.width = `${pct}%`;
  });
  bar.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  async function loadData() {
    if (sb) {
      const { data, error } = await sb.from("tracks").select("*").order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) tracks = data;
    }
    loadTrack(0, false);
    if (window.loveEffects) window.loveEffects.doneLoading();
  }
  loadData();
})();
