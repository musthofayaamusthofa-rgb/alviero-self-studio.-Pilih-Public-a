Add-Type -AssemblyName System.Drawing

$src = "D:\1. Fotografer\Hasan\Hasan\code web alviero\Logo paket\SelfStudio\DSCF9063.JPG"
$destPath = ".\public\images\categories\selfphoto.jpg"

if (Test-Path $src) {
    $img = [System.Drawing.Image]::FromFile($src)
    # Rotate 90 degrees clockwise to upright
    $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
    
    $w = $img.Width
    $h = $img.Height
    Write-Host "Upright dimension: $w x $h"
    
    # We want a square crop that captures the head and upper body
    # Since w is width, let's take a square of size w x w starting from y=0 or y = small offset
    $cropDim = $w
    $startY = [int]($h * 0.02) # start almost at top with slight headroom
    if ($startY + $cropDim -gt $h) {
        $cropDim = $h - $startY
    }
    
    $outputSize = 500
    $bmp = New-Object System.Drawing.Bitmap($outputSize, $outputSize)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $srcRect = New-Object System.Drawing.Rectangle(0, $startY, $w, $cropDim)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $outputSize, $outputSize)
    $g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    $g.Dispose()
    $img.Dispose()
    
    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)
    
    if (Test-Path $destPath) { Remove-Item -Force $destPath }
    $bmp.Save($destPath, $encoder, $encoderParams)
    $bmp.Dispose()
    
    Write-Host "[OK] Saved square framed selfphoto.jpg"
}
