/**
 * UNIT TEST VALIDASI LOGIKA BACKGROUND STUDIO 2 (SKENARIO CAMPURAN PAKET 1 & PAKET 2)
 * 
 * Konteks & Aturan Dasar (Studio 2 - Campuran):
 * 1. Dalam 1 slot waktu, maksimal ada 3 klien (2 Klien Paket 1 + 1 Klien Paket 2).
 * 2. Kuota Maksimal per Background dalam 1 jam yang sama:
 *    - Hitam   : Kuota 2
 *    - Putih   : Kuota 2
 *    - Abu-abu : Kuota 2
 *    - Coklat  : Kuota 1
 *    - Cream   : Kuota 1
 */

function checkMixedPackageAvailability(existingBookings = []) {
  // 1. Definisi Konfigurasi Kuota Maksimum Background Studio 2 (Campuran)
  const MAX_QUOTAS = {
    'c2-hitam': { id: 'c2-hitam', name: 'Hitam', max: 2 },
    'c2-putih': { id: 'c2-putih', name: 'Putih', max: 2 },
    'c2-abu-abu': { id: 'c2-abu-abu', name: 'Abu-abu', max: 2 },
    'c2-coklat-jendela': { id: 'c2-coklat-jendela', name: 'Coklat Jendela', max: 1 },
    'c2-tematik-cream': { id: 'c2-tematik-cream', name: 'Tematik Cream', max: 1 }
  };

  // 2. Hitung Penggunaan Tiap Background dari Booking yang Sudah Masuk
  const usageCounts = {
    'c2-hitam': 0,
    'c2-putih': 0,
    'c2-abu-abu': 0,
    'c2-coklat-jendela': 0,
    'c2-tematik-cream': 0
  };

  existingBookings.forEach(booking => {
    const text = String(booking || '').toLowerCase();

    // Hitam
    const hitamMatches = (text.match(/hitam/g) || []).length;
    usageCounts['c2-hitam'] += hitamMatches;

    // Putih
    const putihMatches = (text.match(/putih/g) || []).length;
    usageCounts['c2-putih'] += putihMatches;

    // Abu-abu (hindari double count dari 'abu-abu')
    const abuMatches = (text.match(/abu-abu|abu_abu|\babu\b|c2-abu/g) || []).length;
    usageCounts['c2-abu-abu'] += abuMatches;

    // Coklat
    const coklatMatches = (text.match(/coklat|cokelat/g) || []).length;
    usageCounts['c2-coklat-jendela'] += coklatMatches;

    // Cream
    const creamMatches = (text.match(/cream|krem/g) || []).length;
    usageCounts['c2-tematik-cream'] += creamMatches;
  });

  // 3. Evaluasi Status Ketersediaan Tiap Background
  const availableIds = [];
  const availableNames = [];
  const backgrounds = {};
  const lockedReasons = {};

  Object.keys(MAX_QUOTAS).forEach(bgId => {
    const config = MAX_QUOTAS[bgId];
    const used = usageCounts[bgId] || 0;
    const remaining = Math.max(0, config.max - used);
    const isAvailable = remaining > 0;

    const statusStr = isAvailable ? 'Tersedia' : 'Tidak Tersedia';
    const reason = !isAvailable ? `Kuota habis (${used}/${config.max} sudah terpakai di jam ini)` : undefined;

    backgrounds[bgId] = {
      id: config.id,
      name: config.name,
      maxQuota: config.max,
      usedCount: used,
      remainingQuota: remaining,
      isAvailable: isAvailable,
      status: statusStr,
      reason: reason
    };

    if (isAvailable) {
      availableIds.push(config.id);
      availableNames.push(config.name);
    } else {
      lockedReasons[config.id] = reason;
    }
  });

  // 4. Helper untuk Mengecek Validitas Kombinasi Pasangan 2 Background (Paket 2)
  const canSelectPair = (bgId1, bgId2) => {
    const normId1 = normalizeBgId(bgId1);
    const normId2 = normalizeBgId(bgId2);

    if (!normId1 || !normId2) return { isValid: false, reason: 'Background tidak valid' };
    if (normId1 === normId2) return { isValid: false, reason: 'Tidak boleh memilih 2 background yang sama' };

    const quota1 = backgrounds[normId1]?.remainingQuota || 0;
    const quota2 = backgrounds[normId2]?.remainingQuota || 0;

    if (quota1 < 1) {
      return { isValid: false, reason: `Kuota ${backgrounds[normId1]?.name || bgId1} sudah habis` };
    }
    if (quota2 < 1) {
      return { isValid: false, reason: `Kuota ${backgrounds[normId2]?.name || bgId2} sudah habis` };
    }

    return { isValid: true, reason: 'Kombinasi tersedia dan valid' };
  };

  return {
    availableIds,
    availableNames,
    backgrounds,
    lockedReasons,
    remainingQuotas: {
      hitam: backgrounds['c2-hitam'].remainingQuota,
      putih: backgrounds['c2-putih'].remainingQuota,
      abu: backgrounds['c2-abu-abu'].remainingQuota,
      coklat: backgrounds['c2-coklat-jendela'].remainingQuota,
      cream: backgrounds['c2-tematik-cream'].remainingQuota
    },
    canSelectPair
  };
}

