const CACHE_NAME = 'wowgen-v2';
const assets = [
  'penjana_prompt.html',
  'manifest.json',
  'img/wow!gen.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});