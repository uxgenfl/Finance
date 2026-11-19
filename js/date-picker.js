/* Pemilih tanggal model roda dan kalender. */

const dpLong = (s) =>
    /^\d{4}-\d{2}-\d{2}$/.test(s || "")
      ? P(s).toLocaleDateString(LC(), { day: "numeric", month: "long", year: "numeric" })
      : "",
  dpIco =
    '<svg class="ni" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v15H4zM4 10h16M8 3v4M16 3v4"/></svg>',
  DPH = 44,
  dpPad = (n) => String(n).padStart(2, "0");
function dpBtn(id, val, fn, short) {
  return `<button type="button" class="dpb" id="${id}" aria-haspopup="dialog" onclick="${fn}"><span data-notr>${esc(short ? fd(val, 1) : dpLong(val))}</span>${dpIco}</button>`;
}
function dpField(k, val) {
  return `<input type="hidden" id="h_${k}" name="${k}" value="${esc(val)}">${dpBtn("f_" + k, val, `dpForm('${k}')`)}`;
}
function dpForm(k) {
  const h = $("#h_" + k);
  if (!h) return;
  dpOpen(h.value, (iso) => {
    h.value = iso;
    const b = $("#f_" + k);
    if (b) b.firstElementChild.textContent = dpLong(iso);
  });
}
function dpRep(k) {
  dpOpen(rp[k], (iso) => {
    rp[k] = iso;
    render();
  });
}
let DP = null;
const dpIso = () => DP.y + "-" + dpPad(DP.m + 1) + "-" + dpPad(DP.d),
  dpDays = () => new Date(DP.y, DP.m + 1, 0).getDate(),
  dpIdx = (k) => (k == "d" ? DP.d - 1 : k == "m" ? DP.m : DP.y - 1990);
const DPMIN = 1990,
  DPMAX = 2099,
  CHL =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  CHR =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  CHD =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg>';
const dpWd = () =>
    String(LC()).slice(0, 2) == "en"
      ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
      : ["Sn", "Sl", "Rb", "Km", "Jm", "Sb", "Mg"],
  dpMn = (i) => new Date(2023, i, 1).toLocaleDateString(LC(), { month: "short" });
