self.addEventListener('fetch', (event) => {
    // Basic fetch handler to meet PWA requirements
    event.respondWith(fetch(event.request));
});
