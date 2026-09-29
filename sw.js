const PREFIX='pocket-practice:'+self.registration.scope+':';
const CACHE=PREFIX+'8c6c73c5da8f';
const ASSETS=["./", "./index.html", "./style.css", "./trainer.js", "./coach.js", "./app.js", "./pwa.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable.png", "./icons/apple-touch-icon.png"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 const key=event.request.mode==='navigate'?new URL('./index.html',self.registration.scope).href:event.request;
 event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(key);return cached||fetch(event.request);}));
});
