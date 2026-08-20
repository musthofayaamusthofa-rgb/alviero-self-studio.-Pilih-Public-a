param(
    [string]$CommitMessage = "Update project assets and features"
)

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " [GIT SYNC] Memulai sinkronisasi ke GitHub..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# 1. Pull latest changes from GitHub
Write-Host "`n[1/3] Menarik perubahan terbaru (git pull origin main)..." -ForegroundColor Yellow
git pull origin main --rebase

# 2. Add and Commit
Write-Host "`n[2/3] Mendeteksi perubahan file, menyiapkan commit..." -ForegroundColor Yellow
git add .
$status = git status --porcelain
if ($status) {
    git commit -m $CommitMessage
    Write-Host "Commit berhasil: $CommitMessage" -ForegroundColor Green
} else {
    Write-Host "Tidak ada perubahan baru untuk di-commit." -ForegroundColor Gray
}

# 3. Push to GitHub
Write-Host "`n[3/3] Mengunggah perubahan (git push origin main)..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[OK] SINKRONISASI BERHASIL! Kode terbaru telah di-push ke GitHub." -ForegroundColor Green
    return $true
} else {
    Write-Host "`n[FAIL] Sinkronisasi gagal. Silakan periksa koneksi atau konflik git." -ForegroundColor Red
    return $false
}
