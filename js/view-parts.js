/* Potongan tampilan yang dipakai ulang: baris daftar, kartu, progress bar, panel ringkasan laptop, grafik. */

function rng(p) {
  const n = P(today),
    y = n.getFullYear(),
    m = n.getMonth();
  if (p == "day") return [today, today];
  if (p == "week") {
    const w = (n.getDay() + 6) % 7;
    return [add(today, -w), add(today, 6 - w)];
  }
  if (p == "year") return [ymd(new Date(y, 0, 1)), ymd(new Date(y, 11, 31))];
  return [ymd(new Date(y, m, 1)), ymd(new Date(y, m + 1, 0))];
}

const pb = (p, c, lb) => {
    p = Math.min(100, p);
    return `<div class="pb" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}"${lb ? ` aria-label="${lb}"` : ""}><i data-w="${p}" style="width:${p}%;background:${c || "var(--ac)"}"></i></div>`;
  },
  bok = (b) => (+b.u || 0) >= b.m,
  wl = (b, d) =>
    `<div class="r" style="padding:15px 0"${d ? "" : ` data-k="bud" data-id="${b.id}" role="button" tabindex="0"`} onclick="ed('bud','${b.id}')"><div style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${bn(b)}</div><b style="white-space:nowrap;font-variant-numeric:tabular-nums">${R(b.m)}</b></div>`,
  budRow = (b, full) => {
    const u = +b.u || 0,
      p = pc(u, b.m),
      ok = bok(b);
    return `<div class="r" style="display:block"${full ? "" : ` onclick="ed('bud','${b.id}')"`}><div class="row2"><b>${bn(b)}</b><b>${p}%</b></div><div class="row2" style="margin:2px 0 6px"><span class="mu">${R(u)} / ${R(b.m)}</span><span style="font-size:13px;color:${ok ? "var(--ac)" : "var(--tx)"}">${ok ? "Aman" : "Belum aman"}</span></div>${pb(p, "var(--ac)", "Budget " + bn(b))}${full ? `<div class="row2" style="margin-top:10px"><span class="mu">${ok ? "Target tercapai" : "Kurang " + R(b.m - u)}</span><span><button class="b" style="padding:10px 38px" onclick="ed('bud','${b.id}')">Ubah</button></span></div>` : ""}</div>`;
  },
  gRow = (g, full, lb) => {
    const p = pc(g.s, g.t),
      left = Math.max(0, g.t - g.s),
      mo = Math.max(1, Math.ceil((P(g.d) - P(today)) / 2.6e9));
    return `<div class="r" style="display:block"><div class="row2"><b>${U(g.n)}</b><b>${p}%</b></div><div class="mu row2" style="margin:2px 0 6px"><span>${R(g.s)} / ${R(g.t)}</span><span style="white-space:nowrap">${fd(g.d, 1)}</span></div>${pb(p, "var(--in)", (lb || "Tabungan") + " " + U(g.n))}${full ? `<div class="row2" style="margin-top:10px"><span class="mu">${left ? `Perlu ${R(left / mo)}/bulan` : `${ic("checkc", 14)} Tercapai`}</span></div>` : ""}</div>`;
  },
  TI = { in: ic("in"), out: ic("out"), tf: ic("tx") },
  DOL = ic("save", 40),
  row = (t, sa) => {
    const tf = t.t == "tf";
    return `<div class="r" style="padding:${sa ? 15 : 12}px 0" data-k="tx" data-id="${t.id}" role="button" tabindex="0" onclick="ed('tx','${t.id}')"><div class="ic" aria-hidden="true" style="${tf ? "" : `color:var(--${t.t == "in" ? "in" : "out"});background:color-mix(in srgb,var(--${t.t == "in" ? "in" : "out"}) 14%,transparent)`}">${TI[tf ? "tf" : t.t]}</div><div style="min-width:0"><b style="display:block;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.note ? U(t.note) : tf ? "Transfer" : cn(t.c)}</b>${sa ? "" : `<small>${fd(t.d)}</small>`}</div><b style="white-space:nowrap;padding-left:8px" class="${tf ? "" : t.t == "in" ? "gi" : "go"}">${tf ? "" : t.t == "in" ? "+" : "-"}${R(t.m)}</b>${sa ? `<div class="sa" aria-hidden="true"><button type="button" tabindex="-1" class="sa1" onclick="event.stopPropagation();closeRow();ed('tx','${t.id}')">Ubah</button><button type="button" tabindex="-1" class="sa2" onclick="event.stopPropagation();swDel('${t.id}')">Hapus</button></div>` : ""}</div>`;
  },
  em = (i, t, s) =>
    `<div class="em"><div class="ei" aria-hidden="true">${i}</div><b>${t}</b><span class="mu">${s}</span></div>`,
  empty = em(ic("list", 40), "Belum ada data", "Mulai mencatat untuk melihat ringkasan di sini."),
  hd = (t, kd) =>
    `<div class="row2"><h3>${t}</h3><span class="row2"><button type="button" class="b ib" style="width:auto;margin-left:0;padding:0 18px" onclick="ed('${kd}')">Tambah</button><button type="button" class="b ib" aria-label="Opsi lainnya" aria-haspopup="menu" onclick="openPm(this,'${kd}')">${ic("dots")}</button></span></div>`;

