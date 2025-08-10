const CACHE_NAME = 'productivity-tracker-v1';
const urlsToCache = [
    './', // Caches the root URL (your apptest.html would be here)
    'apptest.html', // Caches your main HTML file
    'manifest.json', // Caches your manifest file
    'https://cdn.tailwindcss.com' // Caches the Tailwind CSS CDN
    // You might also want to cache your icon images if they are local files
    // e.g., 'images/icon-192x192.png',
    // 'images/icon-512x512.png'
];

self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching assets');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Cache addAll failed', error);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                console.log('Service Worker: Fetching from network', event.request.url);
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});