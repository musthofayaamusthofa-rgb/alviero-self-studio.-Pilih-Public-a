import React, { useState } from 'react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';
import {
  MapPin, Clock, Navigation, Copy, Check, MessageCircle,
  Sparkles, Car, Wind, Camera, Heart, ExternalLink
} from 'lucide-react';

interface StudioInfoAndRulesProps {
  selectedBranch?: StudioBranch;
  onNavigateToFacilities?: () => void;
}

export const StudioInfoAndRules: React.FC<StudioInfoAndRulesProps> = ({
  selectedBranch = 'cabang-1',
  onNavigateToFacilities
}) => {
  const [copiedBranch, setCopiedBranch] = useState<string | null>(null);

  const studio1 = STUDIO_BRANCHES.find(b => b.id === 'cabang-1') || STUDIO_BRANCHES[0];
  const studio2 = STUDIO_BRANCHES.find(b => b.id === 'cabang-2') || STUDIO_BRANCHES[1];

  const handleCopyAddress = (branchId: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedBranch(branchId);
    setTimeout(() => setCopiedBranch(null), 2000);
  };

  const studios = [
    {
      id: 'cabang-1',
      name: 'Alviero Studio — Studio 1',
      subtitle: 'Karangploso, Kabupaten Malang',
      badge: 'Studio 1',
      address: 'Jl. Raya Kertanegara, RT.003/RW.001, Karangploso, Girimoyo, Kec. Karang Ploso, Kabupaten Malang, Jawa Timur 65151',
      mapsUrl: 'https://maps.app.goo.gl/oxtptpr3RSDL9zCj6',
      reviewUrl: 'https://www.google.com/maps/place/Alviero+Studio+Foto/@-7.8935471,112.5930502,17z/data=!4m18!1m9!3m8!1s0x2e788121b3705f25:0xed1add8fb06fdc8!2sAlviero+Studio+Foto!8m2!3d-7.8935471!4d112.5956251!9m1!1b1!16s%2Fg%2F11q9m93g86!3m7!1s0x2e788121b3705f25:0xed1add8fb06fdc8!8m2!3d-7.8935471!4d112.5956251!9m1!1b1!16s%2Fg%2F11q9m93g86?entry=ttu',
      whatsappNumber: '6287777538164',
      whatsappDisplay: '0877-7753-8164',
      operationalHours: 'Setiap Hari: 08:00 - 21:00 WIB',
      backdrops: ['Hijau Pastel', 'Cream', 'Limbo', 'Putih Tengah', 'Putih Jendela'],
    },
    {
      id: 'cabang-2',
      name: 'Alviero Studio — Studio 2',
      subtitle: 'Dinoyo Gajayana, Kota Malang',
      badge: 'Studio 2',
      address: 'Ruko Gajayana, Jl. Simpang Gajayana No.Kav.P, Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144',
      mapsUrl: 'https://maps.app.goo.gl/W4Jojd1B9TBZxWWP9',
      reviewUrl: 'https://www.google.com/maps/place/Alviero+Studio+Foto+2/@-7.9465117,112.6053447,17z/data=!3m1!4b1!4m6!3m5!1s0x2e78830048878fc5:0x90e97fc84d555935!8m2!3d-7.946517!4d112.6079196!16s%2Fg%2F11yqbx4j72?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D',
      whatsappNumber: '6285168879214',
      whatsappDisplay: '0851-6887-9214',
      operationalHours: 'Setiap Hari: 08:00 - 21:00 WIB',
      backdrops: [
        'Studio Foto: Hitam, Putih, Abu-abu, Coklat Jendela, Tematik Cream (Maks 5 Org)',
        'SelfStudio: Abu-abu, Biru, Putih, Tematik Cream'
      ],
    }
  ];

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-12 text-left animate-in fade-in duration-300">

      {/* 1. Header Lokasi Studio */}
      <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-10 border border-[#E8DDD6] shadow-sm relative overflow-hidden text-center space-y-3">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A9BCA7] via-[#6E856C] to-[#3A3A3A]" />

        <div className="inline-flex items-center gap-1.5 bg-[#FDFBF7] text-[#6E856C] text-[11px] font-mono font-bold tracking-widest uppercase px-3.5 py-1 rounded-full border border-[#E8DDD6]">
          <MapPin className="w-3.5 h-3.5 text-[#6E856C]" />
          <span>Informasi Alamat & Petunjuk Arah</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#3A3A3A] tracking-wide uppercase">
          Lokasi Alviero Studio Foto
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-2xl mx-auto leading-relaxed">
          Alviero Studio hadir di dua lokasi strategis di Malang: <strong>Studio 1 Karangploso</strong> dan <strong>Studio 2 Dinoyo Gajayana</strong>. Seluruh studio buka setiap hari pukul <strong>08:00 - 21:00 WIB</strong>.
        </p>
      </div>

      {/* 2. Grid Dua Lokasi Studio Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        {studios.map((studio) => {
          const isSelected = selectedBranch === studio.id;
          const isCopied = copiedBranch === studio.id;

          return (
            <div
              key={studio.id}
              className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm relative group ${isSelected
                ? 'border-[#6E856C] ring-2 ring-[#A9BCA7]/40 shadow-md'
                : 'border-[#E8DDD6] hover:border-[#6E856C]'
                }`}
            >
              {/* Top Accent Bar */}
              <div className={`h-2 w-full ${isSelected ? 'bg-[#6E856C]' : 'bg-[#3A3A3A]'}`} />

              <div className="p-6 sm:p-8 space-y-5 flex-1">

                {/* Header Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-block bg-[#F2E9E4] text-[#3A3A3A] text-[10px] font-serif font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#E8DDD6]">
                      {studio.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3A3A3A]">
                      {studio.name}
                    </h2>
                    <p className="text-xs text-stone-500 font-sans font-medium">
                      {studio.subtitle}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5 stroke-[1.8]" />
                  </div>
                </div>

                {/* Jam Operasional */}
                <div className="flex items-center gap-2 bg-[#FDFBF7] p-3 rounded-2xl border border-[#E8DDD6] text-xs font-sans text-stone-700">
                  <Clock className="w-4 h-4 text-[#6E856C] shrink-0" />
                  <span><strong>Jam Buka:</strong> {studio.operationalHours}</span>
                </div>

                {/* Alamat Lengkap Box */}
                <div className="space-y-1.5 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DDD6]">
                  <div className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#6E856C]" />
                    <span>Alamat Lengkap:</span>
                  </div>
                  <p className="text-xs text-stone-800 font-sans leading-relaxed font-medium">
                    {studio.address}
                  </p>
                </div>

                {/* Background Tersedia */}
                <div className="space-y-2">
                  <div className="text-[11px] font-serif font-bold text-[#3A3A3A] uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#6E856C]" />
                    <span>Pilihan Background Studio:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {studio.backdrops.map((bg, idx) => (
                      <span
                        key={idx}
                        className="text-[10.5px] bg-[#FDFBF7] text-stone-700 font-sans px-2.5 py-1 rounded-xl border border-[#E8DDD6]"
                      >
                        • {bg}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fasilitas & Keunggulan */}
                <div className="space-y-2 pt-1 border-t border-[#F2E9E4]">
                  <button
                    type="button"
                    onClick={onNavigateToFacilities}
                    className="w-full min-h-11 px-3.5 py-2.5 rounded-xl border border-[#A9BCA7] bg-[#FDFBF7] hover:bg-[#EBF2EA] text-left text-[11px] font-serif font-bold text-[#3A3A3A] uppercase tracking-wider flex items-center justify-between gap-2 cursor-pointer group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E856C] focus-visible:ring-offset-2"
                    aria-label="Buka halaman fasilitas dan layanan studio"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#6E856C]" />
                      <span className="group-hover:text-[#6E856C] transition-colors">Fasilitas & layanan Studio</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#6E856C] shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>

              </div>

              {/* Action CTA Buttons */}
              <div className="p-5 sm:p-6 bg-[#FDFBF7] border-t border-[#E8DDD6] space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={studio.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#A9BCA7]" />
                    <span>Buka Maps ↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyAddress(studio.id, studio.address)}
                    className="w-full py-2.5 px-3 bg-white hover:bg-[#F2E9E4] text-[#3A3A3A] font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 border border-[#E8DDD6] cursor-pointer active:scale-95 shadow-2xs"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#6E856C]" />
                        <span className="text-[#6E856C]">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-500" />
                        <span>Salin Alamat</span>
                      </>
                    )}
                  </button>
                </div>

                {studio.reviewUrl && (
                  <a
                    href={studio.reviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 bg-white hover:bg-[#FAF7F2] text-[#3A3A3A] font-sans font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-[#E8DDD6] hover:border-[#3A3A3A] cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Ulasan Google Maps ↗</span>
                  </a>
                )}

                <a
                  href={`https://wa.me/${studio.whatsappNumber}?text=Halo%20Admin%20${encodeURIComponent(studio.name)},%20saya%20ingin%20bertanya%20mengenai%20lokasi%20dan%20rute%20menuju%20studio`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 bg-white hover:bg-emerald-50 text-emerald-800 font-sans font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-emerald-200 cursor-pointer active:scale-95 shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Admin: {studio.whatsappDisplay}</span>
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
