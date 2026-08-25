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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-stone-200/80 px-2 py-1.5 shadow-xl pb-safe">
      <div className="grid grid-cols-4 gap-1 text-center">
        <button
          onClick={() => setActiveTab('katalog')}
          className={`min-h-[48px] flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
            activeTab === 'katalog' || activeTab === 'pricelist-sheets'
              ? 'text-[#2d4c32] bg-[#e3eee3] font-bold shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 font-medium'
          }`}
        >
          <Camera className={`w-5 h-5 mb-0.5 ${activeTab === 'katalog' || activeTab === 'pricelist-sheets' ? 'scale-105 text-[#2d4c32]' : 'text-stone-600'}`} />
          <span className="text-[10px] leading-none">Katalog</span>
        </button>

        <button
          onClick={() => setActiveTab('strip-builder')}
          className={`min-h-[48px] flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
            activeTab === 'strip-builder'
              ? 'text-[#2d4c32] bg-[#e3eee3] font-bold shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 font-medium'
          }`}
        >
          <Sparkles className={`w-5 h-5 mb-0.5 ${activeTab === 'strip-builder' ? 'scale-105 text-[#2d4c32]' : 'text-stone-600'}`} />
          <span className="text-[10px] leading-none">Photo Strip</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`min-h-[48px] flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
            activeTab === 'rules'
              ? 'text-[#2d4c32] bg-[#e3eee3] font-bold shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 font-medium'
          }`}
        >
          <MapPin className={`w-5 h-5 mb-0.5 ${activeTab === 'rules' ? 'scale-105 text-[#2d4c32]' : 'text-stone-600'}`} />
          <span className="text-[10px] leading-none">Panduan</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="min-h-[48px] flex flex-col items-center justify-center py-1.5 rounded-xl text-stone-700 hover:bg-stone-100 font-bold transition-transform active:scale-95 cursor-pointer"
        >
          <Calendar className="w-5 h-5 mb-0.5 text-stone-700" />
          <span className="text-[10px] leading-none">Booking</span>
        </button>
      </div>
    </div>
  );
};
