const fs = require('fs');

function parseDom(file, label) {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`=== Parsing ${label} ===`);
  
  // Cari semua link foto akun Google: https://lh3.googleusercontent.com/a-/ALV-...
  const photoUrls = [
    ...new Set(
      (content.match(/https:\/\/lh3\.googleusercontent\.com\/a-\/ALV-[^\s"'\\]+/g) || [])
    )
  ];
  console.log(`Found ${photoUrls.length} real user photo URLs (a-/ALV-) in ${label}`);
  photoUrls.forEach(url => console.log('  Photo URL:', url));

  // Cari ulasan atau teks reviewer
  // Cari nama reviewer di sekitar ulasan bintang 5
  const matches = content.match(/aria-label="([0-9]+ bintang[^"]*)"/g);
  console.log(`Rating matches:`, matches ? matches.slice(0, 5) : 'None');
  
  return { label, photoUrls };
}

const res1 = parseDom('scratch/dom1.html', 'Studio 1');
const res2 = parseDom('scratch/dom2.html', 'Studio 2');

fs.writeFileSync('scratch/parsed_reviews.json', JSON.stringify({ res1, res2 }, null, 2));
