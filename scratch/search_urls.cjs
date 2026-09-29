const fs = require('fs');
const c = fs.readFileSync('scratch/dom1.html', 'utf8');
const m = c.match(/https?:\/\/[^\s"'<>]+/g) || [];
const googleUrls = m.filter(u => u.includes('googleusercontent'));
console.log('googleusercontent count:', googleUrls.length);
console.log('unique googleusercontent:', [...new Set(googleUrls)].slice(0, 15));
console.log('Title in dom1:', c.match(/<title>([^<]+)<\/title>/)?.[1]);
