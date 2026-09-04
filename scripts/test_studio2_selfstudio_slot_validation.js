/**
 * UNIT TEST: VALIDASI KETERSEDIAAN SLOT JAM KHUSUS PAKET "SELF STUDIO" DI STUDIO 2
 * 
 * Aturan:
 * Pada Studio 2, jika klien memilih paket "Self Studio":
 * Slot jam HANYA BISA AKTIF (Tersedia) JIKA DAN HANYA JIKA:
 * Putih, Abu-abu, Cream, dan Coklat BELUM DIPILIH SAMA SEKALI (jumlah pemakaian = 0) oleh klien lain.
 * 
 * Catatan: Jika ada klien lain memakai background "Hitam", Self Studio TETAP DIIZINKAN (Valid).
 */

function normalizeSlotTime(raw) {
  if (!raw) return '';
  const str = String(raw).trim();
  const match = str.match(/(\d{1,2})[:.](\d{2})/);
  if (match) {
    const hh = match[1].padStart(2, '0');
    const mm = match[2];
    return `${hh}:${mm}`;
  }
  return str;
}

function checkTimeSlotAvailability({
  allSlots,
  selectedPackage,
  existingBookings = {},
  existingSelfStudioBookings = {},
  selectedBranch = 'cabang-2',
  existingBackdrops = {},
  maxCapacityPerSlot = 3
}) {
  const pkgObj = typeof selectedPackage === 'string'
    ? { id: selectedPackage, name: selectedPackage, category: selectedPackage }
    : (selectedPackage || {});

  const isSelfStudio = (
    pkgObj.category === 'self-studio' ||
    pkgObj.category === 'selfstudio' ||
    String(pkgObj.id || '').toLowerCase().includes('self') ||
    String(pkgObj.name || '').toLowerCase().includes('self')
  );

  const isStudio2 = (
    selectedBranch === 'cabang-2' ||
    String(selectedBranch).toLowerCase().includes('2') ||
    String(selectedBranch).toLowerCase().includes('dinoyo')
  );

  const durationMinutes = 30;

  const slots = allSlots.map((slot) => {
    const sNorm = normalizeSlotTime(slot);
    const currentOccupancy = existingBookings[sNorm] !== undefined
      ? existingBookings[sNorm]
      : (existingBookings[slot] !== undefined ? existingBookings[slot] : 0);
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

    // Aturan Khusus Self Studio di Studio 2:
    if (isStudio2 && isSelfStudio) {
      const rawBackdrops = existingBackdrops[sNorm] || existingBackdrops[slot] || [];
      const selfStudioBookingsCount = Number(existingSelfStudioBookings[sNorm] || existingSelfStudioBookings[slot] || 0);
      let countPutih = 0;
      let countAbu = 0;
      let countCream = 0;
      let countCoklat = 0;
      let countSelfStudio = 0;

      if (Array.isArray(rawBackdrops)) {
        rawBackdrops.forEach(item => {
          const text = String(item || '').toLowerCase();
          if (text.includes('putih')) countPutih++;
          if (text.includes('abu')) countAbu++;
          if (text.includes('cream') || text.includes('krem')) countCream++;
          if (text.includes('coklat') || text.includes('cokelat')) countCoklat++;
          if (text.includes('self') || text.includes('biru')) countSelfStudio++;
        });
      } else if (typeof rawBackdrops === 'object' && rawBackdrops !== null) {
        countPutih = Number(rawBackdrops.putih || rawBackdrops.countPutih || 0);
        countAbu = Number(rawBackdrops.abu || rawBackdrops.countAbu || rawBackdrops['abu-abu'] || 0);
        countCream = Number(rawBackdrops.cream || rawBackdrops.countCream || rawBackdrops.krem || 0);
        countCoklat = Number(rawBackdrops.coklat || rawBackdrops.countCoklat || rawBackdrops.cokelat || 0);
        countSelfStudio = Number(rawBackdrops.selfstudio || rawBackdrops.countSelfStudio || 0);
      }

      const selfStudioAlreadyBooked = selfStudioBookingsCount >= 1 || countSelfStudio >= 1;
      const canBookSelfStudio = (
        !selfStudioAlreadyBooked &&
        countPutih === 0 &&
        countAbu === 0 &&
        countCream === 0 &&
        countCoklat === 0
      );

      if (!canBookSelfStudio) {
        const busyList = [];
        if (countPutih > 0) busyList.push('Putih');
        if (countAbu > 0) busyList.push('Abu-abu');
        if (countCream > 0) busyList.push('Cream');
        if (countCoklat > 0) busyList.push('Coklat');
        if (selfStudioAlreadyBooked && busyList.length === 0) busyList.push('Bilik Self Studio');

        return {
          slot,
          isAvailable: false,
          disabled: true,
          reason: `Self Studio tidak tersedia (${busyList.join(', ')} sedang terpakai)`,
          occupiedSlots: [slot],
          durationMinutes
        };
      }
    }

    return {
      slot,
      isAvailable: true,
      disabled: false,
      reason: 'Tersedia (30 Menit)',
      occupiedSlots: [slot],
      durationMinutes: 30
    };
  });

  return { slots };
}

