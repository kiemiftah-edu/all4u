// --- VERSIONING SYSTEM ---
// Tukar nombor versi ini (v1.7 -> v1.8) setiap kali anda update code di hosting.
const VERSION = 'flip2html-v2'; 
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './img/flip2html.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(ASSETS))
  );
  // Paksa Service Worker baru mengambil alih serta-merta
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== VERSION).map(key => caches.delete(key))
      );
    })
  );
  // Beritahu client (index.html) bahawa SW sudah aktif
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});