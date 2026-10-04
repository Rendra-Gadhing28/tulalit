// Service Worker for XII PPLG 3 Yearbook
const STATIC_CACHE = "tulalit-static-v4";
const MEDIA_CACHE = "tulalit-media-v4";
const OFFLINE_URL = "/";

const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/img/placeholder-polaroid.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  const allowedCaches = [STATIC_CACHE, MEDIA_CACHE];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!allowedCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Helper to determine if a request is for an image, icon, or media asset
function isMediaRequest(request, url) {
  if (request.destination === "image") return true;
  const pathname = url.pathname.toLowerCase();
  return (
    pathname.startsWith("/_next/image") ||
    pathname.startsWith("/img/") ||
    /\.(webp|png|jpe?g|svg|ico|gif|avif)(\?.*)?$/i.test(pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. Never intercept Next.js JavaScript chunks or Webpack HMR requests.
  // Serving stale JS chunks causes Webpack "moduleId is not a function" errors.
  if (
    url.pathname.startsWith("/_next/static/chunks/") ||
    url.pathname.startsWith("/_next/static/development/") ||
    url.pathname.startsWith("/_next/webpack-hmr") ||
    url.pathname.includes("webpack")
  ) {
    return;
  }

  // 2. Handle navigation requests (HTML pages): Network first, offline fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL) || caches.match(event.request);
      })
    );
    return;
  }

  // 3. Handle images, webp photos, and SVG icons: Cache-First strategy
  if (isMediaRequest(event.request, url)) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request)
            .then((networkResponse) => {
              if (
                networkResponse &&
                networkResponse.status === 200 &&
                (networkResponse.type === "basic" || networkResponse.type === "cors")
              ) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              return caches.match("/img/placeholder-polaroid.svg");
            });
        });
      })
    );
    return;
  }
});
