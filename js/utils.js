/* Fungsi bantu umum: format Rupiah, tanggal, escape HTML, ikon SVG. */

let tst = 0,
  UNDO = null,
  svWarn = 0,
  NEWID = null,
  txLim = 100;
const ic = (n, z = 20, c = "") =>
  `<svg class="ni${c ? " " + c : ""}" width="${z}" height="${z}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const $ = (s) => document.querySelector(s),
  uid = () => Math.random().toString(36).slice(2, 9),
  R = (n) =>
    S && S.hd
      ? "Rp•••••"
      : (n < 0 ? "-" : "") + "Rp" + Math.abs(Math.round(n)).toLocaleString("id-ID"),
  esc = (s) =>
    String(s ?? "").replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    ),
  ymd = (d) => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10),
  P = (s) => new Date(s + "T00:00"),
  today = ymd(new Date()),
  add = (s, n) => {
    const d = P(s);
    d.setDate(d.getDate() + n);
    return ymd(d);
  },
  fd = (s, y) =>
    P(s).toLocaleDateString(
      LC(),
      y ? { day: "numeric", month: "short", year: "numeric" } : { day: "numeric", month: "short" },
    ),
  k = (x) =>
    S && S.hd
      ? "•••"
      : x >= 1e6
        ? (x / 1e6).toFixed(1).replace(".0", "") + "jt"
        : x >= 1e3
          ? Math.round(x / 1e3) + "rb"
          : Math.round(x),
  pc = (a, b) => (b ? Math.round((a / b) * 100) : 0),
  KEY = "finance-v1";
