/* Isi tiap halaman (`V.dash`, `V.tx`, `V.bud`, ...) dan filter/sub-tab di dalamnya. */

const HR = {
  dash: "dashboard",
  tx: "transaksi",
  bud: "rencana",
  goal: "tabungan",
  aset: "neraca",
  rep: "laporan",
  set: "pengaturan",
};
function hashTab() {
  const h = location.hash.replace(/^#\/?/, "");
  return Object.keys(HR).find((k) => HR[k] == h);
}
function route(t, push) {
  const h = "#/" + HR[t];
  if (location.hash === h) return;
  try {
    history[push ? "pushState" : "replaceState"](null, "", h);
  } catch (_) {
    try {
      location.hash = h;
    } catch (__) {}
  }
}
const V = {};
let tab =
    hashTab() || (["dash", "tx", "bud", "goal", "aset", "rep"].includes(S.st) ? S.st : "dash"),
  fl = "all",
  rp = { p: "month", s: rng("month")[0], e: today };
V.dash = () => {
  const [s, e] = rng("month"),
    i = sm("in", s, e),
    o = sm("out", s, e),
    nb = S.bud.filter((b) => !bok(b)).length;
  return `<div class="c d-bal"><span class="mu" style="display:block;margin-bottom:2px">Total saldo</span><div class="big bal" role="button" tabindex="0" aria-label="Atur saldo" onclick="ed('acc','main')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();ed('acc','main')}" data-v="${total()}">${R(total())}</div><div class="st st3"><div><span class="mu">Pemasukan</span><b class="gi">${R(i)}</b></div><div><span class="mu">Pengeluaran</span><b class="go">${R(o)}</b></div><div><span class="mu">Sisa bulan ini</span><b class="${i - o < 0 ? "go" : ""}">${R(i - o)}</b></div></div></div>
<div class="g2"><div class="c d-chart"><h2>Pemasukan vs pengeluaran</h2>${mchart()}</div><div class="c d-donut"><h2>Pengeluaran bulan ini</h2>${donut(brk(s, e))}</div></div>
<div class="g2"><div class="c d-wish">${S.bud.length ? `<h2>Keinginan</h2>${S.bud.map((b) => wl(b, 1)).join("")}` : em(ic("wish", 40), "Keinginan masih kosong", "Tekan Tambah untuk mencatat barang yang ingin kamu beli.")}</div>
<div class="c d-sav"><h2>Tabungan</h2>${S.goal.map((g) => gRow(g)).join("") || em(DOL, "Belum ada tabungan", "Catat tabungan yang ingin kamu kumpulkan.")}</div></div>
<div class="c d-tx"><h2>Transaksi terbaru</h2>${
    S.tx
      .slice()
      .sort((a, b) => b.d.localeCompare(a.d))
      .slice(0, 8)
      .map((t) => row(t))
      .join("") ||
    em(ic("search", 40), "Belum ada transaksi", "Catat transaksi pertamamu dari menu Transaksi.")
  }</div>${tgSec()}`;
};
const txList = () => {
  const all = S.tx.filter((t) => fl == "all" || t.t == fl).sort((a, b) => b.d.localeCompare(a.d)),
    l = all.slice(0, txLim);
  let h = "",
    last = "";
  l.forEach((t) => {
    if (t.d != last) {
      last = t.d;
      h += `<div class="mu" style="margin:20px 0 4px">${P(t.d).toLocaleDateString(LC(), { weekday: "long", day: "numeric", month: "long" })}</div>`;
    }
    h += row(t, 1);
  });
  return (
    (h ||
      (fl == "all"
        ? em(
            ic("search", 40),
            "Belum ada transaksi",
            "Tekan Tambah untuk mencatat transaksi pertamamu.",
          )
        : em(ic("search", 40), "Tidak ada transaksi", "Belum ada transaksi untuk filter ini."))) +
    (all.length > txLim
      ? `<button type="button" class="b more" onclick="moreTx()">Muat lebih banyak (${all.length - txLim} lagi)</button>`
      : "")
  );
};
V.tx = () =>
  `${hd("Riwayat Transaksi", "tx")}<div class="ft" role="group" aria-label="Filter transaksi">${[
    ["all", "Semua"],
    ["in", "Masuk"],
    ["out", "Keluar"],
  ]
    .map(
      ([v, l]) =>
        `<button type="button" data-f="${v}" class="${fl == v ? "on" : ""}" aria-pressed="${fl == v}" onclick="setFl('${v}')">${l}</button>`,
    )
    .join("")}<i id="fi" aria-hidden="true"></i></div><div class="c" id="txl">${txList()}</div>${asideTx()}`;
function moveFi(a) {
  document.querySelectorAll(".ft").forEach((f) => {
    const b = f.querySelector("button.on"),
      i = f.querySelector("i");
    if (!b || !i || !b.offsetWidth) return;
    i.style.transition = a ? "" : "none";
    i.style.width = Math.max(0, b.offsetWidth - 24) + "px";
    i.style.transform = `translateX(${b.offsetLeft + 12}px)`;
    if (!a) {
      void i.offsetWidth;
      i.style.transition = "";
    }
  });
}
function setSub(t, v) {
  if (subK(t) == v) return;
  if (t == "bud") kk = v;
  else av = v;
  selOff();
  closeRow();
  document.querySelectorAll("#p_" + t + " .ft button").forEach((b) => {
    const on = b.dataset.f == v;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on);
  });
  moveFi(1);
  const l = $(t == "bud" ? "#kkl" : "#alst");
  l.innerHTML = t == "bud" ? kkList() : alList();
  l.classList.remove("swp");
  void l.offsetWidth;
  l.classList.add("swp");
}
try {
  document.fonts && document.fonts.ready.then(() => moveFi(0));
} catch (_) {}
function setFl(v) {
  if (fl == v) return;
  fl = v;
  txLim = 100;
  selOff();
  closeRow();
  document.querySelectorAll("#p_tx .ft button").forEach((b) => {
    const on = b.dataset.f == v;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on);
  });
  moveFi(1);
  const l = $("#txl");
  l.innerHTML = txList();
  l.classList.remove("swp");
  void l.offsetWidth;
  l.classList.add("swp");
}
function moreTx() {
  txLim += 100;
  $("#txl").innerHTML = txList();
}
V.acc =
  () => `<div class="c"><span class="mu">Total saldo</span><div class="big" data-v="${total()}">${R(total())}</div><div class="act" style="justify-content:flex-start"><button class="b p" onclick="ed('acc','main')">Atur saldo</button></div></div>
<p class="mu">Saldo dihitung dari semua transaksi sampai hari ini, termasuk yang bertanggal bulan lalu. Transaksi bertanggal ke depan baru dihitung saat tanggalnya tiba. Tekan Atur saldo untuk menyesuaikan dengan kondisi asli.</p>`;
V.bud = () =>
  `${subHd("bud", "Rencana", [
    ["subs", "Langganan"],
    ["need", "Kebutuhan"],
    ["bud", "Keinginan"],
  ])}<div id="kkl">${kkList()}</div>${asideBud()}`;
