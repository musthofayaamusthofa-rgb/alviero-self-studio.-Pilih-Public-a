import React, { useState, useEffect } from 'react';
import { PACKAGES, CATEGORIES, BACKDROPS, FRAME_TEMPLATES, ADD_ONS, TIME_SLOTS, PRO_STUDIO_TIME_SLOTS, SELF_STUDIO_TIME_SLOTS, STUDIO_BRANCHES } from '../data/pricelistData';
import { BookingFormData, StudioBranch, BackdropOption } from '../types';
import { X, Calendar, Clock, User, Phone, CheckCircle2, Sparkles, MessageCircle, QrCode, CreditCard, ChevronRight, Calculator, Plus, Minus, Tag, Copy, Check, Camera, Image as ImageIcon, MapPin, Building2, Layers, Sliders, CheckSquare } from 'lucide-react';

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
    return { key: 'grad-outdoor', label: 'Wisuda Outdoor', badge: 'Wisuda Outdoor', note: '' };
  }
  if (id.includes('grad') || id.includes('wisuda') || cat === 'graduation') {
    return { key: 'grad-indoor', label: 'Wisuda Indoor', badge: 'Wisuda Indoor', note: '' };
  }
  if (id.includes('passfoto') || cat === 'pass-foto' || cat === 'passfoto') {
    return { key: 'pass-foto', label: 'Pass Foto', badge: 'Pass Foto', note: '' };
  }
  if (id.includes('self-') || id.includes('selfstudio') || cat === 'self-studio' || cat === 'selfstudio') {
    return { key: 'self-studio', label: 'Self Studio', badge: 'Self Studio', note: '' };
  }
  if (cat === 'group' || id.includes('group')) {
    return { key: 'group', label: 'Paket Group', badge: 'Group Studio', note: '' };
  }
  if (cat === 'family' || id.includes('family')) {
    return { key: 'family', label: 'Paket Family', badge: 'Family Studio', note: 'Khusus paket Family, tersedia diskon potongan Rp 50.000 jika sesi hanya beranggotakan 3 orang keluarga.' };
  }
  if (cat === 'birthday' || id.includes('birthday')) {
    return { key: 'birthday', label: 'Paket Birthday', badge: 'Birthday Studio', note: 'Bisa request konsep / tema ulang tahun custom (silakan konfirmasi konsep ke admin WhatsApp).' };
  }
  if (cat === 'maternity' || id.includes('maternity')) {
    return { key: 'maternity', label: 'Paket Maternity', badge: 'Maternity Studio', note: '' };
  }
  if (cat === 'personal' || id.includes('personal')) {
    return { key: 'personal', label: 'Paket Personal', badge: 'Personal Studio', note: '' };
  }
  if (cat === 'couple' || id.includes('couple')) {
    return { key: 'couple', label: 'Paket Couple', badge: 'Couple Studio', note: '' };
  }
  if (cat === 'prewedding' || id.includes('prewed')) {
    return { key: 'prewedding', label: 'Paket Prewedding', badge: 'Prewedding Suite', note: '' };
  }
  if (cat === 'undangan' || id.includes('undangan')) {
    return { key: 'undangan', label: 'Paket Undangan', badge: 'Undangan Digital', note: '' };
  }
  if (cat === 'sewa-studio' || id.includes('sewa')) {
    return { key: 'sewa-studio', label: 'Paket Sewa Studio', badge: 'Sewa Studio', note: '' };
  }
  return { key: cat, label: pkg.name, badge: 'Studio Foto', note: '' };
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