let kk = "subs",
  av = "aset";
const HZ = [
    ["s", "Short Target", "Di bawah 1 tahun", "Pendek"],
    ["m", "Medium Target", "1–5 tahun", "Menengah"],
    ["l", "Long Target", "Lebih dari 5 tahun", "Panjang"],
  ],
  sumM = (l) => l.reduce((a, x) => a + (+x.m || 0), 0),
  subK = (t) => (t == "bud" ? kk : av),
  subHd = (t, title, opts) =>
    `<div class="row2" style="min-width:0"><h3 style="min-width:0;line-height:1.2">${title}</h3><span class="row2"><button type="button" class="b ib" style="width:auto;margin-left:0;padding:0 18px" onclick="ed(subK('${t}'))">Tambah</button><button type="button" class="b ib" aria-label="Opsi lainnya" aria-haspopup="menu" onclick="openPm(this,subK('${t}'))">${ic("dots")}</button></span></div><div class="ft" role="group" aria-label="${title}">${opts.map(([v, l]) => `<button type="button" data-f="${v}" class="${subK(t) == v ? "on" : ""}" aria-pressed="${subK(t) == v}" onclick="setSub('${t}','${v}')">${l}</button>`).join("")}<i class="fi" aria-hidden="true"></i></div>`,
  totRow = (t, v, c) => {
    c = c || "var(--ac)";
    return `<div class="row2" style="margin:6px -10px -6px;padding:13px 10px;border-radius:12px;background:color-mix(in srgb,${c} 12%,transparent);font-variant-numeric:tabular-nums"><span style="color:${c};font-weight:600">${t}</span><b style="color:${c};white-space:nowrap">${R(v)}</b></div>`;
  },
  nmRow = (k, a, c) =>
    `<div class="r" style="padding:15px 0" data-k="${k}" data-id="${a.id}" role="button" tabindex="0" onclick="ed('${k}','${a.id}')"><div style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${bn(a)}</div><b${c ? ` class="${c}"` : ""} style="white-space:nowrap;font-variant-numeric:tabular-nums">${R(a.m)}</b></div>`,
  asRow = (a) => nmRow("aset", a, "gi"),
  dRow = (k, a) =>
    `<div class="r" style="padding:15px 0" onclick="ed('${k}','${a.id}')"><div style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${bn(a)}</div><b style="white-space:nowrap;font-variant-numeric:tabular-nums">${R(a.m)}</b></div>`,
  tgRow = (t) =>
    `<div class="r" style="padding:13px 0" data-k="tg" data-id="${t.id}" role="button" tabindex="0" onclick="ed('tg','${t.id}')"><div style="flex:1;min-width:0;overflow-wrap:anywhere;white-space:pre-wrap">${bn(t)}</div></div>`,
  tgCard = ([h, t, sub]) => {
    const l = S.tg.filter((x) => (x.h || "s") == h);
    return `<div class="c tgc" id="tgc_${h}" onclick="tgAdd(event,'${h}')"><div class="tgzh" role="button" tabindex="0" aria-label="Tambah target ${sub}" onkeydown="if(event.key=='Enter'||event.key==' '){event.preventDefault();tgAdd(event,'${h}')}">${sub}</div>${l.length ? l.map(tgRow).join("") : '<div class="em" style="padding:12px 8px"><span class="mu">Belum ada catatan.</span></div>'}</div>`;
  },
  kkList = () =>
    kk == "subs"
      ? `<div class="c" id="sll">${S.subs.length ? S.subs.map((a) => nmRow("subs", a)).join("") + totRow("Jumlah", sumM(S.subs)) : em(ic("tx", 40), "Belum ada langganan", "Tekan Tambah untuk mencatat layanan berlangganan yang kamu bayar rutin.")}</div>`
      : kk == "need"
      ? `<div class="c" id="nll">${S.need.length ? S.need.map((a) => nmRow("need", a)).join("") + totRow("Jumlah", sumM(S.need)) : em(DOL, "Belum ada kebutuhan", "Tekan Tambah untuk mencatat kebutuhan yang perlu kamu penuhi.")}</div>`
      : `<div class="c" id="wll">${S.bud.length ? S.bud.map((b) => wl(b)).join("") + totRow("Jumlah", sumM(S.bud)) : em(ic("wish", 40), "Keinginan masih kosong", "Tekan Tambah untuk mencatat barang yang ingin kamu beli.")}</div>`,
  alList = () =>
    av == "aset"
      ? `<div class="c" id="asl">${S.aset.length ? S.aset.map(asRow).join("") + totRow("Jumlah", sumM(S.aset), "var(--in)") : em(ic("aset", 40), "Belum ada aset", "Tekan Tambah untuk mencatat barang atau harta yang kamu miliki beserta harganya.")}</div>`
      : `<div class="c" id="lbl">${S.liab.length ? S.liab.map((a) => nmRow("liab", a, "go")).join("") + totRow("Jumlah", sumM(S.liab), "var(--out)") : em(ic("checkc", 40), "Belum ada liabilitas", "Tekan Tambah untuk mencatat utang atau tanggungan yang harus dibayar.")}</div>`,
  tgSec = () => `<div class="d-tg"><div class="g3">${HZ.map(tgCard).join("")}</div></div>`;
