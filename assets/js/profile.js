(function () {
  const sb = window.supabaseClient;
  if (!sb) { if (window.loveEffects) window.loveEffects.doneLoading(); return; }

  async function loadProfile() {
    const { data, error } = await sb.from("site_text").select("*").in("key", ["full_name", "age"]);
    if (error || !data) { if (window.loveEffects) window.loveEffects.doneLoading(); return; }
    const map = {};
    data.forEach((row) => { map[row.key] = row.value; });
    if (map.full_name) {
      document.getElementById("heroName").innerHTML = map.full_name.replace(" ", "<br>");
    }
    if (map.age) {
      document.getElementById("ageNumber").textContent = map.age;
    }
    if (window.loveEffects) window.loveEffects.doneLoading();
  }
  loadProfile();
})();
