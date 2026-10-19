Add-Type -AssemblyName System.Drawing

$bgDir = Join-Path $PSScriptRoot "..\public\images\backgrounds"
$backupDir = Join-Path $PSScriptRoot "backups\backgrounds_raw"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

$files = Get-ChildItem -Path $bgDir -Filter "*.jpg"

foreach ($file in $files) {
    Write-Host "Processing $($file.Name) (Current: $([math]::Round($file.Length / 1MB, 2)) MB)..."
    
    # Backup raw original if not already backed up
    $backupPath = Join-Path $backupDir $file.Name
    if (-not (Test-Path $backupPath)) {
        Copy-Item -Path $file.FullName -Destination $backupPath -Force
    }

    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $ms = New-Object System.IO.MemoryStream($bytes, $false)
    $srcImg = [System.Drawing.Image]::FromStream($ms)
    
    $origW = $srcImg.Width
    $origH = $srcImg.Height
    $maxDim = 1600
    
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
    
    $newLength = (Get-Item $tempFile).Length
    Move-Item -Path $tempFile -Destination $file.FullName -Force
    Write-Host "Done $($file.Name): $([math]::Round($newLength / 1KB, 1)) KB (Saved $([math]::Round(($file.Length - $newLength)/1MB, 2)) MB)"
}
