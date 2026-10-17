import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  Clock3,
  Copy,
  CreditCard,
  Instagram,
  LoaderCircle,
  MapPin,
  Minus,
  Plus,
  QrCode,
  ShoppingBag,
  Smartphone,
  Trash2,
  Truck,
  Upload,
  User,
  X,
} from 'lucide-react';

export type ExtraCartCategory = 'MUA' | 'CETAK' | 'BINGKAI';

export interface ExtraCartItem {
  id: string;
  category: ExtraCartCategory;
  itemName: string;
  vendor?: string;
  price: number;
  qty: number;
}

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_RuTLV0Q0pMe3LRKvqGFELu4lV5j4cVx7YPuBdO6ux8ZWBmVONRs3g_qnN_5QXlL7-w/exec';
const ADMIN_STUDIO_1_WA = '6287777538164';
const ADMIN_STUDIO_2_WA = '6285168879214';

const FORM_STORAGE_KEY = 'alviero_extra_checkout_form';

interface PersistedExtraForm {
  step?: 1 | 2 | 3;
  selectedStudio?: 'Studio 1' | 'Studio 2';
  selectedDate?: string;
  selectedTime?: string;
  pickupNote?: string;
  customerName?: string;
  customerPhone?: string;
  customerInstagram?: string;
  paymentType?: 'dp' | 'full';
  paymentMethod?: 'qris' | 'bca';
  isScheduleConfirmed?: boolean;
  confirmedDate?: string;
  confirmedTime?: string;
  confirmedStudio?: 'Studio 1' | 'Studio 2';
}

