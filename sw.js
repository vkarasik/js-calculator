const staticCacheName = 's-app-v2';
const assetUrls = [
  'https://vkarasik.github.io/js-calculator/',
  'https://vkarasik.github.io/js-calculator/js/script.js',
  'https://vkarasik.github.io/js-calculator/css/style.css',
  'https://vkarasik.github.io/js-calculator/icons/favicon.ico'
];

// Listen Install
self.addEventListener('install', async (event) => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(assetUrls);
});

// Listen Activate
self.addEventListener('activate', async (event) => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name !== staticCacheName)
      .map((name) => caches.delete(name))
  );
});

// Listen Fetch
self.addEventListener('fetch', (event) => {
  console.log(event);
  event.respondWith(cacheFirst(event.request));
});

// Cache Files
async function cacheFirst(request) {
  const cached = await caches.match(request);
  console.log(cached);
  return cached;
}
