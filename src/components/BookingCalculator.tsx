import React, { useState, useEffect } from 'react';
import { PACKAGES, CATEGORIES, BACKDROPS, FRAME_TEMPLATES, ADD_ONS, TIME_SLOTS, PRO_STUDIO_TIME_SLOTS, SELF_STUDIO_TIME_SLOTS, STUDIO_BRANCHES } from '../data/pricelistData';
import { BookingFormData, StudioBranch } from '../types';
import { X, Calendar, Clock, User, Phone, CheckCircle2, Sparkles, MessageCircle, QrCode, CreditCard, ChevronRight, Calculator, Plus, Minus, Tag, Copy, Check, Camera, Image as ImageIcon, MapPin, Building2 } from 'lucide-react';

interface BookingCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBranch?: StudioBranch;
  onSelectBranch?: (branch: StudioBranch) => void;
  onOpenBranchModal?: () => void;
  preselectedPackageId?: string;
  preselectedBackdropId?: string;
  preselectedFrameId?: string;
}

export const getPackageCategoryInfo = (pkg: { id: string; category: string; name: string }) => {
  const id = pkg.id.toLowerCase();
  const cat = pkg.category.toLowerCase();
  
  if (id.includes('outdoor') || cat.includes('outdoor')) {
    return { key: 'grad-outdoor', label: 'Wisuda Outdoor', badge: '🌳 Wisuda Outdoor', note: '' };
  }
  if (id.includes('grad') || id.includes('wisuda') || cat === 'graduation') {
    return { key: 'grad-indoor', label: 'Wisuda Indoor', badge: '🎓 Wisuda Indoor', note: '' };
  }
  if (id.includes('passfoto') || cat === 'pass-foto' || cat === 'passfoto') {
    return { key: 'pass-foto', label: 'Pass Foto', badge: '👤 Pass Foto', note: '' };
  }
  if (id.includes('self-') || id.includes('selfstudio') || cat === 'self-studio' || cat === 'selfstudio') {
    return { key: 'self-studio', label: 'Self Studio', badge: '✨ Self Studio', note: '' };
  }
  if (cat === 'group' || id.includes('group')) {
    return { key: 'group', label: 'Paket Group', badge: '👥 Group', note: '' };
  }
  if (cat === 'family' || id.includes('family')) {
    return { key: 'family', label: 'Paket Family', badge: '👨‍👩‍👧‍👦 Family', note: '✨ Khusus untuk paket Family, tersedia diskon potongan Rp 50.000 khusus jika sesi hanya beranggotakan 3 orang keluarga.' };
  }
  if (cat === 'birthday' || id.includes('birthday')) {
    return { key: 'birthday', label: 'Paket Birthday', badge: '🎉 Birthday', note: '🎈 Bisa request konsep / tema ulang tahun custom (silakan konfirmasi konsep ke admin WhatsApp).' };
  }
  if (cat === 'maternity' || id.includes('maternity')) {
    return { key: 'maternity', label: 'Paket Maternity', badge: '🤰 Maternity', note: '' };
  }
  if (cat === 'personal' || id.includes('personal')) {
    return { key: 'personal', label: 'Paket Personal', badge: '👤 Personal', note: '' };
  }
  if (cat === 'couple' || id.includes('couple')) {
    return { key: 'couple', label: 'Paket Couple', badge: '💑 Couple', note: '' };
  }
  if (cat === 'prewedding' || id.includes('prewed')) {
    return { key: 'prewedding', label: 'Paket Prewedding', badge: '💍 Prewedding', note: '' };
  }
  if (cat === 'undangan' || id.includes('undangan')) {
    return { key: 'undangan', label: 'Paket Undangan', badge: '💌 Undangan', note: '' };
  }
  if (cat === 'sewa-studio' || id.includes('sewa')) {
    return { key: 'sewa-studio', label: 'Paket Sewa Studio', badge: '🏢 Sewa Studio', note: '' };
  }
  return { key: cat, label: pkg.name, badge: '📸 Studio', note: '' };
};

