import React, { useState, useEffect, useRef } from 'react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';
import { 
  Check, 
  X, 
  ArrowRight, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  Clock, 
  Award, 
  Palette, 
  Layers, 
  HeartHandshake, 
  Sliders, 
  Image as ImageIcon,
  Camera
} from 'lucide-react';

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

interface BackdropHeroSliderProps {
  onViewPlans?: () => void;
}

/**
 * Hero Slider Banner Backdrop Studio (Desain Tegas, Modern, Editorial & Dewasa)
 */
export const BackdropHeroSlider: React.FC<BackdropHeroSliderProps> = ({ onViewPlans }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-scroll bergulir otomatis setiap 4.2 detik
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BACKDROP_BANNER_IMAGES.length);
    }, 4200);

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
      className="relative w-full overflow-hidden select-none bg-[#1C1A17] group flex flex-col"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Top Minimalist Navbar (Tegas & Mewah) */}
      <div className="w-full bg-white px-4 py-3.5 sm:px-6 flex items-center justify-center border-b border-[#E0D9CE] z-30">
        <div className="flex items-center gap-1.5">
          <span className="font-serif font-black text-lg sm:text-xl tracking-[0.3em] text-[#1C1A17] uppercase">
            ALVIERO
          </span>
        </div>
      </div>

      {/* 2. Full Image Banner Container with Architectural Typography */}
      <div className="w-full h-84 sm:h-96 relative overflow-hidden bg-[#1C1A17] flex items-center justify-center text-center px-4">
        
        {/* Slide Photo with Subtle Zoom Animation */}
        <img
          key={activeSlide.id}
          src={activeSlide.image}
          alt={activeSlide.title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 animate-in fade-in"
        />

        {/* Dark Vignette Overlay for High Contrast */}
        <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black/80 via-black/40 to-black/40 pointer-events-none" />

        {/* Centered Hero Content (Tegas, Elegan & Modern) */}
        <div className="relative z-20 max-w-sm sm:max-w-md mx-auto flex flex-col items-center animate-in zoom-in-95 duration-300">
          <h2 className="font-serif font-black text-xl sm:text-2xl md:text-3xl text-white leading-tight drop-shadow-lg tracking-wide uppercase">
            Modern Studio Photos
          </h2>
          
          <p className="font-serif font-semibold text-xs sm:text-sm text-[#EAE2D5] mt-1.5 tracking-[0.15em] uppercase">
            For a Contemporary Lifestyle
          </p>

          <p className="font-sans text-[11px] sm:text-xs text-white/85 font-normal max-w-[280px] sm:max-w-xs mx-auto mt-2 leading-relaxed">
            Choose from tried-and-true studio packages designed to capture your best memories. All at your own convenience.
          </p>

          {/* Sharp Rectangular CTA Button */}
          <button
            type="button"
            onClick={onViewPlans}
            className="mt-4 px-8 py-3 bg-white hover:bg-[#1C1A17] text-[#1C1A17] hover:text-white font-serif font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer border border-white shadow-lg active:scale-95"
          >
            View Studio Packages
          </button>
        </div>

        {/* Manual Arrow Controls (Sudut Tegas) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center border border-white/20 cursor-pointer transition-all z-20 active:scale-90"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2]" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center border border-white/20 cursor-pointer transition-all z-20 active:scale-90"
        >
          <ChevronRight className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Minimalist Bar Pagination */}
        <div className="absolute bottom-3.5 flex items-center gap-1.5 z-20 bg-black/50 backdrop-blur-xs px-2.5 py-1 border border-white/15">
          {BACKDROP_BANNER_IMAGES.map((slide, idx) => {
            const isActive = currentIdx === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all cursor-pointer ${
                  isActive
                    ? 'w-5 h-0.5 bg-[#D4AF37]'
                    : 'w-1.5 h-0.5 bg-white/40 hover:bg-white'
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
 * Data Ulasan & Testimonial Klien Alviero Studio
 */
export interface ClientReview {
  id: string;
  name: string;
  avatar: string;
  package: string;
  stars: number;
  text: string;
}

export const CLIENT_REVIEWS: ClientReview[] = [
  {
    id: '1',
    name: 'Eka Yunita & Pasangan',
    avatar: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80',
    package: 'Paket Wedding & Akad',
    stars: 5,
    text: 'Hasil-hasil fotonya buat susah move on bangeeet.. semuanyanya bagus dan keren bngeet. Melebihi ekspektasi banget. Luar biasa deh!! Pelayanannya jga bagus banget. Kakak2nya ramah semuanyanya. Makasih ya Alviero Studio.. TERBAIK! RECOMENDED BANGET!!!!',
  },
  {
    id: '2',
    name: 'Hawalia Ismi',
    avatar: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80',
    package: 'Paket Prewedding & Studio',
    stars: 5,
    text: 'Terimakasih Alviero Studio! Sudah jadi bagian dalam hari bahagia kami . Sukak sekali sama hasil foto dan videonya kereeen Mass" nyaa juga baikbaik lucu juga aktif kalo foto dikasih tau posenya hahaha . Sukses terus Alviero Studio',
  },
  {
    id: '3',
    name: 'Nadia Paramitha, S.Ked',
    avatar: '/images/categories/graduation.jpg',
    package: 'Paket Graduation Scholar',
    stars: 5,
    text: 'Studio wisuda ternyaman! Toga lengkap, lighting juara bikin wajah cerah natural, cetakan foto jernih banget dan bingkainya mewah. Recommended banget buat foto wisuda bareng keluarga!',
  },
  {
    id: '4',
    name: 'Dinda & Rama',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    package: 'Paket Self Studio Mandiri',
    stars: 5,
    text: 'Self studio ternyaman dan paling seru! Remotenya responsif tanpa delay, backgroundnya aesthetic, dan hasil cetak foto instan stripnya high quality. Pasti bakal balik lagi ke Alviero!',
  },
];

/**
 * Komponen Carousel Testimonial Klien (Desain Tegas, Bersih & Dewasa)
 */
export const ClientReviewCarousel: React.FC = () => {
  const [currentReviewIdx, setCurrentReviewIdx] = useState<number>(0);
  const totalPages = Math.ceil(CLIENT_REVIEWS.length / 2);

  const handleNext = () => {
    setCurrentReviewIdx((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentReviewIdx((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleReviews = CLIENT_REVIEWS.slice(currentReviewIdx * 2, currentReviewIdx * 2 + 2);

  return (
    <div className="pt-4 pb-1 border-t border-[#E0D9CE] space-y-3.5 relative">
      <div className="text-center space-y-0.5">
        <h3 className="font-serif text-xs sm:text-sm font-bold tracking-[0.2em] text-[#1C1A17] uppercase">
          WHAT OUR CLIENTS SAY
        </h3>
        <p className="text-[11px] font-sans text-[#736B63]">
          Ulasan jujur & kepuasan dari klien Alviero Studio
        </p>
      </div>

      {/* Container Slider dengan Tombol Panah Kiri & Kanan */}
      <div className="relative px-1 sm:px-2">
        {/* Tombol Panah Kiri (<) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Reviews"
          className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white text-[#1C1A17] hover:bg-[#1C1A17] hover:text-white shadow-sm border border-[#D5CEC2] flex items-center justify-center cursor-pointer z-10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Tombol Panah Kanan (>) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Reviews"
          className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white text-[#1C1A17] hover:bg-[#1C1A17] hover:text-white shadow-sm border border-[#D5CEC2] flex items-center justify-center cursor-pointer z-10 transition-colors"
        >
          <ChevronRight className="w-4 h-4 stroke-[2]" />
        </button>

        {/* 2 Review Cards (Sudut Tegas & Bersih) */}
        <div className="space-y-3 px-3 sm:px-4">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="relative bg-white p-4 sm:p-4.5 border border-[#E0D9CE] shadow-2xs pl-16 sm:pl-20 animate-in fade-in duration-300"
            >
              {/* Foto Avatar Melingkar Rapi */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 bg-stone-900 border-2 border-white shadow-sm overflow-hidden shrink-0">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Watermark Tanda Kutip (Quote) */}
              <div className="absolute top-2 left-15 sm:left-18 text-3xl font-serif text-[#D8CFBF] select-none leading-none opacity-40">
                “
              </div>

              {/* Konten Review */}
              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#1C1A17] uppercase tracking-wider leading-tight">
                    {review.name}
                  </h4>
                </div>

                {/* Bintang Rating (5 Stars) */}
                <div className="flex items-center gap-0.5 text-amber-500 text-xs leading-none">
                  {'★★★★★'}
                </div>

                <div className="h-px bg-[#EFEAE2] my-1" />

                {/* Teks Testimonial */}
                <p className="text-[10px] sm:text-[11px] font-sans text-[#5C5650] leading-relaxed line-clamp-4">
                  {review.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bar Indikator Pagination */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentReviewIdx(idx)}
              aria-label={`Review page ${idx + 1}`}
              className={`transition-all cursor-pointer ${
                currentReviewIdx === idx
                  ? 'w-5 h-0.5 bg-[#1C1A17]'
                  : 'w-2 h-0.5 bg-stone-300 hover:bg-stone-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Komponen Tampilan Utama Pilih Cabang & Layanan Khusus (Tegas, Modern, Sharp & Editorial)
 */
export const BranchSelectorLanding: React.FC<BranchSelectorViewProps> = ({
  selectedBranch,
  onSelectBranch,
  onSelectCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const selectedBranchData = STUDIO_BRANCHES.find((b) => b.id === selectedBranch) || STUDIO_BRANCHES[0];

  return (
    <div className="max-w-md w-full mx-auto my-2 sm:my-6 px-2 sm:px-3 animate-in fade-in duration-300">
      <div className="bg-[#FAF8F5] border border-[#D5CEC2] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col relative">
        
        {/* Top Hero Banner Slider (Tegas & Luxury) */}
        <BackdropHeroSlider onViewPlans={() => onSelectBranch(selectedBranch)} />

        {/* Content Area */}
        <div className="p-4 sm:p-5 space-y-4 bg-[#FAF8F5] flex-1">
          
          {/* Section 1: Pilihan Studio Aktif (Tegas & Clean) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-0.5">
              <span className="font-serif text-[11px] font-bold tracking-[0.2em] text-[#1C1A17] uppercase">
                LOKASI STUDIO AKTIF
              </span>
              <span className="text-[9.5px] font-sans font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                08:00 - 21:00 WIB
              </span>
            </div>

            {/* Studio Selection Card (Sudut Tegas) */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full p-3.5 sm:p-4 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] hover:border-[#1C1A17] transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 stroke-[1.8] text-[#1C1A17]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-bold text-sm sm:text-base text-[#1C1A17] leading-tight block truncate">
                      {selectedBranchData.name}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#F2ECE4] text-[#4A433A] border border-[#E0D6C8] shrink-0">
                      {selectedBranchData.badge}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-[#736B63] truncate mt-0.5">
                    {selectedBranchData.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-sans font-bold uppercase tracking-wider text-white bg-[#1C1A17] hover:bg-[#2D2A26] px-3.5 py-2 transition-colors shrink-0">
                <span>Ganti</span>
                <span className="text-xs">▾</span>
              </div>
            </button>
          </div>

          {/* Section 2: Layanan Khusus Wedding & Cetak Foto (Tegas & Elegan) */}
          <div className="pt-2 space-y-2">
            <div className="text-left px-0.5">
              <h3 className="font-serif text-[11px] font-bold tracking-[0.2em] text-[#1C1A17] uppercase">
                LAYANAN WEDDING & CETAK FOTO:
              </h3>
            </div>

            <div className="space-y-2.5">
              {/* Pricelist Wedding Card (Sharp Architectural Layout) */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('wedding-package') : onSelectBranch(selectedBranch)}
                className="p-3.5 sm:p-4 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] hover:border-[#1C1A17] transition-all duration-200 cursor-pointer group text-left relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-[#FAF8F5] border border-[#E0D9CE] text-[#8C6D46] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4.5 h-4.5 stroke-[1.8] text-[#8C6D46]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1A17] tracking-wider uppercase truncate">
                          PRICELIST WEDDING
                        </h4>
                        <span className="text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 bg-[#F2ECE4] text-[#4A433A] border border-[#E0D6C8]">
                          Exclusive
                        </span>
                      </div>
                      <p className="text-xs font-sans text-[#736B63] font-normal truncate mt-0.5">
                        Prewedding, Akad, Resepsi & Engagement
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#1C1A17] flex items-center gap-1 transition-colors shrink-0 group-hover:text-[#8C6D46]">
                    <span>Lihat Pricelist</span>
                    <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>

              {/* Pricelist Cetak Card (Sharp Architectural Layout) */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('bingkai-album') : onSelectBranch(selectedBranch)}
                className="p-3.5 sm:p-4 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] hover:border-[#1C1A17] transition-all duration-200 cursor-pointer group text-left relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-[#FAF8F5] border border-[#E0D9CE] text-[#8C6D46] flex items-center justify-center shrink-0">
                      <ImageIcon className="w-4.5 h-4.5 stroke-[1.8] text-[#8C6D46]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1A17] tracking-wider uppercase truncate">
                          PRICELIST CETAK
                        </h4>
                        <span className="text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 bg-[#F2ECE4] text-[#4A433A] border border-[#E0D6C8]">
                          Cetak Lab
                        </span>
                      </div>
                      <p className="text-xs font-sans text-[#736B63] font-normal truncate mt-0.5">
                        Cetak Lab, Bingkai Minimalis & Album
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#1C1A17] flex items-center gap-1 transition-colors shrink-0 group-hover:text-[#8C6D46]">
                    <span>Lihat Pricelist</span>
                    <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Why Choose Alviero Studio? (Grid Minimalist Stroke Icons) */}
          <div className="pt-3 pb-1 border-t border-[#E0D9CE] space-y-3.5">
            <div className="text-center space-y-0.5">
              <h3 className="font-serif text-xs sm:text-sm font-bold tracking-[0.2em] text-[#1C1A17] uppercase">
                WHY CHOOSE ALVIERO STUDIO?
              </h3>
              <p className="text-[11px] font-sans text-[#736B63]">
                Kenyamanan, kualitas visual premium & pelayanan terpercaya
              </p>
            </div>

            {/* 2x2 Grid Fitur Minimalis Dewasa */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-center">
              {/* Item 1: Fast and convenient */}
              <div className="p-3.5 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] flex flex-col items-center transition-all duration-200">
                <div className="w-10 h-10 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 stroke-[1.6]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#1C1A17] uppercase tracking-wider leading-tight">
                  Fast & Convenient
                </h4>
                <p className="text-[10px] sm:text-[10.5px] font-sans text-[#736B63] leading-relaxed mt-1">
                  Booking instan tanpa antre. Dapatkan jadwal pasti & all-file HD via Google Drive.
                </p>
              </div>

              {/* Item 2: Style and function */}
              <div className="p-3.5 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] flex flex-col items-center transition-all duration-200">
                <div className="w-10 h-10 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center mb-2">
                  <Sliders className="w-5 h-5 stroke-[1.6]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#1C1A17] uppercase tracking-wider leading-tight">
                  Style & Function
                </h4>
                <p className="text-[10px] sm:text-[10.5px] font-sans text-[#736B63] leading-relaxed mt-1">
                  7+ tema backdrop modern, lighting Godox studio, & arahan pose yang natural.
                </p>
              </div>

              {/* Item 3: Reflect your lifestyle */}
              <div className="p-3.5 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] flex flex-col items-center transition-all duration-200">
                <div className="w-10 h-10 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center mb-2">
                  <Layers className="w-5 h-5 stroke-[1.6]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#1C1A17] uppercase tracking-wider leading-tight">
                  Reflect Lifestyle
                </h4>
                <p className="text-[10px] sm:text-[10.5px] font-sans text-[#736B63] leading-relaxed mt-1">
                  Paket lengkap: Wisuda, Wedding, Self Studio, Family, hingga Cetak Lab & Frame.
                </p>
              </div>

              {/* Item 4: Continuous support */}
              <div className="p-3.5 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] flex flex-col items-center transition-all duration-200">
                <div className="w-10 h-10 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center mb-2">
                  <HeartHandshake className="w-5 h-5 stroke-[1.6]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#1C1A17] uppercase tracking-wider leading-tight">
                  Continuous Support
                </h4>
                <p className="text-[10px] sm:text-[10.5px] font-sans text-[#736B63] leading-relaxed mt-1">
                  Konsultasi konsep, outfit, & fitting kebaya/gaun gratis dengan admin responsif.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Client Reviews & Testimonials Carousel */}
          <ClientReviewCarousel />

          {/* Section 5: Trust Badges Bar (Tegas & Minimalis) */}
          <div className="pt-3 border-t border-[#E0D9CE] grid grid-cols-3 gap-2 text-center text-[10px] text-[#5C5650]">
            <div className="flex flex-col items-center">
              <span className="font-bold text-[#1C1A17] flex items-center gap-1 uppercase tracking-wider">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                5.0 STARS
              </span>
              <span className="text-[9px] text-[#736B63] mt-0.5">20K+ Klien Puas</span>
            </div>
            <div className="flex flex-col items-center border-x border-[#E0D9CE]">
              <span className="font-bold text-[#1C1A17] flex items-center gap-1 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                PRO GEAR
              </span>
              <span className="text-[9px] text-[#736B63] mt-0.5">Lighting & Kamera HD</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-[#1C1A17] flex items-center gap-1 uppercase tracking-wider">
                <Clock className="w-3 h-3 text-[#8C6D46]" />
                INSTAN
              </span>
              <span className="text-[9px] text-[#736B63] mt-0.5">Booking Tanpa Antre</span>
            </div>
          </div>

        </div>

        {/* Footer info note */}
        <div className="p-3.5 bg-[#F4EFEA] border-t border-[#E0D9CE] text-center text-[11px] text-[#5C5650] font-normal">
          💡 Anda dapat berganti studio kapan saja melalui tombol <strong>'Ganti'</strong>.
        </div>
      </div>

      {/* Pop-up Modal Pilihan Studio 1 & Studio 2 (Desain Tegas & Modern) */}
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-[#FAF8F5] max-w-xl w-full border border-[#D5CEC2] shadow-2xl overflow-hidden flex flex-col my-auto relative">
        
        {/* Minimalist Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0D9CE] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF8F5] text-[#1C1A17] flex items-center justify-center border border-[#E0D9CE]">
              <MapPin className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold tracking-[0.2em] text-[#1C1A17] uppercase leading-none">
                PILIH LOKASI STUDIO
              </h3>
              <p className="text-[11px] font-sans text-[#736B63] mt-1">
                Tentukan cabang studio foto yang ingin Anda kunjungi
              </p>
            </div>
          </div>

          {canDismiss && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 bg-stone-100 hover:bg-[#1C1A17] text-stone-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#E0D9CE]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Branch Cards (Sharp & Luxury Layout) */}
        <div className="p-4 sm:p-5 space-y-3 bg-[#FAF8F5] flex-1">
          {STUDIO_BRANCHES.map((branch) => {
            const isSelected = selectedBranch === branch.id;

            return (
              <div
                key={branch.id}
                onClick={() => handleChoose(branch.id)}
                className={`p-4 sm:p-4.5 border transition-all duration-200 cursor-pointer relative group text-left ${
                  isSelected
                    ? 'bg-white border-[#1C1A17] ring-1 ring-[#1C1A17] shadow-md'
                    : 'bg-[#FCFBF9] hover:bg-white border-[#E0D9CE] hover:border-[#1C1A17]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Clean Left Icon Container */}
                    <div className={`w-10 h-10 flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected ? 'bg-[#1C1A17] text-white border-[#1C1A17]' : 'bg-[#FAF8F5] text-[#1C1A17] border-[#E0D9CE]'
                    }`}>
                      <MapPin className="w-5 h-5 stroke-[1.8]" />
                    </div>

                    {/* Main Studio Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1A17] uppercase tracking-wide">
                          {branch.name}
                        </h4>
                        <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 border ${
                          isSelected ? 'bg-[#1C1A17] text-white border-[#1C1A17]' : 'bg-[#FAF8F5] text-stone-700 border-[#E0D9CE]'
                        }`}>
                          {branch.badge}
                        </span>
                      </div>

                      <p className="text-xs font-sans text-[#736B63] font-normal leading-relaxed mt-1">
                        {branch.address}
                      </p>

                      {/* Fasilitas Cabang */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] bg-[#FAF8F5] text-stone-700 px-2 py-0.5 border border-[#E0D9CE] font-medium">
                          ✓ Pro Godox Lighting
                        </span>
                        <span className="text-[10px] bg-[#FAF8F5] text-stone-700 px-2 py-0.5 border border-[#E0D9CE] font-medium">
                          ✓ 7+ Backdrop
                        </span>
                        <span className="text-[10px] bg-[#FAF8F5] text-stone-700 px-2 py-0.5 border border-[#E0D9CE] font-medium">
                          ✓ Ruang AC
                        </span>
                      </div>

                      {/* Link Maps */}
                      <a
                        href={branch.mapsUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 mt-2 text-[11px] font-sans font-semibold text-[#8C6D46] hover:text-[#1C1A17] underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        <span>Buka Petunjuk Arah di Google Maps</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Radio Indicator */}
                  <div className="pt-1 shrink-0">
                    <div className={`w-5 h-5 border flex items-center justify-center transition-all ${
                      isSelected ? 'border-[#1C1A17] bg-[#1C1A17]' : 'border-stone-400 bg-transparent'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-[#F4EFEA] border-t border-[#E0D9CE] text-center text-[11px] text-[#736B63] font-medium">
          💡 Pilih salah satu studio untuk melihat pricelist dan katalog lengkap.
        </div>
      </div>
    </div>
  );
};
