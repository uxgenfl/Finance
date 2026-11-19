/* Mode pilih banyak, tombol tambah cepat, menu opsi, dan tekan lama. */

let SEL = null,
  lp = 0,
  lpt = null,
  lx = 0,
  ly = 0;
const SELK = {
    tx: "transaksi",
    bud: "keinginan",
    goal: "tujuan tabungan",
    need: "kebutuhan",
    aset: "aset",
    liab: "liabilitas",
    tg: "target",
  },
  KP = { tx: "tx", bud: "bud", goal: "goal", need: "bud", aset: "aset", liab: "aset", tg: "dash" };
function selUi() {
  document.body.dataset.selk = SEL ? SEL.k : "";
  document.querySelectorAll("[data-k]").forEach((e) => {
    const on = !!SEL && SEL.k == e.dataset.k,
      s = on && SEL.ids.has(e.dataset.id);
    e.classList.toggle("sl", s);
    if (e.classList.contains("r")) {
      if (on) e.setAttribute("aria-pressed", s);
      else e.removeAttribute("aria-pressed");
    } else if (on) {
      e.setAttribute("role", "checkbox");
      e.setAttribute("aria-checked", s);
      e.tabIndex = 0;
    } else if (e.dataset.k == "goal" || e.dataset.k == "need") {
      e.setAttribute("role", "button");
      e.removeAttribute("aria-checked");
      e.tabIndex = 0;
    } else {
      e.removeAttribute("role");
      e.removeAttribute("aria-checked");
      e.removeAttribute("tabindex");
    }
  });
  const b = $("#sb");
  if (!SEL) {
    b.classList.remove("on");
    return;
  }
  $("#sn").textContent = SEL.ids.size;
  $("#sd").disabled = !SEL.ids.size;
  b.classList.add("on");
}
function selOn(k, id) {
  closeRow();
  hideToast();
  SEL = { k, ids: new Set([id]) };
  document.body.classList.add("selm");
  selUi();
}
function selStart(k) {
  closeRow();
  hideToast();
  SEL = { k, ids: new Set(), man: 1 };
  document.body.classList.add("selm");
  selUi();
  vib(8);
}
function selOff() {
  if (!SEL) return;
  SEL = null;
  document.body.classList.remove("selm");
  selUi();
}
function selTog(id) {
  if (!SEL) return;
  SEL.ids.has(id) ? SEL.ids.delete(id) : SEL.ids.add(id);
  if (!SEL.ids.size && !SEL.man) selOff();
  else selUi();
}
function qaSync() {
  const q = document.getElementById("qa");
  if (q) q.hidden = ["dash", "bud", "aset", "rep", "set"].includes(tab);
}
const _goQ = window.go;
window.go = function () {
  const r = _goQ.apply(this, arguments);
  qaSync();
  return r;
};
qaSync();
(() => {
  const q = document.getElementById("qa");
  let d = null,
    t0 = 0;
  let sup = 0;
  const fire = () => {
    const n = performance.now();
    if (n - t0 < 500) return;
    t0 = n;
    sup = n + 450;
    ed(tab);
  };
  window.addEventListener(
    "click",
    (e) => {
      if (performance.now() < sup) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    true,
  );
  q.addEventListener(
    "pointerdown",
    (e) => {
      d = [e.clientX, e.clientY];
    },
    { passive: true },
  );
  q.addEventListener("pointerup", (e) => {
    if (!d) return;
    const m = Math.hypot(e.clientX - d[0], e.clientY - d[1]);
    d = null;
    if (m < 12) fire();
  });
  q.addEventListener("pointercancel", () => {
    d = null;
  });
  q.addEventListener("click", (e) => {
    e.stopPropagation();
    fire();
  });
})();
/* Tap tepat setelah geser halaman: bila browser tidak mengirim klik, teruskan dari pointerup */
(() => {
  const SELQ = "button,a[href],[onclick],[data-k],[role=button],[role=checkbox],[role=tab]";
  let ps = null,
    dn = null,
    lc = 0,
    sup = 0,
    lastSw = -1e4;
  addEventListener(
    "click",
    (e) => {
      if (performance.now() < sup) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return;
      }
      lc = performance.now();
    },
    true,
  );
  addEventListener(
    "pointerdown",
    (e) => {
      if (e.pointerType === "mouse" || !e.isPrimary) {
        ps = dn = null;
        return;
      }
      const t = e.target.closest && e.target.closest(SELQ);
      ps = { x: e.clientX, y: e.clientY, s: performance.now() };
      dn = t && !t.closest("input,select,textarea,label,#qa") ? t : null;
    },
    true,
  );
  addEventListener(
    "pointerup",
    (e) => {
      const p = ps,
        t = dn;
      ps = dn = null;
      if (!p || e.pointerType === "mouse") return;
      const n = performance.now(),
        dx = e.clientX - p.x,
        dy = e.clientY - p.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        lastSw = n;
        return;
      }
      if (!t || Math.hypot(dx, dy) > 10 || n - p.s > 450 || n - lastSw > 900 || lp || DD) return;
      setTimeout(() => {
        if (lc >= n - 5 || !t.isConnected || t.disabled || t.closest("[inert]")) return;
        t.click();
        sup = performance.now() + 400;
      }, 60);
    },
    true,
  );
})();
function closePm() {
  const m = document.getElementById("pm");
  if (m) m.remove();
  document.removeEventListener("click", pmOut, true);
}
function pmOut(e) {
  const m = document.getElementById("pm");
  if (m && !m.contains(e.target) && !e.target.closest('[aria-haspopup="menu"]')) closePm();
}
function openPm(btn, kd, sc) {
  const had = document.getElementById("pm");
  closePm();
  if (had && had._b === btn) return;
  const m = document.createElement("div");
  m.id = "pm";
  m.className = "pm";
  m.setAttribute("role", "menu");
  m._b = btn;
  m.innerHTML = `<button type="button" role="menuitem">Pilih banyak</button><button type="button" role="menuitem">Pilih semua</button>`;
  m.children[0].onclick = () => {
    closePm();
    selStart(kd);
  };
  m.children[1].onclick = () => {
    closePm();
    selStart(kd);
    SEL.ids = new Set(
      [...document.querySelectorAll((sc || "#p_" + KP[kd]) + ' [data-k="' + kd + '"]')].map(
        (e) => e.dataset.id,
      ),
    );
    selUi();
  };
  document.body.appendChild(m);
  const r = btn.getBoundingClientRect();
  m.style.top = r.bottom + 6 + "px";
  m.style.right = Math.max(12, innerWidth - r.right) + "px";
  setTimeout(() => document.addEventListener("click", pmOut, true), 0);
  m.firstChild.focus({ preventScroll: true });
}
document.addEventListener("keydown", (e) => {
  if (e.key == "Escape") closePm();
});
window.addEventListener("scroll", closePm, true);

