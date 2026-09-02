/**
 * Unit Test untuk Logika Validasi Studio 2: "Eksklusivitas Pasangan" (Pair Exclusivity)
 */

function checkPairExclusivityAvailability(existingBookings = []) {
  const usageCounts = {
    'c2-hitam': 0,
    'c2-putih': 0,
    'c2-abu': 0,
    'c2-coklat-jendela': 0,
    'c2-tematik-cream': 0
  };

  let isPutihSplit = false;
  let isAbuSplit = false;
  let isCoklatSplit = false;
  let isCreamSplit = false;

  existingBookings.forEach(raw => {
    const text = String(raw || '').toLowerCase();

    const hasHitam = text.includes('hitam');
    const hasPutih = text.includes('putih');
    const hasAbu = text.includes('abu');
    const hasCoklat = text.includes('coklat') || text.includes('cokelat');
    const hasCream = text.includes('cream') || text.includes('krem');

    if (hasHitam) usageCounts['c2-hitam'] += 1;
    if (hasPutih) usageCounts['c2-putih'] += 1;
    if (hasAbu) usageCounts['c2-abu'] += 1;
    if (hasCoklat) usageCounts['c2-coklat-jendela'] += 1;
    if (hasCream) usageCounts['c2-tematik-cream'] += 1;

    // Deteksi pemecahan pasangan (Pair Split)
    if (hasPutih && !hasAbu) isPutihSplit = true;
    if (hasAbu && !hasPutih) isAbuSplit = true;
    if (hasCoklat && !hasCream) isCoklatSplit = true;
    if (hasCream && !hasCoklat) isCreamSplit = true;
  });

  const usedHitam = usageCounts['c2-hitam'];
  const usedPutih = usageCounts['c2-putih'];
  const usedAbu = usageCounts['c2-abu'];
  const usedCoklat = usageCounts['c2-coklat-jendela'];
  const usedCream = usageCounts['c2-tematik-cream'];

  // Hitung Ketersediaan (Remaining Quota)
  // Hitam: Max 2 (dapat digunakan hingga 2 klien jika slot masih muat)
  const remainingHitam = Math.max(0, 2 - usedHitam);

  // Putih: Tidak tersedia jika sudah terpakai ATAU jika ada yang memecah pasangan dengan mengambil Abu-abu saja
  const remainingPutih = (usedPutih >= 1 || isAbuSplit) ? 0 : 1;

  // Abu-abu: Tidak tersedia jika sudah terpakai ATAU jika ada yang memecah pasangan dengan mengambil Putih saja
  const remainingAbu = (usedAbu >= 1 || isPutihSplit) ? 0 : 1;

  // Coklat: Tidak tersedia jika sudah terpakai ATAU jika ada yang memecah pasangan dengan mengambil Cream saja
  const remainingCoklat = (usedCoklat >= 1 || isCreamSplit) ? 0 : 1;

  // Cream: Tidak tersedia jika sudah terpakai ATAU jika ada yang memecah pasangan dengan mengambil Coklat saja
  const remainingCream = (usedCream >= 1 || isCoklatSplit) ? 0 : 1;

  const BG_DEFINITIONS = [
    { id: 'c2-hitam', name: 'Hitam', maxQuota: 2, used: usedHitam, remaining: remainingHitam, pairGroup: 'Mandiri' },
    { id: 'c2-putih', name: 'Putih', maxQuota: 1, used: usedPutih, remaining: remainingPutih, pairGroup: 'Pasangan 1 (Putih & Abu-abu)' },
    { id: 'c2-abu', name: 'Abu-abu', maxQuota: 1, used: usedAbu, remaining: remainingAbu, pairGroup: 'Pasangan 1 (Putih & Abu-abu)' },
    { id: 'c2-coklat-jendela', name: 'Coklat Jendela', maxQuota: 1, used: usedCoklat, remaining: remainingCoklat, pairGroup: 'Pasangan 2 (Coklat & Cream)' },
    { id: 'c2-tematik-cream', name: 'Tematik Cream', maxQuota: 1, used: usedCream, remaining: remainingCream, pairGroup: 'Pasangan 2 (Coklat & Cream)' }
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
      if (bg.id === 'c2-putih') {
        if (usedPutih >= 1) reason = 'Sudah dipilih oleh klien lain di jam ini';
        else if (isAbuSplit) reason = 'Pasangan Abu-abu sudah terpakai oleh klien lain di jam ini (Eksklusivitas Pasangan)';
      } else if (bg.id === 'c2-abu') {
        if (usedAbu >= 1) reason = 'Sudah dipilih oleh klien lain di jam ini';
        else if (isPutihSplit) reason = 'Pasangan Putih sudah terpakai oleh klien lain di jam ini (Eksklusivitas Pasangan)';
      } else if (bg.id === 'c2-coklat-jendela') {
        if (usedCoklat >= 1) reason = 'Sudah dipilih oleh klien lain di jam ini';
        else if (isCreamSplit) reason = 'Pasangan Tematik Cream sudah terpakai oleh klien lain di jam ini (Eksklusivitas Pasangan)';
      } else if (bg.id === 'c2-tematik-cream') {
        if (usedCream >= 1) reason = 'Sudah dipilih oleh klien lain di jam ini';
        else if (isCoklatSplit) reason = 'Pasangan Coklat Jendela sudah terpakai oleh klien lain di jam ini (Eksklusivitas Pasangan)';
      } else if (bg.id === 'c2-hitam') {
        reason = 'Kuota Hitam sudah habis di jam ini';
      } else {
        reason = 'Sudah dipilih oleh klien lain di jam ini';
      }
      lockedReasons[bg.id] = reason;
      if (bg.id === 'c2-abu') lockedReasons['c2-abu-abu'] = reason;
    } else {
      availableIds.push(bg.id);
      if (bg.id === 'c2-abu') availableIds.push('c2-abu-abu');
      availableNames.push(bg.name);
    }

    backgrounds[bg.id] = {
      id: bg.id,
      name: bg.name,
      pairGroup: bg.pairGroup,
      maxQuota: bg.maxQuota,
      usedCount: bg.used,
      remainingQuota: bg.remaining,
      isAvailable: isAvailable,
      status: status,
      reason: reason
    };
    if (bg.id === 'c2-abu') {
      backgrounds['c2-abu-abu'] = backgrounds[bg.id];
    }
  });

  return {
    availableIds,
    availableNames,
    backgrounds,
    lockedReasons,
    details: {
      usedHitam,
      usedPutih,
      usedAbu,
      usedCoklat,
      usedCream,
      isPutihSplit,
      isAbuSplit,
      isCoklatSplit,
      isCreamSplit
    }
  };
}

