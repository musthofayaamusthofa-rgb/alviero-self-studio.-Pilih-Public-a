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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xl border-t border-[#E8E1D5] px-3 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-safe">
      <div className="grid grid-cols-4 gap-1.5 text-center max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('katalog')}
          className={`min-h-[48px] flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
            activeTab === 'katalog' || activeTab === 'pricelist-sheets'
              ? 'text-white bg-[#8DA4B8] font-bold shadow-xs'
              : 'text-[#5C5650] hover:text-[#2D2A26] font-medium'
          }`}
        >
          <Camera className={`w-5 h-5 mb-0.5 ${activeTab === 'katalog' || activeTab === 'pricelist-sheets' ? 'scale-105 text-white' : 'text-[#5C5650]'}`} />
          <span className="text-[10px] leading-none">Katalog</span>
        </button>

        <button
          onClick={() => setActiveTab('strip-builder')}
          className={`min-h-[48px] flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
            activeTab === 'strip-builder'
              ? 'text-white bg-[#8DA4B8] font-bold shadow-xs'
              : 'text-[#5C5650] hover:text-[#2D2A26] font-medium'
          }`}
        >
          <Sparkles className={`w-5 h-5 mb-0.5 ${activeTab === 'strip-builder' ? 'scale-105 text-white' : 'text-[#5C5650]'}`} />
          <span className="text-[10px] leading-none">Photo Strip</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`min-h-[48px] flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
            activeTab === 'rules'
              ? 'text-white bg-[#8DA4B8] font-bold shadow-xs'
              : 'text-[#5C5650] hover:text-[#2D2A26] font-medium'
          }`}
        >
          <MapPin className={`w-5 h-5 mb-0.5 ${activeTab === 'rules' ? 'scale-105 text-white' : 'text-[#5C5650]'}`} />
          <span className="text-[10px] leading-none">Panduan</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="min-h-[48px] flex flex-col items-center justify-center py-1.5 rounded-xl text-[#5C5650] hover:text-[#2D2A26] hover:bg-[#F3ECE0] font-bold transition-transform active:scale-95 cursor-pointer"
        >
          <Calendar className="w-5 h-5 mb-0.5 text-[#5C5650]" />
          <span className="text-[10px] leading-none">Booking</span>
        </button>
      </div>
    </div>
  );
};
