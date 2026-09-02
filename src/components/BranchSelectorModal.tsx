import React, { useState, useEffect, useRef } from 'react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';
import { 
  Check, 
  X, 
  ArrowRight, 
  ArrowUpRight,
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
  Camera,
  MessageCircle,
  RefreshCw
} from 'lucide-react';

interface BranchSelectorViewProps {
  selectedBranch: StudioBranch;
  onSelectBranch: (branch: StudioBranch) => void;
  onSelectCategory?: (category: string) => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

/**
 * Daftar Foto Background Studio untuk Hero Banner Slider
 */
export const BACKGROUND_BANNER_IMAGES = [
  { id: '1', image: '/images/backdrops/backdrop-1.jpg', title: 'Mint Modern Aesthetic Sofa', theme: 'Fresh & Elegant' },
  { id: '2', image: '/images/backdrops/backdrop-2.jpg', title: 'Bohemian Rustic Texture Wall', theme: 'Warm Natural' },
  { id: '3', image: '/images/backdrops/backdrop-3.jpg', title: 'Black Arch Window Bar Stool', theme: 'Bold & Chic' },
  { id: '4', image: '/images/backdrops/backdrop-4.jpg', title: 'Charcoal Classic Deep Sofa', theme: 'Timeless Luxury' },
  { id: '5', image: '/images/backdrops/backdrop-5.jpg', title: 'Luxury White Fireplace & Frame', theme: 'European Royal' },
  { id: '6', image: '/images/backdrops/backdrop-6.jpg', title: 'Warm Beige Classic Armchair', theme: 'Cozy Editorial' },
  { id: '7', image: '/images/backdrops/backdrop-7.jpg', title: 'White Arch Windows & Grey Sofa', theme: 'Minimalist Bright' },
];

export const BACKDROP_BANNER_IMAGES = BACKGROUND_BANNER_IMAGES;

interface BackgroundHeroSliderProps {
  onViewPlans?: () => void;
}

export type BackdropHeroSliderProps = BackgroundHeroSliderProps;

/**
 * Hero Slider Banner Background Studio (Desain Tegas, Modern, Responsif Mobile & Desktop)
 */
export const BackgroundHeroSlider: React.FC<BackgroundHeroSliderProps> = ({ onViewPlans }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-scroll bergulir otomatis setiap 4.2 detik
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BACKGROUND_BANNER_IMAGES.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % BACKGROUND_BANNER_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + BACKGROUND_BANNER_IMAGES.length) % BACKGROUND_BANNER_IMAGES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentItem = BACKGROUND_BANNER_IMAGES[currentIdx] || BACKGROUND_BANNER_IMAGES[0];

