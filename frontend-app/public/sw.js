// Basic service worker for offline-first caching of shell and API fallbacks
const CACHE_NAME = 'fairmerchant-cache-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/fair_merchant_logo.png',
  '/cart_logo.png',
  '/fair_merchant_logo2.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Only handle GET
  if (request.method !== 'GET') return;

  // Network-first for Supabase API calls to keep data fresh; fall back to cache
  if (request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(request).then((response) => {
        return response;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for app shell/static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
