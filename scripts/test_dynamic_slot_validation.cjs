/**
 * UNIT TEST: VALIDASI KETERSEDIAAN JAM SLOT STUDIO FOTO (DURASI DINAMIS)
 * 
 * Aturan:
 * 1. Paket 1: Butuh 1 slot (30 Menit) -> Hanya cek slot itu sendiri.
 * 2. Paket 2 ke atas: Butuh 2 slot berurutan (60 Menit / 1 Jam) -> Cek slot (n) dan slot lanjutan (n+1).
 *    Jika slot lanjutan (n+1) penuh, maka slot (n) otomatis DISABLED / TIDAK AKTIF.
 */

function checkTimeSlotAvailability({
  allSlots,
  selectedPackage,
  existingBookings, // Map dari slot -> jumlah klien booking, misal: { '11:30': 3 }
  maxCapacityPerSlot = 3 // Studio 2 = 3 klien, Studio 1 = 1 klien
}) {
  const isPaket2OrHigher = (
    selectedPackage.maxBackdrops > 1 ||
    selectedPackage.name.toLowerCase().includes('paket 2') ||
    selectedPackage.name.toLowerCase().includes('paket 3') ||
    selectedPackage.name.toLowerCase().includes('paket 4') ||
    selectedPackage.name.toLowerCase().includes('supreme') ||
    selectedPackage.name.toLowerCase().includes('infinity') ||
    selectedPackage.name.toLowerCase().includes('ultimate') ||
    selectedPackage.name.toLowerCase().includes('cumlaude') ||
    selectedPackage.name.toLowerCase().includes('group outdoor') ||
    selectedPackage.name.toLowerCase().includes('happy nest') ||
    selectedPackage.name.toLowerCase().includes('opulent') ||
    selectedPackage.name.toLowerCase().includes('golden') ||
    selectedPackage.name.toLowerCase().includes('sweet memories') ||
    selectedPackage.name.toLowerCase().includes('glow sweet') ||
    selectedPackage.name.toLowerCase().includes('sweet light') ||
    selectedPackage.name.toLowerCase().includes('signature') ||
    selectedPackage.name.toLowerCase().includes('royal') ||
    selectedPackage.name.toLowerCase().includes('imperial') ||
    selectedPackage.name.toLowerCase().includes('velvet') ||
    selectedPackage.name.toLowerCase().includes('bundling')
  );

  const requiredSlotsCount = isPaket2OrHigher ? 2 : 1;
  const durationMinutes = requiredSlotsCount * 30;

  const result = allSlots.map((slot, index) => {
    const currentOccupancy = existingBookings[slot] || 0;
    const isCurrentSlotFull = currentOccupancy >= maxCapacityPerSlot;

    // 1. Cek slot itu sendiri
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

    // 2. Jika Paket 1 (Hanya butuh 1 slot 30 menit)
    if (requiredSlotsCount === 1) {
      return {
        slot,
        isAvailable: true,
        disabled: false,
        occupiedSlots: [slot],
        durationMinutes: 30,
        reason: 'Tersedia'
      };
    }

    // 3. Jika Paket 2 ke atas (Butuh 2 slot berurutan = 60 Menit)
    // Kasus khusus slot terakhir (20:30) diperbolehkan dengan overtime fee 35k
    if (index === allSlots.length - 1) {
      return {
        slot,
        isAvailable: true,
        disabled: false,
        occupiedSlots: [slot],
        durationMinutes: 60,
        isOvertime: true,
        reason: 'Tersedia (+Rp 35.000 Overtime Melebihi 21.00 WIB)'
      };
    }

    // Cek slot lanjutan (n+1)
    const nextSlot = allSlots[index + 1];
    const nextOccupancy = existingBookings[nextSlot] || 0;
    const isNextSlotFull = nextOccupancy >= maxCapacityPerSlot;

    if (isNextSlotFull) {
      return {
        slot,
        isAvailable: false,
        disabled: true,
        reason: `Slot lanjutan (${nextSlot}) sudah penuh, durasi 1 jam tidak muat`,
        occupiedSlots: [slot, nextSlot],
        durationMinutes: 60
      };
    }

    return {
      slot,
      isAvailable: true,
      disabled: false,
      occupiedSlots: [slot, nextSlot],
      durationMinutes: 60,
      reason: 'Tersedia (1 Jam Penuh)'
    };
  });

  return {
    packageInfo: {
      name: selectedPackage.name,
      isPaket2OrHigher,
      requiredSlotsCount,
      durationMinutes
    },
    slots: result
  };
}

