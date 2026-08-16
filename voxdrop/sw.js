const CACHE_NAME = 'voxdrop-v2';
const ASSETS = [
  './',
  './cartesia_single_file.html',
  './manifest.json',
  './img/voxdroplogo.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});