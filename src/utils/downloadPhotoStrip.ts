export type GridTypeId = 'grid-1-3r' | 'grid-3-4r' | 'grid-4-3r' | 'grid-6-4r';
export type FrameThemeId = 'A' | 'B' | 'C' | 'D' | 'E';

export interface GridSlotConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GridDefinition {
  id: GridTypeId;
  name: string;
  shortLabel: string;
  sizeLabel: string;
  photoCount: number;
  aspectRatio: string;
  canvasWidth: number;
  canvasHeight: number;
  prefix: string;
  description: string;
  slots: GridSlotConfig[];
}

export const GRID_DEFINITIONS: Record<GridTypeId, GridDefinition> = {
  'grid-1-3r': {
    id: 'grid-1-3r',
    name: 'Grid 1 (3R)',
    shortLabel: '1 Foto (3R)',
    sizeLabel: '3R (8.9 x 12.7 cm)',
    photoCount: 1,
    aspectRatio: '7/10',
    canvasWidth: 1050,
    canvasHeight: 1500,
    prefix: '1',
    description: '1 Foto Utuh Portrait Minimalis dengan Logo Alviero',
    slots: [
      { x: 100, y: 80, width: 850, height: 1200 }
    ]
  },
  'grid-3-4r': {
    id: 'grid-3-4r',
    name: 'Grid 3 (4R)',
    shortLabel: '3 Foto (4R Strip)',
    sizeLabel: '4R (10.2 x 15.2 cm)',
    photoCount: 3,
    aspectRatio: '2/3',
    canvasWidth: 1200,
    canvasHeight: 1800,
    prefix: '3',
    description: 'Photo Strip 4R Twin 3-Cut (2 Kolom Strip Berdampingan)',
    slots: [
      { x: 50, y: 37, width: 520, height: 494 },
      { x: 50, y: 592, width: 520, height: 494 },
      { x: 50, y: 1147, width: 520, height: 494 },
      { x: 630, y: 37, width: 520, height: 494 },
      { x: 630, y: 592, width: 520, height: 494 },
      { x: 630, y: 1147, width: 520, height: 494 }
    ]
  },
  'grid-4-3r': {
    id: 'grid-4-3r',
    name: 'Grid 4 (3R)',
    shortLabel: '4 Foto 2x2 (3R)',
    sizeLabel: '3R (8.9 x 12.7 cm)',
    photoCount: 4,
    aspectRatio: '7/10',
    canvasWidth: 1050,
    canvasHeight: 1500,
    prefix: '4',
    description: '2x2 Grid Klasik 4 Foto dengan Logo Alviero',
    slots: [
      { x: 52, y: 65, width: 463, height: 566 },
      { x: 535, y: 65, width: 463, height: 566 },
      { x: 52, y: 703, width: 463, height: 566 },
      { x: 535, y: 703, width: 463, height: 566 }
    ]
  },
  'grid-6-4r': {
    id: 'grid-6-4r',
    name: 'Grid 6 (4R)',
    shortLabel: '6 Foto 2x3 (4R)',
    sizeLabel: '4R (10.2 x 15.2 cm)',
    photoCount: 6,
    aspectRatio: '2/3',
    canvasWidth: 1200,
    canvasHeight: 1800,
    prefix: '6',
    description: '2x3 Grid 6 Foto Memanjang Eksklusif',
    slots: [
      { x: 50, y: 37, width: 520, height: 494 },
      { x: 630, y: 37, width: 520, height: 494 },
      { x: 50, y: 595, width: 520, height: 494 },
      { x: 630, y: 595, width: 520, height: 494 },
      { x: 50, y: 1151, width: 520, height: 494 },
      { x: 630, y: 1151, width: 520, height: 494 }
    ]
  }
};

export interface FrameThemeDefinition {
  id: FrameThemeId;
  name: string;
  badge: string;
  previewBg: string;
  previewTextColor: string;
  borderColor: string;
  description: string;
}

