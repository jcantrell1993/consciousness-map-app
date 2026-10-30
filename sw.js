// Offline shell for the installed app. Same-origin files are network-first, so a new deploy
// shows up on the next launch and the cache is only the fallback; the rain/ocean recordings
// from jsDelivr are cached after the first fetch so later launches use no mobile data.
const CACHE = "cmap-v1";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e)=>{
    e.waitUntil(caches.open(CACHE).then((c)=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate", (e)=>{
    e.waitUntil(caches.keys().then((keys)=>Promise.all(keys.filter((k)=>k !== CACHE).map((k)=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener("fetch", (e)=>{
    const req = e.request;
    if (req.method !== "GET") return;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
        e.respondWith(fetch(req).then((res)=>{
            if (res.ok) {
                const copy = res.clone();
                caches.open(CACHE).then((c)=>c.put(req, copy));
            }
            return res;
        }).catch(()=>caches.match(req).then((r)=>r || caches.match("./index.html"))));
    } else if (url.hostname === "cdn.jsdelivr.net") {
        e.respondWith(caches.match(req).then((r)=>r || fetch(req).then((res)=>{
            if (res.ok) {
                const copy = res.clone();
                caches.open(CACHE).then((c)=>c.put(req, copy));
            }
            return res;
        })));
    }
});
