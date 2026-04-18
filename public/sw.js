const CACHE_NAME = "tripflow-pwa-beta-v11";
const PRE_CACHE = [
  "/",
  "/feed",
  "/index.html",
  "/offline.html",
  "/styles.css",
  "/app.js",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-192-maskable.png",
  "/icons/icon-512-maskable.png",
  "/icons/apple-touch-icon.png",
  "/assets/feeds/fallback.svg",
  "/assets/feeds/westlake.svg",
  "/assets/feeds/coast.svg",
  "/assets/feeds/erhai.svg",
  "/assets/feeds/icecity.svg",
  "/assets/feeds/beijing.svg",
  "/assets/feeds/chengdu.svg"
];

async function saveToCache(request, response) {
  if (!response || response.status !== 200 || response.type === "opaque") return response;
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, fallbackPath = "") {
  try {
    const response = await fetch(request);
    return saveToCache(request, response);
  } catch (_err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (fallbackPath) {
      const fallback = await caches.match(fallbackPath);
      if (fallback) return fallback;
    }
    return new Response("offline", { status: 503, statusText: "Service Unavailable" });
  }
}

async function cacheFirstWithRevalidate(request) {
  const cached = await caches.match(request);
  const networkPromise = fetch(request)
    .then((res) => saveToCache(request, res))
    .catch(() => null);

  if (cached) {
    return cached;
  }
  const network = await networkPromise;
  return network || new Response("", { status: 503, statusText: "Service Unavailable" });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRE_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isApi = url.pathname.startsWith("/api/");

  if (isApi) {
    event.respondWith(networkFirst(req));
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req, "/offline.html"));
    return;
  }

  event.respondWith(cacheFirstWithRevalidate(req));
});
