const CACHE_NAME = 'edugen-suite-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './img/logoedugen.png',
    // Sumber luaran (Pilihan: Boleh disimpan untuk offline jika polisi membenarkan)
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap'
];

// 1. Install Event: Cache fail-fail utama
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching app shell');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Activate Event: Bersihkan cache lama jika ada update versi
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// 3. Fetch Event: Hidangkan dari cache dahulu, kemudian network (Cache-First Strategy untuk aset statik)
// Atau Network-First untuk kandungan dinamik. Di sini kita guna strategi hibrid mudah.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Jika ada dalam cache, guna cache
            if (response) {
                return response;
            }
            // Jika tiada, ambil dari network
            return fetch(event.request).catch(() => {
                // Jika offline dan tiada dalam cache (pilihan: tunjuk halaman offline fallback jika ada)
                // Buat masa ini, biarkan browser handle error jika offline sepenuhnya dan aset tiada
            });
        })
    );
});