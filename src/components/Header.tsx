import React, { useState, useEffect } from 'react';
import { Camera, Calendar, Sparkles, MapPin, MessageCircle, Home } from 'lucide-react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBranch?: StudioBranch;
  onOpenBranchModal?: () => void;
  onOpenBooking: () => void;
  onBackToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedBranch = 'cabang-1',
  onOpenBranchModal,
  onOpenBooking,
  onBackToLanding,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const currentBranchInfo = STUDIO_BRANCHES.find(b => b.id === selectedBranch) || STUDIO_BRANCHES[0];

  // Check studio open status dynamically (08:00 - 21:00 WIB)
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
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const interval = setInterval(() => {
      setIsOpen(checkIsOpen());
    }, 15000); // Check status every 15s

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className={`hidden lg:block sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8DDD6] shadow-xs' 
        : 'bg-[#FDFBF7] border-b border-[#E8DDD6]'
    }`}>
      {/* Top Banner Notice (Sharp & Luxurious Charcoal) */}
      <div className="bg-[#2A2A2A] text-[#F2E9E4] text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            {isOpen ? (
              <>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A9BCA7] animate-pulse shadow-sm shadow-[#A9BCA7]/50"></span>
                <span className="text-[#A9BCA7] font-bold uppercase tracking-wider text-[10px]">Studio Buka Hari Ini • 08:00 - 21:00 WIB</span>
              </>
            ) : (
              <>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shadow-sm shadow-rose-400/50"></span>
                <span className="text-rose-300 font-bold uppercase tracking-wider text-[10px]">Studio Tutup • Buka Jam 08:00 - 21:00 WIB</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-[#F2E9E4]/90 text-[10.5px]">
            <a 
              href={`https://wa.me/${currentBranchInfo.whatsappNumber || (selectedBranch === 'cabang-2' ? '6285168879214' : '6287777538164')}?text=Halo%20Admin%20${encodeURIComponent(currentBranchInfo.name)},%20saya%20mau%20tanya%20jadwal%20slot%20kosong`}
              target="_blank" 
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1.5 transition-colors font-semibold uppercase tracking-wider"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#A9BCA7]" />
              <span>Admin WA ({currentBranchInfo.badge}): +62 {currentBranchInfo.whatsappDisplay?.replace(/^0/, '') || (selectedBranch === 'cabang-2' ? '851-6887-9214' : '877-7753-8164')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo (Logo Resmi Alviero Studio) */}
        <div 
          onClick={() => {
            if (onBackToLanding) {
              onBackToLanding();
            } else {
              setActiveTab('katalog');
            }
          }} 
          className="flex items-center gap-3 cursor-pointer group"
          title="Klik untuk kembali ke Halaman Awal"
        >
          <img
            src="/images/alviero-logo-official.png"
            alt="Alviero Studio"
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#FDFBF7] p-1 border border-[#E8DDD6] shadow-2xs">
          {/* Tombol Beranda Utama (Ikon Rumah) */}
          <button
            type="button"
            onClick={() => {
              if (onBackToLanding) {
                onBackToLanding();
              } else {
                setActiveTab('katalog');
              }
            }}
            className="w-8 h-7.5 flex items-center justify-center cursor-pointer text-[#6E856C] hover:text-[#3A3A3A] hover:bg-[#F2E9E4] transition-colors border-r border-[#E8DDD6]/80 mr-0.5 group"
            title="Kembali ke Beranda Awal"
            aria-label="Kembali ke Beranda Awal"
          >
            <Home className="w-4 h-4 stroke-[1.8] text-[#6E856C] group-hover:text-[#3A3A3A] transition-transform group-hover:scale-110" />
          </button>

          <button
            onClick={() => setActiveTab('katalog')}
            className={`px-4 py-1.5 text-xs transition-all flex items-center gap-1.5 cursor-pointer font-serif uppercase tracking-wider ${
              activeTab === 'katalog' || activeTab === 'pricelist-sheets'
                ? 'bg-[#3A3A3A] text-white shadow-xs font-bold'
                : 'text-[#5A5A5A] hover:text-[#3A3A3A] hover:bg-[#F2E9E4] font-semibold'
            }`}
          >
            <Camera className={`w-3.5 h-3.5 stroke-[1.8] ${activeTab === 'katalog' || activeTab === 'pricelist-sheets' ? 'text-[#A9BCA7]' : 'text-[#6E856C]'}`} />
            Katalog & Pricelist
          </button>

          <button
            onClick={() => setActiveTab('strip-builder')}
            className={`px-4 py-1.5 text-xs transition-all flex items-center gap-1.5 cursor-pointer font-serif uppercase tracking-wider ${
              activeTab === 'strip-builder'
                ? 'bg-[#3A3A3A] text-white shadow-xs font-bold'
                : 'text-[#5A5A5A] hover:text-[#3A3A3A] hover:bg-[#F2E9E4] font-semibold'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 stroke-[1.8] ${activeTab === 'strip-builder' ? 'text-[#A9BCA7]' : 'text-[#6E856C]'}`} />
            Photo Strip
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-1.5 text-xs transition-all flex items-center gap-1.5 cursor-pointer font-serif uppercase tracking-wider ${
              activeTab === 'rules'
                ? 'bg-[#3A3A3A] text-white shadow-xs font-bold'
                : 'text-[#5A5A5A] hover:text-[#3A3A3A] hover:bg-[#F2E9E4] font-semibold'
            }`}
          >
            <MapPin className={`w-3.5 h-3.5 stroke-[1.8] ${activeTab === 'rules' ? 'text-[#A9BCA7]' : 'text-[#6E856C]'}`} />
            Panduan & Lokasi
          </button>
        </nav>

        {/* CTA & Branch Switcher */}
        <div className="flex items-center gap-2.5">
          {onOpenBranchModal && (
            <button
              type="button"
              onClick={onOpenBranchModal}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F2E9E4] text-[#3A3A3A] font-bold text-xs border border-[#E8DDD6] hover:border-[#3A3A3A] transition-all cursor-pointer shadow-2xs uppercase tracking-wider"
            >
              <MapPin className="w-3.5 h-3.5 text-[#6E856C] stroke-[1.8]" />
              <span>{currentBranchInfo.shortName}</span>
              <span className="text-[10px] text-[#6E856C] font-black underline underline-offset-2 ml-0.5">Ganti</span>
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="relative group bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-serif font-bold text-xs px-5 py-2.5 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer border border-[#3A3A3A] uppercase tracking-wider"
          >
            <Calendar className="w-4 h-4 text-[#A9BCA7] stroke-[1.8] group-hover:scale-110 transition-transform" />
            <span>Reservasi</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#A9BCA7] animate-ping"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
