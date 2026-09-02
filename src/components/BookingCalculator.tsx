import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StudioBranch } from '../types';
import {
  PACKAGES,
  BACKDROPS,
  FRAME_TEMPLATES,
  ADD_ONS,
  PRO_STUDIO_TIME_SLOTS,
  SELF_STUDIO_TIME_SLOTS,
  STUDIO_BRANCHES
} from '../data/pricelistData';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Sparkles,
  QrCode,
  CreditCard,
  ChevronRight,
  Calculator,
  Plus,
  Minus,
  Tag,
  Copy,
  Check,
  Camera,
  Image as ImageIcon,
  MapPin,
  Download,
  Upload,
  Trash2
} from 'lucide-react';

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

export const WhatsAppIcon: React.FC<{ className?: string; size?: number; fill?: string }> = ({
  className = "w-4 h-4",
  size,
  fill = "currentColor"
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const GOOGLE_SHEETS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLQYerfozER5QYE20q5PTfXcINS2zlEce1jRLj_VOYO_EJ-FiEJ09qeDsDDAGguC6mLQ/exec';

// =============================================================================
// HELPER FUNCTIONS & ATURAN VALIDASI STUDIO
// =============================================================================

/**
 * Mendapatkan info kategori paket untuk filtering add-on & catatan khusus
 */
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

/**
 * Menghitung batas maksimum background yang bisa dipilih berdasarkan jenis paket
 */
export const getPackageMaxBackdrops = (pkg: { id: string; category: string; name: string; description?: string; highlights?: string[] }): number => {
  const id = pkg.id.toLowerCase();
  const cat = pkg.category.toLowerCase();

  if (id.includes('self') || cat === 'self-studio' || cat === 'pass-foto' || id.includes('passfoto') || cat === 'sewa-studio' || cat === 'undangan') {
    return 1;
  }

  const desc = (pkg.description || '').toLowerCase();
  const highlights = (pkg.highlights || []).map(h => h.toLowerCase()).join(' ');
  const name = (pkg.name || '').toLowerCase();

  if (desc.includes('2 background') || highlights.includes('2 background') || desc.includes('2 latar') || highlights.includes('2 latar')) {
    return 2;
  }

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

/**
 * Validasi bentrok fisik antar background untuk 1 klien yang memilih 2 background
 */
export const isConflictingBackdrop = (idA: string, idB: string): boolean => {
  if (!idA || !idB || idA === idB) return false;
  const a = idA.toLowerCase();
  const b = idB.toLowerCase();

  // 1. Studio 1: Limbo vs Putih Tengah tidak bisa dipilih bersamaan oleh 1 klien (area panggung yang sama)
  const isLimboA = a.includes('limbo');
  const isPutihTengahA = a.includes('putih-tengah') || a.includes('putih_tengah') || (a.includes('putih') && !a.includes('c2'));
  const isLimboB = b.includes('limbo');
  const isPutihTengahB = b.includes('putih-tengah') || b.includes('putih_tengah') || (b.includes('putih') && !b.includes('c2'));

  if ((isLimboA && isPutihTengahB) || (isPutihTengahA && isLimboB)) {
    return true;
  }

  // 2. Studio 2:
  // a. Coklat vs Cream bentrok panggung yang sama (mutually exclusive)
  const isC2CoklatA = a.includes('coklat') || a.includes('cokelat');
  const isC2CreamA = a.includes('cream') || a.includes('krem');
  const isC2CoklatB = b.includes('coklat') || b.includes('cokelat');
  const isC2CreamB = b.includes('cream') || b.includes('krem');
  if ((isC2CoklatA && isC2CreamB) || (isC2CreamA && isC2CoklatB)) {
    return true;
  }

  return false;
};

export interface Studio2BackdropAvailabilityResult {
  availableIds: string[];
  availableNames: string[];
  lockedReasons: { [id: string]: string };
}

/**
 * Logika Pengecekan Ketersediaan Background Studio 2 (Paket 1 / 1 Background per Klien)
 * 
 * Aturan:
 * 1. Kapasitas: Maksimal 3 klien dalam 1 slot jam.
 * 2. Kuota per Background: 1 background hanya bisa dipilih maksimal 1 kali per jam slot (tidak bisa dipakai 2 klien berbeda).
 * 3. Bentrok Posisi Panggung: Coklat Jendela ⇄ Tematik Cream (panggung sama).
 * 4. Putih & Abu-abu masing-masing memiliki kuota 1x per slot dan boleh digabung oleh 1 klien.
 */
export const getAvailableBackgroundsStudio2 = (
  existingBookings: string[] = []
): Studio2BackdropAvailabilityResult => {
  const STUDIO_2_BGS = [
    { id: 'c2-hitam', name: 'Hitam' },
    { id: 'c2-putih', name: 'Putih' },
    { id: 'c2-abu', name: 'Abu-abu' },
    { id: 'c2-coklat-jendela', name: 'Coklat Jendela' },
    { id: 'c2-tematik-cream', name: 'Tematik Cream' }
  ];

  const bookedSet = new Set<string>();
  let hasBookedHitam = false;
  let hasBookedPutih = false;
  let hasBookedAbu = false;
  let hasBookedCoklat = false;
  let hasBookedCream = false;

  existingBookings.forEach(raw => {
    const str = String(raw || '').toLowerCase();
    if (str.includes('hitam')) {
      hasBookedHitam = true;
      bookedSet.add('c2-hitam');
    }
    if (str.includes('putih')) {
      hasBookedPutih = true;
      bookedSet.add('c2-putih');
    }
    if (str.includes('abu')) {
      hasBookedAbu = true;
      bookedSet.add('c2-abu');
      bookedSet.add('c2-abu-abu');
    }
    if (str.includes('coklat') || str.includes('cokelat')) {
      hasBookedCoklat = true;
      bookedSet.add('c2-coklat-jendela');
    }
    if (str.includes('cream') || str.includes('krem')) {
      hasBookedCream = true;
      bookedSet.add('c2-tematik-cream');
    }
  });

  const availableIds: string[] = [];
  const availableNames: string[] = [];
  const lockedReasons: { [id: string]: string } = {};

  STUDIO_2_BGS.forEach(bg => {
    const isDirectlyBooked = bookedSet.has(bg.id) || (bg.id === 'c2-abu' && bookedSet.has('c2-abu-abu'));
    let isClashed = false;
    let clashReason = '';

    if (isDirectlyBooked) {
      lockedReasons[bg.id] = `Sudah dipilih oleh klien lain di jam ini`;
      if (bg.id === 'c2-abu') lockedReasons['c2-abu-abu'] = lockedReasons[bg.id];
      return;
    }

    // Bentrok Posisi Panggung Coklat vs Cream
    if (bg.id === 'c2-tematik-cream' && hasBookedCoklat) {
      isClashed = true;
      clashReason = 'Tidak tersedia (bentrok panggung dengan Coklat Jendela yang sedang terpakai)';
    } else if (bg.id === 'c2-coklat-jendela' && hasBookedCream) {
      isClashed = true;
      clashReason = 'Tidak tersedia (bentrok panggung dengan Tematik Cream yang sedang terpakai)';
    }

    if (isClashed) {
      lockedReasons[bg.id] = clashReason;
      if (bg.id === 'c2-abu') lockedReasons['c2-abu-abu'] = clashReason;
    } else {
      availableIds.push(bg.id);
      if (bg.id === 'c2-abu') availableIds.push('c2-abu-abu');
      availableNames.push(bg.name);
    }
  });

  return {
    availableIds,
    availableNames,
    lockedReasons
  };
};

export interface BackgroundQuotaStatus {
  id: string;
  name: string;
  maxQuota: number;
  usedCount: number;
  remainingQuota: number;
  isAvailable: boolean;
  status: 'Tersedia' | 'Tidak Tersedia';
  reason?: string;
  group?: string;
}

export interface Paket2AvailabilityResult {
  availableIds: string[];
  availableNames: string[];
  backgrounds: { [id: string]: BackgroundQuotaStatus };
  lockedReasons: { [id: string]: string };
  remainingQuotas: {
    hitam: number;
    putih: number;
    abu: number;
    coklat: number;
    cream: number;
  };
}

/**
 * Logika Validasi Ketersediaan Background Studio 2 (Paket 2 / 2 Background per Klien)
 */
export const checkPaket2Availability = (
  existingBookings: string[] = []
): Paket2AvailabilityResult => {
  const usageCounts: { [id: string]: number } = {
    'c2-hitam': 0,
    'c2-putih': 0,
    'c2-abu': 0,
    'c2-coklat-jendela': 0,
    'c2-tematik-cream': 0
  };

  existingBookings.forEach(booking => {
    const text = String(booking || '').toLowerCase();

    if (text.includes('hitam')) usageCounts['c2-hitam'] += 1;
    if (text.includes('putih')) usageCounts['c2-putih'] += 1;
    if (text.includes('abu')) usageCounts['c2-abu'] += 1;
    if (text.includes('coklat') || text.includes('cokelat')) usageCounts['c2-coklat-jendela'] += 1;
    if (text.includes('cream') || text.includes('krem')) usageCounts['c2-tematik-cream'] += 1;
  });

  const usedHitam = usageCounts['c2-hitam'];
  const usedCoklat = usageCounts['c2-coklat-jendela'];
  const usedPutih = usageCounts['c2-putih'];
  const usedAbu = usageCounts['c2-abu'];
  const usedCream = usageCounts['c2-tematik-cream'];

  const remainingHitam = Math.max(0, 1 - usedHitam);
  const remainingPutih = Math.max(0, 1 - usedPutih);
  const remainingAbu = Math.max(0, 1 - usedAbu);
  const remainingCoklat = (usedCoklat > 0 || usedCream > 0) ? 0 : 1;
  const remainingCream = (usedCream > 0 || usedCoklat > 0) ? 0 : 1;

  const BG_DEFINITIONS = [
    { id: 'c2-hitam', name: 'Hitam', maxQuota: 1, used: usedHitam, remaining: remainingHitam },
    { id: 'c2-putih', name: 'Putih', maxQuota: 1, used: usedPutih, remaining: remainingPutih },
    { id: 'c2-abu', name: 'Abu-abu', maxQuota: 1, used: usedAbu, remaining: remainingAbu },
    { id: 'c2-coklat-jendela', name: 'Coklat Jendela', maxQuota: 1, used: usedCoklat, remaining: remainingCoklat },
    { id: 'c2-tematik-cream', name: 'Tematik Cream', maxQuota: 1, used: usedCream, remaining: remainingCream }
  ];

  const availableIds: string[] = [];
  const availableNames: string[] = [];
  const backgrounds: { [id: string]: BackgroundQuotaStatus } = {};
  const lockedReasons: { [id: string]: string } = {};

  BG_DEFINITIONS.forEach(bg => {
    const isAvailable = bg.remaining > 0;
    const status: 'Tersedia' | 'Tidak Tersedia' = isAvailable ? 'Tersedia' : 'Tidak Tersedia';
    let reason: string | undefined = undefined;

    if (!isAvailable) {
      if (bg.id === 'c2-coklat-jendela' && usedCream > 0 && usedCoklat === 0) {
        reason = 'Area panggung sama dengan Tematik Cream (sudah dipilih di jam ini)';
      } else if (bg.id === 'c2-tematik-cream' && usedCoklat > 0 && usedCream === 0) {
        reason = 'Area panggung sama dengan Coklat Jendela (sudah dipilih di jam ini)';
      } else {
        reason = `Sudah dipilih oleh klien lain di jam ini`;
      }
      lockedReasons[bg.id] = reason;
      if (bg.id === 'c2-abu') lockedReasons['c2-abu-abu'] = reason;
    } else {
      availableIds.push(bg.id);
      if (bg.id === 'c2-abu') availableIds.push('c2-abu-abu');
      availableNames.push(bg.name);
    }

    backgrounds[bg.id] = {
      id: bg.id,
      name: bg.name,
      maxQuota: bg.maxQuota,
      usedCount: bg.used,
      remainingQuota: bg.remaining,
      isAvailable: isAvailable,
      status: status,
      reason: reason
    };
    if (bg.id === 'c2-abu') {
      backgrounds['c2-abu-abu'] = backgrounds[bg.id];
    }
  });

  return {
    availableIds,
    availableNames,
    backgrounds,
    lockedReasons,
    remainingQuotas: {
      hitam: remainingHitam,
      putih: remainingPutih,
      abu: remainingAbu,
      coklat: remainingCoklat,
      cream: remainingCream
    }
  };
};

export interface DualDynamicAvailabilityResult {
  availableIds: string[];
  availableNames: string[];
  backgrounds: { [id: string]: BackgroundQuotaStatus };
  lockedReasons: { [id: string]: string };
  groupStats: {
    grup1_HitamCoklat: { used: number; max: number; remaining: number };
    grup2_PutihAbu: { used: number; max: number; remaining: number };
    grup3_Cream: { used: number; max: number; remaining: number };
  };
  remainingQuotas: {
    hitam: number;
    putih: number;
    abu: number;
    coklat: number;
    cream: number;
  };
}

/**
 * Logika Validasi Ketersediaan Background Studio 2 (Dinoyo) Sesuai Standar Resmi:
 * 1. Single-Use per Slot: Setiap background (Hitam, Putih, Abu-abu, Coklat Jendela, Tematik Cream)
 *    hanya bisa dipilih maksimal 1 kali dalam 1 slot jam yang sama.
 * 2. Mutual Exclusion (Bentrok Fisik Panggung):
 *    - Background Coklat Jendela dan Tematik Cream berbagi panggung yang sama.
 *      Jika Coklat Jendela terpakai -> Tematik Cream otomatis Tidak Tersedia (dan sebaliknya).
 * 3. Background Putih, Abu-abu, dan Hitam memiliki kuota mandiri 1x per slot.
 *    - 1 klien diperbolehkan memilih kombinasi Putih + Abu-abu dalam satu pemesanan (paket 2 background).
 */
export const checkDualDynamicAvailability = (
  existingBookings: string[] = []
): DualDynamicAvailabilityResult => {
  // 1. Ekstrak Jumlah Pemakaian Tiap Background dari Reservasi yang Ada
  const usageCounts: { [id: string]: number } = {
    'c2-hitam': 0,
    'c2-putih': 0,
    'c2-abu': 0,
    'c2-coklat-jendela': 0,
    'c2-tematik-cream': 0
  };

  existingBookings.forEach(booking => {
    const text = String(booking || '').toLowerCase();

    // Hitung Pemakaian Hitam
    if (text.includes('hitam')) {
      usageCounts['c2-hitam'] += 1;
    }

    // Hitung Pemakaian Putih
    if (text.includes('putih')) {
      usageCounts['c2-putih'] += 1;
    }

    // Hitung Pemakaian Abu-abu
    if (text.includes('abu')) {
      usageCounts['c2-abu'] += 1;
    }

    // Hitung Pemakaian Coklat
    if (text.includes('coklat') || text.includes('cokelat')) {
      usageCounts['c2-coklat-jendela'] += 1;
    }

    // Hitung Pemakaian Cream
    if (text.includes('cream') || text.includes('krem')) {
      usageCounts['c2-tematik-cream'] += 1;
    }
  });

  const usedHitam = usageCounts['c2-hitam'];
  const usedCoklat = usageCounts['c2-coklat-jendela'];
  const usedPutih = usageCounts['c2-putih'];
  const usedAbu = usageCounts['c2-abu'];
  const usedCream = usageCounts['c2-tematik-cream'];

  // =========================================================================
  // 2. Perhitungan Ketersediaan Background Studio 2 (Single-Use & Mutual Exclusion)
  // =========================================================================
  const remainingHitam = usedHitam > 0 ? 0 : 1;
  const remainingPutih = usedPutih > 0 ? 0 : 1;
  const remainingAbu = usedAbu > 0 ? 0 : 1;

  // Mutual exclusion: Coklat vs Cream (Panggung yang sama)
  const remainingCoklat = (usedCoklat > 0 || usedCream > 0) ? 0 : 1;
  const remainingCream = (usedCream > 0 || usedCoklat > 0) ? 0 : 1;

  // =========================================================================
  // 3. Struktur Output Ketersediaan untuk UI
  // =========================================================================
  const BG_DEFINITIONS = [
    { id: 'c2-hitam', name: 'Hitam', maxQuota: 1, used: usedHitam, remaining: remainingHitam, group: 'Studio 2 Set A' },
    { id: 'c2-putih', name: 'Putih', maxQuota: 1, used: usedPutih, remaining: remainingPutih, group: 'Studio 2 Set B' },
    { id: 'c2-abu', name: 'Abu-abu', maxQuota: 1, used: usedAbu, remaining: remainingAbu, group: 'Studio 2 Set C' },
    { id: 'c2-coklat-jendela', name: 'Coklat Jendela', maxQuota: 1, used: usedCoklat, remaining: remainingCoklat, group: 'Studio 2 Set D (Panggung 1)' },
    { id: 'c2-tematik-cream', name: 'Tematik Cream', maxQuota: 1, used: usedCream, remaining: remainingCream, group: 'Studio 2 Set D (Panggung 1)' }
  ];

  const availableIds: string[] = [];
  const availableNames: string[] = [];
  const backgrounds: { [id: string]: BackgroundQuotaStatus } = {};
  const lockedReasons: { [id: string]: string } = {};

  BG_DEFINITIONS.forEach(bg => {
    const isAvailable = bg.remaining > 0;
    const status: 'Tersedia' | 'Tidak Tersedia' = isAvailable ? 'Tersedia' : 'Tidak Tersedia';
    let reason: string | undefined = undefined;

    if (!isAvailable) {
      if (bg.id === 'c2-coklat-jendela' && usedCream > 0 && usedCoklat === 0) {
        reason = 'Area panggung sama dengan Tematik Cream (terpakai di jam ini)';
      } else if (bg.id === 'c2-tematik-cream' && usedCoklat > 0 && usedCream === 0) {
        reason = 'Area panggung sama dengan Coklat Jendela (terpakai di jam ini)';
      } else {
        reason = `Sudah dipilih oleh klien lain di jam ini`;
      }
      lockedReasons[bg.id] = reason;
      if (bg.id === 'c2-abu') lockedReasons['c2-abu-abu'] = reason;
    } else {
      availableIds.push(bg.id);
      if (bg.id === 'c2-abu') availableIds.push('c2-abu-abu');
      availableNames.push(bg.name);
    }

    backgrounds[bg.id] = {
      id: bg.id,
      name: bg.name,
      group: bg.group,
      maxQuota: bg.maxQuota,
      usedCount: bg.used,
      remainingQuota: bg.remaining,
      isAvailable: isAvailable,
      status: status,
      reason: reason
    };
    if (bg.id === 'c2-abu') {
      backgrounds['c2-abu-abu'] = backgrounds[bg.id];
    }
  });

  return {
    availableIds,
    availableNames,
    backgrounds,
    lockedReasons,
    groupStats: {
      grup1_HitamCoklat: { used: usedHitam + usedCoklat, max: 2, remaining: remainingHitam + remainingCoklat },
      grup2_PutihAbu: { used: usedPutih + usedAbu, max: 2, remaining: remainingPutih + remainingAbu },
      grup3_Cream: { used: usedCream, max: 1, remaining: remainingCream }
    },
    remainingQuotas: {
      hitam: remainingHitam,
      putih: remainingPutih,
      abu: remainingAbu,
      coklat: remainingCoklat,
      cream: remainingCream
    }
  };
};

/**
 * Format normalisasi string waktu slot menjadi HH:MM standar
 */
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

/**
 * Menghitung jam selesai sesi foto berdasarkan durasi menit
 */
export const calculateEndTime = (startTimeStr: string, durationMinutes: number): string => {
  const norm = normalizeSlotTime(startTimeStr);
  const [hhStr, mmStr] = norm.split(':');
  const hh = Number(hhStr);
  const mm = Number(mmStr);
  if (isNaN(hh) || isNaN(mm)) return startTimeStr;

  const totalStartMinutes = hh * 60 + mm;
  const totalEndMinutes = totalStartMinutes + durationMinutes;
  const endHh = Math.floor(totalEndMinutes / 60);
  const endMm = totalEndMinutes % 60;

  return `${String(endHh).padStart(2, '0')}:${String(endMm).padStart(2, '0')}`;
};

const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const INDONESIAN_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

/**
 * Format string tanggal YYYY-MM-DD menjadi format teks Indonesia (contoh: Selasa, 1 September 2026)
 */
export const formatIndonesianDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [yyyy, mm, dd] = dateStr.split('-').map(Number);
  if (!yyyy || !mm || !dd) return dateStr;
  const d = new Date(yyyy, mm - 1, dd);
  const dayName = INDONESIAN_DAYS[d.getDay()];
  const monthName = INDONESIAN_MONTHS[mm - 1];
  return `${dayName}, ${dd} ${monthName} ${yyyy}`;
};

/**
 * Menghasilkan daftar hari dan tanggal 14 hari ke depan untuk pemilih tanggal interaktif
 */
export const getUpcomingDaysList = (count: number = 14) => {
  const list = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    list.push({
      dateStr,
      dayShort: INDONESIAN_DAYS[dayOfWeek].substring(0, 3).toUpperCase(),
      dayName: INDONESIAN_DAYS[dayOfWeek],
      dateNum: dd,
      monthShort: INDONESIAN_MONTHS_SHORT[d.getMonth()],
      isToday: i === 0,
      isTomorrow: i === 1,
      isWeekend
    });
  }
  return list;
};

export interface TimeSlotStatus {
  slot: string;
  isAvailable: boolean;
  disabled: boolean;
  reason: string;
  occupiedSlots: string[];
  durationMinutes: number;
  isOvertime?: boolean;
}

export interface CheckTimeSlotAvailabilityResult {
  packageInfo: {
    name: string;
    isPaket2OrHigher: boolean;
    requiredSlotsCount: number;
    durationMinutes: number;
  };
  slots: TimeSlotStatus[];
}

/**
 * Logika Validasi Ketersediaan "Jam Slot Studio Foto" untuk Studio 1 & Studio 2 (Durasi Dinamis)
 * 
 * Aturan:
 * 1. Jika Paket 1 (1 Background): Durasi 30 Menit (1 slot). Hanya cek slot tersebut.
 * 2. Jika Paket 2 ke atas (2 Background / Durasi 1 Jam):
 *    - Membutuhkan 2 slot berurutan (misal: 10:00 & 10:30).
 *    - Tombol jam (10:00) HANYA BISA AKTIF jika jam 10:00 DAN jam 10:30 keduanya tersedia.
 *    - Jika jam 10:30 sudah penuh, jam 10:00 otomatis DISABLED (disabled: true).
 */
export const checkTimeSlotAvailability = (
  allSlots: string[],
  selectedPackage: { id: string; name: string; category: string; maxBackdrops?: number; description?: string; highlights?: string[] },
  existingBookings: { [slot: string]: number } = {},
  selectedBranch: StudioBranch = 'cabang-1'
): CheckTimeSlotAvailabilityResult => {
  const maxBackdrops = getPackageMaxBackdrops(selectedPackage);
  const isPaket2OrHigher = maxBackdrops > 1;
  const requiredSlotsCount = isPaket2OrHigher ? 2 : 1;
  const durationMinutes = requiredSlotsCount * 30;
  const maxCapacityPerSlot = selectedBranch === 'cabang-2' ? 3 : 1;

  const slots: TimeSlotStatus[] = allSlots.map((slot, index) => {
    const sNorm = normalizeSlotTime(slot);
    const currentOccupancy = existingBookings[sNorm] || 0;
    const isCurrentSlotFull = currentOccupancy >= maxCapacityPerSlot;

    if (isCurrentSlotFull) {
      return {
        slot,
        isAvailable: false,
        disabled: true,
        reason: 'Slot jam ini sudah penuh',
        occupiedSlots: [slot],
        durationMinutes
      };
    }

    if (requiredSlotsCount === 1) {
      return {
        slot,
        isAvailable: true,
        disabled: false,
        reason: 'Tersedia (30 Menit)',
        occupiedSlots: [slot],
        durationMinutes: 30
      };
    }

    // Kasus khusus slot terakhir (20:30) diperbolehkan dengan overtime fee Rp 35.000
    if (index === allSlots.length - 1) {
      return {
        slot,
        isAvailable: true,
        disabled: false,
        reason: 'Tersedia (+Rp 35.000 Overtime Melebihi 21.00 WIB)',
        occupiedSlots: [slot],
        durationMinutes: 60,
        isOvertime: true
      };
    }

    const nextSlot = allSlots[index + 1];
    const nextNorm = normalizeSlotTime(nextSlot);
    const nextOccupancy = existingBookings[nextNorm] || 0;
    const isNextSlotFull = nextOccupancy >= maxCapacityPerSlot;

    if (isNextSlotFull) {
      return {
        slot,
        isAvailable: false,
        disabled: true,
        reason: `Slot lanjutan (${nextSlot}) sudah penuh, durasi 1 jam tidak muat`,
        occupiedSlots: [slot, nextSlot],
        durationMinutes: 60
      };
    }

    return {
      slot,
      isAvailable: true,
      disabled: false,
      reason: 'Tersedia (1 Jam Penuh)',
      occupiedSlots: [slot, nextSlot],
      durationMinutes: 60
    };
  });

  return {
    packageInfo: {
      name: selectedPackage.name,
      isPaket2OrHigher,
      requiredSlotsCount,
      durationMinutes
    },
    slots
  };
};

export const BookingCalculator: React.FC<BookingCalculatorProps> = ({
  isOpen,
  onClose,
  selectedBranch = 'cabang-1',
  onSelectBranch,
  preselectedPackageId,
  preselectedBackdropId,
  preselectedFrameId
}) => {
  const [step, setStep] = useState<number>(1);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  // Fungsi navigasi step yang otomatis scroll modal ke bagian paling atas
  const goToStep = (newStep: number) => {
    setStep(newStep);
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  };

  // Scroll otomatis ke puncak modal setiap kali step berubah
  useEffect(() => {
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [step]);

  // Form State
  const [selectedPackageId, setSelectedPackageId] = useState<string>(preselectedPackageId || PACKAGES[0].id);
  const [selectedBackdropIds, setSelectedBackdropIds] = useState<string[]>([preselectedBackdropId || BACKDROPS[0].id]);
  const [selectedFrameId, setSelectedFrameId] = useState<string>(preselectedFrameId || FRAME_TEMPLATES[0].id);
  const [selectedAddOns, setSelectedAddOns] = useState<{ [id: string]: number }>({});

  const today = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState<string>(today);
  const [timeSlot, setTimeSlot] = useState<string>('14:00');
  const upcomingDays = useMemo(() => getUpcomingDaysList(14), []);

  // Real-time Slot & Backdrop Availability from Google Sheets
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [slotClientCounts, setSlotClientCounts] = useState<{ [slot: string]: number }>({});
  const [slotBackdrops, setSlotBackdrops] = useState<{ [slot: string]: string[] }>({});
  const [, setIsLoadingSlots] = useState<boolean>(false);

  // Customer Data & Notes
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Promo Code & Payment Option
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [promoError, setPromoError] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent?: number; discountAmount?: number } | null>(null);
  const [paymentOption, setPaymentOption] = useState<'dp' | 'full'>('dp');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // QRIS Payment Proof & Nominal Copy
  const [paymentProofImage, setPaymentProofImage] = useState<string | null>(null);
  const [paymentProofFileName, setPaymentProofFileName] = useState<string>('');
  const [copiedNominal, setCopiedNominal] = useState<boolean>(false);

  // Deteksi Tipe Ruangan / Studio (Self Studio vs Studio Foto)
  const currentPackage = PACKAGES.find(p => p.id === selectedPackageId) || PACKAGES[0];
  const currentBranchInfo = STUDIO_BRANCHES.find(b => b.id === selectedBranch) || STUDIO_BRANCHES[0];
  const isSelfStudio = (currentPackage.category === 'self-studio' || currentPackage.id.toLowerCase().includes('self'));
  const maxBackdrops = getPackageMaxBackdrops(currentPackage);
  const baseTimeSlots = isSelfStudio ? SELF_STUDIO_TIME_SLOTS : PRO_STUDIO_TIME_SLOTS;

  // Durasi Sesi Foto: Jika paket 2 keatas (2 background) durasi = 60 Menit (2 slot berturut-turut @30 Menit)
  const sessionDurationMinutes = maxBackdrops > 1 ? 60 : 30;
  const sessionSlotsCount = maxBackdrops > 1 ? 2 : 1;

  // Jika Paket 2 ke atas (durasi 60 menit): Hanya tampilkan jam kelipatan 1 jam (08:00, 09:00, 10:00, dst)
  // Jika Paket 1 (durasi 30 menit): Tampilkan seluruh 26 slot (08:00, 08:30, 09:00, dst)
  const activeTimeSlots = maxBackdrops > 1
    ? baseTimeSlots.filter(s => s.endsWith(':00'))
    : baseTimeSlots;

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
          if (data.slotCounts && typeof data.slotCounts === 'object') {
            const counts: { [s: string]: number } = {};
            Object.entries(data.slotCounts).forEach(([slotRaw, count]) => {
              const sNorm = normalizeSlotTime(slotRaw);
              if (sNorm) counts[sNorm] = Number(count) || 0;
            });
            setSlotClientCounts(counts);
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

  // Mendapatkan slot-slot yang terpakai oleh durasi sesi foto (1 Slot = 30M, 2 Slot = 60M)
  const getOccupiedSlotsForStart = (startSlot: string): string[] => {
    const norm = normalizeSlotTime(startSlot);
    if (!norm) return [];
    if (sessionSlotsCount === 1) return [norm];

    // Untuk sesi 2 slot (60 Menit): ambil slot awal (misal 08:00) dan slot 30 menit berikutnya (misal 08:30)
    const baseIdx = baseTimeSlots.indexOf(norm);
    if (baseIdx !== -1 && baseIdx + 1 < baseTimeSlots.length) {
      return [norm, baseTimeSlots[baseIdx + 1]];
    }
    return [norm];
  };

  // Helper untuk menghitung jumlah klien per slot (Kapasitas Maksimal: 3 Klien per Slot Jam)
  const getSlotClientCount = (slotTimeStr: string): number => {
    const sNorm = normalizeSlotTime(slotTimeStr);
    if (slotClientCounts[sNorm] !== undefined) {
      return slotClientCounts[sNorm];
    }
    if (slotBackdrops[sNorm] && Array.isArray(slotBackdrops[sNorm])) {
      return slotBackdrops[sNorm].length;
    }
    if (bookedSlots.includes(sNorm)) {
      return 1;
    }
    return 0;
  };

  // Mengecek apakah suatu slot valid untuk dijadikan jam mulai reservasi (Durasi Dinamis: 1 Slot vs 2 Slot)
  const isSlotAvailableForBooking = (startSlot: string): { isAvailable: boolean; reason?: string } => {
    const neededSlots = getOccupiedSlotsForStart(startSlot);
    if (neededSlots.length === 0) return { isAvailable: false, reason: 'Slot tidak valid' };

    const maxCapacity = selectedBranch === 'cabang-2' ? 3 : 1;
    for (let i = 0; i < neededSlots.length; i++) {
      const s = neededSlots[i];
      const count = getSlotClientCount(s);
      if (count >= maxCapacity) {
        return {
          isAvailable: false,
          reason: i === 0 ? 'Slot jam ini sudah penuh' : `Slot lanjutan (${s}) sudah penuh`
        };
      }
    }

    return { isAvailable: true };
  };

  const formattedSessionTime = `${timeSlot} - ${calculateEndTime(timeSlot, sessionDurationMinutes)}`;
  const currentOccupiedSlots = getOccupiedSlotsForStart(timeSlot);

  // Otomatis pindah ke slot yang tersedia jika slot yang sedang aktif ternyata tidak valid / tidak ada di activeTimeSlots / penuh
  useEffect(() => {
    const currentAvailability = isSlotAvailableForBooking(timeSlot);
    if (!activeTimeSlots.includes(timeSlot) || !currentAvailability.isAvailable) {
      const firstAvailable = activeTimeSlots.find(s => isSlotAvailableForBooking(s).isAvailable);
      if (firstAvailable) {
        setTimeSlot(firstAvailable);
      } else if (activeTimeSlots.length > 0) {
        setTimeSlot(activeTimeSlots[0]);
      }
    }
  }, [slotClientCounts, slotBackdrops, activeTimeSlots, timeSlot, sessionSlotsCount, selectedPackageId, maxBackdrops, selectedBranch]);

  useEffect(() => {
    if (preselectedPackageId) setSelectedPackageId(preselectedPackageId);
    if (preselectedBackdropId) setSelectedBackdropIds([preselectedBackdropId]);
    if (preselectedFrameId) setSelectedFrameId(preselectedFrameId);
  }, [preselectedPackageId, preselectedBackdropId, preselectedFrameId]);

  const availableBackdrops = BACKDROPS.filter(b =>
    (b.applicableBranches || ['cabang-1']).includes((selectedBranch as StudioBranch) || 'cabang-1') &&
    b.applicableTo?.includes(isSelfStudio ? 'self-studio' : 'pro-studio')
  );

  // Cek ketersediaan backdrop spesifik berdasarkan slot jam yang dipilih & aturan validasi studio
  const getBackdropAvailability = (backdropId: string): { isAvailable: boolean; reason?: string } => {
    const bdObj = BACKDROPS.find(b => b.id === backdropId);
    if (!bdObj) return { isAvailable: true };

    const normTime = normalizeSlotTime(timeSlot);
    const bookedForSlot = (slotBackdrops[normTime] || []).map(b => String(b).toLowerCase());
    const bdIdLower = bdObj.id.toLowerCase();

    // 1. Validasi Studio 2 (Cabang 2): Kuota Dinamis Ganda (Hitam+Coklat <= 3, Putih+Abu <= 2, Cream <= 1)
    if (selectedBranch === 'cabang-2') {
      const dynamicResult = checkDualDynamicAvailability(bookedForSlot);
      if (!dynamicResult.availableIds.includes(backdropId)) {
        return {
          isAvailable: false,
          reason: dynamicResult.lockedReasons[backdropId] || `Kuota background sudah habis di jam ${normTime} WIB`
        };
      }
    }

    // 2. Validasi Studio 1 (Cabang 1): Limbo vs Putih Tengah & Kuota 1x per Background
    if (selectedBranch === 'cabang-1') {
      const isAlreadyBooked = bookedForSlot.some(b => b.includes(bdObj.name.toLowerCase()) || b.includes(bdIdLower));
      if (isAlreadyBooked) {
        return {
          isAvailable: false,
          reason: `Sudah dipilih oleh klien lain di jam ${normTime} WIB`
        };
      }

      if (bdIdLower.includes('limbo')) {
        const hasPutihTengahBooked = bookedForSlot.some(b => b.includes('putih tengah') || b.includes('putih-tengah'));
        if (hasPutihTengahBooked) {
          return {
            isAvailable: false,
            reason: `Area panggung sama dengan Putih Tengah (terpakai di jam ${normTime} WIB)`
          };
        }
      } else if (bdIdLower.includes('putih-tengah') || bdIdLower.includes('putih_tengah')) {
        const hasLimboBooked = bookedForSlot.some(b => b.includes('limbo'));
        if (hasLimboBooked) {
          return {
            isAvailable: false,
            reason: `Area panggung sama dengan Limbo (terpakai di jam ${normTime} WIB)`
          };
        }
      }
    }

    // 3. Pembatasan Khusus 1 Klien yang Mengambil Paket 2 Background
    if (maxBackdrops > 1 && selectedBackdropIds.length > 0) {
      const conflictingSelected = selectedBackdropIds.find(selId => selId !== backdropId && isConflictingBackdrop(selId, backdropId));
      if (conflictingSelected) {
        const otherBd = BACKDROPS.find(b => b.id === conflictingSelected);
        return {
          isAvailable: false,
          reason: `Dilarang digabung dengan ${otherBd?.name || 'Latar Terpilih'} dalam 1 sesi reservasi`
        };
      }
    }

    return { isAvailable: true };
  };

  useEffect(() => {
    // Reset selected backdrop jika tidak applicable atau tidak available
    const validIds = selectedBackdropIds.filter(id => {
      const isApplicable = availableBackdrops.some(b => b.id === id);
      const avail = getBackdropAvailability(id);
      return isApplicable && avail.isAvailable;
    });

    if (validIds.length === 0 && availableBackdrops.length > 0) {
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
      if (selectedBackdropIds.includes(id)) {
        if (selectedBackdropIds.length > 1) {
          setSelectedBackdropIds(selectedBackdropIds.filter(bId => bId !== id));
        }
      } else {
        if (selectedBackdropIds.length < 2) {
          if (selectedBackdropIds.length === 1 && isConflictingBackdrop(selectedBackdropIds[0], id)) {
            alert(`Background ${BACKDROPS.find(b => b.id === id)?.name} dan ${BACKDROPS.find(b => b.id === selectedBackdropIds[0])?.name} berada di area panggung yang sama sehingga tidak bisa dipilih bersamaan.`);
            return;
          }
          setSelectedBackdropIds([...selectedBackdropIds, id]);
        } else {
          if (isConflictingBackdrop(selectedBackdropIds[0], id)) {
            alert(`Background ${BACKDROPS.find(b => b.id === id)?.name} tidak bisa digabung dengan ${BACKDROPS.find(b => b.id === selectedBackdropIds[0])?.name} (area panggung sama).`);
            return;
          }
          setSelectedBackdropIds([selectedBackdropIds[0], id]);
        }
      }
    }
  };

  const selectedBackdropObjects = selectedBackdropIds
    .map(id => BACKDROPS.find(b => b.id === id))
    .filter(Boolean);

  const backdropDisplayName = selectedBackdropObjects.length > 1
    ? `Background 1: ${selectedBackdropObjects[0]?.name} & Background 2: ${selectedBackdropObjects[1]?.name}`
    : (selectedBackdropObjects[0]?.name || availableBackdrops[0]?.name || 'Background Standar');

  const currentFrame = FRAME_TEMPLATES.find(f => f.id === selectedFrameId) || FRAME_TEMPLATES[0];

  // Kalkulasi Biaya & Diskon
  const packagePrice = currentPackage.price;
  const addOnsTotalPrice = Object.entries(selectedAddOns).reduce((sum, [id, qty]) => {
    const addOn = ADD_ONS.find(a => a.id === id);
    const numQty = typeof qty === 'number' ? qty : Number(qty) || 0;
    return sum + (addOn ? addOn.price * numQty : 0);
  }, 0);

  // Biaya tambahan jika durasi 50 menit (Paket 2 keatas) mengambil slot jam 20:30 WIB (selesai 21:20 WIB / melebihi jam tutup 21:00 WIB)
  const isLateNightOvertime = sessionSlotsCount === 2 && normalizeSlotTime(timeSlot) === '20:30';
  const lateNightOvertimeFee = isLateNightOvertime ? 35000 : 0;

  const subtotal = packagePrice + addOnsTotalPrice + lateNightOvertimeFee;

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

  // Format Pesan WhatsApp Booking
  const generateWhatsAppMessageText = () => {
    let message = `*HALO ADMIN ALVIERO STUDIO FOTO!* 👋\n`;
    message += `Saya mau reservasi/booking sesi foto dengan rincian berikut:\n\n`;
    message += `📌 *DATA PEMESAN:*\n`;
    message += `• Nama: ${customerName || '-'}\n`;
    message += `• No. WhatsApp: ${customerPhone || '-'}\n`;
    message += `• Tanggal Foto: ${bookingDate}\n`;
    message += `• Jam Sesi Foto: *${formattedSessionTime} WIB* (Durasi: ${sessionDurationMinutes} Menit / ${maxBackdrops} Background)\n`;
    message += `• *Tipe Ruangan:* ${isSelfStudio ? '✨ Bilik Self Studio (Shutter Mandiri)' : '📸 Studio Foto (Fotografer Pro)'}\n`;
    message += `• *Lokasi Studio:* *${currentBranchInfo.name}*\n\n`;

    message += `📷 *PAKET & KONSEP STUDIO:*\n`;
    message += `• Paket Utama: *${currentPackage.name}* (Rp ${currentPackage.price.toLocaleString('id-ID')})\n`;
    message += `• Pencahayaan / Background: ${backdropDisplayName}\n`;
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

    if (lateNightOvertimeFee > 0) {
      message += `⏰ *BIAYA TAMBAHAN OVERTIME:* +Rp 35.000 (Sesi 60 Menit Melebihi Jam 21.00 WIB)\n\n`;
    }

    if (appliedPromo) {
      message += `🎟️ *KODE PROMO:* ${appliedPromo.code} (Hemat Rp ${discountValue.toLocaleString('id-ID')})\n`;
    }

    if (notes) {
      message += `📝 *Catatan Khusus:* ${notes}\n`;
    }

    message += `💳 *METODE PEMBAYARAN:* ${paymentOption === 'dp' ? `DP 50% (Rp ${dpAmount.toLocaleString('id-ID')})` : 'LUNAS FULL'}\n`;
    message += `🧾 *STATUS BUKTI TRANSFER:* ✅ Sudah Diunggah (${paymentProofFileName || 'Bukti Transfer QRIS'})\n`;
    message += `💰 *TOTAL BIAYA:* *Rp ${grandTotal.toLocaleString('id-ID')}*\n\n`;
    message += `Bukti transfer QRIS sudah terlampir bersama chat ini ya min. Mohon dikonfirmasi jadwalnya. Terima kasih! 🙏`;

    return message;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateWhatsAppMessageText());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleSendBookingWA = () => {
    if (!customerName.trim()) {
      alert('Mohon masukkan Nama Pemesan terlebih dahulu.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Mohon masukkan Nomor WhatsApp aktif terlebih dahulu.');
      return;
    }
    if (!paymentProofImage) {
      alert('Mohon unggah / upload foto bukti transfer pembayaran QRIS terlebih dahulu sebelum mengirim booking WhatsApp.');
      return;
    }

    const message = generateWhatsAppMessageText();
    const studioWaNumber = currentBranchInfo.whatsappNumber || (selectedBranch === 'cabang-2' ? '6285168879214' : '6287777538164');
    const waUrl = `https://wa.me/${studioWaNumber}?text=${encodeURIComponent(message)}`;

    // Sinkronisasi background ke Google Spreadsheet via Google Apps Script
    try {
      const selectedAddOnsSummary = Object.entries(selectedAddOns)
        .map(([id, qty]) => {
          const a = ADD_ONS.find(item => item.id === id);
          return a ? `${a.name} (${qty} ${a.unit})` : '';
        })
        .filter(Boolean)
        .join(', ') || '-';

      const payload = {
        action: 'book_slot',
        date: bookingDate,
        time: formattedSessionTime,
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
        total: grandTotal,
        dp: dpAmount,
        paymentMethod: paymentOption,
        notes: `[Durasi: ${sessionDurationMinutes} Menit / ${sessionSlotsCount} Slot${isLateNightOvertime ? ' | Overtime 21.00: +Rp 35.000' : ''}] ${notes || '-'}`,
        status: 'PENDING',
        image_base64: paymentProofImage || '',
        image_name: paymentProofFileName || `bukti_${Date.now()}.png`
      };

      fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      }).catch(err => console.log('GAS background sync note:', err));
    } catch (e) {
      console.log('GAS sync error:', e);
    }

    window.open(waUrl, '_blank');
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file foto maksimal 5 MB.');
        return;
      }
      setPaymentProofFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPaymentProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProof = () => {
    setPaymentProofImage(null);
    setPaymentProofFileName('');
  };

  const handleCopyNominal = () => {
    const amount = paymentOption === 'dp' ? dpAmount : grandTotal;
    navigator.clipboard.writeText(amount.toString());
    setCopiedNominal(true);
    setTimeout(() => setCopiedNominal(false), 2000);
  };

  const canSubmitBooking = customerName.trim().length > 0 && customerPhone.trim().length > 0 && !!paymentProofImage;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] max-w-3xl w-full border-x-0 sm:border sm:border-[#E8DDD6] rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[94vh] my-auto relative text-left">

        {/* Modal Header */}
        <div className="bg-[#2A2A2A] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-[#3A3A3A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3A3A3A] border border-[#5A5A5A] flex items-center justify-center text-[#A9BCA7] shrink-0 shadow-xs">
              <Calculator className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base md:text-lg text-white uppercase tracking-wider leading-tight">
                KALKULATOR & RESERVASI JADWAL
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-300 font-sans tracking-wide">
                Alviero Studio Foto • Konfirmasi Cepat & Otomatis via WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl bg-[#3A3A3A] hover:bg-[#4A4A4A] text-stone-300 hover:text-white flex items-center justify-center border border-[#5A5A5A] transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5 stroke-[2]" />
          </button>
        </div>

        {/* Step Navigation Bar */}
        <div className="bg-white border-b border-[#E8DDD6] px-3 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between text-xs font-serif uppercase tracking-wider overflow-x-auto shrink-0">
          <div className="flex items-center gap-2 w-full justify-between sm:justify-start">
            <button
              onClick={() => goToStep(1)}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-2 shrink-0 cursor-pointer transition-all border ${step === 1
                ? 'bg-[#3A3A3A] text-white border-[#3A3A3A] shadow-xs font-bold'
                : 'bg-white text-stone-600 border-[#E8DDD6] hover:border-[#3A3A3A]'
                }`}
            >
              <span className={`text-[11px] font-bold ${step === 1 ? 'text-[#A9BCA7]' : 'text-stone-500'}`}>1.</span>
              <span>Paket & Jadwal</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />

            <button
              onClick={() => goToStep(2)}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-2 shrink-0 cursor-pointer transition-all border ${step === 2
                ? 'bg-[#3A3A3A] text-white border-[#3A3A3A] shadow-xs font-bold'
                : 'bg-white text-stone-600 border-[#E8DDD6] hover:border-[#3A3A3A]'
                }`}
            >
              <span className={`text-[11px] font-bold ${step === 2 ? 'text-[#A9BCA7]' : 'text-stone-500'}`}>2.</span>
              <span>Add-Ons & Diskon</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />

            <button
              onClick={() => goToStep(3)}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-2 shrink-0 cursor-pointer transition-all border ${step === 3
                ? 'bg-[#3A3A3A] text-white border-[#3A3A3A] shadow-xs font-bold'
                : 'bg-white text-stone-600 border-[#E8DDD6] hover:border-[#3A3A3A]'
                }`}
            >
              <span className={`text-[11px] font-bold ${step === 3 ? 'text-[#A9BCA7]' : 'text-stone-500'}`}>3.</span>
              <span>Data & Pembayaran</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div ref={modalBodyRef} className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1 bg-[#FDFBF7]">

          {/* STEP 1: PILIH PAKET, CABANG, JADWAL & LATAR */}
          {step === 1 && (
            <div className="space-y-5">

              {/* Branch Selector in Step 1 */}
              <div className="bg-white border border-[#E8DDD6] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-sm">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A] flex items-center justify-center shrink-0 shadow-2xs">
                    <MapPin className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#6E856C] stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[9.5px] font-serif font-bold text-stone-500 uppercase tracking-widest">
                      LOKASI STUDIO AKTIF:
                    </div>
                    <div className="text-xs sm:text-sm font-serif font-bold text-[#3A3A3A] truncate">
                      {currentBranchInfo.name}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 w-full sm:w-auto shrink-0">
                  {STUDIO_BRANCHES.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        if (onSelectBranch) onSelectBranch(b.id);
                      }}
                      className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider transition-all cursor-pointer border text-center flex items-center justify-center truncate ${selectedBranch === b.id
                        ? 'bg-[#3A3A3A] text-white border-[#3A3A3A] shadow-xs'
                        : 'bg-[#F2E9E4]/60 text-stone-700 border-[#E8DDD6] hover:border-[#3A3A3A]'
                        }`}
                    >
                      {b.shortName.replace('Alviero Studio — ', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Pilih Paket Utama */}
              <div>
                <label className="block text-xs font-serif font-bold text-[#3A3A3A] uppercase tracking-wider mb-2">
                  1. PILIH PAKET FOTO UTAMA:
                </label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  className="w-full min-h-[44px] p-3 rounded-xl border border-[#E8DDD6] text-xs font-semibold text-[#3A3A3A] bg-white focus:outline-none focus:border-[#3A3A3A] transition-colors"
                >
                  {PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — Rp {pkg.price.toLocaleString('id-ID')} ({pkg.durationMinutes} Min)
                    </option>
                  ))}
                </select>
              </div>

              {/* Package Summary Card */}
              <div className="bg-white border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-[#3A3A3A] text-sm sm:text-base uppercase tracking-wide">{currentPackage.name}</h4>
                    <p className="text-xs font-sans text-stone-600 mt-0.5 leading-relaxed">{currentPackage.description}</p>
                  </div>
                  <span className="font-serif font-bold text-[#3A3A3A] text-base sm:text-lg shrink-0">
                    Rp {currentPackage.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-[11px] text-stone-700 pt-2.5 border-t border-[#F2E9E4] flex items-center gap-2 flex-wrap">
                  <span className="bg-[#FDFBF7] px-3 py-1 rounded-full border border-[#E8DDD6] font-sans font-medium flex items-center gap-1.5 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-[#6E856C]" />
                    {currentPackage.durationMinutes} Menit Sesi
                  </span>
                  <span className="bg-[#FDFBF7] px-3 py-1 rounded-full border border-[#E8DDD6] font-sans font-medium flex items-center gap-1.5 shadow-2xs">
                    <User className="w-3.5 h-3.5 text-[#6E856C]" />
                    {currentPackage.includedPeople} Peserta
                  </span>
                  <span className="bg-[#FDFBF7] px-3 py-1 rounded-full border border-[#E8DDD6] font-sans font-medium flex items-center gap-1.5 shadow-2xs">
                    <ImageIcon className="w-3.5 h-3.5 text-[#6E856C]" />
                    {currentPackage.includedPrints}
                  </span>
                </div>
              </div>

              {/* 2. Pilih Tanggal & Waktu Sesi Foto */}
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="text-xs font-serif font-bold text-[#3A3A3A] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#6E856C]" />
                    2. PILIH TANGGAL & WAKTU SESI FOTO:
                  </label>
                  <span className="text-[10.5px] sm:text-[11px] font-sans font-bold text-[#3A3A3A] bg-white px-3 py-1 rounded-full border border-[#E8DDD6] shadow-2xs">
                    {formatIndonesianDate(bookingDate)} • {formattedSessionTime} WIB ({sessionDurationMinutes} Menit)
                  </span>
                </div>

                {/* Interactive Luxury Date Selector Container */}
                <div className="bg-white border border-[#E8DDD6] rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-sm">
                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9.5px] font-serif font-bold text-stone-500 uppercase tracking-wider mr-1">
                      PILIHAN CEPAT:
                    </span>
                    {upcomingDays.slice(0, 5).map((item) => {
                      const isSelected = bookingDate === item.dateStr;
                      const label = item.isToday ? 'Hari Ini' : item.isTomorrow ? 'Besok' : `${item.dayName} (${item.dateNum} ${item.monthShort})`;
                      return (
                        <button
                          key={item.dateStr}
                          type="button"
                          onClick={() => setBookingDate(item.dateStr)}
                          className={`px-3 py-1 rounded-full text-[11px] font-sans font-semibold transition-all border cursor-pointer active:scale-95 flex items-center gap-1 ${isSelected
                            ? 'bg-[#3A3A3A] text-white border-[#3A3A3A] shadow-xs'
                            : 'bg-[#F2E9E4]/60 text-stone-700 border-[#E8DDD6] hover:border-[#3A3A3A]'
                            }`}
                        >
                          <span>{label}</span>
                          {item.isWeekend && <span className="text-[10px] text-amber-600">✨</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Horizontal Scrollable Date Strip */}
                  <div className="overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                    <div className="flex items-center gap-2 min-w-max">
                      {upcomingDays.map((item) => {
                        const isSelected = bookingDate === item.dateStr;
                        return (
                          <button
                            key={item.dateStr}
                            type="button"
                            onClick={() => setBookingDate(item.dateStr)}
                            className={`w-[68px] sm:w-[76px] py-2.5 px-1.5 rounded-2xl flex flex-col items-center justify-center transition-all border cursor-pointer active:scale-95 relative ${isSelected
                              ? 'bg-[#3A3A3A] text-white border-[#3A3A3A] ring-2 ring-[#A9BCA7] shadow-md scale-[1.02] z-10'
                              : item.isWeekend
                                ? 'bg-[#F2E9E4] hover:bg-[#EBDDD6] text-stone-800 border-[#DFCFC5]'
                                : 'bg-[#FDFBF7] hover:bg-white text-stone-800 border-[#E8DDD6]'
                              }`}
                          >
                            {/* Day Header */}
                            <span className={`text-[9.5px] font-mono font-bold uppercase tracking-wider ${isSelected ? 'text-[#A9BCA7]' : item.isWeekend ? 'text-[#6E856C]' : 'text-stone-500'}`}>
                              {item.dayShort}
                            </span>

                            {/* Date Number */}
                            <span className={`text-base sm:text-lg font-serif font-bold leading-tight my-0.5 ${isSelected ? 'text-white' : 'text-[#3A3A3A]'}`}>
                              {item.dateNum}
                            </span>

                            {/* Month & Label */}
                            <span className={`text-[9.5px] font-sans font-medium ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                              {item.isToday ? 'Hari Ini' : item.isTomorrow ? 'Besok' : item.monthShort}
                            </span>

                            {item.isWeekend && (
                              <span className="absolute -top-1.5 -right-1 text-[8px] bg-[#6E856C] text-white px-1.5 py-0.2 rounded-full font-sans font-bold leading-tight shadow-2xs">
                                W-End
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Date Input for Any Date */}
                  <div className="pt-2.5 border-t border-[#F2E9E4] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 font-sans text-stone-700">
                      <Calendar className="w-4 h-4 text-[#6E856C] shrink-0" />
                      <span>Tanggal Terpilih: <strong className="text-[#3A3A3A] font-bold">{formatIndonesianDate(bookingDate)}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label className="text-[10.5px] font-serif font-bold text-stone-500 uppercase tracking-wider">
                        Atau Cari Tanggal Lain:
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-[#E8DDD6] text-xs text-[#3A3A3A] font-semibold focus:outline-none focus:border-[#3A3A3A] bg-white cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Room & Studio Type Identifier Banner */}
                {isSelfStudio ? (
                  <div className="p-3.5 sm:p-4 bg-white border border-[#E8DDD6] rounded-2xl flex items-center gap-3 text-xs font-sans shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 shadow-2xs">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-serif font-bold text-[#3A3A3A] uppercase tracking-wider flex items-center gap-2">
                        JADWAL KHUSUS: BILIK SELF STUDIO MANDIRI
                        <span className="text-[9px] bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7] px-2.5 py-0.5 rounded-full font-bold">100% PRIVATE</span>
                      </p>
                      <p className="text-[11px] text-stone-600 mt-0.5">Sesi foto private dengan shutter remote wireless. Jadwal terpisah & tidak bertabrakan dengan Studio Foto.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 sm:p-4 bg-white border border-[#E8DDD6] rounded-2xl flex items-center gap-3 text-xs font-sans shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 shadow-2xs">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-serif font-bold text-[#3A3A3A] uppercase tracking-wider flex items-center gap-2">
                        JADWAL KHUSUS: STUDIO FOTO PROFESIONAL
                        <span className="text-[9px] bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7] px-2.5 py-0.5 rounded-full font-bold">FOTOGRAFER PRO</span>
                      </p>
                      <p className="text-[11px] text-stone-600 mt-0.5">Sesi dipandu & diarahkan langsung oleh tim fotografer profesional di panggung studio.</p>
                    </div>
                  </div>
                )}

                {/* 60 Minutes Duration Badge Notice for 2 Background Packages */}
                {maxBackdrops > 1 && (
                  <div className="p-3 bg-[#F2E9E4]/60 border border-[#E8DDD6] rounded-xl flex items-center justify-between gap-2 text-xs font-sans shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#3A3A3A] text-[#A9BCA7] text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        2x
                      </span>
                      <p className="text-[11px] text-[#3A3A3A] font-medium">
                        Paket 2 Background: Durasi sesi foto dialokasikan <strong>60 Menit (2 Slot Berturut-turut)</strong>.
                      </p>
                    </div>
                    <span className="text-[10.5px] font-mono font-bold bg-white border border-[#E8DDD6] px-2.5 py-0.5 rounded-full text-stone-800 shrink-0">
                      {formattedSessionTime} WIB
                    </span>
                  </div>
                )}

                {/* Time Slots Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5">
                    <label className="text-xs font-serif font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#6E856C]" />
                      PILIH JAM SLOT {isSelfStudio ? 'SELF STUDIO' : 'STUDIO FOTO'} ({activeTimeSlots.length} PILIHAN{maxBackdrops > 1 ? ' • KELIPATAN 1 JAM' : ''}):
                    </label>
                    <span className="text-[10.5px] font-sans font-bold text-[#3A3A3A] bg-white px-3 py-1 rounded-full border border-[#E8DDD6] shadow-2xs">
                      Terpilih: {formattedSessionTime} WIB ({sessionDurationMinutes} Menit)
                    </span>
                  </div>

                  <div className={`grid gap-1.5 sm:gap-2 ${maxBackdrops > 1 ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-7' : 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8'}`}>
                    {activeTimeSlots.map((slot) => {
                      const isStartSlot = timeSlot === slot;
                      const clientCount = getSlotClientCount(slot);
                      const availability = isSlotAvailableForBooking(slot);
                      const maxCap = selectedBranch === 'cabang-2' ? 3 : 1;
                      const isDisabled = !availability.isAvailable;

                      return (
                        <button
                          key={slot}
                          type="button"
                          data-slot={slot}
                          disabled={isDisabled}
                          onClick={() => setTimeSlot(slot)}
                          className={`min-h-[48px] p-1.5 sm:p-2 rounded-xl text-xs font-mono font-bold transition-all text-center flex flex-col items-center justify-center border relative ${isDisabled
                            ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60 line-through'
                            : isStartSlot
                              ? 'bg-[#3A3A3A] text-white border-[#3A3A3A] ring-2 ring-[#A9BCA7] shadow-sm cursor-pointer active:scale-95 z-10'
                              : 'bg-white hover:bg-[#FDFBF7] text-stone-800 border-[#E8DDD6] cursor-pointer active:scale-95'
                            }`}
                          title={!availability.isAvailable ? availability.reason : `Mulai sesi foto jam ${slot} WIB`}
                        >
                          <span className="leading-tight">{slot}</span>
                          {isDisabled ? (
                            <span className="text-[8.5px] font-bold text-rose-500 uppercase mt-0.5 no-underline">
                              Penuh
                            </span>
                          ) : isStartSlot ? (
                            <span className="text-[8px] font-bold text-[#A9BCA7] uppercase mt-0.5 no-underline">
                              {sessionSlotsCount === 2 ? 'Terpilih (1 Jam)' : 'Terpilih'}
                            </span>
                          ) : selectedBranch === 'cabang-2' && clientCount > 0 ? (
                            <span className="text-[8.5px] font-bold text-amber-700 uppercase mt-0.5 no-underline">
                              {clientCount}/3 Terisi
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {/* Alert Sesi Overtime Melebihi Jam 21.00 WIB */}
                  {isLateNightOvertime && (
                    <div className="mt-2.5 p-3.5 bg-amber-500/10 border border-amber-400 rounded-2xl text-amber-950 text-xs font-sans flex items-start gap-2.5 shadow-2xs">
                      <span className="font-bold text-sm shrink-0 mt-0.5 text-amber-700">⏰</span>
                      <div className="space-y-0.5">
                        <p className="font-bold text-amber-900 leading-tight">
                          Tambahan Biaya Sesi Melebihi Jam 21.00 WIB (+Rp 35.000):
                        </p>
                        <p className="text-amber-800 text-[11px] leading-snug">
                          Anda memilih Paket 2 Background (durasi 60 menit dari <strong>20:30 s.d. 21:30 WIB</strong>). Karena sesi melebihi jam operasional tutup studio (21.00 WIB), otomatis dikenakan tambahan biaya operasional overtime sebesar <strong className="text-amber-950 font-bold">Rp 35.000</strong>.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pemberitahuan Keterlambatan / Melebihi Jam 21.00 */}
                  <div className="mt-2.5 p-3.5 bg-[#F2E9E4]/70 border border-[#DFCFC5] rounded-2xl text-amber-950 text-xs font-sans flex items-start gap-2.5 shadow-2xs">
                    <span className="font-bold text-sm shrink-0 mt-0.5 text-[#6E856C]">⚠️</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-stone-900 leading-tight">
                        Pemberitahuan Jam Tutup & Keterlambatan:
                      </p>
                      <p className="text-stone-700 text-[11px] sm:text-xs leading-snug">
                        1. Apabila terjadi keterlambatan durasi akan dipotong sesuai lama keterlambatan<br />
                        2. Difotokan pada background yang tersedia dengan tambahan biaya <strong className="font-bold text-stone-900">Rp. 25.000</strong><br />
                        3. Dipindahkan ke hari berikutnya<br />
                        4. Jika melebihi jam <strong>21.00 WIB</strong> akan dikenakan tambahan biaya sebesar <strong className="font-bold text-stone-900">Rp. 35.000</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Pemilihan Background */}
              <div className="pt-2 border-t border-[#E8DDD6]">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5">
                  <label className="text-xs font-serif font-bold text-[#3A3A3A] uppercase tracking-wider">
                    3. {maxBackdrops > 1 ? 'PILIH 2 BACKGROUND FOTO / PENCAHAYAAN:' : 'PILIH BACKGROUND FOTO / PENCAHAYAAN:'}
                  </label>
                  {maxBackdrops > 1 ? (
                    <span className="text-[10.5px] bg-[#FDFBF7] text-stone-800 border border-[#E8DDD6] font-bold px-3 py-1 rounded-full shadow-2xs">
                      Bebas Pilih 2 Background ({selectedBackdropIds.length}/2 Dipilih)
                    </span>
                  ) : (
                    <span className="text-[10.5px] bg-white text-stone-600 border border-[#E8DDD6] font-medium px-3 py-1 rounded-full shadow-2xs">
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
                        className={`min-h-[56px] p-3 rounded-2xl border text-left flex items-center gap-3 transition-all relative ${!isAvailable && !isSelected
                          ? 'border-stone-200 bg-stone-100/70 text-stone-400 opacity-60 cursor-not-allowed'
                          : isSelected
                            ? 'border-[#3A3A3A] bg-white ring-1 ring-[#3A3A3A] shadow-sm cursor-pointer active:scale-98'
                            : 'border-[#E8DDD6] bg-white hover:bg-[#FDFBF7] cursor-pointer active:scale-98 shadow-2xs'
                          }`}
                      >
                        <div
                          className="w-8 h-8 rounded-xl border border-black/15 shrink-0 flex items-center justify-center text-white text-[11px] font-bold shadow-2xs"
                          style={{ backgroundColor: backdrop.hex }}
                        >
                          {isSelected && maxBackdrops > 1 && (
                            <span className="bg-black/50 w-full h-full rounded-xl flex items-center justify-center font-bold">
                              {selectionIndex + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`font-serif font-bold text-xs truncate ${!isAvailable && !isSelected ? 'text-stone-400 line-through' : 'text-[#3A3A3A]'}`}>
                              {backdrop.name}
                            </span>
                            {backdrop.id === 'c2-tematik-cream' && (
                              <span className="text-[8.5px] font-sans font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.2 rounded-full">
                                Maks. 5 Orang
                              </span>
                            )}
                            {isSelected && maxBackdrops > 1 && (
                              <span className="text-[9px] font-bold bg-[#3A3A3A] text-white px-2 py-0.2 rounded-full">
                                Background {selectionIndex + 1}
                              </span>
                            )}
                            {!isAvailable && !isSelected && (
                              <span className="text-[8.5px] font-bold bg-rose-100 text-rose-700 px-2 py-0.2 rounded-full border border-rose-200">
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
                          <div className="w-5 h-5 rounded-full bg-[#3A3A3A] text-white flex items-center justify-center shrink-0 text-xs shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Info Studio 2: Tematik Cream Maksimal 5 Orang */}
                {selectedBranch === 'cabang-2' && selectedBackdropIds.some(id => id.includes('cream')) && (
                  <div className="mt-2.5 p-3 bg-amber-50/90 border border-amber-300/80 rounded-2xl text-amber-900 text-[11px] font-sans flex items-center gap-2 animate-fadeIn shadow-2xs">
                    <span className="font-bold text-amber-700 text-xs shrink-0">⚠️</span>
                    <span>
                      <strong>Pemberitahuan Khusus Tematik Cream:</strong> Background <em>Tematik Cream (Studio 2)</em> memiliki batasan kapasitas panggung maksimal <strong>5 orang</strong>.
                    </span>
                  </div>
                )}

                {/* Info Studio 1: Limbo vs Putih Tengah */}
                {availableBackdrops.some(b => b.id.includes('limbo')) && availableBackdrops.some(b => b.id.includes('putih-tengah')) && (
                  <div className="mt-2.5 p-3.5 bg-white border border-[#E8DDD6] rounded-2xl text-stone-600 text-[11px] font-sans flex items-center gap-2 shadow-2xs">
                    <span className="font-bold text-[#6E856C]">ℹ️</span>
                    <span>
                      <strong>Catatan Latar Studio:</strong> Background <em>Limbo</em> dan <em>Putih Tengah</em> berbagi area panggung yang sama, sehingga tidak dapat digunakan bersamaan pada jam yang sama atau dalam 1 sesi foto.
                    </span>
                  </div>
                )}

                {/* Helper notice for 2 backdrops */}
                {maxBackdrops > 1 && (
                  <div className={`mt-2.5 p-3.5 border rounded-xl text-xs font-sans flex items-center justify-between gap-2 transition-all shadow-2xs ${selectedBackdropIds.length >= 2
                    ? 'bg-white border-[#3A3A3A] text-[#3A3A3A]'
                    : 'bg-[#F2E9E4] border-[#DFCFC5] text-stone-800'
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

              {/* 4. Pemilihan Template Frame Grid (Khusus Self Studio) */}
              {isSelfStudio && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-serif font-bold text-[#3A3A3A] uppercase tracking-wider">
                      4. PILIH TEMPLATE LAYOUT GRID CETAK:
                    </label>
                    <span className="text-[10px] bg-white text-stone-700 font-bold px-2.5 py-0.5 rounded-full border border-[#E8DDD6] shadow-2xs">
                      Khusus Self Studio
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FRAME_TEMPLATES.map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => setSelectedFrameId(frame.id)}
                        className={`min-h-[46px] p-3 rounded-xl border text-left transition-all cursor-pointer active:scale-98 ${selectedFrameId === frame.id
                          ? 'border-[#3A3A3A] bg-white text-[#3A3A3A] font-bold ring-1 ring-[#3A3A3A] shadow-xs'
                          : 'border-[#E8DDD6] bg-white hover:bg-[#FDFBF7] text-stone-700'
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

          {/* STEP 2: ADD-ONS TAMBAHAN & KODE PROMO */}
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
                    <h4 className="font-serif font-bold text-[#3A3A3A] text-sm sm:text-base uppercase tracking-wide">
                      PILIH LAYANAN TAMBAHAN (ADD-ONS):
                    </h4>
                    <span className="text-[10.5px] bg-white text-stone-800 font-bold px-3 py-1 rounded-full border border-[#E8DDD6] shadow-2xs">
                      {Object.values(selectedAddOns).reduce<number>((a, b) => a + (Number(b) || 0), 0)} Item Terpilih
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-3">
                    Daftar Add-Ons otomatis disesuaikan khusus untuk <strong className="text-stone-800 font-bold">{packageCatInfo.label}</strong>.
                  </p>

                  {/* Header Info Paket Terpilih */}
                  <div className="bg-white border border-[#E8DDD6] rounded-2xl p-4 flex items-center justify-between gap-2.5 mb-3 shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 shadow-2xs">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9.5px] font-serif font-bold text-stone-500 uppercase tracking-widest">
                          KATEGORI PAKET:
                        </div>
                        <div className="text-xs sm:text-sm font-serif font-bold text-[#3A3A3A] truncate">
                          {currentPackage.name}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-serif font-bold uppercase bg-[#3A3A3A] text-white px-3 py-1 rounded-full shrink-0 shadow-2xs">
                      {packageCatInfo.badge}
                    </span>
                  </div>

                  {/* Catatan Khusus Kategori */}
                  {packageCatInfo.note && (
                    <div className="bg-[#F2E9E4] border border-[#DFCFC5] rounded-2xl p-3.5 text-stone-800 text-xs font-sans mb-3.5 flex items-start gap-2 shadow-2xs">
                      <span className="font-bold text-sm shrink-0">ℹ️</span>
                      <span className="leading-relaxed">{packageCatInfo.note}</span>
                    </div>
                  )}

                  {/* List Add-Ons */}
                  {relevantAddOns.length === 0 ? (
                    <div className="p-6 bg-white border border-[#E8DDD6] rounded-2xl text-center space-y-1 shadow-sm">
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
                            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${qty > 0
                              ? 'bg-white border-[#3A3A3A] ring-1 ring-[#3A3A3A] shadow-sm'
                              : 'bg-white hover:border-stone-400 border-[#E8DDD6] shadow-2xs'
                              }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A]">{addOn.name}</span>
                              </div>
                              <div className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-snug">
                                {addOn.description}
                              </div>
                              <div className="text-xs sm:text-sm mt-1 text-[#6E856C] font-bold">
                                Rp {addOn.price.toLocaleString('id-ID')} <span className="text-[11px] text-stone-400 font-normal">/ {addOn.unit}</span>
                              </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-1.5 bg-[#FDFBF7] border border-[#E8DDD6] rounded-xl p-1 shrink-0 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleAddOnQtyChange(addOn.id, -1)}
                                disabled={qty === 0}
                                className="w-8 h-8 rounded-lg bg-white hover:bg-stone-100 disabled:opacity-30 text-stone-700 font-bold text-xs flex items-center justify-center border border-[#E8DDD6] cursor-pointer active:scale-95"
                              >
                                <Minus className="w-3.5 h-3.5 stroke-[2]" />
                              </button>
                              <span className="w-6 text-center font-mono font-bold text-xs text-[#3A3A3A]">{qty}</span>
                              <button
                                type="button"
                                onClick={() => handleAddOnQtyChange(addOn.id, 1)}
                                className="w-8 h-8 rounded-lg bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-bold text-xs flex items-center justify-center border border-[#3A3A3A] cursor-pointer active:scale-95 shadow-xs"
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
                <div className="pt-2 border-t border-[#E8DDD6] space-y-2">
                  <label className="text-xs font-serif font-bold text-[#3A3A3A] uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#6E856C]" />
                    GUNAKAN KODE PROMO DISKON:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: STUDENT10, COUPLE15, ALVIERO"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="flex-1 min-h-[44px] p-3 rounded-xl border border-[#E8DDD6] text-xs font-bold uppercase focus:outline-none focus:border-[#3A3A3A] bg-white"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-serif font-bold text-xs uppercase tracking-wider border border-[#3A3A3A] cursor-pointer active:scale-95 shadow-xs"
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

          {/* STEP 3: DATA PEMESAN, PEMBAYARAN QRIS & BUKTI TRANSFER */}
          {step === 3 && (
            <div className="space-y-5">

              {/* Ringkasan Jadwal & Cabang Terpilih */}
              <div className="bg-white border border-[#E8DDD6] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#E8DDD6] text-[#6E856C] flex items-center justify-center shrink-0 shadow-2xs">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9.5px] font-serif font-bold text-stone-500 uppercase tracking-widest">
                      JADWAL & LOKASI FOTO:
                    </div>
                    <div className="text-xs sm:text-sm font-serif font-bold text-[#3A3A3A] truncate">
                      {bookingDate} • Jam {formattedSessionTime} WIB ({sessionDurationMinutes} Menit)
                    </div>
                    <div className="text-[11px] text-stone-600 font-medium">
                      {currentBranchInfo.name} ({isSelfStudio ? 'Bilik Self Studio' : 'Studio Foto Pro'})
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-1.5 rounded-full bg-[#F2E9E4] hover:bg-white text-stone-800 font-serif font-bold text-[11px] uppercase tracking-wider border border-[#E8DDD6] hover:border-[#3A3A3A] shrink-0 transition-colors cursor-pointer shadow-2xs"
                >
                  Ubah
                </button>
              </div>

              {/* Data Pemesan: Nama & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-serif font-bold text-[#3A3A3A] uppercase mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#6E856C]" />
                    Nama Pemesan:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Anisa Putri"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full min-h-[44px] p-3 rounded-xl border border-[#E8DDD6] text-xs text-[#3A3A3A] focus:outline-none focus:border-[#3A3A3A] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-[#3A3A3A] uppercase mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#6E856C]" />
                    No. WhatsApp Aktif:
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full min-h-[44px] p-3 rounded-xl border border-[#E8DDD6] text-xs text-[#3A3A3A] focus:outline-none focus:border-[#3A3A3A] bg-white"
                  />
                </div>
              </div>

              {/* Opsi Pembayaran (DP 50% vs Lunas Full) */}
              <div className="pt-2 border-t border-[#E8DDD6] space-y-2">
                <label className="text-xs font-serif font-bold text-[#3A3A3A] uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#6E856C]" />
                  OPSI PEMBAYARAN BOOKING:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentOption('dp')}
                    className={`min-h-[56px] p-4 rounded-2xl border text-left font-sans transition-all cursor-pointer active:scale-98 ${paymentOption === 'dp'
                      ? 'border-[#3A3A3A] bg-white ring-1 ring-[#3A3A3A] shadow-sm'
                      : 'border-[#E8DDD6] bg-white text-stone-700 hover:bg-[#FDFBF7] shadow-2xs'
                      }`}
                  >
                    <div className="font-serif font-bold text-xs uppercase text-[#3A3A3A]">Bayar DP 50% Sekarang</div>
                    <div className="text-[10.5px] font-normal text-stone-500 mt-0.5">
                      Transfer DP Rp {dpAmount.toLocaleString('id-ID')} untuk kunci jadwal
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption('full')}
                    className={`min-h-[56px] p-4 rounded-2xl border text-left font-sans transition-all cursor-pointer active:scale-98 ${paymentOption === 'full'
                      ? 'border-[#3A3A3A] bg-white ring-1 ring-[#3A3A3A] shadow-sm'
                      : 'border-[#E8DDD6] bg-white text-stone-700 hover:bg-[#FDFBF7] shadow-2xs'
                      }`}
                  >
                    <div className="font-serif font-bold text-xs uppercase text-[#3A3A3A]">Bayar Lunas / Full</div>
                    <div className="text-[10.5px] font-normal text-stone-500 mt-0.5">
                      Rp {grandTotal.toLocaleString('id-ID')} praktis tanpa sisa di studio
                    </div>
                  </button>
                </div>
              </div>

              {/* QRIS PAYMENT BOX & DOWNLOAD */}
              <div className="pt-2 border-t border-[#E8DDD6] space-y-3">
                <div className="bg-[#FDFBF7] border border-[#E8DDD6] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#E8DDD6] pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#3A3A3A] text-[#A9BCA7] flex items-center justify-center text-xs shrink-0 shadow-xs">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] uppercase tracking-wide">
                          Scan Pembayaran QRIS Resmi Alviero Studio
                        </h4>
                        <p className="text-[10.5px] text-stone-500 font-sans">
                          Mendukung BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay
                        </p>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7] px-2.5 py-0.5 rounded-full shadow-2xs">
                      QRIS Nasional
                    </span>
                  </div>

                  {/* Nominal Box */}
                  <div className="bg-white border border-[#E8DDD6] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                    <div>
                      <span className="text-[10.5px] font-serif uppercase tracking-wider text-stone-500 block">
                        Nominal {paymentOption === 'dp' ? 'DP 50% Yang Harus Ditransfer:' : 'Pelunasan 100% Yang Harus Ditransfer:'}
                      </span>
                      <span className="text-base sm:text-lg font-mono font-black text-[#3A3A3A]">
                        Rp {(paymentOption === 'dp' ? dpAmount : grandTotal).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyNominal}
                      className="px-3.5 py-2 rounded-xl bg-[#F2E9E4] hover:bg-[#EBDDD6] text-stone-800 border border-[#E8DDD6] text-[11px] font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0 shadow-2xs"
                    >
                      {copiedNominal ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNominal ? 'Nominal Tersalin!' : 'Salin Nominal'}</span>
                    </button>
                  </div>

                  {/* QRIS Display & Download Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
                    <div className="sm:col-span-5 flex flex-col items-center">
                      <div className="w-full max-w-[210px] bg-white p-3 rounded-2xl border border-[#3A3A3A] shadow-sm flex flex-col items-center">
                        <img
                          src="/images/qris-alviero.png"
                          alt="QRIS Resmi Alviero Studio"
                          className="w-full h-auto object-contain rounded-lg"
                        />
                      </div>
                      <a
                        href="/images/qris-alviero.png"
                        download="QRIS-Alviero-Studio.png"
                        className="mt-2.5 w-full max-w-[210px] py-2 px-3 rounded-xl bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-serif text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5 text-[#A9BCA7]" />
                        <span>Unduh Kode QRIS 📥</span>
                      </a>
                    </div>

                    <div className="sm:col-span-7 space-y-2 text-xs font-sans text-stone-700 leading-relaxed">
                      <p className="font-bold text-[#3A3A3A] uppercase tracking-wide text-[11px] font-serif">
                        Petunjuk Pembayaran QRIS:
                      </p>
                      <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-stone-600">
                        <li>Klik tombol <strong>"Unduh Kode QRIS 📥"</strong> di atas atau tangkap layar (screenshot).</li>
                        <li>Buka aplikasi <strong>M-Banking (BCA, Mandiri, BRImo, dll)</strong> atau <strong>E-Wallet (GoPay, OVO, Dana, ShopeePay)</strong>.</li>
                        <li>Pilih menu <strong>QRIS ➔ Scan dari Galeri</strong> ➔ pilih gambar QRIS tadi.</li>
                        <li>Ketik nominal transfer: <strong className="text-[#3A3A3A] font-mono">Rp {(paymentOption === 'dp' ? dpAmount : grandTotal).toLocaleString('id-ID')}</strong>.</li>
                        <li>Simpan screenshot bukti transfer dan <strong>unggah pada form di bawah</strong> untuk mengaktifkan tombol kirim.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* UPLOAD BUKTI PEMBAYARAN (WAJIB) */}
              <div className="pt-2 border-t border-[#E8DDD6] space-y-2">
                <label className="text-xs font-serif font-bold text-[#3A3A3A] uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#6E856C]" />
                    UNGGAH BUKTI TRANSFER / BAYAR QRIS: <span className="text-rose-600">*</span>
                  </span>
                  {paymentProofImage ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                      ✅ Bukti Terlampir
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                      Wajib Diunggah
                    </span>
                  )}
                </label>

                {!paymentProofImage ? (
                  <label className="block border-2 border-dashed border-[#A9BCA7] bg-[#FDFBF7] hover:bg-[#F2E9E4] rounded-2xl transition-all p-5 text-center cursor-pointer relative group shadow-2xs">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProofUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1.5">
                      <div className="w-11 h-11 rounded-full bg-[#3A3A3A] text-[#A9BCA7] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-serif font-bold text-[#3A3A3A] uppercase tracking-wide">
                        Klik Di Sini Untuk Memilih Foto Bukti Transfer
                      </p>
                      <p className="text-[10.5px] text-stone-500 font-sans">
                        Mendukung format JPG, PNG, WebP atau Screenshot Struk Pembayaran (Maks. 5MB)
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={paymentProofImage}
                        alt="Preview Bukti Bayar"
                        className="w-14 h-14 object-cover border border-emerald-300 rounded-xl bg-white shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-950 truncate">
                          {paymentProofFileName || 'Bukti-Transfer-QRIS.png'}
                        </p>
                        <p className="text-[10.5px] text-emerald-700 flex items-center gap-1 font-sans">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          Foto bukti transfer siap dikirimkan
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-xl text-[10.5px] font-serif font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-2xs">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProofUpload}
                          className="hidden"
                        />
                        Ganti Foto
                      </label>
                      <button
                        type="button"
                        onClick={handleRemoveProof}
                        className="p-2 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                        title="Hapus Bukti"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Catatan Khusus */}
              <div>
                <label className="block text-xs font-serif font-bold text-[#3A3A3A] uppercase mb-1.5">
                  Catatan Khusus (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Misal: Perayaan ulang tahun / minta disiapkan properti toga wisuda"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[44px] p-3 rounded-xl border border-[#E8DDD6] text-xs text-[#3A3A3A] focus:outline-none focus:border-[#3A3A3A] bg-white"
                />
              </div>

              {/* Alert Konfirmasi Pembayaran Admin via WhatsApp */}
              <div className="p-4 bg-white border border-[#E8DDD6] rounded-2xl flex items-start gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                  <WhatsAppIcon className="w-5 h-5 fill-[#25D366]" />
                </div>
                <div className="flex-1 text-xs font-sans">
                  <p className="font-bold text-[#3A3A3A] leading-relaxed">
                    Bukti pembayaran akan otomatis diverifikasi oleh admin via WhatsApp untuk mengunci slot jadwal Anda.
                  </p>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Pastikan nominal transfer sesuai dan lampiran bukti bayar sudah jelas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* RINCIAN BIAYA SUMMARY BOX */}
          <div className="bg-[#2A2A2A] text-white p-4 sm:p-5 rounded-2xl border border-[#3A3A3A] space-y-3 shadow-sm">
            <div className="flex justify-between items-center text-xs text-stone-300 border-b border-[#3A3A3A] pb-2">
              <span className="font-serif uppercase tracking-wider text-stone-400">RINCIAN RESERVASI:</span>
              <span className="text-[#A9BCA7] font-serif font-bold uppercase">{currentPackage.name}</span>
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

              {lateNightOvertimeFee > 0 && (
                <div className="flex justify-between text-amber-300 font-medium">
                  <span>Tambahan Melebihi Jam 21.00 WIB (Overtime)</span>
                  <span>+ Rp {lateNightOvertimeFee.toLocaleString('id-ID')}</span>
                </div>
              )}

              {discountValue > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Diskon Promo ({appliedPromo?.code})</span>
                  <span>- Rp {discountValue.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-serif font-bold text-white pt-2.5 border-t border-[#3A3A3A]">
                <span className="uppercase tracking-wider">TOTAL ESTIMASI BIAYA</span>
                <span className="text-[#A9BCA7]">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>

              {paymentOption === 'dp' && (
                <div className="text-[11px] text-[#A9BCA7] pt-1 text-right font-sans">
                  Minimum Transfer DP 50%: <strong>Rp {dpAmount.toLocaleString('id-ID')}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER CONTROLS */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8DDD6] flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleCopySummary}
            className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-serif uppercase tracking-wider bg-white text-stone-800 border border-[#E8DDD6] hover:bg-[#FDFBF7] transition-colors flex items-center gap-2 cursor-pointer active:scale-95 shadow-2xs"
          >
            {copiedSummary ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedSummary ? 'Tersalin' : 'Salin Rincian'}</span>
          </button>

          <div className="flex items-center gap-2">
            {step > 1 ? (
              <button
                onClick={() => goToStep(step - 1)}
                className="min-h-[44px] px-5 py-2 rounded-xl text-xs font-serif uppercase tracking-wider bg-white text-stone-800 border border-[#E8DDD6] hover:bg-[#FDFBF7] transition-colors cursor-pointer active:scale-95 shadow-2xs"
              >
                Kembali
              </button>
            ) : (
              <button
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-serif uppercase tracking-wider text-stone-500 hover:text-stone-800 transition-colors cursor-pointer active:scale-95"
              >
                Batal
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => goToStep(step + 1)}
                className="min-h-[44px] px-6 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white border border-[#3A3A3A] shadow-xs flex items-center gap-2 transition-colors cursor-pointer active:scale-95"
              >
                <span>Lanjut</span>
                <ChevronRight className="w-4 h-4 stroke-[2]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendBookingWA}
                disabled={!canSubmitBooking}
                className={`min-h-[44px] px-6 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${canSubmitBooking
                  ? 'bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white border border-[#3A3A3A] shadow-md cursor-pointer active:scale-95'
                  : 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed opacity-75'
                  }`}
                title={!canSubmitBooking ? 'Lengkapi Nama, WhatsApp, dan Unggah Bukti Bayar' : 'Kirim Booking ke WhatsApp Admin'}
              >
                <WhatsAppIcon className={`w-4.5 h-4.5 ${canSubmitBooking ? 'fill-[#25D366]' : 'fill-stone-400'}`} />
                <span>Kirim Booking WA →</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
