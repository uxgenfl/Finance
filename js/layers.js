/* Lapisan di atas halaman: sheet, dialog, toast, urungkan (undo), dan fokus. */

const vib = (p) => {
    if (S.vb === 0) return;
    try {
      navigator.vibrate && navigator.vibrate(p);
    } catch (_) {}
  },
  raf2 = (f) => requestAnimationFrame(() => requestAnimationFrame(f));
function syncInert() {
  const p = $("#dp").classList.contains("show") || $("#sp").classList.contains("show"),
    m = ["#mo", "#dg", "#pp", "#dp", "#sp"].some((s) => $(s).classList.contains("show")),
    d = $("#dw").classList.contains("show");
  ["header", "#pg", "#sb"].forEach((s) => {
    const x = $(s);
    if (x) x.inert = m || d;
  });
  $("#dw").inert = m;
  $("#mo").inert = p;
  $("#pp").inert = p;
}
function openLayer(el) {
  const was = el.classList.contains("on");
  if (!was) {
    el._ret = document.activeElement;
    el.classList.add("on");
    void el.offsetWidth;
  }
  el.classList.add("show");
  syncInert();
  if (!was)
    raf2(() => {
      const t = el.querySelector("[autofocus]") || el.querySelector('[tabindex="-1"]');
      if (t) t.focus({ preventScroll: true });
    });
}
function closeLayer(el) {
  if (!el.classList.contains("show")) return;
  el.classList.remove("show");
  syncInert();
  const r = el._ret;
  el._ret = null;
  if (r && r.isConnected && r.focus) r.focus({ preventScroll: true });
  setTimeout(
    () => {
      if (!el.classList.contains("show")) {
        el.classList.remove("on");
        el.innerHTML = "";
      }
    },
    RM ? 0 : 280,
  );
}
function sheet(title, body, acts) {
  $("#mo").innerHTML =
    `<div class="sh" role="dialog" aria-modal="true" aria-labelledby="fh" tabindex="-1"><h3 id="fh">${title}</h3>${body}<div class="act">${acts}</div></div>`;
  openLayer($("#mo"));
}
let DG = null;
function dlg(msg, btns) {
  DG = btns;
  $("#dg").innerHTML =
    `<div class="dc" role="alertdialog" aria-modal="true" aria-describedby="dgm" tabindex="-1"><p id="dgm">${msg}</p><div class="act">${btns.map((b, i) => `<button type="button" class="b ${b[1] || ""}" onclick="dgc(${i})">${b[0]}</button>`).join("")}</div></div>`;
  openLayer($("#dg"));
}
function dgc(i) {
  const f = DG && DG[i][2];
  DG = null;
  closeLayer($("#dg"));
  if (f) f();
}
const al = (m) => dlg(m, [["OK", "p"]]),
  cf = (m, fn, l) => dlg(m, [["Batal"], [l || "Hapus", "s", fn]]);
function toast(m, act, fn, ms) {
  const t = $("#ts");
  t.classList.toggle("top", !!NFT);
  clearTimeout(tst);
  t.style.transition = t.style.transform = t.style.opacity = "";
  t.innerHTML = `<span>${m}</span>${act ? `<button type="button" class="ta">${act}</button>` : ""}`;
  if (act)
    t.querySelector(".ta").onclick = () => {
      hideToast();
      if (fn) fn();
    };
  t.classList.add("on");
  tst = setTimeout(hideToast, ms || 4000);
}
function hideToast() {
  clearTimeout(tst);
  $("#ts").classList.remove("on");
}
const snap = () => {
  UNDO = JSON.stringify(S);
};
function undoDo() {
  if (!UNDO) return;
  S = JSON.parse(UNDO);
  UNDO = null;
  save();
  applyTheme();
  render();
  vib(10);
}
const delToast = (n) =>
  toast(n > 1 ? `${n} item dihapus` : "Item dihapus", "Urungkan", undoDo, 6000);
function animRemove(k, ids, fn) {
  const els = [...document.querySelectorAll(`#p_${KP[k]} [data-k="${k}"]`)].filter((e) =>
    ids.has(e.dataset.id),
  );
  if (!els.length || RM) {
    fn();
    return;
  }
  els.forEach((e) => {
    e.style.maxHeight = e.offsetHeight + "px";
  });
  void document.body.offsetWidth;
  els.forEach((e) => e.classList.add("rm"));
  setTimeout(fn, 250);
}
