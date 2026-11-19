/* Menu samping, panel Pengaturan (Bahasa, Kontrol data, Bantuan), dan pengingat. */

function openDw() {
  const d = $("#dw");
  if (d.classList.contains("on") || DK.matches) return;
  closeRow && closeRow();
  d._ret = document.activeElement;
  d.classList.add("on");
  void d.offsetWidth;
  d.classList.add("show");
  syncInert();
  raf2(() => d.querySelector(".pn2").focus({ preventScroll: true }));
}
function closeDw() {
  const d = $("#dw");
  if (!d.classList.contains("show")) return;
  d.classList.remove("show");
  syncInert();
  const r = d._ret;
  d._ret = null;
  if (r && r.isConnected && r.focus) r.focus({ preventScroll: true });
  setTimeout(
    () => {
      if (!d.classList.contains("show")) d.classList.remove("on");
    },
    RM ? 0 : 290,
  );
}
var NFT = 0;
function nfToast(m) {
  NFT = 1;
  toast(m, null, null, 5000);
  NFT = 0;
}
function nfSet(k, v) {
  S.nf = Object.assign({ d: 0, dt: "20:00", w: 0, wp: 80, ld: "", lw: "" }, S.nf);
  S.nf[k] = v;
  if (k == "d") S.nf.ld = "";
  if (k == "w" || k == "wp") S.nf.lw = "";
  save();
}
function nfToday() {
  const t = new Date();
  return (
    t.getFullYear() +
    "-" +
    String(t.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(t.getDate()).padStart(2, "0")
  );
}
function nfCheck() {
  const n = S.nf;
  if (!n || document.hidden) return;
  const td = nfToday(),
    now = new Date(),
    hm = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
  let delay = 0;
  if (n.w && n.lw != td) {
    const ym = td.slice(0, 7);
    let I = 0,
      O = 0;
    (S.tx || []).forEach((t) => {
      if (String(t.d).slice(0, 7) == ym) {
        if (t.t == "in") I += t.m;
        else if (t.t == "out") O += t.m;
      }
    });
    if (I > 0 && O >= (I * n.wp) / 100) {
      n.lw = td;
      save();
      nfToast("Pengeluaran sudah " + Math.round((O / I) * 100) + "% dari pemasukan");
      delay = 5600;
    }
  }
  if (n.d && n.ld != td && hm >= n.dt && !(S.tx || []).some((t) => t.d == td && t.t != "tf")) {
    n.ld = td;
    save();
    setTimeout(() => nfToast("Kamu belum mencatat transaksi hari ini."), delay);
  }
}

const PP = {
  data: [
    "Kontrol data",
    () =>
      `<div class="c"><h3>Cadangan data</h3><p class="mu">Data hanya tersimpan di browser ini. Simpan cadangan secara berkala agar tidak hilang.</p><div class="act" style="justify-content:flex-start;margin:0"><button type="button" class="b p" onclick="expData()">Ekspor data</button><button type="button" class="b" onclick="impData()">Impor data</button></div></div><div class="c"><h3>Reset data</h3><p class="mu">Hapus semua transaksi, langganan, kebutuhan, keinginan, saldo, tabungan, aset, liabilitas, dan target. Kategori tetap ada.</p><div class="act" style="justify-content:flex-start;margin:0"><button type="button" class="b d" onclick="resetAll()">Reset semua data</button></div></div>`,
  ],
  set: [
    "Pengaturan",
    () => {
      const row = (t, d, c) =>
          `<label class="sr"><span><b>${t}</b><small class="mu">${d}</small></span>${c}</label>`,
        sw = (k, on) =>
          `<input type="checkbox" class="swt" role="switch"${on ? " checked" : ""} onchange="setPref('${k}',this.checked)">`;
      return `<div class="c sl">${row("Mode gelap", "Aktifkan untuk tampilan gelap, matikan untuk tampilan terang.", sw("theme", document.documentElement.getAttribute("data-nx") === "dark").replace('class="swt"', 'class="swt" id="thm"')).replace('class="sr"', 'class="sr lp-only"')}${row("Sembunyikan nominal", "Tampilkan nominal uang sebagai titik-titik agar privasi terjaga.", sw("hd", !!S.hd))}${row("Getar", "Getarkan HP saat menekan lama, menghapus, atau menyimpan.", sw("vb", S.vb !== 0))}${row("Animasi", "Matikan untuk menghemat baterai atau jika animasi terasa berat.", sw("an", S.an !== 0))}${row(
        "Halaman awal",
        "Halaman yang dibuka pertama kali saat aplikasi dimulai.",
        `<select class="ssel" onchange="setPref('st',this.value)">${TABS.filter(
          (x) => x[0] != "set",
        )
          .map(
            ([v, l]) =>
              `<option value="${v}"${(TABS.some((x) => x[0] == S.st && x[0] != "set") ? S.st : "dash") == v ? " selected" : ""}>${l}</option>`,
          )
          .join("")}</select>`,
      )}</div>`;
    },
  ],
  notif: [
    "Notifikasi",
    () => {
      const n = Object.assign({ d: 0, dt: "20:00", w: 0, wp: 80 }, S.nf),
        row = (t, d, c) =>
          `<label class="sr"><span><b>${t}</b><small class="mu">${d}</small></span>${c}</label>`,
        sw = (k, on) =>
          `<input type="checkbox" class="swt" role="switch"${on ? " checked" : ""} onchange="nfSet('${k}',this.checked?1:0)">`;
      return `<div class="c sl">${row("Pengingat harian", "Ingatkan saya mencatat transaksi jika hari ini belum ada yang tercatat.", sw("d", n.d))}${row("Waktu pengingat", "Pengingat muncul saat aplikasi dibuka setelah jam ini.", `<input type="time" class="ssel" value="${n.dt}" onchange="if(this.value)nfSet('dt',this.value)">`)}${row("Peringatan pengeluaran", "Beri tahu saya jika pengeluaran bulan ini mendekati pemasukan.", sw("w", n.w))}${row("Batas peringatan", "Persentase pengeluaran dari pemasukan bulan ini.", `<select class="ssel" onchange="nfSet('wp',+this.value)">${[70, 80, 90].map((v) => `<option value="${v}"${n.wp == v ? " selected" : ""}>${v}%</option>`).join("")}</select>`)}</div><div class="c"><p class="mu" style="margin:0 0 10px">Pengingat hanya muncul saat aplikasi terbuka. Aplikasi ini tidak mengirim notifikasi saat ditutup.</p><div class="act" style="justify-content:flex-start;margin:0"><button type="button" class="b" onclick="nfToast('Kamu belum mencatat transaksi hari ini.')">Coba pengingat</button></div></div>`;
    },
  ],
  lang: [
    "Bahasa",
    () =>
      `<div class="c"><h3>Bahasa aplikasi</h3><p class="mu">Pilih bahasa tampilan aplikasi.</p><div class="seg" role="group" aria-label="Bahasa aplikasi">${[
        ["id", "Bahasa Indonesia"],
        ["en", "English"],
      ]
        .map(
          ([v, l]) =>
            `<button type="button" class="${(S.lang || "id") == v ? "on" : ""}" aria-pressed="${(S.lang || "id") == v}" onclick="setLang('${v}')">${l}</button>`,
        )
        .join("")}</div></div>`,
  ],
};
let PPK = null;
function openPp(k) {
  const p = $("#pp"),
    d = PP[k];
  if (!d) return;
  PPK = k;
  $("#ppt").textContent = d[0];
  $("#ppc").innerHTML = d[1]();
  const a = document.activeElement;
  p._ret = a && a !== document.body ? a : $("#av");
  p.classList.add("on");
  p.setAttribute("aria-hidden", "false");
  void p.offsetWidth;
  p.classList.add("show");
  syncInert();
  raf2(() => p.focus({ preventScroll: true }));
}
function resetAll() {
  cf(
    "Hapus semua transaksi, langganan, kebutuhan, keinginan, saldo, tabungan, aset, liabilitas, dan target? Anda masih bisa mengurungkannya sesaat setelah ini.",
    () => {
      snap();
      S.tx = [];
      S.bud = [];
      S.goal = [];
      S.need = [];
      S.subs = [];
      S.aset = [];
      S.liab = [];
      S.tg = [];
      S.acc = [{ id: "main", n: "Saldo", b: 0, bt: Date.now() }];
      save();
      render();
      toast("Semua data direset", "Urungkan", undoDo, 6000);
      vib([10, 30, 10]);
    },
    "Reset",
  );
}
function closePp() {
  const p = $("#pp");
  if (!p.classList.contains("show")) return;
  p.classList.remove("show");
  p.setAttribute("aria-hidden", "true");
  PPK = null;
  syncInert();
  const r = p._ret;
  p._ret = null;
  if (r && r.isConnected && r.focus) r.focus({ preventScroll: true });
  setTimeout(
    () => {
      if (!p.classList.contains("show")) p.classList.remove("on");
    },
    RM ? 0 : 310,
  );
}