function dpOpen(val, cb) {
  const d = P(/^\d{4}-\d{2}-\d{2}$/.test(val || "") ? val : ymd(new Date()));
  const y = Math.max(DPMIN, Math.min(DPMAX, d.getFullYear()));
  DP = {
    y: d.getFullYear(),
    m: d.getMonth(),
    d: d.getDate(),
    vy: y,
    vm: y == d.getFullYear() ? d.getMonth() : 0,
    mode: "d",
    cb,
  };
  $("#dp").innerHTML =
    `<div class="dpc" role="dialog" aria-modal="true" aria-label="Pilih tanggal" tabindex="-1"><div class="cal-h"><button type="button" class="cal-n" id="dppv" aria-label="Sebelumnya" onclick="dpMove(-1)">${CHL}</button><button type="button" class="cal-t" id="dptt" aria-expanded="false" aria-label="Pilih bulan dan tahun" onclick="dpMode()"><span id="dpm" data-notr></span></button><button type="button" class="cal-n" id="dpnx" aria-label="Berikutnya" onclick="dpMove(1)">${CHR}</button></div><div id="dpbody"></div><div class="act"><button type="button" class="b" onclick="dpToday()">Hari ini</button><button type="button" class="b" onclick="dpClose()">Batal</button><button type="button" class="b p" onclick="dpOk()">OK</button></div></div>`;
  dpRender();
  openLayer($("#dp"));
}
function dpRender(fx) {
  const D = DP;
  if (!D) return;
  const body = $("#dpbody"),
    tt = $("#dpm"),
    td = ymd(new Date());
  if (D.mode == "d") {
    const first = new Date(D.vy, D.vm, 1).getDay(),
      n = new Date(D.vy, D.vm + 1, 0).getDate(),
      inView = D.y == D.vy && D.m == D.vm;
    tt.textContent = new Date(D.vy, D.vm, 1).toLocaleDateString(LC(), {
      month: "long",
      year: "numeric",
    });
    $("#dppv").disabled = D.vy <= DPMIN && D.vm == 0;
    $("#dpnx").disabled = D.vy >= DPMAX && D.vm == 11;
    let h = `<div class="cal-w" data-notr aria-hidden="true">${dpWd()
      .map((w) => `<span>${w}</span>`)
      .join(
        "",
      )}</div><div class="cal-g" data-notr role="group" aria-label="${tt.textContent}" onkeydown="dpKey(event)" ontouchstart="dpTs(event)" ontouchend="dpTe(event)">`;
    const off = (first + 6) % 7;
    for (let i = 0; i < off; i++) {
      const dt = new Date(D.vy, D.vm, i - off + 1),
        ok = dt.getFullYear() >= DPMIN;
      h += `<button type="button" class="cal-d out" tabindex="-1" aria-label="${dpLong(ymd(dt))}" onclick="dpPickO(${dt.getFullYear()},${dt.getMonth()},${dt.getDate()})"${ok ? "" : " disabled"}>${dt.getDate()}</button>`;
    }
    for (let d = 1; d <= n; d++) {
      const iso = D.vy + "-" + dpPad(D.vm + 1) + "-" + dpPad(d),
        sel = inView && D.d == d;
      h += `<button type="button" class="cal-d${sel ? " on" : ""}${iso == td ? " td" : ""}" data-d="${d}" tabindex="${sel || (!inView && d == 1) ? 0 : -1}" aria-pressed="${sel}"${iso == td ? ' aria-current="date"' : ""} aria-label="${dpLong(iso)}" onclick="dpPick(${d})">${d}</button>`;
    }
    for (let i = off + n; i < 42; i++) {
      const dt = new Date(D.vy, D.vm, i - off + 1),
        ok = dt.getFullYear() <= DPMAX;
      h += `<button type="button" class="cal-d out" tabindex="-1" aria-label="${dpLong(ymd(dt))}" onclick="dpPickO(${dt.getFullYear()},${dt.getMonth()},${dt.getDate()})"${ok ? "" : " disabled"}>${dt.getDate()}</button>`;
    }
    body.innerHTML = h + "</div>";
  } else {
    tt.textContent = D.vy;
    $("#dppv").disabled = D.vy <= DPMIN;
    $("#dpnx").disabled = D.vy >= DPMAX;
    body.innerHTML = `<div class="cal-mg" data-notr role="group" aria-label="${D.vy}">${Array.from(
      { length: 12 },
      (_, i) => {
        const sel = D.y == D.vy && D.m == i,
          now = td.slice(0, 7) == D.vy + "-" + dpPad(i + 1);
        return `<button type="button" class="cal-m${sel ? " on" : ""}${now ? " td" : ""}" aria-pressed="${sel}" onclick="dpPickM(${i})">${dpMn(i)}</button>`;
      },
    ).join("")}</div>`;
  }
  $("#dptt").setAttribute("aria-expanded", D.mode == "m");
  if (fx) {
    const b =
      body.querySelector(".cal-d.on,.cal-m.on") || body.querySelector('.cal-d[tabindex="0"]');
    if (b) b.focus({ preventScroll: true });
  }
}
function dpMove(k) {
  const D = DP;
  if (!D) return;
  if (D.mode == "d") {
    let m = D.vm + k,
      y = D.vy;
    if (m < 0) {
      m = 11;
      y--;
    } else if (m > 11) {
      m = 0;
      y++;
    }
    if (y < DPMIN || y > DPMAX) return;
    D.vy = y;
    D.vm = m;
  } else {
    const y = D.vy + k;
    if (y < DPMIN || y > DPMAX) return;
    D.vy = y;
  }
  dpRender();
}
function dpMode() {
  const D = DP;
  if (!D) return;
  D.mode = D.mode == "d" ? "m" : "d";
  dpRender();
}
function dpToday() {
  const D = DP;
  if (!D) return;
  const n = new Date(),
    y = n.getFullYear();
  if (y < DPMIN || y > DPMAX) return;
  D.y = D.vy = y;
  D.m = D.vm = n.getMonth();
  D.d = n.getDate();
  D.mode = "d";
  vib(3);
  dpRender(1);
}
function dpPick(d) {
  const D = DP;
  if (!D) return;
  D.y = D.vy;
  D.m = D.vm;
  D.d = d;
  vib(3);
  dpRender(1);
}
function dpPickO(y, m, d) {
  const D = DP;
  if (!D) return;
  D.y = D.vy = y;
  D.m = D.vm = m;
  D.d = d;
  vib(3);
  dpRender(1);
}

function dpPickM(i) {
  const D = DP;
  if (!D) return;
  D.vm = i;
  D.mode = "d";
  dpRender(1);
}
function dpKey(e) {
  const D = DP;
  if (!D) return;
  const f = document.activeElement,
    b =
      f && f.dataset && f.dataset.d ? new Date(D.vy, D.vm, +f.dataset.d) : new Date(D.y, D.m, D.d),
    k = e.key,
    dl = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[k];
  let t;
  if (dl) t = new Date(b.getFullYear(), b.getMonth(), b.getDate() + dl);
  else if (k == "PageUp" || k == "PageDown") {
    const x = k == "PageUp" ? -1 : 1,
      dm = new Date(b.getFullYear(), b.getMonth() + x + 1, 0).getDate();
    t = new Date(b.getFullYear(), b.getMonth() + x, Math.min(b.getDate(), dm));
  } else if (k == "Home") t = new Date(b.getFullYear(), b.getMonth(), 1);
  else if (k == "End") t = new Date(b.getFullYear(), b.getMonth() + 1, 0);
  else return;
  e.preventDefault();
  if (t.getFullYear() < DPMIN || t.getFullYear() > DPMAX) return;
  D.y = D.vy = t.getFullYear();
  D.m = D.vm = t.getMonth();
  D.d = t.getDate();
  dpRender(1);
}
let dpT = null;
function dpTs(e) {
  const t = e.changedTouches[0];
  dpT = [t.clientX, t.clientY];
}
function dpTe(e) {
  if (!dpT) return;
  const t = e.changedTouches[0],
    dx = t.clientX - dpT[0],
    dy = t.clientY - dpT[1];
  dpT = null;
  if (Math.abs(dx) > 50 && Math.abs(dy) < 40) dpMove(dx < 0 ? 1 : -1);
}
function dpClose() {
  if (!DP) return;
  DP = null;
  closeLayer($("#dp"));
}
function dpOk() {
  const D = DP;
  if (!D) return;
  const v = dpIso();
  dpClose();
  vib(8);
  D.cb(v);
}
