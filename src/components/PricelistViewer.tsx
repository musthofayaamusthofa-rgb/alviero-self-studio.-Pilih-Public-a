import React, { useState, useMemo } from 'react';
import { PRICELIST_SHEETS, PACKAGES, STUDIO_BRANCHES } from '../data/pricelistData';
import { PricelistSheet, StudioBranch } from '../types';
import {
  ZoomIn, ArrowRight, Layers, Sparkles, X,
  Search, Camera, Calendar, ChevronRight, MessageCircle,
  Instagram, Music2, CheckCircle2, ChevronLeft, Heart, Image as ImageIcon,
  Grid, PhoneCall, GraduationCap, Check, Trees, UserCheck, Users, Home, Cake, Baby, User, Gem, Building2, Mail, Star, Eye, MapPin
} from 'lucide-react';

interface PricelistViewerProps {
  onSelectPackageForBooking: (packageId: string) => void;
  selectedBranch?: StudioBranch;
  onOpenBranchModal?: () => void;
  onNavigateToRules?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenBooking?: () => void;
}

interface StudioGalleryPhoto {
  id: string;
  title: string;
  category: string;
  packageName: string;
  icon: string;
  targetPackageId: string;
  imageUrl: string;
  description: string;
  conceptNote: string;
  tags: string[];
}

