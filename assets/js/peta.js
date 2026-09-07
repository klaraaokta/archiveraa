(function () {
  const sb = window.supabaseClient;

  // ===== FALLBACK DATA =====
  const fallbackPoints = [
    {
      pos_x: 40,
      pos_y: 380,
      event_date: "sebelum Juni 2025",
      title: "titik awal",
      description: "Dari sebuah chat random, tanpa pernah menyangka kalau percakapan sederhana itu perlahan bakal membawa kita kembali satu sama lain."
    },
    {
      pos_x: 100,
      pos_y: 270,
      event_date: "Juni 2025",
      title: "mulai dekat",
      description: "Hari-hari mulai dipenuhi obrolan kecil, perhatian sederhana, dan rasa nyaman yang tumbuh pelan-pelan. Sampai akhirnya, tanpa sadar, sayang mulai jadi seseorang yang selalu aku tunggu."
    },
    {
      pos_x: 180,
      pos_y: 190,
      event_date: "15 Juni 2025",
      title: "hari kita",
      description: "Hari ketika perasaan yang awalnya cuma tersimpan di antara obrolan akhirnya punya nama. Sejak hari ini, ada satu tanggal yang selalu punya tempat spesial di hati aku: awal dari cerita kita."
    },
    {
      pos_x: 240,
      pos_y: 110,
      event_date: "9 September 2025",
      title: "ulang tahun sayang",
      description: "Hari lahir seseorang yang sekarang punya tempat begitu besar di hidup aku. Aku mungkin nggak bisa memberikan dunia, tapi aku selalu berharap setiap langkah sayang dipenuhi hal-hal baik dan kebahagiaan."
    },
    {
      pos_x: 280,
      pos_y: 30,
      event_date: "13 Oktober 2025",
      title: "Sweet Seventeen aku",
      description: "Salah satu hari yang nggak akan gampang aku lupain. Kehadiran sayang di hari itu membuat ulang tahunku terasa jauh lebih berarti, karena ada seseorang yang aku sayang ikut menjadi bagian dari kenangan itu."
    },
  ];

  const pinsLayer = document.getElementById("mapPins");
  const popup = document.getElementById("mapPopup");
  const popupDate = document.getElementById("popupDate");
  const popupTitle = document.getElementById("popupTitle");
  const popupDesc = document.getElementById("popupDesc");

  function renderPins(points) {
    pinsLayer.innerHTML = "";
    points.forEach((p, i) => {
      const pin = document.createElement("div");
      pin.className = "map-pin";
      pin.style.left = `${(p.pos_x / 360) * 100}%`;
      pin.style.top = `${(p.pos_y / 420) * 100}%`;
      pin.style.animationDelay = `${i * 120}ms`;
      pin.innerHTML = `<span class="map-pin-num">${i + 1}</span>`;
      pin.addEventListener("click", () => openPopup(p));
      pinsLayer.appendChild(pin);
    });
  }

  function openPopup(p) {
    popupDate.textContent = p.event_date;
    popupTitle.textContent = p.title;
    popupDesc.textContent = p.description;
    popup.hidden = false;
  }

  document.getElementById("mapPopupClose").addEventListener("click", () => {
    popup.hidden = true;
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) popup.hidden = true;
  });

  async function loadData() {
    let points = fallbackPoints;

    if (sb) {
      const { data, error } = await sb
        .from("map_points")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) points = data;
    }

    renderPins(points);

    if (window.loveEffects) window.loveEffects.doneLoading();
  }

  loadData();
})();