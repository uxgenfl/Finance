/* Pembaruan aplikasi: mendaftarkan service worker, mengecek versi baru saat aplikasi dibuka atau
   kembali ke layar, lalu memuat ulang. Data tidak hilang karena selalu tersimpan di localStorage. */

(() => {
  if (!("serviceWorker" in navigator)) return;

  const CHECK_EVERY = 30 * 60 * 1000;
  /* Pemasangan pertama juga memicu "controllerchange" satu kali, tapi itu bukan pembaruan */
  let controlled = !!navigator.serviceWorker.controller;
  let reloading = false;

  /* Sedang mengisi sesuatu: jangan muat ulang tiba-tiba */
  const isBusy = () => !!(F || DG || SEL || DP || document.body.classList.contains("kb"));

  function reloadNow() {
    reloading = true;
    location.reload();
  }

  function onNewVersion() {
    if (reloading) return;
    if (isBusy()) toast("Versi baru tersedia", "Muat ulang", reloadNow, 12000);
    else reloadNow();
  }

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!controlled) controlled = true;
    else onNewVersion();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js", { updateViaCache: "none" })
      .then((registration) => {
        const check = () => registration.update().catch(() => {});
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") check();
        });
        setInterval(check, CHECK_EVERY);
      })
      .catch(() => {});
  });
})();
