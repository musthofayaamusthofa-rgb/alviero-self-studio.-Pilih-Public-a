/**
 * UNIT TEST VALIDASI LOGIKA KUOTA DINAMIS STUDIO 2 (PAKET 2 / 2 BG PER KLIEN)
 * 
 * Aturan Dasar Studio 2 (Paket 2):
 * 1. Dalam 1 slot waktu, maksimal ada 3 klien.
 * 2. Setiap klien wajib memilih 2 background berbeda (Total 6 pilihan BG per slot).
 * 
 * Aturan Kuota Background:
 * - Putih   : Kuota maksimal 1
 * - Abu-abu : Kuota maksimal 1
 * - Cream   : Kuota maksimal 1
 * - Hitam & Coklat (KUOTA DINAMIS):
 *   - Masing-masing maksimal 2.
 *   - Total gabungan (Hitam + Coklat) maksimal 3 (countHitam + countCoklat <= 3).
 *   - Jika Hitam terpilih 2x -> Coklat maksimal 1 (jika sudah terpakai 1x, sisa 0).
 *   - Jika Coklat terpilih 2x -> Hitam maksimal 1 (jika sudah terpakai 1x, sisa 0).
 *   - Jika Hitam(2) + Coklat(1) = 3 -> Keduanya otomatis habis (0).
 */

function checkPaket2Availability(existingBookings = []) {
  // 1. Hitung Jumlah Pemakaian Tiap Background dari Reservasi yang Ada
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

  // 2. Evaluasi Kuota Statis (Putih: 1, Abu-abu: 1, Cream: 1)
  const maxPutih = 1;
  const maxAbu = 1;
  const maxCream = 1;

  const remainingPutih = Math.max(0, maxPutih - usedPutih);
  const remainingAbu = Math.max(0, maxAbu - usedAbu);
  const remainingCream = Math.max(0, maxCream - usedCream);

  // 3. Evaluasi Kuota Dinamis (Hitam & Coklat: Masing-masing max 2, Total gabungan <= 3)
  const totalHitamCoklat = usedHitam + usedCoklat;

  let remainingHitam = 0;
  if (usedHitam < 2 && totalHitamCoklat < 3) {
    remainingHitam = Math.min(2 - usedHitam, 3 - totalHitamCoklat);
  }

  let remainingCoklat = 0;
  if (usedCoklat < 2 && totalHitamCoklat < 3) {
    remainingCoklat = Math.min(2 - usedCoklat, 3 - totalHitamCoklat);
  }

  // 4. Struktur Data Ketersediaan Detail Tiap Background
  const BG_DEFINITIONS = [
    { id: 'c2-hitam', name: 'Hitam', maxQuota: 2, used: usedHitam, remaining: remainingHitam },
    { id: 'c2-putih', name: 'Putih', maxQuota: maxPutih, used: usedPutih, remaining: remainingPutih },
    { id: 'c2-abu-abu', name: 'Abu-abu', maxQuota: maxAbu, used: usedAbu, remaining: remainingAbu },
    { id: 'c2-coklat-jendela', name: 'Coklat Jendela', maxQuota: 2, used: usedCoklat, remaining: remainingCoklat },
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
    totalHitamCoklatUsed: totalHitamCoklat,
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
// UNIT TESTS SESUAI 3 LANGKAH SKENARIO USER
// =========================================================================

console.log("=========================================================================");
console.log("UNIT TEST: VALIDASI KUOTA DINAMIS STUDIO 2 (PAKET 2)");
console.log("=========================================================================");

// Kondisi Awal: Slot Kosong (0 Klien)
console.log("\n[KONDISI AWAL] Slot Kosong (0 Klien):");
const res0 = checkPaket2Availability([]);
console.log("Sisa Kuota :", res0.remainingQuotas);
console.log("Tersedia   :", res0.availableNames);

// -------------------------------------------------------------------------
// LANGKAH 1: Klien 1 memilih Hitam dan Putih
// -------------------------------------------------------------------------
console.log("\n-------------------------------------------------------------------------");
console.log("[LANGKAH 1] Klien 1 memilih: Hitam dan Putih");
const res1 = checkPaket2Availability(["Hitam, Putih"]);
console.log("Sisa Kuota :", res1.remainingQuotas);
console.log("Status Per Background:");
Object.values(res1.backgrounds).forEach(bg => {
  console.log(` - ${bg.name.padEnd(15)}: [${bg.status}] (Terpakai: ${bg.usedCount}/${bg.maxQuota}, Sisa: ${bg.remainingQuota})`);
});
console.log("Background Tersedia:", res1.availableNames);

// -------------------------------------------------------------------------
// LANGKAH 2: Klien 2 memilih Coklat dan Hitam
// -------------------------------------------------------------------------
console.log("\n-------------------------------------------------------------------------");
console.log("[LANGKAH 2] Klien 2 memilih: Coklat dan Hitam");
const res2 = checkPaket2Availability([
  "Hitam, Putih",
  "Coklat Jendela, Hitam"
]);
console.log("Total Pemakaian Hitam + Coklat:", res2.totalHitamCoklatUsed, "/ 3");
console.log("Sisa Kuota :", res2.remainingQuotas);
console.log("Status Per Background:");
Object.values(res2.backgrounds).forEach(bg => {
  console.log(` - ${bg.name.padEnd(15)}: [${bg.status}] (Terpakai: ${bg.usedCount}/${bg.maxQuota}, Sisa: ${bg.remainingQuota})`);
});
console.log("Background Tersedia:", res2.availableNames);

// -------------------------------------------------------------------------
// LANGKAH 3: Klien 3 Masuk
// -------------------------------------------------------------------------
console.log("\n-------------------------------------------------------------------------");
console.log("[LANGKAH 3] Klien 3 Masuk");
console.log("Karena Putih, Hitam, dan Coklat sudah habis/disabled,");
console.log("Klien 3 HANYA bisa memilih:", res2.availableNames.join(" dan "));
console.log("=========================================================================\n");
