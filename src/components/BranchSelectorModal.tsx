import React, { useState, useEffect, useRef } from 'react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';
import { Check, X, ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface BranchSelectorViewProps {
  selectedBranch: StudioBranch;
  onSelectBranch: (branch: StudioBranch) => void;
  onSelectCategory?: (category: string) => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

/**
 * Daftar Foto Backdrop Studio untuk Hero Banner Slider
 */
export const BACKDROP_BANNER_IMAGES = [
  { id: '1', image: '/images/backdrops/backdrop-1.jpg', title: 'Backdrop Mint Modern Sofa' },
  { id: '2', image: '/images/backdrops/backdrop-2.jpg', title: 'Backdrop Bohemian Rustic Wall' },
  { id: '3', image: '/images/backdrops/backdrop-3.jpg', title: 'Backdrop Black Arch Window Bar Stool' },
  { id: '4', image: '/images/backdrops/backdrop-4.jpg', title: 'Backdrop Charcoal Classic Sofa' },
  { id: '5', image: '/images/backdrops/backdrop-5.jpg', title: 'Backdrop Luxury White Fireplace' },
  { id: '6', image: '/images/backdrops/backdrop-6.jpg', title: 'Backdrop Warm Beige Classic Armchair' },
  { id: '7', image: '/images/backdrops/backdrop-7.jpg', title: 'Backdrop White Arch Windows Grey Sofa' },
];

/**
 * Hero Slider Banner Backdrop Studio (Bersih Tanpa Tulisan, Full Foto Backdrop)
 * Bergulir otomatis & manual
 */
export const BackdropHeroSlider: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-scroll bergulir otomatis setiap 3.5 detik
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BACKDROP_BANNER_IMAGES.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % BACKDROP_BANNER_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + BACKDROP_BANNER_IMAGES.length) % BACKDROP_BANNER_IMAGES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      handleNext();
    } else if (distance < -40) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = BACKDROP_BANNER_IMAGES[currentIdx];

  return (
    <div
      className="relative w-full overflow-hidden select-none bg-stone-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full Image Banner Container with Optimal Height for Landscape Backdrop Photos */}
      <div className="w-full h-56 sm:h-72 md:h-80 relative overflow-hidden bg-stone-950">
        <img
          key={activeSlide.id}
          src={activeSlide.image}
          alt={activeSlide.title}
          className="w-full h-full object-cover object-center transition-all duration-700 animate-in fade-in"
        />

        {/* Subtle Bottom Shadow for Dot Indicators Readability */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

        {/* Manual Arrow Controls (< and >) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center shadow-md cursor-pointer transition-all z-20 active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center shadow-md cursor-pointer transition-all z-20 active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Pagination Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {BACKDROP_BANNER_IMAGES.map((slide, idx) => {
            const isActive = currentIdx === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  isActive
                    ? 'w-7 h-2 bg-white shadow-md'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/90'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Konfigurasi Warna Pastel Unik untuk Tiap Cabang
 */
const BRANCH_PASTEL_THEMES: Record<string, {
  cardBg: string;
  cardBorder: string;
  cardBorderSelected: string;
  ringColor: string;
  iconBg: string;
  iconText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  btnBg: string;
  btnHover: string;
  pinColor: string;
}> = {
  'cabang-1': {
    cardBg: 'bg-[#f2f8f4]',
    cardBorder: 'border-[#c5decb]',
    cardBorderSelected: 'border-[#4d7557]',
    ringColor: 'ring-[#4d7557]/25',
    iconBg: 'bg-[#dbeee0]',
    iconText: 'text-[#2c4e35]',
    badgeBg: 'bg-[#dbeee0]',
    badgeText: 'text-[#2c4e35]',
    badgeBorder: 'border-[#bad8c2]',
    btnBg: 'bg-[#4d7557]',
    btnHover: 'hover:bg-[#3d5e45]',
    pinColor: 'text-[#4d7557]',
  },
  'cabang-2': {
    cardBg: 'bg-[#fdf6f0]',
    cardBorder: 'border-[#f2d5c2]',
    cardBorderSelected: 'border-[#a6623d]',
    ringColor: 'ring-[#a6623d]/25',
    iconBg: 'bg-[#fae4d4]',
    iconText: 'text-[#7a4120]',
    badgeBg: 'bg-[#fae4d4]',
    badgeText: 'text-[#7a4120]',
    badgeBorder: 'border-[#ecc4ab]',
    btnBg: 'bg-[#a6623d]',
    btnHover: 'hover:bg-[#8c4f2e]',
    pinColor: 'text-[#a6623d]',
  },
};

/**
 * Komponen Tampilan Utama Pilih Cabang & Layanan Khusus (Gambar 2 / Halaman Depan)
 */
export const BranchSelectorLanding: React.FC<BranchSelectorViewProps> = ({
  selectedBranch,
  onSelectBranch,
  onSelectCategory,
}) => {
  return (
    <div className="max-w-xl w-full mx-auto my-3 sm:my-8 px-2 sm:px-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col relative">
        
        {/* Top Hero Banner Slider (Foto Backdrop Bersih Tanpa Tulisan) */}
        <BackdropHeroSlider />

        {/* Content Area */}
        <div className="p-4 sm:p-6 space-y-4 bg-[#faf9f6] flex-1">
          
          {/* Section 1: Pilihan Cabang Studio */}
          <div className="space-y-3.5">
            {STUDIO_BRANCHES.map((branch) => {
              const isSelected = selectedBranch === branch.id;
              const theme = BRANCH_PASTEL_THEMES[branch.id] || BRANCH_PASTEL_THEMES['cabang-1'];

              return (
                <div
                  key={branch.id}
                  onClick={() => onSelectBranch(branch.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative group text-left ${
                    isSelected
                      ? `${theme.cardBg} ${theme.cardBorderSelected} ring-2 ${theme.ringColor} shadow-sm`
                      : `${theme.cardBg}/60 hover:${theme.cardBg} ${theme.cardBorder} hover:shadow-xs`
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 transition-transform group-hover:scale-105 ${theme.iconBg} ${theme.iconText} shadow-2xs`}>
                        {branch.icon}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-sm sm:text-base text-stone-900 truncate">
                            {branch.name}
                          </h3>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                            {branch.badge}
                          </span>
                        </div>

                        {/* Alamat Lengkap */}
                        <div className="flex items-start gap-1.5 mt-2 text-xs text-stone-600 leading-relaxed">
                          <MapPin className={`w-3.5 h-3.5 ${theme.pinColor} shrink-0 mt-0.5`} />
                          <span className="font-medium">{branch.address}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className={`w-6 h-6 rounded-full ${theme.btnBg} text-white flex items-center justify-center shrink-0 shadow-2xs`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-3.5 pt-3 border-t border-stone-200/50 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBranch(branch.id);
                      }}
                      className={`px-5 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${theme.btnBg} ${theme.btnHover} text-white`}
                    >
                      <span>{isSelected ? `Buka Katalog ${branch.badge}` : `Pilih ${branch.badge}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 2: Layanan Khusus Wedding & Cetak Foto */}
          <div className="pt-1">
            <div className="text-left px-1 pb-2">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-stone-500">
                ✨ Layanan Wedding & Cetak Foto:
              </span>
            </div>

            <div className="space-y-3">
              {/* Pricelist Wedding Card (Pastel Mauve / Rose) */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('wedding-package') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-4.5 rounded-2xl bg-[#faf1f5] hover:bg-[#f6e4ee] border border-[#ebd0df] hover:border-[#dfb8ce] transition-all cursor-pointer shadow-2xs group text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#f5e0ec] text-[#743358] border border-[#e2bece] flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      💍
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-stone-900 truncate">
                          PRICELIST WEDDING
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f5e0ec] text-[#743358] border border-[#e2bece]">
                          Exclusive
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium truncate mt-0.5">
                        Prewedding, Akad, Resepsi & Engagement
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCategory) onSelectCategory('wedding-package');
                      else onSelectBranch(selectedBranch);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-extrabold bg-[#964d74] hover:bg-[#7e3d60] text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <span>Lihat Pricelist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pricelist Cetak Card (Pastel Sky / Periwinkle) */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('bingkai-album') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-4.5 rounded-2xl bg-[#f0f5fa] hover:bg-[#e4eef7] border border-[#cbe0f2] hover:border-[#b4d2ec] transition-all cursor-pointer shadow-2xs group text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#dcecf8] text-[#264f77] border border-[#bed7ec] flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      🖼️
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-stone-900 truncate">
                          PRICELIST CETAK
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dcecf8] text-[#264f77] border border-[#bed7ec]">
                          Cetak Lab
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium truncate mt-0.5">
                        Cetak Lab, Bingkai Minimalis & Album Eksklusif
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCategory) onSelectCategory('bingkai-album');
                      else onSelectBranch(selectedBranch);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-extrabold bg-[#40709b] hover:bg-[#325a7e] text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <span>Lihat Pricelist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-white border-t border-stone-200/80 text-center text-[11px] text-stone-500 font-medium">
          💡 Kamu dapat berganti studio cabang kapan saja lewat tombol <strong>'Ganti Cabang'</strong>.
        </div>
      </div>
    </div>
  );
};

interface BranchSelectorModalProps {
  isOpen: boolean;
  selectedBranch: StudioBranch;
  onSelectBranch: (branch: StudioBranch) => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const BranchSelectorModal: React.FC<BranchSelectorModalProps> = ({
  isOpen,
  selectedBranch,
  onSelectBranch,
  onClose,
  canDismiss = true,
}) => {
  if (!isOpen) return null;

  const handleChoose = (branchId: StudioBranch) => {
    onSelectBranch(branchId);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-xl overflow-hidden flex flex-col my-auto relative">
        
        {/* Header Modal with Pure Slider */}
        <div className="relative">
          <BackdropHeroSlider />

          {canDismiss && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Branch Cards */}
        <div className="p-4 sm:p-6 space-y-4 bg-[#faf9f6] flex-1">
          {STUDIO_BRANCHES.map((branch) => {
            const isSelected = selectedBranch === branch.id;
            const theme = BRANCH_PASTEL_THEMES[branch.id] || BRANCH_PASTEL_THEMES['cabang-1'];

            return (
              <div
                key={branch.id}
                onClick={() => handleChoose(branch.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative group text-left ${
                  isSelected
                    ? `${theme.cardBg} ${theme.cardBorderSelected} ring-2 ${theme.ringColor} shadow-sm`
                    : `${theme.cardBg}/60 hover:${theme.cardBg} ${theme.cardBorder} hover:shadow-xs`
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 transition-transform group-hover:scale-105 ${theme.iconBg} ${theme.iconText} shadow-2xs`}>
                      {branch.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-stone-900 truncate">
                          {branch.name}
                        </h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                          {branch.badge}
                        </span>
                      </div>

                      {/* Alamat Lengkap */}
                      <div className="flex items-start gap-1.5 mt-2 text-xs text-stone-600 leading-relaxed">
                        <MapPin className={`w-3.5 h-3.5 ${theme.pinColor} shrink-0 mt-0.5`} />
                        <span className="font-medium">{branch.address}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className={`w-6 h-6 rounded-full ${theme.btnBg} text-white flex items-center justify-center shrink-0 shadow-2xs`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-stone-200/50 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoose(branch.id);
                    }}
                    className={`px-5 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${theme.btnBg} ${theme.btnHover} text-white`}
                  >
                    <span>{isSelected ? `Buka Katalog ${branch.badge}` : `Pilih ${branch.badge}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-white border-t border-stone-200/80 text-center text-[11px] text-stone-500 font-medium">
          💡 Kamu dapat berganti studio cabang kapan saja lewat menu di bagian atas.
        </div>
      </div>
    </div>
  );
};
