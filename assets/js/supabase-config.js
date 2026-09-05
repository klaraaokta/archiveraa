// ===========================================================
// SUPABASE CONFIG
// ===========================================================
window.SUPABASE_URL = "https://jryvrvkgzgvkbzjefcrk.supabase.co/rest/v1/";
window.SUPABASE_ANON_KEY = "sb_publishable_PE4dyaT6V4NN7rM1gz6fhA_IxzJhmOr";

window.supabaseClient = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);
