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
1. **Tema Warna Resmi (*Official 4-Color Luxury Palette*)**:
   - **Dusty Sage (Hijau Pastel Redup)**: `#A9BCA7` (Aksen tombol, border aktif, tag highlight, ikon; aksen pekat: `#6E856C`, `#5C725A`).
   - **Champagne (Krem Keemasan Halus)**: `#F2E9E4` (Latar belakang pill, border sekunder `#E8DDD6`, warm surface tints).
   - **Ivory (Putih Gading)**: `#FDFBF7` (Latar belakang body utama, kontainer kartu putih bersih `#FFFFFF`).
   - **Charcoal (Abu-abu Gelap untuk Teks/Kontras)**: `#3A3A3A` (Tipografi utama, heading, tombol aktif kontras, container gelap: `#2A2A2A`).
   - **Shadows**: Soft ambient elevation (`shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]`).
2. **Standar Tipografi Resmi (*Official Typography System*)**:
   - **Heading (Judul Utama & Bagian)**: `Playfair Display` (Serif dengan kontras tebal-tipis yang sangat tegas & memberikan impresi mewah berkelas).
   - **Body (Teks Paragraf & Form)**: `Inter` atau `Roboto` (Sans-serif yang bersih, modern, dan keterbacaan tinggi di layar digital untuk teks penjelasan, rincian biaya, syarat & ketentuan).
3. **Standar Penamaan**:
   - **Wajib gunakan kata "Studio"** (bukan "Cabang"). Contoh: *Alviero Studio — Studio 1*, *Alviero Studio — Studio 2*.
   - **Logo Resmi**: Wajib menggunakan Logo Vektor Resmi (`/images/alviero-logo-official.png`), bukan ikon kotak kamera generic.

---

## 📍 4. Data Lokasi & WhatsApp Studio
| Studio | Nama Tampilan | Alamat Lengkap | Link Google Maps | Nomor WhatsApp | Pilihan Background |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Studio 1** | Alviero Studio — Studio 1 (Karangploso) | Jl. Raya Kertanegara, RT.003/RW.001, Karangploso, Girimoyo, Kec. Karang Ploso, Kabupaten Malang, Jawa Timur 65151 | [https://maps.app.goo.gl/oxtptpr3RSDL9zCj6](https://maps.app.goo.gl/oxtptpr3RSDL9zCj6) | **087777538164** (`6287777538164`) | Hijau Pastel, Cream, Limbo, Putih Tengah, Putih Jendela |
| **Studio 2** | Alviero Studio — Studio 2 (Dinoyo) | Ruko Gajayana, Jl. Simpang Gajayana No.Kav.P, Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144 | [https://maps.app.goo.gl/W4Jojd1B9TBZxWWP9](https://maps.app.goo.gl/W4Jojd1B9TBZxWWP9) | **085168879214** (`6285168879214`) | **1. Hitam, 2. Putih, 3. Abu-abu, 4. Coklat Jendela, 5. Tematik Cream (Maks. 5 Orang)** |

> ⚠️ **Sistem Logika Pemesanan & Validasi Background (Booking Validation Rules):**
> - **A. Aturan Studio 2 (Kapasitas & Eksklusivitas Pasangan Background):**
>   1. **Kapasitas**: Dalam 1 slot jam, Studio 2 dapat menerima **maksimal 3 klien sekaligus** (mendukung campuran klien Paket 2 & Paket 1).
>   2. **Daftar Pasangan Khusus**:
>      - **Pasangan 1**: (Putih & Abu-abu)
>      - **Pasangan 2**: (Cream & Coklat)
>      - **Mandiri**: Hitam (dapat dipilih hingga kapasitas slot).
>   3. **Aturan 1 (Boleh digabung oleh 1 klien)**:
>      - Klien Paket 2 yang memilih **Putih DAN Abu-abu** sekaligus dalam 1 reservasi dinyatakan **SAH/VALID**.
>      - Klien Paket 2 yang memilih **Cream DAN Coklat** sekaligus dalam 1 reservasi dinyatakan **SAH/VALID**.
>   4. **Aturan 2 (Dilarang dipecah ke klien berbeda / Pair Exclusivity)**:
>      - Jika Klien 1 memilih *Putih* (tanpa Abu-abu) ➔ *Abu-abu* otomatis **TIDAK TERSEDIA** untuk klien berikutnya (Klien 2 & 3).
>      - Jika Klien 1 memilih *Abu-abu* (tanpa Putih) ➔ *Putih* otomatis **TIDAK TERSEDIA** untuk klien berikutnya.
>      - Jika Klien 1 memilih *Cream* (tanpa Coklat) ➔ *Coklat* otomatis **TIDAK TERSEDIA** untuk klien berikutnya.
>      - Jika Klien 1 memilih *Coklat* (tanpa Cream) ➔ *Cream* otomatis **TIDAK TERSEDIA** untuk klien berikutnya.
>   5. **Alur Contoh Validasi**:
>      - Klien 1 (Paket 2) masuk ➔ pilih *Putih & Abu-abu* (SAH. Putih & Abu-abu habis).
>      - Klien 2 (Paket 2) masuk ➔ pilih *Cream & Hitam* (SAH. Karena Cream dipecah, Coklat otomatis terkunci).
>      - Klien 3 (Paket 1) masuk ➔ Pilihan yang tersisa hanya *Hitam* (karena Putih, Abu, Cream, Coklat sudah habis/terkunci).
> - **B. Aturan Studio 1:** Background *Limbo* dan *Putih Tengah* berada di panggung yang sama dan tidak bisa dipilih bersamaan dalam 1 waktu / sesi oleh 1 klien.

> ⏰ **Jam Operasional, Interval & Durasi Sesi Foto:**
> - Buka Setiap Hari: **08:00 - 21:00 WIB**
> - Interval Slot Dasar: **30 Menit per slot** (Total 26 slot mulai dari `08:00` s.d. `20:30`, kelipatan 30 menit: `08:00`, `08:30`, `09:00`, dst).
> - **Aturan Durasi Paket (60 Menit untuk 2 Background):**
>   - Paket 1 Background (Paket 1 / Standar): Durasi **30 Menit** (1 slot).
>   - Paket 2 Background ke atas (Paket 2, 3, 4 / 2 Background): Durasi otomatis **60 Menit** (mengalokasikan 2 slot waktu berturut-turut, contoh: `12:30 - 13:30 WIB`).
>   - Slot jam `20:30` pada paket 2 background ke atas (durasi 60 menit, selesai `21:30 WIB`) **dibuka / diizinkan** dan otomatis dikenakan **tambahan biaya overtime sebesar Rp 35.000** (melebihi jam operasional tutup studio 21.00 WIB).

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
