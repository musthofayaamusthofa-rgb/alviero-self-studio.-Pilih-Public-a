import React, { useState } from 'react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';
import {
  User, Heart, Users, GraduationCap, Home, Baby, Cake,
  UserCheck, Gem, Image as ImageIcon, Sparkles, Building2,
  MessageCircle, MapPin, Check, X, ArrowRight, ChevronRight,
  Camera, Sparkle
} from 'lucide-react';

interface BranchSelectorViewProps {
  selectedBranch: StudioBranch;
  onSelectBranch: (branch: StudioBranch) => void;
  onSelectCategory?: (category: string) => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

/**
 * Daftar Kategori Paket Foto untuk Grid Minimalis (Sesuai Referensi Gambar 2)
 */
interface PackageCategoryItem {
  id: string;
  name: string;
  categoryKey: string;
  icon: React.ReactNode;
  bgCircle: string;
  iconColor: string;
  borderCircle: string;
}

const PACKAGE_CATEGORIES: PackageCategoryItem[] = [
  {
    id: 'personal',
    name: 'Branding Personal',
    categoryKey: 'personal-paket',
    icon: <User className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />,
    bgCircle: 'bg-[#eaf5f0]',
    iconColor: 'text-[#367a5c]',
    borderCircle: 'border-[#cce8dc]',
  },
  {
    id: 'couple',
    name: 'Couple',
    categoryKey: 'couple-paket',
    icon: <Heart className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />,
    bgCircle: 'bg-[#fdf0f0]',
    iconColor: 'text-[#b34747]',
    borderCircle: 'border-[#f9d7d7]',
  },
  {
    id: 'group',
    name: 'Group',
    categoryKey: 'group-paket',
    icon: <Users className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />,
    bgCircle: 'bg-[#eff4fb]',
    iconColor: 'text-[#3b6bb0]',
    borderCircle: 'border-[#d4e2f7]',
  },
  {
    id: 'graduation',
    name: 'Graduation',
    categoryKey: 'grad-indoor',
    icon: <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />,
    bgCircle: 'bg-[#f2effb]',
    iconColor: 'text-[#5d47a4]',
    borderCircle: 'border-[#dfd7f7]',
  },
  {
    id: 'family',
    name: 'Family',
    categoryKey: 'family-paket',
    icon: <Home className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />,
    bgCircle: 'bg-[#f3f7eb]',
    iconColor: 'text-[#557833]',
    borderCircle: 'border-[#dce8cc]',
  },
  {
    id: 'maternity',
    name: 'Maternity',
    categoryKey: 'maternity-paket',
    icon: <Baby className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />,
    bgCircle: 'bg-[#fdf4ed]',
    iconColor: 'text-[#b06733]',
    borderCircle: 'border-[#f8dec8]',
  },
  {
    id: 'kids',
    name: 'Kids & Birthday',
    categoryKey: 'event',
    icon: <Cake className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />,
    bgCircle: 'bg-[#fef9e8]',
    iconColor: 'text-[#9c7d18]',
    borderCircle: 'border-[#f8ecb5]',
  },
  {
    id: 'photoid',
    name: 'Photo ID',
    categoryKey: 'pass-foto',
    icon: <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />,
    bgCircle: 'bg-[#eaf7f5]',
    iconColor: 'text-[#2a7a6f]',
    borderCircle: 'border-[#c7ede8]',
  },
  {
    id: 'wedding',
    name: 'Wedding & Prewed',
    categoryKey: 'wedding-package',
    icon: <Gem className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />,
    bgCircle: 'bg-[#faf0f5]',
    iconColor: 'text-[#944473]',
    borderCircle: 'border-[#edd1e2]',
  },
  {
    id: 'cetak',
    name: 'Cetak & Bingkai',
    categoryKey: 'bingkai-album',
    icon: <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />,
    bgCircle: 'bg-[#eef5fa]',
    iconColor: 'text-[#386994]',
    borderCircle: 'border-[#d0e3f2]',
  },
  {
    id: 'selfstudio',
    name: 'Self Photo Studio',
    categoryKey: 'selfstudio',
    icon: <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />,
    bgCircle: 'bg-[#eef8f2]',
    iconColor: 'text-[#2e7d4d]',
    borderCircle: 'border-[#cbead7]',
  },
  {
    id: 'sewastudio',
    name: 'Sewa Studio',
    categoryKey: 'sewa-studio',
    icon: <Building2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />,
    bgCircle: 'bg-[#f0f6f7]',
    iconColor: 'text-[#356d73]',
    borderCircle: 'border-[#d3e7ea]',
  },
];

/**
 * Komponen Tampilan Utama Minimalis & Bersih (Inspired by Gambar 2)
 */
export const BranchSelectorLanding: React.FC<BranchSelectorViewProps> = ({
  selectedBranch,
  onSelectBranch,
  onSelectCategory,
}) => {
  const currentBranchDef = STUDIO_BRANCHES.find((b) => b.id === selectedBranch) || STUDIO_BRANCHES[0];

  const handleCategoryClick = (categoryKey: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryKey);
    } else {
      onSelectBranch(selectedBranch);
    }
  };

  return (
    <div className="max-w-md sm:max-w-xl w-full mx-auto my-2 sm:my-6 px-3 sm:px-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col relative pb-6">
        
        {/* 1. TOP HERO BANNER CARD (Minimalist Clean Style like Image 2) */}
        <div className="p-3 sm:p-5 bg-gradient-to-b from-[#7ca194] to-[#6c8f82] text-white relative">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-stone-800 shadow-md border border-white/40 flex items-center justify-between gap-3 sm:gap-5">
            <div className="flex-1 min-w-0 pr-1">
              <span className="text-[#4e7d6b] font-serif italic text-xs sm:text-sm font-semibold tracking-wide block">
                Exclusive Package
              </span>
              <h2 className="font-extrabold text-xs sm:text-sm md:text-base text-stone-900 tracking-tight leading-snug uppercase mt-1">
                ABADIKAN MOMEN SPESIAL, KENANGAN TAK TERLUPAKAN
              </h2>
              <p className="text-[10.5px] sm:text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                Abadikan perjalanan cerita berharga dalam potret studio berkelas & aesthetic di Alviero Studio.
              </p>
              
              <div className="mt-3">
                <button
                  onClick={() => onSelectBranch(selectedBranch)}
                  className="bg-[#232d38] hover:bg-stone-900 text-white font-extrabold text-[10px] sm:text-xs px-4 py-1.5 rounded-md uppercase tracking-wider shadow-xs hover:shadow transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <span>Buka Pricelist</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                </button>
              </div>
            </div>

            {/* Circular Preview Photo Frame (Like Image 2) */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#7ca194]/30 shadow-md overflow-hidden shrink-0 bg-stone-100 relative group">
              <img
                src="/images/backdrops/backdrop-1.jpg"
                alt="Alviero Studio Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* 2. STUDIO LOCATION HEADLINE & CLEAN BRANCH SWITCHER */}
        <div className="px-4 sm:px-6 pt-5 pb-2 text-center">
          <h1 className="font-extrabold text-base sm:text-lg text-stone-900 tracking-tight">
            Studio Foto Malang — Cabang 1 & Cabang 2
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Pilih cabang studio & kategori foto untuk melihat detail paket
          </p>

          {/* Clean Branch Switcher Pills */}
          <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto mt-3.5 p-1 bg-stone-100/90 rounded-2xl border border-stone-200">
            {STUDIO_BRANCHES.map((b) => {
              const isSelected = selectedBranch === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => onSelectBranch(b.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80 ring-1 ring-black/5'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#4d7557]' : 'text-stone-400'}`} />
                  <span className="truncate">{b.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Branch Address Subtitle */}
          <div className="text-[11px] text-stone-500 mt-2 font-medium">
            📍 Lokasi: <span className="text-stone-700 font-semibold">{currentBranchDef.address}</span>
          </div>
        </div>

        {/* 3. PHOTO STUDIO PACKAGE SECTION (Grid of Minimalist Circular Icons like Image 2) */}
        <div className="px-3 sm:px-6 pt-4">
          <div className="text-left px-2 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900 tracking-tight">
              Photo Studio Package
            </h3>
            <div className="w-8 h-1 bg-[#4d7557] rounded-full mt-1"></div>
          </div>

          {/* Circular Category Grid (4 columns) */}
          <div className="grid grid-cols-4 gap-y-4 gap-x-2 sm:gap-x-4 pt-1">
            {PACKAGE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.categoryKey)}
                className="flex flex-col items-center justify-start group cursor-pointer text-center focus:outline-none transition-transform active:scale-95"
              >
                {/* Minimalist Pastel Circle Icon */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-2xs border ${cat.bgCircle} ${cat.iconColor} ${cat.borderCircle}`}
                >
                  {cat.icon}
                </div>

                {/* Clean Label underneath */}
                <span className="text-[10.5px] sm:text-xs font-bold text-stone-700 mt-2 line-clamp-2 leading-tight group-hover:text-stone-950 transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. FLOATING / INLINE WHATSAPP CUSTOMER SERVICE BUTTON (Like Image 2) */}
        <div className="px-4 sm:px-6 pt-6 flex justify-center">
          <a
            href="https://wa.me/6287777538164?text=Halo%20Admin%20Alviero%20Studio%20Foto,%20saya%20mau%20tanya%20informasi%20paket%20foto"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs min-h-[44px] bg-[#42be65] hover:bg-[#38a958] active:bg-[#2f924b] text-white font-extrabold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Customer Service</span>
          </a>
        </div>

        {/* Footer info note */}
        <div className="px-4 pt-3 text-center text-[10.5px] text-stone-400 font-medium">
          💡 Klik kategori di atas untuk melihat rincian paket & harga lengkap di {currentBranchDef.name}.
        </div>

      </div>
    </div>
  );
};

/**
 * BranchSelectorModal - Modal Popup Minimalis untuk Ganti Cabang
 */
interface BranchSelectorModalProps {
  isOpen: boolean;
  selectedBranch: StudioBranch;
  onSelectBranch: (branch: StudioBranch) => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const BranchSelectorModal: React.FC<BranchSelectorModalProps> = ({
  isOpen,
  selectedBranch,
  onSelectBranch,
  onClose,
  canDismiss = true,
}) => {
  if (!isOpen) return null;

  const handleChoose = (branchId: StudioBranch) => {
    onSelectBranch(branchId);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col my-auto relative p-5 sm:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#4d7557]" />
            <h3 className="font-extrabold text-base text-stone-900">Pilih Cabang Studio Alviero</h3>
          </div>
          {canDismiss && onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Branch List */}
        <div className="space-y-3 pt-4">
          {STUDIO_BRANCHES.map((branch) => {
            const isSelected = selectedBranch === branch.id;
            return (
              <div
                key={branch.id}
                onClick={() => handleChoose(branch.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#f2f8f4] border-[#4d7557] ring-2 ring-[#4d7557]/20 shadow-xs'
                    : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                    {branch.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-stone-900">{branch.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dbeee0] text-[#2c4e35] border border-[#bad8c2]">
                        {branch.badge}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {branch.address}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#4d7557] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="pt-4 mt-2 border-t border-stone-100 flex justify-end">
          {onClose && (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-stone-900 text-white hover:bg-stone-800 cursor-pointer shadow-xs"
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
