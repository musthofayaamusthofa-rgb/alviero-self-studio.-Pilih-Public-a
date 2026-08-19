export interface ExportOptions {
  photos: string[];
  bgColor: string;
  textColor: string;
  title: string;
  subtitle: string;
  gridStyle: '4-cut' | '2x2' | 'polaroid';
  filterStyle?: string; // 'none' | 'sepia' | 'grayscale' | 'vintage' | 'vivid'
  sticker?: string;
}

// Helper to draw image using object-fit: cover logic so aspect ratio is 100% preserved (NEVER stretched/gepeng)
const drawCoverImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dWidth: number,
  dHeight: number
) => {
  if (!img.width || !img.height) return;
  const imgRatio = img.width / img.height;
  const targetRatio = dWidth / dHeight;
  let sx = 0;
  let sy = 0;
  let sWidth = img.width;
  let sHeight = img.height;

  if (imgRatio > targetRatio) {
    sWidth = img.height * targetRatio;
    sx = (img.width - sWidth) / 2;
  } else {
    sHeight = img.width / targetRatio;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
};

// Helper to load image safely without canvas CORS tainting
const loadSafeImage = async (src: string): Promise<HTMLImageElement> => {
  // If it's already a data URL or blob URL, load directly
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Gagal memuat foto lokal'));
      img.src = src;
    });
  }

  // If it's an external URL (e.g. Unsplash sample), try fetching as Blob first to prevent canvas tainting
  try {
    const res = await fetch(src, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Gagal memuat blob foto'));
        img.src = blobUrl;
      });
    }
  } catch {
    // If fetch failed, proceed to standard Image loading with crossOrigin
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback without crossOrigin
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      fallbackImg.src = src;
    };
    img.src = src;
  });
};

export const downloadPhotoStripAsImage = async (options: ExportOptions): Promise<{ success: boolean; dataUrl?: string; blobUrl?: string }> => {
  const { photos, bgColor, textColor, title, subtitle, gridStyle, filterStyle = 'none', sticker } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { success: false };

  // Set high-res 300 DPI lab print quality dimensions
  const width = 600;
  let height = 1800;
  if (gridStyle === '2x2') height = 760;
  if (gridStyle === 'polaroid') height = 780;

  canvas.width = width;
  canvas.height = height;

  // Background Fill
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  try {
    const loadedImages = await Promise.all(photos.map(p => loadSafeImage(p)));

    // Header Text inside Strip
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText((title || 'ALVIERO STUDIO').toUpperCase(), width / 2, 55);

    ctx.font = '15px sans-serif';
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.85;
    ctx.fillText(subtitle || 'Self Photo Memories', width / 2, 82);
    ctx.globalAlpha = 1.0;

    const applyFilter = (filter: string) => {
      if (filter === 'grayscale') ctx.filter = 'grayscale(100%)';
      else if (filter === 'sepia') ctx.filter = 'sepia(80%)';
      else if (filter === 'vintage') ctx.filter = 'sepia(40%) contrast(110%) brightness(95%)';
      else if (filter === 'vivid') ctx.filter = 'saturate(160%) contrast(110%)';
      else ctx.filter = 'none';
    };

    if (gridStyle === '4-cut') {
      const startY = 110;
      const photoWidth = 520;
      const photoHeight = 390; // Exact 4:3 Aspect Ratio (520 / 390 = 1.333)
      const gap = 20;

      for (let i = 0; i < Math.min(4, loadedImages.length); i++) {
        const img = loadedImages[i];
        const y = startY + i * (photoHeight + gap);

        ctx.save();
        applyFilter(filterStyle);
        drawCoverImage(ctx, img, 40, y, photoWidth, photoHeight);
        ctx.restore();

        // Optional sticker on top right corner of photo frame
        if (sticker) {
          ctx.font = '28px sans-serif';
          ctx.fillText(sticker, 40 + photoWidth - 30, y + 40);
        }
      }
    } else if (gridStyle === '2x2') {
      const startY = 110;
      const photoWidth = 250;
      const photoHeight = 250; // Exact 1:1 Square Ratio
      const gap = 20;

      const positions = [
        { x: 40, y: startY },
        { x: 310, y: startY },
        { x: 40, y: startY + photoHeight + gap },
        { x: 310, y: startY + photoHeight + gap }
      ];

      for (let i = 0; i < Math.min(4, loadedImages.length); i++) {
        const img = loadedImages[i];
        const pos = positions[i];

        ctx.save();
        applyFilter(filterStyle);
        drawCoverImage(ctx, img, pos.x, pos.y, photoWidth, photoHeight);
        ctx.restore();

        if (sticker) {
          ctx.font = '24px sans-serif';
          ctx.fillText(sticker, pos.x + photoWidth - 25, pos.y + 35);
        }
      }
    } else if (gridStyle === 'polaroid') {
      const startY = 110;
      const photoWidth = 520;
      const photoHeight = 520; // Exact 1:1 Square Ratio

      if (loadedImages.length > 0) {
        ctx.save();
        applyFilter(filterStyle);
        drawCoverImage(ctx, loadedImages[0], 40, startY, photoWidth, photoHeight);
        ctx.restore();

        if (sticker) {
          ctx.font = '32px sans-serif';
          ctx.fillText(sticker, 40 + photoWidth - 35, startY + 45);
        }
      }
    }

    // Footer Text inside Strip
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(`ALVIERO PHOTO STUDIO • ${new Date().toLocaleDateString('id-ID')}`, width / 2, height - 30);

    const filename = `Alviero-PhotoStrip-${Date.now()}.png`;

    // Process Download using Blob (most reliable across mobile & desktop)
    return new Promise<{ success: boolean; dataUrl?: string; blobUrl?: string }>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = filename;
          link.href = blobUrl;
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            document.body.removeChild(link);
          }, 500);

          resolve({ success: true, blobUrl });
        } else {
          // Fallback to Data URL
          try {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
              document.body.removeChild(link);
            }, 500);
            resolve({ success: true, dataUrl });
          } catch (err) {
            console.error('DataURL export error:', err);
            resolve({ success: false });
          }
        }
      }, 'image/png', 1.0);
    });
  } catch (error) {
    console.error('Error generating photo strip PNG:', error);
    return { success: false };
  }
};
