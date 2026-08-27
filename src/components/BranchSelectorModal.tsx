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
 * Komponen Carousel Testimonial Klien (Sesuai Referensi Gambar Artmospoto)
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
    <div className="pt-3 pb-1 border-t border-[#E8E1D5] space-y-3 relative">
      <div className="text-center space-y-0.5">
        <h3 className="font-serif text-base sm:text-lg font-black tracking-tight text-[#1C1A17]">
          What Our Clients Say
        </h3>
        <p className="text-[11px] font-sans text-stone-500">
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
          className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white text-[#8C6D46] hover:text-[#5C4526] shadow-md border border-[#E8DFD1] flex items-center justify-center cursor-pointer z-10 transition-transform active:scale-90"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Tombol Panah Kanan (>) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Reviews"
          className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white text-[#8C6D46] hover:text-[#5C4526] shadow-md border border-[#E8DFD1] flex items-center justify-center cursor-pointer z-10 transition-transform active:scale-90"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* 2 Review Cards Sesuai Desain Mockup */}
        <div className="space-y-3 px-3 sm:px-4">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="relative bg-white rounded-3xl p-3.5 sm:p-4 border border-[#E8E1D5] shadow-[0_8px_24px_rgba(0,0,0,0.04)] pl-16 sm:pl-20 animate-in fade-in duration-300"
            >
              {/* Foto Avatar Melingkar Menempel di Kiri */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900 border-2 border-white shadow-md overflow-hidden shrink-0">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Watermark Tanda Kutip (Quote) */}
              <div className="absolute top-1.5 left-14 sm:left-16 text-3xl font-serif text-[#D8CFBF] select-none leading-none opacity-50">
                “
              </div>

              {/* Konten Review */}
              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#1C1A17] leading-tight">
                    {review.name}
                  </h4>
                </div>

                {/* Bintang Rating (5 Stars) */}
                <div className="flex items-center gap-0.5 text-amber-400 text-xs leading-none">
                  {'★★★★★'}
                </div>

                <div className="h-px bg-stone-100 my-1" />

                {/* Teks Testimonial */}
                <p className="text-[10px] sm:text-[10.5px] font-sans text-stone-600 leading-relaxed line-clamp-4">
                  {review.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indikator Pagination */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentReviewIdx(idx)}
              aria-label={`Review page ${idx + 1}`}
              className={`rounded-full transition-all cursor-pointer ${
                currentReviewIdx === idx
                  ? 'w-4 h-1.5 bg-amber-500 shadow-2xs'
                  : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400'
              }`}
            />
          ))}
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
          
          {/* Section 1: Pilihan Studio Aktif (Luxury Bar) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-0.5">
              <span className="font-serif text-[11px] font-bold tracking-[0.18em] text-[#1C1A17] uppercase">
                LOKASI STUDIO AKTIF
              </span>
              <span className="text-[10px] font-sans font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Buka 08:00 - 21:00 WIB
              </span>
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
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-sm sm:text-base text-[#1C1A17] leading-tight block truncate">
                      {selectedBranchData.name}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#F2ECE4] text-[#5C5247] border border-[#E3DBD0] shrink-0">
                      {selectedBranchData.badge}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-stone-500 truncate mt-0.5">
                    {selectedBranchData.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-sans font-semibold text-white bg-[#1C1A17] hover:bg-[#2D2A26] px-3.5 py-2 rounded-xl shadow-2xs transition-all shrink-0">
                <span>Ganti Studio</span>
                <span className="text-xs transition-transform group-hover:translate-y-0.5">▾</span>
              </div>
            </button>
          </div>

          {/* Section 2: Layanan Khusus Wedding & Cetak Foto */}
          <div className="pt-1 space-y-2">
            <div className="text-left px-0.5">
              <h3 className="font-serif text-[11px] font-bold tracking-[0.18em] text-[#1C1A17] uppercase">
                LAYANAN WEDDING & CETAK FOTO:
              </h3>
            </div>

            <div className="space-y-2.5">
              {/* Pricelist Wedding Card (Clean Warm Minimalist) */}
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

              {/* Pricelist Cetak Card (Clean Warm Minimalist) */}
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

          {/* Section 3: Why Choose Alviero Studio? (Sesuai Referensi Gambar) */}
          <div className="pt-3 pb-1 border-t border-[#E8E1D5] space-y-3.5">
            <div className="text-center space-y-0.5">
              <h3 className="font-serif text-base sm:text-lg font-black tracking-tight text-[#1C1A17]">
                Why Choose Alviero Studio?
              </h3>
              <p className="text-[11px] font-sans text-stone-500">
                Kenyamanan, kualitas visual premium & pelayanan terpercaya
              </p>
            </div>

            {/* 2x2 Grid Fitur Unggulan */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 text-center">
              {/* Item 1: Fast and convenient */}
              <div className="p-3 rounded-2xl bg-white hover:bg-[#FCFBF9] border border-[#E8E1D5] flex flex-col items-center shadow-2xs hover:shadow-xs transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF5EE] border border-[#E8DFD1] flex items-center justify-center text-2xl shadow-2xs mb-2 transition-transform hover:scale-105">
                  🛋️
                </div>
                <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#1C1A17] leading-tight">
                  Fast and convenient
                </h4>
                <p className="text-[10px] sm:text-[10.5px] font-sans text-[#6B635B] leading-relaxed mt-1">
                  Booking instan tanpa antre. Dapatkan jadwal pasti & all-file HD via Google Drive.
                </p>
              </div>

              {/* Item 2: Style and function */}
              <div className="p-3 rounded-2xl bg-white hover:bg-[#FCFBF9] border border-[#E8E1D5] flex flex-col items-center shadow-2xs hover:shadow-xs transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF1F6] border border-[#D0DEE9] flex items-center justify-center text-2xl shadow-2xs mb-2 transition-transform hover:scale-105">
                  🎨
                </div>
                <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#1C1A17] leading-tight">
                  Style and function
                </h4>
                <p className="text-[10px] sm:text-[10.5px] font-sans text-[#6B635B] leading-relaxed mt-1">
                  7+ tema backdrop modern, lighting Godox studio, & arahan pose yang natural.
                </p>
              </div>

              {/* Item 3: Reflect your lifestyle */}
              <div className="p-3 rounded-2xl bg-white hover:bg-[#FCFBF9] border border-[#E8E1D5] flex flex-col items-center shadow-2xs hover:shadow-xs transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF5EE] border border-[#E8DFD1] flex items-center justify-center text-2xl shadow-2xs mb-2 transition-transform hover:scale-105">
                  ✨
                </div>
                <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#1C1A17] leading-tight">
                  Reflect your lifestyle
                </h4>
                <p className="text-[10px] sm:text-[10.5px] font-sans text-[#6B635B] leading-relaxed mt-1">
                  Paket lengkap: Wisuda, Wedding, Self Studio, Family, hingga Cetak Lab & Frame.
                </p>
              </div>

              {/* Item 4: Continuous support */}
              <div className="p-3 rounded-2xl bg-white hover:bg-[#FCFBF9] border border-[#E8E1D5] flex flex-col items-center shadow-2xs hover:shadow-xs transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl bg-[#F7EFEF] border border-[#E8D6D5] flex items-center justify-center text-2xl shadow-2xs mb-2 transition-transform hover:scale-105">
                  💬
                </div>
                <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#1C1A17] leading-tight">
                  Continuous support
                </h4>
                <p className="text-[10px] sm:text-[10.5px] font-sans text-[#6B635B] leading-relaxed mt-1">
                  Konsultasi konsep, outfit, & fitting kebaya/gaun gratis dengan admin responsif.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Client Reviews & Testimonials Carousel (Sesuai Referensi Gambar Artmospoto) */}
          <ClientReviewCarousel />

          {/* Section 5: Trust Badges Bar */}
          <div className="pt-2 border-t border-[#E8E1D5] grid grid-cols-3 gap-2 text-center text-[10px] text-[#5C5650]">
            <div className="flex flex-col items-center">
              <span className="font-bold text-[#1C1A17] flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                5.0 Stars
              </span>
              <span className="text-[9px] text-stone-500">20K+ Klien Puas</span>
            </div>
            <div className="flex flex-col items-center border-x border-[#E8E1D5]">
              <span className="font-bold text-[#1C1A17] flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Kamera & Lighting HD
              </span>
              <span className="text-[9px] text-stone-500">Pro Studio Gear</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-[#1C1A17] flex items-center gap-0.5">
                <Clock className="w-3 h-3 text-[#8C6D46]" />
                Instan Booking
              </span>
              <span className="text-[9px] text-stone-500">Tanpa Antre Lama</span>
            </div>
          </div>

        </div>

        {/* Footer info note */}
        <div className="p-3 bg-[#F5EFEB] border-t border-[#E8E1D5] text-center text-[11px] text-[#5C5650] font-medium">
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