export const PricelistViewer: React.FC<PricelistViewerProps> = ({
  onSelectPackageForBooking,
  selectedBranch = 'cabang-1',
  onOpenBranchModal,
  onNavigateToRules,
  onNavigateToTab,
  onOpenBooking
}) => {
  const currentBranchInfo = STUDIO_BRANCHES.find(b => b.id === selectedBranch) || STUDIO_BRANCHES[0];
  // Mode: 'menu' (Figma Bio-Link Style) or 'gallery' (Contoh Hasil Foto Studio)
  const [activeTab, setActiveTab] = useState<'menu' | 'gallery'>('menu');
  const [activeMenuCategory, setActiveMenuCategory] = useState<string | null>('selfstudio');
  const [isStudioFotoSubmenuOpen, setIsStudioFotoSubmenuOpen] = useState<boolean>(false);
  const [selfStudioSubTab, setSelfStudioSubTab] = useState<'special' | 'normal' | 'spotlight' | 'grid'>('special');
  const [selectedGridFilter, setSelectedGridFilter] = useState<'all' | 'grid-1' | 'grid-3' | 'grid-4' | 'grid-6'>('all');
  const [selectedKebayaFilter, setSelectedKebayaFilter] = useState<'all' | 'adat' | 'modern' | 'gaun'>('all');
  const [selectedBingkaiSubTab, setSelectedBingkaiSubTab] = useState<'all' | 'cetak' | 'bingkai' | 'album'>('all');
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState<boolean>(false);

  // Gallery Tab State
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalPhoto, setActiveModalPhoto] = useState<StudioGalleryPhoto | null>(null);
  const [activeModalSheet, setActiveModalSheet] = useState<PricelistSheet | null>(null);

  // 1. Top-Level Main Menu Buttons (5 Menu Utama Sesuai Mockup Asli)
  const mainMenuButtons = [
    {
      id: 'selfstudio',
      title: 'PRICELIST SELFSTUDIO',
      subtitle: 'Special (55K), Normal (80K) & Colour Spotlight (99K)',
      icon: '✨',
      sheetCategory: 'Pricelist Selfstudio',
      badge: 'Best Seller',
      specialView: 'selfstudio-special',
      isSubmenuTrigger: false,
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
      targetPackageIds: [
        'personal-bold-statement', 'personal-opulent-shot'
      ]
    },
    {
      id: 'wedding',
      title: 'PRICELIST WEDDING',
      subtitle: 'Prewedding, Akad, Resepsi & Engagement',
      icon: '💍',
      sheetCategory: 'Paket Personal',
      badge: 'Exclusive',
      specialView: null,
      isSubmenuTrigger: false,
      targetPackageIds: [
        'prewed-sweet-promise', 'prewed-velvet-romance', 'couple-eternal-love', 'passfoto-3'
      ]
    },
    {
      id: 'bingkai-album',
      title: 'PRICELIST BINGKAI DAN ALBUM',
      subtitle: 'Cetak Lab, Bingkai Minimalis & Album Eksklusif',
      icon: '🖼️',
      sheetCategory: 'Frame Grid',
      badge: 'Cetak Lab',
      specialView: 'bingkai-album-view',
      isSubmenuTrigger: false,
      targetPackageIds: [
        'self-special-narsis', 'birthday-glow-sweet'
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
      targetPackageIds: [
        'grad-outdoor-smart-30', 'grad-outdoor-smart-60', 'grad-outdoor-cumlaude'
      ]
    }
  ];

  // 2. Submenu Studio Foto (12 Sub-Paket)
  const studioFotoSubButtons = [
    {
      id: 'undangan-paket',
      title: 'PRICELIST UNDANGAN',
      subtitle: 'Paket Undangan 1 (95K) & Paket Undangan 2 (155K)',
      icon: '💌',
      sheetCategory: 'Paket Undangan',
      badge: 'Hemat & Praktis',
      specialView: 'undangan-paket',
      targetPackageIds: [
        'undangan-paket-1', 'undangan-paket-2'
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
      targetPackageIds: [
        'sewa-studio-hourly'
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
      targetPackageIds: [
        'prewed-sweet-promise', 'prewed-velvet-romance', 'prewed-bundling-1', 'prewed-bundling-2'
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
      targetPackageIds: [
        'couple-eternal-love', 'couple-sweet-memories'
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
      targetPackageIds: [
        'personal-bold-statement', 'personal-opulent-shot'
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
      targetPackageIds: [
        'maternity-warm-embrace', 'maternity-golden-motherhood'
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
      targetPackageIds: [
        'birthday-sweet-celebration', 'birthday-glow-sweet', 'birthday-sweet-light', 'birthday-ultimate-sweet-light'
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
      targetPackageIds: [
        'family-sweet-together', 'family-happy-nest'
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
      targetPackageIds: [
        'group-friendly-frame', 'group-signature-squad', 'group-royal-ensemble', 'group-imperial-union'
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
      targetPackageIds: [
        'passfoto-1', 'passfoto-2', 'passfoto-3'
      ]
    },
    {
      id: 'grad-indoor',
      title: 'PRICELIST GRADUATION INDOOR',
      subtitle: 'Elegant Scholar, Supreme, Infinity & Bundling',
      icon: '🎓',
      sheetCategory: 'Paket Wisuda Indoor',
      badge: 'Wisuda Hot',
      specialView: 'grad-indoor',
      targetPackageIds: [
        'grad-indoor-elegant-scholar', 'grad-indoor-supreme-scholar', 'grad-indoor-infinity-scholar',
        'grad-bundling-ultimate-1', 'grad-bundling-ultimate-2'
      ]
    },
    {
      id: 'grad-outdoor',
      title: 'PRICELIST GRADUATION OUTDOOR',
      subtitle: 'Smart (30/60M), Cumlaude Video & Group Outdoor',
      icon: '🌳',
      sheetCategory: 'Paket Wisuda Outdoor',
      badge: 'Outdoor',
      specialView: 'grad-outdoor',
      targetPackageIds: [
        'grad-outdoor-smart-30', 'grad-outdoor-smart-60', 'grad-outdoor-cumlaude',
        'grad-outdoor-group-2', 'grad-outdoor-group-3', 'grad-outdoor-group-4-5'
      ]
    }
  ];

  const allCategoryButtons = [...mainMenuButtons, ...studioFotoSubButtons];

  // Social Media Links (From Figma Footer)
  const socialLinks = [
    { label: '@alvierostudiofoto', icon: 'tiktok', url: 'https://tiktok.com/@alvierostudiofoto' },
    { label: '@alvierostudiofoto', icon: 'instagram', url: 'https://instagram.com/alvierostudiofoto' },
    { label: '@alviero.selfstudio', icon: 'instagram', url: 'https://instagram.com/alviero.selfstudio' },
    { label: '@alviero.graduation', icon: 'instagram', url: 'https://instagram.com/alviero.graduation' },
    { label: '@alviero.wedding', icon: 'instagram', url: 'https://instagram.com/alviero.wedding' }
  ];

  // 3. DAFTAR CONTOH HASIL FOTO STUDIO SESUAI 13 PAKET UTAMA ALVIERO STUDIO
  const studioGalleryCategories = [
    { id: 'all', label: 'Semua Paket', icon: '📸' },
    { id: 'selfstudio', label: 'Paket Self Studio', icon: '✨' },
    { id: 'grad-indoor', label: 'Paket Wisuda Indoor', icon: '🎓' },
    { id: 'grad-outdoor', label: 'Paket Wisuda Outdoor', icon: '🌳' },
    { id: 'prewed', label: 'Paket Prewedding', icon: '💍' },
    { id: 'couple', label: 'Paket Couple', icon: '💑' },
    { id: 'personal', label: 'Paket Personal', icon: '👤' },
    { id: 'maternity', label: 'Paket Maternity', icon: '🤰' },
    { id: 'birthday', label: 'Paket Birthday', icon: '🎉' },
    { id: 'family', label: 'Paket Family', icon: '👨‍👩‍👧‍👦' },
    { id: 'group', label: 'Paket Group', icon: '👥' },
    { id: 'pass-foto', label: 'Paket Pass Foto', icon: '👤' },
    { id: 'undangan', label: 'Paket Undangan', icon: '💌' },
    { id: 'sewa-studio', label: 'Paket Sewa Studio', icon: '🏢' }
  ];

  const STUDIO_GALLERY_PHOTOS: StudioGalleryPhoto[] = [
    {
      id: 'photo-1-selfstudio',
      title: 'Pose Bebas & Aesthetic Tanpa Fotografer',
      category: 'selfstudio',
      packageName: 'Paket Self Studio',
      icon: '✨',
      targetPackageId: 'self-special-narsis',
      imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=85',
      description: 'Sesi foto bebas ekspresi menggunakan shutter remote di tangan, dilengkapi berbagai aksesoris, kacamata lucu, dan pilihan lighting spotlight.',
      conceptNote: 'Bebas berekspresi tanpa canggung dengan remote shutter nirkabel mandiri.',
      tags: ['#SelfStudio', '#Aesthetic', '#PropsLucu']
    },
    {
      id: 'photo-2-grad-indoor',
      title: 'Foto Wisuda Toga Resmi & Foto Bersama Keluarga',
      category: 'grad-indoor',
      packageName: 'Paket Wisuda Indoor',
      icon: '🎓',
      targetPackageId: 'grad-indoor-elegant-scholar',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85',
      description: 'Potret wisudawan lengkap dengan jubah toga resmi universitas, map ijazah, serta sesi foto hangat bersama orang tua di studio.',
      conceptNote: 'Pengarahan pose resmi dan anggun untuk foto kelulusan pribadi maupun keluarga.',
      tags: ['#WisudaIndoor', '#TogaWisuda', '#StudioWisuda']
    },
    {
      id: 'photo-3-grad-outdoor',
      title: 'Sesi Wisuda Outdoor & Lempar Toga di Kampus',
      category: 'grad-outdoor',
      packageName: 'Paket Wisuda Outdoor',
      icon: '🌳',
      targetPackageId: 'grad-outdoor-smart-30',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=85',
      description: 'Foto wisuda outdoor di spot-spot ikonik seputar gedung universitas dan taman kampus bersama teman seangkatan.',
      conceptNote: 'Fotografer mendampingi langsung di lokasi kampus favorit Anda.',
      tags: ['#WisudaOutdoor', '#AreaKampus', '#FotoWisuda']
    },
    {
      id: 'photo-4-prewed',
      title: 'Konsep Prewedding Gaun Putih & Jas Mewah Elegan',
      category: 'prewed',
      packageName: 'Paket Prewedding',
      icon: '💍',
      targetPackageId: 'prewed-sweet-promise',
      imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85',
      description: 'Sesi foto prewedding romantis dengan gaun pengantin modern, setelan jas, riasan make-up, dan pencahayaan studio elegan.',
      conceptNote: 'Arahan pose natural dan elegan khusus calon pengantin.',
      tags: ['#Prewedding', '#GaunPengantin', '#FotoNikah']
    },
    {
      id: 'photo-5-couple',
      title: 'Foto Pasangan Romantis, Hangat & Natural',
      category: 'couple',
      packageName: 'Paket Couple',
      icon: '💑',
      targetPackageId: 'couple-eternal-love',
      imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=85',
      description: 'Abadikan momen kebersamaan berdua dengan outfit senada, senyum bahagia, dan suasana studio yang santai.',
      conceptNote: 'Pose santai dan penuh kehangatan bersama pasangan tercinta.',
      tags: ['#CoupleFoto', '#PasanganSerasi', '#Romantis']
    },
    {
      id: 'photo-6-personal',
      title: 'Portofolio Personal & Foto Profil Profesional',
      category: 'personal',
      packageName: 'Paket Personal',
      icon: '👤',
      targetPackageId: 'personal-bold-statement',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      description: 'Foto portrait pribadi untuk kebutuhan branding profil LinkedIn, media sosial, CV karier, maupun portofolio modeling.',
      conceptNote: 'Pencahayaan portrait profesional dengan hasil jernih dan berkarakter.',
      tags: ['#FotoPersonal', '#Branding', '#Portofolio']
    },
    {
      id: 'photo-7-maternity',
      title: 'Keanggunan Momen Kehamilan Ibu (Maternity)',
      category: 'maternity',
      packageName: 'Paket Maternity',
      icon: '🤰',
      targetPackageId: 'maternity-warm-embrace',
      imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=85',
      description: 'Foto manis menyambut kehadiran buah hati dengan pencahayaan lembut yang menonjolkan keindahan masa kehamilan.',
      conceptNote: 'Dapat membawa properti foto USG atau perlengkapan kecil calon bayi.',
      tags: ['#MaternityFoto', '#IbuHamil', '#MenyambutBayi']
    },
    {
      id: 'photo-8-birthday',
      title: 'Perayaan Ulang Tahun Ceria Bersama Properti Pesta',
      category: 'birthday',
      packageName: 'Paket Birthday',
      icon: '🎉',
      targetPackageId: 'birthday-sweet-celebration',
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85',
      description: 'Sesi perayaan ulang tahun penuh warna dengan balon pesta, kue tart, topi ulang tahun, dan ekspresi bahagia.',
      conceptNote: 'Bebas membawa kue ulang tahun dan pernak-pernik dekorasi sendiri.',
      tags: ['#UlangTahun', '#BirthdayParty', '#FotoPesta']
    },
    {
      id: 'photo-9-family',
      title: 'Kehangatan Foto Keluarga Besar & Kecil',
      category: 'family',
      packageName: 'Paket Family',
      icon: '👨‍👩‍👧‍👦',
      targetPackageId: 'family-sweet-together',
      imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=85',
      description: 'Potret kebersamaan keluarga yang rapi dan penuh senyuman untuk dipajang di ruang tamu rumah.',
      conceptNote: 'Komposisi tertata nyaman untuk seluruh anggota keluarga.',
      tags: ['#FotoKeluarga', '#KeluargaHarmonis', '#AlbumKeluarga']
    },
    {
      id: 'photo-10-group',
      title: 'Kekompakan Rombongan Sahabat & Komunitas',
      category: 'group',
      packageName: 'Paket Group',
      icon: '👥',
      targetPackageId: 'group-friendly-frame',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85',
      description: 'Foto grup teman sekolah, rekan kerja kantor, maupun rombongan komunitas dengan pose seru bersama.',
      conceptNote: 'Penerangan merata untuk rombongan banyak orang dalam satu frame.',
      tags: ['#FotoGrup', '#RombonganSahabat', '#Kompak']
    },
    {
      id: 'photo-11-pass-foto',
      title: 'Pass Foto Buku Nikah Resmi & Dokumen Formal',
      category: 'pass-foto',
      packageName: 'Paket Pass Foto',
      icon: '👤',
      targetPackageId: 'passfoto-1',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85',
      description: 'Foto formal standar buku nikah KUA latar biru/merah, paspor, ijazah, dan dokumen kedinasan dengan retouch rapi.',
      conceptNote: 'Standar warna background resmi dan kerapian pakaian.',
      tags: ['#PassFoto', '#BukuNikah', '#FotoFormal']
    },
    {
      id: 'photo-12-undangan',
      title: 'Foto Materi Undangan Pernikahan Fisik & Digital',
      category: 'undangan',
      packageName: 'Paket Undangan',
      icon: '💌',
      targetPackageId: 'undangan-paket-1',
      imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=85',
      description: 'Foto pasangan yang dirancang khusus untuk layout kartu undangan cetak maupun website undangan pernikahan.',
      conceptNote: 'Komposisi ruang khusus penempatan teks kartu undangan.',
      tags: ['#UndanganNikah', '#UndanganDigital', '#FotoPasangan']
    },
    {
      id: 'photo-13-sewa-studio',
      title: 'Ruang Studio Lengkap dengan Lighting Profesional',
      category: 'sewa-studio',
      packageName: 'Paket Sewa Studio',
      icon: '🏢',
      targetPackageId: 'sewa-studio-hourly',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85',
      description: 'Fasilitas sewa ruang studio foto ber-AC lengkap dengan lighting profesional, trigger, dan aneka pilihan backdrop.',
      conceptNote: 'Siap pakai untuk sesi pemotretan mandiri fotografer dan klien.',
      tags: ['#SewaStudio', '#RentalStudio', '#LightingStudio']
    }
  ];

  // Filter Photos for Gallery Tab
  const filteredGalleryPhotos = useMemo(() => {
    return STUDIO_GALLERY_PHOTOS.filter(photo => {
      const matchesCategory = selectedGalleryCategory === 'all' || photo.category === selectedGalleryCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query ||
        photo.title.toLowerCase().includes(query) ||
        photo.description.toLowerCase().includes(query) ||
        photo.packageName.toLowerCase().includes(query) ||
        photo.tags.some(t => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedGalleryCategory, searchQuery]);

  const activeMenuInfo = allCategoryButtons.find(m => m.id === activeMenuCategory) || mainMenuButtons[0];
  const activeMenuPackages = useMemo(() => {
    return PACKAGES.filter(p => activeMenuInfo.targetPackageIds.includes(p.id));
  }, [activeMenuInfo]);

  return (
    <div className="w-full py-2 sm:py-6 px-2 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-3 sm:space-y-6">

      {/* Top Segmented Navigation Tabs (Khusus Desktop) */}
      <div className="hidden lg:flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-300 shadow-md shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
              Katalog Resmi & Galeri Alviero Studio
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Lihat pricelist resmi atau jelajahi inspirasi contoh hasil foto asli sesuai paket studio kami.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 w-full sm:w-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${activeTab === 'menu'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
          >
            <span>📱 Menu Pricelist Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${activeTab === 'gallery'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
          >
            <span>📸 Galeri Hasil Foto Studio</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. BIO-LINK & MENU VIEW (Clean Studio Jakarta Aesthetic)             */}
      {/* ==================================================================== */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

          {/* Left Column: The Studio Menu Card (Minimalist & Elegant) */}
          <div className="lg:col-span-5 max-w-md w-full mx-auto rounded-3xl sm:rounded-[32px] overflow-hidden shadow-xl border border-slate-200/90 bg-white relative">
            {/* Subtle Studio Ambient Header Glow */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#f0f5fa] via-[#f8fafc]/60 to-transparent pointer-events-none" />

            {/* Menu Content */}
            <div className="relative z-10 p-4 sm:p-6 flex flex-col items-center text-center space-y-3.5 sm:space-y-4">

              {/* 0. Pilihan Lokasi Studio Cabang 1 vs Cabang 2 */}
              <div
                onClick={onOpenBranchModal}
                className="w-full bg-slate-50/90 hover:bg-slate-100/90 rounded-2xl p-2.5 sm:p-3 text-slate-900 flex items-center justify-between gap-2.5 shadow-2xs border border-slate-200/90 cursor-pointer transition-all hover:border-[#78b65d] active:scale-98 group"
              >
                <div className="flex items-center gap-2.5 text-left min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    {currentBranchInfo.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider">Lokasi Studio:</span>
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-1.5 py-0.2 rounded-full">
                        {currentBranchInfo.badge}
                      </span>
                    </div>
                    <div className="font-extrabold text-xs text-slate-900 truncate">
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
                  className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[10.5px] font-bold shrink-0 transition-colors shadow-2xs cursor-pointer"
                >
                  Ganti Cabang 🔄
                </button>
              </div>

              {/* 1. Bar Status Operasional & WA Admin (Pill Kaca Minimalis) */}
              <div className="w-full bg-slate-50/95 rounded-full px-3.5 py-1.5 text-slate-700 flex items-center justify-between text-[11px] border border-slate-200/80 shadow-2xs">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#78b65d] animate-pulse"></span>
                  <span className="text-slate-800 font-semibold">Buka: 08:00 - 21:00 WIB</span>
                </div>
                <a
                  href="https://wa.me/6287777538164?text=Halo%20Admin%20Alviero%20Studio,%20saya%20mau%20tanya%20jadwal%20dan%20pricelist"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#78b65d]" />
                  <span>WA: +62 877-7753-8164</span>
                </a>
              </div>

              {/* 2. Logo Utama & Tagline (Minimalist Clean Studio) */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-sm">
                    <Camera className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-xl text-slate-900 tracking-wider leading-none uppercase">
                      ALVIERO
                    </div>
                    <div className="font-bold text-xs text-slate-500 tracking-widest leading-none uppercase mt-0.5">
                      STUDIO & SELFSTUDIO
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-serif italic tracking-wide">
                  Perfecting Happiness in Every Moment
                </p>
              </div>

              {/* 3. Tombol Hitung & Reservasi (Signature Studio Green Pill) */}
              <button
                onClick={onOpenBooking}
                className="w-full min-h-[44px] bg-[#78b65d] hover:bg-[#5e9e44] text-white font-extrabold text-xs sm:text-sm py-2.5 px-5 rounded-full shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Hitung & Reservasi Tanggal</span>
              </button>

              {/* 4. Switcher Mode: Menu Pricelist vs Galeri Hasil Foto (Khusus HP) */}
              <div className="w-full lg:hidden bg-slate-100 p-1 rounded-full flex items-center gap-1 border border-slate-200 shadow-2xs">
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`flex-1 min-h-[34px] px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                    activeTab === 'menu'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>📱 Menu Pricelist</span>
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`flex-1 min-h-[34px] px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                    activeTab === 'gallery'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>📸 Galeri Foto</span>
                </button>
              </div>

              {/* The Menu Buttons (Conditional: Main Menu vs Submenu Studio Foto) */}
              <div className="w-full space-y-2 pt-0.5">

                {/* A. If Submenu Studio Foto is OPEN */}
                {isStudioFotoSubmenuOpen ? (
                  <div className="space-y-2 animate-in fade-in slide-in-from-left duration-200">
                    {/* Back Button to Main Menu */}
                    <button
                      onClick={() => {
                        setIsStudioFotoSubmenuOpen(false);
                        setActiveMenuCategory('selfstudio');
                      }}
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-2xl bg-slate-900 text-white font-bold text-xs flex items-center justify-between shadow-xs cursor-pointer hover:bg-slate-800 active:scale-95 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4 text-emerald-400" />
                        <span>Kembali ke Menu Utama</span>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">5 Menu</span>
                    </button>

                    <div className="text-left px-1 pt-1 pb-0.5">
                      <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        🏛️ 12 Pilihan Studio Foto:
                      </span>
                    </div>

                    {/* 12 Submenu Buttons */}
                    <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                      {studioFotoSubButtons.map((btn) => {
                        const isSelected = activeMenuCategory === btn.id;

                        return (
                          <button
                            key={btn.id}
                            onClick={() => {
                              setActiveMenuCategory(btn.id);
                              setIsMobilePopupOpen(true);
                            }}
                            className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between shadow-2xs active:scale-98 text-left ${isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                              : 'bg-slate-50/60 hover:bg-white text-slate-900 border-slate-200 hover:border-[#78b65d] hover:shadow-xs'
                              }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-base">{btn.icon}</span>
                              <div className="min-w-0">
                                <div className="font-extrabold text-xs tracking-wider uppercase truncate">
                                  {btn.title}
                                </div>
                                <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                  {btn.subtitle}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 pl-1">
                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#78b65d] text-white font-bold' : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                {btn.badge}
                              </span>
                              <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* B. Main 5 Menu Buttons (Default View) */
                  <div className="space-y-2.5 animate-in fade-in duration-200">
                    {mainMenuButtons.map((btn) => {
                      const isSelected = activeMenuCategory === btn.id;

                      return (
                        <button
                          key={btn.id}
                          onClick={() => {
                            if (btn.isSubmenuTrigger) {
                              setIsStudioFotoSubmenuOpen(true);
                              setActiveMenuCategory('undangan-paket');
                            } else {
                              setActiveMenuCategory(btn.id);
                              setIsMobilePopupOpen(true);
                            }
                          }}
                          className={`w-full min-h-[50px] px-4 py-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between shadow-2xs active:scale-98 text-left ${isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                            : 'bg-white hover:bg-slate-50/90 text-slate-900 border-slate-200 hover:border-[#78b65d] hover:shadow-xs'
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-lg">{btn.icon}</span>
                            <div className="min-w-0">
                              <div className="font-extrabold text-xs sm:text-sm tracking-wider uppercase truncate">
                                {btn.title}
                              </div>
                              <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                {btn.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 pl-1">
                            <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-[#78b65d] text-white font-bold' : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                              {btn.badge}
                            </span>
                            <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Social Media Links Grid (Minimalist & Clean) */}
              <div className="w-full pt-3 border-t border-slate-200/80">
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-left">
                  {socialLinks.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-[10.5px] font-medium text-slate-600 hover:text-[#78b65d] transition-colors py-0.5 truncate"
                    >
                      {s.icon === 'tiktok' && <Music2 className="w-3 h-3 text-slate-500 shrink-0" />}
                      {s.icon === 'instagram' && <Instagram className="w-3 h-3 text-slate-500 shrink-0" />}
                      {s.icon === 'whatsapp' && <MessageCircle className="w-3 h-3 text-slate-500 shrink-0" />}
                      <span className="truncate">{s.label}</span>
                    </a>
                  ))}
                </div>

                {/* Tombol Cepat Buka Popup Rincian di HP (Studio Green Pill) */}
                <div className="lg:hidden w-full pt-3">
                  <button
                    onClick={() => setIsMobilePopupOpen(true)}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-full bg-[#78b65d] hover:bg-[#5e9e44] active:bg-[#44ac18] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Buka Rincian: {activeMenuInfo.title}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Category Details (Responsive: Side-by-Side on Desktop, Popup Modal on Mobile/HP) */}
          <div
            className={
              isMobilePopupOpen
                ? 'fixed inset-0 z-50 lg:static lg:col-span-7 bg-slate-950/85 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-0 overflow-y-auto lg:overflow-visible animate-in fade-in duration-200'
                : 'hidden lg:block lg:col-span-7'
            }
          >
            <div className="bg-white text-slate-900 w-full max-h-[92vh] sm:max-h-[90vh] lg:max-h-none rounded-t-[32px] sm:rounded-3xl shadow-2xl lg:shadow-md flex flex-col lg:block overflow-hidden lg:overflow-visible border border-slate-200 relative my-auto lg:my-0 animate-in slide-in-from-bottom lg:animate-none duration-300">

              {/* Sticky Header Khusus Penggunaan HP / Mobile */}
              <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 flex lg:hidden items-center justify-between shadow-2xs">
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
                  onClick={() => setIsMobilePopupOpen(false)}
                  className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                >
                  <X className="w-4 h-4 text-amber-300" />
                  <span>Tutup</span>
                </button>
              </div>

              {/* Scrollable Container Body */}
              <div className="p-4 sm:p-6 lg:p-7 overflow-y-auto lg:overflow-visible space-y-6 flex-1 bg-white">

                {/* 1. SPECIAL FIGMA VIEW FOR SELF STUDIO */}
                {activeMenuCategory === 'selfstudio' && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    {/* Sub-Switcher */}
                    <div className="bg-slate-100 p-1 rounded-full flex items-center gap-1 border border-slate-200 shadow-2xs overflow-x-auto no-scrollbar">
                      <button
                        onClick={() => setSelfStudioSubTab('special')}
                        className={`flex-1 min-h-[36px] px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 whitespace-nowrap ${selfStudioSubTab === 'special'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        <span>🏷️ Special (55K)</span>
                      </button>

                      <button
                        onClick={() => setSelfStudioSubTab('normal')}
                        className={`flex-1 min-h-[36px] px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 whitespace-nowrap ${selfStudioSubTab === 'normal'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        <span>✨ Normal (80K)</span>
                      </button>

                      <button
                        onClick={() => setSelfStudioSubTab('spotlight')}
                        className={`flex-1 min-h-[36px] px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 whitespace-nowrap ${selfStudioSubTab === 'spotlight'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        <span>🌈 Spotlight (99K)</span>
                      </button>

                      <button
                        onClick={() => setSelfStudioSubTab('grid')}
                        className={`flex-1 min-h-[36px] px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 whitespace-nowrap ${selfStudioSubTab === 'grid'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        <span>🎞️ Pilihan Grid Cetak</span>
                      </button>
                    </div>

                    {/* Subtab 1: Special Price List */}
                    {selfStudioSubTab === 'special' && (
                      <div className="space-y-6 bg-[#ebe4da] rounded-3xl p-5 sm:p-7 border border-[#d8ccbe] shadow-md text-slate-800 animate-in fade-in duration-200">
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <svg className="w-6 h-6 text-slate-900" viewBox="0 0 48 48" fill="currentColor">
                              <path d="M24 4L4 38H16L24 22L32 38H44L24 4Z" />
                              <path d="M24 28L19 38H29L24 28Z" fill="white" />
                            </svg>
                            <div className="text-left leading-none">
                              <span className="font-black text-xs text-slate-900 tracking-wider block">ALVIERO</span>
                              <span className="font-bold text-[10px] text-slate-600 tracking-widest block">STUDIO</span>
                            </div>
                          </div>

                          <h3 className="font-serif font-black text-2xl sm:text-3xl text-amber-900 tracking-wide uppercase">
                            SELF STUDIO
                          </h3>
                          <div className="font-sans font-black text-xl sm:text-2xl tracking-wider text-slate-900">
                            <span className="text-red-600">SPECIAL</span> PRICE LIST
                          </div>
                          <p className="text-[11px] font-bold text-slate-700 tracking-wide">
                            (WAJIB MENGIKUTI SYARAT DAN KETENTUAN)
                          </p>
                        </div>

                        {/* Special Narsis 55K */}
                        <div className="relative pt-2">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-5 flex flex-col items-center">
                              <div className="w-40 sm:w-44 h-48 sm:h-52 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-lg bg-amber-100 relative group">
                                <img
                                  src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80"
                                  alt="Special Narsis Alviero"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <button
                                onClick={() => onSelectPackageForBooking('self-special-narsis')}
                                className="-mt-3.5 z-10 px-6 py-1.5 rounded-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-extrabold text-xs tracking-wider uppercase shadow-md border border-slate-300 transition-all cursor-pointer active:scale-95"
                              >
                                PESAN
                              </button>
                            </div>

                            <div className="sm:col-span-7 space-y-2">
                              <div className="relative flex items-center justify-between">
                                <div className="bg-[#a68c74] text-white font-serif font-bold text-xs sm:text-sm px-4 py-1.5 rounded-r-full shadow-xs tracking-wider uppercase">
                                  SPECIAL NARSIS
                                </div>
                                <div className="w-12 h-12 rounded-full bg-[#a68c74] text-white font-serif font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                                  55k
                                </div>
                              </div>

                              <div className="bg-[#d2c3b2]/60 p-3 sm:p-4 rounded-2xl border border-[#c1af9c] text-slate-800 text-xs space-y-1 leading-relaxed">
                                <p className="text-[11px] text-slate-700">Maksimal 5 orang Lebih dari 5 +15k/orang Unlimited shoots</p>
                                <p className="text-red-600 font-bold">Durasi 15 menit/sesi foto</p>
                                <p className="text-red-600 font-bold">Belum termasuk cetak</p>
                                <p>1 Background</p>
                                <p>Available fun props</p>
                                <p>All file Google Drive</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Special Super Narsis 70K */}
                        <div className="relative pt-3 border-t border-[#d8ccbe]">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-7 space-y-2 order-2 sm:order-1">
                              <div className="relative flex items-center justify-between">
                                <div className="w-12 h-12 rounded-full bg-[#a68c74] text-white font-serif font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                                  70k
                                </div>
                                <div className="bg-[#a68c74] text-white font-serif font-bold text-xs sm:text-sm px-4 py-1.5 rounded-l-full shadow-xs tracking-wider uppercase">
                                  SPECIAL SUPER NARSIS
                                </div>
                              </div>

                              <div className="bg-[#d2c3b2]/60 p-3 sm:p-4 rounded-2xl border border-[#c1af9c] text-slate-800 text-xs space-y-1 leading-relaxed text-right">
                                <p className="text-[11px] text-slate-700">Maksimal 5 orang Lebih dari 5 +15k/orang Unlimited shoots</p>
                                <p className="text-red-600 font-bold">Durasi 20 menit/sesi foto</p>
                                <p className="text-red-600 font-bold">Free cetak 2 polaroid</p>
                                <p>1 Background</p>
                                <p>Available fun props</p>
                                <p>All file Google Drive</p>
                              </div>
                            </div>

                            <div className="sm:col-span-5 flex flex-col items-center order-1 sm:order-2">
                              <div className="w-40 sm:w-44 h-48 sm:h-52 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-lg bg-amber-100 relative group">
                                <img
                                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80"
                                  alt="Special Super Narsis Alviero"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <button
                                onClick={() => onSelectPackageForBooking('self-special-super-narsis')}
                                className="-mt-3.5 z-10 px-6 py-1.5 rounded-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-extrabold text-xs tracking-wider uppercase shadow-md border border-slate-300 transition-all cursor-pointer active:scale-95"
                              >
                                PESAN
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* S&K Box */}
                        <div className="bg-[#a68c74] text-white p-4 sm:p-5 rounded-3xl shadow-md space-y-3 relative">
                          <div className="inline-block bg-[#8c745f] text-white font-serif font-black text-xs px-3.5 py-1 rounded-xl shadow-2xs border border-white/20">
                            Syarat & Ketentuan
                          </div>

                          <ul className="space-y-2 text-xs leading-relaxed pl-2 text-amber-50">
                            <li className="flex items-start gap-1.5">
                              <span className="text-amber-300 shrink-0">•</span>
                              <span>Follow <strong className="text-red-300 font-bold">salah satu</strong> akun instagram kami (alviero.selfstudio / alvierostudiofoto / alviero.graduation / alvierowedding) <strong className="text-red-300 font-bold">1 akun untuk 1x booking</strong> ✨</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-amber-300 shrink-0">•</span>
                              <span><strong className="text-red-300 font-bold">Tag 3 temanmu</strong> di kolom komentar feed instagram alviero.selfstudio</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-amber-300 shrink-0">•</span>
                              <span>Share di instagram kamu (story/feed/reels) dan <strong className="text-red-300 font-bold">tag alviero.selfstudio</strong> (bentuknya bebas) , like 1 postingan di akun instagram kami</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-amber-300 shrink-0">•</span>
                              <span>Jika sudah memenuhi syarat dan ketentuan konfirmasi kembali ke admin untuk mendapatkan link all file</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-amber-300 shrink-0">•</span>
                              <span>Save Nomor WA Alvierostudio di Kontak</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-amber-300 shrink-0">•</span>
                              <span><strong className="text-red-300 font-bold">Free Cetak 1 Polaroid</strong> jika Memberi <strong className="text-red-300 font-bold">Bintang 5 dan Ulasan Di Google Maps</strong> Alviero Studio Foto</span>
                            </li>
                          </ul>
                        </div>

                        <div className="text-center pt-1">
                          <p className="font-serif font-black text-sm tracking-widest text-[#8c745f] uppercase">
                            FEEL FREE TO EXPRESS YOUR STYLE
                          </p>
                        </div>

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => onNavigateToRules?.()}
                            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                          >
                            <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Subtab 2: Normal Price List */}
                    {selfStudioSubTab === 'normal' && (
                      <div className="space-y-6 bg-[#d8c8c3] rounded-3xl p-5 sm:p-7 border border-[#c5b1aa] shadow-md text-slate-800 animate-in fade-in duration-200">
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <svg className="w-6 h-6 text-slate-900" viewBox="0 0 48 48" fill="currentColor">
                              <path d="M24 4L4 38H16L24 22L32 38H44L24 4Z" />
                              <path d="M24 28L19 38H29L24 28Z" fill="white" />
                            </svg>
                            <div className="text-left leading-none">
                              <span className="font-black text-xs text-slate-900 tracking-wider block">ALVIERO</span>
                              <span className="font-bold text-[10px] text-slate-600 tracking-widest block">STUDIO</span>
                            </div>
                          </div>

                          <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#5a3e36] tracking-wide uppercase">
                            SELF STUDIO
                          </h3>
                          <div className="font-sans font-black text-xl sm:text-2xl tracking-wider text-slate-900">
                            <span className="text-red-600">NORMAL</span> PRICE LIST
                          </div>
                          <p className="text-[11px] font-bold text-slate-700 tracking-wide">
                            (TANPA SYARAT DAN KETENTUAN)
                          </p>
                        </div>

                        {/* Normal Narsis 80K */}
                        <div className="relative pt-2">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-5 flex flex-col items-center">
                              <div className="w-40 sm:w-44 h-48 sm:h-52 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-lg bg-amber-100 relative group">
                                <img
                                  src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80"
                                  alt="Normal Narsis Alviero"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <button
                                onClick={() => onSelectPackageForBooking('self-normal-narsis')}
                                className="-mt-3.5 z-10 px-6 py-1.5 rounded-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-extrabold text-xs tracking-wider uppercase shadow-md border border-slate-300 transition-all cursor-pointer active:scale-95"
                              >
                                PESAN
                              </button>
                            </div>

                            <div className="sm:col-span-7 space-y-2">
                              <div className="relative flex items-center justify-between">
                                <div className="bg-[#8c6b65] text-white font-serif font-bold text-xs sm:text-sm px-4 py-1.5 rounded-r-full shadow-xs tracking-wider uppercase">
                                  NORMAL NARSIS
                                </div>
                                <div className="w-12 h-12 rounded-full bg-[#8c6b65] text-white font-serif font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                                  80K
                                </div>
                              </div>

                              <div className="bg-[#c2aca5]/60 p-3 sm:p-4 rounded-2xl border border-[#b29a92] text-slate-800 text-xs space-y-1 leading-relaxed">
                                <p className="text-[11px] text-slate-700">Maksimal 5 orang Lebih dari 5 +15k/orang Unlimited shoots</p>
                                <p className="text-red-600 font-bold">Durasi 15 menit/sesi foto</p>
                                <p className="text-red-600 font-bold">Free cetak 2 polaroid</p>
                                <p>1 Background</p>
                                <p>Available fun props</p>
                                <p>All file Google Drive</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Normal Super Narsis 95K */}
                        <div className="relative pt-3 border-t border-[#c5b1aa]">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-7 space-y-2 order-2 sm:order-1">
                              <div className="relative flex items-center justify-between">
                                <div className="w-12 h-12 rounded-full bg-[#8c6b65] text-white font-serif font-black text-sm flex items-center justify-center shadow-md border-2 border-white">
                                  95K
                                </div>
                                <div className="bg-[#8c6b65] text-white font-serif font-bold text-xs sm:text-sm px-4 py-1.5 rounded-l-full shadow-xs tracking-wider uppercase">
                                  NORMAL SUPER NARSIS
                                </div>
                              </div>

                              <div className="bg-[#c2aca5]/60 p-3 sm:p-4 rounded-2xl border border-[#b29a92] text-slate-800 text-xs space-y-1 leading-relaxed text-right">
                                <p className="text-[11px] text-slate-700">Maksimal 5 orang Lebih dari 5 +15k/orang Unlimited shoots</p>
                                <p className="text-red-600 font-bold">Durasi 20 menit/sesi foto</p>
                                <p className="text-red-600 font-bold">Free cetak 2 polaroid</p>
                                <p>1 Background</p>
                                <p>Available fun props</p>
                                <p>All file Google Drive</p>
                              </div>
                            </div>

                            <div className="sm:col-span-5 flex flex-col items-center order-1 sm:order-2">
                              <div className="w-40 sm:w-44 h-48 sm:h-52 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-lg bg-amber-100 relative group">
                                <img
                                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80"
                                  alt="Normal Super Narsis Alviero"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <button
                                onClick={() => onSelectPackageForBooking('self-normal-super-narsis')}
                                className="-mt-3.5 z-10 px-6 py-1.5 rounded-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-extrabold text-xs tracking-wider uppercase shadow-md border border-slate-300 transition-all cursor-pointer active:scale-95"
                              >
                                PESAN
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Additional Box */}
                        <div className="bg-[#bda69f] text-white p-4 sm:p-5 rounded-3xl shadow-md space-y-3 relative">
                          <div className="text-center">
                            <span className="inline-block bg-[#8c6b65] text-white font-serif font-black text-xs px-4 py-1.5 rounded-xl shadow-2xs border border-white/20 uppercase tracking-wider">
                              ADDITIONAL
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs text-amber-50 leading-relaxed max-w-lg mx-auto">
                            <div className="flex justify-between items-center border-b border-white/20 pb-1">
                              <span>+ Waktu 20K/5 menit</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/20 pb-1">
                              <span>+ Cetak 7.5K/1 lembar foto</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/20 pb-1">
                              <span>+ Cetak 8K/2 lembar (GRID 3)</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/20 pb-1">
                              <span>+ Hewan Peliharaan selain Anjing (dari client) 25K</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/20 pb-1">
                              <span>+ Orang 15K/orang</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/20 pb-1">
                              <span>+ Sewa Kostum Dino 15K/orang <strong className="text-amber-200">(Sepasang 25K)</strong></span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/20 pb-1">
                              <span>+ Spotlight 25K (Khusus Background Tirai Coklat)</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center pt-1">
                          <p className="font-serif font-black text-sm tracking-widest text-[#8c6b65] uppercase">
                            FEEL FREE TO EXPRESS YOUR STYLE
                          </p>
                        </div>

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => onNavigateToRules?.()}
                            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                          >
                            <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Subtab 3: Self Colour Spotlight */}
                    {selfStudioSubTab === 'spotlight' && (
                      <div className="space-y-6 bg-gradient-to-b from-[#4954a1] via-[#7b5387] to-[#cd779f] rounded-3xl p-5 sm:p-7 border border-purple-400/50 shadow-xl text-white animate-in fade-in duration-200">
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 48 48" fill="currentColor">
                              <path d="M24 4L4 38H16L24 22L32 38H44L24 4Z" />
                              <path d="M24 28L19 38H29L24 28Z" fill="white" />
                            </svg>
                            <div className="text-left leading-none">
                              <span className="font-black text-xs text-white tracking-wider block">ALVIERO</span>
                              <span className="font-bold text-[10px] text-pink-200 tracking-widest block">STUDIO</span>
                            </div>
                          </div>

                          <h3 className="font-sans font-black text-2xl sm:text-3xl text-pink-300 tracking-wider uppercase drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]">
                            SELF
                          </h3>
                          <div className="font-sans font-black text-xl sm:text-2xl tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] uppercase border-2 border-pink-400/80 px-4 py-1 rounded-2xl inline-block bg-pink-500/20 backdrop-blur-sm">
                            COLOUR SPOTLIGHT
                          </div>
                        </div>

                        {/* Special Spotlight 99K */}
                        <div className="relative pt-2">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-5 flex flex-col items-center">
                              <div className="w-40 sm:w-44 h-48 sm:h-52 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-900 relative group">
                                <img
                                  src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80"
                                  alt="Special Colour Spotlight Alviero"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <button
                                onClick={() => onSelectPackageForBooking('self-special-spotlight')}
                                className="-mt-3.5 z-10 px-6 py-1.5 rounded-full bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-extrabold text-xs tracking-wider uppercase shadow-md border border-slate-300 transition-all cursor-pointer active:scale-95"
                              >
                                PESAN
                              </button>
                            </div>

                            <div className="sm:col-span-7 space-y-2">
                              <div className="relative flex items-center justify-between">
                                <div className="bg-[#78283d] text-white font-serif font-bold text-xs sm:text-sm px-4 py-1.5 rounded-r-full shadow-xs tracking-wider uppercase">
                                  <div>SPECIAL COLOUR SPOTLIGHT</div>
                                  <div className="text-[9px] text-pink-200 font-sans font-normal">(WAJIB MENGIKUTI SYARAT DAN KETENTUAN)</div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-[#78283d] text-white font-serif font-black text-sm flex items-center justify-center shadow-md border-2 border-white shrink-0">
                                  99K
                                </div>
                              </div>

                              <div className="bg-[#481525]/70 p-3 sm:p-4 rounded-2xl border border-pink-500/30 text-white text-xs space-y-1 leading-relaxed">
                                <p className="text-[11px] text-pink-200">Maksimal 5 orang, Lebih dari 5 +15k/orang Unlimited shoots</p>
                                <p className="text-red-400 font-bold">Durasi 20 menit/sesi foto</p>
                                <p className="text-red-400 font-bold">Free cetak 2 polaroid</p>
                                <p>1 Background</p>
                                <p>Available fun props</p>
                                <p>All file Google Drive</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Normal Spotlight 115K */}
                        <div className="relative pt-3 border-t border-purple-400/40">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            <div className="sm:col-span-7 space-y-2 order-2 sm:order-1">
                              <div className="relative flex items-center justify-between">
                                <div className="w-12 h-12 rounded-full bg-[#5b248a] text-white font-serif font-black text-sm flex items-center justify-center shadow-md border-2 border-white shrink-0">
                                  115K
                                </div>
                                <div className="bg-[#5b248a] text-white font-serif font-bold text-xs sm:text-sm px-4 py-1.5 rounded-l-full shadow-xs tracking-wider uppercase">
                                  NORMAL COLOUR SPOTLIGHT
                                </div>
                              </div>

                              <div className="bg-[#381159]/70 p-3 sm:p-4 rounded-2xl border border-purple-400/30 text-white text-xs space-y-1 leading-relaxed text-right">
                                <p className="text-[11px] text-purple-200">Maksimal 5 orang, Lebih dari 5 +15k/orang Unlimited shoots</p>
                                <p className="text-red-400 font-bold">Durasi 20 menit/sesi foto</p>
                                <p className="text-red-400 font-bold">Free cetak 2 polaroid</p>
                                <p>1 Background</p>
                                <p>Available fun props</p>
                                <p>All file Google Drive</p>
                              </div>
                            </div>

                            <div className="sm:col-span-5 flex flex-col items-center order-1 sm:order-2">
                              <div className="w-40 sm:w-44 h-48 sm:h-52 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-900 relative group">
                                <img
                                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80"
                                  alt="Normal Colour Spotlight Alviero"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <button
                                onClick={() => onSelectPackageForBooking('self-normal-spotlight')}
                                className="-mt-3.5 z-10 px-6 py-1.5 rounded-full bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-extrabold text-xs tracking-wider uppercase shadow-md border border-slate-300 transition-all cursor-pointer active:scale-95"
                              >
                                PESAN
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 4 Tilted Polaroids */}
                        <div className="pt-3 pb-1">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                            <div className="bg-white p-2 pb-5 rounded-sm shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                              <div className="aspect-square bg-slate-900 rounded-sm overflow-hidden">
                                <img
                                  src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80"
                                  alt="Spotlight Dual Tone Blue"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            <div className="bg-white p-2 pb-5 rounded-sm shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                              <div className="aspect-square bg-slate-900 rounded-sm overflow-hidden">
                                <img
                                  src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80"
                                  alt="Spotlight Circle Warm"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            <div className="bg-white p-2 pb-5 rounded-sm shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                              <div className="aspect-square bg-slate-900 rounded-sm overflow-hidden">
                                <img
                                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80"
                                  alt="Spotlight Cyber Pink"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            <div className="bg-white p-2 pb-5 rounded-sm shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                              <div className="aspect-square bg-slate-900 rounded-sm overflow-hidden">
                                <img
                                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80"
                                  alt="Spotlight Dark Shadow"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-center pt-2">
                          <p className="font-sans font-black text-sm tracking-widest text-pink-200 uppercase drop-shadow-sm">
                            FEEL FREE TO COLOURING YOUR STYLE
                          </p>
                        </div>

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => onNavigateToRules?.()}
                            className="inline-flex items-center gap-1.5 text-xs text-white hover:text-pink-200 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 shadow-2xs"
                          >
                            <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Subtab 4: Pilihan Grid Cetak Self Studio */}
                    {selfStudioSubTab === 'grid' && (
                      <div className="space-y-6 animate-in fade-in duration-300">

                        {/* Filter Jenis Grid */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-mask-x no-scrollbar">
                          {[
                            { id: 'all', label: 'Semua Grid (1, 3, 4, 6)', icon: '🎞️' },
                            { id: 'grid-3', label: 'Grid 3 (Photo Strip 3)', icon: '🌸' },
                            { id: 'grid-1', label: 'Grid 1 (Single Polaroid)', icon: '💜' },
                            { id: 'grid-4', label: 'Grid 4 (2x2 Quad Cut)', icon: '🌿' },
                            { id: 'grid-6', label: 'Grid 6 (2x3 Six Cut)', icon: '🌊' },
                          ].map((gf) => {
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

                        {/* 1. POSTER SERI GRID 3 (PINK PASTEL THEME) */}
                        {(selectedGridFilter === 'all' || selectedGridFilter === 'grid-3') && (
                          <div className="bg-[#eed1cb] rounded-3xl p-5 sm:p-7 border border-[#e2beb7] shadow-lg text-slate-900 space-y-6 relative overflow-hidden">
                            {/* Background Curved Lines */}
                            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border-2 border-white/40 pointer-events-none" />
                            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full border-2 border-white/40 pointer-events-none" />

                            <div className="text-center space-y-0.5 relative z-10">
                              <h3 className="font-black text-xl sm:text-2xl text-slate-900 tracking-wider uppercase">
                                PILIHAN GRID CETAK
                              </h3>
                              <h4 className="font-black text-lg sm:text-xl text-slate-900 tracking-widest uppercase">
                                SELF STUDIO
                              </h4>
                              <span className="inline-block text-[11px] font-bold text-slate-700 bg-white/60 px-3 py-0.5 rounded-full mt-1">
                                Format Photo Strip 3 Baris Vertikal
                              </span>
                            </div>

                            {/* 5 Grid 3 Strips */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4 relative z-10 pt-1">

                              {/* Grid 3 A: White Classic */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-white p-2.5 pb-4 rounded-sm shadow-md border border-slate-200 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="w-full aspect-[4/3] bg-amber-400 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=300&q=80" alt="3A-1" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="w-full aspect-[4/3] bg-amber-400 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" alt="3A-2" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="w-full aspect-[4/3] bg-amber-400 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" alt="3A-3" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-slate-900 leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-500 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 3 A</span>
                              </div>

                              {/* Grid 3 B: Pastel Pink Grid */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#fdeef0] p-2.5 pb-4 rounded-sm shadow-md border border-pink-200 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl relative">
                                  <div className="w-full aspect-[4/3] bg-pink-100 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80" alt="3B-1" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="w-full aspect-[4/3] bg-pink-100 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=300&q=80" alt="3B-2" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="w-full aspect-[4/3] bg-pink-100 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" alt="3B-3" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-slate-900 leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-500 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 3 B</span>
                              </div>

                              {/* Grid 3 C: Peach Vintage Doodle */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#fce5cf] p-2.5 pb-4 rounded-sm shadow-md border border-amber-300 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="w-full aspect-[4/3] bg-amber-100 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=300&q=80" alt="3C-1" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="w-full aspect-[4/3] bg-amber-100 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=300&q=80" alt="3C-2" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="w-full aspect-[4/3] bg-amber-100 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80" alt="3C-3" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-slate-900 leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-500 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 3 C</span>
                              </div>

                              {/* Grid 3 D: Minimal Black Frame */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#18181b] p-2.5 pb-4 rounded-sm shadow-md border border-slate-800 text-white flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl relative">
                                  <div className="text-[6px] tracking-widest font-mono text-slate-400">BEST MOMENT</div>
                                  <div className="w-full aspect-[4/3] bg-slate-800 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=300&q=80" alt="3D-1" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="w-full aspect-[4/3] bg-slate-800 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=300&q=80" alt="3D-2" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="w-full aspect-[4/3] bg-slate-800 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1627556704302-624286467c65?auto=format&fit=crop&w=300&q=80" alt="3D-3" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-white leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-400 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 3 D</span>
                              </div>

                              {/* Grid 3 E: 35mm Cinema Film Roll */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#111113] p-2 pb-4 rounded-sm shadow-md border-x-4 border-slate-700 text-white flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl relative">
                                  <div className="w-full aspect-[4/3] bg-slate-800 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80" alt="3E-1" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="w-full aspect-[4/3] bg-slate-800 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80" alt="3E-2" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="w-full aspect-[4/3] bg-slate-800 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80" alt="3E-3" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-white leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-400 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 3 E</span>
                              </div>
                            </div>

                            <div className="text-center pt-2 relative z-10">
                              <p className="font-serif font-black text-xs sm:text-sm tracking-widest text-slate-700 uppercase">
                                FEEL FREE TO EXPRESS YOUR STYLE
                              </p>
                            </div>
                          </div>
                        )}

                        {/* 2. POSTER SERI GRID 1 (LILAC / LAVENDER THEME) */}
                        {(selectedGridFilter === 'all' || selectedGridFilter === 'grid-1') && (
                          <div className="bg-[#cdd0e5] rounded-3xl p-5 sm:p-7 border border-[#b9bed9] shadow-lg text-slate-900 space-y-6 relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border-2 border-white/40 pointer-events-none" />
                            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full border-2 border-white/40 pointer-events-none" />

                            <div className="text-center space-y-0.5 relative z-10">
                              <h3 className="font-black text-xl sm:text-2xl text-slate-900 tracking-wider uppercase">
                                PILIHAN GRID CETAK
                              </h3>
                              <h4 className="font-black text-lg sm:text-xl text-slate-900 tracking-widest uppercase">
                                SELF STUDIO
                              </h4>
                              <span className="inline-block text-[11px] font-bold text-slate-700 bg-white/60 px-3 py-0.5 rounded-full mt-1">
                                Format Single Big Polaroid (1 Frame Utuh)
                              </span>
                            </div>

                            {/* 5 Grid 1 Polaroids */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4 relative z-10 pt-1">

                              {/* Grid 1 A */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-white p-3 pb-6 rounded-sm shadow-md border border-slate-200 flex flex-col items-center space-y-2 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="w-full aspect-[3/4] bg-slate-100 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=500&q=80" alt="1A" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="pt-2 text-center">
                                    <div className="text-[8px] font-black tracking-widest text-slate-900 leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-500 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 1 A</span>
                              </div>

                              {/* Grid 1 B */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#f3f4fa] p-3 pb-6 rounded-sm shadow-md border border-indigo-200 flex flex-col items-center space-y-2 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="w-full aspect-[3/4] bg-slate-100 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=80" alt="1B" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="pt-2 text-center">
                                    <div className="text-[8px] font-black tracking-widest text-slate-900 leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-500 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 1 B</span>
                              </div>

                              {/* Grid 1 C */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#fae8d4] p-3 pb-6 rounded-sm shadow-md border border-amber-300 flex flex-col items-center space-y-2 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="w-full aspect-[3/4] bg-slate-100 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=500&q=80" alt="1C" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="pt-2 text-center">
                                    <div className="text-[8px] font-black tracking-widest text-slate-900 leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-500 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 1 C</span>
                              </div>

                              {/* Grid 1 D */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#18181b] p-3 pb-6 rounded-sm shadow-md border border-slate-800 text-white flex flex-col items-center space-y-2 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="text-[6px] tracking-widest font-mono text-slate-400">BEST MOMENT</div>
                                  <div className="w-full aspect-[3/4] bg-slate-800 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80" alt="1D" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="pt-2 text-center">
                                    <div className="text-[8px] font-black tracking-widest text-white leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-400 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 1 D</span>
                              </div>

                              {/* Grid 1 E */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#111113] p-2.5 pb-6 rounded-sm shadow-md border-x-4 border-slate-700 text-white flex flex-col items-center space-y-2 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="w-full aspect-[3/4] bg-slate-800 overflow-hidden rounded-xs">
                                    <img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=80" alt="1E" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="pt-2 text-center">
                                    <div className="text-[8px] font-black tracking-widest text-white leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-400 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 1 E</span>
                              </div>
                            </div>

                            <div className="text-center pt-2 relative z-10">
                              <p className="font-serif font-black text-xs sm:text-sm tracking-widest text-slate-700 uppercase">
                                FEEL FREE TO EXPRESS YOUR STYLE
                              </p>
                            </div>
                          </div>
                        )}

                        {/* 3. POSTER SERI GRID 4 (SAGE GREEN THEME) */}
                        {(selectedGridFilter === 'all' || selectedGridFilter === 'grid-4') && (
                          <div className="bg-[#b9bcab] rounded-3xl p-5 sm:p-7 border border-[#a6aa96] shadow-lg text-slate-900 space-y-6 relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border-2 border-white/40 pointer-events-none" />
                            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full border-2 border-white/40 pointer-events-none" />

                            <div className="text-center space-y-0.5 relative z-10">
                              <h3 className="font-black text-xl sm:text-2xl text-slate-900 tracking-wider uppercase">
                                PILIHAN GRID CETAK
                              </h3>
                              <h4 className="font-black text-lg sm:text-xl text-slate-900 tracking-widest uppercase">
                                SELF STUDIO
                              </h4>
                              <span className="inline-block text-[11px] font-bold text-slate-700 bg-white/60 px-3 py-0.5 rounded-full mt-1">
                                Format 2x2 (4 Foto Quad Cut Grid)
                              </span>
                            </div>

                            {/* 5 Grid 4 Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4 relative z-10 pt-1">

                              {/* Grid 4 A */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-white p-2.5 pb-4 rounded-sm shadow-md border border-slate-200 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="grid grid-cols-2 gap-1 w-full aspect-square">
                                    <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=200&q=80" alt="4A-1" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80" alt="4A-2" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=200&q=80" alt="4A-3" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="4A-4" className="w-full h-full object-cover rounded-2xs" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-slate-900 leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-500 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 4 A</span>
                              </div>

                              {/* Grid 4 B */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#f4f7ee] p-2.5 pb-4 rounded-sm shadow-md border border-emerald-200 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="grid grid-cols-2 gap-1 w-full aspect-square">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="4B-1" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" alt="4B-2" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=200&q=80" alt="4B-3" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80" alt="4B-4" className="w-full h-full object-cover rounded-2xs" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-slate-900 leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-500 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 4 B</span>
                              </div>

                              {/* Grid 4 C */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#fce5cf] p-2.5 pb-4 rounded-sm shadow-md border border-amber-300 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="grid grid-cols-2 gap-1 w-full aspect-square">
                                    <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=200&q=80" alt="4C-1" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=200&q=80" alt="4C-2" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80" alt="4C-3" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1627556704302-624286467c65?auto=format&fit=crop&w=200&q=80" alt="4C-4" className="w-full h-full object-cover rounded-2xs" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-slate-900 leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-500 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 4 C</span>
                              </div>

                              {/* Grid 4 D */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#18181b] p-2.5 pb-4 rounded-sm shadow-md border border-slate-800 text-white flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="text-[6px] tracking-widest font-mono text-slate-400">BEST MOMENT</div>
                                  <div className="grid grid-cols-2 gap-1 w-full aspect-square">
                                    <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=200&q=80" alt="4D-1" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=200&q=80" alt="4D-2" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=200&q=80" alt="4D-3" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=200&q=80" alt="4D-4" className="w-full h-full object-cover rounded-2xs" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-white leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-400 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 4 D</span>
                              </div>

                              {/* Grid 4 E */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#111113] p-2 pb-4 rounded-sm shadow-md border-x-4 border-slate-700 text-white flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="grid grid-cols-2 gap-1 w-full aspect-square">
                                    <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80" alt="4E-1" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="4E-2" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="4E-3" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=200&q=80" alt="4E-4" className="w-full h-full object-cover rounded-2xs" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-white leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-400 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-800">Grid 4 E</span>
                              </div>
                            </div>

                            <div className="text-center pt-2 relative z-10">
                              <p className="font-serif font-black text-xs sm:text-sm tracking-widest text-slate-700 uppercase">
                                “FEEL FREE TO EXPRESS YOUR STYLE”
                              </p>
                            </div>
                          </div>
                        )}

                        {/* 4. POSTER SERI GRID 6 (STEEL BLUE THEME) */}
                        {(selectedGridFilter === 'all' || selectedGridFilter === 'grid-6') && (
                          <div className="bg-[#8893a7] rounded-3xl p-5 sm:p-7 border border-[#768297] shadow-lg text-slate-900 space-y-6 relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border-2 border-white/40 pointer-events-none" />
                            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full border-2 border-white/40 pointer-events-none" />

                            <div className="text-center space-y-0.5 relative z-10">
                              <h3 className="font-black text-xl sm:text-2xl text-slate-900 tracking-wider uppercase">
                                PILIHAN GRID CETAK
                              </h3>
                              <h4 className="font-black text-lg sm:text-xl text-slate-900 tracking-widest uppercase">
                                SELF STUDIO
                              </h4>
                              <span className="inline-block text-[11px] font-bold text-slate-800 bg-white/70 px-3 py-0.5 rounded-full mt-1">
                                Format 2x3 (6 Foto Six-Cut Grid)
                              </span>
                            </div>

                            {/* 5 Grid 6 Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4 relative z-10 pt-1">

                              {/* Grid 6 A */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-white p-2 pb-4 rounded-sm shadow-md border border-slate-200 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="grid grid-cols-2 gap-1 w-full aspect-[2/3]">
                                    <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=200&q=80" alt="6A-1" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80" alt="6A-2" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="6A-3" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" alt="6A-4" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=200&q=80" alt="6A-5" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80" alt="6A-6" className="w-full h-full object-cover rounded-2xs" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-slate-900 leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-500 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-900">Grid 6 A</span>
                              </div>

                              {/* Grid 6 B */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#f3f4fa] p-2 pb-4 rounded-sm shadow-md border border-indigo-200 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="grid grid-cols-2 gap-1 w-full aspect-[2/3]">
                                    <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=200&q=80" alt="6B-1" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=200&q=80" alt="6B-2" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80" alt="6B-3" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1627556704302-624286467c65?auto=format&fit=crop&w=200&q=80" alt="6B-4" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=200&q=80" alt="6B-5" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=200&q=80" alt="6B-6" className="w-full h-full object-cover rounded-2xs" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-slate-900 leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-500 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-900">Grid 6 B</span>
                              </div>

                              {/* Grid 6 C */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#fce5cf] p-2 pb-4 rounded-sm shadow-md border border-amber-300 flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="grid grid-cols-2 gap-1 w-full aspect-[2/3]">
                                    <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=200&q=80" alt="6C-1" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=200&q=80" alt="6C-2" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80" alt="6C-3" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="6C-4" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="6C-5" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" alt="6C-6" className="w-full h-full object-cover rounded-2xs" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-slate-900 leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-500 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-900">Grid 6 C</span>
                              </div>

                              {/* Grid 6 D: Dual 35mm Film Roll */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#111113] p-1.5 pb-4 rounded-sm shadow-md border-x-4 border-slate-700 text-white flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="grid grid-cols-2 gap-1 w-full aspect-[2/3]">
                                    <img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=200&q=80" alt="6D-1" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80" alt="6D-2" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=200&q=80" alt="6D-3" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=200&q=80" alt="6D-4" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80" alt="6D-5" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1627556704302-624286467c65?auto=format&fit=crop&w=200&q=80" alt="6D-6" className="w-full h-full object-cover rounded-2xs" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-white leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-400 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-900">Grid 6 D</span>
                              </div>

                              {/* Grid 6 E */}
                              <div className="flex flex-col items-center space-y-1.5 group">
                                <div className="w-full bg-[#18181b] p-2 pb-4 rounded-sm shadow-md border border-slate-800 text-white flex flex-col items-center space-y-1.5 transition-transform duration-300 group-hover:scale-103 group-hover:shadow-xl">
                                  <div className="text-[6px] tracking-widest font-mono text-slate-400">BEST MOMENT</div>
                                  <div className="grid grid-cols-2 gap-1 w-full aspect-[2/3]">
                                    <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=200&q=80" alt="6E-1" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=200&q=80" alt="6E-2" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=200&q=80" alt="6E-3" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=200&q=80" alt="6E-4" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80" alt="6E-5" className="w-full h-full object-cover rounded-2xs" />
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="6E-6" className="w-full h-full object-cover rounded-2xs" />
                                  </div>
                                  <div className="pt-1 text-center">
                                    <div className="text-[7.5px] font-black tracking-widest text-white leading-none">ALVIERO</div>
                                    <div className="text-[6.5px] font-bold text-slate-400 tracking-wider">STUDIO</div>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs text-slate-900">Grid 6 E</span>
                              </div>
                            </div>

                            <div className="text-center pt-2 relative z-10">
                              <p className="font-serif font-black text-xs sm:text-sm tracking-widest text-slate-800 uppercase">
                                “FEEL FREE TO EXPRESS YOUR STYLE”
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => onNavigateToRules?.()}
                            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                          >
                            <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. SPECIAL FIGMA VIEW FOR UNDANGAN PACKAGES */}
                {activeMenuCategory === 'undangan-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">STUDIO SESSIONS</span>
                      <div className="bg-slate-200/80 text-slate-900 font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl inline-block shadow-2xs">
                        HARGA PAKET UNDANGAN
                      </div>
                    </div>

                    <div className="space-y-6 pt-1">
                      {/* Paket Undangan 1 */}
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Paket Undangan 1</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Undangan 1</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>maks 2 Orang</p>
                          <p>maks 5 gaya</p>
                          <p>Allfile Via Googledrive</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">95K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('undangan-paket-1')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Paket Undangan 2 */}
                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-400 font-medium font-serif">Undangan 2 ——</span>
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Paket Undangan 2</h4>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>maks 4 Orang</p>
                          <p>maks 5 gaya</p>
                          <p>Allfile Via Googledrive</p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">155K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('undangan-paket-2')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToRules?.()}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                      >
                        <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. SPECIAL FIGMA VIEW FOR SEWA STUDIO */}
                {activeMenuCategory === 'sewa-studio' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">STUDIO SESSIONS</span>
                      <div className="bg-slate-200/80 text-slate-900 font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl inline-block shadow-2xs">
                        HARGA PAKET SEWA STUDIO
                      </div>
                    </div>

                    <div className="space-y-6 pt-1">
                      <div className="border-b border-slate-100 pb-5 space-y-3">
                        <div className="text-sm sm:text-base text-slate-600 font-serif space-y-1 leading-relaxed">
                          <p className="font-semibold text-slate-800">2 Background</p>
                          <p>maks 60 Menit</p>
                          <p className="text-slate-700 font-medium">2 Lighting | 1 Trigger | 2 Stand light</p>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif">175K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('sewa-studio-hourly')}
                            className="px-7 py-3 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95 self-start sm:self-center"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToRules?.()}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                      >
                        <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. SPECIAL FIGMA VIEW FOR PREWEDD PACKAGES */}
                {activeMenuCategory === 'prewed-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">STUDIO SESSIONS</span>
                      <div className="bg-slate-200/80 text-slate-900 font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl inline-block shadow-2xs">
                        HARGA PAKET PREWEDD
                      </div>
                    </div>

                    <div className="space-y-6 pt-1">
                      {/* Sweet Promise */}
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Sweet Promise</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Prewedd 1</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>Maks 50 Menit | <span className="text-rose-600 font-bold">1 background</span></p>
                          <p>Edit 10 foto | <span className="text-rose-600 font-bold">allfile google drive</span></p>
                          <p>Maks 2 kostum | <span className="text-rose-600 font-bold">Cetak 12Rs + Bingkai</span></p>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">550K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('prewed-sweet-promise')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Velvet Romance */}
                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-400 font-medium font-serif">Prewedd 2 ——</span>
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Velvet Romance</h4>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>Maks 60 Menit | <span className="text-rose-600 font-bold">2 bakcground</span></p>
                          <p>Edit 13 foto | <span className="text-rose-600 font-bold">allfile via google drive</span></p>
                          <p>Maks 2 kostum | <span className="text-rose-600 font-bold">Cetak 12 + Bingkai</span></p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">600K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('prewed-velvet-romance')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Bundling 1, Bundling 2 & Additional */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start border-b border-slate-100 pb-5">
                        <div className="md:col-span-4 bg-slate-100 rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-2.5 order-3 md:order-1">
                          <h4 className="text-center font-serif font-black text-base text-slate-900">Additional</h4>
                          <div className="space-y-1.5 text-xs text-slate-800">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Background</span><span className="font-bold">75K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Hairdo</span><span className="font-bold">150K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Make UP</span><span className="font-bold">350K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Edit</span><span className="font-bold">10K</span></div>
                          </div>
                          <div className="text-center pt-1.5">
                            <span className="inline-block bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-xs tracking-wider uppercase animate-pulse">
                              FREE PAS FOTO
                            </span>
                          </div>
                        </div>

                        <div className="md:col-span-8 space-y-5 order-1 md:order-2">
                          {/* Bundling 1 */}
                          <div className="space-y-2 text-left">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Bundling 1</h4>
                              <span className="text-xs text-slate-400 font-medium font-serif">—— Prewedd 3</span>
                            </div>
                            <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                              <p><span className="text-rose-600 font-bold">Paket Sweet Promise</span> + Make Up</p>
                              <p>Hijab Do, Softlens</p>
                              <p>Sepasang Kostum (bisa memilih)</p>
                            </div>
                            <div className="pt-1 flex items-center justify-between gap-3">
                              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">1.400K</div>
                              <button
                                onClick={() => onSelectPackageForBooking('prewed-bundling-1')}
                                className="px-6 py-2 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                              >
                                KLIK UNTUK PESAN
                              </button>
                            </div>
                          </div>

                          {/* Bundling 2 */}
                          <div className="space-y-2 text-right border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs text-slate-400 font-medium font-serif">Prewedd 4 ——</span>
                              <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Bundling 2</h4>
                            </div>
                            <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                              <p><span className="text-rose-600 font-bold">Paket Velvet Romance</span> + Make Up</p>
                              <p>Hijab Do, Softlens</p>
                              <p>Sepasang Kostum (bisa memilih)</p>
                            </div>
                            <div className="pt-1 flex items-center justify-end gap-3">
                              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">1.500K</div>
                              <button
                                onClick={() => onSelectPackageForBooking('prewed-bundling-2')}
                                className="px-6 py-2 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                              >
                                KLIK UNTUK PESAN
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToRules?.()}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                      >
                        <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. SPECIAL FIGMA VIEW FOR COUPLE PACKAGES */}
                {activeMenuCategory === 'couple-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">STUDIO SESSIONS</span>
                      <div className="bg-slate-200/80 text-slate-900 font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl inline-block shadow-2xs">
                        HARGA PAKET COUPLE
                      </div>
                    </div>

                    <div className="space-y-6 pt-1">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start border-b border-slate-100 pb-5">
                        <div className="md:col-span-7 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Eternal Love</h4>
                            <span className="text-xs text-slate-400 font-medium font-serif">—— Couple 1</span>
                          </div>
                          <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                            <p>Unlimited foto Maks 30 menit | 1 background</p>
                            <p>6 Edit foto | all file google drive | Maks 1 outfit</p>
                            <p>Cetak Uk 4r 4 foto / 10Rs 1 Foto</p>
                          </div>
                          <div className="pt-2 flex items-center justify-between gap-3">
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">255K</div>
                            <button
                              onClick={() => onSelectPackageForBooking('couple-eternal-love')}
                              className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                            >
                              KLIK UNTUK PESAN
                            </button>
                          </div>
                        </div>

                        <div className="md:col-span-5 bg-slate-100 rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-2.5">
                          <h4 className="text-center font-serif font-black text-base text-slate-900">Additional</h4>
                          <div className="space-y-1.5 text-xs text-slate-800">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Background</span><span className="font-bold">75K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Outfit</span><span className="font-bold">50K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Edit</span><span className="font-bold">10K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5 text-rose-600 font-bold"><span>+ Make Up</span><span>250K</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Sweet Memories</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">Couple 2 ——</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>Unlimited foto Maks 40 menit | 2 background</p>
                          <p>8 Edit foto | all file google drive | Maks 1 outfit</p>
                          <p>Cetak Uk 4r 4 foto / 10Rs 1 Foto</p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">305K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('couple-sweet-memories')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToRules?.()}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                      >
                        <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. SPECIAL FIGMA VIEW FOR PERSONAL PACKAGES */}
                {activeMenuCategory === 'personal-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">STUDIO SESSIONS</span>
                      <div className="bg-slate-200/80 text-slate-900 font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl inline-block shadow-2xs">
                        HARGA PAKET PERSONAL
                      </div>
                    </div>

                    <div className="space-y-6 pt-1">
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Bold Statement</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— personal 1</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>Unlimited Foto Maks 20 menit | 1 background</p>
                          <p>edit 5 foto | Allfile Via Google Drive | maks 1 Outfit</p>
                          <p>Cetak Uk 4R Foto <span className="text-rose-600 font-bold">Atau</span> 10Rs 1 foto</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">155K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('personal-bold-statement')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start border-b border-slate-100 pb-5">
                        <div className="md:col-span-5 bg-slate-100 rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-2.5 order-2 md:order-1">
                          <h4 className="text-center font-serif font-black text-base text-slate-900">Additional</h4>
                          <div className="space-y-1.5 text-xs text-slate-800">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Background</span><span className="font-bold">50K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Kostum</span><span className="font-bold">50K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Make Up</span><span className="font-bold">250K</span></div>
                          </div>
                        </div>

                        <div className="md:col-span-7 space-y-2 text-right order-1 md:order-2">
                          <div className="flex items-center justify-end gap-2">
                            <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Opulent Shot</h4>
                            <span className="text-xs text-slate-400 font-medium font-serif">personal 2 ——</span>
                          </div>
                          <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                            <p>Unlimited Foto Maks 25 Menit | 2 Background</p>
                            <p>Edit 6 Foto | Allfile Via google Drive | Maks 2 Outfit</p>
                            <p>Cetak Uk 4R 4 Foto <span className="text-rose-600 font-bold">Atau</span> 10Rs 1 Foto</p>
                          </div>
                          <div className="pt-2 flex items-center justify-end gap-3">
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">255K</div>
                            <button
                              onClick={() => onSelectPackageForBooking('personal-opulent-shot')}
                              className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                            >
                              KLIK UNTUK PESAN
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToRules?.()}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                      >
                        <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. SPECIAL FIGMA VIEW FOR MATERNITY PACKAGES */}
                {activeMenuCategory === 'maternity-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">STUDIO SESSIONS</span>
                      <div className="bg-slate-200/80 text-slate-900 font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl inline-block shadow-2xs">
                        HARGA PAKET MATERNITY
                      </div>
                    </div>

                    <div className="space-y-6 pt-1">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start border-b border-slate-100 pb-5">
                        <div className="md:col-span-7 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Warm Embrace</h4>
                            <span className="text-xs text-slate-400 font-medium font-serif">—— Maternity 1</span>
                          </div>
                          <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                            <p>Unlimited foto Maks 30 Menit | 1 Background</p>
                            <p>Edit 6 Foto | Cetak Uk 10Rs 2 Foto | Maks 1 kostum</p>
                            <p>Allfile via GoogleDrive</p>
                          </div>
                          <div className="pt-2 flex items-center justify-between gap-3">
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">255K</div>
                            <button
                              onClick={() => onSelectPackageForBooking('maternity-warm-embrace')}
                              className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                            >
                              KLIK UNTUK PESAN
                            </button>
                          </div>
                        </div>

                        <div className="md:col-span-5 bg-slate-100 rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-2.5">
                          <h4 className="text-center font-serif font-black text-base text-slate-900">Additional</h4>
                          <div className="space-y-1.5 text-xs text-slate-800">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Background</span><span className="font-bold">75K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Kostum</span><span className="font-bold">50K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Edit</span><span className="font-bold">10K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5 text-rose-600 font-bold"><span>+ Make up</span><span>250K</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Golden Motherhood</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">maternity 2 ——</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>Unlimited Foto Maks 40 Menit | 2 background</p>
                          <p>8 Edit foto | Allfile via google drive | Cetak Uk 10Rs 2 Foto</p>
                          <p>Maks 2 kostum</p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">305K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('maternity-golden-motherhood')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToRules?.()}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                      >
                        <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 8. SPECIAL FIGMA VIEW FOR BIRTHDAY PACKAGES */}
                {activeMenuCategory === 'event' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">STUDIO SESSIONS</span>
                      <div className="bg-slate-200/80 text-slate-900 font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl inline-block shadow-2xs">
                        HARGA PAKET BIRTHDAY
                      </div>
                    </div>

                    <div className="space-y-6 pt-1">
                      {/* Birthday 1: Sweet Celebration */}
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Sweet Celebration</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Birthday 1</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>Foto 25 Menit | 1 background foto | <span className="text-rose-600 font-bold">1 Person</span></p>
                          <p>All file via Google Drive | 6 foto Edit | 2 Foto Cetak Uk 10Rs</p>
                          <p><span className="text-rose-600 font-bold">Properti birthday Dari Klien</span></p>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">199K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('birthday-sweet-celebration')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Birthday 2: Glow Sweet Celebration */}
                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-400 font-medium font-serif">Birthday 2 ——</span>
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Glow Sweet Celebration</h4>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>Foto 30 Menit | 1 Background Foto | <span className="text-rose-600 font-bold">2 - 3 Person</span></p>
                          <p>All file Google Drive | <span className="text-rose-600 font-bold">6 Foto Edit</span> | 2 Foto cetak Uk 10Rs</p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">275K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('birthday-glow-sweet')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Birthday 3: Sweet Light */}
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Sweet Light</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Birthday 3</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>Foto 30 Menit | 1 Background foto | <span className="text-rose-600 font-bold">1 Person</span> | All file via Google Drive</p>
                          <p>8 Foto edit | 2 Foto cetak Uk 10Rs</p>
                          <p><span className="text-rose-600 font-bold">Include Properti:</span> tulisan birthday, 12 Balon Latex, 1 Balon Angka 80cm</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">250K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('birthday-sweet-light')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Birthday 4: Ultimate Sweet Light */}
                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-400 font-medium font-serif">Birthday 4 ——</span>
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Ultimate Sweet Light</h4>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>Foto 30 Menit | 1 Background | <span className="text-rose-600 font-bold">2 - 3 Person</span> | All file via Google Drive</p>
                          <p>8 Edit foto | 2 Cetak foto Uk 10Rs</p>
                          <p><span className="text-rose-600 font-bold">Include Properti:</span> tulisan birthday, balon 12 pas, balon angka bebas pilihan warna</p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">325K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('birthday-ultimate-sweet-light')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToRules?.()}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                      >
                        <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 9. SPECIAL FIGMA VIEW FOR FAMILY PACKAGES */}
                {activeMenuCategory === 'family-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">STUDIO SESSIONS</span>
                      <div className="bg-slate-200/80 text-slate-900 font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl inline-block shadow-2xs">
                        HARGA PAKET FAMILY
                      </div>
                    </div>

                    <div className="space-y-6 pt-1">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start border-b border-slate-100 pb-5">
                        <div className="md:col-span-7 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Sweet Together</h4>
                            <span className="text-xs text-slate-400 font-medium font-serif">—— Family 1</span>
                          </div>
                          <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                            <p>Unlimited foto Maks 30 menit | 1 background</p>
                            <p>Edit 6 foto | all file via Googledrive | Cetak Uk 10Rs 2 Foto</p>
                            <p>Maks 10 orang dalam 1 Frame | Maks 1 Kostum</p>
                          </div>
                          <div className="pt-2 flex items-center justify-between gap-3">
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">330K</div>
                            <button
                              onClick={() => onSelectPackageForBooking('family-sweet-together')}
                              className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                            >
                              KLIK UNTUK PESAN
                            </button>
                          </div>
                        </div>

                        <div className="md:col-span-5 bg-slate-100 rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-2.5">
                          <h4 className="text-center font-serif font-black text-base text-slate-900">Additional</h4>
                          <div className="space-y-1.5 text-xs text-slate-800">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Bingkai Uk 10rs</span><span className="font-bold">35K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Background</span><span className="font-bold">75K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Kostum</span><span className="font-bold">50K</span></div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5"><span>+ Orang</span><span className="font-bold">10K</span></div>
                          </div>
                          <p className="text-[10px] text-rose-600 font-bold text-center leading-tight pt-1">
                            Potongan 50K khusus yang hanya ada 3 anggota keluarga
                          </p>
                        </div>
                      </div>

                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Happy Nest</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Family 2</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>Unlimited foto maks 40 menit | 2 background | Edit 8 foto</p>
                          <p>all file via google drive | Cetak Uk 10Rs 2 Foto</p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">380K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('family-happy-nest')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToRules?.()}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                      >
                        <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 10. SPECIAL FIGMA VIEW FOR GROUP PACKAGES */}
                {activeMenuCategory === 'group-paket' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">STUDIO SESSIONS</span>
                      <div className="bg-slate-200/80 text-slate-900 font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl inline-block shadow-2xs">
                        HARGA PAKET GROUP
                      </div>
                    </div>

                    <div className="space-y-6 pt-1">
                      {/* Group 1: Friendly Frame */}
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Friendly Frame</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Group 1</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">Jumlah 3-10 Orang</span> | Maks 30 Menit</p>
                          <p>1 background | Edit 6 foto | maks 2 kostum | Allfile via google drive</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">330K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('group-friendly-frame')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Group 2: Signature Squad */}
                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-400 font-medium font-serif">Group 2 ——</span>
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Signature Squad</h4>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">Jumlah 11 - 20 Orang</span> | Maks 45 Menit</p>
                          <p>1 Background | edit 6 foto | maks 2 kostum | Allfile via google drive</p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">430K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('group-signature-squad')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Group 3: Royal Ensemble */}
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Royal Ensemble</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Group 3</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">Jumlah 21 - 30 Orang</span> | Maks 50 Menit</p>
                          <p>1 background | Edit 6 foto | maks 2 kostum | Allfile via google drive</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">510K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('group-royal-ensemble')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Group 4: Imperial Union */}
                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-400 font-medium font-serif">Group 4 ——</span>
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Imperial Union</h4>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">Jumlah 31 - 40 Orang</span> (diatas 40 +10K/Org Maks 75 Org)</p>
                          <p>Maks 55 menit | 1 background | Edit 6 foto | Maks 2 kostum | Allfile via google drive</p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">630K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('group-imperial-union')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToRules?.()}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                      >
                        <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 11. SPECIAL FIGMA VIEW FOR PASS FOTO */}
                {activeMenuCategory === 'pass-foto' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">STUDIO SESSIONS</span>
                      <div className="bg-slate-200/80 text-slate-900 font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl inline-block shadow-2xs">
                        HARGA PAKET PASS FOTO
                      </div>
                    </div>

                    <div className="space-y-6 pt-1">
                      {/* Pass foto 1 */}
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Pass foto 1</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Paket 1</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">3 Warna</span> Background Edit | Maks 1 Outfit | 1 Edit foto</p>
                          <p>File Edit via WA Dokumen | Cetak 1 Ukuran Pass Foto</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">50K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('passfoto-1')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Pass foto 2 */}
                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-400 font-medium font-serif">Paket 2 ——</span>
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Pass foto 2</h4>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">3 Background Edit</span> Setengah Badan | Edit 1 Full Badan</p>
                          <p>Setengah Badan & Full Badan | File Edit via WA Dokumen | Maks 1 Outfit | Cetak 1 Ukuran Pass Foto</p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">90K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('passfoto-2')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Pass foto 3 */}
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Pass foto 3</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Paket 3</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">Paket Nikah Untuk 2 Orang</span> | 3 Warna Background</p>
                          <p>Masing-masing 1 Edit Foto | File edit via WA Dokumen | Cetak Pass Foto</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">98K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('passfoto-3')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToRules?.()}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                      >
                        <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 12. SPECIAL FIGMA VIEW FOR GRADUATION INDOOR */}
                {activeMenuCategory === 'grad-indoor' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">STUDIO SESSIONS</span>
                      <div className="bg-slate-200/80 text-slate-900 font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl inline-block shadow-2xs">
                        HARGA PAKET GRADUATION INDOOR
                      </div>
                    </div>

                    <div className="space-y-6 pt-1">
                      {/* Elegant Scholar */}
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Elegant Scholar</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Graduation Indoor 1</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">1 Wisudawan</span> + Family Maks 10 Org/frame</p>
                          <p>Unlimited Foto 30 menit | 1 Background | Edit 6 foto | Cetak Uk 10Rs 2 foto</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">330K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('grad-indoor-elegant-scholar')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Supreme Scholar */}
                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-400 font-medium font-serif">Graduation Indoor 2 ——</span>
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Supreme Scholar</h4>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">1 wisudawan</span> + family Maks 10 Org/Frame | Unlimited 40 Menit</p>
                          <p>2 Background | Edit 8 Foto | Cetak Uk 10Rs 2 foto</p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">380K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('grad-indoor-supreme-scholar')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Infinity Scholar */}
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Infinity Scholar</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Graduation Indoor 3</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">2 Wisudawan</span> + Family Maks 10 Org/frame | Unlimited 40 Menit</p>
                          <p>2 Background | all file via Google Drive | Edit 10 foto | Cetak Uk 10Rs 2 foto</p>
                          <p className="text-[11px] text-rose-600 font-semibold">*Khusus 2 wisudawan saudara kandung jadi 425K</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">530K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('grad-indoor-infinity-scholar')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Bundling 1 (Ultimate Scholar 1) */}
                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-400 font-medium font-serif">Bundling 1 ——</span>
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Ultimate Scholar 1</h4>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">Paket Indoor 1 (Elegant)</span> + Outdoor Smart 60 Menit (Hemat 50K)</p>
                          <p>Unlimited Foto Indoor & Outdoor Kampus | Cetak Uk 10Rs 2 Foto + All File Drive</p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">630K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('grad-bundling-ultimate-1')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Bundling 2 (Ultimate Scholar 2) */}
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Ultimate Scholar 2</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Bundling 2</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">Paket Indoor 2 (Supreme)</span> + Outdoor Smart 60 Menit (Hemat 50K)</p>
                          <p>Unlimited Foto Indoor & Outdoor Kampus | 2 Background Indoor | Cetak Uk 10Rs 2 Foto + All File Drive</p>
                        </div>
                        <div className="pt-2 flex items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">680K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('grad-bundling-ultimate-2')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToRules?.()}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                      >
                        <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 13. SPECIAL FIGMA VIEW FOR GRADUATION OUTDOOR */}
                {activeMenuCategory === 'grad-outdoor' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">OUTDOOR SESSIONS</span>
                      <div className="bg-slate-200/80 text-slate-900 font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl inline-block shadow-2xs">
                        HARGA PAKET GRADUATION OUTDOOR
                      </div>
                    </div>

                    <div className="space-y-6 pt-1">
                      {/* Smart */}
                      <div className="border-b border-slate-100 pb-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Smart Outdoor</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Graduation Outdoor 1</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">1 Wisudawan</span> + Family / Teman | Unlimited foto around campus | Free Transport</p>
                          <p>All file via Google Drive | Edit 10 Foto (High-Res)</p>
                        </div>
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            <span className="text-rose-600">280K</span> <span className="text-sm font-normal text-slate-400">(30m)</span> / 355K <span className="text-sm font-normal text-slate-400">(60m)</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onSelectPackageForBooking('grad-outdoor-smart-30')}
                              className="px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs uppercase shadow-md transition-all cursor-pointer active:scale-95"
                            >
                              Pesan 30M (280K)
                            </button>
                            <button
                              onClick={() => onSelectPackageForBooking('grad-outdoor-smart-60')}
                              className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase shadow-md transition-all cursor-pointer active:scale-95"
                            >
                              Pesan 60M (355K)
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Cumlaude (Video) */}
                      <div className="border-b border-slate-100 pb-5 space-y-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-400 font-medium font-serif">Graduation Outdoor 2 ——</span>
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Cumlaude (Foto + Video)</h4>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p><span className="text-rose-600 font-bold">75 Menit</span> Unlimited Foto Around Campus + <span className="text-rose-600 font-bold">1 Video Cinematic / Reels (30-60 detik)</span></p>
                          <p>All file via Google Drive | Edit 10 Foto High-Res | Free Transport Kampus</p>
                        </div>
                        <div className="pt-2 flex items-center justify-end gap-3">
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">710K</div>
                          <button
                            onClick={() => onSelectPackageForBooking('grad-outdoor-cumlaude')}
                            className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95"
                          >
                            KLIK UNTUK PESAN
                          </button>
                        </div>
                      </div>

                      {/* Group Outdoor */}
                      <div className="border-b border-slate-100 pb-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">Group Wisuda Outdoor</h4>
                          <span className="text-xs text-slate-400 font-medium font-serif">—— Graduation Outdoor 3</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-0.5 leading-relaxed">
                          <p>Sesi foto wisuda bersama kelompok / sahabat di area kampus outdoor (bisa foto bareng keluarga).</p>
                          <p>All file via Google Drive | Free Transport Area Kampus</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                          {/* 2 Orang */}
                          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 flex flex-col justify-between">
                            <div>
                              <div className="font-serif font-black text-slate-900 text-sm">Group 2 Wisudawan</div>
                              <p className="text-[11px] text-slate-600">75 Menit | Edit 20 Foto</p>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5">255K / wisudawan</p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                              <span className="font-black text-base text-slate-900">510K</span>
                              <button
                                onClick={() => onSelectPackageForBooking('grad-outdoor-group-2')}
                                className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] cursor-pointer active:scale-95"
                              >
                                Pesan
                              </button>
                            </div>
                          </div>

                          {/* 3 Orang */}
                          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 flex flex-col justify-between">
                            <div>
                              <div className="font-serif font-black text-slate-900 text-sm">Group 3 Wisudawan</div>
                              <p className="text-[11px] text-slate-600">90 Menit | Edit 30 Foto</p>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5">210K / wisudawan</p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                              <span className="font-black text-base text-slate-900">630K</span>
                              <button
                                onClick={() => onSelectPackageForBooking('grad-outdoor-group-3')}
                                className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] cursor-pointer active:scale-95"
                              >
                                Pesan
                              </button>
                            </div>
                          </div>

                          {/* 4-5 Orang */}
                          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2 flex flex-col justify-between">
                            <div>
                              <div className="font-serif font-black text-slate-900 text-sm">Group 4-5 Wisudawan</div>
                              <p className="text-[11px] text-slate-600">120 Menit | Edit 40 Foto</p>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5">180K / wisudawan</p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                              <span className="font-black text-base text-slate-900">900K</span>
                              <button
                                onClick={() => onSelectPackageForBooking('grad-outdoor-group-4-5')}
                                className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] cursor-pointer active:scale-95"
                              >
                                Pesan
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToRules?.()}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200 shadow-2xs"
                      >
                        <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
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
                              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85"
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
                              {[
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
                              ].map((item, idx) => (
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
                          {[
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
                              desc: 'Ukuran kanvas/pigura terbesar untuk backdrop ruang utama'
                            }
                          ].map((item, idx) => (
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
                          {[
                            {
                              name: 'ALBUM 4R BIASA',
                              capacity: 'ISI 40 FOTO',
                              price: '25K',
                              badge: 'Ekonomis',
                              image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
                            },
                            {
                              name: 'ALBUM LULU 4R',
                              capacity: 'ISI 100 FOTO',
                              price: '45,5K',
                              badge: 'Best Seller',
                              image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80'
                            },
                            {
                              name: 'ALBUM DLK 4R',
                              capacity: 'ISI 40 FOTO',
                              price: '70K',
                              badge: 'Hardcover',
                              image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=400&q=80'
                            },
                            {
                              name: 'ALBUM DLB 4R',
                              capacity: 'ISI 60 FOTO',
                              price: '75K',
                              badge: 'Hardcover',
                              image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80'
                            },
                            {
                              name: 'ALBUM MBT 4R',
                              capacity: 'ISI 80 FOTO',
                              price: '83K',
                              badge: 'Eksklusif',
                              image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=400&q=80'
                            },
                            {
                              name: 'ALBUM MBT 4R',
                              capacity: 'ISI 120 FOTO',
                              price: '104K',
                              badge: 'Eksklusif',
                              image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80'
                            },
                            {
                              name: 'ALBUM JUMBO 4R',
                              capacity: 'ISI 120 FOTO',
                              price: '93K',
                              badge: 'Jumbo',
                              image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
                            },
                            {
                              name: 'ALBUM JUMBO 4R',
                              capacity: 'ISI 160 FOTO',
                              price: '116K',
                              badge: 'Kapasitas Max',
                              image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=400&q=80'
                            }
                          ].map((album, idx) => (
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
                          href="https://wa.me/6281234567890?text=Halo%20Admin%20Alviero%20Studio,%20saya%20ingin%20pesan%20Cetak%20Foto%20/%20Bingkai%20/%20Album"
                          target="_blank"
                          rel="noreferrer"
                          className="min-h-[40px] px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Order via WhatsApp Admin</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => onNavigateToRules?.()}
                          className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-white px-4 py-2 rounded-full border border-rose-200 shadow-2xs"
                        >
                          <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* 15. SPECIAL FIGMA VIEW FOR KEBAYAK DAN GAUN */}
                {activeMenuCategory === 'kebayak-gaun' && (
                  <div className="space-y-6 animate-in fade-in duration-300">

                    {/* Header Banner Melengkung Emas (Sesuai Mockup) */}
                    <div className="bg-gradient-to-r from-stone-300 via-stone-200 to-stone-300 p-4 sm:p-5 rounded-full border border-stone-400/60 shadow-sm text-center">
                      <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-serif font-black tracking-[0.25em] text-amber-900 uppercase">
                        <span>G A U N</span>
                        <span className="text-stone-400">•</span>
                        <span>K E B A Y A</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-stone-700 font-serif italic mt-0.5">
                        Pricelist Wardrobe Kebayak & Gaun Alviero Studio
                      </p>
                    </div>

                    {/* Filter Kategori Kebaya & Gaun */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-mask-x no-scrollbar">
                      {[
                        { id: 'all', label: 'Semua Koleksi (9 Model)', icon: '👗' },
                        { id: 'adat', label: '👑 Kebaya Adat & Klasik', icon: '👑' },
                        { id: 'modern', label: '✨ Kebaya Modern & Wisuda', icon: '✨' },
                        { id: 'gaun', label: '👰 Gaun Pengantin / Bridal', icon: '👰' },
                      ].map((filter) => {
                        const isSelected = selectedKebayaFilter === filter.id;
                        return (
                          <button
                            key={filter.id}
                            onClick={() => setSelectedKebayaFilter(filter.id as any)}
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

                    {/* Daftar 9 Model Kebayak dan Gaun (Sesuai Gambar Asli) */}
                    <div className="space-y-6">
                      {[
                        {
                          id: 'kebaya-01',
                          number: '01',
                          name: 'Kebaya Adat Jawa Maroon & Beskap Tradisional',
                          subtitle: 'Adat Jawa Modern • Sunset Backdrop',
                          type: 'adat',
                          badge: 'Adat Tradisional',
                          leftImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=85',
                          rightImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=85',
                          personalPrice: '115K',
                          couplePrice: '225K',
                          personalPackageId: 'couple-sweet',
                          couplePackageId: 'couple-romantic-deluxe',
                          descPersonal: 'Include 1 Kebaya Adat Jawa + Kain Jarik',
                          descCouple: 'Include 2 Kebaya + Beskap & Blangkon Lengkap'
                        },
                        {
                          id: 'kebaya-02',
                          number: '02',
                          name: 'Kebaya Brokat Gold Mustard Mewah',
                          subtitle: 'Wisuda, Lamaran & Sesi Formal',
                          type: 'modern',
                          badge: 'Wisuda & Lamaran',
                          leftImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
                          rightImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=85',
                          personalPrice: '115K',
                          couplePrice: '215K',
                          personalPackageId: 'personal-bold-statement',
                          couplePackageId: 'couple-sweet',
                          descPersonal: 'Include 1 Kebaya Brokat Gold Mewah',
                          descCouple: 'Include 1 Kebaya Gold + 1 Kemeja/Beskap'
                        },
                        {
                          id: 'kebaya-03',
                          number: '03',
                          name: 'Kebaya Bludru Hitam Keraton & Gunungan Wayang Emas',
                          subtitle: 'Nuansa Keraton Jawa Klasik Elegan',
                          type: 'adat',
                          badge: 'Klasik Keraton',
                          leftImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=85',
                          rightImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=85',
                          personalPrice: '115K',
                          couplePrice: '225K',
                          personalPackageId: 'couple-sweet',
                          couplePackageId: 'couple-romantic-deluxe',
                          descPersonal: 'Include 1 Kebaya Bludru Hitam Sulam Emas',
                          descCouple: 'Include Kebaya Bludru + Beskap Hitam Klasik'
                        },
                        {
                          id: 'kebaya-04',
                          number: '04',
                          name: 'Kebaya Modern Baby Blue Brokat',
                          subtitle: 'Warna Soft Chic Pastel Kekinian',
                          type: 'modern',
                          badge: 'Modern Chic',
                          leftImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=85',
                          rightImage: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=600&q=85',
                          personalPrice: '115K',
                          couplePrice: '215K',
                          personalPackageId: 'personal-bold-statement',
                          couplePackageId: 'couple-sweet',
                          descPersonal: 'Include 1 Kebaya Baby Blue Brokat',
                          descCouple: 'Include Kebaya Baby Blue + Kemeja Pasangan'
                        },
                        {
                          id: 'kebaya-05',
                          number: '05',
                          name: 'Kebaya Encim / Kutubaru Emas Coklat Tradisional',
                          subtitle: 'Aksen Vintage Klasik Elegan',
                          type: 'adat',
                          badge: 'Kutubaru Klasik',
                          leftImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=85',
                          rightImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=85',
                          personalPrice: '115K',
                          couplePrice: '215K',
                          personalPackageId: 'personal-bold-statement',
                          couplePackageId: 'couple-sweet',
                          descPersonal: 'Include 1 Kebaya Kutubaru Champagne Gold',
                          descCouple: 'Include Kebaya Kutubaru + Kemeja Batik'
                        },
                        {
                          id: 'kebaya-06',
                          number: '06',
                          name: 'Kebaya & Kemeja Batik Couple Maroon Senada',
                          subtitle: 'Serasi Harmonis untuk Pasangan',
                          type: 'adat',
                          badge: 'Couple Batik',
                          leftImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=85',
                          rightImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=85',
                          personalPrice: '115K',
                          couplePrice: '225K',
                          personalPackageId: 'couple-sweet',
                          couplePackageId: 'couple-romantic-deluxe',
                          descPersonal: 'Include 1 Kebaya Motif Batik Maroon',
                          descCouple: 'Include Set Couple Batik Maroon Senada'
                        },
                        {
                          id: 'kebaya-07',
                          number: '07',
                          name: 'Kebaya Abu-Abu Lilac Elegan & Cunduk Mentul',
                          subtitle: 'Sentuhan Anggun Budaya Nusantara',
                          type: 'adat',
                          badge: 'Adat Jawa Lilac',
                          leftImage: 'https://images.unsplash.com/photo-1627556704302-624286467c65?auto=format&fit=crop&w=600&q=85',
                          rightImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=85',
                          personalPrice: '115K',
                          couplePrice: '225K',
                          personalPackageId: 'couple-sweet',
                          couplePackageId: 'couple-romantic-deluxe',
                          descPersonal: 'Include 1 Kebaya Silver Lilac + Aksesoris',
                          descCouple: 'Include Kebaya Lilac + Beskap Pasangan'
                        },
                        {
                          id: 'kebaya-08',
                          number: '08',
                          name: 'Kebaya Dusty Pink / Peach Soft Cantik',
                          subtitle: 'Nuansa Romantis Manis & Segar',
                          type: 'modern',
                          badge: 'Pastel Sweet',
                          leftImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=85',
                          rightImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=85',
                          personalPrice: '115K',
                          couplePrice: '215K',
                          personalPackageId: 'personal-bold-statement',
                          couplePackageId: 'couple-sweet',
                          descPersonal: 'Include 1 Kebaya Dusty Pink Brokat',
                          descCouple: 'Include Kebaya Dusty Pink + Kemeja Batik'
                        },
                        {
                          id: 'kebaya-09',
                          number: '09',
                          name: 'Gaun Bridal Putih Mewah & Setelan Jas Pria',
                          subtitle: 'Sesi Foto Wedding & Prewedding Gaun Pengantin',
                          type: 'gaun',
                          badge: 'Bridal & Prewedding',
                          leftImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=85',
                          rightImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=85',
                          personalPrice: '300K',
                          couplePrice: '500K',
                          personalPackageId: 'personal-opulent-shot',
                          couplePackageId: 'couple-romantic-deluxe',
                          descPersonal: 'Include 1 Gaun Pengantin Putih Mewah + Tiara',
                          descCouple: 'Include Gaun Bridal Mewah + Setelan Jas Pria'
                        }
                      ]
                        .filter((item) => selectedKebayaFilter === 'all' || item.type === selectedKebayaFilter)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="bg-[#e4e4e4] hover:bg-[#dedede] transition-colors rounded-3xl p-4 sm:p-6 border border-stone-300 shadow-sm space-y-4"
                          >
                            {/* Header Kartu */}
                            <div className="flex items-center justify-between gap-2 border-b border-stone-300/80 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-full bg-stone-800 text-amber-300 font-serif font-black text-xs flex items-center justify-center shrink-0">
                                  {item.number}
                                </span>
                                <div>
                                  <h4 className="font-serif font-black text-sm sm:text-base text-stone-900 leading-tight">
                                    {item.name}
                                  </h4>
                                  <p className="text-[10.5px] text-stone-600 font-serif italic">
                                    {item.subtitle}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[9.5px] font-bold uppercase tracking-wider bg-stone-300 text-stone-800 px-2.5 py-0.5 rounded-full shrink-0">
                                {item.badge}
                              </span>
                            </div>

                            {/* 2 Foto Berdampingan (Sesuai Mockup Asli) */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                              <div className="relative aspect-[3/4] bg-stone-900 rounded-2xl overflow-hidden shadow-md group">
                                <img
                                  src={item.leftImage}
                                  alt={`${item.name} - Pose 1`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                                  Pose 1
                                </div>
                              </div>

                              <div className="relative aspect-[3/4] bg-stone-900 rounded-2xl overflow-hidden shadow-md group">
                                <img
                                  src={item.rightImage}
                                  alt={`${item.name} - Pose 2`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                                  Pose 2
                                </div>
                              </div>
                            </div>

                            {/* Pilihan Paket Personal & Couple di Bawah Foto */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
                              {/* Kolom Kiri: Personal */}
                              <div className="flex flex-col justify-between space-y-2 p-3 bg-white/70 rounded-2xl border border-stone-300/70 shadow-2xs">
                                <div className="space-y-0.5">
                                  <div className="font-serif font-black text-sm sm:text-base text-stone-900">
                                    Personal
                                  </div>
                                  <p className="text-[10px] text-stone-600 line-clamp-1">
                                    {item.descPersonal}
                                  </p>
                                  <div className="font-serif font-black text-lg sm:text-xl text-stone-900 pt-0.5">
                                    {item.personalPrice}
                                  </div>
                                </div>

                                <button
                                  onClick={() => onSelectPackageForBooking(item.personalPackageId)}
                                  className="w-full min-h-[36px] bg-[#e04f43] hover:bg-[#cb3e32] active:bg-[#b53429] text-white font-extrabold text-[11px] py-1.5 rounded-full transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1 uppercase tracking-wider"
                                >
                                  <span>PILIH PAKET INI</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Kolom Kanan: Couple */}
                              <div className="flex flex-col justify-between space-y-2 p-3 bg-white/70 rounded-2xl border border-stone-300/70 shadow-2xs">
                                <div className="space-y-0.5">
                                  <div className="font-serif font-black text-sm sm:text-base text-stone-900">
                                    Couple
                                  </div>
                                  <p className="text-[10px] text-stone-600 line-clamp-1">
                                    {item.descCouple}
                                  </p>
                                  <div className="font-serif font-black text-lg sm:text-xl text-stone-900 pt-0.5">
                                    {item.couplePrice}
                                  </div>
                                </div>

                                <button
                                  onClick={() => onSelectPackageForBooking(item.couplePackageId)}
                                  className="w-full min-h-[36px] bg-[#e04f43] hover:bg-[#cb3e32] active:bg-[#b53429] text-white font-extrabold text-[11px] py-1.5 rounded-full transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1 uppercase tracking-wider"
                                >
                                  <span>PILIH PAKET INI</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Disclaimer & Konsultasi WhatsApp */}
                    <div className="bg-stone-100 p-4 sm:p-5 rounded-3xl border border-stone-300 text-center space-y-3">
                      <p className="text-xs text-stone-700 font-medium">
                        Ingin fitting ukuran kebaya/gaun atau konsultasi ketersediaan tanggal pemotretan?
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                          href="https://wa.me/6281234567890?text=Halo%20Admin%20Alviero%20Studio,%20saya%20ingin%20tanya%20pricelist%20dan%20fitting%20Kebaya%20/%20Gaun"
                          target="_blank"
                          rel="noreferrer"
                          className="min-h-[40px] px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat Admin via WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => onNavigateToRules?.()}
                          className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer transition-all hover:scale-105 active:scale-95 bg-white px-4 py-2 rounded-full border border-rose-200 shadow-2xs"
                        >
                          <span>⚠️ Harap Membaca Disclaimer pada halaman Panduan & Lokasi</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
                          const matchedSheet = PRICELIST_SHEETS.find(s => s.category.toLowerCase().includes(activeMenuInfo.sheetCategory.toLowerCase())) || PRICELIST_SHEETS[0];
                          setActiveModalSheet(matchedSheet);
                        }}
                        className="min-h-[40px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0"
                      >
                        <ZoomIn className="w-4 h-4 text-amber-300" />
                        <span>Lihat Desain Poster HD</span>
                      </button>
                    </div>

                    {/* Pemberitahuan Tahapan Pengembangan KHUSUS WEDDING */}
                    {activeMenuCategory === 'wedding' && (
                      <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 text-amber-900 flex items-start gap-3.5 shadow-xs animate-in fade-in">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                          ⚠️
                        </div>
                        <div className="space-y-1">
                          <div className="font-extrabold text-sm sm:text-base text-amber-950">
                            Mohon maaf pricelist masih dalam tahapan pengembangan
                          </div>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            Katalog dan rincian harga untuk kategori <strong className="font-bold text-amber-950">PRICELIST WEDDING</strong> saat ini sedang dalam proses penyusunan & perancangan poster resmi. Untuk konsultasi harga paket pernikahan terbaru (Akad, Resepsi, Engagement, Prewedding) atau reservasi custom, silakan langsung menghubungi Admin WhatsApp kami.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Daftar Sub-Paket Tersedia (Disembunyikan pada Pricelist Wedding) */}
                    {activeMenuCategory !== 'wedding' && (
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
                        href="https://wa.me/6281234567890?text=Halo%20Admin%20Alviero%20Studio,%20saya%20mau%20tanya%20jadwal%20dan%20pricelist"
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
                <div className="pt-4 pb-2 border-t border-slate-200 text-center lg:hidden">
                  <button
                    onClick={() => setIsMobilePopupOpen(false)}
                    className="w-full min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 text-amber-300" />
                    <span>Tutup & Kembali ke Menu Utama</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. GALERI CONTOH HASIL FOTO STUDIO (BERDASARKAN PAKET UTAMA)         */}
      {/* ==================================================================== */}
      {activeTab === 'gallery' && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">

          {/* Switcher Mode: Menu Pricelist vs Galeri Foto (Sama persis seperti di Menu Card) */}
          <div className="w-full max-w-md mx-auto bg-slate-200/85 backdrop-blur-md p-1 rounded-2xl flex items-center gap-1 border border-slate-300/80 shadow-2xs">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 min-h-[36px] px-2 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                activeTab === 'menu'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>📱 Menu Pricelist</span>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 min-h-[36px] px-2 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                activeTab === 'gallery'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>📸 Galeri Foto</span>
            </button>
          </div>

          {/* Header Sederhana & Bersih */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-md">
                  <Camera className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Portofolio Alviero Studio</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Galeri Contoh Hasil Foto Studio
                </h3>
                <p className="text-xs text-slate-500 max-w-xl">
                  Inspirasi gaya foto dan hasil jepretan asli studio kami berdasarkan pilihan paket foto yang tersedia.
                </p>
              </div>

              {/* Kotak Pencarian */}
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari foto..."
                  className="w-full min-h-[40px] pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Pilihan Kategori Paket (Sederhana & Rapi) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-mask-x no-scrollbar pt-1">
              {studioGalleryCategories.map((cat) => {
                const isSelected = selectedGalleryCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedGalleryCategory(cat.id)}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Kartu Foto */}
          {filteredGalleryPhotos.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-2">
              <p className="text-slate-600 font-semibold text-xs">Tidak ada contoh foto yang sesuai dengan pencarian.</p>
              <button
                onClick={() => { setSelectedGalleryCategory('all'); setSearchQuery(''); }}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Tampilkan Semua Foto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredGalleryPhotos.map((photo) => {
                return (
                  <div
                    key={photo.id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1"
                  >
                    {/* Foto Preview */}
                    <div
                      className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer group"
                      onClick={() => setActiveModalPhoto(photo)}
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                      {/* Label Paket */}
                      <div className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1 shadow-xs">
                        <span>{photo.icon}</span>
                        <span>{photo.packageName}</span>
                      </div>

                      {/* Tombol Perbesar */}
                      <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-white/50 transition-colors">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <h4 className="font-bold text-xs sm:text-sm leading-snug drop-shadow-sm line-clamp-1">
                          {photo.title}
                        </h4>
                      </div>
                    </div>

                    {/* Konten & Tombol */}
                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {photo.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setActiveModalPhoto(photo)}
                          className="w-full min-h-[36px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                        >
                          <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
                          <span>Lihat Foto HD</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. MODAL PERBESAR FOTO (SEDERHANA & BERSIH)                          */}
      {/* ==================================================================== */}
      {activeModalPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative my-auto">

            {/* Close Button */}
            <button
              onClick={() => setActiveModalPhoto(null)}
              className="absolute top-2.5 right-2.5 z-30 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10 active:scale-95"
              title="Tutup Modal"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Kolom Kiri: Foto */}
            <div className="md:w-1/2 bg-black relative flex items-center justify-center overflow-hidden h-[38vh] sm:h-[48vh] md:h-auto shrink-0 select-none p-2">
              <img
                src={activeModalPhoto.imageUrl}
                alt={activeModalPhoto.title}
                className="w-full h-full object-contain rounded-xl"
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                {activeModalPhoto.packageName}
              </div>
            </div>

            {/* Kolom Kanan: Detail Foto */}
            <div className="md:w-1/2 p-5 sm:p-7 flex flex-col justify-between space-y-4 overflow-y-auto max-h-[52vh] md:max-h-full">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-indigo-500/30">
                  <span>{activeModalPhoto.icon}</span>
                  <span>{activeModalPhoto.packageName}</span>
                </div>

                <div>
                  <h3 className="text-base sm:text-xl font-black text-white leading-snug">
                    {activeModalPhoto.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeModalPhoto.description}
                </p>

                {/* Catatan Konsep Foto */}
                <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-1 text-xs">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Catatan Konsep:</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {activeModalPhoto.conceptNote}
                  </p>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Alviero Studio Foto © 2026</span>
                <button
                  onClick={() => setActiveModalPhoto(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-colors cursor-pointer active:scale-95"
                >
                  Tutup Tampilan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standard Poster Modal (If clicked from Menu view) */}
      {activeModalSheet && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative my-auto">
            <button
              onClick={() => setActiveModalSheet(null)}
              className="absolute top-2.5 right-2.5 z-30 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="md:w-1/2 bg-black relative flex items-center justify-center overflow-hidden p-2">
              <img
                src={activeModalSheet.imageUrl}
                alt={activeModalSheet.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="md:w-1/2 p-4 sm:p-6 flex flex-col justify-between space-y-3 overflow-y-auto max-h-[54vh] md:max-h-full">
              <div className="space-y-2.5">
                <div className="inline-block bg-indigo-500/20 text-indigo-300 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-indigo-500/30">
                  {activeModalSheet.category}
                </div>
                <h3 className="text-base sm:text-xl font-black text-white">
                  {activeModalSheet.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeModalSheet.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Alviero Studio Foto © 2026</span>
                <button
                  onClick={() => setActiveModalSheet(null)}
                  className="text-slate-300 hover:text-white underline cursor-pointer p-1"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

