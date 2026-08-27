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
  MessageCircle
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
 * Hero Slider Banner Backdrop Studio (Desain Tegas, Modern, Responsif Mobile & Desktop)
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
      className="relative w-full overflow-hidden select-none bg-white group flex flex-col border-b border-[#E0D9CE]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Top Minimalist Navbar (Tegas & Mewah - Hanya Tampil di Mobile, Desktop Menggunakan Header Utama) */}
      <div className="w-full bg-white px-4 py-3 sm:px-8 flex lg:hidden items-center justify-center border-b border-[#E0D9CE] z-30">
        <div className="flex items-center gap-2">
          <span className="font-serif font-black text-base sm:text-xl tracking-[0.3em] text-[#1C1A17] uppercase">
            ALVIERO
          </span>
        </div>
      </div>

      {/* 2. Full Image Banner Container (Bersih Tanpa Teks yang Menutupi Foto) */}
      <div className="w-full h-72 sm:h-84 md:h-[440px] lg:h-[500px] relative overflow-hidden bg-[#1C1A17]">
        {/* Slide Photo with Smooth Transition */}
        <img
          key={activeSlide.id}
          src={activeSlide.image}
          alt={activeSlide.title}
          className="w-full h-full object-cover object-center transition-all duration-700 animate-in fade-in"
        />

        {/* Subtle Bottom Gradient for Caption & Controls Only */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Bottom Left Backdrop Theme Label */}
        <div className="absolute bottom-3.5 left-3.5 sm:left-6 z-20 text-left pointer-events-none">
          <span className="inline-block text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase bg-black/70 px-2.5 py-1 border border-[#D4AF37]/50 backdrop-blur-xs">
            {activeSlide.theme}
          </span>
          <p className="text-xs sm:text-sm font-serif text-white font-bold drop-shadow-md mt-1">
            {activeSlide.title}
          </p>
        </div>

        {/* Manual Arrow Controls (Sudut Tegas) */}
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
          {BACKDROP_BANNER_IMAGES.map((slide, idx) => {
            const isActive = currentIdx === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all cursor-pointer ${
                  isActive
                    ? 'w-6 h-0.5 bg-[#D4AF37]'
                    : 'w-2 h-0.5 bg-white/40 hover:bg-white'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 3. Hero Content Container (Penjelasan Singkat Studio & Fasilitas Mewah Lengkap) */}
      <div className="w-full bg-white px-4 py-6 sm:py-8 md:py-10 text-center flex flex-col items-center justify-center space-y-2.5 sm:space-y-3.5 border-t border-[#E0D9CE]">
        <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#8C6D46] uppercase bg-[#FAF8F5] px-3 py-1 border border-[#E0D9CE]">
          ALVIERO PHOTO STUDIO
        </span>

        <h2 className="font-serif font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#1C1A17] leading-tight tracking-wide uppercase max-w-2xl">
          Studio Foto Modern dengan Fasilitas Mewah & Terlengkap
        </h2>
        
        <p className="font-serif font-semibold text-xs sm:text-sm md:text-base text-[#8C6D46] tracking-[0.18em] uppercase">
          Kenyamanan Maksimal • Kualitas Visual Premium
        </p>

        <p className="font-sans text-xs sm:text-sm md:text-base text-[#5C5650] max-w-2xl mx-auto leading-relaxed">
          Alviero Studio menghadirkan pengalaman fotografi profesional dengan ruang ber-AC sejuk, 7+ pilihan tema background estetis, tata lampu Godox Studio Pro, monitor live-view realtime untuk melihat hasil jepretan seketika, serta private dressing room & koleksi toga wisuda siap pakai.
        </p>

        {/* Highlight Fasilitas Mewah */}
        <div className="pt-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-[10.5px] sm:text-xs font-sans font-medium text-stone-700">
          <span className="bg-[#FAF8F5] px-2.5 py-1 border border-[#E0D9CE] flex items-center gap-1.5">
            <span className="text-[#D4AF37] font-bold">✦</span> Full AC & Ruang Ganti Privat
          </span>
          <span className="bg-[#FAF8F5] px-2.5 py-1 border border-[#E0D9CE] flex items-center gap-1.5">
            <span className="text-[#D4AF37] font-bold">✦</span> Live-View Monitor Realtime
          </span>
          <span className="bg-[#FAF8F5] px-2.5 py-1 border border-[#E0D9CE] flex items-center gap-1.5">
            <span className="text-[#D4AF37] font-bold">✦</span> Lighting Godox Studio Pro
          </span>
          <span className="bg-[#FAF8F5] px-2.5 py-1 border border-[#E0D9CE] flex items-center gap-1.5">
            <span className="text-[#D4AF37] font-bold">✦</span> Toga Wisuda & Properti Siap Pakai
          </span>
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
    <div className="pt-5 pb-1 border-t border-[#E0D9CE] space-y-3 relative">
      <div className="text-center space-y-0.5">
        <h3 className="font-serif text-xs sm:text-sm font-bold tracking-[0.2em] text-[#1C1A17] uppercase">
          WHAT OUR CLIENTS SAY
        </h3>
        <p className="text-[11px] font-sans text-[#736B63]">
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
          className="absolute -left-1 sm:left-0 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white text-[#1C1A17] hover:bg-[#1C1A17] hover:text-white shadow-sm border border-[#D5CEC2] flex items-center justify-center cursor-pointer z-10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Tombol Panah Kanan (>) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Reviews"
          className="absolute -right-1 sm:right-0 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white text-[#1C1A17] hover:bg-[#1C1A17] hover:text-white shadow-sm border border-[#D5CEC2] flex items-center justify-center cursor-pointer z-10 transition-colors"
        >
          <ChevronRight className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Review Cards (Grid 2 Kolom di Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 px-2 sm:px-4">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="relative bg-white p-3.5 sm:p-4.5 border border-[#E0D9CE] shadow-2xs pl-16 sm:pl-20 animate-in fade-in duration-300 flex flex-col justify-between"
            >
              {/* Foto Avatar Melingkar Rapi */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-13 h-13 sm:w-15 sm:h-15 bg-stone-900 border-2 border-white shadow-sm overflow-hidden shrink-0">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Watermark Tanda Kutip (Quote) */}
              <div className="absolute top-1.5 left-14 sm:left-17 text-2xl sm:text-3xl font-serif text-[#D8CFBF] select-none leading-none opacity-40">
                “
              </div>

              {/* Konten Review */}
              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1C1A17] uppercase tracking-wider leading-tight">
                    {review.name}
                  </h4>
                </div>

                {/* Bintang Rating (5 Stars) */}
                <div className="flex items-center gap-0.5 text-amber-500 text-xs leading-none">
                  {'★★★★★'}
                </div>

                <div className="h-px bg-[#EFEAE2] my-1" />

                {/* Teks Testimonial */}
                <p className="text-[10.5px] sm:text-[11px] font-sans text-[#5C5650] leading-relaxed line-clamp-4">
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
 * Data Tur & Informasi Edukasi Lengkap Ruang Studio Alviero (Sesuai Referensi StudioJakarta)
 */
export interface StudioRoomData {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  branchId: StudioBranch;
  images: {
    src: string;
    caption: string;
    tag: string;
  }[];
  dimensions: string;
  capacity: string;
  lightingSetup: string;
  backdrops: string;
  description: string;
  highlights: string[];
}

export const STUDIO_ROOMS_DATA: StudioRoomData[] = [
  {
    id: 'studio-1',
    name: 'STUDIO 1 — KARANGPLOSO',
    badge: 'COMPLETE MEDIUM & WISUDA STUDIO',
    tagline: 'Studio Utama Serbaguna Lantai Dasar dengan Live-View Monitor & Lighting Godox Pro',
    branchId: 'cabang-1',
    images: [
      {
        src: '/images/backdrops/backdrop-5.jpg',
        caption: 'European Royal Fireplace & Frame — Set Mewah Formal',
        tag: 'ROYAL FIREPLACE'
      },
      {
        src: '/images/backdrops/backdrop-1.jpg',
        caption: 'Mint Modern Aesthetic Sofa Theme — Cocok untuk Wisuda & Keluarga',
        tag: 'MINT AESTHETIC'
      },
      {
        src: '/images/backdrops/backdrop-4.jpg',
        caption: 'Charcoal Deep Classic Sofa — Elegan, Formal & Timeless',
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
    ],
    dimensions: 'Luas 7m x 5m | Ceiling 3.5m (Lantai Dasar Tanpa Tangga)',
    capacity: '1 - 20 Orang (Sangat nyaman untuk grup wisuda, keluarga & prewedding)',
    lightingSetup: '4 Set Lampu Studio Godox Highspeed + Octagon 120cm + RGB Tube Lighting',
    backdrops: '7+ Tema Background Permanen & Varian Seamless Background Paper',
    description: 'Studio lantai dasar serbaguna dengan full AC, tata lampu Godox Studio Pro, monitor live-view realtime, dan 7+ tema background estetis. Sangat nyaman untuk sesi foto wisuda, keluarga, dan group.',
    highlights: [
      'Akses Lantai Dasar Tanpa Tangga',
      'Monitor Live-View Preview Realtime',
      'Full AC Sejuk & Fitting Room Bersih',
      'Koleksi Toga Wisuda & Properti Siap Pakai',
      'Parkir Mobil & Motor Luas'
    ]
  },
  {
    id: 'studio-2',
    name: 'STUDIO 2 — CABANG EKSKLUSIF',
    badge: 'PREMIUM SUITE & INTIMATE WEDDING',
    tagline: 'Studio Lebih Luas dengan Private Dressing Suite & Set Prewedding Mewah',
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
    ],
    dimensions: 'Luas 9m x 6m | Ceiling 4.0m (Ruang Shooting Lebih Lega)',
    capacity: '1 - 25 Orang (Cocok untuk keluarga besar, prewedding gaun lebar & group)',
    lightingSetup: '6 Set Lampu Studio Godox Multi-Strobe + Softbox Strip + Barndoors',
    backdrops: 'Set Arch Window Luxury, Bohemian Wall & Seamless Background',
    description: 'Studio eksklusif berarea luas dan ceiling tinggi dengan private dressing suite ber-AC, vanity mirror Hollywood, dan set background mewah untuk foto wedding, prewedding & keluarga.',
    highlights: [
      'Area Shooting Lebih Luas & Ceiling Tinggi',
      'Private Dressing Suite Ber-AC',
      'Cermin Vanity Hollywood Mewah',
      'Fitting Gaun / Kebaya Pengantin Lengkap',
      'Asisten Studio Standby'
    ]
  },
  {
    id: 'self-studio',
    name: 'SELF STUDIO MANDIRI',
    badge: '100% PRIVATE WIRELESS BOOTH',
    tagline: 'Sesi Foto Bebas Tanpa Fotografer dengan Remote Shutter Nirkabel & Cetak Instan',
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
    ],
    dimensions: 'Luas 5m x 4m (Ruang Tertutup & Terjaga Privasinya)',
    capacity: '1 - 8 Orang (Sangat seru untuk pasangan, bestie & solo)',
    lightingSetup: 'Godox Studio Flash + Softbox Diffuser Siap Pakai Tanpa Setting Manual',
    backdrops: 'Pilihan Background Grey, White, Cream & Pastel Aesthetic',
    description: 'Bilik foto 100% private dengan remote shutter nirkabel dan monitor preview realtime. Bebas berekspresi tanpa canggung, langsung dapat cetak photo strip dan all-file HD.',
    highlights: [
      'Remote Shutter Nirkabel Responsif',
      'Monitor Preview Realtime Besar',
      'Bebas Berekspresi Tanpa Canggung',
      'Semua File Asli HD via Google Drive',
      'Cetak Instan Photo Strip Eksklusif'
    ]
  }
];

/**
 * Komponen Edukasi Tur Studio & Spesifikasi Lengkap (Improvisasi dari Referensi StudioJakarta)
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
    <div className="space-y-4 pt-4 pb-1 border-t border-[#E0D9CE]">
      {/* Header Edukasi dengan Garis Aksen Emas */}
      <div className="space-y-2 text-left">
        <div className="border-b-2 border-[#8C6D46] pb-2 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[9.5px] font-sans font-bold tracking-[0.2em] text-[#8C6D46] uppercase block">
              STUDIO SPECIFICATIONS & FACILITIES
            </span>
            <h3 className="font-serif text-sm sm:text-base font-bold tracking-wider text-[#1C1A17] uppercase mt-0.5">
              EDUKASI RUANG & SPESIFIKASI STUDIO
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9.5px] bg-[#FAF8F5] text-stone-700 px-2 py-0.5 border border-[#D5CEC2] font-semibold uppercase">
              Pro Godox Gear
            </span>
            <span className="text-[9.5px] bg-emerald-50 text-emerald-800 px-2 py-0.5 border border-emerald-200 font-semibold uppercase">
              Full AC
            </span>
          </div>
        </div>

        {/* Tab Pilihan Studio & Express Booking */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          {/* Tombol Tab Ruang Studio */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {STUDIO_ROOMS_DATA.map((room) => {
              const isActive = activeRoomId === room.id;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => {
                    setActiveRoomId(room.id);
                    setCurrentSlideIdx(0);
                    onSelectBranch(room.branchId);
                  }}
                  className={`px-3 py-1.5 text-[10px] sm:text-[10.5px] font-sans font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1C1A17] text-white border-[#1C1A17] shadow-xs'
                      : 'bg-white text-stone-700 border-[#D5CEC2] hover:border-[#1C1A17]'
                  }`}
                >
                  {room.name.replace('STUDIO ', 'STUDIO ').split('—')[0]}
                </button>
              );
            })}
          </div>


        </div>
      </div>

      {/* Interactive Photo Slider & Edukasi Ruang (Side-by-side 2 Kolom di Desktop, Stack di Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
        
        {/* Kolom Kiri: Photo Slider (7 Kolom di Desktop) */}
        <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[480px] bg-[#1C1A17] overflow-hidden border border-[#E0D9CE] group flex flex-col justify-between">
          <img
            key={`${activeRoom.id}-${currentSlideIdx}`}
            src={activeSlide.src}
            alt={activeSlide.caption}
            className="absolute inset-0 w-full h-full object-cover object-center animate-in fade-in duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />

          {/* Tag Overlay di Atas */}
          <div className="relative top-3.5 left-3.5 z-10">
            <span className="inline-block text-[8.5px] sm:text-[9.5px] font-bold tracking-widest text-[#D4AF37] uppercase bg-black/70 px-3 py-1 border border-[#D4AF37]/50 backdrop-blur-xs">
              {activeSlide.tag}
            </span>
          </div>

          {/* Caption & Indikator di Bawah */}
          <div className="relative z-10 p-3.5 sm:p-4 flex items-end justify-between gap-3 text-left">
            <p className="text-xs sm:text-sm font-sans text-white font-medium drop-shadow-md truncate max-w-[80%]">
              {activeSlide.caption}
            </p>

            <div className="flex items-center gap-1 bg-black/60 px-2 py-1 border border-white/20 shrink-0">
              {activeRoom.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIdx(idx)}
                  className={`transition-all cursor-pointer ${
                    currentSlideIdx === idx ? 'w-5 h-0.5 bg-[#D4AF37]' : 'w-1.5 h-0.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tombol Panah Kiri (<) */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous Photo"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/30 z-20 cursor-pointer transition-all active:scale-90"
          >
            <ChevronLeft className="w-4.5 h-4.5 stroke-[2]" />
          </button>

          {/* Tombol Panah Kanan (>) */}
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next Photo"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/30 z-20 cursor-pointer transition-all active:scale-90"
          >
            <ChevronRight className="w-4.5 h-4.5 stroke-[2]" />
          </button>
        </div>

        {/* Kolom Kanan: Kartu Informasi & Edukasi Ruang (5 Kolom di Desktop) */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-6 border border-[#E0D9CE] flex flex-col justify-between space-y-3.5 text-left">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base md:text-lg text-[#1C1A17] uppercase tracking-wide">
                  {activeRoom.name} <span className="text-stone-400">|</span>{' '}
                  <span className="text-[#8C6D46]">{activeRoom.badge}</span>
                </h4>
                <p className="text-xs font-sans font-semibold text-stone-600 mt-0.5">
                  {activeRoom.tagline}
                </p>
              </div>
            </div>

            {/* Paragraf Deskripsi Edukasi yang Lengkap */}
            <p className="text-[11.5px] sm:text-xs font-sans text-[#5C5650] leading-relaxed">
              {activeRoom.description}
            </p>
          </div>

          {/* Spesifikasi Teknis Studio (Grid 2 Kolom) */}
          <div className="pt-2 border-t border-[#EFEAE2] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans text-[#4A433A]">
            <div className="bg-[#FAF8F5] p-2.5 border border-[#E0D9CE]">
              <span className="font-bold text-[#1C1A17] block">📐 Dimensi & Akses:</span>
              <span className="text-stone-600">{activeRoom.dimensions}</span>
            </div>
            <div className="bg-[#FAF8F5] p-2.5 border border-[#E0D9CE]">
              <span className="font-bold text-[#1C1A17] block">👥 Kapasitas:</span>
              <span className="text-stone-600">{activeRoom.capacity}</span>
            </div>
            <div className="bg-[#FAF8F5] p-2.5 border border-[#E0D9CE]">
              <span className="font-bold text-[#1C1A17] block">💡 Lighting Setup:</span>
              <span className="text-stone-600">{activeRoom.lightingSetup}</span>
            </div>
            <div className="bg-[#FAF8F5] p-2.5 border border-[#E0D9CE]">
              <span className="font-bold text-[#1C1A17] block">🎨 Pilihan Background:</span>
              <span className="text-stone-600">{activeRoom.backdrops}</span>
            </div>
          </div>

          {/* Highlights Checklist */}
          <div className="pt-2 border-t border-[#EFEAE2] flex items-center gap-1.5 flex-wrap text-[10.5px] font-sans font-medium text-stone-700">
            {activeRoom.highlights.map((highlight, idx) => (
              <span key={idx} className="bg-stone-50 px-2 py-0.5 border border-[#E0D9CE] flex items-center gap-1">
                <span className="text-emerald-700 font-bold">✓</span>
                {highlight}
              </span>
            ))}
          </div>


        </div>

      </div>

      {/* Facility Highlights Footer (Sesuai Referensi StudioJakarta) */}
      <div className="p-3.5 bg-white border border-[#E0D9CE] text-center">
        <p className="font-sans font-semibold text-xs sm:text-sm text-[#1C1A17] leading-relaxed">
          <span className="font-bold">Fully Air-Conditioned</span> <span className="text-[#8C6D46] font-bold">|</span>{' '}
          <span className="font-bold">Professional Lighting & Equipment</span> <span className="text-[#8C6D46] font-bold">|</span>{' '}
          <span className="font-bold">Props Collection Ready to Use</span> <span className="text-[#8C6D46] font-bold">|</span>{' '}
          <span className="font-bold">Standby Studio Assistant</span>
        </p>
        <div className="h-0.5 bg-[#8C6D46] w-28 mx-auto mt-2" />
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

  return (
    <div className="w-full max-w-[1440px] mx-auto my-0 sm:my-4 md:my-6 px-0 sm:px-4 md:px-8 lg:px-12 animate-in fade-in duration-300">
      <div className="bg-[#FAF8F5] border-x-0 sm:border sm:border-[#D5CEC2] shadow-none sm:shadow-xl overflow-hidden flex flex-col relative w-full">
        
        {/* Top Hero Banner Slider */}
        <BackdropHeroSlider onViewPlans={() => onSelectBranch(selectedBranch)} />

        {/* Content Area */}
        <div className="p-3.5 sm:p-6 md:p-8 lg:p-10 space-y-6 md:space-y-8 bg-[#FAF8F5] flex-1">
          
          {/* 1. Why Choose Alviero Studio? (Grid 4 Kolom di Desktop, Diposisikan di Atas Tur Edukasi) */}
          <div className="pb-1 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-sm sm:text-base font-bold tracking-[0.2em] text-[#1C1A17] uppercase">
                WHY CHOOSE ALVIERO STUDIO?
              </h3>
              <p className="text-xs font-sans text-[#736B63]">
                Kenyamanan, kualitas visual premium & pelayanan terpercaya
              </p>
            </div>

            {/* 6 Kolom di Desktop, 3 Kolom di Tablet, 2 Kolom di Mobile */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 text-center">
              {/* Item 1: Fast and convenient */}
              <div className="p-3.5 sm:p-4 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-9 h-9 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center mb-2">
                  <Clock className="w-4.5 h-4.5 stroke-[1.6]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#1C1A17] uppercase tracking-wider leading-tight">
                  Fast & Convenient
                </h4>
                <p className="text-[10.5px] font-sans text-[#736B63] leading-relaxed mt-1.5">
                  Booking instan tanpa antre, jadwal pasti & all-file HD via Google Drive.
                </p>
              </div>

              {/* Item 2: Style and function */}
              <div className="p-3.5 sm:p-4 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-9 h-9 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center mb-2">
                  <Sliders className="w-4.5 h-4.5 stroke-[1.6]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#1C1A17] uppercase tracking-wider leading-tight">
                  Style & Function
                </h4>
                <p className="text-[10.5px] font-sans text-[#736B63] leading-relaxed mt-1.5">
                  7+ tema background estetik, lighting Godox studio & arahan pose natural.
                </p>
              </div>

              {/* Item 3: Live-View Preview */}
              <div className="p-3.5 sm:p-4 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-9 h-9 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center mb-2">
                  <Camera className="w-4.5 h-4.5 stroke-[1.6]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#1C1A17] uppercase tracking-wider leading-tight">
                  Live-View Preview
                </h4>
                <p className="text-[10.5px] font-sans text-[#736B63] leading-relaxed mt-1.5">
                  Monitor realtime besar untuk cek hasil jepretan dan pose langsung seketika.
                </p>
              </div>

              {/* Item 4: Fasilitas Lengkap */}
              <div className="p-3.5 sm:p-4 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-9 h-9 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center mb-2">
                  <Sparkles className="w-4.5 h-4.5 stroke-[1.6]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#1C1A17] uppercase tracking-wider leading-tight">
                  Fasilitas Lengkap
                </h4>
                <p className="text-[10.5px] font-sans text-[#736B63] leading-relaxed mt-1.5">
                  Full AC sejuk, fitting room privat, toga wisuda & aneka properti siap pakai.
                </p>
              </div>

              {/* Item 5: Reflect your lifestyle */}
              <div className="p-3.5 sm:p-4 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-9 h-9 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center mb-2">
                  <Layers className="w-4.5 h-4.5 stroke-[1.6]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#1C1A17] uppercase tracking-wider leading-tight">
                  Reflect Lifestyle
                </h4>
                <p className="text-[10.5px] font-sans text-[#736B63] leading-relaxed mt-1.5">
                  Paket wisuda, wedding, self studio, family, hingga cetak frame kayu eksklusif.
                </p>
              </div>

              {/* Item 6: Continuous support */}
              <div className="p-3.5 sm:p-4 bg-white hover:bg-[#FCFBF9] border border-[#E0D9CE] flex flex-col items-center justify-start transition-all duration-200">
                <div className="w-9 h-9 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center mb-2">
                  <HeartHandshake className="w-4.5 h-4.5 stroke-[1.6]" />
                </div>
                <h4 className="font-serif font-bold text-xs text-[#1C1A17] uppercase tracking-wider leading-tight">
                  Continuous Support
                </h4>
                <p className="text-[10.5px] font-sans text-[#736B63] leading-relaxed mt-1.5">
                  Konsultasi konsep, outfit, & fitting kebaya/gaun gratis dengan admin ramah.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Client Reviews & Testimonials Carousel (Diposisikan di Atas Tur Edukasi Ruang) */}
          <div className="pt-4 border-t border-[#E0D9CE]">
            <ClientReviewCarousel />
          </div>

          {/* 3. Spesifikasi Studio & Edukasi Ruang Lengkap (Dari Referensi StudioJakarta) */}
          <div className="pt-4 border-t border-[#E0D9CE]">
            <StudioTourAndEducationShowcase 
              selectedBranch={selectedBranch}
              onSelectBranch={onSelectBranch}
              onSelectCategory={onSelectCategory}
            />
          </div>

          {/* 4. Lokasi Studio Aktif & Layanan Wedding / Cetak (Grid 3 Kolom Sejajar & Eye-Catching) */}
          <div className="pt-4 pb-1 border-t border-[#E0D9CE] space-y-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
              
              {/* Kolom 1: Lokasi Studio Aktif (Hero Obsidian Card yang Eye-Catching) */}
              <div className="space-y-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between px-0.5">
                  <span className="font-serif text-[11px] font-bold tracking-[0.2em] text-[#1C1A17] uppercase flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8C6D46]" />
                    LOKASI STUDIO AKTIF
                  </span>
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    08:00 - 21:00 WIB
                  </span>
                </div>

                <div
                  onClick={() => setIsModalOpen(true)}
                  className="w-full p-4 sm:p-4.5 bg-[#1C1A17] hover:bg-[#25221E] text-white border border-[#332F2A] hover:border-[#D4AF37] transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 text-left group flex-1 shadow-md hover:shadow-xl relative overflow-hidden"
                >
                  {/* Gold Left Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D4AF37]" />

                  <div className="flex items-center gap-3.5 min-w-0 pl-1.5">
                    <div className="w-11 h-11 bg-[#2D2A26] border border-[#4A453E] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:border-[#D4AF37] transition-all">
                      <MapPin className="w-5 h-5 stroke-[2] text-[#D4AF37]" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif font-bold text-sm sm:text-base text-white leading-tight block truncate group-hover:text-[#D4AF37] transition-colors">
                          {selectedBranchData.name}
                        </span>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                          {selectedBranchData.badge}
                        </span>
                      </div>
                      <p className="text-[11.5px] font-sans text-stone-300 truncate">
                        {selectedBranchData.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-serif font-bold uppercase tracking-wider text-[#1C1A17] bg-[#D4AF37] hover:bg-white px-3.5 py-2 transition-all shrink-0 shadow-xs group-hover:scale-105">
                    <span>Ganti</span>
                    <span className="text-xs">▾</span>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Pricelist Wedding & Prewedding (Eye-Catching Luxury Champagne Card) */}
              <div className="space-y-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between px-0.5">
                  <span className="font-serif text-[11px] font-bold tracking-[0.2em] text-[#1C1A17] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C6D46]" />
                    WEDDING & PREWEDDING
                  </span>
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#8C6D46] bg-[#FAF8F5] px-2.5 py-0.5 border border-[#E0D9CE]">
                    Special Suite
                  </span>
                </div>

                <div
                  onClick={() => onSelectCategory ? onSelectCategory('wedding-package') : onSelectBranch(selectedBranch)}
                  className="w-full p-4 sm:p-4.5 bg-gradient-to-br from-white to-[#FAF6F0] hover:to-[#F5EFE6] border border-[#D8CEBF] hover:border-[#1C1A17] transition-all duration-300 cursor-pointer group text-left relative overflow-hidden flex items-center justify-between gap-3 flex-1 shadow-sm hover:shadow-xl"
                >
                  {/* Gold Left Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8C6D46]" />

                  <div className="flex items-center gap-3.5 min-w-0 pl-1.5">
                    <div className="w-11 h-11 bg-[#FAF8F5] border border-[#D5CEC2] text-[#8C6D46] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:border-[#8C6D46] transition-all">
                      <Sparkles className="w-5 h-5 stroke-[2] text-[#8C6D46]" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1A17] tracking-wider uppercase truncate group-hover:text-[#8C6D46] transition-colors">
                          PRICELIST WEDDING
                        </h4>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#8C6D46]/10 text-[#8C6D46] border border-[#8C6D46]/30">
                          Exclusive
                        </span>
                      </div>
                      <p className="text-[11.5px] font-sans text-[#5C5650] font-normal truncate">
                        Prewedding, Akad, Resepsi & Engagement
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-serif font-bold uppercase tracking-wider text-white bg-[#1C1A17] group-hover:bg-[#8C6D46] px-3.5 py-2 flex items-center gap-1.5 shrink-0 transition-all shadow-xs group-hover:scale-105">
                    <span>Lihat</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>

              {/* Kolom 3: Pricelist Cetak & Bingkai (Eye-Catching Art Frame Card) */}
              <div className="space-y-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between px-0.5">
                  <span className="font-serif text-[11px] font-bold tracking-[0.2em] text-[#1C1A17] uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#8C6D46]" />
                    CETAK LAB & BINGKAI
                  </span>
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 border border-amber-200">
                    Lab Quality
                  </span>
                </div>

                <div
                  onClick={() => onSelectCategory ? onSelectCategory('bingkai-album') : onSelectBranch(selectedBranch)}
                  className="w-full p-4 sm:p-4.5 bg-gradient-to-br from-white to-[#FAF6F0] hover:to-[#F5EFE6] border border-[#D8CEBF] hover:border-[#1C1A17] transition-all duration-300 cursor-pointer group text-left relative overflow-hidden flex items-center justify-between gap-3 flex-1 shadow-sm hover:shadow-xl"
                >
                  {/* Gold Left Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8C6D46]" />

                  <div className="flex items-center gap-3.5 min-w-0 pl-1.5">
                    <div className="w-11 h-11 bg-[#FAF8F5] border border-[#D5CEC2] text-[#8C6D46] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:border-[#8C6D46] transition-all">
                      <ImageIcon className="w-5 h-5 stroke-[2] text-[#8C6D46]" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C1A17] tracking-wider uppercase truncate group-hover:text-[#8C6D46] transition-colors">
                          PRICELIST CETAK
                        </h4>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#8C6D46]/10 text-[#8C6D46] border border-[#8C6D46]/30">
                          Anti-Luntur
                        </span>
                      </div>
                      <p className="text-[11.5px] font-sans text-[#5C5650] font-normal truncate">
                        Cetak Lab, Bingkai Minimalis & Album
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-serif font-bold uppercase tracking-wider text-white bg-[#1C1A17] group-hover:bg-[#8C6D46] px-3.5 py-2 flex items-center gap-1.5 shrink-0 transition-all shadow-xs group-hover:scale-105">
                    <span>Lihat</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ==================================================================== */}
        {/* LUXURY EDITORIAL DARK FOOTER (Sesuai Referensi Asloka.co)           */}
        {/* ==================================================================== */}
        <footer className="w-full bg-[#0D0C0B] text-[#EAE2D5] border-t border-[#1C1A17] select-none">
          {/* Main Footer Row */}
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand Logo / Text */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-serif font-black text-xl sm:text-2xl tracking-[0.25em] text-white uppercase">
                ALVIERO STUDIO
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase mt-0.5">
                EST. MALANG • JAWA TIMUR
              </span>
            </div>

            {/* Studio Specialization Services */}
            <div className="text-center font-sans text-xs text-stone-400 tracking-wider">
              <p className="font-medium text-stone-300">
                Photography <span className="text-[#8C6D46] px-1">•</span> Videography <span className="text-[#8C6D46] px-1">•</span> Creative Production
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                Studio 1 Karangploso & Studio 2 Cabang Eksklusif
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <button
                type="button"
                onClick={() => onSelectBranch(selectedBranch)}
                className="font-serif font-bold text-xs sm:text-sm text-[#D4AF37] hover:text-white uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5 cursor-pointer group"
              >
                <span>BOOKING NOW</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#D4AF37] group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Sub-Footer Row */}
          <div className="border-t border-white/10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-4 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <span>© {new Date().getFullYear()} Alviero Studio. All Rights Reserved.</span>
            </div>

            {/* Status Live Pill */}
            <div className="bg-[#1A1816] px-3.5 py-1.5 border border-white/10 flex items-center gap-2 text-[10.5px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-stone-300 font-medium tracking-wider uppercase text-[10px]">Studio Buka Hari Ini • 08:00 - 21:00 WIB</span>
            </div>

            {/* Quick Text Links */}
            <div className="flex items-center gap-4 sm:gap-6 font-sans text-[11px] text-stone-400">
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
