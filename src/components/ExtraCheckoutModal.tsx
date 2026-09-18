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

interface ExtraCheckoutModalProps {
  isOpen: boolean;
  items: ExtraCartItem[];
  onClose: () => void;
  onUpdateQty: (id: string, nextQty: number) => void;
  onRemoveItem: (id: string) => void;
  selectedMuaStudio: 'Studio 1' | 'Studio 2';
  onSubmit: (payload: {
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
  onSubmit,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [pickupNote, setPickupNote] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerInstagram, setCustomerInstagram] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'dp' | 'full'>('dp');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca'>('qris');
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [isScheduleConfirmed, setIsScheduleConfirmed] = useState<boolean>(false);
  const [paymentProofImage, setPaymentProofImage] = useState<string | null>(null);
  const [paymentProofFileName, setPaymentProofFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    setIsScheduleConfirmed(false);
  }, [selectedDate, selectedTime, pickupNote]);

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

  const submitExtraBookingToSheets = async () => {
    const rincianItem = items
      .map((item) => `- ${item.qty}x ${item.itemName}${item.vendor ? ` ${item.vendor}` : ''}`)
      .join('\n');

    const payload = {
      action: 'extra_booking',
      jenisPesanan: 'EXTRA/MUA',
      namaLengkap: customerName,
      whatsapp: customerPhone,
      instagram: customerInstagram,
      jadwal: `${selectedDate} ${selectedTime}`,
      lokasi: pickupNote,
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
    // Keep the booking tab alive while the normal request uploads the proof image.
    // keepalive is intentionally avoided because Base64 proof images can exceed
    // the browser's keepalive request-size limit.
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
    const cartDetailsString = items
      .map((item) => `- ${item.qty}x ${item.itemName}${item.vendor ? ` ${item.vendor}` : ''}`)
      .join('\n');
    const recipientWaNumber = selectedMuaStudio === 'Studio 2' ? ADMIN_STUDIO_2_WA : ADMIN_STUDIO_1_WA;

    const message = encodeURIComponent(
      `Halo Admin ${selectedMuaStudio} Alviero, saya ingin konfirmasi ketersediaan jadwal untuk pesanan layanan ekstra berikut:

*Rincian Pesanan:*
${cartDetailsString}

*Jadwal & Lokasi:*
- Tanggal: ${selectedDate}
- Jam: ${selectedTime}
- Lokasi/Pengambilan: ${pickupNote || 'Belum diisi'}

Apakah slot dan layanan di atas tersedia?`
    );

    window.open(`https://wa.me/${recipientWaNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
    setIsScheduleConfirmed(true);
  };

  if (!isOpen) return null;

  const steps = [
    { id: 1, label: 'Rincian Pesanan' },
    { id: 2, label: 'Jadwal & Pengambilan' },
    { id: 3, label: 'Data & Pembayaran' },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-2 backdrop-blur-[2px] sm:p-6">
      <div className="flex max-h-[96vh] w-full max-w-3xl flex-col overflow-hidden rounded-[20px] border border-[#292929] bg-[#F7F3EE] shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:max-h-[90vh] sm:rounded-[28px]">
        <div className="flex items-center justify-between gap-2 bg-[#1C1C1C] px-3 py-3 text-white sm:gap-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 shadow-sm">
              <ShoppingBag className="h-5 w-5 text-[#A9BCA7]" />
            </div>

            <div className="min-w-0">
              <h3 className="font-serif text-base sm:text-xl font-black uppercase tracking-[0.2em] text-white truncate">
                KERANJANG & RESERVASI TAMBAHAN
              </h3>
              <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.18em] text-stone-300">
                Non-Studio Booking
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white border border-white/10 transition hover:bg-white/15"
            aria-label="Tutup checkout"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {steps.map((item) => {
              const isActive = step === item.id;
              const isDone = step > item.id;

              return (
                <div key={item.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (item.id === 3 && !isScheduleConfirmed) return;
                      setStep(item.id as 1 | 2 | 3);
                    }}
                    disabled={item.id === 3 && !isScheduleConfirmed}
                    className={`rounded-full border px-3 py-1.5 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.14em] transition-colors ${
                      isActive
                        ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]'
                        : isDone
                          ? 'bg-[#E7F0E8] text-[#3E5D44] border-[#C7D7C6]'
                          : 'bg-white text-[#3A3A3A] border-[#D9CFC7]'
                    } ${item.id === 3 && !isScheduleConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {item.id}. {item.label}
                  </button>

                  {item.id !== steps.length && (
                    <span className="text-[#9B8E86]">›</span>
                  )}
                </div>
              );
            })}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E8DDD6] bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="font-serif text-lg sm:text-xl font-black uppercase tracking-wide text-[#2E2E2E]">
                    Rincian Pesanan
                  </h4>
                  <span className="rounded-full border border-[#E8DDD6] bg-[#F2E9E4] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#2E2E2E]">
                    {items.length} item
                  </span>
                </div>

                <div className="space-y-3">
                  {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#D9CFC7] bg-[#F9F6F3] p-6 text-center text-sm text-stone-500">
                      Keranjang masih kosong.
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-[#E8DDD6] bg-[#F9F6F3] p-3 sm:p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[#2D2D2D] px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-[0.15em] text-white">
                                {item.category}
                              </span>
                              {item.vendor && (
                                <span className="text-[10px] font-sans uppercase tracking-[0.12em] text-stone-500">
                                  {item.vendor}
                                </span>
                              )}
                            </div>

                            <div className="mt-2 font-serif text-base sm:text-lg font-black uppercase text-[#2E2E2E]">
                              {item.itemName}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="rounded-full border border-[#E2D7D1] bg-white px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#2E2E2E] transition hover:bg-[#F2E9E4]"
                          >
                            Hapus
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 rounded-full border border-[#E8DDD6] bg-white p-1 shadow-sm">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, Math.max(item.qty - 1, 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F2E9E4]"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>

                            <span className="min-w-8 text-center font-mono text-sm font-black text-[#2E2E2E]">
                              {item.qty}
                            </span>

                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, item.qty + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D2D2D] text-white"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="font-mono text-sm sm:text-base font-black text-[#2E2E2E]">
                            Rp {(item.price * item.qty).toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E8DDD6] bg-[#F2E9E4] p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 text-[#2E2E2E]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em]">Subtotal</span>
                  <span className="font-mono text-xl font-black">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={items.length === 0}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2D2D2D] px-5 py-3 text-[10px] sm:text-[11px] font-serif font-black uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Lanjut ke Jadwal
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E8DDD6] bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-[#2E2E2E]">
                  <CalendarDays className="h-4 w-4 text-[#6E856C]" />
                  <h4 className="font-serif text-lg font-black uppercase tracking-wide">Jadwal & Pengambilan</h4>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#2E2E2E]">
                      Pilih Tanggal
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full min-h-[46px] rounded-xl border border-[#E8DDD6] bg-[#FDFBF7] px-3 text-sm text-[#2E2E2E] focus:border-[#2D2D2D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#2E2E2E]">
                      Pilih Jam
                    </label>
                    <div className="relative">
                      <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E856C]" />
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full min-h-[46px] rounded-xl border border-[#E8DDD6] bg-[#FDFBF7] pl-9 pr-3 text-sm text-[#2E2E2E] focus:border-[#2D2D2D] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#2E2E2E]">
                    <MapPin className="h-4 w-4 text-[#6E856C]" />
                    Lokasi MUA / Metode Pengambilan
                  </label>
                  <textarea
                    rows={3}
                    value={pickupNote}
                    onChange={(e) => setPickupNote(e.target.value)}
                    placeholder="Contoh: Ambil di Studio / Dikirim via kurir / Lokasi MUA di rumah klien"
                    className="w-full rounded-xl border border-[#E8DDD6] bg-[#FDFBF7] px-3 py-3 text-sm text-[#2E2E2E] placeholder:text-stone-400 focus:border-[#2D2D2D] focus:outline-none"
                  />
                </div>
              </div>

            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-[22px] border border-[#E8DDD6] bg-white p-4 sm:p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-[#2E2E2E]">
                  <User className="h-4 w-4 text-[#6E856C]" />
                  <h4 className="font-serif text-lg font-black uppercase tracking-wide">Data & Pembayaran</h4>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#2E2E2E]">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Anisa Putri"
                      className="w-full min-h-[46px] rounded-xl border border-[#E8DDD6] bg-[#FDFBF7] px-3 text-sm text-[#2E2E2E] focus:border-[#2D2D2D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#2E2E2E]">
                      No. WhatsApp
                    </label>
                    <div className="relative">
                      <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E856C]" />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0812xxxxxxxx"
                        className="w-full min-h-[46px] rounded-xl border border-[#E8DDD6] bg-[#FDFBF7] pl-9 pr-3 text-sm text-[#2E2E2E] focus:border-[#2D2D2D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#2E2E2E]">
                      <Instagram className="h-4 w-4 text-[#6E856C]" />
                      Instagram (Opsional)
                    </label>
                    <input
                      type="text"
                      value={customerInstagram}
                      onChange={(e) => setCustomerInstagram(e.target.value)}
                      placeholder="@username"
                      className="w-full min-h-[46px] rounded-xl border border-[#E8DDD6] bg-[#FDFBF7] px-3 text-sm text-[#2E2E2E] focus:border-[#2D2D2D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 border-t border-[#E8DDD6] pt-4 space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#2E2E2E]">
                    <CreditCard className="h-4 w-4 text-[#6E856C]" />
                    Opsi Pembayaran Booking
                  </label>

                  <div className="grid grid-cols-1 gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentType('dp')}
                      className="min-h-[48px] rounded-[9999px] border border-[#2D2D2D] bg-white ring-1 ring-[#2D2D2D] shadow-sm px-3 py-3 text-left transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif text-[11px] font-bold uppercase text-[#2E2E2E]">Bayar DP 50%</span>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2D2D2D] text-[10px] font-bold text-white">
                          ✓
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="mt-4 border-t border-[#E8DDD6] pt-4 space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#2E2E2E]">
                    <CreditCard className="h-4 w-4 text-[#6E856C]" />
                    Pilih Metode Pembayaran
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qris')}
                      className={`flex min-h-[56px] items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                        paymentMethod === 'qris'
                          ? 'border-[#2D2D2D] bg-white ring-1 ring-[#2D2D2D] shadow-sm'
                          : 'border-[#E8DDD6] bg-white text-stone-700 hover:bg-[#FDFBF7]'
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2D2D2D] text-[#A9BCA7]">
                        <QrCode className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-serif text-[11px] font-bold uppercase text-[#2E2E2E]">QRIS Resmi</span>
                          <span className="rounded border border-[#A9BCA7] bg-[#EBF2EA] px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-[#6E856C]">+1% Biaya</span>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bca')}
                      className={`flex min-h-[56px] items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                        paymentMethod === 'bca'
                          ? 'border-[#2D2D2D] bg-white ring-1 ring-[#2D2D2D] shadow-sm'
                          : 'border-[#E8DDD6] bg-white text-stone-700 hover:bg-[#FDFBF7]'
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#005EAA] text-xs font-black text-white">BCA</div>
                      <div className="min-w-0">
                        <span className="font-serif text-[11px] font-bold uppercase text-[#2E2E2E]">Transfer Bank BCA</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#3A3A3A] bg-[#1C1C1C] p-4 text-white shadow-md">
                <div className="flex items-center justify-between gap-3 border-b border-[#3A3A3A] pb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#A9BCA7]">
                    Rincian Pesanan Tambahan (MUA/DLL)
                  </span>
                  <span className="font-serif text-xs uppercase tracking-[0.12em] text-stone-200">{items.length} item</span>
                </div>

                <div className="mt-3 space-y-2 text-xs text-stone-200">
                  <div className="flex items-center justify-between gap-3">
                    <span>Subtotal Keranjang Ekstra</span>
                    <span className="font-mono font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>

                  {paymentMethod === 'qris' && (
                    <div className="flex items-center justify-between gap-3">
                      <span>Biaya Layanan QRIS (1%)</span>
                      <span className="font-mono font-bold text-amber-300">+ Rp {qrisFee.toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 border-t border-[#3A3A3A] pt-3 text-base font-serif font-black text-white">
                    <span className="uppercase tracking-[0.12em]">Total Estimasi Biaya</span>
                    <span className="font-mono text-[#A9BCA7]">Rp {totalWithFee.toLocaleString('id-ID')}</span>
                  </div>

                  {paymentType === 'dp' && (
                    <div className="mt-3 rounded-xl border border-[#A9BCA7]/40 bg-[#1F2B1F] p-3">
                      <div className="flex items-center justify-between gap-3 text-[11px] font-serif font-bold uppercase tracking-[0.12em] text-stone-200">
                        <span>Minimum Transfer DP 50%:</span>
                        <span className="font-mono text-[#A9BCA7]">Rp {paymentAmount.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E8DDD6] bg-[#FDFBF7] p-4 shadow-sm">
                {paymentMethod === 'qris' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 border-b border-[#E8DDD6] pb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D2D2D] text-[#A9BCA7]">
                          <QrCode className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-serif text-xs font-black uppercase tracking-[0.12em] text-[#2E2E2E]">Scan Pembayaran QRIS Resmi Alviero Studio</h4>
                        </div>
                      </div>
                      <span className="rounded-full border border-[#A9BCA7] bg-[#EBF2EA] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.12em] text-[#6E856C]">QRIS Nasional</span>
                    </div>

                    <div className="flex justify-center">
                      <div className="max-w-[200px] rounded-2xl border border-[#2D2D2D] bg-white p-3 shadow-sm">
                        <img src="/images/qris-alviero.png" alt="QRIS Resmi Alviero Studio" className="mx-auto h-auto w-full max-w-[200px] object-contain" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3 border-b border-[#E8DDD6] pb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#005EAA] text-xs font-black text-white">BCA</div>
                        <div>
                          <h4 className="font-serif text-xs font-black uppercase tracking-[0.12em] text-[#2E2E2E]">Transfer Rekening Bank BCA</h4>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#D7D9DA] bg-white p-3">
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[#5F5F5F]">No. Rekening</div>
                        <div className="mt-1 font-mono text-lg font-black text-[#2E2E2E]">0113324021</div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyBankAccount}
                        className="inline-flex items-center gap-2 rounded-full border border-[#D9CFC7] bg-[#F2E9E4] px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#2E2E2E]"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copiedAccount ? 'Tersalin' : 'Salin Rekening'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[#DDE9DF] bg-[#F9FBF9] p-4 shadow-sm">
                <label className="mb-3 flex items-center justify-between gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#2E2E2E]">
                  <span className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-[#6E856C]" />
                    Unggah Bukti Transfer ({paymentMethod === 'bca' ? 'BCA' : 'QRIS'}):
                    <span className="text-rose-600">*</span>
                  </span>
                  {paymentProofImage ? (
                    <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.12em] text-emerald-800">
                      ✅ Terlampir
                    </span>
                  ) : (
                    <span className="rounded-full border border-rose-200 bg-rose-100 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.12em] text-rose-700">
                      Wajib
                    </span>
                  )}
                </label>

                {!paymentProofImage ? (
                  <label className="relative block cursor-pointer rounded-[20px] border-2 border-dashed border-[#A9BCA7] bg-[#FDFBF7] p-5 text-center transition hover:bg-[#F2E9E4]">
                    <input type="file" accept="image/*" onChange={handleProofUpload} className="hidden" />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2D2D2D] text-[#A9BCA7] shadow-sm">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="font-serif text-[11px] font-black uppercase tracking-[0.12em] text-[#2E2E2E]">
                        Klik Di Sini Untuk Memilih Foto Bukti Transfer
                      </p>
                      <p className="text-[10.5px] text-stone-500">
                        Mendukung format JPG, PNG, WebP, atau Screenshot Struk Pembayaran (Maks. 5MB)
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="flex items-center justify-between gap-3 rounded-[20px] border border-emerald-200 bg-emerald-50/80 p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={paymentProofImage}
                        alt="Preview Bukti Transfer"
                        className="h-14 w-14 rounded-xl border border-emerald-200 bg-white object-cover shadow-sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-bold text-emerald-900">
                          {paymentProofFileName || 'Bukti-Transfer-QRIS.png'}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-emerald-700">
                          <Check className="h-3.5 w-3.5" />
                          Foto bukti transfer siap dikirimkan
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <label className="cursor-pointer rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#2E2E2E]">
                        <input type="file" accept="image/*" onChange={handleProofUpload} className="hidden" />
                        Ganti Foto
                      </label>
                      <button
                        type="button"
                        onClick={handleRemoveProof}
                        className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                        aria-label="Hapus bukti transfer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4">
          {step === 2 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9CFC7] bg-white px-5 py-3 text-[10px] sm:text-[11px] font-serif font-black uppercase tracking-[0.18em] text-[#2E2E2E]"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleScheduleConfirmation}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-2 text-[10px] sm:text-[11px] font-serif font-black uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-green-600"
                >
                  <span className="text-base">✆</span>
                  Konfirmasi Jadwal Via WA
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!isScheduleConfirmed}
                  className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#2D2D2D] px-5 py-3 text-[10px] sm:text-[11px] font-serif font-black uppercase tracking-[0.18em] text-white transition ${
                    !isScheduleConfirmed ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Lanjut ke Data
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9CFC7] bg-white px-5 py-3 text-[10px] sm:text-[11px] font-serif font-black uppercase tracking-[0.18em] text-[#2E2E2E]"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>

              <button
                type="button"
                disabled={!canSubmit || isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-[10px] sm:text-[11px] font-serif font-black uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <span className="text-base">✆</span>
                    Kirim Booking WA
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtraCheckoutModal;
