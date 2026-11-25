/* Sinkronisasi antar perangkat: masuk dengan Google, simpan ke Firestore, dan gabungkan perubahan dari
   perangkat lain secara langsung. Aplikasi tetap berjalan penuh tanpa internet dan tanpa login; sinkronisasi
   hanya tambahan di atas localStorage. Aturan penggabungan ada di sync-merge.js.

   Dokumen di Firestore: users/{uid} = { data: "<JSON data keuangan>", rev, by, updatedAt }
   Sisi lokal menyimpan `base` (keadaan cloud terakhir yang diketahui) untuk penggabungan tiga arah. */

(() => {
  const M = SyncMerge,
    SDK = "https://www.gstatic.com/firebasejs/13.4.0/",
    MK = "finance-sync-v1",
    BK = "finance-sync-base-v1",
    DV = "finance-dev-v1",
    SEED = "finance-seed-v1",
    WAIT = 3000,
    RETRY = 60000,
    MAXB = 900000;

  let ap,
    au,
    fs,
    auth,
    db,
    ref = null,
    unsub = null,
    user = null,
    st = "init",
    msg = "",
    busy = 0,
    booting = 0,
    applying = 0,
    got = false,
    lastD = null,
    queued = null,
    timer = 0,
    qt = 0,
    base = null,
    baseC = "";

  const ls = (k) => {
      try {
        return JSON.parse(localStorage.getItem(k));
      } catch (_) {
        return null;
      }
    },
    put = (k, v) => {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (_) {}
    },
    dev = (() => {
      let d = null;
      try {
        d = localStorage.getItem(DV);
        if (!d) localStorage.setItem(DV, (d = uid() + uid()));
      } catch (_) {
        d = uid() + uid();
      }
      return d;
    })(),
    copy = (x) => JSON.parse(JSON.stringify(x));
  let meta = ls(MK) || {};

  const saveMeta = () => put(MK, meta),
    local = () => M.pick(S),
    snapshot = () => copy(M.pick(S)),
    /* Data masih persis contoh bawaan yang dibuat saat pertama kali membuka aplikasi */
    pristine = () => {
      try {
        const s = localStorage.getItem(SEED);
        return !!s && M.canon(M.pick(JSON.parse(s))) === M.canon(local());
      } catch (_) {
        return false;
      }
    },
    /* Jangan mengubah data saat pengguna sedang mengisi form atau memilih item */
    idle = () => {
      try {
        return !(F || DG || SEL || DP);
      } catch (_) {
        return true;
      }
    };

  function refresh() {
    if (typeof PPK != "undefined" && PPK == "data" && $("#ppc")) {
      $("#ppc").innerHTML = PP.data[1]();
      tAll($("#ppc"));
    }
  }
  function setSt(s, m) {
    st = s;
    msg = m || "";
    refresh();
  }
  function setBase(x) {
    base = copy(x);
    baseC = M.canon(base);
    put(BK, base);
  }
  function parse(d) {
    try {
      const o = JSON.parse(d.data);
      return o && typeof o == "object" && clean(o) ? M.pick(o) : false;
    } catch (_) {
      return false;
    }
  }
  /* Salinan "Urungkan" yang masih aktif ikut menerima item baru dan perubahan isi dari cloud, supaya
     mengurungkan tidak menghapus pekerjaan dari perangkat lain. Penghapusan sengaja tidak diterapkan:
     tidak bisa dibedakan dari penghapusan yang baru saja dilakukan pengguna ini dan sedang diurungkan. */
  function patchUndo(R) {
    if (!UNDO) return;
    try {
      const u = JSON.parse(UNDO);
      M.KEYS.forEach((k) => {
        const arr = u[k] || (u[k] = []),
          B = new Map((base ? base[k] : []).map((x) => [x.id, x])),
          U = new Map(arr.map((x) => [x.id, x]));
        R[k].forEach((x) => {
          const b = B.get(x.id),
            cur = U.get(x.id);
          if (!cur) {
            if (!b) arr.push(copy(x));
          } else if (b && M.canon(cur) === M.canon(b) && M.canon(x) !== M.canon(b)) {
            arr[arr.indexOf(cur)] = copy(x);
          }
        });
      });
      UNDO = JSON.stringify(u);
    } catch (_) {
      UNDO = null;
    }
  }
  function applyLocal(m) {
    if (M.canon(m) === M.canon(local())) return;
    applying = 1;
    try {
      M.KEYS.forEach((k) => (S[k] = copy(m[k])));
      save();
    } finally {
      applying = 0;
    }
    render();
  }

  function schedule(w) {
    if (!user || st == "choose") return;
    clearTimeout(timer);
    timer = setTimeout(() => run(), w == null ? WAIT : w);
  }
  function drain() {
    if (!queued) return;
    const q = queued;
    queued = null;
    reconcile(q.d);
  }

  /* Perubahan dari cloud */
  function reconcile(d) {
    if (!user) return;
    if (busy || !idle()) {
      queued = { d };
      clearTimeout(qt);
      qt = setTimeout(drain, 1500);
      return;
    }
    const R = d ? parse(d) : null;
    if (R === false) return setSt("error", "Data di cloud tidak terbaca.");
    const rev = d ? d.rev | 0 : 0;
    if (d && d.by === dev && rev === meta.rev) {
      if (st != "synced" && st != "choose") setSt("synced");
      return;
    }
    if (d && rev < (meta.rev | 0)) return;
    if (!base) return firstSync();
    if (!R) {
      /* dokumen di cloud hilang: unggah ulang dari perangkat ini */
      run("local");
      return;
    }
    const m = M.merge(base, local(), R, (meta.edit || 0) > (d.updatedAt || 0) ? "l" : "r");
    patchUndo(R);
    applyLocal(m);
    setBase(R);
    meta.rev = rev;
    meta.last = Date.now();
    saveMeta();
    if (M.canon(m) !== M.canon(R)) {
      setSt("syncing");
      schedule(0);
    } else setSt("synced");
  }

  /* Pertama kali akun ini dipakai di perangkat ini */
  function firstSync() {
    if (!got || st == "choose") return;
    const d = lastD,
      R = d ? parse(d) : null;
    if (R === false) return setSt("error", "Data di cloud tidak terbaca.");
    const L = local(),
      mine = !pristine() && M.has(L),
      theirs = !!R && M.has(R);
    if (!theirs) {
      if (mine) return run("local");
      return setSt("synced");
    }
    if (!mine) {
      applyLocal(R);
      setBase(R);
      meta.rev = d.rev | 0;
      meta.last = Date.now();
      saveMeta();
      return setSt("synced");
    }
    ask(R);
  }
  function ask(R) {
    setSt("choose");
    dlg(
      `Perangkat ini dan akun cloud sama-sama sudah punya data.<br><br>Transaksi di perangkat ini: <b data-notr>${local().tx.length}</b><br>Transaksi di cloud: <b data-notr>${R.tx.length}</b><br><br>Gabungkan menyimpan semua transaksi dari keduanya. Memilih salah satu akan menimpa data di sisi lainnya.`,
      [
        ["Gabungkan", "p", () => choose("union")],
        ["Pakai data cloud", "s", () => choose("remote")],
        ["Pakai data perangkat ini", "s", () => choose("local")],
      ],
    );
  }
  function choose(mode) {
    if (mode == "remote") {
      const d = lastD,
        R = d ? parse(d) : null;
      if (!R) return setSt("error", "Data di cloud tidak terbaca.");
      snap();
      applyLocal(R);
      setBase(R);
      meta.rev = d.rev | 0;
      meta.last = Date.now();
      saveMeta();
      setSt("synced");
      toast("Data diganti dengan data cloud", "Urungkan", undoDo, 6000);
    } else {
      st = "syncing";
      run(mode);
    }
  }

  /* Kirim perubahan lokal. mode: "union" (gabung pertama kali), "local" (timpa cloud), atau kosong (normal) */
  async function run(mode, force) {
    if (!user || !fs || busy || st == "choose") return;
    if (!base && !mode) return firstSync();
    if (!mode && !force && M.canon(local()) === baseC) {
      if (st != "synced") setSt("synced");
      return;
    }
    busy = 1;
    setSt("syncing");
    try {
      let snapL,
        merged,
        rev = 0;
      await fs.runTransaction(db, async (tx) => {
        const s = await tx.get(ref),
          d = s.exists() ? s.data() : null,
          R = d ? parse(d) : null;
        if (R === false) throw { code: "app/bad-remote" };
        snapL = snapshot();
        const pref = (meta.edit || 0) > ((d && d.updatedAt) || 0) ? "l" : "r";
        merged =
          mode == "local" || !R ? snapL : M.merge(mode == "union" ? null : base, snapL, R, pref);
        if (R && mode != "local" && M.canon(merged) === M.canon(R)) {
          rev = d.rev | 0;
          return;
        }
        const json = JSON.stringify(merged);
        if (new TextEncoder().encode(json).length > MAXB) throw { code: "app/too-big" };
        rev = (d ? d.rev | 0 : 0) + 1;
        tx.set(ref, { data: json, rev, by: dev, updatedAt: Date.now() });
      });
      /* Pengguna mungkin mengubah data selama pengiriman: gabungkan perubahan itu, jangan ditimpa */
      const cur = local(),
        next = M.canon(cur) === M.canon(snapL) ? merged : M.merge(snapL, cur, merged, "l");
      patchUndo(merged);
      applyLocal(next);
      setBase(merged);
      meta.rev = rev;
      meta.last = Date.now();
      saveMeta();
      setSt("synced");
      if (M.canon(next) !== baseC) schedule();
    } catch (e) {
      const c = String((e && e.code) || ""),
        t = c + " " + String((e && e.message) || "");
      if (c == "app/too-big")
        setSt(
          "error",
          "Data terlalu besar untuk disinkronkan. Ekspor cadangan, lalu hapus data lama.",
        );
      else if (c == "app/bad-remote") setSt("error", "Data di cloud tidak terbaca.");
      else if (/permission/i.test(t))
        setSt("error", "Akses ditolak. Periksa aturan keamanan Firestore.");
      else if (!navigator.onLine || /unavailable|offline|network/i.test(t)) setSt("offline");
      else setSt("error", "Sinkronisasi gagal. Akan dicoba lagi otomatis.");
    } finally {
      busy = 0;
      drain();
    }
  }

  function onUser(u) {
    if (unsub) {
      unsub();
      unsub = null;
    }
    clearTimeout(timer);
    got = false;
    lastD = null;
    queued = null;
    user = u;
    if (!u) {
      ref = null;
      base = null;
      baseC = "";
      return setSt("out");
    }
    if (meta.uid !== u.uid) {
      /* akun berbeda dari yang terakhir dipakai di perangkat ini: mulai dari awal */
      meta = { uid: u.uid, rev: 0, edit: meta.edit || 0 };
      base = null;
      baseC = "";
      put(BK, null);
      saveMeta();
    } else {
      base = ls(BK);
      baseC = base ? M.canon(base) : "";
    }
    ref = fs.doc(db, "users", u.uid);
    setSt(navigator.onLine ? "syncing" : "offline");
    unsub = fs.onSnapshot(
      ref,
      (snap) => {
        /* abaikan salinan lama dari cache: hanya data yang sudah dikonfirmasi server yang dipakai */
        if (snap.metadata.fromCache) return;
        got = true;
        lastD = snap.exists() ? snap.data() : null;
        reconcile(lastD);
      },
      (e) => {
        if (e && e.code == "permission-denied")
          setSt("error", "Akses ditolak. Periksa aturan keamanan Firestore.");
        else setSt("offline");
      },
    );
  }

  async function boot() {
    if (fs || booting) return;
    booting = 1;
    setSt("init");
    try {
      if (typeof FIREBASE_CONFIG == "undefined" || !FIREBASE_CONFIG.apiKey) throw 0;
      [ap, au, fs] = await Promise.all([
        import(SDK + "firebase-app.js"),
        import(SDK + "firebase-auth.js"),
        import(SDK + "firebase-firestore.js"),
      ]);
      const app = ap.initializeApp(FIREBASE_CONFIG);
      auth = au.getAuth(app);
      db = fs.getFirestore(app);
      au.onAuthStateChanged(auth, onUser);
    } catch (_) {
      fs = null;
      setSt("unavailable");
    } finally {
      booting = 0;
    }
  }

  function loginErr(c) {
    if (c == "auth/popup-blocked")
      return "Pop-up diblokir browser. Izinkan pop-up untuk situs ini, lalu coba lagi.";
    if (c == "auth/unauthorized-domain")
      return "Domain situs ini belum diizinkan di Firebase (Authentication, Settings, Authorized domains).";
    if (c == "auth/network-request-failed") return "Tidak ada koneksi internet.";
    if (/api-key/.test(c)) return "Kunci API Firebase tidak valid. Periksa js/firebase-config.js.";
    return "Gagal masuk. Coba lagi.";
  }

  window.syncOnSave = () => {
    if (applying) return;
    meta.edit = Date.now();
    saveMeta();
    schedule();
  };
  window.syncBoot = () => boot();
  window.syncIn = async () => {
    if (!fs) return boot();
    try {
      setSt("signing");
      await au.signInWithPopup(auth, new au.GoogleAuthProvider());
    } catch (e) {
      setSt("out");
      const c = (e && e.code) || "";
      if (c != "auth/popup-closed-by-user" && c != "auth/cancelled-popup-request") al(loginErr(c));
    }
  };
  window.syncOut = () =>
    cf(
      "Keluar dari akun? Data di perangkat ini tetap ada, tetapi tidak lagi disinkronkan.",
      () => au.signOut(auth),
      "Keluar dari akun",
    );
  window.syncNow = () => {
    if (user) run(null, true);
  };
  window.syncAsk = () => {
    st = "syncing";
    firstSync();
  };

  window.syncCard = () => {
    const b = (t, f, c) => `<button type="button" class="b${c ? " " + c : ""}" onclick="${f}">${t}</button>`;
    let t = "",
      s = "",
      a = "";
    if (st == "init") t = "Menyiapkan sinkronisasi…";
    else if (st == "unavailable") {
      t = "Layanan sinkronisasi tidak bisa dimuat. Periksa koneksi internet.";
      a = b("Coba lagi", "syncBoot()", "p");
    } else if (st == "signing") t = "Membuka jendela login…";
    else if (!user) {
      t = "Masuk dengan Google agar data di laptop dan HP selalu sama.";
      a = b("Masuk dengan Google", "syncIn()", "p");
    } else {
      t = `Masuk sebagai <b data-notr>${esc(user.email || user.displayName || "")}</b>`;
      if (st == "choose") {
        s = "Menunggu pilihanmu…";
        a = b("Pilih sekarang", "syncAsk()", "p");
      } else {
        if (st == "syncing") s = "Menyinkronkan…";
        else if (st == "offline") s = "Tidak ada koneksi. Perubahan akan dikirim saat online.";
        else if (st == "error") s = esc(msg);
        else {
          const tm = meta.last
            ? new Date(meta.last).toLocaleTimeString(LC(), { hour: "2-digit", minute: "2-digit" })
            : "";
          s = `<span>Tersinkron</span>${tm ? ` <span data-notr>${tm}</span>` : ""}`;
        }
        a = b("Sinkronkan sekarang", "syncNow()", "p") + b("Keluar dari akun", "syncOut()");
      }
    }
    return `<div class="c"><h3>Sinkronisasi antar perangkat</h3><p class="mu">${t}</p>${s ? `<p class="mu">${s}</p>` : ""}<p class="mu">Data tersimpan di akun Firebase milikmu dan hanya bisa dibaca oleh akun yang login.</p>${a ? `<div class="act" style="justify-content:flex-start;margin:0">${a}</div>` : ""}</div>`;
  };

  /* Kirim sisa perubahan saat aplikasi disembunyikan; coba lagi saat kembali online atau terlihat */
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState == "hidden") {
      if (user && base) {
        clearTimeout(timer);
        run();
      }
    } else if (!fs) boot();
    else if (user) run();
  });
  addEventListener("online", () => {
    if (!fs) boot();
    else if (user) run();
  });
  setInterval(() => {
    if (user && (st == "offline" || st == "error")) run();
  }, RETRY);

  boot();
})();
