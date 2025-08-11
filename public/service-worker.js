// Basic service worker to prevent 404 errors
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Handle requests with error handling
  event.respondWith(
    fetch(event.request)
      .catch((error) => {
        console.log('Fetch failed for:', event.request.url, error);
        // Return a basic response or let the browser handle it naturally
        return new Response('Network error', { 
          status: 408, 
          statusText: 'Network error' 
        });
      })
  );
});