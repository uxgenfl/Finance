/* Form naik di atas keyboard layar dan mematikan saran isian otomatis. */

(() => {
  /* Layout viewport mengecil mengikuti keyboard (resizes-content), jadi posisi form selalu benar dari browser.
    Agar tidak melompat, perpindahannya dianimasikan (FLIP) hanya dengan transform: tanpa overshoot/naik-turun. */
  let top = null,
    tk = 0;
  const sh = () => document.querySelector("#mo.show .sh");
  const track = () => {
    const s = sh();
    top = s ? s.offsetTop : null;
  };
  addEventListener("resize", () => {
    const s = sh();
    if (!s || top == null) {
      track();
      return;
    }
    const nt = s.offsetTop,
      d = top - nt;
    top = nt;
    if (Math.abs(d) < 24 || RM) return;
    const id = ++tk;
    s.style.transition = "none";
    s.style.transform = `translate3d(0,${d}px,0)`;
    s.getBoundingClientRect();
    requestAnimationFrame(() => {
      if (id !== tk) return;
      s.style.transition = "transform .3s cubic-bezier(.2,.8,.2,1)";
      s.style.transform = "";
      setTimeout(() => {
        if (id === tk) {
          s.style.transition = "";
          s.style.transform = "";
        }
      }, 360);
    });
  });
  document.addEventListener("focusin", (e) => {
    const t = e.target;
    if (!t || !t.matches || !t.matches("input,textarea,select")) return;
    if (t.matches("input:not([type=file]):not([type=checkbox]):not([type=radio]),textarea")) {
      t.setAttribute("autocomplete", "off");
      t.setAttribute("autocorrect", "off");
    }
    if (t.closest("#mo .sh")) {
      track();
      const s = t.closest(".sh");
      if (s.scrollHeight > s.clientHeight + 2)
        setTimeout(() => {
          if (document.activeElement === t && t.isConnected)
            t.scrollIntoView({ block: "nearest", behavior: RM ? "auto" : "smooth" });
        }, 350);
    }
  });
  document.addEventListener("focusout", () => setTimeout(track, 400));
})();
