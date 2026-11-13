import studioConfig from '../data/studioConfig.json';
import { useStudioConfig, formatPriceDisplay, getActiveLabPrintItems, getActiveLabPrintBanner, getActiveFrameItems, getActiveAlbumItems, getActiveCategories, getActivePackages, getActiveDisclaimer } from '../utils/studioConfigManager';
import React, { useState, useMemo, useEffect } from 'react';
import { PRICELIST_SHEETS, PACKAGES, STUDIO_BRANCHES, BACKGROUNDS } from '../data/pricelistData';
import { PricelistSheet, StudioBranch } from '../types';
import {
  ZoomIn, ArrowRight, Layers, Sparkles, X,
  Camera, Calendar, ChevronRight, MessageCircle,
  Instagram, Music2, CheckCircle2, ChevronLeft, Heart, Image as ImageIcon,
  Grid, PhoneCall, GraduationCap, Check, Trees, UserCheck, Users, Home, Cake, Baby, User, Gem, Building2, Mail, Star, Eye, MapPin,
  HelpCircle, ShieldCheck, AlertCircle, FileText, ChevronDown, ChevronUp, BookOpen, Clock, Video
} from 'lucide-react';
import { StudioFacilityGallery } from './StudioFacilityGallery';

interface PricelistViewerProps {
  onSelectPackageForBooking: (packageId: string) => void;
  selectedBranch?: StudioBranch;
  initialTab?: 'menu' | 'gallery' | 'guide';
  initialCategory?: string;
  onOpenBranchModal?: () => void;
  onNavigateToRules?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenBooking?: () => void;
  onBackToLanding?: (targetSectionId?: string) => void;
  onOpenBeautyModal?: () => void;
}

interface StudioGalleryPhoto {
  id: string;
  title: string;
  category: string;
  packageName: string;
  icon: string;
  targetPackageId: string;
  imageUrl: string;
  images?: string[];
  description: string;
  conceptNote: string;
  tags: string[];
}

