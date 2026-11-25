/* Data aplikasi: state `S`, simpan ke localStorage, data contoh, migrasi, dan hitungan saldo/ringkasan. */

try {
  if (localStorage.getItem(KEY) === null) {
    var _o = localStorage.getItem("duitku-v1");
    if (_o !== null) localStorage.setItem(KEY, _o);
  }
} catch (_) {}
const PL = { day: "Harian", week: "Mingguan", month: "Bulanan", year: "Tahunan" },
  FQ = { d: "Harian", w: "Mingguan", m: "Bulanan", y: "Tahunan" },
  PAL = [100, 84, 70, 58, 48, 40, 33, 27, 22].map(
    (x) => `color-mix(in srgb,var(--out) ${x}%,var(--cd))`,
  );

function seed() {
  const dt = (m, d) => {
    const t = new Date(),
      l = new Date(t.getFullYear(), t.getMonth() + m + 1, 0).getDate();
    let x = Math.min(d, l);
    if (!m) x = Math.min(x, t.getDate());
    return ymd(new Date(t.getFullYear(), t.getMonth() + m, x));
  };
  const S = {
    acc: [
      ["bca", "BCA", 6e6],
      ["mandiri", "Mandiri", 2e6],
      ["gopay", "GoPay", 15e4],
      ["cash", "Cash", 3e5],
      ["cc", "Kartu Kredit", 0],
    ].map(([id, n, b]) => ({ id, n, b })),
    cat: [
      ...[
        "gaji:Gaji",
        "bonus:Bonus",
        "freelance:Freelance",
        "invest:Investasi",
        "in_lain:Lainnya",
      ].map((x) => x.split(":").concat("in")),
      ...[
        "makan:Makanan",
        "transport:Transportasi",
        "belanja:Belanja",
        "tagihan:Tagihan",
        "hibur:Hiburan",
        "sehat:Kesehatan",
        "didik:Pendidikan",
        "rumah:Kebutuhan rumah",
        "out_lain:Lainnya",
      ].map((x) => x.split(":").concat("out")),
    ].map(([id, n, t]) => ({ id, n, t })),
    tx: [],
    bud: [],
    goal: [],
    need: [],
    subs: [],
    aset: [],
    liab: [],
    tg: [],
  };
  const base = [
    ["in", 95e5, "gaji", "bca", 1, "Gaji bulanan"],
    ["out", 18e5, "rumah", "bca", 2, "Sewa kos"],
    ["out", 35e4, "tagihan", "bca", 5, "Internet & listrik"],
    ["out", 85e3, "makan", "gopay", 3, "Makan siang"],
    ["out", 42e4, "makan", "cash", 9, "Belanja dapur"],
    ["out", 65e3, "transport", "gopay", 4, "Ojek online"],
    ["out", 15e4, "transport", "mandiri", 12, "Bensin"],
    ["out", 25e4, "hibur", "cc", 15, "Nonton & kopi"],
    ["out", 6e5, "belanja", "cc", 18, "Belanja bulanan"],
    ["in", 15e5, "freelance", "mandiri", 10, "Proyek freelance"],
  ];
  for (let m = -5; m <= 0; m++)
    base.forEach(([t, v, c, a, d, n], i) => {
      if (t == "in" && c == "freelance" && !m) return;
      const f = ["gaji", "rumah", "tagihan"].includes(c) ? 1 : 0.8 + (((m + 9) * (i + 3)) % 5) / 10;
      S.tx.push({ id: uid(), t, m: Math.round((v * f) / 5e3) * 5e3, c, a, d: dt(m, d), note: n });
    });
  [
    ["Sepatu lari", 85e4],
    ["Headphone", 12e5],
    ["Tas ransel", 45e4],
  ].forEach(([n, m]) => S.bud.push({ id: uid(), n, m }));
  [
    ["Dana darurat", 2e7, 85e5, 200],
    ["Laptop", 15e6, 75e5, 150],
    ["Liburan", 8e6, 2e6, 120],
    ["Motor", 3e7, 4e6, 540],
  ].forEach(([n, t, s, d]) => S.goal.push({ id: uid(), n, t, s, d: add(today, d) }));
  [
    ["Biaya sekolah anak", 6e6],
    ["Servis motor", 15e5],
    ["Asuransi kesehatan", 48e5],
  ].forEach(([n, m]) => S.need.push({ id: uid(), n, m }));
  [
    ["Netflix", 54e3],
    ["Spotify", 55e3],
    ["YouTube Premium", 59e3],
  ].forEach(([n, m]) => S.subs.push({ id: uid(), n, m }));
  [
    ["Motor", 18e6],
    ["Laptop", 12e6],
    ["Emas 10 gram", 15e6],
    ["Reksa dana", 8e6],
  ].forEach(([n, m]) => S.aset.push({ id: uid(), n, m }));
  [
    ["Cicilan HP", 24e5],
    ["Tagihan kartu kredit", 85e4],
    ["Utang ke Budi", 5e5],
  ].forEach(([n, m]) => S.liab.push({ id: uid(), n, m }));
  [
    ["Lunasi cicilan HP", "s"],
    ["Dana darurat 6 bulan gaji", "s"],
    ["Liburan ke Jepang", "s"],
    ["DP rumah", "m"],
    ["Ganti mobil", "m"],
    ["Dana pensiun", "l"],
    ["Dana pendidikan anak", "l"],
  ].forEach(([n, h]) => S.tg.push({ id: uid(), n, h }));
  return S;
}
let S;
var SEEDED = 0;
try {
  S = JSON.parse(localStorage.getItem(KEY));
} catch (e) {}
if (!S) {
  S = seed();
  SEEDED = 1;
}
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
    /* sync.js (jika sudah dimuat) menjadwalkan pengiriman ke cloud */
    if (window.syncOnSave) window.syncOnSave();
  } catch (e) {
    if (!svWarn) {
      svWarn = 1;
      toast(
        "Penyimpanan gagal, data tidak tersimpan. Ekspor data untuk cadangan.",
        null,
        null,
        8000,
      );
    }
  }
};

