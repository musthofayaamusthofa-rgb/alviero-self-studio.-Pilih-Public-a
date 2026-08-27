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
      className="relative w-full overflow-hidden select-none bg-[#EAE2D5]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full Image Banner Container with Optimal Height */}
      <div className="w-full h-64 sm:h-76 md:h-84 relative overflow-hidden bg-[#EAE2D5]">
        {/* Brand Watermark on Top-Left (Clean Editorial Typography matching Reference) */}
        <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 select-none">
          <div className="flex flex-col items-start leading-none">
            <span className="font-serif font-black text-sm sm:text-base tracking-[0.2em] text-[#2D2A26] drop-shadow-xs">
              ALVIERO
            </span>
            <span className="font-serif font-bold text-[10px] sm:text-xs tracking-[0.3em] text-[#4A4641] mt-0.5">
              STUDIO
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
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none" />

        {/* Manual Arrow Controls (< and >) with Frosted Glass Styling */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/75 hover:bg-white text-[#2D2A26] backdrop-blur-md flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.12)] border border-white/60 cursor-pointer transition-all z-20 active:scale-90"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/75 hover:bg-white text-[#2D2A26] backdrop-blur-md flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.12)] border border-white/60 cursor-pointer transition-all z-20 active:scale-90"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Dots Pagination Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/25 backdrop-blur-xs px-3 py-1 rounded-full border border-white/15">
          {BACKDROP_BANNER_IMAGES.map((slide, idx) => {
            const isActive = currentIdx === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  isActive
                    ? 'w-6 h-1.5 bg-[#8DA4B8] shadow-xs'
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
    cardBg: 'bg-[#FAF8F5]',
    cardBorder: 'border-[#E8E1D5]',
    cardBorderSelected: 'border-[#C49A99]',
    ringColor: 'ring-[#C49A99]/25',
    iconBg: 'bg-[#FAF5EE]',
    iconText: 'text-[#8C6D46]',
    badgeBg: 'bg-[#F7EFEF]',
    badgeText: 'text-[#A87D7C]',
    badgeBorder: 'border-[#E8D6D5]',
    btnBg: 'bg-[#C49A99]',
    btnHover: 'hover:bg-[#B58A89]',
    pinColor: 'text-[#2D2A26]',
    actionText: 'text-[#C49A99]',
  },
  'cabang-2': {
    cardBg: 'bg-[#FAF8F5]',
    cardBorder: 'border-[#E8E1D5]',
    cardBorderSelected: 'border-[#8DA4B8]',
    ringColor: 'ring-[#8DA4B8]/25',
    iconBg: 'bg-[#EBF1F6]',
    iconText: 'text-[#5C758A]',
    badgeBg: 'bg-[#EBF1F6]',
    badgeText: 'text-[#5C758A]',
    badgeBorder: 'border-[#D0DEE9]',
    btnBg: 'bg-[#8DA4B8]',
    btnHover: 'hover:bg-[#7D96AB]',
    pinColor: 'text-[#2D2A26]',
    actionText: 'text-[#8DA4B8]',
  },
};

/**
 * Komponen Tampilan Utama Pilih Cabang & Layanan Khusus (Halaman Depan Sesuai Desain Referensi)
 */
export const BranchSelectorLanding: React.FC<BranchSelectorViewProps> = ({
  selectedBranch,
  onSelectBranch,
  onSelectCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const selectedBranchData = STUDIO_BRANCHES.find((b) => b.id === selectedBranch) || STUDIO_BRANCHES[0];

  return (
    <div className="max-w-md w-full mx-auto my-3 sm:my-6 px-2.5 sm:px-4 animate-in fade-in duration-300">
      <div className="bg-[#FAF8F5] rounded-[28px] sm:rounded-[32px] border border-[#E8E1D5] shadow-[0_12px_36px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col relative">
        
        {/* Top Hero Banner Slider (Foto Backdrop Bersih dengan Watermark Alviero) */}
        <BackdropHeroSlider />

        {/* Content Area */}
        <div className="p-4 sm:p-5 space-y-4.5 bg-[#FAF8F5] flex-1">
          
          {/* Section 1: Pilihan Studio (Minimalis, Menarik & Mewah) */}
          <div className="space-y-2">
            <div className="text-left px-0.5">
              <h3 className="font-serif text-xs font-bold tracking-widest text-[#2D2A26] uppercase">
                PILIH STUDIO
              </h3>
            </div>

            {/* Luxury Minimalist Studio Selection Bar */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-[#FCFBF9] border border-[#E5DFD5] hover:border-[#C49A99] shadow-xs hover:shadow-sm transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 text-left group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#FAF5EE] border border-[#E8DFD1] text-[#8C6D46] flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105">
                  <MapPin className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <span className="font-serif font-bold text-base sm:text-lg tracking-wide text-[#2D2A26] leading-tight block truncate">
                    Alviero Studio
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-sans font-semibold text-white bg-[#C49A99] hover:bg-[#B58A89] px-3.5 py-1.5 rounded-xl shadow-2xs transition-all shrink-0">
                <span>Pilih Studio</span>
                <span className="text-xs transition-transform group-hover:translate-y-0.5">▾</span>
              </div>
            </button>
          </div>

          {/* Section 2: Layanan Khusus Wedding & Cetak Foto */}
          <div className="pt-1 space-y-2">
            <div className="text-left px-0.5">
              <h3 className="font-serif text-xs font-bold tracking-widest text-[#2D2A26] uppercase">
                LAYANAN WEDDING & CETAK FOTO:
              </h3>
            </div>

            <div className="space-y-2.5">
              {/* Pricelist Wedding Card (Dusty Rose / Mauve Palette) */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('wedding-package') : onSelectBranch(selectedBranch)}
                className="p-4 rounded-2xl sm:rounded-3xl bg-[#CBA3A1] hover:bg-[#C49A98] border border-[#BE9593] transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md group text-left relative overflow-hidden active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-xl shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      💍
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#2E1E21] tracking-wide truncate">
                          PRICELIST WEDDING
                        </h4>
                        <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-white/40 text-[#2E1E21] border border-white/50">
                          Exclusive
                        </span>
                      </div>
                      <p className="text-xs font-sans text-[#4A3236] font-medium truncate mt-0.5">
                        Prewedding, Akad, Resepsi & ...
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-sans font-bold text-[#2E1E21] flex items-center gap-1 transition-colors shrink-0">
                    <span>Lihat Pricelist</span>
                    <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>

              {/* Pricelist Cetak Card (Dusty Slate Blue / Denim Palette) */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('bingkai-album') : onSelectBranch(selectedBranch)}
                className="p-4 rounded-2xl sm:rounded-3xl bg-[#8DA4B8] hover:bg-[#8299AD] border border-[#7E96AA] transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md group text-left relative overflow-hidden active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-xl shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      🖼️
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#152330] tracking-wide truncate">
                          PRICELIST CETAK
                        </h4>
                        <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-white/40 text-[#152330] border border-white/50">
                          Cetak Lab
                        </span>
                      </div>
                      <p className="text-xs font-sans text-[#263A4B] font-medium truncate mt-0.5">
                        Cetak Lab, Bingkai Minimalis &...
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-sans font-bold text-[#152330] flex items-center gap-1 transition-colors shrink-0">
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
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-[#faf9f5] rounded-3xl max-w-xl w-full border border-[#e5ebe4] shadow-xl overflow-hidden flex flex-col my-auto relative">
        
        {/* Minimalist Modal Header (Clean Luxury) */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E1D5] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#FAF5EE] text-[#8C6D46] flex items-center justify-center shadow-2xs border border-[#E8DFD1]">
              <MapPin className="w-4 h-4 text-[#8C6D46] stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold tracking-wider text-[#2D2A26] uppercase leading-none">
                PILIH STUDIO ALVIERO
              </h3>
              <p className="text-[11px] font-sans text-stone-500 font-medium mt-1">
                Tentukan lokasi studio foto yang ingin Anda kunjungi
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
                    ? 'bg-white border-[#C49A99] ring-2 ring-[#C49A99]/20 shadow-[0_6px_20px_-2px_rgba(196,154,153,0.2)] scale-[1.008]'
                    : 'bg-[#FCFBF9] hover:bg-white border-[#E8E1D5] hover:border-[#C49A99]/60 shadow-xs hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Clean Left Icon Container */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs transition-all duration-200 ${
                      isSelected ? 'bg-[#C49A99] text-white shadow-xs' : 'bg-[#FAF5EE] text-[#8C6D46] group-hover:bg-[#F5EDE1]'
                    }`}>
                      <MapPin className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    {/* Main Studio Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#2D2A26]">
                          {branch.name}
                        </h4>
                        <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full border ${
                          isSelected ? 'bg-[#F7EFEF] text-[#A87D7C] border-[#E8D6D5]' : 'bg-[#FAF5EE] text-stone-600 border-[#E8DFD1]'
                        }`}>
                          {branch.badge}
                        </span>
                      </div>

                      <p className="text-xs font-sans text-stone-600 font-medium leading-relaxed mt-1 line-clamp-2">
                        {branch.address}
                      </p>

                      {/* Link Maps */}
                      <a
                        href={branch.mapsUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 mt-2 text-[11px] font-sans font-semibold text-[#A87D7C] hover:text-[#8C6D46] underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        <span>Buka di Google Maps</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Single Right Target / Radio Indicator */}
                  <div className="pt-1 shrink-0">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center p-0.5 transition-all duration-300 ${
                      isSelected ? 'border-[#C49A99] bg-white shadow-2xs' : 'border-stone-300 bg-transparent group-hover:border-stone-400'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#C49A99] animate-in zoom-in-50 duration-200" />}
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
