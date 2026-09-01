/**
 * UNIT TEST VALIDASI LOGIKA BACKGROUND STUDIO 2 (PAKET 2 / 2 BACKGROUND PER KLIEN)
 * 
 * Aturan Dasar & Kuota Background (Studio 2 - Paket 2):
 * 1. Dalam 1 slot waktu, maksimal ada 3 klien. Setiap klien memilih 2 background (Total 6 pilihan BG).
 * 2. Kuota Maksimal per Background dalam 1 jam yang sama:
 *    - Hitam   : Kuota 2
 *    - Putih   : Kuota 1
 *    - Abu-abu : Kuota 1
 *    - Coklat  : Kuota 1
 *    - Cream   : Kuota 1
 */

function checkPaket2Availability(existingBookings = []) {
  // 1. Definisi Konfigurasi Kuota Maksimum Background Studio 2
  const MAX_QUOTAS = {
    'c2-hitam': { id: 'c2-hitam', name: 'Hitam', max: 2 },
    'c2-putih': { id: 'c2-putih', name: 'Putih', max: 1 },
    'c2-abu-abu': { id: 'c2-abu-abu', name: 'Abu-abu', max: 1 },
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

    // Deteksi Hitam
    const hitamMatches = (text.match(/hitam/g) || []).length;
    usageCounts['c2-hitam'] += hitamMatches;

    // Deteksi Putih
    const putihMatches = (text.match(/putih/g) || []).length;
    usageCounts['c2-putih'] += putihMatches;

    // Deteksi Abu-abu (tangani 'abu-abu' agar dihitung 1x per entri)
    const abuMatches = (text.match(/abu-abu|abu_abu|\babu\b|c2-abu/g) || []).length;
    usageCounts['c2-abu-abu'] += abuMatches;

    // Deteksi Coklat
    const coklatMatches = (text.match(/coklat|cokelat/g) || []).length;
    usageCounts['c2-coklat-jendela'] += coklatMatches;

    // Deteksi Cream
    const creamMatches = (text.match(/cream|krem/g) || []).length;
    usageCounts['c2-tematik-cream'] += creamMatches;
  });

  // 3. Evaluasi Status Ketersediaan & Sisa Kuota
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
    }
  };
}

// =========================================================================
// EKSEKUSI UNIT TEST SESUAI SKENARIO USER
// =========================================================================

console.log("=========================================================================");
console.log("UNIT TEST: VALIDASI KETERSEDIAAN BACKGROUND STUDIO 2 (PAKET 2)");
console.log("=========================================================================");

// Kondisi Awal: Belum ada pemesanan
console.log("\n[KONDISI AWAL] Slot Kosong (0 Klien):");
const res0 = checkPaket2Availability([]);
console.log("Sisa Kuota :", res0.remainingQuotas);
console.log("Tersedia   :", res0.availableNames);

// Skenario 1: Klien 1 memilih Hitam dan Putih
console.log("\n-------------------------------------------------------------------------");
console.log("[SKENARIO 1] Klien 1 memilih: Hitam & Putih");
const res1 = checkPaket2Availability(["Latar 1: Hitam & Latar 2: Putih"]);
console.log("Sisa Kuota :", res1.remainingQuotas);
console.log("Background Tersedia:", res1.availableNames);
console.log("Detail Status:");
Object.values(res1.backgrounds).forEach(bg => {
  console.log(` - ${bg.name.padEnd(15)}: [${bg.status}] (Terpakai: ${bg.usedCount}/${bg.maxQuota}, Sisa: ${bg.remainingQuota})`);
});

// Skenario 2: Klien 2 memilih Abu-abu dan Hitam
console.log("\n-------------------------------------------------------------------------");
console.log("[SKENARIO 2] Klien 2 memilih: Abu-abu & Hitam");
const res2 = checkPaket2Availability([
  "Latar 1: Hitam & Latar 2: Putih",
  "Latar 1: Abu-abu & Latar 2: Hitam"
]);
console.log("Sisa Kuota :", res2.remainingQuotas);
console.log("Background Tersedia:", res2.availableNames);
console.log("Detail Status:");
Object.values(res2.backgrounds).forEach(bg => {
  console.log(` - ${bg.name.padEnd(15)}: [${bg.status}] (Terpakai: ${bg.usedCount}/${bg.maxQuota}, Sisa: ${bg.remainingQuota})`);
});

// Skenario 3: Klien 3 masuk
console.log("\n-------------------------------------------------------------------------");
console.log("[SKENARIO 3] Klien 3 Masuk");
console.log("Karena Hitam, Putih, dan Abu-abu sudah habis (kuota = 0),");
console.log("Klien 3 HANYA bisa memilih:", res2.availableNames.join(" dan "));
console.log("=========================================================================\n");