  return (
    <div
      className="relative w-full overflow-hidden select-none bg-[#FDFBF7] group flex flex-col border-b border-[#E8DDD6]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Top Minimalist Navbar (Tegas & Mewah - Hanya Tampil di Mobile) */}
      <div className="w-full bg-[#FDFBF7] px-4 py-3 sm:px-8 flex lg:hidden items-center justify-center border-b border-[#E8DDD6] z-30">
        <div className="flex items-center gap-2">
          <span className="font-serif font-black text-base sm:text-xl tracking-[0.3em] text-[#3A3A3A] uppercase">
            ALVIERO
          </span>
        </div>
      </div>

      {/* 2. Full Image Banner Container */}
      <div className="w-full h-72 sm:h-84 md:h-[440px] lg:h-[500px] relative overflow-hidden bg-[#2A2A2A]">
        {/* Slide Photo with Smooth Transition */}
        <img
          key={currentItem.id}
          src={currentItem.image}
          alt={currentItem.title}
          className="w-full h-full object-cover object-center transition-all duration-700 animate-in fade-in"
        />

        {/* Subtle Bottom Gradient for Caption & Controls Only */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Bottom Left Background Theme Label */}
        <div className="absolute bottom-3.5 left-3.5 sm:left-6 z-20 text-left pointer-events-none">
          <span className="inline-block text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-[#A9BCA7] uppercase bg-black/70 px-2.5 py-1 border border-[#A9BCA7]/50 backdrop-blur-xs">
            {currentItem.theme}
          </span>
          <p className="text-xs sm:text-sm font-serif text-white font-bold drop-shadow-md mt-1">
            {currentItem.title}
          </p>
        </div>

        {/* Manual Arrow Controls */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/85 text-white backdrop-blur-xs flex items-center justify-center border border-white/20 cursor-pointer transition-all z-20 active:scale-90"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/85 text-white backdrop-blur-xs flex items-center justify-center border border-white/20 cursor-pointer transition-all z-20 active:scale-90"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
        </button>

        {/* Minimalist Bar Pagination */}
        <div className="absolute bottom-3.5 right-3.5 sm:right-6 flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-xs px-3 py-1.5 border border-white/15">
          {BACKGROUND_BANNER_IMAGES.map((slide, idx) => {
            const isActive = currentIdx === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all cursor-pointer ${
                  isActive
                    ? 'w-6 h-0.5 bg-[#A9BCA7]'
                    : 'w-2 h-0.5 bg-white/40 hover:bg-white'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 3. Hero Content Container */}
      <div className="w-full bg-[#FDFBF7] px-4 py-6 sm:py-8 md:py-10 text-center flex flex-col items-center justify-center space-y-2.5 sm:space-y-3.5 border-t border-[#E8DDD6]">
        <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#6E856C] uppercase bg-[#F2E9E4] px-3 py-1 border border-[#E8DDD6]">
          ALVIERO PHOTO STUDIO
        </span>

        <h2 className="font-serif font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#3A3A3A] leading-tight tracking-wide uppercase max-w-2xl">
          Studio Foto Modern dengan Fasilitas Mewah & Terlengkap
        </h2>
        
        <p className="font-serif font-semibold text-xs sm:text-sm md:text-base text-[#6E856C] tracking-[0.18em] uppercase">
          Kenyamanan Maksimal • Kualitas Visual Premium
        </p>

        <p className="font-sans text-xs sm:text-sm md:text-base text-[#5A5A5A] max-w-2xl mx-auto leading-relaxed">
          Alviero Studio menghadirkan pengalaman fotografi profesional dengan ruang ber-AC sejuk, 7+ pilihan tema background estetis, tata lampu Godox Studio Pro, monitor live-view realtime untuk melihat hasil jepretan seketika, serta private dressing room & koleksi toga wisuda siap pakai.
        </p>
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
 * Komponen Carousel Testimonial Klien (Desain Tegas, Bersih & Responsif Desktop)
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
    <div className="pt-5 pb-1 border-t border-[#E8DDD6] space-y-3 relative">
      <div className="text-center space-y-0.5">
        <h3 className="font-serif text-xs sm:text-sm font-bold tracking-[0.2em] text-[#3A3A3A] uppercase">
          WHAT OUR CLIENTS SAY
        </h3>
        <p className="text-[11px] font-sans text-[#666666]">
          Ulasan jujur & kepuasan dari klien Alviero Studio
        </p>
      </div>

      {/* Container Slider dengan Tombol Panah Kiri & Kanan */}
      <div className="relative px-1 sm:px-2 md:px-6">
        {/* Tombol Panah Kiri (<) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Reviews"
          className="absolute -left-1 sm:left-0 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white text-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-white shadow-sm border border-[#E8DDD6] flex items-center justify-center cursor-pointer z-10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Tombol Panah Kanan (>) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Reviews"
          className="absolute -right-1 sm:right-0 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white text-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-white shadow-sm border border-[#E8DDD6] flex items-center justify-center cursor-pointer z-10 transition-colors"
        >
          <ChevronRight className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Review Cards (Grid 2 Kolom di Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 px-2 sm:px-4">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="relative bg-white p-3.5 sm:p-4.5 border border-[#E8DDD6] shadow-2xs pl-16 sm:pl-20 animate-in fade-in duration-300 flex flex-col justify-between"
            >
              {/* Foto Avatar */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-13 h-13 sm:w-15 sm:h-15 bg-stone-900 border-2 border-white shadow-sm overflow-hidden shrink-0">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Watermark Tanda Kutip (Quote) */}
              <div className="absolute top-1.5 left-14 sm:left-17 text-2xl sm:text-3xl font-serif text-[#DFCFC5] select-none leading-none opacity-40">
                “
              </div>

              {/* Konten Review */}
              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] uppercase tracking-wider leading-tight">
                    {review.name}
                  </h4>
                </div>

                {/* Bintang Rating (5 Stars) */}
                <div className="flex items-center gap-0.5 text-amber-500 text-xs leading-none">
                  {'★★★★★'}
                </div>

                <div className="h-px bg-[#F2E9E4] my-1" />

                {/* Teks Testimonial */}
                <p className="text-[10.5px] sm:text-[11px] font-sans text-[#5A5A5A] leading-relaxed line-clamp-4">
                  {review.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bar Indikator Pagination */}
        <div className="flex items-center justify-center gap-1.5 pt-2.5">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentReviewIdx(idx)}
              aria-label={`Review page ${idx + 1}`}
              className={`transition-all cursor-pointer ${
                currentReviewIdx === idx
                  ? 'w-5 h-0.5 bg-[#3A3A3A]'
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
 * Data Galeri Background & Hasil Foto Studio Alviero
 */
export interface StudioRoomData {
  id: string;
  name: string;
  badge: string;
  branchId: StudioBranch;
  images: {
    src: string;
    caption: string;
    tag: string;
  }[];
}

export const STUDIO_ROOMS_DATA: StudioRoomData[] = [
  {
    id: 'studio-1',
    name: 'STUDIO 1 — KARANGPLOSO',
    badge: 'STUDIO UTAMA & WISUDA',
    branchId: 'cabang-1',
    images: [
      {
        src: '/images/backdrops/backdrop-5.jpg',
        caption: 'European Royal Fireplace & Frame — Set Mewah Formal',
        tag: 'ROYAL FIREPLACE'
      },
      {
        src: '/images/backdrops/backdrop-1.jpg',
        caption: 'Mint Modern Aesthetic Sofa Theme — Wisuda & Keluarga',
        tag: 'MINT AESTHETIC'
      },
      {
        src: '/images/backdrops/backdrop-4.jpg',
        caption: 'Charcoal Deep Classic Sofa — Elegan & Timeless',
        tag: 'TIMELESS CLASSIC'
      },
      {
        src: '/images/backdrops/backdrop-6.jpg',
        caption: 'Warm Beige Classic Armchair — Cozy Editorial Tone',
        tag: 'COZY EDITORIAL'
      },
      {
        src: '/images/backdrops/backdrop-2.jpg',
        caption: 'Bohemian Rustic Texture Wall — Natural & Warm',
        tag: 'BOHEMIAN RUSTIC'
      },
      {
        src: '/images/backdrops/backdrop-3.jpg',
        caption: 'Black Arch Window Bar Stool Theme — Bold & Editorial',
        tag: 'ARCH WINDOW'
      },
      {
        src: '/images/backdrops/backdrop-7.jpg',
        caption: 'White Arch Windows & Grey Minimalist Set',
        tag: 'MINIMALIST BRIGHT'
      }
    ]
  },
  {
    id: 'studio-2',
    name: 'STUDIO 2 — DINOYO',
    badge: 'PREMIUM SUITE & WEDDING',
    branchId: 'cabang-2',
    images: [
      {
        src: '/images/backdrops/backdrop-5.jpg',
        caption: 'European Royal Fireplace & Frame — Set Mewah Formal',
        tag: 'ROYAL FIREPLACE'
      },
      {
        src: '/images/backdrops/backdrop-2.jpg',
        caption: 'Bohemian Rustic Texture Wall — Natural & Warm Aesthetic',
        tag: 'BOHEMIAN RUSTIC'
      },
      {
        src: '/images/backdrops/backdrop-3.jpg',
        caption: 'Black Arch Window Bar Stool Theme — Bold & Editorial',
        tag: 'ARCH WINDOW'
      },
      {
        src: '/images/backdrops/backdrop-7.jpg',
        caption: 'White Arch Windows & Grey Minimalist Set',
        tag: 'MINIMALIST BRIGHT'
      },
      {
        src: '/images/backdrops/backdrop-4.jpg',
        caption: 'Charcoal Deep Classic Sofa — Elegan & Timeless',
        tag: 'TIMELESS LUXURY'
      },
      {
        src: '/images/backdrops/backdrop-1.jpg',
        caption: 'Mint Modern Aesthetic Sofa Theme — Fresh & Elegant',
        tag: 'MINT AESTHETIC'
      },
      {
        src: '/images/backdrops/backdrop-6.jpg',
        caption: 'Warm Beige Classic Armchair — Cozy Tone',
        tag: 'COZY EDITORIAL'
      }
    ]
  },
  {
    id: 'self-studio',
    name: 'SELFSTUDIO',
    badge: 'PRIVATE WIRELESS BOOTH',
    branchId: 'cabang-1',
    images: [
      {
        src: '/images/backdrops/backdrop-6.jpg',
        caption: 'Private Self-Studio Room dengan Remote Nirkabel & Live Display',
        tag: 'WIRELESS BOOTH'
      },
      {
        src: '/images/backdrops/backdrop-1.jpg',
        caption: 'Aesthetic Props & Background Minimalis Tanpa Rasa Canggung',
        tag: 'PROPS COLLECTION'
      },
      {
        src: '/images/backdrops/backdrop-5.jpg',
        caption: 'European Royal Fireplace & Frame Set',
        tag: 'ROYAL FIREPLACE'
      },
      {
        src: '/images/backdrops/backdrop-2.jpg',
        caption: 'Warm Bohemian Texture Setup',
        tag: 'BOHEMIAN BOOTH'
      },
      {
        src: '/images/backdrops/backdrop-3.jpg',
        caption: 'Spotlight & Monochrome Aesthetic Set',
        tag: 'SPOTLIGHT SET'
      }
    ]
  }
];

/**
 * Komponen Galeri Tema Background & Hasil Foto Studio
 */
export const StudioTourAndEducationShowcase: React.FC<{
  onSelectCategory?: (category: string) => void;
  onSelectBranch: (branch: StudioBranch) => void;
  selectedBranch: StudioBranch;
}> = ({ onSelectCategory, onSelectBranch, selectedBranch }) => {
  const [activeRoomId, setActiveRoomId] = useState<string>('studio-1');
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);

  const activeRoom = STUDIO_ROOMS_DATA.find((r) => r.id === activeRoomId) || STUDIO_ROOMS_DATA[0];
  const activeSlide = activeRoom.images[currentSlideIdx] || activeRoom.images[0];

  const handleNextSlide = () => {
    setCurrentSlideIdx((prev) => (prev + 1) % activeRoom.images.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIdx((prev) => (prev - 1 + activeRoom.images.length) % activeRoom.images.length);
  };

  return (
    <div className="space-y-6 pt-6 pb-2 border-t border-[#E8DDD6]">
      {/* Editorial Luxury Studio Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono font-bold tracking-[0.25em] text-[#6E856C] uppercase bg-[#EBF2EA] px-3.5 py-1 border border-[#A9BCA7]">
          <Sparkles className="w-3.5 h-3.5 text-[#6E856C]" />
          STUDIO SPACES & BACKGROUNDS
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#3A3A3A] tracking-tight">
          Koleksi Background & Suasana Studio
        </h3>
        <p className="text-xs sm:text-sm font-sans text-stone-500 max-w-lg mx-auto leading-relaxed">
          Pilihan sudut tematik estetis, dekorasi mewah, dan tata cahaya Godox Pro di Alviero Studio.
        </p>
      </div>

      {/* Luxury Segmented Studio Switcher */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {STUDIO_ROOMS_DATA.map((room) => {
          const isActive = activeRoomId === room.id;
          const isSelfStudio = room.id === 'self-studio';
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => {
                if (isSelfStudio && onSelectCategory) {
                  onSelectBranch('cabang-1');
                  onSelectCategory('selfstudio');
                  return;
                }
                setActiveRoomId(room.id);
                setCurrentSlideIdx(0);
                onSelectBranch(room.branchId);
              }}
              className={`px-5 py-2.5 text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#3A3A3A] text-white shadow-md border border-[#3A3A3A]'
                  : 'bg-white text-[#3A3A3A] border border-[#E8DDD6] hover:border-[#3A3A3A] hover:bg-[#F2E9E4]/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#A9BCA7] animate-pulse' : 'bg-stone-300'}`} />
              <span>{isSelfStudio ? '✨ SelfStudio' : room.name.replace('STUDIO ', 'Studio ')}</span>
            </button>
          );
        })}
      </div>

      {/* Main Cinematic Visual Stage */}
      <div className="space-y-3 max-w-6xl mx-auto">
        <div className="relative w-full h-84 sm:h-96 md:h-[480px] lg:h-[540px] bg-[#222222] overflow-hidden border border-[#E8DDD6] group flex flex-col justify-between shadow-xl">
          <img
            key={`${activeRoom.id}-${currentSlideIdx}`}
            src={activeSlide.src}
            alt={activeSlide.caption}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-102"
          />
          
          {/* Subtle Ambient Shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

          {/* Top Floating Glassmorphism Tag */}
          <div className="relative top-4 left-4 z-10 pointer-events-none flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] font-mono font-bold tracking-widest text-[#2A2A2A] uppercase bg-[#FDFBF7]/95 px-3.5 py-1.5 border border-[#E8DDD6] backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E856C]" />
              {activeSlide.tag}
            </span>
          </div>

          {/* Bottom Luxury Caption Card */}
          <div className="relative z-10 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
            <div className="max-w-xl bg-black/65 backdrop-blur-md p-3 sm:p-4 border border-white/20">
              <span className="text-[10px] font-mono font-bold text-[#A9BCA7] uppercase tracking-widest block mb-0.5">
                {activeRoom.name} • {activeRoom.badge}
              </span>
              <p className="text-sm sm:text-base font-serif text-white font-bold leading-snug">
                {activeSlide.caption}
              </p>
            </div>

            {/* Slide Indicator Numbers */}
            <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 border border-white/20 text-white font-mono text-xs font-bold shrink-0 self-start sm:self-end">
              <span className="text-[#A9BCA7]">{currentSlideIdx + 1}</span> / {activeRoom.images.length}
            </div>
          </div>

          {/* Floating Navigation Controls */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous Photo"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-[#FDFBF7]/90 hover:bg-white text-[#2A2A2A] flex items-center justify-center border border-[#E8DDD6] z-20 cursor-pointer transition-all active:scale-90 shadow-lg backdrop-blur-xs"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
          </button>

          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next Photo"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-[#FDFBF7]/90 hover:bg-white text-[#2A2A2A] flex items-center justify-center border border-[#E8DDD6] z-20 cursor-pointer transition-all active:scale-90 shadow-lg backdrop-blur-xs"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
          </button>
        </div>

        {/* Lookbook Gallery Thumbnails */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2 sm:gap-2.5 pt-1 overflow-x-auto no-scrollbar">
          {activeRoom.images.map((img, idx) => {
            const isSelected = currentSlideIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlideIdx(idx)}
                className={`relative aspect-[16/11] overflow-hidden border-2 transition-all cursor-pointer group shrink-0 ${
                  isSelected
                    ? 'border-[#3A3A3A] ring-2 ring-[#A9BCA7] shadow-md scale-98'
                    : 'border-[#E8DDD6] hover:border-[#3A3A3A] opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className={`absolute inset-0 transition-colors ${isSelected ? 'bg-transparent' : 'bg-black/25 group-hover:bg-transparent'}`} />
                <span className="absolute bottom-1 left-1 right-1 text-[8.5px] font-sans font-bold text-white bg-black/75 px-1 py-0.5 truncate text-center pointer-events-none">
                  {img.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Komponen Tampilan Utama Pilih Cabang & Layanan Khusus (Tegas, Rapi, Full Desktop & Terstruktur)
 */
export const BranchSelectorLanding: React.FC<BranchSelectorViewProps> = ({
  selectedBranch,
  onSelectBranch,
  onSelectCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const selectedBranchData = STUDIO_BRANCHES.find((b) => b.id === selectedBranch) || STUDIO_BRANCHES[0];

  // Dynamic WIB Studio Open Status (08:00 - 21:00 WIB)
  const checkIsOpen = (): boolean => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: 'numeric',
        hour12: false
      });
      const hour = parseInt(formatter.format(new Date()), 10);
      return hour >= 8 && hour < 21;
    } catch {
      const now = new Date();
      const utcHours = now.getUTCHours();
      const wibHours = (utcHours + 7) % 24;
      return wibHours >= 8 && wibHours < 21;
    }
  };

  const [isOpen, setIsOpen] = useState<boolean>(checkIsOpen);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOpen(checkIsOpen());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[1440px] mx-auto my-0 sm:my-4 md:my-6 px-0 sm:px-4 md:px-8 lg:px-12 animate-in fade-in duration-300">
      <div className="bg-[#FDFBF7] border-x-0 sm:border sm:border-[#E8DDD6] shadow-none sm:shadow-xl overflow-hidden flex flex-col relative w-full">
        
        {/* Top Hero Banner Slider */}
        <BackdropHeroSlider onViewPlans={() => onSelectBranch(selectedBranch)} />

        {/* Content Area */}
        <div className="p-3.5 sm:p-6 md:p-8 lg:p-10 space-y-6 md:space-y-8 bg-[#FDFBF7] flex-1">
          
          {/* 1. Why Choose Alviero Studio? */}
          <div className="pb-1 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-sm sm:text-base font-bold tracking-[0.2em] text-[#3A3A3A] uppercase">
                WHY CHOOSE ALVIERO STUDIO?
              </h3>
              <p className="text-xs font-sans text-[#666666]">
                Kenyamanan, kualitas visual premium & pelayanan terpercaya
              </p>
            </div>

            {/* 6 Kolom di Desktop, 3 Kolom di Tablet, 2 Kolom di Mobile */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 text-center">
              {/* Item 1: Fast and convenient */}
              <div className="p-3.5 sm:p-4 bg-white hover:bg-[#F2E9E4]/40 border border-[#E8DDD6] flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-9 h-9 bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center mb-2">
                  <Clock className="w-4.5 h-4.5 stroke-[1.6] text-[#6E856C]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#3A3A3A] uppercase tracking-wider leading-tight">
                  Fast & Convenient
                </h4>
                <p className="text-[10.5px] font-sans text-[#666666] leading-relaxed mt-1.5">
                  Booking instan tanpa antre, jadwal pasti & all-file HD via Google Drive.
                </p>
              </div>

              {/* Item 2: Style and function */}
              <div className="p-3.5 sm:p-4 bg-white hover:bg-[#F2E9E4]/40 border border-[#E8DDD6] flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-9 h-9 bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center mb-2">
                  <Sliders className="w-4.5 h-4.5 stroke-[1.6] text-[#6E856C]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#3A3A3A] uppercase tracking-wider leading-tight">
                  Style & Function
                </h4>
                <p className="text-[10.5px] font-sans text-[#666666] leading-relaxed mt-1.5">
                  7+ tema background estetik, lighting Godox studio & arahan pose natural.
                </p>
              </div>

              {/* Item 3: Live-View Preview */}
              <div className="p-3.5 sm:p-4 bg-white hover:bg-[#F2E9E4]/40 border border-[#E8DDD6] flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-9 h-9 bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center mb-2">
                  <Camera className="w-4.5 h-4.5 stroke-[1.6] text-[#6E856C]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#3A3A3A] uppercase tracking-wider leading-tight">
                  Live-View Preview
                </h4>
                <p className="text-[10.5px] font-sans text-[#666666] leading-relaxed mt-1.5">
                  Monitor realtime besar untuk cek hasil jepretan dan pose langsung seketika.
                </p>
              </div>

              {/* Item 4: Fasilitas Lengkap */}
              <div className="p-3.5 sm:p-4 bg-white hover:bg-[#F2E9E4]/40 border border-[#E8DDD6] flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-9 h-9 bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center mb-2">
                  <Sparkles className="w-4.5 h-4.5 stroke-[1.6] text-[#6E856C]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#3A3A3A] uppercase tracking-wider leading-tight">
                  Fasilitas Lengkap
                </h4>
                <p className="text-[10.5px] font-sans text-[#666666] leading-relaxed mt-1.5">
                  Full AC sejuk, fitting room privat, toga wisuda & aneka properti siap pakai.
                </p>
              </div>

              {/* Item 5: Reflect your lifestyle */}
              <div className="p-3.5 sm:p-4 bg-white hover:bg-[#F2E9E4]/40 border border-[#E8DDD6] flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-9 h-9 bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center mb-2">
                  <Layers className="w-4.5 h-4.5 stroke-[1.6] text-[#6E856C]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#3A3A3A] uppercase tracking-wider leading-tight">
                  Reflect Lifestyle
                </h4>
                <p className="text-[10.5px] font-sans text-[#666666] leading-relaxed mt-1.5">
                  Paket wisuda, wedding, self studio, family, hingga cetak frame kayu eksklusif.
                </p>
              </div>

              {/* Item 6: Continuous support */}
              <div className="p-3.5 sm:p-4 bg-white hover:bg-[#F2E9E4]/40 border border-[#E8DDD6] flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-9 h-9 bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center mb-2">
                  <HeartHandshake className="w-4.5 h-4.5 stroke-[1.6] text-[#6E856C]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#3A3A3A] uppercase tracking-wider leading-tight">
                  Continuous Support
                </h4>
                <p className="text-[10.5px] font-sans text-[#666666] leading-relaxed mt-1.5">
                  Konsultasi konsep, outfit, & fitting kebaya/gaun gratis dengan admin ramah.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Client Reviews & Testimonials Carousel */}
          <div className="pt-4 border-t border-[#E8DDD6]">
            <ClientReviewCarousel />
          </div>

          {/* 3. Spesifikasi Studio & Edukasi Ruang Lengkap */}
          <div className="pt-4 border-t border-[#E8DDD6]">
            <StudioTourAndEducationShowcase 
              selectedBranch={selectedBranch}
              onSelectBranch={onSelectBranch}
              onSelectCategory={onSelectCategory}
            />
          </div>

          {/* 4. Lokasi Studio Aktif & Layanan Wedding / Cetak */}
          <div className="pt-4 pb-1 border-t border-[#E8DDD6] space-y-4">
            
            {/* BIG EYE-CATCHING GRAND CALLOUT BOX */}
            <div className="w-full bg-[#2A2A2A] text-white p-5 sm:p-7 md:p-8 border border-[#3A3A3A] shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 text-left">
              {/* Subtle background ambient glow */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#A9BCA7]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#6E856C]/20 rounded-full blur-3xl pointer-events-none" />

              {/* Left Content Column */}
              <div className="space-y-2.5 max-w-2xl relative z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-[#3A3A3A] text-[#A9BCA7] border border-[#A9BCA7]/40 px-3 py-1 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5 text-[#A9BCA7] animate-pulse" />
                    RESERVASI JADWAL ONLINE INSTAN
                  </span>
                  {isOpen ? (
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#A9BCA7] bg-[#1E2E1D]/80 px-2.5 py-1 border border-[#A9BCA7]/40 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A9BCA7] animate-pulse"></span>
                      Studio Buka • 08:00 - 21:00 WIB
                    </span>
                  ) : (
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2.5 py-1 border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                      Studio Tutup • Buka Jam 08:00 WIB
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-wide leading-tight">
                  SIAP BEREKSPRESI? JELAJAHI PRICELIST & BOOKING!
                </h3>

                {/* Prominent High-Contrast Studio Terpilih Card */}
                <div className="bg-[#1C1C1C] border-2 border-[#A9BCA7] p-3 sm:p-4 shadow-lg relative overflow-hidden my-1">
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#A9BCA7]" />
                  <div className="flex items-center justify-between gap-3 pl-2 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-[#2A2A2A] border border-[#A9BCA7] text-[#A9BCA7] flex items-center justify-center shrink-0 shadow-inner">
                        <MapPin className="w-5 h-5 text-[#A9BCA7] stroke-[2.2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-widest text-[#A9BCA7] bg-[#2A2A2A] px-2 py-0.5 border border-[#A9BCA7]/40">
                            STUDIO TERPILIH SAAT INI
                          </span>
                          <span className="text-[10px] font-mono font-bold text-white bg-black/60 px-2 py-0.5 border border-white/20">
                            {selectedBranchData.badge}
                          </span>
                        </div>
                        <div className="text-sm sm:text-base md:text-lg font-serif font-black text-white uppercase tracking-wider mt-1 truncate">
                          {selectedBranchData.name}
                        </div>
                        <div className="text-[11px] sm:text-xs text-stone-300 font-sans truncate">
                          📍 {selectedBranchData.address.split(',')[0]}, {selectedBranchData.address.split(',')[1] || ''}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="px-3.5 py-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#A9BCA7] hover:text-white border border-[#A9BCA7]/60 text-[11px] font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-xs active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Ganti Studio</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                  Pilih paket foto impian Anda, tentukan jam slot tanpa antre, dan konfirmasi jadwal secara otomatis melalui WhatsApp.
                </p>
              </div>

              {/* Right Action Column */}
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto relative z-10 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="min-h-[48px] px-5 py-3 bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#FDFBF7] hover:text-white font-serif font-bold text-xs uppercase tracking-wider border border-[#5A5A5A] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shrink-0"
                >
                  <MapPin className="w-4 h-4 text-[#A9BCA7]" />
                  <span>GANTI STUDIO ▾</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectBranch(selectedBranch)}
                  className="min-h-[48px] px-6 sm:px-8 py-3 bg-[#A9BCA7] hover:bg-[#98AC96] text-[#2A2A2A] font-serif font-black text-xs sm:text-sm uppercase tracking-[0.16em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 shrink-0 border border-[#A9BCA7] group"
                >
                  <Sparkles className="w-4 h-4 text-[#2A2A2A] group-hover:rotate-12 transition-transform" />
                  <span>BUKA PRICELIST {selectedBranchData.badge.toUpperCase()}</span>
                  <ArrowUpRight className="w-4.5 h-4.5 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* 3 Companion Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              {/* Card 1: Pricelist MUA & Kebaya */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('kebayak-gaun') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-5 bg-white hover:bg-[#F2E9E4]/50 border border-[#E8DDD6] hover:border-[#3A3A3A] transition-all duration-200 cursor-pointer group text-left relative overflow-hidden flex items-center justify-between gap-3 sm:gap-4 shadow-2xs"
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Palette className="w-5 h-5 stroke-[1.8] text-[#6E856C]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] tracking-wider uppercase truncate">
                        PRICELIST MUA & KEBAYA
                      </h4>
                      <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7]">
                        Wardrobe
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs font-sans text-[#666666] truncate mt-1">
                      Sewa Kebaya Modern, Gaun Wisuda & Paket MUA
                    </p>
                  </div>
                </div>

                <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1 shrink-0 group-hover:text-[#6E856C]">
                  <span className="hidden lg:inline text-[11px]">Lihat Koleksi</span>
                  <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>

              {/* Card 2: Pricelist Wedding & Prewedding */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('wedding-package') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-5 bg-white hover:bg-[#F2E9E4]/50 border border-[#E8DDD6] hover:border-[#3A3A3A] transition-all duration-200 cursor-pointer group text-left relative overflow-hidden flex items-center justify-between gap-3 sm:gap-4 shadow-2xs"
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5 stroke-[1.8] text-[#6E856C]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] tracking-wider uppercase truncate">
                        PRICELIST WEDDING & PREWEDDING
                      </h4>
                      <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7]">
                        Suite
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs font-sans text-[#666666] truncate mt-1">
                      Paket Prewedding, Akad Nikah, Resepsi & Engagement
                    </p>
                  </div>
                </div>

                <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1 shrink-0 group-hover:text-[#6E856C]">
                  <span className="hidden lg:inline text-[11px]">Lihat Paket</span>
                  <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>

              {/* Card 3: Pricelist Cetak Lab & Bingkai */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('bingkai-album') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-5 bg-white hover:bg-[#F2E9E4]/50 border border-[#E8DDD6] hover:border-[#3A3A3A] transition-all duration-200 cursor-pointer group text-left relative overflow-hidden flex items-center justify-between gap-3 sm:gap-4 shadow-2xs"
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-5 h-5 stroke-[1.8] text-[#6E856C]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] tracking-wider uppercase truncate">
                        PRICELIST CETAK LAB & BINGKAI
                      </h4>
                      <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7]">
                        Lab
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs font-sans text-[#666666] truncate mt-1">
                      Cetak Lab Anti-Luntur, Bingkai Kayu & Album Hardcover
                    </p>
                  </div>
                </div>

                <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1 shrink-0 group-hover:text-[#6E856C]">
                  <span className="hidden lg:inline text-[11px]">Lihat Katalog</span>
                  <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* LUXURY EDITORIAL DARK FOOTER */}
        <footer className="w-full bg-[#222222] text-[#F2E9E4] border-t border-[#3A3A3A] select-none">
          {/* Main Footer Row */}
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand Logo / Text */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-serif font-black text-xl sm:text-2xl tracking-[0.25em] text-white uppercase">
                ALVIERO STUDIO
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#A9BCA7] uppercase mt-0.5">
                EST. MALANG • JAWA TIMUR
              </span>
            </div>

            {/* Studio Specialization Services */}
            <div className="text-center md:text-right font-sans text-xs text-stone-300 tracking-wider">
              <p className="font-medium text-stone-200">
                Photography <span className="text-[#A9BCA7] px-1">•</span> Videography <span className="text-[#A9BCA7] px-1">•</span> Creative Production
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Studio 1 Karangploso & Studio 2 Cabang Eksklusif
              </p>
            </div>
          </div>

          {/* Sub-Footer Row */}
          <div className="border-t border-white/10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-4 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-300">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <span>© {new Date().getFullYear()} Alviero Studio. All Rights Reserved.</span>
            </div>

            {/* Status Live Pill */}
            <div className={`px-3.5 py-1.5 border flex items-center gap-2 text-[10.5px] ${
              isOpen 
                ? 'bg-[#1E2E1D] border-[#A9BCA7]/40' 
                : 'bg-rose-950/80 border-rose-500/30'
            }`}>
              {isOpen ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9BCA7] animate-pulse"></span>
                  <span className="text-[#A9BCA7] font-medium tracking-wider uppercase text-[10px]">
                    Studio Buka Hari Ini • 08:00 - 21:00 WIB
                  </span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                  <span className="text-rose-300 font-medium tracking-wider uppercase text-[10px]">
                    Studio Tutup • Buka Jam 08:00 - 21:00 WIB
                  </span>
                </>
              )}
            </div>

            {/* Quick Text Links */}
            <div className="flex items-center gap-4 sm:gap-6 font-sans text-[11px] text-stone-300">
              <a
                href="https://instagram.com/alvierostudio"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/6287777538164?text=Halo%20Admin%20Alviero%20Studio"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Lokasi Studio
              </button>
            </div>
          </div>
        </footer>
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-[#FDFBF7] max-w-xl w-full border border-[#E8DDD6] shadow-2xl overflow-hidden flex flex-col my-auto relative">
        
        {/* Minimalist Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8DDD6] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDFBF7] text-[#3A3A3A] flex items-center justify-center border border-[#E8DDD6]">
              <MapPin className="w-5 h-5 stroke-[1.8] text-[#6E856C]" />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold tracking-[0.2em] text-[#3A3A3A] uppercase leading-none">
                PILIH LOKASI STUDIO
              </h3>
              <p className="text-[11px] font-sans text-[#666666] mt-1">
                Tentukan cabang studio foto yang ingin Anda kunjungi
              </p>
            </div>
          </div>

          {canDismiss && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 bg-stone-100 hover:bg-[#3A3A3A] text-stone-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#E8DDD6]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Branch Cards */}
        <div className="p-4 sm:p-5 space-y-3 bg-[#FDFBF7] flex-1">
          {STUDIO_BRANCHES.map((branch) => {
            const isSelected = selectedBranch === branch.id;

            return (
              <div
                key={branch.id}
                onClick={() => handleChoose(branch.id)}
                className={`p-4 sm:p-4.5 border transition-all duration-200 cursor-pointer relative group text-left ${
                  isSelected
                    ? 'bg-white border-[#3A3A3A] ring-1 ring-[#3A3A3A] shadow-md'
                    : 'bg-[#FAF8F5] hover:bg-white border-[#E8DDD6] hover:border-[#3A3A3A]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Clean Left Icon Container */}
                    <div className={`w-10 h-10 flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected ? 'bg-[#3A3A3A] text-white border-[#3A3A3A]' : 'bg-[#FDFBF7] text-[#3A3A3A] border-[#E8DDD6]'
                    }`}>
                      <MapPin className={`w-5 h-5 stroke-[1.8] ${isSelected ? 'text-[#A9BCA7]' : 'text-[#6E856C]'}`} />
                    </div>

                    {/* Main Studio Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#3A3A3A] uppercase tracking-wide">
                          {branch.name}
                        </h4>
                        <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 border ${
                          isSelected ? 'bg-[#3A3A3A] text-white border-[#3A3A3A]' : 'bg-[#EBF2EA] text-[#6E856C] border-[#A9BCA7]'
                        }`}>
                          {branch.badge}
                        </span>
                      </div>

                      <p className="text-xs font-sans text-[#666666] font-normal leading-relaxed mt-1">
                        {branch.address}
                      </p>

                      {/* Fasilitas Cabang */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] bg-white text-stone-700 px-2 py-0.5 border border-[#E8DDD6] font-medium">
                          ✓ Pro Godox Lighting
                        </span>
                        <span className="text-[10px] bg-white text-stone-700 px-2 py-0.5 border border-[#E8DDD6] font-medium">
                          ✓ 7+ Backdrop
                        </span>
                        <span className="text-[10px] bg-white text-stone-700 px-2 py-0.5 border border-[#E8DDD6] font-medium">
                          ✓ Ruang AC
                        </span>
                      </div>

                      {/* Link Maps */}
                      <a
                        href={branch.mapsUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 mt-2 text-[11px] font-sans font-semibold text-[#6E856C] hover:text-[#3A3A3A] underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        <span>Buka Petunjuk Arah di Google Maps</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Radio Indicator */}
                  <div className="pt-1 shrink-0">
                    <div className={`w-5 h-5 border flex items-center justify-center transition-all ${
                      isSelected ? 'border-[#3A3A3A] bg-[#3A3A3A]' : 'border-stone-400 bg-transparent'
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
        <div className="p-3.5 bg-[#F2E9E4] border-t border-[#E8DDD6] text-center text-[11px] text-[#666666] font-medium">
          💡 Pilih salah satu studio untuk melihat pricelist dan katalog lengkap.
        </div>
      </div>
    </div>
  );
};
