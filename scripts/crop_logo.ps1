Add-Type -AssemblyName System.Drawing

$filePath = ".\public\images\alviero-logo-official.png"
if (Test-Path $filePath) {
    $fullPath = (Resolve-Path $filePath).Path
    $bmp = [System.Drawing.Bitmap]::FromFile($fullPath)
    
    $minX = $bmp.Width
    $minY = $bmp.Height
    $maxX = 0
    $maxY = 0
    
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        for ($y = 0; $y -lt $bmp.Height; $y++) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.A -gt 20 -and ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240)) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    
    $padding = 10
    $minX = [Math]::Max(0, $minX - $padding)
    $minY = [Math]::Max(0, $minY - $padding)
    $maxX = [Math]::Min($bmp.Width - 1, $maxX + $padding)
    $maxY = [Math]::Min($bmp.Height - 1, $maxY + $padding)
    
    $cropW = $maxX - $minX + 1
    $cropH = $maxY - $minY + 1
    
    Write-Host "Original: $($bmp.Width)x$($bmp.Height) -> Cropped: ${cropW}x${cropH}"
    
    $cropped = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($cropped)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    
    $srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $cropW, $cropH)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)
    $g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $g.Dispose()
    $bmp.Dispose()
    
    $tmpPath = ".\public\images\alviero-logo-cropped.png"
    if (Test-Path $tmpPath) { Remove-Item -Force $tmpPath }
    $cropped.Save($tmpPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    
    Remove-Item -Force $fullPath
    Move-Item -Force $tmpPath $fullPath
    Copy-Item -Force $fullPath ".\public\images\logo.png"
    Write-Host "[OK] Cropped and saved tight-bounding logo!"
}
