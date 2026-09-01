import React, { useState, useEffect } from 'react';
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

  // b. Pasangan Putih dan Abu-abu TIDAK BOLEH dipilih sekaligus oleh 1 klien yang sama (paket 2 BG)
  const isC2WhiteA = a === 'c2-putih' || a.includes('c2-putih') || a.includes('c2-pro-putih');
  const isC2GrayA = a === 'c2-abu-abu' || a.includes('c2-abu');
  const isC2WhiteB = b === 'c2-putih' || b.includes('c2-putih') || b.includes('c2-pro-putih');
  const isC2GrayB = b === 'c2-abu-abu' || b.includes('c2-abu');

  if ((isC2WhiteA && isC2GrayB) || (isC2GrayA && isC2WhiteB)) {
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
 * 3. Bentrok Posisi: Coklat & Cream saling bertabrakan (mutually exclusive).
 *    - Jika Coklat terisi -> Cream otomatis tidak tersedia.
 *    - Jika Cream terisi -> Coklat otomatis tidak tersedia.
 */
export const getAvailableBackgroundsStudio2 = (
  existingBookings: string[] = []
): Studio2BackdropAvailabilityResult => {
  const STUDIO_2_BGS = [
    { id: 'c2-hitam', name: 'Hitam' },
    { id: 'c2-putih', name: 'Putih' },
    { id: 'c2-abu-abu', name: 'Abu-abu' },
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
    const isDirectlyBooked = bookedSet.has(bg.id);
    let isClashed = false;
    let clashReason = '';

    if (isDirectlyBooked) {
      lockedReasons[bg.id] = `Sudah dipilih oleh klien lain di jam ini`;
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
    } else {
      availableIds.push(bg.id);
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
 * 
 * Aturan Dasar & Kuota Background (Studio 2 - Paket 2):
 * 1. Dalam 1 slot waktu, maksimal ada 3 klien. Setiap klien memilih 2 background (Total 6 pilihan BG).
 * 2. Kuota Maksimal per Background dalam 1 jam yang sama:
 *    - Hitam   : Kuota 2 (bisa dipilih oleh 2 klien berbeda)
 *    - Putih   : Kuota 1
 *    - Abu-abu : Kuota 1
 *    - Coklat  : Kuota 1
 *    - Cream   : Kuota 1
 */
export const checkPaket2Availability = (
  existingBookings: string[] = []
): Paket2AvailabilityResult => {
  const usageCounts: { [id: string]: number } = {
    'c2-hitam': 0,
    'c2-putih': 0,
    'c2-abu-abu': 0,
    'c2-coklat-jendela': 0,
    'c2-tematik-cream': 0
  };

  existingBookings.forEach(booking => {
    const text = String(booking || '').toLowerCase();

    // Deteksi Hitam
    const hitamMatches = (text.match(/hitam/g) || []).length;
    usageCounts['c2-hitam'] += hitamMatches;

    // Deteksi Putih
    const putihMatches = (text.match(/putih/g) || []).length;
    usageCounts['c2-putih'] += putihMatches;

    // Deteksi Abu-abu (hindari double count dari 'abu-abu')
    const abuMatches = (text.match(/abu-abu|abu_abu|\babu\b|c2-abu/g) || []).length;
    usageCounts['c2-abu-abu'] += abuMatches;

    // Deteksi Coklat
    const coklatMatches = (text.match(/coklat|cokelat/g) || []).length;
    usageCounts['c2-coklat-jendela'] += coklatMatches;

    // Deteksi Cream
    const creamMatches = (text.match(/cream|krem/g) || []).length;
    usageCounts['c2-tematik-cream'] += creamMatches;
  });

  const usedHitam = usageCounts['c2-hitam'];
  const usedCoklat = usageCounts['c2-coklat-jendela'];
  const usedPutih = usageCounts['c2-putih'];
  const usedAbu = usageCounts['c2-abu-abu'];
  const usedCream = usageCounts['c2-tematik-cream'];

  // Evaluasi Kuota Statis (Putih: 1, Abu-abu: 1, Cream: 1)
  const maxPutih = 1;
  const maxAbu = 1;
  const maxCream = 1;

  const remainingPutih = Math.max(0, maxPutih - usedPutih);
  const remainingAbu = Math.max(0, maxAbu - usedAbu);
  const remainingCream = Math.max(0, maxCream - usedCream);

  // Evaluasi Kuota Dinamis (Hitam & Coklat: Masing-masing max 2, Total gabungan <= 3)
  const totalHitamCoklat = usedHitam + usedCoklat;

  let remainingHitam = 0;
  if (usedHitam < 2 && totalHitamCoklat < 3) {
    remainingHitam = Math.min(2 - usedHitam, 3 - totalHitamCoklat);
  }

  let remainingCoklat = 0;
  if (usedCoklat < 2 && totalHitamCoklat < 3) {
    remainingCoklat = Math.min(2 - usedCoklat, 3 - totalHitamCoklat);
  }

  const BG_DEFINITIONS = [
    { id: 'c2-hitam', name: 'Hitam', maxQuota: 2, used: usedHitam, remaining: remainingHitam },
    { id: 'c2-putih', name: 'Putih', maxQuota: maxPutih, used: usedPutih, remaining: remainingPutih },
    { id: 'c2-abu-abu', name: 'Abu-abu', maxQuota: maxAbu, used: usedAbu, remaining: remainingAbu },
    { id: 'c2-coklat-jendela', name: 'Coklat Jendela', maxQuota: 2, used: usedCoklat, remaining: remainingCoklat },
    { id: 'c2-tematik-cream', name: 'Tematik Cream', maxQuota: maxCream, used: usedCream, remaining: remainingCream }
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
      if ((bg.id === 'c2-hitam' || bg.id === 'c2-coklat-jendela') && totalHitamCoklat >= 3) {
        reason = `Kuota gabungan Hitam & Coklat sudah maksimal 3 (${usedHitam} Hitam + ${usedCoklat} Coklat)`;
      } else {
        reason = `Kuota habis (${bg.used}/${bg.maxQuota} sudah terpakai di jam ini)`;
      }
      lockedReasons[bg.id] = reason;
    } else {
      availableIds.push(bg.id);
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
  backgrounds: { [id: string]: BackgroundQuotaStatus & { group: string } };
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
 * Logika Validasi Ketersediaan Background Studio 2 dengan Aturan "Kuota Dinamis Ganda"
 * 
 * Aturan Kuota Dinamis Ganda:
 * 1. Grup 1: Hitam & Coklat (Maksimal Gabungan = 3, Masing-masing max 2)
 *    - countHitam + countCoklat <= 3
 *    - Jika Hitam terpilih 2x -> Kuota Coklat tersisa 1
 *    - Jika Coklat terpilih 2x -> Kuota Hitam tersisa 1
 * 
 * 2. Grup 2: Putih & Abu-abu (Maksimal Gabungan = 2, Masing-masing max 2)
 *    - countPutih + countAbu <= 2
 *    - Jika Putih terpilih 2x -> Abu-abu menjadi 0 (Tidak Tersedia)
 *    - Jika Abu-abu terpilih 2x -> Putih menjadi 0 (Tidak Tersedia)
 *    - Jika Putih terpilih 1x -> Abu-abu tersisa 1x (dan sebaliknya)
 * 
 * 3. Grup 3: Cream
 *    - Kuota statis maksimal 1
 */
export const checkDualDynamicAvailability = (
  existingBookings: string[] = []
): DualDynamicAvailabilityResult => {
  // 1. Ekstrak Jumlah Pemakaian Tiap Background dari Reservasi yang Ada
  const usageCounts: { [id: string]: number } = {
    'c2-hitam': 0,
    'c2-putih': 0,
    'c2-abu-abu': 0,
    'c2-coklat-jendela': 0,
    'c2-tematik-cream': 0
  };

  existingBookings.forEach(booking => {
    const text = String(booking || '').toLowerCase();

    // Hitung Pemakaian Hitam
    const hitamCount = (text.match(/hitam/g) || []).length;
    usageCounts['c2-hitam'] += hitamCount;

    // Hitung Pemakaian Putih
    const putihCount = (text.match(/putih/g) || []).length;
    usageCounts['c2-putih'] += putihCount;

    // Hitung Pemakaian Abu-abu (hindari double count dari kata 'abu-abu')
    const abuCount = (text.match(/abu-abu|abu_abu|\babu\b|c2-abu/g) || []).length;
    usageCounts['c2-abu-abu'] += abuCount;

    // Hitung Pemakaian Coklat
    const coklatCount = (text.match(/coklat|cokelat/g) || []).length;
    usageCounts['c2-coklat-jendela'] += coklatCount;

    // Hitung Pemakaian Cream
    const creamCount = (text.match(/cream|krem/g) || []).length;
    usageCounts['c2-tematik-cream'] += creamCount;
  });

  const usedHitam = usageCounts['c2-hitam'];
  const usedCoklat = usageCounts['c2-coklat-jendela'];
  const usedPutih = usageCounts['c2-putih'];
  const usedAbu = usageCounts['c2-abu-abu'];
  const usedCream = usageCounts['c2-tematik-cream'];

  // =========================================================================
  // 2. Perhitungan Matematika Grup Dinamis
  // =========================================================================

  // Grup 1: Hitam & Coklat (Max individual = 2, Total gabungan <= 3)
  const totalHitamCoklat = usedHitam + usedCoklat;
  let remainingHitam = 0;
  if (usedHitam < 2 && totalHitamCoklat < 3) {
    remainingHitam = Math.min(2 - usedHitam, 3 - totalHitamCoklat);
  }

  let remainingCoklat = 0;
  if (usedCoklat < 2 && totalHitamCoklat < 3) {
    remainingCoklat = Math.min(2 - usedCoklat, 3 - totalHitamCoklat);
  }

  // Grup 2: Putih & Abu-abu (Max individual = 2, Total gabungan <= 2)
  const totalPutihAbu = usedPutih + usedAbu;
  let remainingPutih = 0;
  if (usedPutih < 2 && totalPutihAbu < 2) {
    remainingPutih = Math.min(2 - usedPutih, 2 - totalPutihAbu);
  }

  let remainingAbu = 0;
  if (usedAbu < 2 && totalPutihAbu < 2) {
    remainingAbu = Math.min(2 - usedAbu, 2 - totalPutihAbu);
  }

  // Grup 3: Cream (Statis max 1)
  const remainingCream = Math.max(0, 1 - usedCream);

  // =========================================================================
  // 3. Struktur Output Ketersediaan untuk UI
  // =========================================================================
  const BG_DEFINITIONS = [
    { id: 'c2-hitam', name: 'Hitam', maxQuota: 2, used: usedHitam, remaining: remainingHitam, group: 'Grup 1 (Hitam+Coklat <= 3)' },
    { id: 'c2-putih', name: 'Putih', maxQuota: 2, used: usedPutih, remaining: remainingPutih, group: 'Grup 2 (Putih+Abu <= 2)' },
    { id: 'c2-abu-abu', name: 'Abu-abu', maxQuota: 2, used: usedAbu, remaining: remainingAbu, group: 'Grup 2 (Putih+Abu <= 2)' },
    { id: 'c2-coklat-jendela', name: 'Coklat Jendela', maxQuota: 2, used: usedCoklat, remaining: remainingCoklat, group: 'Grup 1 (Hitam+Coklat <= 3)' },
    { id: 'c2-tematik-cream', name: 'Tematik Cream', maxQuota: 1, used: usedCream, remaining: remainingCream, group: 'Grup 3 (Cream <= 1)' }
  ];

  const availableIds: string[] = [];
  const availableNames: string[] = [];
  const backgrounds: { [id: string]: BackgroundQuotaStatus & { group: string } } = {};
  const lockedReasons: { [id: string]: string } = {};

  BG_DEFINITIONS.forEach(bg => {
    const isAvailable = bg.remaining > 0;
    const status: 'Tersedia' | 'Tidak Tersedia' = isAvailable ? 'Tersedia' : 'Tidak Tersedia';
    let reason: string | undefined = undefined;

    if (!isAvailable) {
      if ((bg.id === 'c2-hitam' || bg.id === 'c2-coklat-jendela') && totalHitamCoklat >= 3) {
        reason = `Batas gabungan Hitam & Coklat telah mencapai 3 (${usedHitam} Hitam + ${usedCoklat} Coklat)`;
      } else if ((bg.id === 'c2-putih' || bg.id === 'c2-abu-abu') && totalPutihAbu >= 2) {
        reason = `Batas gabungan Putih & Abu-abu telah mencapai 2 (${usedPutih} Putih + ${usedAbu} Abu-abu)`;
      } else {
        reason = `Kuota background habis (${bg.used}/${bg.maxQuota} sudah terpakai di jam ini)`;
      }
      lockedReasons[bg.id] = reason;
    } else {
      availableIds.push(bg.id);
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
  });

  return {
    availableIds,
    availableNames,
    backgrounds,
    lockedReasons,
    groupStats: {
      grup1_HitamCoklat: { used: totalHitamCoklat, max: 3, remaining: Math.max(0, 3 - totalHitamCoklat) },
      grup2_PutihAbu: { used: totalPutihAbu, max: 2, remaining: Math.max(0, 2 - totalPutihAbu) },
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

// =============================================================================
// KOMPONEN UTAMA BOOKING CALCULATOR
// =============================================================================

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
  const studioTypeKey = isSelfStudio ? 'selfstudio' : 'studio_foto';
  const activeTimeSlots = isSelfStudio ? SELF_STUDIO_TIME_SLOTS : PRO_STUDIO_TIME_SLOTS;

  // Durasi Sesi Foto: Jika paket 2 keatas (2 background) durasi = 50 Menit (2 slot berturut-turut)
  const sessionDurationMinutes = maxBackdrops > 1 ? 50 : 25;
  const sessionSlotsCount = maxBackdrops > 1 ? 2 : 1;

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

  // Mendapatkan slot-slot yang terpakai oleh durasi sesi foto
  const getOccupiedSlotsForStart = (startSlot: string): string[] => {
    const startIndex = activeTimeSlots.indexOf(normalizeSlotTime(startSlot));
    if (startIndex === -1) return [startSlot];
    return activeTimeSlots.slice(startIndex, startIndex + sessionSlotsCount);
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

  // Mengecek apakah suatu slot valid untuk dijadikan jam mulai reservasi
  const isSlotAvailableForBooking = (startSlot: string): { isAvailable: boolean; reason?: string } => {
    const startIndex = activeTimeSlots.indexOf(normalizeSlotTime(startSlot));
    if (startIndex === -1) return { isAvailable: false, reason: 'Slot tidak valid' };

    // Sesi 50 menit di jam 20:30 (slot terakhir) diizinkan dengan biaya tambahan lembur/overtime Rp 35.000
    const neededSlots = activeTimeSlots.slice(startIndex, startIndex + sessionSlotsCount);
    for (let i = 0; i < neededSlots.length; i++) {
      const s = neededSlots[i];
      const count = getSlotClientCount(s);
      if (count >= 3) {
        return {
          isAvailable: false,
          reason: i === 0 ? 'Penuh' : `Slot lanjutan (${s}) penuh`
        };
      }
    }

    return { isAvailable: true };
  };

  const formattedSessionTime = `${timeSlot} - ${calculateEndTime(timeSlot, sessionDurationMinutes)}`;
  const currentOccupiedSlots = getOccupiedSlotsForStart(timeSlot);

  // Otomatis pindah ke slot yang tersedia jika slot yang sedang aktif ternyata tidak valid / penuh
  useEffect(() => {
    const currentAvailability = isSlotAvailableForBooking(timeSlot);
    if (!currentAvailability.isAvailable) {
      const firstAvailable = activeTimeSlots.find(s => isSlotAvailableForBooking(s).isAvailable);
      if (firstAvailable) setTimeSlot(firstAvailable);
    }
  }, [slotClientCounts, slotBackdrops, activeTimeSlots, timeSlot, sessionSlotsCount]);

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
            alert(`Latar ${BACKDROPS.find(b => b.id === id)?.name} dan ${BACKDROPS.find(b => b.id === selectedBackdropIds[0])?.name} berada di area panggung yang sama sehingga tidak bisa dipilih bersamaan.`);
            return;
          }
          setSelectedBackdropIds([...selectedBackdropIds, id]);
        } else {
          if (isConflictingBackdrop(selectedBackdropIds[0], id)) {
            alert(`Latar ${BACKDROPS.find(b => b.id === id)?.name} tidak bisa digabung dengan ${BACKDROPS.find(b => b.id === selectedBackdropIds[0])?.name} (area panggung sama).`);
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
    ? `Latar 1: ${selectedBackdropObjects[0]?.name} & Latar 2: ${selectedBackdropObjects[1]?.name}`
    : (selectedBackdropObjects[0]?.name || availableBackdrops[0]?.name || 'Latar Standar');

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
      message += `⏰ *BIAYA TAMBAHAN OVERTIME:* +Rp 35.000 (Sesi 50 Menit Melebihi Jam 21.00 WIB)\n\n`;
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
      <div className="bg-[#FAF8F5] max-w-3xl w-full border-x-0 sm:border sm:border-[#D5CEC2] shadow-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[94vh] my-auto relative text-left">

        {/* Modal Header (Luxury Editorial Charcoal & Gold) */}
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

        {/* Step Navigation Bar */}
        <div className="bg-white border-b border-[#E0D9CE] px-3 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between text-xs font-serif uppercase tracking-wider overflow-x-auto shrink-0">
          <div className="flex items-center gap-2 w-full justify-between sm:justify-start">
            <button
              onClick={() => setStep(1)}
              className={`px-3.5 py-1.5 flex items-center gap-2 shrink-0 cursor-pointer transition-all border ${step === 1
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
              className={`px-3.5 py-1.5 flex items-center gap-2 shrink-0 cursor-pointer transition-all border ${step === 2
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
              className={`px-3.5 py-1.5 flex items-center gap-2 shrink-0 cursor-pointer transition-all border ${step === 3
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

          {/* ================================================================= */}
          {/* STEP 1: PILIH PAKET, CABANG, JADWAL & LATAR                       */}
          {/* ================================================================= */}
          {step === 1 && (
            <div className="space-y-5">

              {/* Branch Selector in Step 1 */}
              <div className="bg-white border border-[#E0D9CE] p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#FAF8F5] border border-[#E0D9CE] text-[#1C1A17] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#8C6D46] stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[9.5px] font-serif font-bold text-stone-500 uppercase tracking-widest">
                      LOKASI STUDIO AKTIF:
                    </div>
                    <div className="text-xs sm:text-sm font-serif font-bold text-[#1C1A17] truncate">
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
                      className={`px-2.5 sm:px-3.5 py-2 sm:py-1.5 text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-wider transition-all cursor-pointer border text-center flex items-center justify-center truncate ${selectedBranch === b.id
                        ? 'bg-[#1C1A17] text-white border-[#1C1A17] shadow-xs'
                        : 'bg-[#FAF8F5] text-stone-700 border-[#D5CEC2] hover:border-[#1C1A17]'
                        }`}
                    >
                      {b.shortName.replace('Alviero Studio — ', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Pilih Paket Utama */}
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

              {/* 2. Pilih Tanggal & Waktu Sesi Foto */}
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="text-xs font-serif font-bold text-[#1C1A17] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#8C6D46]" />
                    2. PILIH TANGGAL & WAKTU SESI FOTO:
                  </label>
                  <span className="text-[11px] font-sans font-bold text-[#1C1A17] bg-white px-3 py-1 border border-[#E0D9CE]">
                    {bookingDate} • {formattedSessionTime} WIB ({sessionDurationMinutes} Menit)
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

                {/* 50 Minutes Duration Badge Notice for 2 Background Packages */}
                {maxBackdrops > 1 && (
                  <div className="p-2.5 bg-[#FAF8F5] border border-[#D5CEC2] flex items-center justify-between gap-2 text-xs font-sans shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#1C1A17] text-[#D4AF37] text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        2x
                      </span>
                      <p className="text-[11px] text-[#1C1A17] font-medium">
                        Paket 2 Background: Durasi sesi foto dialokasikan <strong>50 Menit (2 Slot Berturut-turut)</strong>.
                      </p>
                    </div>
                    <span className="text-[10.5px] font-mono font-bold bg-white border border-[#E0D9CE] px-2 py-0.5 text-stone-800 shrink-0">
                      {formattedSessionTime} WIB
                    </span>
                  </div>
                )}

                {/* Time Slots Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5">
                    <label className="text-xs font-serif font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8C6D46]" />
                      PILIH JAM SLOT {isSelfStudio ? 'SELF STUDIO' : 'STUDIO FOTO'} ({activeTimeSlots.length} PILIHAN):
                    </label>
                    <span className="text-[10.5px] font-sans font-bold text-[#1C1A17] bg-white px-2.5 py-0.5 border border-[#E0D9CE]">
                      Terpilih: {formattedSessionTime} WIB ({sessionDurationMinutes} Menit)
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 sm:gap-2">
                    {activeTimeSlots.map((slot) => {
                      const isStartSlot = timeSlot === slot;
                      const isSecondSlot = sessionSlotsCount === 2 && currentOccupiedSlots.length > 1 && currentOccupiedSlots[1] === slot;
                      const clientCount = getSlotClientCount(slot);
                      const availability = isSlotAvailableForBooking(slot);
                      const isSlotFull = clientCount >= 3;
                      const isDisabled = !availability.isAvailable;

                      return (
                        <button
                          key={slot}
                          type="button"
                          data-slot={slot}
                          disabled={isDisabled}
                          onClick={() => setTimeSlot(slot)}
                          className={`min-h-[48px] p-1.5 sm:p-2 text-xs font-mono font-bold transition-all text-center flex flex-col items-center justify-center border relative ${isDisabled
                            ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60 line-through'
                            : isStartSlot
                              ? 'bg-[#1C1A17] text-white border-[#1C1A17] ring-2 ring-[#D4AF37] shadow-sm cursor-pointer active:scale-95 z-10'
                              : isSecondSlot
                                ? 'bg-[#2D2A26] text-white border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-xs cursor-pointer active:scale-95'
                                : 'bg-white hover:bg-[#FAF8F5] text-stone-800 border-[#E0D9CE] cursor-pointer active:scale-95'
                            }`}
                          title={!availability.isAvailable ? availability.reason : `Mulai sesi foto jam ${slot} WIB`}
                        >
                          <span className="leading-tight">{slot}</span>
                          {isSlotFull ? (
                            <span className="text-[8.5px] font-bold text-rose-500 uppercase mt-0.5 no-underline">
                              Penuh
                            </span>
                          ) : isStartSlot ? (
                            <span className="text-[8px] font-bold text-[#D4AF37] uppercase mt-0.5 no-underline">
                              {sessionSlotsCount === 2 ? 'Mulai (1/2)' : 'Terpilih'}
                            </span>
                          ) : isSecondSlot ? (
                            <span className="text-[8px] font-bold text-[#D4AF37] uppercase mt-0.5 no-underline">
                              Sesi 2
                            </span>
                          ) : slot === '20:30' && sessionSlotsCount === 2 ? (
                            <span className="text-[7.5px] font-bold text-amber-700 uppercase mt-0.5 no-underline">
                              +35rb
                            </span>
                          ) : clientCount > 0 ? (
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
                    <div className="mt-2.5 p-3 bg-amber-500/10 border border-amber-400 text-amber-950 text-xs font-sans flex items-start gap-2.5 shadow-2xs">
                      <span className="font-bold text-sm shrink-0 mt-0.5 text-amber-700">⏰</span>
                      <div className="space-y-0.5">
                        <p className="font-bold text-amber-900 leading-tight">
                          Tambahan Biaya Sesi Melebihi Jam 21.00 WIB (+Rp 35.000):
                        </p>
                        <p className="text-amber-800 text-[11px] leading-snug">
                          Anda memilih Paket 2 Background (durasi 50 menit dari <strong>20:30 s.d. 21:20 WIB</strong>). Karena sesi melebihi jam operasional tutup studio (21.00 WIB), otomatis dikenakan tambahan biaya operasional overtime sebesar <strong className="text-amber-950 font-bold">Rp 35.000</strong>.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pemberitahuan Keterlambatan / Melebihi Jam 21.00 */}
                  <div className="mt-2.5 p-3 bg-amber-50/95 border border-amber-300/90 text-amber-950 text-xs font-sans flex items-start gap-2.5 shadow-2xs">
                    <span className="font-bold text-sm shrink-0 mt-0.5 text-amber-700">⚠️</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-amber-900 leading-tight">
                        Pemberitahuan Jam Tutup & Keterlambatan:
                      </p>
                      <p className="text-amber-800 text-[11px] sm:text-xs leading-snug">
                        1. Apabila terjadi keterlambatan durasi akan dipotong sesuai lama keterlambatan<br />
                        2. Difotokan pada background yang tersedia dengan tambahan biaya <strong className="font-bold text-amber-950">Rp. 25.000</strong><br />
                        3. Dipindahkan ke hari berikutnya<br />
                        4. Jika melebihi jam <strong>21.00 WIB</strong> akan dikenakan tambahan biaya sebesar <strong className="font-bold text-amber-950">Rp. 35.000</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Pemilihan Background */}
              <div className="pt-2 border-t border-[#E0D9CE]">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5">
                  <label className="text-xs font-serif font-bold text-[#1C1A17] uppercase tracking-wider">
                    3. {maxBackdrops > 1 ? 'PILIH 2 LATAR BELAKANG / PENCAHAYAAN (BACKGROUND):' : 'PILIH PENCAHAYAAN / LATAR BELAKANG (BACKGROUND):'}
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
                        className={`min-h-[56px] p-3 border text-left flex items-center gap-3 transition-all relative ${!isAvailable && !isSelected
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
                            {backdrop.id === 'c2-tematik-cream' && (
                              <span className="text-[8.5px] font-sans font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2">
                                Maks. 5 Orang
                              </span>
                            )}
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

                {/* Info Studio 2: Tematik Cream Maksimal 5 Orang (Hanya muncul jika background Cream dipilih) */}
                {selectedBranch === 'cabang-2' && selectedBackdropIds.some(id => id.includes('cream')) && (
                  <div className="mt-2.5 p-2.5 bg-amber-50/90 border border-amber-300/80 text-amber-900 text-[11px] font-sans flex items-center gap-2 animate-fadeIn">
                    <span className="font-bold text-amber-700 text-xs shrink-0">⚠️</span>
                    <span>
                      <strong>Pemberitahuan Khusus Tematik Cream:</strong> Background <em>Tematik Cream (Studio 2)</em> memiliki batasan kapasitas panggung maksimal <strong>5 orang</strong>.
                    </span>
                  </div>
                )}

                {/* Info Studio 1: Limbo vs Putih Tengah */}
                {availableBackdrops.some(b => b.id.includes('limbo')) && availableBackdrops.some(b => b.id.includes('putih-tengah')) && (
                  <div className="mt-2.5 p-3 bg-white border border-[#E0D9CE] text-stone-600 text-[11px] font-sans flex items-center gap-2">
                    <span className="font-bold text-[#8C6D46]">ℹ️</span>
                    <span>
                      <strong>Catatan Latar Studio:</strong> Background <em>Limbo</em> dan <em>Putih Tengah</em> berbagi area panggung yang sama, sehingga tidak dapat digunakan bersamaan pada jam yang sama atau dalam 1 sesi foto.
                    </span>
                  </div>
                )}

                {/* Helper notice for 2 backdrops */}
                {maxBackdrops > 1 && (
                  <div className={`mt-2.5 p-3 border text-xs font-sans flex items-center justify-between gap-2 transition-all ${selectedBackdropIds.length >= 2
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

              {/* 4. Pemilihan Template Frame Grid (Khusus Self Studio) */}
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
                        className={`min-h-[46px] p-3 border text-left transition-all cursor-pointer active:scale-98 ${selectedFrameId === frame.id
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

          {/* ================================================================= */}
          {/* STEP 2: ADD-ONS TAMBAHAN & KODE PROMO                             */}
          {/* ================================================================= */}
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

                  {/* Catatan Khusus Kategori */}
                  {packageCatInfo.note && (
                    <div className="bg-amber-50 border border-amber-300 p-3 text-amber-900 text-xs font-sans mb-3.5 flex items-start gap-2">
                      <span className="font-bold text-sm shrink-0">ℹ️</span>
                      <span className="leading-relaxed">{packageCatInfo.note}</span>
                    </div>
                  )}

                  {/* List Add-Ons */}
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
                            className={`p-3.5 border transition-all flex items-center justify-between gap-3 ${qty > 0
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

          {/* ================================================================= */}
          {/* STEP 3: DATA PEMESAN, PEMBAYARAN QRIS & BUKTI TRANSFER            */}
          {/* ================================================================= */}
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

              {/* Opsi Pembayaran (DP 50% vs Lunas Full) */}
              <div className="pt-2 border-t border-[#E0D9CE] space-y-2">
                <label className="text-xs font-serif font-bold text-[#1C1A17] uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#8C6D46]" />
                  OPSI PEMBAYARAN BOOKING:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentOption('dp')}
                    className={`min-h-[56px] p-3.5 border text-left font-sans transition-all cursor-pointer active:scale-98 ${paymentOption === 'dp'
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
                    className={`min-h-[56px] p-3.5 border text-left font-sans transition-all cursor-pointer active:scale-98 ${paymentOption === 'full'
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

              {/* QRIS PAYMENT BOX & DOWNLOAD */}
              <div className="pt-2 border-t border-[#E0D9CE] space-y-3">
                <div className="bg-[#FAF8F5] border border-[#E0D9CE] p-4 sm:p-5 space-y-3.5 shadow-2xs">
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#E0D9CE] pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#1C1A17] text-[#D4AF37] flex items-center justify-center text-xs shrink-0">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1C1A17] uppercase tracking-wide">
                          Scan Pembayaran QRIS Resmi Alviero Studio
                        </h4>
                        <p className="text-[10.5px] text-stone-500 font-sans">
                          Mendukung BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay
                        </p>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider bg-white text-emerald-800 border border-emerald-300 px-2 py-0.5">
                      QRIS Nasional
                    </span>
                  </div>

                  {/* Nominal Box */}
                  <div className="bg-white border border-[#D5CEC2] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                    <div>
                      <span className="text-[10.5px] font-serif uppercase tracking-wider text-stone-500 block">
                        Nominal {paymentOption === 'dp' ? 'DP 50% Yang Harus Ditransfer:' : 'Pelunasan 100% Yang Harus Ditransfer:'}
                      </span>
                      <span className="text-base sm:text-lg font-mono font-black text-[#1C1A17]">
                        Rp {(paymentOption === 'dp' ? dpAmount : grandTotal).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyNominal}
                      className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F2ECE1] text-stone-800 border border-[#D5CEC2] text-[11px] font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
                    >
                      {copiedNominal ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNominal ? 'Nominal Tersalin!' : 'Salin Nominal'}</span>
                    </button>
                  </div>

                  {/* QRIS Display & Download Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
                    <div className="sm:col-span-5 flex flex-col items-center">
                      <div className="w-full max-w-[210px] bg-white p-2.5 border border-[#1C1A17] shadow-sm flex flex-col items-center">
                        <img
                          src="/images/qris-alviero.png"
                          alt="QRIS Resmi Alviero Studio"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <a
                        href="/images/qris-alviero.png"
                        download="QRIS-Alviero-Studio.png"
                        className="mt-2.5 w-full max-w-[210px] py-2 px-3 bg-[#1C1A17] hover:bg-[#2D2A26] text-white font-serif text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Unduh Kode QRIS 📥</span>
                      </a>
                    </div>

                    <div className="sm:col-span-7 space-y-2 text-xs font-sans text-stone-700 leading-relaxed">
                      <p className="font-bold text-[#1C1A17] uppercase tracking-wide text-[11px] font-serif">
                        Petunjuk Pembayaran QRIS:
                      </p>
                      <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-stone-600">
                        <li>Klik tombol <strong>"Unduh Kode QRIS 📥"</strong> di atas atau tangkap layar (screenshot).</li>
                        <li>Buka aplikasi <strong>M-Banking (BCA, Mandiri, BRImo, dll)</strong> atau <strong>E-Wallet (GoPay, OVO, Dana, ShopeePay)</strong>.</li>
                        <li>Pilih menu <strong>QRIS ➔ Scan dari Galeri</strong> ➔ pilih gambar QRIS tadi.</li>
                        <li>Ketik nominal transfer: <strong className="text-[#1C1A17] font-mono">Rp {(paymentOption === 'dp' ? dpAmount : grandTotal).toLocaleString('id-ID')}</strong>.</li>
                        <li>Simpan screenshot bukti transfer dan <strong>unggah pada form di bawah</strong> untuk mengaktifkan tombol kirim.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {/* UPLOAD BUKTI PEMBAYARAN (WAJIB) */}
              <div className="pt-2 border-t border-[#E0D9CE] space-y-2">
                <label className="text-xs font-serif font-bold text-[#1C1A17] uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#8C6D46]" />
                    UNGGAH BUKTI TRANSFER / BAYAR QRIS: <span className="text-rose-600">*</span>
                  </span>
                  {paymentProofImage ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5">
                      ✅ Bukti Terlampir
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5">
                      Wajib Diunggah
                    </span>
                  )}
                </label>

                {!paymentProofImage ? (
                  <label className="block border-2 border-dashed border-[#D4AF37]/90 bg-[#FFFDF7] hover:bg-[#FAF5EE] transition-all p-4 text-center cursor-pointer relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProofUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1.5">
                      <div className="w-10 h-10 rounded-full bg-[#1C1A17] text-[#D4AF37] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-serif font-bold text-[#1C1A17] uppercase tracking-wide">
                        Klik Di Sini Untuk Memilih Foto Bukti Transfer
                      </p>
                      <p className="text-[10.5px] text-stone-500 font-sans">
                        Mendukung format JPG, PNG, WebP atau Screenshot Struk Pembayaran (Maks. 5MB)
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="bg-emerald-50/70 border border-emerald-300 p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={paymentProofImage}
                        alt="Preview Bukti Bayar"
                        className="w-14 h-14 object-cover border border-emerald-300 bg-white shrink-0 shadow-2xs"
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
                      <label className="px-2.5 py-1.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-[10.5px] font-serif font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-2xs">
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
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer active:scale-95"
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

              {/* Alert Konfirmasi Pembayaran Admin via WhatsApp */}
              <div className="p-3.5 bg-white border border-[#E0D9CE] flex items-start gap-3">
                <div className="w-8 h-8 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                  <WhatsAppIcon className="w-4.5 h-4.5 fill-[#25D366]" />
                </div>
                <div className="flex-1 text-xs font-sans">
                  <p className="font-bold text-[#1C1A17] leading-relaxed">
                    Bukti pembayaran akan otomatis diverifikasi oleh admin via WhatsApp untuk mengunci slot jadwal Anda.
                  </p>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Pastikan nominal transfer sesuai dan lampiran bukti bayar sudah jelas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* RINCIAN BIAYA SUMMARY BOX                                         */}
          {/* ================================================================= */}
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

        {/* =================================================================== */}
        {/* MODAL FOOTER CONTROLS                                               */}
        {/* =================================================================== */}
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
                type="button"
                onClick={handleSendBookingWA}
                disabled={!canSubmitBooking}
                className={`min-h-[44px] px-6 py-2.5 text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${canSubmitBooking
                  ? 'bg-[#1C1A17] hover:bg-[#2D2A26] text-white border border-[#1C1A17] shadow-md cursor-pointer active:scale-95'
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
