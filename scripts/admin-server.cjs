const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.ADMIN_PORT || 3001;
const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT_DIR, 'src', 'data', 'studioConfig.json');
const BACKUP_DIR = path.join(ROOT_DIR, 'scripts', 'backups');

const PRICELIST_PATH = path.join(ROOT_DIR, 'src', 'data', 'pricelistData.ts');

function parsePackagePrice(raw) {
  if (typeof raw === 'number') {
    return (raw > 0 && raw < 100000000) ? raw : null;
  }
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const firstOption = trimmed.split('/')[0].trim();
  const kMatch = firstOption.match(/([0-9.,]+)\s*k/i);
  if (kMatch) {
    const cleanDigits = kMatch[1].replace(/[.,]/g, '');
    const num = parseInt(cleanDigits, 10);
    if (!isNaN(num) && num > 0) return num * 1000;
  }
  const cleanDigits = firstOption.replace(/[^\d]/g, '');
  if (cleanDigits) {
    const num = parseInt(cleanDigits, 10);
    if (!isNaN(num) && num > 0 && num < 100000000) return num;
  }
  return null;
}


function formatPriceShort(num) {
  if (typeof num !== 'number' || isNaN(num) || num <= 0) return '';
  if (num % 1000 === 0) {
    const k = num / 1000;
    if (k >= 1000) {
      return (k / 1000).toLocaleString('id-ID') + 'K';
    }
    return k + 'K';
  }
  const k = (num / 1000).toFixed(1).replace('.', ',');
  return k.endsWith(',0') ? k.slice(0, -2) + 'K' : k + 'K';
}

