const CACHE_NAME = 'registre-v2';

const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './assets/css/variables.css',
    './assets/css/main.css',
    './assets/css/components.css',
    './assets/css/layout.css',
    './assets/css/pages.css',
    './assets/css/dark.css',
    './assets/css/responsive.css',
    './assets/css/print.css',
    './assets/css/landing.css',
    './assets/js/db.js',
    './assets/js/i18n.js',
    './assets/js/utils/helpers.js',
    './assets/js/utils/dates.js',
    './assets/js/ui.js',
    './assets/js/services/attendance-service.js',
    './assets/js/services/export-service.js',
    './assets/js/services/notification-service.js',
    './assets/js/pages/dashboard.js',
    './assets/js/pages/classes.js',
    './assets/js/pages/students.js',
    './assets/js/pages/attendance.js',
    './assets/js/pages/register.js',
    './assets/js/pages/statistics.js',
    './assets/js/pages/settings.js',
    './assets/js/pages/profile.js',
    './assets/js/app.js',
    './assets/js/landing.js',
    './assets/images/teacher-landing.svg',
    './assets/images/teacher-illustration.svg',
    './assets/images/students-illustration.svg',
    './assets/images/attendance-illustration.svg',
    './assets/images/books-illustration.svg',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js',
    'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js',
    'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;

    if (request.method !== 'GET') return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match('./index.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) return cached;

            return fetch(request).then(response => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                }
                return response;
            }).catch(() => {
                if (request.destination === 'image') {
                    return new Response(
                        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="#e0e0e0" width="100" height="100"/><text fill="#9e9e9e" x="50" y="55" text-anchor="middle" font-size="14">Offline</text></svg>',
                        { headers: { 'Content-Type': 'image/svg+xml' } }
                    );
                }
                return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
            });
        })
    );
});
