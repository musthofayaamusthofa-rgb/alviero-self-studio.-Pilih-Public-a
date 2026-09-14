import React, { useState } from 'react';
import { X, ArrowLeft, ChevronRight } from 'lucide-react';

export interface MuaServiceDefinition {
  id: string;
  name: string;
  price: number;
}

export interface MuaVendorDefinition {
  id: string;
  name: string;
  services: MuaServiceDefinition[];
  coverImage: string;
}

export const MUA_VENDORS: MuaVendorDefinition[] = [
  {
    id: 'novita',
    name: 'By Novita',
    coverImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    services: [
      { id: 'novita-mua', name: 'MUA', price: 0 },
      { id: 'novita-kebaya', name: 'Kebaya', price: 0 },
      { id: 'novita-hijabdo', name: 'Hijabdo', price: 0 }
    ]
  },
  {
    id: 'ananda',
    name: 'By Ananda',
    coverImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
    services: [
      { id: 'ananda-mua', name: 'MUA', price: 0 },
      { id: 'ananda-kebaya', name: 'Kebaya', price: 0 },
      { id: 'ananda-hijabdo', name: 'Hijabdo', price: 0 }
    ]
  },
  {
    id: 'masaya',
    name: 'By Masaya',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    services: [
      { id: 'masaya-mua', name: 'MUA', price: 0 },
      { id: 'masaya-kebaya', name: 'Kebaya', price: 0 },
      { id: 'masaya-hijabdo', name: 'Hijabdo', price: 0 }
    ]
  },
  {
    id: 'tiwi',
    name: 'By Tiwi',
    coverImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    services: [
      { id: 'tiwi-hairdo', name: 'Hairdo', price: 0 }
    ]
  }
];

interface MUAPricelistModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: Array<{
    id: string;
    category: 'MUA' | 'CETAK' | 'BINGKAI';
    itemName: string;
    vendor?: string;
    price: number;
    qty: number;
  }>;
  onAddExtraItem?: (item: {
    id: string;
    category: 'MUA' | 'CETAK' | 'BINGKAI';
    itemName: string;
    vendor?: string;
    price: number;
    qty: number;
  }) => void;
  onOpenExtraCheckout?: () => void;
}

