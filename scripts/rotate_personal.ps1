Add-Type -AssemblyName System.Drawing

$src = "D:\1. Fotografer\Hasan\Hasan\code web alviero\Logo paket\Personal\DSCF2857.jpg"
$destPath = ".\public\images\categories\personal.jpg"

if (Test-Path $src) {
    $img = [System.Drawing.Image]::FromFile($src)
    # Rotate 90 degrees clockwise so portrait model is upright
    $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
    
    $w = $img.Width
    $h = $img.Height
    $maxDim = 600
    
    if ($w -gt $h) {
        $newW = $maxDim
        $newH = [int]($h * ($maxDim / $w))
    } else {
        $newH = $maxDim
        $newW = [int]($w * ($maxDim / $h))
    }
    
    $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $newW, $newH)
    $g.Dispose()
    $img.Dispose()
    
    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]92)
    
    if (Test-Path $destPath) {
        Remove-Item -Force $destPath
    }
    $bmp.Save($destPath, $encoder, $encoderParams)
    $bmp.Dispose()
    
    Write-Host "[OK] Rotated and saved personal.jpg ($newW x $newH)"
}
