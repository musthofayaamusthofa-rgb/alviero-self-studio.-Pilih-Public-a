import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Download, Upload, Image as ImageIcon, Type, Palette, RefreshCw, Heart, Layers, Wand2, Volume2, Crop, RotateCw, ZoomIn, ZoomOut, Check, X, Move, ArrowLeftRight, ArrowUpDown, Maximize2 } from 'lucide-react';
import { downloadPhotoStripAsImage } from '../utils/downloadPhotoStrip';
import { playShutterSound } from '../utils/shutterSound';

export const PhotoStripCustomizer: React.FC = () => {
  const [frameBg, setFrameBg] = useState<string>('#FFFFFF');
  const [frameTextColor, setFrameTextColor] = useState<string>('#0F172A');
  const [customTitle, setCustomTitle] = useState<string>('ALVIERO STUDIO');
  const [customSubtitle, setCustomSubtitle] = useState<string>('Best Memories ~ 2026');
  const [gridStyle, setGridStyle] = useState<'4-cut' | '2x2' | 'polaroid'>('4-cut');
  const [activeFilter, setActiveFilter] = useState<string>('none');
  const [selectedSticker, setSelectedSticker] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const defaultSamplePhotos = [
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80'
  ];

  const [userPhotos, setUserPhotos] = useState<string[]>(defaultSamplePhotos);
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

  const frameThemes = [
    { name: 'Putih Classic', bg: '#FFFFFF', text: '#0F172A' },
    { name: 'Hitam Y2K', bg: '#0F172A', text: '#FFFFFF' },
    { name: 'Pastel Pink', bg: '#FCE7F3', text: '#831843' },
    { name: 'Lavender', bg: '#F3E8FF', text: '#581C87' },
    { name: 'Butter Yellow', bg: '#FEF9C3', text: '#713F12' },
    { name: 'Cyber Neon', bg: '#0284C7', text: '#FFFFFF' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      playShutterSound();
      const files = Array.from(e.target.files);
      const newUrls = files.map(file => URL.createObjectURL(file as File));
      setUserPhotos(prev => [...newUrls, ...prev].slice(0, 4));
    }
  };

  const handleSingleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replaceTargetIndex !== null && e.target.files && e.target.files.length > 0) {
      playShutterSound();
      const file = e.target.files[0];
      const newUrl = URL.createObjectURL(file);
      setUserPhotos(prev => {
        const next = [...prev];
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

  // Helper to load image for canvas without CORS tainting
  const loadCanvasImage = async (src: string): Promise<HTMLImageElement> => {
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
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
          img.onerror = (e) => reject(e);
          img.src = blobUrl;
        });
      }
    } catch {
      // Fallback to standard Image loading
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = (e) => reject(e);
        fallbackImg.src = src;
      };
      img.src = src;
    });
  };

  // Render crop preview on canvas with proper scaling calculation so FULL image is visible
  useEffect(() => {
    if (cropIndex === null) return;
    const canvas = cropCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let isMounted = true;
    const targetSrc = userPhotos[cropIndex];

    loadCanvasImage(targetSrc).then((img) => {
      if (!isMounted) return;
      setImgDimensions({ w: img.width, h: img.height });

      const targetW = gridStyle === '2x2' || gridStyle === 'polaroid' ? 600 : 600;
      const targetH = gridStyle === '2x2' || gridStyle === 'polaroid' ? 600 : 450;
      canvas.width = targetW;
      canvas.height = targetH;

      ctx.clearRect(0, 0, targetW, targetH);
      ctx.save();

      // Base scale calculation to fit high-res smartphone photos cleanly into target bounds
      const scaleCover = Math.max(targetW / img.width, targetH / img.height);
      const scaleContain = Math.min(targetW / img.width, targetH / img.height);
      const baseScale = fitMode === 'contain' ? scaleContain : scaleCover;
      const finalScale = baseScale * cropZoom;

      // Translate to center + pan offsets
      ctx.translate(targetW / 2 + cropPanX, targetH / 2 + cropPanY);
      ctx.rotate((cropRotation * Math.PI) / 180);
      ctx.scale(finalScale, finalScale);

      // Draw image centered
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    }).catch((err) => {
      console.error('Failed to load crop image:', err);
    });

    return () => {
      isMounted = false;
    };
  }, [cropIndex, cropZoom, cropPanX, cropPanY, cropRotation, fitMode, userPhotos, gridStyle]);

  const handleSaveCrop = () => {
    const canvas = cropCanvasRef.current;
    if (!canvas || cropIndex === null) return;
    playShutterSound();

    try {
      const croppedDataUrl = canvas.toDataURL('image/png');
      setUserPhotos(prev => {
        const next = [...prev];
        next[cropIndex] = croppedDataUrl;
        return next;
      });
      setCropIndex(null);
      return;
    } catch (err) {
      console.warn('toDataURL failed, attempting toBlob fallback:', err);
    }

    try {
      canvas.toBlob((blob) => {
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          setUserPhotos(prev => {
            const next = [...prev];
            next[cropIndex] = blobUrl;
            return next;
          });
          setCropIndex(null);
        } else {
          alert('Gagal menyimpan hasil crop. Silakan coba lagi.');
        }
      }, 'image/png');
    } catch (err2) {
      console.error('Crop save error:', err2);
      alert('Gagal menyimpan hasil crop.');
    }
  };

  // Mouse & Touch Drag handlers for manual positioning
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

  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [downloadedImageUrl, setDownloadedImageUrl] = useState<string | null>(null);

  const handleDownloadPNG = async () => {
    playShutterSound();
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      const result = await downloadPhotoStripAsImage({
        photos: userPhotos,
        bgColor: frameBg,
        textColor: frameTextColor,
        title: customTitle,
        subtitle: customSubtitle,
        gridStyle,
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
    <section className="py-4 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border border-rose-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Photo Strip Builder & Full Photo Crop Editor</span>
        </div>
        <h2 className="text-xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Bikin Kustom Photo Strip Kamu
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-2">
          Unggah foto dari HP/Laptop, potong & posisikan secara utuh (full photo visible), tentukan tema bingkai, dan download hasil PNG tinggi!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Control Controls Panel */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          {/* Photo Upload & Crop Controls */}
          <div className="space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                1. Upload & Atur Foto Utuh:
              </label>
              <button
                onClick={handleResetPhotos}
                className="text-[11px] text-slate-500 hover:text-indigo-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
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
              className="w-full min-h-[44px] py-3.5 px-4 rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Upload className="w-4 h-4" />
              <span>Unggah Foto Dari Galeri HP / Laptop</span>
            </button>

            {/* Feature Callout */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-3 rounded-2xl text-[11px] text-indigo-900 font-medium leading-relaxed">
              💡 <strong>Petunjuk Crop Utuh:</strong> Klik <strong>"Crop Utuh & Posisi"</strong> pada foto untuk melihat <u>seluruh bagian foto secara utuh</u>, zoom, dan geser posisi wajah!
            </div>

            {/* Thumbnail Cards with Crop & Replace Buttons */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Kelola 4 Foto Frame:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {userPhotos.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="p-2.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3 shadow-2xs">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                      <img src={img} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 bg-slate-900/80 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <button
                        onClick={() => handleOpenCropModal(idx)}
                        className="w-full min-h-[36px] py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Crop className="w-3.5 h-3.5 text-amber-300" />
                        <span>Crop Utuh & Posisi</span>
                      </button>
                      <button
                        onClick={() => triggerSingleReplace(idx)}
                        className="w-full min-h-[32px] py-1 px-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-[10px] rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3 text-slate-500" />
                        <span>Ganti Foto</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Theme Color */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-600" />
              2. Pilih Tema Warna Bingkai:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {frameThemes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => {
                    playShutterSound();
                    setFrameBg(theme.bg);
                    setFrameTextColor(theme.text);
                  }}
                  className={`min-h-[40px] p-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-transform ${
                    frameBg === theme.bg ? 'ring-2 ring-indigo-600 scale-102 shadow-xs' : 'hover:scale-102 border-slate-200'
                  }`}
                  style={{ backgroundColor: theme.bg, color: theme.text }}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: theme.bg }} />
                  <span className="truncate">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout Style */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              3. Pilihan Tata Letak Grid:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { playShutterSound(); setGridStyle('4-cut'); }}
                className={`min-h-[40px] p-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  gridStyle === '4-cut' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                4-Cut Strip
              </button>
              <button
                onClick={() => { playShutterSound(); setGridStyle('2x2'); }}
                className={`min-h-[40px] p-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  gridStyle === '2x2' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                2x2 Grid
              </button>
              <button
                onClick={() => { playShutterSound(); setGridStyle('polaroid'); }}
                className={`min-h-[40px] p-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  gridStyle === 'polaroid' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Polaroid
              </button>
            </div>
          </div>

          {/* Filter & Stickers */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
              4. Efek Warna Foto & Stiker:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={activeFilter}
                onChange={(e) => {
                  playShutterSound();
                  setActiveFilter(e.target.value);
                }}
                className="w-full min-h-[40px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="none">Normal Color</option>
                <option value="vivid">Vivid Contrast</option>
                <option value="sepia">Warm Sepia</option>
                <option value="vintage">Vintage Film</option>
                <option value="grayscale">B&W Dramatic</option>
              </select>

              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-xl justify-around text-lg min-h-[40px]">
                {['', '💖', '⭐', '✨', '🎀'].map((s) => (
                  <button
                    key={s || 'none'}
                    onClick={() => {
                      playShutterSound();
                      setSelectedSticker(s);
                    }}
                    className={`min-w-[32px] min-h-[32px] p-1 rounded-md transition-all cursor-pointer flex items-center justify-center ${
                      selectedSticker === s ? 'bg-indigo-600 text-white scale-110 shadow-xs' : 'hover:scale-105'
                    }`}
                  >
                    {s || '🚫'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Text */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-emerald-600" />
              5. Teks Cetakan Bingkai:
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Judul Utama (misal: ALVIERO STUDIO)"
                className="w-full min-h-[40px] p-2.5 rounded-xl border border-slate-200 text-xs font-extrabold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <input
                type="text"
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                placeholder="Sub-judul (misal: Best Friends 2026)"
                className="w-full min-h-[40px] p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Audio Shutter Sound Tester */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <button
              onClick={() => playShutterSound()}
              className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer py-1"
            >
              <Volume2 className="w-4 h-4" />
              <span>Tes Efek Suara Shutter Kamera</span>
            </button>
          </div>

          {/* Export PNG Action */}
          <div className="pt-2">
            <button
              onClick={handleDownloadPNG}
              disabled={isDownloading}
              className="w-full min-h-[48px] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>{isDownloading ? 'Mengekspor PNG...' : 'Download Hasil Photo Strip (PNG)'}</span>
            </button>
          </div>
        </div>

        {/* Live Preview & Download Panel */}
        <div className="lg:col-span-7 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-8 rounded-3xl border border-slate-800 text-white flex flex-col items-center justify-center min-h-[480px] shadow-xl">
          <div className="text-xs text-slate-400 font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
            <span>Hasil Pratinjau Kustom Photo Strip</span>
          </div>

          {/* Frame Graphic Container */}
          <div 
            className="p-3.5 sm:p-5 rounded-2xl shadow-2xl max-w-[280px] sm:max-w-[320px] w-full space-y-3 transition-all duration-300 border border-black/10 relative"
            style={{ backgroundColor: frameBg, color: frameTextColor }}
          >
            {/* Header Title inside Strip */}
            <div className="text-center border-b border-black/10 pb-2">
              <h4 className="font-black text-sm uppercase tracking-wider leading-snug">
                {customTitle || 'ALVIERO STUDIO'}
              </h4>
              <p className="text-[10px] font-semibold opacity-85">
                {customSubtitle || 'Self Photo Memories'}
              </p>
            </div>

            {/* Photos with ALWAYS VISIBLE Crop Button on Mobile for easy tapping */}
            {gridStyle === '4-cut' && (
              <div className="grid grid-cols-1 gap-2">
                {userPhotos.slice(0, 4).map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-200 shadow-inner group">
                    <img 
                      src={img} 
                      alt="Strip photo" 
                      className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                        activeFilter === 'grayscale' ? 'grayscale' :
                        activeFilter === 'sepia' ? 'sepia' :
                        activeFilter === 'vintage' ? 'sepia-50 contrast-110' :
                        activeFilter === 'vivid' ? 'saturate-150 contrast-110' : ''
                      }`} 
                    />
                    <button
                      onClick={() => handleOpenCropModal(i)}
                      className="absolute bottom-2 right-2 bg-slate-900/90 hover:bg-slate-950 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg shadow-lg backdrop-blur-md opacity-100 sm:opacity-90 sm:group-hover:opacity-100 transition-all flex items-center gap-1 cursor-pointer active:scale-95 border border-white/20"
                    >
                      <Crop className="w-3 h-3 text-amber-300" />
                      <span>Crop Utuh & Posisi</span>
                    </button>
                    {selectedSticker && (
                      <div className="absolute top-2 right-2 text-xl drop-shadow-md">{selectedSticker}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {gridStyle === '2x2' && (
              <div className="grid grid-cols-2 gap-2">
                {userPhotos.slice(0, 4).map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-200 shadow-inner group">
                    <img 
                      src={img} 
                      alt="Grid photo" 
                      className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                        activeFilter === 'grayscale' ? 'grayscale' :
                        activeFilter === 'sepia' ? 'sepia' :
                        activeFilter === 'vintage' ? 'sepia-50 contrast-110' :
                        activeFilter === 'vivid' ? 'saturate-150 contrast-110' : ''
                      }`} 
                    />
                    <button
                      onClick={() => handleOpenCropModal(i)}
                      className="absolute bottom-1.5 right-1.5 bg-slate-900/90 hover:bg-slate-950 text-white font-extrabold text-[9.5px] px-2 py-1 rounded-md shadow-md opacity-100 sm:opacity-90 sm:group-hover:opacity-100 transition-all flex items-center gap-1 cursor-pointer active:scale-95 border border-white/20"
                    >
                      <Crop className="w-2.5 h-2.5 text-amber-300" />
                      <span>Crop Utuh</span>
                    </button>
                    {selectedSticker && (
                      <div className="absolute top-1 right-1 text-sm drop-shadow-md">{selectedSticker}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {gridStyle === 'polaroid' && (
              <div className="space-y-3">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-200 shadow-inner group">
                  <img 
                    src={userPhotos[0]} 
                    alt="Polaroid photo" 
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      activeFilter === 'grayscale' ? 'grayscale' :
                      activeFilter === 'sepia' ? 'sepia' :
                      activeFilter === 'vintage' ? 'sepia-50 contrast-110' :
                      activeFilter === 'vivid' ? 'saturate-150 contrast-110' : ''
                    }`} 
                  />
                  <button
                    onClick={() => handleOpenCropModal(0)}
                    className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-slate-950 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-lg opacity-100 sm:opacity-90 sm:group-hover:opacity-100 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-white/20"
                  >
                    <Crop className="w-3.5 h-3.5 text-amber-300" />
                    <span>Crop Utuh & Posisi</span>
                  </button>
                  {selectedSticker && (
                    <div className="absolute top-2 right-2 text-2xl drop-shadow-md">{selectedSticker}</div>
                  )}
                </div>
              </div>
            )}

            {/* Footer inside Strip */}
            <div className="pt-2 flex justify-between items-center text-[9px] font-bold opacity-75 border-t border-black/10">
              <span>ALVIERO PHOTO STUDIO</span>
              <span>{new Date().toLocaleDateString('id-ID')}</span>
            </div>
          </div>

          {/* Download Success Notification */}
          {downloadSuccess && (
            <div className="w-full max-w-sm mt-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 shadow-lg animate-fade-in">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Foto Strip berhasil diunduh ke perangkat Anda!</span>
              </div>
              {downloadedImageUrl && (
                <a
                  href={downloadedImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0"
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
              className="w-full min-h-[44px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>{isDownloading ? 'Mengekspor...' : 'Download Hasil PNG'}</span>
            </button>
          </div>

          {/* Download Note */}
          <p className="text-xs text-slate-400 mt-4 text-center max-w-sm leading-relaxed px-2">
            ✦ Cetakan fisik kualitas lab studio berkualitas tinggi langsung tersedia di lokasi Alviero Studio Foto!
          </p>
        </div>
      </div>

      {/* FULL PHOTO VISIBLE MANUAL CROP MODAL (TOUCH FRIENDLY FOR IPHONE) */}
      {cropIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
            {/* Modal Header */}
            <div className="p-3.5 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Crop className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">Crop & Posisi Foto #{cropIndex + 1}</h3>
                  {imgDimensions && (
                    <p className="text-[10px] text-slate-400 font-mono">
                      Resolusi Asli: {imgDimensions.w} x {imgDimensions.h} px
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setCropIndex(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewport Modes Bar */}
            <div className="bg-slate-950/80 px-3 py-2 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 shrink-0">
              <span className="text-slate-400 font-semibold text-[11px]">Mode Tampilan Foto:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setFitMode('contain'); setCropZoom(1); setCropPanX(0); setCropPanY(0); }}
                  className={`min-h-[36px] px-3 py-1 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    fitMode === 'contain' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Maximize2 className="w-3 h-3 text-amber-300" />
                  <span>Foto Utuh (Contain)</span>
                </button>

                <button
                  onClick={() => { setFitMode('cover'); setCropZoom(1); setCropPanX(0); setCropPanY(0); }}
                  className={`min-h-[36px] px-3 py-1 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    fitMode === 'cover' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Crop className="w-3 h-3 text-amber-300" />
                  <span>Penuh Frame (Cover)</span>
                </button>
              </div>
            </div>

            {/* Canvas Interactive Viewport */}
            <div className="p-3 sm:p-5 flex flex-col items-center justify-center bg-slate-950/70 relative overflow-hidden flex-1 min-h-[250px]">
              <div className="text-[10px] sm:text-[11px] text-amber-300 mb-2 flex items-center gap-1.5 font-bold bg-slate-900/90 px-3 py-1 rounded-full border border-amber-500/30 shadow-md">
                <Move className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                <span>Geser (Drag) foto untuk atur fokus wajah</span>
              </div>

              {/* Crop Frame Box */}
              <div 
                className="relative overflow-hidden rounded-2xl border-4 border-indigo-500/90 shadow-2xl cursor-grab active:cursor-grabbing bg-slate-950 flex items-center justify-center touch-none my-auto"
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
                  maxWidth: gridStyle === '2x2' || gridStyle === 'polaroid' ? '300px' : '360px', 
                  aspectRatio: gridStyle === '2x2' || gridStyle === 'polaroid' ? '1/1' : '4/3' 
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
            <div className="p-3 sm:p-5 space-y-3 border-t border-slate-800 text-xs shrink-0 bg-slate-900">
              {/* Zoom Slider */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-300 text-[11px]">
                  <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5 text-indigo-400" /> Zoom Scale:</span>
                  <span className="text-amber-300 font-extrabold">{Math.round(cropZoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCropZoom(prev => Math.max(0.3, prev - 0.1))}
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center cursor-pointer active:scale-95"
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
                    className="flex-1 h-3 accent-indigo-500 cursor-pointer"
                  />
                  <button
                    onClick={() => setCropZoom(prev => Math.min(3.0, prev + 0.1))}
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center cursor-pointer active:scale-95"
                    title="Perbesar Zoom"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sliders Posisi X & Y */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-300 text-[10px]">
                    <span className="flex items-center gap-1"><ArrowLeftRight className="w-3 h-3 text-indigo-400" /> Posisi Kiri-Kanan (X):</span>
                    <span>{Math.round(cropPanX)} px</span>
                  </div>
                  <input
                    type="range"
                    min="-400"
                    max="400"
                    step="1"
                    value={cropPanX}
                    onChange={(e) => setCropPanX(parseFloat(e.target.value))}
                    className="w-full h-3 accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-300 text-[10px]">
                    <span className="flex items-center gap-1"><ArrowUpDown className="w-3 h-3 text-indigo-400" /> Posisi Atas-Bawah (Y):</span>
                    <span>{Math.round(cropPanY)} px</span>
                  </div>
                  <input
                    type="range"
                    min="-400"
                    max="400"
                    step="1"
                    value={cropPanY}
                    onChange={(e) => setCropPanY(parseFloat(e.target.value))}
                    className="w-full h-3 accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Rotation & Quick Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCropRotation(prev => (prev + 90) % 360)}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer text-[11px] active:scale-95"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Putar 90°</span>
                  </button>

                  <button
                    onClick={() => {
                      setFitMode('contain');
                      setCropZoom(1);
                      setCropPanX(0);
                      setCropPanY(0);
                    }}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-indigo-950 text-indigo-200 border border-indigo-700/60 font-bold flex items-center gap-1 cursor-pointer text-[11px] active:scale-95"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
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
                  className="min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 font-semibold flex items-center gap-1 cursor-pointer text-[11px] active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3.5 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setCropIndex(null)}
                className="min-h-[42px] px-4 py-2 rounded-xl font-bold text-slate-400 hover:text-white cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveCrop}
                className="min-h-[42px] px-5 py-2.5 rounded-xl font-extrabold bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white shadow-md flex items-center gap-2 cursor-pointer active:scale-95 transition-all text-xs"
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
