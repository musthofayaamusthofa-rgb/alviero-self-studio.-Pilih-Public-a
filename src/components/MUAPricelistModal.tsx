import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Clock,
  Check,
  ShoppingBag,
  Camera,
  Layers,
  GraduationCap,
  Shirt,
  Scissors,
  Heart,
  Sun,
  Eye,
  Ruler
} from 'lucide-react';

// =========================================================================
// 1. DATA STRUCTURE (3-LEVEL HIERARCHY)
// Level 1: Vendor (By Novita, By Ananda, By Masaya, By Tiwi)
// Level 2: Kategori Layanan (Pass Foto, Wedding, Graduation, Prewedding, dll)
// Level 3: Sub-Paket (Paket 1, Paket 2, Paket 3 + Harga + Fasilitas Lengkap)
// =========================================================================

export interface MuaSubPackage {
  id: string;
  name: string;        // Contoh: "Paket 1 — Basic Touch Look"
  price: number;       // Contoh: 75000
  duration?: string;   // Contoh: "30 Menit"
  badge?: string;      // Contoh: "Best Seller", "Favorit"
  features: string[];  // Rincian fasilitas lengkap yang didapat
  note?: string;
  colors?: string[];   // Opsi varian warna kebaya (misal: Sage, Nude, Maroon)
  sizes?: string[];    // Opsi ukuran kebaya (misal: S, M, L, XL, XXL)
}

export interface MuaCategory {
  id: string;
  name: string;        // Contoh: "Pass Foto", "Wedding", "Graduation Indoor"
  iconType?: 'camera' | 'wedding' | 'graduation' | 'outdoor' | 'prewedding' | 'kebaya' | 'hairdo' | 'sparkles';
  description?: string;
  subPackages: MuaSubPackage[];
}

export interface MuaVendorDefinition {
  id: string;
  name: string;        // "By Novita", "By Ananda", dst.
  tagline: string;
  coverImage: string;
  portfolioImages: string[];
  categories: MuaCategory[];
}

export interface KebayaColorInfo {
  name: string;
  image: string;
  hex: string;
  tag: string;
  desc: string;
}

export const KEBAYA_COLOR_CATALOG: Record<string, KebayaColorInfo> = {
  Sage: {
    name: 'Sage',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85',
    hex: '#8FA38D',
    tag: 'Best Seller Wisuda',
    desc: 'Hijau sage pastel redup berpadu brokat payet halus timbul. Sangat fotogenik di studio foto dan menjadi warna terfavorit para wisudawati.',
  },
  Nude: {
    name: 'Nude',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85',
    hex: '#D8B89E',
    tag: 'Warm Natural',
    desc: 'Nuansa krem nude hangat yang menyatu lembut dengan warna kulit alami. Memberi kesan anggun, bersih, dan memancarkan aura natural.',
  },
  Black: {
    name: 'Black',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=85',
    hex: '#242424',
    tag: 'Royal Classic',
    desc: 'Hitam elegan mewah klasik dengan aksen payet berkilau. Memberikan efek siluet tubuh yang ramping, tegas, dan berwibawa.',
  },
  Maroon: {
    name: 'Maroon',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=85',
    hex: '#7A1C29',
    tag: 'Bold Elegance',
    desc: 'Merah maroon anggun berkarakter mewah. Pilihan sempurna untuk sesi foto wisuda resmi, lamaran, maupun foto keluarga.',
  },
  Navy: {
    name: 'Navy',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=85',
    hex: '#1D2A44',
    tag: 'Exclusive Modern',
    desc: 'Biru navy tua berkilau payet kristal mewah. Kontras sangat tajam dan memukau di bawah pencahayaan softbox studio Alviero.',
  },
  Gold: {
    name: 'Gold',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
    hex: '#C8A34A',
    tag: 'Glamour Luxury',
    desc: 'Kuning keemasan berpayet timbul premium. Memancarkan aura megah, cerah, dan berkelas khas pesta formal.',
  },
  Silver: {
    name: 'Silver',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85',
    hex: '#B8BAC2',
    tag: 'Chic Futuristic',
    desc: 'Abu-abu perak berkilau dingin yang modern dan bersih. Tampil sangat modis dan kekinian untuk konsep wisuda minimalis.',
  },
  'Dusty Pink': {
    name: 'Dusty Pink',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
    hex: '#DDA7A5',
    tag: 'Sweet Feminine',
    desc: 'Merah muda dusty lembut feminin yang memancarkan pesona manis, muda, dan ceria.',
  },
};

export const KEBAYA_PREVIEWS: Record<string, string> = {
  Sage: KEBAYA_COLOR_CATALOG.Sage.image,
  Nude: KEBAYA_COLOR_CATALOG.Nude.image,
  Black: KEBAYA_COLOR_CATALOG.Black.image,
  Navy: KEBAYA_COLOR_CATALOG.Navy.image,
  Maroon: KEBAYA_COLOR_CATALOG.Maroon.image,
  Gold: KEBAYA_COLOR_CATALOG.Gold.image,
  Silver: KEBAYA_COLOR_CATALOG.Silver.image,
  'Dusty Pink': KEBAYA_COLOR_CATALOG['Dusty Pink'].image,
};

export const KEBAYA_SIZE_CHART = [
  { size: 'S', ld: '86 – 88 cm', waist: '68 – 72 cm', length: '65 cm', weight: '40 – 48 kg' },
  { size: 'M', ld: '90 – 94 cm', waist: '74 – 78 cm', length: '68 cm', weight: '48 – 55 kg' },
  { size: 'L', ld: '96 – 100 cm', waist: '80 – 84 cm', length: '70 cm', weight: '55 – 63 kg' },
  { size: 'XL', ld: '102 – 106 cm', waist: '86 – 90 cm', length: '72 cm', weight: '63 – 72 kg' },
  { size: 'XXL', ld: '108 – 114 cm', waist: '92 – 98 cm', length: '75 cm', weight: '72 – 82 kg' },
];

