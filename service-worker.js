const CACHE='project-athlete-core-v19';
const ASSETS=['./','./index.html','./styles.css?v=11','./home.css?v=16','./home-anatomy.css?v=23','./app.js?v=8','./program-60.js?v=12','./assets/push-art.js?v=19','./assets/pull-art.js?v=19','./assets/legs-art.js?v=21','./assets/upper-chest-art.js?v=21','./assets/stat-calendar.webp?v=23','./assets/stat-progress.webp?v=23','./home-icons.js?v=23','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)))});
