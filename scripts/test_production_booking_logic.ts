import { checkTimeSlotAvailability, generateOutdoorTimeSlots, getPackageMaxBackdrops } from '../src/components/BookingCalculator';

const slots = ['10:00', '10:30', '11:00', '11:30'];
const outdoorSlots = generateOutdoorTimeSlots();

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
  console.log(`PASS: ${message}`);
}

const packageOne = {
  id: 'paket-1',
  name: 'Paket 1',
  category: 'graduation-indoor',
  description: '1 background'
};

const packageTwo = {
  id: 'paket-2',
  name: 'Paket 2',
  category: 'graduation-indoor',
  description: '2 background'
};

const oneSlotResult = checkTimeSlotAvailability({
  allSlots: slots,
  selectedPackage: packageOne,
  selectedBranch: 'cabang-2',
  existingBookings: { '11:30': 3 },
  maxCapacityPerSlot: 3
});

assert(
  oneSlotResult.slots.find(slot => slot.slot === '11:00')?.isAvailable === true,
  'Paket 1 tetap tersedia jika slot berikutnya penuh'
);

const twoSlotResult = checkTimeSlotAvailability({
  allSlots: slots,
  selectedPackage: packageTwo,
  selectedBranch: 'cabang-2',
  existingBookings: { '11:30': 3 },
  maxCapacityPerSlot: 3
});

assert(
  twoSlotResult.slots.find(slot => slot.slot === '11:00')?.isAvailable === false,
  'Paket 2 ditolak jika slot lanjutan penuh'
);

const selfStudioResult = checkTimeSlotAvailability({
  allSlots: ['10:00', '10:30'],
  selectedPackage: 'selfstudio',
  selectedBranch: 'cabang-2',
  existingBookings: { '10:00': 1 },
  existingBackdrops: { '10:00': ['Hitam'] }
});

assert(
  selfStudioResult.slots.find(slot => slot.slot === '10:00')?.isAvailable === true,
  'Self Studio tetap tersedia ketika hanya background Hitam yang terpakai'
);

assert(outdoorSlots[0] === '05:00' && outdoorSlots[1] === '06:00', 'Slot outdoor pagi dimulai pada 05:00 dan 06:00');
assert(outdoorSlots.includes('12:00') && outdoorSlots.includes('13:05') && outdoorSlots.includes('20:40'), 'Slot outdoor memakai interval 65 menit mulai 12:00');
assert(!outdoorSlots.includes('07:00') && !outdoorSlots.includes('11:00'), 'Slot outdoor melompati jam yang tidak diizinkan');

assert(
  getPackageMaxBackdrops({
    id: 'grad-bundling-ultimate-1',
    name: 'Ultimate Scholar 1 (Graduation Bundling)',
    category: 'graduation-indoor',
    description: 'Paket bundling hemat'
  }) === 1,
  'Ultimate Scholar 1 hanya memakai 1 background'
);

assert(
  getPackageMaxBackdrops({
    id: 'grad-bundling-ultimate-2',
    name: 'Ultimate Scholar 2 (Graduation Bundling)',
    category: 'graduation-indoor',
    description: 'Paket bundling hemat'
  }) === 2,
  'Ultimate Scholar 2 tetap memakai 2 background'
);

console.log('Production booking logic tests passed.');
