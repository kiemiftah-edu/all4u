const VERSION = '38';
const CACHE_NAME = `comixs-prompter-v${VERSION}`;
const APP_SHELL_URLS = [
  './',
  './index.html?v=38',
  './style.css?v=38',
  './manifest.json?v=38',
  './img/comixsprompter.png?v=38'
];

const LOCAL_SHELL_PATHS = new Set([
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  '/img/comixsprompter.png'
]);

const SHELL_FALLBACK = './index.html?v=38';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(cacheName => cacheName !== CACHE_NAME)
        .map(cacheName => caches.delete(cacheName))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (request.url.includes('/api/')) return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isLocalShellAsset = isSameOrigin && LOCAL_SHELL_PATHS.has(url.pathname);

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(request, { cache: 'no-store' });
        const cache = await caches.open(CACHE_NAME);
        cache.put(SHELL_FALLBACK, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        return (await caches.match(SHELL_FALLBACK)) || (await caches.match('./'));
      }
    })());
    return;
  }

  if (isLocalShellAsset) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const versionedUrl = `${url.pathname}?v=${VERSION}`;
      try {
        const networkResponse = await fetch(request, { cache: 'no-store' });
        if (networkResponse && networkResponse.ok) {
          cache.put(request, networkResponse.clone());
          cache.put(versionedUrl, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        return (await caches.match(request, { ignoreSearch: true }))
          || (await caches.match(versionedUrl, { ignoreSearch: true }))
          || (await caches.match(SHELL_FALLBACK));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cachedResponse = await caches.match(request, { ignoreSearch: true });
    if (cachedResponse) return cachedResponse;
    try {
      const networkResponse = await fetch(request);
      if (isSameOrigin && networkResponse && networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      return caches.match(SHELL_FALLBACK);
    }
  })());
});