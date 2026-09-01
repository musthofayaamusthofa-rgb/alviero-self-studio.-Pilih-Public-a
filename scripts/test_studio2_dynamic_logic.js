/**
 * UNIT TEST VALIDASI LOGIKA KUOTA DINAMIS BACKGROUND STUDIO 2
 * 
 * Aturan Kuota Background Studio 2 (Kuota Dinamis):
 * 1. Putih     : Kuota maksimal 2.
 * 2. Abu-abu   : Kuota maksimal 2.
 * 3. Cream     : Kuota maksimal 1.
 * 4. Hitam & Coklat (ATURAN KUOTA DINAMIS):
 *    - Hitam dan Coklat masing-masing maksimal 2.
 *    - Jika Hitam sudah terpilih 2x -> Batas maksimal Coklat menjadi 1.
 *    - Jika Coklat sudah terpilih 2x -> Batas maksimal Hitam menjadi 1.
 *    - Total gabungan (Hitam + Coklat) maksimal 3 dalam 1 slot jam.
 */

function checkDynamicAvailability(existingBookings = []) {
  // 1. Hitung Jumlah Pemakaian Tiap Background dari Reservasi Aktif
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

    // Hitung Pemakaian Abu-abu
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

  // 2. Evaluasi Kuota Statis (Putih, Abu-abu, Cream)
  const maxPutih = 2;
  const maxAbu = 2;
  const maxCream = 1;

  // 3. Evaluasi Kuota Dinamis (Hitam & Coklat Saling Membatasi: Hitam + Coklat <= 3)
  // Jika Hitam sudah terpilih 2x -> Batas maksimal Coklat menjadi 1
  // Jika Coklat sudah terpilih 2x -> Batas maksimal Hitam menjadi 1
  let dynamicMaxHitam = 2;
  let dynamicMaxCoklat = 2;

  if (usedCoklat >= 2) {
    dynamicMaxHitam = 1;
  } else {
    dynamicMaxHitam = Math.min(2, 3 - usedCoklat);
  }

  if (usedHitam >= 2) {
    dynamicMaxCoklat = 1;
  } else {
    dynamicMaxCoklat = Math.min(2, 3 - usedHitam);
  }

  // Hitung Sisa Kuota
  const remainingHitam = Math.max(0, dynamicMaxHitam - usedHitam);
  const remainingCoklat = Math.max(0, dynamicMaxCoklat - usedCoklat);
  const remainingPutih = Math.max(0, maxPutih - usedPutih);
  const remainingAbu = Math.max(0, maxAbu - usedAbu);
  const remainingCream = Math.max(0, maxCream - usedCream);

  // 4. Struktur Output Detail Background
  const BG_DEFINITIONS = [
    { id: 'c2-hitam', name: 'Hitam', maxQuota: dynamicMaxHitam, used: usedHitam, remaining: remainingHitam },
    { id: 'c2-putih', name: 'Putih', maxQuota: maxPutih, used: usedPutih, remaining: remainingPutih },
    { id: 'c2-abu-abu', name: 'Abu-abu', maxQuota: maxAbu, used: usedAbu, remaining: remainingAbu },
    { id: 'c2-coklat-jendela', name: 'Coklat Jendela', maxQuota: dynamicMaxCoklat, used: usedCoklat, remaining: remainingCoklat },
    { id: 'c2-tematik-cream', name: 'Tematik Cream', maxQuota: maxCream, used: usedCream, remaining: remainingCream }
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
      if ((bg.id === 'c2-hitam' || bg.id === 'c2-coklat-jendela') && (usedHitam + usedCoklat >= 3)) {
        reason = `Kuota gabungan Hitam & Coklat sudah maksimal (Terpakai: Hitam ${usedHitam}x, Coklat ${usedCoklat}x)`;
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
    dynamicLimits: {
      maxHitam: dynamicMaxHitam,
      maxCoklat: dynamicMaxCoklat,
      totalHitamCoklatUsed: usedHitam + usedCoklat
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
// UNIT TESTS SESUAI DUA SKENARIO USER
// =========================================================================

console.log("=========================================================================");
console.log("UNIT TEST: VALIDASI KUOTA DINAMIS BACKGROUND STUDIO 2");
console.log("=========================================================================");

// Kondisi Awal (0 Klien)
console.log("\n[KONDISI AWAL] Slot Kosong (0 Klien):");
const initial = checkDynamicAvailability([]);
console.log("Sisa Kuota       :", initial.remainingQuotas);
console.log("Batas Maksimal   :", initial.dynamicLimits);
console.log("Tersedia         :", initial.availableNames);

// -------------------------------------------------------------------------
// SKENARIO A:
// Klien 1 pilih Hitam (Hitam=1).
// Klien 2 pilih Hitam (Hitam=2).
// Saat Klien 3 masuk, dia masih bisa memilih Coklat, tapi Coklat hanya boleh dipilih 1x saja (kuota Hitam+Coklat = 3).
// -------------------------------------------------------------------------
console.log("\n-------------------------------------------------------------------------");
console.log("[SKENARIO A] Klien 1 (Hitam) & Klien 2 (Hitam) -> Total Hitam = 2x");
const scnA = checkDynamicAvailability(["Hitam", "Hitam"]);
console.log("Hasil Pemakaian  : Hitam = 2x, Coklat = 0x");
console.log("Batas Maksimal   : Hitam =", scnA.dynamicLimits.maxHitam, "| Coklat (menjadi 1x) =", scnA.dynamicLimits.maxCoklat);
console.log("Sisa Kuota       :", scnA.remainingQuotas);
console.log("Status Coklat    :", scnA.backgrounds['c2-coklat-jendela'].status, `(Sisa: ${scnA.backgrounds['c2-coklat-jendela'].remainingQuota}x)`);
console.log("Status Hitam     :", scnA.backgrounds['c2-hitam'].status, `(Sisa: ${scnA.backgrounds['c2-hitam'].remainingQuota}x)`);
console.log("Background Tersedia untuk Klien 3:", scnA.availableNames);

// -------------------------------------------------------------------------
// SKENARIO B:
// Klien 1 pilih Coklat (Coklat=1).
// Klien 2 pilih Coklat (Coklat=2).
// Saat Klien 3 masuk, dia masih bisa memilih Hitam, tapi Hitam hanya boleh dipilih 1x saja.
// -------------------------------------------------------------------------
console.log("\n-------------------------------------------------------------------------");
console.log("[SKENARIO B] Klien 1 (Coklat) & Klien 2 (Coklat) -> Total Coklat = 2x");
const scnB = checkDynamicAvailability(["Coklat Jendela", "Coklat Jendela"]);
console.log("Hasil Pemakaian  : Coklat = 2x, Hitam = 0x");
console.log("Batas Maksimal   : Coklat =", scnB.dynamicLimits.maxCoklat, "| Hitam (menjadi 1x) =", scnB.dynamicLimits.maxHitam);
console.log("Sisa Kuota       :", scnB.remainingQuotas);
console.log("Status Hitam     :", scnB.backgrounds['c2-hitam'].status, `(Sisa: ${scnB.backgrounds['c2-hitam'].remainingQuota}x)`);
console.log("Status Coklat    :", scnB.backgrounds['c2-coklat-jendela'].status, `(Sisa: ${scnB.backgrounds['c2-coklat-jendela'].remainingQuota}x)`);
console.log("Background Tersedia untuk Klien 3:", scnB.availableNames);
console.log("=========================================================================\n");