// SINKRONISASI DUA ARAH: FOTO 3 (ADD-ONS) -> FOTO 2 (CETAK LAB & BINGKAI)
function syncAddOnsToLabAndFrame(config, removedItem, isDelete) {
  if (!config || !Array.isArray(config.addOns)) return;
  if (!Array.isArray(config.labPrintPrices)) config.labPrintPrices = [];
  if (!Array.isArray(config.framePrices)) config.framePrices = [];

  if (isDelete && removedItem) {
    const rId = (removedItem.id || '').toLowerCase();
    if (rId.startsWith('global-print-')) {
      const code = rId.replace('global-print-', '');
      config.labPrintPrices = config.labPrintPrices.filter(l => (l.code || '').toLowerCase().replace(/[^a-z0-9]/g, '') !== code);
    } else if (rId.startsWith('global-frame-')) {
      const code = rId.replace('global-frame-', '');
      config.framePrices = config.framePrices.filter(f => (f.code || '').toLowerCase().replace(/[^a-z0-9]/g, '') !== code);
    }
    return;
  }

  config.addOns.forEach(addOn => {
    if (!addOn || !addOn.id) return;
    const idLower = addOn.id.toLowerCase();
    const nameLower = (addOn.name || '').toLowerCase();
    const isFrameCat = addOn.category === 'frame';

    // A. Cetak Lab
    const isPrint = idLower.startsWith('global-print-') || (isFrameCat && nameLower.includes('cetak lab') && !nameLower.includes('paket'));
    if (isPrint) {
      let code = '';
      if (idLower.startsWith('global-print-')) {
        code = idLower.replace('global-print-', '').toUpperCase();
        code = code.replace(/RS$/, 'Rs');
      } else {
        const m = addOn.name.match(/uk\s+([0-9a-z\s]+)/i);
        if (m) code = m[1].trim();
      }

      if (code) {
        let lab = config.labPrintPrices.find(l => (l.code || '').toLowerCase().replace(/[^a-z0-9]/g, '') === code.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const numPrice = typeof addOn.price === 'number' ? addOn.price : (parsePackagePrice(addOn.price) || 0);
        if (lab) {
          if (numPrice > 0) {
            lab.price = numPrice;
            lab.priceDisplay = formatPriceShort(numPrice);
          }
          lab.active = addOn.active !== false;
        } else if (numPrice > 0) {
          config.labPrintPrices.push({
            code,
            size: '',
            cm: '',
            price: numPrice,
            priceDisplay: formatPriceShort(numPrice),
            note: addOn.description || '',
            active: addOn.active !== false
          });
        }
      }
      return;
    }

    // B. Bingkai Foto
    const isFrame = idLower.startsWith('global-frame-') || (isFrameCat && (nameLower.includes('bingkai') || nameLower.includes('frame')) && !nameLower.includes('paket'));
    if (isFrame) {
      let code = '';
      if (idLower.startsWith('global-frame-')) {
        code = idLower.replace('global-frame-', '').toUpperCase();
        code = code.replace(/RS$/, 'Rs').replace(/RSPRESS$/, 'Rs Press');
      } else {
        const m = addOn.name.match(/uk\s+([0-9a-z\s]+)/i);
        if (m) code = m[1].trim();
      }

      if (code) {
        let fr = config.framePrices.find(f => (f.code || '').toLowerCase().replace(/[^a-z0-9]/g, '') === code.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const numPrice = typeof addOn.price === 'number' ? addOn.price : (parsePackagePrice(addOn.price) || 0);
        if (fr) {
          if (numPrice > 0) {
            fr.price = numPrice;
            fr.priceDisplay = formatPriceShort(numPrice);
          }
          fr.active = addOn.active !== false;
        } else if (numPrice > 0) {
          config.framePrices.push({
            code,
            size: '',
            dim: '',
            price: numPrice,
            priceDisplay: formatPriceShort(numPrice),
            type: 'Bingkai Minimalis',
            image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
            desc: addOn.description || '',
            active: addOn.active !== false
          });
        }
      }
      return;
    }

    // C. Pass Foto Print
    if (idLower.startsWith('passfoto-print-')) {
      const codePart = idLower.replace('passfoto-print-', '');
      const lab = config.labPrintPrices.find(l => (l.code || '').toLowerCase().includes(codePart));
      const numPrice = typeof addOn.price === 'number' ? addOn.price : (parsePackagePrice(addOn.price) || 0);
      if (lab && numPrice > 0) {
        lab.price = numPrice;
        lab.priceDisplay = formatPriceShort(numPrice);
        lab.active = addOn.active !== false;
      }
    }
  });
}

function syncLabAndFrameToAddOns(config) {
  if (!config) return;
  if (!Array.isArray(config.addOns)) config.addOns = [];

  const labPrices = config.labPrintPrices || [];
  const framePrices = config.framePrices || [];

  // 1. Sync Lab Print Prices
  labPrices.forEach(lab => {
    if (!lab.code) return;
    const cleanCode = String(lab.code).toLowerCase().replace(/[^a-z0-9]/g, '');
    const numPrice = (typeof lab.price === 'number' && lab.price > 0)
      ? lab.price
      : (parsePackagePrice(lab.priceDisplay) || parsePackagePrice(lab.price) || 0);

    const isPassFoto = String(lab.code).toLowerCase().includes('pass');
    if (isPassFoto) {
      const passId = `passfoto-print-${cleanCode.replace('pass', '')}`;
      let addOn = config.addOns.find(a => a.id === passId);
      if (addOn && numPrice > 0) {
        addOn.price = numPrice;
        addOn.active = lab.active !== false;
      }
      return;
    }

    const targetId = `global-print-${cleanCode}`;
    let addOn = config.addOns.find(a => a.id === targetId || (a.category === 'frame' && a.id.toLowerCase() === targetId));
    if (!addOn) {
      addOn = config.addOns.find(a => a.category === 'frame' && (a.name || '').toLowerCase() === `cetak lab uk ${lab.code.toLowerCase()}`);
    }

    const desc = lab.size
      ? `Cetak foto lab ukuran ${lab.code} (${lab.size}) kertas Glossy Lab premium.`
      : (lab.note || `Cetak foto lab ukuran ${lab.code} kertas Glossy Lab premium.`);

    if (addOn) {
      if (numPrice > 0) addOn.price = numPrice;
      addOn.name = `Cetak Lab Uk ${lab.code}`;
      addOn.description = desc;
      addOn.active = lab.active !== false;
      addOn.category = 'frame';
      addOn.unit = 'foto';
    } else {
      config.addOns.push({
        id: targetId,
        name: `Cetak Lab Uk ${lab.code}`,
        price: numPrice,
        unit: 'foto',
        description: desc,
        category: 'frame',
        isSelfStudioOnly: false,
        applicableCategories: ['all'],
        applicableBranches: ['all'],
        active: lab.active !== false
      });
    }
  });

  // 2. Sync Frame Prices
  framePrices.forEach(fr => {
    if (!fr.code) return;
    const cleanCode = String(fr.code).toLowerCase().replace(/[^a-z0-9]/g, '');
    const numPrice = (typeof fr.price === 'number' && fr.price > 0)
      ? fr.price
      : (parsePackagePrice(fr.priceDisplay) || parsePackagePrice(fr.price) || 0);

    const targetId = `global-frame-${cleanCode}`;
    let addOn = config.addOns.find(a => a.id === targetId);
    if (!addOn) {
      addOn = config.addOns.find(a => a.category === 'frame' && (a.name || '').toLowerCase() === `bingkai uk ${fr.code.toLowerCase()}`);
    }

    const sizeStr = fr.size || fr.dim || '';
    const typeStr = fr.type ? fr.type.toLowerCase() : 'minimalis modern';
    const desc = sizeStr
      ? `Bingkai pigura ${typeStr} ukuran ${fr.code} (${sizeStr}).`
      : (fr.desc || `Bingkai pigura ${typeStr} ukuran ${fr.code}.`);

    if (addOn) {
      if (numPrice > 0) addOn.price = numPrice;
      addOn.name = `Bingkai Uk ${fr.code}`;
      addOn.description = desc;
      addOn.active = fr.active !== false;
      addOn.category = 'frame';
      addOn.unit = 'bingkai';
    } else {
      config.addOns.push({
        id: targetId,
        name: `Bingkai Uk ${fr.code}`,
        price: numPrice,
        unit: 'bingkai',
        description: desc,
        category: 'frame',
        isSelfStudioOnly: false,
        applicableCategories: ['all'],
        applicableBranches: ['all'],
        active: fr.active !== false
      });
    }
  });

  // 3. Sync Bundles
  const bundle10 = config.addOns.find(a => a.id === 'global-bundle-10rs');
  if (bundle10) {
    bundle10.description = `Paket hemat lengkap: 1x Cetak Lab 10Rs + 1x Bingkai Minimalis 10Rs siap pajang.`;
  }

  const bundle12 = config.addOns.find(a => a.id === 'global-bundle-12rs');
  if (bundle12) {
    bundle12.description = `Paket hemat lengkap: 1x Cetak Lab 12Rs + 1x Bingkai Minimalis 12Rs siap pajang.`;
  }
}

function syncPricelistDataCodeFile(newConfig) {
  try {
    if (!fs.existsSync(PRICELIST_PATH)) return;
    let pData = fs.readFileSync(PRICELIST_PATH, 'utf-8');
    const packages = newConfig.studioPackages || newConfig.indoorPackages || [];

    packages.forEach(pkg => {
      if (!pkg.id) return;
      const numPrice = parsePackagePrice(pkg.price);
      const numOrigPrice = parsePackagePrice(pkg.originalPrice);

      const idSearch = '"id": "' + pkg.id + '"';
      const pos = pData.indexOf(idSearch);
      if (pos !== -1) {
        const chunkEnd = pData.indexOf('}', pos);
        if (chunkEnd !== -1) {
          let chunk = pData.substring(pos, chunkEnd);
          if (numPrice && numPrice > 0) {
            chunk = chunk.replace(/"price":\s*\d+/, `"price": ${numPrice}`);
          }
          if (numOrigPrice && numOrigPrice > 0) {
            chunk = chunk.replace(/"originalPrice":\s*\d+/, `"originalPrice": ${numOrigPrice}`);
          }
          pData = pData.substring(0, pos) + chunk + pData.substring(chunkEnd);
        }
      }
    });

    
    // Sinkronisasi DEFAULT_ADD_ONS untuk cetak & bingkai
    if (Array.isArray(newConfig.addOns)) {
      newConfig.addOns.forEach(addOn => {
        if (!addOn.id || typeof addOn.price !== 'number') return;
        const idSearch = "id: '" + addOn.id + "'";
        const pos = pData.indexOf(idSearch);
        if (pos !== -1) {
          const chunkEnd = pData.indexOf('}', pos);
          if (chunkEnd !== -1) {
            let chunk = pData.substring(pos, chunkEnd);
            chunk = chunk.replace(/price:\s*\d+/, `price: ${addOn.price}`);
            pData = pData.substring(0, pos) + chunk + pData.substring(chunkEnd);
          }
        }
      });
    }

    fs.writeFileSync(PRICELIST_PATH, pData, 'utf-8');
    console.log('[Admin Server] ✅ pricelistData.ts berhasil disinkronkan dengan perubahan dashboard!');
  } catch (err) {
    console.warn('[Admin Server] Gagal menyinkronkan pricelistData.ts:', err.message);
  }
}


if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.static(path.join(ROOT_DIR, 'public')));

// Helper: Run shell command as Promise
function runCmd(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: ROOT_DIR }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        code: error ? error.code : 0,
        stdout: (stdout || '').trim(),
        stderr: (stderr || '').trim(),
        error: error ? error.message : null
      });
    });
  });
}

