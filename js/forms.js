/* Form tambah/ubah data (sheet), konfigurasi field tiap jenis data, validasi, dan simpan/hapus. */

const catO = (t) => S.cat.filter((c) => c.t == t).map((c) => [c.id, c.n]),
  accO = () => S.acc.map((a) => [a.id, a.n]),
  SEG = [
    ["out", "Pengeluaran"],
    ["in", "Pemasukan"],
  ];
const CFG = {
  tx: {
    t: "transaksi",
    f: [
      { k: "t", l: "Jenis", type: "seg", o: () => SEG },
      { k: "note", l: "Nama", type: "text", af: 1 },
      { k: "m", l: "Nominal (Rp)", type: "number" },
      { k: "d", l: "Tanggal", type: "date" },
    ],
    d: () => ({ t: "out", m: "", c: "", a: "main", d: ymd(new Date()), note: "" }),
    ok: (v) => {
      v.a = "main";
      up("tx", v);
    },
  },
  acc: {
    t: "saldo",
    nodel: 1,
    f: [
      { k: "b", l: "Saldo saat ini (Rp)", type: "number", af: 1 },
      {
        k: "_n",
        type: "note",
        l: "Saldo dihitung dari semua transaksi sampai hari ini. Ubah angka ini untuk menyesuaikan dengan saldo aslimu.",
      },
    ],
    d: () => ({ n: "Saldo", b: "" }),
    ok: (v) => {
      v.b = v.b - txSum();
      v.bt = Date.now();
      up("acc", v);
    },
  },
  bud: {
    t: "keinginan",
    f: [
      { k: "n", l: "Nama barang", type: "text", af: 1 },
      { k: "m", l: "Harga (Rp)", type: "number" },
    ],
    d: () => ({ n: "", m: "" }),
  },
  need: {
    t: "kebutuhan",
    f: [
      { k: "n", l: "Nama kebutuhan", type: "text", af: 1 },
      { k: "m", l: "Harga (Rp)", type: "number" },
    ],
    d: () => ({ n: "", m: "" }),
  },
  aset: {
    t: "aset",
    f: [
      { k: "n", l: "Nama aset", type: "text", af: 1 },
      { k: "m", l: "Harga / nilai (Rp)", type: "number" },
    ],
    d: () => ({ n: "", m: "" }),
  },
  liab: {
    t: "liabilitas",
    f: [
      { k: "n", l: "Nama utang / tanggungan", type: "text", af: 1 },
      { k: "m", l: "Nominal (Rp)", type: "number" },
    ],
    d: () => ({ n: "", m: "" }),
  },
  tg: {
    t: "target",
    f: [
      {
        k: "h",
        l: "Jangka waktu",
        type: "seg",
        show: () => false,
        o: () => HZ.map((x) => [x[0], x[3]]),
      },
      { k: "n", l: "Tulis target yang ingin kamu capai", type: "text", af: 1 },
    ],
    d: () => ({ n: "", h: "s" }),
  },
  goal: {
    t: "tujuan",
    nodel: 1,
    f: [
      { k: "n", l: "Nama target", type: "text" },
      { k: "t", l: "Target nominal (Rp)", type: "number" },
      { k: "s", l: "Sudah terkumpul (Rp)", type: "number" },
      { k: "d", l: "Target tanggal", type: "date" },
    ],
    d: () => ({ n: "", t: "", s: 0, d: ymd(new Date()) }),
  },
};
const up = (key, v) => {
  const a = S[key],
    i = a.findIndex((x) => x.id == v.id);
  if (i >= 0) a[i] = { ...v };
  else {
    const id = uid();
    NEWID = id;
    setTimeout(() => {
      if (NEWID == id) NEWID = null;
    }, 2500);
    a.push({ ...v, id, ...(key == "tx" && { ts: Date.now() }) });
  }
};
function ed(kd, id, ov) {
  const c = CFG[kd],
    o = id ? S[kd].find((x) => x.id == id) : null;
  selOff();
  closeRow();
  if (kd != "acc" && !S.acc.length) return al("Tambahkan akun terlebih dulu.");
  form(
    (o ? "Ubah " : "Tambah ") + c.t,
    c.f,
    o ? { ...o, ...(kd == "acc" && { b: accBal(o.id) }) } : { ...c.d(), ...ov },
    (v) => {
      return c.ok ? c.ok(v) : up(kd, v);
    },
    o && !c.nodel ? (v) => (c.del ? c.del(v) : (S[kd] = S[kd].filter((x) => x.id != v.id))) : 0,
    kd,
  );
}
function dep(id) {
  const g = S.goal.find((x) => x.id == id);
  form(
    "Setor ke " + U(g.n),
    [{ k: "x", l: "Nominal setoran (Rp)", type: "number", af: 1 }],
    { x: "" },
    (v) => {
      g.s += v.x;
    },
  );
}
function depB(id) {
  const b = S.bud.find((x) => x.id == id);
  form(
    "Setor ke budget " + bn(b),
    [{ k: "x", l: "Nominal setoran (Rp)", type: "number", af: 1 }],
    { x: "" },
    (v) => {
      b.u = (+b.u || 0) + v.x;
    },
  );
}
const nf = (v) => {
    v = typeof v == "number" ? String(Math.round(v)) : String(v ?? "");
    const ng = v.trim().startsWith("-"),
      d = v.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
    return d ? (ng ? "-" : "") + "Rp" + d.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ng ? "-" : "";
  },
  pn = (v) => {
    v = String(v || "");
    const d = v.replace(/\D/g, "");
    return d ? (v.trim().startsWith("-") ? -1 : 1) * +d : 0;
  };
