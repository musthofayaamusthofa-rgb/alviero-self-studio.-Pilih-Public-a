Add-Type -AssemblyName System.Drawing

$targetDirs = @(
    (Join-Path $PSScriptRoot "..\public\images\mua"),
    (Join-Path $PSScriptRoot "..\public\images\packages"),
    (Join-Path $PSScriptRoot "..\public\images\gallery")
)

$totalOrigBytes = 0
$totalNewBytes = 0
$processedCount = 0

foreach ($dir in $targetDirs) {
    if (-not (Test-Path $dir)) { continue }
    
    $files = Get-ChildItem -Path $dir -Filter "*.jpg" -File | Where-Object { $_.Length -gt 500KB }
    
    foreach ($file in $files) {
        $origLen = $file.Length
        $totalOrigBytes += $origLen
        $processedCount++
        
        Write-Host "Mengoptimasi: $($file.Name) ($([math]::Round($origLen / 1MB, 2)) MB)..." -ForegroundColor Cyan
        
        try {
            $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
            $ms = New-Object System.IO.MemoryStream($bytes, $false)
            $srcImg = [System.Drawing.Image]::FromStream($ms)
            
            $origW = $srcImg.Width
            $origH = $srcImg.Height
            $maxDim = 1500
            
            $newW = $origW
            $newH = $origH
            if ($origW -gt $maxDim -or $origH -gt $maxDim) {
                if ($origW -gt $origH) {
                    $newW = $maxDim
                    $newH = [int](($origH / $origW) * $maxDim)
                } else {
                    $newH = $maxDim
                    $newW = [int](($origW / $origH) * $maxDim)
                }
            }
            
            $destBmp = New-Object System.Drawing.Bitmap($newW, $newH)
            $g = [System.Drawing.Graphics]::FromImage($destBmp)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            
            $rect = New-Object System.Drawing.Rectangle(0, 0, $newW, $newH)
            $g.DrawImage($srcImg, $rect)
            
            $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)
            
            $tempFile = $file.FullName + ".tmp.jpg"
            $destBmp.Save($tempFile, $codec, $encoderParams)
            
            $g.Dispose()
            $destBmp.Dispose()
            $srcImg.Dispose()
            $ms.Dispose()
            
            $newLen = (Get-Item $tempFile).Length
            $totalNewBytes += $newLen
            
            Move-Item -Path $tempFile -Destination $file.FullName -Force
            Write-Host "  -> Selesai: $([math]::Round($newLen / 1KB, 1)) KB (Hemat $([math]::Round(($origLen - $newLen) / 1MB, 2)) MB / $([math]::Round((1 - ($newLen / $origLen)) * 100, 1))%)" -ForegroundColor Green
        }
        catch {
            Write-Host "  -> Gagal mengoptimasi $($file.Name): $_" -ForegroundColor Red
            if (Test-Path $tempFile) { Remove-Item $tempFile -Force }
        }
    }
}

Write-Host "`n=== RINGKASAN OPTIMASI FOTO WEB ===" -ForegroundColor Yellow
Write-Host "Total file dioptimasi: $processedCount file"
Write-Host "Ukuran awal: $([math]::Round($totalOrigBytes / 1MB, 2)) MB"
Write-Host "Ukuran akhir: $([math]::Round($totalNewBytes / 1MB, 2)) MB"
Write-Host "Total penghematan kuota: $([math]::Round(($totalOrigBytes - $totalNewBytes) / 1MB, 2)) MB ($([math]::Round((1 - ($totalNewBytes / $totalOrigBytes)) * 100, 1))% LEBIH RINGAN!)" -ForegroundColor Green
