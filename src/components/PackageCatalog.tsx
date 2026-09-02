import React, { useState } from 'react';
import { PACKAGES, CATEGORIES } from '../data/pricelistData';
import {
  Camera, Clock, Users, Star,
  CheckCircle2, ArrowRight, Filter, Scale, X, Sparkles, FileText, Printer
} from 'lucide-react';

interface PackageCatalogProps {
  onSelectPackageForBooking: (packageId: string) => void;
  initialCategory?: string;
}

// Pastel Theme Definition for Categories
const CATEGORY_PASTEL_THEMES: Record<string, {
  bg: string;
  border: string;
  text: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  activeBg: string;
  activeText: string;
}> = {
  'all': {
    bg: 'bg-[#FDFBF7]',
    border: 'border-[#E8DDD6]',
    text: 'text-[#3A3A3A]',
    iconBg: 'bg-[#F2E9E4]',
    iconColor: 'text-[#3A3A3A]',
    badgeBg: 'bg-white',
    badgeText: 'text-[#3A3A3A]',
    activeBg: 'bg-[#3A3A3A]',
    activeText: 'text-white',
  },
  'selfstudio': {
    bg: 'bg-[#EBF2EA]',
    border: 'border-[#A9BCA7]',
    text: 'text-[#6E856C]',
    iconBg: 'bg-[#EBF2EA]',
    iconColor: 'text-[#6E856C]',
    badgeBg: 'bg-[#EBF2EA]',
    badgeText: 'text-[#6E856C]',
    activeBg: 'bg-[#6E856C]',
    activeText: 'text-white',
  },
  'undangan': {
    bg: 'bg-[#fdf9ee]',
    border: 'border-[#f6e9c1]',
    text: 'text-[#735515]',
    iconBg: 'bg-[#faefcb]',
    iconColor: 'text-[#735515]',
    badgeBg: 'bg-[#faefcb]',
    badgeText: 'text-[#735515]',
    activeBg: 'bg-[#a37922]',
    activeText: 'text-white',
  },
  'sewa-studio': {
    bg: 'bg-[#eff7f8]',
    border: 'border-[#cee6e8]',
    text: 'text-[#1f575c]',
    iconBg: 'bg-[#d9eff1]',
    iconColor: 'text-[#1f575c]',
    badgeBg: 'bg-[#d9eff1]',
    badgeText: 'text-[#1f575c]',
    activeBg: 'bg-[#327a80]',
    activeText: 'text-white',
  },
  'prewedding': {
    bg: 'bg-[#faf1f5]',
    border: 'border-[#ebd0df]',
    text: 'text-[#743358]',
    iconBg: 'bg-[#f5e0ec]',
    iconColor: 'text-[#743358]',
    badgeBg: 'bg-[#f5e0ec]',
    badgeText: 'text-[#743358]',
    activeBg: 'bg-[#964d74]',
    activeText: 'text-white',
  },
  'couple': {
    bg: 'bg-[#fdf3f3]',
    border: 'border-[#f9d6d6]',
    text: 'text-[#822f2f]',
    iconBg: 'bg-[#fde3e3]',
    iconColor: 'text-[#822f2f]',
    badgeBg: 'bg-[#fde3e3]',
    badgeText: 'text-[#822f2f]',
    activeBg: 'bg-[#a84444]',
    activeText: 'text-white',
  },
  'personal': {
    bg: 'bg-[#f4f5f7]',
    border: 'border-[#d8dce2]',
    text: 'text-[#333e4d]',
    iconBg: 'bg-[#e6e9ef]',
    iconColor: 'text-[#333e4d]',
    badgeBg: 'bg-[#e6e9ef]',
    badgeText: 'text-[#333e4d]',
    activeBg: 'bg-[#4b5563]',
    activeText: 'text-white',
  },
  'maternity': {
    bg: 'bg-[#fdf5ee]',
    border: 'border-[#f8dac3]',
    text: 'text-[#82471d]',
    iconBg: 'bg-[#fae6d7]',
    iconColor: 'text-[#82471d]',
    badgeBg: 'bg-[#fae6d7]',
    badgeText: 'text-[#82471d]',
    activeBg: 'bg-[#a85e2b]',
    activeText: 'text-white',
  },
  'event': {
    bg: 'bg-[#fefbe8]',
    border: 'border-[#f8f0ab]',
    text: 'text-[#73630f]',
    iconBg: 'bg-[#fbf5be]',
    iconColor: 'text-[#73630f]',
    badgeBg: 'bg-[#fbf5be]',
    badgeText: 'text-[#73630f]',
    activeBg: 'bg-[#998112]',
    activeText: 'text-white',
  },
  'family': {
    bg: 'bg-[#f5f8ee]',
    border: 'border-[#dbe6c5]',
    text: 'text-[#435722]',
    iconBg: 'bg-[#eaf1dc]',
    iconColor: 'text-[#435722]',
    badgeBg: 'bg-[#eaf1dc]',
    badgeText: 'text-[#435722]',
    activeBg: 'bg-[#617c32]',
    activeText: 'text-white',
  },
  'group': {
    bg: 'bg-[#f0f4fc]',
    border: 'border-[#d0ddf7]',
    text: 'text-[#244983]',
    iconBg: 'bg-[#dfebfc]',
    iconColor: 'text-[#244983]',
    badgeBg: 'bg-[#dfebfc]',
    badgeText: 'text-[#244983]',
    activeBg: 'bg-[#3b64b3]',
    activeText: 'text-white',
  },
  'pass-foto': {
    bg: 'bg-[#ecf9f5]',
    border: 'border-[#beece0]',
    text: 'text-[#175f4e]',
    iconBg: 'bg-[#d2f3eb]',
    iconColor: 'text-[#175f4e]',
    badgeBg: 'bg-[#d2f3eb]',
    badgeText: 'text-[#175f4e]',
    activeBg: 'bg-[#297f6c]',
    activeText: 'text-white',
  },
  'graduation': {
    bg: 'bg-[#f3f3fd]',
    border: 'border-[#d6d6f9]',
    text: 'text-[#36369c]',
    iconBg: 'bg-[#e4e4fc]',
    iconColor: 'text-[#36369c]',
    badgeBg: 'bg-[#e4e4fc]',
    badgeText: 'text-[#36369c]',
    activeBg: 'bg-[#5252be]',
    activeText: 'text-white',
  },
  'graduation-outdoor': {
    bg: 'bg-[#f2f8f3]',
    border: 'border-[#cde3d2]',
    text: 'text-[#2a5936]',
    iconBg: 'bg-[#ddf0e2]',
    iconColor: 'text-[#2a5936]',
    badgeBg: 'bg-[#ddf0e2]',
    badgeText: 'text-[#2a5936]',
    activeBg: 'bg-[#407a50]',
    activeText: 'text-white',
  },
};

