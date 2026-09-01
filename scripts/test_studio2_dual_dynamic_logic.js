/**
 * UNIT TEST VALIDASI LOGIKA KUOTA DINAMIS GANDA STUDIO 2
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

function checkDualDynamicAvailability(existingBookings = []) {
  // 1. Ekstrak Jumlah Pemakaian Tiap Background dari Reservasi yang Ada
  const usageCounts = {
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

  const availableIds = [];
  const availableNames = [];
  const backgrounds = {};
  const lockedReasons = {};

  BG_DEFINITIONS.forEach(bg => {
    const isAvailable = bg.remaining > 0;
    const status = isAvailable ? 'Tersedia' : 'Tidak Tersedia';
    let reason = undefined;

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
}

// =========================================================================
// UNIT TEST SESUAI SKENARIO PENGUJIAN USER
// =========================================================================

console.log("=========================================================================");
console.log("UNIT TEST: VALIDASI KUOTA DINAMIS GANDA STUDIO 2");
console.log("=========================================================================");

// Kondisi Awal: Slot Kosong (0 Klien)
console.log("\n[KONDISI AWAL] Slot Kosong (0 Klien):");
const res0 = checkDualDynamicAvailability([]);
console.log("Sisa Kuota       :", res0.remainingQuotas);
console.log("Tersedia         :", res0.availableNames);

// -------------------------------------------------------------------------
// LANGKAH 1: Klien 1 masuk memilih Hitam dan Putih
// -------------------------------------------------------------------------
console.log("\n-------------------------------------------------------------------------");
console.log("[LANGKAH 1] Klien 1 masuk memilih: Hitam dan Putih");
const res1 = checkDualDynamicAvailability(["Hitam, Putih"]);
console.log("Sisa Kuota       :", res1.remainingQuotas);
console.log("Status Per Background:");
Object.values(res1.backgrounds).forEach(bg => {
  console.log(` - ${bg.name.padEnd(15)}: [${bg.status.padEnd(14)}] (Terpakai: ${bg.usedCount}/${bg.maxQuota}, Sisa: ${bg.remainingQuota})`);
});
console.log("Background Tersedia:", res1.availableNames);

// -------------------------------------------------------------------------
// LANGKAH 2: Klien 2 masuk memilih Hitam dan Putih
// -------------------------------------------------------------------------
console.log("\n-------------------------------------------------------------------------");
console.log("[LANGKAH 2] Klien 2 masuk memilih: Hitam dan Putih (Total Hitam=2x, Putih=2x)");
const res2 = checkDualDynamicAvailability([
  "Hitam, Putih",
  "Hitam, Putih"
]);
console.log("Statistik Grup 1 (Hitam + Coklat):", res2.groupStats.grup1_HitamCoklat.used, "/ 3");
console.log("Statistik Grup 2 (Putih + Abu)   :", res2.groupStats.grup2_PutihAbu.used, "/ 2");
console.log("Sisa Kuota       :", res2.remainingQuotas);
console.log("Status Evaluasi Sistem:");
Object.values(res2.backgrounds).forEach(bg => {
  console.log(` - ${bg.name.padEnd(15)}: [${bg.status.padEnd(14)}] (Terpakai: ${bg.usedCount}/${bg.maxQuota}, Sisa: ${bg.remainingQuota}) ${bg.reason ? '-> ' + bg.reason : ''}`);
});

// -------------------------------------------------------------------------
// LANGKAH 3: Klien 3 Masuk
// -------------------------------------------------------------------------
console.log("\n-------------------------------------------------------------------------");
console.log("[LANGKAH 3] Klien 3 Masuk");
console.log("Karena Putih, Hitam, dan Abu-abu sudah tidak bisa dipilih,");
console.log("Klien 3 HANYA bisa memilih:", res2.availableNames.join(" dan "));
console.log("=========================================================================\n");
