/* Tekan lama lalu geser untuk mengurutkan Keinginan, Tabungan, dan item lain. */

let DD = null,
  ddp = null,
  ddSettle = 0,
  ddSupp = 0;
const DD_MS = 450,
  DD_SLOP = 8,
  DD_EDGE = 56,
  DD_SEL = '#wll .r[data-k="bud"],#p_goal .g2>.c[data-k="goal"],#nll .r[data-k="need"]';
function ddPendClear() {
  if (ddp) {
    clearTimeout(ddp.t);
    ddp = null;
  }
}
document.addEventListener("pointerdown", (e) => {
  ddPendClear();
  if (
    DD ||
    ddSettle ||
    !e.isPrimary ||
    F ||
    SEL ||
    DG ||
    busy ||
    (e.pointerType == "mouse" && e.button)
  )
    return;
  const el = e.target.closest(DD_SEL);
  if (!el) return;
  const p = (ddp = {
    id: e.pointerId,
    x: e.clientX,
    y: e.clientY,
    x0: e.clientX,
    y0: e.clientY,
    el,
    t: setTimeout(() => {
      if (ddp !== p) return;
      ddp = null;
      ddStart(p);
    }, DD_MS),
  });
});
addEventListener(
  "pointermove",
  (e) => {
    if (!ddp || e.pointerId != ddp.id) return;
    ddp.x = e.clientX;
    ddp.y = e.clientY;
    if (Math.abs(e.clientX - ddp.x0) > DD_SLOP || Math.abs(e.clientY - ddp.y0) > DD_SLOP)
      ddPendClear();
  },
  true,
);
["pointerup", "pointercancel"].forEach((t) =>
  addEventListener(
    t,
    (e) => {
      if (ddp && e.pointerId == ddp.id) ddPendClear();
    },
    true,
  ),
);
/* klik setelah drag tidak boleh membuka form edit; hanya berlaku sesaat (tanpa flag yang bisa tersangkut) */
/* cegah seleksi teks bawaan browser (highlight biru) saat tekan lama pada item yang bisa diseret */
document.addEventListener(
  "selectstart",
  (e) => {
    const t = e.target.nodeType == 1 ? e.target : e.target.parentElement;
    if (DD || ddp || ddSettle || (t && t.closest && t.closest(DD_SEL + ",#p_tx [data-k]")))
      e.preventDefault();
  },
  true,
);
const ddNoSel = () => {
  try {
    const g = getSelection();
    g && g.removeAllRanges();
  } catch (_) {}
};
addEventListener(
  "click",
  (e) => {
    if (performance.now() < ddSupp) {
      e.preventDefault();
      e.stopPropagation();
    }
  },
  true,
);
function ddStart(p) {
  const el = p.el;
  if (DD || ddSettle || !el.isConnected || F || SEL || DG) return;
  const k = el.dataset.k,
    sc = el.closest(".pn"),
    list = el.parentElement,
    rows = [...list.children].filter((r) => r.matches('[data-k="' + k + '"]')),
    from = rows.indexOf(el);
  if (from < 0 || !sc) return;
  const sr = sc.getBoundingClientRect(),
    sc0 = sc.scrollTop,
    tops = [],
    lefts = [],
    hs = [],
    ws = [];
  rows.forEach((r) => {
    const b = r.getBoundingClientRect();
    tops.push(b.top - sr.top + sc0);
    lefts.push(b.left - sr.left);
    hs.push(b.height);
    ws.push(b.width);
  });
  const n = rows.length,
    grid = lefts.some((l) => Math.abs(l - lefts[0]) > 2),
    s = (DD = {
      k,
      id: p.id,
      el,
      rows,
      from,
      n,
      tops,
      lefts,
      hs,
      ws,
      grid,
      gap: n > 1 && !grid ? Math.max(0, tops[1] - tops[0] - hs[0]) : 0,
      sc,
      sc0,
      startX: p.x,
      startY: p.y,
      px: p.x,
      py: p.y,
      target: from,
      sx: 0,
      sy: 0,
      raf: 0,
      ended: false,
      ids: rows.map((r) => r.dataset.id),
      ac: new AbortController(),
      minY: Math.min(...tops) - tops[from],
      maxY: Math.max(...tops.map((t, i) => t + hs[i])) - tops[from] - hs[from],
      minX: Math.min(...lefts) - lefts[from],
      maxX: Math.max(...lefts.map((l, i) => l + ws[i])) - lefts[from] - ws[from],
    }),
    o = { signal: s.ac.signal };
  sw = null;
  ddNoSel();
  rows.forEach((r) => r.classList.add(r === el ? "dgl" : "dgi"));
  sc.style.overflowY = "hidden";
  try {
    el.setPointerCapture(p.id);
  } catch (_) {}
  addEventListener(
    "pointermove",
    (ev) => {
      if (ev.pointerId == s.id) {
        s.px = ev.clientX;
        s.py = ev.clientY;
      }
    },
    { ...o, capture: true },
  );
  addEventListener(
    "pointerup",
    (ev) => {
      if (ev.pointerId == s.id) ddEnd(s, true);
    },
    { ...o, capture: true },
  );
  addEventListener(
    "pointercancel",
    (ev) => {
      if (ev.pointerId == s.id) ddEnd(s, false);
    },
    { ...o, capture: true },
  );
  addEventListener(
    "touchmove",
    (ev) => {
      if (ev.cancelable) ev.preventDefault();
      ev.stopPropagation();
    },
    { ...o, capture: true, passive: false },
  );
  addEventListener("contextmenu", (ev) => ev.preventDefault(), { ...o, capture: true });
  addEventListener(
    "keydown",
    (ev) => {
      if (ev.key == "Escape") ddEnd(s, false);
    },
    { ...o, capture: true },
  );
  addEventListener("blur", () => ddEnd(s, false), o);
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) ddEnd(s, false);
    },
    o,
  );
  vib(15);
  s.raf = requestAnimationFrame(() => ddFrame(s));
}
function ddFrame(s) {
  if (DD !== s || s.ended) return;
  if (!s.el.isConnected) {
    ddEnd(s, false);
    return;
  }
  const r = s.sc.getBoundingClientRect();
  let v = 0;
  if (s.py < r.top + DD_EDGE) v = -Math.min(1, (r.top + DD_EDGE - s.py) / DD_EDGE);
  else if (s.py > r.bottom - DD_EDGE) v = Math.min(1, (s.py - (r.bottom - DD_EDGE)) / DD_EDGE);
  if (v) s.sc.scrollTop += Math.sign(v) * Math.max(1, Math.round(Math.abs(v) * 14));
  /* posisi dihitung dari titik awal (bukan akumulasi delta) + kompensasi scroll */
  const dy = Math.max(s.minY, Math.min(s.maxY, s.py - s.startY + (s.sc.scrollTop - s.sc0))),
    dx = s.grid ? Math.max(s.minX, Math.min(s.maxX, s.px - s.startX)) : 0;
  s.el.style.transform = `translate3d(${dx}px,${dy}px,0) scale(1.02)`;
  const cy = s.tops[s.from] + s.hs[s.from] / 2 + dy,
    cx = s.lefts[s.from] + s.ws[s.from] / 2 + dx;
  let t = 0;
  if (!s.grid) {
    /* daftar satu kolom: hitung item lain yang titik tengah aslinya di atas */
    for (let i = 0; i < s.n; i++) if (i !== s.from && s.tops[i] + s.hs[i] / 2 < cy) t++;
  } else {
    /* grid: slot asli terdekat */
    let b = 1 / 0;
    for (let j = 0; j < s.n; j++) {
      const a = s.lefts[j] + s.ws[j] / 2 - cx,
        c = s.tops[j] + s.hs[j] / 2 - cy,
        d = a * a + c * c;
      if (d < b) {
        b = d;
        t = j;
      }
    }
  }
  if (t !== s.target) {
    s.target = t;
    ddShift(s);
    vib(6);
  }
  s.raf = requestAnimationFrame(() => ddFrame(s));
}
function ddShift(s) {
  const ord = [];
  for (let i = 0; i < s.n; i++) if (i !== s.from) ord.push(i);
  ord.splice(s.target, 0, s.from);
  const nt = [],
    nl = [];
  if (s.grid)
    ord.forEach((i, j) => {
      nt[i] = s.tops[j];
      nl[i] = s.lefts[j];
    });
  else {
    let cur = s.tops[0];
    ord.forEach((i) => {
      nt[i] = cur;
      nl[i] = s.lefts[i];
      cur += s.hs[i] + s.gap;
    });
  }
  s.rows.forEach((r, i) => {
    if (i === s.from) return;
    const y = nt[i] - s.tops[i],
      x = nl[i] - s.lefts[i];
    r.style.transform = x || y ? `translate3d(${x}px,${y}px,0)` : "";
  });
  s.sx = nl[s.from] - s.lefts[s.from];
  s.sy = nt[s.from] - s.tops[s.from];
}
function ddEnd(s, commit) {
  if (DD !== s || s.ended) return;
  s.ended = true;
  cancelAnimationFrame(s.raf);
  s.ac.abort();
  try {
    s.el.releasePointerCapture(s.id);
  } catch (_) {}
  ddSupp = performance.now() + 400;
  DD = null;
  if (!commit) {
    s.target = s.from;
    s.sx = s.sy = 0;
    s.rows.forEach((r) => {
      if (r !== s.el) r.style.transform = "";
    });
  }
  s.el.classList.add("dgs");
  s.el.style.transform = s.sx || s.sy ? `translate3d(${s.sx}px,${s.sy}px,0)` : "";
  ddSettle = setTimeout(
    () => {
      ddSettle = 0;
      s.rows.forEach((r) => {
        r.classList.remove("dgl", "dgi", "dgs");
        r.style.transform = "";
      });
      s.sc.style.overflowY = "";
      if (commit && s.target !== s.from) ddCommit(s);
    },
    RM ? 0 : 220,
  );
}
function ddCommit(s) {
  const ids = s.ids.slice(),
    [m] = ids.splice(s.from, 1);
  ids.splice(s.target, 0, m);
  const L = S[s.k],
    mp = new Map(L.map((b) => [String(b.id), b])),
    out = [];
  ids.forEach((id) => {
    const b = mp.get(String(id));
    if (b) {
      out.push(b);
      mp.delete(String(id));
    }
  });
  S[s.k] = out.concat(L.filter((b) => mp.has(String(b.id))));
  save();
  render();
}
