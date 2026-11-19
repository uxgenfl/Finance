/* Geser kiri/kanan untuk pindah halaman di layar sentuh. */

let sw = null,
  busy = false;
const nb = (d) => {
  const j = TABS.findIndex((x) => x[0] == tab) + d;
  return j >= 0 && j < TABS.length && TABS[j][0] != "set" ? TABS[j][0] : null;
};
document.addEventListener(
  "touchstart",
  (e) => {
    if (
      F ||
      SEL ||
      DG ||
      busy ||
      e.touches.length > 1 ||
      e.target.closest("nav,input,select,textarea,#qa,#mo,#dg,#dp,#sp,#sb,#ts,#dw,#pp")
    ) {
      sw = null;
      return;
    }
    const t = e.touches[0];
    sw = {
      x: t.clientX,
      y: t.clientY,
      t: Date.now(),
      h: null,
      row: !!e.target.closest('#txl .r[data-k="tx"]'),
    };
  },
  { passive: true },
);
document.addEventListener(
  "touchmove",
  (e) => {
    if (!sw || busy) return;
    const t = e.touches[0],
      dx = t.clientX - sw.x,
      dy = t.clientY - sw.y;
    if (sw.h === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      sw.h = Math.abs(dx) > Math.abs(dy) * 1.2;
      if (!sw.h) {
        sw = null;
        return;
      }
    }
    place(0, dx * (nb(dx < 0 ? 1 : -1) ? 1 : 0.25));
  },
  { passive: true },
);
const fin = (e) => {
  if (!sw || sw.h !== true) {
    sw = null;
    return;
  }
  const dx = e.changedTouches[0].clientX - sw.x,
    v = Math.abs(dx) / Math.max(1, Date.now() - sw.t),
    to = nb(dx < 0 ? 1 : -1),
    ok = to && (Math.abs(dx) > innerWidth * 0.22 || (v > 0.5 && Math.abs(dx) > 30));
  sw = null;
  busy = true;
  setTimeout(() => {
    busy = false;
  }, 330);
  if (ok) go(to);
  else {
    moveInd();
    place(1);
  }
};
document.addEventListener("touchend", fin, { passive: true });
document.addEventListener("touchcancel", fin, { passive: true });
