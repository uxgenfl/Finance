/* Geser baris Riwayat Transaksi untuk menampilkan aksi. */

let openRow = null,
  RS = null;
const SW_W = 144;
function rowTo(e, x, a) {
  e.style.transition = a && !RM ? "transform .24s cubic-bezier(.2,.8,.2,1)" : "none";
  e.style.transform = x ? `translateX(${x}px)` : "";
}
function rowRest(e) {
  setTimeout(() => {
    if (openRow !== e && e.isConnected) {
      e.classList.remove("sx");
      e.style.transition = "";
    }
  }, 290);
}
function closeRow(a = 1) {
  const e = openRow;
  if (!e) return;
  openRow = null;
  rowTo(e, 0, a);
  rowRest(e);
}
function swDel(id) {
  closeRow();
  snap();
  animRemove("tx", new Set([id]), () => {
    S.tx = S.tx.filter((x) => x.id != id);
    save();
    render();
    delToast(1);
    vib([10, 30, 10]);
  });
}
document.addEventListener("pointerdown", (e) => {
  if (openRow && !e.target.closest(".r.sx")) closeRow();
  RS = null;
  return;
  const el = e.target.closest('#txl .r[data-k="tx"]');
  if (!el || e.target.closest(".sa")) return;
  RS = {
    el,
    x: e.clientX,
    y: e.clientY,
    base: el === openRow ? -SW_W : 0,
    h: null,
    id: e.pointerId,
    dx: 0,
  };
});
document.addEventListener("pointermove", (e) => {
  const s = RS;
  if (!s || e.pointerId != s.id) return;
  const dx = e.clientX - s.x,
    dy = e.clientY - s.y;
  if (s.h === null) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    s.h = Math.abs(dx) > Math.abs(dy) * 1.2;
    if (!s.h || (!s.base && dx > 0)) {
      RS = null;
      return;
    }
    s.el.classList.add("sx");
    if (openRow && openRow !== s.el) closeRow();
  }
  s.dx = Math.max(-SW_W - 24, Math.min(0, s.base + dx));
  s.el.style.transition = "none";
  s.el.style.transform = `translateX(${s.dx}px)`;
});
function rsEnd() {
  const s = RS;
  RS = null;
  if (!s || s.h !== true) return;
  lp = 1;
  const el = s.el;
  if (s.dx < -SW_W / 2) {
    openRow = el;
    rowTo(el, -SW_W, 1);
    vib(6);
  } else {
    if (openRow === el) openRow = null;
    rowTo(el, 0, 1);
    rowRest(el);
  }
}
["pointerup", "pointercancel"].forEach((t) => document.addEventListener(t, rsEnd));
