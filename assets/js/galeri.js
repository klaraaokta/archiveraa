(function () {
  const sb = window.supabaseClient;

  // ===== FALLBACK DATA (dipakai kalau Supabase belum ada isinya) =====
  const fallbackPhotos = [
    { caption: "awal kita menemukan jalan pulang" },
    { caption: "chat pertama yang akhirnya membawa kita sejauh ini" },
    { caption: "15 Juni — hari ketika cerita kita dimulai" },
    { caption: "obrolan yang membuat malam terasa terlalu singkat" },
    { caption: "video call random yang selalu berhasil bikin rindu" },
    { caption: "kejutan kecil untuk ulang tahun sayang" },
    { caption: "Sweet Seventeen aku, dengan sayang di dalamnya" },
    { caption: "momen kecil yang sampai sekarang masih bikin senyum" },
    { caption: "salah satu foto yang selalu ingin aku simpan" },
  ];

  const fallbackTimeline = [
    {
      event_date: "TK",
      title: "awal yang bahkan belum kita sadari",
      description: "Kita pernah saling mengenal sejak kecil, jauh sebelum tahu kalau suatu hari nanti kita akan kembali dipertemukan dan menulis cerita bersama."
    },
    {
      event_date: "sebelum Juni 2025",
      title: "kita menemukan jalan kembali",
      description: "Berawal dari sapaan sederhana di Telegram, lalu berlanjut menjadi obrolan panjang di WhatsApp. Dari yang awalnya biasa saja, perlahan berubah menjadi sesuatu yang begitu berarti."
    },
    {
      event_date: "15 Juni 2025",
      title: "hari kita",
      description: "Satu tanggal yang akhirnya menjadi bagian paling spesial dari perjalanan kita. Hari ketika perasaan yang selama ini tumbuh akhirnya berubah menjadi sebuah cerita yang kita jalani bersama."
    },
    {
      event_date: "9 September 2025",
      title: "hari lahir sayang",
      description: "Hari ketika dunia menghadirkan seseorang yang kemudian menjadi begitu berarti buat aku. Semoga setiap tahun yang sayang lewati selalu membawa lebih banyak bahagia, tenang, dan hal-hal baik."
    },
    {
      event_date: "13 Oktober 2025",
      title: "Sweet Seventeen aku",
      description: "Salah satu hari yang terasa lebih istimewa karena sayang datang dan menjadi bagian dari kenangan itu. Mungkin sederhana, tapi buat aku, kehadiran sayang adalah salah satu hal yang paling aku ingat."
    },
  ];

  let photos = fallbackPhotos;
  let timelineData = fallbackTimeline;

  const grid = document.getElementById("photoGrid");
  const wall = document.getElementById("polaroidWall");
  const timelineEl = document.getElementById("timeline");
  const lightbox = document.getElementById("lightbox");
  const lbPhoto = document.getElementById("lightboxPhoto");
  const lbCaption = document.getElementById("lightboxCaption");
  let current = 0;

  function photoInner(p) {
    if (p.image_url) {
      return `<img src="${p.image_url}" alt="${p.caption || 'foto kenangan'}" loading="lazy">`;
    }
    return "";
  }

  function renderGrid() {
    grid.innerHTML = "";

    photos.forEach((p, i) => {
      const tile = document.createElement("div");
      tile.className = "photo-tile";
      tile.style.animationDelay = `${i * 60}ms`;
      tile.dataset.index = i;
      tile.innerHTML = `${photoInner(p)}<div class="photo-tile-label">${p.caption}</div>`;

      tile.addEventListener("click", () => openLightbox(i));
      grid.appendChild(tile);
    });
  }

  function layoutWall() {
    wall.innerHTML = "";
    const w = wall.clientWidth || 320;

    photos.forEach((p, i) => {
      const el = document.createElement("div");
      el.className = "polaroid";

      const x = 14 + (i % 3) * (w / 3 - 20) + (Math.random() * 10 - 5);
      const y = 20 + Math.floor(i / 3) * 170 + (Math.random() * 14 - 7);
      const rot = (Math.random() * 10 - 5).toFixed(1);

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.transform = `rotate(${rot}deg)`;
      el.style.zIndex = i;

      el.innerHTML = `
        <div class="polaroid-img">${photoInner(p)}</div>
        <div class="polaroid-cap">${p.caption}</div>
      `;

      el.addEventListener("click", () => openLightbox(i));
      wall.appendChild(el);
    });

    const rows = Math.ceil(photos.length / 3);
    wall.style.minHeight = `${20 + rows * 170 + 60}px`;
  }

  function renderTimeline() {
    timelineEl.innerHTML = "";

    timelineData.forEach((t) => {
      const li = document.createElement("li");
      li.className = "t-item";

      li.innerHTML = `
        <span class="t-date">${t.event_date}</span>
        <h3 class="t-title">${t.title}</h3>
        <p class="t-desc">${t.description}</p>
      `;

      timelineEl.appendChild(li);
    });
  }

  function openLightbox(i) {
    current = i;
    renderLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function renderLightbox() {
    const p = photos[current];

    lbCaption.textContent = p.caption;
    lbPhoto.innerHTML = photoInner(p);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);

  document.getElementById("lightboxPrev").addEventListener("click", () => {
    current = (current - 1 + photos.length) % photos.length;
    renderLightbox();
  });

  document.getElementById("lightboxNext").addEventListener("click", () => {
    current = (current + 1) % photos.length;
    renderLightbox();
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") {
      document.getElementById("lightboxPrev").click();
    }
    if (e.key === "ArrowRight") {
      document.getElementById("lightboxNext").click();
    }
  });

  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".view-btn").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });

      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      const view = btn.dataset.view;

      grid.hidden = view !== "grid";
      wall.hidden = view !== "wall";

      if (view === "wall") layoutWall();
    });
  });

  async function loadData() {
    if (sb) {
      const [photoRes, timelineRes] = await Promise.all([
        sb
          .from("photos")
          .select("*")
          .order("sort_order", { ascending: true }),

        sb
          .from("timeline_events")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);

      if (
        !photoRes.error &&
        photoRes.data &&
        photoRes.data.length > 0
      ) {
        photos = photoRes.data;
      }

      if (
        !timelineRes.error &&
        timelineRes.data &&
        timelineRes.data.length > 0
      ) {
        timelineData = timelineRes.data;
      }
    }

    renderGrid();
    renderTimeline();

    if (window.loveEffects) {
      window.loveEffects.doneLoading();
    }
  }

  loadData();
})();