function selAll() {
  if (!SEL) return;
  const a = [...document.querySelectorAll("#p_" + KP[SEL.k] + ' [data-k="' + SEL.k + '"]')].map(
    (e) => e.dataset.id,
  );
  SEL.ids = SEL.ids.size >= a.length ? new Set() : new Set(a);
  if (!SEL.ids.size && !SEL.man) selOff();
  else selUi();
}
function selDel() {
  if (!SEL || !SEL.ids.size) return;
  const { k, ids } = SEL,
    n = ids.size;
  cf(`Hapus ${n} ${SELK[k]} yang dipilih?`, () => {
    snap();
    animRemove(k, ids, () => {
      S[k] = S[k].filter((x) => !ids.has(x.id));
      save();
      selOff();
      render();
      delToast(n);
      vib([10, 30, 10]);
    });
  });
}
const LPS = '#p_tx [data-k], .tgc [data-k="tg"]';
document.addEventListener("pointerdown", (e) => {
  lp = 0;
  clearTimeout(lpt);
  if (F || SEL || (e.pointerType == "mouse" && e.button)) return;
  const el = e.target.closest(LPS);
  if (!el) return;
  lx = e.clientX;
  ly = e.clientY;
  lpt = setTimeout(() => {
    lp = 1;
    vib(15);
    ddNoSel();
    selOn(el.dataset.k, el.dataset.id);
  }, 500);
});
document.addEventListener("pointermove", (e) => {
  if (Math.abs(e.clientX - lx) > 10 || Math.abs(e.clientY - ly) > 10) clearTimeout(lpt);
});
["pointerup", "pointercancel"].forEach((t) =>
  document.addEventListener(t, () => clearTimeout(lpt)),
);
document.addEventListener("contextmenu", (e) => {
  if (e.target.closest("[data-k]")) e.preventDefault();
});
document.addEventListener(
  "click",
  (e) => {
    const el = e.target.closest("[data-k]");
    if (lp) {
      lp = 0;
      if (el) {
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }
    if (openRow && el === openRow && !e.target.closest(".sa")) {
      e.preventDefault();
      e.stopPropagation();
      closeRow();
      return;
    }
    if (SEL && el && el.dataset.k != SEL.k) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (SEL && el && el.dataset.k == SEL.k) {
      e.preventDefault();
      e.stopPropagation();
      selTog(el.dataset.id);
    }
  },
  true,
);
