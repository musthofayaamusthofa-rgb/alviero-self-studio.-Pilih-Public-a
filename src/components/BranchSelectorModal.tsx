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
 * Konfigurasi Warna Pastel Unik untuk Tiap Cabang (Warm Linen & Golden Bronze)
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
  actionText: string;
}> = {
  'cabang-1': {
    cardBg: 'bg-[#faf6ed]',
    cardBorder: 'border-[#eae4d5]',
    cardBorderSelected: 'border-[#947035]',
    ringColor: 'ring-[#947035]/25',
    iconBg: 'bg-[#ede5d3]',
    iconText: 'text-[#54401c]',
    badgeBg: 'bg-[#f4edd9]',
    badgeText: 'text-[#634c22]',
    badgeBorder: 'border-[#dfd2b5]',
    btnBg: 'bg-[#947035]',
    btnHover: 'hover:bg-[#7d5c28]',
    pinColor: 'text-[#2b2926]',
    actionText: 'text-[#947035]',
  },
  'cabang-2': {
    cardBg: 'bg-[#faf6ed]',
    cardBorder: 'border-[#eae4d5]',
    cardBorderSelected: 'border-[#947035]',
    ringColor: 'ring-[#947035]/25',
    iconBg: 'bg-[#ede5d3]',
    iconText: 'text-[#54401c]',
    badgeBg: 'bg-[#f4edd9]',
    badgeText: 'text-[#634c22]',
    badgeBorder: 'border-[#dfd2b5]',
    btnBg: 'bg-[#947035]',
    btnHover: 'hover:bg-[#7d5c28]',
    pinColor: 'text-[#2b2926]',
    actionText: 'text-[#947035]',
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
      <div className="bg-[#fbf9f4] rounded-3xl border border-[#eae5d9] shadow-sm overflow-hidden flex flex-col relative">
        
        {/* Top Hero Banner Slider (Foto Backdrop Bersih Tanpa Tulisan) */}
        <BackdropHeroSlider />

        {/* Content Area */}
        <div className="p-4 sm:p-6 space-y-5 bg-[#fbf9f4] flex-1">
          
            {/* Section 1: Pilihan Cabang Studio */}
          <div className="space-y-3">
            <div className="text-left px-1 pb-1">
              <h3 className="font-editorial text-xs sm:text-sm font-bold tracking-wider text-[#1e1d1a] uppercase">
                PILIH STUDIO
              </h3>
            </div>

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
                        : `${theme.cardBg}/70 hover:${theme.cardBg} ${theme.cardBorder} hover:shadow-xs`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 transition-transform group-hover:scale-105 bg-[#ede5d3] text-[#2b2926] shadow-2xs">
                          {branch.icon}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-sans font-bold text-sm sm:text-base text-[#1e1d1a] truncate">
                              {branch.name}
                            </h4>
                            <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                              {branch.badge}
                            </span>
                          </div>

                          {/* Alamat Lengkap (Clickable Maps Link) */}
                          <a
                            href={branch.mapsUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Buka lokasi di Google Maps"
                            className="flex items-start gap-1.5 mt-1.5 text-xs font-sans text-[#57544d] hover:text-[#947035] transition-colors leading-relaxed group/addr cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#2b2926] group-hover/addr:text-[#947035] shrink-0 mt-0.5 transition-colors" />
                            <span className="font-medium group-hover/addr:underline underline-offset-2">{branch.address}</span>
                          </a>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#947035] text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Action Link / Button (Matches Screenshot: Golden Bronze Action Link) */}
                    <div className="mt-3 pt-2.5 border-t border-[#eae4d5]/70 flex items-center justify-start sm:justify-start">
                      <div className="text-xs font-sans font-bold text-[#947035] group-hover:text-[#7a5925] flex items-center gap-1.5 transition-colors">
                        <span>{isSelected ? `Buka Katalog ${branch.badge}` : `Pilih ${branch.badge}`}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Layanan Khusus Wedding & Cetak Foto */}
          <div className="pt-2">
            <div className="text-left px-1 pb-2">
              <h3 className="font-editorial text-xs sm:text-sm font-bold tracking-wider text-[#1e1d1a] uppercase">
                LAYANAN WEDDING & CETAK FOTO:
              </h3>
            </div>

            <div className="space-y-3">
              {/* Pricelist Wedding Card (Pastel Dusty Rose / Mauve from Reference Screenshot) */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('wedding-package') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-5 rounded-2xl bg-[#cda7a7] hover:bg-[#c59e9e] transition-all cursor-pointer shadow-sm hover:shadow-md group text-left relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#b89090] text-white flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      💍
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-editorial font-bold text-sm sm:text-base text-[#221313] tracking-wide truncate">
                          PRICELIST WEDDING
                        </h4>
                        <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#f2e4e4] text-[#5e3838] border border-[#e4d0d0]">
                          Exclusive
                        </span>
                      </div>
                      <p className="text-xs font-sans text-[#4a3030] font-medium truncate mt-0.5">
                        Prewedding, Akad, Resepsi & Engagement
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-sans font-bold text-[#7d4444] group-hover:text-[#5e2e2e] flex items-center gap-1.5 transition-colors shrink-0">
                    <span>Lihat Pricelist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Pricelist Cetak Card (Pastel Sage Green from Reference Screenshot) */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('bingkai-album') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-5 rounded-2xl bg-[#b2c3ad] hover:bg-[#a6b9a1] transition-all cursor-pointer shadow-sm hover:shadow-md group text-left relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#9aae93] text-white flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                      🖼️
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-editorial font-bold text-sm sm:text-base text-[#162114] tracking-wide truncate">
                          PRICELIST CETAK
                        </h4>
                        <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#e4ece2] text-[#344e2f] border border-[#d0ded0]">
                          Cetak Lab
                        </span>
                      </div>
                      <p className="text-xs font-sans text-[#364832] font-medium truncate mt-0.5">
                        Cetak Lab, Bingkai Minimalis & Album Eksklusif
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-sans font-bold text-[#6a5e35] group-hover:text-[#524925] flex items-center gap-1.5 transition-colors shrink-0">
                    <span>Lihat Pricelist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-[#faf7ee] border-t border-[#eae5d9] text-center text-[11px] text-[#7c776e] font-medium">
          💡 Kamu dapat berganti studio kapan saja lewat tombol <strong>'Ganti Studio'</strong>.
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
      <div className="bg-[#fbf9f4] rounded-3xl max-w-xl w-full border border-[#eae5d9] shadow-xl overflow-hidden flex flex-col my-auto relative">
        
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
        <div className="p-4 sm:p-6 space-y-4 bg-[#fbf9f4] flex-1">
          <div className="text-left px-1 pb-1">
            <h3 className="font-editorial text-xs sm:text-sm font-bold tracking-wider text-[#1e1d1a] uppercase">
              PILIH STUDIO ALVIERO
            </h3>
          </div>

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
                    : `${theme.cardBg}/70 hover:${theme.cardBg} ${theme.cardBorder} hover:shadow-xs`
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 transition-transform group-hover:scale-105 bg-[#ede5d3] text-[#2b2926] shadow-2xs">
                      {branch.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-sans font-bold text-sm sm:text-base text-[#1e1d1a] truncate">
                          {branch.name}
                        </h4>
                        <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                          {branch.badge}
                        </span>
                      </div>

                      {/* Alamat Lengkap (Clickable Maps Link) */}
                      <a
                        href={branch.mapsUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Buka lokasi di Google Maps"
                        className="flex items-start gap-1.5 mt-1.5 text-xs font-sans text-[#57544d] hover:text-[#947035] transition-colors leading-relaxed group/addr cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#2b2926] group-hover/addr:text-[#947035] shrink-0 mt-0.5 transition-colors" />
                        <span className="font-medium group-hover/addr:underline underline-offset-2">{branch.address}</span>
                      </a>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#947035] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Action Link */}
                <div className="mt-3 pt-2.5 border-t border-[#eae4d5]/70 flex items-center justify-start">
                  <div className="text-xs font-sans font-bold text-[#947035] group-hover:text-[#7a5925] flex items-center gap-1.5 transition-colors">
                    <span>{isSelected ? `Buka Katalog ${branch.badge}` : `Pilih ${branch.badge}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-[#faf7ee] border-t border-[#eae5d9] text-center text-[11px] text-[#7c776e] font-medium">
          💡 Kamu dapat berganti studio kapan saja lewat menu di bagian atas.
        </div>
      </div>
    </div>
  );
};
