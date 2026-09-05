// Service worker sederhana — cukup buat syarat "installable" PWA
// dan sedikit caching biar buka ulang halaman yang sama lebih cepat.
// Bukan buat mode offline penuh (banyak konten dari Supabase yang
// tetap butuh internet).
const CACHE_NAME = "untuk-frio-v1";
const CORE_ASSETS = [
  "index.html",
  "assets/css/style.css",
  "assets/js/effects.js",
  "assets/js/gate.js",
  "assets/img/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return; // biarin request ke Supabase/CDN lewat langsung

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, res.clone()));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
