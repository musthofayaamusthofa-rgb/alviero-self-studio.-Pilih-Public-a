const GITHUB_REPO_OWNER = 'musthofayaamusthofa-rgb';
const GITHUB_REPO_NAME = 'alviero-self-studio.-Pilih-Public-a';
const GITHUB_BRANCH = 'main';

async function getFileSha(path, token) {
  try {
    const ghUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${path}?ref=${GITHUB_BRANCH}`;
    const res = await fetch(ghUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'AlvieroStudio-VercelAdmin'
      }
    });
    if (res.ok) {
      const data = await res.json();
      return data.sha;
    }
    return null;
  } catch {
    return null;
  }
}

async function updateFileOnGitHub(path, contentStr, message, token) {
  const sha = await getFileSha(path, token);
  const base64Content = Buffer.from(contentStr, 'utf-8').toString('base64');
  const ghUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${path}`;

  const bodyPayload = {
    message: message,
    content: base64Content,
    branch: GITHUB_BRANCH
  };
  if (sha) {
    bodyPayload.sha = sha;
  }

  const res = await fetch(ghUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'AlvieroStudio-VercelAdmin'
    },
    body: JSON.stringify(bodyPayload)
  });

  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-github-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Fetch latest config from raw GitHub content
  if (req.method === 'GET') {
    try {
      const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/src/data/studioConfig.json?t=${Date.now()}`;
      const configRes = await fetch(rawUrl);
      if (configRes.ok) {
        const data = await configRes.json();
        return res.status(200).json({ success: true, data });
      }
      return res.status(500).json({ error: 'Gagal memuat konfigurasi dari GitHub.' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 2. POST: Save config to GitHub repo (triggers Vercel build)
  if (req.method === 'POST') {
    try {
      const token = req.headers['x-github-token'] || 
                    (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, '')) || 
                    process.env.GITHUB_TOKEN;

      if (!token) {
        return res.status(401).json({
          error: 'Token GitHub belum dikonfigurasi. Silakan masukkan Personal Access Token di pengaturan Cloud Dashboard atau di Environment Variables Vercel (GITHUB_TOKEN).'
        });
      }

      const newConfig = req.body;
      if (!newConfig || !newConfig.backgrounds || !newConfig.timeSlots) {
        return res.status(400).json({ error: 'Struktur konfigurasi tidak valid.' });
      }

      newConfig.lastUpdated = new Date().toISOString();
      const contentStr = JSON.stringify(newConfig, null, 2);
      const commitMsg = `Update studioConfig.json via Alviero Cloud Dashboard [${new Date().toLocaleTimeString('id-ID')}]`;

      // Update in src/data/studioConfig.json
      await updateFileOnGitHub('src/data/studioConfig.json', contentStr, commitMsg, token);
      // Update in public/data/studioConfig.json
      await updateFileOnGitHub('public/data/studioConfig.json', contentStr, commitMsg, token);

      return res.status(200).json({
        success: true,
        message: 'Konfigurasi studio berhasil disimpan langsung ke GitHub! Vercel otomatis memperbarui web dalam ~30-60 detik.',
        lastUpdated: newConfig.lastUpdated
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
