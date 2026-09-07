(function () {
  const sb = window.supabaseClient;

  // ===== OUR LITTLE THINGS =====
  const fallbackThings = [
    {
      icon: "💬",
      title: "Chat",
      back_text: "ribuan chat receh dari pagi sampai malam yang awalnya sederhana, tapi akhirnya jadi bagian dari hari-hari yang paling aku tunggu."
    },
    {
      icon: "📞",
      title: "VC",
      back_text: "video call random, ngobrol tentang apa aja, atau cuma saling menemani. Kadang nggak perlu banyak kata, cukup ada sayang di sana."
    },
    {
      icon: "☎️",
      title: "Panggilan",
      back_text: "panggilan-panggilan kecil di saat rindu datang. Jarak mungkin bikin kita nggak selalu bisa bertemu, tapi suara sayang selalu terasa dekat."
    },
    {
      icon: "📅",
      title: "Tanggal Penting",
      back_text: "15 Juni, 9 September, 13 Oktober — tanggal-tanggal yang mungkin terlihat biasa bagi orang lain, tapi punya cerita sendiri di antara kita."
    },
    {
      icon: "🎁",
      title: "Hadiah",
      back_text: "bukan tentang seberapa besar atau mahal hadiahnya, tapi tentang seseorang yang ingat, memilih, dan memberikan sesuatu dengan penuh perhatian."
    },
    {
      icon: "✨",
      title: "Momen Random",
      back_text: "hal-hal kecil yang awalnya terasa sepele, tapi entah kenapa justru berubah menjadi kenangan yang paling sering aku ingat sambil tersenyum."
    },
  ];

  const thingsGrid = document.getElementById("thingsGrid");

  function renderThings(things) {
    thingsGrid.innerHTML = "";

    things.forEach((t) => {
      const card = document.createElement("div");
      card.className = "thing-card";

      card.innerHTML = `
        <div class="thing-face thing-front">
          <span class="thing-icon">${t.icon}</span>
          <span class="thing-title">${t.title}</span>
        </div>

        <div class="thing-face thing-back">
          <p>${t.back_text}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        card.classList.toggle("is-flipped");
      });

      thingsGrid.appendChild(card);
    });
  }

  renderThings(fallbackThings);


  // ===== MOMENT COUNTDOWN =====
  const moments = [
    {
      label: "Ulang Tahun Sayang",
      date: "2026-09-09T00:00:00"
    },
    {
      label: "Anniversary Kita",
      date: "2027-06-15T00:00:00"
    },
    {
      label: "Ketemuan Berikutnya",
      date: "2026-09-20T00:00:00"
    },
  ];

  const switcher = document.getElementById("momentSwitcher");
  const mcDays = document.getElementById("mcDays");
  const mcLabel = document.querySelector(".mc-label");
  let activeMoment = 0;

  moments.forEach((m, i) => {
    const chip = document.createElement("button");

    chip.className = "moment-chip" + (i === 0 ? " is-active" : "");
    chip.textContent = m.label;

    chip.addEventListener("click", () => {
      activeMoment = i;

      document
        .querySelectorAll(".moment-chip")
        .forEach((c) => c.classList.remove("is-active"));

      chip.classList.add("is-active");
      renderMoment();
    });

    switcher.appendChild(chip);
  });

  function renderMoment() {
    const target = new Date(moments[activeMoment].date);
    const diff = Math.max(0, target - new Date());
    const days = Math.ceil(diff / 86400000);

    mcDays.textContent = String(days).padStart(2, "0");

    mcLabel.textContent =
      `hari lagi — ${moments[activeMoment].label}`;
  }

  renderMoment();
  setInterval(renderMoment, 60000);


  // ===== 19 REASONS =====
  const fallbackReasons = [
    "karena sayang selalu punya cara sendiri untuk membuat aku merasa berarti",
    "karena obrolan sederhana dengan sayang bisa mengubah hari biasa jadi lebih indah",
    "karena sayang tetap menjadi seseorang yang ingin aku cari saat ada cerita",
    "karena sayang ingat hal-hal kecil yang kadang bahkan aku sendiri lupa",
    "karena kehadiran sayang selalu terasa berarti, bahkan dari jauh",
    "karena kita bisa tertawa hanya gara-gara hal kecil yang sebenarnya nggak lucu",
    "karena sayang pernah menjadi bagian dari banyak cerita yang ingin aku simpan",
    "karena sayang tetap berusaha menemukan waktu di tengah kesibukan",
    "karena setiap pertemuan dengan sayang selalu terasa terlalu singkat",
    "karena sayang selalu punya tempat khusus di dalam cerita hidup aku",
    "karena bersama sayang, aku belajar bahwa jarak bukan berarti harus terasa jauh",
    "karena satu pesan dari sayang kadang cukup untuk membuat aku tersenyum",
    "karena sayang mengajarkan aku banyak hal tanpa selalu menyadarinya",
    "karena saat semuanya terasa ramai, ngobrol dengan sayang bisa terasa menenangkan",
    "karena ada banyak hal yang cuma terasa sama kalau diceritakan ke sayang",
    "karena sayang membuat banyak hari biasa punya alasan untuk dikenang",
    "karena sayang bukan cuma bagian dari kenangan, tapi juga bagian dari perjalanan aku",
    "karena meskipun jarak dan waktu kadang nggak mudah, cerita kita tetap punya arti",
    "karena dari sekian banyak orang yang pernah datang, aku bersyukur cerita ini mempertemukan aku dengan sayang",
  ];

  const reasonsGrid = document.getElementById("reasonsGrid");

  function renderReasons(reasons) {
    reasonsGrid.innerHTML = "";

    reasons.forEach((r, i) => {
      const item = document.createElement("div");

      item.className = "reason-item";

      item.innerHTML = `
        <span class="reason-num">
          ${String(i + 1).padStart(2, "0")}
        </span>

        <span class="reason-text">
          ${r}
        </span>
      `;

      reasonsGrid.appendChild(item);
    });
  }

  renderReasons(fallbackReasons);


  // ===== HIDDEN HEARTS =====
  const heartsLayer = document.getElementById("heartsLayer");
  const heartsFoundEl = document.getElementById("heartsFound");

  const HEART_COUNT = 5;
  let found = 0;

  function placeHearts() {
    const pageHeight = document.body.scrollHeight;

    for (let i = 0; i < HEART_COUNT; i++) {
      const heart = document.createElement("div");

      heart.className = "hidden-heart";

      heart.innerHTML = `
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          style="color:var(--gold)"
        >
          <path d="M12 21s-7.5-4.6-10-9.3C.5 8 2.6 4.5 6.2 4.5c2 0 3.6 1.1 4.6 2.6.9-1.5 2.6-2.6 4.6-2.6 3.6 0 5.7 3.5 4.2 7.2C19.5 16.4 12 21 12 21z"/>
        </svg>
      `;

      heart.style.left = `${8 + Math.random() * 84}%`;
      heart.style.top =
        `${100 + Math.random() * (pageHeight - 300)}px`;

      heart.addEventListener("click", () => {
        if (heart.classList.contains("is-found")) return;

        heart.classList.add("is-found");
        found++;

        heartsFoundEl.textContent =
          `${found} / ${HEART_COUNT} hati ditemukan`;
      });

      heartsLayer.appendChild(heart);
    }
  }

  setTimeout(placeHearts, 300);


  // ===== QUIZ =====
  const quizData = [
    {
      q: "Lewat aplikasi apa kita menemukan jalan untuk ngobrol lagi setelah sekian lama?",
      opts: ["Instagram", "Telegram", "Line"],
      correct: 1,
    },
    {
      q: "Tanggal berapa cerita kita resmi dimulai?",
      opts: ["15 Juni 2025", "9 September 2025", "13 Oktober 2025"],
      correct: 0,
    },
    {
      q: "Momen apa yang menjadi bagian dari kejutan ulang tahun sayang ke-18?",
      opts: ["Ditraktir makan", "Kejutan kecil-kecilan", "Dikasih kado mahal"],
      correct: 1,
    },
  ];

  let quizIndex = 0;
  let quizScore = 0;

  const quizProgress = document.getElementById("quizProgress");
  const quizQ = document.getElementById("quizQ");
  const quizOpts = document.getElementById("quizOpts");
  const quizResult = document.getElementById("quizResult");

  function renderQuiz() {
    if (quizIndex >= quizData.length) {
      quizProgress.style.display = "none";
      quizQ.style.display = "none";
      quizOpts.style.display = "none";

      quizResult.hidden = false;

      const perfect = quizScore === quizData.length;

      quizResult.textContent =
        `kamu benar ${quizScore} dari ${quizData.length}! ${
          perfect
            ? "ternyata kamu masih inget setiap bagian kecil dari cerita kita 🤍"
            : "nggak apa-apa, mungkin beberapa kenangan memang harus kita ceritakan lagi pelan-pelan 🤍"
        }`;

      if (perfect && window.loveEffects) {
        const rect = quizResult.getBoundingClientRect();

        window.loveEffects.launchConfetti(
          rect.left + rect.width / 2,
          rect.top + window.scrollY,
          { count: 50 }
        );
      }

      return;
    }

    const item = quizData[quizIndex];

    quizProgress.textContent =
      `pertanyaan ${quizIndex + 1} dari ${quizData.length}`;

    quizQ.textContent = item.q;
    quizOpts.innerHTML = "";

    item.opts.forEach((opt, i) => {
      const btn = document.createElement("button");

      btn.className = "quiz-opt";
      btn.textContent = opt;

      btn.addEventListener("click", () => {
        const buttons = quizOpts.querySelectorAll(".quiz-opt");

        buttons.forEach((b) => {
          b.disabled = true;
        });

        if (i === item.correct) {
          btn.classList.add("correct");
          quizScore++;
        } else {
          btn.classList.add("wrong");
          buttons[item.correct].classList.add("correct");
        }

        setTimeout(() => {
          quizIndex++;
          renderQuiz();
        }, 1100);
      });

      quizOpts.appendChild(btn);
    });
  }

  renderQuiz();


  // ===== LOVE LANGUAGE METER =====
  const loveLanguages = [
    {
      name: "Quality Time",
      pct: 90,
      desc: "paling berarti ketika kita bisa saling menemani, entah lewat VC, chat, atau sekadar hadir di waktu yang sama."
    },
    {
      name: "Words of Affirmation",
      pct: 85,
      desc: "kata-kata sederhana dari sayang selalu punya cara sendiri untuk tinggal lebih lama di pikiran aku."
    },
    {
      name: "Acts of Service",
      pct: 70,
      desc: "perhatian kecil, pertanyaan sederhana, dan usaha untuk membantu adalah cara kita menunjukkan bahwa kita peduli."
    },
    {
      name: "Physical Touch",
      pct: 55,
      desc: "karena kita punya jarak, hal-hal sederhana seperti bisa bertemu dan menghabiskan waktu bersama jadi terasa jauh lebih berharga."
    },
    {
      name: "Receiving Gifts",
      pct: 40,
      desc: "bukan tentang barangnya, tapi tentang perhatian dan cerita di balik sesuatu yang diberikan dengan tulus."
    },
  ];

  const llmList = document.getElementById("llmList");

  loveLanguages.forEach((l) => {
    const item = document.createElement("div");

    item.className = "llm-item";

    item.innerHTML = `
      <div class="llm-head">
        <span class="llm-name">${l.name}</span>
        <span class="llm-pct">${l.pct}%</span>
      </div>

      <div class="llm-track">
        <div
          class="llm-fill"
          data-pct="${l.pct}"
        ></div>
      </div>

      <p class="llm-desc">${l.desc}</p>
    `;

    llmList.appendChild(item);
  });

  const llmObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width =
            `${entry.target.dataset.pct}%`;

          llmObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  document
    .querySelectorAll(".llm-fill")
    .forEach((el) => llmObserver.observe(el));


  // ===== GROWTH TREE =====
  const treeStages = [
    {
      max: 2,
      label: "baru mulai tumbuh, seperti cerita kita yang dulu bahkan belum kita sadari",
      svg: `
        <svg viewBox="0 0 100 110">
          <rect x="46" y="80" width="8" height="26" rx="2" fill="var(--plum-deep)"/>
          <circle cx="50" cy="72" r="14" fill="var(--gold)" opacity="0.85"/>
        </svg>
      `,
    },
    {
      max: 5,
      label: "mulai punya cabang, seperti kenangan kita yang perlahan bertambah",
      svg: `
        <svg viewBox="0 0 100 110">
          <rect x="46" y="70" width="8" height="36" rx="2" fill="var(--plum-deep)"/>
          <circle cx="50" cy="62" r="20" fill="var(--gold)" opacity="0.85"/>
          <circle cx="34" cy="72" r="10" fill="var(--gold)" opacity="0.7"/>
          <circle cx="66" cy="72" r="10" fill="var(--gold)" opacity="0.7"/>
        </svg>
      `,
    },
    {
      max: 10,
      label: "makin rimbun, seperti rasa sayang yang tumbuh dari banyak hal kecil",
      svg: `
        <svg viewBox="0 0 100 110">
          <rect x="45" y="62" width="10" height="44" rx="2" fill="var(--plum-deep)"/>
          <circle cx="50" cy="50" r="26" fill="var(--gold)" opacity="0.9"/>
          <circle cx="28" cy="64" r="14" fill="var(--gold)" opacity="0.75"/>
          <circle cx="72" cy="64" r="14" fill="var(--gold)" opacity="0.75"/>
        </svg>
      `,
    },
    {
      max: Infinity,
      label: "udah rimbun banget — seperti cerita kita yang terus bertambah setiap kali kita memilih untuk tetap berjalan bersama 🤍",
      svg: `
        <svg viewBox="0 0 100 110">
          <rect x="44" y="58" width="12" height="48" rx="2" fill="var(--plum-deep)"/>
          <circle cx="50" cy="42" r="30" fill="var(--gold)"/>
          <circle cx="22" cy="60" r="16" fill="var(--gold)" opacity="0.8"/>
          <circle cx="78" cy="60" r="16" fill="var(--gold)" opacity="0.8"/>
          <circle cx="50" cy="18" r="14" fill="var(--gold)" opacity="0.9"/>
          <circle cx="38" cy="34" r="4" fill="var(--plum)"/>
          <circle cx="62" cy="30" r="4" fill="var(--plum)"/>
          <circle cx="30" cy="54" r="4" fill="var(--plum)"/>
        </svg>
      `,
    },
  ];

  const visits =
    (window.loveEffects && window.loveEffects.visitCount) || 1;

  const stage =
    treeStages.find((s) => visits <= s.max) ||
    treeStages[treeStages.length - 1];

  document.getElementById("treeSvgWrap").innerHTML = stage.svg;

  document.getElementById("treeCaption").textContent =
    `${stage.label} (kunjungan ke-${visits})`;


  // ===== AMBIL DATA THINGS & REASONS DARI SUPABASE =====
  async function loadKenanganData() {
    if (!sb) {
      if (window.loveEffects) {
        window.loveEffects.doneLoading();
      }
      return;
    }

    const [thingsRes, reasonsRes] = await Promise.all([
      sb
        .from("little_things")
        .select("*")
        .order("sort_order", { ascending: true }),

      sb
        .from("reasons")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

    if (
      !thingsRes.error &&
      thingsRes.data &&
      thingsRes.data.length > 0
    ) {
      renderThings(thingsRes.data);
    }

    if (
      !reasonsRes.error &&
      reasonsRes.data &&
      reasonsRes.data.length > 0
    ) {
      renderReasons(
        reasonsRes.data.map((r) => r.reason_text)
      );
    }

    if (window.loveEffects) {
      window.loveEffects.doneLoading();
    }
  }

  loadKenanganData();
})();