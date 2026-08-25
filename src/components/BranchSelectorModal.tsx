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
        {/* Brand Logo Watermark on Top-Left (Haute Couture Luxury Frosted Badge) */}
        <div className="absolute top-3.5 left-4 sm:top-4.5 sm:left-5 z-20 select-none">
          <div className="bg-white/85 hover:bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-1.5 rounded-full border border-white/90 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.16)] flex items-center gap-2 transition-all duration-300">
            <span className="font-luxury text-xl sm:text-2xl font-medium tracking-[0.18em] text-[#1a1917] uppercase leading-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              Alviero
            </span>
            <span className="w-1 h-1 rounded-full bg-[#6c8c74]" />
            <span className="text-[8.5px] sm:text-[9px] font-sans font-extrabold uppercase tracking-[0.22em] text-[#526a58]">
              Studio
            </span>
          </div>
        </div>

        <img
          key={activeSlide.id}
          src={activeSlide.image}
          alt={activeSlide.title}
          className="w-full h-full object-cover object-center transition-all duration-700 animate-in fade-in"
        />

        {/* Subtle Bottom Shadow for Dot Indicators Readability */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 via-black/15 to-transparent pointer-events-none" />

        {/* Manual Arrow Controls (< and >) with Frosted Glass Styling */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-stone-800 backdrop-blur-md flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-white/60 cursor-pointer transition-all z-20 active:scale-90"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-stone-800 backdrop-blur-md flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-white/60 cursor-pointer transition-all z-20 active:scale-90"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Dots Pagination Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/25 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10">
          {BACKDROP_BANNER_IMAGES.map((slide, idx) => {
            const isActive = currentIdx === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  isActive
                    ? 'w-6 h-1.5 bg-[#6c8c74] shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/70 hover:bg-white'
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
 * Komponen Tampilan Utama Pilih Cabang & Layanan Khusus (Halaman Depan)
 */
export const BranchSelectorLanding: React.FC<BranchSelectorViewProps> = ({
  selectedBranch,
  onSelectBranch,
  onSelectCategory,
}) => {
  return (
    <div className="max-w-xl w-full mx-auto my-3 sm:my-8 px-2 sm:px-4 animate-in fade-in duration-300">
      <div className="bg-[#faf9f5] rounded-3xl border border-[#e5ebe4] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col relative">
        
        {/* Top Hero Banner Slider (Foto Backdrop Bersih dengan Watermark Alviero) */}
        <BackdropHeroSlider />

        {/* Content Area */}
        <div className="p-4 sm:p-6 space-y-5 bg-[#faf9f5] flex-1">
          
          {/* Section 1: Pilihan Studio */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 pb-1">
              <h3 className="font-editorial text-xs sm:text-sm font-bold tracking-wider text-stone-900 uppercase">
                PILIH STUDIO
              </h3>
              <span className="text-xs font-sans font-bold text-stone-900">
                Buka Katalog Studio
              </span>
            </div>

            <div className="space-y-3.5">
              {STUDIO_BRANCHES.map((branch) => {
                const isSelected = selectedBranch === branch.id;

                return (
                  <div
                    key={branch.id}
                    onClick={() => onSelectBranch(branch.id)}
                    className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer relative group text-left ${
                      isSelected
                        ? 'bg-[#ffffff] border-[#7d9b84] ring-2 ring-[#6c8c74]/25 shadow-[0_6px_24px_-4px_rgba(108,140,116,0.18)] scale-[1.008]'
                        : 'bg-[#fcfcfa] hover:bg-white border-[#dce3dc] hover:border-[#9db2a3] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.08)]'
                    }`}
                  >
                    {/* Top right target/radio indicator */}
                    <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center p-0.5 transition-all duration-300 ${
                        isSelected ? 'border-[#55735b] bg-white shadow-2xs' : 'border-stone-300 bg-transparent group-hover:border-stone-400'
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#55735b] animate-in zoom-in-50 duration-200" />}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-3.5 pr-8">
                      {/* Left side: clean sage pin icon and radio circle */}
                      <div className="flex flex-col items-center gap-3 pt-0.5 shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 ${
                          isSelected ? 'bg-[#55735b] text-white' : 'bg-[#eaf1ea] text-[#55735b]'
                        }`}>
                          <MapPin className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                          isSelected ? 'border-[#55735b] bg-[#eef5ee]' : 'border-stone-300 bg-white group-hover:border-stone-400'
                        }`} />
                      </div>

                      {/* Main info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-sans font-bold text-sm sm:text-base text-stone-900 truncate">
                            {branch.name}
                          </h4>
                          <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#e8ece7] text-[#556553] border border-[#d6ded5]">
                            {branch.badge}
                          </span>
                        </div>

                        {/* Link Maps Langsung */}
                        <a
                          href={branch.mapsUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Buka lokasi di Google Maps"
                          className="flex items-start gap-1.5 mt-2 text-xs font-sans text-stone-700 hover:text-[#55735b] transition-colors leading-relaxed group/addr cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5 text-stone-500 group-hover/addr:text-[#55735b] shrink-0 mt-0.5 transition-colors" />
                          <span className="font-medium group-hover/addr:underline underline-offset-2">{branch.address}</span>
                        </a>
                      </div>
                    </div>

                    {/* Bottom right arrow button */}
                    <div className="mt-3 pt-2.5 border-t border-[#e8ece7] flex items-center justify-end">
                      <span className="text-stone-700 group-hover:text-stone-900 text-sm font-bold transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Layanan Khusus Wedding & Cetak Foto */}
          <div className="pt-2">
            <div className="text-left px-1 pb-2">
              <h3 className="font-editorial text-xs sm:text-sm font-bold tracking-wider text-stone-900 uppercase">
                LAYANAN WEDDING & CETAK FOTO:
              </h3>
            </div>

            <div className="space-y-3">
              {/* Pricelist Wedding Card */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('wedding-package') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#ded3de] via-[#ece5dc] to-[#f6eee5] hover:from-[#d7cbd7] hover:to-[#efe8dd] border border-[#d5c5d5] hover:border-[#c8b4c8] transition-all duration-300 cursor-pointer shadow-[0_2px_12px_-2px_rgba(150,77,116,0.1)] hover:shadow-[0_6px_20px_-3px_rgba(150,77,116,0.18)] group text-left relative overflow-hidden active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-xs border-2 border-[#d5be9f] shadow-[0_2px_8px_rgba(213,190,159,0.3)] flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                      💍
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-editorial font-bold text-sm sm:text-base text-[#241c22] tracking-wide truncate">
                          PRICELIST WEDDING
                        </h4>
                        <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-white/90 text-stone-700 border border-stone-200/80 shadow-2xs">
                          Exclusive
                        </span>
                      </div>
                      <p className="text-xs font-sans text-stone-600 font-medium truncate mt-0.5">
                        Prewedding, Akad, Resepsi & ...
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-sans font-bold text-stone-900 group-hover:text-black flex items-center gap-1.5 transition-colors shrink-0">
                    <span>Lihat Pricelist</span>
                    <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>

              {/* Pricelist Cetak Card */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('bingkai-album') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#d0e3d5] via-[#e5ede4] to-[#f6eee5] hover:from-[#c5dcd0] hover:to-[#efe8dd] border border-[#c4d9cb] hover:border-[#b0ceba] transition-all duration-300 cursor-pointer shadow-[0_2px_12px_-2px_rgba(64,112,155,0.1)] hover:shadow-[0_6px_20px_-3px_rgba(108,140,116,0.18)] group text-left relative overflow-hidden active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-xs border-2 border-[#d5be9f] shadow-[0_2px_8px_rgba(213,190,159,0.3)] flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                      🖼️
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-editorial font-bold text-sm sm:text-base text-[#18231a] tracking-wide truncate">
                          PRICELIST CETAK
                        </h4>
                        <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-white/90 text-stone-700 border border-stone-200/80 shadow-2xs">
                          Cetak Lab
                        </span>
                      </div>
                      <p className="text-xs font-sans text-stone-600 font-medium truncate mt-0.5">
                        Cetak Lab, Bingkai Minimalis &...
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-sans font-bold text-stone-900 group-hover:text-black flex items-center gap-1.5 transition-colors shrink-0">
                    <span>Lihat Pricelist</span>
                    <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-[#f5f8f5] border-t border-[#e2eae2] text-center text-[11px] text-stone-600 font-medium">
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
      <div className="bg-[#faf9f5] rounded-3xl max-w-xl w-full border border-[#e5ebe4] shadow-xl overflow-hidden flex flex-col my-auto relative">
        
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
        <div className="p-4 sm:p-6 space-y-4 bg-[#faf9f5] flex-1">
          <div className="text-left px-1 pb-1">
            <h3 className="font-editorial text-xs sm:text-sm font-bold tracking-wider text-stone-900 uppercase">
              PILIH STUDIO ALVIERO
            </h3>
          </div>

          {STUDIO_BRANCHES.map((branch) => {
            const isSelected = selectedBranch === branch.id;

            return (
              <div
                key={branch.id}
                onClick={() => handleChoose(branch.id)}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer relative group text-left ${
                  isSelected
                    ? 'bg-[#ffffff] border-[#7d9b84] ring-2 ring-[#6c8c74]/25 shadow-[0_6px_24px_-4px_rgba(108,140,116,0.18)] scale-[1.008]'
                    : 'bg-[#fcfcfa] hover:bg-white border-[#dce3dc] hover:border-[#9db2a3] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.08)]'
                }`}
              >
                {/* Top right target/radio indicator */}
                <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center p-0.5 transition-all duration-300 ${
                    isSelected ? 'border-[#55735b] bg-white shadow-2xs' : 'border-stone-300 bg-transparent group-hover:border-stone-400'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#55735b] animate-in zoom-in-50 duration-200" />}
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-3.5 pr-8">
                  {/* Left side: clean sage pin icon and radio circle */}
                  <div className="flex flex-col items-center gap-3 pt-0.5 shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 ${
                      isSelected ? 'bg-[#55735b] text-white' : 'bg-[#eaf1ea] text-[#55735b]'
                    }`}>
                      <MapPin className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                      isSelected ? 'border-[#55735b] bg-[#eef5ee]' : 'border-stone-300 bg-white group-hover:border-stone-400'
                    }`} />
                  </div>

                  {/* Main info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-sans font-bold text-sm sm:text-base text-stone-900 truncate">
                        {branch.name}
                      </h4>
                      <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#e8ece7] text-[#556553] border border-[#d6ded5]">
                        {branch.badge}
                      </span>
                    </div>

                    {/* Link Maps Langsung */}
                    <a
                      href={branch.mapsUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Buka Google Maps"
                      className="flex items-start gap-1.5 mt-2 text-xs font-sans text-stone-700 hover:text-[#55735b] transition-colors leading-relaxed group/addr cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-stone-500 group-hover/addr:text-[#55735b] shrink-0 mt-0.5 transition-colors" />
                      <span className="font-medium break-all group-hover/addr:underline underline-offset-2">{branch.address}</span>
                    </a>
                  </div>
                </div>

                {/* Bottom right arrow button */}
                <div className="mt-3 pt-2.5 border-t border-[#e8ece7] flex items-center justify-end">
                  <span className="text-stone-700 group-hover:text-stone-900 text-sm font-bold transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-[#f5f8f5] border-t border-[#e2eae2] text-center text-[11px] text-stone-600 font-medium">
          💡 Kamu dapat berganti studio kapan saja lewat menu di bagian atas.
        </div>
      </div>
    </div>
  );
};
