Add-Type -AssemblyName System.Drawing

$srcDir = 'D:\PHOTOGRAFER\HASAN\coding pl\Bahan foto preview paket\Graduation Indoor'
$destDir = 'd:\PHOTOGRAFER\HASAN\coding pl\alviero-self-studio\public\images\gallery\graduation-indoor'

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$files = Get-ChildItem -Path $srcDir -Filter '*.jpg'
$count = 1

foreach ($f in $files) {
    $outName = "grad-indoor-$count.jpg"
    $outPath = Join-Path $destDir $outName

    try {
        $fileStream = New-Object System.IO.FileStream($f.FullName, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read)
        $img = [System.Drawing.Image]::FromStream($fileStream)
        
        $maxDim = 1400
        $w = $img.Width
        $h = $img.Height
        
        if ($w -gt $maxDim -or $h -gt $maxDim) {
            if ($w -gt $h) {
                $newW = $maxDim
                $newH = [int]($h * ($maxDim / $w))
            } else {
                $newH = $maxDim
                $newW = [int]($w * ($maxDim / $h))
            }
        } else {
            $newW = $w
            $newH = $h
        }

        $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($img, 0, 0, $newW, $newH)
        $g.Dispose()

        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]88)

        $bmp.Save($outPath, $codec, $encoderParams)
        $bmp.Dispose()
        $img.Dispose()
        $fileStream.Dispose()
        Write-Output "Processed: $outName from $($f.Name)"
    } catch {
        Copy-Item -Path $f.FullName -Destination $outPath -Force
        Write-Output "Copied raw: $outName from $($f.Name)"
    }
    $count++
}