function normalizeBgId(raw) {
  const str = String(raw || '').toLowerCase();
  if (str.includes('hitam')) return 'c2-hitam';
  if (str.includes('putih')) return 'c2-putih';
  if (str.includes('abu')) return 'c2-abu-abu';
  if (str.includes('coklat') || str.includes('cokelat')) return 'c2-coklat-jendela';
  if (str.includes('cream') || str.includes('krem')) return 'c2-tematik-cream';
  return str;
}

// =========================================================================
// EKSEKUSI UNIT TEST SESUAI SKENARIO USER
// =========================================================================

console.log("=========================================================================");
console.log("UNIT TEST: VALIDASI BACKGROUND STUDIO 2 (SKENARIO CAMPURAN PAKET 1 & 2)");
console.log("=========================================================================");

// --- SKENARIO A: Klien 1 (Hitam), Klien 2 (Putih), Klien 3 (Paket 2) ---
console.log("\n[SKENARIO A] Klien 1 (Hitam) & Klien 2 (Putih):");
const resA = checkMixedPackageAvailability(["Hitam", "Putih"]);
console.log("Sisa Kuota Background :", resA.remainingQuotas);
console.log("Background Tersedia   :", resA.availableNames);
console.log("\nPengujian Pilihan Kombinasi untuk Klien 3 (Paket 2):");

const pairsToTest = [
  ['Coklat Jendela', 'Tematik Cream'],
  ['Coklat Jendela', 'Hitam'],
  ['Coklat Jendela', 'Putih'],
  ['Coklat Jendela', 'Abu-abu']
];

pairsToTest.forEach(([bg1, bg2]) => {
  const check = resA.canSelectPair(bg1, bg2);
  const statusIcon = check.isValid ? '✅ VALID / TERSEDIA' : '❌ TERBLOKIR';
  console.log(` - Kombinasi [${bg1} + ${bg2}]: ${statusIcon}`);
});

// --- SKENARIO B: Klien 1 (Hitam), Klien 2 (Abu-abu), Klien 3 (Paket 2) ---
console.log("\n-------------------------------------------------------------------------");
console.log("[SKENARIO B] Klien 1 (Hitam) & Klien 2 (Abu-abu):");
const resB = checkMixedPackageAvailability(["Hitam", "Abu-abu"]);
console.log("Sisa Kuota Background :", resB.remainingQuotas);
console.log("Background Tersedia   :", resB.availableNames);
console.log("\nPengujian Pilihan Kombinasi untuk Klien 3 (Paket 2):");

pairsToTest.forEach(([bg1, bg2]) => {
  const check = resB.canSelectPair(bg1, bg2);
  const statusIcon = check.isValid ? '✅ VALID / TERSEDIA' : '❌ TERBLOKIR';
  console.log(` - Kombinasi [${bg1} + ${bg2}]: ${statusIcon}`);
});

console.log("=========================================================================\n");
