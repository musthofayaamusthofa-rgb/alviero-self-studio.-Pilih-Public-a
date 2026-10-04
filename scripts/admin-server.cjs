const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.ADMIN_PORT || 3001;
const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT_DIR, 'src', 'data', 'studioConfig.json');
const BACKUP_DIR = path.join(ROOT_DIR, 'scripts', 'backups');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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

// 2. API: Save Config Locally
app.post('/api/config', (req, res) => {
  try {
    const newConfig = req.body;
    if (!newConfig || !newConfig.backgrounds || !newConfig.timeSlots) {
      return res.status(400).json({ error: 'Invalid config structure' });
    }

    newConfig.lastUpdated = new Date().toISOString();

    // Create timestamped backup
    const backupName = `config-backup-${Date.now()}.json`;
    if (fs.existsSync(CONFIG_PATH)) {
      fs.copyFileSync(CONFIG_PATH, path.join(BACKUP_DIR, backupName));
    }

    // Write new config
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf-8');

    res.json({
      success: true,
      message: 'Konfigurasi studio berhasil disimpan ke file lokal!',
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

    // Step 1: git add
    const addRes = await runCmd('git add src/data/studioConfig.json src/data/pricelistData.ts src/utils/bookingScheduleUtils.ts');
    
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

    // Step 3: git pull --rebase & push
    const pullRes = await runCmd('git pull origin main --rebase --autostash');
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
  console.log(`🌐 Akses Dashboard Admin: http://localhost:${PORT}`);
  console.log(`💻 Web Utama Alviero    : http://localhost:3000`);
  console.log(`============================================================\n`);
});
