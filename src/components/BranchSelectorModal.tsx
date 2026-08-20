import React, { useState, useEffect, useRef } from 'react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';
import { Check, Sparkles, X, ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface BranchSelectorViewProps {
  selectedBranch: StudioBranch;
  onSelectBranch: (branch: StudioBranch) => void;
  onSelectCategory?: (category: string) => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

const BACKDROP_HERO_SLIDES = [
  {
    id: 'self-photo',
    scriptTitle: 'Self Photo Package',
    heading: 'KAMU, VERSI TERBAIK!',
    description: 'Abadikan dirimu dengan bebas sesuai keinginan dengan ruangan privat.',
    buttonText: 'IYA SAYA MAU',
    bgClass: 'bg-gradient-to-br from-[#dfeceb] to-[#cfdedd]',
    accentColor: 'text-[#486361]',
    btnClass: 'bg-[#5e7775] hover:bg-[#4a6361] text-white',
    frameBorder: 'border-[#5e7775]/50',
    image: '/images/selfstudio/sample-1.jpg',
    tag: 'SelfStudio Privat'
  },
  {
    id: 'spotlight-warm',
    scriptTitle: 'Aesthetic Spotlight',
    heading: 'WARM & CINEMATIC!',
    description: 'Pencahayaan spotlight eksklusif & tirai coklat untuk hasil foto artistik.',
    buttonText: 'PILIH SPOTLIGHT',
    bgClass: 'bg-gradient-to-br from-[#ece4db] to-[#ddd3c8]',
    accentColor: 'text-[#6b5544]',
    btnClass: 'bg-[#7a6452] hover:bg-[#63503f] text-white',
    frameBorder: 'border-[#7a6452]/50',
    image: '/images/selfstudio/sample-4.jpg',
    tag: 'Tirai Coklat'
  },
  {
    id: 'wisuda-indoor',
    scriptTitle: 'Graduation Package',
    heading: 'MOMEN KELULUSAN!',
    description: 'Foto wisuda megah dengan beragam pilihan backdrop & bingkai eksklusif.',
    buttonText: 'LIHAT WISUDA',
    bgClass: 'bg-gradient-to-br from-[#e5e9ee] to-[#d4dce3]',
    accentColor: 'text-[#3d5066]',
    btnClass: 'bg-[#4b5e75] hover:bg-[#394a5f] text-white',
    frameBorder: 'border-[#4b5e75]/50',
    image: '/images/selfstudio/sample-2.jpg',
    tag: 'Wisuda & Toga'
  },
  {
    id: 'group-family',
    scriptTitle: 'Group & Family Studio',
    heading: 'SENYUM BERSAMA!',
    description: 'Koleksi latar luas untuk geng sahabat, organisasi & keluarga besar.',
    buttonText: 'RESERVASI GROUP',
    bgClass: 'bg-gradient-to-br from-[#dee8e0] to-[#cdd9cf]',
    accentColor: 'text-[#3c5e42]',
    btnClass: 'bg-[#4a6d50] hover:bg-[#38593e] text-white',
    frameBorder: 'border-[#4a6d50]/50',
    image: '/images/selfstudio/sample-3.jpg',
    tag: 'Hingga 75 Orang'
  },
  {
    id: 'cabang-2-sunset',
    scriptTitle: 'Studio Cabang 2 Gajayana',
    heading: 'KONSEP ESTETIK BARU!',
    description: 'Bilik foto modern dengan pilihan warna latar baru di Dinoyo Malang.',
    buttonText: 'CABANG GAJAYANA',
    bgClass: 'bg-gradient-to-br from-[#ede9df] to-[#ded8cc]',
    accentColor: 'text-[#635a46]',
    btnClass: 'bg-[#736a54] hover:bg-[#5f5742] text-white',
    frameBorder: 'border-[#736a54]/50',
    image: '/images/selfstudio/sample-6.jpg',
    tag: 'Dinoyo Malang'
  }
];

/**
 * Hero Slider Banner Backdrop Studio (Desain Sesuai Gambar 2)
 */
export const BackdropHeroSlider: React.FC<{ onCtaClick?: () => void }> = ({ onCtaClick }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-scroll bergulir otomatis setiap 3.8 detik
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BACKDROP_HERO_SLIDES.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % BACKDROP_HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + BACKDROP_HERO_SLIDES.length) % BACKDROP_HERO_SLIDES.length);
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

  const activeSlide = BACKDROP_HERO_SLIDES[currentIdx];

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Container Card */}
      <div className={`w-full ${activeSlide.bgClass} p-5 sm:p-7 transition-colors duration-700 relative overflow-hidden`}>
        
        {/* Subtle Decorative Background Circles */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-12 gap-4 sm:gap-6 items-center">
          
          {/* Left Column: Text & CTA Button */}
          <div className="col-span-7 sm:col-span-7 text-left space-y-2 sm:space-y-3">
            
            {/* Script Title */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`font-serif italic text-xs sm:text-sm font-bold tracking-wide ${activeSlide.accentColor}`}>
                {activeSlide.scriptTitle}
              </span>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-white/60 text-slate-700 border border-white/80 shadow-2xs">
                {activeSlide.tag}
              </span>
            </div>

            {/* Bold Headline */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 tracking-tight leading-tight uppercase font-sans">
              {activeSlide.heading}
            </h3>

            {/* Subtitle Description */}
            <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
              {activeSlide.description}
            </p>

            {/* Pill CTA Button (Sesuai Gambar 2) */}
            <div className="pt-1 sm:pt-2">
              <button
                type="button"
                onClick={onCtaClick}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 ${activeSlide.btnClass}`}
              >
                <span>{activeSlide.buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Oval Cutout Portrait Frame (Sesuai Gambar 2) */}
          <div className="col-span-5 sm:col-span-5 flex justify-center items-center">
            <div className="relative group">
              {/* Outer Glow / Ring */}
              <div className={`w-32 h-44 sm:w-40 sm:h-52 rounded-[80px] sm:rounded-[100px] border-4 sm:border-[5px] ${activeSlide.frameBorder} overflow-hidden shadow-xl bg-white/40 backdrop-blur-xs transition-transform duration-500 group-hover:scale-102`}>
                <img
                  src={activeSlide.image}
                  alt={activeSlide.heading}
                  className="w-full h-full object-cover object-center transition-all duration-700 animate-in fade-in zoom-in-95"
                />
              </div>

              {/* Little sparkle badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white text-emerald-600 shadow-md flex items-center justify-center font-bold text-xs border border-slate-100">
                ✨
              </div>
            </div>
          </div>
        </div>

        {/* Manual Arrow Controls (< and >) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center shadow-xs cursor-pointer transition-all z-20 active:scale-90"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/70 hover:bg-white text-slate-800 flex items-center justify-center shadow-xs cursor-pointer transition-all z-20 active:scale-90"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dots Pagination Indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {BACKDROP_HERO_SLIDES.map((slide, idx) => {
            const isActive = currentIdx === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  isActive
                    ? 'w-5 h-1.5 bg-slate-800 shadow-xs'
                    : 'w-1.5 h-1.5 bg-slate-800/30 hover:bg-slate-800/60'
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
 * Komponen Tampilan Utama Pilih Cabang & Layanan Khusus (Gambar 2 / Halaman Depan)
 */
export const BranchSelectorLanding: React.FC<BranchSelectorViewProps> = ({
  selectedBranch,
  onSelectBranch,
  onSelectCategory,
}) => {
  return (
    <div className="max-w-xl w-full mx-auto my-3 sm:my-8 px-2 sm:px-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col relative">
        
        {/* Top Hero Banner Slider (Gambar 2: Bergulir Otomatis & Manual) */}
        <BackdropHeroSlider onCtaClick={() => onSelectBranch(selectedBranch)} />

        {/* Header Notice */}
        <div className="bg-slate-900 text-white px-5 py-3 sm:px-6 sm:py-3.5 relative overflow-hidden border-b border-slate-800 text-left flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight">
              Pilih Lokasi Studio Cabang
            </span>
          </div>
          <span className="text-[10px] text-slate-300 font-medium">
            2 Lokasi di Malang
          </span>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 space-y-4 bg-slate-50 flex-1">
          
          {/* Section 1: Pilihan Cabang Studio */}
          <div className="space-y-3.5">
            {STUDIO_BRANCHES.map((branch) => {
              const isSelected = selectedBranch === branch.id;

              return (
                <div
                  key={branch.id}
                  onClick={() => onSelectBranch(branch.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative group text-left ${
                    isSelected
                      ? 'bg-white border-[#78b65d] ring-2 ring-[#78b65d]/20 shadow-md'
                      : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 transition-transform group-hover:scale-105 ${
                        isSelected
                          ? 'bg-slate-900 text-emerald-400 shadow-sm'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {branch.icon}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                            {branch.name}
                          </h3>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-extrabold'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {branch.badge}
                          </span>
                        </div>

                        {/* Alamat Lengkap */}
                        <div className="flex items-start gap-1.5 mt-2 text-xs text-slate-600 leading-relaxed">
                          <MapPin className="w-3.5 h-3.5 text-[#78b65d] shrink-0 mt-0.5" />
                          <span className="font-medium">{branch.address}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#78b65d] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBranch(branch.id);
                      }}
                      className={`px-5 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        isSelected
                          ? 'bg-[#78b65d] text-white hover:bg-[#5e9e44]'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <span>{isSelected ? `Buka Katalog ${branch.badge}` : `Pilih ${branch.badge}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 2: Layanan Khusus Wedding & Cetak Foto */}
          <div className="pt-1">
            <div className="text-left px-1 pb-2">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500">
                ✨ Layanan Wedding & Cetak Foto:
              </span>
            </div>

            <div className="space-y-3">
              {/* Pricelist Wedding Card */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('wedding-package') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-4.5 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-[#78b65d] transition-all cursor-pointer shadow-2xs group text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
                      💍
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                          PRICELIST WEDDING
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Exclusive
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        Prewedding, Akad, Resepsi & Engagement
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCategory) onSelectCategory('wedding-package');
                      else onSelectBranch(selectedBranch);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-extrabold bg-[#78b65d] hover:bg-[#5e9e44] text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <span>Lihat Pricelist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pricelist Cetak Card */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('bingkai-album') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-4.5 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-[#78b65d] transition-all cursor-pointer shadow-2xs group text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
                      🖼️
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                          PRICELIST CETAK
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Cetak Lab
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        Cetak Lab, Bingkai Minimalis & Album Eksklusif
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCategory) onSelectCategory('bingkai-album');
                      else onSelectBranch(selectedBranch);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-extrabold bg-[#78b65d] hover:bg-[#5e9e44] text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <span>Lihat Pricelist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-white border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          💡 Kamu dapat berganti studio cabang kapan saja lewat tombol <strong>'Ganti Cabang'</strong>.
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto relative">
        
        {/* Header Modal with Slider */}
        <BackdropHeroSlider onCtaClick={() => handleChoose(selectedBranch)} />

        <div className="bg-slate-900 text-white px-5 py-3 sm:px-6 sm:py-3.5 relative overflow-hidden border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <h4 className="font-extrabold text-sm text-white">
              Pilih Lokasi Studio Cabang
            </h4>
          </div>

          {canDismiss && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Branch Cards */}
        <div className="p-4 sm:p-6 space-y-4 bg-slate-50 flex-1">
          {STUDIO_BRANCHES.map((branch) => {
            const isSelected = selectedBranch === branch.id;

            return (
              <div
                key={branch.id}
                onClick={() => handleChoose(branch.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative group text-left ${
                  isSelected
                    ? 'bg-white border-[#78b65d] ring-2 ring-[#78b65d]/20 shadow-md'
                    : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-slate-900 text-emerald-400 shadow-sm'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {branch.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                          {branch.name}
                        </h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-extrabold'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {branch.badge}
                        </span>
                      </div>

                      {/* Alamat Lengkap */}
                      <div className="flex items-start gap-1.5 mt-2 text-xs text-slate-600 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-[#78b65d] shrink-0 mt-0.5" />
                        <span className="font-medium">{branch.address}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#78b65d] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoose(branch.id);
                    }}
                    className={`px-5 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isSelected
                        ? 'bg-[#78b65d] text-white hover:bg-[#5e9e44]'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{isSelected ? `Buka Katalog ${branch.badge}` : `Pilih ${branch.badge}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-white border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          💡 Kamu dapat berganti studio cabang kapan saja lewat menu di bagian atas.
        </div>
      </div>
    </div>
  );
};
