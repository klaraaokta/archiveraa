(function() {
  // Email akun admin yang kamu buat di Supabase Dashboard
  // (Authentication -> Users -> Add user). PIN di bawah dipakai
  // sebagai PASSWORD akun itu -- jadi PIN keypad ini beneran
  // login ke Supabase, bukan cuma cek angka doang seperti sebelumnya.
  // Lihat CATATAN-PERBAIKAN.txt buat cara setup akunnya.
  const ADMIN_EMAIL = "admin@untuk-frio.com";

  const gate = document.getElementById("adminGate");
  const app = document.getElementById("adminApp");
  const dotsEl = document.getElementById("adminDots");
  const keypad = document.getElementById("adminKeypad");
  const hint = document.getElementById("adminGateHint");
  let value = "";
  let submitting = false;

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
    if (submitting) return;
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
    if (value.length === 6) setTimeout(submit, 150);
  }

  async function submit() {
    if (submitting) return;
    submitting = true;
    hint.textContent = "memeriksa...";
    const sb = window.supabaseClient;
    const { error } = await sb.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: value,
    });
    submitting = false;

    if (!error) {
      gate.classList.add("is-hidden");
      app.hidden = false;
      initAdmin();
    } else {
      hint.textContent = "PIN salah, coba lagi";
      dotsEl.classList.remove("shake");
      void dotsEl.offsetWidth;
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

  // Kalau session Supabase masih aktif (misal reload halaman),
  // langsung masuk tanpa perlu ketik PIN lagi.
  window.supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session) {
      gate.classList.add("is-hidden");
      app.hidden = false;
      initAdmin();
    }
  });

  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await window.supabaseClient.auth.signOut();
      location.reload();
    });
  }

  function initAdmin() {
    const sb = window.supabaseClient;
    const main = document.getElementById("adminMain");
    const tabs = document.querySelectorAll(".admin-tab");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        renderSection(tab.dataset.section);
      });
    });

    // ===== GENERIC LIST CRUD (photos, timeline, things, reasons, mappoints, tracks) =====
    const listConfigs = {
      photos: {
        table: "photos",
        title: "Foto Galeri",
        order: "sort_order",
        fields: [
          { key: "caption", label: "Caption", type: "text" },
          { key: "image_url", label: "URL Foto (upload dulu ke Supabase Storage / hosting gambar, paste link di sini)", type: "text" },
          { key: "sort_order", label: "Urutan (angka, kecil = duluan)", type: "number" },
        ],
        itemTitle: (r) => r.caption,
        itemSub: (r) => r.image_url || "(belum ada URL foto)",
      },
      timeline: {
        table: "timeline_events",
        title: "Timeline Cerita",
        order: "sort_order",
        fields: [
          { key: "event_date", label: "Tanggal / label waktu", type: "text" },
          { key: "title", label: "Judul", type: "text" },
          { key: "description", label: "Deskripsi", type: "textarea" },
          { key: "sort_order", label: "Urutan", type: "number" },
        ],
        itemTitle: (r) => `${r.event_date} — ${r.title}`,
        itemSub: (r) => r.description,
      },
      things: {
        table: "little_things",
        title: "Our Little Things",
        order: "sort_order",
        fields: [
          { key: "icon", label: "Emoji", type: "text" },
          { key: "title", label: "Judul", type: "text" },
          { key: "back_text", label: "Teks di balik kartu", type: "textarea" },
          { key: "sort_order", label: "Urutan", type: "number" },
        ],
        itemTitle: (r) => `${r.icon} ${r.title}`,
        itemSub: (r) => r.back_text,
      },
      reasons: {
        table: "reasons",
        title: "19 Reasons",
        order: "sort_order",
        fields: [
          { key: "reason_text", label: "Isi alasan", type: "textarea" },
          { key: "sort_order", label: "Urutan", type: "number" },
        ],
        itemTitle: (r) => r.reason_text,
        itemSub: () => "",
      },
      mappoints: {
        table: "map_points",
        title: "Titik Peta Kenangan",
        order: "sort_order",
        fields: [
          { key: "event_date", label: "Tanggal", type: "text" },
          { key: "title", label: "Judul", type: "text" },
          { key: "description", label: "Cerita", type: "textarea" },
          { key: "pos_x", label: "Posisi X (0-360)", type: "number" },
          { key: "pos_y", label: "Posisi Y (0-420)", type: "number" },
          { key: "sort_order", label: "Urutan", type: "number" },
        ],
        itemTitle: (r) => `${r.event_date} — ${r.title}`,
        itemSub: (r) => r.description,
      },
      tracks: {
        table: "tracks",
        title: "Playlist Musik",
        order: "sort_order",
        fields: [
          { key: "title", label: "Judul Lagu", type: "text" },
          { key: "artist", label: "Artis", type: "text" },
          { key: "audio_url", label: "URL Audio (upload ke Supabase Storage, paste link)", type: "text" },
          { key: "cover_url", label: "URL Cover Lagu (opsional, upload ke Supabase Storage / hosting gambar)", type: "text" },
          { key: "reason", label: "Alasan lagu ini spesial", type: "textarea" },
          { key: "sort_order", label: "Urutan", type: "number" },
        ],
        itemTitle: (r) => `${r.title} — ${r.artist}`,
        itemSub: (r) => r.reason || "",
      },
    };

    async function renderListSection(key) {
      const cfg = listConfigs[ key ];
      main.innerHTML = `<h2 class="admin-section-title">${cfg.title}</h2>
        <button class="admin-add-toggle" id="addToggle">+ tambah baru</button>
        <div id="addFormWrap"></div>
        <div id="listWrap"><p class="admin-empty">memuat...</p></div>`;

      document.getElementById("addToggle").addEventListener("click", () => {
        renderForm(cfg, null);
      });

      const { data, error } = await sb.from(cfg.table).select("*").order(cfg.order, { ascending: true });
      const listWrap = document.getElementById("listWrap");
      if (error) {
        listWrap.innerHTML = `<p class="admin-empty">gagal memuat data: ${error.message}</p>`;
        return;
      }
      if (!data || data.length === 0) {
        listWrap.innerHTML = `<p class="admin-empty">belum ada data. tambah dulu lewat tombol di atas.</p>`;
        return;
      }
      listWrap.innerHTML = "";
      data.forEach((row) => {
        const card = document.createElement("div");
        card.className = "admin-card";
        card.innerHTML = `
          <div class="admin-item-row">
            <div class="admin-item-body">
              <p class="admin-item-title">${escapeHtml(cfg.itemTitle(row))}</p>
              <p class="admin-item-sub">${escapeHtml(cfg.itemSub(row))}</p>
            </div>
          </div>
          <div class="admin-btn-row">
            <button class="admin-btn admin-btn--primary" data-action="edit">edit</button>
            <button class="admin-btn admin-btn--danger" data-action="delete">hapus</button>
          </div>
        `;
        card.querySelector('[data-action="edit"]').addEventListener("click", () => renderForm(cfg, row));
        card.querySelector('[data-action="delete"]').addEventListener("click", async () => {
          if (!confirm("Yakin mau hapus ini?")) return;
          await sb.from(cfg.table).delete().eq("id", row.id);
          renderListSection(key);
        });
        listWrap.appendChild(card);
      });
    }

    function renderForm(cfg, row) {
      const wrap = document.getElementById("addFormWrap");
      const isEdit = !!row;
      const formHtml = cfg.fields.map((f) => {
        const val = row ? (row[ f.key ] ?? "") : "";
        if (f.type === "textarea") {
          return `<div class="admin-field"><label>${f.label}</label><textarea data-key="${f.key}">${escapeHtml(String(val))}</textarea></div>`;
        }
        return `<div class="admin-field"><label>${f.label}</label><input data-key="${f.key}" type="${f.type}" value="${escapeHtml(String(val))}"></div>`;
      }).join("");

      wrap.innerHTML = `
        <div class="admin-card">
          ${formHtml}
          <div class="admin-btn-row">
            <button class="admin-btn admin-btn--primary" id="saveBtn">${isEdit ? "simpan perubahan" : "tambah"}</button>
            <button class="admin-btn admin-btn--danger" id="cancelBtn">batal</button>
          </div>
          <p class="admin-status" id="formStatus">&nbsp;</p>
        </div>
      `;

      document.getElementById("cancelBtn").addEventListener("click", () => { wrap.innerHTML = ""; });
      document.getElementById("saveBtn").addEventListener("click", async () => {
        const payload = {};
        cfg.fields.forEach((f) => {
          const el = wrap.querySelector(`[data-key="${f.key}"]`);
          payload[ f.key ] = f.type === "number" ? Number(el.value || 0) : el.value;
        });
        const status = document.getElementById("formStatus");
        status.textContent = "menyimpan...";
        let result;
        if (isEdit) {
          result = await sb.from(cfg.table).update(payload).eq("id", row.id);
        } else {
          result = await sb.from(cfg.table).insert(payload);
        }
        if (result.error) {
          status.textContent = "gagal: " + result.error.message;
          return;
        }
        wrap.innerHTML = "";
        renderListSection(Object.keys(listConfigs).find((k) => listConfigs[ k ] === cfg));
      });
    }

    // ===== PROFILE (site_text key/value) =====
    async function renderProfile() {
      main.innerHTML = `<h2 class="admin-section-title">Profil</h2><div id="profileWrap"><p class="admin-empty">memuat...</p></div>`;
      const { data } = await sb.from("site_text").select("*");
      const map = {};
      (data || []).forEach((r) => { map[ r.key ] = r.value; });
      const wrap = document.getElementById("profileWrap");
      wrap.innerHTML = `
        <div class="admin-card">
          <div class="admin-field"><label>Nama lengkap</label><input id="pFullName" value="${escapeHtml(map.full_name || "")}"></div>
          <div class="admin-field"><label>Umur (angka)</label><input id="pAge" value="${escapeHtml(map.age || "")}"></div>
          <button class="admin-btn admin-btn--primary" id="pSave">simpan</button>
          <p class="admin-status" id="pStatus">&nbsp;</p>
        </div>
      `;
      document.getElementById("pSave").addEventListener("click", async () => {
        const status = document.getElementById("pStatus");
        status.textContent = "menyimpan...";
        await sb.from("site_text").upsert([
          { key: "full_name", value: document.getElementById("pFullName").value },
          { key: "age", value: document.getElementById("pAge").value },
        ]);
        status.textContent = "tersimpan ✓";
      });
    }

    // ===== LETTERS =====
    async function renderLetters() {
      main.innerHTML = `<h2 class="admin-section-title">Surat</h2><div id="lettersWrap"><p class="admin-empty">memuat...</p></div>`;
      const { data } = await sb.from("letters").select("*");
      const map = {};
      (data || []).forEach((r) => { map[ r.key ] = r; });
      const wrap = document.getElementById("lettersWrap");
      const l1 = map.surat_utama || { title: "untuk Frio,", body: "" };
      const l2 = map.surat_kedua || { title: "kalau aku jadi kamu,", body: "" };
      wrap.innerHTML = `
        <div class="admin-card">
          <p class="admin-item-title">Surat Utama</p>
          <div class="admin-field"><label>Judul</label><input id="l1Title" value="${escapeHtml(l1.title)}"></div>
          <div class="admin-field"><label>Isi (pisahkan paragraf dengan baris kosong)</label><textarea id="l1Body" style="min-height:160px">${escapeHtml(l1.body)}</textarea></div>
        </div>
        <div class="admin-card">
          <p class="admin-item-title">Kalau Aku Jadi Kamu</p>
          <div class="admin-field"><label>Judul</label><input id="l2Title" value="${escapeHtml(l2.title)}"></div>
          <div class="admin-field"><label>Isi</label><textarea id="l2Body" style="min-height:160px">${escapeHtml(l2.body)}</textarea></div>
        </div>
        <button class="admin-btn admin-btn--primary" id="lSave">simpan semua</button>
        <p class="admin-status" id="lStatus">&nbsp;</p>
      `;
      document.getElementById("lSave").addEventListener("click", async () => {
        const status = document.getElementById("lStatus");
        status.textContent = "menyimpan...";
        await sb.from("letters").upsert([
          { key: "surat_utama", title: document.getElementById("l1Title").value, body: document.getElementById("l1Body").value },
          { key: "surat_kedua", title: document.getElementById("l2Title").value, body: document.getElementById("l2Body").value },
        ]);
        status.textContent = "tersimpan ✓";
      });
    }

    // ===== GUESTBOOK & WISHES (read + delete only) =====
    async function renderReadDelete(table, titleField, subField, title) {
      main.innerHTML = `<h2 class="admin-section-title">${title}</h2><div id="rdWrap"><p class="admin-empty">memuat...</p></div>`;
      const { data, error } = await sb.from(table).select("*").order("created_at", { ascending: false });
      const wrap = document.getElementById("rdWrap");
      if (error) { wrap.innerHTML = `<p class="admin-empty">gagal memuat: ${error.message}</p>`; return; }
      if (!data || data.length === 0) { wrap.innerHTML = `<p class="admin-empty">belum ada isinya.</p>`; return; }
      wrap.innerHTML = "";
      data.forEach((row) => {
        const card = document.createElement("div");
        card.className = "admin-card";
        card.innerHTML = `
          <p class="admin-item-title">${titleField ? escapeHtml(row[ titleField ]) : ""}</p>
          <p class="admin-item-sub">${escapeHtml(row[ subField ])}</p>
          <div class="admin-btn-row"><button class="admin-btn admin-btn--danger" data-action="delete">hapus</button></div>
        `;
        card.querySelector('[data-action="delete"]').addEventListener("click", async () => {
          if (!confirm("Yakin mau hapus?")) return;
          await sb.from(table).delete().eq("id", row.id);
          renderReadDelete(table, titleField, subField, title);
        });
        wrap.appendChild(card);
      });
    }

    function escapeHtml(str) {
      const div = document.createElement("div");
      div.textContent = str == null ? "" : str;
      return div.innerHTML;
    }

    function renderSection(section) {
      if (section === "profile") return renderProfile();
      if (section === "letters") return renderLetters();
      if (section === "guestbook") return renderReadDelete("guestbook_messages", "name", "message", "Guestbook");
      if (section === "wishes") return renderReadDelete("wishes", null, "message", "Wish Jar");
      if (listConfigs[ section ]) return renderListSection(section);
    }

    renderSection("profile");
  }
})();