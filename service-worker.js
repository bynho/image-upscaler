// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open('image-upscaler-cache').then((cache) => {
//       return cache.addAll([
//         '/',
//         '/index.html',
//         '/src/main.jsx',
//         '/src/App.jsx',
//         // Add other assets and routes you want to cache
//       ]);
//     })
//   );
// });

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });


// Example service worker code
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
});