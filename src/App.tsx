import React, { useState } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PricelistViewer } from './components/PricelistViewer';
import { PhotoStripCustomizer } from './components/PhotoStripCustomizer';
import { StudioInfoAndRules } from './components/StudioInfoAndRules';
import { BookingCalculator } from './components/BookingCalculator';
import { useAutoHideScrollbar } from './hooks/useAutoHideScrollbar';
import { Camera, Heart, MessageCircle, Instagram } from 'lucide-react';

export default function App() {
  useAutoHideScrollbar();

  const [activeTab, setActiveTab] = useState<string>('katalog');
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [preselectedPackageId, setPreselectedPackageId] = useState<string | undefined>();
  const [preselectedBackdropId, setPreselectedBackdropId] = useState<string | undefined>();
  const [preselectedFrameId, setPreselectedFrameId] = useState<string | undefined>();

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
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-2 sm:pb-8">
        {(activeTab === 'katalog' || activeTab === 'pricelist-sheets') && (
          <PricelistViewer
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

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-10 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base tracking-wider uppercase">ALVIERO</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Studio Foto & SelfStudio dengan style foto elegan dan asik, fotografer profesional, serta gratis semua soft files pada sesi foto.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Navigasi Utama</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('katalog')} className="hover:text-white transition-colors cursor-pointer">
                  Katalog & Pricelist
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('strip-builder')} className="hover:text-white transition-colors cursor-pointer">
                  Kustom Photo Strip
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('rules')} className="hover:text-white transition-colors cursor-pointer">
                  Panduan & Lokasi
                </button>
              </li>
            </ul>
          </div>

          {/* Studio Hours */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Jam Operasional</h4>
            <p className="text-slate-300">Senin - Minggu (Buka Setiap Hari)</p>
            <p className="font-bold text-emerald-400 mt-1">08:00 - 21:00 WIB</p>
            <p className="text-[11px] text-slate-500 mt-2">Diharapkan reservasi slot terlebih dahulu untuk menghindari antrean.</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Kontak & Social</h4>
            <a
              href="https://wa.me/6287777538164"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl transition-colors mb-3"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Admin Studio</span>
            </a>
            <div className="flex items-center gap-2 text-slate-300">
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>@alviero.selfstudio</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500 text-[11px]">
          <div>
            © 2026 Alviero Studio Foto. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Momen Spesial Kamu</span>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingCalculator
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedPackageId={preselectedPackageId}
        preselectedBackdropId={preselectedBackdropId}
        preselectedFrameId={preselectedFrameId}
      />
    </div>
  );
}
