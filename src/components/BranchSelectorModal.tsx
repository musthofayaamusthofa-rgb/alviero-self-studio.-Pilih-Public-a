import React from 'react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';
import { Check, Sparkles, X, ArrowRight, MapPin } from 'lucide-react';

interface BranchSelectorViewProps {
  selectedBranch: StudioBranch;
  onSelectBranch: (branch: StudioBranch) => void;
  onSelectCategory?: (category: string) => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

/**
 * Komponen Tampilan Utama Pilih Cabang & Layanan Khusus (Gambar 2 / Halaman Depan)
 */
export const BranchSelectorLanding: React.FC<BranchSelectorViewProps> = ({
  selectedBranch,
  onSelectBranch,
  onSelectCategory,
}) => {
  return (
    <div className="max-w-xl w-full mx-auto my-4 sm:my-8 px-2 sm:px-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col relative">
        
        {/* Header (Clean Slate & Studio Green Accent) */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative overflow-hidden border-b border-slate-800 text-left">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pilih Lokasi & Layanan Studio</span>
            </div>
            <h2 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">
              Mau Foto di Studio Cabang Mana?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Silakan pilih lokasi cabang studio atau lihat layanan wedding & cetak foto:
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 space-y-4 bg-slate-50 flex-1">
          
          {/* Section 1: Pilihan Cabang Studio */}
          <div className="text-left px-1">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500">
              🏛️ Pilihan Lokasi Cabang Studio:
            </span>
          </div>

          <div className="space-y-3.5">
            {STUDIO_BRANCHES.map((branch) => {
              const isSelected = selectedBranch === branch.id;

              return (
                <div
                  key={branch.id}
                  onClick={() => onSelectBranch(branch.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative group text-left ${
                    isSelected
                      ? 'bg-white border-[#78b65d] ring-2 ring-[#78b65d]/20 shadow-md'
                      : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 transition-transform group-hover:scale-105 ${
                        isSelected
                          ? 'bg-slate-900 text-emerald-400 shadow-sm'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {branch.icon}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                            {branch.name}
                          </h3>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-extrabold'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {branch.badge}
                          </span>
                        </div>

                        {/* Alamat Lengkap */}
                        <div className="flex items-start gap-1.5 mt-2 text-xs text-slate-600 leading-relaxed">
                          <MapPin className="w-3.5 h-3.5 text-[#78b65d] shrink-0 mt-0.5" />
                          <span className="font-medium">{branch.address}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#78b65d] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBranch(branch.id);
                      }}
                      className={`px-5 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        isSelected
                          ? 'bg-[#78b65d] text-white hover:bg-[#5e9e44]'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <span>{isSelected ? `Buka Katalog ${branch.badge}` : `Pilih ${branch.badge}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 2: Layanan Khusus Wedding & Cetak Foto (Pindah ke Bagian Depan) */}
          <div className="pt-2">
            <div className="text-left px-1 pb-2">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500">
                ✨ Layanan Wedding & Cetak Foto:
              </span>
            </div>

            <div className="space-y-3">
              {/* Pricelist Wedding Card */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('wedding-package') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-4.5 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-[#78b65d] transition-all cursor-pointer shadow-2xs group text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
                      💍
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                          PRICELIST WEDDING
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Exclusive
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        Prewedding, Akad, Resepsi & Engagement
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCategory) onSelectCategory('wedding-package');
                      else onSelectBranch(selectedBranch);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-extrabold bg-[#78b65d] hover:bg-[#5e9e44] text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <span>Lihat Pricelist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pricelist Cetak Card */}
              <div
                onClick={() => onSelectCategory ? onSelectCategory('bingkai-album') : onSelectBranch(selectedBranch)}
                className="p-4 sm:p-4.5 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-[#78b65d] transition-all cursor-pointer shadow-2xs group text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
                      🖼️
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                          PRICELIST CETAK
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Cetak Lab
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        Cetak Lab, Bingkai Minimalis & Album Eksklusif
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCategory) onSelectCategory('bingkai-album');
                      else onSelectBranch(selectedBranch);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-extrabold bg-[#78b65d] hover:bg-[#5e9e44] text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <span>Lihat Pricelist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-white border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          💡 Kamu dapat berganti studio cabang kapan saja lewat tombol <strong>'Ganti Cabang'</strong>.
        </div>
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto relative">
        
        {/* Header Modal */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative overflow-hidden border-b border-slate-800">
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pilih Lokasi Studio</span>
              </div>
              <h3 className="font-extrabold text-lg sm:text-xl text-white">
                Mau Foto di Studio Cabang Mana?
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Silakan pilih lokasi cabang studio yang ingin kamu tuju:
              </p>
            </div>

            {canDismiss && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Branch Cards */}
        <div className="p-4 sm:p-6 space-y-4 bg-slate-50 flex-1">
          {STUDIO_BRANCHES.map((branch) => {
            const isSelected = selectedBranch === branch.id;

            return (
              <div
                key={branch.id}
                onClick={() => handleChoose(branch.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative group text-left ${
                  isSelected
                    ? 'bg-white border-[#78b65d] ring-2 ring-[#78b65d]/20 shadow-md'
                    : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-slate-900 text-emerald-400 shadow-sm'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {branch.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                          {branch.name}
                        </h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-extrabold'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {branch.badge}
                        </span>
                      </div>

                      {/* Alamat Lengkap */}
                      <div className="flex items-start gap-1.5 mt-2 text-xs text-slate-600 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-[#78b65d] shrink-0 mt-0.5" />
                        <span className="font-medium">{branch.address}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#78b65d] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoose(branch.id);
                    }}
                    className={`px-5 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isSelected
                        ? 'bg-[#78b65d] text-white hover:bg-[#5e9e44]'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{isSelected ? `Buka Katalog ${branch.badge}` : `Pilih ${branch.badge}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-white border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          💡 Kamu dapat berganti studio cabang kapan saja lewat menu di bagian atas.
        </div>
      </div>
    </div>
  );
};
