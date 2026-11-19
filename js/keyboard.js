/* Pintasan keyboard dan tanda mode keyboard. */

addEventListener("keydown", (e) => {
  if (
    [
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Enter",
      " ",
      "Home",
      "End",
    ].includes(e.key)
  )
    document.body.classList.add("kb");
  if (e.key == "Escape") {
    if ($("#sp").classList.contains("show")) {
      spClose();
      return;
    }
    if ($("#dp").classList.contains("show")) {
      dpClose();
      return;
    }
    if ($("#pp").classList.contains("show") && !$("#mo").classList.contains("show") && !DG) {
      closePp();
      return;
    }
    if ($("#dw").classList.contains("show") && !$("#mo").classList.contains("show") && !DG) {
      closeDw();
      return;
    }
    if (DG) {
      dgc(0);
      return;
    }
    if ($("#mo").classList.contains("show")) {
      closeF();
      return;
    }
    if (SEL) {
      selOff();
      return;
    }
    if (openRow) closeRow();
    return;
  }
  if (e.key == "Tab") {
    const L = $("#sp").classList.contains("show")
      ? $("#sp")
      : $("#dp").classList.contains("show")
        ? $("#dp")
        : DG
          ? $("#dg")
          : $("#mo").classList.contains("show")
            ? $("#mo")
            : null;
    if (!L) return;
    const f = [
      ...L.querySelectorAll('button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])'),
    ].filter((x) => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) {
      e.preventDefault();
      f[f.length - 1].focus();
    } else if (!e.shiftKey && (i < 0 || i == f.length - 1)) {
      e.preventDefault();
      f[0].focus();
    }
    return;
  }
  if (
    (e.key == "Enter" || e.key == " ") &&
    e.target.matches &&
    e.target.matches('[data-k][role="button"],[data-k][role="checkbox"]')
  ) {
    e.preventDefault();
    e.target.click();
  }
});
addEventListener("pointerdown", () => document.body.classList.remove("kb"), true);
$("#tk").addEventListener(
  "scroll",
  (e) => {
    if (openRow && e.target.id == "p_tx") closeRow();
  },
  { capture: true, passive: true },
);
