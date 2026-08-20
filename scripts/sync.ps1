param(
    [string]$CommitMessage = "Update project assets and features"
)

Write-Host "`n[GIT SYNC] Memulai sinkronisasi ke GitHub..." -ForegroundColor Cyan

# 1. Simpan semua perubahan lokal
git add .
$status = git status --porcelain
if ($status) {
    git commit -m $CommitMessage
    Write-Host "[OK] Commit: $CommitMessage" -ForegroundColor Green
} else {
    Write-Host "[INFO] Tidak ada perubahan baru untuk di-commit." -ForegroundColor Gray
}

# 2. Sinkronkan dengan remote repository
git pull origin main --rebase --autostash
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Sinkronisasi GitHub BERHASIL!`n" -ForegroundColor Green
    return $true
} else {
    Write-Host "[FAIL] Gagal push ke GitHub.`n" -ForegroundColor Red
    return $false
}
