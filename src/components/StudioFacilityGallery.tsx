import React, { useState, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  Sparkles, 
  CheckCircle2, 
  Camera, 
  Lightbulb, 
  Layers, 
  Maximize2,
  Compass
} from 'lucide-react';

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  packageName: string;
  icon: string;
  imageUrl: string;
  images?: string[];
  description: string;
  conceptNote: string;
  highlights: string[];
  tags: string[];
  badge?: string;
}

interface SynchronizedGalleryCarouselProps {
  sectionId: string;
  sectionNumber: string;
  sectionTitle: string;
  sectionSubtitle: string;
  sectionIcon: React.ReactNode;
  badgeLabel?: string;
  items: GalleryItem[];
  onPhotoZoom?: (item: GalleryItem) => void;
}

export const SynchronizedGalleryCarousel: React.FC<SynchronizedGalleryCarouselProps> = ({
  sectionId,
  sectionNumber,
  sectionTitle,
  sectionSubtitle,
  sectionIcon,
  badgeLabel,
  items,
  onPhotoZoom
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Fallback if items array changes (e.g. branch switched)
  const safeIndex = items.length === 0 ? 0 : Math.min(activeIndex, items.length - 1);
  const activeItem = items[safeIndex] || items[0];

  const handlePrev = () => {
    if (items.length <= 1) return;
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (items.length <= 1) return;
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (diff > minSwipeDistance) {
      // Swiped Left -> Go Next
      handleNext();
    } else if (diff < -minSwipeDistance) {
      // Swiped Right -> Go Prev
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!activeItem || items.length === 0) return null;

  return (
    <section 
      id={sectionId} 
      className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DDD6] shadow-sm p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 scroll-mt-24 transition-all duration-300"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DDD6]/70">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#3A3A3A] text-white text-[11px] font-mono font-bold">
              {sectionNumber}
            </span>
            <div className="inline-flex items-center gap-1.5 bg-[#FAF6F0] text-[#5C725A] text-[11px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-[#E8DDD6]">
              {sectionIcon}
              <span>{badgeLabel || 'Alviero Studio'}</span>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-black text-[#3A3A3A] tracking-wide uppercase pt-1">
            {sectionTitle}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-xl">
            {sectionSubtitle}
          </p>
        </div>

        {/* Fraction Counter & Quick Navigation Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0">
          <div className="bg-[#FAF8F5] border border-[#E8DDD6] px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-mono font-bold text-[#3A3A3A] shadow-2xs">
            <span className="text-[#5C725A]">
              {String(safeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-stone-400">/</span>
            <span className="text-stone-500">
              {String(items.length).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              aria-label="Item Sebelumnya"
              className="w-9 h-9 rounded-xl bg-[#FAF8F5] hover:bg-[#3A3A3A] text-[#3A3A3A] hover:text-white border border-[#E8DDD6] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Item Selanjutnya"
              className="w-9 h-9 rounded-xl bg-[#FAF8F5] hover:bg-[#3A3A3A] text-[#3A3A3A] hover:text-white border border-[#E8DDD6] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Showcase (Grid Desktop: Image Left, Reactive Content Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-stretch">
        
        {/* LEFT COLUMN: Main Featured Image with Touch/Swipe */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div
            className="relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#242424] shadow-md border border-[#E8DDD6] group select-none cursor-pointer"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => onPhotoZoom && onPhotoZoom(activeItem)}
          >
            {/* Background Image with Smooth Key Transition */}
            <img
              key={activeItem.id}
              src={activeItem.imageUrl}
              alt={activeItem.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 animate-in fade-in zoom-in-95 duration-300"
              loading="lazy"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60" />

            {/* Category / Package Badge Top Left */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
              <div className="bg-black/75 backdrop-blur-md text-[#A9BCA7] text-[10.5px] font-mono font-bold tracking-wider px-3 py-1.5 rounded-full border border-[#A9BCA7]/40 flex items-center gap-1.5 shadow-sm uppercase">
                <span className="text-sm">{activeItem.icon}</span>
                <span>{activeItem.packageName}</span>
              </div>
            </div>

            {/* Zoom Button Top Right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onPhotoZoom) onPhotoZoom(activeItem);
              }}
              aria-label="Lihat Foto HD Penuh"
              className="absolute top-3.5 right-3.5 px-2.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-[11px] font-bold border border-white/30 flex items-center gap-1 transition-all z-10 cursor-pointer shadow-xs active:scale-95"
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#A9BCA7]" />
              <span className="hidden sm:inline">Perbesar HD</span>
            </button>

            {/* Floating Navigation Arrows Inside Viewport */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Foto Sebelumnya"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 z-10 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Foto Selanjutnya"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 z-10 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Bottom Caption Pill & Dots Overlay for Mobile */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10 pointer-events-none">
              <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-mono text-stone-200">
                Geser (swipe) untuk melihat lainnya
              </span>
              
              <div className="flex items-center gap-1 pointer-events-auto">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(i);
                    }}
                    aria-label={`Ke slide ${i + 1}`}
                    className={`h-1.5 transition-all rounded-full cursor-pointer ${
                      i === safeIndex 
                        ? 'w-5 bg-[#A9BCA7]' 
                        : 'w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Synchronized Text & Specification Details */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#FAF8F5] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#E8DDD6] space-y-4">
          
          <div className="space-y-3.5">
            {/* Badge & Item Counter */}
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#5C725A] bg-[#EFF6EE] px-3 py-1 rounded-full border border-[#CCE0CB]">
                <span>{activeItem.icon}</span>
                <span>{activeItem.subtitle}</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-stone-400">
                No. {safeIndex + 1} dari {items.length}
              </span>
            </div>

            {/* Synchronized Reactive Title */}
            <div className="space-y-1">
              <h4 
                key={`title-${activeItem.id}`}
                className="font-serif font-bold text-xl sm:text-2xl text-[#3A3A3A] tracking-tight leading-snug animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                {activeItem.title}
              </h4>
              <p className="text-xs text-[#6E856C] font-mono uppercase tracking-wider font-semibold">
                {activeItem.badge || 'Standar Pelayanan Alviero Studio'}
              </p>
            </div>

            {/* Synchronized Reactive Description */}
            <p 
              key={`desc-${activeItem.id}`}
              className="text-xs sm:text-sm text-stone-700 font-sans leading-relaxed pt-1 animate-in fade-in duration-300"
            >
              {activeItem.description}
            </p>

            {/* Highlights List / Features */}
            {activeItem.highlights && activeItem.highlights.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#E8DDD6]/60">
                <p className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                  Keunggulan &amp; Fitur:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeItem.highlights.map((h, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-[#E8DDD6] text-stone-700 text-xs shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5C725A] shrink-0" />
                      <span className="truncate font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Concept Note / Tips Studio */}
            {activeItem.conceptNote && (
              <div className="bg-[#F2E9E4]/60 border border-[#E8DDD6] rounded-xl p-3 text-left space-y-1 text-xs">
                <span className="font-bold text-[#3A3A3A] flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#5C725A]" /> Catatan Khusus:
                </span>
                <p className="text-stone-600 text-xs italic">
                  "{activeItem.conceptNote}"
                </p>
              </div>
            )}
          </div>

          {/* Action Row & Tag Badges */}
          <div className="pt-2 border-t border-[#E8DDD6]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {activeItem.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="text-[10px] font-mono font-medium text-stone-600 bg-white px-2 py-0.5 rounded-md border border-[#E8DDD6]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => onPhotoZoom && onPhotoZoom(activeItem)}
              className="px-4 py-2 bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#A9BCA7]" />
              <span>Lihat Detail HD</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM THUMBNAIL RAIL (Quick-Jump Slider Selector) */}
      <div className="pt-1 space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-500 font-sans">
          <span className="font-medium flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#5C725A]" />
            Pilih cepat dari galeri ({items.length} item):
          </span>
          <span className="text-[11px] font-mono">
            Klik thumbnail untuk ganti tampilan
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scroll-mask-x no-scrollbar">
          {items.map((item, index) => {
            const isSelected = index === safeIndex;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(index)}
                className={`group relative shrink-0 w-24 sm:w-28 rounded-xl overflow-hidden border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-[#5C725A] ring-2 ring-[#5C725A]/40 shadow-sm scale-102'
                    : 'border-[#E8DDD6] opacity-70 hover:opacity-100 hover:border-stone-400'
                }`}
              >
                <div className="aspect-[4/3] bg-stone-900 relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                  
                  {isSelected && (
                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#5C725A] ring-2 ring-white" />
                  )}
                  
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold text-white bg-black/75 px-1 rounded">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="p-1.5 bg-white">
                  <p className={`text-[10px] font-medium leading-tight truncate ${isSelected ? 'font-bold text-[#3A3A3A]' : 'text-stone-600'}`}>
                    {item.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// DATA SECTION 1: FASILITAS STUDIO (Studio Facilities)
// ============================================================================
export const STUDIO_FACILITY_DATA: GalleryItem[] = [
  {
    id: 'fac-studio-ac',
    title: 'Ruang Studio Utama Ber-AC',
    subtitle: 'Climate Controlled Studio Space',
    category: 'ruangan',
    packageName: 'Fasilitas Studio',
    icon: '🛋️',
    badge: 'Kenyamanan Standar Utama',
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85',
    description: 'Ruang studio utama yang sejuk dengan pendingin ruangan (AC) terawat, berdaya tampung luas untuk perorangan, keluarga, hingga rombongan wisuda dan grup.',
    conceptNote: 'Suhu ruangan selalu dijaga sejuk dan nyaman agar makeup dan outfit tetap prima selama pemotretan.',
    highlights: ['AC Dingin & Bersih', 'Ruang Gerak Luas', 'Bebas Pengap & Gerah', 'Kapasitas Hingga 15 Orang'],
    tags: ['#RuangStudioBerAC', '#Nyaman', '#KapasitasLuas']
  },
  {
    id: 'fac-vanity-room',
    title: 'Ruang Rias & Fitting Eksklusif',
    subtitle: 'Private Grooming & Wardrobe Area',
    category: 'ruangan',
    packageName: 'Fasilitas Studio',
    icon: '🪞',
    badge: 'Ruang Persiapan Khusus',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85',
    description: 'Area rias privat dengan cermin vanity LED daylight, colokan listrik untuk catokan/hairdryer, serta ruang ganti tertutup untuk kenyamanan persiapan kostum dan kebaya.',
    conceptNote: 'Sangat ideal untuk wisudawan yang memakai toga atau calon pengantin yang berganti gaun prewedding.',
    highlights: ['Cermin Vanity LED', 'Fitting Room Privat', 'Colokan Listrik Rias', 'Gantungan Baju Rapi'],
    tags: ['#RuangRias', '#FittingPrivat', '#CerminVanity']
  },
  {
    id: 'fac-waiting-lounge',
    title: 'Lounge & Area Tunggu Santai',
    subtitle: 'Comfortable Guest & Family Lounge',
    category: 'kenyamanan',
    packageName: 'Fasilitas Studio',
    icon: '☕',
    badge: 'Area Tamu & Keluarga',
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85',
    description: 'Sofa empuk dan meja nyaman untuk anggota keluarga atau rekan yang menunggu giliran foto, dilengkapi katalog portofolio inspirasi gaya.',
    conceptNote: 'Tersedia air minum dan akses Wi-Fi berkecepatan tinggi secara gratis selama berada di studio.',
    highlights: ['Sofa Empuk Keluarga', 'Katalog Ide Pose', 'Dispenser Air Minum', 'Free High-Speed Wi-Fi'],
    tags: ['#RuangTunggu', '#SofaKeluarga', '#FreeWiFi']
  },
  {
    id: 'fac-clean-restroom',
    title: 'Toilet Bersih & Higienis',
    subtitle: 'Hygienic & Fresh Restroom',
    category: 'kenyamanan',
    packageName: 'Fasilitas Studio',
    icon: '🚿',
    badge: 'Kebersihan Terjaga',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=85',
    description: 'Toilet dan wastafel yang senantiasa dijaga kebersihannya setiap pergantian sesi foto untuk kenyamanan maksimal seluruh tamu dan anak-anak.',
    conceptNote: 'Dilengkapi sabun cuci tangan, tisu bersih, dan cermin wastafel.',
    highlights: ['Selalu Wangi & Higienis', 'Wastafel & Cermin', 'Sabun & Tisu Bersih', 'Ramah Keluarga'],
    tags: ['#ToiletBersih', '#Higienis', '#Kenyamanan']
  },
  {
    id: 'fac-parking-access',
    title: 'Akses Lokasi & Area Parkir',
    subtitle: 'Convenient Parking & Road Access',
    category: 'layanan',
    packageName: 'Fasilitas Studio',
    icon: '🅿️',
    badge: 'Aksesibilitas Mudah',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=85',
    description: 'Lokasi studio berada tepat di pinggir jalan raya utama dengan akses mudah ditemukan, serta area parkir aman untuk kendaraan roda 2 maupun roda 4.',
    conceptNote: 'Titik penjemputan ojek online dan taksi tepat di depan pintu masuk ruko studio.',
    highlights: ['Parkir Mobil & Motor', 'Pinggir Jalan Raya', 'Akses Mudah Ojol', 'Lingkungan Aman'],
    tags: ['#ParkirStudio', '#AksesMudah', '#LokasiStrategis']
  }
];

// ============================================================================
// DATA SECTION 2: ALAT STUDIO (Professional Studio Gear & Equipment)
// ============================================================================
export const STUDIO_EQUIPMENT_DATA: GalleryItem[] = [
  {
    id: 'eq-godox-lighting',
    title: 'Lighting Godox & Softbox Diffuser Ganda',
    subtitle: 'Professional Flash Illumination System',
    category: 'peralatan',
    packageName: 'Peralatan Studio',
    icon: '💡',
    badge: 'Pencahayaan Studio Pro',
    imageUrl: 'https://images.unsplash.com/photo-1606986628253-33f7f8e5e2c2?auto=format&fit=crop&w=1000&q=85',
    description: 'Sistem pencahayaan flash studio Godox dengan modifier softbox oktagonal besar dan diffuser ganda, menghasilkan cahaya lembut alami pada kulit (flattering skin tone) tanpa bayangan keras.',
    conceptNote: 'Dikalibrasi berkala agar warna pakaian, toga wisuda, dan riasan make-up keluar dengan akurat 100%.',
    highlights: ['Godox Professional Strobe', 'Softbox Diffuser Ganda', 'Akurasi Warna Tinggi', 'Skin Tone Glowing Halus'],
    tags: ['#LightingGodox', '#SoftboxStudio', '#SkinToneNatural']
  },
  {
    id: 'eq-mirrorless-camera',
    title: 'Kamera Mirrorless Resolusi Tinggi & Lensa Portrait',
    subtitle: 'Ultra High-Definition Sharpness',
    category: 'peralatan',
    packageName: 'Peralatan Studio',
    icon: '📷',
    badge: 'Sensor Resolusi Tinggi',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=85',
    description: 'Kamera sensor besar dipadu lensa portrait premium ber-aperture tajam, menjamin setiap helai rambut, tekstur pakaian, dan detail mata tertangkap dengan kejernihan maksimal saat dicetak ukuran besar.',
    conceptNote: 'File master foto tajam sempurna bahkan bila dicetak hingga ukuran bingkai 20R ke atas.',
    highlights: ['Sensor Resolusi Tinggi', 'Lensa Portrait Tajam', 'Hasil Cetak Anti Pecah', 'Detail Halus Terjaga'],
    tags: ['#KameraPro', '#LensaPortrait', '#CetakBesar']
  },
  {
    id: 'eq-wireless-trigger',
    title: 'Trigger Nirkabel & Remote Self Studio Ergonomis',
    subtitle: 'Zero-Lag Wireless Shutter Trigger',
    category: 'peralatan',
    packageName: 'Peralatan Studio',
    icon: '📡',
    badge: 'Sinkronisasi Cepat',
    imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=85',
    description: 'Sistem trigger nirkabel tanpa jeda untuk sinkronisasi kilat kamera dan lampu, serta clicker remote yang ringan di tangan khusus untuk paket Self Studio.',
    conceptNote: 'Klien paket Self Studio dapat memegang remote kecil tersembunyi dan berpose sesuka hati tanpa hambatan kabel.',
    highlights: ['Trigger Zero Latency', 'Remote Self Studio Ringan', 'Bebas Kabel Kusut', 'Respon Jepret Instan'],
    tags: ['#WirelessTrigger', '#SelfStudioRemote', '#Responsif']
  },
  {
    id: 'eq-live-monitor',
    title: 'Layar Monitor Live Preview Real-Time',
    subtitle: 'Instant Frame & Pose Review Display',
    category: 'peralatan',
    packageName: 'Peralatan Studio',
    icon: '🖥️',
    badge: 'Review Hasil Seketika',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85',
    description: 'Layar monitor display berukuran besar yang langsung menampilkan hasil foto hanya 1 detik setelah tombol shutter ditekan, mempermudah evaluasi ekspresi dan kerapian busana secara langsung.',
    conceptNote: 'Klien tidak perlu menerka hasil foto; Anda dapat langsung melihat senyum dan pose terbaik di layar lebar.',
    highlights: ['Layar Display Besar', 'Preview Instan 1 Detik', 'Warna Monitor Terkalibrasi', 'Cek Gaya & Senyum Langsung'],
    tags: ['#LiveMonitor', '#CekPoseLangsung', '#LayarPreview']
  },
  {
    id: 'eq-props-stools',
    title: 'Koleksi Bangku Pose, Kursi Kayu & Properti Kreatif',
    subtitle: 'Aesthetic Stools, Artificial Flowers & Party Props',
    category: 'peralatan',
    packageName: 'Peralatan Studio',
    icon: '💐',
    badge: 'Properti Pose Lengkap',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=85',
    description: 'Pilihan bangku kayu aesthetic, stool studio tinggi/rendah, sofa minimalis, buket bunga artifisial, balon angka ulang tahun, dan kacamata lucu untuk menambah variasi pose.',
    conceptNote: 'Seluruh properti studio bebas digunakan tanpa biaya sewa tambahan selama sesi foto berlangsung.',
    highlights: ['Bangku Kayu & Stool Studio', 'Buket Bunga Bervariasi', 'Balon Angka & Kacamata Pesta', 'Gratis Pakai Selama Sesi'],
    tags: ['#PropertiFoto', '#StoolStudio', '#BungaAesthetic']
  }
];

// ============================================================================
// DATA SECTION 3: BACKGROUND STUDIO 1 (Karangploso) - SINKRON DENGAN BOOKING
// ============================================================================
export const STUDIO_1_BACKGROUNDS_DATA: GalleryItem[] = [
  {
    id: 'hitam-list',
    title: 'Hitam List',
    subtitle: 'Latar Hitam Pekat dengan Aksen List Elegan',
    category: 'background',
    packageName: 'Background Studio 1',
    icon: '⚫',
    badge: 'Elegan & Tegas',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85',
    description: 'Latar hitam dengan aksen list untuk tampilan elegan, tegas, dan kontras tinggi yang menonjolkan pakaian dan karakter subjek.',
    conceptNote: 'Sangat cocok untuk sesi foto formal, personal branding, maupun busana terang bertema kontras tinggi.',
    highlights: ['Aksen List Elegan', 'Kontras Tinggi & Pekat', 'Menonjolkan Subjek Utama', 'Formal & Karismatik'],
    tags: ['#HitamList', '#Studio1Karangploso', '#Elegan']
  },
  {
    id: 'putih-tematik',
    title: 'Putih Tematik',
    subtitle: 'Latar Putih Bersih dengan Sentuhan Tematik',
    category: 'background',
    packageName: 'Background Studio 1',
    icon: '⚪',
    badge: 'Cerah & Estetik',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=85',
    description: 'Latar putih dengan sentuhan tematik untuk foto yang bersih, cerah, bersahabat, dan berkarakter alami.',
    conceptNote: 'Pilihan populer untuk foto wisuda, foto keluarga, serta sesi potret cerah bernuansa modern.',
    highlights: ['Sentuhan Tematik Artistik', 'Cahaya Terang Merata', 'Bersih Tanpa Distraksi', 'Cocok Semua Outfit'],
    tags: ['#PutihTematik', '#Studio1', '#BrightAesthetic']
  },
  {
    id: 'putih-list',
    title: 'Putih List',
    subtitle: 'Latar Putih Minimalis dengan Aksen List Rapi',
    category: 'background',
    packageName: 'Background Studio 1',
    icon: '◽',
    badge: 'Minimalis & Rapi',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    description: 'Latar putih dengan aksen list untuk hasil foto minimalis, modern, dan tertata rapi.',
    conceptNote: 'Memberikan garis komposisi visual yang dinamis untuk foto wisuda studio dan potret santai bersama sahabat.',
    highlights: ['Aksen List Geometris', 'Kesan Bersih Modern', 'Pencahayaan Studio Merata', 'Favorit Wisuda & Grup'],
    tags: ['#PutihList', '#MinimalisRapi', '#WisudaKeren']
  },
  {
    id: 'coklat-tematik',
    title: 'Coklat Tematik',
    subtitle: 'Latar Coklat Bernuansa Hangat & Berkarakter',
    category: 'background',
    packageName: 'Background Studio 1',
    icon: '🟫',
    badge: 'Warm & Cozy',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
    description: 'Latar coklat bernuansa tematik untuk hasil foto hangat, intim, dan berkarakter vintage klasik.',
    conceptNote: 'Sangat harmonis saat dipadukan dengan busana bernuansa earth tone, warna coklat susu, beige, maupun putih.',
    highlights: ['Tone Coklat Hangat', 'Nuansa Intim & Berkarakter', 'Sangat Cocok Earthy Outfit', 'Favorit Couple & Keluarga'],
    tags: ['#CoklatTematik', '#WarmEarthy', '#CoupleFamily']
  },
  {
    id: 'limbo',
    title: 'Limbo',
    subtitle: 'Latar Mulus Tanpa Sudut (Infinity Curve)',
    category: 'background',
    packageName: 'Background Studio 1',
    icon: '⚪',
    badge: 'Khas Studio 1 (Infinity)',
    imageUrl: '/images/gallery/graduation-indoor/grad-indoor-1.jpg',
    description: 'Latar mulus tanpa sudut antara lantai dan dinding (infinity cove) untuk efek ruang foto yang sangat luas, bersih, dan mewah.',
    conceptNote: 'Panggung pilar utama Studio 1 Karangploso untuk sesi grup besar, wisuda sekeluarga, dan rombongan sahabat.',
    highlights: ['Efek Infinity Bersih', 'Bebas Garis Sudut Lantai', 'Cahaya Merata Luas', 'Muat Banyak Orang'],
    tags: ['#Limbo', '#InfinityWall', '#Studio1Karangploso']
  },
  {
    id: 'ivory-mediterania',
    title: 'Ivory Mediterania',
    subtitle: 'Latar Ivory Hangat Bernuansa Mediterania',
    category: 'background',
    packageName: 'Background Studio 1',
    icon: '🌾',
    badge: 'Natural & Elegan',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85',
    description: 'Latar ivory hangat bernuansa Mediterania / Japandi untuk hasil foto natural, homey, dan elegan.',
    conceptNote: 'Pilihan favorit untuk sesi maternity (ibu hamil), bayi, keluarga kecil, dan potret kasual elegan.',
    highlights: ['Tone Ivory Hangat', 'Sentuhan Mediterania Alami', 'Elegan & Timeless', 'Cocok Maternity & Portrait'],
    tags: ['#IvoryMediterania', '#NaturalElegan', '#JapandiMood']
  }
];

// ============================================================================
// DATA SECTION 3: BACKGROUND STUDIO 2 (Dinoyo) - SINKRON DENGAN BOOKING
// ============================================================================
export const STUDIO_2_BACKGROUNDS_DATA: GalleryItem[] = [
  {
    id: 'c2-hitam',
    title: 'Hitam',
    subtitle: 'Latar Hitam Pekat Elegan & Profesional',
    category: 'background',
    packageName: 'Background Studio 2',
    icon: '⚫',
    badge: 'Bold & Elegan',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85',
    description: 'Latar hitam pekat elegan untuk kesan foto profesional, formal, dan tegas. Mampu mengisolasi subjek dengan kontras memukau.',
    conceptNote: 'Tersedia untuk sesi Studio Foto fotografer. Kuota 1x per slot waktu.',
    highlights: ['Panggung Mandiri 1x Slot', 'Kontras Tinggi Tajam', 'Elegan & Tegas', 'Sangat Direkomendasikan'],
    tags: ['#Hitam', '#Studio2Dinoyo', '#DramaticLook']
  },
  {
    id: 'c2-putih',
    title: 'Putih',
    subtitle: 'Latar Putih Bersih Minimalis Universal',
    category: 'background',
    packageName: 'Background Studio 2',
    icon: '⚪',
    badge: 'Bersih & Universal',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    description: 'Latar putih bersih minimalis untuk foto wisuda, keluarga, dan grup. Memberikan hasil foto terang, jernih, dan abadi untuk segala kebutuhan acara.',
    conceptNote: 'Dapat dikombinasikan dengan Abu-abu dalam paket 2 background. Tersedia untuk Studio Foto & Self Studio.',
    highlights: ['Pencahayaan Cerah Bersih', 'Bisa Kombinasi Abu-abu', 'Cocok Semua Outfit', 'Keluarga & Wisuda'],
    tags: ['#Putih', '#Studio2Putih', '#CerahAbadi']
  },
  {
    id: 'c2-abu',
    title: 'Abu-abu',
    subtitle: 'Latar Abu-abu Netral Elegan & Kekinian',
    category: 'background',
    packageName: 'Background Studio 2',
    icon: '🔘',
    badge: 'Modern & Aesthetic',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=85',
    description: 'Latar abu-abu netral elegan untuk kesan modern dan aesthetic. Sangat ramah warna kulit dan fleksibel dengan busana apa pun.',
    conceptNote: 'Warna netral terbaik yang tidak membuat kulit kusam dan sangat fleksibel. Tersedia di Studio Foto & Self Studio.',
    highlights: ['Warna Abu Netral Modern', 'Tersedia di Self Studio', 'Skin Tone Sangat Natural', 'Bisa Gandeng Putih'],
    tags: ['#AbuAbu', '#ContemporaryGrey', '#SelfStudioDinoyo']
  },
  {
    id: 'c2-coklat-jendela',
    title: 'Coklat Jendela',
    subtitle: 'Latar Coklat Klasik dengan Ornamen Jendela Mewah',
    category: 'background',
    packageName: 'Background Studio 2',
    icon: '🪟',
    badge: 'Klasik & Mewah',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
    description: 'Latar coklat klasik dengan ornamen jendela mewah berkarakter. Menghadirkan aksen bayangan jendela yang artistik, hangat, dan bernuansa vintage.',
    conceptNote: 'Panggung fisik bersama dengan Tematik Cream. Jika Coklat dipesan, Cream terkunci di jam tersebut.',
    highlights: ['Bayangan Jendela Estetik', 'Aksen Kayu Hangat', 'Nuansa Vintage Mewah', 'Cocok Couple & Prewed'],
    tags: ['#CoklatJendela', '#RusticStudio', '#VintageWarm']
  },
  {
    id: 'c2-tematik-cream',
    title: 'Tematik Cream (Maks. 5 Orang)',
    subtitle: 'Latar Tematik Cream Hangat Tone Pastel (Maks. 5 Orang)',
    category: 'background',
    packageName: 'Background Studio 2',
    icon: '🧸',
    badge: 'Maks. 5 Orang',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=85',
    description: 'Latar tematik cream hangat untuk nuansa pastel lembut dengan dekorasi set sofa nyaman, karpet, dan properti living room estetik (Kapasitas Maksimal 5 Orang).',
    conceptNote: 'Kapasitas maksimal 5 orang demi menjaga keleluasaan framing dan kenyamanan area set tematik.',
    highlights: ['Set Tematik Living Room', 'Sofa & Properti Khusus', 'Kapasitas Maks. 5 Orang', 'Tone Pastel Lembut'],
    tags: ['#TematikCream', '#SetRuangTamu', '#Maks5Orang']
  }
];

// ============================================================================
// MAIN COMPONENT: STUDIO FACILITY & BACKGROUND GALLERY
// ============================================================================
interface StudioFacilityGalleryProps {
  selectedBranch: 'cabang-1' | 'cabang-2';
  currentBranchName: string;
  onPhotoZoom?: (photo: any) => void;
  onBackToPricelist?: () => void;
}

export const StudioFacilityGallery: React.FC<StudioFacilityGalleryProps> = ({
  selectedBranch,
  currentBranchName,
  onPhotoZoom,
  onBackToPricelist
}) => {
  // Section 3: Dynamically choose backgrounds based on active studio branch
  const dynamicBackgrounds = useMemo(() => {
    return selectedBranch === 'cabang-2' 
      ? STUDIO_2_BACKGROUNDS_DATA 
      : STUDIO_1_BACKGROUNDS_DATA;
  }, [selectedBranch]);

  const branchBadgeLabel = selectedBranch === 'cabang-2' 
    ? 'Studio 2 (Dinoyo)' 
    : 'Studio 1 (Karangploso)';

  const handlePhotoZoomWrapper = (item: GalleryItem) => {
    if (!onPhotoZoom) return;
    // Map GalleryItem to StudioGalleryPhoto so the parent zoom modal renders 100% correctly
    const mappedModalPhoto = {
      id: item.id,
      title: item.title,
      category: item.category,
      packageName: item.packageName,
      icon: item.icon,
      targetPackageId: 'sewa-studio-hourly',
      imageUrl: item.imageUrl,
      images: item.images && item.images.length > 0 ? item.images : [item.imageUrl],
      description: item.description,
      conceptNote: item.conceptNote,
      tags: item.tags
    };
    onPhotoZoom(mappedModalPhoto);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Hero Overview Card */}
      <div className="bg-white p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border border-[#E8DDD6] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#FAF6F0] text-[#5C725A] text-[10.5px] sm:text-[11px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-[#E8DDD6]">
              <Camera className="w-3.5 h-3.5 text-[#5C725A]" />
              <span>Tur Fasilitas &amp; Galeri Studio</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-[#3A3A3A] tracking-wide uppercase">
              Fasilitas &amp; Background {branchBadgeLabel}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-2xl leading-relaxed">
              Jelajahi kenyamanan fasilitas ruangan, perlengkapan studio profesional, serta aneka pilihan background foto resmi yang siap mendukung sesi pemotretan Anda.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 self-start md:self-center shrink-0 bg-[#FAF8F5] p-2.5 rounded-2xl border border-[#E8DDD6]">
            <div className="text-center px-2 border-r border-[#E8DDD6]">
              <span className="block text-base font-serif font-bold text-[#3A3A3A]">
                {STUDIO_FACILITY_DATA.length}
              </span>
              <span className="text-[10px] font-mono text-stone-500 uppercase">Fasilitas</span>
            </div>
            <div className="text-center px-2 border-r border-[#E8DDD6]">
              <span className="block text-base font-serif font-bold text-[#3A3A3A]">
                {STUDIO_EQUIPMENT_DATA.length}
              </span>
              <span className="text-[10px] font-mono text-stone-500 uppercase">Alat Studio</span>
            </div>
            <div className="text-center px-2">
              <span className="block text-base font-serif font-bold text-[#5C725A]">
                {dynamicBackgrounds.length}
              </span>
              <span className="text-[10px] font-mono text-stone-500 uppercase">Background</span>
            </div>
          </div>
        </div>

        {/* Quick Jump Anchors Bar */}
        <div className="pt-2 border-t border-[#E8DDD6]/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider mr-1">
            Lompat ke Bagian:
          </span>
          <button
            onClick={() => scrollToSection('section-fasilitas')}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#3A3A3A] text-stone-700 hover:text-white border border-[#E8DDD6] text-xs font-serif font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
          >
            <span>🛋️ 1. Fasilitas</span>
          </button>
          <button
            onClick={() => scrollToSection('section-alat')}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#3A3A3A] text-stone-700 hover:text-white border border-[#E8DDD6] text-xs font-serif font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
          >
            <span>💡 2. Alat Studio</span>
          </button>
          <button
            onClick={() => scrollToSection('section-background')}
            className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#3A3A3A] text-stone-700 hover:text-white border border-[#E8DDD6] text-xs font-serif font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
          >
            <span>🎨 3. Background ({branchBadgeLabel})</span>
          </button>
        </div>
      </div>

      {/* ================================================================== */}
      {/* SECTION 1: FASILITAS STUDIO                                        */}
      {/* ================================================================== */}
      <SynchronizedGalleryCarousel
        sectionId="section-fasilitas"
        sectionNumber="1"
        sectionTitle="Fasilitas Kenyamanan Studio"
        sectionSubtitle="Dukungan ruangan ber-AC, ruang rias privat, area tunggu keluarga, dan kebersihan yang dirawat maksimal demi kenyamanan sesi Anda."
        sectionIcon={<span className="text-sm">🛋️</span>}
        badgeLabel="Section 1 · Fasilitas Ruangan"
        items={STUDIO_FACILITY_DATA}
        onPhotoZoom={handlePhotoZoomWrapper}
      />

      {/* ================================================================== */}
      {/* SECTION 2: ALAT STUDIO (Professional Studio Gear)                  */}
      {/* ================================================================== */}
      <SynchronizedGalleryCarousel
        sectionId="section-alat"
        sectionNumber="2"
        sectionTitle="Alat &amp; Perlengkapan Studio Profesional"
        sectionSubtitle="Setup lighting flash studio Godox, diffuser softbox, kamera mirrorless beresolusi tinggi, serta layar monitor review langsung."
        sectionIcon={<Lightbulb className="w-3.5 h-3.5 text-[#5C725A]" />}
        badgeLabel="Section 2 · Peralatan Studio"
        items={STUDIO_EQUIPMENT_DATA}
        onPhotoZoom={handlePhotoZoomWrapper}
      />

      {/* ================================================================== */}
      {/* SECTION 3: BACKGROUND STUDIO (Dinamis Sesuai Cabang Aktif)          */}
      {/* ================================================================== */}
      <SynchronizedGalleryCarousel
        sectionId="section-background"
        sectionNumber="3"
        sectionTitle={`Pilihan Background ${branchBadgeLabel}`}
        sectionSubtitle={`Daftar latar resmi yang aktif dan dapat dipilih untuk pemotretan di ${currentBranchName}. Setiap latar memiliki karakter visual dan suasana khas.`}
        sectionIcon={<Layers className="w-3.5 h-3.5 text-[#5C725A]" />}
        badgeLabel={`Section 3 · Background ${selectedBranch === 'cabang-2' ? 'Studio 2' : 'Studio 1'}`}
        items={dynamicBackgrounds}
        onPhotoZoom={handlePhotoZoomWrapper}
      />

    </div>
  );
};