function tgAdd(e, h) {
  if (SEL || e.target.closest("[data-k]")) return;
  ed("tg", null, { h });
}

/* ---------- Panel ringkasan di sisi kanan (hanya tampil di layar laptop) ---------- */
const sideStat = (label, value, color) =>
    `<div class="side-stat"><span class="mu">${label}</span><b${color ? ` class="${color}"` : ""}>${value}</b></div>`,
  sideBox = (label, body) => `<aside class="side" aria-label="${label}">${body}</aside>`,
  /* Transaksi: pemasukan, pengeluaran, selisih, dan lima pengeluaran terbesar bulan ini */
  asideTx = () => {
    const [from, to] = rng("month"),
      income = sm("in", from, to),
      spent = sm("out", from, to),
      top = brk(from, to).slice(0, 5),
      max = top.length ? top[0][1] : 0;
    return sideBox(
      "Ringkasan bulan ini",
      `<h2>Bulan ini</h2>${sideStat("Pemasukan", R(income), "gi")}${sideStat("Pengeluaran", R(spent), "go")}${sideStat("Selisih", R(income - spent))}` +
        (top.length
          ? `<h2 class="side-sub">Pengeluaran terbesar</h2>${top
              .map(
                ([name, v]) =>
                  `<div class="side-bar"><div class="row2"><span>${U(name)}</span><b>${R(v)}</b></div>${pb(pc(v, max), "var(--out)")}</div>`,
              )
              .join("")}`
          : ""),
    );
  },
  /* Rencana: total langganan, kebutuhan, dan keinginan, lalu dibandingkan dengan saldo */
  asideBud = () => {
    const subs = sumM(S.subs),
      need = sumM(S.need),
      want = sumM(S.bud),
      balance = total(),
      tone = (v) => (v < 0 ? "go" : "gi");
    return sideBox(
      "Ringkasan rencana",
      `<h2>Ringkasan rencana</h2>${sideStat("Langganan", R(subs))}${sideStat("Kebutuhan", R(need))}${sideStat("Keinginan", R(want))}${sideStat("Jumlah", R(subs + need + want))}<h2 class="side-sub">Dibanding saldo</h2>${sideStat("Saldo", R(balance))}${sideStat("Sisa setelah langganan", R(balance - subs), tone(balance - subs))}${sideStat("Sisa setelah kebutuhan", R(balance - subs - need), tone(balance - subs - need))}${sideStat("Sisa setelah semua", R(balance - subs - need - want), tone(balance - subs - need - want))}`,
    );
  },
  /* Neraca: aset dikurangi liabilitas menjadi kekayaan bersih */
  asideAset = () => {
    const assets = sumM(S.aset),
      debts = sumM(S.liab);
    return sideBox(
      "Ringkasan neraca",
      `<h2>Ringkasan neraca</h2>${sideStat("Aset", R(assets), "gi")}${sideStat("Liabilitas", R(debts), "go")}${sideStat("Kekayaan bersih", R(assets - debts))}<h2 class="side-sub">Liabilitas terhadap aset</h2><div class="side-bar"><div class="row2"><span>${assets ? pc(debts, assets) : 0}%</span></div>${pb(assets ? pc(debts, assets) : 0, "var(--out)")}</div>`,
    );
  };