export const getPackageMaxBackdrops = (pkg: { id: string; category: string; name: string; description?: string; highlights?: string[] }): number => {
  const id = pkg.id.toLowerCase();
  const cat = pkg.category.toLowerCase();
  
  if (id.includes('self') || cat === 'self-studio' || cat === 'pass-foto' || id.includes('passfoto') || cat === 'sewa-studio' || cat === 'undangan') {
    return 1;
  }
  
  const desc = (pkg.description || '').toLowerCase();
  const highlights = (pkg.highlights || []).map(h => h.toLowerCase()).join(' ');
  const name = (pkg.name || '').toLowerCase();

  // If explicitly mentions 2 background / 2 latar
  if (desc.includes('2 background') || highlights.includes('2 background') || desc.includes('2 latar') || highlights.includes('2 latar')) {
    return 2;
  }

  // Paket 2 keatas di Studio Foto
  const isPaket2OrHigher = (
    name.includes(' 2') || name.includes(' 3') || name.includes(' 4') ||
    name.includes('(birthday 2') || name.includes('(birthday 3') || name.includes('(birthday 4') ||
    name.includes('(group 2') || name.includes('(group 3') || name.includes('(group 4') ||
    name.includes('(family 2') || name.includes('(personal 2') || name.includes('(couple 2') ||
    name.includes('(graduation indoor 2') || name.includes('(graduation indoor 3') || name.includes('(graduation indoor 4') ||
    name.includes('(graduation 2') || name.includes('(graduation 3') || name.includes('(graduation 4') ||
    name.includes('(grad outdoor 2') || name.includes('(maternity 2') ||
    name.includes('(prewed 2') || name.includes('(prewed 3') || name.includes('(prewed 4') ||
    id.includes('-2') || id.includes('-3') || id.includes('-4') ||
    name.includes('silver') || name.includes('gold') || name.includes('platinum') ||
    name.includes('supreme') || name.includes('triumph') || name.includes('apex') ||
    name.includes('happy nest') || name.includes('opulent shot') || name.includes('glow sweet') ||
    name.includes('sweet light') || name.includes('ultimate') || name.includes('signature squad') ||
    name.includes('royal ensemble') || name.includes('imperial union') || name.includes('romantic deluxe')
  );

  return isPaket2OrHigher ? 2 : 1;
};

const GOOGLE_SHEETS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLQYerfozER5QYE20q5PTfXcINS2zlEce1jRLj_VOYO_EJ-FiEJ09qeDsDDAGguC6mLQ/exec';

export const normalizeSlotTime = (raw: any): string => {
  if (!raw) return '';
  const str = String(raw).trim();
  const match = str.match(/(\d{1,2})[:.](\d{2})/);
  if (match) {
    const hh = match[1].padStart(2, '0');
    const mm = match[2];
    return `${hh}:${mm}`;
  }
  return str;
};

