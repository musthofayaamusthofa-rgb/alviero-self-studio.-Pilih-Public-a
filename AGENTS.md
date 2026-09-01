# Alviero Studio Web Application — Agent Guidelines & Memory (AGENTS.md)

Dokumen ini berisi seluruh memori proyek, aturan desain, struktur data, dan instruksi permanen untuk AI Agent (Antigravity IDE / Pair Programmer) di perangkat mana pun saat membuka repositori ini.

---

## 📌 1. Project Overview & Tech Stack
- **Nama Proyek**: Alviero Studio & SelfStudio — Interactive Web Pricelist, Studio Selector & Strip Builder
- **Teknologi**: React 18, TypeScript, Tailwind CSS, Vite, Lucide React Icons, HTML5 Canvas API.
- **Port Dev Lokal**: `http://localhost:3000/`
- **Hosting / Deploy**: Vercel & GitHub Repository (`main` branch).
- **Alur Sinkronisasi**: Menggunakan script otomatis `.\scripts\sync.ps1`.

---

## ⚡ 2. Aturan Eksekusi Otonom (Autonomous Execution)
- **Izin Penuh**: Pengguna telah memberikan izin penuh kepada AI untuk menjalankan perintah terminal (`npm run build`, `npm run dev`, script PowerShell, git commit & git push) secara mandiri tanpa perlu konfirmasi manual berulang.
- **Setiap Perubahan Kode**: Wajib divalidasi dengan `npm run build` sebelum di-push ke GitHub via `.\scripts\sync.ps1`.

---

## 🎨 3. Design Aesthetics & Luxury Guidelines
1. **Tema Warna (*Curated Luxury Palette*)**:
   - **Sage Green Utama**: `#55735b`, `#6c8c74` (Aksen tombol, border aktif, pin lokasi).
   - **Soft Sage Tint**: `#eaf1ea`, `#e3eee3`, `#f2f7f2` (Latar belakang ikon & pill highlight).
   - **Latar Belakang (*Background*)**: Warm Ivory `#faf9f5` & White `#ffffff`.
   - **Teks**: Deep Charcoal `#0f0e0c`, `#18231a`, `#232d38`.
   - **Shadows**: Soft ambient elevation (`shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]`).
2. **Tipografi Mewah (*Luxury Typography*)**:
   - Serif & Editorial Font: `Italiana`, `Bodoni Moda`, `Playfair Display`, `Cormorant Garamond`.
   - Sans-serif Body: `Plus Jakarta Sans`, `Inter`.
3. **Standar Penamaan**:
   - **Wajib gunakan kata "Studio"** (bukan "Cabang"). Contoh: *Alviero Studio — Studio 1*, *Alviero Studio — Studio 2*.
   - **Logo Resmi**: Wajib menggunakan Logo Vektor Resmi (`/images/alviero-logo-official.png`), bukan ikon kotak kamera generic.

---

