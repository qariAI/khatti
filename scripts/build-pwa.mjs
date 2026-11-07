import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url),dir=new URL('dist/pwa/',root);await mkdir(new URL('icons/',dir),{recursive:true});
const client=await readFile(new URL('src/pwa-client.js',root),'utf8');let html=await readFile(new URL('dist/Harf-Writer-v5-Complete-Ayahs.html',root),'utf8');
html=html.replace('</head>','<link rel="manifest" href="./manifest.webmanifest"><link rel="icon" type="image/png" sizes="192x192" href="./icons/icon-192.png"><link rel="apple-touch-icon" href="./icons/apple-touch-icon-180.png">\n</head>').replace(/<span data-pwa-slot><\/span>/g,'<button type="button" class="textbtn" data-pwa-options>Install & offline</button>');
/* the page's real </body> is the LAST one: the embedded Loop document also contains a </body> string earlier in the file */
{const bi=html.lastIndexOf('</body>');html=html.slice(0,bi)+'<script src="./pwa.js" defer></script>\n'+html.slice(bi);}
const version='000000000000';
await writeFile(new URL('index.html',dir),html);await writeFile(new URL('pwa.js',dir),client);
await writeFile(new URL('manifest.webmanifest',dir),JSON.stringify({id:'./',name:'Khatti - Arabic Calligraphy',short_name:'Khatti',description:'Learn Arabic calligraphy the way it’s written: by hand.',start_url:'./',scope:'./',display:'standalone',background_color:'#f6edd6',theme_color:'#f6edd6',lang:'en',dir:'ltr',categories:['education'],icons:[{src:'icons/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},{src:'icons/icon-maskable-192.png',sizes:'192x192',type:'image/png',purpose:'maskable'},{src:'icons/icon-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]},null,2));
for(const n of ['icon-192','icon-512','icon-maskable-192','icon-maskable-512'])await copyFile(new URL(`assets/pwa/${n}.png`,root),new URL(`icons/${n}.png`,dir));await copyFile(new URL('assets/pwa/privacy.html',root),new URL('privacy.html',dir));
await copyFile(new URL('assets/pwa/og-image.png',root),new URL('og-image.png',dir));
await copyFile(new URL('assets/pwa/apple-touch-icon-180.png',root),new URL('icons/apple-touch-icon-180.png',dir));
await writeFile(new URL('sw.js',dir),`const FAMILY='harf-pwa-'+new URL(self.registration.scope).pathname.replace(/[^a-z0-9]/gi,'_')+'-';
const CACHE=FAMILY+'${version}';
const FILES=['./','./index.html','./pwa.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-192.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon-180.png','./privacy.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(p=>new Request(new URL(p,self.registration.scope),{cache:'reload'}))))));
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith(FAMILY)&&k!==CACHE)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||!u.href.startsWith(self.registration.scope))return;const p=u.pathname.slice(new URL(self.registration.scope).pathname.length);if(e.request.mode==='navigate'){e.respondWith(caches.open(CACHE).then(c=>c.match(new URL('./index.html',self.registration.scope))).then(r=>r||fetch(e.request)));return;}if(!['pwa.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon-180.png'].includes(p))return;e.respondWith(caches.open(CACHE).then(c=>c.match(e.request)).then(r=>r||fetch(e.request)));});
`);
await copyFile(new URL('docs/PWA-HOSTING.md',root),new URL('HOSTING.md',dir));
await copyFile(new URL('src/pwa-stamp.js',root),new URL('stamp.js',dir));
const stamped=await promisify(execFile)(process.execPath,[fileURLToPath(new URL('stamp.js',dir))]);
console.log('Built HTTPS PWA package · '+stamped.stdout.trim());
