/* Service worker: mode offline dan pembaruan otomatis.

   Cara kerja:
   - File diambil dari jaringan lebih dulu dan selalu divalidasi ulang ke server,
     jadi versi baru di GitHub Pages langsung terpakai saat ada internet.
   - Tanpa internet, aplikasi memakai salinan terakhir dari cache.

   Setiap kali mengubah file aplikasi, naikkan VERSION di bawah (misalnya finance-v14 jadi finance-v15)
   supaya aplikasi yang sudah terpasang mengunduh ulang semua file dan memperbarui dirinya. */
const VERSION = 'finance-v14';

const FILES = [
  './',
  'index.html',
  'css/base.css',
  'css/drawer.css',
  'css/settings.css',
  'css/components.css',
  'css/controls.css',
  'css/layers.css',
  'css/lists.css',
  'css/touch-nav.css',
  'css/responsive-defaults.css',
  'css/date-picker.css',
  'css/targets.css',
  'css/desktop.css',
  'js/theme-init.js',
  'js/utils.js',
  'js/data.js',
  'js/view-parts.js',
  'js/views.js',
  'js/pager.js',
  'js/forms.js',
  'js/date-picker.js',
  'js/layers.js',
  'js/selection.js',
  'js/swipe-rows.js',
  'js/keyboard.js',
  'js/drawer-settings.js',
  'js/toast-swipe.js',
  'js/backup-theme.js',
  'js/tab-swipe.js',
  'js/form-keyboard.js',
  'js/reorder.js',
  'js/i18n-data.js',
  'js/i18n.js',
  'js/dropdown.js',
  'js/updates.js',
  'js/main.js',
  'manifest.json',
  'fonts/geist-400.woff2',
  'fonts/geist-500.woff2',
  'fonts/geist-600.woff2',
  'fonts/geist-mono-400.woff2',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      /* cache: 'reload' melewati cache HTTP browser agar yang tersimpan benar-benar versi terbaru */
      .then((cache) => cache.addAll(FILES.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== VERSION).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .then((response) => {
        const sameOrigin = new URL(event.request.url).origin === location.origin;
        if (response && response.ok && sameOrigin) {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('index.html'))),
  );
});