export const PricelistViewer: React.FC<PricelistViewerProps> = ({
  onSelectPackageForBooking,
  selectedBranch = 'cabang-1',
  initialTab = 'menu',
  initialCategory,
  onOpenBranchModal,
  onNavigateToRules,
  onNavigateToTab,
  onOpenBooking,
  onBackToLanding,
  onOpenBeautyModal
}) => {
  // Helper to normalize category keys
  const normalizeMenuCategory = (cat: string | null | undefined): string => {
    if (!cat) return 'grad-indoor';
    const c = cat.toLowerCase().trim();
    if (c === 'self-studio' || c === 'selfstudio' || c === 'self_studio' || c === 'self-photo' || c === 'selfphoto') {
      return 'selfstudio';
    }
    if (c === 'wedding-package' || c === 'prewed' || c === 'wedding') {
      return 'wedding-package';
    }
    if (c === 'bingkai-album' || c === 'cetak' || c === 'bingkai') {
      return 'bingkai-album';
    }
    if (c === 'graduation-outdoor' || c === 'grad-outdoor' || c === 'wisuda-outdoor') {
      return 'grad-outdoor';
    }
    if (c === 'graduation-indoor' || c === 'grad-indoor' || c === 'graduation' || c === 'wisuda' || c === 'wisuda-indoor' || c === 'wisuda-wisudawan') {
      return 'grad-indoor';
    }
    if (c === 'kebaya-gaun' || c === 'kebayak-gaun') {
      return 'kebayak-gaun';
    }
    if (c === 'birthday' || c === 'event') {
      return 'event';
    }
    if (c === 'group' || c === 'group-paket') {
      return 'group-paket';
    }
    if (c === 'family' || c === 'family-paket') {
      return 'family-paket';
    }
    if (c === 'couple' || c === 'couple-paket') {
      return 'couple-paket';
    }
    if (c === 'personal' || c === 'personal-paket') {
      return 'personal-paket';
    }
    if (c === 'maternity' || c === 'maternity-paket') {
      return 'maternity-paket';
    }
    if (c === 'undangan' || c === 'undangan-paket') {
      return 'undangan-paket';
    }
    return cat;
  };

  const studioConfig = useStudioConfig();
  const studioPackagesList = useMemo(() => {
    const sp = ((studioConfig as any)?.studioPackages || (studioConfig as any)?.indoorPackages || []) as any[];
    const bp = ((studioConfig as any)?.bundlingPackages || []) as any[];
    const op = ((studioConfig as any)?.outdoorPackages || []) as any[];

    const map = new Map<string, any>();
    PACKAGES.forEach((p) => {
      if (p && p.id) map.set(p.id, p);
    });
    [...sp, ...bp, ...op].forEach((p: any) => {
      if (p && p.id) {
        const existing = map.get(p.id) || {};
        map.set(p.id, { ...existing, ...p });
      }
    });
    return Array.from(map.values());
  }, [studioConfig]);

  const renderPackageFacilityIcon = (iconStr?: string, labelOrText?: string) => {
    const lbl = (labelOrText || '').toLowerCase();
    const ic = (iconStr || '').trim();

    if (lbl.includes('waktu') || lbl.includes('durasi') || lbl.includes('menit') || ic.includes('⏰') || ic.includes('⏱️')) {
      return <Clock className="w-4 h-4 text-[#5C725A] shrink-0" />;
    }
    if (lbl.includes('background') || lbl.includes('latar') || ic.includes('✨') || ic.includes('🌟')) {
      return <Sparkles className="w-4 h-4 text-[#8A5A36] shrink-0" />;
    }
    if (lbl.includes('outdoor') || lbl.includes('kampus') || lbl.includes('lokasi') || ic.includes('🌳') || ic.includes('🌲')) {
      return <Trees className="w-4 h-4 text-[#5C725A] shrink-0" />;
    }
    if (lbl.includes('indoor') || lbl.includes('studio') || ic.includes('🏛️') || ic.includes('🏢')) {
      return <Building2 className="w-4 h-4 text-[#5C725A] shrink-0" />;
    }
    if (lbl.includes('transport') || ic.includes('🚗') || ic.includes('🚕')) {
      return <Trees className="w-4 h-4 text-[#5C725A] shrink-0" />;
    }
    if (lbl.includes('cetak') || lbl.includes('print') || lbl.includes('bingkai') || ic.includes('🖼️') || ic.includes('📸')) {
      return <ImageIcon className="w-4 h-4 text-[#5C725A] shrink-0" />;
    }
    if (lbl.includes('kapasitas') || lbl.includes('orang') || lbl.includes('wisudawan') || ic.includes('👥') || ic.includes('👤')) {
      return <Users className="w-4 h-4 text-[#5C725A] shrink-0" />;
    }
    if (lbl.includes('edit') || ic.includes('✏️') || ic.includes('🖊️')) {
      return <CheckCircle2 className="w-4 h-4 text-[#5C725A] shrink-0" />;
    }
    if (lbl.includes('video') || lbl.includes('reels') || ic.includes('🎬') || ic.includes('📹') || ic.includes('🎥')) {
      return <Video className="w-4 h-4 text-[#8A5A36] shrink-0" />;
    }
    if (lbl.includes('file') || lbl.includes('softfile') || lbl.includes('drive') || ic.includes('📁') || ic.includes('💾')) {
      return <Check className="w-4 h-4 text-[#5C725A] shrink-0" />;
    }
    if (ic && /[p{Emoji} -㌀]/u.test(ic)) {
      return <span className="text-sm shrink-0 leading-none">{ic}</span>;
    }
    return <Check className="w-4 h-4 text-[#5C725A] shrink-0" />;
  };

  const getPkg = (pkgId: string, fallback?: any) => {
    const found = studioPackagesList.find((p: any) => p.id === pkgId);
    if (found) return found;
    const staticFound = PACKAGES.find(p => p.id === pkgId);
    return staticFound || fallback || {};
  };

  const getPkgPrice = (pkgId: string, fallbackPrice = ''): string => {
    const pkg = getPkg(pkgId);
    if (!pkg) return fallbackPrice;
    if (pkg.price) {
      return formatPriceDisplay(pkg.price, fallbackPrice);
    }
    return fallbackPrice;
  };

  const getPkgOriginalPrice = (pkgId: string, fallback = ''): string => {
    const pkg = getPkg(pkgId);
    if (pkg && pkg.originalPrice) {
      return formatPriceDisplay(pkg.originalPrice, fallback);
    }
    return fallback;
  };

  const getPkgName = (pkgId: string, fallback = ''): string => {
    const pkg = getPkg(pkgId);
    return (pkg && pkg.name) ? pkg.name : fallback;
  };

  const getAddOnPriceDisplay = (keywordOrId: string, fallback = ''): string => {
    const addOns = ((studioConfig as any)?.addOns as any[]) || [];
    const found = addOns.find((a: any) => 
      a && (
        a.id === keywordOrId || 
        (typeof a.id === 'string' && a.id.includes(keywordOrId)) || 
        (typeof a.name === 'string' && a.name.toLowerCase().includes(keywordOrId.toLowerCase()))
      )
    );
    if (found && found.price) {
      return formatPriceDisplay(found.price, fallback);
    }
    return fallback;
  };

  const branches: any[] = (studioConfig?.branches && Array.isArray(studioConfig.branches)) ? studioConfig.branches : STUDIO_BRANCHES;
  const currentBranchInfo = branches.find((b: any) => b.id === selectedBranch) || branches[0];

  const packageImageMap = useMemo(() => {
    const map: Record<string, string> = {};
    const pkgs = (((studioConfig as any)?.studioPackages || (studioConfig as any)?.indoorPackages || []) as any[]);
    pkgs.forEach((p: any) => {
      if (p.id && p.imageUrl) {
        map[p.id] = p.imageUrl;
      }
    });
    return map;
  }, [studioConfig]);
  // Mode: 'menu' (Figma Bio-Link Style), 'gallery' (Fasilitas Studio), or 'guide' (Panduan, Disclaimer & FAQ)
  const [activeTab, setActiveTab] = useState<'menu' | 'gallery' | 'guide'>(initialTab);
  const isTabActive = (tab: 'menu' | 'gallery' | 'guide') => activeTab === tab;
  const handleGoToDisclaimer = () => {
    setActiveTab('guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [activeMenuCategory, setActiveMenuCategory] = useState<string | null>(normalizeMenuCategory(initialCategory));
  const [isStudioFotoSubmenuOpen, setIsStudioFotoSubmenuOpen] = useState<boolean>(false);
  const [selfStudioSubTab, setSelfStudioSubTab] = useState<'all' | 'special' | 'normal' | 'spotlight' | 'grid'>('all');
  const [selectedGridFilter, setSelectedGridFilter] = useState<'all' | 'grid-1' | 'grid-3' | 'grid-4' | 'grid-6'>('all');
  const [selectedKebayaFilter, setSelectedKebayaFilter] = useState<'all' | 'adat' | 'modern' | 'gaun'>('all');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);

  // Koleksi Kebaya & Gaun Dinamis dari Dashboard MUA Vendors
  const dynamicKebayas = useMemo(() => {
    const vendors = ((studioConfig as any)?.muaVendors || []) as any[];
    const extracted = vendors.flatMap((v: any) =>
      (v.kebayas || []).map((k: any) => ({
        ...k,
        vendorName: v.name || 'Alviero Studio',
        vendorId: v.id || 'novita'
      }))
    );
    if (extracted.length > 0) return extracted;

    // Fallback warna resmi studio jika data vendor belum diisi
    return [
      { id: 'kebaya-sage', name: 'Sage Green', hex: '#8FA38D', tag: 'Best Seller Wisuda', desc: 'Hijau sage pastel redup berpadu brokat payet halus timbul. Sangat fotogenik di studio foto dan menjadi warna terfavorit para wisudawati.', sizes: ['S', 'M', 'L', 'XL', 'XXL'], totalStock: 12, vendorName: 'Alviero Wardrobe' },
      { id: 'kebaya-nude', name: 'Nude Cream', hex: '#D8B89E', tag: 'Warm Natural', desc: 'Nuansa krem nude hangat yang menyatu lembut dengan warna kulit alami. Memberi kesan anggun, bersih, dan memancarkan aura natural.', sizes: ['S', 'M', 'L', 'XL', 'XXL'], totalStock: 10, vendorName: 'Alviero Wardrobe' },
      { id: 'kebaya-maroon', name: 'Maroon Bold', hex: '#7A1C29', tag: 'Bold Elegance', desc: 'Merah maroon anggun berkarakter mewah. Pilihan sempurna untuk sesi foto wisuda resmi, lamaran, maupun foto keluarga.', sizes: ['S', 'M', 'L', 'XL', 'XXL'], totalStock: 8, vendorName: 'Alviero Wardrobe' },
      { id: 'kebaya-navy', name: 'Navy Blue', hex: '#1D2A44', tag: 'Exclusive Modern', desc: 'Biru navy tua berkilau payet kristal mewah. Kontras sangat tajam dan memukau di bawah pencahayaan softbox studio.', sizes: ['S', 'M', 'L', 'XL', 'XXL'], totalStock: 8, vendorName: 'Alviero Wardrobe' },
      { id: 'kebaya-black', name: 'Black Royal', hex: '#242424', tag: 'Royal Classic', desc: 'Hitam elegan mewah klasik dengan aksen payet berkilau. Memberikan efek siluet tubuh yang ramping, tegas, dan berwibawa.', sizes: ['S', 'M', 'L', 'XL', 'XXL'], totalStock: 6, vendorName: 'Alviero Wardrobe' },
      { id: 'kebaya-gold', name: 'Champagne Gold', hex: '#C8A34A', tag: 'Glamour Luxury', desc: 'Kuning keemasan berpayet timbul premium. Memancarkan aura megah, cerah, dan berkelas khas pesta formal.', sizes: ['S', 'M', 'L', 'XL', 'XXL'], totalStock: 6, vendorName: 'Alviero Wardrobe' },
      { id: 'kebaya-silver', name: 'Silver Lilac', hex: '#B8BAC2', tag: 'Chic Futuristic', desc: 'Abu-abu perak berkilau dingin yang modern dan bersih. Tampil sangat modis dan kekinian untuk konsep wisuda minimalis.', sizes: ['S', 'M', 'L', 'XL', 'XXL'], totalStock: 8, vendorName: 'Alviero Wardrobe' },
      { id: 'kebaya-dusty-pink', name: 'Dusty Pink', hex: '#DDA7A5', tag: 'Sweet Feminine', desc: 'Merah muda dusty lembut feminin yang memancarkan pesona manis, muda, dan ceria.', sizes: ['S', 'M', 'L', 'XL', 'XXL'], totalStock: 7, vendorName: 'Alviero Wardrobe' }
    ];
  }, [studioConfig]);

  const defaultLabPrintItems = [
    { code: '4R', size: '10.2 cm x 15.2 cm', price: '5K', note: 'Standar Foto Album' },
    { code: '5R', size: '12.7 cm x 17.8 cm', price: '8K', note: 'Sedang Meja' },
    { code: '6R', size: '15.2 cm x 20.3 cm', price: '9K', note: 'Meja Kantor' },
    { code: '10Rs', size: '20.3 cm x 30.5 cm', price: '16K', note: 'Favorit Pigura Meja/Dinding' },
    { code: '12Rs', size: '30.5 cm x 45 cm', price: '52K', note: 'Dinding Kamar' },
    { code: '16Rs', size: '40 cm x 60 cm', price: '102K', note: 'Dinding Ruang Tamu' },
    { code: '20Rs', size: '50 cm x 75 cm', price: '137K', note: 'Wisuda & Prewed Besar' },
    { code: '24Rs', size: '60 cm x 90 cm', price: '172K', note: 'Jumbo Pigura Utama' },
    { code: 'Pass 2x3', size: 'Paket 6 foto', price: '8K', note: 'Dokumen / Ijazah' },
    { code: 'Pass 3x3', size: 'Paket 6 foto', price: '8K', note: 'Dokumen' },
    { code: 'Pass 3x4', size: 'Paket 6 foto', price: '8K', note: 'Buku Nikah / Ijazah' },
    { code: 'Pass 4x6', size: 'Paket 4 foto', price: '8K', note: 'Paspor / Lamaran Kerja' },
  ];

  const defaultFrameItems = [
    {
      code: '4R',
      size: '15 X 20 CM',
      price: '17K',
      type: 'Bingkai Meja / Minimalis',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      desc: 'Cocok untuk meja belajar, nakas kamar tidur, dan kado wisuda'
    },
    {
      code: '10Rs',
      size: '40 X 50 CM',
      price: '35K',
      type: 'Bingkai Dinding Sedang',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      desc: 'Ukuran paling diminati untuk foto wisuda keluarga & portrait'
    },
    {
      code: '12Rs',
      size: '50 X 60 CM',
      price: '50K',
      type: 'Bingkai Dinding Populer',
      image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=600&q=80',
      desc: 'Sangat pas untuk foto wisuda sarjana & foto couple ruang tamu'
    },
    {
      code: '16Rs',
      size: '60 X 70 CM',
      price: '145K',
      type: 'Bingkai Dinding Eksklusif',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      desc: 'Tampilan megah dengan list linen ganda untuk foto keluarga'
    },
    {
      code: '20Rs',
      size: '70 X 90 CM',
      price: '175K',
      type: 'Bingkai Dinding Jumbo',
      image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80',
      desc: 'Sempurna untuk foto prewedding utama & foto keluarga besar'
    },
    {
      code: '24Rs',
      size: '90 X 120 CM',
      price: '230K',
      type: 'Bingkai Dinding Masterpiece',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      desc: 'Ukuran kanvas/pigura terbesar untuk background ruang utama'
    }
  ];

  const defaultAlbumItems = [
    {
      id: 'album-1',
      name: 'ALBUM 4R BIASA',
      capacity: 'ISI 40 FOTO',
      price: '25K',
      badge: 'Ekonomis',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      active: true
    },
    {
      id: 'album-2',
      name: 'ALBUM LULU 4R',
      capacity: 'ISI 100 FOTO',
      price: '45,5K',
      badge: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
      active: true
    },
    {
      id: 'album-3',
      name: 'ALBUM DLK 4R',
      capacity: 'ISI 40 FOTO',
      price: '70K',
      badge: 'Hardcover',
      image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=400&q=80',
      active: true
    },
    {
      id: 'album-4',
      name: 'ALBUM DLB 4R',
      capacity: 'ISI 60 FOTO',
      price: '75K',
      badge: 'Hardcover',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
      active: true
    },
    {
      id: 'album-5',
      name: 'ALBUM MBT 4R',
      capacity: 'ISI 80 FOTO',
      price: '83K',
      badge: 'Eksklusif',
      image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=400&q=80',
      active: true
    },
    {
      id: 'album-6',
      name: 'ALBUM MBT 4R',
      capacity: 'ISI 120 FOTO',
      price: '104K',
      badge: 'Eksklusif',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
      active: true
    },
    {
      id: 'album-7',
      name: 'ALBUM JUMBO 4R',
      capacity: 'ISI 120 FOTO',
      price: '93K',
      badge: 'Jumbo',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
      active: true
    },
    {
      id: 'album-8',
      name: 'ALBUM JUMBO 4R',
      capacity: 'ISI 160 FOTO',
      price: '116K',
      badge: 'Kapasitas Max',
      image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=400&q=80',
      active: true
    }
  ];

  const activeLabPrintItems = useMemo(() => {
    const items = getActiveLabPrintItems(studioConfig, defaultLabPrintItems);
    return items.map((i: any) => ({
      ...i,
      price: i.priceDisplay || (typeof i.price === 'number' ? formatPriceDisplay(i.price) : i.price)
    }));
  }, [studioConfig]);

  const labPrintBannerImage = useMemo(() => {
    return getActiveLabPrintBanner(studioConfig);
  }, [studioConfig]);

  const activeFrameItems = useMemo(() => {
    const items = getActiveFrameItems(studioConfig, defaultFrameItems);
    return items.map((i: any) => ({
      ...i,
      price: i.priceDisplay || (typeof i.price === 'number' ? formatPriceDisplay(i.price) : i.price)
    }));
  }, [studioConfig]);

  const activeAlbumItems = useMemo(() => {
    const items = getActiveAlbumItems(studioConfig, defaultAlbumItems);
    return items.map((i: any) => ({
      ...i,
      price: i.priceDisplay || (typeof i.price === 'number' ? formatPriceDisplay(i.price) : i.price)
    }));
  }, [studioConfig]);

  const activeDisclaimer = useMemo(() => getActiveDisclaimer(studioConfig), [studioConfig]);

  const [selectedBingkaiSubTab, setSelectedBingkaiSubTab] = useState<'all' | 'cetak' | 'bingkai' | 'album'>('all');
  const [selectedGradSubTab, setSelectedGradSubTab] = useState<'all' | 'indoor' | 'bundling' | 'outdoor' | 'additional'>('all');
  const [selectedPrewedSubTab, setSelectedPrewedSubTab] = useState<'all' | 'studio' | 'bundling'>('all');
  const [selectedGroupSubTab, setSelectedGroupSubTab] = useState<'all' | 'small' | 'large'>('all');
  const [selectedBirthdaySubTab, setSelectedBirthdaySubTab] = useState<'all' | 'sweet' | 'spotlight'>('all');
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState<boolean>(!!initialCategory);

  const handleClosePopup = () => {
    setIsMobilePopupOpen(false);
    setPreviewPhotoIndex(null);
  };

  // Sync initialCategory if changed
  React.useEffect(() => {
    if (initialCategory) {
      const normalized = normalizeMenuCategory(initialCategory);
      setActiveMenuCategory(normalized);
      setIsMobilePopupOpen(true);
    }
  }, [initialCategory]);

  // Auto-select tab Outdoor saat menu Grad Outdoor dibuka
  React.useEffect(() => {
    if (activeMenuCategory === 'grad-outdoor') {
      setSelectedGradSubTab('outdoor');
    }
  }, [activeMenuCategory]);

  // Gallery Tab State & Modal Swipe
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('all');
  const [activeModalPhoto, setActiveModalPhoto] = useState<StudioGalleryPhoto | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);
  const touchModalStartX = React.useRef<number | null>(null);
  const touchModalEndX = React.useRef<number | null>(null);
  const [activeModalSheet, setActiveModalSheet] = useState<PricelistSheet | null>(null);

  // State modal preview foto hasil paket (lightbox foto inspirasi)
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState<number | null>(null);
  const touchPreviewStartX = React.useRef<number | null>(null);
  const touchPreviewEndX = React.useRef<number | null>(null);

  // 1. Menu Utama (Fokus Layanan Studio Cabang yang Dipilih)
  const mainMenuButtons = [
    {
      id: 'selfstudio',
      title: 'PRICELIST SELFSTUDIO',
      subtitle: 'Special Narsis, Normal Narsis & Spotlight (Studio 1 & 2)',
      icon: '✨',
      sheetCategory: 'Pricelist Selfstudio',
      badge: 'Best Seller',
      specialView: 'selfstudio-special',
      isSubmenuTrigger: false,
      cardBg: 'bg-[#f0f8f3]',
      cardBorder: 'border-[#c5e4cf]',
      hoverBorder: 'hover:border-[#4d7557]',
      iconBg: 'bg-[#d3ede0]',
      iconText: 'text-[#204e2e]',
      badgeBg: 'bg-[#d3ede0]',
      badgeText: 'text-[#204e2e]',
      badgeBorder: 'border-[#b0dac0]',
      btnText: 'text-[#204e2e]',
      targetPackageIds: [
        'self-special-narsis', 'self-special-super-narsis', 'self-normal-narsis',
        'self-normal-super-narsis', 'self-special-spotlight', 'self-normal-spotlight'
      ]
    },
    {
      id: 'studio-foto',
      title: 'PRICELIST STUDIO FOTO',
      subtitle: 'Undangan, Sewa Studio, Prewedd, Couple, Family, Wisuda, dll',
      icon: '📸',
      sheetCategory: 'Paket Personal',
      badge: '12 Paket ➔',
      specialView: 'studio-foto-hub',
      isSubmenuTrigger: true,
      cardBg: 'bg-[#f5f2fc]',
      cardBorder: 'border-[#dbd1f6]',
      hoverBorder: 'hover:border-[#6f56b5]',
      iconBg: 'bg-[#e6deff]',
      iconText: 'text-[#47367c]',
      badgeBg: 'bg-[#e6deff]',
      badgeText: 'text-[#47367c]',
      badgeBorder: 'border-[#ccbef2]',
      btnText: 'text-[#47367c]',
      targetPackageIds: [
        'personal-bold-statement', 'personal-opulent-shot'
      ]
    },
    {
      id: 'kebayak-gaun',
      title: 'PRICELIST KEBAYAK DAN GAUN',
      subtitle: 'Sewa Wardrobe Wisuda, Kebaya Modern & Gaun Foto',
      icon: '👗',
      sheetCategory: 'Paket Wisuda Outdoor',
      badge: 'Wardrobe',
      specialView: 'kebayak-gaun-view',
      isSubmenuTrigger: false,
      cardBg: 'bg-[#fdf1f6]',
      cardBorder: 'border-[#f5ccdc]',
      hoverBorder: 'hover:border-[#b04a79]',
      iconBg: 'bg-[#fbe0ec]',
      iconText: 'text-[#7d3254]',
      badgeBg: 'bg-[#fbe0ec]',
      badgeText: 'text-[#7d3254]',
      badgeBorder: 'border-[#eeb7cc]',
      btnText: 'text-[#7d3254]',
      targetPackageIds: [
        'grad-outdoor-smart-30', 'grad-outdoor-smart-60', 'grad-outdoor-cumlaude'
      ]
    }
  ];

  // 2. Submenu Studio Foto (12 Sub-Paket dengan Ragam Warna Pastel Harmonis Sesuai Urutan Resmi)
  const studioFotoSubButtons = [
    {
      id: 'grad-indoor',
      title: 'PRICELIST GRADUATION INDOOR & OUTDOOR',
      subtitle: 'Paket Indoor, Outdoor & Bundling Graduation',
      icon: '🎓',
      sheetCategory: 'Graduation',
      badge: 'Wisuda Indoor & Outdoor',
      specialView: 'grad-indoor',
      cardBg: 'bg-[#f3f3fd]',
      cardBorder: 'border-[#d6d6f9]',
      hoverBorder: 'hover:border-[#6666d6]',
      iconBg: 'bg-[#e4e4fc]',
      iconText: 'text-[#36369c]',
      badgeBg: 'bg-[#e4e4fc]',
      badgeText: 'text-[#36369c]',
      badgeBorder: 'border-[#c2c2f7]',
      targetPackageIds: [
        'grad-indoor-elegant-scholar', 'grad-indoor-supreme-scholar', 'grad-indoor-infinity-scholar',
        'grad-bundling-ultimate-1', 'grad-bundling-ultimate-2',
        'grad-outdoor-smart-30', 'grad-outdoor-smart-60', 'grad-outdoor-cumlaude',
        'grad-outdoor-group-2', 'grad-outdoor-group-3', 'grad-outdoor-group-4-5'
      ]
    },
    {
      id: 'grad-outdoor',
      title: 'PRICELIST WISUDA OUTDOOR',
      subtitle: 'Smart Outdoor 30M/60M, Cumlaude Video & Group Outdoor',
      icon: '🌳',
      sheetCategory: 'Wisuda Outdoor',
      badge: 'Outdoor Kampus',
      specialView: 'grad-outdoor',
      cardBg: 'bg-[#f0f7f1]',
      cardBorder: 'border-[#cde4d1]',
      hoverBorder: 'hover:border-[#527d56]',
      iconBg: 'bg-[#e4f1e6]',
      iconText: 'text-[#2d5a32]',
      badgeBg: 'bg-[#e4f1e6]',
      badgeText: 'text-[#2d5a32]',
      badgeBorder: 'border-[#c1ddc6]',
      targetPackageIds: [
        'grad-outdoor-smart-30', 'grad-outdoor-smart-60', 'grad-outdoor-cumlaude',
        'grad-outdoor-group-2', 'grad-outdoor-group-3', 'grad-outdoor-group-4-5'
      ]
    },
    {
      id: 'group-paket',
      title: 'PRICELIST GROUP',
      subtitle: 'Friendly Frame, Signature, Royal & Imperial (3-75 Org)',
      icon: '👥',
      sheetCategory: 'Paket Group',
      badge: 'Rombongan',
      specialView: 'group-paket',
      cardBg: 'bg-[#f0f4fc]',
      cardBorder: 'border-[#d0ddf7]',
      hoverBorder: 'hover:border-[#4d7ad0]',
      iconBg: 'bg-[#dfebfc]',
      iconText: 'text-[#244983]',
      badgeBg: 'bg-[#dfebfc]',
      badgeText: 'text-[#244983]',
      badgeBorder: 'border-[#bed3f5]',
      targetPackageIds: [
        'group-friendly-frame', 'group-signature-squad', 'group-royal-ensemble', 'group-imperial-union'
      ]
    },
    {
      id: 'family-paket',
      title: 'PRICELIST FAMILY',
      subtitle: 'Sweet Together & Happy Nest (Maks 10 Orang)',
      icon: '👨‍👩‍👧‍👦',
      sheetCategory: 'Paket Family',
      badge: 'Hangat & Ceria',
      specialView: 'family-paket',
      cardBg: 'bg-[#f5f8ee]',
      cardBorder: 'border-[#dbe6c5]',
      hoverBorder: 'hover:border-[#6f8c3d]',
      iconBg: 'bg-[#eaf1dc]',
      iconText: 'text-[#435722]',
      badgeBg: 'bg-[#eaf1dc]',
      badgeText: 'text-[#435722]',
      badgeBorder: 'border-[#ccdcab]',
      targetPackageIds: [
        'family-sweet-together', 'family-happy-nest'
      ]
    },
    {
      id: 'maternity-paket',
      title: 'PRICELIST MATERNITY',
      subtitle: 'Warm Embrace & Golden Motherhood',
      icon: '🤰',
      sheetCategory: 'Paket Maternity',
      badge: 'Bunda & Bayi',
      specialView: 'maternity-paket',
      cardBg: 'bg-[#fdf5ee]',
      cardBorder: 'border-[#f8dac3]',
      hoverBorder: 'hover:border-[#b86f3b]',
      iconBg: 'bg-[#fae6d7]',
      iconText: 'text-[#82471d]',
      badgeBg: 'bg-[#fae6d7]',
      badgeText: 'text-[#82471d]',
      badgeBorder: 'border-[#f0c7ab]',
      targetPackageIds: [
        'maternity-warm-embrace', 'maternity-golden-motherhood'
      ]
    },
    {
      id: 'personal-paket',
      title: 'PRICELIST PERSONAL',
      subtitle: 'Bold Statement & Opulent Shot (Solo / Portofolio)',
      icon: '👤',
      sheetCategory: 'Paket Personal',
      badge: 'Favorit Solo',
      specialView: 'personal-paket',
      cardBg: 'bg-[#f4f5f7]',
      cardBorder: 'border-[#d8dce2]',
      hoverBorder: 'hover:border-[#64748b]',
      iconBg: 'bg-[#e6e9ef]',
      iconText: 'text-[#333e4d]',
      badgeBg: 'bg-[#e6e9ef]',
      badgeText: 'text-[#333e4d]',
      badgeBorder: 'border-[#c7ced9]',
      targetPackageIds: [
        'personal-bold-statement', 'personal-opulent-shot'
      ]
    },
    {
      id: 'couple-paket',
      title: 'PRICELIST COUPLE',
      subtitle: 'Eternal Love & Sweet Memories (Pasangan Romantis)',
      icon: '💑',
      sheetCategory: 'Paket Couple',
      badge: 'Romantis',
      specialView: 'couple-paket',
      cardBg: 'bg-[#fdf3f3]',
      cardBorder: 'border-[#f9d6d6]',
      hoverBorder: 'hover:border-[#b85858]',
      iconBg: 'bg-[#fde3e3]',
      iconText: 'text-[#822f2f]',
      badgeBg: 'bg-[#fde3e3]',
      badgeText: 'text-[#822f2f]',
      badgeBorder: 'border-[#f2bebe]',
      targetPackageIds: [
        'couple-eternal-love', 'couple-sweet-memories'
      ]
    },
    {
      id: 'event',
      title: 'PRICELIST BIRTHDAY',
      subtitle: 'Sweet Celebration, Glow, Sweet Light & Ultimate',
      icon: '🎉',
      sheetCategory: 'Paket Birthday',
      badge: 'Birthday Hot',
      specialView: 'birthday-paket',
      cardBg: 'bg-[#fefbe8]',
      cardBorder: 'border-[#f8f0ab]',
      hoverBorder: 'hover:border-[#a89622]',
      iconBg: 'bg-[#fbf5be]',
      iconText: 'text-[#73630f]',
      badgeBg: 'bg-[#fbf5be]',
      badgeText: 'text-[#73630f]',
      badgeBorder: 'border-[#edd968]',
      targetPackageIds: [
        'birthday-sweet-celebration', 'birthday-glow-sweet', 'birthday-sweet-light', 'birthday-ultimate-sweet-light'
      ]
    },
    {
      id: 'undangan-paket',
      title: 'PRICELIST UNDANGAN',
      subtitle: 'Paket Undangan 1 (95K) & Paket Undangan 2 (155K)',
      icon: '💌',
      sheetCategory: 'Paket Undangan',
      badge: 'Hemat & Praktis',
      specialView: 'undangan-paket',
      cardBg: 'bg-[#fdf9ee]',
      cardBorder: 'border-[#f6e9c1]',
      hoverBorder: 'hover:border-[#caa33f]',
      iconBg: 'bg-[#faefcb]',
      iconText: 'text-[#735515]',
      badgeBg: 'bg-[#faefcb]',
      badgeText: 'text-[#735515]',
      badgeBorder: 'border-[#ebd696]',
      targetPackageIds: [
        'undangan-paket-1', 'undangan-paket-2'
      ]
    },
    {
      id: 'prewed-paket',
      title: 'PRICELIST PREWEDD',
      subtitle: 'Sweet Promise, Velvet Romance & Bundling 1-2',
      icon: '💍',
      sheetCategory: 'Paket Prewedding',
      badge: 'Prewed Hot',
      specialView: 'prewed-paket',
      cardBg: 'bg-[#f9f2f8]',
      cardBorder: 'border-[#ecd4ea]',
      hoverBorder: 'hover:border-[#9c5999]',
      iconBg: 'bg-[#f3e1f2]',
      iconText: 'text-[#6b3169]',
      badgeBg: 'bg-[#f3e1f2]',
      badgeText: 'text-[#6b3169]',
      badgeBorder: 'border-[#e2bedf]',
      targetPackageIds: [
        'prewed-sweet-promise', 'prewed-velvet-romance', 'prewed-bundling-1', 'prewed-bundling-2'
      ]
    },
    {
      id: 'pass-foto',
      title: 'PRICELIST PASS FOTO',
      subtitle: 'Paket 1, Paket 2 & Paket Nikah 2 Orang',
      icon: '👤',
      sheetCategory: 'Paket Pass Foto',
      badge: 'Kilat & Resmi',
      specialView: 'pass-foto',
      cardBg: 'bg-[#ecf9f5]',
      cardBorder: 'border-[#beece0]',
      hoverBorder: 'hover:border-[#389e87]',
      iconBg: 'bg-[#d2f3eb]',
      iconText: 'text-[#175f4e]',
      badgeBg: 'bg-[#d2f3eb]',
      badgeText: 'text-[#175f4e]',
      badgeBorder: 'border-[#a4e2d2]',
      targetPackageIds: [
        'passfoto-1', 'passfoto-2', 'passfoto-3'
      ]
    },
    {
      id: 'sewa-studio',
      title: 'PRICELIST SEWA STUDIO',
      subtitle: '2 Background, Maks 60 Menit, 2 Lighting & Trigger',
      icon: '🏢',
      sheetCategory: 'Sewa Studio',
      badge: 'Rental 175K',
      specialView: 'sewa-studio',
      cardBg: 'bg-[#eff7f8]',
      cardBorder: 'border-[#cee6e8]',
      hoverBorder: 'hover:border-[#4d979e]',
      iconBg: 'bg-[#d9eff1]',
      iconText: 'text-[#1f575c]',
      badgeBg: 'bg-[#d9eff1]',
      badgeText: 'text-[#1f575c]',
      badgeBorder: 'border-[#b8dfe2]',
      targetPackageIds: [
        'sewa-studio-hourly'
      ]
    }
  ];

  const additionalMenuButtons = [
    {
      id: 'wedding-package',
      title: 'PRICELIST WEDDING',
      subtitle: 'Prewedding, Akad, Resepsi & Engagement',
      icon: '💍',
      sheetCategory: 'Paket Prewedding',
      badge: 'Exclusive',
      specialView: 'wedding-package',
      cardBg: 'bg-[#CBA3A1]',
      cardBorder: 'border-[#BE9593]',
      hoverBorder: 'hover:border-[#A87D7C]',
      iconBg: 'bg-white',
      iconText: 'text-[#2E1E21]',
      badgeBg: 'bg-white/40',
      badgeText: 'text-[#2E1E21]',
      badgeBorder: 'border-white/50',
      btnText: 'text-[#2E1E21]',
      targetPackageIds: ['prewed-bundling-1', 'prewed-bundling-2']
    },
    {
      id: 'bingkai-album',
      title: 'PRICELIST CETAK',
      subtitle: 'Cetak Lab, Bingkai Minimalis & Album Eksklusif',
      icon: '🖼️',
      sheetCategory: 'Cetak & Frame',
      badge: 'Cetak Lab',
      specialView: 'bingkai-album',
      cardBg: 'bg-[#8DA4B8]',
      cardBorder: 'border-[#7E96AA]',
      hoverBorder: 'hover:border-[#6A8499]',
      iconBg: 'bg-white',
      iconText: 'text-[#152330]',
      badgeBg: 'bg-white/40',
      badgeText: 'text-[#152330]',
      badgeBorder: 'border-white/50',
      btnText: 'text-[#152330]',
      targetPackageIds: []
    }
  ];

  const allCategoryButtons = useMemo(() => {
    return getActiveCategories(studioConfig, [...mainMenuButtons, ...studioFotoSubButtons, ...additionalMenuButtons]);
  }, [studioConfig]);

  // Grid Category Arrays (Sesuai Urutan 12 Paket Utama Photo Studio)
  const defaultPhotoStudioGridItems = [
    { id: 'grad-indoor', name: 'Graduation', icon: '🎓', img: '/images/categories/graduation.jpg', colorBg: 'bg-[#f3f3fd]', colorBorder: 'border-[#d6d6f9]', colorText: 'text-[#36369c]' },
    { id: 'grad-outdoor', name: 'Grad Outdoor', icon: '🌳', img: '/images/categories/grad-outdoor.jpg', colorBg: 'bg-[#f0f7f1]', colorBorder: 'border-[#cde4d1]', colorText: 'text-[#2d5a32]' },
    { id: 'group-paket', name: 'Group', icon: '👥', img: '/images/categories/group.jpg', colorBg: 'bg-[#f0f4fc]', colorBorder: 'border-[#d0ddf7]', colorText: 'text-[#244983]' },
    { id: 'family-paket', name: 'Family', icon: '👨‍👩‍👧‍👦', img: '/images/categories/family.jpg', colorBg: 'bg-[#f5f8ee]', colorBorder: 'border-[#dae6c6]', colorText: 'text-[#435722]' },
    { id: 'maternity-paket', name: 'Maternity', icon: '🤰', img: '/images/categories/maternity.jpg', colorBg: 'bg-[#fdf5ee]', colorBorder: 'border-[#f8dac3]', colorText: 'text-[#82471d]' },
    { id: 'personal-paket', name: 'Personal', icon: '👩‍💼', img: '/images/categories/personal.jpg', colorBg: 'bg-[#eef8f5]', colorBorder: 'border-[#c2ece0]', colorText: 'text-[#186b57]' },
    { id: 'couple-paket', name: 'Couple', icon: '💑', img: '/images/categories/couple.jpg', colorBg: 'bg-[#fdf3f3]', colorBorder: 'border-[#f8d4d4]', colorText: 'text-[#822f2f]' },
    { id: 'event', name: 'Birthday', icon: '🎂', img: '/images/categories/birthday.jpg', colorBg: 'bg-[#fefbe8]', colorBorder: 'border-[#f8f0ab]', colorText: 'text-[#73630f]' },
    { id: 'undangan-paket', name: 'Undangan', icon: '💌', colorBg: 'bg-[#fdf9ee]', colorBorder: 'border-[#f6e9c1]', colorText: 'text-[#735515]' },
    { id: 'prewed-paket', name: 'Prewedding', icon: '💍', img: '/images/categories/prewedding.jpg', colorBg: 'bg-[#f9f2f8]', colorBorder: 'border-[#ecd4ea]', colorText: 'text-[#6b3169]' },
    { id: 'pass-foto', name: 'Pass photo', icon: '🪪', colorBg: 'bg-[#ecf9f5]', colorBorder: 'border-[#beece0]', colorText: 'text-[#175f4e]' },
    { id: 'sewa-studio', name: 'Sewa Studio', icon: '🏛️', img: '/images/categories/sewa-studio.jpg', colorBg: 'bg-[#eff7f8]', colorBorder: 'border-[#cee6e8]', colorText: 'text-[#1f575c]' }
  ];

  const photoStudioGridItems = useMemo(() => {
    const raw = getActiveCategories(studioConfig, defaultPhotoStudioGridItems);
    return raw.filter((c: any) => c && c.id !== 'selfstudio' && c.id !== 'self-studio' && c.id !== 'selfphoto');
  }, [studioConfig]);

  const selfStudioGridItem = useMemo(() => {
    const configuredList = Array.isArray((studioConfig as any)?.categories) ? (studioConfig as any).categories : [];
    const matched = configuredList.find((c: any) => c && (c.id === 'selfstudio' || c.id === 'self-studio' || c.id === 'selfphoto'));
    return {
      id: 'selfstudio',
      name: matched?.name || matched?.label || 'SelfStudio',
      icon: matched?.icon || '✨',
      img: matched?.thumbnailImage || matched?.image || '/images/categories/selfphoto.jpg',
      colorBg: 'bg-[#f0f8f3]',
      colorBorder: 'border-[#c5e4cf]',
      colorText: 'text-[#204e2e]'
    };
  }, [studioConfig]);

  const isSelfStudioOnlyMode = activeMenuCategory === 'selfstudio' || activeMenuCategory === 'self-studio';

  // Paket SelfStudio Dinamis Terhubung Langsung ke Dashboard (studioConfig.studioPackages)
  const selfStudioPackagesFromConfig = useMemo(() => {
    const allStudioPkgs = (studioConfig as any)?.studioPackages;
    if (Array.isArray(allStudioPkgs) && allStudioPkgs.length > 0) {
      const filtered = allStudioPkgs.filter(
        (p: any) => p && (p.category === 'self-studio' || p.category === 'selfstudio') && p.active !== false
      );
      if (filtered.length > 0) return filtered;
    }
    return [
      {
        id: 'self-special-narsis',
        category: 'self-studio',
        subtitle: 'Kategori Spesial Hemat',
        badge: 'Hemat',
        name: 'Spesial Narsis',
        originalPrice: 'Rp 75.000',
        price: '55K',
        priceUnit: 'per sesi • 1-2 Orang',
        duration: '15 Menit Sesi Foto',
        background: 'Pilihan Background Studio',
        people: '1-2 Orang',
        edit: 'Template Kolase Siap Cetak',
        print: 'Softfile Only (Cetak opsional)',
        fileDelivery: 'All File via Google Drive',
        note: '*Syarat mudah: follow IG @alviero.selfstudio & tag 3 teman di feed',
        imageUrl: '/images/packages/spesial_narsis_1791787912728.jpg'
      },
      {
        id: 'self-special-super-narsis',
        category: 'self-studio',
        subtitle: 'Kategori Spesial Hemat',
        badge: 'Hemat',
        name: 'Spesial Super Narsis',
        originalPrice: 'Rp 90.000',
        price: '70K',
        priceUnit: 'per sesi • 1-2 Orang',
        duration: '20 Menit Sesi Foto',
        background: 'Pilihan Background Studio',
        people: '1-2 Orang',
        edit: 'Template Kolase Siap Cetak',
        print: 'Softfile Only (Cetak opsional)',
        fileDelivery: 'All File via Google Drive',
        note: '*Waktu lebih puas untuk berekspresi bersama bestie / pasangan',
        imageUrl: '/images/packages/spesial_super_narsis_1791787920000.jpg'
      },
      {
        id: 'self-normal-narsis',
        category: 'self-studio',
        subtitle: 'Kategori Normal',
        badge: 'Free Print',
        name: 'Normal Narsis',
        originalPrice: 'Rp 100.000',
        price: '80K',
        priceUnit: 'per sesi • 1-2 Orang',
        duration: '15 Menit Sesi Foto',
        background: 'Pilihan Background Studio',
        people: '1-2 Orang (Bisa tambah orang)',
        edit: 'Template Kolase Siap Cetak',
        print: 'Free 1 Lembar Cetak 4R / Strip',
        fileDelivery: 'All File via Google Drive',
        note: '*Wireless remote shutter otomatis tanpa fotografer',
        imageUrl: '/images/packages/normal_narsis_1791787834137.jpg'
      },
      {
        id: 'self-normal-super-narsis',
        category: 'self-studio',
        subtitle: 'Kategori Normal',
        badge: 'Free Print',
        name: 'Normal Super Narsis',
        originalPrice: 'Rp 120.000',
        price: '95K',
        priceUnit: 'per sesi • 1-2 Orang',
        duration: '20 Menit Sesi Foto',
        background: 'Pilihan Background Studio',
        people: '1-2 Orang (Bisa tambah orang)',
        edit: 'Template Kolase Siap Cetak',
        print: 'Free 1 Lembar Cetak 4R / Strip',
        fileDelivery: 'All File via Google Drive',
        note: '*Waktu lebih puas untuk berekspresi bersama bestie / pasangan',
        imageUrl: '/images/packages/normal_super_narsis_1791787879710.jpg'
      },
      {
        id: 'self-special-spotlight',
        category: 'self-studio',
        subtitle: 'Colour Spotlight',
        badge: 'Spotlight Lamp',
        name: 'Special Colour Spotlight',
        originalPrice: 'Rp 130.000',
        price: '99K',
        priceUnit: 'per sesi • 1-2 Orang',
        duration: '20 Menit Sesi Foto',
        background: 'Pencahayaan Warna Spotlight',
        people: '1-2 Orang',
        edit: 'Template Kolase Siap Cetak',
        print: 'Free 1 Lembar Cetak 4R / Strip',
        fileDelivery: 'All File via Google Drive',
        note: '*Efek lampu proyektor warna artistik untuk nuansa sinematik',
        imageUrl: '/images/packages/special_colour_spotlight_1791787890705.jpg'
      },
      {
        id: 'self-normal-spotlight',
        category: 'self-studio',
        subtitle: 'Colour Spotlight',
        badge: 'Spotlight Lamp',
        name: 'Normal Colour Spotlight',
        originalPrice: 'Rp 150.000',
        price: '115K',
        priceUnit: 'per sesi • 1-2 Orang',
        duration: '20 Menit Sesi Foto',
        background: 'Pencahayaan Spotlight + Background',
        people: '1-2 Orang',
        edit: 'Template Kolase Siap Cetak',
        print: 'Free 1 Lembar Cetak 4R / Strip',
        fileDelivery: 'All File via Google Drive',
        note: '*Kombinasi lampu spotlight dan background pilihan',
        imageUrl: '/images/packages/normal_colour_spotlight_1791787901644.jpg'
      }
    ];
  }, [studioConfig]);

  const activeFilteredSelfPackages = useMemo(() => {
    if (selfStudioSubTab === 'special') {
      return selfStudioPackagesFromConfig.filter(
        (p: any) => (p.id?.includes('special') || p.subtitle?.toLowerCase().includes('spesial')) && !p.id?.includes('spotlight')
      );
    }
    if (selfStudioSubTab === 'normal') {
      return selfStudioPackagesFromConfig.filter(
        (p: any) => (p.id?.includes('normal') || p.subtitle?.toLowerCase().includes('normal')) && !p.id?.includes('spotlight')
      );
    }
    if (selfStudioSubTab === 'spotlight') {
      return selfStudioPackagesFromConfig.filter(
        (p: any) => p.id?.includes('spotlight') || p.subtitle?.toLowerCase().includes('spotlight') || p.name?.toLowerCase().includes('spotlight')
      );
    }
    return selfStudioPackagesFromConfig;
  }, [selfStudioPackagesFromConfig, selfStudioSubTab]);

  // Social Media Links (From Figma Footer)
  const socialLinks = [
    { label: '@alvierostudiofoto', icon: 'tiktok', url: 'https://tiktok.com/@alvierostudiofoto' },
    { label: '@alvierostudiofoto', icon: 'instagram', url: 'https://instagram.com/alvierostudiofoto' },
    { label: '@alviero.selfstudio', icon: 'instagram', url: 'https://instagram.com/alviero.selfstudio' },
    { label: '@alviero.graduation', icon: 'instagram', url: 'https://instagram.com/alviero.graduation' },
    { label: '@alviero.wedding', icon: 'instagram', url: 'https://instagram.com/alviero.wedding' }
  ];

  // Pertanyaan Umum (FAQ) Data
  const faqs = [
    {
      q: 'Berapa lama proses pengerjaan edit foto dan cetak?',
      a: 'Proses file edit maksimal 7 hari dan cetaknya 5 hari (kecuali pass foto yang bisa langsung jadi kilat) dihitung sejak Anda selesai memilih nomor foto di link Google Drive.'
    },
    {
      q: 'Bagaimana jika saya terlambat datang ke studio?',
      a: 'Apabila studio tidak ramai, Anda boleh mengajukan jam kosong berikutnya tanpa pengurangan menit. Namun jika jadwal penuh, keterlambatan dihitung dari 5 menit pertama dan dialihkan ke sesi berikutnya.'
    },
    {
      q: 'Berapa DP untuk booking jadwal foto?',
      a: 'DP minimal 50% dari total harga paket. Pelunasan dapat diselesaikan sebelum atau setelah sesi foto di studio melalui Cash atau Transfer QRIS.'
    },
    {
      q: 'Apakah bisa request foto di luar jam operasional?',
      a: 'Bisa! Jam operasional normal adalah setiap hari 08:00 - 21:00 WIB. Request di luar jam operasional dikenakan charge 35K (kecuali wisuda outdoor tanpa biaya charge).'
    },
    {
      q: 'Apakah saya bisa membawa binatang peliharaan (Pet-friendly)?',
      a: 'Bisa! Alviero Studio menyambut binatang peliharaan kucing/anjing kecil selama membawa alas pampers/kandang saat masuk studio.'
    },
    {
      q: 'Apakah soft file foto asli resolusi tinggi diberikan gratis?',
      a: 'Ya! Seluruh file asli Google Drive akan dikirim di hari yang sama dan maksimal H+1 apabila kondisi studio sedang ramai.'
    }
  ];

  // 3. DAFTAR CONTOH HASIL FOTO STUDIO SESUAI URUTAN UTAMA (Wajib berasal dari Dashboard)
  const STUDIO_GALLERY_PHOTOS: StudioGalleryPhoto[] = [];

  const FACILITY_PHOTOS: StudioGalleryPhoto[] = [
    {
      id: 'facility-main-room',
      title: 'Sudut Ruangan Studio',
      category: 'ruangan',
      packageName: 'Fasilitas Ruangan',
      icon: '🛋️',
      targetPackageId: 'sewa-studio-hourly',
      imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85',
      description: 'Ruang studio yang rapi, luas, dan nyaman untuk sesi foto personal, keluarga, grup, maupun self studio.',
      conceptNote: 'Area utama dapat disesuaikan untuk kebutuhan pemotretan dan aktivitas klien.',
      tags: ['#RuangStudio', '#StudioNyaman', '#FasilitasAlviero']
    },
    {
      id: 'facility-makeup-room',
      title: 'Ruang Rias & Fitting',
      category: 'ruangan',
      packageName: 'Fasilitas Ruangan',
      icon: '🪞',
      targetPackageId: 'personal-bold-statement',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85',
      description: 'Area privat untuk persiapan makeup, merapikan outfit, dan berganti kostum sebelum sesi dimulai.',
      conceptNote: 'Mendukung kebutuhan wisuda, kebaya, gaun, maternity, dan sesi portrait.',
      tags: ['#RuangRias', '#FittingRoom', '#Kebaya']
    },
    {
      id: 'facility-bathroom',
      title: 'Kamar Mandi Bersih',
      category: 'kenyamanan',
      packageName: 'Fasilitas Kenyamanan',
      icon: '🚿',
      targetPackageId: 'sewa-studio-hourly',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=85',
      description: 'Kamar mandi yang bersih dan terawat untuk mendukung kenyamanan klien selama berada di studio.',
      conceptNote: 'Fasilitas tersedia untuk klien dan pendamping selama jam operasional studio.',
      tags: ['#KamarMandi', '#StudioBersih', '#Kenyamanan']
    },
    {
      id: 'facility-lighting',
      title: 'Setup Lighting Profesional',
      category: 'peralatan',
      packageName: 'Peralatan Studio',
      icon: '💡',
      targetPackageId: 'sewa-studio-hourly',
      imageUrl: 'https://images.unsplash.com/photo-1606986628253-33f7f8e5e2c2?auto=format&fit=crop&w=1000&q=85',
      description: 'Peralatan lighting studio untuk membantu menghasilkan pencahayaan yang merata dan karakter foto yang kuat.',
      conceptNote: 'Setup dapat digunakan untuk sesi fotografer profesional maupun sewa studio.',
      tags: ['#LightingStudio', '#Softbox', '#PeralatanFoto']
    },
    {
      id: 'facility-edc',
      title: 'Mesin EDC & Pembayaran',
      category: 'layanan',
      packageName: 'Layanan Studio',
      icon: '💳',
      targetPackageId: 'sewa-studio-hourly',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=85',
      description: 'Pilihan pembayaran yang praktis untuk membantu proses transaksi layanan studio.',
      conceptNote: 'Konfirmasi metode pembayaran kepada admin sebelum sesi foto.',
      tags: ['#EDC', '#Pembayaran', '#LayananStudio']
    },
    {
      id: 'facility-air-conditioning',
      title: 'Ruangan Ber-AC',
      category: 'kenyamanan',
      packageName: 'Fasilitas Kenyamanan',
      icon: '❄️',
      targetPackageId: 'sewa-studio-hourly',
      imageUrl: 'https://images.unsplash.com/photo-1631545806609-3a7f5c7d4d7e?auto=format&fit=crop&w=1000&q=85',
      description: 'Ruangan berpendingin udara agar sesi foto tetap nyaman, termasuk saat membawa keluarga atau rombongan.',
      conceptNote: 'Kenyamanan ruangan dijaga selama jam operasional studio.',
      tags: ['#StudioBerAC', '#RuangNyaman', '#FasilitasStudio']
    },
    {
      id: 'facility-waiting-area',
      title: 'Area Tunggu Klien',
      category: 'ruangan',
      packageName: 'Fasilitas Ruangan',
      icon: '🪑',
      targetPackageId: 'sewa-studio-hourly',
      imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85',
      description: 'Area tunggu untuk klien dan pendamping sebelum giliran sesi foto atau saat persiapan berlangsung.',
      conceptNote: 'Cocok untuk keluarga, teman, dan rombongan yang datang bersama.',
      tags: ['#AreaTunggu', '#RuangKeluarga', '#StudioFoto']
    },
    {
      id: 'facility-parking',
      title: 'Akses & Area Parkir',
      category: 'layanan',
      packageName: 'Layanan Studio',
      icon: '🅿️',
      targetPackageId: 'sewa-studio-hourly',
      imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=85',
      description: 'Informasi akses lokasi dan area parkir untuk membantu kedatangan klien ke studio.',
      conceptNote: 'Detail alamat dan petunjuk arah tersedia pada menu Lokasi.',
      tags: ['#AksesStudio', '#Parkir', '#LokasiAlviero']
    }
  ];

  const branchFacilityPhotos = useMemo<StudioGalleryPhoto[]>(() => {
    const rawFacilities = (studioConfig as any)?.facilityItems || [];
    const rawEquipment = (studioConfig as any)?.equipmentItems || [];
    const combined = [...rawFacilities, ...rawEquipment];

    const branchItems = combined.filter((item: any) => {
      if (item.active === false) return false;
      if (!item.branchId || item.branchId === 'all') return true;
      return item.branchId === selectedBranch;
    });

    if (branchItems.length > 0) {
      return branchItems.map((item: any) => {
        const imgs = (Array.isArray(item.images) && item.images.length > 0)
          ? item.images
          : (item.imageUrl ? [item.imageUrl] : ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85']);

        return {
          id: item.id,
          title: item.title,
          category: item.category || 'ruangan',
          packageName: item.packageName || (selectedBranch === 'cabang-2' ? 'Fasilitas Studio 2' : 'Fasilitas Studio 1'),
          icon: item.icon || '🛋️',
          targetPackageId: 'sewa-studio-hourly',
          imageUrl: imgs[0],
          images: imgs,
          description: item.description || '',
          conceptNote: item.conceptNote || `Fasilitas tersedia di ${currentBranchInfo.shortName}.`,
          tags: item.tags || [`#${item.title.replace(/\s+/g, '')}`, `#${selectedBranch === 'cabang-1' ? 'Studio1' : 'Studio2'}`]
        };
      });
    }

    return [];
  }, [selectedBranch, currentBranchInfo.shortName, studioConfig]);

  const branchBackgroundPhotos = useMemo<StudioGalleryPhoto[]>(() => {
    const configBgs = Array.isArray((studioConfig as any)?.backgrounds) && (studioConfig as any).backgrounds.length > 0
      ? (studioConfig as any).backgrounds.filter((b: any) => b.active !== false)
      : BACKGROUNDS;
    const selectedBackgrounds = configBgs.filter((bg: any) => (bg.applicableBranches || []).includes(selectedBranch as StudioBranch));
    const uniqueBackgrounds = new Map<string, any>();

    selectedBackgrounds.forEach(bg => {
      const normalizedKey = bg.name.trim().toLowerCase();
      if (!uniqueBackgrounds.has(normalizedKey)) {
        uniqueBackgrounds.set(normalizedKey, bg);
      }
    });

    const preferredOrder = selectedBranch === 'cabang-1'
      ? ['hitam', 'hijau pastel', 'cream', 'limbo', 'putih tengah', 'putih jendela']
      : ['hitam', 'putih', 'abu-abu', 'coklat jendela', 'tematik cream', 'biru'];

    const orderedBackgrounds = Array.from(uniqueBackgrounds.values()).sort((a, b) => {
      const indexA = preferredOrder.indexOf(a.name.trim().toLowerCase());
      const indexB = preferredOrder.indexOf(b.name.trim().toLowerCase());
      const safeA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
      const safeB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
      return safeA - safeB;
    });

    const STUDIO_BG_DEFAULTS: Record<string, string> = {
      'hitam': '/images/backgrounds/bg_hitam_foto1_1792378000731_1792378002613.jpg',
      'hitam list': '/images/backgrounds/bg_hitam_foto1_1792378000731_1792378002613.jpg',
      'putih': '/images/backgrounds/bg_putih_foto1_1792378028025_1792378029653.jpg',
      'putih tematik': '/images/backgrounds/bg_putih_foto1_1792378028025_1792378029653.jpg',
      'putih list': '/images/backgrounds/bg_putih_foto1_1792378028025_1792378029653.jpg',
      'limbo': '/images/backgrounds/bg_putih_foto1_1792378028025_1792378029653.jpg',
      'putih tengah': '/images/backgrounds/bg_putih_foto1_1792378028025_1792378029653.jpg',
      'putih jendela': '/images/backdrops/backdrop-7.jpg',
      'abu-abu': '/images/backgrounds/bg_abu_abu_foto1_1792378066983_1792378070070.jpg',
      'hijau pastel': '/images/backdrops/backdrop-1.jpg',
      'cream': '/images/backgrounds/bg_tematik_cream_foto1_1792378159993_1792378162037.jpg',
      'tematik cream': '/images/backgrounds/bg_tematik_cream_foto1_1792378159993_1792378162037.jpg',
      'coklat': '/images/backgrounds/bg_coklat_jendela_foto1_1792378113604_1792378115069.jpg',
      'coklat jendela': '/images/backgrounds/bg_coklat_jendela_foto1_1792378113604_1792378115069.jpg',
      'biru': '/images/backgrounds/bg_biru_foto1_1793236920387_1793236921945.jpg',
    };

    return orderedBackgrounds.map(bg => {
      const bgNameLower = (bg.name || '').trim().toLowerCase();
      const localDefault = STUDIO_BG_DEFAULTS[bgNameLower] || '/images/backgrounds/bg_putih_foto1_1792378028025_1792378029653.jpg';
      const cleanImg = (bg.previewImage && !bg.previewImage.includes('unsplash.com')) ? bg.previewImage : localDefault;
      const rawBgImages = (Array.isArray(bg.previewImages) && bg.previewImages.length > 0)
        ? bg.previewImages.filter((u: string) => Boolean(u) && !u.includes('unsplash.com'))
        : [cleanImg];
      const bgImages = rawBgImages.length > 0 ? rawBgImages : [cleanImg];
      return {
        id: `background-${bg.id}`,
        title: bg.name,
        category: 'background',
        packageName: selectedBranch === 'cabang-1' ? 'Background Studio 1' : 'Background Studio 2',
        icon: selectedBranch === 'cabang-1' ? '🎨' : '🖼️',
        targetPackageId: 'sewa-studio-hourly',
        imageUrl: bgImages[0],
        images: bgImages,
        description: bg.description,
        conceptNote: `${bg.name} termasuk dalam pilihan background yang tersedia di ${currentBranchInfo.shortName}.`,
        tags: [`#${bg.name.replace(/\s+/g, '')}`, `#${selectedBranch === 'cabang-1' ? 'Studio1' : 'Studio2'}`]
      };
    });
  }, [selectedBranch, currentBranchInfo.shortName, studioConfig]);

  // Filter fasilitas & background untuk tab Fasilitas & Background sesuai studio yang dipilih
  const filteredGalleryPhotos = useMemo(() => {
    if (selectedGalleryCategory === 'background') {
      return branchBackgroundPhotos;
    }

    const facilityPhotos = [...FACILITY_PHOTOS, ...branchFacilityPhotos];

    if (selectedGalleryCategory === 'all') {
      return [...branchBackgroundPhotos, ...facilityPhotos];
    }

    return facilityPhotos.filter(photo => photo.category === selectedGalleryCategory);
  }, [selectedGalleryCategory, branchBackgroundPhotos, branchFacilityPhotos]);

  const activeMenuInfo = allCategoryButtons.find(m => m.id === activeMenuCategory) || studioFotoSubButtons[0] || mainMenuButtons[0];
  const allDynamicPackages = useMemo(() => getActivePackages(studioConfig, PACKAGES), [studioConfig]);
  const activeMenuPackages = useMemo(() => {
    const targetIds = Array.isArray(activeMenuInfo?.targetPackageIds) ? activeMenuInfo.targetPackageIds : [];
    return allDynamicPackages.filter(p => targetIds.includes(p.id));
  }, [activeMenuInfo, allDynamicPackages]);

  const previewCategoryByMenu: Record<string, string> = {
    'selfstudio': 'selfstudio',
    'grad-indoor': 'grad-indoor',
    'grad-outdoor': 'grad-outdoor',
    'group-paket': 'group',
    'family-paket': 'family',
    'maternity-paket': 'maternity',
    'personal-paket': 'personal',
    'couple-paket': 'couple',
    'event': 'birthday',
    'undangan-paket': 'undangan',
    'prewed-paket': 'prewed',
    'pass-foto': 'pass-foto',
    'sewa-studio': 'sewa-studio',
    'kebayak-gaun': 'prewed',
    'wedding-package': 'prewed'
  };

  const pricelistPreviewPhotos = useMemo(() => {
    const previewCategory = previewCategoryByMenu[activeMenuCategory || ''] || activeMenuCategory;
    // Hanya gunakan foto galeri studio asli (bukan stock photo unsplash)
    const matchingGallery = STUDIO_GALLERY_PHOTOS.filter(photo => photo.category === previewCategory && !photo.imageUrl?.includes('unsplash.com'));

    // 1. Ambil foto yang diupload dari Admin Panel (Foto 1 & Foto 2) untuk kategori yang sedang aktif
    const allStudioPkgs = (((studioConfig as any)?.studioPackages || (studioConfig as any)?.indoorPackages || []) as any[]);
    const customPkgPhotos = allStudioPkgs
      .filter(pkg => {
        const hasImg = (Array.isArray(pkg.imageUrls) && pkg.imageUrls.length > 0) || Boolean(pkg.imageUrl);
        if (!hasImg) return false;
        if (previewCategory === 'grad-indoor') {
          return pkg.category === 'grad-indoor' || pkg.category === 'grad-bundling' || pkg.category === 'grad-outdoor';
        }
        if (previewCategory === 'grad-outdoor') {
          return pkg.category === 'grad-outdoor';
        }
        if (previewCategory === 'selfstudio' || previewCategory === 'self-studio') {
          return pkg.category === 'self-studio';
        }
        if (previewCategory === 'prewed') {
          return pkg.category === 'prewed' || pkg.category === 'prewedding' || pkg.category === 'prewed-couple';
        }
        if (previewCategory === 'couple') {
          return pkg.category === 'couple' || pkg.category === 'prewed-couple';
        }
        if (previewCategory === 'group') {
          return pkg.category === 'group' || pkg.category === 'group-family';
        }
        if (previewCategory === 'family') {
          return pkg.category === 'family' || pkg.category === 'group-family';
        }
        if (previewCategory === 'personal') {
          return pkg.category === 'personal' || pkg.category === 'personal-maternity';
        }
        if (previewCategory === 'maternity') {
          return pkg.category === 'maternity' || pkg.category === 'personal-maternity';
        }
        if (previewCategory === 'birthday' || previewCategory === 'event') {
          return pkg.category === 'birthday';
        }
        if (previewCategory === 'pass-foto') {
          return pkg.category === 'pass-foto';
        }
        if (previewCategory === 'sewa-studio') {
          return pkg.category === 'sewa-studio' || pkg.category === 'sewa-event';
        }
        if (previewCategory === 'undangan') {
          return pkg.category === 'undangan' || pkg.category === 'sewa-event';
        }
        return pkg.category === previewCategory;
      })
      .flatMap((pkg, pkgIdx) => {
        const rawUrls: string[] = (Array.isArray(pkg.imageUrls) && pkg.imageUrls.length > 0)
          ? pkg.imageUrls
          : (pkg.imageUrl ? [pkg.imageUrl] : []);
        const urls = rawUrls.filter(u => typeof u === 'string' && u.trim().length > 0 && !u.includes('unsplash.com'));
        return urls.map((url, imgIdx) => ({
          id: `custom-pkg-photo-${pkg.id || pkgIdx}-${imgIdx}`,
          imageUrl: url,
          title: pkg.subtitle
            ? `${pkg.name} (${pkg.subtitle})${urls.length > 1 ? ` — Foto ${imgIdx + 1}` : ''}`
            : `${pkg.name}${urls.length > 1 ? ` — Foto ${imgIdx + 1}` : ' — Foto Paket'}`,
          packageName: pkg.name
        }));
      });

    let defaultGalleryPhotos: any[] = [];
    if (matchingGallery.length > 0) {
      defaultGalleryPhotos = matchingGallery.flatMap(photo => (photo.images || [photo.imageUrl]).map((imageUrl, index) => ({
        id: `${photo.id}-${index}`,
        imageUrl,
        title: photo.title,
        packageName: photo.packageName
      })));
    }

    // Jika ada foto yang diupload dari admin dashboard atau foto galeri studio asli
    if (customPkgPhotos.length > 0 || defaultGalleryPhotos.length > 0) {
      return [...customPkgPhotos, ...defaultGalleryPhotos];
    }

    // Jika belum ada foto asli yang diupload untuk kategori ini, jangan tampilkan carousel dummy/broken
    return [];
  }, [activeMenuCategory, activeMenuInfo.title]);

  const birthdayDecorPreview: StudioGalleryPhoto = {
    id: 'birthday-decor-preview',
    title: 'Contoh Hasil Dekor Birthday',
    category: 'birthday',
    packageName: 'Properti Birthday',
    icon: '🎉',
    targetPackageId: 'birthday-sweet-light',
    imageUrl: '/images/categories/birthday.jpg',
    images: [
      '/images/categories/birthday.jpg'
    ],
    description: 'Referensi dekorasi birthday dengan tulisan birthday, balon latex, dan balon angka sesuai pilihan warna.',
    conceptNote: 'Contoh visual dekorasi. Detail properti mengikuti ketersediaan studio dan konsep yang dipilih.',
    tags: ['#BirthdayDecor', '#PropertiBirthday', '#DekorasiStudio']
  };

  // Keyboard listener untuk modal preview foto hasil paket (ESC, Panah Kiri, Panah Kanan)
  useEffect(() => {
    if (previewPhotoIndex === null) return;
    const total = pricelistPreviewPhotos.length;
    if (total === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewPhotoIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setPreviewPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : total - 1));
      } else if (e.key === 'ArrowRight') {
        setPreviewPhotoIndex((prev) => (prev !== null && prev < total - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewPhotoIndex, pricelistPreviewPhotos.length]);

  const handlePreviewTouchStart = (e: React.TouchEvent) => {
    touchPreviewStartX.current = e.targetTouches[0].clientX;
  };
  const handlePreviewTouchMove = (e: React.TouchEvent) => {
    touchPreviewEndX.current = e.targetTouches[0].clientX;
  };
  const handlePreviewTouchEnd = () => {
    if (!touchPreviewStartX.current || !touchPreviewEndX.current) return;
    const diff = touchPreviewStartX.current - touchPreviewEndX.current;
    const total = pricelistPreviewPhotos.length;
    if (total > 1) {
      if (diff > 40) {
        setPreviewPhotoIndex((prev) => (prev !== null && prev < total - 1 ? prev + 1 : 0));
      } else if (diff < -40) {
        setPreviewPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : total - 1));
      }
    }
    touchPreviewStartX.current = null;
    touchPreviewEndX.current = null;
  };

  // Helper untuk mengambil paket secara dinamis dari studioConfig / fallback
  const getPackagesForCategory = (categoryKeys: string[]) => {
    const allStudio = (((studioConfig as any)?.studioPackages || (studioConfig as any)?.indoorPackages || []) as any[]);
    const fromStudio = allStudio.filter((p: any) => categoryKeys.includes(p.category) && p.active !== false);
    if (fromStudio.length > 0) return fromStudio;

    return allDynamicPackages.filter((p: any) => {
      const pCat = (p.rawConfig?.category || p.category || '').toLowerCase();
      const pId = (p.id || '').toLowerCase();
      return categoryKeys.some(k => pCat === k.toLowerCase() || pId.includes(k.toLowerCase()));
    });
  };

  // Helper render kartu mockup grid bawaan (Format Strip 3, Polaroid 1, Quad 4, Six 6)
  const renderDefaultGridMockup = (layoutType: string, item: any) => {
    const cardBg = item.cardBg || '#FFFFFF';
    const isDark = cardBg === '#18181b' || cardBg === '#111113' || item.cardTextColor === '#FFFFFF';
    const textColor = item.cardTextColor || (isDark ? '#FFFFFF' : '#0F172A');
    const photos = Array.isArray(item.photos) && item.photos.length > 0 ? item.photos : [];

    if (layoutType === 'grid-1' || item.layoutType === 'polaroid-1') {
      return (
        <div
          style={{ backgroundColor: cardBg }}
          className="w-full p-3 pb-5 rounded-sm shadow-md border border-slate-200/80 flex flex-col items-center space-y-2 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl"
        >
          <div className="w-full aspect-[3/4] bg-slate-100 overflow-hidden rounded-xs">
            <img
              src={photos[0] || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=500&q=80'}
              alt={item.title || item.code}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="pt-1 text-center">
            <div style={{ color: textColor }} className="text-[8px] font-black tracking-widest leading-none">ALVIERO</div>
            <div style={{ color: isDark ? '#94A3B8' : '#64748B' }} className="text-[6.5px] font-bold tracking-wider">STUDIO</div>
          </div>
        </div>
      );
    }

    if (layoutType === 'grid-4' || item.layoutType === 'quad-4') {
      return (
        <div
          style={{ backgroundColor: cardBg }}
          className="w-full p-2.5 pb-4 rounded-sm shadow-md border border-slate-200/80 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl"
        >
          <div className="grid grid-cols-2 gap-1 w-full aspect-square">
            {[0, 1, 2, 3].map((pIdx) => (
              <img
                key={pIdx}
                src={photos[pIdx] || 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=200&q=80'}
                alt={`${item.code}-${pIdx}`}
                className="w-full h-full object-cover rounded-2xs"
                loading="lazy"
              />
            ))}
          </div>
          <div className="pt-1 text-center">
            <div style={{ color: textColor }} className="text-[7.5px] font-black tracking-widest leading-none">ALVIERO</div>
            <div style={{ color: isDark ? '#94A3B8' : '#64748B' }} className="text-[6.5px] font-bold tracking-wider">STUDIO</div>
          </div>
        </div>
      );
    }

    if (layoutType === 'grid-6' || item.layoutType === 'six-6') {
      return (
        <div
          style={{ backgroundColor: cardBg }}
          className="w-full p-2 pb-4 rounded-sm shadow-md border border-slate-200/80 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl"
        >
          <div className="grid grid-cols-2 gap-1 w-full aspect-[2/3]">
            {[0, 1, 2, 3, 4, 5].map((pIdx) => (
              <img
                key={pIdx}
                src={photos[pIdx] || 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=200&q=80'}
                alt={`${item.code}-${pIdx}`}
                className="w-full h-full object-cover rounded-2xs"
                loading="lazy"
              />
            ))}
          </div>
          <div className="pt-1 text-center">
            <div style={{ color: textColor }} className="text-[7.5px] font-black tracking-widest leading-none">ALVIERO</div>
            <div style={{ color: isDark ? '#94A3B8' : '#64748B' }} className="text-[6.5px] font-bold tracking-wider">STUDIO</div>
          </div>
        </div>
      );
    }

    // Default: Grid 3 (Strip 3 Vertikal)
    return (
      <div
        style={{ backgroundColor: cardBg }}
        className="w-full p-2.5 pb-4 rounded-sm shadow-md border border-slate-200/80 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl"
      >
        {[0, 1, 2].map((pIdx) => (
          <div key={pIdx} className="w-full aspect-[4/3] bg-amber-100 overflow-hidden rounded-xs">
            <img
              src={photos[pIdx] || 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=300&q=80'}
              alt={`${item.code}-${pIdx}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
        <div className="pt-1 text-center">
          <div style={{ color: textColor }} className="text-[7.5px] font-black tracking-widest leading-none">ALVIERO</div>
          <div style={{ color: isDark ? '#94A3B8' : '#64748B' }} className="text-[6.5px] font-bold tracking-wider">STUDIO</div>
        </div>
      </div>
    );
  };

  // Helper render kartu paket mewah standar Alviero (Sesuai Desain Acuan Foto 1)
  const renderLuxuryPackageCard = (pkg: any, idx: number, defaultNote = '*Harap konfirmasi jadwal terlebih dahulu') => {
    const badgeColorClass =
      idx === 0
        ? 'bg-[#EBF2EA] text-[#3D6345] border-[#CDE0CB]'
        : idx === 1
        ? 'bg-[#FAF0E6] text-[#8A5A36] border-[#EAD5C3]'
        : 'bg-[#F0F4F8] text-[#2C4A6F] border-[#D5E1ED]';

    return (
      <div
        key={pkg.id || idx}
        className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DDD6] hover:border-[#A9BCA7] p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#8A7D71] uppercase tracking-wider font-century">
                {pkg.subtitle || pkg.tag || `Paket ${idx + 1}`}
              </span>
              {pkg.badge && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColorClass}`}>
                  {idx === 0 ? <Star className="w-3 h-3 fill-current" /> : idx === 1 ? <Sparkles className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                  {pkg.badge}
                </span>
              )}
            </div>
            <h4 className="text-2xl sm:text-3xl font-serif font-black text-[#2A2A2A] tracking-tight mt-0.5">
              {pkg.name}
            </h4>
          </div>
          <div className="sm:text-right">
            {pkg.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through font-century block">
                {pkg.originalPrice}
              </span>
            )}
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#2A2A2A] tracking-tight leading-none">
              {pkg.price}
            </div>
            <span className="text-[10px] text-slate-500 font-century">
              {pkg.priceUnit || 'per sesi • all-in'}
            </span>
          </div>
        </div>

        {/* Dynamic Specification Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-century text-xs">
          {Array.isArray(pkg.facilities) && pkg.facilities.length > 0 ? (
            pkg.facilities.map((fac: any, fIdx: number) => (
              <div key={fIdx} className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-start sm:items-center gap-2 hover:border-[#A9BCA7] transition-colors">
                <span className="text-base shrink-0 leading-none">{fac.icon || '✨'}</span>
                <div className="min-w-0 flex-1">
                  {fac.label && (
                    <span className="text-[10px] text-stone-500 font-bold block leading-tight uppercase tracking-wider">
                      {fac.label}
                    </span>
                  )}
                  <span className="text-[#3A3A3A] font-medium leading-snug block">
                    {fac.text}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <>
              {pkg.people && (
                <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#5C725A] shrink-0" />
                  <span className="text-[#3A3A3A] font-medium">{pkg.people}</span>
                </div>
              )}
              {pkg.duration && (
                <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#5C725A] shrink-0" />
                  <span className="text-[#3A3A3A] font-medium">{pkg.duration}</span>
                </div>
              )}
              {pkg.background && (
                <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5C725A] shrink-0" />
                  <span className="text-[#3A3A3A] font-medium">{pkg.background}</span>
                </div>
              )}
              {pkg.edit && (
                <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5C725A] shrink-0" />
                  <span className="text-[#3A3A3A] font-medium">{pkg.edit}</span>
                </div>
              )}
              {pkg.print && (
                <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#5C725A] shrink-0" />
                  <span className="text-[#3A3A3A] font-medium">{pkg.print}</span>
                </div>
              )}
              {pkg.fileDelivery ? (
                <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#5C725A] shrink-0" />
                  <span className="text-[#3A3A3A] font-medium">{pkg.fileDelivery}</span>
                </div>
              ) : (
                <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#5C725A] shrink-0" />
                  <span className="text-[#3A3A3A] font-medium">All File via Google Drive</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#F2E9E4]">
          <span className="text-[11px] text-slate-500 font-century italic">
            {pkg.note || defaultNote}
          </span>
          <button
            onClick={() => onSelectPackageForBooking(pkg.id)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2A2A2A] hover:bg-[#1A1A1A] active:bg-black text-[#FDFBF7] font-bold text-xs tracking-wider uppercase shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Pilih Paket Ini</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full py-2 sm:py-6 px-2 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-3 sm:space-y-6">

      {/* Top Segmented Navigation Tabs (Khusus Desktop) */}
      <div className="hidden lg:flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 sm:p-4 border border-[#E8DDD6] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#3A3A3A] text-[#A9BCA7] flex items-center justify-center shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#3A3A3A] uppercase tracking-wide leading-tight">
              Katalog Resmi & Fasilitas Alviero Studio
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 font-sans">
              Lihat pricelist resmi atau kenali fasilitas yang tersedia di studio kami.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#FAF8F5] p-1.5 flex items-center gap-1.5 w-full sm:w-auto border border-[#E8DDD6] rounded-xl sm:rounded-2xl shadow-xs">
          <button
            onClick={() => { setActiveTab('menu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl border ${
              isTabActive('menu')
                ? 'bg-[#3F613E] text-white border-[#334F32] shadow-sm font-extrabold ring-2 ring-[#3F613E]/20'
                : 'bg-[#EFF6EE] text-[#345333] border-[#CCE0CB] hover:bg-[#E2EFE1] font-bold'
            }`}
          >
            <span>📱 Menu Pricelist</span>
          </button>

          <button
            onClick={() => { setActiveTab('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl border ${
              isTabActive('gallery')
                ? 'bg-[#2B5777] text-white border-[#21435D] shadow-sm font-extrabold ring-2 ring-[#2B5777]/20'
                : 'bg-[#F0F5F9] text-[#224762] border-[#C8DCED] hover:bg-[#E3EFF7] font-bold'
            }`}
          >
            <span>🏢 Fasilitas &amp; Background</span>
          </button>

          <button
            onClick={() => { setActiveTab('guide'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl border ${
              isTabActive('guide')
                ? 'bg-[#A33636] text-white border-[#872929] shadow-sm font-extrabold ring-2 ring-[#A33636]/20'
                : 'bg-[#FDF2F2] text-[#8C2B2B] border-[#F4CDCD] hover:bg-[#FCE5E5] font-bold'
            }`}
          >
            <span>📖 Disclaimer</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. BIO-LINK & MENU VIEW (Clean Studio Jakarta Aesthetic)             */}
      {/* ==================================================================== */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-start w-full">

          {/* Left Column: The Studio Menu Card (Minimalist & Elegant) */}
          <div className={`${isSelfStudioOnlyMode ? 'hidden md:block' : ''} md:col-span-5 lg:col-span-4 xl:col-span-4 max-w-md w-full mx-auto md:sticky md:top-20 overflow-hidden shadow-md border border-[#E8DDD6] bg-white relative rounded-2xl`}>
            {/* Subtle Studio Ambient Header Glow */}
            <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#FDFBF7] to-transparent pointer-events-none" />

            {/* Menu Content */}
            <div className="relative z-10 p-4 sm:p-6 flex flex-col items-center text-center space-y-3.5 sm:space-y-4">

              {/* Tombol Navigasi Kembali ke Beranda Awal */}
              {onBackToLanding && (
                <div className="w-full flex items-center justify-between gap-2 pb-2.5 border-b border-[#E8DDD6]">
                  <button
                    onClick={() => onBackToLanding()}
                    className="px-3.5 py-1.5 bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-serif text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-[#3A3A3A] shadow-xs active:scale-95"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Kembali ke Beranda</span>
                  </button>
                  <span className="text-[10.5px] font-serif font-bold uppercase tracking-wider text-stone-500">
                    {currentBranchInfo.shortName}
                  </span>
                </div>
              )}

              {/* 0. Pilihan Lokasi Studio Cabang 1 vs Cabang 2 */}
              <div
                onClick={onOpenBranchModal}
                className="w-full bg-[#f4f3ee] hover:bg-[#eae6dd] rounded-2xl p-2.5 sm:p-3 text-stone-900 flex items-center justify-between gap-2.5 shadow-2xs border border-stone-200/90 cursor-pointer transition-all hover:border-[#6c8c74] active:scale-98 group"
              >
                <div className="flex items-center gap-2.5 text-left min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#232d38] text-[#9fc4a8] flex items-center justify-center text-sm font-bold shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    {currentBranchInfo.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9.5px] font-extrabold text-stone-500 uppercase tracking-wider">Lokasi Studio:</span>
                      <span className="text-[9px] bg-[#eef4f0] text-[#3d6345] border border-[#c8dacd] font-bold px-1.5 py-0.2 rounded-full">
                        {currentBranchInfo.badge}
                      </span>
                    </div>
                    <div className="font-extrabold text-xs text-stone-900 truncate">
                      {currentBranchInfo.name}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenBranchModal) onOpenBranchModal();
                  }}
                  className="px-3 py-1 rounded-full bg-[#232d38] hover:bg-[#1a222c] text-white text-[10.5px] font-bold shrink-0 transition-colors shadow-2xs cursor-pointer"
                >
                  Ganti Studio 🔄
                </button>
              </div>

              {/* 4. Switcher Mode: Menu Pricelist vs Fasilitas vs Panduan (Khusus HP) */}
              <div className="w-full lg:hidden bg-[#FAF8F5] p-1.5 rounded-2xl flex items-stretch gap-1.5 border border-[#E8DDD6] shadow-xs">
                <button
                  onClick={() => { setActiveTab('menu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`flex-1 min-h-[42px] px-2 py-1.5 rounded-xl text-[11px] sm:text-xs transition-all flex items-center justify-center text-center leading-tight gap-1 cursor-pointer active:scale-95 border ${
                    isTabActive('menu')
                      ? 'bg-[#3F613E] text-white border-[#334F32] shadow-sm font-extrabold ring-2 ring-[#3F613E]/20'
                      : 'bg-[#EFF6EE] text-[#345333] border-[#CCE0CB] hover:bg-[#E2EFE1] font-bold'
                  }`}
                >
                  <span>📱 Menu</span>
                </button>
                <button
                  onClick={() => { setActiveTab('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`flex-1 min-h-[42px] px-2 py-1.5 rounded-xl text-[11px] sm:text-xs transition-all flex items-center justify-center text-center leading-tight gap-1 cursor-pointer active:scale-95 border ${
                    isTabActive('gallery')
                      ? 'bg-[#2B5777] text-white border-[#21435D] shadow-sm font-extrabold ring-2 ring-[#2B5777]/20'
                      : 'bg-[#F0F5F9] text-[#224762] border-[#C8DCED] hover:bg-[#E3EFF7] font-bold'
                  }`}
                >
                  <span>🏢 Fasilitas &amp; Background</span>
                </button>
                <button
                  onClick={() => { setActiveTab('guide'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`flex-1 min-h-[42px] px-2 py-1.5 rounded-xl text-[11px] sm:text-xs transition-all flex items-center justify-center text-center leading-tight gap-1 cursor-pointer active:scale-95 border ${
                    isTabActive('guide')
                      ? 'bg-[#A33636] text-white border-[#872929] shadow-sm font-extrabold ring-2 ring-[#A33636]/20'
                      : 'bg-[#FDF2F2] text-[#8C2B2B] border-[#F4CDCD] hover:bg-[#FCE5E5] font-bold'
                  }`}
                >
                  <span>📖 Disclaimer</span>
                </button>
              </div>

              {/* Title Section (Matching Image 2: Studio Foto Jogja & Solo style) */}
              <div className="w-full pt-1 pb-2 text-center border-b border-stone-200/60">
                <h2 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 tracking-wide">
                  {isSelfStudioOnlyMode ? `SelfStudio ${currentBranchInfo.name}` : `Studio Foto ${currentBranchInfo.name}`}
                </h2>
                <p className="text-[11px] font-sans text-stone-500 font-medium">
                  {isSelfStudioOnlyMode
                    ? 'Foto Mandiri Wireless Shutter & Cetak Kolase'
                    : 'Pilih kategori studio di bawah untuk melihat rincian paket & harga'}
                </p>
              </div>

              {/* 1. Photo Studio Package Grid or SelfStudio Dedicated Card */}
              <div className="w-full text-left space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider">
                    {isSelfStudioOnlyMode ? 'SelfStudio Package' : 'Photo Studio Package'}
                  </h3>
                  <span className="text-[10px] font-sans bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded-full border border-stone-200">
                    {isSelfStudioOnlyMode ? '1 Kategori' : `${photoStudioGridItems.length} Kategori`}
                  </span>
                </div>

                {isSelfStudioOnlyMode ? (
                  /* Tampilan Eksklusif SelfStudio (Foto 1) */
                  <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#f0f8f3]/80 border border-[#c5e4cf] shadow-2xs text-center space-y-2.5 animate-in fade-in duration-300">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex items-center justify-center text-3xl transition-all shadow-md border-2 border-[#55735b] ring-4 ring-[#55735b]/30 bg-[#232d38] text-white">
                      {selfStudioGridItem.img ? (
                        <img
                          src={selfStudioGridItem.img}
                          alt={selfStudioGridItem.name}
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>✨</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-editorial font-bold text-sm sm:text-base text-[#1E1E1E]">
                        {selfStudioGridItem.name}
                      </h4>
                      <p className="text-[11px] font-sans text-stone-600 max-w-xs mt-0.5">
                        Private booth mandiri tanpa fotografer menggunakan remote wireless shutter &amp; cetak kolase strip.
                      </p>
                    </div>

                    {/* Tombol Switcher jika Klien ingin Buka Katalog Studio Foto Biasa */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMenuCategory('grad-indoor');
                        setIsMobilePopupOpen(false);
                      }}
                      className="w-full mt-1.5 py-2 px-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#3A3A3A] border border-[#E8DDD6] hover:border-[#3A3A3A] text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      <span>📸 Buka Studio Foto (Wisuda, Group, Family...)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-y-3.5 gap-x-1 sm:gap-x-2 text-center">
                    {photoStudioGridItems.map((item) => {
                      const isSelected = activeMenuCategory === item.id;

                      return (
                        <button
                          key={item.id + item.name}
                          onClick={() => {
                            setActiveMenuCategory(item.id);
                            setIsMobilePopupOpen(true);
                          }}
                          className="group flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all p-1"
                        >
                          <div className={`w-13 h-13 sm:w-15 sm:h-15 rounded-full overflow-hidden flex items-center justify-center text-xl sm:text-2xl mb-1.5 transition-all shadow-2xs border relative ${
                            isSelected
                              ? 'bg-[#232d38] text-white border-[#55735b] ring-3 ring-[#55735b]/35 scale-105 shadow-md'
                              : `${item.colorBg} ${item.colorBorder} ${item.colorText} group-hover:scale-105 group-hover:shadow-xs`
                          }`}>
                            {item.img ? (
                              <img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                            )}
                          </div>
                          <span className={`text-[10.5px] sm:text-xs leading-tight line-clamp-2 transition-colors ${
                            isSelected ? 'text-[#232d38] font-black' : 'font-semibold text-stone-700 group-hover:text-stone-900'
                          }`}>
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Penjelasan Memilih Salah Satu Paket Foto (Simple & Minimalis) */}
              {!isSelfStudioOnlyMode && (
                <div className="w-full pt-3 pb-1 border-t border-stone-200/80 text-center">
                  <p className="text-xs sm:text-[13px] font-sans text-stone-600 text-center leading-relaxed">
                    Ketuk salah satu kategori paket di atas untuk melihat rincian harga & booking.
                  </p>
                </div>
              )}

              {/* Social Media Links Grid (Minimalist & Clean) */}
              <div className={`w-full pt-3 border-t border-stone-200/80 ${isSelfStudioOnlyMode ? 'hidden md:block' : ''}`}>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1.5 text-left">
                  {socialLinks.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1.5 text-[10.5px] font-medium text-stone-600 hover:text-[#6c8c74] transition-colors py-0.5 truncate ${idx === socialLinks.length - 1 ? 'basis-full justify-center' : ''}`}
                    >
                      {s.icon === 'tiktok' && <Music2 className="w-3 h-3 text-stone-500 shrink-0" />}
                      {s.icon === 'instagram' && <Instagram className="w-3 h-3 text-stone-500 shrink-0" />}
                      {s.icon === 'whatsapp' && <MessageCircle className="w-3 h-3 text-stone-500 shrink-0" />}
                      <span className="truncate">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Logo Utama & Tagline (Logo Resmi Alviero Studio) */}
              <div className={`w-full pt-4 mt-1 border-t border-slate-200/80 space-y-2 flex flex-col items-center justify-center ${isSelfStudioOnlyMode ? 'hidden md:flex' : ''}`}>
                <img
                  src="/images/alviero-logo-official.png"
                  alt="Alviero Studio"
                  className="h-14 sm:h-16 max-w-[220px] sm:max-w-[260px] w-auto object-contain transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                <p className="text-xs text-slate-500 font-serif italic tracking-wide">
                  Perfecting Happiness in Every Moment
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Category Details (Responsive: Side-by-Side on Desktop, Inline / Popup Modal on Mobile/HP) */}
          <div
            className={
              isSelfStudioOnlyMode
                ? 'w-full block md:col-span-7 lg:col-span-8 xl:col-span-8 animate-in fade-in duration-200'
                : isMobilePopupOpen
                ? 'fixed inset-0 z-50 md:static md:col-span-7 lg:col-span-8 xl:col-span-8 bg-slate-950/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none flex items-end md:block justify-center p-0 md:p-0 overflow-y-auto md:overflow-visible animate-in fade-in duration-200'
                : 'hidden md:block md:col-span-7 lg:col-span-8 xl:col-span-8'
            }
          >
            <div className={`bg-white text-slate-900 w-full ${
              isSelfStudioOnlyMode
                ? 'rounded-2xl shadow-md border border-slate-200 overflow-hidden relative'
                : 'max-h-[92vh] md:max-h-none rounded-t-[32px] md:rounded-2xl shadow-2xl md:shadow-md flex flex-col md:block overflow-hidden md:overflow-visible border border-slate-200 relative my-auto md:my-0 animate-in slide-in-from-bottom md:animate-none duration-300'
            }`}>

              {/* Header Khusus Tampilan Desktop & Tablet (Selalu Tampil di PC) */}
              <div className="hidden md:flex bg-[#FAF8F5] px-6 py-4 border-b border-[#E0D9CE] items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{activeMenuInfo.icon}</span>
                  <div className="min-w-0">
                    <h3 className="font-serif font-black text-base lg:text-lg text-slate-900 uppercase tracking-wide truncate">
                      {activeMenuInfo.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-sans truncate">
                      {activeMenuInfo.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10.5px] font-serif font-bold uppercase tracking-wider bg-white text-stone-700 px-3 py-1 border border-[#E0D9CE] rounded-full">
                    {currentBranchInfo.shortName}
                  </span>
                  {!isSelfStudioOnlyMode && (
                    <button
                      onClick={handleClosePopup}
                      className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                      title="Tutup & Kembali ke Beranda"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Header Khusus HP / Mobile untuk Mode SelfStudio (Clean, Ringkas, Satu Halaman Utuh - Mengatasi Foto 1) */}
              {isSelfStudioOnlyMode && (
                <div className="md:hidden bg-[#FAF8F5] p-3 sm:p-4 border-b border-[#E0D9CE] space-y-2.5 shadow-2xs">
                  {/* Bar Atas: Tombol Kembali & Lokasi Studio */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => onBackToLanding && onBackToLanding()}
                      className="px-3 py-1.5 bg-[#2A2A2A] hover:bg-black text-[#FDFBF7] font-serif text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer rounded-lg shadow-xs active:scale-95"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 stroke-[2]" />
                      <span>Kembali ke Beranda</span>
                    </button>
                    <button
                      type="button"
                      onClick={onOpenBranchModal}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F2E9E4] text-[#3A3A3A] text-[10.5px] font-serif font-bold flex items-center gap-1.5 border border-[#E0D9CE] cursor-pointer shadow-2xs active:scale-95"
                    >
                      <span>{currentBranchInfo.shortName}</span>
                      <span className="text-[#5C725A]">🔄</span>
                    </button>
                  </div>

                  {/* Tab Switcher: Menu Paket vs Fasilitas vs Disclaimer */}
                  <div className="w-full bg-white p-1 rounded-xl flex items-stretch gap-1 border border-[#E8DDD6] shadow-2xs">
                    <button
                      onClick={() => { setActiveTab('menu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold font-century transition-all text-center ${
                        isTabActive('menu')
                          ? 'bg-[#3F613E] text-white shadow-xs'
                          : 'text-[#3A3A3A] hover:bg-[#F2E9E4]'
                      }`}
                    >
                      📱 Menu Paket
                    </button>
                    <button
                      onClick={() => { setActiveTab('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold font-century transition-all text-center ${
                        isTabActive('gallery')
                          ? 'bg-[#2B5777] text-white shadow-xs'
                          : 'text-[#3A3A3A] hover:bg-[#F2E9E4]'
                      }`}
                    >
                      🏢 Fasilitas
                    </button>
                    <button
                      onClick={() => { setActiveTab('guide'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold font-century transition-all text-center ${
                        isTabActive('guide')
                          ? 'bg-[#A33636] text-white shadow-xs'
                          : 'text-[#3A3A3A] hover:bg-[#F2E9E4]'
                      }`}
                    >
                      📖 Disclaimer
                    </button>
                  </div>

                  {/* Header Editorial SelfStudio */}
                  <div className="pt-1 text-center space-y-0.5">
                    <div className="inline-flex items-center gap-1.5 text-[9.5px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                      <Sparkles className="w-3 h-3 text-[#5C725A]" />
                      PRIVATE BOOTH • WIRELESS SHUTTER
                    </div>
                    <h3 className="font-editorial text-lg font-bold text-stone-900 tracking-wide">
                      SelfStudio {currentBranchInfo.name}
                    </h3>
                    <p className="text-[10.5px] font-sans text-stone-500 font-medium">
                      Foto Mandiri Wireless Shutter Bebas Berekspresi &amp; Cetak Kolase Strip
                    </p>
                  </div>

                  {/* Tombol Switcher ke Studio Foto */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuCategory('grad-indoor');
                      setIsMobilePopupOpen(false);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#3A3A3A] border border-[#E8DDD6] text-[11px] font-serif font-bold flex items-center justify-between shadow-2xs cursor-pointer active:scale-95"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>📸</span>
                      <span>Mau Foto dengan Fotografer Studio?</span>
                    </span>
                    <span className="text-[#6E856C] font-bold flex items-center gap-1 text-[10.5px]">
                      Buka Studio Foto <ChevronRight className="w-3 h-3" />
                    </span>
                  </button>
                </div>
              )}

              {/* Sticky Header Khusus Penggunaan HP / Mobile (Untuk Studio Foto Biasa dengan Tombol Tutup [X]) */}
              {!isSelfStudioOnlyMode && (
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 flex md:hidden items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base sm:text-lg">{activeMenuInfo.icon}</span>
                    <div className="min-w-0">
                      <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate uppercase tracking-wide">
                        {activeMenuInfo.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium truncate block">
                        {activeMenuInfo.subtitle}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleClosePopup}
                    className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                  >
                    <X className="w-4 h-4 text-amber-300" />
                    <span>Tutup</span>
                  </button>
                </div>
              )}

              {/* Scrollable Container Body */}
              <div className="p-4 sm:p-6 lg:p-7 overflow-y-auto lg:overflow-visible space-y-6 flex-1 bg-white">

                {/* Foto hasil sesi sesuai pricelist aktif */}
                {pricelistPreviewPhotos.length > 0 && (
                  <section className="space-y-2.5 animate-in fade-in duration-300" aria-label={`Hasil foto ${activeMenuInfo.title}`}>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Hasil Foto Paket</span>
                        <h3 className="font-serif font-black text-base sm:text-lg text-slate-900 leading-tight">Inspirasi {activeMenuInfo.title.replace('PRICELIST ', '')}</h3>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 shrink-0">Geser ke samping</span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-1 touch-pan-x">
                      {pricelistPreviewPhotos.map((photo, photoIdx) => (
                        <div
                          key={photo.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setPreviewPhotoIndex(photoIdx)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setPreviewPhotoIndex(photoIdx);
                            }
                          }}
                          className="relative shrink-0 w-[78%] sm:w-[42%] lg:w-[31%] aspect-[4/3] snap-start overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 shadow-sm group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-[#6E856C] active:scale-[0.98]"
                          title={`Klik untuk memperbesar foto: ${photo.title}`}
                        >
                          <img
                            src={photo.imageUrl}
                            alt={`${photo.title} - ${photo.packageName}`}
                            loading="lazy"
                            onError={(e) => {
                              const parent = (e.target as HTMLElement).closest('[role="button"]');
                              if (parent) (parent as HTMLElement).style.display = 'none';
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                          />

                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent px-3 pb-2.5 pt-8">
                            <p className="text-[10px] sm:text-[11px] text-white font-bold leading-tight line-clamp-2">{photo.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 1. UNIFIED LUXURY SELFSTUDIO VIEW (SESUAI ACUAN FOTO MODERN GRADUATION / PERSONAL) */}
                {/* 100% TERHUBUNG DINAMIS DENGAN DASHBOARD / studioConfig.studioPackages KATEGORI self-studio */}
                {(activeMenuCategory === 'selfstudio' || activeMenuCategory === 'self-studio') && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-2 border-b border-[#E8DDD6] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                          <Sparkles className="w-3 h-3 text-[#5C725A]" />
                          SELF PHOTO STUDIO 2026
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 font-serif">Studio 1 & 2 Alviero</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                        Pricelist Self Studio Alviero
                      </h3>
                      <p className="text-xs text-slate-600 font-century leading-relaxed">
                        Bebas berekspresi sepuasnya tanpa rasa canggung di private booth profesional dengan wireless remote shutter otomatis, pencahayaan studio estetik, dan cetakan kolase siap bawa pulang.
                      </p>
                    </div>

                    {/* Sub-Kategori Navigation Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-mask-x no-scrollbar">
                      {[
                        { id: 'all', label: '🌟 Semua Paket Self' },
                        { id: 'special', label: `🏷️ Spesial Hemat (${getPkgPrice('self-special-narsis', '55K')} - ${getPkgPrice('self-special-super-narsis', '70K')})` },
                        { id: 'normal', label: `✨ Normal (${getPkgPrice('self-normal-narsis', '80K')} - ${getPkgPrice('self-normal-super-narsis', '95K')})` },
                        { id: 'spotlight', label: `🌈 Colour Spotlight (${getPkgPrice('self-special-spotlight', '99K')} - ${getPkgPrice('self-normal-spotlight', '115K')})` },
                        { id: 'grid', label: '🎞️ Pilihan Grid Cetak' }
                      ].map((tab) => {
                        const isSelected = selfStudioSubTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setSelfStudioSubTab(tab.id as any)}
                            className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-bold font-century transition-all shrink-0 cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${
                              isSelected
                                ? 'bg-[#2A2A2A] text-white shadow-sm'
                                : 'bg-[#F2E9E4] text-[#3A3A3A] hover:bg-[#E8DDD6]'
                            }`}
                          >
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* KONTEN KARTU PAKET SELF STUDIO (DINAMIS DARI DASHBOARD) */}
                    {selfStudioSubTab !== 'grid' && (
                      <div className="space-y-4">
                        {(() => {
                          const allSelf = getPackagesForCategory(['self-studio', 'selfstudio']);
                          const filtered = allSelf.filter((pkg: any) => {
                            const pid = (pkg.id || '').toLowerCase();
                            const pname = (pkg.name || '').toLowerCase();
                            const psub = (pkg.subtitle || '').toLowerCase();
                            if (selfStudioSubTab === 'special') {
                              return (
                                pid.includes('special') ||
                                pid.includes('spesial') ||
                                pname.includes('spesial') ||
                                psub.includes('spesial')
                              );
                            }
                            if (selfStudioSubTab === 'normal') {
                              return (
                                (pid.includes('normal') || pname.includes('normal') || psub.includes('normal')) &&
                                !pid.includes('spotlight') &&
                                !pname.includes('spotlight')
                              );
                            }
                            if (selfStudioSubTab === 'spotlight') {
                              return pid.includes('spotlight') || pname.includes('spotlight') || psub.includes('spotlight');
                            }
                            return true;
                          });

                          const subCategoryTitle =
                            selfStudioSubTab === 'special'
                              ? 'Kategori Spesial Hemat (Wajib S&K Instagram)'
                              : selfStudioSubTab === 'normal'
                              ? 'Kategori Normal (Tanpa Syarat & Ketentuan)'
                              : selfStudioSubTab === 'spotlight'
                              ? 'Colour Spotlight Packages (Proyektor Sinematik)'
                              : 'Semua Koleksi Paket Self Studio';

                          return (
                            <>
                              <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                                    {subCategoryTitle}
                                  </h4>
                                </div>
                                <span className="text-[11px] font-medium text-slate-500 font-century">
                                  {filtered.length} Pilihan Paket
                                </span>
                              </div>

                              {filtered.length === 0 ? (
                                <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-[#E8DDD6] space-y-2">
                                  <p className="text-sm font-serif font-bold text-[#2A2A2A]">Tidak ada paket ditemukan pada kategori ini.</p>
                                  <p className="text-xs text-slate-500 font-century">Silakan periksa pengaturan paket di Dashboard Admin.</p>
                                </div>
                              ) : (
                                filtered.map((pkg: any, idx: number) => {
                                  const pid = (pkg.id || '').toLowerCase();
                                  const isSpecial = pid.includes('special') || pid.includes('spesial');
                                  const isSpotlight = pid.includes('spotlight');
                                  const defaultNote = isSpecial
                                    ? '*Wajib follow & tag salah satu akun IG Alviero Studio'
                                    : isSpotlight
                                    ? '*Dilengkapi lampu spotlight warna untuk nuansa sinematik artistik'
                                    : '*Tanpa syarat & ketentuan, bebas berekspresi sepuasnya';

                                  return renderLuxuryPackageCard(pkg, idx, defaultNote);
                                })
                              )}
                            </>
                          );
                        })()}

                        {/* Banner Pintas ke Pilihan Grid Cetak */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FAF8F5] to-[#F2E9E4] border border-[#E8DDD6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold font-serif text-[#2A2A2A]">
                              <span>🎞️</span>
                              <span>Ingin Melihat Pilihan Layout Cetak?</span>
                            </div>
                            <p className="text-[11px] text-slate-600 font-century leading-relaxed">
                              Tersedia aneka template Photo Strip 3, Polaroid Grid 1, Quad Cut Grid 4, hingga Six-Cut Grid 6.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelfStudioSubTab('grid')}
                            className="px-4 py-2 rounded-full bg-[#2A2A2A] hover:bg-[#1A1A1A] text-white font-bold text-xs font-century shrink-0 transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5 active:scale-95"
                          >
                            <span>Lihat Grid Cetak</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Box Syarat & Ketentuan Khusus Paket Spesial */}
                        {(selfStudioSubTab === 'special' || selfStudioSubTab === 'all') && (
                          <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                            <div className="flex items-center gap-2">
                              <span className="text-base">📋</span>
                              <h5 className="font-serif font-bold text-sm text-[#2A2A2A]">Syarat & Ketentuan Paket Spesial Narsis</h5>
                            </div>
                            <ul className="space-y-2 text-xs font-century text-slate-700 leading-relaxed">
                              <li className="flex items-start gap-2">
                                <span className="text-[#5C725A] font-bold shrink-0">•</span>
                                <span>Follow salah satu akun Instagram kami (<strong>@alviero.selfstudio</strong>, <strong>@alvierostudiofoto</strong>, <strong>@alviero.graduation</strong>, atau <strong>@alvierowedding</strong>) — <em>1 akun untuk 1x booking</em>.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#5C725A] font-bold shrink-0">•</span>
                                <span><strong>Tag 3 temanmu</strong> di kolom komentar feed Instagram <strong>@alviero.selfstudio</strong>.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#5C725A] font-bold shrink-0">•</span>
                                <span>Share di Instagram kamu (story/feed/reels) & <strong>tag @alviero.selfstudio</strong>, lalu beri like pada minimal 1 postingan kami.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#5C725A] font-bold shrink-0">•</span>
                                <span>Simpan nomor WhatsApp Alviero Studio di kontak HP kamu.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#5C725A] font-bold shrink-0">•</span>
                                <span className="text-[#3D6345] font-semibold">🎁 Bonus: <strong>Free Cetak 1 Polaroid Tambahan</strong> jika memberikan <strong>Rating Bintang 5 & Ulasan Positif di Google Maps</strong> Alviero Studio Foto!</span>
                              </li>
                            </ul>
                          </div>
                        )}

                        {/* Box Additional & Layanan Tambahan SelfStudio */}
                        <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#5C725A]" />
                            <h5 className="font-serif font-bold text-sm text-[#2A2A2A]">Additional & Layanan Tambahan SelfStudio</h5>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-century text-[#3A3A3A]">
                            <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Tambah Waktu (5 Menit)</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("self-time", "20K")}</span></div>
                            <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Cetak 1 Lembar 4R</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("self-print", "7.5K")}</span></div>
                            <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Cetak Grid 3 (2 Lbr)</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("self-print-grid3", "8K")}</span></div>
                            <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Tambah Orang</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("self-extra-person", "15K/org")}</span></div>
                            <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Kostum Dino (1/Pasang)</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("self-costume-dino", "15K/25K")}</span></div>
                            <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Hewan Peliharaan</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("self-pet", "25K")}</span></div>
                          </div>
                        </div>

                        <div className="text-center pt-1">
                          <button
                            type="button"
                            onClick={handleGoToDisclaimer}
                            className="inline-flex items-center gap-1.5 text-xs text-[#5C725A] hover:text-[#3D6345] font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-[#EBF2EA] hover:bg-[#DEE9DD] px-4 py-2 rounded-full border border-[#D0E2CE] shadow-2xs font-century"
                          >
                            <span>📖 Harap Membaca Ketentuan & Disclaimer Studio</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

{/* Subtab 4: Pilihan Grid Cetak Self Studio (100% Dinamis dari Dashboard studioConfig.selfStudioPrintLayouts) */}
                    {selfStudioSubTab === 'grid' && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        {(() => {
                          const configuredLayouts = (Array.isArray((studioConfig as any)?.selfStudioPrintLayouts) && (studioConfig as any).selfStudioPrintLayouts.length > 0)
                            ? (studioConfig as any).selfStudioPrintLayouts
                            : [];

                          const activeFilterOptions = [
                            { id: 'all', label: 'Semua Grid (1, 3, 4, 6)', icon: '🎞️' },
                            ...configuredLayouts.filter((gl: any) => gl.active !== false).map((gl: any) => ({
                              id: gl.id || gl.category,
                              label: gl.categoryLabel || gl.title,
                              icon: gl.categoryIcon || '🌸'
                            }))
                          ];

                          const displayedLayouts = configuredLayouts.filter((gl: any) => {
                            if (gl.active === false) return false;
                            if (selectedGridFilter === 'all') return true;
                            return gl.id === selectedGridFilter || gl.category === selectedGridFilter;
                          });

                          return (
                            <>
                              {/* Filter Jenis Grid */}
                              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-mask-x no-scrollbar">
                                {activeFilterOptions.map((gf: any) => {
                                  const isSelected = selectedGridFilter === gf.id;
                                  return (
                                    <button
                                      key={gf.id}
                                      onClick={() => setSelectedGridFilter(gf.id as any)}
                                      className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${isSelected
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                      <span>{gf.icon}</span>
                                      <span>{gf.label}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {displayedLayouts.length === 0 ? (
                                <div className="p-8 text-center bg-[#FAF8F5] rounded-3xl border border-[#E8DDD6] space-y-2">
                                  <p className="text-sm font-serif font-bold text-[#2A2A2A]">Tidak ada seri grid cetak ditemukan.</p>
                                  <p className="text-xs text-slate-500 font-century">Silakan tambahkan atau aktifkan seri grid di Dashboard Admin.</p>
                                </div>
                              ) : (
                                displayedLayouts.map((gl: any) => (
                                  <div
                                    key={gl.id}
                                    style={{
                                      backgroundColor: gl.bgColor || '#eed1cb',
                                      borderColor: gl.borderColor || '#e2beb7'
                                    }}
                                    className="rounded-3xl p-5 sm:p-7 border shadow-lg text-slate-900 space-y-6 relative overflow-hidden"
                                  >
                                    {/* Background Curved Lines */}
                                    <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border-2 border-white/40 pointer-events-none" />
                                    <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full border-2 border-white/40 pointer-events-none" />

                                    <div className="text-center space-y-0.5 relative z-10">
                                      <h3 className="font-black text-xl sm:text-2xl text-slate-900 tracking-wider uppercase">
                                        {gl.title || 'PILIHAN GRID CETAK'}
                                      </h3>
                                      <h4 className="font-black text-lg sm:text-xl text-slate-900 tracking-widest uppercase">
                                        {gl.subtitle || 'SELF STUDIO'}
                                      </h4>
                                      {gl.formatBadge && (
                                        <span className="inline-block text-[11px] font-bold text-slate-700 bg-white/60 px-3 py-0.5 rounded-full mt-1">
                                          {gl.formatBadge}
                                        </span>
                                      )}
                                    </div>

                                    {/* 5 / N Grid Strips */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4 relative z-10 pt-1">
                                      {(gl.items || []).filter((item: any) => item.active !== false).map((item: any, itIdx: number) => {
                                        return (
                                          <div key={item.id || itIdx} className="flex flex-col items-center space-y-1.5 group">
                                            {item.previewImage ? (
                                              /* KARTU FOTO DESAIN STRIP KUSTOM DARI ADMIN (FOTO UPLOAD / CANVA) */
                                              <div
                                                style={{ backgroundColor: item.cardBg || '#FFFFFF' }}
                                                className="w-full p-2 pb-3 rounded-lg shadow-md border border-black/10 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl overflow-hidden cursor-pointer bg-white"
                                              >
                                                <div className="w-full rounded overflow-hidden bg-slate-100 flex items-center justify-center">
                                                  <img
                                                    src={item.previewImage}
                                                    alt={item.title || item.code}
                                                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                  />
                                                </div>
                                              </div>
                                            ) : (
                                              /* MOCKUP MULTI-PHOTO BAWAAN */
                                              renderDefaultGridMockup(gl.id || gl.category, item)
                                            )}
                                            <span className="font-extrabold text-xs text-slate-800">
                                              {item.code || `Grid ${itIdx + 1}`}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {gl.footerQuote && (
                                      <div className="text-center pt-2 relative z-10">
                                        <p className="font-serif font-black text-xs sm:text-sm tracking-widest text-slate-700 uppercase">
                                          {gl.footerQuote}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </>
                          );
                        })()}

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={handleGoToDisclaimer}
                            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                          >
                            <span>⚠️ Harap Membaca Disclaimer pada halaman Disclaimer</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                    {/* ========================================================================= */}
                {/* UNIFIED LUXURY CATEGORY VIEWS (SESUAI ACUAN FOTO 1 GRADUATION)           */}
                {/* 100% TERHUBUNG DINAMIS DENGAN DASHBOARD / studioConfig.studioPackages   */}
                {/* ========================================================================= */}

                {/* 1. UNDANGAN DIGITAL */}
                {activeMenuCategory === 'undangan-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-2 border-b border-[#E8DDD6] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                          <Sparkles className="w-3 h-3 text-[#5C725A]" />
                          COLLECTION 2026
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 font-serif">Alviero Studio</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                        Pricelist Undangan Digital Website
                      </h3>
                      <p className="text-xs text-slate-600 font-century leading-relaxed">
                        Bagikan kabar bahagia pernikahan Anda melalui website undangan interaktif modern, responsif di semua perangkat, dengan fitur RSVP & amplop digital.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                            Undangan Digital Packages
                          </h4>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 font-century">
                          {getPackagesForCategory(['undangan', 'undangan-paket']).length} Pilihan Paket
                        </span>
                      </div>

                      {getPackagesForCategory(['undangan', 'undangan-paket']).map((pkg: any, idx: number) =>
                        renderLuxuryPackageCard(pkg, idx, '*Masa aktif terhitung sejak tanggal aktivasi website undangan')
                      )}
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#5C725A]" />
                        <h5 className="font-serif font-bold text-sm text-[#2A2A2A]">Fitur Website Undangan Digital</h5>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-century text-[#3A3A3A]">
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>📱</span><span>Tampilan Elegan Mobile & Desktop</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>🎵</span><span>Musik Latar Bebas Request</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>🗺️</span><span>Navigasi Google Maps</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>💌</span><span>Nama Tamu Tak Terbatas</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>🎁</span><span>Amplop Digital (QRIS / Rekening)</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>💬</span><span>Live Wishes & Ucapan Doa</span></div>
                      </div>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleGoToDisclaimer}
                        className="inline-flex items-center gap-1.5 text-xs text-[#5C725A] hover:text-[#3D6345] font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-[#EBF2EA] hover:bg-[#DEE9DD] px-4 py-2 rounded-full border border-[#D0E2CE] shadow-2xs font-century"
                      >
                        <span>📖 Harap Membaca Ketentuan & Disclaimer Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. SEWA STUDIO */}
                {activeMenuCategory === 'sewa-studio' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-2 border-b border-[#E8DDD6] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                          <Sparkles className="w-3 h-3 text-[#5C725A]" />
                          COLLECTION 2026
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 font-serif">Alviero Studio</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                        Pricelist Sewa Studio Hourly
                      </h3>
                      <p className="text-xs text-slate-600 font-century leading-relaxed">
                        Sewa studio foto berpendingin udara lengkap dengan flash studio Godox, softbox, trigger, beragam pilihan background, dan ruang rias privat.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                            Studio Rental Packages
                          </h4>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 font-century">
                          {getPackagesForCategory(['sewa-studio', 'sewa']).length} Pilihan Paket
                        </span>
                      </div>

                      {getPackagesForCategory(['sewa-studio', 'sewa']).map((pkg: any, idx: number) =>
                        renderLuxuryPackageCard(pkg, idx, '*Harga sewa berlaku per jam, fotografer & kamera disediakan sendiri oleh klien')
                      )}
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#5C725A]" />
                        <h5 className="font-serif font-bold text-sm text-[#2A2A2A]">Fasilitas Sewa Termasuk</h5>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-century text-[#3A3A3A]">
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>💡</span><span>2-3 Studio Flash Godox + Trigger</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>✨</span><span>Bebas Pakai Semua Background</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>❄️</span><span>Ruangan Full AC & Audio Musik</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>👗</span><span>Ruang Ganti & Cermin Rias</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>📶</span><span>Koneksi WiFi Berkecepatan Tinggi</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>👥</span><span>Kapasitas Tim Maksimal 8 Orang</span></div>
                      </div>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleGoToDisclaimer}
                        className="inline-flex items-center gap-1.5 text-xs text-[#5C725A] hover:text-[#3D6345] font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-[#EBF2EA] hover:bg-[#DEE9DD] px-4 py-2 rounded-full border border-[#D0E2CE] shadow-2xs font-century"
                      >
                        <span>📖 Harap Membaca Ketentuan & Disclaimer Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. PREWEDDING STUDIO & BUNDLING */}
                {activeMenuCategory === 'prewed-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-2 border-b border-[#E8DDD6] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                          <Sparkles className="w-3 h-3 text-[#5C725A]" />
                          COLLECTION 2026
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 font-serif">Alviero Studio</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                        Pricelist Prewedding Studio & Bundling
                      </h3>
                      <p className="text-xs text-slate-600 font-century leading-relaxed">
                        Rangkaian sesi prewedding impian dengan konsep studio megah, gaun eksklusif, sentuhan riasan MUA profesional, dan cetak bingkai premium.
                      </p>
                    </div>

                    {/* Sub-Kategori Navigation Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-mask-x no-scrollbar">
                      {[
                        { id: 'all', label: '💍 Semua Paket Prewed' },
                        { id: 'studio', label: '🏛️ Prewedding Studio' },
                        { id: 'bundling', label: '💄 Bundling Prewed + MUA' }
                      ].map((tab) => {
                        const isSelected = selectedPrewedSubTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setSelectedPrewedSubTab(tab.id as any)}
                            className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-bold font-century transition-all shrink-0 cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${
                              isSelected
                                ? 'bg-[#2A2A2A] text-white shadow-sm'
                                : 'bg-[#F2E9E4] text-[#3A3A3A] hover:bg-[#E8DDD6]'
                            }`}
                          >
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-4">
                      {(() => {
                        const allPrewed = getPackagesForCategory(['prewed', 'prewedding', 'prewed-paket']);
                        const filtered = allPrewed.filter((pkg: any) => {
                          if (selectedPrewedSubTab === 'studio') {
                            return !pkg.id.includes('bundling') && !pkg.name.toLowerCase().includes('mua');
                          }
                          if (selectedPrewedSubTab === 'bundling') {
                            return pkg.id.includes('bundling') || pkg.name.toLowerCase().includes('mua');
                          }
                          return true;
                        });

                        return (
                          <>
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                                <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                                  {selectedPrewedSubTab === 'bundling' ? 'Prewedding + MUA Bundling' : 'Prewedding Studio Packages'}
                                </h4>
                              </div>
                              <span className="text-[11px] font-medium text-slate-500 font-century">
                                {filtered.length} Pilihan Paket
                              </span>
                            </div>

                            {filtered.map((pkg: any, idx: number) =>
                              renderLuxuryPackageCard(pkg, idx, '*Termasuk pengarahan pose cinematic langsung dari fotografer profesional')
                            )}
                          </>
                        );
                      })()}
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#5C725A]" />
                        <h5 className="font-serif font-bold text-sm text-[#2A2A2A]">Additional & Layanan Tambahan Prewedding</h5>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-century text-[#3A3A3A]">
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Background</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("backdrop", "75K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Hairdo</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("hairdo", "150K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Make Up</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("makeup", "350K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Edit Foto</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("edit", "10K")}</span></div>
                      </div>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleGoToDisclaimer}
                        className="inline-flex items-center gap-1.5 text-xs text-[#5C725A] hover:text-[#3D6345] font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-[#EBF2EA] hover:bg-[#DEE9DD] px-4 py-2 rounded-full border border-[#D0E2CE] shadow-2xs font-century"
                      >
                        <span>📖 Harap Membaca Ketentuan & Disclaimer Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. COUPLE ROMANCE */}
                {activeMenuCategory === 'couple-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-2 border-b border-[#E8DDD6] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                          <Sparkles className="w-3 h-3 text-[#5C725A]" />
                          COLLECTION 2026
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 font-serif">Alviero Studio</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                        Pricelist Couple Romance Studio
                      </h3>
                      <p className="text-xs text-slate-600 font-century leading-relaxed">
                        Ekspresikan kisah cinta romantis dan kehangatan hubungan Anda bersama pasangan dalam potret artistik berkelas.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                            Couple Studio Packages
                          </h4>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 font-century">
                          {getPackagesForCategory(['couple', 'couple-paket']).length} Pilihan Paket
                        </span>
                      </div>

                      {getPackagesForCategory(['couple', 'couple-paket']).map((pkg: any, idx: number) =>
                        renderLuxuryPackageCard(pkg, idx, '*Pose romantis & intim diarahkan langsung oleh fotografer profesional')
                      )}
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#5C725A]" />
                        <h5 className="font-serif font-bold text-sm text-[#2A2A2A]">Additional & Add-Ons Couple</h5>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-century text-[#3A3A3A]">
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Background</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("backdrop", "75K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Ganti Outfit</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("costume", "50K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Edit Foto</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("edit", "10K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Make Up Pasangan</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("makeup", "250K")}</span></div>
                      </div>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleGoToDisclaimer}
                        className="inline-flex items-center gap-1.5 text-xs text-[#5C725A] hover:text-[#3D6345] font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-[#EBF2EA] hover:bg-[#DEE9DD] px-4 py-2 rounded-full border border-[#D0E2CE] shadow-2xs font-century"
                      >
                        <span>📖 Harap Membaca Ketentuan & Disclaimer Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. PERSONAL PORTRAIT */}
                {activeMenuCategory === 'personal-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-2 border-b border-[#E8DDD6] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                          <Sparkles className="w-3 h-3 text-[#5C725A]" />
                          COLLECTION 2026
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 font-serif">Alviero Studio</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                        Pricelist Personal Portrait Studio
                      </h3>
                      <p className="text-xs text-slate-600 font-century leading-relaxed">
                        Tampilkan citra diri terbaik Anda untuk CV profesional, branding karier, profil LinkedIn, maupun portofolio sosial media.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                            Personal Portrait Packages
                          </h4>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 font-century">
                          {getPackagesForCategory(['personal', 'personal-paket']).length} Pilihan Paket
                        </span>
                      </div>

                      {getPackagesForCategory(['personal', 'personal-paket']).map((pkg: any, idx: number) =>
                        renderLuxuryPackageCard(pkg, idx, '*Cocok untuk foto profile, CV profesional, dan konten media sosial')
                      )}
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#5C725A]" />
                        <h5 className="font-serif font-bold text-sm text-[#2A2A2A]">Additional & Add-Ons Personal</h5>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-century text-[#3A3A3A]">
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Background</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("backdrop", "50K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Ganti Kostum</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("costume", "50K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Make Up & Hairdo</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("makeup", "250K")}</span></div>
                      </div>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleGoToDisclaimer}
                        className="inline-flex items-center gap-1.5 text-xs text-[#5C725A] hover:text-[#3D6345] font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-[#EBF2EA] hover:bg-[#DEE9DD] px-4 py-2 rounded-full border border-[#D0E2CE] shadow-2xs font-century"
                      >
                        <span>📖 Harap Membaca Ketentuan & Disclaimer Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. MATERNITY */}
                {activeMenuCategory === 'maternity-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-2 border-b border-[#E8DDD6] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                          <Sparkles className="w-3 h-3 text-[#5C725A]" />
                          COLLECTION 2026
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 font-serif">Alviero Studio</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                        Pricelist Maternity Studio
                      </h3>
                      <p className="text-xs text-slate-600 font-century leading-relaxed">
                        Momen penuh cinta menyambut buah hati tercinta dengan pencahayaan lembut dan suasana studio yang privat nan nyaman.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                            Maternity Studio Packages
                          </h4>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 font-century">
                          {getPackagesForCategory(['maternity', 'maternity-paket']).length} Pilihan Paket
                        </span>
                      </div>

                      {getPackagesForCategory(['maternity', 'maternity-paket']).map((pkg: any, idx: number) =>
                        renderLuxuryPackageCard(pkg, idx, '*Mengabadikan momen kehamilan yang hangat & penuh rasa syukur')
                      )}
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#5C725A]" />
                        <h5 className="font-serif font-bold text-sm text-[#2A2A2A]">Additional & Add-Ons Maternity</h5>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-century text-[#3A3A3A]">
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Background</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("backdrop", "75K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Ganti Kostum</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("costume", "50K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Edit Foto</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("edit", "10K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Make Up Bumil</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("makeup", "250K")}</span></div>
                      </div>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleGoToDisclaimer}
                        className="inline-flex items-center gap-1.5 text-xs text-[#5C725A] hover:text-[#3D6345] font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-[#EBF2EA] hover:bg-[#DEE9DD] px-4 py-2 rounded-full border border-[#D0E2CE] shadow-2xs font-century"
                      >
                        <span>📖 Harap Membaca Ketentuan & Disclaimer Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. BIRTHDAY CELEBRATION */}
                {activeMenuCategory === 'event' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-2 border-b border-[#E8DDD6] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                          <Sparkles className="w-3 h-3 text-[#5C725A]" />
                          COLLECTION 2026
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 font-serif">Alviero Studio</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                        Pricelist Birthday Celebration Studio
                      </h3>
                      <p className="text-xs text-slate-600 font-century leading-relaxed">
                        Rayakan pertambahan usia penuh suka cita, dekorasi balon, kue ulang tahun, dan pencahayaan spotlight studio yang memukau.
                      </p>
                    </div>

                    {/* Sub-Kategori Navigation Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-mask-x no-scrollbar">
                      {[
                        { id: 'all', label: '🎂 Semua Paket Birthday' },
                        { id: 'sweet', label: '🎈 Sweet Celebration (1-3 Org)' },
                        { id: 'spotlight', label: '💡 Spotlight Party (4-12 Org)' }
                      ].map((tab) => {
                        const isSelected = selectedBirthdaySubTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setSelectedBirthdaySubTab(tab.id as any)}
                            className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-bold font-century transition-all shrink-0 cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${
                              isSelected
                                ? 'bg-[#2A2A2A] text-white shadow-sm'
                                : 'bg-[#F2E9E4] text-[#3A3A3A] hover:bg-[#E8DDD6]'
                            }`}
                          >
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-4">
                      {(() => {
                        const allBday = getPackagesForCategory(['birthday', 'event']);
                        const filtered = allBday.filter((pkg: any) => {
                          if (selectedBirthdaySubTab === 'sweet') {
                            return pkg.id.includes('celebration') || pkg.id.includes('glow');
                          }
                          if (selectedBirthdaySubTab === 'spotlight') {
                            return pkg.id.includes('light') || pkg.id.includes('ultimate');
                          }
                          return true;
                        });

                        return (
                          <>
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                                <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                                  Birthday Studio Packages
                                </h4>
                              </div>
                              <span className="text-[11px] font-medium text-slate-500 font-century">
                                {filtered.length} Pilihan Paket
                              </span>
                            </div>

                            {filtered.map((pkg: any, idx: number) =>
                              renderLuxuryPackageCard(pkg, idx, '*Bebas membawa kue tart, balon, dan dekorasi ulang tahun sendiri')
                            )}
                          </>
                        );
                      })()}
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#5C725A]" />
                        <h5 className="font-serif font-bold text-sm text-[#2A2A2A]">Informasi Properti Ulang Tahun</h5>
                      </div>
                      <p className="text-xs font-century text-[#3A3A3A] leading-relaxed">
                        Klien dipersilakan membawa kue ulang tahun, balon angka/huruf, dan properti perayaan sendiri tanpa biaya tambahan. Tersedia add-on edit foto ekstra seharga Rp 10.000/foto.
                      </p>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleGoToDisclaimer}
                        className="inline-flex items-center gap-1.5 text-xs text-[#5C725A] hover:text-[#3D6345] font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-[#EBF2EA] hover:bg-[#DEE9DD] px-4 py-2 rounded-full border border-[#D0E2CE] shadow-2xs font-century"
                      >
                        <span>📖 Harap Membaca Ketentuan & Disclaimer Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 8. FAMILY PHOTO */}
                {activeMenuCategory === 'family-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-2 border-b border-[#E8DDD6] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                          <Sparkles className="w-3 h-3 text-[#5C725A]" />
                          COLLECTION 2026
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 font-serif">Alviero Studio</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                        Pricelist Family Photo Studio
                      </h3>
                      <p className="text-xs text-slate-600 font-century leading-relaxed">
                        Abadikan kehangatan generasi keluarga Anda dalam potret studio mewah yang elegan, abadi, dan penuh kenangan berharga.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                            Family Studio Packages
                          </h4>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 font-century">
                          {getPackagesForCategory(['family', 'family-paket']).length} Pilihan Paket
                        </span>
                      </div>

                      {getPackagesForCategory(['family', 'family-paket']).map((pkg: any, idx: number) =>
                        renderLuxuryPackageCard(pkg, idx, '*Fotografer profesional mengarahkan pose seluruh anggota keluarga dengan penuh kesabaran')
                      )}
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#5C725A]" />
                          <h5 className="font-serif font-bold text-sm text-[#2A2A2A]">Diskon Spesial & Additional Family</h5>
                        </div>
                        <span className="inline-flex items-center gap-1 bg-[#EBF2EA] text-[#3D6345] border border-[#CDE0CB] px-2.5 py-0.5 rounded-full text-[10px] font-bold font-century">
                          Hemat 50K
                        </span>
                      </div>
                      <p className="text-xs font-century text-[#5C725A] font-bold bg-[#EBF2EA]/60 p-2.5 rounded-xl border border-[#D0E2CE]">
                        🎉 Potongan Diskon Rp 50.000 khusus untuk keluarga yang hanya terdiri dari 3 anggota keluarga.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-century text-[#3A3A3A]">
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Bingkai 10Rs</span><span className="font-bold text-[#5C725A]">35K</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Background</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("backdrop", "75K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Ganti Kostum</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("costume", "50K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Tambah Orang</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("person", "10K")}</span></div>
                      </div>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleGoToDisclaimer}
                        className="inline-flex items-center gap-1.5 text-xs text-[#5C725A] hover:text-[#3D6345] font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-[#EBF2EA] hover:bg-[#DEE9DD] px-4 py-2 rounded-full border border-[#D0E2CE] shadow-2xs font-century"
                      >
                        <span>📖 Harap Membaca Ketentuan & Disclaimer Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 9. GROUP SQUAD */}
                {activeMenuCategory === 'group-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-2 border-b border-[#E8DDD6] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                          <Sparkles className="w-3 h-3 text-[#5C725A]" />
                          COLLECTION 2026
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 font-serif">Alviero Studio</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                        Pricelist Group Photo Studio
                      </h3>
                      <p className="text-xs text-slate-600 font-century leading-relaxed">
                        Rayakan kebersamaan tak terlupakan bersama geng, teman sekelas, sahabat, dan rekan kerja dengan sesi studio eksklusif.
                      </p>
                    </div>

                    {/* Sub-Kategori Navigation Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-mask-x no-scrollbar">
                      {[
                        { id: 'all', label: '👥 Semua Paket Group' },
                        { id: 'small', label: '👭 3 - 20 Orang (Friendly & Squad)' },
                        { id: 'large', label: '👑 21 - 35 Orang (Royal & Imperial)' }
                      ].map((tab) => {
                        const isSelected = selectedGroupSubTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setSelectedGroupSubTab(tab.id as any)}
                            className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-bold font-century transition-all shrink-0 cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${
                              isSelected
                                ? 'bg-[#2A2A2A] text-white shadow-sm'
                                : 'bg-[#F2E9E4] text-[#3A3A3A] hover:bg-[#E8DDD6]'
                            }`}
                          >
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-4">
                      {(() => {
                        const allGroup = getPackagesForCategory(['group', 'group-paket']);
                        const filtered = allGroup.filter((pkg: any) => {
                          if (selectedGroupSubTab === 'small') {
                            return pkg.id.includes('friendly') || pkg.id.includes('signature');
                          }
                          if (selectedGroupSubTab === 'large') {
                            return pkg.id.includes('royal') || pkg.id.includes('imperial');
                          }
                          return true;
                        });

                        return (
                          <>
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                                <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                                  Group Studio Packages
                                </h4>
                              </div>
                              <span className="text-[11px] font-medium text-slate-500 font-century">
                                {filtered.length} Pilihan Paket
                              </span>
                            </div>

                            {filtered.map((pkg: any, idx: number) =>
                              renderLuxuryPackageCard(pkg, idx, '*Bebas berganti pose, arahan fotografer profesional, dan properti studio')
                            )}
                          </>
                        );
                      })()}
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#5C725A]" />
                        <h5 className="font-serif font-bold text-sm text-[#2A2A2A]">Additional & Add-Ons Group</h5>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-century text-[#3A3A3A]">
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Tambah Orang</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("person", "15K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Background</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("backdrop", "75K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Ganti Kostum</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("costume", "50K")}</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex justify-between items-center"><span>+ Edit Foto</span><span className="font-bold text-[#5C725A]">{getAddOnPriceDisplay("edit", "10K")}</span></div>
                      </div>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleGoToDisclaimer}
                        className="inline-flex items-center gap-1.5 text-xs text-[#5C725A] hover:text-[#3D6345] font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-[#EBF2EA] hover:bg-[#DEE9DD] px-4 py-2 rounded-full border border-[#D0E2CE] shadow-2xs font-century"
                      >
                        <span>📖 Harap Membaca Ketentuan & Disclaimer Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 10. PASS FOTO STUDIO */}
                {activeMenuCategory === 'pass-foto' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-2 border-b border-[#E8DDD6] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                          <Sparkles className="w-3 h-3 text-[#5C725A]" />
                          COLLECTION 2026
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 font-serif">Alviero Studio</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                        Pricelist Pass Foto Studio
                      </h3>
                      <p className="text-xs text-slate-600 font-century leading-relaxed">
                        Layanan pas foto kilat beresolusi tinggi dengan standar resmi instansi, buku nikah, ijazah, visa, paspor, dan berkas kedutaan.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                            Pass Foto Packages
                          </h4>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 font-century">
                          {getPackagesForCategory(['pass-foto', 'passfoto']).length} Pilihan Paket
                        </span>
                      </div>

                      {getPackagesForCategory(['pass-foto', 'passfoto']).map((pkg: any, idx: number) =>
                        renderLuxuryPackageCard(pkg, idx, '*Standar regulasi resmi buku nikah, ijazah, paspor, dan kedutaan besar')
                      )}
                    </div>

                    <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#5C725A]" />
                        <h5 className="font-serif font-bold text-sm text-[#2A2A2A]">Informasi Layanan Pass Foto</h5>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-century text-[#3A3A3A]">
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>🎨</span><span>Latar Merah / Biru / Putih</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>📲</span><span>File Dikirim via WA Dokumen</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>👔</span><span>Opsi Edit Jas & Dasi Digital</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>🖨️</span><span>Kualitas Kertas Foto Lab Doff</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>📐</span><span>Ukuran 2x3, 3x4, 4x6 & Visa</span></div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#EFE5DC] flex items-center gap-2"><span>⚡</span><span>Proses Cepat & Siap Pakai</span></div>
                      </div>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleGoToDisclaimer}
                        className="inline-flex items-center gap-1.5 text-xs text-[#5C725A] hover:text-[#3D6345] font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-[#EBF2EA] hover:bg-[#DEE9DD] px-4 py-2 rounded-full border border-[#D0E2CE] shadow-2xs font-century"
                      >
                        <span>📖 Harap Membaca Ketentuan & Disclaimer Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
{/* 12. UNIFIED LUXURY GRADUATION VIEW (INDOOR, BUNDLING, OUTDOOR & ADDITIONAL) */}
                {(activeMenuCategory === 'grad-indoor' || activeMenuCategory === 'grad-outdoor') && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    
                    {/* Editorial Header */}
                    <div className="space-y-2 border-b border-[#E8DDD6] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#5C725A] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full border border-[#D0E2CE]">
                          <Sparkles className="w-3 h-3 text-[#5C725A]" />
                          COLLECTION 2026
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 font-serif">Alviero Studio</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                        {activeMenuCategory === 'grad-outdoor' ? 'Pricelist Wisuda Outdoor Kampus' : 'Pricelist Graduation Studio & Outdoor'}
                      </h3>
                      <p className="text-xs text-slate-600 font-century leading-relaxed">
                        {activeMenuCategory === 'grad-outdoor'
                          ? 'Abadikan momen kelulusan bersejarah Anda bersama sahabat & keluarga di area kampus dengan fotografer profesional Alviero Studio.'
                          : 'Abadikan momen kelulusan bersejarah Anda bersama keluarga & sahabat dengan pencahayaan studio mewah dan sesi kampus profesional.'}
                      </p>
                    </div>

                    {/* Sub-Kategori Navigation Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-mask-x no-scrollbar">
                      {(activeMenuCategory === 'grad-outdoor' ? [
                        { id: 'outdoor', label: '🌳 Outdoor Kampus' },
                        { id: 'additional', label: '➕ Additional Outdoor' },
                        { id: 'all', label: '🎓 Semua Paket Wisuda' }
                      ] : [
                        { id: 'all', label: '🎓 Semua Paket' },
                        { id: 'indoor', label: '🏛️ Studio Indoor' },
                        { id: 'bundling', label: '👑 Bundling Hemat ⭐' },
                        { id: 'outdoor', label: '🌳 Outdoor Kampus' },
                        { id: 'additional', label: '➕ Additional' },
                      ]).map((tab) => {
                        const isSelected = selectedGradSubTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setSelectedGradSubTab(tab.id as any)}
                            className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-bold font-century transition-all shrink-0 cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${
                              isSelected
                                ? 'bg-[#2A2A2A] text-white shadow-sm'
                                : 'bg-[#F2E9E4] text-[#3A3A3A] hover:bg-[#E8DDD6]'
                            }`}
                          >
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* SECTION: STUDIO INDOOR */}
                    {(selectedGradSubTab === 'indoor' || (selectedGradSubTab === 'all' && activeMenuCategory !== 'grad-outdoor')) && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                            <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                              Studio Indoor Packages
                            </h4>
                          </div>
                          <span className="text-[11px] font-medium text-slate-500 font-century">
                            {(() => {
                              const fromStudio = ((studioConfig as any)?.studioPackages || []).filter((p: any) => p.category === 'grad-indoor' && p.active !== false);
                              return (fromStudio.length > 0 ? fromStudio : (studioConfig.indoorPackages || [])).length;
                            })()} Pilihan Paket
                          </span>
                        </div>

                        {(() => {
                          const fromStudio = ((studioConfig as any)?.studioPackages || []).filter((p: any) => p.category === 'grad-indoor' && p.active !== false);
                          return (fromStudio.length > 0 ? fromStudio : (studioConfig.indoorPackages || [
                          {
                            id: 'grad-indoor-elegant-scholar',
                            subtitle: 'Graduation Indoor 1',
                            badge: 'Favorit',
                            name: 'Elegant Scholar',
                            originalPrice: 'Rp 350.000',
                            price: '295K',
                            priceUnit: 'per sesi • all-in',
                            duration: '25 Menit Unlimited Foto',
                            background: '1 Background Studio',
                            people: '1 Wisudawan + Maks 10 Org',
                            edit: 'Edit 6 Foto High-Res',
                            print: 'Cetak 2 Uk 10Rs / 3 Uk 4R',
                            fileDelivery: 'All File via Google Drive',
                            note: '*Maksimal 1 kostum wisuda (disediakan oleh klien)'
                          },
                          {
                            id: 'grad-indoor-supreme-scholar',
                            subtitle: 'Graduation Indoor 2',
                            badge: '2 Background',
                            name: 'Supreme Scholar',
                            originalPrice: 'Rp 480.000',
                            price: '415K',
                            priceUnit: 'per sesi • all-in',
                            duration: '40 Menit Unlimited Foto',
                            background: '2 Background Studio',
                            people: '1 Wisudawan + Maks 10 Org',
                            edit: 'Edit 8 Foto High-Res',
                            print: 'Cetak 2 Uk 10Rs / 6 Uk 4R',
                            fileDelivery: 'All File via Google Drive',
                            note: '*Maksimal 1 kostum wisuda (disediakan oleh klien)'
                          },
                          {
                            id: 'grad-indoor-infinity-scholar',
                            subtitle: 'Graduation Indoor 3',
                            badge: '2 Wisudawan',
                            name: 'Infinity Scholar',
                            originalPrice: 'Rp 680.000',
                            price: '595K',
                            priceUnit: 'per sesi • all-in',
                            duration: '45 Menit Unlimited Foto',
                            background: '2 Background Studio',
                            people: '2 Wisudawan + Maks 10 Org',
                            edit: 'Edit 12 Foto High-Res',
                            print: 'Cetak 4 Uk 10Rs / 6 Uk 4R',
                            fileDelivery: 'All File via Google Drive',
                            note: '*Maksimal 1 kostum wisuda (disediakan oleh klien)'
                          }
                        ]));
                        })().map((pkg: any, idx: number) => {
                          const badgeColorClass =
                            idx === 0
                              ? 'bg-[#EBF2EA] text-[#3D6345] border-[#CDE0CB]'
                              : idx === 1
                              ? 'bg-[#FAF0E6] text-[#8A5A36] border-[#EAD5C3]'
                              : 'bg-[#F0F4F8] text-[#2C4A6F] border-[#D5E1ED]';

                          return (
                            <div
                              key={pkg.id || idx}
                              className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DDD6] hover:border-[#A9BCA7] p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 space-y-4"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-[#8A7D71] uppercase tracking-wider font-century">
                                      {pkg.subtitle}
                                    </span>
                                    {pkg.badge && (
                                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColorClass}`}>
                                        {idx === 0 ? <Star className="w-3 h-3 fill-current" /> : idx === 1 ? <Sparkles className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                                        {pkg.badge}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-2xl sm:text-3xl font-serif font-black text-[#2A2A2A] tracking-tight mt-0.5">
                                    {pkg.name}
                                  </h4>
                                </div>
                                <div className="sm:text-right">
                                  {pkg.originalPrice && (
                                    <span className="text-[11px] text-slate-400 line-through font-century block">
                                      {pkg.originalPrice}
                                    </span>
                                  )}
                                  <div className="text-2xl sm:text-3xl font-serif font-black text-[#2A2A2A] tracking-tight leading-none">
                                    {pkg.price}
                                  </div>
                                  <span className="text-[10px] text-slate-500 font-century">
                                    {pkg.priceUnit || 'per sesi • all-in'}
                                  </span>
                                </div>
                              </div>

                              {/* Specification Badges */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-century text-xs">
                                {Array.isArray(pkg.facilities) && pkg.facilities.length > 0 ? (
                                  pkg.facilities.map((fac: any, fIdx: number) => (
                                    <div key={fIdx} className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-start sm:items-center gap-2 hover:border-[#A9BCA7] transition-colors">
                                      <span className="text-base shrink-0 leading-none">{fac.icon || '✨'}</span>
                                      <div className="min-w-0 flex-1">
                                        {fac.label && (
                                          <span className="text-[10px] text-stone-500 font-bold block leading-tight uppercase tracking-wider">
                                            {fac.label}
                                          </span>
                                        )}
                                        <span className="text-[#3A3A3A] font-medium leading-snug block">
                                          {fac.text}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <>
                                    {pkg.duration && (
                                      <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#5C725A] shrink-0" />
                                        <span className="text-[#3A3A3A] font-medium">{pkg.duration}</span>
                                      </div>
                                    )}
                                    {pkg.background && (
                                      <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#5C725A] shrink-0" />
                                        <span className="text-[#3A3A3A] font-medium">{pkg.background}</span>
                                      </div>
                                    )}
                                    {pkg.people && (
                                      <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-[#5C725A] shrink-0" />
                                        <span className="text-[#3A3A3A] font-medium">{pkg.people}</span>
                                      </div>
                                    )}
                                    {pkg.edit && (
                                      <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#5C725A] shrink-0" />
                                        <span className="text-[#3A3A3A] font-medium">{pkg.edit}</span>
                                      </div>
                                    )}
                                    {pkg.print && (
                                      <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-[#5C725A] shrink-0" />
                                        <span className="text-[#3A3A3A] font-medium">{pkg.print}</span>
                                      </div>
                                    )}
                                    {pkg.fileDelivery && (
                                      <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#5C725A] shrink-0" />
                                        <span className="text-[#3A3A3A] font-medium">{pkg.fileDelivery}</span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#F2E9E4]">
                                <span className="text-[11px] text-slate-500 font-century italic">
                                  {pkg.note || '*Maksimal 1 kostum wisuda (disediakan oleh klien)'}
                                </span>
                                <button
                                  onClick={() => onSelectPackageForBooking(pkg.id || 'grad-indoor-elegant-scholar')}
                                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2A2A2A] hover:bg-[#1A1A1A] active:bg-black text-[#FDFBF7] font-bold text-xs tracking-wider uppercase shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                                >
                                  <span>Pilih Paket Ini</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* SECTION: BUNDLING INDOOR + OUTDOOR */}
                    {(selectedGradSubTab === 'bundling' || (selectedGradSubTab === 'all' && activeMenuCategory !== 'grad-outdoor')) && (
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#8A5A36]"></span>
                            <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                              Bundling Packages (Indoor + Outdoor)
                            </h4>
                          </div>
                          {(() => {
                            const bList = studioPackagesList.filter((p: any) => (p.category === 'grad-bundling' || p.category === 'bundling' || (typeof p.id === 'string' && p.id.includes('bundling'))) && p.active !== false);
                            const firstPkg = bList[0];
                            const savingsText = (() => {
                              if (!firstPkg) return 'Hemat Rp 75.000';
                              const op = parseInt(String(firstPkg.originalPrice || '').replace(/[^0-9]/g, ''), 10);
                              const pr = parseInt(String(firstPkg.price || '').replace(/[^0-9]/g, ''), 10) * (String(firstPkg.price || '').toLowerCase().includes('k') ? 1000 : 1);
                              if (op && pr && op > pr) {
                                return `Hemat Rp ${(op - pr).toLocaleString('id-ID')}`;
                              }
                              return 'Hemat Rp 75.000';
                            })();
                            return (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8A5A36] bg-[#FAF0E6] px-2.5 py-0.5 rounded-full border border-[#EAD5C3]">
                                <Sparkles className="w-3 h-3" />
                                {savingsText}
                              </span>
                            );
                          })()}
                        </div>

                        {(() => {
                          const fromStudio = studioPackagesList.filter((p: any) => (p.category === 'grad-bundling' || p.category === 'bundling' || (typeof p.id === 'string' && p.id.includes('bundling'))) && p.active !== false);
                          const list = fromStudio.length > 0 ? fromStudio : [
                            {
                              id: 'grad-bundling-ultimate-1',
                              subtitle: 'Bundling 1 • Best Seller',
                              badge: 'Rekomendasi',
                              name: 'Bundling Smart 1',
                              originalPrice: 'Rp 700.000',
                              price: '625K',
                              priceUnit: 'Paket Bundling Hemat',
                              duration: '25 Menit Studio Indoor (1 Background)',
                              background: '60 Menit Sesi Kampus Malang',
                              people: '1 Wisudawan + Maks 10 Org',
                              edit: 'Edit 10 Foto High-Res Pilihan',
                              print: 'Cetak 2 Uk 10Rs / 3 Uk 4R',
                              fileDelivery: 'All File via Google Drive',
                              facilities: [
                                { icon: '🏛️', label: 'Sesi Indoor', text: '25 Menit Studio Indoor (1 Background)' },
                                { icon: '🌳', label: 'Sesi Outdoor', text: '60 Menit Sesi Kampus Malang' },
                                { icon: '👥', label: 'Kapasitas', text: '1 Wisudawan + Maks 10 Org' },
                                { icon: '✏️', label: 'Jatah Edit Foto', text: 'Edit 10 Foto High-Res Pilihan' },
                                { icon: '🖼️', label: 'Jatah Cetak', text: 'Cetak 2 Uk 10Rs / 3 Uk 4R' },
                                { icon: '📁', label: 'Pengiriman Softfile', text: 'All File via Google Drive' },
                                { icon: '🚗', label: 'Transportasi', text: 'Free Transport Fotografer' }
                              ],
                              note: '✓ Jadwal sesi indoor & outdoor dapat diatur berurutan atau berbeda jam (min. selisih 90m)'
                            },
                            {
                              id: 'grad-bundling-ultimate-2',
                              subtitle: 'Bundling 2 • Supreme',
                              badge: 'Paling Lengkap',
                              name: 'Bundling Smart 2',
                              originalPrice: 'Rp 820.000',
                              price: '745K',
                              priceUnit: 'Paket Bundling Hemat',
                              duration: '40 Menit Studio Indoor (2 Background)',
                              background: '30 Menit Sesi Kampus Malang',
                              people: '1 Wisudawan + Maks 10 Org',
                              edit: 'Edit 14 Foto High-Res Pilihan',
                              print: 'Cetak 2 Uk 10Rs / 6 Uk 4R',
                              fileDelivery: 'All File via Google Drive',
                              facilities: [
                                { icon: '🏛️', label: 'Sesi Indoor', text: '40 Menit Studio Indoor (2 Background)' },
                                { icon: '🌳', label: 'Sesi Outdoor', text: '30 Menit Sesi Kampus Malang' },
                                { icon: '👥', label: 'Kapasitas', text: '1 Wisudawan + Maks 10 Org' },
                                { icon: '✏️', label: 'Jatah Edit Foto', text: 'Edit 14 Foto High-Res Pilihan' },
                                { icon: '🖼️', label: 'Jatah Cetak', text: 'Cetak 2 Uk 10Rs / 6 Uk 4R' },
                                { icon: '📁', label: 'Pengiriman Softfile', text: 'All File via Google Drive' }
                              ],
                              note: '✓ Jadwal sesi indoor & outdoor dapat diatur berurutan atau berbeda jam (min. selisih 90m)'
                            }
                          ];

                          return list.map((pkg: any, idx: number) => {
                            const indoorFac = Array.isArray(pkg.facilities) ? pkg.facilities.find((f: any) => f.label?.toLowerCase().includes('indoor') || f.text?.toLowerCase().includes('indoor')) : null;
                            const outdoorFac = Array.isArray(pkg.facilities) ? pkg.facilities.find((f: any) => f.label?.toLowerCase().includes('outdoor') || f.text?.toLowerCase().includes('outdoor') || f.label?.toLowerCase().includes('kampus')) : null;

                            const indoorText = indoorFac?.text?.replace(/^Sesi\s*Indoor\s*:?\s*/i, '') || pkg.duration || (idx === 0 ? 'Elegant Scholar (1 Background)' : 'Supreme Scholar (2 Background)');
                            const outdoorText = outdoorFac?.text?.replace(/^Sesi\s*Outdoor\s*:?\s*/i, '') || pkg.background || (idx === 0 ? 'Smart Kampus (60 Menit)' : 'Smart Kampus (30 Menit)');

                            const originalPriceDisplay = pkg.originalPrice ? formatPriceDisplay(pkg.originalPrice) : (idx === 0 ? 'Rp 700.000' : 'Rp 820.000');
                            const promoPriceDisplay = pkg.price ? formatPriceDisplay(pkg.price) : (idx === 0 ? '625K' : '745K');
                            const badgeLabel = pkg.badge ? pkg.badge.replace(/^[⭐👑🔥✨\s]+/, '') : (idx === 0 ? 'Rekomendasi' : 'Paling Lengkap');

                            return (
                              <div
                                key={pkg.id || idx}
                                className="bg-gradient-to-br from-[#FAF8F5] via-[#FFFDF9] to-[#F5ECE5] rounded-2xl sm:rounded-3xl border-2 border-[#D8C7B9] p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all duration-200 space-y-4 relative overflow-hidden"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] font-bold text-[#8A5A36] uppercase tracking-wider font-century">
                                        {pkg.subtitle || (idx === 0 ? 'Bundling 1 • Best Seller' : 'Bundling 2 • Supreme')}
                                      </span>
                                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${idx === 0 ? 'bg-[#EBF2EA] text-[#3D6345] border-[#CDE0CB]' : 'bg-[#FAF0E6] text-[#8A5A36] border-[#EAD5C3]'}`}>
                                        {idx === 0 ? '⭐' : '👑'} {badgeLabel}
                                      </span>
                                    </div>
                                    <h4 className="text-2xl sm:text-3xl font-serif font-black text-[#2A2A2A] tracking-tight mt-0.5">
                                      {pkg.name || `Bundling Smart ${idx + 1}`}
                                    </h4>
                                  </div>
                                  <div className="sm:text-right">
                                    {originalPriceDisplay && (
                                      <span className="text-[11px] text-slate-400 line-through font-century block">
                                        {originalPriceDisplay}
                                      </span>
                                    )}
                                    <div className="text-2xl sm:text-3xl font-serif font-black text-[#2A2A2A] tracking-tight leading-none">
                                      {promoPriceDisplay}
                                    </div>
                                    <span className="text-[10px] text-[#8A5A36] font-bold font-century">
                                      {pkg.priceUnit || 'Paket Bundling Hemat'}
                                    </span>
                                  </div>
                                </div>

                                {/* Combination Pill */}
                                <div className="bg-white/80 backdrop-blur-xs border border-[#E2D2C6] rounded-xl p-3 flex flex-wrap items-center gap-2 text-xs font-century">
                                  <span className="font-bold text-[#2A2A2A] flex items-center gap-1.5">
                                    <span>🏛️</span> Sesi Indoor: {indoorText}
                                  </span>
                                  <span className="text-slate-400 font-bold">+</span>
                                  <span className="font-bold text-[#3D6345] flex items-center gap-1.5">
                                    <span>🌳</span> Sesi Outdoor: {outdoorText}
                                  </span>
                                </div>

                                {/* Specification Badges */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-century text-xs">
                                  {Array.isArray(pkg.facilities) && pkg.facilities.length > 0 ? (
                                    pkg.facilities.map((fac: any, fIdx: number) => (
                                      <div key={fIdx} className="bg-white/90 border border-[#E8DDD6] rounded-xl p-2.5 flex items-center gap-2">
                                        {renderPackageFacilityIcon(fac.icon, fac.label || fac.text)}
                                        <span className="text-[#3A3A3A] font-medium leading-snug">
                                          {fac.text}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <>
                                      <div className="bg-white/90 border border-[#E8DDD6] rounded-xl p-2.5 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#5C725A] shrink-0" />
                                        <span className="text-[#3A3A3A] font-medium"><strong className="text-[#2A2A2A]">Total 60M</strong> Indoor & Outdoor</span>
                                      </div>
                                      <div className="bg-white/90 border border-[#E8DDD6] rounded-xl p-2.5 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#8A5A36] shrink-0" />
                                        <span className="text-[#3A3A3A] font-medium"><strong className="text-[#8A5A36]">{idx === 0 ? '1' : '2'} Background</strong> Studio</span>
                                      </div>
                                      <div className="bg-white/90 border border-[#E8DDD6] rounded-xl p-2.5 flex items-center gap-2">
                                        <Trees className="w-4 h-4 text-[#5C725A] shrink-0" />
                                        <span className="text-[#3A3A3A] font-medium"><strong className="text-[#2A2A2A]">Free Transport</strong> Fotografer</span>
                                      </div>
                                      <div className="bg-white/90 border border-[#E8DDD6] rounded-xl p-2.5 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-[#5C725A] shrink-0" />
                                        <span className="text-[#3A3A3A] font-medium">Cetak <strong className="text-[#2A2A2A]">{idx === 0 ? '2 Uk 10Rs / 3 Uk 4R' : '2 Uk 10Rs / 6 Uk 4R'}</strong></span>
                                      </div>
                                      <div className="bg-white/90 border border-[#E8DDD6] rounded-xl p-2.5 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-[#5C725A] shrink-0" />
                                        <span className="text-[#3A3A3A] font-medium"><strong className="text-[#2A2A2A]">1 Wisudawan</strong> + Maks 10 Org</span>
                                      </div>
                                      <div className="bg-white/90 border border-[#E8DDD6] rounded-xl p-2.5 flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#5C725A] shrink-0" />
                                        <span className="text-[#3A3A3A] font-medium"><strong className="text-[#2A2A2A]">All File</strong> via Google Drive</span>
                                      </div>
                                    </>
                                  )}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E8DDD6]">
                                  <span className="text-[11px] text-[#5C725A] font-bold font-century">
                                    {pkg.note || '✓ Jadwal sesi indoor & outdoor dapat diatur berurutan atau berbeda jam (min. selisih 90m)'}
                                  </span>
                                  <button
                                    onClick={() => onSelectPackageForBooking(pkg.id || (idx === 0 ? 'grad-bundling-ultimate-1' : 'grad-bundling-ultimate-2'))}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2A2A2A] hover:bg-black active:bg-slate-900 text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                                  >
                                    <span>Pesan {pkg.name ? (pkg.name.toLowerCase().includes('bundling') ? pkg.name : `Bundling ${pkg.name}`) : `Bundling ${idx + 1}`}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}

                    {/* SECTION: OUTDOOR SESSIONS */}
                    {(selectedGradSubTab === 'all' || selectedGradSubTab === 'outdoor' || activeMenuCategory === 'grad-outdoor') && (
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#3D6345]"></span>
                            <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                              Outdoor Campus Sessions
                            </h4>
                          </div>
                          <span className="text-[11px] font-medium text-slate-500 font-century">
                            Area Kampus Malang & Sekitarnya
                          </span>
                        </div>

                        {/* Outdoor 1: Smart Outdoor */}
                        {(() => {
                          const pkgSmart30 = studioPackagesList.find((p: any) => p.id === 'grad-outdoor-smart-30') ||
                            studioPackagesList.find((p: any) => (p.category === 'grad-outdoor' || p.category === 'graduation-outdoor') && (p.duration?.includes('30') || p.name?.includes('30') || p.subtitle?.includes('30'))) ||
                            getPkg('grad-outdoor-smart-30');
                          const pkgSmart60 = studioPackagesList.find((p: any) => p.id === 'grad-outdoor-smart-60') ||
                            studioPackagesList.find((p: any) => (p.category === 'grad-outdoor' || p.category === 'graduation-outdoor') && (p.duration?.includes('60') || p.name?.includes('60') || p.subtitle?.includes('60'))) ||
                            getPkg('grad-outdoor-smart-60');
                          const price30 = pkgSmart30?.price ? formatPriceDisplay(pkgSmart30.price) : getPkgPrice('grad-outdoor-smart-30', '295K');
                          const price60 = pkgSmart60?.price ? formatPriceDisplay(pkgSmart60.price) : getPkgPrice('grad-outdoor-smart-60', '375K');
                          const smartSubtitle = pkgSmart30?.subtitle ? pkgSmart30.subtitle.replace(/\s*\([^)]*\)/, '') : 'Graduation Outdoor 1';

                          const facilities = Array.isArray(pkgSmart60?.facilities) && pkgSmart60.facilities.length > 0 ? pkgSmart60.facilities : [
                            { icon: '👥', label: 'Kapasitas', text: '1 Wisudawan + Keluarga / Teman' },
                            { icon: '🌳', label: 'Lokasi Sesi', text: 'Unlimited Around Campus' },
                            { icon: '✏️', label: 'Jatah Edit Foto', text: 'Edit 10 Foto High-Res' },
                            { icon: '🚗', label: 'Transportasi', text: 'Free Transport Fotografer' },
                            { icon: '📁', label: 'Pengiriman File', text: 'All File via Google Drive' }
                          ];

                          return (
                            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DDD6] hover:border-[#A9BCA7] p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                                <div>
                                  <span className="text-[11px] font-bold text-[#8A7D71] uppercase tracking-wider font-century">
                                    {smartSubtitle}
                                  </span>
                                  <h4 className="text-2xl sm:text-3xl font-serif font-black text-[#2A2A2A] tracking-tight mt-0.5">
                                    Smart Outdoor
                                  </h4>
                                </div>
                                <div className="sm:text-right">
                                  <span className="text-xs text-slate-500 font-century">Pilihan Durasi Sesi:</span>
                                  <div className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                                    {price30} <span className="text-xs font-normal text-slate-400 font-century">(30m)</span> / {price60} <span className="text-xs font-normal text-slate-400 font-century">(60m)</span>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-century text-xs">
                                {facilities.map((fac: any, fIdx: number) => (
                                  <div key={fIdx} className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                                    {renderPackageFacilityIcon(fac.icon, fac.label || fac.text)}
                                    <span className="text-[#3A3A3A] font-medium leading-snug">{fac.text}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#F2E9E4]">
                                <span className="text-[11px] text-slate-500 font-century italic">
                                  {pkgSmart60?.note || pkgSmart30?.note || '*Fotografer siap datang langsung ke kampus pilihan Anda di Malang'}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => onSelectPackageForBooking(pkgSmart30?.id || 'grad-outdoor-smart-30')}
                                    className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#EBF2EA] hover:bg-[#DEE9DD] text-[#3D6345] border border-[#CDE0CB] font-bold text-xs cursor-pointer active:scale-95 transition-all"
                                  >
                                    Pesan 30M ({price30})
                                  </button>
                                  <button
                                    onClick={() => onSelectPackageForBooking(pkgSmart60?.id || 'grad-outdoor-smart-60')}
                                    className="flex-1 sm:flex-none px-5 py-2 rounded-full bg-[#2A2A2A] hover:bg-black text-white font-bold text-xs cursor-pointer active:scale-95 shadow-sm transition-all"
                                  >
                                    Pesan 60M ({price60})
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Outdoor 2: Cumlaude Foto + Video */}
                        {(() => {
                          const pkgCumlaude = studioPackagesList.find((p: any) => p.id === 'grad-outdoor-cumlaude') ||
                            studioPackagesList.find((p: any) => (p.category === 'grad-outdoor' || p.category === 'graduation-outdoor') && (p.name?.toLowerCase().includes('cumlaude') || p.subtitle?.toLowerCase().includes('cumlaude') || p.name?.toLowerCase().includes('video'))) ||
                            getPkg('grad-outdoor-cumlaude');
                          const cumlaudePrice = pkgCumlaude?.price ? formatPriceDisplay(pkgCumlaude.price) : getPkgPrice('grad-outdoor-cumlaude', '750K');
                          const cumlaudeOrigPrice = pkgCumlaude?.originalPrice ? formatPriceDisplay(pkgCumlaude.originalPrice) : 'Rp 850.000';
                          const facilities = Array.isArray(pkgCumlaude?.facilities) && pkgCumlaude.facilities.length > 0 ? pkgCumlaude.facilities : [
                            { icon: '⏰', label: 'Durasi Sesi', text: '75 Menit Sesi Foto & Video' },
                            { icon: '🎬', label: 'Video Sinematik', text: 'Include Video Reels Cinematic 9:16' },
                            { icon: '✏️', label: 'Jatah Edit Foto', text: 'Edit 12 Foto High-Res + Video HD' },
                            { icon: '🌳', label: 'Lokasi Sesi', text: 'Area Kampus Universitas (Spot Ikonik)' },
                            { icon: '👥', label: 'Kapasitas', text: '1 Wisudawan + Keluarga / Pendamping' },
                            { icon: '📁', label: 'Pengiriman File', text: 'All File Foto & Video via Google Drive' }
                          ];

                          return (
                            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DDD6] hover:border-[#A9BCA7] p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-[#8A7D71] uppercase tracking-wider font-century">
                                      {pkgCumlaude?.subtitle || 'Graduation Outdoor 2'}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF0E6] text-[#8A5A36] border border-[#EAD5C3]">
                                      <Video className="w-3 h-3 text-[#8A5A36]" />
                                      {pkgCumlaude?.badge || 'Include Video'}
                                    </span>
                                  </div>
                                  <h4 className="text-2xl sm:text-3xl font-serif font-black text-[#2A2A2A] tracking-tight mt-0.5">
                                    {pkgCumlaude?.name || 'Cumlaude (Foto + Video)'}
                                  </h4>
                                </div>
                                <div className="sm:text-right">
                                  {cumlaudeOrigPrice && (
                                    <span className="text-[11px] text-slate-400 line-through font-century block">
                                      {cumlaudeOrigPrice}
                                    </span>
                                  )}
                                  <div className="text-2xl sm:text-3xl font-serif font-black text-[#2A2A2A] tracking-tight leading-none">
                                    {cumlaudePrice}
                                  </div>
                                  <span className="text-[10px] text-slate-500 font-century">
                                    {pkgCumlaude?.priceUnit || '75 Menit • Full Package'}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-century text-xs">
                                {facilities.map((fac: any, fIdx: number) => (
                                  <div key={fIdx} className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-2.5 flex items-center gap-2">
                                    {renderPackageFacilityIcon(fac.icon, fac.label || fac.text)}
                                    <span className="text-[#3A3A3A] font-medium leading-snug">{fac.text}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#F2E9E4]">
                                <span className="text-[11px] text-slate-500 font-century italic">
                                  {pkgCumlaude?.note || '*Format video vertikal 9:16 siap posting ke Instagram Reels & TikTok'}
                                </span>
                                <button
                                  onClick={() => onSelectPackageForBooking(pkgCumlaude?.id || 'grad-outdoor-cumlaude')}
                                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2A2A2A] hover:bg-black text-[#FDFBF7] font-bold text-xs tracking-wider uppercase shadow-sm transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                                >
                                  <span>Pilih Paket {pkgCumlaude?.name ? (pkgCumlaude.name.includes('Cumlaude') ? 'Cumlaude' : pkgCumlaude.name) : 'Cumlaude'}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Outdoor 3: Group Wisuda Outdoor */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DDD6] hover:border-[#A9BCA7] p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                            <div>
                              <span className="text-[11px] font-bold text-[#8A7D71] uppercase tracking-wider font-century">
                                Graduation Outdoor 3
                              </span>
                              <h4 className="text-2xl sm:text-3xl font-serif font-black text-[#2A2A2A] tracking-tight mt-0.5">
                                Group Wisuda Outdoor
                              </h4>
                              <p className="text-xs text-slate-600 font-century mt-0.5">
                                Sesi wisuda bersama sahabat satu jurusan/geng di area kampus (termasuk foto bersama keluarga).
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            {/* Group 2 */}
                            <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-2xl p-4 flex flex-col justify-between space-y-3">
                              <div>
                                <span className="text-[10px] font-bold text-[#5C725A] bg-[#EBF2EA] px-2 py-0.5 rounded-full uppercase">
                                  2 Wisudawan
                                </span>
                                <div className="text-lg font-serif font-bold text-[#2A2A2A] mt-1.5">Group 2 Orang</div>
                                <div className="text-xs text-slate-600 font-century space-y-0.5 mt-1">
                                  <p>⏱️ 75 Menit Sesi Foto</p>
                                  <p>✨ Edit 20 Foto High-Res</p>
                                  <p className="text-[11px] text-slate-500 font-semibold pt-1">Rp 255.000 / wisudawan</p>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-[#E8DDD6] flex items-center justify-between">
                                <span className="text-xl font-serif font-black text-[#2A2A2A]">{getPkgPrice('grad-outdoor-group-2', '510K')}</span>
                                <button
                                  onClick={() => onSelectPackageForBooking('grad-outdoor-group-2')}
                                  className="px-4 py-1.5 rounded-full bg-[#2A2A2A] hover:bg-black text-white text-xs font-bold font-century cursor-pointer active:scale-95"
                                >
                                  Pesan
                                </button>
                              </div>
                            </div>

                            {/* Group 3 */}
                            <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-2xl p-4 flex flex-col justify-between space-y-3">
                              <div>
                                <span className="text-[10px] font-bold text-[#5C725A] bg-[#EBF2EA] px-2 py-0.5 rounded-full uppercase">
                                  3 Wisudawan
                                </span>
                                <div className="text-lg font-serif font-bold text-[#2A2A2A] mt-1.5">Group 3 Orang</div>
                                <div className="text-xs text-slate-600 font-century space-y-0.5 mt-1">
                                  <p>⏱️ 90 Menit Sesi Foto</p>
                                  <p>✨ Edit 30 Foto High-Res</p>
                                  <p className="text-[11px] text-slate-500 font-semibold pt-1">Rp 210.000 / wisudawan</p>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-[#E8DDD6] flex items-center justify-between">
                                <span className="text-xl font-serif font-black text-[#2A2A2A]">{getPkgPrice('grad-outdoor-group-3', '630K')}</span>
                                <button
                                  onClick={() => onSelectPackageForBooking('grad-outdoor-group-3')}
                                  className="px-4 py-1.5 rounded-full bg-[#2A2A2A] hover:bg-black text-white text-xs font-bold font-century cursor-pointer active:scale-95"
                                >
                                  Pesan
                                </button>
                              </div>
                            </div>

                            {/* Group 4-5 */}
                            <div className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-2xl p-4 flex flex-col justify-between space-y-3">
                              <div>
                                <span className="text-[10px] font-bold text-[#8A5A36] bg-[#FAF0E6] px-2 py-0.5 rounded-full uppercase">
                                  4-5 Wisudawan
                                </span>
                                <div className="text-lg font-serif font-bold text-[#2A2A2A] mt-1.5">Group 4-5 Orang</div>
                                <div className="text-xs text-slate-600 font-century space-y-0.5 mt-1">
                                  <p>⏱️ 120 Menit Sesi Foto</p>
                                  <p>✨ Edit 40 Foto High-Res</p>
                                  <p className="text-[11px] text-slate-500 font-semibold pt-1">Rp 180.000 / wisudawan</p>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-[#E8DDD6] flex items-center justify-between">
                                <span className="text-xl font-serif font-black text-[#2A2A2A]">{getPkgPrice('grad-outdoor-group-4-5', '900K')}</span>
                                <button
                                  onClick={() => onSelectPackageForBooking('grad-outdoor-group-4-5')}
                                  className="px-4 py-1.5 rounded-full bg-[#2A2A2A] hover:bg-black text-white text-xs font-bold font-century cursor-pointer active:scale-95"
                                >
                                  Pesan
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Paket Outdoor Tambahan dari Dashboard Studio */}
                          {(() => {
                            const customOutdoor = (((studioConfig as any)?.studioPackages || []) as any[])
                              .filter((p: any) => (p.category === 'grad-outdoor' || p.category === 'graduation-outdoor') && !['grad-outdoor-smart-30', 'grad-outdoor-smart-60', 'grad-outdoor-cumlaude', 'grad-outdoor-group-2', 'grad-outdoor-group-3', 'grad-outdoor-group-4-5'].includes(p.id) && p.active !== false);
                            if (customOutdoor.length === 0) return null;
                            return (
                              <div className="space-y-3 pt-3">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-[#3D6345]"></span>
                                  <h5 className="font-serif font-bold text-xs sm:text-sm text-[#2A2A2A] uppercase tracking-wider">
                                    Paket Outdoor Kustom Studio ({customOutdoor.length} Paket Tambahan)
                                  </h5>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {customOutdoor.map((pkg: any) => (
                                    <div key={pkg.id} className="bg-white rounded-2xl border border-[#E8DDD6] hover:border-[#A9BCA7] p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all space-y-2.5">
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <span className="text-[10px] font-bold text-[#8A7D71] uppercase font-century">{pkg.subtitle || 'Outdoor Kampus'}</span>
                                          <h5 className="text-base sm:text-lg font-serif font-bold text-[#2A2A2A]">{pkg.name}</h5>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-base sm:text-lg font-serif font-black text-[#2A2A2A]">{formatPriceDisplay(pkg.price)}</span>
                                          <span className="text-[9.5px] text-slate-500 font-century block">{pkg.priceUnit || 'per sesi'}</span>
                                        </div>
                                      </div>
                                      {pkg.description && <p className="text-xs text-slate-600 font-century line-clamp-2">{pkg.description}</p>}
                                      <button
                                        onClick={() => onSelectPackageForBooking(pkg.id)}
                                        className="w-full py-2 rounded-xl bg-[#2A2A2A] hover:bg-black text-white font-bold text-xs font-century cursor-pointer active:scale-95 transition-all text-center"
                                      >
                                        Pesan Paket
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* SECTION: ADDITIONAL GRADUATION */}
                    {(selectedGradSubTab === 'all' || selectedGradSubTab === 'additional') && (
                      <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F2E9E4]/60 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#E8DDD6] shadow-xs space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                          <div>
                            <h4 className="font-serif font-bold text-base text-[#2A2A2A] tracking-wide">
                              Layanan Tambahan (Additional Graduation)
                            </h4>
                            <p className="text-xs text-slate-500 font-century">
                              Kustomisasi sesi wisuda Anda dengan opsi add-on resmi Alviero Studio.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#2A2A2A] font-century">
                          {(activeMenuCategory === 'grad-outdoor' ? [
                            { name: 'Tambahan Waktu Foto (per 10 Menit)', price: getAddOnPriceDisplay('grad-outdoor-extra-time', '50K'), icon: '⏱️' },
                            { name: 'Make Up Wisuda Outdoor', price: getAddOnPriceDisplay('grad-outdoor-makeup', '280K'), icon: '💄' },
                            { name: 'Hairdo Wisuda Outdoor', price: getAddOnPriceDisplay('grad-outdoor-hairdo', '150K'), icon: '💇' },
                            { name: 'Edit Foto Tambahan High-Res', price: '10K', icon: '✨' },
                            { name: 'Softfile Cetak Full Resolution', price: '15K', icon: '💾' },
                            { name: 'Bingkai 10Rs Minimalis Kayu', price: '55K', icon: '🖼️' },
                            { name: 'Cetak Foto Lab Ukuran 10Rs', price: '25K', icon: '🖨️' },
                          ] : [
                            { name: 'Background Studio Tambahan', price: '75K', icon: '🎨' },
                            { name: 'Anggota / Orang Tambahan', price: '40K', icon: '👥' },
                            { name: 'Edit Foto Tambahan', price: '10K', icon: '✨' },
                            { name: 'Ganti Kostum / Outfit Tambahan', price: '50K', icon: '👗' },
                            { name: 'Softfile Cetak Full Resolution', price: '15K', icon: '💾' },
                            { name: 'Bingkai 10Rs Minimalis', price: '55K', icon: '🖼️' },
                            { name: 'Cetak Foto Lab Ukuran 10Rs', price: '25K', icon: '🖨️' },
                          ]).map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-white/90 border border-[#E8DDD6] rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-2xs hover:bg-white transition-colors"
                            >
                              <span className="flex items-center gap-2 font-medium">
                                <span>{item.icon}</span>
                                <span>+ {item.name}</span>
                              </span>
                              <span className="font-serif font-black text-sm text-[#2A2A2A] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#EFE5DC]">
                                {item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Disclaimer Banner Link */}
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={handleGoToDisclaimer}
                        className="inline-flex items-center gap-2 text-xs text-[#3D6345] hover:text-[#2A4630] font-bold font-century cursor-pointer transition-all hover:scale-102 active:scale-95 bg-[#EBF2EA] hover:bg-[#DEE9DD] px-4 py-2 rounded-full border border-[#CDE0CB] shadow-2xs"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-[#5C725A]" />
                        <span>Harap membaca panduan & disclaimer sebelum melakukan reservasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                )}

                {/* 14. SPECIAL FIGMA VIEW FOR BINGKAI DAN ALBUM */}
                {activeMenuCategory === 'bingkai-album' && (
                  <div className="space-y-6 animate-in fade-in duration-300">

                    {/* Filter Sub-Kategori */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-mask-x no-scrollbar">
                      {[
                        { id: 'all', label: '📑 Semua Produk (Cetak, Bingkai, Album)', icon: '✨' },
                        { id: 'cetak', label: '🖨️ Pricelist Cetak Foto Lab', icon: '🖨️' },
                        { id: 'bingkai', label: '🖼️ Pricelist Bingkai Foto', icon: '🖼️' },
                        { id: 'album', label: '📖 Pricelist Album Foto', icon: '📖' },
                      ].map((filter) => {
                        const isSelected = selectedBingkaiSubTab === filter.id;
                        return (
                          <button
                            key={filter.id}
                            onClick={() => setSelectedBingkaiSubTab(filter.id as any)}
                            className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${isSelected
                              ? 'bg-slate-900 text-white shadow-md'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                          >
                            <span>{filter.icon}</span>
                            <span>{filter.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* ================================================================ */}
                    {/* 1. BAGIAN: PRICELIST CETAK FOTO (LAB PHOTO PRINTING)             */}
                    {/* ================================================================ */}
                    {(selectedBingkaiSubTab === 'all' || selectedBingkaiSubTab === 'cetak') && (
                      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-md space-y-5">

                        {/* Header Cetak Foto */}
                        <div className="text-center space-y-1 pb-2 border-b border-slate-100">
                          <div className="flex items-center justify-center gap-1.5 mb-1">
                            <div className="font-black text-xs text-slate-900 tracking-widest leading-none uppercase">
                              ALVIERO STUDIO
                            </div>
                          </div>
                          <h3 className="font-black text-xl sm:text-2xl text-slate-900 tracking-wider uppercase">
                            PRICELIST CETAK FOTO
                          </h3>
                          <p className="text-xs text-slate-500">
                            Cetak foto kualitas lab premium, warna tahan lama, tajam dan anti pudar
                          </p>
                        </div>

                        {/* Visual Perbandingan Ukuran Cetak */}
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-700 text-white space-y-3 shadow-inner">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Simulasi Skala Ukuran Cetak Foto Lab:</span>
                            </span>
                            <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                              Kertas Doff / Glossy Lab
                            </span>
                          </div>

                          {/* Visual Skala Layered Frames */}
                          <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-end justify-start p-3 sm:p-4">
                            <img
                              src={labPrintBannerImage || "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85"}
                              alt="Perbandingan Ukuran Cetak Foto"
                              className="absolute inset-0 w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                            {/* Tag Penanda Ukuran */}
                            <div className="relative z-10 flex flex-wrap gap-1.5 text-[9.5px] sm:text-xs font-bold">
                              <span className="bg-red-600/90 text-white px-2 py-0.5 rounded-md border border-red-400/40">24Rs (60x90cm)</span>
                              <span className="bg-amber-600/90 text-white px-2 py-0.5 rounded-md border border-amber-400/40">20Rs (50x75cm)</span>
                              <span className="bg-emerald-600/90 text-white px-2 py-0.5 rounded-md border border-emerald-400/40">16Rs (40x60cm)</span>
                              <span className="bg-blue-600/90 text-white px-2 py-0.5 rounded-md border border-blue-400/40">12Rs (30.5x45cm)</span>
                              <span className="bg-purple-600/90 text-white px-2 py-0.5 rounded-md border border-purple-400/40">10Rs (20.3x30.5cm)</span>
                              <span className="bg-pink-600/90 text-white px-2 py-0.5 rounded-md border border-pink-400/40">4R / 5R / 6R</span>
                            </div>
                          </div>
                        </div>

                        {/* Tabel Daftar Harga Cetak Foto */}
                        <div className="overflow-hidden rounded-2xl border-2 border-slate-200 shadow-2xs">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-900 text-white font-black tracking-wider uppercase">
                                <th className="py-3 px-4 text-center w-24">KODE</th>
                                <th className="py-3 px-4">UKURAN (cm)</th>
                                <th className="py-3 px-4 text-right">HARGA CETAK</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 font-semibold text-slate-800 bg-white">
                              {activeLabPrintItems.map((item: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-2.5 px-4 text-center font-black text-slate-900 bg-slate-50/80">
                                    {item.code}
                                  </td>
                                  <td className="py-2.5 px-4 text-slate-700">
                                    <div>{item.size}</div>
                                    <div className="text-[10px] text-slate-400">{item.note}</div>
                                  </td>
                                  <td className="py-2.5 px-4 text-right font-black text-sm text-emerald-700">
                                    {item.price}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* ================================================================ */}
                    {/* 2. BAGIAN: PRICELIST BINGKAI FOTO (PHOTO FRAMES)                 */}
                    {/* ================================================================ */}
                    {(selectedBingkaiSubTab === 'all' || selectedBingkaiSubTab === 'bingkai') && (
                      <div className="bg-[#f7efe6] rounded-3xl p-5 sm:p-7 border border-[#e6d8c8] shadow-md space-y-6">

                        {/* Header Bingkai Foto */}
                        <div className="text-center space-y-1 pb-2 border-b border-[#e2d0bd]">
                          <div className="flex items-center justify-center gap-1.5 mb-1">
                            <div className="font-black text-xs text-amber-900 tracking-widest leading-none uppercase">
                              ALVIERO STUDIO
                            </div>
                          </div>
                          <h3 className="font-serif font-black text-xl sm:text-3xl text-amber-950 tracking-wider uppercase">
                            PRICELIST BINGKAI FOTO
                          </h3>
                          <p className="text-xs text-stone-600 font-medium">
                            Bingkai kayu & minimalis elegan lengkap dengan kaca pelindung dan gantungan dinding/penyangga meja
                          </p>
                        </div>

                        {/* 6 Kartu Bingkai Foto Berdampingan (Sesuai Desain Poster) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          {activeFrameItems.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-lg transition-all"
                            >
                              <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2">
                                <div>
                                  <span className="font-serif font-black text-lg sm:text-xl text-stone-900">
                                    {item.code}
                                  </span>
                                  <span className="text-xs text-stone-500 font-bold ml-2">
                                    ({item.size})
                                  </span>
                                </div>
                                <div className="font-serif font-black text-xl sm:text-2xl text-amber-900">
                                  {item.price}
                                </div>
                              </div>

                              {/* Foto Visual Frame */}
                              <div className="relative aspect-[4/3] bg-stone-900 rounded-2xl overflow-hidden shadow-inner">
                                <img
                                  src={item.image}
                                  alt={`Bingkai Ukuran ${item.code}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                  {item.type}
                                </div>
                                <div className="absolute bottom-2.5 right-2.5 bg-amber-500 text-stone-950 font-black text-xs px-2.5 py-0.5 rounded-md shadow-sm">
                                  {item.size}
                                </div>
                              </div>

                              <p className="text-xs text-stone-600 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ================================================================ */}
                    {/* 3. BAGIAN: PRICELIST ALBUM FOTO (PHOTO ALBUMS)                   */}
                    {/* ================================================================ */}
                    {(selectedBingkaiSubTab === 'all' || selectedBingkaiSubTab === 'album') && (
                      <div className="bg-[#e4ecf5] rounded-3xl p-5 sm:p-7 border border-[#cbd9e8] shadow-md space-y-6">

                        {/* Header Album Foto */}
                        <div className="text-center space-y-1 pb-2 border-b border-[#c2d3e5]">
                          <div className="flex items-center justify-center gap-1.5 mb-1">
                            <div className="font-black text-xs text-slate-800 tracking-widest leading-none uppercase">
                              ALVIERO STUDIO
                            </div>
                          </div>
                          <h3 className="font-serif font-black text-xl sm:text-3xl text-slate-900 tracking-wider uppercase">
                            PRICELIST ALBUM
                          </h3>
                          <p className="text-xs text-slate-600 font-medium">
                            Koleksi album foto hardcover & magnetik eksklusif untuk menyimpan rapi momen berharga Anda
                          </p>
                        </div>

                        {/* 8 Kartu Album Foto (Sesuai Desain Poster) */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
                          {activeAlbumItems.map((album: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-white/90 rounded-2xl p-3 sm:p-4 border border-blue-200/70 shadow-xs flex flex-col justify-between space-y-2.5 text-center hover:bg-white hover:shadow-md transition-all group"
                            >
                              <div className="relative aspect-square bg-slate-900 rounded-xl overflow-hidden shadow-inner">
                                <img
                                  src={album.image}
                                  alt={album.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 right-2 bg-blue-600 text-white text-[8.5px] font-bold px-2 py-0.5 rounded-md">
                                  {album.badge}
                                </div>
                              </div>

                              <div className="space-y-0.5">
                                <h5 className="font-serif font-black text-xs text-slate-900 leading-tight">
                                  {album.name}
                                </h5>
                                <p className="text-[10px] text-slate-500 font-bold">
                                  {album.capacity}
                                </p>
                                <div className="font-serif font-black text-sm sm:text-base text-blue-900 pt-0.5">
                                  {album.price}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Disclaimer & WhatsApp Order CTA */}
                    <div className="bg-slate-100 p-4 sm:p-5 rounded-3xl border border-slate-300 text-center space-y-3">
                      <p className="text-xs text-slate-700 font-medium">
                        Ingin pesan cetak foto, custom bingkai pigura, atau album kenangan?
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                          href={`https://wa.me/${currentBranchInfo.whatsappNumber || (selectedBranch === 'cabang-2' ? '6285168879214' : '6287777538164')}?text=Halo%20Admin%20${encodeURIComponent(currentBranchInfo.name)},%20saya%20ingin%20pesan%20Cetak%20Foto%20/%20Bingkai%20/%20Album`}
                          target="_blank"
                          rel="noreferrer"
                          className="min-h-[40px] px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Order via WhatsApp Admin</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleGoToDisclaimer}
                          className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-white px-4 py-2 rounded-full border border-rose-200 shadow-2xs"
                        >
                          <span>⚠️ Harap Membaca Disclaimer pada halaman Disclaimer</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* 15. MODERN LUXURY KEBAYA & GAUN WARDROBE VIEW (100% DINAMIS DARI DASHBOARD) */}
                {activeMenuCategory === 'kebayak-gaun' && (
                  <div className="space-y-6 animate-in fade-in duration-300">

                    {/* Header Editorial Luxury Dinamis dari Dashboard */}
                    {(() => {
                      const wardrobeCfg = (studioConfig as any)?.wardrobeConfig;
                      const wHeader = wardrobeCfg?.header || {
                        tag: 'COLLECTION 2026 • WARDROBE STUDIO',
                        title: 'Koleksi Kebaya Modern & Gaun Foto',
                        subtitle: 'Pilihan busana kebaya wisuda, gaun modern & pakaian adat siap pakai untuk sesi pemotretan Anda di Studio 1 (Junrejo) & Studio 2 (Dinoyo).'
                      };
                      const wRates = (Array.isArray(wardrobeCfg?.rentalRates) && wardrobeCfg.rentalRates.length > 0)
                        ? wardrobeCfg.rentalRates
                        : [
                            {
                              id: 'rate-personal',
                              badge: 'Sewa Personal (1 Orang)',
                              badgeColor: 'green',
                              title: '1 Set Kebaya / Gaun Wisuda Personal',
                              price: 'Rp 115.000',
                              features: [
                                'Include 1 Baju Kebaya / Gaun Modern Pilihan',
                                'Include Kain Jarik / Rok Lilit Senada',
                                'Include Aksesoris Bros Dada / Manset'
                              ]
                            },
                            {
                              id: 'rate-couple',
                              badge: 'Sewa Couple (2 Orang)',
                              badgeColor: 'brown',
                              title: 'Setelan Couple (Wanita & Pria)',
                              price: 'Rp 215.000',
                              features: [
                                '1 Baju Kebaya Wanita + Kain Jarik / Rok',
                                '1 Kemeja Batik / Beskap Pria Senada',
                                'Include Blangkon & Aksesoris Lengkap'
                              ]
                            }
                          ];
                      const wSizeChart = wardrobeCfg?.sizeChart || {
                        title: 'Panduan Ukuran Busana (Kebaya Size Chart)',
                        subtitle: 'Tersedia ukuran S, M, L, XL, hingga XXL dengan fitting room privat di studio',
                        note: '*Setiap kebaya dilengkapi tali atau kancing penyesuai agar pas di tubuh. Tersedia kamar ganti ber-AC privat di studio.',
                        rows: [
                          { size: 'S', bust: '86 – 88 cm', waist: '68 – 72 cm', length: '65 cm', weight: '40 – 48 kg' },
                          { size: 'M', bust: '90 – 94 cm', waist: '74 – 78 cm', length: '68 cm', weight: '48 – 55 kg' },
                          { size: 'L', bust: '96 – 100 cm', waist: '80 – 84 cm', length: '70 cm', weight: '55 – 63 kg' },
                          { size: 'XL', bust: '102 – 106 cm', waist: '86 – 90 cm', length: '72 cm', weight: '63 – 72 kg' },
                          { size: 'XXL', bust: '108 – 114 cm', waist: '92 – 98 cm', length: '75 cm', weight: '72 – 82 kg' }
                        ]
                      };

                      return (
                        <>
                          <div className="space-y-2.5 border-b border-[#E8DDD6] pb-4">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#8A5A36] bg-[#FAF0E6] px-2.5 py-0.5 rounded-full border border-[#EAD5C3]">
                                <Sparkles className="w-3 h-3 text-[#8A5A36]" />
                                {wHeader.tag || 'COLLECTION 2026 • WARDROBE STUDIO'}
                              </span>
                              <span className="text-[11px] font-medium text-slate-400 font-serif">Alviero Studio</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A] tracking-tight">
                                  {wHeader.title || 'Koleksi Kebaya Modern & Gaun Foto'}
                                </h3>
                                <p className="text-xs text-slate-600 font-century leading-relaxed mt-0.5">
                                  {wHeader.subtitle || 'Pilihan busana kebaya wisuda, gaun modern & pakaian adat siap pakai untuk sesi pemotretan Anda di Studio 1 (Junrejo) & Studio 2 (Dinoyo).'}
                                </p>
                              </div>
                              {onOpenBeautyModal && (
                                <button
                                  type="button"
                                  onClick={onOpenBeautyModal}
                                  className="min-h-[38px] px-4 py-2 rounded-full bg-[#2A2A2A] hover:bg-black text-white text-xs font-serif font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
                                >
                                  <span>💄 Buka Paket MUA Lengkap</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Banner Tarif Sewa Wardrobe Dinamis */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {wRates.map((rate: any, rIdx: number) => {
                              const isGreen = rate.badgeColor === 'green' || rIdx === 0;
                              return (
                                <div key={rate.id || rIdx} className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DDD6] shadow-xs space-y-2 hover:border-[#A9BCA7] transition-all">
                                  <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-century ${
                                      isGreen ? 'text-[#5C725A] bg-[#EBF2EA]' : 'text-[#8A5A36] bg-[#FAF0E6]'
                                    }`}>
                                      {rate.badge || (isGreen ? 'Sewa Personal (1 Orang)' : 'Sewa Couple (2 Orang)')}
                                    </span>
                                    <span className="text-xl sm:text-2xl font-serif font-black text-[#2A2A2A]">
                                      {rate.price || (isGreen ? 'Rp 115.000' : 'Rp 215.000')}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-serif font-bold text-[#2A2A2A]">
                                    {rate.title || (isGreen ? '1 Set Kebaya / Gaun Wisuda Personal' : 'Setelan Couple (Wanita & Pria)')}
                                  </h4>
                                  {Array.isArray(rate.features) && rate.features.length > 0 && (
                                    <div className="space-y-1 text-xs text-stone-600 font-century pt-1 border-t border-[#F2E9E4]">
                                      {rate.features.map((feat: string, fIdx: number) => (
                                        <p key={fIdx} className="flex items-center gap-1.5">
                                          <Check className={`w-3.5 h-3.5 shrink-0 ${isGreen ? 'text-[#5C725A]' : 'text-[#8A5A36]'}`} />
                                          <span>{feat}</span>
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Panduan Ukuran Size Chart Accordion Dinamis */}
                          <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-2xl overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => setIsSizeChartOpen(!isSizeChartOpen)}
                              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F2E9E4]/60 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-base">📏</span>
                                <div>
                                  <div className="text-xs sm:text-sm font-serif font-bold text-[#2A2A2A]">
                                    {wSizeChart.title || 'Panduan Ukuran Busana (Kebaya Size Chart)'}
                                  </div>
                                  <p className="text-[10.5px] text-stone-500 font-century">
                                    {wSizeChart.subtitle || 'Tersedia ukuran S, M, L, XL, hingga XXL dengan fitting room privat di studio'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-xs font-bold text-[#5C725A] font-century">
                                <span>{isSizeChartOpen ? 'Tutup Tabel' : 'Lihat Ukuran'}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSizeChartOpen ? 'rotate-180' : ''}`} />
                              </div>
                            </button>

                            {isSizeChartOpen && (
                              <div className="p-4 pt-0 border-t border-[#E8DDD6] animate-in fade-in duration-200">
                                <div className="overflow-x-auto no-scrollbar pt-3">
                                  <table className="w-full text-xs font-century text-left border-collapse">
                                    <thead>
                                      <tr className="bg-[#EBF2EA] text-[#2A2A2A] font-bold text-[11px] uppercase tracking-wider border-b border-[#D0E2CE]">
                                        <th className="py-2.5 px-3 rounded-l-lg">Ukuran</th>
                                        <th className="py-2.5 px-3">Lingkar Dada (LD)</th>
                                        <th className="py-2.5 px-3">Lingkar Pinggang</th>
                                        <th className="py-2.5 px-3">Panjang Baju</th>
                                        <th className="py-2.5 px-3 rounded-r-lg">Estimasi Berat Badan</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#EFE5DC] text-stone-700">
                                      {Array.isArray(wSizeChart.rows) && wSizeChart.rows.map((row: any, rIdx: number) => (
                                        <tr key={row.size || rIdx}>
                                          <td className={`py-2.5 px-3 font-bold text-[#2A2A2A] ${rIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'}`}>{row.size}</td>
                                          <td className={`py-2.5 px-3 ${rIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'}`}>{row.bust}</td>
                                          <td className={`py-2.5 px-3 ${rIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'}`}>{row.waist}</td>
                                          <td className={`py-2.5 px-3 ${rIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'}`}>{row.length}</td>
                                          <td className={`py-2.5 px-3 ${rIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'}`}>{row.weight}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                {wSizeChart.note && (
                                  <div className="mt-3 text-[11px] text-stone-500 font-century italic">
                                    {wSizeChart.note}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}

                    {/* Heading Koleksi Busana */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#5C725A]"></span>
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-wide uppercase">
                          Katalog Busana Kebaya &amp; Gaun ({dynamicKebayas.length} Pilihan Warna)
                        </h4>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 font-century">
                        Tersedia di Lemari Wardrobe Studio
                      </span>
                    </div>

                    {/* Grid Koleksi Kebaya Dinamis (100% Dari Dashboard & Zero Unsplash) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {dynamicKebayas.map((item: any, idx: number) => {
                        const hasRealPhoto = Boolean(item.image && !item.image.includes('unsplash.com'));
                        const sizesList: string[] = Array.isArray(item.sizes) && item.sizes.length > 0 ? item.sizes : ['S', 'M', 'L', 'XL', 'XXL'];
                        const hexColor = item.hex || '#8FA38D';
                        const waText = encodeURIComponent(
                          `Halo Admin Alviero Studio (${currentBranchInfo.name}), saya ingin menanyakan ketersediaan dan sewa busana Kebaya warna ${item.name} untuk sesi foto.`
                        );
                        const waUrl = `https://wa.me/${currentBranchInfo.whatsappNumber || (selectedBranch === 'cabang-2' ? '6285168879214' : '6287777538164')}?text=${waText}`;

                        return (
                          <div
                            key={item.id || idx}
                            className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DDD6] hover:border-[#A9BCA7] p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 text-left"
                          >
                            {/* Visual Preview: Foto Asli Studio atau Luxury Swatch Card (Zero Unsplash) */}
                            {hasRealPhoto ? (
                              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-[#EFE5DC] group">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hexColor }}></span>
                                  <span>{item.name}</span>
                                </div>
                                {item.tag && (
                                  <div className="absolute top-2.5 right-2.5 bg-[#FAF0E6] text-[#8A5A36] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#EAD5C3] shadow-xs">
                                    {item.tag}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div
                                className="relative aspect-[16/9] rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-inner border border-black/10 text-white"
                                style={{
                                  background: `linear-gradient(135deg, ${hexColor}DD, ${hexColor})`
                                }}
                              >
                                <div className="flex items-center justify-between relative z-10">
                                  <span className="text-[10px] font-bold font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-white">
                                    {item.tag || 'Koleksi Studio'}
                                  </span>
                                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-black/25 text-white/90">
                                    {hexColor}
                                  </span>
                                </div>

                                <div className="relative z-10 my-auto text-center py-2">
                                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs border border-white/40 flex items-center justify-center mx-auto mb-1.5 shadow-sm text-2xl">
                                    👗
                                  </div>
                                  <h4 className="font-serif font-black text-xl text-white drop-shadow-sm">
                                    Kebaya {item.name}
                                  </h4>
                                  <span className="text-[10.5px] text-white/80 font-century">
                                    Tersedia di Lemari Wardrobe Studio
                                  </span>
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-white/90 relative z-10 pt-1 border-t border-white/20">
                                  <span>✨ Siap Fitting di Studio</span>
                                  <span className="font-bold">Ukuran S - XXL</span>
                                </div>
                              </div>
                            )}

                            {/* Deskripsi & Informasi Busana */}
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-lg font-serif font-black text-[#2A2A2A]">
                                  Kebaya {item.name}
                                </h4>
                                <span className="text-xs font-mono font-bold text-stone-500 bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8DDD6]">
                                  {item.vendorName || 'Studio'}
                                </span>
                              </div>
                              <p className="text-xs text-stone-600 font-century leading-relaxed line-clamp-2">
                                {item.desc || `Koleksi busana kebaya warna ${item.name} anggun dengan aksen brokat halus berpayet mewah.`}
                              </p>

                              {/* Ukuran Tersedia */}
                              <div className="pt-2">
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                                  Pilihan Ukuran Siap Pakai:
                                </span>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {sizesList.map((sz) => (
                                    <span
                                      key={sz}
                                      className="px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold bg-[#FAF8F5] text-[#2A2A2A] border border-[#E8DDD6]"
                                    >
                                      {sz}
                                    </span>
                                  ))}
                                  <span className="text-[10px] text-[#5C725A] font-medium ml-1">
                                    ✓ Fitting Room Tersedia
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Tombol Action Chat WA */}
                            <div className="pt-3 border-t border-[#F2E9E4] flex flex-col sm:flex-row items-center gap-2">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white font-serif font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                                <span>Tanya Stok &amp; Fitting via WA</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Disclaimer & Konsultasi WhatsApp */}
                    <div className="bg-[#FAF8F5] p-5 rounded-3xl border border-[#E8DDD6] text-center space-y-3 shadow-2xs">
                      <div className="max-w-xl mx-auto space-y-1">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A]">
                          Ingin Konsultasi Konsep Gaun &amp; Fitting di Studio?
                        </h4>
                        <p className="text-xs text-stone-600 font-century">
                          Tim Alviero Studio siap membantu Anda memilih perpaduan warna kebaya, gaun wisuda, kain jarik, hingga riasan MUA yang paling cocok dengan warna kulit dan tema pemotretan Anda.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                        <a
                          href={`https://wa.me/${currentBranchInfo.whatsappNumber || (selectedBranch === 'cabang-2' ? '6285168879214' : '6287777538164')}?text=Halo%20Admin%20Alviero%20Studio%20(${encodeURIComponent(currentBranchInfo.name)}),%20saya%20ingin%20konsultasi%20mengenai%20sewa%20Kebaya%20dan%20Gaun.`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2A2A2A] hover:bg-black text-white font-serif font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" />
                          <span>Chat WhatsApp Studio ({currentBranchInfo.name})</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleGoToDisclaimer}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-700 font-serif font-bold text-xs tracking-wider uppercase border border-[#E8DDD6] shadow-2xs transition-all cursor-pointer"
                        >
                          <span>📖 Baca Ketentuan &amp; Disclaimer</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* 15. STANDARD VIEW FOR OTHER CATEGORIES (WEDDING, BINGKAI) */}
                {!activeMenuInfo.specialView && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                          <span>{activeMenuInfo.icon}</span>
                          <span>{activeMenuInfo.badge}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                          {activeMenuInfo.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {activeMenuInfo.subtitle}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const sheetCat = (activeMenuInfo?.sheetCategory || '').toLowerCase();
                          const matchedSheet = PRICELIST_SHEETS.find(s => (s.category || '').toLowerCase().includes(sheetCat)) || PRICELIST_SHEETS[0];
                          setActiveModalSheet(matchedSheet);
                        }}
                        className="min-h-[40px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0"
                      >
                        <ZoomIn className="w-4 h-4 text-amber-300" />
                        <span>Lihat Desain Poster HD</span>
                      </button>
                    </div>

                    {/* Pemberitahuan Tahapan Pengembangan KHUSUS WEDDING */}
                    {(activeMenuCategory === 'wedding' || activeMenuCategory === 'wedding-package') && (
                      <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 text-amber-900 flex flex-col sm:flex-row items-start gap-3.5 shadow-xs animate-in fade-in">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                          ⚠️
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="font-extrabold text-sm sm:text-base text-amber-950">
                            Mohon maaf pricelist masih dalam tahapan pengembangan
                          </div>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            Katalog dan rincian harga untuk kategori <strong className="font-bold text-amber-950">PRICELIST WEDDING</strong> saat ini sedang dalam proses penyusunan &amp; perancangan poster resmi. Untuk konsultasi harga paket pernikahan terbaru (Akad, Resepsi, Engagement, Prewedding) atau reservasi custom, silakan langsung menghubungi WhatsApp Admin Studio kami:
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <a
                              href="https://wa.me/6287777538164?text=Halo%20Admin%20Alviero%20Studio%201%20Junrejo%2C%20saya%20ingin%20konsultasi%20mengenai%20layanan%20Wedding."
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>WA Studio 1 Junrejo (087777538164)</span>
                            </a>
                            <a
                              href="https://wa.me/6285168879214?text=Halo%20Admin%20Alviero%20Studio%202%20Dinoyo%2C%20saya%20ingin%20konsultasi%20mengenai%20layanan%20Wedding."
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>WA Studio 2 Dinoyo (085168879214)</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Daftar Sub-Paket Tersedia (Disembunyikan pada Pricelist Wedding) */}
                    {activeMenuCategory !== 'wedding' && activeMenuCategory !== 'wedding-package' && (
                      <div className="space-y-3">
                        <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                          Daftar Sub-Paket Tersedia ({activeMenuPackages.length} Paket):
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activeMenuPackages.map((pkg) => (
                            <div
                              key={pkg.id}
                              className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3 group cursor-pointer shadow-2xs"
                              onClick={() => onSelectPackageForBooking(pkg.id)}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {pkg.name}
                                  </h4>
                                  <span className="font-black text-indigo-600 text-sm whitespace-nowrap">
                                    Rp {pkg.price.toLocaleString('id-ID')}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  {pkg.description}
                                </p>
                              </div>

                              <div className="space-y-2 pt-2 border-t border-slate-200/80">
                                <div className="text-[10.5px] text-slate-600 flex items-center gap-2 flex-wrap">
                                  <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold">⏱️ {pkg.durationMinutes} Min</span>
                                  <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold">👥 {pkg.includedPeople} Org</span>
                                  <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold">🖨️ {pkg.includedPrints}</span>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectPackageForBooking(pkg.id);
                                  }}
                                  className="w-full min-h-[38px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>Pilih & Hitung Reservasi</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                      <div className="space-y-0.5 text-center sm:text-left">
                        <div className="font-black text-sm">Mau Tanya Jadwal / Konsultasi Custom?</div>
                        <p className="text-xs text-emerald-100">Hubungi langsung admin WhatsApp kami untuk respon cepat & cek slot.</p>
                      </div>

                      <a
                        href={`https://wa.me/${currentBranchInfo.whatsappNumber || (selectedBranch === 'cabang-2' ? '6285168879214' : '6287777538164')}?text=Halo%20Admin%20${encodeURIComponent(currentBranchInfo.name)},%20saya%20mau%20tanya%20jadwal%20dan%20pricelist`}
                        target="_blank"
                        rel="noreferrer"
                        className="min-h-[42px] px-5 py-2.5 bg-white text-emerald-800 font-black text-xs rounded-xl shadow-md hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>Chat Admin WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Tombol Tutup di Bagian Bawah Pop-up Khusus HP */}
                <div className="pt-4 pb-2 border-t border-slate-200 text-center md:hidden">
                  <button
                    onClick={handleClosePopup}
                    className="w-full min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 text-amber-300" />
                    <span>Tutup & Kembali ke Beranda</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. FASILITAS STUDIO (TANPA FOTO BACKGROUND)                         */}
      {/* ==================================================================== */}
      {activeTab === 'gallery' && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">

          {/* Switcher Mode: Menu Pricelist vs Fasilitas vs Panduan */}
          <div className="w-full max-w-lg mx-auto bg-[#FAF8F5] p-1.5 flex items-stretch gap-1.5 border border-[#E8DDD6] shadow-xs rounded-xl sm:rounded-2xl">
            <button
              onClick={() => { setActiveTab('menu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex-1 min-h-[40px] px-3 py-1.5 font-serif text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center text-center leading-tight gap-1.5 cursor-pointer rounded-lg sm:rounded-xl border ${
                isTabActive('menu')
                  ? 'bg-[#3F613E] text-white border-[#334F32] shadow-sm font-extrabold ring-2 ring-[#3F613E]/20'
                  : 'bg-[#EFF6EE] text-[#345333] border-[#CCE0CB] hover:bg-[#E2EFE1] font-bold'
              }`}
            >
              <span>📱 Menu Pricelist</span>
            </button>
            <button
              onClick={() => { setActiveTab('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex-1 min-h-[40px] px-3 py-1.5 font-serif text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center text-center leading-tight gap-1.5 cursor-pointer rounded-lg sm:rounded-xl border ${
                isTabActive('gallery')
                  ? 'bg-[#2B5777] text-white border-[#21435D] shadow-sm font-extrabold ring-2 ring-[#2B5777]/20'
                  : 'bg-[#F0F5F9] text-[#224762] border-[#C8DCED] hover:bg-[#E3EFF7] font-bold'
              }`}
            >
              <span>🏢 Fasilitas &amp; Background</span>
            </button>
            <button
              onClick={() => { setActiveTab('guide'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex-1 min-h-[40px] px-3 py-1.5 font-serif text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center text-center leading-tight gap-1.5 cursor-pointer rounded-lg sm:rounded-xl border ${
                isTabActive('guide')
                  ? 'bg-[#A33636] text-white border-[#872929] shadow-sm font-extrabold ring-2 ring-[#A33636]/20'
                  : 'bg-[#FDF2F2] text-[#8C2B2B] border-[#F4CDCD] hover:bg-[#FCE5E5] font-bold'
              }`}
            >
              <span>📖 Disclaimer</span>
            </button>
          </div>

          {/* Komponen Galeri Interaktif: 3 Section Berurutan (Fasilitas, Alat Studio, Background) dengan Slider Sinkron */}
          <StudioFacilityGallery
            selectedBranch={selectedBranch}
            currentBranchName={currentBranchInfo.shortName}
            onPhotoZoom={(photo) => {
              setActiveModalPhoto(photo);
              setModalImageIndex(0);
            }}
            onBackToPricelist={() => {
              setActiveTab('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. PANDUAN: DISCLAIMER RESMI & PERTANYAAN UMUM (FAQ)                */}
      {/* ==================================================================== */}
      {activeTab === 'guide' && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto w-full">

          {/* Switcher Mode: Menu Pricelist vs Fasilitas vs Panduan */}
          <div className="w-full max-w-lg mx-auto bg-[#FAF8F5] p-1.5 flex items-stretch gap-1.5 border border-[#E8DDD6] shadow-xs rounded-xl sm:rounded-2xl">
            <button
              onClick={() => { setActiveTab('menu'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex-1 min-h-[40px] px-3 py-1.5 font-serif text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center text-center leading-tight gap-1.5 cursor-pointer rounded-lg sm:rounded-xl border ${
                isTabActive('menu')
                  ? 'bg-[#3F613E] text-white border-[#334F32] shadow-sm font-extrabold ring-2 ring-[#3F613E]/20'
                  : 'bg-[#EFF6EE] text-[#345333] border-[#CCE0CB] hover:bg-[#E2EFE1] font-bold'
              }`}
            >
              <span>📱 Menu Pricelist</span>
            </button>
            <button
              onClick={() => { setActiveTab('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex-1 min-h-[40px] px-3 py-1.5 font-serif text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center text-center leading-tight gap-1.5 cursor-pointer rounded-lg sm:rounded-xl border ${
                isTabActive('gallery')
                  ? 'bg-[#2B5777] text-white border-[#21435D] shadow-sm font-extrabold ring-2 ring-[#2B5777]/20'
                  : 'bg-[#F0F5F9] text-[#224762] border-[#C8DCED] hover:bg-[#E3EFF7] font-bold'
              }`}
            >
              <span>🏢 Fasilitas &amp; Background</span>
            </button>
            <button
              onClick={() => { setActiveTab('guide'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex-1 min-h-[40px] px-3 py-1.5 font-serif text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center text-center leading-tight gap-1.5 cursor-pointer rounded-lg sm:rounded-xl border ${
                isTabActive('guide')
                  ? 'bg-[#A33636] text-white border-[#872929] shadow-sm font-extrabold ring-2 ring-[#A33636]/20'
                  : 'bg-[#FDF2F2] text-[#8C2B2B] border-[#F4CDCD] hover:bg-[#FCE5E5] font-bold'
              }`}
            >
              <span>📖 Disclaimer</span>
            </button>
          </div>

          {/* 1. DISCLAIMER RESMI POSTER */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#E8DDD6] shadow-sm space-y-6 relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-[#3A3A3A]" />

            {/* Header Disclaimer */}
            <div className="text-center space-y-1.5 max-w-2xl mx-auto pt-1">
              <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-rose-200">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>Ketentuan & Tata Tertib Resmi</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-rose-600 tracking-wider uppercase">
                {activeDisclaimer.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-sans">
                {activeDisclaimer.subtitle}
              </p>
            </div>

            {/* Disclaimer Sections */}
            <div className="space-y-5 text-stone-800 text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto pt-2">
              {activeDisclaimer.sections.map((sec: any, sIdx: number) => (
                <div
                  key={sIdx}
                  className={`space-y-2 ${sIdx < activeDisclaimer.sections.length - 1 ? 'border-b border-[#E8DDD6] pb-4' : ''}`}
                >
                  <h3 className="font-serif font-bold text-rose-600 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
                    <span>{sec.title}</span>
                  </h3>
                  <ol className="space-y-2 pl-5 list-decimal text-stone-700 font-sans">
                    {(sec.items || []).map((itemText: string, iIdx: number) => (
                      <li key={iIdx}>{itemText}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            {/* Quick CTA Box */}
            <div className="bg-[#FDFBF7] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="space-y-0.5">
                <div className="font-serif font-bold text-[#3A3A3A] text-xs sm:text-sm uppercase tracking-wide">
                  Ada Pertanyaan Seputar Disclaimer & Booking?
                </div>
                <p className="text-xs text-stone-500 font-sans">
                  Konsultasikan jadwal atau ketentuan foto langsung bersama admin {currentBranchInfo.name}.
                </p>
              </div>

              <a
                href={`https://wa.me/${currentBranchInfo.whatsappNumber || (selectedBranch === 'cabang-2' ? '6285168879214' : '6287777538164')}?text=Halo%20Admin%20${encodeURIComponent(currentBranchInfo.name)},%20saya%20sudah%20membaca%20Disclaimer%20dan%20ingin%20konsultasi%20booking`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95 shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-[#A9BCA7]" />
                <span>Chat Admin WA ({currentBranchInfo.badge})</span>
              </a>
            </div>
          </div>

          {/* 2. PERTANYAAN UMUM (FAQ) */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E8DDD6] shadow-sm space-y-5 text-left">
            <div className="flex items-center gap-2 text-[#6E856C] font-mono font-bold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Pertanyaan Umum (FAQ)</span>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#3A3A3A] uppercase tracking-wide">
                Hal Yang Sering Ditanyakan
              </h3>
              <p className="text-xs text-stone-500 font-sans mt-1">
                Kumpulan jawaban atas pertanyaan yang paling sering diajukan seputar reservasi dan layanan studio.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={idx} className="border border-[#E8DDD6] rounded-2xl overflow-hidden bg-[#FDFBF7] transition-all">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left gap-3 hover:bg-[#F2E9E4]/60 transition-colors cursor-pointer"
                    >
                      <span className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] leading-snug">
                        {faq.q}
                      </span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-transform ${
                        isOpen ? 'bg-[#3A3A3A] text-white border-[#3A3A3A] rotate-180' : 'bg-white text-stone-600 border-[#E8DDD6]'
                      }`}>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed border-t border-[#E8DDD6]/60 bg-white animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct WhatsApp Box */}
            <div className="pt-3 border-t border-[#E8DDD6] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <span className="text-xs text-stone-500 font-sans">
                Pertanyaan Anda belum terjawab di sini? Hubungi kami langsung.
              </span>
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-5 py-2.5 bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95 shadow-2xs"
              >
                <Calendar className="w-4 h-4 text-[#A9BCA7]" />
                <span>Buka Form Reservasi</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. MODAL PERBESAR FOTO DENGAN FITUR GESER/SLIDER (SWIPEABLE MODAL)   */}
      {/* ==================================================================== */}
      {activeModalPhoto && (() => {
        const imageList = activeModalPhoto.images && activeModalPhoto.images.length > 0
          ? activeModalPhoto.images
          : [activeModalPhoto.imageUrl];
        const currentImg = imageList[modalImageIndex % imageList.length] || activeModalPhoto.imageUrl;

        const handlePrevImg = () => {
          setModalImageIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1));
        };

        const handleNextImg = () => {
          setModalImageIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));
        };

        const handleTouchStart = (e: React.TouchEvent) => {
          touchModalStartX.current = e.targetTouches[0].clientX;
        };

        const handleTouchMove = (e: React.TouchEvent) => {
          touchModalEndX.current = e.targetTouches[0].clientX;
        };

        const handleTouchEnd = () => {
          if (!touchModalStartX.current || !touchModalEndX.current) return;
          const diff = touchModalStartX.current - touchModalEndX.current;
          if (diff > 35) {
            handleNextImg();
          } else if (diff < -35) {
            handlePrevImg();
          }
          touchModalStartX.current = null;
          touchModalEndX.current = null;
        };

        return (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
            <div className="bg-[#2A2A2A] border border-[#3A3A3A] text-white max-w-4xl w-full max-h-[94vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative my-auto text-left rounded-2xl sm:rounded-3xl">

              {/* Close Button */}
              <button
                onClick={() => setActiveModalPhoto(null)}
                className="absolute top-2.5 right-2.5 z-30 w-8 h-8 rounded-lg bg-black/70 hover:bg-black text-stone-300 hover:text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer active:scale-95 shadow-md"
                title="Tutup Modal"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>

              {/* Kolom Kiri: Foto Slider */}
              <div className="md:w-1/2 bg-black relative flex flex-col items-center justify-center overflow-hidden h-[42vh] sm:h-[50vh] md:h-auto shrink-0 select-none p-2">
                <div
                  className="relative w-full h-full flex items-center justify-center overflow-hidden border border-white/10 rounded-xl"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={currentImg}
                    alt={`${activeModalPhoto.title} (${modalImageIndex + 1}/${imageList.length})`}
                    className="w-full h-full object-contain transition-all duration-300"
                  />

                  {/* Badge Label Paket */}
                  <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xs text-[#A9BCA7] text-[9.5px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-md border border-[#A9BCA7]/50 z-10 shadow-xs flex items-center gap-1 uppercase">
                    <span>{activeModalPhoto.icon}</span>
                    <span>{activeModalPhoto.packageName}</span>
                  </div>

                  {/* Tombol Geser / Navigasi */}
                  {imageList.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImg}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/30 transition-all active:scale-90 cursor-pointer shadow-lg"
                        title="Foto Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                      </button>

                      <button
                        type="button"
                        onClick={handleNextImg}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/30 transition-all active:scale-90 cursor-pointer shadow-lg"
                        title="Foto Selanjutnya"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                      </button>

                      {/* Indikator Nomor Foto & Swipe Hint */}
                      <div className="absolute bottom-2.5 inset-x-0 mx-auto w-fit bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold tracking-wider px-3 py-1 rounded-full border border-white/20 z-10 flex items-center gap-1.5 shadow-md uppercase">
                        <span className="text-[#A9BCA7]">{modalImageIndex + 1} / {imageList.length}</span>
                        <span className="text-white/60 text-[9px]">• Geser Foto ↔️</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {imageList.length > 1 && (
                  <div className="w-full pt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar px-1 shrink-0">
                    {imageList.map((img, idx) => (
                      <button
                        key={img + idx}
                        type="button"
                        onClick={() => setModalImageIndex(idx)}
                        className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                          modalImageIndex === idx
                            ? 'border-[#A9BCA7] ring-1 ring-[#A9BCA7] opacity-100 scale-105'
                            : 'border-white/20 opacity-50 hover:opacity-80'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Detail Foto */}
              <div className="md:w-1/2 p-5 sm:p-7 flex flex-col justify-between space-y-4 overflow-y-auto max-h-[52vh] md:max-h-full">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 bg-[#3A3A3A] text-[#A9BCA7] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider px-3 py-1 border border-[#5A5A5A] uppercase">
                    <span>{activeModalPhoto.icon}</span>
                    <span>{activeModalPhoto.packageName}</span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-xl font-serif font-bold text-white uppercase tracking-wide leading-snug">
                      {activeModalPhoto.title}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-300 font-sans leading-relaxed">
                    {activeModalPhoto.description}
                  </p>

                  {/* Catatan Konsep Foto */}
                  <div className="bg-[#333333] p-3.5 border border-[#444444] space-y-1 text-xs">
                    <div className="font-serif font-bold text-[#A9BCA7] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#A9BCA7]" />
                      <span>Catatan Konsep:</span>
                    </div>
                    <p className="text-stone-300 text-xs font-sans leading-relaxed">
                      {activeModalPhoto.conceptNote}
                    </p>
                  </div>
                </div>

                {/* Footer Modal */}
                <div className="pt-3 border-t border-[#3A3A3A] flex items-center justify-between text-xs text-stone-400 font-sans">
                  <span>Alviero Studio Foto © 2026</span>
                  <button
                    onClick={() => setActiveModalPhoto(null)}
                    className="px-4 py-2 bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#A9BCA7] hover:text-white font-serif font-bold text-xs uppercase tracking-wider border border-[#5A5A5A] transition-colors cursor-pointer active:scale-95"
                  >
                    Tutup Tampilan
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Standard Poster Modal (If clicked from Menu view) */}
      {activeModalSheet && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="bg-[#2A2A2A] border border-[#3A3A3A] text-white max-w-4xl w-full max-h-[94vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative my-auto text-left">
            <button
              onClick={() => setActiveModalSheet(null)}
              className="absolute top-2.5 right-2.5 z-30 w-8 h-8 bg-black/70 hover:bg-black text-stone-300 hover:text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>

            <div className="md:w-1/2 bg-black relative flex items-center justify-center overflow-hidden p-2">
              <img
                src={activeModalSheet.imageUrl}
                alt={activeModalSheet.title}
                className="w-full h-full object-contain border border-white/10"
              />
            </div>

            <div className="md:w-1/2 p-4 sm:p-6 flex flex-col justify-between space-y-3 overflow-y-auto max-h-[54vh] md:max-h-full">
              <div className="space-y-2.5">
                <div className="inline-block bg-[#3A3A3A] text-[#A9BCA7] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider px-3 py-1 border border-[#5A5A5A] uppercase">
                  {activeModalSheet.category}
                </div>
                <h3 className="text-base sm:text-xl font-serif font-bold text-white uppercase tracking-wide">
                  {activeModalSheet.title}
                </h3>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  {activeModalSheet.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#3A3A3A] flex items-center justify-between text-xs text-stone-400 font-sans">
                <span>Alviero Studio Foto © 2026</span>
                <button
                  onClick={() => setActiveModalSheet(null)}
                  className="text-[#A9BCA7] hover:text-white font-serif font-bold text-xs uppercase tracking-wider cursor-pointer p-1"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL PREVIEW FOTO HASIL PAKET (LIGHTBOX FOTO CAROUSEL) */}
      {previewPhotoIndex !== null && pricelistPreviewPhotos[previewPhotoIndex] && (() => {
        const currentPhoto = pricelistPreviewPhotos[previewPhotoIndex];
        const total = pricelistPreviewPhotos.length;

        const handlePrev = (e?: React.MouseEvent) => {
          e?.stopPropagation();
          setPreviewPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : total - 1));
        };

        const handleNext = (e?: React.MouseEvent) => {
          e?.stopPropagation();
          setPreviewPhotoIndex((prev) => (prev !== null && prev < total - 1 ? prev + 1 : 0));
        };

        return (
          <div
            className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-md flex flex-col justify-between p-3 sm:p-5 select-none animate-in fade-in duration-200"
            onClick={() => setPreviewPhotoIndex(null)}
            onTouchStart={handlePreviewTouchStart}
            onTouchMove={handlePreviewTouchMove}
            onTouchEnd={handlePreviewTouchEnd}
          >
            {/* Top Bar */}
            <div
              className="w-full max-w-5xl mx-auto flex items-center justify-between gap-3 text-white z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="text-xs sm:text-sm font-serif font-black uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/15 text-[#A9BCA7] shrink-0">
                  {currentPhoto.packageName || activeMenuInfo.title}
                </span>
                <span className="text-xs sm:text-sm font-sans font-semibold text-white/90 truncate">
                  {currentPhoto.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {total > 1 && (
                  <span className="text-[11px] font-mono font-bold bg-white/10 px-2.5 py-1 rounded-full text-white/75 border border-white/10">
                    {previewPhotoIndex + 1} / {total}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setPreviewPhotoIndex(null)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
                  title="Tutup Preview (ESC)"
                  aria-label="Tutup Preview"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Center Area: Foto & Navigation Arrows */}
            <div className="relative flex-1 flex items-center justify-center my-2 sm:my-3 min-h-0 w-full max-w-6xl mx-auto">
              {/* Tombol Panah Kiri */}
              {total > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/25 hover:border-white/50 transition-all active:scale-90 cursor-pointer shadow-2xl backdrop-blur-xs"
                  title="Foto Sebelumnya (←)"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                </button>
              )}

              {/* Kontainer Foto Utama */}
              <div
                className="relative max-h-[76vh] max-w-full flex items-center justify-center p-1"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  key={currentPhoto.id + currentPhoto.imageUrl}
                  src={currentPhoto.imageUrl}
                  alt={currentPhoto.title}
                  className="max-h-[76vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200 select-none"
                />
              </div>

              {/* Tombol Panah Kanan */}
              {total > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/25 hover:border-white/50 transition-all active:scale-90 cursor-pointer shadow-2xl backdrop-blur-xs"
                  title="Foto Selanjutnya (→)"
                  aria-label="Foto Selanjutnya"
                >
                  <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                </button>
              )}
            </div>

            {/* Bottom Bar: Caption & Tips */}
            <div
              className="w-full max-w-3xl mx-auto text-center space-y-1 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs sm:text-sm font-sans font-bold text-white tracking-wide">
                {currentPhoto.title}
              </p>
              <p className="text-[10px] sm:text-[11px] font-sans text-stone-400">
                {total > 1
                  ? "Gunakan tombol panah ◀ ▶ atau geser layar untuk navigasi • Klik di luar atau tekan ESC untuk menutup"
                  : "Klik di luar atau tombol × untuk menutup"}
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

