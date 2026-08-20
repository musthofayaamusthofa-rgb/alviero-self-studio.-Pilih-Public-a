import React from 'react';
import { StudioBranch } from '../types';
import { STUDIO_BRANCHES } from '../data/pricelistData';
import { MapPin, Building2, Check, Sparkles, X, ArrowRight } from 'lucide-react';

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
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-[11px] font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Pilih Lokasi Studio</span>
              </div>
              <h3 className="font-extrabold text-lg sm:text-xl text-white">
                Mau Foto di Studio Cabang Mana?
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Pilihan backdrop & bilik selfstudio pada <strong>Cabang 1</strong> dan <strong>Cabang 2</strong> berbeda. Silakan tentukan lokasi pilihanmu!
              </p>
            </div>

            {canDismiss && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Branch Cards */}
        <div className="p-4 sm:p-6 space-y-3.5 bg-slate-50/70 flex-1">
          {STUDIO_BRANCHES.map((branch) => {
            const isSelected = selectedBranch === branch.id;

            return (
              <div
                key={branch.id}
                onClick={() => handleChoose(branch.id)}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                    : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {branch.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                          {branch.name}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {branch.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {branch.tagline}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Highlights */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 gap-1.5 text-xs text-slate-600">
                  {branch.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                <div className="mt-3.5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {branch.address}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoose(branch.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-slate-900 text-white hover:bg-indigo-600'
                    }`}
                  >
                    <span>{isSelected ? 'Cabang Terpilih' : 'Pilih Cabang Ini'}</span>
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
