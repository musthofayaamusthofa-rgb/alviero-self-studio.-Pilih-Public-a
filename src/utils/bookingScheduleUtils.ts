/**
 * Alviero Studio — Scheduling & Pricing Logic Utility
 * 
 * Sistem Manajemen Kapasitas Slot, Validasi Jadwal & Kalkulasi Biaya Khusus
 * Berlaku untuk Studio 1 & Studio 2 (Layanan Indoor & Outdoor).
 * 
 * ATURAN BISNIS:
 * 1. Kapasitas Slot:
 *    - 11.30 s.d. 20.30 (Shift Gabungan) : Maksimal 3 klien bersamaan per slot jam.
 *    - 08.00 s.d. 11.00 (Shift Pagi)      : Maksimal 2 klien bersamaan per slot jam.
 * 2. Jam Ekstra Pagi (Early Morning) & Biaya Tambahan:
 *    - 06.00 s.d. 07.00 : Bisa menerima Foto Studio (Indoor), Biaya Tambahan (Early Charge) = Rp 35.000.
 *                         Kapasitas maksimal = 2 klien.
 *    - 05.00 s.d. 06.00 : HANYA Foto Outdoor. TIDAK ADA biaya tambahan (Rp 0).
 */

export type ServiceType = 'indoor' | 'outdoor';

export interface TimeSlotConfig {
  time: string;                     // Format 'HH:MM'
  maxCapacity: number;              // Kapasitas maksimal klien bersamaan
  allowedServices: ServiceType[];   // Jenis layanan yang diizinkan pada slot jam ini
  shiftName: string;                // Keterangan shift jadwal
  earlyCharge: number;              // Biaya tambahan pagi (early charge) khusus layanan tertentu
}

export interface BookingAvailabilityResult {
  isAvailable: boolean;
  time: string;
  serviceType: ServiceType;
  currentBookings: number;
  maxCapacity: number;
  remainingCapacity: number;
  reason?: string;
  shiftName: string;
}

export interface BookingFeeResult {
  time: string;
  serviceType: ServiceType;
  baseFee: number;
  earlyCharge: number;
  totalFee: number;
  isEarlyChargeApplied: boolean;
  description: string;
}

/**
 * Normalisasi format waktu menjadi format standar 'HH:MM'
 */
export function normalizeTime(rawTime: string): string {
  if (!rawTime) return '';
  const str = String(rawTime).trim().replace('.', ':');
  const match = str.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    const hh = match[1].padStart(2, '0');
    const mm = match[2];
    return `${hh}:${mm}`;
  }
  return str;
}

/**
 * Konversi waktu HH:MM ke menit sejak tengah malam (00:00)
 */
export function timeToMinutes(timeStr: string): number {
  const norm = normalizeTime(timeStr);
  const [hhStr, mmStr] = norm.split(':');
  const hh = Number(hhStr);
  const mm = Number(mmStr);
  if (isNaN(hh) || isNaN(mm)) return 0;
  return hh * 60 + mm;
}

/**
 * Normalisasi tipe layanan input menjadi 'indoor' | 'outdoor'
 */
export function normalizeServiceType(rawService: string): ServiceType {
  const lower = String(rawService || '').toLowerCase().trim();
  if (lower.includes('out') || lower === 'outdoor') {
    return 'outdoor';
  }
  return 'indoor';
}

/**
 * =============================================================================
 * 1. ARRAY KONSTANTA KONFIGURASI JADWAL (TIME_SLOTS)
 * =============================================================================
 * Memetakan setiap jam dengan kapasitas maksimal dan aturan layanan terkait:
 * - 05:00 - 05:59 : Outdoor Only (Kapasitas: 2, Extra: Rp 0)
 * - 06:00 - 07:59 : Indoor Foto Studio (Kapasitas: 2, Extra: Rp 35.000) & Outdoor
 * - 08:00 - 11:00 : Shift Pagi (Kapasitas: 2, Extra: Rp 0)
 * - 11:30 - 20:30 : Shift Gabungan (Kapasitas: 3, Extra: Rp 0)
 */
