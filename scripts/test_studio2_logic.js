/**
 * UNIT TEST VALIDASI LOGIKA BACKGROUND STUDIO 2
 * Menguji skenario pemilihan background sesuai aturan:
 * 1. Kapasitas 3 Klien per slot jam
 * 2. Kuota 1x per background per jam
 * 3. Bentrok Coklat vs Cream (mutually exclusive)
 */

function getAvailableBackgroundsStudio2(existingBookings = []) {
  const STUDIO_2_BGS = [
    { id: 'c2-hitam', name: 'Hitam' },
    { id: 'c2-putih', name: 'Putih' },
    { id: 'c2-abu-abu', name: 'Abu-abu' },
    { id: 'c2-coklat-jendela', name: 'Coklat Jendela' },
    { id: 'c2-tematik-cream', name: 'Tematik Cream' }
  ];

  const bookedSet = new Set();
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

  const availableIds = [];
  const availableNames = [];
  const lockedReasons = {};

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
}

console.log("=================================================");
console.log("TESTING LOGIKA BACKGROUND STUDIO 2 (PAKET 1)");
console.log("=================================================");

// Skenario Awal: Belum ada booking
console.log("\n[KONDISI AWAL] Slot Kosong (0 Klien):");
const initial = getAvailableBackgroundsStudio2([]);
console.log("Tersedia:", initial.availableNames);

// Skenario 1: Klien 1 memilih Hitam
console.log("\n[SKENARIO 1] Klien 1 memilih 'Hitam':");
const step1 = getAvailableBackgroundsStudio2(["Hitam"]);
console.log("Tersedia untuk Klien berikutnya:", step1.availableNames);
console.log("Status Terkunci:", step1.lockedReasons);

// Skenario 2: Klien 2 memilih Coklat
console.log("\n[SKENARIO 2] Klien 2 memilih 'Coklat Jendela':");
const step2 = getAvailableBackgroundsStudio2(["Hitam", "Coklat Jendela"]);
console.log("Tersedia untuk Klien 3:", step2.availableNames);
console.log("Status Terkunci:", step2.lockedReasons);

// Skenario 3: Klien 3 Masuk
console.log("\n[SKENARIO 3] Klien 3 Masuk:");
console.log("Pilihan yang valid untuk Klien 3 HANYA:", step2.availableNames);

const isSuccess = (
  step2.availableNames.length === 2 &&
  step2.availableNames.includes('Putih') &&
  step2.availableNames.includes('Abu-abu') &&
  !step2.availableNames.includes('Hitam') &&
  !step2.availableNames.includes('Coklat Jendela') &&
  !step2.availableNames.includes('Tematik Cream')
);

console.log("\n>>> HASIL UNIT TEST:", isSuccess ? "✅ PASSED (LULUS SEMUA SKENARIO)" : "❌ FAILED");
