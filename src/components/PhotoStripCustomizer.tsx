import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Download, Upload, Image as ImageIcon, Palette, 
  RefreshCw, Heart, Layers, Wand2, Volume2, Crop, RotateCw, 
  ZoomIn, ZoomOut, Check, X, Move, ArrowLeftRight, ArrowUpDown, 
  Maximize2 
} from 'lucide-react';
import { 
  GridTypeId, FrameThemeId, GRID_DEFINITIONS, FRAME_THEMES, 
  getFrameOverlayUrl, downloadPhotoStripAsImage, loadSafeImage 
} from '../utils/downloadPhotoStrip';
import { playShutterSound } from '../utils/shutterSound';

const revokeBlobUrl = (url: string | null | undefined) => {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

export const PhotoStripCustomizer: React.FC = () => {
  const [selectedGrid, setSelectedGrid] = useState<GridTypeId>('grid-4-3r');
  const [selectedTheme, setSelectedTheme] = useState<FrameThemeId>('A');
  const [activeFilter, setActiveFilter] = useState<string>('none');
  const [selectedSticker, setSelectedSticker] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [downloadedImageUrl, setDownloadedImageUrl] = useState<string | null>(null);

  const defaultSamplePhotos = [
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
  ];

  const [userPhotos, setUserPhotos] = useState<string[]>(defaultSamplePhotos);
  const userPhotosRef = useRef(userPhotos);
  userPhotosRef.current = userPhotos;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const singleReplaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);

  // Manual Crop & Positioning State
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropPanX, setCropPanX] = useState<number>(0);
  const [cropPanY, setCropPanY] = useState<number>(0);
  const [cropRotation, setCropRotation] = useState<number>(0);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imgDimensions, setImgDimensions] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    return () => {
      userPhotosRef.current.forEach(revokeBlobUrl);
    };
  }, []);

  useEffect(() => {
    return () => revokeBlobUrl(downloadedImageUrl);
  }, [downloadedImageUrl]);

  const currentGridDef = GRID_DEFINITIONS[selectedGrid] || GRID_DEFINITIONS['grid-4-3r'];
  const currentThemeDef = FRAME_THEMES.find(t => t.id === selectedTheme) || FRAME_THEMES[0];
  const overlayImageUrl = getFrameOverlayUrl(selectedGrid, selectedTheme);

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      playShutterSound();
      const files = Array.from(e.target.files);
      const newUrls = files.map(file => URL.createObjectURL(file as File));
      setUserPhotos(prev => {
        const next = [...newUrls, ...prev].slice(0, 6);
        prev.filter(url => !next.includes(url)).forEach(revokeBlobUrl);
        return next;
      });
    }
  };

  const handleSingleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replaceTargetIndex !== null && e.target.files && e.target.files.length > 0) {
      playShutterSound();
      const file = e.target.files[0];
      const newUrl = URL.createObjectURL(file);
      setUserPhotos(prev => {
        const next = [...prev];
        revokeBlobUrl(next[replaceTargetIndex]);
        next[replaceTargetIndex] = newUrl;
        return next;
      });
      setReplaceTargetIndex(null);
    }
  };

  const triggerSingleReplace = (index: number) => {
    setReplaceTargetIndex(index);
    singleReplaceInputRef.current?.click();
  };

  const handleResetPhotos = () => {
    playShutterSound();
    userPhotosRef.current.forEach(revokeBlobUrl);
    setUserPhotos(defaultSamplePhotos);
  };

  const handleOpenCropModal = (index: number) => {
    playShutterSound();
    setCropIndex(index);
    setCropZoom(1);
    setCropPanX(0);
    setCropPanY(0);
    setCropRotation(0);
    setFitMode('cover');
  };

  // Render crop preview on modal canvas
  useEffect(() => {
    if (cropIndex === null) return;
    const canvas = cropCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let isMounted = true;
    const targetSrc = userPhotos[cropIndex] || defaultSamplePhotos[0];

    loadSafeImage(targetSrc).then((img) => {
      if (!isMounted) return;
      setImgDimensions({ w: img.width, h: img.height });

      const targetW = 600;
      const targetH = selectedGrid === 'grid-1-3r' ? 833 : selectedGrid === 'grid-4-3r' ? 756 : 560;
      canvas.width = targetW;
      canvas.height = targetH;

      ctx.clearRect(0, 0, targetW, targetH);
      ctx.save();

      const scaleCover = Math.max(targetW / img.width, targetH / img.height);
      const scaleContain = Math.min(targetW / img.width, targetH / img.height);
      const baseScale = fitMode === 'contain' ? scaleContain : scaleCover;
      const finalScale = baseScale * cropZoom;

      ctx.translate(targetW / 2 + cropPanX, targetH / 2 + cropPanY);
      ctx.rotate((cropRotation * Math.PI) / 180);
      ctx.scale(finalScale, finalScale);

      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    }).catch((err) => {
      console.error('Failed to load crop image:', err);
    });

    return () => {
      isMounted = false;
    };
  }, [cropIndex, cropZoom, cropPanX, cropPanY, cropRotation, fitMode, userPhotos, selectedGrid]);

  const handleSaveCrop = () => {
    const canvas = cropCanvasRef.current;
    if (!canvas || cropIndex === null) return;
    playShutterSound();

    try {
      const croppedDataUrl = canvas.toDataURL('image/png');
      setUserPhotos(prev => {
        const next = [...prev];
        revokeBlobUrl(next[cropIndex]);
        next[cropIndex] = croppedDataUrl;
        return next;
      });
      setCropIndex(null);
      return;
    } catch (err) {
      console.warn('toDataURL fallback:', err);
    }

    try {
      canvas.toBlob((blob) => {
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          setUserPhotos(prev => {
            const next = [...prev];
            revokeBlobUrl(next[cropIndex]);
            next[cropIndex] = blobUrl;
            return next;
          });
          setCropIndex(null);
        }
      }, 'image/png');
    } catch (err2) {
      console.error('Crop save error:', err2);
    }
  };

  // Drag handlers for crop modal
  const handleStartDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - cropPanX, y: clientY - cropPanY });
  };

  const handleMoveDrag = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setCropPanX(clientX - dragStart.x);
    setCropPanY(clientY - dragStart.y);
  };

  const handleEndDrag = () => setIsDragging(false);

  // Download Handler
  const handleDownloadPNG = async () => {
    playShutterSound();
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      const result = await downloadPhotoStripAsImage({
        gridType: selectedGrid,
        frameTheme: selectedTheme,
        photos: userPhotos,
        filterStyle: activeFilter,
        sticker: selectedSticker
      });
      setIsDownloading(false);
      if (result.success) {
        setDownloadSuccess(true);
        setDownloadedImageUrl(result.blobUrl || result.dataUrl || null);
        setTimeout(() => setDownloadSuccess(false), 8000);
      } else {
        alert('Mohon maaf, terjadi kendala saat mengunduh gambar. Silakan coba kembali.');
      }
    } catch (e) {
      console.error(e);
      setIsDownloading(false);
      alert('Terjadi kesalahan saat memproses gambar.');
    }
  };

  return (
    <section className="py-4 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-[#EBF2EA] text-[#6E856C] text-[11px] sm:text-xs font-extrabold px-3 py-1 rounded-full border border-[#A9BCA7]">
          <Sparkles className="w-3.5 h-3.5 text-[#6E856C]" />
          <span>Interactive Photo Grid Customizer & Live Frame Generator</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-[#3A3A3A] tracking-tight">
          Kustomisasi Grid & Bingkai Alviero
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed px-2">
          Pilih tata letak format 3R/4R, tentukan tema warna bingkai resmi Alviero Studio, posisikan foto secara utuh, dan unduh hasil PNG siap cetak!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Controls Panel */}
        <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-3xl border border-[#E8DDD6] shadow-sm space-y-5">
          
          {/* 1. UPLOAD & KELOLA FOTO UTUH */}
          <div className="space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-1">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#6E856C]" />
                1. Upload & Kelola Foto ({currentGridDef.photoCount} Slot Foto):
              </label>
              <button
                onClick={handleResetPhotos}
                className="text-[11px] text-stone-500 hover:text-[#6E856C] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Contoh
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            <input
              type="file"
              ref={singleReplaceInputRef}
              onChange={handleSingleReplace}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[46px] py-3 px-4 rounded-2xl border-2 border-dashed border-[#A9BCA7] hover:border-[#6E856C] bg-[#FDFBF7] hover:bg-[#F2E9E4] text-[#3A3A3A] font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Upload className="w-4 h-4 text-[#6E856C]" />
              <span>Unggah Foto Dari Galeri HP / Laptop</span>
            </button>

            {/* Instruction Tip */}
            <div className="bg-[#FDFBF7] border border-[#E8DDD6] p-3 rounded-2xl text-[11px] text-[#3A3A3A] font-medium leading-relaxed">
              💡 <strong>Petunjuk Posisi:</strong> Klik <strong>"Crop Utuh & Posisi"</strong> pada foto untuk zoom, geser wajah, atau putar sudut foto agar pas dengan bingkai.
            </div>

            {/* Photo Thumbnails List */}
            <div className="space-y-2 pt-1">
              <div className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider">
                Kelola {currentGridDef.photoCount} Slot Foto Terpasang:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {userPhotos.slice(0, currentGridDef.photoCount).map((img, idx) => (
                  <div key={idx} className="p-2.5 rounded-2xl border border-[#E8DDD6] bg-[#FDFBF7] flex items-center gap-3 shadow-2xs hover:border-[#6E856C] transition-colors">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-300">
                      <img src={img} alt={`Foto slot ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 bg-[#3A3A3A] text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <button
                        onClick={() => handleOpenCropModal(idx)}
                        className="w-full min-h-[34px] py-1 px-2 bg-[#6E856C] hover:bg-[#5C725A] text-white font-extrabold text-[10.5px] rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                      >
                        <Crop className="w-3.5 h-3.5 text-[#EBF2EA]" />
                        <span>Crop Utuh & Posisi</span>
                      </button>
                      <button
                        onClick={() => triggerSingleReplace(idx)}
                        className="w-full min-h-[30px] py-0.5 px-2 bg-white hover:bg-stone-100 border border-[#E8DDD6] text-[#3A3A3A] font-bold text-[10px] rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3 text-stone-500" />
                        <span>Ganti Foto</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. PILIH TATA LETAK GRID */}
          <div className="space-y-3 pt-3 border-t border-[#E8DDD6]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#6E856C]" />
                2. Pilihan Tata Letak Grid:
              </label>
              <span className="text-[10.5px] bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7] px-2 py-0.5 rounded-full font-bold">
                {currentGridDef.sizeLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {(Object.keys(GRID_DEFINITIONS) as GridTypeId[]).map((gKey) => {
                const g = GRID_DEFINITIONS[gKey];
                const isSelected = selectedGrid === gKey;

                return (
                  <button
                    key={gKey}
                    onClick={() => {
                      playShutterSound();
                      setSelectedGrid(gKey);
                    }}
                    className={`min-h-[58px] p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between active:scale-98 ${
                      isSelected
                        ? 'bg-[#3A3A3A] text-white border-[#3A3A3A] shadow-md ring-2 ring-[#A9BCA7]'
                        : 'bg-[#FDFBF7] border-[#E8DDD6] text-[#3A3A3A] hover:bg-[#F2E9E4] hover:border-[#3A3A3A]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-xs">{g.name}</span>
                      <span className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-[#A9BCA7] text-[#2A2A2A]' : 'bg-[#E8DDD6] text-stone-700'
                      }`}>
                        {g.shortLabel}
                      </span>
                    </div>
                    <p className={`text-[10px] truncate mt-1 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                      {g.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. PILIH TEMA / WARNA BINGKAI */}
          <div className="space-y-3 pt-3 border-t border-[#E8DDD6]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#6E856C]" />
                3. Pilih Tema / Warna Bingkai:
              </label>
              <span className="text-[10.5px] bg-[#EBF2EA] text-[#6E856C] border border-[#A9BCA7] px-2 py-0.5 rounded-full font-bold">
                Tema {selectedTheme}: {currentThemeDef.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FRAME_THEMES.map((theme) => {
                const isSelected = selectedTheme === theme.id;

                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      playShutterSound();
                      setSelectedTheme(theme.id);
                    }}
                    className={`min-h-[46px] p-2.5 rounded-2xl border text-left flex items-center gap-2.5 cursor-pointer transition-all active:scale-98 ${
                      isSelected
                        ? 'bg-[#3A3A3A] text-white border-[#3A3A3A] shadow-md ring-2 ring-[#A9BCA7]'
                        : 'bg-white border-[#E8DDD6] text-[#3A3A3A] hover:bg-[#FDFBF7] hover:border-[#3A3A3A]'
                    }`}
                  >
                    <div 
                      className="w-7 h-7 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 shadow-2xs"
                      style={{ backgroundColor: theme.previewBg, color: theme.previewTextColor, borderColor: theme.borderColor }}
                    >
                      {theme.badge}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold text-xs truncate leading-tight">{theme.name}</div>
                      <div className={`text-[9.5px] truncate mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {theme.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. EFEK WARNA FOTO & STIKER */}
          <div className="space-y-3 pt-3 border-t border-[#E8DDD6]">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-[#6E856C]" />
              4. Efek Warna Foto & Stiker:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={activeFilter}
                onChange={(e) => {
                  playShutterSound();
                  setActiveFilter(e.target.value);
                }}
                className="w-full min-h-[42px] px-3 py-2 bg-[#FDFBF7] border border-[#E8DDD6] rounded-xl text-xs font-extrabold text-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#A9BCA7] cursor-pointer"
              >
                <option value="none">Normal Color (Natural)</option>
                <option value="vivid">Vivid Contrast (Tajam)</option>
                <option value="sepia">Warm Sepia (Klasik Hangat)</option>
                <option value="vintage">Vintage Film (Retro Mood)</option>
                <option value="grayscale">B&W Dramatic (Hitam Putih)</option>
              </select>

              <div className="flex items-center gap-1 bg-[#FDFBF7] border border-[#E8DDD6] p-1.5 rounded-xl justify-around text-lg min-h-[42px]">
                {['', '💖', '⭐', '✨', '🎀', '🌸', '🍀', '🔥'].map((s) => (
                  <button
                    key={s || 'none'}
                    onClick={() => {
                      playShutterSound();
                      setSelectedSticker(s);
                    }}
                    className={`min-w-[30px] min-h-[30px] p-0.5 rounded-lg transition-all cursor-pointer flex items-center justify-center text-sm sm:text-base ${
                      selectedSticker === s ? 'bg-[#3A3A3A] text-white scale-110 shadow-xs' : 'hover:scale-105'
                    }`}
                  >
                    {s || '🚫'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tester Efek Suara Shutter & Quick Download */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <button
              onClick={() => playShutterSound()}
              className="flex items-center gap-1.5 text-xs text-[#6E856C] hover:text-[#3A3A3A] font-bold cursor-pointer py-1"
            >
              <Volume2 className="w-4 h-4" />
              <span>Tes Efek Suara Shutter Kamera</span>
            </button>
          </div>

          {/* Export PNG Action Button */}
          <div className="pt-2">
            <button
              onClick={handleDownloadPNG}
              disabled={isDownloading}
              className="w-full min-h-[48px] bg-[#6E856C] hover:bg-[#5C725A] text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4 text-[#EBF2EA]" />
              <span>{isDownloading ? 'Mengekspor Foto Lab...' : `Download Hasil ${currentGridDef.name} (PNG)`}</span>
            </button>
          </div>
        </div>

        {/* Right Live Preview Panel */}
        <div className="lg:col-span-6 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 p-4 sm:p-8 rounded-3xl border border-stone-800 text-white flex flex-col items-center justify-center min-h-[520px] shadow-xl sticky top-24">
          <div className="text-xs text-stone-400 font-semibold mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
            <span>Pratinjau Hasil Kustom ({currentGridDef.name} - Tema {selectedTheme})</span>
          </div>

          {/* Interactive Composite Frame Container */}
          <div 
            className="relative rounded-2xl shadow-2xl overflow-hidden bg-white max-w-[320px] sm:max-w-[360px] w-full border border-stone-700 select-none group"
            style={{ aspectRatio: currentGridDef.aspectRatio }}
          >
            {/* 1. Underlying User Photo Slots */}
            {currentGridDef.slots.map((slot, idx) => {
              let photoIdx = idx;
              if (currentGridDef.id === 'grid-3-4r' && idx >= 3) {
                photoIdx = idx % 3;
              }
              const photoSrc = userPhotos[photoIdx % userPhotos.length];

              const leftPct = (slot.x / currentGridDef.canvasWidth) * 100;
              const topPct = (slot.y / currentGridDef.canvasHeight) * 100;
              const widthPct = (slot.width / currentGridDef.canvasWidth) * 100;
              const heightPct = (slot.height / currentGridDef.canvasHeight) * 100;

              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                    overflow: 'hidden'
                  }}
                  className="bg-stone-200 z-0 group/slot"
                >
                  <img
                    src={photoSrc}
                    alt={`Photo slot ${idx + 1}`}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover/slot:scale-105 ${
                      activeFilter === 'grayscale' ? 'grayscale' :
                      activeFilter === 'sepia' ? 'sepia' :
                      activeFilter === 'vintage' ? 'sepia-50 contrast-110' :
                      activeFilter === 'vivid' ? 'saturate-150 contrast-110' : ''
                    }`}
                  />

                  {/* Quick crop hover button */}
                  <button
                    onClick={() => handleOpenCropModal(photoIdx)}
                    className="absolute bottom-1.5 right-1.5 bg-stone-950/85 hover:bg-stone-950 text-white font-extrabold text-[9px] px-2 py-1 rounded-md shadow-md opacity-0 group-hover/slot:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer z-20"
                  >
                    <Crop className="w-2.5 h-2.5 text-amber-300" />
                    <span>Crop</span>
                  </button>

                  {/* Optional Sticker Overlay */}
                  {selectedSticker && (
                    <div className="absolute top-1.5 right-1.5 text-sm sm:text-base drop-shadow-md z-10 pointer-events-none">
                      {selectedSticker}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 2. Official Alviero Studio Frame Overlay PNG (Crisp & Pixel-Perfect) */}
            <img
              src={overlayImageUrl}
              alt="Alviero Frame Overlay"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10"
            />
          </div>

          {/* Download Success Banner */}
          {downloadSuccess && (
            <div className="w-full max-w-sm mt-4 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 p-3 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 shadow-lg animate-in fade-in">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Foto Grid berhasil diunduh (kualitas 300 DPI)!</span>
              </div>
              {downloadedImageUrl && (
                <a
                  href={downloadedImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shrink-0"
                >
                  Buka
                </a>
              )}
            </div>
          )}

          {/* Quick Action Button below Preview */}
          <div className="w-full max-w-xs mt-4">
            <button
              onClick={handleDownloadPNG}
              disabled={isDownloading}
              className="w-full min-h-[44px] bg-[#6E856C] hover:bg-[#5C725A] text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4 text-[#EBF2EA]" />
              <span>{isDownloading ? 'Mengekspor PNG...' : 'Download Hasil PNG'}</span>
            </button>
          </div>

          <p className="text-xs text-stone-400 mt-3 text-center max-w-sm leading-relaxed px-2">
            ✦ Dicetak dengan kualitas lab studio beresolusi tinggi di Alviero Studio Foto!
          </p>
        </div>
      </div>

      {/* FULL PHOTO VISIBLE MANUAL CROP MODAL */}
      {cropIndex !== null && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-[#2A2A2A] text-white rounded-3xl max-w-2xl w-full border border-[#3A3A3A] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
            {/* Modal Header */}
            <div className="p-3.5 sm:p-5 bg-[#1F1F1F] border-b border-[#3A3A3A] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Crop className="w-5 h-5 text-[#A9BCA7]" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">Crop & Posisi Foto #{cropIndex + 1}</h3>
                  {imgDimensions && (
                    <p className="text-[10px] text-stone-400 font-mono">
                      Resolusi Asli: {imgDimensions.w} x {imgDimensions.h} px
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setCropIndex(null)}
                className="w-8 h-8 rounded-full bg-[#3A3A3A] text-stone-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewport Modes Bar */}
            <div className="bg-[#1F1F1F]/80 px-3 py-2 border-b border-[#3A3A3A] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 shrink-0">
              <span className="text-stone-400 font-semibold text-[11px]">Mode Tampilan Foto:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setFitMode('contain'); setCropZoom(1); setCropPanX(0); setCropPanY(0); }}
                  className={`min-h-[36px] px-3 py-1 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    fitMode === 'contain' ? 'bg-[#6E856C] text-white shadow-xs' : 'bg-[#3A3A3A] text-stone-300 hover:bg-[#4A4A4A]'
                  }`}
                >
                  <Maximize2 className="w-3 h-3 text-[#A9BCA7]" />
                  <span>Foto Utuh (Contain)</span>
                </button>

                <button
                  onClick={() => { setFitMode('cover'); setCropZoom(1); setCropPanX(0); setCropPanY(0); }}
                  className={`min-h-[36px] px-3 py-1 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    fitMode === 'cover' ? 'bg-[#6E856C] text-white shadow-xs' : 'bg-[#3A3A3A] text-stone-300 hover:bg-[#4A4A4A]'
                  }`}
                >
                  <Crop className="w-3 h-3 text-[#A9BCA7]" />
                  <span>Penuh Frame (Cover)</span>
                </button>
              </div>
            </div>

            {/* Canvas Interactive Viewport */}
            <div className="p-3 sm:p-5 flex flex-col items-center justify-center bg-[#181818] relative overflow-hidden flex-1 min-h-[260px]">
              <div className="text-[10px] sm:text-[11px] text-[#A9BCA7] mb-2 flex items-center gap-1.5 font-bold bg-[#2A2A2A]/90 px-3 py-1 rounded-full border border-[#A9BCA7]/30 shadow-md">
                <Move className="w-3.5 h-3.5 text-[#A9BCA7] animate-bounce" />
                <span>Geser (Drag) foto untuk atur fokus wajah</span>
              </div>

              {/* Crop Frame Box */}
              <div 
                className="relative overflow-hidden rounded-2xl border-4 border-[#6E856C] shadow-2xl cursor-grab active:cursor-grabbing bg-stone-950 flex items-center justify-center touch-none my-auto"
                onMouseDown={(e) => handleStartDrag(e.clientX, e.clientY)}
                onMouseMove={(e) => handleMoveDrag(e.clientX, e.clientY)}
                onMouseUp={handleEndDrag}
                onMouseLeave={handleEndDrag}
                onTouchStart={(e) => {
                  if (e.touches.length > 0) handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchMove={(e) => {
                  if (e.touches.length > 0) handleMoveDrag(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchEnd={handleEndDrag}
                style={{ 
                  width: '100%', 
                  maxWidth: '340px', 
                  aspectRatio: selectedGrid === 'grid-1-3r' ? '7/10' : selectedGrid === 'grid-4-3r' ? '4/5' : '1/1' 
                }}
              >
                <canvas
                  ref={cropCanvasRef}
                  className="w-full h-full object-contain pointer-events-none"
                />

                {/* Grid Overlay Guide Lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/10 opacity-40">
                  <div className="border border-white/15"></div>
                  <div className="border border-white/15"></div>
                  <div className="border border-white/15"></div>
                  <div className="border border-white/15"></div>
                  <div className="border border-white/15"></div>
                  <div className="border border-white/15"></div>
                  <div className="border border-white/15"></div>
                  <div className="border border-white/15"></div>
                  <div className="border border-white/15"></div>
                </div>
              </div>
            </div>

            {/* Crop Controls Sliders */}
            <div className="p-3 sm:p-5 space-y-3 border-t border-[#3A3A3A] text-xs shrink-0 bg-[#2A2A2A]">
              {/* Zoom Slider */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-stone-300 text-[11px]">
                  <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5 text-[#A9BCA7]" /> Zoom Scale:</span>
                  <span className="text-[#A9BCA7] font-extrabold">{Math.round(cropZoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCropZoom(prev => Math.max(0.3, prev - 0.1))}
                    className="w-9 h-9 rounded-xl bg-[#3A3A3A] hover:bg-[#4A4A4A] text-stone-200 flex items-center justify-center cursor-pointer active:scale-95"
                    title="Perkecil Zoom"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="0.3"
                    max="3.0"
                    step="0.05"
                    value={cropZoom}
                    onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                    className="flex-1 h-3 accent-[#6E856C] cursor-pointer"
                  />
                  <button
                    onClick={() => setCropZoom(prev => Math.min(3.0, prev + 0.1))}
                    className="w-9 h-9 rounded-xl bg-[#3A3A3A] hover:bg-[#4A4A4A] text-stone-200 flex items-center justify-center cursor-pointer active:scale-95"
                    title="Perbesar Zoom"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sliders Posisi X & Y */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-stone-300 text-[10px]">
                    <span className="flex items-center gap-1"><ArrowLeftRight className="w-3 h-3 text-[#A9BCA7]" /> Posisi Kiri-Kanan (X):</span>
                    <span>{Math.round(cropPanX)} px</span>
                  </div>
                  <input
                    type="range"
                    min="-400"
                    max="400"
                    step="1"
                    value={cropPanX}
                    onChange={(e) => setCropPanX(parseFloat(e.target.value))}
                    className="w-full h-3 accent-[#6E856C] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-stone-300 text-[10px]">
                    <span className="flex items-center gap-1"><ArrowUpDown className="w-3 h-3 text-[#A9BCA7]" /> Posisi Atas-Bawah (Y):</span>
                    <span>{Math.round(cropPanY)} px</span>
                  </div>
                  <input
                    type="range"
                    min="-400"
                    max="400"
                    step="1"
                    value={cropPanY}
                    onChange={(e) => setCropPanY(parseFloat(e.target.value))}
                    className="w-full h-3 accent-[#6E856C] cursor-pointer"
                  />
                </div>
              </div>

              {/* Rotation & Quick Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#3A3A3A] flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCropRotation(prev => (prev + 90) % 360)}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#3A3A3A] hover:bg-[#4A4A4A] text-stone-200 font-bold flex items-center gap-1.5 cursor-pointer text-[11px] active:scale-95"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#A9BCA7]" />
                    <span>Putar 90°</span>
                  </button>

                  <button
                    onClick={() => {
                      setFitMode('contain');
                      setCropZoom(1);
                      setCropPanX(0);
                      setCropPanY(0);
                    }}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#3A3A3A] text-[#A9BCA7] border border-[#5A5A5A] font-bold flex items-center gap-1 cursor-pointer text-[11px] active:scale-95"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#A9BCA7]" />
                    <span>Foto Utuh</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setCropZoom(1);
                    setCropPanX(0);
                    setCropPanY(0);
                    setCropRotation(0);
                    setFitMode('cover');
                  }}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#3A3A3A] hover:bg-[#4A4A4A] text-stone-400 hover:text-stone-200 font-semibold flex items-center gap-1 cursor-pointer text-[11px] active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3.5 sm:p-5 bg-[#1F1F1F] border-t border-[#3A3A3A] flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setCropIndex(null)}
                className="min-h-[42px] px-4 py-2 rounded-xl font-bold text-stone-400 hover:text-white cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCrop}
                className="min-h-[42px] px-5 py-2.5 rounded-xl font-extrabold bg-[#6E856C] hover:bg-[#5C725A] text-white shadow-md flex items-center gap-2 cursor-pointer active:scale-95 transition-all text-xs"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Hasil Posisi & Crop</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
