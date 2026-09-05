import { checkTimeSlotAvailability } from '../src/components/BookingCalculator';

const slots = ['10:00', '10:30', '11:00', '11:30'];

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

console.log('Production booking logic tests passed.');
