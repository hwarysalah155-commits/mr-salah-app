const CACHE = 'mr-salah-v1';
const FILES = [
  '/mr-salah-app/attendance-v2.html',
  '/mr-salah-app/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // النت متاح → اجيب من النت دايماً (عشان البيانات تكون fresh)
  if (e.request.url.includes('google') || 
      e.request.url.includes('github.io') ||
      e.request.url.includes('script.google')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // باقي الملفات → من الكاش
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
