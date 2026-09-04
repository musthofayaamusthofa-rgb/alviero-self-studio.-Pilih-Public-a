import React, { useState } from 'react';
import { Camera, Sparkles, MapPin, Calendar, MessageCircle, X } from 'lucide-react';
import { STUDIO_BRANCHES } from '../data/pricelistData';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onBackToLanding?: () => void;
  onNavigateToPricelist?: () => void;
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
  onBackToLanding,
  onNavigateToPricelist
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const openWhatsApp = (branchId: string) => {
    const branch = STUDIO_BRANCHES.find(item => item.id === branchId) || STUDIO_BRANCHES[0];
    const message = `Halo Admin ${branch.name}, saya ingin bertanya mengenai jadwal dan layanan Alviero Studio.`;
    window.open(`https://wa.me/${branch.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setIsHelpOpen(false);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-xl border-t border-[#E8DDD6] px-1.5 py-1 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] pb-safe">
      {isHelpOpen && (
        <div className="absolute bottom-[calc(100%+8px)] left-1/2 w-[min(92vw,280px)] -translate-x-1/2 rounded-2xl border border-[#E8DDD6] bg-[#FDFBF7] p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#3A3A3A]">Info Bantuan</p>
              <p className="text-[10px] text-stone-500">Pilih studio yang ingin dihubungi</p>
            </div>
            <button
              type="button"
              onClick={() => setIsHelpOpen(false)}
              aria-label="Tutup pilihan studio"
              className="rounded-full p-1 text-stone-500 hover:bg-[#F2E9E4]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {STUDIO_BRANCHES.map(branch => (
              <button
                key={branch.id}
                type="button"
                onClick={() => openWhatsApp(branch.id)}
                className="flex min-h-[42px] items-center justify-between rounded-xl border border-[#E8DDD6] bg-white px-3 text-left transition-colors hover:border-[#6E856C] hover:bg-[#F2E9E4]/60"
              >
                <span>
                  <span className="block text-[11px] font-bold text-[#3A3A3A]">{branch.shortName.replace('Alviero Studio — ', '')}</span>
                  <span className="block text-[10px] text-stone-500">{branch.whatsappDisplay}</span>
                </span>
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-0.5 text-center max-w-md mx-auto">
        <button
          onClick={() => {
            if (onNavigateToPricelist) {
              onNavigateToPricelist();
            } else if (onBackToLanding) {
              onBackToLanding();
            } else {
              setActiveTab('katalog');
            }
            if (!onNavigateToPricelist) scrollToTop();
          }}
          className={`min-h-[42px] flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'katalog' || activeTab === 'pricelist-sheets'
              ? 'text-white bg-[#3A3A3A] font-bold shadow-xs'
              : 'text-[#5A5A5A] hover:text-[#3A3A3A] hover:bg-[#F2E9E4]/60 font-medium'
          }`}
        >
          <Camera className={`w-4 h-4 mb-0.5 stroke-[1.8] ${activeTab === 'katalog' || activeTab === 'pricelist-sheets' ? 'text-[#A9BCA7]' : 'text-[#6E856C]'}`} />
          <span className="text-[8px] uppercase tracking-wide leading-none font-bold">Pricelist</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('strip-builder');
            scrollToTop();
          }}
          className={`min-h-[42px] flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'strip-builder'
              ? 'text-white bg-[#3A3A3A] font-bold shadow-xs'
              : 'text-[#5A5A5A] hover:text-[#3A3A3A] hover:bg-[#F2E9E4]/60 font-medium'
          }`}
        >
          <Sparkles className={`w-4 h-4 mb-0.5 stroke-[1.8] ${activeTab === 'strip-builder' ? 'text-[#A9BCA7]' : 'text-[#6E856C]'}`} />
          <span className="text-[8px] uppercase tracking-wide leading-none font-bold">Strip</span>
        </button>

        <button
          type="button"
          onClick={() => setIsHelpOpen(previous => !previous)}
          aria-expanded={isHelpOpen}
          className={`min-h-[42px] flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${isHelpOpen
            ? 'bg-[#25D366] text-white font-bold shadow-xs'
            : 'text-[#5A5A5A] hover:bg-[#EAF8EE] hover:text-[#168C45] font-medium'
            }`}
        >
          <MessageCircle className={`w-4 h-4 mb-0.5 stroke-[1.8] ${isHelpOpen ? 'text-white' : 'text-[#25D366]'}`} />
          <span className="text-[8px] uppercase tracking-wide leading-none font-bold">Info Bantuan</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('rules');
            scrollToTop();
          }}
          className={`min-h-[42px] flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'rules'
              ? 'text-white bg-[#3A3A3A] font-bold shadow-xs'
              : 'text-[#5A5A5A] hover:text-[#3A3A3A] hover:bg-[#F2E9E4]/60 font-medium'
          }`}
        >
          <MapPin className={`w-4 h-4 mb-0.5 stroke-[1.8] ${activeTab === 'rules' ? 'text-[#A9BCA7]' : 'text-[#6E856C]'}`} />
          <span className="text-[8px] uppercase tracking-wide leading-none font-bold">Lokasi</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="min-h-[42px] flex flex-col items-center justify-center py-1 text-[#3A3A3A] bg-[#F2E9E4] hover:bg-[#DFCFC5] border border-[#E8DDD6] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <Calendar className="w-4 h-4 mb-0.5 stroke-[1.8] text-[#6E856C]" />
          <span className="text-[8px] uppercase tracking-wide leading-none font-bold">Booking</span>
        </button>
      </div>
    </div>
  );
};
