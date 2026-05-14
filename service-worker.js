const CACHE_NAME = "recall-loop-v21";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./pages/library.html",
  "./pages/builder.html",
  "./pages/ai-builder.html",
  "./pages/transfer.html",
  "./css/styles.css",
  "./js/shared.js",
  "./js/app.js",
  "./js/library.js",
  "./js/builder.js",
  "./js/ai-builder.js",
  "./js/transfer.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./sample-decks/sample-deck.txt",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        const responseCopy = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseCopy);
        });

        return networkResponse;
      });
    }),
  );
});
