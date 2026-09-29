const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const studio1Url = 'https://www.google.com/maps/place/Alviero+Studio+Foto/@-7.8935471,112.5930502,17z/data=!4m18!1m9!3m8!1s0x2e788121b3705f25:0xed1add8fb06fdc8!2sAlviero+Studio+Foto!8m2!3d-7.8935471!4d112.5956251!9m1!1b1!16s%2Fg%2F11q9m93g86!3m7!1s0x2e788121b3705f25:0xed1add8fb06fdc8!8m2!3d-7.8935471!4d112.5956251!9m1!1b1!16s%2Fg%2F11q9m93g86?entry=ttu&hl=id';
const studio2Url = 'https://www.google.com/maps/place/Alviero+Studio+Foto+2/@-7.9465117,112.6053447,17z/data=!3m1!4b1!4m6!3m5!1s0x2e78830048878fc5:0x90e97fc84d555935!8m2!3d-7.946517!4d112.6079196!16s%2Fg%2F11yqbx4j72?entry=ttu&hl=id';

function dumpDom(url) {
  console.log('Dumping DOM for:', url);
  try {
    return execSync(`"${chromePath}" --headless=new --disable-gpu --virtual-time-budget=12000 --dump-dom "${url}"`, {
      maxBuffer: 60 * 1024 * 1024,
      encoding: 'utf8',
      timeout: 35000
    });
  } catch (err) {
    if (err.stdout) return err.stdout;
    console.error('Error dumping DOM:', err.message);
    return '';
  }
}

const dom1 = dumpDom(studio1Url);
fs.writeFileSync('scratch/dom1.html', dom1);
console.log('Saved dom1 length:', dom1.length);

const dom2 = dumpDom(studio2Url);
fs.writeFileSync('scratch/dom2.html', dom2);
console.log('Saved dom2 length:', dom2.length);
