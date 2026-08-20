import React, { useState } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PricelistViewer } from './components/PricelistViewer';
import { PhotoStripCustomizer } from './components/PhotoStripCustomizer';
import { StudioInfoAndRules } from './components/StudioInfoAndRules';
import { BookingCalculator } from './components/BookingCalculator';
import { BranchSelectorModal } from './components/BranchSelectorModal';
import { StudioBranch } from './types';
import { useAutoHideScrollbar } from './hooks/useAutoHideScrollbar';

export default function App() {
  useAutoHideScrollbar();

  const [activeTab, setActiveTab] = useState<string>('katalog');
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [preselectedPackageId, setPreselectedPackageId] = useState<string | undefined>();
  const [preselectedBackdropId, setPreselectedBackdropId] = useState<string | undefined>();
  const [preselectedFrameId, setPreselectedFrameId] = useState<string | undefined>();

  // Studio Branch Selection State
  const [selectedBranch, setSelectedBranch] = useState<StudioBranch>(() => {
    const saved = localStorage.getItem('alviero_selected_branch');
    return (saved === 'cabang-2' ? 'cabang-2' : 'cabang-1') as StudioBranch;
  });

  const [isBranchModalOpen, setIsBranchModalOpen] = useState<boolean>(() => {
    return !localStorage.getItem('alviero_has_selected_branch');
  });

  const handleSelectBranch = (branch: StudioBranch) => {
    setSelectedBranch(branch);
    localStorage.setItem('alviero_selected_branch', branch);
    localStorage.setItem('alviero_has_selected_branch', 'true');
  };

  const handleOpenBookingWithPackage = (packageId: string) => {
    setPreselectedPackageId(packageId);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white pb-14 md:pb-0">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedBranch={selectedBranch}
        onOpenBranchModal={() => setIsBranchModalOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-2 sm:pb-8">
        {(activeTab === 'katalog' || activeTab === 'pricelist-sheets') && (
          <PricelistViewer
            selectedBranch={selectedBranch}
            onOpenBranchModal={() => setIsBranchModalOpen(true)}
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

      {/* Branch Selector Modal */}
      <BranchSelectorModal
        isOpen={isBranchModalOpen}
        selectedBranch={selectedBranch}
        onSelectBranch={handleSelectBranch}
        onClose={() => setIsBranchModalOpen(false)}
        canDismiss={!!localStorage.getItem('alviero_has_selected_branch')}
      />
    </div>
  );
}
