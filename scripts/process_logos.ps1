Add-Type -AssemblyName System.Drawing

$sourceDir = "D:\1. Fotografer\Hasan\Hasan\code web alviero\Logo paket"
$targetDir = ".\public\images\categories"

if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
}

$mapping = @{
    "Personal"           = "personal.jpg"
    "Couple"             = "couple.jpg"
    "Group"              = "group.jpg"
    "Graduation"         = "graduation.jpg"
    "Graduation Outdoor" = "grad-outdoor.jpg"
    "Family"             = "family.jpg"
    "Maternity"          = "maternity.jpg"
    "Birthday"           = "birthday.jpg"
    "Prewedding"         = "prewedding.jpg"
    "SelfStudio"         = "selfphoto.jpg"
    "Wedding"            = "wedding.jpg"
}

$files = Get-ChildItem -Path $sourceDir -File -Recurse

foreach ($file in $files) {
    $folderName = $file.Directory.Name
    if ($mapping.ContainsKey($folderName)) {
        $targetFileName = $mapping[$folderName]
        $destPath = Join-Path $targetDir $targetFileName
        
        Write-Host "Processing $($file.FullName) -> $destPath"
        
        # Load image (Keep rotation as requested, Personal & SelfStudio 90 deg clockwise)
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        if ($folderName -eq "Personal" -or $folderName -eq "SelfStudio") {
            $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
        }
        
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
        
        Write-Host "[OK] Saved $targetFileName ($newW x $newH)"
    }
}
