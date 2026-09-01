const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/pricelistData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Urutan Kategori Resmi Sesuai Gambar 2 (1-13)
const CATEGORY_ORDER = [
  'graduation-indoor',
  'graduation-outdoor',
  'group',
  'family',
  'maternity',
  'personal',
  'couple',
  'birthday',
  'undangan',
  'prewed',
  'pass-foto',
  'sewa-studio',
  'self-studio'
];

// 1. Definisikan CATEGORIES baru yang terurut
const NEW_CATEGORIES = `export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'graduation-indoor',
    name: 'Graduation',
    subPackageCount: 5,
    subPackageNote: '5 Sub Paket (Elegant, Supreme, Infinity, Bundling 1-2)',
    description: 'Sesi foto wisuda indoor di studio dengan berbagai tema latar, toga, props wisuda, dan bingkai eksklusif.',
    iconName: 'GraduationCap'
  },
  {
    id: 'graduation-outdoor',
    name: 'Grad Outdoor',
    subPackageCount: 6,
    subPackageNote: '6 Sub Paket (Smart 30M/60M, Cumlaude, Group Outdoor 2-5 Wisudawan)',
    description: 'Sesi foto wisuda outdoor di area kampus atau lokasi outdoor favorit lengkap dengan video & free transport.',
    iconName: 'Trees'
  },
  {
    id: 'group',
    name: 'Group',
    subPackageCount: 4,
    subPackageNote: '4 Sub Paket (Friendly Frame, Signature Squad, Royal Ensemble, Imperial Union)',
    description: 'Foto kelompok sahabat, geng sekolah, organisasi, atau alumni dari 3 hingga 40 orang.',
    iconName: 'Users'
  },
  {
    id: 'family',
    name: 'Family',
    subPackageCount: 2,
    subPackageNote: '2 Sub Paket (Sweet Together, Happy Nest)',
    description: 'Abadikan kehangatan momen keluarga besar maupun keluarga kecil dengan cetakan 10Rs & all file Google Drive.',
    iconName: 'Home'
  },
  {
    id: 'maternity',
    name: 'Maternity',
    subPackageCount: 2,
    subPackageNote: '2 Sub Paket (Warm Embrace, Golden Motherhood)',
    description: 'Momen kehamilan yang berkesan untuk Bunda solo, bersama Ayah, maupun keluarga.',
    iconName: 'HeartHandshake'
  },
  {
    id: 'personal',
    name: 'Personal',
    subPackageCount: 2,
    subPackageNote: '2 Sub Paket (Bold Statement, Opulent Shot)',
    description: 'Foto profil portrait pribadi, outfit branding, portofolio gaya bebas dengan retouching rapi.',
    iconName: 'User'
  },
  {
    id: 'couple',
    name: 'Couple',
    subPackageCount: 2,
    subPackageNote: '2 Sub Paket (Eternal Love, Sweet Memories)',
    description: 'Sesi foto pasangan romantis, anniversary, atau kencan manis dengan pencahayaan hangat.',
    iconName: 'Heart'
  },
  {
    id: 'birthday',
    name: 'Birthday',
    subPackageCount: 4,
    subPackageNote: '4 Sub Paket (Sweet Celebration, Glow, Sweet Light, Ultimate)',
    description: 'Foto perayaan ulang tahun meriah lengkap dengan properti tulisan birthday, balon angka, balon latex, dan spotlight.',
    iconName: 'Sparkles'
  },
  {
    id: 'undangan',
    name: 'Undangan',
    subPackageCount: 2,
    subPackageNote: '2 Sub Paket (Paket Undangan 1 & 2)',
    description: 'Sesi foto kustom khusus kebutuhan desain undangan pernikahan/acara digital & cetak.',
    iconName: 'Mail'
  },
  {
    id: 'prewed',
    name: 'Prewedding',
    subPackageCount: 4,
    subPackageNote: '4 Sub Paket (Sweet Promise, Velvet Romance, Bundling 1-2)',
    description: 'Konsep Prewedding indoor studio maupun outdoor romantis lengkap dengan album & frame besar.',
    iconName: 'Sparkles'
  },
  {
    id: 'pass-foto',
    name: 'Pass photo',
    subPackageCount: 3,
    subPackageNote: '3 Sub Paket (Pass Foto 1, Pass Foto 2, Pass Foto 3 Nikah)',
    description: 'Foto paspor, ijazah, lamaran kerja, atau dokumen resmi dengan 3 pilihan warna background edit & retouching rapi.',
    iconName: 'UserCheck'
  },
  {
    id: 'sewa-studio',
    name: 'Sewa Studio',
    subPackageCount: 1,
    subPackageNote: '1 Sub Paket (Rental 60 Menit)',
    description: 'Sewa ruang studio & pencahayaan profesional per jam untuk fotografer, konten kreator, atau brand.',
    iconName: 'Camera'
  },
  {
    id: 'self-studio',
    name: 'SelfStudio',
    subPackageCount: 6,
    subPackageNote: '6 Sub Paket (Special, Normal & Spotlight)',
    description: 'Foto mandiri dengan shutter remote nirkabel. Pilihan paket Special, Normal, dan Color Spotlight.',
    iconName: 'Sliders'
  }
];`;

// Ganti CATEGORIES
content = content.replace(/export const CATEGORIES: CategoryInfo\[\] = \[[\s\S]*?\n\];/, NEW_CATEGORIES);

// 2. Ekstrak dan Urutkan PACKAGES
const pkgMatch = content.match(/export const PACKAGES: PackageItem\[\] = (\[[\s\S]*?\n\];)/);
if (!pkgMatch) {
  console.error('Gagal menemukan PACKAGES di pricelistData.ts');
  process.exit(1);
}

eval('var RAW_PACKAGES = ' + pkgMatch[1]);

// Hapus duplikasi jika ada ID yang sama (ambil instance yang pertama/lengkap)
const seenIds = new Set();
const uniquePackages = [];
for (const p of RAW_PACKAGES) {
  if (!seenIds.has(p.id)) {
    seenIds.add(p.id);
    uniquePackages.push(p);
  }
}

// Urutkan berdasarkan CATEGORY_ORDER
uniquePackages.sort((a, b) => {
  const indexA = CATEGORY_ORDER.indexOf(a.category);
  const indexB = CATEGORY_ORDER.indexOf(b.category);
  const posA = indexA === -1 ? 99 : indexA;
  const posB = indexB === -1 ? 99 : indexB;
  return posA - posB;
});

// Format ulang PACKAGES array string
const formattedPackagesStr = 'export const PACKAGES: PackageItem[] = ' + JSON.stringify(uniquePackages, null, 2) + ';';

content = content.replace(/export const PACKAGES: PackageItem\[\] = \[[\s\S]*?\n\];/, formattedPackagesStr);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Berhasil mengurutkan CATEGORIES dan PACKAGES sesuai Gambar 2!');
console.log('Total Paket Unik:', uniquePackages.length);
