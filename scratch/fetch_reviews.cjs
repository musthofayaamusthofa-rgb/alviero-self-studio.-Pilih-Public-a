const { execSync } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const studio1ReviewUrl = 'https://www.google.com/maps/place/Alviero+Studio+Foto/@-7.8935471,112.5930502,17z/data=!4m8!3m7!1s0x2e788121b3705f25:0xed1add8fb06fdc8!8m2!3d-7.8935471!4d112.5956251!9m1!1b1!16s%2Fg%2F11q9m93g86?entry=ttu&hl=id';
const studio2ReviewUrl = 'https://www.google.com/maps/place/Alviero+Studio+Foto+2/@-7.9465117,112.6053447,17z/data=!4m8!3m7!1s0x2e78830048878fc5:0x90e97fc84d555935!8m2!3d-7.946517!4d112.6079196!9m1!1b1!16s%2Fg%2F11yqbx4j72?entry=ttu&hl=id';

console.log('Dumping Studio 1 Reviews tab...');
try {
  const dom1 = execSync(`"${chromePath}" --headless=new --disable-gpu --virtual-time-budget=15000 --dump-dom "${studio1ReviewUrl}"`, {
    maxBuffer: 60 * 1024 * 1024,
    encoding: 'utf8',
    timeout: 35000
  });
  fs.writeFileSync('scratch/dom1_reviews.html', dom1, 'utf8');
  console.log('Saved dom1_reviews length:', dom1.length);
} catch (e) {
  console.error(e.message);
}

console.log('Dumping Studio 2 Reviews tab...');
try {
  const dom2 = execSync(`"${chromePath}" --headless=new --disable-gpu --virtual-time-budget=15000 --dump-dom "${studio2ReviewUrl}"`, {
    maxBuffer: 60 * 1024 * 1024,
    encoding: 'utf8',
    timeout: 35000
  });
  fs.writeFileSync('scratch/dom2_reviews.html', dom2, 'utf8');
  console.log('Saved dom2_reviews length:', dom2.length);
} catch (e) {
  console.error(e.message);
}