export const BookingCalculator: React.FC<BookingCalculatorProps> = ({
  isOpen,
  onClose,
  selectedBranch = 'cabang-1',
  onSelectBranch,
  onOpenBranchModal,
  preselectedPackageId,
  preselectedBackdropId,
  preselectedFrameId
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedPackageId, setSelectedPackageId] = useState<string>(preselectedPackageId || PACKAGES[0].id);
  const [selectedBackdropIds, setSelectedBackdropIds] = useState<string[]>([preselectedBackdropId || BACKDROPS[0].id]);
  const [selectedFrameId, setSelectedFrameId] = useState<string>(preselectedFrameId || FRAME_TEMPLATES[0].id);
  const [selectedAddOns, setSelectedAddOns] = useState<{ [id: string]: number }>({});
  
  const today = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState<string>(today);
  const [timeSlot, setTimeSlot] = useState<string>('14:00');
  
  // Real-time Slot Availability from Google Sheets
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Promo Code & Payment Option
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent?: number; discountAmount?: number } | null>(null);
  const [promoError, setPromoError] = useState<string>('');
  const [paymentOption, setPaymentOption] = useState<'dp' | 'full'>('dp');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Deteksi Tipe Ruangan / Studio (Self Studio vs Studio Foto)
  const currentPackage = PACKAGES.find(p => p.id === selectedPackageId) || PACKAGES[0];
  const currentBranchInfo = STUDIO_BRANCHES.find(b => b.id === selectedBranch) || STUDIO_BRANCHES[0];
  const isSelfStudio = (currentPackage.category === 'self-studio' || currentPackage.id.toLowerCase().includes('self'));
  const maxBackdrops = getPackageMaxBackdrops(currentPackage);
  const studioTypeKey = isSelfStudio ? 'selfstudio' : 'studio_foto';
  const activeTimeSlots = isSelfStudio ? SELF_STUDIO_TIME_SLOTS : PRO_STUDIO_TIME_SLOTS;

  // Fetch Slot Terisi dari Google Sheets secara Real-Time terpisah per tipe studio & cabang
  useEffect(() => {
    if (!isOpen || !bookingDate) return;

    let isMounted = true;
    setIsLoadingSlots(true);

    const typeKey = isSelfStudio ? 'selfstudio' : 'studio_foto';

    fetch(`${GOOGLE_SHEETS_SCRIPT_URL}?action=check_slots&date=${encodeURIComponent(bookingDate)}&studio_type=${encodeURIComponent(typeKey)}&branch=${encodeURIComponent(selectedBranch)}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data && Array.isArray(data.bookedSlots)) {
          const normalized = data.bookedSlots.map(normalizeSlotTime).filter(Boolean);
          setBookedSlots(normalized);
        }
      })
      .catch(err => {
        console.warn('Gagal memuat status ketersediaan slot dari Google Sheets:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, bookingDate, selectedPackageId, selectedBranch, isSelfStudio]);

  // Otomatis pindah ke slot yang tersedia jika slot yang sedang aktif ternyata berstatus booked/penuh
  useEffect(() => {
    if (bookedSlots.includes(timeSlot)) {
      const firstAvailable = activeTimeSlots.find(s => !bookedSlots.includes(s));
      if (firstAvailable) setTimeSlot(firstAvailable);
    }
  }, [bookedSlots, activeTimeSlots, timeSlot]);

  useEffect(() => {
    if (preselectedPackageId) setSelectedPackageId(preselectedPackageId);
    if (preselectedBackdropId) setSelectedBackdropIds([preselectedBackdropId]);
    if (preselectedFrameId) setSelectedFrameId(preselectedFrameId);
  }, [preselectedPackageId, preselectedBackdropId, preselectedFrameId]);

  const availableBackdrops = BACKDROPS.filter(b => 
    (b.applicableBranches || ['cabang-1']).includes(selectedBranch) &&
    b.applicableTo?.includes(isSelfStudio ? 'self-studio' : 'pro-studio')
  );

  useEffect(() => {
    // Reset selected backdrop if it's not available in the current category & branch
    const validIds = selectedBackdropIds.filter(id => availableBackdrops.some(b => b.id === id));
    if (validIds.length === 0 && availableBackdrops.length > 0) {
      setSelectedBackdropIds([availableBackdrops[0].id]);
    } else if (maxBackdrops === 1 && validIds.length > 1) {
      setSelectedBackdropIds([validIds[0]]);
    } else if (validIds.length !== selectedBackdropIds.length) {
      setSelectedBackdropIds(validIds);
    }
  }, [selectedPackageId, selectedBranch, isSelfStudio, availableBackdrops, maxBackdrops]);

  const handleSelectBackdrop = (id: string) => {
    if (maxBackdrops === 1) {
      setSelectedBackdropIds([id]);
    } else {
      // maxBackdrops === 2
      if (selectedBackdropIds.includes(id)) {
        if (selectedBackdropIds.length > 1) {
          setSelectedBackdropIds(selectedBackdropIds.filter(bId => bId !== id));
        }
      } else {
        if (selectedBackdropIds.length < 2) {
          setSelectedBackdropIds([...selectedBackdropIds, id]);
        } else {
          // Replace 2nd backdrop
          setSelectedBackdropIds([selectedBackdropIds[0], id]);
        }
      }
    }
  };

  if (!isOpen) return null;

  const selectedBackdropObjects = selectedBackdropIds
    .map(id => BACKDROPS.find(b => b.id === id))
    .filter(Boolean) as BackdropOption[];

  const backdropDisplayName = selectedBackdropObjects.length > 1
    ? `Latar 1: ${selectedBackdropObjects[0].name} & Latar 2: ${selectedBackdropObjects[1].name}`
    : (selectedBackdropObjects[0]?.name || availableBackdrops[0]?.name || 'Latar Standar');

  const currentFrame = FRAME_TEMPLATES.find(f => f.id === selectedFrameId) || FRAME_TEMPLATES[0];

  // Calculate Price Breakdown
  const packagePrice = currentPackage.price;
  
  const addOnsTotalPrice = Object.entries(selectedAddOns).reduce((sum, [id, qty]) => {
    const addOn = ADD_ONS.find(a => a.id === id);
    const numQty = typeof qty === 'number' ? qty : Number(qty) || 0;
    return sum + (addOn ? addOn.price * numQty : 0);
  }, 0);

  const slotCharge = timeSlot === '20:45' ? 25000 : 0;

  const subtotal = packagePrice + addOnsTotalPrice + slotCharge;

  // Calculate Discount
  let discountValue = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountValue = Math.round((subtotal * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.discountAmount) {
      discountValue = appliedPromo.discountAmount;
    }
  }

  const grandTotal = Math.max(0, subtotal - discountValue);
  const dpAmount = Math.round(grandTotal * 0.5);

  const handleApplyPromo = () => {
    setPromoError('');
    const cleaned = promoCodeInput.trim().toUpperCase();
    if (cleaned === 'STUDENT10') {
      setAppliedPromo({ code: 'STUDENT10', discountPercent: 10 });
    } else if (cleaned === 'COUPLE15') {
      setAppliedPromo({ code: 'COUPLE15', discountPercent: 15 });
    } else if (cleaned === 'ALVIERO') {
      setAppliedPromo({ code: 'ALVIERO', discountAmount: 10000 });
    } else {
      setPromoError('Kode promo tidak valid atau telah kadaluarsa.');
    }
  };

  // AddOn Quantity Modifiers
  const handleAddOnQtyChange = (addOnId: string, delta: number) => {
    setSelectedAddOns(prev => {
      const currentQty = prev[addOnId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        const { [addOnId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [addOnId]: newQty };
    });
  };

  // WhatsApp Booking Link Generator
  const generateWhatsAppMessageText = () => {
    let message = `*HALO ADMIN ALVIERO STUDIO FOTO!* 👋\n`;
    message += `Saya mau reservasi/booking sesi foto dengan rincian berikut:\n\n`;
    message += `📌 *DATA PEMESAN:*\n`;
    message += `• Nama: ${customerName || '-'}\n`;
    message += `• No. WhatsApp: ${customerPhone || '-'}\n`;
    message += `• Tanggal Foto: ${bookingDate}\n`;
    message += `• Jam Slot: ${timeSlot} WIB\n`;
    message += `• *Tipe Ruangan:* ${isSelfStudio ? '✨ Bilik Self Studio (Shutter Mandiri)' : '📸 Studio Foto (Fotografer Pro)'}\n`;
    message += `• *Lokasi Studio:* ${currentBranchInfo.icon} *${currentBranchInfo.name}*\n\n`;

    message += `📷 *PAKET & KONSEP STUDIO:*\n`;
    message += `• Paket Utama: *${currentPackage.name}* (Rp ${currentPackage.price.toLocaleString('id-ID')})\n`;
    message += `• Pencahayaan / Backdrop: ${backdropDisplayName}\n`;
    if (isSelfStudio) {
      message += `• Grid Template Cetak: ${currentFrame.name}\n`;
    }
    message += `\n`;

    if (Object.keys(selectedAddOns).length > 0) {
      message += `✨ *ADD-ONS TAMBAHAN:*\n`;
      Object.entries(selectedAddOns).forEach(([id, qty]) => {
        const addOn = ADD_ONS.find(a => a.id === id);
        if (addOn) {
          const numQty = typeof qty === 'number' ? qty : Number(qty) || 0;
          message += `• ${addOn.name} (${numQty} ${addOn.unit}) = Rp ${(addOn.price * numQty).toLocaleString('id-ID')}\n`;
        }
      });
      message += `\n`;
    }

    if (slotCharge > 0) {
      message += `⚡ *CHARGE SLOT MALAM (20:45):* Rp 25.000\n\n`;
    }

    if (appliedPromo) {
      message += `🎟️ *KODE PROMO:* ${appliedPromo.code} (Hemat Rp ${discountValue.toLocaleString('id-ID')})\n`;
    }

    if (notes) {
      message += `📝 *Catatan Khusus:* ${notes}\n`;
    }

    message += `💳 *METODE PEMBAYARAN:* ${paymentOption === 'dp' ? `DP 50% (Rp ${dpAmount.toLocaleString('id-ID')})` : 'LUNAS FULL'}\n`;
    message += `💰 *TOTAL BIAYA:* *Rp ${grandTotal.toLocaleString('id-ID')}*\n\n`;
    message += `Mohon info ketersediaan slot jam ini & petunjuk QRIS ya min. Terima kasih! 🙏`;

    return message;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateWhatsAppMessageText());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleSendBookingWA = async () => {
    setIsSubmitting(true);

    // Kirim data reservasi ke Google Sheets di background
    try {
      const selectedAddOnsSummary = Object.entries(selectedAddOns)
        .map(([id, qty]) => {
          const a = ADD_ONS.find(item => item.id === id);
          return a ? `${a.name} (${qty} ${a.unit})` : '';
        })
        .filter(Boolean)
        .join(', ') || '-';

      const queryParams = new URLSearchParams({
        action: 'book_slot',
        date: bookingDate,
        time: timeSlot,
        studio_type: studioTypeKey,
        studio_label: isSelfStudio ? 'Self Studio' : 'Studio Foto Profesional',
        branch: selectedBranch,
        branch_name: currentBranchInfo.name,
        backdrop: backdropDisplayName,
        frame: isSelfStudio ? currentFrame.name : '-',
        name: customerName || 'Pelanggan',
        phone: customerPhone || '-',
        package: currentPackage.name,
        addons: selectedAddOnsSummary,
        total: grandTotal.toString(),
        dp: dpAmount.toString(),
        paymentMethod: paymentOption,
        surcharge: slotCharge.toString(),
        notes: notes || '-',
        status: 'PENDING'
      }).toString();

      // Kirim ke Google Apps Script di background
      fetch(`${GOOGLE_SHEETS_SCRIPT_URL}?${queryParams}`, {
        method: 'GET',
        mode: 'no-cors'
      }).catch(err => console.log('GAS background sync note:', err));
    } catch (e) {
      console.warn('GAS Submit Error:', e);
    } finally {
      setIsSubmitting(false);
    }

    const waUrl = `https://wa.me/6287777538164?text=${encodeURIComponent(generateWhatsAppMessageText())}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] my-auto relative">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
              <Calculator className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Kalkulator & Booking Online</h3>
              <p className="text-[11px] sm:text-xs text-indigo-300">Alviero Studio Foto • Fast WhatsApp Confirmation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Bar */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between text-xs font-semibold overflow-x-auto scroll-mask-x shrink-0">
          <button
            onClick={() => setStep(1)}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer ${
              step === 1 ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
            Paket & Jadwal
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            onClick={() => setStep(2)}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer ${
              step === 2 ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
            Add-ons & Diskon
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            onClick={() => setStep(3)}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer ${
              step === 3 ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
            Data & Pembayaran
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
          {/* STEP 1: Select Package, Date, Time & Concepts */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Branch Selector in Step 1 */}
              <div className="bg-slate-100/90 border border-slate-200/90 p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-xs">
                    {currentBranchInfo.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Lokasi Cabang Studio:</div>
                    <div className="text-xs font-black text-slate-900 truncate">{currentBranchInfo.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                  {STUDIO_BRANCHES.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        if (onSelectBranch) onSelectBranch(b.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        selectedBranch === b.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {b.id === 'cabang-1' ? 'Cabang 1' : 'Cabang 2'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Pilih Paket Foto */}
              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                  1. Pilih Paket Foto Utama:
                </label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  className="w-full min-h-[44px] p-3 rounded-2xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  {PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — Rp {pkg.price.toLocaleString('id-ID')} ({pkg.durationMinutes} Min)
                    </option>
                  ))}
                </select>
              </div>

              {/* Package Summary Card */}
              <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-indigo-950 text-sm">{currentPackage.name}</h4>
                    <p className="text-xs text-indigo-700">{currentPackage.description}</p>
                  </div>
                  <span className="font-black text-indigo-600 text-base shrink-0">
                    Rp {currentPackage.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-[11px] text-indigo-800 pt-1 flex items-center gap-2 flex-wrap">
                  <span className="bg-white px-2 py-0.5 rounded-md border border-indigo-200 font-semibold">⏱️ {currentPackage.durationMinutes} Menit Sesi</span>
                  <span className="bg-white px-2 py-0.5 rounded-md border border-indigo-200 font-semibold">👥 {currentPackage.includedPeople} Peserta</span>
                  <span className="bg-white px-2 py-0.5 rounded-md border border-indigo-200 font-semibold">🖨️ {currentPackage.includedPrints}</span>
                </div>
              </div>

              {/* 2. PILIH TANGGAL & JAM SLOT FOTO TERLEBIH DAHULU */}
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    2. Pilih Tanggal & Waktu Sesi Foto:
                  </label>
                  <span className="text-[10.5px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    {bookingDate} • {timeSlot} WIB
                  </span>
                </div>

                {/* Date Picker */}
                <div>
                  <input
                    type="date"
                    min={today}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full min-h-[44px] p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  />
                </div>

                {/* Room & Studio Type Identifier Banner */}
                {isSelfStudio ? (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-center gap-2.5 text-purple-900 text-xs font-semibold">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      ✨
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold text-purple-950 flex items-center gap-1.5">
                        Jadwal Khusus: Bilik Self Studio (Mandiri)
                        <span className="text-[9.5px] bg-purple-200/70 text-purple-800 px-1.5 py-0.2 rounded-full font-bold">Bilik Mandiri</span>
                      </p>
                      <p className="text-[10.5px] text-purple-700 font-normal">Sesi foto private dengan shutter remote. Jadwal terpisah & tidak bertabrakan dengan Studio Foto.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center gap-2.5 text-indigo-900 text-xs font-semibold">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      📸
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                        Jadwal Khusus: Studio Foto Profesional
                        <span className="text-[9.5px] bg-indigo-200/70 text-indigo-800 px-1.5 py-0.2 rounded-full font-bold">Fotografer Pro</span>
                      </p>
                      <p className="text-[10.5px] text-indigo-700 font-normal">Sesi dipandu & diarahkan langsung oleh tim fotografer profesional di panggung studio.</p>
                    </div>
                  </div>
                )}

                {/* Time Slots Grid (18 Pilihan) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      Pilih Jam Slot {isSelfStudio ? 'Self Studio' : 'Studio Foto'} ({activeTimeSlots.length} Pilihan):
                    </label>
                    <span className="text-[10.5px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Terpilih: {timeSlot} WIB
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {activeTimeSlots.map((slot) => {
                      const isSelected = timeSlot === slot;
                      const isChargeSlot = slot === '20:45';
                      const isBooked = bookedSlots.includes(slot);

                      return (
                        <button
                          key={slot}
                          type="button"
                          data-slot={slot}
                          data-price={isChargeSlot ? 'surcharge' : 'normal'}
                          disabled={isBooked}
                          onClick={() => setTimeSlot(slot)}
                          className={`min-h-[44px] p-2 rounded-xl text-xs font-black transition-all text-center flex flex-col items-center justify-center border ${
                            isBooked
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60 line-through'
                              : isSelected
                              ? isSelfStudio
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400/40 cursor-pointer active:scale-95'
                                : 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400/40 cursor-pointer active:scale-95'
                              : isChargeSlot
                              ? 'bg-amber-50/80 hover:bg-amber-100/80 text-amber-950 border-amber-300 shadow-2xs cursor-pointer active:scale-95'
                              : 'bg-slate-100 hover:bg-slate-200/90 text-slate-800 border-slate-200 shadow-2xs cursor-pointer active:scale-95'
                          }`}
                        >
                          <span className="leading-tight">{slot}</span>
                          {isBooked ? (
                            <span className="text-[8.5px] font-bold text-rose-500 uppercase mt-0.5 no-underline">
                              Penuh
                            </span>
                          ) : isChargeSlot ? (
                            <span
                              className={`text-[8.5px] font-extrabold uppercase mt-0.5 px-1 py-0.2 rounded ${
                                isSelected ? 'bg-amber-300 text-slate-950' : 'bg-amber-200/80 text-amber-900'
                              }`}
                            >
                              (+25k)
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {/* Notifikasi Khusus Slot 20:45 */}
                  {timeSlot === '20:45' && (
                    <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                      <span className="text-sm shrink-0">⚡</span>
                      <span>
                        Slot jam <strong className="font-bold">20:45 WIB</strong> adalah slot malam mendekati jam tutup studio dan dikenakan biaya operasional tambahan <strong className="font-bold">Rp 25.000</strong>.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Backdrop selection (1 or 2 backdrops depending on package) */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5">
                  <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    3. {maxBackdrops > 1 ? 'Pilih 2 Pencahayaan / Latar Belakang (Backdrop):' : 'Pilih Pencahayaan / Latar Belakang (Backdrop):'}
                  </label>
                  {maxBackdrops > 1 ? (
                    <span className="text-[10.5px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      ✨ Bebas Pilih 2 Background ({selectedBackdropIds.length}/2 Dipilih)
                    </span>
                  ) : (
                    <span className="text-[10.5px] bg-slate-100 text-slate-600 border border-slate-200 font-semibold px-2 py-0.5 rounded-full">
                      1 Background
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableBackdrops.map((backdrop) => {
                    const isSelected = selectedBackdropIds.includes(backdrop.id);
                    const selectionIndex = selectedBackdropIds.indexOf(backdrop.id);

                    return (
                      <button
                        key={backdrop.id}
                        type="button"
                        onClick={() => handleSelectBackdrop(backdrop.id)}
                        className={`min-h-[52px] p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer active:scale-98 relative ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/90 ring-2 ring-indigo-500/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-full border border-black/10 shrink-0 shadow-2xs flex items-center justify-center text-white text-[11px] font-black"
                          style={{ backgroundColor: backdrop.hex }}
                        >
                          {isSelected && maxBackdrops > 1 && (
                            <span className="bg-black/40 w-full h-full rounded-full flex items-center justify-center">
                              {selectionIndex + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs text-slate-900 truncate">{backdrop.name}</span>
                            {isSelected && maxBackdrops > 1 && (
                              <span className="text-[9px] font-black bg-indigo-600 text-white px-1.5 py-0.2 rounded-md">
                                Latar {selectionIndex + 1}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{backdrop.description}</div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Helper notice for 2 backdrops */}
                {maxBackdrops > 1 && (
                  <div className={`mt-2.5 p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                    selectedBackdropIds.length >= 2
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50/90 border-amber-200 text-amber-900'
                  }`}>
                    <span className="font-medium">
                      {selectedBackdropIds.length >= 2 ? (
                        <>✅ <strong>2 Latar Terpilih:</strong> {backdropDisplayName}</>
                      ) : (
                        <>💡 <strong>Baru 1 Latar Dipilih:</strong> {selectedBackdropObjects[0]?.name || '-'}. <em>Silakan klik 1 background lagi untuk latar ke-2 Anda!</em></>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Frame Grid selection (Hanya untuk Self Studio) */}
              {isSelfStudio && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      3. Pilih Template Layout Grid Cetak:
                    </label>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                      Khusus Self Studio
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FRAME_TEMPLATES.map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => setSelectedFrameId(frame.id)}
                        className={`min-h-[44px] p-3 rounded-2xl border text-left transition-all cursor-pointer active:scale-98 ${
                          selectedFrameId === frame.id
                            ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold ring-2 ring-purple-500/20'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-extrabold text-xs">{frame.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{frame.gridType}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Add-Ons & Promo */}
          {step === 2 && (() => {
            const packageCatInfo = getPackageCategoryInfo(currentPackage);
            const relevantAddOns = ADD_ONS.filter(addOn => {
              if (!addOn.applicableCategories) return true;
              return addOn.applicableCategories.includes(packageCatInfo.key);
            });

            return (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <h4 className="font-extrabold text-slate-900 text-sm">Pilih Biaya / Layanan Tambahan (Add-Ons):</h4>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                      {Object.values(selectedAddOns).reduce<number>((a, b) => a + (Number(b) || 0), 0)} Item Terpilih
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Daftar Add-Ons otomatis disesuaikan khusus untuk <strong className="text-slate-800 font-bold">{packageCatInfo.label}</strong>.
                  </p>

                  {/* Header Info Paket Terpilih */}
                  <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-2.5 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                          Kategori Paket:
                        </div>
                        <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {currentPackage.name}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold bg-indigo-600 text-white px-3 py-1 rounded-xl shrink-0 shadow-2xs">
                      {packageCatInfo.badge}
                    </span>
                  </div>

                  {/* Catatan Khusus Kategori (Jika ada) */}
                  {packageCatInfo.note && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-amber-900 text-xs font-semibold mb-3.5 flex items-start gap-2 animate-in fade-in">
                      <span className="text-sm shrink-0">💡</span>
                      <span className="leading-relaxed">{packageCatInfo.note}</span>
                    </div>
                  )}

                  {/* List Add-Ons Khusus Kategori yang Dipilih */}
                  {relevantAddOns.length === 0 ? (
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                      <p className="text-xs font-bold text-slate-600">Tidak ada Add-Ons tambahan khusus untuk paket ini.</p>
                      <p className="text-[11px] text-slate-400">Paket ini sudah include seluruh fasilitas utama.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {relevantAddOns.map(addOn => {
                        const qty = selectedAddOns[addOn.id] || 0;
                        return (
                          <div
                            key={addOn.id}
                            className={`p-3 sm:p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                              qty > 0
                                ? 'bg-indigo-50/50 border-indigo-400 ring-1 ring-indigo-300/40 shadow-xs'
                                : 'bg-white hover:border-slate-300 border-slate-200 shadow-2xs'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-xs sm:text-sm text-slate-900">{addOn.name}</span>
                              </div>
                              <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                                {addOn.description}
                              </div>
                              <div className="text-xs sm:text-sm mt-1 text-indigo-700 font-extrabold">
                                Rp {addOn.price.toLocaleString('id-ID')} <span className="text-[11px] text-slate-400 font-normal">/ {addOn.unit}</span>
                              </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-1.5 bg-slate-100/90 rounded-xl border border-slate-200 p-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleAddOnQtyChange(addOn.id, -1)}
                                disabled={qty === 0}
                                className="min-w-[32px] min-h-[32px] rounded-lg bg-white hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer active:scale-95 border border-slate-200 shadow-2xs"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center font-bold text-xs text-slate-800">{qty}</span>
                              <button
                                type="button"
                                onClick={() => handleAddOnQtyChange(addOn.id, 1)}
                                className="min-w-[32px] min-h-[32px] rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              {/* Promo Voucher Section */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  Gunakan Kode Promo Diskon:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan kode promo (STUDENT10, COUPLE15, ALVIERO)"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 min-h-[44px] p-2.5 rounded-xl border border-slate-300 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="min-h-[44px] px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 cursor-pointer active:scale-95"
                  >
                    Gunakan
                  </button>
                </div>
                {promoError && <p className="text-xs text-rose-500 font-medium">{promoError}</p>}
                {appliedPromo && (
                  <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Kode Promo '{appliedPromo.code}' berhasil terpasang!
                  </p>
                )}
              </div>
            </div>
          );
        })()}

          {/* STEP 3: Customer Info, Notes & Payment Options */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Ringkasan Jadwal & Cabang Terpilih */}
              <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                      Jadwal & Lokasi Foto:
                    </div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                      {bookingDate} • Jam {timeSlot} WIB
                    </div>
                    <div className="text-[10.5px] text-indigo-700 font-medium">
                      {currentBranchInfo.name} ({isSelfStudio ? 'Bilik Self Studio' : 'Studio Foto Pro'})
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs border border-indigo-200 shrink-0 transition-colors cursor-pointer"
                >
                  Ubah 🔄
                </button>
              </div>

              {/* Data Pemesan: Nama & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    Nama Pemesan:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Anisa Putri"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full min-h-[44px] p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    No. WhatsApp Aktif:
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full min-h-[44px] p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  />
                </div>
              </div>

              {/* Payment Option Switcher */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  Opsi Pembayaran Booking:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentOption('dp')}
                    className={`min-h-[52px] p-3 rounded-xl border text-left font-bold transition-all cursor-pointer active:scale-98 ${
                      paymentOption === 'dp' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs">Bayar DP 50% Sekarang</div>
                    <div className="text-[10px] font-normal text-slate-500 mt-0.5">
                      Transfer DP Rp {dpAmount.toLocaleString('id-ID')} untuk kunci jadwal
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentOption('full')}
                    className={`min-h-[52px] p-3 rounded-xl border text-left font-bold transition-all cursor-pointer active:scale-98 ${
                      paymentOption === 'full' ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs">Bayar Lunas / Full</div>
                    <div className="text-[10px] font-normal text-slate-500 mt-0.5">
                      Rp {grandTotal.toLocaleString('id-ID')} bebas ribet pas di studio
                    </div>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Catatan Khusus (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Misal: Perayaan ulang tahun / minta disiapkan properti topi wisuda"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[44px] p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                />
              </div>

              {/* Alert Konfirmasi Pembayaran Admin */}
              <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl flex items-start gap-2.5 shadow-2xs">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs mt-0.5">
                  💬
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-extrabold text-amber-950 leading-relaxed">
                    🔔 Segera kirimkan dan konfirmasikan bukti pembayaran kamu untuk mengunci jam booking yaaa!
                  </p>
                  <p className="text-[10.5px] text-amber-800 font-medium mt-0.5">
                    Slot jam baru akan berstatus <strong>"Penuh"</strong> setelah pembayaran diverifikasi oleh admin.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rincian Biaya Summary Box */}
          <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-300 border-b border-slate-800 pb-2">
              <span className="font-semibold">Rincian Reservasi:</span>
              <span className="text-amber-300 font-bold">{currentPackage.name}</span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Harga Paket Utama</span>
                <span>Rp {packagePrice.toLocaleString('id-ID')}</span>
              </div>
              
              {addOnsTotalPrice > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Total Add-ons</span>
                  <span>+ Rp {addOnsTotalPrice.toLocaleString('id-ID')}</span>
                </div>
              )}

              {slotCharge > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Charge Slot Khusus (20:45)</span>
                  <span>+ Rp {slotCharge.toLocaleString('id-ID')}</span>
                </div>
              )}

              {discountValue > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Diskon Promo ({appliedPromo?.code})</span>
                  <span>- Rp {discountValue.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>Total Estimasi Biaya</span>
                <span className="text-emerald-400">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>

              {paymentOption === 'dp' && (
                <div className="text-[11px] text-amber-300 pt-1 text-right">
                  Minimum Transfer DP 50%: <strong>Rp {dpAmount.toLocaleString('id-ID')}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleCopySummary}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedSummary ? 'Tersalin' : 'Salin Rincian'}</span>
          </button>

          <div className="flex items-center gap-2">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
              >
                Kembali
              </button>
            ) : (
              <button
                onClick={onClose}
                className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer active:scale-95"
              >
                Batal
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
              >
                Lanjut
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSendBookingWA}
                className="min-h-[44px] px-5 py-3 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-200" />
                <span>Kirim Booking WA</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
