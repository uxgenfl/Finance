/* Ekspor/impor cadangan, tema terang/gelap, font, dan preferensi. */

const backupJSON = () =>
  JSON.stringify({ app: "nexus-finance", v: 2, at: new Date().toISOString(), data: S }, null, 1);
function expData() {
  sheet(
    "Ekspor data",
    `<p class="mu" style="margin:6px 0 10px">Simpan file cadangan atau salin teksnya. Impor kembali kapan saja untuk memulihkan data.</p><textarea id="bk" readonly rows="7" aria-label="Isi cadangan" onfocus="this.select()"></textarea>`,
    `<button type="button" class="b" onclick="closeF()">Tutup</button><button type="button" class="b" onclick="cpData()">Salin</button><button type="button" class="b p" onclick="dlData()">Unduh</button>`,
  );
  $("#bk").value = backupJSON();
}
function cpData() {
  const t = $("#bk");
  if (!t) return;
  t.select();
  const old = () => {
    try {
      document.execCommand("copy")
        ? toast("Disalin ke clipboard")
        : toast("Tekan lama teks lalu pilih Salin");
    } catch (_) {
      toast("Tekan lama teks lalu pilih Salin");
    }
  };
  try {
    navigator.clipboard.writeText(t.value).then(() => toast("Disalin ke clipboard"), old);
  } catch (_) {
    old();
  }
}
function dlData() {
  const t = $("#bk");
  if (!t) return;
  try {
    const b = new Blob([t.value], { type: "application/json" }),
      u = URL.createObjectURL(b),
      a = document.createElement("a");
    a.href = u;
    a.download = `nexus-finance-${today}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 4000);
    toast("Cadangan diunduh");
  } catch (_) {
    toast("Gagal mengunduh. Gunakan tombol Salin.");
  }
}
function impData() {
  sheet(
    "Impor data",
    `<p class="mu" style="margin:6px 0 10px">Pilih file cadangan (.json) atau tempel isinya. Data saat ini akan <b>diganti</b>.</p><input type="file" id="bf" accept=".json,application/json" onchange="impFile(this)" aria-label="File cadangan"><label for="bt">Atau tempel isi cadangan</label><textarea id="bt" rows="5" placeholder="Tempel isi file cadangan di sini"></textarea>`,
    `<button type="button" class="b" onclick="closeF()">Batal</button><button type="button" class="b p" onclick="doImp()">Pulihkan</button>`,
  );
}
function impFile(i) {
  const f = i.files[0];
  if (!f) return;
  if (f.size > 5e6) {
    toast("File terlalu besar");
    return;
  }
  const r = new FileReader();
  r.onload = () => {
    $("#bt").value = r.result;
  };
  r.readAsText(f);
}
function clean(o) {
  if (!o || typeof o != "object" || ![o.tx, o.cat, o.bud, o.goal].every(Array.isArray)) return null;
  const id = (x) => typeof x == "string" && /^[\w-]{1,40}$/.test(x),
    dt = (x) => typeof x == "string" && /^\d{4}-\d{2}-\d{2}$/.test(x),
    nm = (x) => (x !== "" && x !== null && Number.isFinite(+x) ? +x : null),
    st = (x, n) => String(x ?? "").slice(0, n);
  const out = { acc: [], cat: [], tx: [], bud: [], goal: [], need: [], subs: [], aset: [], liab: [], tg: [] };
  for (const c of o.cat) {
    if (!c || !id(c.id) || (c.t != "in" && c.t != "out")) return null;
    out.cat.push({ id: c.id, n: st(c.n, 60), t: c.t });
  }
  for (const t of o.tx) {
    if (!t || !id(t.id) || !dt(t.d) || !["in", "out", "tf"].includes(t.t) || nm(t.m) === null)
      return null;
    out.tx.push({
      id: t.id,
      t: t.t,
      m: +t.m,
      c: st(t.c, 40),
      a: st(t.a, 40),
      ...(t.to ? { to: st(t.to, 40) } : {}),
      d: t.d,
      note: st(t.note, 200),
      ts: nm(t.ts) || 0,
    });
  }
  for (const b of o.bud) {
    if (!b || !id(b.id) || nm(b.m) === null) return null;
    out.bud.push({
      id: b.id,
      n: st(b.n, 80) || (out.cat.find((c) => c.id == b.c) || {}).n || "",
      c: st(b.c, 40),
      m: +b.m,
      u: nm(b.u) || 0,
    });
  }
  for (const g of o.goal) {
    if (!g || !id(g.id) || !dt(g.d) || nm(g.t) === null) return null;
    out.goal.push({ id: g.id, n: st(g.n, 80), t: +g.t, s: nm(g.s) || 0, d: g.d });
  }
  for (const g of Array.isArray(o.need) ? o.need : []) {
    if (!g || !id(g.id)) return null;
    out.need.push({ id: g.id, n: st(g.n, 80), m: nm(g.m) ?? nm(g.t) ?? 0 });
  }
  for (const g of Array.isArray(o.subs) ? o.subs : []) {
    if (!g || !id(g.id)) return null;
    out.subs.push({ id: g.id, n: st(g.n, 80), m: nm(g.m) ?? 0 });
  }
  for (const a of Array.isArray(o.aset) ? o.aset : []) {
    if (!a || !id(a.id) || nm(a.m) === null) return null;
    out.aset.push({ id: a.id, n: st(a.n, 80), m: +a.m });
  }
  for (const a of Array.isArray(o.liab) ? o.liab : []) {
    if (!a || !id(a.id) || nm(a.m) === null) return null;
    out.liab.push({ id: a.id, n: st(a.n, 80), m: +a.m });
  }
  for (const t of Array.isArray(o.tg) ? o.tg : []) {
    if (!t || !id(t.id)) return null;
    out.tg.push({ id: t.id, n: st(t.n, 200), h: ["s", "m", "l"].includes(t.h) ? t.h : "s" });
  }
  for (const a of Array.isArray(o.acc) ? o.acc : []) {
    if (!a || !id(a.id)) return null;
    out.acc.push({ id: a.id, n: st(a.n, 60), b: nm(a.b) || 0, bt: nm(a.bt) || 0 });
  }
  if (o.nf && typeof o.nf == "object") {
    const q = o.nf;
    out.nf = {
      d: q.d ? 1 : 0,
      dt: /^\d{2}:\d{2}$/.test(q.dt) ? q.dt : "20:00",
      w: q.w ? 1 : 0,
      wp: [70, 80, 90].includes(+q.wp) ? +q.wp : 80,
      ld: st(q.ld, 10),
      lw: st(q.lw, 10),
    };
  }
  if (o.v === 2) out.v = 2;
  if (["auto", "light", "dark"].includes(o.theme)) out.theme = o.theme;
  if (o.ts) out.ts = 1;
  if (o.lang === "en") out.lang = "en";
  if (o.ff === "system") out.ff = "system";
  if (o.hd) out.hd = 1;
  if (o.vb === 0) out.vb = 0;
  if (o.an === 0) out.an = 0;
  if (["dash", "tx", "bud", "goal", "aset", "rep"].includes(o.st)) out.st = o.st;
  return out;
}
function doImp() {
  const raw = $("#bt") && $("#bt").value.trim();
  if (!raw) {
    al("Pilih file atau tempel isi cadangan dulu.");
    return;
  }
  let o;
  try {
    o = JSON.parse(raw);
  } catch (e) {
    al("Isi cadangan tidak valid (bukan JSON).");
    return;
  }
  const c = clean((o && o.data) || o);
  if (!c) {
    al("Format cadangan tidak dikenali atau datanya rusak.");
    return;
  }
  cf(
    `Ganti semua data dengan cadangan ini (${c.tx.length} transaksi)?`,
    () => {
      snap();
      S = c;
      migrate();
      save();
      closeF();
      applyTheme();
      render();
      toast("Data dipulihkan", "Urungkan", undoDo, 6000);
    },
    "Pulihkan",
  );
}
const ICO = { light: ic("moon"), dark: ic("sun") };
function setPref(k, v) {
  if (k == "hd") S.hd = v ? 1 : 0;
  else if (k == "vb") S.vb = v ? 1 : 0;
  else if (k == "an") {
    S.an = v ? 1 : 0;
    RM = OSRM || S.an === 0;
    document.documentElement.classList.toggle("na", S.an === 0);
  } else if (k == "st") S.st = v;
  else if (k == "theme") {
    S.theme = v ? "dark" : "light";
    S.ts = 1;
  }
  save();
  if (k == "theme") applyTheme(1);
  if (k == "hd") {
    Object.keys(shown).forEach((x) => delete shown[x]);
    render();
  }
  if (k == "vb" && v) vib(15);
}
function applyFont() {
  document.documentElement.removeAttribute("data-nxf");
}
function applyTheme(a) {
  applyFont();
  const h = document.documentElement,
    v = S.ts
      ? S.theme !== "dark"
        ? "light"
        : "dark"
      : matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
  const set = () => {
    h.setAttribute("data-nx", v);
  };
  const cb = document.getElementById("thm");
  if (cb) cb.checked = v === "dark";
  if (a && !RM && document.startViewTransition) {
    document.startViewTransition(set);
  } else {
    if (a && !RM) {
      h.classList.add("tt");
      setTimeout(() => h.classList.remove("tt"), 450);
    }
    set();
  }
  const tc = document.getElementById("tc");
  if (tc) tc.setAttribute("content", v === "dark" ? "#0B0C0E" : "#F7F7F8");
  const b = document.getElementById("tg");
  if (b) {
    b.innerHTML = ICO[v];
    const l = v === "dark" ? "Beralih ke tema terang" : "Beralih ke tema gelap";
    b.setAttribute("aria-label", l);
    b.title = l;
  }
}
try {
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
    if (!S.ts) applyTheme(1);
  });
} catch (_) {}
function toggleTheme() {
  S.theme = document.documentElement.getAttribute("data-nx") === "dark" ? "light" : "dark";
  S.ts = 1;
  save();
  applyTheme(1);
}