function donut(l) {
  const t = l.reduce((a, x) => a + x[1], 0);
  if (!t) return '<p class="mu">Belum ada pengeluaran di periode ini.</p>';
  let a = 0;
  const g = l
    .map((x, i) => {
      const s = a;
      a += (x[1] / t) * 100;
      return `${PAL[i % 9]} ${s}% ${a}%`;
    })
    .join(",");
  return `<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div class="dn zi" style="background:conic-gradient(${g})"></div><div style="flex:1;min-width:150px">${l
    .slice(0, 6)
    .map(
      (x, i) =>
        `<div style="display:flex;gap:8px;font-size:13px;padding:3px 0"><span style="color:${PAL[i % 9]}">●</span><span style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${U(x[0])}</span><b>${k(x[1])}</b></div>`,
    )
    .join("")}</div></div>`;
}
function mchart() {
  const n = new Date(),
    a = [];
  for (let m = -5; m <= 0; m++) {
    const f = new Date(n.getFullYear(), n.getMonth() + m, 1),
      s = ymd(f),
      e = ymd(new Date(f.getFullYear(), f.getMonth() + 1, 0));
    a.push([f.toLocaleDateString(LC(), { month: "short" }), sm("in", s, e), sm("out", s, e)]);
  }
  const mx = Math.max(1, ...a.flatMap((x) => [x[1], x[2]]));
  return `<svg viewBox="0 0 330 145" width="100%">${a
    .map((x, i) => {
      const X = 12 + i * 53,
        h1 = (x[1] / mx) * 105,
        h2 = (x[2] / mx) * 105;
      return `<rect class="i gr" style="--d:${i * 60}ms" x="${X}" y="${115 - h1}" width="20" height="${h1}" rx="4"/><rect class="o gr" style="--d:${i * 60 + 30}ms" x="${X + 22}" y="${115 - h2}" width="20" height="${h2}" rx="4"/><text x="${X + 21}" y="134" text-anchor="middle" font-size="11" fill="var(--mu)">${x[0]}</text>`;
    })
    .join(
      "",
    )}</svg><div class="mu"><span class="gi">■</span> Pemasukan &nbsp;<span class="go">■</span> Pengeluaran</div>`;
}
function trend(s, e) {
  const mo = P(e) - P(s) > 92 * 864e5,
    m = {},
    ks = [];
  S.tx
    .filter((x) => x.t == "out" && inR(x, s, e))
    .forEach((x) => {
      const q = mo ? x.d.slice(0, 7) : x.d;
      m[q] = (m[q] || 0) + x.m;
    });
  if (mo) {
    for (let d = P(s.slice(0, 7) + "-01"); d <= P(e); d.setMonth(d.getMonth() + 1))
      ks.push(ymd(d).slice(0, 7));
  } else for (let d = s; d <= e; d = add(d, 1)) ks.push(d);
  const v = ks.map((q) => m[q] || 0),
    mx = Math.max(1, ...v),
    w = 300 / v.length;
  return `<svg viewBox="0 0 300 100" width="100%" height="110" preserveAspectRatio="none">${v.map((y, i) => `<rect class="o gr" style="--d:${Math.min(i * 12, 360)}ms" x="${i * w + w * 0.12}" y="${98 - (y / mx) * 95}" width="${w * 0.76}" height="${(y / mx) * 95}" rx="1.5"/>`).join("")}</svg><div class="row2 mu"><span>${fd(s, 1)}</span><span>Puncak ${R(mx)}/${mo ? "bln" : "hari"}</span><span>${fd(e, 1)}</span></div>`;
}
