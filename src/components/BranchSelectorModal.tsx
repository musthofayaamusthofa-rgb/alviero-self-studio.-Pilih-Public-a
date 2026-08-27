import React, { useState, useEffect, useRef } from 'react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';
import { Check, X, ArrowRight, MapPin, ChevronLeft, ChevronRight, Sparkles, Star, ShieldCheck, Clock, Award } from 'lucide-react';

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
  { id: '1', image: '/images/backdrops/backdrop-1.jpg', title: 'Mint Modern Aesthetic Sofa', theme: 'Fresh & Elegant' },
  { id: '2', image: '/images/backdrops/backdrop-2.jpg', title: 'Bohemian Rustic Texture Wall', theme: 'Warm Natural' },
  { id: '3', image: '/images/backdrops/backdrop-3.jpg', title: 'Black Arch Window Bar Stool', theme: 'Bold & Chic' },
  { id: '4', image: '/images/backdrops/backdrop-4.jpg', title: 'Charcoal Classic Deep Sofa', theme: 'Timeless Luxury' },
  { id: '5', image: '/images/backdrops/backdrop-5.jpg', title: 'Luxury White Fireplace & Frame', theme: 'European Royal' },
  { id: '6', image: '/images/backdrops/backdrop-6.jpg', title: 'Warm Beige Classic Armchair', theme: 'Cozy Editorial' },
  { id: '7', image: '/images/backdrops/backdrop-7.jpg', title: 'White Arch Windows & Grey Sofa', theme: 'Minimalist Bright' },
];

/**
 * Hero Slider Banner Backdrop Studio (Tampilan Mewah, Editorial & Sinematik)
 */
