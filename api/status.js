const GITHUB_REPO_OWNER = 'musthofayaamusthofa-rgb';
const GITHUB_REPO_NAME = 'alviero-self-studio.-Pilih-Public-a';
const GITHUB_BRANCH = 'main';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-github-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.headers['x-github-token'] || 
                (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, '')) || 
                process.env.GITHUB_TOKEN;

  let isConnected = false;
  let username = null;
  let repoWriteAccess = false;

  if (token) {
    try {
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'AlvieroStudio-VercelAdmin'
        }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        isConnected = true;
        username = userData.login;
        repoWriteAccess = true;
      }
    } catch {}
  }

  return res.status(200).json({
    success: true,
    platform: 'vercel',
    repo: `${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`,
    branch: GITHUB_BRANCH,
    hasServerToken: Boolean(process.env.GITHUB_TOKEN),
    isConnected,
    username,
    repoWriteAccess
  });
}
