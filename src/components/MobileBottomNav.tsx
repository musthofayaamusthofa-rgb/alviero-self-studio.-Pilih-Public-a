import React from 'react';
import { Camera, Sparkles, MapPin, Calendar } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking
}) => {
  const isKatalogActive = activeTab === 'katalog' || activeTab === 'pricelist-sheets';
  const isStripActive = activeTab === 'strip-builder';
  const isRulesActive = activeTab === 'rules';
  const isBookingActive = activeTab === 'booking-calculator';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-3 py-1.5 shadow-lg pb-safe">
      <div className="grid grid-cols-4 gap-1 text-center max-w-md mx-auto">
        {/* 1. Katalog */}
        <button
          onClick={() => setActiveTab('katalog')}
          className={`min-h-[46px] flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer active:scale-95 ${
            isKatalogActive
              ? 'text-[#967738] font-bold'
              : 'text-stone-700 hover:text-stone-900 font-normal'
          }`}
        >
          <Camera className={`w-5 h-5 mb-0.5 stroke-[1.7] ${isKatalogActive ? 'text-[#967738] scale-105' : 'text-stone-700'}`} />
          <span className="text-[10px] leading-tight font-medium">Katalog</span>
        </button>

        {/* 2. Photo Strip */}
        <button
          onClick={() => setActiveTab('strip-builder')}
          className={`min-h-[46px] flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer active:scale-95 ${
            isStripActive
              ? 'text-[#967738] font-bold'
              : 'text-stone-700 hover:text-stone-900 font-normal'
          }`}
        >
          <Sparkles className={`w-5 h-5 mb-0.5 stroke-[1.7] ${isStripActive ? 'text-[#967738] scale-105' : 'text-stone-700'}`} />
          <span className="text-[10px] leading-tight font-medium">Photo Strip</span>
        </button>

        {/* 3. Panduan */}
        <button
          onClick={() => setActiveTab('rules')}
          className={`min-h-[46px] flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer active:scale-95 ${
            isRulesActive
              ? 'text-[#967738] font-bold'
              : 'text-stone-700 hover:text-stone-900 font-normal'
          }`}
        >
          <MapPin className={`w-5 h-5 mb-0.5 stroke-[1.7] ${isRulesActive ? 'text-[#967738] scale-105' : 'text-stone-700'}`} />
          <span className="text-[10px] leading-tight font-medium">Panduan</span>
        </button>

        {/* 4. Booking (Matching Photo 1: Gold / Bronze Luxury Outline Style) */}
        <button
          onClick={onOpenBooking}
          className={`min-h-[46px] flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer active:scale-95 ${
            isBookingActive
              ? 'text-[#967738] font-bold'
              : 'text-[#967738] hover:text-[#7d632f] font-semibold'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5 stroke-[1.7] text-[#967738]" />
          <span className="text-[10px] leading-tight font-medium text-[#967738]">Booking</span>
        </button>
      </div>
    </div>
  );
};
