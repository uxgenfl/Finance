/* Titik awal: menyiapkan tampilan pertama dan menyesuaikan sidebar laptop. */

const DK = matchMedia("(min-width:1024px)");
function syncDock() {
  const d = $("#dw"),
    a = d.querySelector(".pn2");
  if (DK.matches) {
    if (d.classList.contains("show")) {
      d.classList.remove("show", "on");
      syncInert();
    }
    a.removeAttribute("role");
    a.removeAttribute("aria-modal");
  } else {
    a.setAttribute("role", "dialog");
    a.setAttribute("aria-modal", "true");
  }
}
DK.addEventListener("change", syncDock);
addEventListener("popstate", () => {
  const t = hashTab();
  if (t && t != tab) go(t, 1);
});
document.documentElement.lang = S.lang === "en" ? "en" : "id";
buildPager();
syncDock();
applyTheme(0);
render();
place(0);
route(tab, 0);
tAll(document.body);

(function () {
  const H = document.querySelector("header"),
    P = document.getElementById("pg");
  if (!H || !P) return;
  function hh() {
    const v = H.offsetHeight;
    if (v) document.documentElement.style.setProperty("--hh", v + "px");
    return v;
  }
  function vis() {
    const w = P.clientWidth;
    return [...P.querySelectorAll(".pn")].find(
      (p) => Math.abs(p.getBoundingClientRect().left - P.getBoundingClientRect().left) < w / 2,
    );
  }
  function sync() {
    const p = vis(),
      y = p ? Math.max(0, Math.min(p.scrollTop, H.offsetHeight)) : 0;
    H.style.transform = y ? "translateY(" + -y + "px)" : "";
  }
  P.addEventListener(
    "scroll",
    (e) => {
      if (e.target.classList && e.target.classList.contains("pn")) sync();
    },
    true,
  );
  P.addEventListener("transitionend", sync, true);
  addEventListener("resize", () => {
    hh();
    sync();
  });
  const og = window.go;
  if (typeof og === "function")
    window.go = function (t, np) {
      const from = tab,
        r = og.apply(this, arguments);
      if (t != from) {
        const p = document.getElementById("p_" + t);
        if (p) p.scrollTop = 0;
        sync();
      }
      return r;
    };
  hh();
  sync();
  setTimeout(() => {
    hh();
    sync();
  }, 300);
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(() => {
      hh();
      sync();
    });
})();
