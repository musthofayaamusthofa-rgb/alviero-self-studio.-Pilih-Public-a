import React, { useState } from 'react';
import { X, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

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

const KEBAYA_PREVIEWS: Record<string, string> = {
  Sage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=85',
  Nude: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=85',
  Black: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85',
  Navy: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=700&q=85',
  Maroon: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85',
  Gold: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85',
  Silver: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85',
};

export const MUA_VENDORS: MuaVendorDefinition[] = [
  {
    id: 'novita',
    name: 'By Novita',
    coverImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    services: [
      { id: 'novita-mua-pass-foto', name: 'MUA - Pass Foto', price: 0 },
      { id: 'novita-mua-wedding', name: 'MUA - Wedding', price: 0 },
      { id: 'novita-mua-graduation-indoor', name: 'MUA - Graduation Indoor', price: 0 },
      { id: 'novita-mua-graduation-outdoor', name: 'MUA - Graduation Outdoor', price: 0 },
      { id: 'novita-mua-prewedding-indoor', name: 'MUA - Prewedding Indoor', price: 0 },
      { id: 'novita-mua-prewedding-outdoor', name: 'MUA - Prewedding Outdoor', price: 0 },
      { id: 'novita-kebaya', name: 'Kebaya', price: 0 },
      { id: 'novita-hijabdo', name: 'Hijabdo', price: 0 }
    ]
  },
  {
    id: 'ananda',
    name: 'By Ananda',
    coverImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
    services: [
      { id: 'ananda-mua-pass-foto', name: 'MUA - Pass Foto', price: 0 },
      { id: 'ananda-mua-wedding', name: 'MUA - Wedding', price: 0 },
      { id: 'ananda-mua-graduation-indoor', name: 'MUA - Graduation Indoor', price: 0 },
      { id: 'ananda-mua-graduation-outdoor', name: 'MUA - Graduation Outdoor', price: 0 },
      { id: 'ananda-mua-prewedding-indoor', name: 'MUA - Prewedding Indoor', price: 0 },
      { id: 'ananda-mua-prewedding-outdoor', name: 'MUA - Prewedding Outdoor', price: 0 },
      { id: 'ananda-kebaya', name: 'Kebaya', price: 0 },
      { id: 'ananda-hijabdo', name: 'Hijabdo', price: 0 }
    ]
  },
  {
    id: 'masaya',
    name: 'By Masaya',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    services: [
      { id: 'masaya-mua-pass-foto', name: 'MUA - Pass Foto', price: 0 },
      { id: 'masaya-mua-wedding', name: 'MUA - Wedding', price: 0 },
      { id: 'masaya-mua-graduation-indoor', name: 'MUA - Graduation Indoor', price: 0 },
      { id: 'masaya-mua-graduation-outdoor', name: 'MUA - Graduation Outdoor', price: 0 },
      { id: 'masaya-mua-prewedding-indoor', name: 'MUA - Prewedding Indoor', price: 0 },
      { id: 'masaya-mua-prewedding-outdoor', name: 'MUA - Prewedding Outdoor', price: 0 },
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
  const [isMuaExpanded, setIsMuaExpanded] = useState(false);
  const [isKebayaExpanded, setIsKebayaExpanded] = useState(false);
  const [kebayaColor, setKebayaColor] = useState<string | null>(null);
  const [kebayaSize, setKebayaSize] = useState<string | null>(null);
  const [kebayaQty, setKebayaQty] = useState(1);
  const [previewImagePopup, setPreviewImagePopup] = useState<string | null>(null);
  const activeVendor = MUA_VENDORS.find((vendor) => vendor.name === activePopupVendor) || null;

  const kebayaColors = ['Sage', 'Nude', 'Black', 'Navy', 'Maroon', 'Gold', 'Silver'];
  const kebayaSizes = ['S', 'M', 'L', 'XL', 'XXL'];

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

  const handleAddKebayaToCart = (vendorName: string) => {
    if (!kebayaColor || !kebayaSize || !onAddExtraItem) return;

    onAddExtraItem({
      id: `${vendorName}-kebaya-${kebayaColor.toLowerCase()}-${kebayaSize.toLowerCase()}`,
      category: 'MUA',
      itemName: `Kebaya (Warna: ${kebayaColor}, Ukuran: ${kebayaSize})`,
      vendor: vendorName,
      price: 0,
      qty: kebayaQty,
    });

    setKebayaColor(null);
    setKebayaSize(null);
    setKebayaQty(1);
    setIsKebayaExpanded(false);
  };

  const muaCartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) return;
    setActivePopupVendor(null);
    if (onOpenExtraCheckout) onOpenExtraCheckout();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-0 backdrop-blur-[2px] sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-[min(92vw,920px)] flex-col overflow-hidden rounded-t-[28px] border border-[#E7E0D9] bg-[#F7F4F1] shadow-2xl sm:rounded-[24px]">
        <div className="sticky top-0 z-10 shrink-0 border-b border-[#E8DDD6] bg-[#F7F4F1] px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E8DDD6] bg-[#FDFBF7] shadow-2xs">
                <span className="text-base">✦</span>
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-serif text-sm font-black uppercase tracking-wide text-[#2E2E2E] sm:text-lg">
                  PRICELIST MUA, KEBAYA, HAIRDO & HIJABDO
                </h3>
                <p className="text-[9px] font-sans uppercase tracking-[0.16em] text-stone-600 sm:text-[10px]">
                  Beauty & styling pilihan premium
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#2D2D2D] px-3 py-1.5 text-[9px] font-serif font-bold uppercase tracking-[0.16em] text-white shadow-sm transition-colors hover:bg-[#1d1d1d] sm:text-[10px]"
            >
              <span className="text-base leading-none">×</span>
              <span>Tutup</span>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#F7F4F1]">
          <section className="px-4 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
            <p className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#6F7F6B]">
              Hasil Makeup & Styling
            </p>
            <div className="mt-2 flex items-end justify-between gap-3">
                <h4 className="max-w-2xl font-serif text-2xl font-black leading-[0.98] tracking-tight text-[#2E2E2E] sm:text-3xl">
                Inspirasi MUA, KEBAYA, HAIRDO & HIJABDO
              </h4>
              <span className="hidden sm:inline text-[10px] font-sans text-stone-500">Geser ke samping</span>
            </div>

            <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 no-scrollbar">
              {MUA_VENDORS.map((vendor) => (
                <div key={vendor.id} className="min-w-[210px] snap-start overflow-hidden rounded-[18px] border border-[#E2D9D3] bg-white shadow-sm sm:min-w-[235px]">
                  <div className="relative h-[290px] overflow-hidden sm:h-[330px]">
                    <img src={vendor.coverImage} alt={vendor.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <div className="inline-flex rounded-full border border-white/70 bg-white/80 text-[#2E2E2E] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.16em]">
                        {vendor.name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="px-4 pb-4 sm:px-5 sm:pb-5">
            <div className="rounded-[18px] border border-[#E8DDD6] bg-[#F4EFEA] p-3 sm:p-4">
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

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {MUA_VENDORS.map((vendor) => (
                  <button
                    key={vendor.id}
                    type="button"
                    onClick={() => setActivePopupVendor(vendor.name)}
                    className="group flex min-h-24 items-center justify-center rounded-xl border border-[#D8CEC7] bg-[#F7F4F1] p-3 text-center shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#B8B3AE] hover:shadow-lg sm:min-h-28 sm:rounded-2xl sm:p-6"
                  >
                    <div className="font-serif text-lg font-black uppercase leading-tight tracking-wide text-[#2E2E2E] group-hover:text-[#1d1d1d] sm:text-xl">
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
            <div className="relative flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-2xl border border-[#E8DDD6]">
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

              <div className="flex-1 overflow-y-auto max-h-[50vh] pr-2 space-y-3 mt-5">
                {activeVendor.services.some((service) => service.name.startsWith('MUA -')) && (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsMuaExpanded(!isMuaExpanded)}
                      className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#EAE0D8] bg-[#F9F7F5] px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      aria-expanded={isMuaExpanded}
                    >
                      <span className="font-serif text-base sm:text-lg font-black uppercase text-[#2E2E2E]">
                        MUA (Makeup Artist)
                      </span>
                      {isMuaExpanded ? (
                        <ChevronUp className="h-5 w-5 shrink-0 text-[#2E2E2E]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 shrink-0 text-[#2E2E2E]" />
                      )}
                    </button>

                    {isMuaExpanded && (
                      <div className="ml-3 space-y-3 rounded-xl bg-gray-50 p-3">
                        {activeVendor.services
                          .filter((service) => service.name.startsWith('MUA -'))
                          .map((service) => (
                            <div key={service.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#EAE0D8] bg-white px-4 py-3">
                              <div className="font-serif text-base sm:text-lg font-black uppercase text-[#2E2E2E]">
                                {service.name.replace(/^MUA\s*-\s*/, '')}
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
                    )}
                  </>
                )}

                {activeVendor.services
                  .filter((service) => !service.name.startsWith('MUA -'))
                  .map((service) => (
                    service.name === 'Kebaya' ? (
                      <div key={service.id}>
                        <button
                          type="button"
                          onClick={() => setIsKebayaExpanded(!isKebayaExpanded)}
                          className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#EAE0D8] bg-[#F9F7F5] px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                          aria-expanded={isKebayaExpanded}
                        >
                          <span className="font-serif text-base sm:text-lg font-black uppercase text-[#2E2E2E]">
                            Kebaya
                          </span>
                          {isKebayaExpanded ? (
                            <ChevronUp className="h-5 w-5 shrink-0 text-[#2E2E2E]" />
                          ) : (
                            <ChevronDown className="h-5 w-5 shrink-0 text-[#2E2E2E]" />
                          )}
                        </button>

                        {isKebayaExpanded && (
                          <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div>
                              <p className="mb-2 text-sm font-bold text-[#2E2E2E]">Warna</p>
                              <div className="flex flex-wrap gap-2">
                                {kebayaColors.map((color) => (
                                  <button
                                    key={color}
                                    type="button"
                                    onClick={() => {
                                      setKebayaColor(color);
                                      setPreviewImagePopup(color);
                                    }}
                                    className={`rounded-md bg-white px-3 py-2 text-sm transition-colors ${
                                      kebayaColor === color
                                        ? 'border-2 border-black font-bold'
                                        : 'border border-gray-300 hover:border-gray-500'
                                    }`}
                                  >
                                    {color}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="mt-4">
                              <p className="mb-2 text-sm font-bold text-[#2E2E2E]">Ukuran</p>
                              <div className="flex flex-wrap gap-2">
                                {kebayaSizes.map((size) => (
                                  <button
                                    key={size}
                                    type="button"
                                    onClick={() => setKebayaSize(size)}
                                    className={`min-w-11 rounded-md bg-white px-3 py-2 text-sm transition-colors ${
                                      kebayaSize === size
                                        ? 'border-2 border-black font-bold'
                                        : 'border border-gray-300 hover:border-gray-500'
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <p className="text-sm font-bold text-[#2E2E2E]">Kuantitas</p>
                              <div className="flex items-center rounded-md border border-gray-300 bg-white">
                                <button
                                  type="button"
                                  onClick={() => setKebayaQty((quantity) => Math.max(1, quantity - 1))}
                                  className="px-3 py-1.5 text-lg leading-none hover:bg-gray-100"
                                  aria-label="Kurangi kuantitas Kebaya"
                                >
                                  -
                                </button>
                                <span className="min-w-8 text-center text-sm font-bold">{kebayaQty}</span>
                                <button
                                  type="button"
                                  onClick={() => setKebayaQty((quantity) => quantity + 1)}
                                  className="px-3 py-1.5 text-lg leading-none hover:bg-gray-100"
                                  aria-label="Tambah kuantitas Kebaya"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddKebayaToCart(activeVendor.name)}
                              disabled={!kebayaColor || !kebayaSize}
                              className="mt-4 w-full rounded-full bg-[#3A3A3A] px-4 py-3 text-sm font-mono font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                            >
                              + Masukkan Keranjang
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
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
                    )
                  ))}
              </div>

              {cartItems.length > 0 && (
                <div className="sticky bottom-0 mt-5 shrink-0 rounded-2xl border border-[#DDE7DF] bg-white p-4 shadow-[0_-8px_16px_-12px_rgba(0,0,0,0.35)]">
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

        {previewImagePopup && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setPreviewImagePopup(null)}
            role="presentation"
          >
            <div className="relative w-full max-w-sm" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                onClick={() => setPreviewImagePopup(null)}
                className="absolute -right-4 -top-4 z-10 cursor-pointer rounded-full bg-white p-2 text-black shadow-lg"
                aria-label="Tutup preview warna"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={KEBAYA_PREVIEWS[previewImagePopup] || KEBAYA_PREVIEWS.Sage}
                alt={`Preview kebaya warna ${previewImagePopup}`}
                className="max-h-[70vh] w-full rounded-xl object-cover"
              />
              <p className="mt-3 text-center text-sm font-mono font-bold uppercase tracking-[0.16em] text-white">
                Preview Warna: {previewImagePopup}
              </p>
            </div>
          </div>
        )}

        <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-[#DAD0C8] bg-[#2B2F33] px-3 py-3 sm:px-5 sm:py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#3A3A3A] bg-[#2A2A2A] px-4 py-2.5 text-xs font-serif font-black uppercase tracking-[0.1em] text-white shadow-md transition-colors hover:bg-[#1d1d1d] sm:gap-3 sm:px-5 sm:py-3 sm:text-sm"
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