// =========================================================================
// RUNNING UNIT TEST BERDASARKAN SKENARIO USER
// =========================================================================
console.log('=========================================================================');
console.log('UNIT TEST: VALIDASI KETERSEDIAAN JAM SLOT DINAMIS (STUDIO 1 & 2)');
console.log('=========================================================================\n');

const standardSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30'
];

// Kondisi Database: Jam 11:30 sudah booking penuh (3/3 Klien), jam 11:00 masih kosong (0 Klien)
const databaseState = {
  '11:30': 3, // Penuh
  '11:00': 0  // Kosong
};

console.log('[KONDISI DATABASE]:');
console.log(' - Jam 11:00 : Kosong (0 Klien)');
console.log(' - Jam 11:30 : PENUH (3 Klien)\n');

// -------------------------------------------------------------------------
// SKENARIO A: Klien A memilih Paket 1 (Durasi 30 Menit / 1 Slot)
// -------------------------------------------------------------------------
const paket1 = { id: 'paket-1', name: 'Elegant Scholar (Graduation Indoor 1)', maxBackdrops: 1 };
const resA = checkTimeSlotAvailability({
  allSlots: standardSlots,
  selectedPackage: paket1,
  existingBookings: databaseState,
  maxCapacityPerSlot: 3
});

const slot1100_A = resA.slots.find(s => s.slot === '11:00');
const slot1130_A = resA.slots.find(s => s.slot === '11:30');

console.log('-------------------------------------------------------------------------');
console.log('SKENARIO A: Klien A Memilih Paket 1 (Butuh 30 Menit / 1 Slot)');
console.log(`Paket Terpilih : ${paket1.name}`);
console.log(`Status Jam 11:00: [${slot1100_A.disabled ? 'DISABLED' : 'AKTIF / BISA DIKLIK'}] -> Alasan: ${slot1100_A.reason}`);
console.log(`Status Jam 11:30: [${slot1130_A.disabled ? 'DISABLED' : 'AKTIF / BISA DIKLIK'}] -> Alasan: ${slot1130_A.reason}`);

if (!slot1100_A.disabled) {
  console.log('✅ TEST SKENARIO A: PASSED! (Jam 11:00 Aktif karena hanya butuh 1 slot 11:00)');
} else {
  console.log('❌ TEST SKENARIO A: FAILED!');
}

// -------------------------------------------------------------------------
// SKENARIO B: Klien B memilih Paket 2 (Durasi 60 Menit / 2 Slot)
// -------------------------------------------------------------------------
const paket2 = { id: 'paket-2', name: 'Supreme Scholar (Graduation Indoor 2)', maxBackdrops: 2 };
const resB = checkTimeSlotAvailability({
  allSlots: standardSlots,
  selectedPackage: paket2,
  existingBookings: databaseState,
  maxCapacityPerSlot: 3
});

const slot1100_B = resB.slots.find(s => s.slot === '11:00');
const slot1130_B = resB.slots.find(s => s.slot === '11:30');

console.log('\n-------------------------------------------------------------------------');
console.log('SKENARIO B: Klien B Memilih Paket 2 (Butuh 1 Jam / 2 Slot Berurutan: 11:00 & 11:30)');
console.log(`Paket Terpilih : ${paket2.name}`);
console.log(`Status Jam 11:00: [${slot1100_B.disabled ? 'DISABLED / TIDAK AKTIF' : 'AKTIF'}] -> Alasan: ${slot1100_B.reason}`);
console.log(`Status Jam 11:30: [${slot1130_B.disabled ? 'DISABLED / TIDAK AKTIF' : 'AKTIF'}] -> Alasan: ${slot1130_B.reason}`);

if (slot1100_B.disabled) {
  console.log('✅ TEST SKENARIO B: PASSED! (Jam 11:00 Otomatis Disabled karena slot lanjutan 11:30 sudah penuh)');
} else {
  console.log('❌ TEST SKENARIO B: FAILED!');
}

console.log('=========================================================================\n');