export const PackageCatalog: React.FC<PackageCatalogProps> = ({
  onSelectPackageForBooking,
  initialCategory = 'all'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Helper render icon kategori
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Users': return <Users className="w-4 h-4" />;
      case 'Star': return <Star className="w-4 h-4" />;
      default: return <Camera className="w-4 h-4" />;
    }
  };

  // Filter paket berdasarkan kategori dan harga
  const filteredPackages = PACKAGES.filter((pkg) => {
    const matchCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchPrice = maxPrice === 0 || pkg.price <= maxPrice;
    return matchCategory && matchPrice;
  });

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(item => item !== id));
    } else {
      if (compareIds.length >= 3) {
        alert('Maksimal membandingkan 3 paket sekaligus');
        return;
      }
      setCompareIds([...compareIds, id]);
    }
  };

  const comparePackages = PACKAGES.filter(p => compareIds.includes(p.id));
  const activeCategoryInfo = CATEGORIES.find(c => c.id === selectedCategory);
  const activeTheme = CATEGORY_PASTEL_THEMES[selectedCategory] || CATEGORY_PASTEL_THEMES['all'];

  return (
    <section className="py-4 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      {/* Hero Banner Section */}
      <div className="relative bg-[#2A2A2A] rounded-3xl p-5 sm:p-10 text-white overflow-hidden shadow-xl border border-[#3A3A3A]">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#A9BCA7]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 top-0 w-64 h-64 bg-[#F2E9E4]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#A9BCA7]/30 text-[#A9BCA7] border border-[#A9BCA7]/40 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#A9BCA7]" />
            <span>Katalog Resmi Alviero Studio • 12 Kategori Paket Lengkap</span>
          </div>

          <h1 className="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-serif">
            Pilihan Paket Foto Lengkap <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F2E9E4] via-[#A9BCA7] to-white">
              Studio & Outdoor Ter-Aesthetic
            </span>
          </h1>

          <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
            Tersedia 12 kategori foto spesial: Graduation (Indoor/Outdoor), Pass Foto, Group, Family, Maternity, Personal, Prewed, Couple, Sewa Studio, Undangan, serta Self Studio (Special, Normal & Spotlight).
          </p>

          {/* Feature Badges */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone-200 font-medium">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
              <Camera className="w-4 h-4 text-[#A9BCA7] shrink-0" />
              <span>Studio & Outdoor Pro</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
              <FileText className="w-4 h-4 text-[#A9BCA7] shrink-0" />
              <span>Gratis Semua Soft Files</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
              <Printer className="w-4 h-4 text-[#A9BCA7] shrink-0" />
              <span>Cetak & Frame Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Grid Overview */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DDD6] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-[#3A3A3A] text-xs sm:text-base flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6E856C]" />
            <span>Pilih Kategori Layanan Studio (12 Kategori)</span>
          </h2>
          <span className="text-xs text-stone-500 font-medium hidden sm:block">
            Total {PACKAGES.length} Sub Paket
          </span>
        </div>

        {/* Categories Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[56px] p-3 rounded-2xl text-xs font-bold transition-all text-left flex flex-col justify-between border cursor-pointer active:scale-98 ${
              selectedCategory === 'all'
                ? 'bg-[#3A3A3A] text-white border-[#3A3A3A] shadow-sm'
                : 'bg-[#FDFBF7] text-[#3A3A3A] border-[#E8DDD6] hover:bg-[#F2E9E4]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Camera className={`w-4 h-4 ${selectedCategory === 'all' ? 'text-white' : 'text-[#3A3A3A]'}`} />
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-[#2A2A2A] text-white' : 'bg-white text-[#3A3A3A] border border-[#E8DDD6]'}`}>
                33 Paket
              </span>
            </div>
            <span className="font-black">Semua Layanan</span>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const theme = CATEGORY_PASTEL_THEMES[cat.id] || CATEGORY_PASTEL_THEMES['all'];

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[56px] p-3 rounded-2xl text-xs transition-all text-left flex flex-col justify-between border cursor-pointer active:scale-98 ${
                  isSelected
                    ? `${theme.activeBg} ${theme.activeText} border-transparent shadow-sm ring-2 ring-stone-900/10`
                    : `${theme.bg} ${theme.text} ${theme.border} hover:brightness-98 hover:shadow-xs`
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className={isSelected ? 'text-white' : theme.iconColor}>
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                    isSelected ? 'bg-white/20 text-white border-transparent' : `${theme.badgeBg} ${theme.badgeText} border-stone-200/50`
                  }`}>
                    {cat.subPackageCount} Sub
                  </span>
                </div>
                <div>
                  <div className="font-extrabold line-clamp-1">{cat.name}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Category Information Banner */}
        {activeCategoryInfo && (
          <div className={`${activeTheme.bg} border ${activeTheme.border} rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-in fade-in`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${activeTheme.iconBg} ${activeTheme.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}>
                {getCategoryIcon(activeCategoryInfo.iconName)}
              </div>
              <div>
                <div className={`font-black text-sm ${activeTheme.text}`}>{activeCategoryInfo.name}</div>
                <div className="text-stone-600 text-[11px] sm:text-xs">{activeCategoryInfo.description}</div>
              </div>
            </div>
            <div className={`bg-white border ${activeTheme.border} ${activeTheme.text} font-extrabold px-3 py-1.5 rounded-xl shrink-0 shadow-2xs`}>
              {activeCategoryInfo.subPackageNote}
            </div>
          </div>
        )}

        {/* Filter Budget */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E8DDD6]">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1 scroll-mask-x">
            <span className="text-xs font-bold text-stone-500 shrink-0">Filter Budget:</span>
            <button
              onClick={() => setMaxPrice(0)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all active:scale-95 ${
                maxPrice === 0 ? 'bg-[#3A3A3A] text-white' : 'bg-[#FDFBF7] text-[#3A3A3A] border border-[#E8DDD6] hover:bg-[#F2E9E4]'
              }`}
            >
              Semua Harga
            </button>
            <button
              onClick={() => setMaxPrice(100000)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all active:scale-95 ${
                maxPrice === 100000 ? 'bg-[#3A3A3A] text-white' : 'bg-[#FDFBF7] text-[#3A3A3A] border border-[#E8DDD6] hover:bg-[#F2E9E4]'
              }`}
            >
              ≤ 100 Ribu
            </button>
            <button
              onClick={() => setMaxPrice(200000)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all active:scale-95 ${
                maxPrice === 200000 ? 'bg-[#3A3A3A] text-white' : 'bg-[#FDFBF7] text-[#3A3A3A] border border-[#E8DDD6] hover:bg-[#F2E9E4]'
              }`}
            >
              ≤ 200 Ribu
            </button>

            {compareIds.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="min-h-[36px] bg-[#EBF2EA] border border-[#A9BCA7] text-[#6E856C] font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1 hover:bg-[#dfeee3] transition-colors shrink-0 ml-auto cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-[#6E856C]" />
                <span>Bandingkan ({compareIds.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Package Cards Grid */}
      {filteredPackages.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-[#E8DDD6] space-y-3">
          <p className="text-stone-600 font-semibold text-sm">Tidak ditemukan paket sesuai filter kategori atau harga ini.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setMaxPrice(0); }}
            className="min-h-[40px] inline-flex items-center gap-1 bg-[#6E856C] hover:bg-[#5C725A] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Reset Filter</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredPackages.map((pkg) => {
            const isComparing = compareIds.includes(pkg.id);
            const categoryObj = CATEGORIES.find(c => c.id === pkg.category);
            const cardTheme = CATEGORY_PASTEL_THEMES[pkg.category] || CATEGORY_PASTEL_THEMES['all'];

            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group relative ${
                  pkg.popular 
                    ? 'border-[#A9BCA7] shadow-md ring-2 ring-[#A9BCA7]/30' 
                    : 'border-[#E8DDD6] shadow-2xs hover:shadow-md'
                }`}
              >
                {/* Tag Badge */}
                {pkg.tag && (
                  <div className="absolute top-3.5 left-3.5 z-10 bg-[#3A3A3A]/90 backdrop-blur-md text-[#A9BCA7] font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/10">
                    <Star className="w-3 h-3 text-[#A9BCA7] fill-[#A9BCA7]" />
                    <span>{pkg.tag}</span>
                  </div>
                )}

                {/* Compare Checkbox Button */}
                <button
                  onClick={() => toggleCompare(pkg.id)}
                  title="Bandingkan paket"
                  className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full backdrop-blur-md text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center ${
                    isComparing 
                      ? 'bg-[#6E856C] text-white' 
                      : 'bg-white/90 text-[#3A3A3A] hover:bg-white border border-[#E8DDD6]'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                </button>

                <div>
                  {/* Image Banner */}
                  <div className="relative aspect-[16/10] bg-stone-900 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent"></div>

                    {/* Category Label inside Image Overlay */}
                    <div className="absolute top-3.5 left-3.5 right-14 flex items-center gap-2">
                      <span className="bg-[#3A3A3A]/80 backdrop-blur-md text-stone-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-white/20">
                        {categoryObj?.name || pkg.category}
                      </span>
                      {pkg.subCategory && (
                        <span className="bg-[#A9BCA7] text-[#2A2A2A] text-[10px] font-black px-2 py-0.5 rounded-md">
                          Sub: {pkg.subCategory}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <h3 className="font-extrabold text-base sm:text-lg text-white leading-snug drop-shadow-sm font-serif">
                          {pkg.name}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-black text-lg sm:text-xl text-[#A9BCA7]">
                          Rp {pkg.price.toLocaleString('id-ID')}
                        </div>
                        {pkg.originalPrice && (
                          <div className="text-[11px] text-stone-300 line-through">
                            Rp {pkg.originalPrice.toLocaleString('id-ID')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Package Meta Info */}
                  <div className="p-4 sm:p-5 space-y-4">
                    <p className="text-xs text-stone-600 leading-relaxed font-normal">
                      {pkg.description}
                    </p>

                    {/* Quick Info Grid */}
                    <div className={`grid grid-cols-2 gap-2 ${cardTheme.bg} p-3 rounded-2xl border ${cardTheme.border} text-xs`}>
                      <div className="flex items-center gap-2 text-stone-700">
                        <Clock className={`w-4 h-4 ${cardTheme.iconColor} shrink-0`} />
                        <div>
                          <div className="font-bold text-[#3A3A3A]">{pkg.durationMinutes} Min Foto</div>
                          <div className="text-[10px] text-stone-500">+{pkg.selectionTimeMinutes} min pilih</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-stone-700">
                        <Users className={`w-4 h-4 ${cardTheme.iconColor} shrink-0`} />
                        <div>
                          <div className="font-bold text-[#3A3A3A]">{pkg.includedPeople} Orang</div>
                          <div className="text-[10px] text-stone-500">Sudah termasuk</div>
                        </div>
                      </div>
                    </div>

                    {/* Highlights checklist */}
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        Fasilitas Terdaftar:
                      </div>
                      {pkg.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#6E856C] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action CTA */}
                <div className="p-4 sm:p-5 pt-0">
                  <button
                    onClick={() => onSelectPackageForBooking(pkg.id)}
                    className={`w-full min-h-[44px] py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 ${
                      pkg.popular
                        ? 'bg-[#6E856C] hover:bg-[#5C725A] text-white shadow-sm'
                        : 'bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white'
                    }`}
                  >
                    <span>Pilih Paket & Reservasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Package Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-6 shadow-2xl my-auto border border-[#E8DDD6]">
            <div className="flex items-center justify-between border-b border-[#E8DDD6] pb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#6E856C]" />
                <h3 className="font-extrabold text-base sm:text-lg text-[#3A3A3A] font-serif">Perbandingan Paket Studio</h3>
              </div>
              <button 
                onClick={() => setShowCompareModal(false)}
                className="w-9 h-9 rounded-full bg-[#FDFBF7] text-stone-500 hover:text-stone-800 cursor-pointer flex items-center justify-center border border-[#E8DDD6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparePackages.map((pkg) => (
                <div key={pkg.id} className="border border-[#E8DDD6] rounded-2xl p-4 bg-[#FDFBF7] space-y-3">
                  <div className="font-extrabold text-[#3A3A3A] text-base font-serif">{pkg.name}</div>
                  <div className="text-xl font-black text-[#6E856C]">Rp {pkg.price.toLocaleString('id-ID')}</div>
                  <div className="text-xs text-stone-600 space-y-1.5">
                    <div>⏱️ Durasi: <strong>{pkg.durationMinutes} Menit</strong></div>
                    <div>👥 Peserta: <strong>{pkg.includedPeople} Orang</strong></div>
                    <div>🖨️ Cetakan: <strong>{pkg.includedPrints}</strong></div>
                    <div>📁 Soft Files: <strong>Gratis Google Drive</strong></div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCompareModal(false);
                      onSelectPackageForBooking(pkg.id);
                    }}
                    className="w-full min-h-[40px] py-2 bg-[#6E856C] hover:bg-[#5C725A] text-white font-bold text-xs rounded-xl cursor-pointer active:scale-95 shadow-xs"
                  >
                    Pilih Paket Ini
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
