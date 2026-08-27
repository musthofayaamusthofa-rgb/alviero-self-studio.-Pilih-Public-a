import React, { useState, useEffect } from 'react';
import { Camera, Calendar, Sparkles, MapPin, MessageCircle } from 'lucide-react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBranch?: StudioBranch;
  onOpenBranchModal?: () => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedBranch = 'cabang-1',
  onOpenBranchModal,
  onOpenBooking,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const currentBranchInfo = STUDIO_BRANCHES.find(b => b.id === selectedBranch) || STUDIO_BRANCHES[0];

  // Check studio open status dynamically (08:00 - 21:00 WIB)
  const checkIsOpen = (): boolean => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 8 && hours < 21;
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
        ? 'glass-header-scrolled border-b border-stone-200/80 shadow-xs' 
        : 'glass-header border-b border-stone-200/40'
    }`}>
      {/* Top Banner Notice */}
      <div className="bg-[#141210] text-[#E8DFD1] text-xs py-1.5 px-4 transition-all border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            {isOpen ? (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50"></span>
                <span className="text-emerald-200 font-bold">Studio Buka Hari Ini • 08:00 - 21:00 WIB</span>
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-rose-400 animate-pulse shadow-sm shadow-rose-400/50"></span>
                <span className="text-rose-200 font-bold">Studio Tutup • Buka Jam 08:00 - 21:00 WIB</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-[#D8CFBF] text-xs">
            <a 
              href="https://wa.me/6287777538164?text=Halo%20Admin%20Alviero%20Studio%20Foto,%20saya%20mau%20tanya%20jadwal%20slot%20kosong" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1.5 transition-colors font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Admin WA VIP: +62 877-7753-8164</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo (Logo Resmi Alviero Studio) */}
        <div 
          onClick={() => setActiveTab('katalog')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src="/images/alviero-logo-official.png"
            alt="Alviero Studio"
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F2ECE4] p-1 rounded-full border border-[#E0D6C8] shadow-2xs">
          <button
            onClick={() => setActiveTab('katalog')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'katalog' || activeTab === 'pricelist-sheets'
                ? 'bg-[#1C1A17] text-white shadow-xs font-bold'
                : 'text-[#5C5650] hover:text-[#1C1A17] hover:bg-stone-200/50 font-semibold'
            }`}
          >
            <Camera className={`w-3.5 h-3.5 ${activeTab === 'katalog' || activeTab === 'pricelist-sheets' ? 'text-[#D4AF37]' : 'text-[#8C6D46]'}`} />
            Katalog & Pricelist
          </button>

          <button
            onClick={() => setActiveTab('strip-builder')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'strip-builder'
                ? 'bg-[#1C1A17] text-white shadow-xs font-bold'
                : 'text-[#5C5650] hover:text-[#1C1A17] hover:bg-stone-200/50 font-semibold'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'strip-builder' ? 'text-[#D4AF37]' : 'text-[#8C6D46]'}`} />
            Bikin Photo Strip
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-[#1C1A17] text-white shadow-xs font-bold'
                : 'text-[#5C5650] hover:text-[#1C1A17] hover:bg-stone-200/50 font-semibold'
            }`}
          >
            <MapPin className={`w-3.5 h-3.5 ${activeTab === 'rules' ? 'text-[#D4AF37]' : 'text-[#8C6D46]'}`} />
            Panduan & Lokasi
          </button>
        </nav>

        {/* CTA & Branch Switcher */}
        <div className="flex items-center gap-2.5">
          {onOpenBranchModal && (
            <button
              type="button"
              onClick={onOpenBranchModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#FAF8F5] text-[#1C1A17] font-bold text-xs border border-[#E0D6C8] transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <span>{currentBranchInfo.icon} {currentBranchInfo.shortName}</span>
              <span className="text-[10px] text-[#8C6D46] font-black underline underline-offset-2">Ganti</span>
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="relative group bg-[#1C1A17] hover:bg-[#2D2A26] text-white font-serif font-bold text-xs px-5 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer border border-[#3D3832]"
          >
            <Calendar className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span>Hitung & Reservasi</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex overflow-x-auto border-t border-[#E8E1D5] px-3 py-2 gap-1.5 scroll-mask-x bg-[#FAF8F5]/95 backdrop-blur-md text-xs">
        <button
          onClick={() => setActiveTab('katalog')}
          className={`shrink-0 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'katalog' || activeTab === 'pricelist-sheets' ? 'bg-[#1C1A17] text-white shadow-xs' : 'bg-white text-stone-700 border border-[#E8E1D5]'
          }`}
        >
          📷 Katalog & Pricelist
        </button>
        <button
          onClick={() => setActiveTab('strip-builder')}
          className={`shrink-0 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'strip-builder' ? 'bg-[#1C1A17] text-white shadow-xs' : 'bg-white text-stone-700 border border-[#E8E1D5]'
          }`}
        >
          ✨ Photo Strip
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`shrink-0 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'rules' ? 'bg-[#1C1A17] text-white shadow-xs' : 'bg-white text-stone-700 border border-[#E8E1D5]'
          }`}
        >
          📍 Lokasi & FAQ
        </button>
      </div>
    </header>
  );
};
