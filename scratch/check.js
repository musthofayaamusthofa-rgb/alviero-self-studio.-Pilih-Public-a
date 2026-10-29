const fs = require('fs');
const content = fs.readFileSync('src/data/pricelistData.ts', 'utf8');
const match = content.match(/export const PACKAGES: PackageItem\[\] = (\[[\s\S]*?\n\];)/);
if (match) {
  const ids = [...match[1].matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]);
  console.log('PACKAGES Count:', ids.length, ids);
}
const cfg = JSON.parse(fs.readFileSync('src/data/studioConfig.json', 'utf8'));
console.log('studioPackages Count:', cfg.studioPackages?.length, cfg.studioPackages?.map(p => p.id));