export const BackdropHeroSlider: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-scroll bergulir otomatis setiap 3.8 detik
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BACKDROP_BANNER_IMAGES.length);
    }, 3800);

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
      className="relative w-full overflow-hidden select-none bg-[#1C1A17] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full Image Banner Container */}
      <div className="w-full h-72 sm:h-84 md:h-96 relative overflow-hidden bg-[#1C1A17]">
        {/* Brand Watermark Header */}
        <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 select-none">
          <div className="flex flex-col items-start leading-none bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/60 shadow-xs">
            <span className="font-serif font-black text-sm sm:text-base tracking-[0.25em] text-[#1C1A17]">
              ALVIERO
            </span>
            <span className="font-sans font-bold text-[8px] sm:text-[9px] tracking-[0.3em] text-[#8C6D46] uppercase mt-0.5">
              CREATIVE SPACE & STUDIO
            </span>
          </div>
        </div>

        {/* Top Right Luxury Badge */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 select-none">
          <div className="flex items-center gap-1.5 bg-[#1C1A17]/75 backdrop-blur-md text-[#E8DFD1] text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full border border-white/10 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span>7+ Aesthetic Backdrops</span>
          </div>
        </div>

        {/* Slide Photo with Subtle Zoom Animation */}
        <img
          key={activeSlide.id}
          src={activeSlide.image}
          alt={activeSlide.title}
          className="w-full h-full object-cover object-center transition-all duration-700 animate-in fade-in"
        />

        {/* Luxury Vignette & Dark Gradient Shield */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

        {/* Slide Caption at Bottom-Left */}
        <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 z-20 max-w-[70%]">
          <span className="inline-block text-[9px] font-bold tracking-widest text-[#D4AF37] uppercase bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md mb-1 border border-[#D4AF37]/30">
            {activeSlide.theme}
          </span>
          <h4 className="font-serif font-bold text-sm sm:text-base text-white leading-tight drop-shadow-md truncate">
            {activeSlide.title}
          </h4>
        </div>

        {/* Manual Arrow Controls with Frosted Glass Styling */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-[#1C1A17] backdrop-blur-md flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.18)] border border-white/80 cursor-pointer transition-all z-20 active:scale-90 opacity-90 group-hover:opacity-100"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-[#1C1A17] backdrop-blur-md flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.18)] border border-white/80 cursor-pointer transition-all z-20 active:scale-90 opacity-90 group-hover:opacity-100"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Dots Pagination Indicators */}
        <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex items-center gap-1.5 z-20 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
          {BACKDROP_BANNER_IMAGES.map((slide, idx) => {
            const isActive = currentIdx === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  isActive
                    ? 'w-5 h-1.5 bg-[#D4AF37] shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white'
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
 * Komponen Tampilan Utama Pilih Cabang & Layanan Khusus (High-End Luxury Editorial)
 */
export const BranchSelectorLanding: React.FC<BranchSelectorViewProps> = ({
  selectedBranch,
  onSelectBranch,
  onSelectCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const selectedBranchData = STUDIO_BRANCHES.find((b) => b.id === selectedBranch) || STUDIO_BRANCHES[0];

  return (
    <div className="max-w-md w-full mx-auto my-2 sm:my-5 px-2 sm:px-3 animate-in fade-in duration-300">
      <div className="bg-[#FAF8F5] rounded-[28px] sm:rounded-[32px] border border-[#E8E1D5] shadow-[0_16px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col relative">
        
        {/* Top Hero Banner Slider */}
        <BackdropHeroSlider />

        {/* Content Area */}
        <div className="p-4 sm:p-5 space-y-4 bg-[#FAF8F5] flex-1">
          
          {/* Section 1: Pilihan Studio (Minimalis, Elegan & Mewah) */}
          <div className="space-y-2">
            <div className="text-left px-0.5">
              <h3 className="font-serif text-xs font-bold tracking-widest text-[#1C1A17] uppercase">
                PILIH STUDIO
              </h3>
            </div>

            {/* Studio Selection Card */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-[#FCFBF9] border border-[#E5DFD5] hover:border-[#1C1A17]/40 shadow-xs hover:shadow-sm transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 text-left group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] border border-[#E8DFD1] text-[#8C6D46] flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105">
                  <MapPin className="w-5 h-5 stroke-[2.2] text-[#8C6D46]" />
                </div>
                <div className="min-w-0">
                  <span className="font-serif font-bold text-base sm:text-lg tracking-wide text-[#1C1A17] leading-tight block truncate">
                    {selectedBranchData.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-sans font-semibold text-white bg-[#1C1A17] hover:bg-[#2D2A26] px-3.5 py-2 rounded-xl shadow-2xs transition-all shrink-0">
                <span>Pilih Studio</span>
                <span className="text-xs transition-transform group-hover:translate-y-0.5">▾</span>
              </div>
            </button>
          </div>

          {/* Section 2: Layanan Wedding & Cetak Foto */}
          <div className="pt-1 space-y-2">
            <div className="text-left px-0.5">
              <h3 className="font-serif text-xs font-bold tracking-widest text-[#1C1A17] uppercase">
                LAYANAN WEDDING & CETAK FOTO:
              </h3>
            </div>

            <div className="space-y-2.5">
              {/* Pricelist Wedding Card */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('wedding-package') : onSelectBranch(selectedBranch)}
                className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-[#FCFBF9] border border-[#E5DFD5] hover:border-[#1C1A17]/40 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md group text-left relative overflow-hidden active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] border border-[#E8DFD1] flex items-center justify-center text-lg shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      💍
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1A17] tracking-wide truncate">
                          PRICELIST WEDDING
                        </h4>
                        <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-[#F2ECE4] text-[#5C5247] border border-[#E3DBD0]">
                          Exclusive
                        </span>
                      </div>
                      <p className="text-xs font-sans text-[#6B635B] font-medium truncate mt-0.5">
                        Prewedding, Akad, Resepsi & Engagement
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-sans font-bold text-[#1C1A17] flex items-center gap-1 transition-colors shrink-0 group-hover:text-[#8C6D46]">
                    <span>Lihat Pricelist</span>
                    <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>

              {/* Pricelist Cetak Card */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('bingkai-album') : onSelectBranch(selectedBranch)}
                className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-[#FCFBF9] border border-[#E5DFD5] hover:border-[#1C1A17]/40 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md group text-left relative overflow-hidden active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] border border-[#E8DFD1] flex items-center justify-center text-lg shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      🖼️
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1A17] tracking-wide truncate">
                          PRICELIST CETAK
                        </h4>
                        <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-[#F2ECE4] text-[#5C5247] border border-[#E3DBD0]">
                          Cetak Lab
                        </span>
                      </div>
                      <p className="text-xs font-sans text-[#6B635B] font-medium truncate mt-0.5">
                        Cetak Lab, Bingkai Minimalis & Album
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-sans font-bold text-[#1C1A17] flex items-center gap-1 transition-colors shrink-0 group-hover:text-[#8C6D46]">
                    <span>Lihat Pricelist</span>
                    <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="p-3.5 bg-[#F5EFEB] border-t border-[#E8E1D5] text-center text-[11px] text-[#5C5650] font-medium">
          💡 Kamu dapat berganti studio kapan saja lewat tombol <strong>'Ganti Studio'</strong>.
        </div>
      </div>

      {/* Pop-up Modal Pilihan Studio 1 & Studio 2 */}
      <BranchSelectorModal
        isOpen={isModalOpen}
        selectedBranch={selectedBranch}
        onSelectBranch={(branch) => {
          onSelectBranch(branch);
          setIsModalOpen(false);
        }}
        onClose={() => setIsModalOpen(false)}
        canDismiss={true}
      />
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
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-xl w-full border border-[#E8E1D5] shadow-2xl overflow-hidden flex flex-col my-auto relative">
        
        {/* Minimalist Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E1D5] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] text-[#8C6D46] flex items-center justify-center shadow-2xs border border-[#E8DFD1]">
              <MapPin className="w-5 h-5 text-[#8C6D46] stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold tracking-wider text-[#1C1A17] uppercase leading-none">
                PILIH LOKASI STUDIO ALVIERO
              </h3>
              <p className="text-[11px] font-sans text-stone-500 font-medium mt-1">
                Tentukan cabang studio foto yang ingin Anda kunjungi
              </p>
            </div>
          </div>

          {canDismiss && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Branch Cards (Minimalist & Luxury Layout) */}
        <div className="p-4 sm:p-5 space-y-3 bg-[#FAF8F5] flex-1">
          {STUDIO_BRANCHES.map((branch) => {
            const isSelected = selectedBranch === branch.id;

            return (
              <div
                key={branch.id}
                onClick={() => handleChoose(branch.id)}
                className={`p-4 sm:p-4.5 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer relative group text-left ${
                  isSelected
                    ? 'bg-white border-[#1C1A17] ring-2 ring-[#1C1A17]/10 shadow-[0_8px_24px_-4px_rgba(28,26,23,0.12)] scale-[1.008]'
                    : 'bg-[#FCFBF9] hover:bg-white border-[#E8E1D5] hover:border-[#1C1A17]/40 shadow-xs hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Clean Left Icon Container */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs transition-all duration-200 ${
                      isSelected ? 'bg-[#1C1A17] text-white shadow-xs' : 'bg-[#FAF5EE] text-[#8C6D46] group-hover:bg-[#F5EDE1]'
                    }`}>
                      <MapPin className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    {/* Main Studio Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1A17]">
                          {branch.name}
                        </h4>
                        <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full border ${
                          isSelected ? 'bg-[#F2ECE4] text-[#5C5247] border-[#E3DBD0]' : 'bg-[#FAF5EE] text-stone-600 border-[#E8DFD1]'
                        }`}>
                          {branch.badge}
                        </span>
                      </div>

                      <p className="text-xs font-sans text-stone-600 font-medium leading-relaxed mt-1 line-clamp-2">
                        {branch.address}
                      </p>

                      {/* Fasilitas Cabang */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                          ✓ Pro Godox Lighting
                        </span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                          ✓ 7+ Backdrop
                        </span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                          ✓ Ruang AC
                        </span>
                      </div>

                      {/* Link Maps */}
                      <a
                        href={branch.mapsUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 mt-2 text-[11px] font-sans font-semibold text-[#8C6D46] hover:text-[#5C4526] underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        <span>Buka Petunjuk Arah di Google Maps</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Single Right Target / Radio Indicator */}
                  <div className="pt-1 shrink-0">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center p-0.5 transition-all duration-300 ${
                      isSelected ? 'border-[#1C1A17] bg-white shadow-2xs' : 'border-stone-300 bg-transparent group-hover:border-stone-400'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1C1A17] animate-in zoom-in-50 duration-200" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#F5EFEB] border-t border-[#E8E1D5] text-center text-[11px] text-stone-500 font-medium">
          💡 Pilih salah satu studio untuk melihat pricelist dan katalog lengkap.
        </div>
      </div>
    </div>
  );
};