const getSavedFormData = (): PersistedExtraForm => {
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

interface ExtraCheckoutModalProps {
  isOpen: boolean;
  items: ExtraCartItem[];
  onClose: () => void;
  onUpdateQty: (id: string, nextQty: number) => void;
  onRemoveItem: (id: string) => void;
  selectedMuaStudio: 'Studio 1' | 'Studio 2';
  onSelectStudio?: (studio: 'Studio 1' | 'Studio 2') => void;
  onSubmit: (payload: {
    items: ExtraCartItem[];
    selectedStudio?: 'Studio 1' | 'Studio 2';
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
    paymentProofImage?: string;
    paymentProofFileName?: string;
  }) => string | void;
}

export const ExtraCheckoutModal: React.FC<ExtraCheckoutModalProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  selectedMuaStudio,
  onSelectStudio,
  onSubmit,
}) => {
  const savedData = useMemo(() => getSavedFormData(), [isOpen]);

  const [step, setStep] = useState<1 | 2 | 3>(() => savedData.step || 1);
  const [selectedStudio, setSelectedStudio] = useState<'Studio 1' | 'Studio 2'>(() => {
    return savedData.selectedStudio || selectedMuaStudio || 'Studio 1';
  });
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return savedData.selectedDate || new Date().toISOString().slice(0, 10);
  });
  const [selectedTime, setSelectedTime] = useState<string>(() => {
    return savedData.selectedTime || '10:00';
  });
  const [pickupNote, setPickupNote] = useState<string>(() => {
    return savedData.pickupNote || '';
  });
  const [customerName, setCustomerName] = useState<string>(() => {
    return savedData.customerName || '';
  });
  const [customerPhone, setCustomerPhone] = useState<string>(() => {
    return savedData.customerPhone || '';
  });
  const [customerInstagram, setCustomerInstagram] = useState<string>(() => {
    return savedData.customerInstagram || '';
  });
  const [paymentType, setPaymentType] = useState<'dp' | 'full'>(() => {
    return savedData.paymentType || 'dp';
  });
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca'>(() => {
    return savedData.paymentMethod || 'qris';
  });

  const [isScheduleConfirmed, setIsScheduleConfirmed] = useState<boolean>(() => {
    return Boolean(savedData.isScheduleConfirmed);
  });
  const [confirmedDate, setConfirmedDate] = useState<string>(() => savedData.confirmedDate || '');
  const [confirmedTime, setConfirmedTime] = useState<string>(() => savedData.confirmedTime || '');
  const [confirmedStudio, setConfirmedStudio] = useState<'Studio 1' | 'Studio 2' | ''>(() => savedData.confirmedStudio || '');

  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [paymentProofImage, setPaymentProofImage] = useState<string | null>(null);
  const [paymentProofFileName, setPaymentProofFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync studio if selectedMuaStudio changes and no local choice was explicitly made
  useEffect(() => {
    if (selectedMuaStudio && !savedData.selectedStudio) {
      setSelectedStudio(selectedMuaStudio);
    }
  }, [selectedMuaStudio, savedData.selectedStudio]);

  // Persist form data on changes
  useEffect(() => {
    try {
      const dataToSave: PersistedExtraForm = {
        step,
        selectedStudio,
        selectedDate,
        selectedTime,
        pickupNote,
        customerName,
        customerPhone,
        customerInstagram,
        paymentType,
        paymentMethod,
        isScheduleConfirmed,
        confirmedDate,
        confirmedTime,
        confirmedStudio,
      };
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Gagal menyimpan form extra checkout:', e);
    }
  }, [
    step,
    selectedStudio,
    selectedDate,
    selectedTime,
    pickupNote,
    customerName,
    customerPhone,
    customerInstagram,
    paymentType,
    paymentMethod,
    isScheduleConfirmed,
    confirmedDate,
    confirmedTime,
    confirmedStudio,
  ]);

  // If user modifies schedule after confirming, reset confirmation status
  useEffect(() => {
    if (isScheduleConfirmed) {
      const isDateChanged = Boolean(confirmedDate && selectedDate !== confirmedDate);
      const isTimeChanged = Boolean(confirmedTime && selectedTime !== confirmedTime);
      const isStudioChanged = Boolean(confirmedStudio && selectedStudio !== confirmedStudio);

      if (isDateChanged || isTimeChanged || isStudioChanged) {
        setIsScheduleConfirmed(false);
      }
    }
  }, [selectedDate, selectedTime, selectedStudio, isScheduleConfirmed, confirmedDate, confirmedTime, confirmedStudio]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );
  const qrisFee = subtotal * 0.01;
  const totalWithFee = subtotal + (paymentMethod === 'qris' ? qrisFee : 0);
  const paymentAmount = Math.round(paymentType === 'dp' ? totalWithFee / 2 : totalWithFee);

  const canSubmit =
    items.length > 0 &&
    customerName.trim() !== '' &&
    customerPhone.trim() !== '' &&
    selectedDate.trim() !== '' &&
    selectedTime.trim() !== '' &&
    !!paymentProofImage;

  const compressPaymentProof = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Bukti transfer tidak dapat dibaca.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Format bukti transfer tidak valid.'));
      image.onload = () => {
        const maxDimension = 1400;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Browser tidak mendukung kompresi gambar.'));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

  const handleProofUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    if (!isImage) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    try {
      const compressedImage = await compressPaymentProof(file);
      setPaymentProofImage(compressedImage);
      setPaymentProofFileName(file.name);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Bukti transfer tidak dapat diproses.');
    } finally {
      event.target.value = '';
    }
  };

  const handleRemoveProof = () => {
    setPaymentProofImage(null);
    setPaymentProofFileName('');
  };

  const handleStudioChange = (newStudio: 'Studio 1' | 'Studio 2') => {
    setSelectedStudio(newStudio);
    if (onSelectStudio) {
      onSelectStudio(newStudio);
    }
  };

  const submitExtraBookingToSheets = async () => {
    const rincianItem = items
      .map((item) => `- ${item.qty}x ${item.itemName}${item.vendor ? ` ${item.vendor}` : ''}`)
      .join('\n');

    const payload = {
      action: 'extra_booking',
      jenisPesanan: `EXTRA/MUA (${selectedStudio})`,
      namaLengkap: customerName,
      whatsapp: customerPhone,
      instagram: customerInstagram,
      jadwal: `${selectedDate} ${selectedTime}`,
      lokasi: pickupNote,
      studio: selectedStudio,
      rincianItem,
      totalBiaya: totalWithFee,
      opsiPembayaran: paymentType === 'dp' ? 'DP 50%' : 'LUNAS',
      metodePembayaran: paymentMethod === 'qris' ? 'QRIS' : 'BCA',
      paymentProofImage: paymentProofImage || '',
      paymentProofFileName: paymentProofFileName || '',
    };

    await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    const checkoutPayload = {
      items,
      selectedStudio,
      selectedDate,
      selectedTime,
      pickupNote,
      customerName,
      customerPhone,
      customerInstagram,
      paymentType,
      paymentMethod,
      paymentAmount,
      total: totalWithFee,
      paymentProofImage: paymentProofImage || undefined,
      paymentProofFileName: paymentProofFileName || undefined,
    };

    const whatsappUrl = onSubmit(checkoutPayload);
    setIsSubmitting(false);
    if (whatsappUrl) {
      // Open the final WhatsApp URL directly from the tap, keeping the booking tab intact.
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
    // Clear local storage after successful checkout
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
      localStorage.removeItem('alviero_extra_cart');
      localStorage.removeItem('alviero_extra_checkout_open');
    } catch {}

    void submitExtraBookingToSheets().catch((error) => {
      console.error('Gagal menyimpan extra booking ke Google Sheets:', error);
    });
  };

  const handleCopyBankAccount = async () => {
    try {
      await navigator.clipboard.writeText('0113324021');
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 1500);
    } catch {
      setCopiedAccount(false);
    }
  };

  const handleScheduleConfirmation = () => {
    if (!selectedDate || !selectedTime) {
      alert('Mohon pilih tanggal dan jam terlebih dahulu sebelum konfirmasi ke WA Admin.');
      return;
    }

    const cartDetailsString = items
      .map((item) => `- ${item.qty}x ${item.itemName}${item.vendor ? ` ${item.vendor}` : ''}`)
      .join('\n');
    const recipientWaNumber = selectedStudio === 'Studio 2' ? ADMIN_STUDIO_2_WA : ADMIN_STUDIO_1_WA;
    const locationName = selectedStudio === 'Studio 2' ? 'Dinoyo (Kota Malang)' : 'Junrejo / Karangploso (Kab. Malang)';

    const message = encodeURIComponent(
      `Halo Admin ${selectedStudio} Alviero, saya ingin konfirmasi ketersediaan jadwal untuk pesanan layanan ekstra berikut:

*Rincian Pesanan:*
${cartDetailsString}

*Jadwal & Lokasi:*
- Studio Tujuan: ${selectedStudio} - ${locationName}
- Tanggal: ${selectedDate}
- Jam: ${selectedTime}
- Lokasi Layanan: ${pickupNote || 'Belum diisi'}

Apakah slot dan layanan di atas tersedia?`
    );

    setIsScheduleConfirmed(true);
    setConfirmedDate(selectedDate);
    setConfirmedTime(selectedTime);
    setConfirmedStudio(selectedStudio);

    // Save immediately to localStorage
    try {
      const dataToSave: PersistedExtraForm = {
        step: 2,
        selectedStudio,
        selectedDate,
        selectedTime,
        pickupNote,
        customerName,
        customerPhone,
        customerInstagram,
        paymentType,
        paymentMethod,
        isScheduleConfirmed: true,
        confirmedDate: selectedDate,
        confirmedTime: selectedTime,
        confirmedStudio: selectedStudio,
      };
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {}

    window.open(`https://api.whatsapp.com/send?phone=${recipientWaNumber}&text=${message}`, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  const steps = [
    { id: 1, label: 'Pesanan' },
    { id: 2, label: 'Jadwal' },
    { id: 3, label: 'Pembayaran' },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/65 p-2 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="flex max-h-[92vh] sm:max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#292929] bg-[#F7F3EE] shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between gap-3 bg-[#1C1C1C] px-3.5 py-2.5 sm:px-4 sm:py-3 text-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white/10 text-[#A9BCA7] shrink-0">
              <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate">
                Keranjang Layanan
              </h3>
              <p className="text-[9.5px] font-sans text-stone-400">
                Rias MUA, Busana & Cetak
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-stone-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Tutup checkout"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Segmented Step Indicator */}
        <div className="px-3 pt-2.5 pb-1 sm:px-4 sm:pt-3 shrink-0">
          <div className="grid grid-cols-3 gap-1 bg-[#E8DDD6]/70 p-1 rounded-xl">
            {steps.map((item) => {
              const isActive = step === item.id;
              const isDone = step > item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === 3 && !isScheduleConfirmed) {
                      alert(`Mohon konfirmasi jadwal ke WhatsApp Admin ${selectedStudio} terlebih dahulu sebelum lanjut ke tahap pembayaran.`);
                      return;
                    }
                    setStep(item.id as 1 | 2 | 3);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-1 rounded-lg text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#2D2D2D] text-white shadow-xs'
                      : isDone
                        ? 'bg-white/70 text-[#3E5D44] hover:bg-white'
                        : 'text-stone-500 hover:text-stone-800'
                  } cursor-pointer`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold shrink-0 ${
                      isActive ? 'bg-[#A9BCA7] text-[#1E1E1E]' : isDone ? 'bg-[#3E5D44] text-white' : 'bg-stone-300 text-stone-600'
                    }`}
                  >
                    {isDone ? '✓' : item.id}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2 sm:px-4 sm:py-3 space-y-3">
          {/* STEP 1: RINCIAN PESANAN */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="rounded-xl border border-[#E8DDD6] bg-white p-3 sm:p-3.5 shadow-2xs">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#2E2E2E]">
                    Daftar Item Terpilih
                  </span>
                  <span className="rounded-full border border-[#E8DDD6] bg-[#F2E9E4] px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-[#2E2E2E]">
                    {items.length} item
                  </span>
                </div>

                {items.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#D9CFC7] bg-[#FDFBF7] p-6 text-center text-xs text-stone-500">
                    Keranjang masih kosong. Silakan pilih layanan terlebih dahulu.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-[#E8DDD6] bg-[#FDFBF7] p-2.5 sm:p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="rounded bg-[#2D2D2D] px-1.5 py-0.5 text-[8.5px] font-mono font-bold uppercase text-white">
                                {item.category}
                              </span>
                              {item.vendor && (
                                <span className="text-[9.5px] font-bold uppercase text-[#6E856C]">
                                  {item.vendor}
                                </span>
                              )}
                            </div>
                            <h5 className="mt-1 font-serif text-xs sm:text-sm font-bold text-[#2E2E2E] leading-snug">
                              {item.itemName}
                            </h5>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            title="Hapus item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between border-t border-[#E8DDD6]/60 pt-2">
                          {/* Stepper Qty */}
                          <div className="flex items-center gap-1.5 rounded-lg border border-[#E8DDD6] bg-white p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, Math.max(item.qty - 1, 1))}
                              className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#F2E9E4] text-stone-600 cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-6 text-center font-mono text-xs font-bold text-[#2E2E2E]">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, item.qty + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded bg-[#2D2D2D] text-white hover:bg-black cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="font-mono text-xs sm:text-sm font-bold text-[#2E2E2E]">
                            Rp {(item.price * item.qty).toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: JADWAL & LOKASI */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="rounded-xl border border-[#E8DDD6] bg-white p-3.5 sm:p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#2E2E2E]">
                    <CalendarDays className="h-4 w-4 text-[#6E856C]" />
                    <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">
                      Waktu, Studio & Lokasi
                    </h4>
                  </div>
                </div>

                {/* Studio Alviero Tujuan */}
                <div>
                  <label className="mb-1.5 block text-[9.5px] font-mono font-bold uppercase tracking-wider text-stone-600">
                    Pilih Studio Alviero Tujuan
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleStudioChange('Studio 1')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        selectedStudio === 'Studio 1'
                          ? 'border-[#2D2D2D] bg-[#F2E9E4] ring-1 ring-[#2D2D2D] shadow-2xs'
                          : 'border-[#E8DDD6] bg-[#FDFBF7] hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-[11px] font-bold text-[#2E2E2E]">Studio 1 (Junrejo)</span>
                        {selectedStudio === 'Studio 1' && <span className="text-[10px] text-[#3E5D44] font-bold">✓</span>}
                      </div>
                      <span className="text-[8.5px] text-stone-500 font-mono block mt-0.5">WA: 0877-7753-8164</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStudioChange('Studio 2')}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        selectedStudio === 'Studio 2'
                          ? 'border-[#2D2D2D] bg-[#F2E9E4] ring-1 ring-[#2D2D2D] shadow-2xs'
                          : 'border-[#E8DDD6] bg-[#FDFBF7] hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-[11px] font-bold text-[#2E2E2E]">Studio 2 (Dinoyo)</span>
                        {selectedStudio === 'Studio 2' && <span className="text-[10px] text-[#3E5D44] font-bold">✓</span>}
                      </div>
                      <span className="text-[8.5px] text-stone-500 font-mono block mt-0.5">WA: 0851-6887-9214</span>
                    </button>
                  </div>
                </div>

                {/* Pilih Tanggal & Jam */}
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[9.5px] font-mono font-bold uppercase tracking-wider text-stone-600">
                      Pilih Tanggal
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full min-h-[38px] rounded-lg border border-[#E8DDD6] bg-[#FDFBF7] px-2.5 text-xs text-[#2E2E2E] focus:border-[#2D2D2D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[9.5px] font-mono font-bold uppercase tracking-wider text-stone-600">
                      Pilih Jam
                    </label>
                    <div className="relative">
                      <Clock3 className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6E856C]" />
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full min-h-[38px] rounded-lg border border-[#E8DDD6] bg-[#FDFBF7] pl-8 pr-2.5 text-xs text-[#2E2E2E] focus:border-[#2D2D2D] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[9.5px] font-bold text-amber-800 bg-amber-50/80 border border-amber-200/80 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                    <span>⚠️</span> Jam Make Up disarankan minimal 1 jam sebelum jadwal sesi foto.
                  </p>
                </div>

                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-[9.5px] font-mono font-bold uppercase tracking-wider text-stone-600">
                    <MapPin className="h-3 w-3 text-[#6E856C]" />
                    Lokasi / Catatan Layanan
                  </label>
                  <textarea
                    rows={2}
                    value={pickupNote}
                    onChange={(e) => setPickupNote(e.target.value)}
                    placeholder="Contoh: Rias di studio / di rumah klien / alamat venue"
                    className="w-full rounded-lg border border-[#E8DDD6] bg-[#FDFBF7] px-2.5 py-2 text-xs text-[#2E2E2E] placeholder:text-stone-400 focus:border-[#2D2D2D] focus:outline-none resize-none"
                  />
                </div>

                {/* WA Schedule Confirmation Block */}
                <div className="pt-1">
                  {!isScheduleConfirmed ? (
                    <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-sm shrink-0">⚠️</span>
                        <div>
                          <p className="font-serif text-xs font-bold text-amber-950 uppercase tracking-wide">
                            Wajib Konfirmasi Jadwal ke WA Admin
                          </p>
                          <p className="text-[10px] text-amber-800 leading-relaxed mt-0.5">
                            Sebelum melakukan pembayaran, pastikan jadwal dan ketersediaan layanan telah dikonfirmasi ke WhatsApp Admin <strong>{selectedStudio}</strong>.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleScheduleConfirmation}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 px-3 text-xs font-serif font-bold uppercase tracking-wider shadow-xs transition active:scale-[0.98] cursor-pointer"
                      >
                        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0">
                          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.672 4.8 1.84 6.796L2 30l7.41-1.814A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Z" fill="white"/>
                          <path d="M22.5 19.5c-.3-.15-1.77-.873-2.044-.972-.274-.1-.474-.15-.673.15-.2.3-.773.972-.947 1.173-.174.2-.348.225-.648.075-.3-.15-1.267-.467-2.413-1.49-.892-.796-1.494-1.779-1.669-2.079-.174-.3-.018-.462.131-.61.134-.134.3-.35.45-.524.15-.174.2-.3.3-.5.1-.2.05-.374-.025-.524-.075-.15-.673-1.622-.922-2.22-.243-.583-.49-.504-.673-.513l-.574-.01c-.2 0-.524.075-.8.374-.274.3-1.047 1.023-1.047 2.495 0 1.472 1.072 2.895 1.222 3.095.15.2 2.11 3.22 5.11 4.514.714.308 1.272.492 1.707.63.717.228 1.37.196 1.886.119.575-.086 1.77-.724 2.02-1.423.248-.7.248-1.298.173-1.423-.074-.124-.274-.2-.574-.35Z" fill="#25D366"/>
                        </svg>
                        <span>Konfirmasi Jadwal via WA ({selectedStudio})</span>
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-emerald-300 bg-emerald-50/90 p-3 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                            ✓
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif text-xs font-bold text-emerald-950 uppercase tracking-wide truncate">
                              Jadwal Dikonfirmasi ke WA Admin
                            </p>
                            <p className="text-[9.5px] text-emerald-700 font-mono truncate">
                              Admin {selectedStudio} ({selectedStudio === 'Studio 2' ? '0851-6887-9214' : '0877-7753-8164'})
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleScheduleConfirmation}
                          className="text-[9.5px] font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0 cursor-pointer"
                        >
                          Buka Ulang WA
                        </button>
                      </div>
                      <p className="text-[9px] text-emerald-800 font-sans">
                        Ketersediaan telah dicek. Anda sekarang dapat melanjutkan ke tahap pembayaran.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DATA & PEMBAYARAN */}
          {step === 3 && (
            <div className="space-y-3">
              {/* Studio & Jadwal Summary Pill */}
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-[10.5px]">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                    ✓
                  </span>
                  <div>
                    <span className="font-bold text-emerald-950 font-serif">
                      {selectedStudio === 'Studio 2' ? 'Studio 2 (Dinoyo)' : 'Studio 1 (Junrejo)'}
                    </span>
                    <span className="text-emerald-700 font-mono block text-[9.5px]">
                      {selectedDate} • {selectedTime} WIB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-[9.5px] font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
                >
                  Ubah Jadwal
                </button>
              </div>

              {/* Form Data Pemesan */}
              <div className="rounded-xl border border-[#E8DDD6] bg-white p-3 sm:p-3.5 shadow-2xs">
                <div className="mb-2.5 flex items-center gap-1.5 text-[#2E2E2E]">
                  <User className="h-3.5 w-3.5 text-[#6E856C]" />
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider">
                    Data Pemesan
                  </h4>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[9px] font-mono font-bold uppercase text-stone-600">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Anisa Putri"
                      className="w-full min-h-[38px] rounded-lg border border-[#E8DDD6] bg-[#FDFBF7] px-2.5 text-xs text-[#2E2E2E] focus:border-[#2D2D2D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[9px] font-mono font-bold uppercase text-stone-600">
                      No. WhatsApp *
                    </label>
                    <div className="relative">
                      <Smartphone className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6E856C]" />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0812xxxxxxxx"
                        className="w-full min-h-[38px] rounded-lg border border-[#E8DDD6] bg-[#FDFBF7] pl-8 pr-2.5 text-xs text-[#2E2E2E] focus:border-[#2D2D2D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-stone-600">
                      <Instagram className="h-3 w-3 text-[#6E856C]" />
                      Instagram (Opsional)
                    </label>
                    <input
                      type="text"
                      value={customerInstagram}
                      onChange={(e) => setCustomerInstagram(e.target.value)}
                      placeholder="@username"
                      className="w-full min-h-[38px] rounded-lg border border-[#E8DDD6] bg-[#FDFBF7] px-2.5 text-xs text-[#2E2E2E] focus:border-[#2D2D2D] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pilihan Metode Bayar */}
                <div className="mt-3 border-t border-[#E8DDD6]/70 pt-2.5">
                  <label className="mb-1.5 flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-stone-600">
                    <CreditCard className="h-3 w-3 text-[#6E856C]" />
                    Metode Pembayaran
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qris')}
                      className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all cursor-pointer ${
                        paymentMethod === 'qris'
                          ? 'border-[#2D2D2D] bg-[#F2E9E4]/60 ring-1 ring-[#2D2D2D] shadow-2xs'
                          : 'border-[#E8DDD6] bg-[#FDFBF7] hover:bg-[#F2E9E4]/30'
                      }`}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2D2D2D] text-[#A9BCA7] shrink-0">
                        <QrCode className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block font-serif text-[10.5px] font-bold text-[#2E2E2E]">QRIS Resmi</span>
                        <span className="text-[8.5px] font-mono text-stone-500">+1% Biaya</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bca')}
                      className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all cursor-pointer ${
                        paymentMethod === 'bca'
                          ? 'border-[#2D2D2D] bg-[#F2E9E4]/60 ring-1 ring-[#2D2D2D] shadow-2xs'
                          : 'border-[#E8DDD6] bg-[#FDFBF7] hover:bg-[#F2E9E4]/30'
                      }`}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#005EAA] text-[10px] font-black text-white shrink-0">
                        BCA
                      </div>
                      <div className="min-w-0">
                        <span className="block font-serif text-[10.5px] font-bold text-[#2E2E2E]">Transfer BCA</span>
                        <span className="text-[8.5px] font-mono text-stone-500">0113324021</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Rincian Total Bayar & Rekening / QRIS */}
              <div className="rounded-xl border border-[#3A3A3A] bg-[#222222] p-3 text-white shadow-xs">
                <div className="flex items-center justify-between text-xs border-b border-[#3A3A3A] pb-2">
                  <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#A9BCA7]">Total Estimasi Biaya</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#A9BCA7]">
                    Rp {totalWithFee.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* QRIS / BCA details */}
                <div className="mt-2.5">
                  {paymentMethod === 'qris' ? (
                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                      <div className="h-16 w-16 bg-white rounded-md p-1 shrink-0 flex items-center justify-center">
                        <img src="/images/qris-alviero.png" alt="QRIS Alviero" className="h-full w-full object-contain" />
                      </div>
                      <div className="text-[10px] text-stone-300">
                        <span className="font-bold text-white block">QRIS Nasional Alviero</span>
                        <span>Scan dari BCA, Mandiri, GoPay, OVO, ShopeePay, Dana dll.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg text-xs">
                      <div>
                        <span className="text-[9px] text-stone-400 block uppercase font-mono">BCA a.n Muhammad Azzam Fakhri</span>
                        <span className="font-mono font-bold text-white tracking-wider">0113324021</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyBankAccount}
                        className="rounded-lg bg-white/10 hover:bg-white/20 px-2 py-1 text-[9.5px] font-mono font-bold uppercase text-white transition-colors cursor-pointer"
                      >
                        {copiedAccount ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Bukti Bayar */}
              <div className="rounded-xl border border-[#DDE9DF] bg-white p-3 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold uppercase text-[#2E2E2E]">
                    <Camera className="h-3.5 w-3.5 text-[#6E856C]" />
                    Upload Bukti Transfer *
                  </span>
                  {paymentProofImage ? (
                    <span className="rounded bg-emerald-100 text-emerald-800 text-[8.5px] font-mono font-bold px-1.5 py-0.5">
                      ✓ Terlampir
                    </span>
                  ) : (
                    <span className="rounded bg-rose-100 text-rose-700 text-[8.5px] font-mono font-bold px-1.5 py-0.5">
                      Wajib
                    </span>
                  )}
                </div>

                {!paymentProofImage ? (
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#A9BCA7] bg-[#FDFBF7] hover:bg-[#F2E9E4] p-3 rounded-lg cursor-pointer transition-colors">
                    <input type="file" accept="image/*" onChange={handleProofUpload} className="hidden" />
                    <Upload className="h-4 w-4 text-[#6E856C]" />
                    <span className="text-[10px] font-bold text-[#2E2E2E]">Pilih Foto Bukti Transfer (Maks. 5MB)</span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 p-2 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={paymentProofImage} alt="Bukti" className="h-9 w-9 rounded object-cover border border-emerald-200 shrink-0" />
                      <span className="text-[10px] text-emerald-900 font-bold truncate">
                        {paymentProofFileName || 'bukti-transfer.png'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveProof}
                      className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Unified Bottom Footer */}
        <div className="border-t border-[#E8DDD6] bg-white px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3 shrink-0">
          {step === 1 ? (
            <>
              <div>
                <span className="block text-[8.5px] font-mono font-bold uppercase tracking-wider text-stone-500">
                  Total Biaya
                </span>
                <span className="font-mono text-sm sm:text-base font-black text-[#2E2E2E]">
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={items.length === 0}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2D2D2D] hover:bg-[#1E1E1E] px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider text-white shadow-xs transition active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <span>Lanjut Jadwal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          ) : step === 2 ? (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 rounded-xl border border-[#D9CFC7] bg-white hover:bg-[#FDFBF7] px-3 py-2 text-xs font-serif font-bold uppercase tracking-wider text-[#2E2E2E] transition active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Kembali</span>
              </button>
              {isScheduleConfirmed ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedDate || !selectedTime) {
                      alert('Mohon pilih tanggal dan jam terlebih dahulu.');
                      return;
                    }
                    setStep(3);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2D2D2D] hover:bg-[#1E1E1E] px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider text-white shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <span>Lanjut Bayar</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    alert(`Mohon klik tombol "Konfirmasi Jadwal via WA (${selectedStudio})" terlebih dahulu untuk memastikan ketersediaan sebelum lanjut bayar.`);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-stone-300 text-stone-500 px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider cursor-not-allowed opacity-60"
                  title={`Wajib konfirmasi jadwal ke WhatsApp Admin ${selectedStudio} terlebih dahulu`}
                >
                  <span>Lanjut Bayar</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1 rounded-xl border border-[#D9CFC7] bg-white hover:bg-[#FDFBF7] px-3 py-2 text-xs font-serif font-bold uppercase tracking-wider text-[#2E2E2E] transition active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                disabled={!canSubmit || isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2D2D2D] hover:bg-[#1E1E1E] px-4 py-2 text-xs font-serif font-bold uppercase tracking-wider text-white shadow-xs transition active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0">
                      <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.672 4.8 1.84 6.796L2 30l7.41-1.814A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Z" fill="#25D366"/>
                      <path d="M22.5 19.5c-.3-.15-1.77-.873-2.044-.972-.274-.1-.474-.15-.673.15-.2.3-.773.972-.947 1.173-.174.2-.348.225-.648.075-.3-.15-1.267-.467-2.413-1.49-.892-.796-1.494-1.779-1.669-2.079-.174-.3-.018-.462.131-.61.134-.134.3-.35.45-.524.15-.174.2-.3.3-.5.1-.2.05-.374-.025-.524-.075-.15-.673-1.622-.922-2.22-.243-.583-.49-.504-.673-.513l-.574-.01c-.2 0-.524.075-.8.374-.274.3-1.047 1.023-1.047 2.495 0 1.472 1.072 2.895 1.222 3.095.15.2 2.11 3.22 5.11 4.514.714.308 1.272.492 1.707.63.717.228 1.37.196 1.886.119.575-.086 1.77-.724 2.02-1.423.248-.7.248-1.298.173-1.423-.074-.124-.274-.2-.574-.35Z" fill="white"/>
                    </svg>
                    <span>Kirim Pesanan WA →</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtraCheckoutModal;