function fmtIn(e) {
  const n = e.value.slice(0, e.selectionStart).replace(/\D/g, "").length;
  e.value = nf(e.value);
  let c = 0,
    i = 0;
  for (; i < e.value.length && c < n; i++) if (/\d/.test(e.value[i])) c++;
  e.setSelectionRange(i, i);
}
let F = null;
function form(title, fields, v, ok, del, kd) {
  F = { title, fields, v, ok, del, kd };
  drawF(1);
}
function collect() {
  const f = $("#fm");
  if (!f || !F) return;
  F.fields.forEach((x) => {
    const e = f.elements[x.k];
    if (e && x.type != "file") F.v[x.k] = x.type == "number" ? pn(e.value) : e.value;
  });
}
function drawF(sk) {
  if (!F) return;
  if (!sk) collect();
  const { title, fields, v, del } = F;
  $("#mo").innerHTML =
    `<div class="sh${F.kd == "tg" ? " tall" : ""}" role="dialog" aria-modal="true" aria-labelledby="fh" tabindex="-1"><form id="fm" autocomplete="off" onsubmit="return sub(event)"><h3 id="fh">${title}</h3>${fields
      .filter((x) => !x.show || x.show(v))
      .map((x) => {
        const l = typeof x.l == "function" ? x.l(v) : x.l;
        let h;
        if (x.type == "note")
          return `<p class="mu" style="margin:12px 0 0;font-size:13px">${l}</p>`;
        if (x.type == "seg")
          h = `<div class="seg tbs" role="group" aria-labelledby="l_${x.k}">${x
            .o(v)
            .map(
              ([a, b]) =>
                `<button type="button" class="${v[x.k] == a ? "on" : ""}" data-v="${a}" aria-pressed="${v[x.k] == a}" onclick="sg('${x.k}','${a}')">${b}</button>`,
            )
            .join("")}</div>`;
        else if (x.type == "select")
          h = `<select id="f_${x.k}" name="${x.k}" onchange="drawF()">${x
            .o(v)
            .map(
              ([a, b]) =>
                `<option value="${esc(a)}"${v[x.k] == a ? " selected" : ""}>${esc(b)}</option>`,
            )
            .join("")}</select>`;
        else if (x.type == "date") h = dpField(x.k, v[x.k] || ymd(new Date()));
        else {
          const nm = x.type == "number";
          h = `<input id="f_${x.k}" name="${x.k}" type="${nm ? "text" : x.type}" value="${esc(nm ? nf(v[x.k]) : v[x.k])}" autocomplete="off" autocorrect="off" spellcheck="false" ${nm ? 'inputmode="numeric" placeholder="Rp0" oninput="fmtIn(this)"' : ""} ${x.opt ? "" : "required"}>`;
        }
        return x.type == "seg"
          ? `<label id="l_${x.k}" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">${l}</label>${h}`
          : `<label for="f_${x.k}">${l}</label>${h}`;
      })
      .join(
        "",
      )}<div class="act"><button type="button" class="b" onclick="closeF()">Batal</button><button class="b p">Simpan</button></div></form></div>`;
  openLayer($("#mo"));
}
function sg(key, x) {
  if (!F) return;
  collect();
  F.v[key] = x;
  if (key == "t" && x != "tf" && F.fields.some((f) => f.k == "c"))
    F.v.c = (S.cat.find((c) => c.t == x) || {}).id;
  drawF(1);
}
function sub(e) {
  e.preventDefault();
  if (!F) return false;
  collect();
  if (F.ok(F.v) === false) return false;
  save();
  vib(12);
  closeF();
  render();
  return false;
}
function delF() {
  cf("Hapus data ini?", () => {
    if (!F) return;
    const f = F,
      id = f.v.id;
    snap();
    closeF();
    animRemove(f.kd, new Set([id]), () => {
      f.del(f.v);
      save();
      render();
      delToast(1);
      vib([10, 30, 10]);
    });
  });
}
function closeF() {
  closeLayer($("#mo"));
  F = null;
}
