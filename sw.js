const CACHE_NAME = "fkbc-planner-ultimate-v3";
const CORE_ASSETS = [
  "./",
  "./apple-touch-icon.png",
  "./bell.wav",
  "./bleep.wav",
  "./fkbc-logo-dark.png",
  "./fkbc-logo-light.png",
  "./flat-index-DLwYCFNP.css",
  "./flat-index-DzJyFLBM.js",
  "./gracie-full.webp",
  "./gracie-portrait.webp",
  "./icon-192.png",
  "./icon-512.png",
  "./index.html",
  "./jack-full.webp",
  "./jack-portrait.webp",
  "./joe-full.webp",
  "./joe-portrait.webp",
  "./john-full.webp",
  "./john-portrait.webp",
  "./justin-full.webp",
  "./justin-portrait.webp",
  "./klaxon.wav",
  "./manifest.webmanifest",
  "./paul-full.webp",
  "./paul-portrait.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith("fkbc-planner-") && key !== CACHE_NAME).map((key) => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
    return response;
  })));
});