V.aset = () =>
  `${subHd("aset", "Neraca", [
    ["aset", "Aset"],
    ["liab", "Liabilitas"],
  ])}<div id="alst">${alList()}</div>${asideAset()}`;
V.goal = () =>
  `${hd("Tabungan", "goal")}<div class="g2">${S.goal.map((g) => `<div class="c gc" data-k="goal" data-id="${g.id}" role="button" tabindex="0" onclick="ed('goal','${g.id}')">${gRow(g, 1)}</div>`).join("") || `<div class="c">${em(DOL, "Belum ada tabungan", "Tekan Tambah untuk mencatat tabungan yang ingin kamu kumpulkan.")}</div>`}</div>`;
V.rep = () => {
  let s, e;
  if (rp.p == "custom") {
    s = rp.s;
    e = rp.e;
    if (s > e) [s, e] = [e, s];
  } else [s, e] = rng(rp.p);
  const L = Math.round((P(e) - P(s)) / 864e5) + 1,
    ps = add(s, -L),
    pe = add(s, -1),
    i = sm("in", s, e),
    o = sm("out", s, e),
    br = brk(s, e);
  return `<div class="c"><div class="row2"><select style="width:auto" onchange="rp.p=this.value;render()">${[
    ["day", "Hari ini"],
    ["week", "Minggu ini"],
    ["month", "Bulan ini"],
    ["year", "Tahun ini"],
    ["custom", "Custom range"],
  ]
    .map(([v, l]) => `<option value="${v}"${rp.p == v ? " selected" : ""}>${l}</option>`)
    .join(
      "",
    )}</select><span class="mu">${fd(s, 1)} – ${fd(e, 1)}</span></div>${rp.p == "custom" ? `<div class="row2" style="margin-top:6px;align-items:flex-start"><div style="flex:1;min-width:0"><label for="rp_s">Dari</label>${dpBtn("rp_s", rp.s, "dpRep('s')", 1)}</div><div style="flex:1;min-width:0"><label for="rp_e">Sampai</label>${dpBtn("rp_e", rp.e, "dpRep('e')", 1)}</div></div>` : ""}</div>
<div class="g2" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))"><div class="c"><span class="mu">Pemasukan</span><div class="gi" style="font-size:19px;font-weight:700">${R(i)}</div></div><div class="c"><span class="mu">Pengeluaran</span><div class="go" style="font-size:19px;font-weight:700">${R(o)}</div></div><div class="c"><span class="mu">${i - o < 0 ? "Defisit" : "Surplus"}</span><div class="${i - o < 0 ? "go" : "gi"}" style="font-size:19px;font-weight:700">${R(i - o)}</div></div></div>
<div class="c"><h2>Rincian pengeluaran</h2>${donut(br)}</div>`;
};

V.set = () => {
  const L = S.lang === "en" ? "English" : "Bahasa Indonesia",
    it = (k, i, t, d) =>
      `<button type="button" class="mr" onclick="openPp('${k}')">${ic(i, 22)}<span class="mt"><b>${t}</b><small class="mu">${d}</small></span>${ic("chev", 18, "mc")}</button>`;
  return `<div class="row2"><h3>Pengaturan</h3></div><div class="c sl">${it("lang", "globe", "Bahasa", L)}${it("data", "archive", "Kontrol data", "Ekspor, impor, dan reset data")}${it("lain", "set", "Lainnya", "Mode gelap, nominal, getar, animasi, dan halaman awal").replace('class="mr"', 'class="mr lp-only"')}</div><div class="set-inline">${PP.set[1]().replace(' id="thm"', "")}</div>`;
};