export const isConflictingBackdrop = (idA: string, idB: string): boolean => {
  if (!idA || !idB || idA === idB) return false;
  const a = idA.toLowerCase();
  const b = idB.toLowerCase();
  
  const isLimboA = a.includes('limbo');
  const isPutihTengahA = a.includes('putih-tengah') || a.includes('putih_tengah');
  const isLimboB = b.includes('limbo');
  const isPutihTengahB = b.includes('putih-tengah') || b.includes('putih_tengah');
  
  return (isLimboA && isPutihTengahB) || (isPutihTengahA && isLimboB);
};

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
  
  // Real-time Slot & Backdrop Availability from Google Sheets
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [slotBackdrops, setSlotBackdrops] = useState<{ [slot: string]: string[] }>({});
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

  // Fetch Slot Terisi & Backdrop Terpakai dari Google Sheets secara Real-Time
  useEffect(() => {
    if (!isOpen || !bookingDate) return;

    let isMounted = true;
    setIsLoadingSlots(true);

    const typeKey = isSelfStudio ? 'selfstudio' : 'studio_foto';

    fetch(`${GOOGLE_SHEETS_SCRIPT_URL}?action=check_slots&date=${encodeURIComponent(bookingDate)}&studio_type=${encodeURIComponent(typeKey)}&branch=${encodeURIComponent(selectedBranch)}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data) {
          if (Array.isArray(data.bookedSlots)) {
            const normalized = data.bookedSlots.map(normalizeSlotTime).filter(Boolean);
            setBookedSlots(normalized);
          }
          if (data.slotBackdrops && typeof data.slotBackdrops === 'object') {
            const normalizedSlotBackdrops: { [s: string]: string[] } = {};
            Object.entries(data.slotBackdrops).forEach(([slotRaw, bds]) => {
              const sNorm = normalizeSlotTime(slotRaw);
              if (sNorm && Array.isArray(bds)) {
                normalizedSlotBackdrops[sNorm] = (bds as string[]).map(b => String(b).trim());
              }
            });
            setSlotBackdrops(normalizedSlotBackdrops);
          }
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
    (b.applicableBranches || ['cabang-1']).includes((selectedBranch as StudioBranch) || 'cabang-1') &&
    b.applicableTo?.includes(isSelfStudio ? 'self-studio' : 'pro-studio')
  );

  // Cek ketersediaan backdrop spesifik berdasarkan slot jam yang dipilih & konflik panggung
  const getBackdropAvailability = (backdropId: string): { isAvailable: boolean; reason?: string } => {
    const bdObj = BACKDROPS.find(b => b.id === backdropId);
    if (!bdObj) return { isAvailable: true };

    const normTime = normalizeSlotTime(timeSlot);
    const bookedForSlot = (slotBackdrops[normTime] || []).map(b => b.toLowerCase());
    const bdNameLower = bdObj.name.toLowerCase();
    const bdIdLower = bdObj.id.toLowerCase();

    // 1. Cek apakah backdrop ini sudah dibooking oleh client lain di jam ini
    const isDirectlyBooked = bookedForSlot.some(b => b.includes(bdNameLower) || bdNameLower.includes(b) || b.includes(bdIdLower));
    if (isDirectlyBooked) {
      return { isAvailable: false, reason: `Sudah terpakai di jam ${normTime} WIB` };
    }

    // 2. Cek konflik panggung: Limbo vs Putih Tengah pada slot booking dari orang lain
    if (bdIdLower.includes('limbo')) {
      const hasPutihTengahBooked = bookedForSlot.some(b => b.includes('putih tengah') || b.includes('putih-tengah'));
      if (hasPutihTengahBooked) {
        return { isAvailable: false, reason: `Area panggung sama dengan Putih Tengah (terpakai di jam ${normTime} WIB)` };
      }
    } else if (bdIdLower.includes('putih-tengah') || bdIdLower.includes('putih_tengah')) {
      const hasLimboBooked = bookedForSlot.some(b => b.includes('limbo'));
      if (hasLimboBooked) {
        return { isAvailable: false, reason: `Area panggung sama dengan Limbo (terpakai di jam ${normTime} WIB)` };
      }
    }

    // 3. Cek konflik panggung dalam 1 sesi jika client memilih 2 backdrop
    if (maxBackdrops > 1 && selectedBackdropIds.length > 0) {
      const conflictingSelected = selectedBackdropIds.find(selId => selId !== backdropId && isConflictingBackdrop(selId, backdropId));
      if (conflictingSelected) {
        const otherBd = BACKDROPS.find(b => b.id === conflictingSelected);
        return { isAvailable: false, reason: `Tidak bisa digabung dengan ${otherBd?.name || 'Latar Terpilih'} (area panggung sama)` };
      }
    }

    return { isAvailable: true };
  };

  useEffect(() => {
    // Reset selected backdrop if it's not available in current category, branch, or time slot
    const validIds = selectedBackdropIds.filter(id => {
      const isApplicable = availableBackdrops.some(b => b.id === id);
      const avail = getBackdropAvailability(id);
      return isApplicable && avail.isAvailable;
    });

    if (validIds.length === 0 && availableBackdrops.length > 0) {
      // Cari backdrop pertama yang benar-benar available
      const firstAvail = availableBackdrops.find(b => getBackdropAvailability(b.id).isAvailable) || availableBackdrops[0];
      setSelectedBackdropIds([firstAvail.id]);
    } else if (maxBackdrops === 1 && validIds.length > 1) {
      setSelectedBackdropIds([validIds[0]]);
    } else if (validIds.length !== selectedBackdropIds.length && validIds.length > 0) {
      setSelectedBackdropIds(validIds);
    }
  }, [selectedPackageId, selectedBranch, timeSlot, isSelfStudio, availableBackdrops, maxBackdrops, slotBackdrops]);

  const handleSelectBackdrop = (id: string) => {
    const avail = getBackdropAvailability(id);
    if (!avail.isAvailable) {
      alert(`Mohon maaf, background ${BACKDROPS.find(b => b.id === id)?.name || ''} ${avail.reason}.`);
      return;
    }

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
          // Pastikan tidak konflik dengan backdrop ke-1
          if (selectedBackdropIds.length === 1 && isConflictingBackdrop(selectedBackdropIds[0], id)) {
            alert(`Latar ${BACKDROPS.find(b => b.id === id)?.name} dan ${BACKDROPS.find(b => b.id === selectedBackdropIds[0])?.name} berada di area panggung yang sama sehingga tidak bisa dipilih bersamaan dalam 1 sesi.`);
            return;
          }
          setSelectedBackdropIds([...selectedBackdropIds, id]);
        } else {
          // Replace 2nd backdrop jika tidak konflik dengan yang pertama
          if (isConflictingBackdrop(selectedBackdropIds[0], id)) {
            alert(`Latar ${BACKDROPS.find(b => b.id === id)?.name} tidak bisa digabung dengan ${BACKDROPS.find(b => b.id === selectedBackdropIds[0])?.name} (area panggung sama).`);
            return;
          }
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
    message += `• *Lokasi Studio:* *${currentBranchInfo.name}*\n\n`;

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] max-w-3xl w-full border-x-0 sm:border sm:border-[#D5CEC2] shadow-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[94vh] my-auto relative text-left">
        
        {/* Modal Header (Sleek Charcoal & Gold Luxury) */}
        <div className="bg-[#1C1A17] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-[#332F2A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2D2A26] border border-[#4A453E] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-xs">
              <Calculator className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base md:text-lg text-white uppercase tracking-wider leading-tight">
                KALKULATOR & RESERVASI JADWAL
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-400 font-sans tracking-wide">
                Alviero Studio Foto • Konfirmasi Cepat & Otomatis via WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 bg-[#2D2A26] hover:bg-[#3D3832] text-stone-300 hover:text-white flex items-center justify-center border border-[#4A453E] transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5 stroke-[2]" />
          </button>
        </div>

        {/* Step Navigation Bar (Sharp Architectural Breadcrumb) */}
        <div className="bg-white border-b border-[#E0D9CE] px-3 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between text-xs font-serif uppercase tracking-wider overflow-x-auto shrink-0">
          <div className="flex items-center gap-2 w-full justify-between sm:justify-start">
            <button
              onClick={() => setStep(1)}
              className={`px-3.5 py-1.5 flex items-center gap-2 shrink-0 cursor-pointer transition-all border ${
                step === 1 
                  ? 'bg-[#1C1A17] text-white border-[#1C1A17] shadow-xs font-bold' 
                  : 'bg-white text-stone-600 border-[#E0D9CE] hover:border-[#1C1A17]'
              }`}
            >
              <span className={`text-[11px] font-bold ${step === 1 ? 'text-[#D4AF37]' : 'text-stone-500'}`}>1.</span>
              <span>Paket & Jadwal</span>
            </button>
            
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            
            <button
              onClick={() => setStep(2)}
              className={`px-3.5 py-1.5 flex items-center gap-2 shrink-0 cursor-pointer transition-all border ${
                step === 2 
                  ? 'bg-[#1C1A17] text-white border-[#1C1A17] shadow-xs font-bold' 
                  : 'bg-white text-stone-600 border-[#E0D9CE] hover:border-[#1C1A17]'
              }`}
            >
              <span className={`text-[11px] font-bold ${step === 2 ? 'text-[#D4AF37]' : 'text-stone-500'}`}>2.</span>
              <span>Add-Ons & Diskon</span>
            </button>
            
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            
            <button
              onClick={() => setStep(3)}
              className={`px-3.5 py-1.5 flex items-center gap-2 shrink-0 cursor-pointer transition-all border ${
                step === 3 
                  ? 'bg-[#1C1A17] text-white border-[#1C1A17] shadow-xs font-bold' 
                  : 'bg-white text-stone-600 border-[#E0D9CE] hover:border-[#1C1A17]'
              }`}
            >
              <span className={`text-[11px] font-bold ${step === 3 ? 'text-[#D4AF37]' : 'text-stone-500'}`}>3.</span>
              <span>Data & Pembayaran</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1 bg-[#FAF8F5]">
          
          {/* STEP 1: Select Package, Date, Time & Concepts */}
          {step === 1 && (
            <div className="space-y-5">
              
              {/* Branch Selector in Step 1 */}
              <div className="bg-white border border-[#E0D9CE] p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center shrink-0">
                    <MapPin className="w-4.5 h-4.5 text-[#8C6D46] stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9.5px] font-serif font-bold text-stone-500 uppercase tracking-widest">LOKASI STUDIO:</div>
                    <div className="text-xs sm:text-sm font-serif font-bold text-[#1C1A17] truncate">{currentBranchInfo.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {STUDIO_BRANCHES.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        if (onSelectBranch) onSelectBranch(b.id);
                      }}
                      className={`px-3.5 py-1.5 text-[11px] font-serif font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                        selectedBranch === b.id
                          ? 'bg-[#1C1A17] text-white border-[#1C1A17] shadow-xs'
                          : 'bg-[#FAF8F5] text-stone-700 border-[#D5CEC2] hover:border-[#1C1A17]'
                      }`}
                    >
                      {b.shortName.replace('Alviero Studio — ', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Pilih Paket Foto */}
              <div>
                <label className="block text-xs font-serif font-bold text-[#1C1A17] uppercase tracking-wider mb-2">
                  1. PILIH PAKET FOTO UTAMA:
                </label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  className="w-full min-h-[44px] p-3 border border-[#D5CEC2] text-xs font-semibold text-[#1C1A17] bg-white focus:outline-none focus:border-[#1C1A17] transition-colors"
                >
                  {PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — Rp {pkg.price.toLocaleString('id-ID')} ({pkg.durationMinutes} Min)
                    </option>
                  ))}
                </select>
              </div>

              {/* Package Summary Card */}
              <div className="bg-white border border-[#E0D9CE] p-4 space-y-2.5">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-[#1C1A17] text-sm sm:text-base uppercase tracking-wide">{currentPackage.name}</h4>
                    <p className="text-xs font-sans text-stone-600 mt-0.5 leading-relaxed">{currentPackage.description}</p>
                  </div>
                  <span className="font-serif font-bold text-[#1C1A17] text-base sm:text-lg shrink-0">
                    Rp {currentPackage.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-[11px] text-stone-700 pt-2 border-t border-[#EFEAE2] flex items-center gap-2 flex-wrap">
                  <span className="bg-[#FAF8F5] px-3 py-1 border border-[#E0D9CE] font-sans font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8C6D46]" />
                    {currentPackage.durationMinutes} Menit Sesi
                  </span>
                  <span className="bg-[#FAF8F5] px-3 py-1 border border-[#E0D9CE] font-sans font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8C6D46]" />
                    {currentPackage.includedPeople} Peserta
                  </span>
                  <span className="bg-[#FAF8F5] px-3 py-1 border border-[#E0D9CE] font-sans font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#8C6D46]" />
                    {currentPackage.includedPrints}
                  </span>
                </div>
              </div>

              {/* 2. PILIH TANGGAL & JAM SLOT FOTO */}
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="text-xs font-serif font-bold text-[#1C1A17] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8C6D46]" />
                    2. PILIH TANGGAL & WAKTU SESI FOTO:
                  </label>
                  <span className="text-[11px] font-sans font-bold text-[#1C1A17] bg-white px-3 py-1 border border-[#E0D9CE]">
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
                    className="w-full min-h-[44px] p-2.5 border border-[#D5CEC2] text-xs text-[#1C1A17] font-semibold focus:outline-none focus:border-[#1C1A17] bg-white"
                  />
                </div>

                {/* Room & Studio Type Identifier Banner */}
                {isSelfStudio ? (
                  <div className="p-3.5 bg-white border border-[#E0D9CE] flex items-center gap-3 text-xs font-sans">
                    <div className="w-9 h-9 bg-[#FAF8F5] border border-[#E0D9CE] text-[#8C6D46] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-serif font-bold text-[#1C1A17] uppercase tracking-wider flex items-center gap-2">
                        JADWAL KHUSUS: BILIK SELF STUDIO MANDIRI
                        <span className="text-[9px] bg-[#FAF8F5] text-stone-700 border border-[#E0D9CE] px-2 py-0.5 font-bold">100% PRIVATE</span>
                      </p>
                      <p className="text-[11px] text-stone-600 mt-0.5">Sesi foto private dengan shutter remote wireless. Jadwal terpisah & tidak bertabrakan dengan Studio Foto.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-white border border-[#E0D9CE] flex items-center gap-3 text-xs font-sans">
                    <div className="w-9 h-9 bg-[#FAF8F5] border border-[#E0D9CE] text-[#8C6D46] flex items-center justify-center shrink-0">
                      <Camera className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-serif font-bold text-[#1C1A17] uppercase tracking-wider flex items-center gap-2">
                        JADWAL KHUSUS: STUDIO FOTO PROFESIONAL
                        <span className="text-[9px] bg-[#FAF8F5] text-stone-700 border border-[#E0D9CE] px-2 py-0.5 font-bold">FOTOGRAFER PRO</span>
                      </p>
                      <p className="text-[11px] text-stone-600 mt-0.5">Sesi dipandu & diarahkan langsung oleh tim fotografer profesional di panggung studio.</p>
                    </div>
                  </div>
                )}

                {/* Time Slots Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-serif font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8C6D46]" />
                      PILIH JAM SLOT {isSelfStudio ? 'SELF STUDIO' : 'STUDIO FOTO'} ({activeTimeSlots.length} PILIHAN):
                    </label>
                    <span className="text-[10.5px] font-sans font-bold text-[#1C1A17] bg-white px-2.5 py-0.5 border border-[#E0D9CE]">
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
                          className={`min-h-[46px] p-2 text-xs font-mono font-bold transition-all text-center flex flex-col items-center justify-center border ${
                            isBooked
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60 line-through'
                              : isSelected
                              ? 'bg-[#1C1A17] text-white border-[#1C1A17] shadow-xs cursor-pointer active:scale-95'
                              : isChargeSlot
                              ? 'bg-[#FFFDF7] hover:bg-[#FAF5EE] text-[#6E4E18] border-[#E8DCC4] cursor-pointer active:scale-95'
                              : 'bg-white hover:bg-[#FAF8F5] text-stone-800 border-[#E0D9CE] cursor-pointer active:scale-95'
                          }`}
                        >
                          <span className="leading-tight">{slot}</span>
                          {isBooked ? (
                            <span className="text-[8.5px] font-bold text-rose-500 uppercase mt-0.5 no-underline">
                              Penuh
                            </span>
                          ) : isChargeSlot ? (
                            <span
                              className={`text-[8.5px] font-extrabold uppercase mt-0.5 px-1 py-0.2 ${
                                isSelected ? 'bg-[#D4AF37] text-black font-bold' : 'bg-[#E8DCC4] text-[#6E4E18]'
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
                    <div className="mt-2.5 p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-sans flex items-center gap-2">
                      <span className="font-bold text-sm shrink-0">⚡</span>
                      <span>
                        Slot jam <strong className="font-bold">20:45 WIB</strong> adalah slot malam mendekati jam tutup studio dan dikenakan biaya operasional tambahan <strong className="font-bold">Rp 25.000</strong>.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Backdrop selection */}
              <div className="pt-2 border-t border-[#E0D9CE]">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5">
                  <label className="text-xs font-serif font-bold text-[#1C1A17] uppercase tracking-wider">
                    3. {maxBackdrops > 1 ? 'PILIH 2 LATAR BELAKANG / PENCAHAYAAN (BACKDROP):' : 'PILIH PENCAHAYAAN / LATAR BELAKANG (BACKDROP):'}
                  </label>
                  {maxBackdrops > 1 ? (
                    <span className="text-[10.5px] bg-[#FAF8F5] text-stone-800 border border-[#E0D9CE] font-bold px-2.5 py-0.5">
                      Bebas Pilih 2 Background ({selectedBackdropIds.length}/2 Dipilih)
                    </span>
                  ) : (
                    <span className="text-[10.5px] bg-white text-stone-600 border border-[#E0D9CE] font-medium px-2.5 py-0.5">
                      1 Background
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableBackdrops.map((backdrop) => {
                    const isSelected = selectedBackdropIds.includes(backdrop.id);
                    const selectionIndex = selectedBackdropIds.indexOf(backdrop.id);
                    const availability = getBackdropAvailability(backdrop.id);
                    const isAvailable = availability.isAvailable;

                    return (
                      <button
                        key={backdrop.id}
                        type="button"
                        disabled={!isAvailable && !isSelected}
                        onClick={() => handleSelectBackdrop(backdrop.id)}
                        className={`min-h-[56px] p-3 border text-left flex items-center gap-3 transition-all relative ${
                          !isAvailable && !isSelected
                            ? 'border-stone-200 bg-stone-100/70 text-stone-400 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#1C1A17] bg-white ring-1 ring-[#1C1A17] shadow-xs cursor-pointer active:scale-98'
                            : 'border-[#E0D9CE] bg-white hover:bg-[#FAF8F5] cursor-pointer active:scale-98'
                        }`}
                      >
                        <div
                          className="w-7 h-7 border border-black/15 shrink-0 flex items-center justify-center text-white text-[11px] font-bold"
                          style={{ backgroundColor: backdrop.hex }}
                        >
                          {isSelected && maxBackdrops > 1 && (
                            <span className="bg-black/50 w-full h-full flex items-center justify-center font-bold">
                              {selectionIndex + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`font-serif font-bold text-xs truncate ${!isAvailable && !isSelected ? 'text-stone-400 line-through' : 'text-[#1C1A17]'}`}>
                              {backdrop.name}
                            </span>
                            {isSelected && maxBackdrops > 1 && (
                              <span className="text-[9px] font-bold bg-[#1C1A17] text-white px-2 py-0.2">
                                Latar {selectionIndex + 1}
                              </span>
                            )}
                            {!isAvailable && !isSelected && (
                              <span className="text-[8.5px] font-bold bg-rose-100 text-rose-700 px-2 py-0.2 border border-rose-200">
                                Tidak Tersedia
                              </span>
                            )}
                          </div>
                          <div className="text-[10.5px] text-stone-500 truncate mt-0.5">
                            {!isAvailable && !isSelected ? (
                              <span className="text-rose-600 font-medium">{availability.reason}</span>
                            ) : (
                              backdrop.description
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 bg-[#1C1A17] text-white flex items-center justify-center shrink-0 text-xs shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Rule hint for Limbo vs Putih Tengah */}
                {availableBackdrops.some(b => b.id.includes('limbo')) && availableBackdrops.some(b => b.id.includes('putih-tengah')) && (
                  <div className="mt-2.5 p-3 bg-white border border-[#E0D9CE] text-stone-600 text-[11px] font-sans flex items-center gap-2">
                    <span className="font-bold text-[#8C6D46]">ℹ️</span>
                    <span>
                      <strong>Catatan Latar Studio:</strong> Backdrop <em>Limbo</em> dan <em>Putih Tengah</em> berbagi area panggung yang sama, sehingga tidak dapat digunakan bersamaan pada jam yang sama atau dalam 1 sesi foto.
                    </span>
                  </div>
                )}

                {/* Helper notice for 2 backdrops */}
                {maxBackdrops > 1 && (
                  <div className={`mt-2.5 p-3 border text-xs font-sans flex items-center justify-between gap-2 transition-all ${
                    selectedBackdropIds.length >= 2
                      ? 'bg-white border-[#1C1A17] text-[#1C1A17]'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    <span className="font-medium">
                      {selectedBackdropIds.length >= 2 ? (
                        <>✓ <strong>2 Latar Terpilih:</strong> {backdropDisplayName}</>
                      ) : (
                        <>ℹ️ <strong>Baru 1 Latar Dipilih:</strong> {selectedBackdropObjects[0]?.name || '-'}. <em>Silakan klik 1 background lagi untuk latar ke-2 Anda!</em></>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Frame Grid selection (Hanya untuk Self Studio) */}
              {isSelfStudio && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-serif font-bold text-[#1C1A17] uppercase tracking-wider">
                      4. PILIH TEMPLATE LAYOUT GRID CETAK:
                    </label>
                    <span className="text-[10px] bg-white text-stone-700 font-bold px-2 py-0.5 border border-[#E0D9CE]">
                      Khusus Self Studio
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FRAME_TEMPLATES.map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => setSelectedFrameId(frame.id)}
                        className={`min-h-[46px] p-3 border text-left transition-all cursor-pointer active:scale-98 ${
                          selectedFrameId === frame.id
                            ? 'border-[#1C1A17] bg-white text-[#1C1A17] font-bold ring-1 ring-[#1C1A17] shadow-xs'
                            : 'border-[#E0D9CE] bg-white hover:bg-[#FAF8F5] text-stone-700'
                        }`}
                      >
                        <div className="font-serif font-bold text-xs uppercase">{frame.name}</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">{frame.gridType}</div>
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
                    <h4 className="font-serif font-bold text-[#1C1A17] text-sm sm:text-base uppercase tracking-wide">
                      PILIH LAYANAN TAMBAHAN (ADD-ONS):
                    </h4>
                    <span className="text-[10.5px] bg-white text-stone-800 font-bold px-2.5 py-0.5 border border-[#E0D9CE]">
                      {Object.values(selectedAddOns).reduce<number>((a, b) => a + (Number(b) || 0), 0)} Item Terpilih
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-3">
                    Daftar Add-Ons otomatis disesuaikan khusus untuk <strong className="text-stone-800 font-bold">{packageCatInfo.label}</strong>.
                  </p>

                  {/* Header Info Paket Terpilih */}
                  <div className="bg-white border border-[#E0D9CE] p-3.5 flex items-center justify-between gap-2.5 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-[#FAF8F5] border border-[#E0D9CE] text-[#8C6D46] flex items-center justify-center shrink-0">
                        <Sparkles className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9.5px] font-serif font-bold text-stone-500 uppercase tracking-widest">
                          KATEGORI PAKET:
                        </div>
                        <div className="text-xs sm:text-sm font-serif font-bold text-[#1C1A17] truncate">
                          {currentPackage.name}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-serif font-bold uppercase bg-[#1C1A17] text-white px-3 py-1 shrink-0">
                      {packageCatInfo.badge}
                    </span>
                  </div>

                  {/* Catatan Khusus Kategori (Jika ada) */}
                  {packageCatInfo.note && (
                    <div className="bg-amber-50 border border-amber-300 p-3 text-amber-900 text-xs font-sans mb-3.5 flex items-start gap-2">
                      <span className="font-bold text-sm shrink-0">ℹ️</span>
                      <span className="leading-relaxed">{packageCatInfo.note}</span>
                    </div>
                  )}

                  {/* List Add-Ons Khusus Kategori yang Dipilih */}
                  {relevantAddOns.length === 0 ? (
                    <div className="p-6 bg-white border border-[#E0D9CE] text-center space-y-1">
                      <p className="text-xs font-bold text-stone-600">Tidak ada Add-Ons tambahan khusus untuk paket ini.</p>
                      <p className="text-[11px] text-stone-400">Paket ini sudah include seluruh fasilitas utama.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {relevantAddOns.map(addOn => {
                        const qty = selectedAddOns[addOn.id] || 0;
                        return (
                          <div
                            key={addOn.id}
                            className={`p-3.5 border transition-all flex items-center justify-between gap-3 ${
                              qty > 0
                                ? 'bg-white border-[#1C1A17] ring-1 ring-[#1C1A17] shadow-xs'
                                : 'bg-white hover:border-stone-400 border-[#E0D9CE]'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-serif font-bold text-xs sm:text-sm text-[#1C1A17]">{addOn.name}</span>
                              </div>
                              <div className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-snug">
                                {addOn.description}
                              </div>
                              <div className="text-xs sm:text-sm mt-1 text-[#8C6D46] font-bold">
                                Rp {addOn.price.toLocaleString('id-ID')} <span className="text-[11px] text-stone-400 font-normal">/ {addOn.unit}</span>
                              </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E0D9CE] p-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleAddOnQtyChange(addOn.id, -1)}
                                disabled={qty === 0}
                                className="w-8 h-8 bg-white hover:bg-stone-100 disabled:opacity-30 text-stone-700 font-bold text-xs flex items-center justify-center border border-[#D5CEC2] cursor-pointer active:scale-95"
                              >
                                <Minus className="w-3.5 h-3.5 stroke-[2]" />
                              </button>
                              <span className="w-6 text-center font-mono font-bold text-xs text-[#1C1A17]">{qty}</span>
                              <button
                                type="button"
                                onClick={() => handleAddOnQtyChange(addOn.id, 1)}
                                className="w-8 h-8 bg-[#1C1A17] hover:bg-[#2D2A26] text-white font-bold text-xs flex items-center justify-center border border-[#1C1A17] cursor-pointer active:scale-95 shadow-xs"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2]" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Promo Voucher Section */}
                <div className="pt-2 border-t border-[#E0D9CE] space-y-2">
                  <label className="text-xs font-serif font-bold text-[#1C1A17] uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#8C6D46]" />
                    GUNAKAN KODE PROMO DISKON:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: STUDENT10, COUPLE15, ALVIERO"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="flex-1 min-h-[44px] p-2.5 border border-[#D5CEC2] text-xs font-bold uppercase focus:outline-none focus:border-[#1C1A17] bg-white"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="min-h-[44px] px-6 py-2.5 bg-[#1C1A17] hover:bg-[#2D2A26] text-white font-serif font-bold text-xs uppercase tracking-wider border border-[#1C1A17] cursor-pointer active:scale-95"
                    >
                      Gunakan
                    </button>
                  </div>
                  {promoError && <p className="text-xs text-rose-600 font-medium">{promoError}</p>}
                  {appliedPromo && (
                    <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
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
              <div className="bg-white border border-[#E0D9CE] p-4 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-[#FAF8F5] border border-[#E0D9CE] text-[#8C6D46] flex items-center justify-center shrink-0">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9.5px] font-serif font-bold text-stone-500 uppercase tracking-widest">
                      JADWAL & LOKASI FOTO:
                    </div>
                    <div className="text-xs sm:text-sm font-serif font-bold text-[#1C1A17] truncate">
                      {bookingDate} • Jam {timeSlot} WIB
                    </div>
                    <div className="text-[11px] text-stone-600 font-medium">
                      {currentBranchInfo.name} ({isSelfStudio ? 'Bilik Self Studio' : 'Studio Foto Pro'})
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3.5 py-1.5 bg-[#FAF8F5] hover:bg-white text-stone-800 font-serif font-bold text-[11px] uppercase tracking-wider border border-[#D5CEC2] hover:border-[#1C1A17] shrink-0 transition-colors cursor-pointer"
                >
                  Ubah
                </button>
              </div>

              {/* Data Pemesan: Nama & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-serif font-bold text-[#1C1A17] uppercase mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8C6D46]" />
                    Nama Pemesan:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Anisa Putri"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full min-h-[44px] p-3 border border-[#D5CEC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-[#1C1A17] uppercase mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8C6D46]" />
                    No. WhatsApp Aktif:
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full min-h-[44px] p-3 border border-[#D5CEC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17] bg-white"
                  />
                </div>
              </div>

              {/* Payment Option Switcher */}
              <div className="pt-2 border-t border-[#E0D9CE] space-y-2">
                <label className="text-xs font-serif font-bold text-[#1C1A17] uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#8C6D46]" />
                  OPSI PEMBAYARAN BOOKING:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentOption('dp')}
                    className={`min-h-[56px] p-3.5 border text-left font-sans transition-all cursor-pointer active:scale-98 ${
                      paymentOption === 'dp' 
                        ? 'border-[#1C1A17] bg-white ring-1 ring-[#1C1A17] shadow-xs' 
                        : 'border-[#E0D9CE] bg-white text-stone-700 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="font-serif font-bold text-xs uppercase text-[#1C1A17]">Bayar DP 50% Sekarang</div>
                    <div className="text-[10.5px] font-normal text-stone-500 mt-0.5">
                      Transfer DP Rp {dpAmount.toLocaleString('id-ID')} untuk kunci jadwal
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentOption('full')}
                    className={`min-h-[56px] p-3.5 border text-left font-sans transition-all cursor-pointer active:scale-98 ${
                      paymentOption === 'full' 
                        ? 'border-[#1C1A17] bg-white ring-1 ring-[#1C1A17] shadow-xs' 
                        : 'border-[#E0D9CE] bg-white text-stone-700 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="font-serif font-bold text-xs uppercase text-[#1C1A17]">Bayar Lunas / Full</div>
                    <div className="text-[10.5px] font-normal text-stone-500 mt-0.5">
                      Rp {grandTotal.toLocaleString('id-ID')} praktis tanpa sisa di studio
                    </div>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-serif font-bold text-[#1C1A17] uppercase mb-1.5">
                  Catatan Khusus (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Misal: Perayaan ulang tahun / minta disiapkan properti toga wisuda"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[44px] p-3 border border-[#D5CEC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17] bg-white"
                />
              </div>

              {/* Alert Konfirmasi Pembayaran Admin */}
              <div className="p-3.5 bg-white border border-[#E0D9CE] flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FAF8F5] border border-[#E0D9CE] text-[#8C6D46] flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs font-sans">
                  <p className="font-bold text-[#1C1A17] leading-relaxed">
                    Segera kirimkan dan konfirmasikan bukti pembayaran kamu untuk mengunci jam booking!
                  </p>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Slot jam baru akan berstatus <strong>"Penuh"</strong> setelah pembayaran diverifikasi oleh admin.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rincian Biaya Summary Box */}
          <div className="bg-[#1C1A17] text-white p-4 sm:p-5 border border-[#332F2A] space-y-3">
            <div className="flex justify-between items-center text-xs text-stone-300 border-b border-[#332F2A] pb-2">
              <span className="font-serif uppercase tracking-wider text-stone-400">RINCIAN RESERVASI:</span>
              <span className="text-[#D4AF37] font-serif font-bold uppercase">{currentPackage.name}</span>
            </div>

            <div className="space-y-1.5 text-xs font-sans">
              <div className="flex justify-between text-stone-300">
                <span>Harga Paket Utama</span>
                <span>Rp {packagePrice.toLocaleString('id-ID')}</span>
              </div>
              
              {addOnsTotalPrice > 0 && (
                <div className="flex justify-between text-stone-300">
                  <span>Total Add-ons Tambahan</span>
                  <span>+ Rp {addOnsTotalPrice.toLocaleString('id-ID')}</span>
                </div>
              )}

              {slotCharge > 0 && (
                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>Charge Slot Malam Khusus (20:45)</span>
                  <span>+ Rp {slotCharge.toLocaleString('id-ID')}</span>
                </div>
              )}

              {discountValue > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Diskon Promo ({appliedPromo?.code})</span>
                  <span>- Rp {discountValue.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-serif font-bold text-white pt-2.5 border-t border-[#332F2A]">
                <span className="uppercase tracking-wider">TOTAL ESTIMASI BIAYA</span>
                <span className="text-[#D4AF37]">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>

              {paymentOption === 'dp' && (
                <div className="text-[11px] text-[#D4AF37] pt-1 text-right font-sans">
                  Minimum Transfer DP 50%: <strong>Rp {dpAmount.toLocaleString('id-ID')}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E0D9CE] flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleCopySummary}
            className="min-h-[44px] px-4 py-2 text-xs font-serif uppercase tracking-wider bg-white text-stone-800 border border-[#D5CEC2] hover:bg-[#FAF8F5] transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
          >
            {copiedSummary ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedSummary ? 'Tersalin' : 'Salin Rincian'}</span>
          </button>

          <div className="flex items-center gap-2">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="min-h-[44px] px-5 py-2 text-xs font-serif uppercase tracking-wider bg-white text-stone-800 border border-[#D5CEC2] hover:bg-[#FAF8F5] transition-colors cursor-pointer active:scale-95"
              >
                Kembali
              </button>
            ) : (
              <button
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 text-xs font-serif uppercase tracking-wider text-stone-500 hover:text-stone-800 transition-colors cursor-pointer active:scale-95"
              >
                Batal
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="min-h-[44px] px-6 py-2.5 text-xs font-serif font-bold uppercase tracking-wider bg-[#1C1A17] hover:bg-[#2D2A26] text-white border border-[#1C1A17] shadow-xs flex items-center gap-2 transition-colors cursor-pointer active:scale-95"
              >
                <span>Lanjut</span>
                <ChevronRight className="w-4 h-4 stroke-[2]" />
              </button>
            ) : (
              <button
                onClick={handleSendBookingWA}
                className="min-h-[44px] px-6 py-2.5 text-xs font-serif font-bold uppercase tracking-wider bg-[#1C1A17] hover:bg-[#2D2A26] text-white border border-[#1C1A17] shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>Kirim Booking WA →</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
