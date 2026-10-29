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

  const token = req.headers['x-github-token'] || 
                (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, '')) || 
                process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(401).json({
      error: 'Token GitHub belum dikonfigurasi. Silakan masukkan Personal Access Token di pengaturan Cloud Dashboard atau di Environment Variables Vercel (GITHUB_TOKEN).'
    });
  }

  try {
    // If POST with config payload, commit files to GitHub
    if (req.method === 'POST' && req.body && req.body.config) {
      const configObj = req.body.config;
      configObj.lastUpdated = new Date().toISOString();
      const contentStr = JSON.stringify(configObj, null, 2);
      const commitMsg = req.body.commitMessage || `Update studio config via Alviero Manager [${new Date().toLocaleTimeString('id-ID')}]`;

      await updateFileOnGitHub('src/data/studioConfig.json', contentStr, commitMsg, token);
      await updateFileOnGitHub('public/data/studioConfig.json', contentStr, commitMsg, token);

      return res.status(200).json({
        success: true,
        message: 'Perubahan telah disimpan dan dikirim ke GitHub repository! Vercel otomatis melakukan deployment pembaruan website dalam ~30-60 detik.',
        branch: GITHUB_BRANCH,
        lastCommit: commitMsg
      });
    }

    // Default: Check latest commit status on GitHub
    const logRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/commits?per_page=1&sha=${GITHUB_BRANCH}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'AlvieroStudio-VercelAdmin'
      }
    });

    const commits = await logRes.json();
    const lastCommit = Array.isArray(commits) && commits.length > 0 
      ? `${commits[0].sha.substring(0, 7)} - ${commits[0].commit.message}`
      : 'Commit synced';

    return res.status(200).json({
      success: true,
      message: 'Perubahan telah tersimpan di GitHub repository! Vercel otomatis melakukan deployment pembaruan website dalam ~30-60 detik.',
      branch: GITHUB_BRANCH,
      lastCommit
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
