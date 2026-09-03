import { PackageItem, CategoryInfo, BackdropOption, FrameTemplate, AddOnOption, PricelistSheet, ReviewItem, BranchInfo, StudioBranch } from '../types';

export const CATEGORIES: CategoryInfo[] = [
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
];

export const PACKAGES: PackageItem[] = [
  {
    "id": "grad-indoor-elegant-scholar",
    "name": "Elegant Scholar (Graduation Indoor 1)",
    "category": "graduation-indoor",
    "tag": "Graduation Indoor 1",
    "durationMinutes": 30,
    "selectionTimeMinutes": 10,
    "includedPeople": 10,
    "includedPrints": "Cetak Uk 10Rs 2 Foto",
    "softFilesIncluded": true,
    "price": 330000,
    "originalPrice": 390000,
    "description": "1 Wisudawan + Family Maks 10 Org/frame, Unlimited Foto 30 menit, 1 Background, Edit 6 foto, Cetak Uk 10Rs 2 foto, All file via Google Drive, Maks 1 Kostum.",
    "highlights": [
      "1 Wisudawan + Family Maks 10 Org/frame",
      "Unlimited Foto 30 Menit",
      "1 Background Foto Pilihan",
      "Edit 6 Foto Professional",
      "Cetak Ukuran 10Rs (2 Foto)",
      "All File via Google Drive",
      "Maksimal 1 Kostum"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "grad-indoor-supreme-scholar",
    "name": "Supreme Scholar (Graduation Indoor 2)",
    "category": "graduation-indoor",
    "tag": "Graduation Indoor 2",
    "durationMinutes": 40,
    "selectionTimeMinutes": 10,
    "includedPeople": 10,
    "includedPrints": "Cetak Uk 10Rs 2 Foto",
    "softFilesIncluded": true,
    "price": 380000,
    "originalPrice": 450000,
    "description": "1 Wisudawan + Family Maks 10 Org/frame, Unlimited foto 40 Menit, 2 Background, Edit 8 Foto, All file via Google Drive, Cetak Uk 10Rs 2 foto, Maks 1 Kostum.",
    "highlights": [
      "1 Wisudawan + Family Maks 10 Org/frame",
      "Unlimited Foto 40 Menit",
      "2 Background Foto Pilihan",
      "Edit 8 Foto Professional",
      "Cetak Ukuran 10Rs (2 Foto)",
      "All File via Google Drive",
      "Maksimal 1 Kostum"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "grad-indoor-infinity-scholar",
    "name": "Infinity Scholar (Graduation Indoor 3)",
    "category": "graduation-indoor",
    "tag": "2 Wisudawan + Family",
    "durationMinutes": 40,
    "selectionTimeMinutes": 10,
    "includedPeople": 10,
    "includedPrints": "Cetak Uk 10Rs 2 Foto",
    "softFilesIncluded": true,
    "price": 530000,
    "originalPrice": 620000,
    "description": "2 Wisudawan + Family Maks 10 Org/frame, Unlimited foto 40 menit, 2 Background, all file via Google Drive, Edit 10 foto, Cetak Uk 10Rs 2 foto, Maks 1 Kostum (+ jika dua wisudawan saudara kandung jadi 425k).",
    "highlights": [
      "2 Wisudawan + Family Maks 10 Org/frame",
      "Unlimited Foto 40 Menit",
      "2 Background Foto Pilihan",
      "Edit 10 Foto Professional",
      "Cetak Ukuran 10Rs (2 Foto)",
      "All File via Google Drive",
      "Maksimal 1 Kostum",
      "Khusus 2 Wisudawan Saudara Kandung Jadi 425K"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "grad-bundling-ultimate-1",
    "name": "Ultimate Scholar 1 (Graduation Bundling)",
    "category": "graduation-indoor",
    "tag": "Bundling Indoor 1 + Outdoor (Hemat 50K)",
    "durationMinutes": 90,
    "selectionTimeMinutes": 15,
    "includedPeople": 10,
    "includedPrints": "Cetak Uk 10Rs 2 Foto + All File Drive",
    "softFilesIncluded": true,
    "price": 630000,
    "originalPrice": 680000,
    "description": "Paket bundling hemat: Paket Indoor 1 (Elegant Scholar) + Outdoor Smart 60 menit (Hemat 50K).",
    "highlights": [
      "Paket Indoor 1 (Elegant Scholar) + Outdoor Smart 60 Menit",
      "Hemat Rp 50.000 (Bundling Special)",
      "Unlimited Foto Indoor & Outdoor Kampus",
      "Edit Foto Professional",
      "Cetak Ukuran 10Rs (2 Foto)",
      "All File via Google Drive"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "grad-bundling-ultimate-2",
    "name": "Ultimate Scholar 2 (Graduation Bundling)",
    "category": "graduation-indoor",
    "tag": "Bundling Indoor 2 + Outdoor (Hemat 50K)",
    "durationMinutes": 100,
    "selectionTimeMinutes": 15,
    "includedPeople": 10,
    "includedPrints": "Cetak Uk 10Rs 2 Foto + All File Drive",
    "softFilesIncluded": true,
    "price": 680000,
    "originalPrice": 730000,
    "description": "Paket bundling hemat: Paket Indoor 2 (Supreme Scholar) + Outdoor Smart 60 Menit (Hemat 50K).",
    "highlights": [
      "Paket Indoor 2 (Supreme Scholar) + Outdoor Smart 60 Menit",
      "Hemat Rp 50.000 (Bundling Special)",
      "Unlimited Foto Indoor & Outdoor Kampus",
      "2 Background Indoor + Sesi Outdoor Kampus",
      "Edit Foto Professional",
      "Cetak Ukuran 10Rs (2 Foto)",
      "All File via Google Drive"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "grad-outdoor-smart-30",
    "name": "Smart 30 Menit (Grad Outdoor 1)",
    "category": "graduation-outdoor",
    "tag": "Wisuda Outdoor Express 30M",
    "durationMinutes": 30,
    "selectionTimeMinutes": 10,
    "includedPeople": 1,
    "includedPrints": "All File via Link Google Drive",
    "softFilesIncluded": true,
    "price": 280000,
    "originalPrice": 320000,
    "description": "30 Menit sesi wisuda outdoor, unlimited foto, edit 10 foto, around campus, free transport, & all file via Google Drive.",
    "highlights": [
      "Durasi 30 Menit Foto Sesi Outdoor",
      "Unlimited Foto Shoots",
      "Edit 10 Foto Professional",
      "Area Sesi: Around Campus",
      "Free Transport Fotografer",
      "All File via Link Google Drive"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "grad-outdoor-smart-60",
    "name": "Smart 60 Menit (Grad Outdoor 1)",
    "category": "graduation-outdoor",
    "tag": "Wisuda Outdoor Standard 60M",
    "durationMinutes": 60,
    "selectionTimeMinutes": 15,
    "includedPeople": 1,
    "includedPrints": "All File via Link Google Drive",
    "softFilesIncluded": true,
    "price": 355000,
    "originalPrice": 420000,
    "description": "60 Menit sesi wisuda outdoor, unlimited foto, edit 10 foto, around campus, free transport, & all file via Google Drive.",
    "highlights": [
      "Durasi 60 Menit Foto Sesi Outdoor Puas",
      "Unlimited Foto Shoots",
      "Edit 10 Foto Professional",
      "Area Sesi: Around Campus",
      "Free Transport Fotografer",
      "All File via Link Google Drive"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "grad-outdoor-cumlaude",
    "name": "Cumlaude (Grad Outdoor 2)",
    "category": "graduation-outdoor",
    "tag": "Include Video Cinematis",
    "durationMinutes": 75,
    "selectionTimeMinutes": 15,
    "includedPeople": 1,
    "includedPrints": "All File via Link Google Drive + Video",
    "softFilesIncluded": true,
    "price": 710000,
    "originalPrice": 850000,
    "description": "75 menit sesi wisuda outdoor premium, unlimited foto, VIDEO cinematic maks 1 menit, edit 10 foto, around campus, free transport, & all file via Google Drive.",
    "highlights": [
      "Durasi 75 Menit Sesi Foto & Video",
      "Unlimited Foto Shoots",
      "Include Video Cinematic Maks 1 Menit",
      "Edit 10 Foto Professional",
      "Area Sesi: Around Campus",
      "Free Transport Fotografer",
      "All File via Link Google Drive"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "grad-outdoor-group-2",
    "name": "Group Outdoor 2 Wisudawan",
    "category": "graduation-outdoor",
    "tag": "Outdoor 2 Wisudawan",
    "durationMinutes": 75,
    "selectionTimeMinutes": 15,
    "includedPeople": 2,
    "includedPrints": "All File via Google Drive",
    "softFilesIncluded": true,
    "price": 255000,
    "originalPrice": 300000,
    "description": "Paket outdoor wisuda 2 wisudawan (Rp 255.000 / wisudawan). 75 menit sesi, edit 20 foto + bisa foto bareng keluarga, all file Google Drive.",
    "highlights": [
      "Harga Rp 255.000 / Wisudawan (2 Wisudawan)",
      "Durasi 75 Menit Sesi Foto",
      "Edit 20 Foto Professional",
      "Bisa Foto Bareng Keluarga",
      "Semua Termasuk All File via Google Drive"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "grad-outdoor-group-3",
    "name": "Group Outdoor 3 Wisudawan",
    "category": "graduation-outdoor",
    "tag": "Outdoor 3 Wisudawan",
    "durationMinutes": 90,
    "selectionTimeMinutes": 15,
    "includedPeople": 3,
    "includedPrints": "All File via Google Drive",
    "softFilesIncluded": true,
    "price": 210000,
    "originalPrice": 250000,
    "description": "Paket outdoor wisuda 3 wisudawan (Rp 210.000 / wisudawan). 90 menit sesi, edit 30 foto + bisa foto bareng keluarga, all file Google Drive.",
    "highlights": [
      "Harga Rp 210.000 / Wisudawan (3 Wisudawan)",
      "Durasi 90 Menit Sesi Foto",
      "Edit 30 Foto Professional",
      "Bisa Foto Bareng Keluarga",
      "Semua Termasuk All File via Google Drive"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "grad-outdoor-group-4-5",
    "name": "Group Outdoor 4-5 Wisudawan",
    "category": "graduation-outdoor",
    "tag": "Outdoor 4-5 Wisudawan",
    "durationMinutes": 120,
    "selectionTimeMinutes": 20,
    "includedPeople": 5,
    "includedPrints": "All File via Google Drive",
    "softFilesIncluded": true,
    "price": 180000,
    "originalPrice": 220000,
    "description": "Paket outdoor wisuda 4-5 wisudawan (Rp 180.000 / wisudawan). 120 menit sesi, edit 40 foto + bisa foto bareng keluarga, all file Google Drive.",
    "highlights": [
      "Harga Rp 180.000 / Wisudawan (4-5 Wisudawan)",
      "Durasi 120 Menit Sesi Foto Puas",
      "Edit 40 Foto Professional",
      "Bisa Foto Bareng Keluarga",
      "Semua Termasuk All File via Google Drive"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1532649538693-f3a2ec1bf8bd?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "group-friendly-frame",
    "name": "Friendly Frame (Group 1)",
    "category": "group",
    "tag": "Group 3-10 Orang",
    "durationMinutes": 30,
    "selectionTimeMinutes": 10,
    "includedPeople": 10,
    "includedPrints": "All File via Google Drive",
    "softFilesIncluded": true,
    "price": 330000,
    "originalPrice": 380000,
    "description": "Jumlah 3-10 Orang, Maks 30 Menit, 1 background, Edit 6 foto, maks 2 kostum (+ 6 Menit untuk ganti kostum), Allfile via google drive.",
    "highlights": [
      "Jumlah 3-10 Orang",
      "Maksimal 30 Menit Sesi Foto (+6 Menit ganti kostum)",
      "1 Background Foto Pilihan",
      "Edit 6 Foto Professional",
      "Maksimal 2 Kostum",
      "Allfile via Google Drive"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "group-signature-squad",
    "name": "Signature Squad (Group 2)",
    "category": "group",
    "tag": "Group 11-20 Orang",
    "durationMinutes": 45,
    "selectionTimeMinutes": 10,
    "includedPeople": 20,
    "includedPrints": "All File via Google Drive",
    "softFilesIncluded": true,
    "price": 430000,
    "originalPrice": 500000,
    "description": "Jumlah 11 - 20 Orang, Maks 45 Menit, 1 Background, edit 6 foto, Maks 2 kostum (+ 6 Menit untuk ganti kostum), Allfile via google drive.",
    "highlights": [
      "Jumlah 11 - 20 Orang",
      "Maksimal 45 Menit Sesi Foto (+6 Menit ganti kostum)",
      "1 Background Foto",
      "Edit 6 Foto Professional",
      "Maksimal 2 Kostum",
      "Allfile via Google Drive"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "group-royal-ensemble",
    "name": "Royal Ensemble (Group 3)",
    "category": "group",
    "tag": "Group 21-30 Orang",
    "durationMinutes": 50,
    "selectionTimeMinutes": 15,
    "includedPeople": 30,
    "includedPrints": "All File via Google Drive",
    "softFilesIncluded": true,
    "price": 510000,
    "originalPrice": 580000,
    "description": "Jumlah 21-30 Orang, Maks 50 Menit, 1 background, edit 6 foto, Maks 2 kostum (+ 6 Menit untuk ganti kostum), Allfile via google drive.",
    "highlights": [
      "Jumlah 21 - 30 Orang",
      "Maksimal 50 Menit Sesi Foto (+6 Menit ganti kostum)",
      "1 Background Foto",
      "Edit 6 Foto Professional",
      "Maksimal 2 Kostum",
      "Allfile via Google Drive"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "group-imperial-union",
    "name": "Imperial Union (Group 4)",
    "category": "group",
    "tag": "Group 31-40 Orang (Maks 75 Org)",
    "durationMinutes": 55,
    "selectionTimeMinutes": 15,
    "includedPeople": 40,
    "includedPrints": "All File via Google Drive",
    "softFilesIncluded": true,
    "price": 630000,
    "originalPrice": 720000,
    "description": "Jumlah 31-40 Orang (diatas 40 +10K/Org Maks 75 Org)*, Maks 55 menit, 1 background, edit 6 foto, Maks 2 kostum (+ 6 Menit untuk ganti kostum), Allfile via google drive.",
    "highlights": [
      "Jumlah 31 - 40 Orang (Diatas 40 +10K/Org Maks 75 Org)",
      "Maksimal 55 Menit Sesi Foto (+6 Menit ganti kostum)",
      "1 Background Foto Wide",
      "Edit 6 Foto Professional",
      "Maksimal 2 Kostum",
      "Allfile via Google Drive"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "family-sweet-together",
    "name": "Sweet Together (Family 1)",
    "category": "family",
    "tag": "Keluarga Maks 10 Org",
    "durationMinutes": 30,
    "selectionTimeMinutes": 10,
    "includedPeople": 10,
    "includedPrints": "Cetak Uk 10Rs 2 Foto",
    "softFilesIncluded": true,
    "price": 330000,
    "originalPrice": 390000,
    "description": "Unlimited foto Maks 30 menit, 1 background, Edit 6 foto, all file via Googledrive, Cetak Uk 10Rs 2 Foto, Maks 10 orang dalam 1 Frame, Maks 1 Kostum (Potongan 50K khusus 3 anggota keluarga).",
    "highlights": [
      "Unlimited foto Maks 30 menit",
      "1 background | Edit 6 foto",
      "all file via Googledrive",
      "Cetak Uk 10Rs 2 Foto",
      "Maks 10 orang dalam 1 Frame",
      "Maks 1 Kostum",
      "Potongan 50K khusus yang hanya ada 3 anggota keluarga"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "family-happy-nest",
    "name": "Happy Nest (Family 2)",
    "category": "family",
    "tag": "Keluarga 2 Background",
    "durationMinutes": 40,
    "selectionTimeMinutes": 15,
    "includedPeople": 10,
    "includedPrints": "Cetak Uk 10Rs 2 Foto",
    "softFilesIncluded": true,
    "price": 380000,
    "originalPrice": 450000,
    "description": "Unlimited foto maks 40 menit, 2 background, Edit 8 foto, all file via google drive, Cetak Uk 10Rs 2 Foto, Maks 1 Kostum, Maks 10 orang dalam 1 frame.",
    "highlights": [
      "Unlimited foto maks 40 menit",
      "2 background | Edit 8 foto",
      "all file via google drive",
      "Cetak Uk 10Rs 2 Foto | Maks 1 Kostum",
      "Maks 10 orang dalam 1 frame"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "maternity-warm-embrace",
    "name": "Warm Embrace (Maternity 1)",
    "category": "maternity",
    "tag": "Maternity 1 Background",
    "durationMinutes": 30,
    "selectionTimeMinutes": 10,
    "includedPeople": 2,
    "includedPrints": "Cetak Uk 10Rs 2 Foto",
    "softFilesIncluded": true,
    "price": 255000,
    "originalPrice": 310000,
    "description": "Unlimited foto Maks 30 Menit, 1 Background, Edit 6 Foto, Cetak Uk 10Rs 2 Foto, Maks 1 kostum, Allfile via GoogleDrive.",
    "highlights": [
      "Unlimited foto Maks 30 Menit",
      "1 Background Foto Pilihan",
      "Edit 6 Foto Professional",
      "Cetak Uk 10Rs 2 Foto",
      "Maksimal 1 Kostum",
      "Allfile via GoogleDrive"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "maternity-golden-motherhood",
    "name": "Golden Motherhood (Maternity 2)",
    "category": "maternity",
    "tag": "Maternity 2 Background",
    "durationMinutes": 40,
    "selectionTimeMinutes": 15,
    "includedPeople": 2,
    "includedPrints": "Cetak Uk 10Rs 2 Foto",
    "softFilesIncluded": true,
    "price": 305000,
    "originalPrice": 370000,
    "description": "Unlimited Foto Maks 40 Menit, 2 background, 8 Edit foto, Allfile via google drive, Cetak Uk 10Rs 2 Foto, Maks 2 kostum (+ 6 Menit untuk ganti kostum).",
    "highlights": [
      "Unlimited Foto Maks 40 Menit",
      "2 Background Foto",
      "8 Edit Foto Professional",
      "Allfile via Google Drive",
      "Cetak Uk 10Rs 2 Foto",
      "Maksimal 2 Kostum (+ 6 Menit untuk ganti kostum)"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "personal-bold-statement",
    "name": "Bold Statement (Personal 1)",
    "category": "personal",
    "tag": "Personal 1 Outfit",
    "durationMinutes": 20,
    "selectionTimeMinutes": 10,
    "includedPeople": 1,
    "includedPrints": "Cetak Uk 4R Foto ATAU 10Rs 1 Foto",
    "softFilesIncluded": true,
    "price": 155000,
    "originalPrice": 190000,
    "description": "Unlimited Foto Maks 20 menit, 1 background, edit 5 foto, Allfile Via Google Drive, maks 1 Outfit, Cetak Uk 4R Foto Atau 10Rs 1 foto.",
    "highlights": [
      "Unlimited Foto Maks 20 Menit",
      "1 Background Foto",
      "Edit 5 Foto Professional",
      "Allfile Via Google Drive",
      "Maksimal 1 Outfit",
      "Cetak Uk 4R Foto ATAU 10Rs 1 Foto"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "personal-opulent-shot",
    "name": "Opulent Shot (Personal 2)",
    "category": "personal",
    "tag": "Personal 2 Outfit",
    "durationMinutes": 25,
    "selectionTimeMinutes": 10,
    "includedPeople": 1,
    "includedPrints": "Cetak Uk 4R 4 Foto ATAU 10Rs 1 Foto",
    "softFilesIncluded": true,
    "price": 255000,
    "originalPrice": 300000,
    "description": "Unlimited Foto Maks 25 Menit, 2 Background Edit 6 Foto, Allfile Via google Drive, Maks 2 Outfit (+ 6 Menit untuk ganti kostum), Cetak Uk 4R 4 Foto Atau 10Rs 1 Foto.",
    "highlights": [
      "Unlimited Foto Maks 25 Menit",
      "2 Background Foto",
      "Edit 6 Foto Professional",
      "Allfile Via Google Drive",
      "Maksimal 2 Outfit (+ 6 Menit untuk ganti kostum)",
      "Cetak Uk 4R 4 Foto ATAU 10Rs 1 Foto"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "couple-eternal-love",
    "name": "Eternal Love (Couple 1)",
    "category": "couple",
    "tag": "Couple 1 Background",
    "durationMinutes": 30,
    "selectionTimeMinutes": 10,
    "includedPeople": 2,
    "includedPrints": "Cetak Uk 4R 4 Foto / 10Rs 1 Foto",
    "softFilesIncluded": true,
    "price": 255000,
    "originalPrice": 310000,
    "description": "Unlimited foto Maks 30 menit, 1 background, 6 Edit foto, all file google drive, Maks 1 outfit, Cetak Uk 4r 4 foto / 10Rs 1 Foto.",
    "highlights": [
      "Unlimited foto Maks 30 Menit",
      "1 Background Foto Pilihan",
      "Edit 6 Foto Professional",
      "All File Google Drive",
      "Maksimal 1 Outfit",
      "Cetak Uk 4R 4 Foto / 10Rs 1 Foto"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "couple-sweet-memories",
    "name": "Sweet Memories (Couple 2)",
    "category": "couple",
    "tag": "Couple 2 Background",
    "durationMinutes": 40,
    "selectionTimeMinutes": 15,
    "includedPeople": 2,
    "includedPrints": "Cetak Uk 4R 4 Foto / 10Rs 1 Foto",
    "softFilesIncluded": true,
    "price": 305000,
    "originalPrice": 370000,
    "description": "Unlimited foto Maks 40 menit, 2 background, 8 Edit foto, all file google drive, Maks 1 outfit, Cetak Uk 4r 4 foto / 10Rs 1 Foto.",
    "highlights": [
      "Unlimited foto Maks 40 Menit",
      "2 Background Foto",
      "Edit 8 Foto Professional",
      "All File Google Drive",
      "Maksimal 1 Outfit",
      "Cetak Uk 4R 4 Foto / 10Rs 1 Foto"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "birthday-sweet-celebration",
    "name": "Sweet Celebration (Birthday 1)",
    "category": "birthday",
    "tag": "Solo Birthday 1 Person",
    "durationMinutes": 25,
    "selectionTimeMinutes": 10,
    "includedPeople": 1,
    "includedPrints": "2 Foto Cetak Uk 10Rs",
    "softFilesIncluded": true,
    "price": 199000,
    "originalPrice": 240000,
    "description": "Foto 25 Menit, 1 background foto, 1 Person, All file via Google Drive, 6 foto Edit | 2 Foto Cetak Uk 10Rs, Properti birthday Dari Klien.",
    "highlights": [
      "Foto 25 Menit Sesi Ulang Tahun",
      "1 Background Foto",
      "1 Person",
      "All File via Google Drive",
      "6 Foto Edit | 2 Foto Cetak Uk 10Rs",
      "Properti Birthday Dari Klien"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "birthday-glow-sweet",
    "name": "Glow Sweet Celebration (Birthday 2)",
    "category": "birthday",
    "tag": "Birthday 2-3 Person",
    "durationMinutes": 30,
    "selectionTimeMinutes": 10,
    "includedPeople": 3,
    "includedPrints": "2 Foto Cetak Uk 10Rs",
    "softFilesIncluded": true,
    "price": 275000,
    "originalPrice": 320000,
    "description": "Foto 30 Menit, 1 Background Foto, 2 - 3 Person, All file Google Drive, 6 Foto Edit | 2 Foto cetak Uk 10Rs, Properti birthday dari klien.",
    "highlights": [
      "Foto 30 Menit Sesi Ulang Tahun",
      "1 Background Foto",
      "2 - 3 Person",
      "All File Google Drive",
      "6 Foto Edit | 2 Foto Cetak Uk 10Rs",
      "Properti Birthday Dari Klien"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "birthday-sweet-light",
    "name": "Sweet Light (Birthday 3)",
    "category": "birthday",
    "tag": "Include Balon & Tulisan",
    "durationMinutes": 30,
    "selectionTimeMinutes": 10,
    "includedPeople": 1,
    "includedPrints": "2 Foto Cetak Uk 10Rs",
    "softFilesIncluded": true,
    "price": 250000,
    "originalPrice": 300000,
    "description": "Foto 30 Menit, 1 Background foto, 1 Person, All file via Google Drive, 8 Foto edit | 2 Foto cetak Uk 10Rs, Include Properti: tulisan birthday, 12 Balon Latex, balon angka, 1 Balon Angka 80cm.",
    "highlights": [
      "Foto 30 Menit Sesi Studio",
      "1 Background Foto",
      "1 Person",
      "All File via Google Drive",
      "8 Foto Edit | 2 Foto Cetak Uk 10Rs",
      "Include Properti: Tulisan Birthday, 12 Balon Latex, Balon Angka, 1 Balon Angka 80cm"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "birthday-ultimate-sweet-light",
    "name": "Ultimate Sweet Light (Birthday 4)",
    "category": "birthday",
    "tag": "Birthday Sultan Full Decor",
    "durationMinutes": 30,
    "selectionTimeMinutes": 10,
    "includedPeople": 3,
    "includedPrints": "2 Cetak Foto Uk 10Rs",
    "softFilesIncluded": true,
    "price": 325000,
    "originalPrice": 380000,
    "description": "Foto 30 menit, 1 background, 2-3 person, ALL file via Google Drive, 8 Edit foto | 2 Cetak foto, Include Properti: tulisan birthday, balon 12 pas, balon angka bebas pilihan warna, 1 Balon Angka 80cm.",
    "highlights": [
      "Foto 30 Menit Sesi Ulang Tahun",
      "1 Background Foto",
      "2 - 3 Person",
      "All File via Google Drive",
      "8 Edit Foto | 2 Cetak Foto Uk 10Rs",
      "Include Properti: Tulisan Birthday, Balon 12 Pas, Balon Angka Bebas Pilihan Warna, 1 Balon Angka 80cm"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "undangan-paket-1",
    "name": "Paket Undangan 1",
    "category": "undangan",
    "tag": "Undangan Maks 2 Orang",
    "durationMinutes": 20,
    "selectionTimeMinutes": 10,
    "includedPeople": 2,
    "includedPrints": "File Siap Pakai Undangan",
    "softFilesIncluded": true,
    "price": 95000,
    "originalPrice": 130000,
    "description": "Maks 2 Orang, maks 5 gaya, Allfile Via Googledrive.",
    "highlights": [
      "Maksimal 2 Orang",
      "Maksimal 5 Gaya / Pose Foto",
      "Allfile Foto via Google Drive",
      "Format Foto Siap Cetak & Web Undangan Digital"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "undangan-paket-2",
    "name": "Paket Undangan 2",
    "category": "undangan",
    "tag": "Undangan Maks 4 Orang",
    "durationMinutes": 30,
    "selectionTimeMinutes": 10,
    "includedPeople": 4,
    "includedPrints": "File Siap Pakai Undangan",
    "softFilesIncluded": true,
    "price": 155000,
    "originalPrice": 195000,
    "description": "Maks 4 Orang, maks 5 gaya, Allfile Via Googledrive.",
    "highlights": [
      "Maksimal 4 Orang (Pasangan & Pengiring/Keluarga)",
      "Maksimal 5 Gaya / Pose Foto",
      "Allfile Foto via Google Drive",
      "Format Foto Siap Cetak & Web Undangan Digital"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "prewed-sweet-promise",
    "name": "Sweet Promise (Prewedd 1)",
    "category": "prewed",
    "tag": "Prewedd 1 Background",
    "durationMinutes": 50,
    "selectionTimeMinutes": 15,
    "includedPeople": 2,
    "includedPrints": "Cetak 12Rs + Bingkai",
    "softFilesIncluded": true,
    "price": 550000,
    "originalPrice": 680000,
    "description": "Maks 50 Menit, 1 background, Edit 10 foto, allfile google drive, Maks 2 kostum, Cetak 12Rs + Bingkai.",
    "highlights": [
      "Maksimal 50 Menit Sesi Foto",
      "1 Background Foto",
      "Edit 10 Foto Professional",
      "Allfile Google Drive",
      "Maksimal 2 Kostum",
      "Cetak 12Rs + Bingkai"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "prewed-velvet-romance",
    "name": "Velvet Romance (Prewedd 2)",
    "category": "prewed",
    "tag": "Prewedd 2 Background",
    "durationMinutes": 60,
    "selectionTimeMinutes": 20,
    "includedPeople": 2,
    "includedPrints": "Cetak 12Rs + Bingkai",
    "softFilesIncluded": true,
    "price": 600000,
    "originalPrice": 750000,
    "description": "Maks 60 Menit, 2 background, Edit 13 foto, allfile via google drive, Maks 2 kostum, Cetak 12 + Bingkai.",
    "highlights": [
      "Maksimal 60 Menit Sesi Foto",
      "2 Background Foto",
      "Edit 13 Foto Professional",
      "Allfile via Google Drive",
      "Maksimal 2 Kostum",
      "Cetak 12Rs + Bingkai"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "prewed-bundling-1",
    "name": "Bundling 1 (Prewedd 3)",
    "category": "prewed",
    "tag": "Paket Lengkap Make Up & Kostum",
    "durationMinutes": 60,
    "selectionTimeMinutes": 20,
    "includedPeople": 2,
    "includedPrints": "Cetak 12Rs + Bingkai",
    "softFilesIncluded": true,
    "price": 1400000,
    "originalPrice": 1750000,
    "description": "Paket Sweet Promise + Make Up, Hijab Do, Softlens, Sepasang Kostum (Bisa Memilih).",
    "highlights": [
      "Paket Sweet Promise (50 Menit, 1 Background, 10 Edit, Allfile, Cetak 12Rs + Bingkai)",
      "Make Up Professional",
      "Hijab Do / Hairdo",
      "Softlens",
      "Sepasang Kostum Prewed Pilihan (Bisa Memilih)"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "prewed-bundling-2",
    "name": "Bundling 2 (Prewedd 4)",
    "category": "prewed",
    "tag": "Paket Sultan Full Service",
    "durationMinutes": 70,
    "selectionTimeMinutes": 25,
    "includedPeople": 2,
    "includedPrints": "Cetak 12Rs + Bingkai",
    "softFilesIncluded": true,
    "price": 1500000,
    "originalPrice": 1900000,
    "description": "Paket Velvet Romance + Make Up, Hijab Do, Softlens, Sepasang Kostum (Bisa Memilih).",
    "highlights": [
      "Paket Velvet Romance (60 Menit, 2 Background, 13 Edit, Allfile, Cetak 12Rs + Bingkai)",
      "Make Up Professional",
      "Hijab Do / Hairdo",
      "Softlens",
      "Sepasang Kostum Prewed Pilihan (Bisa Memilih)"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "passfoto-1",
    "name": "Pass foto 1 (Paket 1)",
    "category": "pass-foto",
    "tag": "Paket 1 - Setengah Badan",
    "durationMinutes": 15,
    "selectionTimeMinutes": 5,
    "includedPeople": 1,
    "includedPrints": "Cetak 1 Ukuran Pass Foto",
    "softFilesIncluded": true,
    "price": 50000,
    "originalPrice": 65000,
    "description": "3 Warna Background Edit, Maks 1 Outfit, 1 Edit foto (Setengah badan), File Edit via WA Dokumen, Cetak 1 Ukuran Pass Foto.",
    "highlights": [
      "3 Warna Background Edit",
      "Maksimal 1 Outfit",
      "1 Edit Foto (Setengah Badan)",
      "File Edit via WA Dokumen",
      "Cetak 1 Ukuran Pass Foto (Bisa Langsung Jadi)"
    ],
    "popular": true,
    "image": "/images/poster-passfoto.png"
  },
  {
    "id": "passfoto-2",
    "name": "Pass Foto 2 (Paket 2)",
    "category": "pass-foto",
    "tag": "Paket 2 - Setengah & Full Badan",
    "durationMinutes": 20,
    "selectionTimeMinutes": 10,
    "includedPeople": 1,
    "includedPrints": "Cetak 1 Ukuran Pass Foto",
    "softFilesIncluded": true,
    "price": 90000,
    "originalPrice": 110000,
    "description": "3 Background Edit Setengah badan, Edit 1 full badan, Setengah badan & full Badan, File Edit Via Wa Dokumen, Maks 1 Outfit, Cetak 1 ukuran Pass Foto.",
    "highlights": [
      "3 Background Edit Setengah Badan",
      "Edit 1 Full Badan",
      "Setengah Badan & Full Badan",
      "File Edit via WA Dokumen",
      "Maksimal 1 Outfit",
      "Cetak 1 Ukuran Pass Foto"
    ],
    "popular": false,
    "image": "/images/poster-passfoto.png"
  },
  {
    "id": "passfoto-3",
    "name": "Pass foto 3 (Paket 3 - Nikah 2 Orang)",
    "category": "pass-foto",
    "tag": "Paket 3 - Paket Nikah 2 Orang",
    "durationMinutes": 25,
    "selectionTimeMinutes": 10,
    "includedPeople": 2,
    "includedPrints": "Masing-masing Cetak 1 Ukuran Pass Foto",
    "softFilesIncluded": true,
    "price": 98000,
    "originalPrice": 125000,
    "description": "Paket Nikah Untuk 2 Orang, 3 Warna Background Edit, masing Masing 1 Edit Foto, File edit via dokumen WA, masing masing Cetak 1 Ukuran Pass Foto.",
    "highlights": [
      "Paket Nikah Khusus Untuk 2 Orang (Calon Pengantin)",
      "3 Warna Background Edit (Biru / Merah / Putih)",
      "Masing-masing 1 Edit Foto Professional",
      "File Edit via Dokumen WA",
      "Masing-masing Cetak 1 Ukuran Pass Foto"
    ],
    "popular": true,
    "image": "/images/poster-passfoto.png"
  },
  {
    "id": "sewa-studio-hourly",
    "name": "Sewa Studio (Rental 60 Menit)",
    "category": "sewa-studio",
    "tag": "Rental Studio 60 Menit",
    "durationMinutes": 60,
    "selectionTimeMinutes": 0,
    "includedPeople": 6,
    "includedPrints": "Tanpa Cetak (Khusus Sewa Ruangan & Lighting)",
    "softFilesIncluded": true,
    "price": 175000,
    "originalPrice": 220000,
    "description": "2 Background, maks 60 Menit, 2 Lighting | 1 Trigger | 2 Stand light.",
    "highlights": [
      "2 Background Pilihan",
      "Maksimal 60 Menit Sesi Sewa",
      "2 Lighting Studio Profesional",
      "1 Flash Trigger Universal",
      "2 Stand Light Kokoh",
      "Ruang Ber-AC & Dressing Table"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "self-special-narsis",
    "name": "Special Narsis",
    "category": "self-studio",
    "subCategory": "Special",
    "tag": "Promo Wajib S&K (55K)",
    "durationMinutes": 15,
    "selectionTimeMinutes": 10,
    "includedPeople": 5,
    "includedPrints": "Belum Termasuk Cetak",
    "softFilesIncluded": true,
    "price": 55000,
    "originalPrice": 75000,
    "description": "Maksimal 5 orang (Lebih dari 5 +15k/orang), Unlimited shoots, Durasi 15 menit/sesi foto, Belum termasuk cetak, 1 Background, Available fun props, All file Google Drive.",
    "highlights": [
      "Maksimal 5 Orang (Lebih dari 5 +15k/orang)",
      "Unlimited Shoots",
      "Durasi 15 Menit Sesi Foto",
      "Belum Termasuk Cetak",
      "1 Background Pilihan",
      "Available Fun Props",
      "All File Google Drive",
      "Wajib Mengikuti Syarat & Ketentuan"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "self-special-super-narsis",
    "name": "Special Super Narsis",
    "category": "self-studio",
    "subCategory": "Special",
    "tag": "Promo Wajib S&K (70K)",
    "durationMinutes": 20,
    "selectionTimeMinutes": 10,
    "includedPeople": 5,
    "includedPrints": "Free Cetak 2 Polaroid",
    "softFilesIncluded": true,
    "price": 70000,
    "originalPrice": 90000,
    "description": "Maksimal 5 orang (Lebih dari 5 +15k/orang), Unlimited shoots, Durasi 20 menit/sesi foto, Free cetak 2 polaroid, 1 Background, Available fun props, All file Google Drive.",
    "highlights": [
      "Maksimal 5 Orang (Lebih dari 5 +15k/orang)",
      "Unlimited Shoots",
      "Durasi 20 Menit Sesi Foto",
      "Free Cetak 2 Polaroid",
      "1 Background Pilihan",
      "Available Fun Props",
      "All File Google Drive",
      "Wajib Mengikuti Syarat & Ketentuan"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "self-normal-narsis",
    "name": "Normal Narsis",
    "category": "self-studio",
    "subCategory": "Normal",
    "tag": "Tanpa S&K • Favorit",
    "durationMinutes": 15,
    "selectionTimeMinutes": 10,
    "includedPeople": 5,
    "includedPrints": "Free 2 Lembar Cetak Polaroid",
    "softFilesIncluded": true,
    "price": 80000,
    "originalPrice": 100000,
    "description": "Paket Self Studio Normal tanpa syarat & ketentuan. Maksimal 5 orang dengan durasi 15 menit, unlimited shoots, dan gratis semua soft file via Google Drive.",
    "highlights": [
      "Maksimal 5 Orang (Lebih dari 5 +15k/orang)",
      "Unlimited Shoots",
      "Durasi 15 Menit Sesi Foto",
      "Free 2 Lembar Cetak Polaroid",
      "1 Choice Background",
      "Tanpa Syarat & Ketentuan",
      "All Files Google Drive"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "self-normal-super-narsis",
    "name": "Normal Super Narsis",
    "category": "self-studio",
    "subCategory": "Normal",
    "tag": "Tanpa S&K • Puas 20M",
    "durationMinutes": 20,
    "selectionTimeMinutes": 10,
    "includedPeople": 5,
    "includedPrints": "Free 2 Lembar Cetak Polaroid",
    "softFilesIncluded": true,
    "price": 95000,
    "originalPrice": 120000,
    "description": "Sesi foto lebih puas 20 menit tanpa syarat & ketentuan! Bebas berekspresi sepuasnya tanpa rasa canggung untuk maksimal 5 orang.",
    "highlights": [
      "Maksimal 5 Orang (Lebih dari 5 +15k/orang)",
      "Unlimited Shoots",
      "Durasi 20 Menit Sesi Foto",
      "Free 2 Lembar Cetak Polaroid",
      "1 Choice Background",
      "Tanpa Syarat & Ketentuan",
      "All Files Google Drive"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "self-special-spotlight",
    "name": "Special Colour Spotlight",
    "category": "self-studio",
    "subCategory": "Color Spotlight",
    "tag": "RGB Spotlight Promo",
    "durationMinutes": 20,
    "selectionTimeMinutes": 10,
    "includedPeople": 5,
    "includedPrints": "Free 2 Lembar Cetak Polaroid Spotlight",
    "softFilesIncluded": true,
    "price": 99000,
    "originalPrice": 125000,
    "description": "Efek pencahayaan spotlight warna-warni dual-tone (Cyber Magenta, Warm Sunset, Electric Cyan) harga hemat dengan Wajib Mengikuti Syarat & Ketentuan.",
    "highlights": [
      "Maksimal 5 Orang (Lebih dari 5 +15k/orang)",
      "Unlimited Shoots",
      "Durasi 20 Menit Sesi Foto",
      "Free 2 Lembar Cetak Polaroid",
      "RGB & Dual Spotlight Lighting",
      "Wajib Mengikuti Syarat & Ketentuan",
      "All Files Google Drive"
    ],
    "popular": true,
    "image": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "self-normal-spotlight",
    "name": "Normal Colour Spotlight",
    "category": "self-studio",
    "subCategory": "Color Spotlight",
    "tag": "RGB Spotlight Tanpa S&K",
    "durationMinutes": 20,
    "selectionTimeMinutes": 10,
    "includedPeople": 5,
    "includedPrints": "Free 2 Lembar Cetak Polaroid Spotlight",
    "softFilesIncluded": true,
    "price": 115000,
    "originalPrice": 140000,
    "description": "Pencahayaan sorot fokus lingkaran hangat/warna dengan latar belakang netral tanpa perlu mengikuti syarat & ketentuan.",
    "highlights": [
      "Maksimal 5 Orang (Lebih dari 5 +15k/orang)",
      "Unlimited Shoots",
      "Durasi 20 Menit Sesi Foto",
      "Free 2 Lembar Cetak Polaroid",
      "Spotlight Lighting Bebas Tanpa S&K",
    "All Files Google Drive"
    ],
    "popular": false,
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
  }
];

export const STUDIO_BRANCHES: BranchInfo[] = [
  {
    id: 'cabang-1',
    name: 'Alviero Studio — Studio 1',
    shortName: 'Studio 1 (Karangploso)',
    tagline: 'Karangploso, Kab. Malang',
    address: 'Jl. Raya Kertanegara, RT.003/RW.001, Karangploso, Girimoyo, Kec. Karang Ploso, Kabupaten Malang, Jawa Timur 65151',
    badge: 'Studio 1',
    description: 'Pusat Self Studio & Studio Foto',
    highlights: [],
    icon: '📍',
    mapsUrl: 'https://maps.app.goo.gl/oxtptpr3RSDL9zCj6',
    whatsappNumber: '6287777538164',
    whatsappDisplay: '0877-7753-8164'
  },
  {
    id: 'cabang-2',
    name: 'Alviero Studio — Studio 2',
    shortName: 'Studio 2 (Dinoyo Gajayana)',
    tagline: 'Dinoyo Gajayana, Kota Malang',
    address: 'Ruko Gajayana, Jl. Simpang Gajayana No.Kav.P, Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144',
    badge: 'Studio 2',
    description: 'Self Studio & Studio Foto',
    highlights: [],
    icon: '🏢',
    mapsUrl: 'https://maps.app.goo.gl/W4Jojd1B9TBZxWWP9',
    whatsappNumber: '6285168879214',
    whatsappDisplay: '0851-6887-9214'
  }
];

export const BACKGROUNDS: BackgroundOption[] = [
  // ==================== STUDIO 1 & 2 - BACKGROUNDS ====================
  {
    id: 'hijau',
    name: 'Hijau Pastel',
    category: 'solid-color',
    hex: '#A7D7C5',
    description: 'Latar hijau pastel lembut untuk nuansa foto estetik dan segar.',
    previewImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    applicableTo: ['pro-studio'],
    applicableBranches: ['cabang-1']
  },
  {
    id: 'cream',
    name: 'Cream',
    category: 'solid-color',
    hex: '#FEF3C7',
    description: 'Latar cream hangat untuk tone pastel yang lembut.',
    previewImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    applicableTo: ['pro-studio'],
    applicableBranches: ['cabang-1']
  },
  {
    id: 'limbo',
    name: 'Limbo',
    category: 'solid-color',
    hex: '#E5E7EB',
    description: 'Latar limbo mulus tanpa sudut untuk efek ruang tak terbatas.',
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    applicableTo: ['pro-studio'],
    applicableBranches: ['cabang-1']
  },
  {
    id: 'putih-tengah',
    name: 'Putih Tengah',
    category: 'solid-color',
    hex: '#F1F5F9',
    description: 'Latar putih tengah dengan pencahayaan seimbang.',
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    applicableTo: ['pro-studio'],
    applicableBranches: ['cabang-1']
  },
  {
    id: 'putih-jendela',
    name: 'Putih Jendela',
    category: 'solid-color',
    hex: '#FAFAFA',
    description: 'Latar putih cerah dengan efek pencahayaan jendela natural.',
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    applicableTo: ['pro-studio'],
    applicableBranches: ['cabang-1']
  },

  // ==================== STUDIO 2 (DINOYO) - 5 BACKGROUND RESMI ====================
  {
    id: 'c2-hitam',
    name: 'Hitam',
    category: 'solid-color',
    hex: '#111827',
    description: 'Latar hitam pekat elegan untuk kesan foto profesional, formal & tegas.',
    previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    applicableTo: ['pro-studio', 'self-studio'],
    applicableBranches: ['cabang-2']
  },
  {
    id: 'c2-putih',
    name: 'Putih',
    category: 'solid-color',
    hex: '#F8FAFC',
    description: 'Latar putih bersih minimalis untuk foto wisuda, keluarga & grup.',
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    applicableTo: ['pro-studio', 'self-studio'],
    applicableBranches: ['cabang-2']
  },
  {
    id: 'c2-abu',
    name: 'Abu-abu',
    category: 'solid-color',
    hex: '#64748B',
    description: 'Latar abu-abu netral elegan untuk kesan modern & aesthetic.',
    previewImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
    applicableTo: ['pro-studio', 'self-studio'],
    applicableBranches: ['cabang-2']
  },
  {
    id: 'c2-coklat-jendela',
    name: 'Coklat Jendela',
    category: 'solid-color',
    hex: '#92400E',
    description: 'Latar coklat klasik dengan ornamen jendela mewah berkarakter.',
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
    applicableTo: ['pro-studio', 'self-studio'],
    applicableBranches: ['cabang-2']
  },
  {
    id: 'c2-tematik-cream',
    name: 'Tematik Cream',
    category: 'solid-color',
    hex: '#FEF3C7',
    description: 'Latar tematik cream hangat untuk tone pastel lembut (Maksimal 5 Orang).',
    previewImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    applicableTo: ['pro-studio', 'self-studio'],
    applicableBranches: ['cabang-2']
  }
];

export const BACKDROPS = BACKGROUNDS;

export const FRAME_TEMPLATES: FrameTemplate[] = [
  {
    id: 'frame-4cut-classic',
    name: 'Classic 4-Cut Strip',
    gridType: '4-cut',
    description: 'Format strip vertikal 4 foto klasik khas photo booth Korea.',
    aspectRatio: '1:3',
    previewImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'frame-6cut-grid',
    name: '6-Cut Collage Layout',
    gridType: '6-cut',
    description: 'Enam foto disusun rapi 2x3 cocok untuk menunjukkan beragam pose.',
    aspectRatio: '2:3',
    previewImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'frame-wide-angle',
    name: 'Wide Angle 0.5x Mode',
    gridType: 'wide-angle',
    description: 'Kamera sudut lebar kekinian yang unik dan mencakup lebih banyak ruang.',
    aspectRatio: '4:3',
    previewImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'frame-polaroid-y2k',
    name: 'Y2K Retro Polaroid',
    gridType: 'polaroid',
    description: 'Bingkai tebal gaya kamera instan retro dengan catatan nama & tanggal.',
    aspectRatio: '1:1',
    previewImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80'
  }
];

export const ADD_ONS: AddOnOption[] = [
  // ==================== GLOBAL GOOGLE DRIVE STORAGE ADD-ONS ====================
  // Photo Studio (Semua Paket Foto selain Self Studio): 1 Bulan 10K, 2 Bulan 20K
  {
    id: 'studio-keep-drive-1m',
    name: 'Keep Link Google Drive 1 Bulan',
    price: 10000,
    unit: 'bulan',
    description: 'Penyimpanan & masa aktif link file Google Drive diperpanjang selama 1 bulan.',
    category: 'file',
    applicableCategories: [
      'grad-indoor',
      'grad-outdoor',
      'pass-foto',
      'group',
      'family',
      'birthday',
      'maternity',
      'personal',
      'couple',
      'prewedding',
      'undangan',
      'sewa-studio'
    ]
  },
  {
    id: 'studio-keep-drive-2m',
    name: 'Keep Link Google Drive 2 Bulan',
    price: 20000,
    unit: 'bulan',
    description: 'Penyimpanan & masa aktif link file Google Drive diperpanjang selama 2 bulan.',
    category: 'file',
    applicableCategories: [
      'grad-indoor',
      'grad-outdoor',
      'pass-foto',
      'group',
      'family',
      'birthday',
      'maternity',
      'personal',
      'couple',
      'prewedding',
      'undangan',
      'sewa-studio'
    ]
  },
  // Self Studio (Khusus Bilik Self Studio): 1 Bulan 5K, 2 Bulan 10K
  {
    id: 'self-keep-drive-1m',
    name: 'Keep Link Google Drive 1 Bulan',
    price: 5000,
    unit: 'bulan',
    description: 'Penyimpanan & masa aktif link file Google Drive diperpanjang selama 1 bulan.',
    category: 'selfstudio',
    applicableCategories: ['self-studio']
  },
  {
    id: 'self-keep-drive-2m',
    name: 'Keep Link Google Drive 2 Bulan',
    price: 10000,
    unit: 'bulan',
    description: 'Penyimpanan & masa aktif link file Google Drive diperpanjang selama 2 bulan.',
    category: 'selfstudio',
    applicableCategories: ['self-studio']
  },

  // ==================== 1. GRADUATION INDOOR ====================
  {
    id: 'grad-indoor-frame-10rs',
    name: 'Bingkai Uk 10Rs / Foto',
    price: 35000,
    unit: 'foto',
    description: 'Bingkai pigura minimalis ukuran 10Rs (20x30 cm).',
    category: 'frame',
    applicableCategories: ['grad-indoor']
  },
  {
    id: 'grad-indoor-extra-bg',
    name: 'Tambahan Background',
    price: 75000,
    unit: 'background',
    description: 'Ganti / tambah 1 background tema indoor saat sesi foto.',
    category: 'file',
    applicableCategories: ['grad-indoor']
  },
  {
    id: 'grad-indoor-kostum-klien',
    name: 'Kostum (Dari Klien)',
    price: 50000,
    unit: 'kostum',
    description: 'Biaya ganti 1 stel kostum tambahan yang dibawa klien.',
    category: 'prop',
    applicableCategories: ['grad-indoor']
  },
  {
    id: 'grad-indoor-extra-person',
    name: 'Tambahan Orang (Di Atas 10 Orang)',
    price: 10000,
    unit: 'orang',
    description: 'Tambahan biaya per orang untuk rombongan wisuda di atas 10 peserta.',
    category: 'person',
    applicableCategories: ['grad-indoor']
  },
  {
    id: 'grad-indoor-wisudawan-saudara',
    name: 'Wisudawan (Saudara Kandung)',
    price: 50000,
    unit: 'orang',
    description: 'Tambahan sesi untuk wisudawan saudara kandung dalam 1 sesi.',
    category: 'person',
    applicableCategories: ['grad-indoor']
  },
  {
    id: 'grad-indoor-makeup',
    name: 'Make Up Wisuda',
    price: 250000,
    unit: 'orang',
    description: 'Jasa makeup profesional wisuda tahan lama dan flawless.',
    category: 'person',
    applicableCategories: ['grad-indoor']
  },
  {
    id: 'grad-indoor-edit',
    name: 'Additional Edit',
    price: 10000,
    unit: 'foto',
    description: 'Tambahan 1 file edit foto wisuda retouching halus.',
    category: 'file',
    applicableCategories: ['grad-indoor']
  },
  {
    id: 'grad-indoor-print-10rs',
    name: 'Cetak Uk 10Rs',
    price: 15000,
    unit: 'foto',
    description: 'Cetak foto lab ukuran 10Rs (20.3 x 30.5 cm).',
    category: 'print',
    applicableCategories: ['grad-indoor']
  },
  {
    id: 'grad-indoor-print-12rs',
    name: 'Cetak Uk 12Rs',
    price: 50000,
    unit: 'foto',
    description: 'Cetak foto lab ukuran 12Rs (30.5 x 45 cm).',
    category: 'print',
    applicableCategories: ['grad-indoor']
  },
  {
    id: 'grad-indoor-print-16rs',
    name: 'Cetak Uk 16Rs',
    price: 100000,
    unit: 'foto',
    description: 'Cetak foto lab ukuran 16Rs (40 x 60 cm).',
    category: 'print',
    applicableCategories: ['grad-indoor']
  },

  // ==================== 2. GRADUATION OUTDOOR ====================
  {
    id: 'grad-outdoor-extra-time',
    name: 'Tambahan Waktu (per 10 Menit)',
    price: 50000,
    unit: '10 menit',
    description: 'Tambahan durasi pemotretan wisuda outdoor per 10 menit.',
    category: 'file',
    applicableCategories: ['grad-outdoor']
  },
  {
    id: 'grad-outdoor-print-10rs',
    name: 'Cetak Uk 10Rs',
    price: 15000,
    unit: 'foto',
    description: 'Cetak foto lab ukuran 10Rs (20.3 x 30.5 cm).',
    category: 'print',
    applicableCategories: ['grad-outdoor']
  },
  {
    id: 'grad-outdoor-makeup',
    name: 'Make Up Wisuda Outdoor',
    price: 280000,
    unit: 'orang',
    description: 'Jasa makeup outdoor tahan keringat & cuaca terbuka.',
    category: 'person',
    applicableCategories: ['grad-outdoor']
  },
  {
    id: 'grad-outdoor-hairdo',
    name: 'Hairdo Wisuda',
    price: 150000,
    unit: 'orang',
    description: 'Penataan rambut / hijab styling khusus wisuda outdoor.',
    category: 'person',
    applicableCategories: ['grad-outdoor']
  },

  // ==================== 3. PASS FOTO ====================
  {
    id: 'passfoto-print-3x3',
    name: 'Cetak 3×3 (6 Foto)',
    price: 9000,
    unit: 'paket (6 foto)',
    description: 'Cetak fisik pass foto 3x3 sebanyak 6 lembar kertas Glossy Lab.',
    category: 'pass-foto',
    applicableCategories: ['pass-foto']
  },
  {
    id: 'passfoto-print-2x3',
    name: 'Cetak 2×3 (6 Foto)',
    price: 9000,
    unit: 'paket (6 foto)',
    description: 'Cetak fisik pass foto 2x3 sebanyak 6 lembar kertas Glossy Lab.',
    category: 'pass-foto',
    applicableCategories: ['pass-foto']
  },
  {
    id: 'passfoto-print-3x4',
    name: 'Cetak 3×4 (6 Foto)',
    price: 9000,
    unit: 'paket (6 foto)',
    description: 'Cetak fisik pass foto 3x4 sebanyak 6 lembar kertas Glossy Lab.',
    category: 'pass-foto',
    applicableCategories: ['pass-foto']
  },
  {
    id: 'passfoto-print-4x6',
    name: 'Cetak 4×6 (4 Foto)',
    price: 9000,
    unit: 'paket (4 foto)',
    description: 'Cetak fisik pass foto 4x6 sebanyak 4 lembar kertas Glossy Lab.',
    category: 'pass-foto',
    applicableCategories: ['pass-foto']
  },
  {
    id: 'passfoto-print-6x9',
    name: 'Cetak 6×9 (3 Foto)',
    price: 9000,
    unit: 'paket (3 foto)',
    description: 'Cetak fisik pass foto 6x9 sebanyak 3 lembar kertas Glossy Lab.',
    category: 'pass-foto',
    applicableCategories: ['pass-foto']
  },
  {
    id: 'passfoto-outfit-pose',
    name: 'Ganti Outfit / Pose',
    price: 15000,
    unit: 'pose',
    description: 'Ganti 1 stel pakaian atau 1 variasi pose pass foto.',
    category: 'pass-foto',
    applicableCategories: ['pass-foto']
  },
  {
    id: 'passfoto-additional-edit',
    name: 'Additional Edit',
    price: 10000,
    unit: 'foto',
    description: 'Tambahan 1 file edit pass foto retouching wajah.',
    category: 'pass-foto',
    applicableCategories: ['pass-foto']
  },
  {
    id: 'passfoto-gandeng-1warna',
    name: 'Foto Gandeng 1 Warna',
    price: 25000,
    unit: 'file',
    description: 'Edit foto gandeng buku nikah/resmi 1 warna latar.',
    category: 'pass-foto',
    applicableCategories: ['pass-foto']
  },
  {
    id: 'passfoto-makeup',
    name: 'Make Up Pass Foto',
    price: 100000,
    unit: 'orang',
    description: 'Jasa makeup natural rapi untuk foto resmi/ijazah/nikah.',
    category: 'pass-foto',
    applicableCategories: ['pass-foto']
  },
  {
    id: 'passfoto-bulumata',
    name: 'Pasang Bulu Mata',
    price: 25000,
    unit: 'orang',
    description: 'Pemasangan bulu mata natural untuk mempertegas mata.',
    category: 'pass-foto',
    applicableCategories: ['pass-foto']
  },

  // ==================== 4. PAKET GROUP ====================
  {
    id: 'group-extra-bg',
    name: 'Tambahan Background',
    price: 75000,
    unit: 'background',
    description: 'Ganti / tambah 1 background tema studio.',
    category: 'file',
    applicableCategories: ['group']
  },
  {
    id: 'group-kostum',
    name: 'Kostum Tambahan',
    price: 50000,
    unit: 'kostum',
    description: 'Ganti 1 stel kostum tambahan per sesi group.',
    category: 'prop',
    applicableCategories: ['group']
  },
  {
    id: 'group-extra-person-41',
    name: 'Orang (ke-41 ke Atas)',
    price: 10000,
    unit: 'orang',
    description: 'Tambahan peserta group untuk orang ke-41 dan seterusnya.',
    category: 'person',
    applicableCategories: ['group']
  },
  {
    id: 'group-edit',
    name: 'Additional Edit',
    price: 10000,
    unit: 'foto',
    description: 'Tambahan 1 file edit foto group retouching warna & lighting.',
    category: 'file',
    applicableCategories: ['group']
  },
  {
    id: 'group-print-4r',
    name: 'Cetak Uk 4R',
    price: 3500,
    unit: 'foto',
    description: 'Cetak foto lab ukuran 4R (10.2 x 15.2 cm).',
    category: 'print',
    applicableCategories: ['group']
  },
  {
    id: 'group-print-5r',
    name: 'Cetak Uk 5R',
    price: 5000,
    unit: 'foto',
    description: 'Cetak foto lab ukuran 5R (12.7 x 17.8 cm).',
    category: 'print',
    applicableCategories: ['group']
  },
  {
    id: 'group-print-10rs',
    name: 'Cetak Uk 10Rs',
    price: 15000,
    unit: 'foto',
    description: 'Cetak foto lab ukuran 10Rs (20.3 x 30.5 cm).',
    category: 'print',
    applicableCategories: ['group']
  },
  {
    id: 'group-foto-sendiri',
    name: 'Foto Sendiri (Solo Shot)',
    price: 10000,
    unit: 'foto',
    description: 'Sesi foto solo / individu di sela sesi group.',
    category: 'person',
    applicableCategories: ['group']
  },

  // ==================== 5. PAKET FAMILY ====================
  {
    id: 'family-frame-10rs',
    name: 'Bingkai Uk 10Rs',
    price: 35000,
    unit: 'bingkai',
    description: 'Bingkai kayu minimalis elegan ukuran 10Rs.',
    category: 'frame',
    applicableCategories: ['family']
  },
  {
    id: 'family-extra-bg',
    name: 'Tambahan Background',
    price: 75000,
    unit: 'background',
    description: 'Ganti / tambah 1 background tema keluarga.',
    category: 'file',
    applicableCategories: ['family']
  },
  {
    id: 'family-kostum',
    name: 'Kostum Tambahan',
    price: 50000,
    unit: 'kostum',
    description: 'Ganti 1 stel kostum keluarga saat sesi.',
    category: 'prop',
    applicableCategories: ['family']
  },
  {
    id: 'family-extra-person',
    name: 'Tambahan Orang',
    price: 10000,
    unit: 'orang',
    description: 'Tambahan anggota keluarga melebihi kuota paket.',
    category: 'person',
    applicableCategories: ['family']
  },
  {
    id: 'family-edit',
    name: 'Additional Edit',
    price: 10000,
    unit: 'foto',
    description: 'Tambahan 1 file edit foto keluarga retouching tone.',
    category: 'file',
    applicableCategories: ['family']
  },

  // ==================== 6. PAKET BIRTHDAY ====================
  {
    id: 'birthday-petasan-kertas',
    name: 'Petasan Kertas (Confetti)',
    price: 30000,
    unit: 'pcs',
    description: 'Confetti popper kertas warna-warni pesta ulang tahun.',
    category: 'prop',
    applicableCategories: ['birthday']
  },
  {
    id: 'birthday-balon-latex',
    name: 'Balon Latex',
    price: 1500,
    unit: 'pcs',
    description: 'Balon latex warna pastel / metallic per buah.',
    category: 'prop',
    applicableCategories: ['birthday']
  },
  {
    id: 'birthday-balon-angka',
    name: 'Balon Angka Foil',
    price: 15000,
    unit: 'pcs',
    description: 'Balon foil angka ukuran besar penanda umur.',
    category: 'prop',
    applicableCategories: ['birthday']
  },
  {
    id: 'birthday-balon-hewan',
    name: 'Balon Hewan Lucu',
    price: 15000,
    unit: 'pcs',
    description: 'Balon karakter hewan lucu untuk properti anak.',
    category: 'prop',
    applicableCategories: ['birthday']
  },
  {
    id: 'birthday-extra-person-3',
    name: 'Tambahan Orang (di Atas 3 Orang)',
    price: 25000,
    unit: 'orang',
    description: 'Tambahan teman/anggota ulang tahun di atas 3 orang.',
    category: 'person',
    applicableCategories: ['birthday']
  },
  {
    id: 'birthday-extra-bg-time',
    name: 'Tambahan Background (+ Waktu 7 Menit)',
    price: 75000,
    unit: 'background',
    description: 'Tambah 1 background include ekstra waktu 7 menit.',
    category: 'file',
    applicableCategories: ['birthday']
  },
  {
    id: 'birthday-spotlight',
    name: 'Spotlight',
    price: 25000,
    unit: 'sesi',
    description: 'Pencahayaan sorot fokus spotlight artistik.',
    category: 'file',
    applicableCategories: ['birthday']
  },
  {
    id: 'birthday-color-spotlight',
    name: 'Color Spotlight',
    price: 25000,
    unit: 'sesi',
    description: 'Pencahayaan warna-warni RGB spotlight aesthetic.',
    category: 'file',
    applicableCategories: ['birthday']
  },
  {
    id: 'birthday-makeup',
    name: 'Make Up Birthday',
    price: 250000,
    unit: 'orang',
    description: 'Jasa makeup flawless fresh tema ulang tahun.',
    category: 'person',
    applicableCategories: ['birthday']
  },

  // ==================== 7. PAKET MATERNITY ====================
  {
    id: 'maternity-extra-bg',
    name: 'Tambahan Background',
    price: 75000,
    unit: 'background',
    description: 'Ganti / tambah 1 background tema maternity.',
    category: 'file',
    applicableCategories: ['maternity']
  },
  {
    id: 'maternity-kostum',
    name: 'Kostum Tambahan',
    price: 50000,
    unit: 'kostum',
    description: 'Ganti 1 stel gaun / kostum maternity hamil.',
    category: 'prop',
    applicableCategories: ['maternity']
  },
  {
    id: 'maternity-edit',
    name: 'Additional Edit',
    price: 10000,
    unit: 'foto',
    description: 'Tambahan 1 file edit foto maternity retouching lembut.',
    category: 'file',
    applicableCategories: ['maternity']
  },
  {
    id: 'maternity-makeup',
    name: 'Make Up Maternity',
    price: 250000,
    unit: 'orang',
    description: 'Jasa makeup ibu hamil natural glowing elegan.',
    category: 'person',
    applicableCategories: ['maternity']
  },

  // ==================== 8. PAKET PERSONAL ====================
  {
    id: 'personal-extra-bg',
    name: 'Tambahan Background',
    price: 50000,
    unit: 'background',
    description: 'Ganti / tambah 1 background tema personal.',
    category: 'file',
    applicableCategories: ['personal']
  },
  {
    id: 'personal-kostum',
    name: 'Kostum Tambahan',
    price: 35000,
    unit: 'kostum',
    description: 'Ganti 1 stel outfit / kostum saat sesi personal.',
    category: 'prop',
    applicableCategories: ['personal']
  },
  {
    id: 'personal-extra-person',
    name: 'Tambahan Orang',
    price: 10000,
    unit: 'orang',
    description: 'Menambah 1 teman ikut dalam sesi personal.',
    category: 'person',
    applicableCategories: ['personal']
  },
  {
    id: 'personal-makeup',
    name: 'Make Up Personal',
    price: 280000,
    unit: 'orang',
    description: 'Jasa makeup profesional glam / soft glam personal.',
    category: 'person',
    applicableCategories: ['personal']
  },

  // ==================== 9. PAKET COUPLE ====================
  {
    id: 'couple-extra-bg',
    name: 'Tambahan Background',
    price: 75000,
    unit: 'background',
    description: 'Ganti / tambah 1 background tema pasangan.',
    category: 'file',
    applicableCategories: ['couple']
  },
  {
    id: 'couple-outfit',
    name: 'Outfit / Kostum Tambahan',
    price: 50000,
    unit: 'kostum',
    description: 'Ganti 1 pasang pakaian couple saat sesi.',
    category: 'prop',
    applicableCategories: ['couple']
  },
  {
    id: 'couple-edit',
    name: 'Additional Edit',
    price: 10000,
    unit: 'foto',
    description: 'Tambahan 1 file edit foto couple retouching romantis.',
    category: 'file',
    applicableCategories: ['couple']
  },
  {
    id: 'couple-makeup',
    name: 'Make Up Couple',
    price: 250000,
    unit: 'orang',
    description: 'Jasa makeup pasangan rapi & natural.',
    category: 'person',
    applicableCategories: ['couple']
  },

  // ==================== 10. PAKET PREWEDDING ====================
  {
    id: 'prewed-extra-bg',
    name: 'Tambahan Background',
    price: 75000,
    unit: 'background',
    description: 'Ganti / tambah 1 background tema prewedding.',
    category: 'file',
    applicableCategories: ['prewedding']
  },
  {
    id: 'prewed-hairdo',
    name: 'Hairdo',
    price: 150000,
    unit: 'orang',
    description: 'Penataan rambut / sanggul / hijab stylist prewedding.',
    category: 'person',
    applicableCategories: ['prewedding']
  },
  {
    id: 'prewed-makeup',
    name: 'Make Up',
    price: 400000,
    unit: 'orang',
    description: 'Jasa MUA prewedding eksklusif tahan lama & mewah.',
    category: 'person',
    applicableCategories: ['prewedding']
  },
  {
    id: 'prewed-edit',
    name: 'Additional Edit',
    price: 10000,
    unit: 'foto',
    description: 'Tambahan 1 file edit foto prewedding cinematic tone.',
    category: 'file',
    applicableCategories: ['prewedding']
  },

  // ==================== 11. SELF STUDIO ====================
  {
    id: 'self-extra-time',
    name: 'Waktu per 5 Menit',
    price: 20000,
    unit: '5 menit',
    description: 'Tambahan durasi sesi pemotretan selfstudio (+5 menit).',
    category: 'selfstudio',
    applicableCategories: ['self-studio']
  },
  {
    id: 'self-print-polaroid-grid4',
    name: 'Cetak 1 Lembar (Polaroid / Grid 4)',
    price: 7500,
    unit: '1 lembar',
    description: 'Cetak fisik foto Polaroid / Grid 4 kertas Glossy Lab.',
    category: 'selfstudio',
    applicableCategories: ['self-studio']
  },
  {
    id: 'self-print-grid3',
    name: 'Cetak 2 Lembar (GRID 3)',
    price: 8000,
    unit: '2 lembar',
    description: 'Cetak fisik foto strip Grid 3 kertas Glossy Lab (2 lembar).',
    category: 'selfstudio',
    applicableCategories: ['self-studio']
  },
  {
    id: 'self-pet',
    name: 'Hewan Peliharaan selain Anjing (dari Client)',
    price: 25000,
    unit: 'hewan',
    description: 'Membawa hewan peliharaan dari klien (selain anjing).',
    category: 'selfstudio',
    applicableCategories: ['self-studio']
  },
  {
    id: 'self-extra-person',
    name: 'Tambahan Orang',
    price: 15000,
    unit: 'orang',
    description: 'Tambahan biaya per orang untuk sesi foto selfstudio.',
    category: 'selfstudio',
    applicableCategories: ['self-studio']
  },
  {
    id: 'self-dino-single',
    name: 'Sewa Kostum Dino',
    price: 15000,
    unit: 'orang',
    description: 'Sewa kostum dinosaurus lucu untuk sesi foto mandiri.',
    category: 'selfstudio',
    applicableCategories: ['self-studio']
  },
  {
    id: 'self-spotlight-tirai',
    name: 'Spotlight (Khusus Background Tirai Coklat)',
    price: 25000,
    unit: 'sesi',
    description: 'Pencahayaan spotlight artistik latar tirai coklat.',
    category: 'selfstudio',
    applicableCategories: ['self-studio']
  },

  // ==================== 12. UNDANGAN & SEWA STUDIO ====================
  {
    id: 'undangan-edit',
    name: 'Additional Edit Foto Undangan',
    price: 10000,
    unit: 'foto',
    description: 'Tambahan 1 file edit resolusi tinggi khusus desain undangan.',
    category: 'file',
    applicableCategories: ['undangan', 'sewa-studio']
  },
  {
    id: 'undangan-print-10rs',
    name: 'Cetak Uk 10Rs Display',
    price: 15000,
    unit: 'foto',
    description: 'Cetak foto display meja tamu ukuran 10Rs.',
    category: 'print',
    applicableCategories: ['undangan', 'sewa-studio']
  },
  {
    id: 'undangan-makeup',
    name: 'Make Up Sesi Undangan',
    price: 250000,
    unit: 'orang',
    description: 'Jasa makeup rapi & elegan untuk foto undangan.',
    category: 'person',
    applicableCategories: ['undangan', 'sewa-studio']
  }
];

export const PRICELIST_SHEETS: PricelistSheet[] = [
  {
    id: 'sheet-grad-indoor',
    title: 'Harga Paket Graduation Indoor',
    subtitle: 'Studio Sessions (Elegant Scholar, Supreme, Infinity & Bundling)',
    category: 'Paket Graduation Indoor',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '3:4',
    description: 'Rincian paket Elegant Scholar (330K), Supreme Scholar (380K), Infinity Scholar (530K), Ultimate Scholar 1 Bundling (630K), dan Ultimate Scholar 2 Bundling (680K) lengkap dengan rincian add-ons & makeup.',
    relatedPackageIds: ['grad-indoor-elegant-scholar', 'grad-indoor-supreme-scholar', 'grad-indoor-infinity-scholar', 'grad-bundling-ultimate-1', 'grad-bundling-ultimate-2']
  },
  {
    id: 'sheet-birthday',
    title: 'Pricelist Birthday Package',
    subtitle: 'Katalog Paket Birthday (Sweet Celebration, Glow, Sweet Light, Ultimate)',
    category: 'Paket Birthday',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '3:4',
    description: 'Rincian paket Birthday 1 (199K), Birthday 2 (275K), Birthday 3 Sweet Light (250K), dan Birthday 4 Ultimate Sweet Light (325K) lengkap dengan daftar biaya tambahan dekorasi balon.',
    relatedPackageIds: ['birthday-sweet-celebration', 'birthday-glow-sweet', 'birthday-sweet-light', 'birthday-ultimate-sweet-light']
  },
  {
    id: 'sheet-group',
    title: 'Pricelist Group Package',
    subtitle: 'Katalog Paket Group 1 s/d 4 (3 - 40 Orang)',
    category: 'Paket Group',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '3:4',
    description: 'Rincian paket Group 1 Friendly Frame (325K), Group 2 Signature Squad (425K), Group 3 Royal Ensemble (499K), dan Group 4 Imperial Union (625K).',
    relatedPackageIds: ['group-friendly-frame', 'group-signature-squad', 'group-royal-ensemble', 'group-imperial-union']
  },
  {
    id: 'sheet-grad-outdoor',
    title: 'Pricelist Graduation Outdoor',
    subtitle: 'Katalog Wisuda Outdoor (Smart, Cumlaude, Group Outdoor)',
    category: 'Paket Wisuda Outdoor',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '3:4',
    description: 'Rincian paket Smart 30M (275K) / 60M (350K), Cumlaude (700K inc video), dan Group Outdoor Wisudawan (175K - 250K / wisudawan).',
    relatedPackageIds: ['grad-outdoor-smart-30', 'grad-outdoor-smart-60', 'grad-outdoor-cumlaude', 'grad-outdoor-group-2', 'grad-outdoor-group-3', 'grad-outdoor-group-4-5']
  },
  {
    id: 'sheet-family',
    title: 'Pricelist Family Package',
    subtitle: 'Katalog Paket Keluarga (Sweet Together & Happy Nest)',
    category: 'Paket Family',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '3:4',
    description: 'Rincian paket Family 1 Sweet Together (325K) & Family 2 Happy Nest (375K) untuk hingga 10 anggota keluarga.',
    relatedPackageIds: ['family-sweet-together', 'family-happy-nest']
  },
  {
    id: 'sheet-personal',
    title: 'Pricelist Personal Package',
    subtitle: 'Katalog Paket Personal (Bold Statement & Opulent Shot)',
    category: 'Paket Personal',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '3:4',
    description: 'Rincian paket Personal 1 Bold Statement (150K) & Personal 2 Opulent Shot (250K) untuk sesi portrait & outfit branding.',
    relatedPackageIds: ['personal-bold-statement', 'personal-opulent-shot']
  },
  {
    id: 'sheet-1',
    title: 'Pricelist Selfstudio',
    subtitle: 'Feel Free To Express Your Style',
    category: 'Pricelist Selfstudio',
    imageUrl: '/images/poster-1-cover.png',
    galleryImages: [
      '/images/poster-1-cover.png',
      '/images/selfstudio/sample-1.jpg',
      '/images/selfstudio/sample-2.jpg',
      '/images/selfstudio/sample-3.jpg',
      '/images/selfstudio/sample-4.jpg',
      '/images/selfstudio/sample-5.jpg',
      '/images/selfstudio/sample-6.jpg',
      '/images/selfstudio/sample-7.jpg'
    ],
    aspectRatio: '3:4',
    description: 'Pricelist Selfstudio Alviero dengan sampel foto gaya bebas, kolase ekspresif, dan pilihan paket lengkap (Special, Normal, dan Spotlight).',
    relatedPackageIds: [
      'self-special-narsis',
      'self-special-super-narsis',
      'self-normal-narsis',
      'self-normal-super-narsis',
      'self-special-spotlight',
      'self-normal-spotlight'
    ]
  },
  {
    id: 'sheet-passfoto',
    title: 'Pricelist Pass Foto',
    subtitle: 'Katalog Paket Pass Foto (Paket 1, Paket 2, Paket 3 Nikah)',
    category: 'Paket Pass Foto',
    imageUrl: '/images/poster-passfoto.png',
    aspectRatio: '3:4',
    description: 'Rincian paket Pass Foto 1 (50K Setengah Badan), Pass Foto 2 (85K Setengah & Full Badan), dan Pass Foto 3 (95K Paket Nikah 2 Orang) dengan 3 pilihan warna background edit.',
    relatedPackageIds: [
      'passfoto-1',
      'passfoto-2',
      'passfoto-3'
    ]
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Anisa & Rizky',
    rating: 5,
    date: '2 Hari lalu',
    comment: 'Tempatnya bersih banget, lighting spotlight sunset-nya cantik parah! Hasil cetak cetakan photostrip-nya juga tebal. Recomended buat date idea!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    packageName: 'Special Colour Spotlight'
  },
  {
    id: 'rev-2',
    name: 'Siti Sarah & Bestie',
    rating: 5,
    date: 'Kemarin',
    comment: 'Adminnya ramah dan fast respon pas booking lewat WhatsApp. Bawa rombongan wisuda ambil paket Graduation Indoor Silver hemat banget!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    packageName: 'Graduation Indoor Silver'
  },
  {
    id: 'rev-3',
    name: 'Dimas Prasetyo',
    rating: 5,
    date: '3 Hari lalu',
    comment: 'Sangat terbantu foto Pass Foto Premium Edit buat lamaran kerja. Mas fotografernya teliti banget rapiin baju sama background.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    packageName: 'Pass Foto Premium Edit'
  }
];

// 26 Slot Jadwal untuk Studio Foto Profesional (08:00 - 21:00 WIB, Interval 30 Menit/Sesi)
export const PRO_STUDIO_TIME_SLOTS = [
  '08:00', '08:30',
  '09:00', '09:30',
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00', '17:30',
  '18:00', '18:30',
  '19:00', '19:30',
  '20:00', '20:30'
];

// 26 Slot Jadwal untuk Ruang Bilik Self Studio (08:00 - 21:00 WIB, Interval 30 Menit/Sesi)
export const SELF_STUDIO_TIME_SLOTS = [
  '08:00', '08:30',
  '09:00', '09:30',
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '15:00', '15:30',
  '16:00', '16:30',
  '17:00', '17:30',
  '18:00', '18:30',
  '19:00', '19:30',
  '20:00', '20:30'
];

export const TIME_SLOTS = PRO_STUDIO_TIME_SLOTS;

export const STUDIO_RULES = [
  {
    title: 'Datang 10 Menit Lebih Awal',
    desc: 'Diharapkan hadir 10 menit sebelum slot jam dimulainya sesi untuk brief cara pakai shutter remote / ganti kostum.'
  },
  {
    title: 'Gunakan Kaos Kaki / Sepatu Bersih',
    desc: 'Demi menjaga kebersihan karpet studio, harap menggunakan kaos kaki atau alas kaki khusus bersih di dalam ruangan.'
  },
  {
    title: 'Pengiriman Soft File Kualitas HD',
    desc: 'Link allfile via Google Drive akan dikirim di hari yang sama dan maksimal H+1 apabila kondisi studio ramai.'
  },
  {
    title: 'Ketentuan Reschedule & Keterlambatan',
    desc: 'Boleh mengajukan reschedule ke hari lain tanpa biaya tambahan selama hari dan jam yang diajukan masih ready.'
  }
];

export const STUDIO_DISCLAIMER = [
  {
    category: 'Umum',
    rules: [
      {
        text: 'Jam operasional setiap hari 08:00 - 21:00, ',
        highlight: 'bisa request diluar jam operasional',
        suffix: ' dengan ada charge 35K (kecuali wisuda outdoor tanpa biaya charge)'
      },
      {
        text: 'Jika telat akan dikenakan biaya tambahan Rp. 25.000 dan melebihi jam 21.00 akan dikenakan tambahan biaya sebesar Rp. 35.000',
        highlight: '',
        suffix: ''
      },
      {
        text: 'Link allfile via googledrive akan dikirim di hari yang sama dan maksimal H+1 apabila kondisi studio ramai',
        highlight: '',
        suffix: ''
      }
    ]
  },
  {
    category: 'File Edit dan Cetak',
    rules: [
      {
        text: 'Proses File edit maksimal 7 hari dan Cetaknya 5 hari (',
        highlight: 'Kecuali pass foto',
        suffix: ') dihitung dari kakaknya pilih foto, apabila lebih cepat selesai langsung kami infokan kembali, apabila tidak bisa diambil bisa diganti dengan file edit yang akan dijelaskan ketika pengiriman link foto allfilenya'
      },
      {
        text: 'File cetak diambil kembali di Studio, belum bisa request pengiriman dalam bentuk paket, untuk pengiriman via Grab, go send dan sejenisnya di perbolehkan dengan catatan yg memesan dari client',
        highlight: '',
        suffix: ''
      },
      {
        text: 'Cetakan Foto maksimal 1 bulan untuk pengambilan, diatas 1 bulan kerusakan atau kehilangan cetakan diluar tanggung jawab studio',
        highlight: '',
        suffix: ''
      },
      {
        text: 'Pilihan foto yg di edit dan di cetak maksimal 1 bulan, diatas 1 bulan sudah tidak bisa di proses',
        highlight: '',
        suffix: ''
      },
      {
        text: 'File yang diedit sebatas pembersihan dibagian background dan editing dasar di pencahayaan dan tone warna, apabila ada request edit dari client bisa langsung konfirmasi ke bagian admin studio',
        highlight: '',
        suffix: ''
      }
    ]
  },
  {
    category: 'Keterlambatan dan Reschedule',
    rules: [
      {
        text: 'Apabila ada keterlambatan dan kondisi studio tidak terlalu ramai masih boleh terlambat tanpa batasan atau boleh mengajukan pergantian jam di jam yang kosong tanpa pengurangan menit foto selama jam setelahnya atau jam yang dipilih masih ready',
        highlight: '',
        suffix: ''
      },
      {
        text: 'Apabila dalam kondisi ramai dan tidak ada jam kosong setelahnya, tetap bisa difotokan di jam yang belum bisa dipastikan, jika di jam setelahnya terlambat bisa di gunakan untuk foto dengan ada pengurangan menit foto sesuai ketentuan yang berlaku, atau apabila tidak ada waktu yang pasti bisa mengajukan resechedule di hari lain',
        highlight: '',
        suffix: ''
      },
      {
        text: 'Dalam kondisi ramai atau full, keterlambatan dihitung dari 5 menit pertama dari jam booking dan akan di alihkan ke client lain yang sudah siap',
        highlight: '',
        suffix: ''
      },
      {
        text: 'Boleh mengajukan resechedule ke hari lain tanpa ada biaya tambahan apapun selama hari dan jam yang diajukan masih ready',
        highlight: '',
        suffix: ''
      }
    ]
  },
  {
    category: 'Reservasi dan Pembayaran',
    rules: [
      {
        text: '',
        highlight: 'DP minimal 50%',
        suffix: ' dari total harga'
      },
      {
        text: 'Pelunasan bisa di selesaikan sebelum hari H atau di hari H sebelum atau setelah foto di studio via Cash atau via transfer',
        highlight: '',
        suffix: ''
      },
      {
        text: 'Jika ada pembatalan sepihak maka DP tidak bisa dikembalikan',
        highlight: '',
        suffix: ''
      },
      {
        text: 'Untuk paket yang diambil masih bisa upgrade paket, tetapi tidak bisa downgrade paket yaa kak 😊',
        highlight: '',
        suffix: ''
      }
    ]
  },
  {
    category: 'Background Dan Properti',
    rules: [
      {
        text: 'Properti setiap background bisa berubah2, boleh request properti yg ada di studio apabila keadaan studio tidak ramai, dan belum bisa request properti apabila keadaan studio sedang ramai',
        highlight: '',
        suffix: ''
      }
    ]
  }
];
