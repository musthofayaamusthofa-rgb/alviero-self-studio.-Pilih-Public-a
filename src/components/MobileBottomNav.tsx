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
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-xl border-t border-[#E8E1D5] px-3.5 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] pb-safe">
      <div className="grid grid-cols-4 gap-2 text-center max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('katalog')}
          className={`min-h-[46px] flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
            activeTab === 'katalog' || activeTab === 'pricelist-sheets'
              ? 'text-white bg-[#1C1A17] font-bold shadow-[0_4px_16px_rgba(28,26,23,0.25)] scale-[1.02]'
              : 'text-[#6B635B] hover:text-[#1C1A17] hover:bg-[#F2ECE4]/60 font-medium'
          }`}
        >
          <Camera className={`w-4.5 h-4.5 mb-0.5 ${activeTab === 'katalog' || activeTab === 'pricelist-sheets' ? 'text-[#D4AF37]' : 'text-[#7D756C]'}`} />
          <span className="text-[10px] tracking-wide leading-none">Katalog</span>
        </button>

        <button
          onClick={() => setActiveTab('strip-builder')}
          className={`min-h-[46px] flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
            activeTab === 'strip-builder'
              ? 'text-white bg-[#1C1A17] font-bold shadow-[0_4px_16px_rgba(28,26,23,0.25)] scale-[1.02]'
              : 'text-[#6B635B] hover:text-[#1C1A17] hover:bg-[#F2ECE4]/60 font-medium'
          }`}
        >
          <Sparkles className={`w-4.5 h-4.5 mb-0.5 ${activeTab === 'strip-builder' ? 'text-[#D4AF37]' : 'text-[#7D756C]'}`} />
          <span className="text-[10px] tracking-wide leading-none">Photo Strip</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`min-h-[46px] flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
            activeTab === 'rules'
              ? 'text-white bg-[#1C1A17] font-bold shadow-[0_4px_16px_rgba(28,26,23,0.25)] scale-[1.02]'
              : 'text-[#6B635B] hover:text-[#1C1A17] hover:bg-[#F2ECE4]/60 font-medium'
          }`}
        >
          <MapPin className={`w-4.5 h-4.5 mb-0.5 ${activeTab === 'rules' ? 'text-[#D4AF37]' : 'text-[#7D756C]'}`} />
          <span className="text-[10px] tracking-wide leading-none">Panduan</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="min-h-[46px] flex flex-col items-center justify-center py-1.5 rounded-2xl text-[#1C1A17] bg-[#F2ECE4] hover:bg-[#EAE2D5] border border-[#E0D6C8] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <Calendar className="w-4.5 h-4.5 mb-0.5 text-[#8C6D46]" />
          <span className="text-[10px] tracking-wide leading-none">Booking</span>
        </button>
      </div>
    </div>
  );
};
