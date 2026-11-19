/* Navigasi antar halaman, routing hash, geser halaman, dan penggambaran ulang (render). */

function go(t, np) {
  const from = tab;
  if (t != from) {
    selOff();
    closeRow();
    hideToast();
  }
  if (
    document.activeElement &&
    document.activeElement.blur &&
    !document.body.classList.contains("kb")
  )
    document.activeElement.blur();
  tab = t;
  const a = TABS.findIndex((x) => x[0] == from),
    b = TABS.findIndex((x) => x[0] == t);
  for (let j = Math.min(a, b) - 1; j <= Math.max(a, b) + 1; j++) {
    const x = TABS[j];
    if (x && dirty.has(x[0])) rp1(x[0]);
  }
  moveInd();
  place(1);
  if (t != from) fx(t);
  route(t, t != from && !np);
}
const TABS = [
  ["dash", "Dashboard"],
  ["tx", "Transaksi"],
  ["bud", "Rencana"],
  ["goal", "Tabungan"],
  ["rep", "Laporan"],
  ["aset", "Neraca"],
  ["set", "Pengaturan"],
];
const navTo = (t) => {
  go(t);
  closeDw();
};
function moveInd(t) {
  t = t || tab;
  document.querySelectorAll("#nv .sni").forEach((x) => {
    const on = x.dataset.t == t;
    x.classList.toggle("on", on);
    if (on) x.setAttribute("aria-current", "page");
    else x.removeAttribute("aria-current");
  });
}
const OSRM = matchMedia("(prefers-reduced-motion: reduce)").matches;
let RM = OSRM || S.an === 0;
document.documentElement.classList.toggle("na", S.an === 0);
function buildPager() {
  $("#tk").innerHTML = TABS.map(
    ([k, l]) =>
      `<section class="pn" id="p_${k}" role="region" aria-label="${l}"><main><div class="c sk" aria-hidden="true"><i></i><i></i><i></i></div></main></section>`,
  ).join("");
}
let wc;
function place(a, dx) {
  document.body.classList.toggle("onset", tab == "set");
  const t = $("#tk");
  t.style.willChange = "transform";
  clearTimeout(wc);
  wc = setTimeout(() => {
    t.style.willChange = "";
  }, 500);
  const i = TABS.findIndex((x) => x[0] == tab);
  t.style.transition = a && !RM ? "transform .32s cubic-bezier(.2,.8,.2,1)" : "none";
  t.style.transform = `translateX(calc(${-i * 100}% + ${dx || 0}px))`;
  document.querySelectorAll(".pn").forEach((p) => {
    p.inert = p.id != "p_" + tab;
  });
}
const dirty = new Set(),
  shown = {};
function countUp(el, k) {
  const to = +el.dataset.v,
    from = shown[k] ?? 0;
  shown[k] = to;
  if (RM || from === to) {
    el.textContent = R(to);
    return;
  }
  const t0 = performance.now(),
    d = Math.min(900, 350 + Math.abs(to - from) / 2e4);
  el.textContent = R(from);
  (function f(t) {
    const p = Math.min(1, (t - t0) / d),
      e = 1 - Math.pow(1 - p, 3);
    el.textContent = R(from + (to - from) * e);
    if (p < 1 && el.isConnected) requestAnimationFrame(f);
  })(t0);
}
function animBars(p) {
  if (RM) return;
  const b = [...p.querySelectorAll(".pb i[data-w]")];
  if (!b.length) return;
  b.forEach((i) => {
    i.style.transition = "none";
    i.style.width = "0%";
  });
  void p.offsetWidth;
  raf2(() =>
    b.forEach((i) => {
      i.style.transition = "";
      i.style.width = i.dataset.w + "%";
    }),
  );
}
function replay(p) {
  if (RM) return;
  const l = p.querySelectorAll(".gr,.zi");
  l.forEach((e) => {
    e.style.animation = "none";
  });
  void p.offsetWidth;
  l.forEach((e) => {
    e.style.animation = "";
  });
}
function post(p, k) {
  p.querySelectorAll(".big[data-v]").forEach((el) => countUp(el, k));
  if (k == tab) animBars(p);
  if (NEWID) p.querySelectorAll(`[data-id="${NEWID}"]`).forEach((e) => e.classList.add("nw"));
  if (k == "tx" || k == "bud" || k == "aset") moveFi(0);
}
function rp1(k) {
  const p = $("#p_" + k);
  p.querySelector("main").innerHTML = V[k]();
  dirty.delete(k);
  post(p, k);
}
function fx(t) {
  const p = $("#p_" + t);
  if (!p) return;
  animBars(p);
  replay(p);
  if (!RM) {
    const m = p.querySelector("main");
    m.classList.remove("swp");
    void m.offsetWidth;
    m.classList.add("swp");
  }
}
let idl = 0;
function schedIdle() {
  if (idl || !dirty.size) return;
  idl = 1;
  (window.requestIdleCallback || ((f) => setTimeout(f, 80)))(
    () => {
      idl = 0;
      const k = [...dirty][0];
      if (k) {
        rp1(k);
        schedIdle();
      }
    },
    { timeout: 600 },
  );
}
/* Total saldo di sidebar laptop, diperbarui tiap kali tampilan digambar ulang */
function syncSideTotal() {
  const el = $("#sbal");
  if (el) el.textContent = R(total());
}
function render() {
  moveInd();
  syncSideTotal();
  openRow = null;
  TABS.forEach(([k]) => dirty.add(k));
  const i = TABS.findIndex((x) => x[0] == tab);
  [i, i - 1, i + 1].forEach((j) => {
    const x = TABS[j];
    if (x) rp1(x[0]);
  });
  selUi();
  schedIdle();
}
addEventListener("resize", () => {
  moveInd();
  moveFi(0);
});