const U = (x) => "\u2063" + esc(x) + "\u2064",
  bn = (b) => U(b.n || "—"),
  cn = (id) => esc((S.cat.find((c) => c.id == id) || { n: "—" }).n),
  an = (id) => esc((S.acc.find((a) => a.id == id) || { n: "—" }).n),
  inR = (t, s, e) => t.d >= s && t.d <= e,
  sm = (t, s, e, c) =>
    S.tx.filter((x) => x.t == t && inR(x, s, e) && (!c || x.c == c)).reduce((a, x) => a + x.m, 0),
  brk = (s, e) => {
    const m = {},
      n = {};
    S.tx
      .filter((x) => x.t == "out" && inR(x, s, e))
      .forEach((x) => {
        const q = (x.note || "").trim() || (S.cat.find((c) => c.id == x.c) || {}).n || "Tanpa nama",
          k = q.toLowerCase();
        n[k] = n[k] || q;
        m[k] = (m[k] || 0) + x.m;
      });
    return Object.entries(m)
      .map(([k, v]) => [n[k], v])
      .sort((a, b) => b[1] - a[1]);
  },
  oldBal = (id) => {
    const a = S.acc.find((x) => x.id == id);
    if (!a) return 0;
    let b = +a.b || 0;
    const bt = a.bt || 0,
      bd = ymd(new Date(bt));
    S.tx.forEach((t) => {
      if (!(t.d > bd || (t.d == bd && (t.ts || 0) > bt)) || t.d > today) return;
      if (t.t == "in" && t.a == id) b += t.m;
      if (t.t == "out" && t.a == id) b -= t.m;
      if (t.t == "tf") {
        if (t.a == id) b -= t.m;
        if (t.to == id) b += t.m;
      }
    });
    return b;
  },
  txSum = () =>
    S.tx.reduce(
      (s, t) => (t.d > today ? s : t.t == "in" ? s + t.m : t.t == "out" ? s - t.m : s),
      0,
    ),
  accBal = (id) => {
    const a = S.acc.find((x) => x.id == id);
    return a ? (+a.b || 0) + txSum() : 0;
  },
  total = () => S.acc.reduce((a, x) => a + accBal(x.id), 0);
function migrate() {
  delete S.pf;
  ["bud", "goal", "need", "subs", "aset", "liab", "tg"].forEach((k) => {
    if (!Array.isArray(S[k])) S[k] = [];
  });
  S.need.forEach((x) => {
    if (x.m == null) x.m = +x.t || 0;
  });
  (S.bud || []).forEach((b) => {
    if (!b.n) {
      const c = (S.cat || []).find((x) => x.id == b.c);
      b.n = c ? c.n : "";
    }
  });
  (S.acc || []).forEach((a) => {
    a.bt = a.bt || Date.now();
  });
  if (!(S.acc && S.acc.length == 1 && S.acc[0].id == "main")) {
    const tt = S.acc && S.acc.length ? S.acc.reduce((a, x) => a + oldBal(x.id), 0) : 0;
    S.acc = [{ id: "main", n: "Saldo", b: tt, bt: Date.now() }];
    S.tx = (S.tx || []).filter((t) => t.t != "tf");
    S.tx.forEach((t) => {
      t.a = "main";
      delete t.to;
    });
  }
  if (S.v != 2) {
    const a = S.acc[0];
    a.b = oldBal(a.id) - txSum();
    S.v = 2;
  }
}
migrate();
save();
/* Tandai data contoh bawaan, supaya sinkronisasi tahu bahwa isinya belum data asli pengguna */
if (SEEDED)
  try {
    localStorage.setItem("finance-seed-v1", JSON.stringify(S));
  } catch (_) {}
