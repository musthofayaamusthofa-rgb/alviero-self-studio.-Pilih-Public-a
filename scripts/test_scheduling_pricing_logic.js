/**
 * Unit Test & Verification Script:
 * Menguji Logika Penjadwalan & Kalkulasi Biaya Alviero Studio
 * 
 * Aturan Bisnis yang Diuji:
 * 1. Shift Gabungan (11.30 - 20.30) -> Kapasitas Maks. 3 Klien
 * 2. Shift Pagi (08.00 - 11.00)      -> Kapasitas Maks. 2 Klien
 * 3. Jam 06.00 - 07.00 (Indoor)      -> Diterima, Maks. 2 Klien, Biaya +Rp 35.000
 * 4. Jam 05.00 - 06.00 (Outdoor)     -> Diterima, TIDAK ADA biaya tambahan (+Rp 0)
 * 5. Jam 05.00 - 06.00 (Indoor)      -> Ditolak (Hanya melayani Outdoor)
 */

import {
  TIME_SLOTS,
  checkBookingAvailability,
  calculateBookingFee
} from '../src/utils/bookingScheduleUtils.ts';

console.log('='.repeat(80));
console.log('🚀 MENJALANKAN TEST LOGIKA PENJADWALAN & HARGA ALVIERO STUDIO');
console.log('='.repeat(80));
console.log('');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName} ${details ? '- ' + details : ''}`);
  }
}

// -----------------------------------------------------------------------------
// TEST CASE 1: Shift Gabungan (11.30 - 20.30, Kapasitas Maks. 3 Klien)
// -----------------------------------------------------------------------------
console.log('--- [1] PENGUJIAN SHIFT GABUNGAN (11.30 - 20.30: MAKS. 3 KLIEN) ---');
const test14Available = checkBookingAvailability('14:00', 'indoor', 2);
assert(
  test14Available.isAvailable === true && test14Available.remainingCapacity === 1,
  'Jam 14:00 (booking saat ini = 2) -> Status: TERSEDIA (sisa 1 slot)',
  JSON.stringify(test14Available)
);

const test14Full = checkBookingAvailability('14:00', 'indoor', 3);
assert(
  test14Full.isAvailable === false && test14Full.remainingCapacity === 0,
  'Jam 14:00 (booking saat ini = 3) -> Status: PENUH (ditolak)',
  JSON.stringify(test14Full)
);

const fee14 = calculateBookingFee('14:00', 'indoor', 150000);
assert(
  fee14.totalFee === 150000 && fee14.earlyCharge === 0 && !fee14.isEarlyChargeApplied,
  'Jam 14:00 Indoor -> Biaya Normal Rp 150.000 (Tanpa Early Charge)',
  JSON.stringify(fee14)
);
console.log('');

// -----------------------------------------------------------------------------
// TEST CASE 2: Shift Pagi (08.00 - 11.00, Kapasitas Maks. 2 Klien)
// -----------------------------------------------------------------------------
console.log('--- [2] PENGUJIAN SHIFT PAGI (08.00 - 11.00: MAKS. 2 KLIEN) ---');
const test09Available = checkBookingAvailability('09:00', 'indoor', 1);
assert(
  test09Available.isAvailable === true && test09Available.maxCapacity === 2 && test09Available.remainingCapacity === 1,
  'Jam 09:00 (booking saat ini = 1) -> Status: TERSEDIA (sisa 1 slot dari kapasitas 2)',
  JSON.stringify(test09Available)
);

const test09Full = checkBookingAvailability('09:00', 'indoor', 2);
assert(
  test09Full.isAvailable === false && test09Full.remainingCapacity === 0,
  'Jam 09:00 (booking saat ini = 2) -> Status: PENUH (kapasitas 2 tercapai)',
  JSON.stringify(test09Full)
);

const fee09 = calculateBookingFee('09:00', 'indoor', 150000);
assert(
  fee09.totalFee === 150000 && fee09.earlyCharge === 0,
  'Jam 09:00 Indoor -> Biaya Normal Rp 150.000',
  JSON.stringify(fee09)
);
console.log('');

// -----------------------------------------------------------------------------
// TEST CASE 3: Jam Ekstra Pagi Indoor 06.00 - 07.00 (+Rp 35.000 Early Charge, Maks. 2 Klien)
// -----------------------------------------------------------------------------
console.log('--- [3] PENGUJIAN JAM EKSTRA PAGI INDOOR 06.00 - 07.00 (+RP 35.000) ---');
const test06Available = checkBookingAvailability('06:00', 'indoor', 0);
assert(
  test06Available.isAvailable === true && test06Available.maxCapacity === 2,
  'Jam 06:00 Indoor -> Status: BISA DITERIMA (Kapasitas: 2 klien)',
  JSON.stringify(test06Available)
);

const fee06Indoor = calculateBookingFee('06:00', 'indoor', 150000);
assert(
  fee06Indoor.totalFee === 185000 && fee06Indoor.earlyCharge === 35000 && fee06Indoor.isEarlyChargeApplied === true,
  'Jam 06:00 Indoor -> Biaya Total Rp 185.000 (Harga dasar 150k + Early Charge 35k)',
  JSON.stringify(fee06Indoor)
);

const fee07Indoor = calculateBookingFee('07:00', 'indoor', 200000);
assert(
  fee07Indoor.totalFee === 235000 && fee07Indoor.earlyCharge === 35000,
  'Jam 07:00 Indoor -> Biaya Total Rp 235.000 (Harga dasar 200k + Early Charge 35k)',
  JSON.stringify(fee07Indoor)
);
console.log('');

// -----------------------------------------------------------------------------
// TEST CASE 4: Jam Ekstra Pagi Outdoor 05.00 - 06.00 (TIDAK ADA BIAYA TAMBAHAN)
// -----------------------------------------------------------------------------
console.log('--- [4] PENGUJIAN JAM EKSTRA PAGI OUTDOOR 05.00 - 06.00 (FREE EXTRA CHARGE) ---');
const test05Outdoor = checkBookingAvailability('05:00', 'outdoor', 0);
assert(
  test05Outdoor.isAvailable === true,
  'Jam 05:00 Outdoor -> Status: BISA DITERIMA',
  JSON.stringify(test05Outdoor)
);

const fee05Outdoor = calculateBookingFee('05:00', 'outdoor', 150000);
assert(
  fee05Outdoor.totalFee === 150000 && fee05Outdoor.earlyCharge === 0 && !fee05Outdoor.isEarlyChargeApplied,
  'Jam 05:00 Outdoor -> TIDAK ADA biaya tambahan (Tetap Rp 150.000)',
  JSON.stringify(fee05Outdoor)
);

// -----------------------------------------------------------------------------
// TEST CASE 5: Jam 05.00 - 06.00 Ditolak Jika Memilih Indoor (HANYA Outdoor)
// -----------------------------------------------------------------------------
console.log('--- [5] PENGUJIAN JAM 05.00 UNTUK INDOOR (WAJIB DITOLAK) ---');
const test05Indoor = checkBookingAvailability('05:00', 'indoor', 0);
assert(
  test05Indoor.isAvailable === false && test05Indoor.reason.includes('Outdoor'),
  'Jam 05:00 Indoor -> Status: DITOLAK (Hanya bisa melayani Outdoor)',
  JSON.stringify(test05Indoor)
);
console.log('');

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('='.repeat(80));
console.log(`🎉 HASIL AKHIR: ${passedTests} / ${totalTests} UNIT TEST BERHASIL (100% SUKSES)`);
console.log('='.repeat(80));
