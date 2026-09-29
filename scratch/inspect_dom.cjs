const fs = require('fs');

function checkFile(path, name) {
  const c = fs.readFileSync(path, 'utf8');
  console.log(`=== ${name} ===`);
  const m = c.match(/https?:\/\/[^\s"'<>]+/g) || [];
  const g = m.filter(u => u.includes('googleusercontent.com'));
  console.log('googleusercontent URLs:', [...new Set(g)]);
  
  // Cari teks reviewer
  const reviewWords = ['ulasan', 'bintang', 'Defi', 'Naila', 'Faisal', 'Salshabilla', 'Amelia'];
  reviewWords.forEach(w => {
    const count = (c.match(new RegExp(w, 'gi')) || []).length;
    console.log(`Word "${w}":`, count);
  });
}

checkFile('scratch/dom1_reviews.html', 'Studio 1 Reviews');
checkFile('scratch/dom2_reviews.html', 'Studio 2 Reviews');
