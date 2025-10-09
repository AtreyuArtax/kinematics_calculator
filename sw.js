const VERSION = '2025-10-09-2';
const CACHE_NAME = `kinematics-cache-${VERSION}`;
const OFFLINE_URL = 'offline.html';
// Core assets to precache; keep small to avoid OneDrive limits
const CORE_ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'offline.html',
  'icons/icon-192.svg',
  'icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Strategy: Network-first for same-origin navigations (HTML); cache-first for other GETs.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Treat as HTML navigation if request mode is navigate OR Accept header includes text/html
  const isHTML = req.mode === 'navigate' || ((req.headers.get('accept') || '').includes('text/html'));
  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Cache only successful responses
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached || caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  if (req.method === 'GET') {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
