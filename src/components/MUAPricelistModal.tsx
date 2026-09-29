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
  Palette,
  Camera,
  Layers,
  GraduationCap,
  Shirt,
  Scissors
} from 'lucide-react';

// ==========================================
// 1. DATA STRUCTURE (3-LEVEL HIERARCHY)
// Level 1: Vendor (By Novita, By Ananda, By Masaya, By Tiwi)
// Level 2: Kategori Layanan (Pass Foto, Wisuda, Prewedding, Kebaya, dll)
// Level 3: Sub-Paket (Paket 1, Paket 2, Paket 3 + Harga + Fasilitas Lengkap)
// ==========================================

export interface MuaSubPackage {
  id: string;
  name: string;
  price: number;
  duration?: string;
  badge?: string;
  features: string[];
  note?: string;
}

export interface MuaCategory {
  id: string;
  name: string;
  iconName?: 'camera' | 'graduation' | 'sparkles' | 'shirt' | 'scissors' | 'layers';
  description?: string;
  subPackages: MuaSubPackage[];
}

export interface MuaVendorDefinition {
  id: string;
  name: string;
  tagline: string;
  coverImage: string;
  portfolioImages: string[];
  categories: MuaCategory[];
}

// Kompatibilitas mundur
export type MuaVendor = MuaVendorDefinition;
export interface MuaServiceDefinition {
  id: string;
  name: string;
  price: number;
}

export const KEBAYA_PREVIEWS: Record<string, string> = {
  Sage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=85',
  Nude: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=85',
  Black: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85',
  Navy: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=700&q=85',
  Maroon: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85',
  Gold: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85',
  Silver: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85',
};

