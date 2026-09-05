(function () {
  const envelope = document.getElementById("envelope");
  const envelopeScene = document.getElementById("envelopeScene");
  const letterScene = document.getElementById("letterScene");
  const closeBtn = document.getElementById("closeLetter");
  const sfx = document.getElementById("sfxOpen");
  const sb = window.supabaseClient;

  // ===== AMBIL ISI SURAT DARI SUPABASE (kalau ada) =====
  async function loadLetters() {
    if (!sb) { if (window.loveEffects) window.loveEffects.doneLoading(); return; }
    const { data, error } = await sb.from("letters").select("*").in("key", ["surat_utama", "surat_kedua"]);
    if (error || !data) { if (window.loveEffects) window.loveEffects.doneLoading(); return; }
    data.forEach((row) => {
      const bodyHtml = row.body.split(/\n\s*\n/).map((p) => `<p>${p.trim()}</p>`).join("");
      if (row.key === "surat_utama") {
        document.getElementById("letterTitle1").textContent = row.title;
        document.getElementById("letterBody1").innerHTML = bodyHtml;
      } else if (row.key === "surat_kedua") {
        document.getElementById("letterTitle2").textContent = row.title;
        document.getElementById("letterBody2").innerHTML = bodyHtml;
      }
    });
    if (window.loveEffects) window.loveEffects.doneLoading();
  }
  loadLetters();

  function openEnvelope() {
    envelope.classList.add("is-open");
    if (sfx) { sfx.currentTime = 0; sfx.play().catch(() => {}); }

    setTimeout(() => {
      envelopeScene.hidden = true;
      letterScene.hidden = false;
    }, 650);
  }

  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });

  closeBtn.addEventListener("click", () => {
    letterScene.hidden = true;
    envelopeScene.hidden = false;
    envelope.classList.remove("is-open");
  });

  // ===== SURAT KEDUA: "kalau aku jadi kamu" =====
  const toggleLetter2 = document.getElementById("toggleLetter2");
  const letterTwo = document.getElementById("letterTwo");
  toggleLetter2.addEventListener("click", () => {
    const open = letterTwo.classList.toggle("is-open");
    toggleLetter2.textContent = open
      ? 'tutup "kalau aku jadi kamu" ↑'
      : 'baca satu lagi: "kalau aku jadi kamu" ↓';
    if (open) {
      setTimeout(() => {
        letterTwo.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 200);
    }
  });
})();