export const FRAME_THEMES: FrameThemeDefinition[] = [
  {
    id: 'A',
    name: 'Putih Classic',
    badge: 'A',
    previewBg: '#FFFFFF',
    previewTextColor: '#1E293B',
    borderColor: '#E2E8F0',
    description: 'Bingkai putih bersih minimalis elegan dengan logo Alviero'
  },
  {
    id: 'B',
    name: 'Cute Doodles & Paper',
    badge: 'B',
    previewBg: '#F8FAFC',
    previewTextColor: '#334155',
    borderColor: '#CBD5E1',
    description: 'Tekstur kertas grid buku dengan stiker & ornamen pastel lucu'
  },
  {
    id: 'C',
    name: 'Retro Terracotta',
    badge: 'C',
    previewBg: '#EA580C',
    previewTextColor: '#FFFFFF',
    borderColor: '#C2410C',
    description: 'Nuansa warna hangat retro terracotta dengan frame polaroid'
  },
  {
    id: 'D',
    name: 'Noir Best Moment',
    badge: 'D',
    previewBg: '#0F172A',
    previewTextColor: '#FFFFFF',
    borderColor: '#334155',
    description: 'Bingkai hitam pekat Y2K modern beraksen Best Moment'
  },
  {
    id: 'E',
    name: '35mm Vintage Film',
    badge: 'E',
    previewBg: '#18181B',
    previewTextColor: '#FACC15',
    borderColor: '#3F3F46',
    description: 'Klise strip film 35mm berlubang perforasi vintage aesthetic'
  }
];

export interface ExportGridOptions {
  gridType: GridTypeId;
  frameTheme: FrameThemeId;
  photos: string[];
  filterStyle?: string;
  sticker?: string;
}

// Helper to draw image using object-fit: cover logic
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
export const loadSafeImage = async (src: string): Promise<HTMLImageElement> => {
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Gagal memuat foto lokal'));
      img.src = src;
    });
  }

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
    // Fallback without fetch
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      fallbackImg.src = src;
    };
    img.src = src;
  });
};

export const getFrameOverlayUrl = (gridType: GridTypeId, frameTheme: FrameThemeId): string => {
  const gridDef = GRID_DEFINITIONS[gridType];
  return `/images/grids/${gridType}/${gridDef.prefix}${frameTheme}.png`;
};

export const downloadPhotoStripAsImage = async (options: ExportGridOptions): Promise<{ success: boolean; dataUrl?: string; blobUrl?: string }> => {
  const { gridType, frameTheme, photos, filterStyle = 'none', sticker } = options;
  const gridDef = GRID_DEFINITIONS[gridType] || GRID_DEFINITIONS['grid-4-3r'];

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { success: false };

  canvas.width = gridDef.canvasWidth;
  canvas.height = gridDef.canvasHeight;

  // 1. White / Clean Base Canvas Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  try {
    // Load all user photos
    const loadedImages = await Promise.all(photos.map(p => loadSafeImage(p)));

    const applyFilter = (filter: string) => {
      if (filter === 'grayscale') ctx.filter = 'grayscale(100%)';
      else if (filter === 'sepia') ctx.filter = 'sepia(80%)';
      else if (filter === 'vintage') ctx.filter = 'sepia(40%) contrast(110%) brightness(95%)';
      else if (filter === 'vivid') ctx.filter = 'saturate(160%) contrast(110%)';
      else ctx.filter = 'none';
    };

    // 2. Draw user photos into each designated slot
    gridDef.slots.forEach((slot, index) => {
      // In Grid 3 (4R Twin strip), slots 3,4,5 duplicate photos 0,1,2
      let photoIndex = index;
      if (gridDef.id === 'grid-3-4r' && index >= 3) {
        photoIndex = index % 3;
      }
      
      const img = loadedImages[photoIndex % loadedImages.length];
      if (img) {
        ctx.save();
        applyFilter(filterStyle);
        drawCoverImage(ctx, img, slot.x, slot.y, slot.width, slot.height);
        ctx.restore();

        // Draw optional sticker on top right corner of photo slot
        if (sticker) {
          ctx.save();
          ctx.font = `${Math.round(slot.width * 0.09)}px sans-serif`;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'top';
          ctx.fillText(sticker, slot.x + slot.width - 25, slot.y + 25);
          ctx.restore();
        }
      }
    });

    // 3. Draw the official Alviero Studio PNG frame overlay on top
    const frameOverlaySrc = getFrameOverlayUrl(gridType, frameTheme);
    const frameOverlayImg = await loadSafeImage(frameOverlaySrc);
    ctx.drawImage(frameOverlayImg, 0, 0, canvas.width, canvas.height);

    const filename = `Alviero-${gridDef.name.replace(/\s+/g, '-')}-Tema${frameTheme}-${Date.now()}.png`;

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
            URL.revokeObjectURL(blobUrl);
          }, 500);

          resolve({ success: true });
        } else {
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
