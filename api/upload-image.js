const GITHUB_REPO_OWNER = 'musthofayaamusthofa-rgb';
const GITHUB_REPO_NAME = 'alviero-self-studio.-Pilih-Public-a';
const GITHUB_BRANCH = 'main';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-github-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers['x-github-token'] || 
                  (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, '')) || 
                  process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(401).json({
        error: 'Token GitHub belum dikonfigurasi. Silakan masukkan Personal Access Token di pengaturan Cloud Dashboard atau di Environment Variables Vercel (GITHUB_TOKEN).'
      });
    }

    const { dataUrl, fileName, folder } = req.body || {};
    if (!dataUrl) {
      return res.status(400).json({ error: 'dataUrl wajib disertakan.' });
    }

    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Format data URL base64 tidak valid.' });
    }

    const rawExt = matches[1].toLowerCase();
    const ext = rawExt === 'jpeg' ? 'jpg' : rawExt === 'svg+xml' ? 'svg' : rawExt;
    const base64Content = matches[2];

    const targetSubfolder = folder || 'packages';
    const cleanBaseName = (fileName || 'foto')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();

    const finalFileName = `${cleanBaseName}_${Date.now()}.${ext}`;
    const filePath = `public/images/${targetSubfolder}/${finalFileName}`;

    // Commit file directly to GitHub repository via GitHub REST API
    const ghUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`;
    const ghRes = await fetch(ghUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'AlvieroStudio-VercelAdmin'
      },
      body: JSON.stringify({
        message: `Upload image ${finalFileName} via Alviero Cloud Dashboard`,
        content: base64Content,
        branch: GITHUB_BRANCH
      })
    });

    const ghData = await ghRes.json();
    if (!ghRes.ok) {
      return res.status(ghRes.status).json({
        error: ghData.message || 'Gagal menyimpan foto ke GitHub.',
        details: ghData
      });
    }

    const publicUrl = `/images/${targetSubfolder}/${finalFileName}`;
    return res.status(200).json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
      commitSha: ghData.commit?.sha,
      message: 'Foto berhasil disimpan ke GitHub repository! Vercel otomatis deploy pembaruan.'
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
