# Nexus Finance

Aplikasi manajemen keuangan pribadi. Murni HTML, CSS, dan JavaScript tanpa build dan tanpa dependensi.
Data tersimpan di browser (localStorage), jadi tidak ada server dan tidak ada yang dikirim keluar.

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

## Menambah fitur

- Halaman baru: tambahkan fungsi `V.nama` di `js/views.js`, lalu daftarkan di `TABS` dan `HR` pada `js/pager.js`,
  dan tombolnya di menu samping pada `index.html`.
- Jenis data baru: tambahkan konfigurasi field di `CFG` pada `js/forms.js`.
- Teks baru yang perlu bahasa Inggris: tambahkan pasangannya ke `EN` di `js/i18n-data.js`.