## 📍 4. Data Lokasi & WhatsApp Studio
| Studio | Nama Tampilan | Alamat Lengkap | Link Google Maps | Nomor WhatsApp | Pilihan Background |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Studio 1** | Alviero Studio — Studio 1 (Karangploso) | Jl. Raya Kertanegara, RT.003/RW.001, Karangploso, Girimoyo, Kec. Karang Ploso, Kabupaten Malang, Jawa Timur 65151 | [https://maps.app.goo.gl/oxtptpr3RSDL9zCj6](https://maps.app.goo.gl/oxtptpr3RSDL9zCj6) | **087777538164** (`6287777538164`) | Hijau Pastel, Cream, Limbo, Putih Tengah, Putih Jendela |
| **Studio 2** | Alviero Studio — Studio 2 (Dinoyo) | Ruko Gajayana, Jl. Simpang Gajayana No.Kav.P, Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144 | [https://maps.app.goo.gl/W4Jojd1B9TBZxWWP9](https://maps.app.goo.gl/W4Jojd1B9TBZxWWP9) | **085168879214** (`6285168879214`) | **1. Hitam, 2. Putih, 3. Abu-abu, 4. Coklat Jendela, 5. Tematik Cream** |

> ⚠️ **Sistem Logika Pemesanan & Validasi Background (Booking Validation Rules):**
> - **A. Aturan Studio 2 (Kapasitas, Kuota Background & Bentrok Posisi):**
>   1. **Kapasitas**: Dalam 1 slot jam, Studio 2 dapat menerima **maksimal 3 klien sekaligus**.
>   2. **Kuota per Background (Single-Use per Slot)**: Setiap background (*Hitam, Putih, Abu-abu, Coklat Jendela, Tematik Cream*) hanya bisa dipilih **maksimal 1 kali** dalam 1 slot jam yang sama (1 background tidak bisa dipakai bersamaan oleh 2 klien berbeda).
>   3. **Aturan Khusus Bentrok Posisi (*Mutual Exclusion: Coklat vs Cream*)**:
>      - Background **Coklat Jendela** dan **Tematik Cream** saling bertabrakan (berada pada posisi panggung fisik yang sama).
>      - Jika *Coklat* dipilih oleh klien mana pun di jam tersebut ➔ *Cream* otomatis **TIDAK TERSEDIA** (terkunci) untuk klien lain di jam tersebut.
>      - Jika *Cream* dipilih oleh klien mana pun di jam tersebut ➔ *Coklat* otomatis **TIDAK TERSEDIA** (terkunci) untuk klien lain di jam tersebut.
>   4. **Skenario Validasi Studio 2**:
>      - Klien 1 pilih *Hitam* ➔ *Hitam* terkunci. Tersedia untuk Klien 2: *Putih, Abu-abu, Coklat, Cream*.
>      - Klien 2 pilih *Coklat* ➔ *Coklat* terkunci & *Cream* otomatis ikut terkunci.
>      - Klien 3 masuk ➔ Pilihan yang tersedia HANYA: ***Putih*** atau ***Abu-abu***.
> - **B. Aturan Studio 1:** Background *Limbo* dan *Putih Tengah* berada di panggung yang sama dan tidak bisa dipilih bersamaan dalam 1 waktu / sesi oleh 1 klien.

> ⏰ **Jam Operasional, Interval & Durasi Sesi Foto:**
> - Buka Setiap Hari: **08:00 - 21:00 WIB**
> - Interval Slot Dasar: **25 Menit per slot** (Total 31 slot mulai dari `08:00` s.d. `20:30`).
> - **Aturan Durasi Paket (50 Menit untuk 2 Background):**
>   - Paket 1 Background (Paket 1 / Standar): Durasi **25 Menit** (1 slot).
>   - Paket 2 Background ke atas (Paket 2, 3, 4 / 2 Background): Durasi otomatis **50 Menit** (mengalokasikan 2 slot waktu berturut-turut, contoh: `12:35 - 13:25 WIB`).
>   - Slot jam `20:30` hanya bisa untuk paket 25 menit (karena jam tutup studio 21:00 WIB). Sesi 50 menit maksimal mulai jam `20:05` (selesai `20:55`).

---

## 🖼️ 5. Standar Menu Kategori & Thumbnail Foto Paket
Daftar kategori pada grid menu studio foto dan aset fotonya di `public/images/categories/`:

### A. Photo Studio Package (12 Kategori Utama):
1. **Graduation** 🎓 ➔ `graduation.jpg` *(Foto `DSCF0573.jpg`)*
2. **Grad Outdoor** 🌳 ➔ `grad-outdoor.jpg` *(Foto `XH2A6894.jpg`)*
3. **Group** 👥 ➔ `group.jpg` *(Foto `DSCF2569.jpg`)*
4. **Family** 👨‍👩‍👧‍👦 ➔ `family.jpg` *(Foto `DSCF4415 copy.jpg`)*
5. **Maternity** 🤰 ➔ `maternity.jpg` *(Foto `DSCF0022 10Rs.jpg`)*
6. **Personal** 👩‍💼 ➔ `personal.jpg` *(Foto `DSCF2857.jpg`, rotasi diputar 90° searah jarum jam agar tegak)*
7. **Couple** 💑 ➔ `couple.jpg` *(Foto `ALVR0641 copy.jpg`)*
8. **Birthday** 🎂 ➔ `birthday.jpg` *(Foto `DSCF9358 copy.jpg`)*
9. **Undangan** 💌 ➔ Icon Undangan
10. **Prewedding** 💍 ➔ `prewedding.jpg` *(Foto `ALVR9962.JPG`)*
11. **Pass photo** 🪪 ➔ Icon Pass Foto (Photo ID)
12. **Sewa Studio** 🏛️ ➔ `sewa-studio.jpg`

### B. Self Photo Package:
13. **SelfStudio** ✨ ➔ `selfphoto.jpg` *(Foto `DSCF9063.JPG`, rotasi diputar 90° & framing square fokus kepala/headroom)*

### C. Layanan Tambahan:
14. **Kebaya & Gaun** 👗 ➔ Icon Kebaya & Gaun
15. **Wedding** 💍 ➔ `wedding.jpg` *(Foto `DSCF7401 copy.jpg`)*
16. **Cetak Lab** 🖼️ ➔ Icon / Image Cetak Lab

> **Script Pemrosesan Foto**: Jalankan `.\scripts\process_logos.ps1` untuk memproses ulang foto dari folder master `Logo paket`.

---

## 🛠️ 6. Arsitektur Komponen Utama
- [`src/App.tsx`](src/App.tsx): Mengatur alur navigasi (`BranchSelectorLanding` ketika belum pilih studio, `PricelistViewer` setelah memilih studio).
- [`src/components/BranchSelectorModal.tsx`](src/components/BranchSelectorModal.tsx): Berisi Landing Page (`BranchSelectorLanding`) dengan bar pilihan studio mewah, hero banner carousel, dan Pop-Up Modal (`BranchSelectorModal`).
- [`src/components/PricelistViewer.tsx`](src/components/PricelistViewer.tsx): Komponen utama katalog harga, grid paket, filter kategori, switcher studio, dan preview detail paket.
- [`src/components/Header.tsx`](src/components/Header.tsx): Bilah navigasi atas dengan logo resmi Alviero Studio dan jam operasional.
- [`src/components/BookingCalculator.tsx`](src/components/BookingCalculator.tsx): Kalkulator simulasi booking, pembayaran QRIS Nasional resmi (`/images/qris-alviero.png`), fitur unduh QRIS, salin nominal, unggah wajib bukti transfer, dan invoice WhatsApp.
- [`src/components/PhotoStripCustomizer.tsx`](src/components/PhotoStripCustomizer.tsx): Fitur kustomisasi photo strip self studio.
- [`src/data/pricelistData.ts`](src/data/pricelistData.ts): Sumber data paket, cabang studio, backdrop, dan opsi add-on.
- [`scripts/google_apps_script.js`](scripts/google_apps_script.js): Kode Google Apps Script v2 untuk Google Spreadsheet (mendukung kapasitas 3 klien per slot jam & filter hanya status `BOOKED`).

---

## 💻 7. Perintah Rutin Operasional
```powershell
# 1. Menjalankan Dev Server Lokal
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; & "C:\Program Files\nodejs\npm.cmd" run dev

# 2. Build Produksi
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; & "C:\Program Files\nodejs\npm.cmd" run build

# 3. Sinkronisasi Otomatis ke GitHub
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\sync.ps1" -CommitMessage "<Pesan Komit Anda>"

# 4. Tarik Perubahan Terbaru dari GitHub
git pull origin main
```
