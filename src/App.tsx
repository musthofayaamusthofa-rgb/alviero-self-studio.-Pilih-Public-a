import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PricelistViewer } from './components/PricelistViewer';
import { PhotoStripCustomizer } from './components/PhotoStripCustomizer';
import { StudioInfoAndRules } from './components/StudioInfoAndRules';
import { BookingCalculator } from './components/BookingCalculator';
import { BranchSelectorModal, BranchSelectorLanding } from './components/BranchSelectorModal';
import { MUAPricelistModal } from './components/MUAPricelistModal';
import { ExtraCheckoutModal, type ExtraCartItem } from './components/ExtraCheckoutModal';
import { StudioBranch } from './types';
import { useAutoHideScrollbar } from './hooks/useAutoHideScrollbar';

// Nomor WhatsApp Admin Studio 1 dalam format internasional tanpa tanda plus.
const ADMIN_STUDIO_1_WA = '6287777538164';
const ADMIN_STUDIO_2_WA = '6285168879214';

export default function App() {
  useAutoHideScrollbar();

  const [activeTab, setActiveTab] = useState<string>('katalog');
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [preselectedPackageId, setPreselectedPackageId] = useState<string | undefined>();
  const [preselectedBackdropId, setPreselectedBackdropId] = useState<string | undefined>();
  const [preselectedFrameId, setPreselectedFrameId] = useState<string | undefined>();
  const [initialPromoCode, setInitialPromoCode] = useState<string | undefined>();

  // Controls whether user is on the Branch Landing Page (Gambar 1) or has entered a branch's catalog (Gambar 2)
  const [hasEnteredBranch, setHasEnteredBranch] = useState<boolean>(false);
  const [initialMenuCategory, setInitialMenuCategory] = useState<string | undefined>();
  const [initialCatalogTab, setInitialCatalogTab] = useState<'menu' | 'gallery' | 'guide'>('menu');

  // Selalu scroll halaman ke paling atas saat berganti halaman / tab
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 15);
    return () => clearTimeout(timer);
  }, [activeTab, hasEnteredBranch]);

  // Studio Branch Selection State
  const [selectedBranch, setSelectedBranch] = useState<StudioBranch>(() => {
    const saved = localStorage.getItem('alviero_selected_branch');
    return (saved === 'cabang-2' ? 'cabang-2' : 'cabang-1') as StudioBranch;
  });

  const [isBranchModalOpen, setIsBranchModalOpen] = useState<boolean>(false);
  const [isBeautyModalOpen, setIsBeautyModalOpen] = useState<boolean>(false);
  const [selectedMuaStudio, setSelectedMuaStudio] = useState<'Studio 1' | 'Studio 2'>('Studio 1');
  const [extraCart, setExtraCart] = useState<ExtraCartItem[]>([]);
  const [isExtraCheckoutOpen, setIsExtraCheckoutOpen] = useState<boolean>(false);

  const handleAddExtraItem = (item: ExtraCartItem) => {
    setExtraCart((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === item.id ? { ...entry, qty: entry.qty + item.qty } : entry
        );
      }
      return [...prev, item];
    });
  };

  const handleUpdateExtraQty = (id: string, nextQty: number) => {
    setExtraCart((prev) =>
      prev
        .map((entry) => (entry.id === id ? { ...entry, qty: Math.max(nextQty, 1) } : entry))
        .filter((entry) => entry.qty > 0)
    );
  };

  const handleRemoveExtraItem = (id: string) => {
    setExtraCart((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleExtraCheckoutSubmit = (payload: {
    items: ExtraCartItem[];
    selectedDate: string;
    selectedTime: string;
    pickupNote: string;
    customerName: string;
    customerPhone: string;
    customerInstagram: string;
    paymentType: 'dp' | 'full';
    paymentMethod: 'qris' | 'bca';
    paymentAmount: number;
    total: number;
  }) => {
    const cartDetailsString = payload.items
      .map((item) => `- ${item.qty}x ${item.itemName}${item.vendor ? ` ${item.vendor}` : ''}`)
      .join('\n');
    const paymentOption = payload.paymentType === 'dp' ? 'DP 50%' : 'Lunas/Full';
    const paymentMethod = payload.paymentMethod.toUpperCase();
    const targetWaNumber = selectedMuaStudio === 'Studio 2' ? ADMIN_STUDIO_2_WA : ADMIN_STUDIO_1_WA;

    const pesanTemplate = `Halo Admin ${selectedMuaStudio} Alviero, saya ingin memproses pesanan layanan ekstra (Non-Studio Booking).

*👤 Data Pemesan:*
- Nama: ${payload.customerName}
- WA: ${payload.customerPhone}
- IG: ${payload.customerInstagram || '-'}

*🛍️ Rincian Pesanan:*
${cartDetailsString}

*📅 Jadwal & Pengambilan:*
- Tanggal: ${payload.selectedDate}
- Jam: ${payload.selectedTime}
- Catatan/Lokasi: ${payload.pickupNote || 'Belum diisi'}

*💳 Rincian Pembayaran:*
- Total Estimasi: Rp ${payload.total.toLocaleString('id-ID')}
- Pembayaran: ${paymentOption}
- Metode: ${paymentMethod}

Berikut saya lampirkan bukti transfer pembayarannya.`;

    const encodedText = encodeURIComponent(pesanTemplate);
    const whatsappUrl = `https://wa.me/${targetWaNumber}?text=${encodedText}`;
    setExtraCart([]);
    setIsExtraCheckoutOpen(false);
    return whatsappUrl;
  };

  const handleSelectBranch = (branch: StudioBranch) => {
    setSelectedBranch(branch);
    setInitialMenuCategory(undefined);
    setInitialCatalogTab('menu');
    localStorage.setItem('alviero_selected_branch', branch);
    setHasEnteredBranch(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromLanding = (category: string, branch?: StudioBranch) => {
    if (branch) {
      setSelectedBranch(branch);
      localStorage.setItem('alviero_selected_branch', branch);
    }
    if (category === 'bingkai-album' && branch) {
      setSelectedMuaStudio(branch === 'cabang-2' ? 'Studio 2' : 'Studio 1');
    }
    setInitialMenuCategory(category);
    setInitialCatalogTab('menu');
    setHasEnteredBranch(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToFacilities = () => {
    setHasEnteredBranch(true);
    setInitialMenuCategory(undefined);
    setInitialCatalogTab('gallery');
    setActiveTab('katalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBranchModal = () => {
    setIsBranchModalOpen(true);
  };

  const handleBackToLanding = (targetSectionId?: string) => {
    setHasEnteredBranch(false);
    setInitialMenuCategory(undefined);
    setActiveTab('katalog');
    if (targetSectionId) {
      setTimeout(() => {
        const el = document.getElementById(targetSectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateToPricelist = () => {
    setActiveTab('katalog');
    if (!hasEnteredBranch) {
      setTimeout(() => {
        document.getElementById('section-services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenBookingWithPackage = (packageId: string) => {
    setPreselectedPackageId(packageId);
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithPromo = (promoCode?: string, packageId?: string) => {
    if (packageId) {
      setPreselectedPackageId(packageId);
    }
    if (promoCode) {
      setInitialPromoCode(promoCode);
    }
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#EFE8DD] text-[#2D2A26] font-libre flex flex-col selection:bg-[#8DA4B8] selection:text-white pb-16 md:pb-0">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedBranch={selectedBranch}
        onOpenBranchModal={handleOpenBranchModal}
        onOpenBooking={() => setIsBookingOpen(true)}
        onBackToLanding={handleBackToLanding}
        onNavigateToPricelist={handleNavigateToPricelist}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-2 sm:pb-8">
        {(activeTab === 'katalog' || activeTab === 'pricelist-sheets') && (
          !hasEnteredBranch ? (
            /* Gambar 1: Halaman Utama Pilih Lokasi Studio & Layanan Khusus */
            <BranchSelectorLanding
              selectedBranch={selectedBranch}
              onSelectBranch={handleSelectBranch}
              onSelectCategory={handleSelectCategoryFromLanding}
              onOpenBooking={handleOpenBookingWithPromo}
              onOpenBeautyModal={(studio) => {
                setSelectedMuaStudio(studio);
                setIsBeautyModalOpen(true);
              }}
              onNavigateToLocation={() => {
                setActiveTab('rules');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            /* Gambar 2: Menu Pricelist & Bio-Link Cabang Terpilih */
            <PricelistViewer
              selectedBranch={selectedBranch}
              initialTab={initialCatalogTab}
              initialCategory={initialMenuCategory}
              onOpenBranchModal={handleOpenBranchModal}
              onBackToLanding={handleBackToLanding}
              onSelectPackageForBooking={handleOpenBookingWithPackage}
              onNavigateToRules={() => {
                setActiveTab('rules');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenBooking={() => setIsBookingOpen(true)}
            />
          )
        )}

        {activeTab === 'strip-builder' && (
          <PhotoStripCustomizer />
        )}

        {activeTab === 'rules' && (
          <StudioInfoAndRules
            selectedBranch={selectedBranch}
            onNavigateToFacilities={handleNavigateToFacilities}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar for Mobile */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => setIsBookingOpen(true)}
        onBackToLanding={handleBackToLanding}
        onNavigateToPricelist={handleNavigateToPricelist}
      />

      {/* Booking Modal */}
      <BookingCalculator
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setInitialPromoCode(undefined);
        }}
        selectedBranch={selectedBranch}
        onSelectBranch={handleSelectBranch}
        onOpenBranchModal={() => setIsBranchModalOpen(true)}
        preselectedPackageId={preselectedPackageId}
        preselectedBackdropId={preselectedBackdropId}
        preselectedFrameId={preselectedFrameId}
        initialPromoCode={initialPromoCode}
      />

      {/* Branch Selector Modal (Popup inside Booking Calculator or Header) */}
      <BranchSelectorModal
        isOpen={isBranchModalOpen}
        selectedBranch={selectedBranch}
        onSelectBranch={(branch) => {
          handleSelectBranch(branch);
          setIsBranchModalOpen(false);
        }}
        onClose={() => setIsBranchModalOpen(false)}
        canDismiss={true}
      />

      <MUAPricelistModal
        isOpen={isBeautyModalOpen}
        onClose={() => setIsBeautyModalOpen(false)}
        cartItems={extraCart}
        onAddExtraItem={handleAddExtraItem}
        onOpenExtraCheckout={() => setIsExtraCheckoutOpen(true)}
      />

      <ExtraCheckoutModal
        isOpen={isExtraCheckoutOpen}
        items={extraCart}
        onClose={() => setIsExtraCheckoutOpen(false)}
        onUpdateQty={handleUpdateExtraQty}
        onRemoveItem={handleRemoveExtraItem}
        selectedMuaStudio={selectedMuaStudio}
        onSubmit={handleExtraCheckoutSubmit}
      />

      {extraCart.length > 0 && (
        <button
          type="button"
          onClick={() => setIsExtraCheckoutOpen(true)}
          className="fixed bottom-5 right-5 z-[85] flex items-center gap-3 rounded-full bg-[#2D2D2D] px-4 py-3 text-white shadow-[0_18px_40px_rgba(0,0,0,0.26)] transition hover:bg-[#1e1e1e]"
          aria-label="Lihat keranjang tambahan"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#A9BCA7]">
            🛒
          </span>
          <span className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em]">
            {extraCart.reduce((sum, item) => sum + item.qty, 0)} item
          </span>
        </button>
      )}
    </div>
  );
}
