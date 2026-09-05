import React, { useState } from 'react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';
import {
  MapPin, Clock, Navigation, Copy, Check, MessageCircle,
  Sparkles, CheckCircle2, Car, Wind, Camera, Heart, ExternalLink
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
      embedMapsQuery: 'Jl.+Raya+Kertanegara+Karangploso+Girimoyo+Kabupaten+Malang',
      whatsappNumber: '6287777538164',
      whatsappDisplay: '0877-7753-8164',
      operationalHours: 'Setiap Hari: 08:00 - 21:00 WIB',
      backdrops: ['Hijau Pastel', 'Cream', 'Limbo', 'Putih Tengah', 'Putih Jendela'],
      highlights: [
        'Area parkir kendaraan mobil & motor luas dan nyaman',
        'Studio foto berpendingin udara & ruang rias terpisah',
        'Pilihan 5 backdrop studio foto elegan & properti lengkap',
        'Akses mudah di tepi jalan utama Karangploso arah Batu'
      ]
    },
    {
      id: 'cabang-2',
      name: 'Alviero Studio — Studio 2',
      subtitle: 'Dinoyo Gajayana, Kota Malang',
      badge: 'Studio 2',
      address: 'Ruko Gajayana, Jl. Simpang Gajayana No.Kav.P, Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144',
      mapsUrl: 'https://maps.app.goo.gl/W4Jojd1B9TBZxWWP9',
      embedMapsQuery: 'Ruko+Gajayana+Jl+Simpang+Gajayana+Dinoyo+Lowokwaru+Kota+Malang',
      whatsappNumber: '6285168879214',
      whatsappDisplay: '0851-6887-9214',
      operationalHours: 'Setiap Hari: 08:00 - 21:00 WIB',
      backdrops: [
        'Studio Foto: Hitam, Putih, Abu-abu, Coklat Jendela, Tematik Cream (Maks 5 Org)',
        'SelfStudio: Abu-abu, Biru, Putih, Tematik Cream'
      ],
      highlights: [
        'Terletak di Lantai 2 (suasana privat & eksklusif)',
        'Lokasi strategis pusat kota, dekat kampus UB, UIN, UM, Unisma',
        'Pilihan background berbeda untuk Studio Foto (5 Latar) & SelfStudio (4 Latar)',
        'Ruang make up & ganti baju'
      ]
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
                    className="w-full text-left text-[11px] font-serif font-bold text-[#3A3A3A] uppercase tracking-wider flex items-center justify-between gap-1.5 cursor-pointer group"
                    aria-label="Buka halaman fasilitas dan layanan studio"
                  >
                    <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#6E856C]" />
                      <span className="group-hover:text-[#6E856C] transition-colors">Fasilitas & Layanan Studio:</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#6E856C] opacity-70 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <ul className="space-y-1.5 text-xs text-stone-600 font-sans">
                    {studio.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#6E856C] shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
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
