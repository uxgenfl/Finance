/* Logika penggabungan data untuk sinkronisasi. Murni: tanpa browser dan tanpa jaringan, jadi bisa diuji di Node.

   Penggabungan tiga arah per item (dikenali lewat `id`), dibandingkan dengan `base`, yaitu keadaan terakhir
   yang diketahui sama di cloud dan di perangkat ini:
   - hanya satu sisi yang berubah: pakai sisi itu
   - dihapus di satu sisi, tidak diubah di sisi lain: hapus
   - dihapus di satu sisi, tapi diubah di sisi lain: pertahankan yang diubah (aman untuk data uang)
   - diubah di kedua sisi: pakai yang lebih baru (`pref` = "l" lokal, "r" cloud)
   Tanpa base (sinkronisasi pertama) tidak pernah ada penghapusan: hasilnya gabungan kedua sisi. */

const SyncMerge = (() => {
  const KEYS = ["acc", "cat", "tx", "bud", "goal", "need", "subs", "aset", "liab", "tg"],
    DATA = ["tx", "bud", "goal", "need", "subs", "aset", "liab", "tg"];

  /* JSON dengan urutan kunci tetap, supaya dua objek yang sama isinya selalu menghasilkan teks yang sama */
  const canon = (v) =>
    JSON.stringify(v, (k, x) =>
      x && typeof x == "object" && !Array.isArray(x)
        ? Object.keys(x)
            .sort()
            .reduce((a, y) => ((a[y] = x[y]), a), {})
        : x,
    );

  /* Hanya bagian data keuangan. Pengaturan perangkat (tema, bahasa, getar, dll) tidak ikut disinkronkan */
  const pick = (o) => {
    const r = {};
    KEYS.forEach((k) => (r[k] = o && Array.isArray(o[k]) ? o[k] : []));
    return r;
  };

  /* Apakah ada isi selain kategori dan saldo awal */
  const has = (o) => DATA.some((k) => o[k].length);

  function mergeList(b, l, r, pref) {
    const idx = (a) => {
        const m = new Map();
        (a || []).forEach((x) => x && x.id != null && m.set(x.id, x));
        return m;
      },
      B = idx(b),
      L = idx(l),
      R = idx(r),
      same = (x, y) => canon(x) === canon(y),
      out = new Map();
    new Set([...L.keys(), ...R.keys(), ...B.keys()]).forEach((id) => {
      const x = L.get(id),
        y = R.get(id),
        z = B.get(id);
      let v = null;
      if (!b || z === undefined) {
        /* tidak ada di base: item baru di salah satu sisi atau di keduanya */
        v = x && y ? (same(x, y) || pref == "l" ? x : y) : x || y;
      } else if (x && y) {
        v = same(x, z) ? y : same(y, z) ? x : same(x, y) || pref == "l" ? x : y;
      } else if (x) {
        v = same(x, z) ? null : x;
      } else if (y) {
        v = same(y, z) ? null : y;
      }
      if (v) out.set(id, v);
    });
    /* Urutan mengikuti sisi yang lebih baru, item dari sisi lain ditaruh di belakang */
    const res = [],
      seen = new Set();
    (pref == "l" ? [l, r] : [r, l]).forEach((a) =>
      (a || []).forEach((x) => {
        if (x && out.has(x.id) && !seen.has(x.id)) {
          seen.add(x.id);
          res.push(out.get(x.id));
        }
      }),
    );
    return res;
  }

  /* b boleh null (belum pernah sinkron). Mengembalikan objek baru berisi KEYS. */
  function merge(b, l, r, pref) {
    const o = {};
    KEYS.forEach((k) => (o[k] = mergeList(b ? b[k] : null, l[k], r[k], pref)));
    return o;
  }

  return { KEYS, canon, pick, has, merge };
})();
if (typeof module !== "undefined") module.exports = SyncMerge;
