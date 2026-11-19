/* Geser toast untuk menutupnya. */

(() => {
  const t = $("#ts");
  let g = null;
  const rst = () => {
    t.style.transition = t.style.transform = t.style.opacity = "";
  };
  t.addEventListener("pointerdown", (e) => {
    if (!t.classList.contains("on") || (e.pointerType == "mouse" && e.button)) return;
    g = { x: e.clientX, y: e.clientY, t: Date.now(), h: null, dx: 0, id: e.pointerId };
  });
  t.addEventListener("pointermove", (e) => {
    if (!g || e.pointerId != g.id) return;
    const dx = e.clientX - g.x,
      dy = e.clientY - g.y;
    if (g.h === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      g.h = Math.abs(dx) > Math.abs(dy);
      if (!g.h) {
        g = null;
        return;
      }
      clearTimeout(tst);
      try {
        t.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
    g.dx = dx;
    t.style.transition = "none";
    t.style.transform = `translateX(${dx}px)`;
    t.style.opacity = Math.max(0.2, 1 - Math.abs(dx) / (t.offsetWidth * 0.9));
  });
  const end = (e) => {
    const s = g;
    g = null;
    if (!s || s.h !== true) return;
    const v = Math.abs(s.dx) / Math.max(1, Date.now() - s.t);
    if (Math.abs(s.dx) > t.offsetWidth * 0.3 || (v > 0.5 && Math.abs(s.dx) > 40)) {
      t.style.transition = RM ? "none" : "transform .2s ease-out,opacity .2s";
      t.style.transform = `translateX(${s.dx < 0 ? -120 : 120}%)`;
      t.style.opacity = "0";
      vib(6);
      setTimeout(
        () => {
          hideToast();
          rst();
        },
        RM ? 0 : 200,
      );
    } else {
      t.style.transition = RM ? "none" : "transform .25s cubic-bezier(.2,.8,.2,1),opacity .2s";
      t.style.transform = "";
      t.style.opacity = "";
      tst = setTimeout(hideToast, 2500);
      setTimeout(rst, 260);
    }
    const c = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
    };
    t.addEventListener("click", c, { capture: true, once: true });
    setTimeout(() => t.removeEventListener("click", c, true), 50);
  };
  t.addEventListener("pointerup", end);
  t.addEventListener("pointercancel", end);
})();
