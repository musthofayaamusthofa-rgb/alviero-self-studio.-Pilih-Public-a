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
  ChevronDown,
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
  Calendar,
  MessageCircle,
  Instagram,
  RefreshCw,
  Tag,
  Copy,
  Gift,
  CheckCircle2
} from 'lucide-react';

interface BranchSelectorViewProps {
  selectedBranch: StudioBranch;
  onSelectBranch: (branch: StudioBranch) => void;
  onSelectCategory?: (category: string, branch?: StudioBranch) => void;
  onOpenBooking?: (promoCode?: string, packageId?: string) => void;
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
                className={`transition-all cursor-pointer ${isActive
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
          Alviero Studio menghadirkan pengalaman fotografi profesional dengan ruang sejuk, 7+ pilihan tema background estetis, tata lampu lighting studio profesional, monitor live-view realtime untuk melihat hasil jepretan seketika (SelfStudio), serta private dressing room & jas kemeja siap pakai.
        </p>
      </div>
    </div>
  );
};

export const BackdropHeroSlider = BackgroundHeroSlider;

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
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalPages = Math.ceil(CLIENT_REVIEWS.length / 2);

  // Auto-scroll bergulir otomatis setiap 4.5 detik
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentReviewIdx((prev) => (prev + 1) % totalPages);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, totalPages]);

  const handleNext = () => {
    setCurrentReviewIdx((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentReviewIdx((prev) => (prev - 1 + totalPages) % totalPages);
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
    if (diff > 45) handleNext();
    if (diff < -45) handlePrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const visibleReviews = CLIENT_REVIEWS.slice(currentReviewIdx * 2, currentReviewIdx * 2 + 2);

  return (
    <div
      className="pt-5 pb-1 border-t border-[#E8DDD6] space-y-3 relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
          className="absolute -left-1 sm:left-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-white shadow-md border border-[#E8DDD6] flex items-center justify-center cursor-pointer z-10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Tombol Panah Kanan (>) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Reviews"
          className="absolute -right-1 sm:right-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-white shadow-md border border-[#E8DDD6] flex items-center justify-center cursor-pointer z-10 transition-colors"
        >
          <ChevronRight className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Review Cards (Grid 2 Kolom di Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 px-2 sm:px-4">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="relative bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DDD6] shadow-sm hover:shadow-md pl-16 sm:pl-20 animate-in fade-in duration-300 flex flex-col justify-between"
            >
              {/* Foto Avatar */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-stone-900 border-2 border-white shadow-sm overflow-hidden shrink-0">
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
              className={`transition-all rounded-full cursor-pointer ${currentReviewIdx === idx
                ? 'w-6 h-1 bg-[#3A3A3A]'
                : 'w-2 h-1 bg-stone-300 hover:bg-stone-500'
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
export const STUDIO_SHOWCASE_IMAGES = [
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
];

/**
 * Komponen Galeri Tema Background & Hasil Foto Studio
 */
export const StudioTourAndEducationShowcase: React.FC<{
  onSelectCategory?: (category: string) => void;
  onSelectBranch?: (branch: StudioBranch) => void;
  selectedBranch?: StudioBranch;
}> = () => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const activeSlide = STUDIO_SHOWCASE_IMAGES[currentSlideIdx] || STUDIO_SHOWCASE_IMAGES[0];

  // Auto-scroll bergulir otomatis setiap 3.8 detik
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlideIdx((prev) => (prev + 1) % STUDIO_SHOWCASE_IMAGES.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNextSlide = () => {
    setCurrentSlideIdx((prev) => (prev + 1) % STUDIO_SHOWCASE_IMAGES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIdx((prev) => (prev - 1 + STUDIO_SHOWCASE_IMAGES.length) % STUDIO_SHOWCASE_IMAGES.length);
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
    if (diff > 45) handleNextSlide();
    if (diff < -45) handlePrevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
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
      </div>

      {/* Main Cinematic Visual Stage */}
      <div className="max-w-6xl mx-auto">
        <div
          className="relative w-full h-84 sm:h-96 md:h-[480px] lg:h-[560px] bg-[#222222] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8DDD6] group flex flex-col justify-between shadow-xl select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={currentSlideIdx}
            src={activeSlide.src}
            alt={activeSlide.caption}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-102"
          />

          {/* Subtle Ambient Shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Top Floating Glassmorphism Tag */}
          <div className="relative top-4 left-4 z-10 pointer-events-none flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] font-mono font-bold tracking-widest text-[#2A2A2A] uppercase bg-[#FDFBF7]/95 px-3.5 py-1.5 rounded-full border border-[#E8DDD6] backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E856C]" />
              {activeSlide.tag}
            </span>
          </div>

          {/* Minimalist Bottom Pagination Dots */}
          <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2 pointer-events-auto">
            {STUDIO_SHOWCASE_IMAGES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlideIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${currentSlideIdx === idx
                  ? 'w-8 h-1.5 bg-[#A9BCA7] shadow-sm'
                  : 'w-2 h-1.5 bg-white/50 hover:bg-white/80'
                  }`}
              />
            ))}
          </div>

          {/* Floating Navigation Controls */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous Photo"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FDFBF7]/90 hover:bg-white text-[#2A2A2A] flex items-center justify-center border border-[#E8DDD6] z-20 cursor-pointer transition-all active:scale-90 shadow-lg backdrop-blur-xs"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
          </button>

          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next Photo"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FDFBF7]/90 hover:bg-white text-[#2A2A2A] flex items-center justify-center border border-[#E8DDD6] z-20 cursor-pointer transition-all active:scale-90 shadow-lg backdrop-blur-xs"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Struktur Data Promo & Kupon Alviero Studio
 */
export interface StudioPromo {
  id: string;
  code: string;
  badge: string;
  category: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  discountHighlight: string;
  period: string;
  imageUrl: string;
  terms: string[];
  howToUse: string[];
  preselectedPackageId?: string;
}

export const STUDIO_PROMOS: StudioPromo[] = [
  {
    id: 'promo-wisuda',
    code: 'STUDENT10',
    badge: 'DISKON 10%',
    category: 'WISUDA & MAHASISWA',
    title: 'Promo Spesial Wisuda: Diskon 10% All Package',
    shortDesc: 'Rayakan kelulusan bersama teman & keluarga dengan potongan 10% untuk semua paket wisuda.',
    fullDesc: 'Dapatkan diskon istimewa 10% untuk seluruh paket Foto Wisuda Indoor (Studio) dan Wisuda Outdoor di Alviero Studio. Fasilitas lengkap mencakup ruang ganti privat, peminjaman toga wisuda, serta seluruh soft file resolusi tinggi via Google Drive.',
    discountHighlight: 'Potongan 10% Total Transaksi',
    period: 'Berlaku Setiap Hari • Kuota Terbatas',
    imageUrl: '/images/categories/graduation.jpg',
    terms: [
      'Berlaku untuk paket Graduation Indoor dan Outdoor di Studio 1 maupun Studio 2.',
      'Wajib menunjukkan Kartu Tanda Mahasiswa (KTM) aktif saat registrasi atau konfirmasi WhatsApp.',
      'Berlaku untuk pemesanan jadwal secara online via website Alviero Studio.',
      'Kuota voucher promo terbatas setiap harinya.',
      'Tidak dapat diuangkan atau digabungkan dengan diskon promosi sejenis lainnya.'
    ],
    howToUse: [
      'Salin kode kupon STUDENT10 di kotak voucher.',
      'Tekan tombol "Gunakan Promo & Booking" di bawah.',
      'Kode akan langsung memotong total biaya saat simulasi pembayaran.'
    ],
    preselectedPackageId: 'grad-indoor-1'
  },
  {
    id: 'promo-couple',
    code: 'COUPLE15',
    badge: 'HEMAT 15%',
    category: 'COUPLE & PREWEDDING',
    title: 'Sweet Romance: Hemat 15% Sesi Foto Pasangan',
    shortDesc: 'Abadikan momen romantis dan prewedding bersama orang tersayang dengan potongan 15%.',
    fullDesc: 'Momen berharga bersama pasangan semakin berkesan dengan penawaran spesial hemat 15% untuk Paket Foto Couple Studio dan Paket Prewedding. Termasuk cetak foto premium berbingkai dan arahan pose natural dari fotografer berpengalaman.',
    discountHighlight: 'Potongan 15% Paket Couple & Prewed',
    period: 'Berlaku s.d. Akhir Bulan',
    imageUrl: '/images/categories/couple.jpg',
    terms: [
      'Berlaku untuk Paket Foto Couple dan Paket Prewedding Studio.',
      'Berlaku untuk sesi foto di Studio 1 (Karangploso) & Studio 2 (Dinoyo Gajayana).',
      'Wajib melakukan reservasi jadwal sesi terlebih dahulu via website.',
      'Sudah termasuk cetak foto berbingkai estetis dan all soft files Google Drive.'
    ],
    howToUse: [
      'Salin kode kupon COUPLE15.',
      'Tekan tombol "Gunakan Promo & Booking" di bawah.',
      'Potongan diskon 15% otomatis teraplikasikan pada tagihan reservasi.'
    ],
    preselectedPackageId: 'couple-1'
  },
  {
    id: 'promo-welcome',
    code: 'ALVIERO',
    badge: 'POTONGAN 10K',
    category: 'SEMUA LAYANAN & SELFSTUDIO',
    title: 'Welcome Voucher: Potongan Langsung Rp 10.000',
    shortDesc: 'Klaim voucher potongan langsung Rp 10.000 untuk semua pemesanan online di website.',
    fullDesc: 'Sebagai apresiasi untuk Anda yang melakukan reservasi online melalui website resmi Alviero Studio, nikmati potongan langsung Rp 10.000 tanpa minimal transaksi tinggi. Berlaku untuk SelfStudio, Foto Grup, Personal, hingga Sewa Studio.',
    discountHighlight: 'Potongan Langsung Rp 10.000',
    period: 'Eksklusif Pemesanan Website',
    imageUrl: '/images/categories/selfphoto.jpg',
    terms: [
      'Berlaku untuk semua paket foto (SelfStudio, Studio Foto, Sewa Studio).',
      'Khusus reservasi jadwal mandiri melalui website resmi Alviero Studio.',
      'Dapat digunakan 1 kali per nomor WhatsApp pelanggan.',
      'Langsung memotong nominal pembayaran DP atau pelunasan.'
    ],
    howToUse: [
      'Salin kode kupon ALVIERO.',
      'Pilih paket foto yang Anda inginkan pada form booking.',
      'Voucher otomatis memotong Rp 10.000 dari total tagihan.'
    ],
    preselectedPackageId: 'selfstudio-special'
  }
];

/**
 * Komponen Bagian Promo Spesial Alviero Studio
 */
/**
 * Komponen Bagian Promo Spesial Alviero Studio (Geser ke Samping / Horizontal Carousel)
 */
export const PromoSpecialSection: React.FC<{
  onSelectPromo: (promo: StudioPromo) => void;
}> = ({ onSelectPromo }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activePromoIdx, setActivePromoIdx] = useState<number>(0);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll<HTMLElement>('.promo-card-item');
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
      setActivePromoIdx(index);
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.querySelector<HTMLElement>('.promo-card-item')?.offsetWidth || 300;
    const newIdx = Math.round(scrollLeft / (itemWidth + 14));
    if (newIdx >= 0 && newIdx < STUDIO_PROMOS.length && newIdx !== activePromoIdx) {
      setActivePromoIdx(newIdx);
    }
  };

  const handleNext = () => {
    const nextIdx = (activePromoIdx + 1) % STUDIO_PROMOS.length;
    scrollToIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activePromoIdx - 1 + STUDIO_PROMOS.length) % STUDIO_PROMOS.length;
    scrollToIndex(prevIdx);
  };

  return (
    <div className="space-y-3.5 text-left select-none">
      {/* Header Section Promo */}
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7] px-2.5 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider">
              <Gift className="w-3 h-3 text-[#6E856C]" />
              PROMO & VOUCHER KHUSUS
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Terbatas
            </span>
          </div>
          <h3 className="font-serif font-black text-xl sm:text-2xl text-[#3A3A3A] uppercase tracking-wide">
            Promo Spesial Alviero Studio
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 font-sans">
            Geser ke samping untuk melihat pilihan kupon & diskon spesial:
          </p>
        </div>

        {/* Desktop / Tablet Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Promo Sebelumnya"
            className="w-8 h-8 rounded-full bg-white text-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-white border border-[#E8DDD6] flex items-center justify-center cursor-pointer transition-colors shadow-2xs active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2]" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Promo Selanjutnya"
            className="w-8 h-8 rounded-full bg-white text-[#3A3A3A] hover:bg-[#3A3A3A] hover:text-white border border-[#E8DDD6] flex items-center justify-center cursor-pointer transition-colors shadow-2xs active:scale-95"
          >
            <ChevronRight className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel (Geser ke Samping pada HP & Layar Lainnya) */}
      <div className="relative -mx-3.5 sm:-mx-6 md:mx-0 px-3.5 sm:px-6 md:px-0">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 sm:gap-5 pb-3 scroll-smooth no-scrollbar touch-pan-x"
        >
          {STUDIO_PROMOS.map((promo) => (
            <div
              key={promo.id}
              onClick={() => onSelectPromo(promo)}
              className="promo-card-item w-[85%] sm:w-[340px] md:w-[380px] shrink-0 snap-start rounded-2xl sm:rounded-3xl bg-white border border-[#E8DDD6] hover:border-[#A9BCA7] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-98 group"
            >
              {/* Banner Foto Promo */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-100">
                <img
                  src={promo.imageUrl}
                  alt={promo.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Floating Badge Diskon di Gambar */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-[#2A2A2A]/90 backdrop-blur-xs text-[#A9BCA7] border border-[#A9BCA7]/40 px-2.5 py-1 rounded-full text-[10px] font-mono font-black tracking-wider uppercase shadow-md">
                    <Tag className="w-3 h-3 text-[#A9BCA7]" />
                    {promo.badge}
                  </span>
                </div>

                {/* Floating Periode Pill */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-xs text-stone-700 px-2 py-0.5 rounded-full text-[9px] font-sans font-bold shadow-xs">
                    {promo.period}
                  </span>
                </div>

                {/* Highlight Potongan Bawah Gambar */}
                <div className="absolute bottom-2.5 left-3 right-3">
                  <span className="text-white text-xs font-serif font-bold drop-shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#A9BCA7]" />
                    {promo.discountHighlight}
                  </span>
                </div>
              </div>

              {/* Konten Rincian Kartu */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#6E856C]">
                    {promo.category}
                  </span>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#3A3A3A] group-hover:text-[#6E856C] transition-colors leading-snug">
                    {promo.title}
                  </h4>
                  <p className="text-xs font-sans text-stone-600 line-clamp-2 leading-relaxed">
                    {promo.shortDesc}
                  </p>
                </div>

                {/* Action Bar Bawah: Kupon Tag & Tombol Detail */}
                <div className="pt-3 border-t border-[#E8DDD6] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 bg-[#F2E9E4] text-[#3A3A3A] border border-dashed border-[#A9BCA7] px-2 py-0.5 rounded-lg text-[9.5px] font-mono font-bold">
                    <span>KODE:</span>
                    <span className="text-[#6E856C] font-black tracking-wider">{promo.code}</span>
                  </div>

                  <div className="text-xs font-serif font-bold text-[#6E856C] group-hover:text-[#3A3A3A] flex items-center gap-1 transition-transform group-hover:translate-x-0.5 shrink-0">
                    <span>Lihat Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots Indicator & Mobile Swipe Guide */}
        <div className="flex items-center justify-between pt-1 px-1">
          <span className="text-[10px] font-sans text-stone-600 flex items-center gap-1 sm:hidden">
            <span>👉 Geser untuk promo lainnya</span>
          </span>

          <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
            {STUDIO_PROMOS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => scrollToIndex(dotIdx)}
                aria-label={`Promo ${dotIdx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  activePromoIdx === dotIdx
                    ? 'w-6 h-1.5 bg-[#6E856C]'
                    : 'w-2 h-1.5 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Komponen Modal Pop-up Detail Promo (Gaya Aplikasi PLN Mobile)
 */
export const PromoDetailModal: React.FC<{
  promo: StudioPromo | null;
  onClose: () => void;
  onApplyPromo?: (promoCode: string, packageId?: string) => void;
  selectedBranch?: StudioBranch;
}> = ({ promo, onClose, onApplyPromo, selectedBranch = 'cabang-1' }) => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  if (!promo) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(promo.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const whatsappPhone = selectedBranch === 'cabang-2' ? '6285168879214' : '6287777538164';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=Halo%20Admin%20Alviero%20Studio,%20saya%20tertarik%20dengan%20promo:%20${encodeURIComponent(promo.title)}%20(Kode%20Promo:%20${promo.code}).%20Bagaimana%20cara%20klaimnya?`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] max-w-lg w-full rounded-2xl sm:rounded-3xl border border-[#E8DDD6] shadow-2xl overflow-hidden flex flex-col my-auto relative max-h-[92vh] text-left animate-in zoom-in-95 duration-200">
        
        {/* Minimalist Top Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8DDD6] bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EBF2EA] text-[#6E856C] flex items-center justify-center border border-[#A9BCA7]">
              <Gift className="w-4 h-4 text-[#6E856C]" />
            </div>
            <div>
              <h3 className="font-serif font-black text-sm sm:text-base text-[#3A3A3A] uppercase tracking-wide">
                Detail Promo & Kupon
              </h3>
              <span className="text-[10px] font-mono text-stone-500 block">
                Alviero Studio • Penawaran Terbatas
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup Detail Promo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body (Gaya Aplikasi PLN Mobile) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Banner Promo */}
          <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-[#E8DDD6] shadow-2xs bg-stone-100">
            <img
              src={promo.imageUrl}
              alt={promo.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="bg-[#2A2A2A]/90 backdrop-blur-xs text-[#A9BCA7] border border-[#A9BCA7]/40 px-3 py-1 rounded-full text-[10.5px] font-mono font-black uppercase tracking-wider">
                {promo.badge}
              </span>
              <span className="text-white text-xs font-serif font-bold drop-shadow">
                {promo.period}
              </span>
            </div>
          </div>

          {/* Judul & Kategori */}
          <div className="space-y-1">
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-[#6E856C]">
              {promo.category}
            </span>
            <h4 className="font-serif font-black text-lg sm:text-xl text-[#3A3A3A] leading-snug">
              {promo.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-stone-600 font-sans pt-1">
              <Clock className="w-3.5 h-3.5 text-[#6E856C]" />
              <span>{promo.period}</span>
            </div>
          </div>

          {/* Kotak Voucher Promo (Style Aplikasi PLN / E-Commerce) */}
          <div className="bg-[#F2E9E4]/80 border-2 border-dashed border-[#A9BCA7] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
            <div className="min-w-0">
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-widest text-stone-500 block">
                KODE VOUCHER PROMO:
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-[#2A2A2A] tracking-wider block">
                {promo.code}
              </span>
              <span className="text-[10px] text-stone-600 block mt-0.5">
                {promo.discountHighlight}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl font-sans font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0 shadow-2xs ${
                copiedCode
                  ? 'bg-[#6E856C] text-white border border-[#6E856C]'
                  : 'bg-white hover:bg-[#3A3A3A] text-[#3A3A3A] hover:text-white border border-[#E8DDD6]'
              }`}
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kode</span>
                </>
              )}
            </button>
          </div>

          {/* Deskripsi Promo */}
          <div className="space-y-1.5">
            <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[#3A3A3A]">
              Tentang Penawaran Ini:
            </h5>
            <p className="text-xs sm:text-sm font-sans text-stone-700 leading-relaxed">
              {promo.fullDesc}
            </p>
          </div>

          {/* Syarat & Ketentuan (S&K) */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8DDD6] space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-[#3A3A3A]">
              <ShieldCheck className="w-4 h-4 text-[#6E856C]" />
              <span>Syarat & Ketentuan:</span>
            </div>
            <ul className="space-y-1.5">
              {promo.terms.map((term, i) => (
                <li key={i} className="flex items-start gap-2 text-xs font-sans text-stone-600 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#6E856C] shrink-0 mt-0.5" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cara Penggunaan Kupon */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8DDD6] space-y-2 text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#6E856C] block">
              CARA KLAIM PROMO:
            </span>
            <ol className="space-y-1.5 text-xs text-stone-700 font-sans">
              {promo.howToUse.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#EBF2EA] text-[#6E856C] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8DDD6] flex flex-col sm:flex-row gap-2.5 sticky bottom-0 z-20 shadow-md">
          <button
            type="button"
            onClick={() => {
              if (onApplyPromo) {
                onApplyPromo(promo.code, promo.preselectedPackageId);
              }
            }}
            className="flex-1 min-h-[44px] rounded-xl bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-[#A9BCA7]" />
            <span>Pakai Promo & Booking Sekarang</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="sm:w-auto min-h-[44px] px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-serif font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            <span>Chat WhatsApp</span>
          </a>
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
  onOpenBooking
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPromoModal, setSelectedPromoModal] = useState<StudioPromo | null>(null);
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
  const [isStudioFotoExpanded, setIsStudioFotoExpanded] = useState<boolean>(() => {
    return localStorage.getItem('alviero_expanded_service') === 'studio-foto';
  });
  const [isSelfStudioExpanded, setIsSelfStudioExpanded] = useState<boolean>(() => {
    return localStorage.getItem('alviero_expanded_service') === 'selfstudio';
  });

  const toggleStudioFoto = () => {
    setIsStudioFotoExpanded((prev) => {
      const next = !prev;
      if (next) {
        localStorage.setItem('alviero_expanded_service', 'studio-foto');
        setIsSelfStudioExpanded(false);
      } else {
        localStorage.removeItem('alviero_expanded_service');
      }
      return next;
    });
  };

  const toggleSelfStudio = () => {
    setIsSelfStudioExpanded((prev) => {
      const next = !prev;
      if (next) {
        localStorage.setItem('alviero_expanded_service', 'selfstudio');
        setIsStudioFotoExpanded(false);
      } else {
        localStorage.removeItem('alviero_expanded_service');
      }
      return next;
    });
  };

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
        <BackgroundHeroSlider onViewPlans={() => onSelectBranch(selectedBranch)} />

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
              <div className="rounded-2xl p-4 sm:p-5 bg-white hover:bg-[#F2E9E4]/40 border border-[#E8DDD6] shadow-sm hover:shadow-md flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center mb-2.5 shadow-2xs">
                  <Clock className="w-5 h-5 stroke-[1.6] text-[#6E856C]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#3A3A3A] uppercase tracking-wider leading-tight">
                  Fast & Convenient
                </h4>
                <p className="text-[10.5px] font-sans text-[#666666] leading-relaxed mt-1.5">
                  Booking instan tanpa antre, jadwal pasti & all-file HD via Google Drive.
                </p>
              </div>

              {/* Item 2: Style and function */}
              <div className="rounded-2xl p-4 sm:p-5 bg-white hover:bg-[#F2E9E4]/40 border border-[#E8DDD6] shadow-sm hover:shadow-md flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center mb-2.5 shadow-2xs">
                  <Sliders className="w-5 h-5 stroke-[1.6] text-[#6E856C]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#3A3A3A] uppercase tracking-wider leading-tight">
                  Style & Function
                </h4>
                <p className="text-[10.5px] font-sans text-[#666666] leading-relaxed mt-1.5">
                  7+ tema background estetik, lighting studio profesional & arahan pose natural.
                </p>
              </div>

              {/* Item 3: Live-View Preview */}
              <div className="rounded-2xl p-4 sm:p-5 bg-white hover:bg-[#F2E9E4]/40 border border-[#E8DDD6] shadow-sm hover:shadow-md flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center mb-2.5 shadow-2xs">
                  <Camera className="w-5 h-5 stroke-[1.6] text-[#6E856C]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#3A3A3A] uppercase tracking-wider leading-tight">
                  Live-View Preview
                </h4>
                <p className="text-[10.5px] font-sans text-[#666666] leading-relaxed mt-1.5">
                  Monitor realtime besar untuk cek hasil jepretan dan pose langsung seketika.
                </p>
              </div>

              {/* Item 4: Fasilitas Lengkap */}
              <div className="rounded-2xl p-4 sm:p-5 bg-white hover:bg-[#F2E9E4]/40 border border-[#E8DDD6] shadow-sm hover:shadow-md flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center mb-2.5 shadow-2xs">
                  <Sparkles className="w-5 h-5 stroke-[1.6] text-[#6E856C]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#3A3A3A] uppercase tracking-wider leading-tight">
                  Fasilitas Lengkap
                </h4>
                <p className="text-[10.5px] font-sans text-[#666666] leading-relaxed mt-1.5">
                  Full AC sejuk, fitting room privat, toga wisuda & aneka properti siap pakai.
                </p>
              </div>

              {/* Item 5: Reflect your lifestyle */}
              <div className="rounded-2xl p-4 sm:p-5 bg-white hover:bg-[#F2E9E4]/40 border border-[#E8DDD6] shadow-sm hover:shadow-md flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center mb-2.5 shadow-2xs">
                  <Layers className="w-5 h-5 stroke-[1.6] text-[#6E856C]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#3A3A3A] uppercase tracking-wider leading-tight">
                  Reflect Lifestyle
                </h4>
                <p className="text-[10.5px] font-sans text-[#666666] leading-relaxed mt-1.5">
                  Paket wisuda, wedding, self studio, family, hingga cetak frame kayu eksklusif.
                </p>
              </div>

              {/* Item 6: Continuous support */}
              <div className="rounded-2xl p-4 sm:p-5 bg-white hover:bg-[#F2E9E4]/40 border border-[#E8DDD6] shadow-sm hover:shadow-md flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center mb-2.5 shadow-2xs">
                  <HeartHandshake className="w-5 h-5 stroke-[1.6] text-[#6E856C]" />
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

          {/* 3.5. Promo Spesial & Voucher Diskon (Gaya Aplikasi PLN Mobile) */}
          <div className="pt-4 border-t border-[#E8DDD6]">
            <PromoSpecialSection
              onSelectPromo={(promo) => setSelectedPromoModal(promo)}
            />
          </div>

          {/* 4. Lokasi Studio Aktif & Layanan Wedding / Cetak */}
          <div id="section-services" className="pt-4 pb-1 border-t border-[#E8DDD6]">

            {/* BIG EYE-CATCHING GRAND CALLOUT BOX & SPECIALIST SERVICES (Kontainer Border Hitam Sampai Bawah) */}
            <div className="w-full bg-[#2A2A2A] text-white p-4 sm:p-6 md:p-8 border border-[#3A3A3A] rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden space-y-5 sm:space-y-6 text-left">
              {/* Subtle background ambient glow */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#A9BCA7]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#6E856C]/20 rounded-full blur-3xl pointer-events-none" />

              {/* Header Atas */}
              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-[#3A3A3A] text-[#A9BCA7] border border-[#A9BCA7]/40 px-3 py-1 rounded-full text-[9.5px] sm:text-[10.5px] font-mono font-bold uppercase tracking-widest">
                    <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#A9BCA7] shrink-0" />
                    RESERVASI JADWAL ONLINE
                  </span>
                  {isOpen ? (
                    <span className="text-[9.5px] sm:text-[10.5px] font-sans font-bold uppercase tracking-wider text-[#A9BCA7] bg-[#1E2E1D]/80 px-3 py-1 rounded-full border border-[#A9BCA7]/40 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A9BCA7] animate-pulse shrink-0"></span>
                      Buka 08:00 - 21:00 WIB
                    </span>
                  ) : (
                    <span className="text-[9.5px] sm:text-[10.5px] font-sans font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shrink-0"></span>
                      Tutup • Buka 08:00 WIB
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-black text-lg sm:text-2xl md:text-3xl text-white uppercase tracking-wide leading-snug">
                  Siap Berekspresi? Jelajahi Pricelist & Booking!
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-sans">
                  Pilih layanan di bawah untuk melihat rincian paket, tema foto & estimasi biaya:
                </p>
              </div>

              {/* 6 Pilihan Kategori Terurut Sesuai Permintaan */}
              <div className="pt-2 border-t border-[#3A3A3A] relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">

                  {/* 1. Studio Foto (Expandable / Pilihan Studio 1 & Studio 2 Langsung Buka Pricelist) */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 bg-white border transition-all duration-200 text-left relative overflow-hidden shadow-md ${isStudioFotoExpanded
                      ? 'border-[#A9BCA7] ring-2 ring-[#A9BCA7]/50 shadow-lg'
                      : 'border-[#E8DDD6] hover:border-[#A9BCA7]'
                      }`}
                  >
                    <div
                      onClick={toggleStudioFoto}
                      className="cursor-pointer flex items-center justify-between gap-3 select-none"
                    >
                      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 shadow-2xs">
                          <Camera className="w-5 h-5 stroke-[1.8] text-[#6E856C]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] tracking-wider uppercase truncate">
                              STUDIO FOTO
                            </h4>
                            <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7]">
                              Foto Studio
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs font-sans text-[#666666] truncate mt-1">
                            Graduation, Group, Family, Personal, Couple, Maternity
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 text-xs font-serif font-bold uppercase tracking-wider text-[#3A3A3A] bg-[#F2E9E4] hover:bg-[#A9BCA7] hover:text-[#2A2A2A] px-2.5 py-1.5 rounded-xl border border-[#E8DDD6] transition-all">
                        <span className="hidden sm:inline text-[10.5px]">
                          {isStudioFotoExpanded ? 'Tutup' : 'Pilih Studio'}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isStudioFotoExpanded ? 'rotate-180 text-[#6E856C]' : ''
                            }`}
                        />
                      </div>
                    </div>

                    {/* Drawer Pilihan Studio Foto (Muncul saat ditekan & langsung buka pricelist cabang) */}
                    {isStudioFotoExpanded && (
                      <div className="mt-3 pt-3 border-t border-[#E8DDD6] space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center justify-between text-[10.5px] font-sans text-stone-600 font-bold uppercase tracking-wider">
                          <span>PILIH LOKASI STUDIO FOTO:</span>
                          <span className="text-[9.5px] text-[#6E856C] font-mono">Buka 08:00 - 21:00</span>
                        </div>

                        <div className="flex flex-col gap-2">
                          {/* Opsi Studio 1 */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              localStorage.setItem('alviero_expanded_service', 'studio-foto');
                              onSelectBranch('cabang-1');
                            }}
                            className="p-2.5 rounded-xl bg-[#FDFBF7] hover:bg-[#3A3A3A] text-[#3A3A3A] hover:text-white border border-[#E8DDD6] hover:border-[#3A3A3A] transition-all flex items-center justify-between gap-2 shadow-2xs group/b1 cursor-pointer active:scale-98 text-left"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-mono font-bold bg-[#A9BCA7] text-[#2A2A2A] px-1.5 py-0.5 rounded">
                                  Studio 1
                                </span>
                                <span className="font-serif font-bold text-xs">Karangploso</span>
                              </div>
                              <p className="text-[10px] text-stone-500 group-hover/b1:text-stone-300 truncate mt-0.5">
                                Jl. Raya Kertanegara, Karangploso
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-serif font-bold text-[#6E856C] group-hover/b1:text-[#A9BCA7] shrink-0">
                              <span>Buka</span>
                              <ArrowUpRight className="w-4 h-4 stroke-[2] group-hover/b1:translate-x-0.5 group-hover/b1:-translate-y-0.5 transition-transform" />
                            </div>
                          </button>

                          {/* Opsi Studio 2 */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              localStorage.setItem('alviero_expanded_service', 'studio-foto');
                              onSelectBranch('cabang-2');
                            }}
                            className="p-2.5 rounded-xl bg-[#FDFBF7] hover:bg-[#3A3A3A] text-[#3A3A3A] hover:text-white border border-[#E8DDD6] hover:border-[#3A3A3A] transition-all flex items-center justify-between gap-2 shadow-2xs group/b2 cursor-pointer active:scale-98 text-left"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-mono font-bold bg-[#A9BCA7] text-[#2A2A2A] px-1.5 py-0.5 rounded">
                                  Studio 2
                                </span>
                                <span className="font-serif font-bold text-xs">Dinoyo Gajayana</span>
                              </div>
                              <p className="text-[10px] text-stone-500 group-hover/b2:text-stone-300 truncate mt-0.5">
                                Ruko Gajayana, Jl. Simpang Gajayana, Dinoyo
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-serif font-bold text-[#6E856C] group-hover/b2:text-[#A9BCA7] shrink-0">
                              <span>Buka</span>
                              <ArrowUpRight className="w-4 h-4 stroke-[2] group-hover/b2:translate-x-0.5 group-hover/b2:-translate-y-0.5 transition-transform" />
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. SelfStudio (Expandable / Pilihan Studio 1 & Studio 2) */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 bg-white border transition-all duration-200 text-left relative overflow-hidden shadow-md ${isSelfStudioExpanded
                      ? 'border-[#A9BCA7] ring-2 ring-[#A9BCA7]/50 shadow-lg'
                      : 'border-[#E8DDD6] hover:border-[#A9BCA7]'
                      }`}
                  >
                    <div
                      onClick={toggleSelfStudio}
                      className="cursor-pointer flex items-center justify-between gap-3 select-none"
                    >
                      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 shadow-2xs">
                          <Sparkles className="w-5 h-5 stroke-[1.8] text-[#6E856C]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] tracking-wider uppercase truncate">
                              SELFSTUDIO
                            </h4>
                            <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7]">
                              Self Photo
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs font-sans text-[#666666] truncate mt-1">
                            Foto Mandiri dengan Wireless Remote Shutter & Cetak Kolase
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 text-xs font-serif font-bold uppercase tracking-wider text-[#3A3A3A] bg-[#F2E9E4] hover:bg-[#A9BCA7] hover:text-[#2A2A2A] px-2.5 py-1.5 rounded-xl border border-[#E8DDD6] transition-all">
                        <span className="hidden sm:inline text-[10.5px]">
                          {isSelfStudioExpanded ? 'Tutup' : 'Pilih Studio'}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isSelfStudioExpanded ? 'rotate-180 text-[#6E856C]' : ''
                            }`}
                        />
                      </div>
                    </div>

                    {/* Drawer Pilihan Studio untuk SelfStudio */}
                    {isSelfStudioExpanded && (
                      <div className="mt-3 pt-3 border-t border-[#E8DDD6] space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center justify-between text-[10.5px] font-sans text-stone-600 font-bold uppercase tracking-wider">
                          <span>PILIH LOKASI SELFSTUDIO:</span>
                          <span className="text-[9.5px] text-[#6E856C] font-mono">Buka 08:00 - 21:00</span>
                        </div>

                        <div className="flex flex-col gap-2">
                          {/* Opsi Studio 1 */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              localStorage.setItem('alviero_expanded_service', 'selfstudio');
                              if (onSelectCategory) {
                                onSelectCategory('selfstudio', 'cabang-1');
                              } else {
                                onSelectBranch('cabang-1');
                              }
                            }}
                            className="p-2.5 rounded-xl bg-[#FDFBF7] hover:bg-[#3A3A3A] text-[#3A3A3A] hover:text-white border border-[#E8DDD6] hover:border-[#3A3A3A] transition-all flex items-center justify-between gap-2 shadow-2xs group/s1 cursor-pointer active:scale-98 text-left"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-mono font-bold bg-[#A9BCA7] text-[#2A2A2A] px-1.5 py-0.5 rounded">
                                  Studio 1
                                </span>
                                <span className="font-serif font-bold text-xs">Karangploso</span>
                              </div>
                              <p className="text-[10px] text-stone-500 group-hover/s1:text-stone-300 truncate mt-0.5">
                                Jl. Raya Kertanegara, Karangploso
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-serif font-bold text-[#6E856C] group-hover/s1:text-[#A9BCA7] shrink-0">
                              <span>Buka</span>
                              <ArrowUpRight className="w-4 h-4 stroke-[2] group-hover/s1:translate-x-0.5 group-hover/s1:-translate-y-0.5 transition-transform" />
                            </div>
                          </button>

                          {/* Opsi Studio 2 */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              localStorage.setItem('alviero_expanded_service', 'selfstudio');
                              if (onSelectCategory) {
                                onSelectCategory('selfstudio', 'cabang-2');
                              } else {
                                onSelectBranch('cabang-2');
                              }
                            }}
                            className="p-2.5 rounded-xl bg-[#FDFBF7] hover:bg-[#3A3A3A] text-[#3A3A3A] hover:text-white border border-[#E8DDD6] hover:border-[#3A3A3A] transition-all flex items-center justify-between gap-2 shadow-2xs group/s2 cursor-pointer active:scale-98 text-left"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-mono font-bold bg-[#A9BCA7] text-[#2A2A2A] px-1.5 py-0.5 rounded">
                                  Studio 2
                                </span>
                                <span className="font-serif font-bold text-xs">Dinoyo Gajayana</span>
                              </div>
                              <p className="text-[10px] text-stone-500 group-hover/s2:text-stone-300 truncate mt-0.5">
                                Ruko Gajayana, Jl. Simpang Gajayana, Dinoyo
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-serif font-bold text-[#6E856C] group-hover/s2:text-[#A9BCA7] shrink-0">
                              <span>Buka</span>
                              <ArrowUpRight className="w-4 h-4 stroke-[2] group-hover/s2:translate-x-0.5 group-hover/s2:-translate-y-0.5 transition-transform" />
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Cetak & Bingkai */}
                  <div
                    onClick={() => onSelectCategory ? onSelectCategory('bingkai-album') : onSelectBranch(selectedBranch)}
                    className="rounded-2xl p-4 sm:p-5 bg-white hover:bg-[#F2E9E4] border border-[#E8DDD6] hover:border-[#A9BCA7] transition-all duration-200 cursor-pointer group text-left relative overflow-hidden flex items-center justify-between gap-3 sm:gap-4 shadow-md hover:shadow-lg active:scale-98"
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                        <ImageIcon className="w-5 h-5 stroke-[1.8] text-[#6E856C]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] tracking-wider uppercase truncate">
                            CETAK & BINGKAI
                          </h4>
                          <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7]">
                            Lab & Frame
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs font-sans text-[#666666] truncate mt-1">
                          Cetak Lab Anti-Luntur, Bingkai Kayu & Album Hardcover
                        </p>
                      </div>
                    </div>

                    <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1 shrink-0 group-hover:text-[#6E856C]">
                      <span className="hidden xl:inline text-[11px]">Lihat</span>
                      <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>

                  {/* 4. Wedding & Prewedding */}
                  <div
                    onClick={() => onSelectCategory ? onSelectCategory('wedding-package') : onSelectBranch(selectedBranch)}
                    className="rounded-2xl p-4 sm:p-5 bg-white hover:bg-[#F2E9E4] border border-[#E8DDD6] hover:border-[#A9BCA7] transition-all duration-200 cursor-pointer group text-left relative overflow-hidden flex items-center justify-between gap-3 sm:gap-4 shadow-md hover:shadow-lg active:scale-98"
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                        <HeartHandshake className="w-5 h-5 stroke-[1.8] text-[#6E856C]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] tracking-wider uppercase truncate">
                            WEDDING & PREWEDDING OUTDOOR
                          </h4>
                          <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7]">
                            Suite
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs font-sans text-[#666666] truncate mt-1">
                          Paket Prewedding Outdoor/Studio, Akad Nikah & Resepsi
                        </p>
                      </div>
                    </div>

                    <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1 shrink-0 group-hover:text-[#6E856C]">
                      <span className="hidden xl:inline text-[11px]">Lihat</span>
                      <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>

                  {/* 5. Mua & Kebaya */}
                  <div
                    onClick={() => onSelectCategory ? onSelectCategory('kebayak-gaun') : onSelectBranch(selectedBranch)}
                    className="rounded-2xl p-4 sm:p-5 bg-white hover:bg-[#F2E9E4] border border-[#E8DDD6] hover:border-[#A9BCA7] transition-all duration-200 cursor-pointer group text-left relative overflow-hidden flex items-center justify-between gap-3 sm:gap-4 shadow-md hover:shadow-lg active:scale-98"
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                        <Palette className="w-5 h-5 stroke-[1.8] text-[#6E856C]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] tracking-wider uppercase truncate">
                            MUA & KEBAYA
                          </h4>
                          <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7]">
                            Wardrobe
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs font-sans text-[#666666] truncate mt-1">
                          Sewa Kebaya Modern, Gaun Wisuda & Paket MUA Profesional
                        </p>
                      </div>
                    </div>

                    <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1 shrink-0 group-hover:text-[#6E856C]">
                      <span className="hidden xl:inline text-[11px]">Lihat</span>
                      <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>

                  {/* 6. Event */}
                  <div
                    onClick={() => onSelectCategory ? onSelectCategory('event') : onSelectBranch(selectedBranch)}
                    className="rounded-2xl p-4 sm:p-5 bg-white hover:bg-[#F2E9E4] border border-[#E8DDD6] hover:border-[#A9BCA7] transition-all duration-200 cursor-pointer group text-left relative overflow-hidden flex items-center justify-between gap-3 sm:gap-4 shadow-md hover:shadow-lg active:scale-98"
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                        <Calendar className="w-5 h-5 stroke-[1.8] text-[#6E856C]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] tracking-wider uppercase truncate">
                            EVENT
                          </h4>
                          <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7]">
                            Event
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs font-sans text-[#666666] truncate mt-1">
                          Dokumentasi Birthday, Gathering, Seminar & Komunitas
                        </p>
                      </div>
                    </div>

                    <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1 shrink-0 group-hover:text-[#6E856C]">
                      <span className="hidden xl:inline text-[11px]">Lihat</span>
                      <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>

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
            <div className={`px-3.5 py-1.5 border flex items-center gap-2 text-[10.5px] ${isOpen
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

            {/* Quick Text Links with Logos / Icons */}
            <div className="flex items-center gap-4 sm:gap-6 font-sans text-[11px] text-stone-300 flex-wrap justify-center">
              <a
                href="https://instagram.com/alvierostudiofoto"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors group"
              >
                <Instagram className="w-3.5 h-3.5 text-[#A9BCA7] group-hover:text-white transition-colors shrink-0" />
                <span>Instagram</span>
              </a>
              <a
                href="https://tiktok.com/@alvierostudiofoto"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors group"
              >
                <svg className="w-3.5 h-3.5 fill-[#A9BCA7] group-hover:fill-white transition-colors shrink-0" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.83-4.47V8.9a8.18 8.18 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.83-.33z"/>
                </svg>
                <span>Tiktok</span>
              </a>
              <a
                href="https://wa.me/6287777538164?text=Halo%20Admin%20Alviero%20Studio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors group"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#A9BCA7] group-hover:text-white transition-colors shrink-0" />
                <span>WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
              >
                <MapPin className="w-3.5 h-3.5 text-[#A9BCA7] group-hover:text-white transition-colors shrink-0" />
                <span>Lokasi Studio</span>
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

      {/* Pop-up Detail Promo (Gaya Aplikasi PLN Mobile) */}
      <PromoDetailModal
        promo={selectedPromoModal}
        onClose={() => setSelectedPromoModal(null)}
        onApplyPromo={(promoCode, packageId) => {
          setSelectedPromoModal(null);
          if (onOpenBooking) {
            onOpenBooking(promoCode, packageId);
          } else {
            onSelectBranch(selectedBranch);
          }
        }}
        selectedBranch={selectedBranch}
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
      <div className="bg-[#FDFBF7] max-w-xl w-full rounded-2xl sm:rounded-3xl border border-[#E8DDD6] shadow-2xl overflow-hidden flex flex-col my-auto relative">

        {/* Minimalist Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8DDD6] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] text-[#3A3A3A] flex items-center justify-center border border-[#E8DDD6] shadow-2xs">
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
              className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-[#3A3A3A] text-stone-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#E8DDD6]"
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
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative group text-left ${isSelected
                  ? 'bg-white border-[#3A3A3A] ring-1 ring-[#3A3A3A] shadow-md'
                  : 'bg-[#FAF8F5] hover:bg-white border-[#E8DDD6] hover:border-[#3A3A3A] shadow-2xs'
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Clean Left Icon Container */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors shadow-2xs ${isSelected ? 'bg-[#3A3A3A] text-white border-[#3A3A3A]' : 'bg-[#FDFBF7] text-[#3A3A3A] border-[#E8DDD6]'
                      }`}>
                      <MapPin className={`w-5 h-5 stroke-[1.8] ${isSelected ? 'text-[#A9BCA7]' : 'text-[#6E856C]'}`} />
                    </div>

                    {/* Main Studio Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#3A3A3A] uppercase tracking-wide">
                          {branch.name}
                        </h4>
                        <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${isSelected ? 'bg-[#3A3A3A] text-white border-[#3A3A3A]' : 'bg-[#EBF2EA] text-[#6E856C] border-[#A9BCA7]'
                          }`}>
                          {branch.badge}
                        </span>
                      </div>

                      <p className="text-xs font-sans text-[#666666] font-normal leading-relaxed mt-1">
                        {branch.address}
                      </p>

                      {/* Fasilitas Cabang */}
                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        <span className="text-[10px] bg-white text-stone-700 px-2.5 py-0.5 rounded-full border border-[#E8DDD6] font-medium shadow-2xs">
                          ✓ Pro Studio Lighting
                        </span>
                        <span className="text-[10px] bg-white text-stone-700 px-2.5 py-0.5 rounded-full border border-[#E8DDD6] font-medium shadow-2xs">
                          ✓ 7+ Background
                        </span>
                        <span className="text-[10px] bg-white text-stone-700 px-2.5 py-0.5 rounded-full border border-[#E8DDD6] font-medium shadow-2xs">
                          ✓ Ruang AC
                        </span>
                      </div>

                      {/* Link Maps */}
                      <a
                        href={branch.mapsUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 mt-2.5 text-[11px] font-sans font-semibold text-[#6E856C] hover:text-[#3A3A3A] underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        <span>Buka Petunjuk Arah di Google Maps</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Radio Indicator */}
                  <div className="pt-1 shrink-0">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-[#3A3A3A] bg-[#3A3A3A]' : 'border-stone-400 bg-transparent'
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