// ==========================================
// TEST SUITE
// ==========================================
console.log('===============================================================');
console.log('TEST SUITE: VALIDASI KETERSEDIAAN JAM SELF STUDIO (STUDIO 2)');
console.log('===============================================================\n');

const testSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const testBookings = {
  '10:00': 1, // Klien A pakai Hitam
  '11:00': 1, // Klien C pakai Coklat
  '12:00': 1, // Klien E pakai Putih
  '13:00': 1, // Klien F pakai Abu-abu
  '14:00': 1, // Klien G pakai Cream
  '15:00': 0  // Kosong
};
const testBackdrops = {
  '10:00': ['Hitam'],
  '11:00': ['Coklat Jendela'],
  '12:00': ['Putih'],
  '13:00': ['Abu-abu'],
  '14:00': ['Tematik Cream'],
  '15:00': []
};
const testSelfStudioBookings = {
  '13:00': 1
};

// Jalankan pengecekan untuk Paket "Self Studio"
const resultSelfStudio = checkTimeSlotAvailability({
  allSlots: testSlots,
  selectedPackage: 'selfstudio',
  existingBookings: testBookings,
  existingSelfStudioBookings: testSelfStudioBookings,
  selectedBranch: 'cabang-2',
  existingBackdrops: testBackdrops
});

const slotResults = {};
resultSelfStudio.slots.forEach(s => {
  slotResults[s.slot] = s;
});

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failed++;
  }
}

// Skenario 1 (Acuan User): Jam 10:00 Klien A pesan Hitam -> Self Studio BISA DIKLIK / AKTIF
assert(
  slotResults['10:00'].isAvailable === true && slotResults['10:00'].disabled === false,
  'Skenario 1: Jam 10:00 (Hitam terpakai) -> BISA DIKLIK / AKTIF untuk Self Studio'
);

// Skenario 2 (Acuan User): Jam 11:00 Klien C pesan Coklat -> Self Studio TIDAK AKTIF / DISABLED
assert(
  slotResults['11:00'].isAvailable === false && slotResults['11:00'].disabled === true,
  'Skenario 2: Jam 11:00 (Coklat terpakai) -> TIDAK AKTIF / DISABLED untuk Self Studio'
);

// Skenario 3: Jam 12:00 (Putih terpakai) -> TIDAK AKTIF / DISABLED
assert(
  slotResults['12:00'].isAvailable === false && slotResults['12:00'].disabled === true,
  'Skenario 3: Jam 12:00 (Putih terpakai) -> TIDAK AKTIF / DISABLED untuk Self Studio'
);

// Skenario 4: Jam 13:00 (1 booking Self Studio) -> TIDAK AKTIF / DISABLED
assert(
  slotResults['13:00'].isAvailable === false && slotResults['13:00'].disabled === true,
  'Skenario 4: Jam 13:00 (1 booking Self Studio) -> TIDAK AKTIF / DISABLED untuk Self Studio'
);

// Skenario 5: Jam 14:00 (Cream terpakai) -> TIDAK AKTIF / DISABLED
assert(
  slotResults['14:00'].isAvailable === false && slotResults['14:00'].disabled === true,
  'Skenario 5: Jam 14:00 (Cream terpakai) -> TIDAK AKTIF / DISABLED untuk Self Studio'
);

// Skenario 6: Jam 15:00 (Kosong) -> BISA DIKLIK / AKTIF
assert(
  slotResults['15:00'].isAvailable === true && slotResults['15:00'].disabled === false,
  'Skenario 6: Jam 15:00 (Kosong) -> BISA DIKLIK / AKTIF untuk Self Studio'
);

// Skenario 7: Paket Studio Foto Biasa (Bukan Self Studio) di Jam 11:00 (Coklat terpakai)
// Masih bisa pesan Hitam/Putih/Abu karena kuota Studio 2 adalah 3 klien!
const resultStudioFoto = checkTimeSlotAvailability({
  allSlots: testSlots,
  selectedPackage: { id: 'grad-indoor', name: 'Graduation Indoor 1', category: 'graduation' },
  existingBookings: testBookings,
  selectedBranch: 'cabang-2',
  existingBackdrops: testBackdrops
});
const slot11StudioFoto = resultStudioFoto.slots.find(s => s.slot === '11:00');
assert(
  slot11StudioFoto.isAvailable === true && slot11StudioFoto.disabled === false,
  'Skenario 7: Jam 11:00 untuk Studio Foto Pro tetap BISA DIKLIK (kapasitas 3 klien)'
);

console.log(`\nHASIL AKHIR: ${passed} Passed, ${failed} Failed`);
if (failed > 0) process.exit(1);
