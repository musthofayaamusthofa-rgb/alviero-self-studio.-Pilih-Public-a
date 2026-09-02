import React, { useState } from 'react';
import { BACKDROPS, FRAME_TEMPLATES } from '../data/pricelistData';
import { playShutterSound } from '../utils/shutterSound';
import { Sliders, Sparkles, Layers, Check, ArrowRight, Eye, RefreshCw, Camera, Volume2, Wand2 } from 'lucide-react';

interface FrameAndLightingVisualizerProps {
  onSelectOptionForBooking: (backdropId: string, frameId: string) => void;
}

export const FrameAndLightingVisualizer: React.FC<FrameAndLightingVisualizerProps> = ({ onSelectOptionForBooking }) => {
  const [selectedBackdrop, setSelectedBackdrop] = useState(BACKDROPS[0]);
  const [selectedFrame, setSelectedFrame] = useState(FRAME_TEMPLATES[0]);
  const [frameBgColor, setFrameBgColor] = useState<string>('#FFFFFF');
  const [samplePoseIndex, setSamplePoseIndex] = useState<number>(0);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [spotlightRadius, setSpotlightRadius] = useState<number>(70); // 50 to 100%
  const [selectedProp, setSelectedProp] = useState<string>('none'); // 'none', 'glasses', 'crown', 'grad', 'flowers'
  const [activeFilter, setActiveFilter] = useState<string>('none'); // 'none', 'grayscale', 'sepia', 'vivid'

  const samplePoses = [
    {
      title: 'Pose Couple / Bestie',
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      ]
    },
    {
      title: 'Pose Solo Aesthetic',
      photos: [
        'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80'
      ]
    }
  ];

  const frameColors = [
    { name: 'Putih Studio', hex: '#FFFFFF' },
    { name: 'Hitam Y2K', hex: '#0F172A' },
    { name: 'Pastel Pink', hex: '#FCE7F3' },
    { name: 'Soft Purple', hex: '#EDE9FE' },
    { name: 'Butter Yellow', hex: '#FEF9C3' }
  ];

  const currentSample = samplePoses[samplePoseIndex];

  const handleSnapPhoto = () => {
    playShutterSound();
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
    }, 250);
  };

  return (
    <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-[#EBF2EA] text-[#6E856C] text-xs font-bold px-3 py-1 rounded-full border border-[#A9BCA7]">
          <Sliders className="w-3.5 h-3.5 text-[#6E856C]" />
          <span>Interactive Studio Preview Simulator</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#3A3A3A] tracking-tight font-serif">
          Simulator Spotlight & Frame Grid
        </h2>
        <p className="text-xs sm:text-sm text-stone-600">
          Uji coba kombinasi efek cahaya sorot (spotlight) dan pilihan desain bingkai photo strip sebelum kamu memesan.
        </p>
      </div>

      {/* Main Visualizer Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Control Panel (Options) */}
        <div className="lg:col-span-5 space-y-5 bg-white p-5 sm:p-6 rounded-3xl border border-[#E8DDD6] shadow-xs">
          {/* 1. Select Lighting Backdrop */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6E856C]" />
                1. Pilih Pencahayaan & Background:
              </label>
              <span className="text-[11px] font-semibold text-[#6E856C] bg-[#EBF2EA] border border-[#A9BCA7] px-2 py-0.5 rounded-md">
                {selectedBackdrop.name}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {BACKDROPS.filter(b => b.applicableTo?.includes('self-studio')).map((bd) => (
                <button
                  key={bd.id}
                  onClick={() => setSelectedBackdrop(bd)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    selectedBackdrop.id === bd.id
                      ? 'border-[#6E856C] bg-[#EBF2EA] ring-2 ring-[#A9BCA7]/30 shadow-xs'
                      : 'border-[#E8DDD6] hover:bg-[#FDFBF7]'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-xl border border-black/10 shrink-0 shadow-inner flex items-center justify-center"
                    style={{
                      background: bd.secondaryHex 
                        ? `linear-gradient(135deg, ${bd.hex}, ${bd.secondaryHex})`
                        : bd.hex
                    }}
                  >
                    {selectedBackdrop.id === bd.id && (
                      <Check className={`w-4 h-4 ${bd.hex === '#F8FAFC' || bd.hex === '#E5D9C5' ? 'text-slate-900' : 'text-white'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-[#3A3A3A] truncate">{bd.name}</div>
                    <div className="text-[10px] text-stone-500 truncate">{bd.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Spotlight Radius Slider */}
            <div className="pt-1">
              <div className="flex justify-between text-[11px] font-bold text-stone-600 mb-1">
                <span>Ukuran Lingkaran Spotlight:</span>
                <span>{spotlightRadius}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={spotlightRadius}
                onChange={(e) => setSpotlightRadius(Number(e.target.value))}
                className="w-full accent-[#6E856C] h-1.5 bg-[#E8DDD6] rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* 2. Select Frame Grid Template */}
          <div className="space-y-3 pt-2 border-t border-[#E8DDD6]">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#6E856C]" />
                2. Pilih Grid & Template Cetak:
              </label>
              <span className="text-[11px] font-semibold text-[#6E856C] bg-[#EBF2EA] border border-[#A9BCA7] px-2 py-0.5 rounded-md">
                {selectedFrame.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {FRAME_TEMPLATES.map((ft) => (
                <button
                  key={ft.id}
                  onClick={() => setSelectedFrame(ft)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1 cursor-pointer ${
                    selectedFrame.id === ft.id
                      ? 'border-[#3A3A3A] bg-[#3A3A3A] text-white ring-2 ring-[#A9BCA7]/40 shadow-xs'
                      : 'border-[#E8DDD6] hover:bg-[#FDFBF7] text-[#3A3A3A]'
                  }`}
                >
                  <div className={`font-bold text-xs ${selectedFrame.id === ft.id ? 'text-white' : 'text-[#3A3A3A]'}`}>{ft.name}</div>
                  <div className={`text-[10px] ${selectedFrame.id === ft.id ? 'text-stone-300' : 'text-stone-500'}`}>{ft.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Filter & Props Options */}
          <div className="space-y-3 pt-2 border-t border-[#E8DDD6]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#3A3A3A] flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-[#6E856C]" />
              3. Tambah Filter & Aksesoris Foto:
            </label>
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              {[
                { id: 'none', label: 'Normal' },
                { id: 'vivid', label: '✨ Vivid' },
                { id: 'sepia', label: '📜 Warm' },
                { id: 'grayscale', label: '🖤 B&W' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                    activeFilter === f.id ? 'bg-[#3A3A3A] text-white' : 'bg-[#FDFBF7] border border-[#E8DDD6] text-[#3A3A3A]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Props selector */}
            <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
              {[
                { id: 'none', label: 'Tanpa Properti' },
                { id: 'glasses', label: '🕶️ Kacamata' },
                { id: 'crown', label: '👑 Mahkota' },
                { id: 'grad', label: '🎓 Toga' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProp(p.id)}
                  className={`p-1.5 rounded-xl border text-center transition-all ${
                    selectedProp === p.id ? 'border-[#6E856C] bg-[#EBF2EA] text-[#6E856C]' : 'border-[#E8DDD6] text-stone-600 hover:bg-[#FDFBF7]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Frame Background Color */}
          <div className="space-y-2 pt-2 border-t border-[#E8DDD6]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#3A3A3A]">
              4. Warna Kertas Bingkai Strip:
            </label>
            <div className="flex items-center gap-2">
              {frameColors.map((fc) => (
                <button
                  key={fc.hex}
                  onClick={() => setFrameBgColor(fc.hex)}
                  title={fc.name}
                  className={`w-8 h-8 rounded-full border border-stone-300 shadow-xs transition-transform cursor-pointer ${
                    frameBgColor === fc.hex ? 'ring-2 ring-[#6E856C] scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: fc.hex }}
                />
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-3">
            <button
              onClick={() => onSelectOptionForBooking(selectedBackdrop.id, selectedFrame.id)}
              className="w-full bg-[#6E856C] hover:bg-[#5C725A] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Gunakan Kombinasi Ini & Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Live Preview Canvas */}
        <div className="lg:col-span-7 bg-[#2A2A2A] rounded-3xl p-5 sm:p-8 border border-[#3A3A3A] text-white flex flex-col items-center justify-center min-h-[520px] relative shadow-2xl overflow-hidden">
          {/* Camera Flash Screen Effect */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-50 animate-pulse pointer-events-none" />
          )}

          {/* Backdrop Glow Effect Simulation */}
          <div 
            className="absolute inset-0 opacity-40 transition-all duration-700 pointer-events-none"
            style={{
              background: selectedBackdrop.secondaryHex
                ? `radial-gradient(circle at center, ${selectedBackdrop.hex} 0%, ${selectedBackdrop.secondaryHex} ${spotlightRadius}%, transparent 100%)`
                : `radial-gradient(circle at center, ${selectedBackdrop.hex} 0%, transparent ${spotlightRadius}%)`
            }}
          />

          {/* Header Controls inside preview */}
          <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">Pratinjau Studio Alviero</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSnapPhoto}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>SNAP (Remote Shutter)</span>
                <Volume2 className="w-3 h-3 text-rose-200" />
              </button>

              <button
                onClick={() => setSamplePoseIndex((samplePoseIndex + 1) % samplePoses.length)}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Ganti Pose</span>
              </button>
            </div>
          </div>

          {/* Live Photo Strip Container */}
          <div className="relative z-10 my-2 transition-all duration-300">
            <div 
              className="p-4 rounded-2xl shadow-2xl transition-all duration-300 border border-slate-300/30 text-slate-900 max-w-[280px] sm:max-w-[320px] mx-auto space-y-3"
              style={{ backgroundColor: frameBgColor }}
            >
              {/* Top Studio Brand Header inside Frame */}
              <div className="text-center border-b border-slate-200 pb-2">
                <div className="font-black tracking-widest text-xs uppercase text-slate-900">
                  ALVIERO
                </div>
                <div className="text-[9px] font-semibold text-slate-500 tracking-wider">
                  SELF PHOTO STUDIO • {selectedBackdrop.name.toUpperCase()}
                </div>
              </div>

              {/* Photo Grids depending on selected frame */}
              {selectedFrame.gridType === '4-cut' && (
                <div className="grid grid-cols-1 gap-2">
                  {currentSample.photos.slice(0, 4).map((img, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-800 border border-black/10 shadow-inner">
                      <img 
                        src={img} 
                        alt="Pose" 
                        className={`w-full h-full object-cover ${
                          activeFilter === 'grayscale' ? 'grayscale' :
                          activeFilter === 'sepia' ? 'sepia' :
                          activeFilter === 'vivid' ? 'saturate-150 contrast-110' : ''
                        }`} 
                      />
                      {/* Simulated Spotlight Overlay filter */}
                      <div 
                        className="absolute inset-0 mix-blend-color-dodge opacity-30 pointer-events-none"
                        style={{ backgroundColor: selectedBackdrop.hex }}
                      />
                      {/* Prop Overlay */}
                      {selectedProp === 'glasses' && i === 0 && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl select-none">🕶️</div>
                      )}
                      {selectedProp === 'crown' && i === 0 && (
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-2xl select-none">👑</div>
                      )}
                      {selectedProp === 'grad' && i === 0 && (
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-2xl select-none">🎓</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedFrame.gridType === '6-cut' && (
                <div className="grid grid-cols-2 gap-2">
                  {currentSample.photos.concat(currentSample.photos).slice(0, 6).map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-800 border border-black/10 shadow-inner">
                      <img 
                        src={img} 
                        alt="Pose" 
                        className={`w-full h-full object-cover ${
                          activeFilter === 'grayscale' ? 'grayscale' :
                          activeFilter === 'sepia' ? 'sepia' :
                          activeFilter === 'vivid' ? 'saturate-150 contrast-110' : ''
                        }`} 
                      />
                      <div 
                        className="absolute inset-0 mix-blend-color-dodge opacity-30 pointer-events-none"
                        style={{ backgroundColor: selectedBackdrop.hex }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {selectedFrame.gridType === 'wide-angle' && (
                <div className="space-y-2">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-800 border border-black/10 shadow-inner">
                    <img 
                      src={currentSample.photos[0]} 
                      alt="Pose Wide" 
                      className={`w-full h-full object-cover scale-105 ${
                        activeFilter === 'grayscale' ? 'grayscale' :
                        activeFilter === 'sepia' ? 'sepia' : ''
                      }`} 
                    />
                    <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-800">
                      <img src={currentSample.photos[1]} alt="Pose" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-800">
                      <img src={currentSample.photos[2]} alt="Pose" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              )}

              {selectedFrame.gridType === 'polaroid' && (
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-800 border border-black/10 shadow-inner">
                    <img 
                      src={currentSample.photos[0]} 
                      alt="Polaroid Pose" 
                      className={`w-full h-full object-cover ${
                        activeFilter === 'grayscale' ? 'grayscale' :
                        activeFilter === 'sepia' ? 'sepia' : ''
                      }`} 
                    />
                    <div 
                      className="absolute inset-0 mix-blend-color-dodge opacity-30 pointer-events-none"
                      style={{ backgroundColor: selectedBackdrop.hex }}
                    />
                  </div>
                  <div className="text-center pt-1 font-mono text-[10px] text-slate-600 font-semibold italic">
                    "Memories at Alviero Studio ~ {new Date().toLocaleDateString('id-ID')}"
                  </div>
                </div>
              )}

              {/* Bottom Footer inside Strip */}
              <div className="pt-2 flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-200">
                <span>@alviero.selfstudio</span>
                <span className="font-bold text-slate-700">#SelfStudioVibe</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-center text-xs text-slate-400 mt-4">
            Klik tombol SNAP di atas untuk mendengar efek suara shutter remote studio.
          </div>
        </div>
      </div>
    </section>
  );
};
