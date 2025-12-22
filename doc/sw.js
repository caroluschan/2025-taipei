// Service Worker for Taipei Christmas Travel Guide 2025
// Version 1.1.0
// Implements caching strategy for offline support and performance

const CACHE_NAME = 'taipei-travel-v1.1.0';
const RUNTIME_CACHE = 'taipei-runtime-v1.1.0';

// Resources to cache immediately
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/responsive.css',
    '/css/print.css',
    '/js/main.js',
    '/js/map.js',
    '/js/calculator.js',
    '/js/lightbox.js',
    '/js/print.js',
    '/js/pwa-install.js',
    '/data/itinerary.json',
    '/manifest.json',
    '/images/icons/icon-192.svg',
    '/images/icons/icon-512.svg'
];

// External resources (CDN)
const EXTERNAL_RESOURCES = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://unpkg.com/leaflet@1.9.4',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.1'
];

// Install event - cache core resources
self.addEventListener('install', event => {
    console.log('[ServiceWorker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[ServiceWorker] Skip waiting');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('[ServiceWorker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[ServiceWorker] Claiming clients');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome extensions and other non-http(s) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Different strategies for different resources
    if (isStaticAsset(url)) {
        // Cache-first strategy for static assets
        event.respondWith(cacheFirst(request));
    } else if (isExternalResource(url)) {
        // Stale-while-revalidate for external resources
        event.respondWith(staleWhileRevalidate(request));
    } else {
        // Network-first for dynamic content
        event.respondWith(networkFirst(request));
    }
});

// Helper: Check if URL is a static asset
function isStaticAsset(url) {
    return url.pathname.match(/\.(css|js|jpg|jpeg|png|gif|svg|woff|woff2|ttf|eot|ico|json)$/);
}

// Helper: Check if URL is an external resource
function isExternalResource(url) {
    return EXTERNAL_RESOURCES.some(resource => url.href.startsWith(resource));
}

// Strategy 1: Cache-first (best for static assets)
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
        console.log('[ServiceWorker] Cache hit:', request.url);
        return cached;
    }
    
    try {
        const response = await fetch(request);
        
        // Cache successful responses
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.error('[ServiceWorker] Fetch failed:', error);
        throw error;
    }
}

// Strategy 2: Network-first (best for dynamic content)
async function networkFirst(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    
    try {
        const response = await fetch(request);
        
        // Cache successful responses
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.log('[ServiceWorker] Network failed, trying cache:', request.url);
        const cached = await cache.match(request);
        
        if (cached) {
            return cached;
        }
        
        throw error;
    }
}

// Strategy 3: Stale-while-revalidate (best for external resources)
async function staleWhileRevalidate(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    
    // Fetch in background to update cache
    const fetchPromise = fetch(request).then(response => {
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(err => {
        console.error('[ServiceWorker] Background fetch failed:', err);
    });
    
    // Return cached version immediately, or wait for fetch
    return cached || fetchPromise;
}

// Handle messages from clients
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        const urls = event.data.urls || [];
        event.waitUntil(
            caches.open(RUNTIME_CACHE).then(cache => {
                return cache.addAll(urls);
            })
        );
    }
});

// Periodic cache cleanup (remove old entries)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.open(RUNTIME_CACHE).then(cache => {
            return cache.keys().then(requests => {
                const now = Date.now();
                const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
                
                return Promise.all(
                    requests.map(request => {
                        return cache.match(request).then(response => {
                            if (!response) return;
                            
                            const cachedTime = new Date(response.headers.get('date')).getTime();
                            if (now - cachedTime > maxAge) {
                                console.log('[ServiceWorker] Removing old cache entry:', request.url);
                                return cache.delete(request);
                            }
                        });
                    })
                );
            });
        })
    );
});

console.log('[ServiceWorker] Loaded successfully');
