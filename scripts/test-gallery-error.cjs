const fs = require('fs');

const studioConfig = JSON.parse(fs.readFileSync('src/data/studioConfig.json', 'utf8'));

console.log('Total equipmentItems:', studioConfig.equipmentItems?.length);
studioConfig.equipmentItems?.forEach((e, idx) => {
  console.log(`\n--- Equipment #${idx} (${e.id}) ---`);
  console.log('title:', e.title);
  console.log('imageUrl:', e.imageUrl);
  console.log('description:', e.description ? e.description.slice(0, 50) + '...' : '❌ UNDEFINED');
});
