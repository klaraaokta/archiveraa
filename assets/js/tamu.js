(function () {
  // ===== LOVE COUNTER =====
  const lcHeart = document.getElementById("lcHeart");
  const lcCount = document.getElementById("lcCount");
  let count = 0;
  lcHeart.addEventListener("click", () => {
    count++;
    lcCount.textContent = count;
    lcHeart.classList.remove("is-bump");
    void lcHeart.offsetWidth;
    lcHeart.classList.add("is-bump");
  });

  // ===== MOOD =====
  const moods = [
    { emoji: "🥰", reply: "senengnya liat kamu lagi mood gini!" },
    { emoji: "😴", reply: "istirahat yang cukup ya sayang." },
    { emoji: "🥺", reply: "cerita ke aku, aku dengerin kok." },
    { emoji: "😤", reply: "tarik napas dulu, aku di sini." },
    { emoji: "😆", reply: "mood ini bikin aku ikut ketawa juga." },
  ];
  const moodRow = document.getElementById("moodRow");
  const moodReply = document.getElementById("moodReply");
  moods.forEach((m) => {
    const chip = document.createElement("button");
    chip.className = "mood-chip";
    chip.textContent = m.emoji;
    chip.addEventListener("click", () => {
      document.querySelectorAll(".mood-chip").forEach((c) => c.classList.remove("is-selected"));
      chip.classList.add("is-selected");
      moodReply.textContent = m.reply;
    });
    moodRow.appendChild(chip);
  });

  // ===== WISH JAR (Supabase) =====
  const wishForm = document.getElementById("wishForm");
  const wishInput = document.getElementById("wishInput");
  const wishJar = document.getElementById("wishJar");
  const sb = window.supabaseClient;

  function renderJar(wishes) {
    wishJar.innerHTML = "";
    if (!wishes || wishes.length === 0) {
      wishJar.innerHTML = `<p class="wish-jar-empty">toples masih kosong, jadi yang pertama isi ya 🫙</p>`;
      return;
    }
    wishes.forEach((w) => {
      const note = document.createElement("div");
      note.className = "wish-note";
      note.style.setProperty("--r", `${(Math.random() * 8 - 4).toFixed(1)}deg`);
      note.textContent = w.message;
      wishJar.appendChild(note);
    });
  }

  async function loadWishes() {
    if (!sb) { renderJar([]); if (window.loveEffects) window.loveEffects.doneLoading(); return; }
    const { data, error } = await sb.from("wishes").select("*").order("created_at", { ascending: false }).limit(60);
    if (error) { renderJar([]); if (window.loveEffects) window.loveEffects.doneLoading(); return; }
    renderJar(data);
    if (window.loveEffects) window.loveEffects.doneLoading();
  }
  loadWishes();

  wishForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const val = wishInput.value.trim();
    if (!val) return;
    wishInput.value = "";
    if (sb) {
      await sb.from("wishes").insert({ message: val });
    }
    loadWishes();
  });

  // ===== GUESTBOOK (Supabase) =====
  const gbForm = document.getElementById("gbForm");
  const gbName = document.getElementById("gbName");
  const gbMessage = document.getElementById("gbMessage");
  const gbList = document.getElementById("gbList");

  function renderList(messages) {
    gbList.innerHTML = "";
    if (!messages || messages.length === 0) {
      gbList.innerHTML = `<div class="gb-item"><p class="gb-item-name">kamu</p><p class="gb-item-msg">selamat ulang tahun Frio! semoga makin bahagia 🎉</p></div>`;
      return;
    }
    messages.forEach((m) => {
      const item = document.createElement("div");
      item.className = "gb-item";
      item.innerHTML = `<p class="gb-item-name">${m.name}</p><p class="gb-item-msg">${m.message}</p>`;
      gbList.appendChild(item);
    });
  }

  async function loadMessages() {
    if (!sb) { renderList([]); return; }
    const { data, error } = await sb.from("guestbook_messages").select("*").order("created_at", { ascending: false }).limit(60);
    if (error) { renderList([]); return; }
    renderList(data);
  }
  loadMessages();

  gbForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = gbName.value.trim() || "seseorang";
    const msg = gbMessage.value.trim();
    if (!msg) return;
    gbName.value = "";
    gbMessage.value = "";
    if (sb) {
      await sb.from("guestbook_messages").insert({ name, message: msg });
    }
    loadMessages();
  });
})();
