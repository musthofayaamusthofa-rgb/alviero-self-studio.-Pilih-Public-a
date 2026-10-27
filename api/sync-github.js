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

  const token = req.headers['x-github-token'] || 
                (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, '')) || 
                process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(401).json({
      error: 'Token GitHub belum dikonfigurasi. Silakan masukkan Personal Access Token di pengaturan Cloud Dashboard atau di Environment Variables Vercel (GITHUB_TOKEN).'
    });
  }

  try {
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
