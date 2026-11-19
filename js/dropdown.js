/* Dropdown kustom pengganti pilihan bawaan browser. */

const CHV =
  '<svg class="cch" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg>';
function csLbl(b) {
  const s = b._sel,
    o = s.options[s.selectedIndex];
  b.querySelector(".cst").textContent = o ? o.text : "";
}
function csEnh() {
  document.querySelectorAll("select:not([data-cs])").forEach((sel) => {
    sel.dataset.cs = 1;
    const b = document.createElement("button");
    b.type = "button";
    b.className = ((sel.className || "") + " csel").trim();
    b.style.cssText = sel.style.cssText;
    b.setAttribute("aria-haspopup", "listbox");
    b.setAttribute("aria-expanded", "false");
    const al = sel.getAttribute("aria-label");
    if (al) b.setAttribute("aria-label", al);
    b.innerHTML = '<span class="cst"></span>' + CHV;
    b._sel = sel;
    csLbl(b);
    b.addEventListener("click", () => spOpen(b));
    sel.after(b);
  });
}
let SP = null;
function spOpen(b) {
  const sel = b._sel;
  if (!sel || !sel.isConnected) return;
  SP = { b, sel };
  b.setAttribute("aria-expanded", "true");
  const el = $("#sp");
  el.innerHTML = `<div class="spc" role="dialog" aria-modal="true" tabindex="-1"><div class="spl" role="listbox" onkeydown="spKey(event)">${[...sel.options].map((o, i) => `<button type="button" class="spo" role="option" data-i="${i}" aria-selected="${i == sel.selectedIndex}" onclick="spPick(${i})"><span>${esc(o.text)}</span><span class="spr" aria-hidden="true"></span></button>`).join("")}</div></div>`;
  el._ret = b;
  openLayer(el);
  raf2(() => {
    const c = el.querySelector('.spo[aria-selected="true"]') || el.querySelector(".spo");
    if (c) {
      c.focus({ preventScroll: true });
      c.scrollIntoView({ block: "center" });
    }
  });
}
function spPick(i) {
  const D = SP;
  if (!D) return;
  const { b, sel } = D;
  vib(5);
  spClose();
  if (sel.selectedIndex != i) {
    sel.selectedIndex = i;
    csLbl(b);
    sel.dispatchEvent(new Event("change", { bubbles: true }));
  }
}
function spClose() {
  if (!SP) return;
  const b = SP.b;
  SP = null;
  b.setAttribute("aria-expanded", "false");
  const el = $("#sp");
  el._ret = b;
  closeLayer(el);
}
function spKey(e) {
  const k = { ArrowDown: 1, ArrowUp: -1 }[e.key];
  const L = [...e.currentTarget.querySelectorAll(".spo")],
    i = L.indexOf(document.activeElement);
  let t;
  if (k) t = i < 0 ? 0 : Math.max(0, Math.min(L.length - 1, i + k));
  else if (e.key == "Home") t = 0;
  else if (e.key == "End") t = L.length - 1;
  else return;
  e.preventDefault();
  L[t].focus();
}
new MutationObserver(() => {
  if (document.querySelector("select:not([data-cs])")) csEnh();
}).observe(document.body, { childList: true, subtree: true });
csEnh();
