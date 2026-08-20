import React, { useState, useEffect } from 'react';
import { Camera, Calendar, Sparkles, MapPin, MessageCircle, Layers, Building2 } from 'lucide-react';
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
        ? 'glass-header-scrolled border-b border-slate-200/80 shadow-xs' 
        : 'glass-header border-b border-slate-200/40'
    }`}>
      {/* Top Banner Notice */}
      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs py-1.5 px-4 transition-all border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            {isOpen ? (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50"></span>
                <span className="text-emerald-300 font-bold">Studio Buka Hari Ini • 08:00 - 21:00 WIB</span>
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500/50"></span>
                <span className="text-rose-300 font-bold">Studio Tutup • Buka Jam 08:00 - 21:00 WIB</span>
              </>
            )}
            <span className="hidden md:inline text-slate-500">|</span>
            {onOpenBranchModal && (
              <button
                type="button"
                onClick={onOpenBranchModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-600/60 hover:bg-indigo-600 border border-indigo-400/50 text-white font-bold text-[11px] transition-all cursor-pointer"
              >
                <span>{currentBranchInfo.icon} {currentBranchInfo.shortName}</span>
                <span className="underline opacity-80 text-[10px]">[Ganti]</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-xs">
            <a 
              href="https://wa.me/6287777538164?text=Halo%20Admin%20Alviero%20Studio%20Foto,%20saya%20mau%20tanya%20jadwal%20slot%20kosong" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin WA: +62 877-7753-8164</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('katalog')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 group-hover:shadow-indigo-500/20 transition-all duration-300 border border-indigo-500/20">
            <Camera className="w-5 h-5 text-indigo-300 group-hover:rotate-6 transition-transform" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 flex-wrap leading-none">
              <span className="font-black tracking-wider text-xl text-slate-900 uppercase leading-none">
                ALVIERO
              </span>
              <span className="inline-flex items-center h-4.5 text-[8px] sm:text-[9px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 border border-indigo-200/60 font-extrabold px-2 rounded-full uppercase leading-none align-middle shadow-2xs">
                Studio Foto & SelfStudio
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
          <button
            onClick={() => setActiveTab('katalog')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'katalog' || activeTab === 'pricelist-sheets'
                ? 'bg-white text-indigo-950 shadow-xs border border-slate-200 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-indigo-600" />
            Katalog & Pricelist
          </button>

          <button
            onClick={() => setActiveTab('strip-builder')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'strip-builder'
                ? 'bg-white text-rose-950 shadow-xs border border-slate-200 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            Bikin Photo Strip
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-white text-emerald-950 shadow-xs border border-slate-200 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            Panduan & Lokasi
          </button>
        </nav>

        {/* CTA & Branch Switcher */}
        <div className="flex items-center gap-2.5">
          {onOpenBranchModal && (
            <button
              type="button"
              onClick={onOpenBranchModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs border border-slate-300/80 transition-all cursor-pointer active:scale-95"
            >
              <span>{currentBranchInfo.icon} {currentBranchInfo.shortName}</span>
              <span className="text-[10px] text-indigo-600 font-black">Ganti</span>
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="relative group bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
            <span>Hitung & Reservasi</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex overflow-x-auto border-t border-slate-200/80 px-3 py-2 gap-1.5 scroll-mask-x bg-slate-50/90 backdrop-blur-md text-xs">
        <button
          onClick={() => setActiveTab('katalog')}
          className={`shrink-0 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'katalog' || activeTab === 'pricelist-sheets' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          📷 Katalog & Pricelist
        </button>
        <button
          onClick={() => setActiveTab('strip-builder')}
          className={`shrink-0 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'strip-builder' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          ✨ Photo Strip
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`shrink-0 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'rules' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          📍 Lokasi & FAQ
        </button>
      </div>
    </header>
  );
};
