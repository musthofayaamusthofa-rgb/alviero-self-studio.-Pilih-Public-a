import React, { useState, useEffect, useRef } from 'react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';
import { X, ArrowRight, MapPin, Building2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

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
  { id: 'hero', image: '/images/backdrops/luxury-studio-hero.jpg', title: 'Minimalist Studio Booking Variant 2' },
  { id: '1', image: '/images/backdrops/backdrop-1.jpg', title: 'Backdrop Mint Modern Sofa' },
  { id: '2', image: '/images/backdrops/backdrop-2.jpg', title: 'Backdrop Bohemian Rustic Wall' },
  { id: '3', image: '/images/backdrops/backdrop-3.jpg', title: 'Backdrop Black Arch Window Bar Stool' },
  { id: '4', image: '/images/backdrops/backdrop-4.jpg', title: 'Backdrop Charcoal Classic Sofa' },
  { id: '5', image: '/images/backdrops/backdrop-5.jpg', title: 'Backdrop Luxury White Fireplace' },
  { id: '6', image: '/images/backdrops/backdrop-6.jpg', title: 'Backdrop Warm Beige Classic Armchair' },
  { id: '7', image: '/images/backdrops/backdrop-7.jpg', title: 'Backdrop White Arch Windows Grey Sofa' },
];

/**
 * Hero Slider Banner Backdrop Studio (Clean & Elegant Matching Photo 1)
 */