// =========================================================================
// MOCK DATA RESMI 4 VENDOR DENGAN DETAIL SUB-PAKET LENGKAP
// =========================================================================
export const MUA_VENDORS: MuaVendorDefinition[] = [
  {
    id: 'novita',
    name: 'By Novita',
    tagline: 'Flawless & Long Lasting Makeup Specialist',
    coverImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=700&q=85',
    ],
    categories: [
      {
        id: 'novita-pass-foto',
        name: 'Pass Foto',
        iconType: 'camera',
        description: 'Riasan wajah natural berkarakter, disesuaikan khusus dengan pencahayaan studio foto formal.',
        subPackages: [
          {
            id: 'novita-pf-1',
            name: 'Paket 1 — Basic Touch Look',
            price: 75000,
            duration: '30 Menit',
            features: [
              'Complexion Natural Flawless & Matte Finish',
              'Rapikan Alis & Natural Blush On',
              'Penataan Rambut Simple / Rapikan Hijab Segiempat',
              'Free Bedak Touch-Up sebelum masuk sesi foto',
            ],
          },
          {
            id: 'novita-pf-2',
            name: 'Paket 2 — Studio Pro HD Look',
            price: 125000,
            duration: '45 Menit',
            badge: 'Best Seller',
            features: [
              'High Definition (HD) Foundation Anti-Flashback Lampu Studio',
              'Bulu Mata Natural 1 Layer Lembut & Nyaman',
              'Styling Rambut Formal / Hijab Tegak Paripurna',
              'Shading & Contour Wajah Proporsional Kamera',
              'Free Setting Spray Khusus Tahan Kilas Studio',
            ],
          },
          {
            id: 'novita-pf-3',
            name: 'Paket 3 — Executive VIP Look',
            price: 175000,
            duration: '60 Menit',
            badge: 'Exclusive',
            features: [
              'Full Luxury High-End Complexion (Waterproof & Sweatproof)',
              'Eyelash Custom 2 Layer + Soft Eyeliner Khusus',
              'Styling Rambut / Hijab Silk Formal Rapi Presisi',
              'Face Prep & Serum Glowing Premium sebelum makeup',
              'Free Retouch di Studio selama sesi foto berlangsung',
            ],
          },
        ],
      },
      {
        id: 'novita-wedding',
        name: 'Wedding',
        iconType: 'wedding',
        description: 'Riasan pengantin berkelas untuk momen sakral akad nikah dan pesta resepsi pernikahan.',
        subPackages: [
          {
            id: 'novita-wd-1',
            name: 'Paket 1 — Akad / Simple Wedding Look',
            price: 450000,
            duration: '90 Menit',
            features: [
              'Full Airbrush Complexion Waterproof Tahan 16 Jam',
              'Bulu Mata 3D Fluffy + Softlens Normal Studio',
              'Hijabdo / Sanggul Modern Pengantin Elegan',
              'Pemasangan Melati Sintetis / Fresh & Ronce',
            ],
          },
          {
            id: 'novita-wd-2',
            name: 'Paket 2 — Glamour Wedding Resepsi',
            price: 750000,
            duration: '120 Menit',
            badge: 'Favorit Pengantin',
            features: [
              'High-End Luxury Complexion Anti-Luntur & Anti-Retak',
              '2x Pergantian Lip Look & Retouch Khusus',
              'Hairdo Paes / Sanggul Pengantin Adat / Hijabdo Glamour',
              'Free Touch-Up Kit Pribadi & Serum Pengantin',
              'Pemasangan Mahkota / Sigar / Aksesoris Adat',
            ],
          },
          {
            id: 'novita-wd-3',
            name: 'Paket 3 — Royal Bride All-Inclusive',
            price: 1200000,
            duration: '150 Menit',
            badge: 'VIP All-In',
            features: [
              'Rias Pengantin Wanita & Groom Touch-Up Pengantin Pria',
              'Full High-End Cosmetics (Dior / Chanel Look)',
              'Standby Retouch Penuh selama sesi pemotretan studio',
              'Free Peminjaman Tiara, Bros Dada & Aksesoris Mewah',
            ],
          },
        ],
      },
      {
        id: 'novita-grad-indoor',
        name: 'Graduation Indoor',
        iconType: 'graduation',
        description: 'Tampil anggun mempesona di momen wisuda dengan ketahanan makeup di studio indoor.',
        subPackages: [
          {
            id: 'novita-gi-1',
            name: 'Paket 1 — Soft Wisuda Fresh',
            price: 180000,
            duration: '45 Menit',
            features: [
              'Makeup Soft Glam Fresh & Tahan Lama Seharian',
              'Bulu Mata Wisuda Natural 1 Layer Fluffy',
              'Hijabdo Simpel / Hairdo Blow Natural Wave',
              'Free Softlens Normal (jika diperlukan)',
            ],
          },
          {
            id: 'novita-gi-2',
            name: 'Paket 2 — Glamour Wisuda Paripurna',
            price: 250000,
            duration: '60 Menit',
            badge: 'Favorit Wisudawati',
            features: [
              'Airbrush Complexion Water-Resistant Tahan Panas & Keringat',
              'Bulu Mata Double Layer 3D Super Lentik',
              'Hijabdo Kreasi Wisuda / Hairdo Updo Modern Berkelas',
              'Free Bulu Mata Cadangan & Mini Lip Cream Touch-up',
              'Pemasangan Toga, Gordon & Selempang Rapih di Tempat',
            ],
          },
          {
            id: 'novita-gi-3',
            name: 'Paket 3 — Royal Graduation + Free Hijab',
            price: 320000,
            duration: '75 Menit',
            badge: 'All-in Package',
            features: [
              'Full High-End Makeup Look (Dior / MAC / Make Over Pro)',
              'Hairdo / Hijabdo Style Eksklusif + Aksesoris Mutiara/Hairpin',
              'Free Jilbab Paris Segiempat Premium / Pasmina Silk',
              'Face Prep Ampoule Glowing & Eye Treatment Mask',
              'Free Pemasangan Toga & Pendampingan Foto Studio',
            ],
          },
        ],
      },
      {
        id: 'novita-grad-outdoor',
        name: 'Graduation Outdoor',
        iconType: 'outdoor',
        description: 'Formula riasan khusus tahan terik matahari, angin kencang, dan keringat sesi luar ruangan.',
        subPackages: [
          {
            id: 'novita-go-1',
            name: 'Paket 1 — Natural Sweatproof Outdoor',
            price: 195000,
            duration: '45 Menit',
            features: [
              'Complexion Khusus Tahan Panas & Keringat Luar Ruangan',
              'Bulu Mata Ringan Anti-Angin & Tidak Menusuk Mata',
              'Hijabdo Rapi Kencang / Hairdo Ponytail Curled Tahan Angin',
              'UV Protection Primer Base',
            ],
          },
          {
            id: 'novita-go-2',
            name: 'Paket 2 — Full Glam Outdoor + Retouch',
            price: 280000,
            duration: '65 Menit',
            badge: 'Best Outdoor',
            features: [
              'Waterproof & UV Protection Foundation Tahan Luntur',
              'Standby Touch-Up selama sesi foto outdoor berlangsung',
              'Bulu Mata 3D Luxury Waterproof',
              'Free Blotting Paper & Setting Spray Tahan Panas',
            ],
          },
        ],
      },
      {
        id: 'novita-prewed-indoor',
        name: 'Prewedding Indoor',
        iconType: 'prewedding',
        description: 'Konsep riasan editorial dan cinematic khusus sesi foto studio pasangan.',
        subPackages: [
          {
            id: 'novita-pwi-1',
            name: 'Paket 1 — Indoor Concept Natural',
            price: 300000,
            duration: '60 Menit',
            features: [
              'Makeup Flawless Kalibrasi Pencahayaan Studio Foto',
              'Ganti 1x Lip Look (Nude tone ke Romantic Bold)',
              'Hairdo Modern / Hijabdo Sesuai Tema Busana Foto',
              'Free Bulu Mata Premium & Softlens Studio',
            ],
          },
          {
            id: 'novita-pwi-2',
            name: 'Paket 2 — Luxury Concept + Standby Retouch',
            price: 450000,
            duration: '90 Menit',
            badge: 'Recommended',
            features: [
              'High Coverage Complexion Super Flawless Anti-Minyak',
              'Standby Pendampingan Retouch Selama Sesi Foto Studio',
              '2x Pergantian Hairdo / Hijabdo Mengikuti Ganti Gaun',
              'Free Peminjaman Headpiece / Hairpin Elegan',
            ],
          },
        ],
      },
      {
        id: 'novita-prewed-outdoor',
        name: 'Prewedding Outdoor',
        iconType: 'outdoor',
        description: 'Riasan tahan lama seharian untuk foto prewedding di alam bebas atau taman terbuka.',
        subPackages: [
          {
            id: 'novita-pwo-1',
            name: 'Paket 1 — Outdoor Scenic Look',
            price: 350000,
            duration: '60 Menit',
            features: [
              'Heavy Duty Waterproof & Sweatproof Complexion',
              'Hairdo / Hijabdo Kuat Angin & Cuaca Terbuka',
              'Free Bulu Mata 3D Tahan Badai & Hairspray Kuat',
            ],
          },
          {
            id: 'novita-pwo-2',
            name: 'Paket 2 — All Day Prewedding Outdoor',
            price: 550000,
            duration: '120 Menit',
            badge: 'Complete',
            features: [
              'Standby MUA Penuh di Lokasi Outdoor Malang & Sekitarnya',
              '2x Ganti Konsep Makeup & Rambut/Hijab',
              'Free Touch Up Kit Lengkap Pribadi',
            ],
          },
        ],
      },
      {
        id: 'novita-kebaya',
        name: 'Kebaya',
        iconType: 'kebaya',
        description: 'Koleksi kebaya modern dan brokat anggun siap pakai untuk sesi foto.',
        subPackages: [
          {
            id: 'novita-kb-1',
            name: 'Paket 1 — Kebaya Modern Standard',
            price: 100000,
            badge: 'Ready to Wear',
            colors: ['Sage', 'Nude', 'Black', 'Maroon'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            features: [
              'Pilihan Warna Elegan: Sage, Nude, Black, Maroon',
              'Termasuk Jarik Batik Span / Rok Lilit Premium',
              'Tersedia Ukuran Lengkap: S, M, L, XL, XXL',
              'Fitting Langsung di Ruang Ganti Studio Alviero',
            ],
          },
          {
            id: 'novita-kb-2',
            name: 'Paket 2 — Kebaya Brokat Premium + Selendang',
            price: 150000,
            badge: 'Best Choice',
            colors: ['Navy', 'Gold', 'Silver', 'Sage', 'Nude'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            features: [
              'Kebaya Brokat Payet Halus & Mewah Timbul',
              'Pilihan Warna Eksklusif (Navy, Gold, Silver, Sage, Nude)',
              'Termasuk Selendang Organza, Manset & Jarik Eksklusif',
              'Free Inner Hijab / Kemben Warna Senada',
            ],
          },
        ],
      },
      {
        id: 'novita-hijabdo',
        name: 'Hijabdo',
        iconType: 'hairdo',
        description: 'Layanan penataan jilbab kreasi modern, tegak rapi dan membingkai wajah.',
        subPackages: [
          {
            id: 'novita-hj-1',
            name: 'Paket 1 — Simple Hijab Styling',
            price: 50000,
            duration: '20 Menit',
            features: [
              'Rapikan Pasmina / Segiempat Tegak Sempurna',
              'Bentuk Wajah Proporsional & Rapi di Kamera',
              'Free Jarum Pentul Premium & Bobby Pins',
            ],
          },
          {
            id: 'novita-hj-2',
            name: 'Paket 2 — Creative Modern Hijabdo',
            price: 85000,
            duration: '35 Menit',
            badge: 'Favorit',
            features: [
              'Kreasi Hijab Turban / Wisuda Layering Modern',
              'Pemasangan Aksesoris Mahkota / Bros Mewah',
              'Garansi Bentuk Hijab Tidak Berubah Selama Sesi Foto',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ananda',
    name: 'By Ananda',
    tagline: 'Korean Glowing Look & Modern Hijab Specialist',
    coverImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=85',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=85',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85',
    ],
    categories: [
      {
        id: 'ananda-pass-foto',
        name: 'Pass Foto',
        iconType: 'camera',
        description: 'Look segar alami khas Korea yang mencerahkan wajah di foto identitas.',
        subPackages: [
          {
            id: 'ananda-pf-1',
            name: 'Paket 1 — Clean Girl Look',
            price: 80000,
            duration: '30 Menit',
            features: [
              'Korean Clean & Minimalist Skin Look',
              'Rapikan Alis & Natural Peach / Pink Blush On',
              'Penataan Rambut / Hijab Minimalis Simpel',
              'Free Lip Gloss Refresh & Hydration',
            ],
          },
          {
            id: 'ananda-pf-2',
            name: 'Paket 2 — Signature Dewy Pass Foto',
            price: 130000,
            duration: '45 Menit',
            badge: 'Best Seller',
            features: [
              'Glass-Skin Finish Tahan Kilas Lampu Studio',
              'Bulu Mata Korea Tipis Lembut Super Ringan',
              'Hijabdo Clean Look / Hairdo Sleek Low Ponytail',
              'Free Setting Mist Hydration Tahan Seharian',
            ],
          },
        ],
      },
      {
        id: 'ananda-wedding',
        name: 'Wedding',
        iconType: 'wedding',
        description: 'Korean Bride Look yang mempesona dengan riasan glass-skin bercahaya alami.',
        subPackages: [
          {
            id: 'ananda-wd-1',
            name: 'Paket 1 — Korean Sweet Bride',
            price: 480000,
            duration: '90 Menit',
            features: [
              'Signature Glass-Skin Makeup Tahan 16 Jam',
              'Custom Eye Makeup & Glitter Detail Korea',
              'Styling Rambut Korean Wave / Hijab Turban Glam',
              'Free Ampoule Hydration Sheet Mask',
            ],
          },
          {
            id: 'ananda-wd-2',
            name: 'Paket 2 — Royal Korean Goddess',
            price: 800000,
            duration: '120 Menit',
            badge: 'Best Look',
            features: [
              'Ultra Flawless Dewy Foundation Waterproof',
              'Double Layer Eyelash Korea Super Ringan',
              'Hairdo Korean Updo dengan Tiara Mutiara',
              'Retouch Standby selama pemotretan studio',
            ],
          },
        ],
      },
      {
        id: 'ananda-grad-indoor',
        name: 'Graduation Indoor',
        iconType: 'graduation',
        description: 'Riasan wisuda manis cerah ala drakor dengan ketahanan studio ber-AC.',
        subPackages: [
          {
            id: 'ananda-gi-1',
            name: 'Paket 1 — Wisuda Korean Glowing Fresh',
            price: 200000,
            duration: '50 Menit',
            features: [
              'Korean Flawless Glow Complexion Sweatproof',
              'Aegyo Sal & Soft Shimmer Eyelook Cantik',
              'Hijabdo Simpel Modern / Hairdo Korean Wave',
              'Free Bulu Mata Korea Super Nyaman Dipakai',
            ],
          },
          {
            id: 'ananda-gi-2',
            name: 'Paket 2 — Wisuda Luxury Sparkle Look',
            price: 275000,
            duration: '65 Menit',
            badge: 'Favorit',
            features: [
              'High Coverage Glow Complexion Tahan 16 Jam',
              'Eyelash Double 3D Fluffy Custom Korea Style',
              'Hijabdo Silang / French Twist Hairdo Elegan',
              'Termasuk Pemasangan Aksesoris & Touch-Up Kit Pribadi',
            ],
          },
        ],
      },
      {
        id: 'ananda-grad-outdoor',
        name: 'Graduation Outdoor',
        iconType: 'outdoor',
        description: 'Tampilan fresh dewy yang tahan terik sinar matahari di kampus atau taman.',
        subPackages: [
          {
            id: 'ananda-go-1',
            name: 'Paket 1 — Outdoor Fresh Radiance',
            price: 210000,
            duration: '50 Menit',
            features: [
              'Sunproof & Sweatproof Glow Base Foundation',
              'Bulu Mata Korea Kuat Terpaan Angin',
              'Hijabdo Rapi Anti-Kusut',
            ],
          },
        ],
      },
      {
        id: 'ananda-prewed-indoor',
        name: 'Prewedding Indoor',
        iconType: 'prewedding',
        description: 'Romantisme ala drama Korea untuk foto prewedding studio.',
        subPackages: [
          {
            id: 'ananda-pwi-1',
            name: 'Paket 1 — Korean Studio Romance',
            price: 320000,
            duration: '60 Menit',
            features: [
              'Riasan Soft Romantic Glowing Studio',
              'Hairdo Wave / Hijabdo Berselendang Organza',
              'Free Softlens & Lip Gloss Hydration',
            ],
          },
        ],
      },
      {
        id: 'ananda-prewed-outdoor',
        name: 'Prewedding Outdoor',
        iconType: 'outdoor',
        description: 'Riasan cerah natural untuk foto prewedding outdoor sunset dan alam.',
        subPackages: [
          {
            id: 'ananda-pwo-1',
            name: 'Paket 1 — Sunset Glow Outdoor',
            price: 360000,
            duration: '70 Menit',
            features: [
              'Glow Complexion Water-Resistant',
              'Styling Rambut Curls / Hijab Modern',
              'Free Setting Spray Khusus Outdoor',
            ],
          },
        ],
      },
      {
        id: 'ananda-kebaya',
        name: 'Kebaya',
        iconType: 'kebaya',
        description: 'Sewa busana kebaya pastel modern.',
        subPackages: [
          {
            id: 'ananda-kb-1',
            name: 'Paket 1 — Kebaya Pastel Modern',
            price: 100000,
            colors: ['Sage', 'Nude', 'Silver', 'Dusty Pink'],
            sizes: ['S', 'M', 'L', 'XL'],
            features: [
              'Pilihan Warna: Sage, Nude, Silver, Pink Pastel',
              'Termasuk Jarik / Rok Batik Modern',
              'Ukuran S, M, L, XL',
            ],
          },
        ],
      },
      {
        id: 'ananda-hijabdo',
        name: 'Hijabdo',
        iconType: 'hairdo',
        description: 'Layanan penataan jilbab clean look ala selebgram.',
        subPackages: [
          {
            id: 'ananda-hj-1',
            name: 'Paket 1 — Clean Girl Hijab Styling',
            price: 50000,
            duration: '20 Menit',
            features: [
              'Pashmina Silk / Segiempat Paris Rapi Tegak',
              'Bentuk Wajah Tirus & Bersih di Kamera',
            ],
          },
          {
            id: 'ananda-hj-2',
            name: 'Paket 2 — Creative Layering Hijab',
            price: 85000,
            duration: '35 Menit',
            features: [
              'Kreasi Hijab Silang / Turban Wisuda Modern',
              'Free Bobby Pins & Hairspray Strong Hold',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'masaya',
    name: 'By Masaya',
    tagline: 'Editorial & Bold Glamour Specialist',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=700&q=85',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=700&q=85',
    ],
    categories: [
      {
        id: 'masaya-pass-foto',
        name: 'Pass Foto',
        iconType: 'camera',
        description: 'Tampilan tegas berkarakter dengan shading presisi tinggi.',
        subPackages: [
          {
            id: 'masaya-pf-1',
            name: 'Paket 1 — Sculpted ID Look',
            price: 85000,
            duration: '30 Menit',
            features: ['Contour Wajah Tajam & Matte', 'Rapikan Alis & Natural Lips'],
          },
        ],
      },
      {
        id: 'masaya-wedding',
        name: 'Wedding',
        iconType: 'wedding',
        description: 'Riasan pengantin bold glamour bergaya kerajaan.',
        subPackages: [
          {
            id: 'masaya-wd-1',
            name: 'Paket 1 — Royal Bold Bride',
            price: 650000,
            duration: '100 Menit',
            features: ['Full Airbrush Luxury Finish Waterproof', 'Full Sanggul Paes / Hijabdo Pengantin Mewah'],
          },
        ],
      },
      {
        id: 'masaya-grad-indoor',
        name: 'Graduation Indoor',
        iconType: 'graduation',
        description: 'Tampilan wisuda tegas, berkarakter, dan mewah di hadapan lensa kamera studio.',
        subPackages: [
          {
            id: 'masaya-gi-1',
            name: 'Paket 1 — Velvet Matte Wisuda',
            price: 185000,
            duration: '45 Menit',
            features: [
              'Velvet Matte Complexion Khusus Tipe Kulit Berminyak',
              'Bulu Mata Natural Wisuda 1 Layer',
              'Hairdo / Hijabdo Standar Wisuda Rapi',
            ],
          },
          {
            id: 'masaya-gi-2',
            name: 'Paket 2 — Bold Glamour Wisuda',
            price: 260000,
            duration: '60 Menit',
            badge: 'Favorite',
            features: [
              'High Coverage Sculpted Contour & Bold Eyelook',
              'Double Eyelashes Dramatic Fluffy Look',
              'Hijabdo Kreasi Editorial / Sanggul Modern Berkelas',
            ],
          },
        ],
      },
      {
        id: 'masaya-grad-outdoor',
        name: 'Graduation Outdoor',
        iconType: 'outdoor',
        description: 'Riasan tebal berkarakter yang tidak mudah pudar oleh keringat luar ruangan.',
        subPackages: [
          {
            id: 'masaya-go-1',
            name: 'Paket 1 — Outdoor High Glam',
            price: 220000,
            duration: '50 Menit',
            features: ['Heavy Duty Base Anti-Keringat', 'Bold Eyelashes Tahan Angin'],
          },
        ],
      },
      {
        id: 'masaya-prewed-indoor',
        name: 'Prewedding Indoor',
        iconType: 'prewedding',
        description: 'Riasan editorial pencahayaan dramatis studio.',
        subPackages: [
          {
            id: 'masaya-pwi-1',
            name: 'Paket 1 — Studio Editorial Drama',
            price: 330000,
            duration: '60 Menit',
            features: ['Contour Tajam Studio', 'Hairdo / Hijabdo Chic'],
          },
        ],
      },
      {
        id: 'masaya-prewed-outdoor',
        name: 'Prewedding Outdoor',
        iconType: 'outdoor',
        description: 'Foto prewedding konsep megah di alam bebas.',
        subPackages: [
          {
            id: 'masaya-pwo-1',
            name: 'Paket 1 — Majestic Outdoor Prewed',
            price: 450000,
            duration: '80 Menit',
            features: ['Waterproof Extreme', 'Standby Touch Up di Lokasi'],
          },
        ],
      },
      {
        id: 'masaya-kebaya',
        name: 'Kebaya',
        iconType: 'kebaya',
        description: 'Kebaya brokat berpayet mewah.',
        subPackages: [
          {
            id: 'masaya-kb-1',
            name: 'Paket 1 — Kebaya Glamour Brokat',
            price: 120000,
            colors: ['Maroon', 'Black', 'Gold', 'Navy'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            features: ['Pilihan Warna: Maroon, Black, Gold, Navy', 'Lengkap dengan Jarik & Manset'],
          },
        ],
      },
      {
        id: 'masaya-hijabdo',
        name: 'Hijabdo',
        iconType: 'hairdo',
        description: 'Styling hijab tegas berturban atau berselendang mewah.',
        subPackages: [
          {
            id: 'masaya-hj-1',
            name: 'Paket 1 — Bold Modern Hijabdo',
            price: 60000,
            duration: '25 Menit',
            features: ['Gaya Turban / Silang Bersudut Tajam', 'Free Pins & Hold Spray'],
          },
        ],
      },
    ],
  },
  {
    id: 'tiwi',
    name: 'By Tiwi',
    tagline: 'Master Hair Styling, Updo & Hijabdo Artistry',
    coverImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=700&q=85',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=85',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=85',
    ],
    categories: [
      {
        id: 'tiwi-hairdo',
        name: 'Hairdo',
        iconType: 'hairdo',
        description: 'Penataan rambut profesional dari curly natural hingga sanggul wisuda modern.',
        subPackages: [
          {
            id: 'tiwi-hd-1',
            name: 'Paket 1 — Blow Dry & Natural Curls',
            price: 60000,
            duration: '25 Menit',
            features: [
              'Catok Curly / Blow Natural Volume Bouncy',
              'Heat Protection Serum & Vitamin Rambut',
              'Ketahanan Hair Styling dengan Soft Mist',
            ],
          },
          {
            id: 'tiwi-hd-2',
            name: 'Paket 2 — Modern Updo & Sanggul Wisuda',
            price: 95000,
            duration: '40 Menit',
            badge: 'Best Seller',
            features: [
              'Sanggul Modern / Korean Low Bun / Half-Up Braided',
              'Free Hairnet, Bobby Pins & Hairspray Tahan Seharian',
              'Pemasangan Sirkam, Tiara, atau Bunga Rambut',
            ],
          },
        ],
      },
      {
        id: 'tiwi-hijabdo',
        name: 'Hijabdo',
        iconType: 'hairdo',
        description: 'Bentuk jilbab simetris, tegak rapi dan membingkai wajah dengan proporsional.',
        subPackages: [
          {
            id: 'tiwi-hj-1',
            name: 'Paket 1 — Clean & Formal Hijabdo',
            price: 50000,
            duration: '15 Menit',
            features: [
              'Bentuk Wajah Proporsional & Ramping di Kamera',
              'Pashmina Silk / Segiempat Paris Rapi Tanpa Kusut',
              'Jarum Pentul & Inner Hijab Anti-Geser',
            ],
          },
          {
            id: 'tiwi-hj-2',
            name: 'Paket 2 — Creative Graduation & Wedding Hijabdo',
            price: 85000,
            duration: '30 Menit',
            badge: 'Favorit',
            features: [
              'Hijab Layering Mewah, Veil / Selendang Styling Anggun',
              'Pemasangan Bros, Mahkota, atau Aksesoris Kepala',
              'Garansi Bentuk Hijab Tidak Berubah Selama Sesi Foto',
            ],
          },
        ],
      },
    ],
  },
];

// Helper icon renderer
const renderIcon = (type?: string) => {
  switch (type) {
    case 'camera':
      return <Camera className="w-4 h-4 text-[#5C725A]" />;
    case 'wedding':
      return <Heart className="w-4 h-4 text-[#5C725A]" />;
    case 'graduation':
      return <GraduationCap className="w-4 h-4 text-[#5C725A]" />;
    case 'outdoor':
      return <Sun className="w-4 h-4 text-[#5C725A]" />;
    case 'prewedding':
      return <Sparkles className="w-4 h-4 text-[#5C725A]" />;
    case 'kebaya':
      return <Shirt className="w-4 h-4 text-[#5C725A]" />;
    case 'hairdo':
      return <Scissors className="w-4 h-4 text-[#5C725A]" />;
    default:
      return <Sparkles className="w-4 h-4 text-[#5C725A]" />;
  }
};

interface MUAPricelistModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: Array<{
    id: string;
    category: 'MUA' | 'CETAK' | 'BINGKAI';
    itemName: string;
    vendor?: string;
    price: number;
    qty: number;
  }>;
  onAddExtraItem?: (item: {
    id: string;
    category: 'MUA' | 'CETAK' | 'BINGKAI';
    itemName: string;
    vendor?: string;
    price: number;
    qty: number;
  }) => void;
  onOpenExtraCheckout?: () => void;
}

export const MUAPricelistModal: React.FC<MUAPricelistModalProps> = ({
  isOpen,
  onClose,
  cartItems = [],
  onAddExtraItem,
  onOpenExtraCheckout,
}) => {
  // Step 1: Active Popup Vendor (when user clicks a vendor button in grid, e.g. "BY NOVITA")
  const [activePopupVendor, setActivePopupVendor] = useState<string | null>(null);

  // Step 2 & 3: Accordion state for category (e.g. "novita-pass-foto")
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  // Temporary visual feedback when a sub-package is added to cart
  const [addedPackageId, setAddedPackageId] = useState<string | null>(null);

  // Kebaya preview modal: holds active preview color, package context, and available colors
  const [previewKebayaModal, setPreviewKebayaModal] = useState<{
    color: string;
    pkgId: string;
    pkgName: string;
    availableColors: string[];
  } | null>(null);

  // Size chart guide modal
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);

  // Kebaya selection state: pkgId -> { color: string, size: string }
  const [kebayaSelections, setKebayaSelections] = useState<Record<string, { color: string; size: string }>>({});

  const getSelectedColor = (pkg: MuaSubPackage) => {
    if (kebayaSelections[pkg.id]?.color) {
      return kebayaSelections[pkg.id].color;
    }
    return pkg.colors && pkg.colors.length > 0 ? pkg.colors[0] : 'Sage';
  };

  const getSelectedSize = (pkg: MuaSubPackage) => {
    if (kebayaSelections[pkg.id]?.size) {
      return kebayaSelections[pkg.id].size;
    }
    return pkg.sizes && pkg.sizes.length > 0 ? pkg.sizes[0] : 'M';
  };

  const handleSelectKebayaColor = (pkgId: string, color: string) => {
    setKebayaSelections((prev) => ({
      ...prev,
      [pkgId]: {
        color,
        size: prev[pkgId]?.size || 'M',
      },
    }));
  };

  const handleSelectKebayaSize = (pkgId: string, size: string) => {
    setKebayaSelections((prev) => ({
      ...prev,
      [pkgId]: {
        color: prev[pkgId]?.color || 'Sage',
        size,
      },
    }));
  };

  // Active vendor object based on activePopupVendor
  const currentPopupVendor =
    MUA_VENDORS.find(
      (v) => v.name.toLowerCase() === (activePopupVendor || '').toLowerCase()
    ) || null;

  // Handler klik vendor dari grid
  const handleOpenVendorPopup = (vendorName: string) => {
    setActivePopupVendor(vendorName);
    const vendor = MUA_VENDORS.find(
      (v) => v.name.toLowerCase() === vendorName.toLowerCase()
    );
    // Buka kategori pertama (Pass Foto) secara otomatis agar langsung terlihat sub-paketnya!
    if (vendor && vendor.categories.length > 0) {
      setExpandedCategoryId(vendor.categories[0].id);
    } else {
      setExpandedCategoryId(null);
    }
  };

  // Handler toggle accordion kategori
  const handleToggleCategory = (categoryId: string) => {
    setExpandedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  // Handler tambah sub-paket ke keranjang
  const handleAddSubPackageToCart = (
    vendorName: string,
    categoryName: string,
    subPackage: MuaSubPackage
  ) => {
    if (!onAddExtraItem) return;

    const hasVariants =
      (subPackage.colors && subPackage.colors.length > 0) ||
      (subPackage.sizes && subPackage.sizes.length > 0);

    const selectedColor = getSelectedColor(subPackage);
    const selectedSize = getSelectedSize(subPackage);

    const itemId = hasVariants
      ? `${vendorName.toLowerCase().replace(/\s+/g, '-')}-${subPackage.id}-${selectedColor.toLowerCase().replace(/\s+/g, '-')}-${selectedSize.toLowerCase()}`
      : `${vendorName.toLowerCase().replace(/\s+/g, '-')}-${subPackage.id}`;

    const displayName = hasVariants
      ? `${subPackage.name} (Warna: ${selectedColor}, Size: ${selectedSize})`
      : `${subPackage.name} (${categoryName})`;

    onAddExtraItem({
      id: itemId,
      category: 'MUA',
      itemName: displayName,
      vendor: vendorName,
      price: subPackage.price,
      qty: 1,
    });

    // Umpan balik tombol
    setAddedPackageId(subPackage.id);
    setTimeout(() => {
      setAddedPackageId((cur) => (cur === subPackage.id ? null : cur));
    }, 1800);
  };

  const muaCartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) return;
    setActivePopupVendor(null);
    if (onOpenExtraCheckout) onOpenExtraCheckout();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 p-0 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[94vh] w-full max-w-[min(94vw,980px)] flex-col overflow-hidden rounded-t-[28px] border border-[#E7E0D9] bg-[#F7F4F1] shadow-2xl sm:rounded-[24px]">
        {/* ========================================================================= */}
        {/* HEADER UTAMA */}
        {/* ========================================================================= */}
        <div className="sticky top-0 z-20 shrink-0 border-b border-[#E8DDD6] bg-[#FDFBF7] px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8DDD6] bg-[#F2E9E4] text-[#5C725A] shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-serif text-sm sm:text-base md:text-lg font-black uppercase tracking-wide text-[#2E2E2E]">
                  PRICELIST MUA, KEBAYA, HAIRDO & HIJABDO
                </h3>
                <p className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.18em] text-[#6E856C] font-semibold">
                  Beauty & styling pilihan premium Alviero Studio
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#2D2D2D] px-3.5 py-1.5 text-[9px] sm:text-[10px] font-serif font-bold uppercase tracking-[0.16em] text-white shadow-sm transition-all hover:bg-[#1a1a1a] hover:scale-105 active:scale-95"
            >
              <span className="text-base leading-none">×</span>
              <span>Tutup</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BODY UTAMA: CAROUSEL & GRID VENDOR */}
        {/* ========================================================================= */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-[#F7F4F1] overscroll-contain">
          {/* A. CAROUSEL PORTOFOLIO */}
          <section className="px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5 border-b border-[#EAE2DC]/60">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#6E856C]">
                  Hasil Makeup & Styling
                </p>
                <h4 className="mt-1 font-serif text-xl sm:text-2xl font-black leading-tight tracking-tight text-[#2E2E2E]">
                  Inspirasi MUA, KEBAYA, HAIRDO & HIJABDO
                </h4>
              </div>
              <span className="text-[10px] font-sans text-stone-500 bg-white/70 px-2.5 py-1 rounded-full border border-[#E8DDD6]">
                Geser ke samping →
              </span>
            </div>

            <div className="mt-3.5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 no-scrollbar">
              {MUA_VENDORS.map((vendor) => (
                <button
                  key={vendor.id}
                  type="button"
                  onClick={() => handleOpenVendorPopup(vendor.name)}
                  className="group relative min-w-[200px] sm:min-w-[230px] snap-start overflow-hidden rounded-[20px] border border-[#E2D9D3] bg-white shadow-xs text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                >
                  <div className="relative h-[260px] sm:h-[300px] overflow-hidden">
                    <img
                      src={vendor.coverImage}
                      alt={vendor.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="inline-block rounded-full bg-white/90 px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-[#2E2E2E]">
                        {vendor.name}
                      </span>
                      <p className="text-[10px] text-stone-200 line-clamp-1 mt-1 font-sans">
                        {vendor.tagline}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* B. GRID 4 TOMBOL VENDOR */}
          <section className="px-4 py-4 sm:px-6 sm:py-5">
            <div className="rounded-[22px] border border-[#E8DDD6] bg-[#F4EFEA] p-4 sm:p-5">
              <div className="mb-3.5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#6E856C]">
                    Pricelist Detail
                  </p>
                  <h5 className="font-serif text-lg sm:text-xl font-black uppercase text-[#2E2E2E] mt-1">
                    Vendor & Layanan
                  </h5>
                </div>
                <span className="rounded-full bg-white border border-[#EAE0D8] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#2E2E2E]">
                  {MUA_VENDORS.length} vendor
                </span>
              </div>

              {/* Grid 4 Vendor */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {MUA_VENDORS.map((vendor) => (
                  <button
                    key={vendor.id}
                    type="button"
                    onClick={() => handleOpenVendorPopup(vendor.name)}
                    className="group flex min-h-24 sm:min-h-28 flex-col items-center justify-center rounded-xl border border-[#D8CEC7] bg-[#F7F4F1] p-3 text-center shadow-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#5C725A] hover:bg-white hover:shadow-md sm:rounded-2xl sm:p-6 active:scale-[0.98]"
                  >
                    <div className="font-serif text-lg sm:text-xl font-black uppercase leading-tight tracking-wide text-[#2E2E2E] group-hover:text-[#1d1d1d]">
                      {vendor.name}
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-[#6E856C] mt-1">
                      {vendor.categories.length} Kategori Layanan
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ========================================================================= */}
        {/* FOOTER MODAL UTAMA */}
        {/* ========================================================================= */}
        <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-[#DAD0C8] bg-[#2B2F33] px-4 py-3 sm:px-6 sm:py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#3A3A3A] bg-[#222222] px-4 py-2.5 text-xs font-serif font-black uppercase tracking-[0.12em] text-white shadow-md transition-all hover:bg-[#161616] hover:scale-[1.005] active:scale-[0.99] sm:gap-3 sm:px-5 sm:py-3 sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tutup & Kembali ke Beranda</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* POPUP DETAIL VENDOR (SESUAI SCREENSHOT PENGGUNA) */}
        {/* DILENGKAPI ACCORDION BUKA-TUTUP SUB-PAKET DI SETIAP LAYANAN */}
        {/* ========================================================================= */}
        {currentPopupVendor && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col rounded-2xl border border-[#E8DDD6] bg-white p-4 sm:p-6 shadow-2xl overflow-hidden">
              {/* Tombol Tutup X Popup */}
              <button
                type="button"
                onClick={() => setActivePopupVendor(null)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F2E9E4] text-[#2E2E2E] border border-[#E8DDD6] hover:bg-[#E4D9D3] transition-colors"
                aria-label="Tutup popup"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Portofolio Carousel Vendor di Atas */}
              <div className="pr-10 shrink-0">
                <div className="mb-3.5 h-36 sm:h-44 flex snap-x gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                  {currentPopupVendor.portfolioImages.map((image, index) => (
                    <img
                      key={`${currentPopupVendor.id}-portfolio-${index}`}
                      src={image}
                      alt={`Portofolio ${currentPopupVendor.name} ${index + 1}`}
                      className="h-full w-auto shrink-0 snap-center rounded-xl object-cover shadow-xs border border-[#E8DDD6]"
                    />
                  ))}
                </div>
                <h4 className="font-serif text-2xl sm:text-3xl font-black uppercase text-[#2E2E2E] leading-none">
                  {currentPopupVendor.name}
                </h4>
                <p className="text-xs font-sans text-stone-500 mt-1">
                  {currentPopupVendor.tagline} — Klik kategori layanan untuk melihat detail sub-paket.
                </p>
              </div>

              {/* ===================================================================== */}
              {/* DAFTAR KATEGORI LAYANAN DENGAN ACCORDION SUB-PAKET */}
              {/* Contoh: PASS FOTO di-klik -> muncul Paket 1, Paket 2, Paket 3 */}
              {/* ===================================================================== */}
              <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto pr-1 sm:pr-2 overscroll-contain">
                {currentPopupVendor.categories.map((category) => {
                  const isExpanded = expandedCategoryId === category.id;

                  return (
                    <div
                      key={category.id}
                      className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                        isExpanded
                          ? 'border-[#5C725A] bg-[#FAF7F2] shadow-xs'
                          : 'border-[#EAE0D8] bg-[#F9F7F5] hover:border-[#D1C6BD]'
                      }`}
                    >
                      {/* TOMBOL HEADER KATEGORI (ACCORDION TRIGGER) */}
                      <button
                        type="button"
                        onClick={() => handleToggleCategory(category.id)}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 p-3.5 text-left transition-colors select-none"
                        aria-expanded={isExpanded}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                              isExpanded
                                ? 'border-[#5C725A] bg-[#5C725A] text-white'
                                : 'border-[#E8DDD6] bg-white text-[#5C725A]'
                            }`}
                          >
                            {renderIcon(category.iconType)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-serif text-sm sm:text-base font-black uppercase tracking-wide text-[#2E2E2E] block">
                              {category.name}
                            </span>
                            <span className="text-[10px] font-mono text-stone-500">
                              {category.subPackages.length} Pilihan Sub-Paket
                            </span>
                          </div>
                        </div>

                        {/* Chevron Icon Berputar */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[9px] font-mono font-bold uppercase text-[#5C725A] bg-white px-2 py-0.5 rounded-full border border-[#E8DDD6]">
                            {isExpanded ? 'Tutup' : 'Lihat Paket'}
                          </span>
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full border border-[#E8DDD6] bg-white text-[#2E2E2E] transition-transform duration-300 ${
                              isExpanded ? 'rotate-180 bg-[#5C725A] text-white border-[#5C725A]' : ''
                            }`}
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </button>

                      {/* ============================================================= */}
                      {/* KONTEN EXPANDED: SUB-PAKET (PAKET 1, PAKET 2, PAKET 3, DST) */}
                      {/* ============================================================= */}
                      {isExpanded && (
                        <div className="border-t border-[#EAE2DC] px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
                          {/* Garis batas indentasi hierarki level 3 */}
                          <div className="border-l-3 border-[#5C725A] pl-3 space-y-2.5">
                            <p className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[#6E856C]">
                              Daftar Sub-Paket {category.name}
                            </p>

                            {category.subPackages.map((pkg) => {
                              const isAdded = addedPackageId === pkg.id;
                              const selectedColor = getSelectedColor(pkg);
                              const selectedSize = getSelectedSize(pkg);
                              const hasColors = Boolean(pkg.colors && pkg.colors.length > 0);
                              const hasSizes = Boolean(pkg.sizes && pkg.sizes.length > 0);

                              return (
                                <div
                                  key={pkg.id}
                                  className="rounded-xl border border-[#E8DDD6] bg-white p-3 shadow-2xs transition-all hover:border-[#5C725A] hover:shadow-xs"
                                >
                                  {/* Baris Atas: Judul Paket & Harga */}
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <h6 className="font-serif text-sm font-black text-[#2E2E2E]">
                                          {pkg.name}
                                        </h6>
                                        {pkg.badge && (
                                          <span className="rounded-full bg-[#5C725A] text-white px-1.5 py-0.2 text-[8px] font-mono font-bold uppercase tracking-wider">
                                            {pkg.badge}
                                          </span>
                                        )}
                                      </div>
                                      {pkg.duration && (
                                        <span className="inline-flex items-center gap-1 text-[9px] font-mono text-stone-500 mt-0.5">
                                          <Clock className="w-2.5 h-2.5 text-[#5C725A]" />
                                          <span>Estimasi {pkg.duration}</span>
                                        </span>
                                      )}
                                    </div>

                                    {/* Harga */}
                                    <div className="text-right shrink-0">
                                      <span className="text-[9px] font-mono font-bold text-stone-500 uppercase block">
                                        Harga
                                      </span>
                                      <div className="flex items-baseline gap-0.5 justify-end">
                                        <span className="text-[10px] font-mono font-bold text-[#5C725A]">
                                          Rp
                                        </span>
                                        <span className="font-mono text-sm sm:text-base font-black text-[#2E2E2E]">
                                          {pkg.price.toLocaleString('id-ID')}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Detail Fasilitas / Item yang didapatkan */}
                                  <div className="mt-2 space-y-1 border-t border-[#F2ECE7] pt-2">
                                    {pkg.features.map((feature, fIdx) => (
                                      <div
                                        key={fIdx}
                                        className="flex items-start gap-1.5 text-[11px] font-sans text-stone-700 leading-tight"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#5C725A] mt-0.5" />
                                        <span>{feature}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {/* SECTION PILIH VARIAN WARNA & UKURAN KEBAYA (SHOPEE STYLE LUXURY) */}
                                  {(hasColors || hasSizes) && (
                                    <div className="mt-2.5 space-y-2.5 rounded-xl border border-[#E8DDD6] bg-[#FAF8F5] p-2.5 sm:p-3">
                                      {/* PILIH WARNA */}
                                      {hasColors && pkg.colors && (
                                        <div>
                                          <div className="mb-2 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2E2E2E]">
                                                Warna:
                                              </span>
                                              <span className="rounded-full bg-[#5C725A]/15 px-2 py-0.5 text-[10px] font-mono font-bold text-[#5C725A] truncate">
                                                {selectedColor}
                                              </span>
                                            </div>

                                            {/* Tombol Lihat Contoh Baju */}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setPreviewKebayaModal({
                                                  color: selectedColor,
                                                  pkgId: pkg.id,
                                                  pkgName: pkg.name,
                                                  availableColors: pkg.colors || [],
                                                })
                                              }
                                              className="inline-flex items-center gap-1 rounded-full border border-[#DCD3CB] bg-white px-2 py-0.5 text-[9px] sm:text-[10px] font-sans font-bold text-[#5C725A] hover:bg-[#F2E9E4] transition-colors shadow-2xs shrink-0 cursor-pointer"
                                            >
                                              <Eye className="w-3 h-3 text-[#5C725A]" />
                                              <span>Lihat Contoh Baju</span>
                                            </button>
                                          </div>

                                          {/* Grid Thumbnail Pilihan Warna ala Shopee */}
                                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                            {pkg.colors.map((colorName) => {
                                              const isColorSelected = selectedColor === colorName;
                                              const colorInfo = KEBAYA_COLOR_CATALOG[colorName];
                                              const colorImg = colorInfo?.image || KEBAYA_PREVIEWS[colorName];
                                              const colorHex = colorInfo?.hex || '#999999';

                                              return (
                                                <button
                                                  key={colorName}
                                                  type="button"
                                                  onClick={() => handleSelectKebayaColor(pkg.id, colorName)}
                                                  className={`group flex items-center gap-1.5 rounded-lg border p-1 text-left transition-all cursor-pointer ${
                                                    isColorSelected
                                                      ? 'border-[#5C725A] bg-[#EFF6EE] ring-1.5 ring-[#5C725A] shadow-2xs'
                                                      : 'border-[#E2D8CF] bg-white hover:border-[#5C725A]/60 hover:bg-[#FAF7F2]'
                                                  }`}
                                                >
                                                  {/* Mini Foto Baju */}
                                                  <div className="relative h-7 w-7 sm:h-8 sm:w-8 shrink-0 overflow-hidden rounded-md border border-[#D9CEBF] bg-[#EAE3DC]">
                                                    {colorImg ? (
                                                      <img
                                                        src={colorImg}
                                                        alt={`Kebaya ${colorName}`}
                                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                      />
                                                    ) : (
                                                      <div
                                                        className="h-full w-full"
                                                        style={{ backgroundColor: colorHex }}
                                                      />
                                                    )}
                                                    {/* Dot warna hex di pojok */}
                                                    <span
                                                      className="absolute bottom-0 right-0 h-2 w-2 rounded-tl border-t border-l border-white shadow-2xs"
                                                      style={{ backgroundColor: colorHex }}
                                                    />
                                                  </div>

                                                  <div className="min-w-0 flex-1">
                                                    <span
                                                      className={`block truncate text-[11px] font-sans font-semibold leading-tight ${
                                                        isColorSelected ? 'text-[#2E2E2E]' : 'text-stone-700'
                                                      }`}
                                                    >
                                                      {colorName}
                                                    </span>
                                                    <span className="text-[8px] font-mono text-stone-500 block truncate">
                                                      {colorInfo?.tag || 'Tersedia'}
                                                    </span>
                                                  </div>

                                                  {isColorSelected && (
                                                    <Check className="h-3 w-3 shrink-0 text-[#5C725A] mr-0.5" />
                                                  )}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      {/* PILIH UKURAN */}
                                      {hasSizes && pkg.sizes && (
                                        <div className="pt-2 border-t border-[#EDE5DE]">
                                          <div className="mb-1.5 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2E2E2E]">
                                                Ukuran:
                                              </span>
                                              <span className="rounded-full bg-[#2E2E2E] px-2 py-0.5 text-[9px] font-mono font-bold text-white">
                                                {selectedSize}
                                              </span>
                                            </div>

                                            {/* Link Tabel Ukuran > */}
                                            <button
                                              type="button"
                                              onClick={() => setIsSizeChartOpen(true)}
                                              className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#5C725A] hover:text-[#445542] hover:underline cursor-pointer"
                                            >
                                              <Ruler className="w-3 h-3 text-[#5C725A]" />
                                              <span>Tabel Ukuran &gt;</span>
                                            </button>
                                          </div>

                                          {/* Button Row Pilihan Ukuran */}
                                          <div className="flex flex-wrap gap-1.5">
                                            {pkg.sizes.map((size) => {
                                              const isSizeSelected = selectedSize === size;

                                              return (
                                                <button
                                                  key={size}
                                                  type="button"
                                                  onClick={() => handleSelectKebayaSize(pkg.id, size)}
                                                  className={`flex h-8 min-w-[40px] items-center justify-center rounded-lg border px-3 text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                                                    isSizeSelected
                                                      ? 'border-[#2E2E2E] bg-[#2E2E2E] text-white shadow-xs'
                                                      : 'border-[#E2D8CF] bg-white text-stone-700 hover:border-[#5C725A] hover:bg-[#FDFBF7]'
                                                  }`}
                                                >
                                                  {size}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Tombol Aksi Tambah ke Keranjang */}
                                  <div className="mt-2.5 flex items-center justify-between pt-1">
                                    {(hasColors || hasSizes) ? (
                                      <div className="text-[10px] font-mono text-stone-500">
                                        <span className="font-semibold text-[#5C725A]">{selectedColor}</span>
                                        <span className="mx-1">•</span>
                                        <span>Size <strong className="text-[#2E2E2E]">{selectedSize}</strong></span>
                                      </div>
                                    ) : <div />}

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAddSubPackageToCart(
                                          currentPopupVendor.name,
                                          category.name,
                                          pkg
                                        )
                                      }
                                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-serif font-black uppercase tracking-[0.14em] transition-all duration-200 active:scale-95 cursor-pointer ${
                                        isAdded
                                          ? 'bg-[#5C725A] text-white shadow-2xs'
                                          : 'bg-[#2E2E2E] text-white hover:bg-[#1a1a1a]'
                                      }`}
                                    >
                                      {isAdded ? (
                                        <>
                                          <Check className="w-3 h-3 stroke-[3]" />
                                          <span>Ditambahkan</span>
                                        </>
                                      ) : (
                                        <>
                                          <span>+ Tambah</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ===================================================================== */}
              {/* RINGKASAN KERANJANG DI POPUP (JIKA SUDAH PILIH PAKET) */}
              {/* ===================================================================== */}
              {cartItems.length > 0 && (
                <div className="mt-3 shrink-0 rounded-xl border border-[#DDE7DF] bg-[#FAF7F2] p-3 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[#5C725A] block">
                        Total {cartItems.length} Layanan Dipilih
                      </span>
                      <div className="font-mono text-sm sm:text-base font-black text-[#2E2E2E]">
                        Rp {muaCartTotal.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoToCheckout}
                      className="rounded-full bg-[#25D366] px-4 py-2 text-[11px] font-serif font-black uppercase tracking-[0.12em] text-white shadow-xs hover:bg-[#1ebc5a] transition-colors"
                    >
                      Lanjut ke Checkout →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL LIHAT CONTOH BAJU KEBAYA (FOTO BESAR & COLOR SWITCHER) */}
        {/* ========================================================================= */}
        {previewKebayaModal && (() => {
          const activeColor = previewKebayaModal.color;
          const colorInfo = KEBAYA_COLOR_CATALOG[activeColor] || {
            name: activeColor,
            image: KEBAYA_PREVIEWS[activeColor] || KEBAYA_PREVIEWS.Sage,
            hex: '#8FA38D',
            tag: 'Koleksi Studio',
            desc: 'Kebaya modern berpayet timbul anggun untuk sesi foto studio Alviero.',
          };

          return (
            <div
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setPreviewKebayaModal(null)}
              role="presentation"
            >
              <div
                className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#E8DDD6] bg-[#FDFBF7] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Modal */}
                <div className="flex items-center justify-between border-b border-[#E8DDD6] bg-[#FAF7F2] px-4 py-3">
                  <div className="min-w-0 pr-2">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.16em] text-[#5C725A] block">
                      Contoh Model & Detail Busana
                    </span>
                    <h5 className="truncate font-serif text-base font-black text-[#2E2E2E]">
                      Kebaya Warna: {colorInfo.name}
                    </h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewKebayaModal(null)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAE1DA] text-[#2E2E2E] hover:bg-[#DBD0C7] transition-colors"
                    aria-label="Tutup preview"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Konten Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                  {/* Foto Besar Contoh Baju */}
                  <div className="relative overflow-hidden rounded-xl border border-[#E8DDD6] bg-stone-100 shadow-xs">
                    <img
                      src={colorInfo.image}
                      alt={`Contoh baju kebaya warna ${colorInfo.name}`}
                      className="h-72 sm:h-80 w-full object-cover object-top"
                    />
                    {/* Tag Badge */}
                    <div className="absolute top-2.5 left-2.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-bold text-white shadow-sm flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: colorInfo.hex }}
                      />
                      <span>{colorInfo.tag}</span>
                    </div>
                  </div>

                  {/* Deskripsi & Karakter Warna */}
                  <div className="rounded-xl border border-[#E8DDD6] bg-white p-3 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-black text-[#2E2E2E]">
                        {previewKebayaModal.pkgName}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSizeChartOpen(true)}
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#5C725A] cursor-pointer hover:underline"
                      >
                        <Ruler className="w-3 h-3" />
                        <span>Lihat Ukuran</span>
                      </button>
                    </div>
                    <p className="text-xs font-sans text-stone-600 leading-relaxed">
                      {colorInfo.desc}
                    </p>
                  </div>

                  {/* Switcher Cepat Warna Lainnya */}
                  {previewKebayaModal.availableColors.length > 1 && (
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2E2E2E] block mb-2">
                        Pilih Warna Lain untuk Dilihat:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {previewKebayaModal.availableColors.map((colorName) => {
                          const isActive = colorName === activeColor;
                          const itemInfo = KEBAYA_COLOR_CATALOG[colorName];
                          const itemImg = itemInfo?.image || KEBAYA_PREVIEWS[colorName];

                          return (
                            <button
                              key={colorName}
                              type="button"
                              onClick={() => {
                                setPreviewKebayaModal((prev) =>
                                  prev ? { ...prev, color: colorName } : null
                                );
                                handleSelectKebayaColor(previewKebayaModal.pkgId, colorName);
                              }}
                              className={`flex items-center gap-1.5 rounded-lg border p-1 text-xs font-sans font-semibold transition-all cursor-pointer ${
                                isActive
                                  ? 'border-[#5C725A] bg-[#EFF6EE] ring-1.5 ring-[#5C725A] text-[#2E2E2E]'
                                  : 'border-[#E2D8CF] bg-white text-stone-600 hover:border-[#5C725A]/60'
                              }`}
                            >
                              <div className="h-6 w-6 overflow-hidden rounded border border-[#D9CEBF]">
                                <img
                                  src={itemImg}
                                  alt={colorName}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span className="pr-1">{colorName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Modal: Tombol Terapkan & Pilih */}
                <div className="border-t border-[#E8DDD6] bg-[#FAF7F2] p-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSizeChartOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#DCD3CB] bg-white px-3 py-2 text-[10px] font-mono font-bold text-[#2E2E2E] hover:bg-[#F2E9E4] transition-colors cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5 text-[#5C725A]" />
                    <span>Tabel Ukuran</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSelectKebayaColor(previewKebayaModal.pkgId, activeColor);
                      setPreviewKebayaModal(null);
                    }}
                    className="flex-1 rounded-full bg-[#5C725A] px-4 py-2 text-center text-xs font-serif font-black uppercase tracking-wider text-white shadow-xs hover:bg-[#4E624C] transition-colors cursor-pointer"
                  >
                    Gunakan Warna {activeColor} ✓
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* MODAL TABEL PANDUAN UKURAN KEBAYA (SIZE CHART) */}
        {/* ========================================================================= */}
        {isSizeChartOpen && (
          <div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsSizeChartOpen(false)}
            role="presentation"
          >
            <div
              className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#E8DDD6] bg-[#FDFBF7] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b border-[#E8DDD6] bg-[#FAF7F2] px-4 py-3 sm:px-5 sm:py-3.5">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E8DDD6] bg-[#F2E9E4] text-[#5C725A]">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-serif text-base font-black uppercase text-[#2E2E2E]">
                      Tabel Panduan Ukuran Kebaya
                    </h5>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6E856C]">
                      Standar Fitting Alviero Studio Malang
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSizeChartOpen(false)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAE1DA] text-[#2E2E2E] hover:bg-[#DBD0C7] transition-colors cursor-pointer"
                  aria-label="Tutup tabel ukuran"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body Modal */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Tabel Ukuran */}
                <div className="overflow-x-auto rounded-xl border border-[#E8DDD6] bg-white shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#E8DDD6] bg-[#FAF7F2] text-[10px] font-mono font-bold uppercase text-[#5C725A]">
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Lingkar Dada (LD)</th>
                        <th className="py-2.5 px-3">Pinggang</th>
                        <th className="py-2.5 px-3">Panjang</th>
                        <th className="py-2.5 px-3">Est. Berat Badan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECE7] font-sans">
                      {KEBAYA_SIZE_CHART.map((row) => (
                        <tr key={row.size} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-2.5 px-3 font-mono font-black text-[#2E2E2E]">
                            <span className="inline-block rounded-md bg-[#2E2E2E] px-2 py-0.5 text-white text-[11px]">
                              {row.size}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-stone-700">{row.ld}</td>
                          <td className="py-2.5 px-3 text-stone-600">{row.waist}</td>
                          <td className="py-2.5 px-3 text-stone-600">{row.length}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#5C725A]">{row.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Informasi Tambahan & Layanan Fitting Ruang Ganti */}
                <div className="space-y-2 rounded-xl border border-[#E8DDD6] bg-[#FAF7F2] p-3.5 text-xs text-stone-700">
                  <div className="flex items-start gap-2">
                    <span className="text-base shrink-0">👗</span>
                    <p>
                      <strong className="text-[#2E2E2E]">Free Fitting Langsung di Ruang Ganti:</strong> Anda dapat mencoba dan fitting kebaya terlebih dahulu di studio Alviero sebelum sesi foto dimulai untuk memastikan ukuran yang paling pas.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-base shrink-0">✨</span>
                    <p>
                      <strong className="text-[#2E2E2E]">Karet Pinggang Fleksibel:</strong> Rok jarik batik menggunakan karet pinggang dan model span lilit modern sehingga fleksibel menyesuaikan bentuk tubuh.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-base shrink-0">🧕</span>
                    <p>
                      <strong className="text-[#2E2E2E]">Kelengkapan Paket:</strong> Sudah termasuk manset dalaman / kemben serta inner jilbab dengan warna yang senada.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="border-t border-[#E8DDD6] bg-[#FAF7F2] p-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsSizeChartOpen(false)}
                  className="rounded-full bg-[#2E2E2E] px-5 py-2 text-xs font-serif font-black uppercase tracking-wider text-white hover:bg-black transition-colors cursor-pointer"
                >
                  Tutup Panduan Ukuran
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MUAPricelistModal;
