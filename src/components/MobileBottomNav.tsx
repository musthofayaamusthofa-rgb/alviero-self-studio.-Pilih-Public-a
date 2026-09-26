import React, { useState } from 'react';
import { Camera, Sparkles, MapPin, X } from 'lucide-react';
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
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.672 4.8 1.84 6.796L2 30l7.41-1.814A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Z" fill="#25D366"/>
                  <path d="M22.5 19.5c-.3-.15-1.77-.873-2.044-.972-.274-.1-.474-.15-.673.15-.2.3-.773.972-.947 1.173-.174.2-.348.225-.648.075-.3-.15-1.267-.467-2.413-1.49-.892-.796-1.494-1.779-1.669-2.079-.174-.3-.018-.462.131-.61.134-.134.3-.35.45-.524.15-.174.2-.3.3-.5.1-.2.05-.374-.025-.524-.075-.15-.673-1.622-.922-2.22-.243-.583-.49-.504-.673-.513l-.574-.01c-.2 0-.524.075-.8.374-.274.3-1.047 1.023-1.047 2.495 0 1.472 1.072 2.895 1.222 3.095.15.2 2.11 3.22 5.11 4.514.714.308 1.272.492 1.707.63.717.228 1.37.196 1.886.119.575-.086 1.77-.724 2.02-1.423.248-.7.248-1.298.173-1.423-.074-.124-.274-.2-.574-.35Z" fill="white"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-0.5 text-center max-w-md mx-auto">
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
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mb-0.5 shrink-0">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.672 4.8 1.84 6.796L2 30l7.41-1.814A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Z" fill={isHelpOpen ? 'white' : '#25D366'}/>
            <path d="M22.5 19.5c-.3-.15-1.77-.873-2.044-.972-.274-.1-.474-.15-.673.15-.2.3-.773.972-.947 1.173-.174.2-.348.225-.648.075-.3-.15-1.267-.467-2.413-1.49-.892-.796-1.494-1.779-1.669-2.079-.174-.3-.018-.462.131-.61.134-.134.3-.35.45-.524.15-.174.2-.3.3-.5.1-.2.05-.374-.025-.524-.075-.15-.673-1.622-.922-2.22-.243-.583-.49-.504-.673-.513l-.574-.01c-.2 0-.524.075-.8.374-.274.3-1.047 1.023-1.047 2.495 0 1.472 1.072 2.895 1.222 3.095.15.2 2.11 3.22 5.11 4.514.714.308 1.272.492 1.707.63.717.228 1.37.196 1.886.119.575-.086 1.77-.724 2.02-1.423.248-.7.248-1.298.173-1.423-.074-.124-.274-.2-.574-.35Z" fill={isHelpOpen ? '#25D366' : 'white'}/>
          </svg>
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

      </div>
    </div>
  );
};
