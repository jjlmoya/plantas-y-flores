// PWA Service Worker for Plantas y Flores
const CACHE_NAME = 'plantas-y-flores-v1';
const STATIC_CACHE_NAME = 'plantas-static-v1';

// Core files to cache for offline functionality
const CORE_FILES = [
  '/',
  '/manifest.json',
  '/favicon.webp',
  '/styles/adsense-optimizations.css',
  '/icons/icon-192x192.webp',
  '/icons/icon-512x512.webp'
];

// Install event - cache core resources
self.addEventListener('install', (event) => {
  console.log('🌸 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('🌸 Service Worker: Caching core files');
        return cache.addAll(CORE_FILES);
      })
      .then(() => {
        console.log('🌸 Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch(err => {
        console.log('🌸 Service Worker: Installation failed', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🌸 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('🌸 Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🌸 Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(STATIC_CACHE_NAME)
            .then(cache => cache.match('/'));
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy for static assets
  if (event.request.destination === 'image' || 
      event.request.destination === 'style' || 
      event.request.destination === 'script' ||
      event.request.url.includes('/icons/') ||
      event.request.url.includes('favicon')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          
          return fetch(event.request)
            .then(fetchResponse => {
              // Cache successful responses
              if (fetchResponse.ok) {
                const responseClone = fetchResponse.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseClone);
                  });
              }
              return fetchResponse;
            });
        })
        .catch(() => {
          console.log('🌸 Service Worker: Offline - resource not available:', event.request.url);
          // Return a simple offline response for critical resources
          if (event.request.destination === 'image') {
            return new Response('', { 
              status: 200, 
              statusText: 'OK',
              headers: {'Content-Type': 'image/svg+xml'}
            });
          }
        })
    );
    return;
  }

  // For all other requests, try network first
  event.respondWith(
    fetch(event.request)
      .catch(error => {
        console.log('🌸 Service Worker: Network error for:', event.request.url);
        return caches.match(event.request);
      })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🌸 Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any background sync tasks here
      Promise.resolve()
    );
  }
});

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
  console.log('🌸 Service Worker: Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva información sobre plantas disponible!',
    icon: '/icons/icon-192x192.webp',
    badge: '/icons/icon-72x72.webp',
    tag: 'plantas-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: '/icons/icon-96x96.webp'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('🌸 Plantas y Flores', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🌸 Service Worker: Notification click received');
  
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});