// ==========================================
// MOCK DATA RESMI 4 VENDOR DENGAN 3 LEVEL
// ==========================================
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
        name: 'Makeup Pass Foto & Formal',
        iconName: 'camera',
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
              'Free Bedak Touch-Up sebelum masuk studio foto',
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
        id: 'novita-wisuda',
        name: 'Makeup Wisuda & Graduation',
        iconName: 'graduation',
        description: 'Tampil anggun mempesona di momen wisuda berharga dengan ketahanan makeup seharian penuh.',
        subPackages: [
          {
            id: 'novita-ws-1',
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
            id: 'novita-ws-2',
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
            id: 'novita-ws-3',
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
        id: 'novita-prewed',
        name: 'Makeup Prewedding & Photoshoot',
        iconName: 'sparkles',
        description: 'Konsep riasan editorial dan cinematic khusus sesi foto studio pasangan.',
        subPackages: [
          {
            id: 'novita-pw-1',
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
            id: 'novita-pw-2',
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
        id: 'novita-kebaya',
        name: 'Sewa Busana & Kebaya',
        iconName: 'shirt',
        description: 'Koleksi kebaya modern dan brokat anggun siap pakai untuk sesi foto.',
        subPackages: [
          {
            id: 'novita-kb-1',
            name: 'Paket 1 — Kebaya Modern Standard',
            price: 100000,
            badge: 'Ready to Wear',
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
            features: [
              'Kebaya Brokat Payet Halus & Mewah Timbul',
              'Pilihan Warna Eksklusif (Navy, Gold, Silver, Sage, Nude)',
              'Termasuk Selendang Organza, Manset & Jarik Eksklusif',
              'Free Inner Hijab / Kemben Warna Senada',
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
        name: 'Makeup Pass Foto & ID Look',
        iconName: 'camera',
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
        id: 'ananda-wisuda-event',
        name: 'Makeup Wisuda & Engagement',
        iconName: 'graduation',
        description: 'Sentuhan riasan glowing natural yang tahan lama dan tidak cakey.',
        subPackages: [
          {
            id: 'ananda-we-1',
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
            id: 'ananda-we-2',
            name: 'Paket 2 — Engagement & Wisuda Luxury Look',
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
        id: 'ananda-hair-hijab',
        name: 'Hairdo & Hijabdo Only',
        iconName: 'scissors',
        description: 'Layanan penataan rambut dan jilbab tanpa makeup wajah.',
        subPackages: [
          {
            id: 'ananda-hh-1',
            name: 'Paket 1 — Simple Hijab Styling / Blow',
            price: 50000,
            duration: '20 Menit',
            features: [
              'Rapikan Pasmina / Segiempat Tegak Sempurna',
              'Penataan Blow Dry / Natural Curls',
              'Free Jarum Pentul Premium & Bobby Pins',
            ],
          },
          {
            id: 'ananda-hh-2',
            name: 'Paket 2 — Creative Modern Hijabdo / Updo',
            price: 85000,
            duration: '35 Menit',
            badge: 'Favorit',
            features: [
              'Kreasi Hijab Turban / Wisuda Layering Modern',
              'Hairdo Updo / Sanggul Modern Wisuda Berkelas',
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
        id: 'masaya-wisuda',
        name: 'Makeup Wisuda & Group Photoshoot',
        iconName: 'graduation',
        description: 'Tampilan tegas, berkarakter, dan mewah di hadapan lensa kamera studio.',
        subPackages: [
          {
            id: 'masaya-ws-1',
            name: 'Paket 1 — Velvet Matte Wisuda',
            price: 185000,
            duration: '45 Menit',
            features: [
              'Velvet Matte Complexion Khusus Kulit Cenderung Berminyak',
              'Bulu Mata Natural Wisuda 1 Layer',
              'Hairdo / Hijabdo Standar Wisuda Rapi',
            ],
          },
          {
            id: 'masaya-ws-2',
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
        id: 'masaya-prewed',
        name: 'Makeup Prewedding & Photoshoot Studio',
        iconName: 'sparkles',
        description: 'Riasan premium dengan kontras tinggi yang sempurna untuk konsep gaun mewah.',
        subPackages: [
          {
            id: 'masaya-pw-1',
            name: 'Paket 1 — Prewedding Studio Lighting Look',
            price: 320000,
            duration: '60 Menit',
            features: [
              'Complexion Tahan Sorotan Flash Studio Profesional',
              'Hairdo / Hijabdo Konseptual Sesuai Tema Gaun',
              'Free Bulu Mata 3D Premium Fluffy',
            ],
          },
          {
            id: 'masaya-pw-2',
            name: 'Paket 2 — Full Session + Retouch Ganti Konsep',
            price: 480000,
            duration: '90 Menit',
            badge: 'All Inclusive',
            features: [
              'Makeup Tahan Lama Tahan Gesekan Masker & Keringat',
              'Standby Retouch Selama Sesi Foto 2x Ganti Wardrobe',
              'Hairdo & Hijabdo 2 Look Berbeda',
            ],
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
        name: 'Hairdo Styling Studio',
        iconName: 'scissors',
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
        name: 'Hijabdo Artistry Studio',
        iconName: 'layers',
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
const renderCategoryIcon = (iconName?: string) => {
  switch (iconName) {
    case 'camera':
      return <Camera className="w-4 h-4 text-[#6E856C]" />;
    case 'graduation':
      return <GraduationCap className="w-4 h-4 text-[#6E856C]" />;
    case 'shirt':
      return <Shirt className="w-4 h-4 text-[#6E856C]" />;
    case 'scissors':
      return <Scissors className="w-4 h-4 text-[#6E856C]" />;
    case 'layers':
      return <Layers className="w-4 h-4 text-[#6E856C]" />;
    default:
      return <Sparkles className="w-4 h-4 text-[#6E856C]" />;
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
  // Step 1: Active Vendor selection (default: 'novita')
  const [selectedVendorId, setSelectedVendorId] = useState<string>('novita');

  // Step 3: Accordion state for service category (default to first category of selected vendor)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>('novita-pass-foto');

  // State untuk feedback toast saat paket ditambahkan
  const [addedPackageId, setAddedPackageId] = useState<string | null>(null);

  // Modal preview foto kebaya
  const [previewImagePopup, setPreviewImagePopup] = useState<string | null>(null);

  // Selected vendor object
  const activeVendor = MUA_VENDORS.find((v) => v.id === selectedVendorId) || MUA_VENDORS[0];

  // Handler pergantian vendor
  const handleSelectVendor = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    const targetVendor = MUA_VENDORS.find((v) => v.id === vendorId);
    // Buka kategori pertama dari vendor yang baru dipilih
    if (targetVendor && targetVendor.categories.length > 0) {
      setExpandedCategoryId(targetVendor.categories[0].id);
    } else {
      setExpandedCategoryId(null);
    }
  };

  // Handler buka-tutup accordion kategori
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

    onAddExtraItem({
      id: `${vendorName.toLowerCase().replace(/\s+/g, '-')}-${subPackage.id}`,
      category: 'MUA',
      itemName: `${subPackage.name} (${categoryName})`,
      vendor: vendorName,
      price: subPackage.price,
      qty: 1,
    });

    // Beri visual feedback tombol
    setAddedPackageId(subPackage.id);
    setTimeout(() => {
      setAddedPackageId((cur) => (cur === subPackage.id ? null : cur));
    }, 1800);
  };

  const muaCartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) return;
    if (onOpenExtraCheckout) onOpenExtraCheckout();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 p-0 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[94vh] w-full max-w-[min(94vw,980px)] flex-col overflow-hidden rounded-t-[28px] border border-[#E7E0D9] bg-[#F7F4F1] shadow-2xl sm:rounded-[24px]">
        {/* ========================================== */}
        {/* HEADER MODAL */}
        {/* ========================================== */}
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

        {/* ========================================== */}
        {/* SCROLLABLE CONTENT BODY */}
        {/* ========================================== */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-[#F7F4F1] overscroll-contain">
          {/* A. CAROUSEL INSPIRASI HASIL KARYA */}
          <section className="px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5 border-b border-[#EAE2DC]/60">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#6E856C]">
                  Portofolio & Inspirasi
                </p>
                <h4 className="mt-1 font-serif text-xl sm:text-2xl font-black leading-tight tracking-tight text-[#2E2E2E]">
                  Karya MUA & Styling Alviero
                </h4>
              </div>
              <span className="text-[10px] font-sans text-stone-500 bg-white/70 px-2.5 py-1 rounded-full border border-[#E8DDD6]">
                Geser portofolio →
              </span>
            </div>

            <div className="mt-3.5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 no-scrollbar">
              {MUA_VENDORS.map((vendor) => {
                const isCurrent = vendor.id === selectedVendorId;
                return (
                  <button
                    key={vendor.id}
                    type="button"
                    onClick={() => handleSelectVendor(vendor.id)}
                    className={`group relative min-w-[190px] sm:min-w-[220px] snap-start overflow-hidden rounded-[20px] border text-left transition-all duration-300 hover:scale-[1.02] ${
                      isCurrent
                        ? 'border-2 border-[#5C725A] shadow-md ring-2 ring-[#A9BCA7]/40'
                        : 'border-[#E2D9D3] bg-white shadow-xs opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div className="relative h-[250px] sm:h-[280px] overflow-hidden">
                      <img
                        src={vendor.coverImage}
                        alt={vendor.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                      
                      {isCurrent && (
                        <div className="absolute top-2.5 right-2.5 rounded-full bg-[#5C725A] px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-white shadow-xs">
                          ✓ Aktif
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className="inline-block rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-[#2E2E2E]">
                          {vendor.categories.length} Kategori
                        </span>
                        <h5 className="font-serif text-lg font-black text-white mt-1 leading-tight">
                          {vendor.name}
                        </h5>
                        <p className="text-[10px] text-stone-200 line-clamp-1 mt-0.5">
                          {vendor.tagline}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* B. STEP 1: VENDOR SELECTOR GRID */}
          <section className="px-4 py-4 sm:px-6 sm:py-5">
            <div className="rounded-[22px] border border-[#E8DDD6] bg-[#F2E9E4]/60 p-4 sm:p-5">
              <div className="mb-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#5C725A] border border-[#E8DDD6]">
                    <span>Step 1</span> • Pilih Vendor MUA
                  </span>
                  <h4 className="font-serif text-lg sm:text-xl font-black uppercase text-[#2E2E2E] mt-1.5">
                    Daftar Vendor Tersedia
                  </h4>
                </div>
                <span className="rounded-full bg-white border border-[#EAE0D8] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#2E2E2E]">
                  {MUA_VENDORS.length} Vendor
                </span>
              </div>

              {/* Grid 4 Tombol Vendor */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {MUA_VENDORS.map((vendor) => {
                  const isSelected = vendor.id === selectedVendorId;
                  return (
                    <button
                      key={vendor.id}
                      type="button"
                      onClick={() => handleSelectVendor(vendor.id)}
                      className={`group relative flex flex-col justify-between rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-left transition-all duration-200 ease-out active:scale-[0.98] ${
                        isSelected
                          ? 'border-2 border-[#5C725A] bg-[#2E2E2E] text-white shadow-md ring-2 ring-[#A9BCA7]/30 -translate-y-0.5'
                          : 'border border-[#D8CEC7] bg-[#FDFBF7] text-[#2E2E2E] hover:border-[#6E856C] hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[9px] font-mono font-bold uppercase tracking-[0.16em] px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-white/20 text-[#F2E9E4]'
                              : 'bg-[#F2E9E4] text-[#5C725A]'
                          }`}
                        >
                          {vendor.categories.length} Kategori
                        </span>
                        {isSelected && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5C725A] text-white text-[10px]">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <div
                          className={`font-serif text-base sm:text-lg font-black uppercase leading-tight tracking-wide ${
                            isSelected ? 'text-white' : 'text-[#2E2E2E]'
                          }`}
                        >
                          {vendor.name}
                        </div>
                        <p
                          className={`text-[10px] line-clamp-1 mt-1 font-sans ${
                            isSelected ? 'text-stone-300' : 'text-stone-500'
                          }`}
                        >
                          {vendor.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* C. STEP 2 & 3: KATEGORI LAYANAN & ACCORDION SUB-PAKET */}
          <section className="px-4 pb-8 sm:px-6 sm:pb-10">
            <div className="rounded-[22px] border border-[#E8DDD6] bg-white p-4 sm:p-6 shadow-sm">
              {/* Header Vendor Terpilih */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE2DC] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2E9E4] px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#5C725A]">
                      <span>Step 2 & 3</span> • Kategori & Sub-Paket
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#6E856C]">
                      • {activeVendor.name}
                    </span>
                  </div>
                  <h4 className="mt-1 font-serif text-xl sm:text-2xl font-black uppercase text-[#2E2E2E]">
                    Pricelist Layanan {activeVendor.name}
                  </h4>
                  <p className="text-xs font-sans text-stone-500 mt-0.5">
                    {activeVendor.tagline} — Klik kategori di bawah untuk membuka daftar sub-paket.
                  </p>
                </div>

                {/* Mini Portfolio Thumbnails */}
                <div className="flex items-center gap-2 shrink-0">
                  {activeVendor.portfolioImages.map((img, idx) => (
                    <img
                      key={`${activeVendor.id}-thumb-${idx}`}
                      src={img}
                      alt={`Portofolio ${activeVendor.name} ${idx + 1}`}
                      className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl object-cover border border-[#E8DDD6] shadow-2xs"
                    />
                  ))}
                </div>
              </div>

              {/* LIST ACCORDION KATEGORI LAYANAN */}
              <div className="mt-5 space-y-3.5">
                {activeVendor.categories.map((category) => {
                  const isExpanded = expandedCategoryId === category.id;

                  return (
                    <div
                      key={category.id}
                      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isExpanded
                          ? 'border-[#A9BCA7] bg-[#FAF7F2] shadow-sm'
                          : 'border-[#E8DDD6] bg-[#FDFBF7] hover:border-[#D1C6BD]'
                      }`}
                    >
                      {/* ACCORDION HEADER (KATEGORI) */}
                      <button
                        type="button"
                        onClick={() => handleToggleCategory(category.id)}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 p-3.5 sm:p-4 text-left transition-colors select-none"
                        aria-expanded={isExpanded}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                              isExpanded
                                ? 'border-[#5C725A] bg-[#5C725A] text-white shadow-xs'
                                : 'border-[#E8DDD6] bg-white text-[#5C725A]'
                            }`}
                          >
                            {renderCategoryIcon(category.iconName)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-serif text-base sm:text-lg font-black uppercase text-[#2E2E2E]">
                                {category.name}
                              </h5>
                              <span className="rounded-full bg-[#F2E9E4] border border-[#E8DDD6] px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[#5C725A]">
                                {category.subPackages.length} Sub-Paket
                              </span>
                            </div>
                            {category.description && (
                              <p className="text-[11px] sm:text-xs font-sans text-stone-500 line-clamp-1 mt-0.5">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Chevron Indicator with Smooth Rotation */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="hidden sm:inline text-[10px] font-mono font-bold uppercase text-stone-500">
                            {isExpanded ? 'Tutup' : 'Buka'}
                          </span>
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full border border-[#E8DDD6] bg-white text-[#2E2E2E] transition-transform duration-300 ${
                              isExpanded ? 'rotate-180 bg-[#5C725A] text-white border-[#5C725A]' : ''
                            }`}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </div>
                      </button>

                      {/* ACCORDION CONTENT (SUB-PAKET LIST) */}
                      {isExpanded && (
                        <div className="border-t border-[#EAE2DC] px-3.5 pb-4 pt-3.5 sm:px-5 sm:pb-5">
                          {/* Garis batas indentasi hierarki level 3 */}
                          <div className="border-l-2 sm:border-l-4 border-[#5C725A] pl-3 sm:pl-4 space-y-3">
                            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#6E856C]">
                              Pilihan Sub-Paket {category.name}
                            </p>

                            <div className="grid grid-cols-1 gap-3">
                              {category.subPackages.map((pkg) => {
                                const isAdded = addedPackageId === pkg.id;

                                return (
                                  <div
                                    key={pkg.id}
                                    className="group relative rounded-xl sm:rounded-2xl border border-[#E8DDD6] bg-white p-3.5 sm:p-4.5 shadow-2xs transition-all duration-200 hover:border-[#5C725A] hover:shadow-md"
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4">
                                      {/* Detail Nama & Fasilitas Paket */}
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <h6 className="font-serif text-base sm:text-lg font-black text-[#2E2E2E]">
                                            {pkg.name}
                                          </h6>
                                          {pkg.badge && (
                                            <span className="rounded-full bg-[#5C725A] text-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider shadow-2xs">
                                              ★ {pkg.badge}
                                            </span>
                                          )}
                                          {pkg.duration && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-[#F2E9E4] text-[#5C725A] px-2 py-0.5 text-[9px] font-mono font-bold">
                                              <Clock className="w-3 h-3" />
                                              <span>{pkg.duration}</span>
                                            </span>
                                          )}
                                        </div>

                                        {/* Daftar Fasilitas / Item yang didapat (Level 3 Items) */}
                                        <div className="mt-2.5 space-y-1.5">
                                          {pkg.features.map((feature, fIdx) => (
                                            <div
                                              key={fIdx}
                                              className="flex items-start gap-2 text-xs sm:text-[13px] font-sans text-stone-700 leading-snug"
                                            >
                                              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#5C725A] mt-0.5" />
                                              <span>{feature}</span>
                                            </div>
                                          ))}
                                        </div>

                                        {pkg.note && (
                                          <p className="mt-2 text-[10px] font-sans italic text-stone-500">
                                            * {pkg.note}
                                          </p>
                                        )}
                                      </div>

                                      {/* Harga & Tombol Tambah ke Keranjang */}
                                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0EBE7] shrink-0">
                                        <div className="text-left sm:text-right">
                                          <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">
                                            Investasi
                                          </span>
                                          <div className="flex items-baseline gap-1">
                                            <span className="text-xs font-mono font-bold text-[#5C725A]">
                                              Rp
                                            </span>
                                            <span className="font-mono text-base sm:text-xl font-black text-[#2E2E2E]">
                                              {pkg.price.toLocaleString('id-ID')}
                                            </span>
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleAddSubPackageToCart(
                                              activeVendor.name,
                                              category.name,
                                              pkg
                                            )
                                          }
                                          className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-serif font-black uppercase tracking-[0.12em] transition-all duration-200 active:scale-95 ${
                                            isAdded
                                              ? 'bg-[#5C725A] text-white shadow-sm'
                                              : 'bg-[#2E2E2E] text-white hover:bg-[#1a1a1a] hover:shadow-md'
                                          }`}
                                        >
                                          {isAdded ? (
                                            <>
                                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                                              <span>Ditambahkan</span>
                                            </>
                                          ) : (
                                            <>
                                              <ShoppingBag className="w-3.5 h-3.5" />
                                              <span>+ Pilih Paket</span>
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* ========================================== */}
        {/* RINGKASAN KERANJANG STICKY (JIKA ADA ITEM DIPILIH) */}
        {/* ========================================== */}
        {cartItems.length > 0 && (
          <div className="sticky bottom-0 z-20 shrink-0 border-t border-[#DDE7DF] bg-[#FDFBF7] px-4 py-3 sm:px-6 shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.15)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5C725A] text-white">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#5C725A]">
                    Keranjang Layanan MUA ({cartItems.length} Layanan)
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-mono font-bold text-stone-500">Total:</span>
                    <span className="font-mono text-base sm:text-lg font-black text-[#2E2E2E]">
                      Rp {muaCartTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGoToCheckout}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-xs sm:text-sm font-serif font-black uppercase tracking-[0.14em] text-white shadow-md hover:bg-[#1ebc5a] transition-all duration-200 active:scale-95"
                >
                  <span>Lanjut ke Checkout Extra</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* MODAL POPUP PREVIEW KEBAYA */}
        {/* ========================================== */}
        {previewImagePopup && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in"
            onClick={() => setPreviewImagePopup(null)}
            role="presentation"
          >
            <div
              className="relative w-full max-w-sm rounded-2xl bg-white p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewImagePopup(null)}
                className="absolute -right-3 -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#2E2E2E] text-white shadow-lg hover:bg-black"
                aria-label="Tutup preview"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={KEBAYA_PREVIEWS[previewImagePopup] || KEBAYA_PREVIEWS.Sage}
                alt={`Preview kebaya warna ${previewImagePopup}`}
                className="max-h-[65vh] w-full rounded-xl object-cover"
              />
              <p className="mt-3 text-center text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#2E2E2E]">
                Preview Kebaya Warna: {previewImagePopup}
              </p>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* FOOTER BAR: KEMBALI KE BERANDA */}
        {/* ========================================== */}
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
      </div>
    </div>
  );
};

export default MUAPricelistModal;
