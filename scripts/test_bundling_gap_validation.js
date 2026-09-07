/**
 * Unit test skenario validasi jeda waktu minimal 90 menit antar sesi Bundling.
 * Meniru implementasi BookingCalculator.tsx
 */

const normalizeSlotTime = (raw) => {
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

const timeToMinutes = (timeStr) => {
  const norm = normalizeSlotTime(timeStr);
  const [hhStr, mmStr] = norm.split(':');
  const hh = Number(hhStr);
  const mm = Number(mmStr);
  if (isNaN(hh) || isNaN(mm)) return 0;
  return hh * 60 + mm;
};

const calculateTimeGapMinutes = (time1, time2) => {
  if (!time1 || !time2) return 0;
  return Math.abs(timeToMinutes(time1) - timeToMinutes(time2));
};

const isBundlingGapValid = (time1, time2, minGapMinutes = 90) => {
  if (!time1 || !time2) return true;
  return calculateTimeGapMinutes(time1, time2) >= minGapMinutes;
};

const getAvailableSecondSessionTimes = (firstSessionTime, allSecondSlots, minGapMinutes = 90) => {
  if (!firstSessionTime) {
    return allSecondSlots.map(slot => ({
      slot,
      disabled: false,
      gapMinutes: undefined
    }));
  }

  const firstMinutes = timeToMinutes(firstSessionTime);

  return allSecondSlots.map(slot => {
    const slotMinutes = timeToMinutes(slot);
    const gap = Math.abs(slotMinutes - firstMinutes);
    const disabled = gap < minGapMinutes;

    return {
      slot,
      disabled,
      gapMinutes: gap,
      reason: disabled
        ? `Jarak minimal antar sesi 90 menit (selisih: ${gap} menit dari ${firstSessionTime} WIB)`
        : undefined
    };
  });
};

console.log('=== RUNNING TESTS FOR BUNDLING TIME GAP VALIDATION ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Skenario Utama dari Pengguna:
// Indoor = 10:00
const indoorTime = '10:00';
const testSlots = [
  '07:30',
  '08:00',
  '08:30', // Jarak pas 90m -> AKTIF
  '09:00', // Jarak 60m < 90m -> DISABLED
  '09:30', // Jarak 30m < 90m -> DISABLED
  '10:00', // Jarak 0m < 90m -> DISABLED
  '10:30', // Jarak 30m < 90m -> DISABLED
  '11:00', // Jarak 60m < 90m -> DISABLED
  '11:30', // Jarak pas 90m -> AKTIF
  '12:00', // Jarak 120m >= 90m -> AKTIF
  '13:05'  // Jarak 185m >= 90m -> AKTIF
];

const results = getAvailableSecondSessionTimes(indoorTime, testSlots, 90);
const resultMap = {};
results.forEach(r => { resultMap[r.slot] = r; });

console.log('1. Pengujian Skenario Acuan (Indoor = 10:00):');
assert(resultMap['08:00'].disabled === false, '08:00 harus AKTIF (jarak 120 menit)');
assert(resultMap['08:30'].disabled === false, '08:30 harus AKTIF (jarak pas 90 menit)');
assert(resultMap['09:00'].disabled === true, '09:00 harus TIDAK AKTIF / DISABLED (jarak 60 menit)');
assert(resultMap['09:30'].disabled === true, '09:30 harus TIDAK AKTIF / DISABLED (jarak 30 menit)');
assert(resultMap['10:00'].disabled === true, '10:00 harus TIDAK AKTIF / DISABLED (jarak 0 menit)');
assert(resultMap['10:30'].disabled === true, '10:30 harus TIDAK AKTIF / DISABLED (jarak 30 menit)');
assert(resultMap['11:00'].disabled === true, '11:00 harus TIDAK AKTIF / DISABLED (jarak 60 menit)');
assert(resultMap['11:30'].disabled === false, '11:30 harus AKTIF (jarak pas 90 menit)');
assert(resultMap['12:00'].disabled === false, '12:00 harus AKTIF (jarak 120 menit)');

console.log('\n2. Pengujian Arah Sebaliknya (Klien Memilih Outdoor Lebih Dulu = 12:00):');
const outdoorTime = '12:00';
const indoorTestSlots = ['09:00', '10:00', '10:30', '11:00', '12:00', '13:00', '13:30', '14:00'];
const reverseResults = getAvailableSecondSessionTimes(outdoorTime, indoorTestSlots, 90);
const reverseMap = {};
reverseResults.forEach(r => { reverseMap[r.slot] = r; });

assert(reverseMap['10:00'].disabled === false, 'Indoor 10:00 harus AKTIF dari Outdoor 12:00 (jarak 120m)');
assert(reverseMap['10:30'].disabled === false, 'Indoor 10:30 harus AKTIF dari Outdoor 12:00 (jarak pas 90m)');
assert(reverseMap['11:00'].disabled === true, 'Indoor 11:00 harus DISABLED dari Outdoor 12:00 (jarak 60m)');
assert(reverseMap['12:00'].disabled === true, 'Indoor 12:00 harus DISABLED dari Outdoor 12:00 (jarak 0m)');
assert(reverseMap['13:00'].disabled === true, 'Indoor 13:00 harus DISABLED dari Outdoor 12:00 (jarak 60m)');
assert(reverseMap['13:30'].disabled === false, 'Indoor 13:30 harus AKTIF dari Outdoor 12:00 (jarak pas 90m)');
assert(reverseMap['14:00'].disabled === false, 'Indoor 14:00 harus AKTIF dari Outdoor 12:00 (jarak 120m)');

console.log('\n3. Pengujian Slot Outdoor Asli Alviero Studio ketika Indoor = 14:00:');
const realOutdoorSlots = ['05:00', '06:00', '12:00', '13:05', '14:10', '15:15', '16:20', '17:25'];
const indoor1400Results = getAvailableSecondSessionTimes('14:00', realOutdoorSlots, 90);
const outdoorMap1400 = {};
indoor1400Results.forEach(r => { outdoorMap1400[r.slot] = r; });

assert(outdoorMap1400['05:00'].disabled === false, 'Outdoor 05:00 AKTIF (jarak 540m)');
assert(outdoorMap1400['06:00'].disabled === false, 'Outdoor 06:00 AKTIF (jarak 480m)');
assert(outdoorMap1400['12:00'].disabled === false, 'Outdoor 12:00 AKTIF (jarak 120m)');
assert(outdoorMap1400['13:05'].disabled === true, 'Outdoor 13:05 DISABLED (jarak 55m < 90m)');
assert(outdoorMap1400['14:10'].disabled === true, 'Outdoor 14:10 DISABLED (jarak 10m < 90m)');
assert(outdoorMap1400['15:15'].disabled === true, 'Outdoor 15:15 DISABLED (jarak 75m < 90m)');
assert(outdoorMap1400['16:20'].disabled === false, 'Outdoor 16:20 AKTIF (jarak 140m >= 90m)');

console.log(`\n========================================`);
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log(`========================================\n`);
