# Nexus Finance

Aplikasi manajemen keuangan pribadi. Murni HTML, CSS, dan JavaScript tanpa build.
Data selalu tersimpan di browser (localStorage), jadi aplikasi tetap berjalan penuh tanpa internet.
Jika pengguna masuk dengan Google (Pengaturan > Kontrol data), data juga disinkronkan lewat Firebase
supaya sama di semua perangkat. Tanpa login, tidak ada yang dikirim keluar.

## Sinkronisasi antar perangkat (Firebase)

Memakai Firebase Authentication (login Google) dan Cloud Firestore, dimuat dari CDN `gstatic.com`.
Dokumen `users/{uid}` menyimpan seluruh data keuangan milik satu akun. Hanya data keuangan yang disinkronkan;
pengaturan per perangkat (tema, bahasa, getar, halaman awal, notifikasi) tetap lokal.

Cara kerja:
- Setiap perubahan disimpan ke localStorage lebih dulu, lalu dikirim ke cloud setelah jeda 3 detik.
- Perubahan dari perangkat lain diterima langsung dan digabungkan per item (`id`) dengan penggabungan tiga arah
  (lihat `js/sync-merge.js`). Item yang dihapus di satu perangkat ikut terhapus di perangkat lain; jika satu sisi
  menghapus dan sisi lain mengubah item yang sama, versi yang diubah dipertahankan.
- Saat akun dipakai pertama kali di sebuah perangkat dan kedua sisi sudah punya data, pengguna memilih:
  gabungkan, pakai data cloud, atau pakai data perangkat ini.
- Tanpa internet, perubahan menunggu dan dikirim saat online lagi.

Pengaturan Firebase (sekali saja):
1. Buat proyek di console.firebase.google.com, paket Spark (gratis, tanpa kartu kredit).
2. Authentication > Sign-in method: aktifkan Google. Settings > Authorized domains: tambahkan domain situs
   (misalnya `uxgenfl.github.io`).
3. Firestore Database: buat database (mode produksi), lalu pasang aturan ini di tab Rules:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
4. Isi `firebaseConfig` proyek ke `js/firebase-config.js`.

Batas: satu dokumen Firestore maksimal 1 MiB, jadi sinkronisasi berhenti dan memberi peringatan jika data
mendekati 900 KB (sekitar puluhan ribu transaksi). Jangan upgrade ke paket Blaze atau menautkan billing.

## Menjalankan

Buka lewat server statis, misalnya `python3 -m http.server` lalu kunjungi `http://localhost:8000`.
Membuka `index.html` langsung dengan klik ganda tidak disarankan karena service worker butuh http(s).

## Deploy ke GitHub Pages

1. Unggah isi folder ini ke root repo (`index.html` harus berada di root, bukan di dalam subfolder).
2. Buka Settings > Pages, pilih branch `main` dan folder `/ (root)`.
3. Setelah mengubah file apa pun, naikkan angka `VERSION` di `sw.js` (misalnya `finance-v14` jadi `finance-v15`)
   lalu unggah. Tanpa itu, aplikasi yang sudah terpasang belum mengunduh ulang file-nya.

## Pembaruan aplikasi yang sudah terpasang

Aplikasi memeriksa versi baru setiap kali dibuka, setiap kali kembali ke layar, dan tiap 30 menit.
Bila ada, semua file diunduh ulang lalu aplikasi memuat ulang sendiri. Jika sedang ada form, dialog,
atau mode pilih yang terbuka, muncul pemberitahuan "Versi baru tersedia" dengan tombol "Muat ulang".
Data tidak hilang karena tersimpan di localStorage. Tanpa internet, aplikasi memakai salinan terakhir.

## Struktur

```
index.html          kerangka halaman: ikon SVG, menu samping, daftar css dan js
manifest.json       pengaturan PWA (nama, ikon, warna)
sw.js               service worker: mode offline dan pembaruan
fonts/              font Geist (teks) dan Geist Mono
icons/              ikon aplikasi
css/                gaya, dibagi per bagian (urutan muat penting, lihat index.html)
js/                 logika, dibagi per fitur (urutan muat penting, lihat index.html)
```

### CSS (`css/`)

| File | Isi |
| --- | --- |
| `base.css` | font, token warna, reset, dasar halaman |
| `drawer.css` | menu samping |
| `settings.css` | baris pengaturan dan panel Bahasa, Kontrol data, Bantuan |
| `components.css` | tombol, kartu, baris daftar, input |
| `controls.css` | area geser halaman, dropdown kustom, filter tab, mode pilih |
| `layers.css` | sheet form, tombol tambah cepat, menu, dialog, toast |
| `lists.css` | geser baris, tampilan kosong, skeleton, animasi |
| `touch-nav.css` | aturan layar sentuh dan item navigasi |
| `responsive-defaults.css` | elemen khusus laptop yang disembunyikan di layar kecil |
| `date-picker.css` | pemilih tanggal |
| `targets.css` | kartu Target dan aturan mode pilih |
| `desktop.css` | tata letak laptop (1024px ke atas): sidebar, grid halaman, panel ringkasan |

Warna dan ukuran dasar didefinisikan sebagai variabel di `css/base.css` (`:root`). Tema terang dan gelap
memakai atribut `data-nx` pada elemen `<html>`.

### JavaScript (`js/`)

Semua file berbagi satu lingkup global dan dimuat berurutan oleh `index.html`. Tiap file diawali satu baris
komentar yang menjelaskan isinya. Urutan besarnya:

1. `theme-init.js` menentukan tema sebelum halaman digambar
2. `utils.js`, `data.js` fungsi bantu dan data (`S` adalah seluruh state aplikasi)
3. `view-parts.js`, `views.js`, `pager.js` tampilan dan navigasi halaman
4. `forms.js` sampai `reorder.js` interaksi: form, tanggal, pilih banyak, geser, keyboard, urut ulang
5. `i18n-data.js`, `i18n.js` terjemahan Indonesia ke Inggris
6. `dropdown.js`, `updates.js`, `main.js` dropdown kustom, pembaruan aplikasi, dan titik awal
7. `firebase-config.js`, `sync-merge.js`, `sync.js` sinkronisasi antar perangkat (dimuat paling akhir)

## Menambah fitur

- Halaman baru: tambahkan fungsi `V.nama` di `js/views.js`, lalu daftarkan di `TABS` dan `HR` pada `js/pager.js`,
  dan tombolnya di menu samping pada `index.html`.
- Jenis data baru: tambahkan konfigurasi field di `CFG` pada `js/forms.js`.
- Teks baru yang perlu bahasa Inggris: tambahkan pasangannya ke `EN` di `js/i18n-data.js`.
