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
        ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#D5CEC2] shadow-xs' 
        : 'bg-[#FAF8F5] border-b border-[#E0D9CE]'
    }`}>
      {/* Top Banner Notice (Sharp & Luxurious) */}
      <div className="bg-[#141210] text-[#E8DFD1] text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            {isOpen ? (
              <>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50"></span>
                <span className="text-emerald-300 font-bold uppercase tracking-wider text-[10px]">Studio Buka Hari Ini • 08:00 - 21:00 WIB</span>
              </>
            ) : (
              <>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shadow-sm shadow-rose-400/50"></span>
                <span className="text-rose-300 font-bold uppercase tracking-wider text-[10px]">Studio Tutup • Buka Jam 08:00 - 21:00 WIB</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-[#D8CFBF] text-[10.5px]">
            <a 
              href="https://wa.me/6287777538164?text=Halo%20Admin%20Alviero%20Studio%20Foto,%20saya%20mau%20tanya%20jadwal%20slot%20kosong" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1.5 transition-colors font-semibold uppercase tracking-wider"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Admin WA VIP: +62 877-7753-8164</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header (Sharp Minimalist Layout) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
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

        {/* Desktop Navigation Tabs (Sudut Tegas & Modern) */}
        <nav className="hidden lg:flex items-center gap-1 bg-white p-1 border border-[#D5CEC2] shadow-2xs">
          <button
            onClick={() => setActiveTab('katalog')}
            className={`px-4 py-1.5 text-xs transition-all flex items-center gap-1.5 cursor-pointer font-serif uppercase tracking-wider ${
              activeTab === 'katalog' || activeTab === 'pricelist-sheets'
                ? 'bg-[#1C1A17] text-white shadow-xs font-bold'
                : 'text-[#5C5650] hover:text-[#1C1A17] hover:bg-[#FAF8F5] font-semibold'
            }`}
          >
            <Camera className={`w-3.5 h-3.5 stroke-[1.8] ${activeTab === 'katalog' || activeTab === 'pricelist-sheets' ? 'text-[#D4AF37]' : 'text-[#8C6D46]'}`} />
            Katalog & Pricelist
          </button>

          <button
            onClick={() => setActiveTab('strip-builder')}
            className={`px-4 py-1.5 text-xs transition-all flex items-center gap-1.5 cursor-pointer font-serif uppercase tracking-wider ${
              activeTab === 'strip-builder'
                ? 'bg-[#1C1A17] text-white shadow-xs font-bold'
                : 'text-[#5C5650] hover:text-[#1C1A17] hover:bg-[#FAF8F5] font-semibold'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 stroke-[1.8] ${activeTab === 'strip-builder' ? 'text-[#D4AF37]' : 'text-[#8C6D46]'}`} />
            Photo Strip
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-1.5 text-xs transition-all flex items-center gap-1.5 cursor-pointer font-serif uppercase tracking-wider ${
              activeTab === 'rules'
                ? 'bg-[#1C1A17] text-white shadow-xs font-bold'
                : 'text-[#5C5650] hover:text-[#1C1A17] hover:bg-[#FAF8F5] font-semibold'
            }`}
          >
            <MapPin className={`w-3.5 h-3.5 stroke-[1.8] ${activeTab === 'rules' ? 'text-[#D4AF37]' : 'text-[#8C6D46]'}`} />
            Panduan & Lokasi
          </button>
        </nav>

        {/* CTA & Branch Switcher (Sudut Tegas & Elegan) */}
        <div className="flex items-center gap-2.5">
          {onOpenBranchModal && (
            <button
              type="button"
              onClick={onOpenBranchModal}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#FAF8F5] text-[#1C1A17] font-bold text-xs border border-[#D5CEC2] hover:border-[#1C1A17] transition-all cursor-pointer shadow-2xs uppercase tracking-wider"
            >
              <MapPin className="w-3.5 h-3.5 text-[#8C6D46] stroke-[1.8]" />
              <span>{currentBranchInfo.shortName}</span>
              <span className="text-[10px] text-[#8C6D46] font-black underline underline-offset-2 ml-0.5">Ganti</span>
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="relative group bg-[#1C1A17] hover:bg-[#2D2A26] text-white font-serif font-bold text-xs px-5 py-2.5 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer border border-[#1C1A17] uppercase tracking-wider"
          >
            <Calendar className="w-4 h-4 text-[#D4AF37] stroke-[1.8] group-hover:scale-110 transition-transform" />
            <span>Reservasi</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