export const MUAPricelistModal: React.FC<MUAPricelistModalProps> = ({
  isOpen,
  onClose,
  cartItems = [],
  onAddExtraItem,
  onOpenExtraCheckout,
}) => {
  const [activePopupVendor, setActivePopupVendor] = useState<string | null>(null);
  const activeVendor = MUA_VENDORS.find((vendor) => vendor.name === activePopupVendor) || null;

  const handleAddToMuaCart = (vendorName: string, service: MuaServiceDefinition) => {
    const item = {
      id: `${vendorName}-${service.id}`,
      category: 'MUA' as const,
      itemName: service.name,
      vendor: vendorName,
      price: service.price,
      qty: 1,
    };

    if (onAddExtraItem) onAddExtraItem(item);
  };

  const muaCartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) return;
    setActivePopupVendor(null);
    if (onOpenExtraCheckout) onOpenExtraCheckout();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[2px] flex items-end justify-center p-0 sm:p-4">
      <div className="w-full max-w-4xl rounded-t-[28px] sm:rounded-[28px] bg-[#F7F4F1] shadow-2xl border border-[#E7E0D9] overflow-hidden">
        <div className="sticky top-0 z-10 bg-[#F7F4F1] border-b border-[#E8DDD6] px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] flex items-center justify-center shadow-2xs shrink-0">
                <span className="text-base">✦</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-black text-base sm:text-xl uppercase tracking-wide text-[#2E2E2E] truncate">
                  PRICELIST MUA, KEBAYA, HAIRDO & HIJABDO
                </h3>
                <p className="text-[10px] sm:text-[11px] font-sans text-stone-600 uppercase tracking-[0.18em]">
                  Beauty & styling pilihan premium
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full bg-[#2D2D2D] text-white px-4 py-2 text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-[0.18em] shadow-sm hover:bg-[#1d1d1d] transition-colors"
            >
              <span className="text-base leading-none">×</span>
              <span>Tutup</span>
            </button>
          </div>
        </div>

        <div className="max-h-[82vh] overflow-y-auto bg-[#F7F4F1]">
          <section className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4">
            <p className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#6F7F6B]">
              Hasil Makeup & Styling
            </p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <h4 className="font-serif font-black text-2xl sm:text-4xl leading-none tracking-tight text-[#2E2E2E]">
                Inspirasi MUA, KEBAYA, HAIRDO & HIJABDO
              </h4>
              <span className="hidden sm:inline text-[10px] font-sans text-stone-500">Geser ke samping</span>
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar">
              {MUA_VENDORS.map((vendor) => (
                <div key={vendor.id} className="min-w-[240px] sm:min-w-[280px] snap-start rounded-[22px] overflow-hidden border border-[#E2D9D3] bg-white shadow-sm">
                  <div className="relative h-[360px] sm:h-[420px] overflow-hidden">
                    <img src={vendor.coverImage} alt={vendor.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="inline-flex rounded-full border border-white/70 bg-white/80 text-[#2E2E2E] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.16em]">
                        {vendor.name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="px-4 sm:px-6 pb-6">
            <div className="rounded-[22px] border border-[#E8DDD6] bg-[#F4EFEA] p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#6F7F6B]">
                    Pricelist Detail
                  </p>
                  <h5 className="font-serif text-lg sm:text-xl font-black uppercase text-[#2E2E2E] mt-1">
                    Vendor & Layanan
                  </h5>
                </div>
                <span className="rounded-full bg-white border border-[#EAE0D8] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#2E2E2E]">
                  {MUA_VENDORS.length} vendor
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {MUA_VENDORS.map((vendor) => (
                  <button
                    key={vendor.id}
                    type="button"
                    onClick={() => setActivePopupVendor(vendor.name)}
                    className="group rounded-2xl border border-[#D8CEC7] bg-[#F7F4F1] p-6 sm:p-8 text-center shadow-sm hover:shadow-lg hover:border-[#B8B3AE] hover:-translate-y-0.5 transition-all duration-200 ease-out"
                  >
                    <div className="font-serif text-xl sm:text-2xl font-black uppercase tracking-wide text-[#2E2E2E] group-hover:text-[#1d1d1d]">
                      {vendor.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {activeVendor && (
          <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E8DDD6]">
              <button
                type="button"
                onClick={() => setActivePopupVendor(null)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F2E9E4] text-[#2E2E2E] border border-[#E8DDD6] hover:bg-[#E4D9D3] transition-colors"
                aria-label="Tutup popup"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="pr-10">
                <h4 className="mt-2 font-serif text-2xl sm:text-3xl font-black uppercase text-[#2E2E2E] leading-none">
                  {activeVendor.name}
                </h4>
              </div>

              <div className="mt-5 space-y-3">
                {activeVendor.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#EAE0D8] bg-[#F9F7F5] px-4 py-3">
                    <div className="font-serif text-base sm:text-lg font-black uppercase text-[#2E2E2E]">
                      {service.name}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-mono font-bold uppercase text-stone-500">Rp.</span>
                        <span className="font-mono text-sm font-black text-[#2E2E2E]">
                          {service.price.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          handleAddToMuaCart(activeVendor.name, service);
                        }}
                        className="rounded-full bg-[#3A3A3A] px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-white hover:bg-[#1f1f1f] transition-colors"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {cartItems.length > 0 && (
                <div className="mt-5 rounded-2xl border border-[#DDE7DF] bg-[#F0F7F1] p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#6F7F6B]">
                        Ringkasan
                      </p>
                      <div className="mt-1 font-serif text-lg font-black uppercase text-[#2E2E2E]">
                        Total MUA
                      </div>
                    </div>

                    <div className="font-mono text-lg font-black text-[#2E2E2E]">
                      Rp {muaCartTotal.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div className="mt-3 max-h-28 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 py-1 text-sm text-[#2E2E2E]">
                        <span className="font-medium">
                          {item.qty}x {item.itemName}
                        </span>
                        <span className="font-mono font-bold">
                          Rp {(item.price * item.qty).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleGoToCheckout}
                    className="mt-4 w-full rounded-full bg-[#25D366] px-4 py-3 text-sm font-serif font-black uppercase tracking-[0.14em] text-white shadow-md hover:bg-[#1ebc5a] transition-colors"
                  >
                    Lanjut ke Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-[#DAD0C8] bg-[#2B2F33] px-4 sm:px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-3 rounded-full bg-[#2A2A2A] text-white border border-[#3A3A3A] px-5 py-3 font-serif font-black uppercase tracking-[0.12em] text-sm sm:text-base shadow-md hover:bg-[#1d1d1d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tutup & Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MUAPricelistModal;
