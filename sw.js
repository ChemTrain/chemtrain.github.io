/* ChemTrain service worker (built by chemtrain-src/home/build.py; version 52c031a26247).

   It keeps the home page and every app on the device, so the installed web app works without internet.
   - Pages (the home page and the apps): the network first, so an update shows as soon as the device is online; the
     saved copy when it is offline, or when the network has not answered within a few seconds. Every page that loads
     from the network is saved again.
   - The fonts: the saved copy first.
   - "save-all" (sent by the home page): download every app now, telling the page how far it got.
   Everything else on chemtrain.github.io is left to the browser. */
const VERSION = '52c031a26247';
const SHELL = 'ct-shell-' + VERSION;  // the manifest and icons of this version
const PAGES = 'ct-pages';             // the home page and the apps, kept across versions
const FONTS = 'ct-fonts';
const HOME = '/';
const APPS = ["/chemtrain-daily/chemtrain_daily.html", "/reaction-learn/reaction_learn.html", "/pka-learn/pka_learn.html", "/pg-learn/pg_learn.html", "/tmc-learn/tmc_learn.html", "/radical-learn/radical_learn.html", "/photoredox-learn/photoredox_learn.html", "/reactivity-learn/reactivity_learn.html", "/ranking/"];
const KEEP = new Set([HOME, ...APPS]);
const SHELL_FILES = ['/manifest.webmanifest', '/loader.svg', '/icons/favicon.svg', '/icons/icon-192.png',
  '/icons/icon-512.png', '/icons/maskable-512.png', '/icons/apple-touch-icon.png'];
const SLOW = 4000;  // ms to wait for the network before showing the saved copy

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    await (await caches.open(SHELL)).addAll(SHELL_FILES);
    try {
      const r = await fetch(HOME, { cache: 'no-cache' });
      if (r.ok && !r.redirected) await (await caches.open(PAGES)).put(HOME, r);
    } catch (err) { /* offline: the home page is saved on its next load */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('ct-shell-') && k !== SHELL) await caches.delete(k);
    await self.clients.claim();
  })());
});

const keyOf = url => (url.pathname === '/index.html' ? HOME : url.pathname);
const OPTS = { ignoreSearch: true, ignoreVary: true };

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    const key = keyOf(url);
    if (KEEP.has(key)) e.respondWith(page(e, key));
    else if (SHELL_FILES.includes(key)) e.respondWith(caches.match(key, OPTS).then(r => r || fetch(req)));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(font(e));
  }
});

function page(e, key) {
  let saving = Promise.resolve();
  const net = fetch(e.request).then(res => {
    if (res.ok && !res.redirected && res.type === 'basic') {
      const copy = res.clone();
      saving = caches.open(PAGES).then(c => c.put(key, copy));
    }
    return res;
  });
  e.waitUntil(net.then(() => saving).catch(() => {}));
  return (async () => {
    const saved = await caches.match(key, OPTS);
    if (!saved) return net.catch(() => offlinePage());
    return Promise.race([net.catch(() => saved), new Promise(r => setTimeout(() => r(saved), SLOW))]);
  })();
}

async function font(e) {
  const c = await caches.open(FONTS);
  const hit = await c.match(e.request);
  if (hit) return hit;
  const res = await fetch(e.request);
  if (res.ok || res.type === 'opaque') e.waitUntil(c.put(e.request, res.clone()));
  return res;
}

function offlinePage() {
  return new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Offline</title><body style="font: 16px/1.5 system-ui, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #EDF1F4; color: #15212B">
<div style="max-width: 26em; padding: 24px"><h1 style="font-size: 22px">You are offline</h1>
<p>This page has not been saved on this device yet. Go back to <a href="/">ChemTrain</a>: the apps saved for offline use still work.</p></div>`,
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

async function tell(msg) {
  for (const c of await self.clients.matchAll({ includeUncontrolled: true, type: 'window' })) c.postMessage(msg);
}

let savingAll = null;
async function saveAll() {
  const cache = await caches.open(PAGES);
  const todo = [HOME, ...APPS];
  let done = 0, saved = 0;
  await tell({ type: 'saving', done, saved, total: todo.length });
  // three at a time; ChemTrain Daily (10 MB) is the slowest
  const next = async () => {
    while (todo.length) {
      const url = todo.shift();
      try {
        const r = await fetch(url, { cache: 'no-cache' });
        if (r.ok && !r.redirected) { await cache.put(url, r); saved++; }
      } catch (err) { /* offline or failed: counted as not saved */ }
      done++;
      await tell({ type: 'saving', done, saved, total: APPS.length + 1 });
    }
  };
  await Promise.all([next(), next(), next()]);
  await tell({ type: 'saved', saved, total: APPS.length + 1, at: Date.now() });
}

self.addEventListener('message', e => {
  if (e.data === 'save-all') {
    if (!savingAll) savingAll = saveAll().finally(() => { savingAll = null; });
    e.waitUntil(savingAll);
  }
});
