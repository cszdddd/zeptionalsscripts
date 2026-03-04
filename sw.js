// Basic Service Worker to enable PWA installation
self.addEventListener('install', (event) => {
    console.log('SW Installed');
});

self.addEventListener('fetch', (event) => {
    // Required to meet installability criteria
    event.respondWith(fetch(event.request));
});
