import React from 'react';
import { Camera, Sparkles, MapPin, Calendar } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onBackToLanding?: () => void;
}

const scrollToTop = () => {
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  } catch {
    window.scrollTo(0, 0);
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onBackToLanding
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-xl border-t border-[#E8DDD6] px-3 py-1.5 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] pb-safe">
      <div className="grid grid-cols-4 gap-1.5 text-center max-w-md mx-auto">
        <button
          onClick={() => {
            if (onBackToLanding) {
              onBackToLanding();
            } else {
              setActiveTab('katalog');
            }
            scrollToTop();
          }}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1.5 transition-all duration-200 cursor-pointer ${
            activeTab === 'katalog' || activeTab === 'pricelist-sheets'
              ? 'text-white bg-[#3A3A3A] font-bold shadow-xs'
              : 'text-[#5A5A5A] hover:text-[#3A3A3A] hover:bg-[#F2E9E4]/60 font-medium'
          }`}
        >
          <Camera className={`w-4 h-4 mb-0.5 stroke-[1.8] ${activeTab === 'katalog' || activeTab === 'pricelist-sheets' ? 'text-[#A9BCA7]' : 'text-[#6E856C]'}`} />
          <span className="text-[9px] uppercase tracking-widest leading-none font-bold">Katalog</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('strip-builder');
            scrollToTop();
          }}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1.5 transition-all duration-200 cursor-pointer ${
            activeTab === 'strip-builder'
              ? 'text-white bg-[#3A3A3A] font-bold shadow-xs'
              : 'text-[#5A5A5A] hover:text-[#3A3A3A] hover:bg-[#F2E9E4]/60 font-medium'
          }`}
        >
          <Sparkles className={`w-4 h-4 mb-0.5 stroke-[1.8] ${activeTab === 'strip-builder' ? 'text-[#A9BCA7]' : 'text-[#6E856C]'}`} />
          <span className="text-[9px] uppercase tracking-widest leading-none font-bold">Strip</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('rules');
            scrollToTop();
          }}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1.5 transition-all duration-200 cursor-pointer ${
            activeTab === 'rules'
              ? 'text-white bg-[#3A3A3A] font-bold shadow-xs'
              : 'text-[#5A5A5A] hover:text-[#3A3A3A] hover:bg-[#F2E9E4]/60 font-medium'
          }`}
        >
          <MapPin className={`w-4 h-4 mb-0.5 stroke-[1.8] ${activeTab === 'rules' ? 'text-[#A9BCA7]' : 'text-[#6E856C]'}`} />
          <span className="text-[9px] uppercase tracking-widest leading-none font-bold">Lokasi</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="min-h-[44px] flex flex-col items-center justify-center py-1.5 text-[#3A3A3A] bg-[#F2E9E4] hover:bg-[#DFCFC5] border border-[#E8DDD6] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <Calendar className="w-4 h-4 mb-0.5 stroke-[1.8] text-[#6E856C]" />
          <span className="text-[9px] uppercase tracking-widest leading-none font-bold">Booking</span>
        </button>
      </div>
    </div>
  );
};
