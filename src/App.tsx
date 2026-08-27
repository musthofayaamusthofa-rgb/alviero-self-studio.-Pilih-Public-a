import React, { useState } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PricelistViewer } from './components/PricelistViewer';
import { PhotoStripCustomizer } from './components/PhotoStripCustomizer';
import { StudioInfoAndRules } from './components/StudioInfoAndRules';
import { BookingCalculator } from './components/BookingCalculator';
import { BranchSelectorModal, BranchSelectorLanding } from './components/BranchSelectorModal';
import { StudioBranch } from './types';
import { useAutoHideScrollbar } from './hooks/useAutoHideScrollbar';

export default function App() {
  useAutoHideScrollbar();

  const [activeTab, setActiveTab] = useState<string>('katalog');
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [preselectedPackageId, setPreselectedPackageId] = useState<string | undefined>();
  const [preselectedBackdropId, setPreselectedBackdropId] = useState<string | undefined>();
  const [preselectedFrameId, setPreselectedFrameId] = useState<string | undefined>();

  // Controls whether user is on the Branch Landing Page (Gambar 1) or has entered a branch's catalog (Gambar 2)
  const [hasEnteredBranch, setHasEnteredBranch] = useState<boolean>(false);
  const [initialMenuCategory, setInitialMenuCategory] = useState<string | undefined>();

  // Studio Branch Selection State
  const [selectedBranch, setSelectedBranch] = useState<StudioBranch>(() => {
    const saved = localStorage.getItem('alviero_selected_branch');
    return (saved === 'cabang-2' ? 'cabang-2' : 'cabang-1') as StudioBranch;
  });

  const [isBranchModalOpen, setIsBranchModalOpen] = useState<boolean>(false);

  const handleSelectBranch = (branch: StudioBranch) => {
    setSelectedBranch(branch);
    setInitialMenuCategory(undefined);
    localStorage.setItem('alviero_selected_branch', branch);
    setHasEnteredBranch(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromLanding = (category: string) => {
    setInitialMenuCategory(category);
    setHasEnteredBranch(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBranchModal = () => {
    setHasEnteredBranch(false);
    setInitialMenuCategory(undefined);
    setActiveTab('katalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingWithPackage = (packageId: string) => {
    setPreselectedPackageId(packageId);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#EFE8DD] text-[#2D2A26] font-sans flex flex-col selection:bg-[#8DA4B8] selection:text-white pb-16 md:pb-0">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedBranch={selectedBranch}
        onOpenBranchModal={handleOpenBranchModal}
        onOpenBooking={() => setIsBookingOpen(true)}
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
            />
          ) : (
            /* Gambar 2: Menu Pricelist & Bio-Link Cabang Terpilih */
            <PricelistViewer
              selectedBranch={selectedBranch}
              initialCategory={initialMenuCategory}
              onOpenBranchModal={handleOpenBranchModal}
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
          <StudioInfoAndRules />
        )}
      </main>

      {/* Floating Bottom Navigation Bar for Mobile */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Booking Modal */}
      <BookingCalculator
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedBranch={selectedBranch}
        onSelectBranch={handleSelectBranch}
        onOpenBranchModal={() => setIsBranchModalOpen(true)}
        preselectedPackageId={preselectedPackageId}
        preselectedBackdropId={preselectedBackdropId}
        preselectedFrameId={preselectedFrameId}
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
    </div>
  );
}
