import React from 'react';
import { Camera, Sparkles, MapPin, Calendar } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onBackToLanding?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onBackToLanding
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xl border-t border-[#D5CEC2] px-3 py-1.5 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] pb-safe">
      <div className="grid grid-cols-4 gap-1.5 text-center max-w-md mx-auto">
        <button
          onClick={() => {
            if (onBackToLanding) {
              onBackToLanding();
            } else {
              setActiveTab('katalog');
            }
          }}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1.5 transition-all duration-200 cursor-pointer ${
            activeTab === 'katalog' || activeTab === 'pricelist-sheets'
              ? 'text-white bg-[#1C1A17] font-bold shadow-xs'
              : 'text-[#6B635B] hover:text-[#1C1A17] hover:bg-[#F2ECE4]/60 font-medium'
          }`}
        >
          <Camera className={`w-4 h-4 mb-0.5 stroke-[1.8] ${activeTab === 'katalog' || activeTab === 'pricelist-sheets' ? 'text-[#D4AF37]' : 'text-[#7D756C]'}`} />
          <span className="text-[9px] uppercase tracking-widest leading-none font-bold">Katalog</span>
        </button>

        <button
          onClick={() => setActiveTab('strip-builder')}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1.5 transition-all duration-200 cursor-pointer ${
            activeTab === 'strip-builder'
              ? 'text-white bg-[#1C1A17] font-bold shadow-xs'
              : 'text-[#6B635B] hover:text-[#1C1A17] hover:bg-[#F2ECE4]/60 font-medium'
          }`}
        >
          <Sparkles className={`w-4 h-4 mb-0.5 stroke-[1.8] ${activeTab === 'strip-builder' ? 'text-[#D4AF37]' : 'text-[#7D756C]'}`} />
          <span className="text-[9px] uppercase tracking-widest leading-none font-bold">Strip</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1.5 transition-all duration-200 cursor-pointer ${
            activeTab === 'rules'
              ? 'text-white bg-[#1C1A17] font-bold shadow-xs'
              : 'text-[#6B635B] hover:text-[#1C1A17] hover:bg-[#F2ECE4]/60 font-medium'
          }`}
        >
          <MapPin className={`w-4 h-4 mb-0.5 stroke-[1.8] ${activeTab === 'rules' ? 'text-[#D4AF37]' : 'text-[#7D756C]'}`} />
          <span className="text-[9px] uppercase tracking-widest leading-none font-bold">Lokasi</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="min-h-[44px] flex flex-col items-center justify-center py-1.5 text-[#1C1A17] bg-[#F2ECE4] hover:bg-[#EAE2D5] border border-[#D5CEC2] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <Calendar className="w-4 h-4 mb-0.5 stroke-[1.8] text-[#8C6D46]" />
          <span className="text-[9px] uppercase tracking-widest leading-none font-bold">Booking</span>
        </button>
      </div>
    </div>
  );
};