export const BackdropHeroSlider: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-scroll bergulir otomatis setiap 4 detik
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BACKDROP_BANNER_IMAGES.length);
    }, 4000);

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
      className="relative w-full overflow-hidden select-none bg-stone-900 group/slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full Image Banner Container */}
      <div className="w-full h-56 sm:h-72 md:h-80 relative overflow-hidden bg-stone-900">
        <img
          key={activeSlide.id}
          src={activeSlide.image}
          alt={activeSlide.title}
          className="w-full h-full object-cover object-center transition-all duration-700 animate-in fade-in"
        />

        {/* Minimalist Slim White Progress Bar Indicator (Matching Photo 1) */}
        <div className="absolute bottom-3 left-4 z-20">
          <div className="w-24 h-1.5 bg-white/90 rounded-full shadow-xs" />
        </div>

        {/* Minimal Controls */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity z-20 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity z-20 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * Komponen Tampilan Utama Pilih Cabang & Layanan Khusus
 * Disesuaikan 100% dengan Acuan Desain Foto Pertama (Minimalist Studio Booking Variant 2)
 */
export const BranchSelectorLanding: React.FC<BranchSelectorViewProps> = ({
  selectedBranch,
  onSelectBranch,
  onSelectCategory,
}) => {
  return (
    <div className="max-w-md w-full mx-auto my-2 sm:my-6 px-2 sm:px-4 animate-in fade-in duration-300">
      <div className="bg-[#faf8f2] rounded-3xl border border-stone-200/80 shadow-md overflow-hidden flex flex-col relative">
        
        {/* Top Hero Banner Slider (100% Acuan Foto 1) */}
        <BackdropHeroSlider />

        {/* Content Area (Warm Cream Clean Aesthetic) */}
        <div className="p-5 sm:p-7 space-y-6 bg-[#faf8f2] flex-1 text-left">
          
          {/* Section 1: PILIH CABANG (Typography Serif Luxury Editorial) */}
          <div className="space-y-4">
            <h2 className="text-[11.5px] sm:text-xs font-serif-luxury font-bold uppercase tracking-[0.2em] text-stone-800 text-left">
              PILIH CABANG
            </h2>

            {/* Cabang 1: Alviero Studio — Cabang 1 */}
            <div className="space-y-1 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-stone-900 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 fill-stone-900 text-stone-900" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-stone-900 leading-snug">
                    Alviero Studio — Cabang 1
                  </h3>

                  <div className="flex items-start gap-1.5 mt-1.5 text-xs text-stone-600 leading-relaxed font-normal">
                    <MapPin className="w-3.5 h-3.5 fill-stone-700 text-stone-700 shrink-0 mt-0.5" />
                    <span>
                      Jl. Raya Kertanegara, RT.003/RW.001...<br />
                      Karangploso, Girimoyo, Kec. Karang Ploso, Kabupaten Malang, Jawa Timur 65151
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectBranch('cabang-1')}
                    className="mt-2 text-xs font-bold text-[#8c6d3b] hover:text-[#6d542b] flex items-center gap-1.5 transition-colors cursor-pointer group py-0.5"
                  >
                    <span>Buka Katalog Cabang 1</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subtle Divider Line */}
            <div className="border-b border-stone-200/80 my-4" />

            {/* Cabang 2: Alviero Studio — Cabang 2 */}
            <div className="space-y-1 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-stone-900 shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5 text-stone-900" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-stone-900 leading-snug">
                    Alviero Studio — Cabang 2
                  </h3>

                  <div className="flex items-start gap-1.5 mt-1.5 text-xs text-stone-600 leading-relaxed font-normal">
                    <MapPin className="w-3.5 h-3.5 fill-stone-700 text-stone-700 shrink-0 mt-0.5" />
                    <span>
                      Ruko Gajayana, Jl. Simpang Gajayana No.Kav.P...<br />
                      Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectBranch('cabang-2')}
                    className="mt-2 text-xs font-bold text-[#8c6d3b] hover:text-[#6d542b] flex items-center gap-1.5 transition-colors cursor-pointer group py-0.5"
                  >
                    <span>Pilih Cabang 2</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: LAYANAN WEDDING & CETAK FOTO: */}
          <div className="pt-2 space-y-3">
            <h2 className="text-[11px] sm:text-xs font-serif-luxury font-bold uppercase tracking-[0.18em] text-stone-800 text-left">
              LAYANAN WEDDING & CETAK FOTO:
            </h2>

            {/* 1. Pricelist Wedding Card (Dusty Rose Pastel Glass Card) */}
            <div
              onClick={() => onSelectCategory ? onSelectCategory('wedding-package') : onSelectBranch(selectedBranch)}
              className="p-4 sm:p-4.5 rounded-2xl bg-[#c89da1] shadow-xs text-stone-900 flex items-center justify-between gap-3 cursor-pointer transition-all hover:brightness-105 active:scale-98 group text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-black/10 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                  💍
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif-luxury font-bold text-sm sm:text-base text-stone-900 tracking-wide leading-tight truncate">
                      PRICELIST WEDDING
                    </h4>
                    <span className="text-[9.5px] font-semibold px-2.5 py-0.5 rounded-full bg-white/40 text-stone-900 backdrop-blur-xs">
                      Exclusive
                    </span>
                  </div>
                  <p className="text-xs text-stone-800/80 font-medium truncate mt-0.5">
                    Prewedding, Akad, Resep...
                  </p>
                </div>
              </div>

              <div className="text-xs font-bold text-[#683f33] flex items-center gap-1.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
                <span>Lihat Pricelist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 2. Pricelist Cetak Card (Sage Green Pastel Glass Card) */}
            <div
              onClick={() => onSelectCategory ? onSelectCategory('bingkai-album') : onSelectBranch(selectedBranch)}
              className="p-4 sm:p-4.5 rounded-2xl bg-[#a3bba3] shadow-xs text-stone-900 flex items-center justify-between gap-3 cursor-pointer transition-all hover:brightness-105 active:scale-98 group text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-black/10 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs">
                  <ImageIcon className="w-5 h-5 text-stone-900" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif-luxury font-bold text-sm sm:text-base text-stone-900 tracking-wide leading-tight truncate">
                      PRICELIST CETAK
                    </h4>
                    <span className="text-[9.5px] font-semibold px-2.5 py-0.5 rounded-full bg-white/40 text-stone-900 backdrop-blur-xs">
                      Cetak Lab
                    </span>
                  </div>
                  <p className="text-xs text-stone-800/80 font-medium truncate mt-0.5">
                    Cetak Lab, Bingkai Minim...
                  </p>
                </div>
              </div>

              <div className="text-xs font-bold text-[#554a2a] flex items-center gap-1.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
                <span>Lihat Pricelist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

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
      <div className="bg-[#faf8f2] rounded-3xl max-w-md w-full border border-stone-200/80 shadow-xl overflow-hidden flex flex-col my-auto relative">
        
        {/* Header Modal with Slider */}
        <div className="relative">
          <BackdropHeroSlider />

          {canDismiss && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-7 space-y-5 bg-[#faf8f2] flex-1 text-left">
          <h2 className="text-[11.5px] sm:text-xs font-serif-luxury font-bold uppercase tracking-[0.2em] text-stone-800 text-left">
            PILIH CABANG STUDIO
          </h2>

          {/* Cabang 1 */}
          <div className="space-y-1 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 flex items-center justify-center text-stone-900 shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 fill-stone-900 text-stone-900" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-stone-900 leading-snug">
                  Alviero Studio — Cabang 1
                </h3>

                <div className="flex items-start gap-1.5 mt-1.5 text-xs text-stone-600 leading-relaxed font-normal">
                  <MapPin className="w-3.5 h-3.5 fill-stone-700 text-stone-700 shrink-0 mt-0.5" />
                  <span>
                    Jl. Raya Kertanegara, RT.003/RW.001...<br />
                    Karangploso, Girimoyo, Kec. Karang Ploso, Kabupaten Malang, Jawa Timur 65151
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleChoose('cabang-1')}
                  className="mt-2 text-xs font-bold text-[#8c6d3b] hover:text-[#6d542b] flex items-center gap-1.5 transition-colors cursor-pointer group py-0.5"
                >
                  <span>Buka Katalog Cabang 1</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-b border-stone-200/80 my-3" />

          {/* Cabang 2 */}
          <div className="space-y-1 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 flex items-center justify-center text-stone-900 shrink-0 mt-0.5">
                <Building2 className="w-5 h-5 text-stone-900" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-stone-900 leading-snug">
                  Alviero Studio — Cabang 2
                </h3>

                <div className="flex items-start gap-1.5 mt-1.5 text-xs text-stone-600 leading-relaxed font-normal">
                  <MapPin className="w-3.5 h-3.5 fill-stone-700 text-stone-700 shrink-0 mt-0.5" />
                  <span>
                    Ruko Gajayana, Jl. Simpang Gajayana No.Kav.P...<br />
                    Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleChoose('cabang-2')}
                  className="mt-2 text-xs font-bold text-[#8c6d3b] hover:text-[#6d542b] flex items-center gap-1.5 transition-colors cursor-pointer group py-0.5"
                >
                  <span>Pilih Cabang 2</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-[#f4f3ee] border-t border-stone-200/80 text-center text-[11px] text-stone-500 font-medium">
          💡 Kamu dapat berganti studio cabang kapan saja lewat menu di bagian atas.
        </div>
      </div>
    </div>
  );
};