export const TIME_SLOTS: TimeSlotConfig[] = [
  // --- A. Jam Ekstra Pagi Outdoor Only (05.00 - 06.00) ---
  {
    time: '05:00',
    maxCapacity: 2,
    allowedServices: ['outdoor'],
    shiftName: 'Ekstra Pagi Outdoor (05.00 - 06.00)',
    earlyCharge: 0
  },
  {
    time: '05:30',
    maxCapacity: 2,
    allowedServices: ['outdoor'],
    shiftName: 'Ekstra Pagi Outdoor (05.00 - 06.00)',
    earlyCharge: 0
  },

  // --- B. Jam Ekstra Pagi Indoor Studio (06.00 - 07.59) dengan Early Charge Rp 35.000 ---
  {
    time: '06:00',
    maxCapacity: 2,
    allowedServices: ['indoor', 'outdoor'],
    shiftName: 'Ekstra Pagi Studio (+Rp 35.000 Early Charge)',
    earlyCharge: 35000
  },
  {
    time: '06:30',
    maxCapacity: 2,
    allowedServices: ['indoor', 'outdoor'],
    shiftName: 'Ekstra Pagi Studio (+Rp 35.000 Early Charge)',
    earlyCharge: 35000
  },
  {
    time: '07:00',
    maxCapacity: 2,
    allowedServices: ['indoor', 'outdoor'],
    shiftName: 'Ekstra Pagi Studio (+Rp 35.000 Early Charge)',
    earlyCharge: 35000
  },
  {
    time: '07:30',
    maxCapacity: 2,
    allowedServices: ['indoor', 'outdoor'],
    shiftName: 'Ekstra Pagi Studio (+Rp 35.000 Early Charge)',
    earlyCharge: 35000
  },

  // --- C. Shift Pagi Reguler: 08.00 s.d. 11.00 (Maksimal 2 Klien) ---
  { time: '08:00', maxCapacity: 2, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Pagi (Maks. 2 Klien)', earlyCharge: 0 },
  { time: '08:30', maxCapacity: 2, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Pagi (Maks. 2 Klien)', earlyCharge: 0 },
  { time: '09:00', maxCapacity: 2, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Pagi (Maks. 2 Klien)', earlyCharge: 0 },
  { time: '09:30', maxCapacity: 2, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Pagi (Maks. 2 Klien)', earlyCharge: 0 },
  { time: '10:00', maxCapacity: 2, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Pagi (Maks. 2 Klien)', earlyCharge: 0 },
  { time: '10:30', maxCapacity: 2, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Pagi (Maks. 2 Klien)', earlyCharge: 0 },
  { time: '11:00', maxCapacity: 2, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Pagi (Maks. 2 Klien)', earlyCharge: 0 },

  // --- D. Shift Gabungan: 11.30 s.d. 20.30 (Maksimal 3 Klien) ---
  { time: '11:30', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '12:00', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '12:30', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '13:00', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '13:30', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '14:00', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '14:30', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '15:00', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '15:30', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '16:00', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '16:30', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '17:00', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '17:30', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '18:00', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '18:30', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '19:00', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '19:30', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '20:00', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
  { time: '20:30', maxCapacity: 3, allowedServices: ['indoor', 'outdoor'], shiftName: 'Shift Gabungan (Maks. 3 Klien)', earlyCharge: 0 },
];

/**
 * Mencari konfigurasi slot berdasarkan string jam
 */
export function getTimeSlotConfig(timeStr: string): TimeSlotConfig | undefined {
  const norm = normalizeTime(timeStr);
  return TIME_SLOTS.find(slot => slot.time === norm);
}

/**
 * =============================================================================
 * 2. FUNGSI UTILITAS: checkBookingAvailability
 * =============================================================================
 * Memvalidasi apakah slot masih tersedia berdasarkan:
 * 1. Validitas waktu slot dalam jadwal operasional Alviero Studio
 * 2. Kesesuaian jenis layanan (contoh: jam 05:00 - 06:00 DITOLAK jika Indoor)
 * 3. Batas kapasitas slot jam (Shift Pagi: 2 klien, Shift Gabungan: 3 klien)
 * 
 * @param waktu String jam reservasi (contoh: "08:00", "14:00", "05:00")
 * @param jenisLayanan "indoor" (Studio Foto) atau "outdoor"
 * @param jumlahBookingSaatIni Jumlah klien yang sudah terdaftar pada jam tersebut
 */
export function checkBookingAvailability(
  waktu: string,
  jenisLayanan: ServiceType | string,
  jumlahBookingSaatIni: number = 0
): BookingAvailabilityResult {
  const normTime = normalizeTime(waktu);
  const service = normalizeServiceType(jenisLayanan);
  const currentCount = Math.max(0, Number(jumlahBookingSaatIni) || 0);

  const slotConfig = getTimeSlotConfig(normTime);

  // A. Jika jam tidak terdaftar di daftar slot studio
  if (!slotConfig) {
    return {
      isAvailable: false,
      time: normTime,
      serviceType: service,
      currentBookings: currentCount,
      maxCapacity: 0,
      remainingCapacity: 0,
      reason: `Jam ${normTime} WIB tidak terdaftar dalam jadwal operasional studio.`,
      shiftName: 'Di Luar Jam Operasional'
    };
  }

  // B. Pengecekan Izin Jenis Layanan (Khusus jam 05.00 - 06.00 HANYA Outdoor)
  if (!slotConfig.allowedServices.includes(service)) {
    return {
      isAvailable: false,
      time: normTime,
      serviceType: service,
      currentBookings: currentCount,
      maxCapacity: slotConfig.maxCapacity,
      remainingCapacity: 0,
      reason: `Jam ${normTime} WIB HANYA melayani sesi Foto Outdoor (Foto Studio Indoor belum dibuka).`,
      shiftName: slotConfig.shiftName
    };
  }

  // C. Pengecekan Batas Kapasitas Maksimal Slot Jam
  const isFull = currentCount >= slotConfig.maxCapacity;
  const remaining = Math.max(0, slotConfig.maxCapacity - currentCount);

  if (isFull) {
    return {
      isAvailable: false,
      time: normTime,
      serviceType: service,
      currentBookings: currentCount,
      maxCapacity: slotConfig.maxCapacity,
      remainingCapacity: 0,
      reason: `Slot jam ${normTime} WIB sudah penuh (Kapasitas maksimal ${slotConfig.maxCapacity} klien telah terpenuhi).`,
      shiftName: slotConfig.shiftName
    };
  }

  // D. Slot Tersedia
  return {
    isAvailable: true,
    time: normTime,
    serviceType: service,
    currentBookings: currentCount,
    maxCapacity: slotConfig.maxCapacity,
    remainingCapacity: remaining,
    shiftName: slotConfig.shiftName
  };
}

/**
 * =============================================================================
 * 3. FUNGSI UTILITAS: calculateBookingFee
 * =============================================================================
 * Menghitung total biaya pemesanan dengan aturan biaya ekstra pagi:
 * - Jam 06.00 s.d. 07.59 untuk Foto Studio (Indoor): Wajib dikenakan Early Charge +Rp 35.000.
 * - Jam 05.00 s.d. 06.00 untuk Foto Outdoor: Bebas biaya tambahan (Early Charge = Rp 0).
 * - Jam reguler lainnya (08.00 s.d. 20.30): Harga normal (Early Charge = Rp 0).
 * 
 * @param waktu String jam reservasi (contoh: "06:00", "08:00", "05:00")
 * @param jenisLayanan "indoor" (Studio Foto) atau "outdoor"
 * @param hargaDasar Harga dasar paket pemotretan (contoh: 150000)
 */
export function calculateBookingFee(
  waktu: string,
  jenisLayanan: ServiceType | string,
  hargaDasar: number
): BookingFeeResult {
  const normTime = normalizeTime(waktu);
  const service = normalizeServiceType(jenisLayanan);
  const basePrice = Math.max(0, Number(hargaDasar) || 0);

  const slotMinutes = timeToMinutes(normTime);

  // Aturan 1: Jam 06.00 s.d. 07.59 untuk Foto Studio (Indoor) dikenakan biaya tambahan Rp 35.000
  // (360 menit = 06:00, 479 menit = 07:59)
  const isEarlyIndoorSlot = service === 'indoor' && slotMinutes >= 360 && slotMinutes < 480;

  let earlyCharge = 0;
  let description = 'Harga Reguler (Tanpa biaya tambahan)';

  if (isEarlyIndoorSlot) {
    earlyCharge = 35000;
    description = 'Dikenakan biaya tambahan sesi ekstra pagi studio (+Rp 35.000 Early Charge)';
  } else if (service === 'outdoor' && slotMinutes >= 300 && slotMinutes < 360) {
    // Aturan 2: Jam 05.00 s.d. 06.00 Outdoor TIDAK ADA biaya tambahan
    earlyCharge = 0;
    description = 'Sesi khusus Outdoor Pagi (Bebas biaya tambahan)';
  }

  const totalFee = basePrice + earlyCharge;

  return {
    time: normTime,
    serviceType: service,
    baseFee: basePrice,
    earlyCharge,
    totalFee,
    isEarlyChargeApplied: earlyCharge > 0,
    description
  };
}
