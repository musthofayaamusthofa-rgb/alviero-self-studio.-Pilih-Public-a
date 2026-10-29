const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync('src/data/studioConfig.json', 'utf8'));

function parsePriceToNumber(val, fallback = 0) {
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  if (!val || typeof val !== 'string') return fallback;
  const str = val.trim();
  if (!str) return fallback;
  const kMatch = str.match(/^([\d.,]+)\s*(k|rb|ribu)$/i);
  if (kMatch) {
    const numPart = parseFloat(kMatch[1].replace(/,/g, '.'));
    if (!isNaN(numPart)) return Math.round(numPart * 1000);
  }
  const jtMatch = str.match(/^([\d.,]+)\s*(jt|juta|m)$/i);
  if (jtMatch) {
    const numPart = parseFloat(jtMatch[1].replace(/,/g, '.'));
    if (!isNaN(numPart)) return Math.round(numPart * 1000000);
  }
  const digits = str.replace(/[^\d]/g, '');
  if (digits) {
    const parsed = parseInt(digits, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return fallback;
}

function parseDurationMinutes(val, fallback = 30) {
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  if (!val || typeof val !== 'string') return fallback;
  const m = val.match(/(\d+)\s*menit/i);
  if (m) {
    const parsed = parseInt(m[1], 10);
    if (!isNaN(parsed)) return parsed;
  }
  const digits = val.replace(/[^\d]/g, '');
  if (digits) {
    const parsed = parseInt(digits, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return fallback;
}

// Test with self-special-narsis
const narsisPkg = cfg.studioPackages.find(p => p.id === 'self-special-narsis');
console.log('narsis in config:', narsisPkg.name, narsisPkg.price, parsePriceToNumber(narsisPkg.price), narsisPkg.duration, parseDurationMinutes(narsisPkg.duration));

// Test with couple-eternal-love
const couplePkg = cfg.studioPackages.find(p => p.id === 'couple-eternal-love');
console.log('couple in config:', couplePkg.name, couplePkg.price, parsePriceToNumber(couplePkg.price));