// 1. API: Get Current Config
app.get('/api/config', (req, res) => {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return res.status(404).json({ error: 'Config file not found' });
    }
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const data = JSON.parse(raw);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2b. API: Upload Package / Studio Image

// Alias /api/upload to upload-image handler logic
app.post('/api/upload', (req, res, next) => {
  if (req.body && req.body.dataUrl) {
    req.url = '/api/upload-image';
    return app._router.handle(req, res, next);
  }
  // If multipart form data is sent, send json response
  res.json({
    success: true,
    message: 'Upload handler active'
  });
});

app.post('/api/upload-image', (req, res) => {
  try {
    const { dataUrl, fileName, folder } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: 'dataUrl is required' });
    }

    const commaIdx = dataUrl.indexOf(',');
    if (commaIdx === -1 || !dataUrl.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Format data URL base64 tidak valid' });
    }

    const headerPart = dataUrl.slice(0, commaIdx);
    const base64Data = dataUrl.slice(commaIdx + 1).replace(/\s/g, '');
    const mimeMatch = headerPart.match(/^data:image\/([a-zA-Z0-9+.-]+)/);
    const rawExt = mimeMatch ? mimeMatch[1].toLowerCase() : 'jpeg';
    const ext = rawExt === 'jpeg' ? 'jpg' : rawExt.includes('svg') ? 'svg' : rawExt === 'png' ? 'png' : rawExt === 'webp' ? 'webp' : 'jpg';
    const buffer = Buffer.from(base64Data, 'base64');

    const targetSubfolder = folder || 'packages';
    const uploadDir = path.join(ROOT_DIR, 'public', 'images', targetSubfolder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const cleanBaseName = (fileName || 'paket')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();

    const finalFileName = `${cleanBaseName}_${Date.now()}.${ext}`;
    const fullPath = path.join(uploadDir, finalFileName);

    fs.writeFileSync(fullPath, buffer);

    const publicUrl = `/images/${targetSubfolder}/${finalFileName}`;
    res.json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
      message: 'Foto berhasil disimpan!'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. API: Save Config Locally (HANYA SIMPAN LOKAL - TIDAK PUSH KE GITHUB)
app.post('/api/config', async (req, res) => {
  try {
    const newConfig = req.body;
    if (!newConfig || !newConfig.backgrounds || !newConfig.timeSlots) {
      return res.status(400).json({ error: 'Invalid config structure' });
    }

    newConfig.lastUpdated = new Date().toISOString();
    syncAddOnsToLabAndFrame(newConfig);
    syncLabAndFrameToAddOns(newConfig);

    // Create timestamped backup
    const backupName = `config-backup-${Date.now()}.json`;
    if (fs.existsSync(CONFIG_PATH)) {
      fs.copyFileSync(CONFIG_PATH, path.join(BACKUP_DIR, backupName));
    }

    // Write new config to both local data paths
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf-8');
    syncPricelistDataCodeFile(newConfig);
    try {
      const publicDataPath = path.join(ROOT_DIR, 'public', 'data', 'studioConfig.json');
      fs.writeFileSync(publicDataPath, JSON.stringify(newConfig, null, 2), 'utf-8');
    } catch(e) {}

    // RESPON: Tersimpan ke lokal saja, TIDAK push ke GitHub
    res.json({
      success: true,
      message: 'Konfigurasi studio berhasil disimpan ke file lokal!',
      gitSynced: false,
      lastUpdated: newConfig.lastUpdated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. API: Get Git Status
app.get('/api/git-status', async (req, res) => {
  try {
    const branchRes = await runCmd('git rev-parse --abbrev-ref HEAD');
    const statusRes = await runCmd('git status --porcelain');
    const lastCommitRes = await runCmd('git log -1 --pretty=format:"%h - %s (%cr)"');
    const remoteRes = await runCmd('git remote get-url origin');

    res.json({
      success: true,
      branch: branchRes.stdout || 'main',
      hasChanges: Boolean(statusRes.stdout),
      uncommittedFiles: statusRes.stdout ? statusRes.stdout.split('\n') : [],
      lastCommit: lastCommitRes.stdout || 'No commits yet',
      remoteUrl: remoteRes.stdout || ''
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. API: Save & Sync to Internet (Git Push)
app.post('/api/sync-github', async (req, res) => {
  try {
    const commitMsg = req.body.commitMessage || `Update studio config (background & slots) via Alviero Manager [${new Date().toLocaleTimeString('id-ID')}]`;

    // Step 1: git add all changes (photos, configs, data)
    const addRes = await runCmd('git add .');
    
    // Check if there is anything to commit
    const statusRes = await runCmd('git status --porcelain');
    let commitHash = '';
    
    if (statusRes.stdout) {
      // Step 2: git commit
      const commitRes = await runCmd(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
      if (!commitRes.success && !commitRes.stdout.includes('nothing to commit')) {
        return res.status(500).json({ 
          error: 'Gagal membuat git commit: ' + (commitRes.stderr || commitRes.stdout) 
        });
      }
    }

    // Step 3: git pull & push
    await runCmd('git pull origin main --no-rebase -X ours --no-edit');
    const pushRes = await runCmd('git push origin main');

    if (!pushRes.success) {
      return res.status(500).json({
        success: false,
        error: 'Gagal push ke GitHub remote: ' + (pushRes.stderr || pushRes.stdout),
        details: pushRes
      });
    }

    const logRes = await runCmd('git log -1 --oneline');

    res.json({
      success: true,
      message: 'Perubahan berhasil di-push ke GitHub! Vercel otomatis memperbarui web di internet dalam 30-60 detik.',
      lastCommit: logRes.stdout,
      pushLog: pushRes.stdout || 'Push origin main OK'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Serve Admin UI HTML
app.get('*', (req, res) => {
  const htmlPath = path.join(__dirname, 'admin-ui.html');
  if (fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }
  res.send('<h1>Admin UI file not found. Please ensure scripts/admin-ui.html exists.</h1>');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n============================================================`);
  console.log(`✨ ALVIERO STUDIO MANAGER (CONTROL HUB) BERJALAN AKTIF!`);
  console.log(`🌐 Akses Dashboard Admin: http://localhost:3000/adminsalto (atau http://localhost:${PORT})`);
  console.log(`💻 Web Utama Alviero    : http://localhost:3000`);
  console.log(`============================================================\n`);
});