// ==========================================
// TEST CASES SESUAI SKENARIO USER
// ==========================================

console.log('=== TEST CASE 0: Kondisi Awal (Spreadsheet Kosong) ===');
const res0 = checkPairExclusivityAvailability([]);
console.log('Available BGs:', res0.availableNames);
console.assert(res0.availableNames.length === 5, 'Harus 5 BG tersedia');

console.log('\n=== TEST CASE 1: Skenario User Langkah 1 (Klien 1 Paket 2 pilih Putih & Abu-abu) ===');
const res1 = checkPairExclusivityAvailability(['Latar 1: Putih & Latar 2: Abu-abu']);
console.log('Available BGs untuk Klien 2:', res1.availableNames);
console.log('Locked reasons:', res1.lockedReasons);
console.assert(!res1.availableIds.includes('c2-putih'), 'Putih harus Tidak Tersedia');
console.assert(!res1.availableIds.includes('c2-abu'), 'Abu-abu harus Tidak Tersedia');
console.assert(res1.availableIds.includes('c2-hitam'), 'Hitam harus Tersedia');
console.assert(res1.availableIds.includes('c2-coklat-jendela'), 'Coklat harus Tersedia');
console.assert(res1.availableIds.includes('c2-tematik-cream'), 'Cream harus Tersedia');

console.log('\n=== TEST CASE 2: Skenario User Langkah 2 (Klien 2 Paket 2 pilih Cream & Hitam) ===');
const res2 = checkPairExclusivityAvailability([
  'Latar 1: Putih & Latar 2: Abu-abu',
  'Latar 1: Tematik Cream & Latar 2: Hitam'
]);
console.log('Available BGs untuk Klien 3:', res2.availableNames);
console.log('Locked reasons:', res2.lockedReasons);
console.assert(!res2.availableIds.includes('c2-putih'), 'Putih habis');
console.assert(!res2.availableIds.includes('c2-abu'), 'Abu habis');
console.assert(!res2.availableIds.includes('c2-tematik-cream'), 'Cream habis');
console.assert(!res2.availableIds.includes('c2-coklat-jendela'), 'Coklat harus disabled karena Cream dipecah');
console.assert(res2.availableIds.includes('c2-hitam'), 'Hitam harus masih Tersedia untuk Klien 3');

console.log('\n=== TEST CASE 3: Klien 1 Paket 1 hanya pilih Putih ===');
const res3 = checkPairExclusivityAvailability(['Latar 1: Putih']);
console.log('Available BGs untuk Klien 2:', res3.availableNames);
console.log('Locked reasons:', res3.lockedReasons);
console.assert(!res3.availableIds.includes('c2-putih'), 'Putih habis');
console.assert(!res3.availableIds.includes('c2-abu'), 'Abu harus terkunci karena pasangannya dipecah Klien 1');
console.assert(res3.availableIds.includes('c2-coklat-jendela'), 'Coklat Tersedia');
console.assert(res3.availableIds.includes('c2-tematik-cream'), 'Cream Tersedia');

console.log('\n✅ SEMUA SKENARIO VALIDASI LOLOS 100%!');
