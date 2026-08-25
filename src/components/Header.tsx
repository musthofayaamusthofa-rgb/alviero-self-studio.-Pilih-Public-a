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
      <div className="bg-[#232d38] text-stone-200 text-xs py-1.5 px-4 transition-all border-b border-stone-800/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            {isOpen ? (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-[#9fc4a8] animate-pulse shadow-sm shadow-[#9fc4a8]/50"></span>
                <span className="text-[#c1dec7] font-bold">Studio Buka Hari Ini • 08:00 - 21:00 WIB</span>
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-rose-400 animate-pulse shadow-sm shadow-rose-400/50"></span>
                <span className="text-rose-200 font-bold">Studio Tutup • Buka Jam 08:00 - 21:00 WIB</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-stone-300 text-xs">
            <a 
              href="https://wa.me/6287777538164?text=Halo%20Admin%20Alviero%20Studio%20Foto,%20saya%20mau%20tanya%20jadwal%20slot%20kosong" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-[#c1dec7] flex items-center gap-1.5 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#9fc4a8]" />
              <span>Admin WA: +62 877-7753-8164</span>
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
        <nav className="hidden lg:flex items-center gap-1 bg-[#f4f3ee] p-1 rounded-full border border-stone-200/80 shadow-2xs">
          <button
            onClick={() => setActiveTab('katalog')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'katalog' || activeTab === 'pricelist-sheets'
                ? 'bg-white text-stone-800 shadow-xs border border-stone-200/80 font-extrabold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#6c8c74]" />
            Katalog & Pricelist
          </button>

          <button
            onClick={() => setActiveTab('strip-builder')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'strip-builder'
                ? 'bg-white text-stone-800 shadow-xs border border-stone-200/80 font-extrabold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Bikin Photo Strip
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-white text-stone-800 shadow-xs border border-stone-200/80 font-extrabold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#6c8c74]" />
            Panduan & Lokasi
          </button>
        </nav>

        {/* CTA & Branch Switcher */}
        <div className="flex items-center gap-2.5">
          {onOpenBranchModal && (
            <button
              type="button"
              onClick={onOpenBranchModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f4f3ee] hover:bg-[#eae6dd] text-stone-800 font-extrabold text-xs border border-stone-200 transition-all cursor-pointer active:scale-95"
            >
              <span>{currentBranchInfo.icon} {currentBranchInfo.shortName}</span>
              <span className="text-[10px] text-[#3d6345] font-black">Ganti</span>
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="relative group bg-[#6c8c74] hover:bg-[#57735e] text-white font-extrabold text-xs px-5 py-2.5 rounded-full shadow-xs hover:shadow-sm transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#d4e6d8] group-hover:scale-110 transition-transform" />
            <span>Hitung & Reservasi</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex overflow-x-auto border-t border-stone-200/80 px-3 py-2 gap-1.5 scroll-mask-x bg-[#faf9f6]/95 backdrop-blur-md text-xs">
        <button
          onClick={() => setActiveTab('katalog')}
          className={`shrink-0 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'katalog' || activeTab === 'pricelist-sheets' ? 'bg-[#6c8c74] text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-200'
          }`}
        >
          📷 Katalog & Pricelist
        </button>
        <button
          onClick={() => setActiveTab('strip-builder')}
          className={`shrink-0 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'strip-builder' ? 'bg-[#6c8c74] text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-200'
          }`}
        >
          ✨ Photo Strip
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`shrink-0 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'rules' ? 'bg-[#6c8c74] text-white shadow-xs' : 'bg-white text-stone-700 border border-stone-200'
          }`}
        >
          📍 Lokasi & FAQ
        </button>
      </div>
    </header>
  );
};
