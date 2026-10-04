import React from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Heart, 
  Award, 
  Camera, 
  BookOpen, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';

import { useMobileBackButton } from '../hooks/useMobileBackButton';
import studioConfig from '../data/studioConfig.json';

interface MilestoneItem {
  id?: string;
  icon?: string;
  title: string;
  badge?: string;
  badgeStyle?: 'green' | 'dark' | 'amber' | string;
  description: string;
}

interface ValueItem {
  id?: string;
  icon?: string;
  title: string;
  description: string;
}

interface AlvieroHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreStudios?: () => void;
}

export const AlvieroHistoryModal: React.FC<AlvieroHistoryModalProps> = ({
  isOpen,
  onClose,
  onExploreStudios
}) => {
  // Dukungan tombol Back fisik / Swipe Back HP (Native PWA Experience)
  useMobileBackButton(isOpen, onClose, 'alviero-history');

  if (!isOpen) return null;

  const history = (studioConfig as any).history || {};

  const header = history.header || {
    tag: 'Dokumentasi Resmi Alviero Studio',
    title: 'Sejarah & Perjalanan Alviero Studio'
  };

  const prologue = history.prologue || {
    badge: 'Awal Mula Pendirian',
    title: 'Dedikasi Mengabadikan Setiap Detik Berharga Tanpa Batas Rasa Kaku',
    paragraph1: 'Alviero Studio Foto didirikan atas dasar kecintaan mendalam terhadap seni visual fotografi serta tekad untuk menghadirkan ruang studio yang hangat, ramah, dan bebas dari rasa canggung bagi siapa saja. Berangkat dari keresahan masyarakat bahwa sesi foto studio kerap kali terkesan kaku, mahal, dan penuh batasan, Alviero Studio hadir membawa konsep segar: "Kenyamanan maksimal, pelayanan bersahabat, dan kualitas visual setara majalah terkemuka."',
    paragraph2: 'Sejak hari pertama berdiri di Malang, komitmen Alviero Studio tetap teguh: memberikan seluruh file asli tanpa biaya tambahan, mengutamakan pengarahan pose yang sabar dan natural, serta menyediakan tata cahaya berstandar profesional yang menonjolkan kecantikan asli setiap klien.'
  };

  const milestonesSectionTitle = history.milestonesSectionTitle || 'Tonggak Perjalanan Alviero Studio';
  const milestones: MilestoneItem[] = history.milestones || [
    {
      id: 'milestone-1',
      icon: 'pin',
      title: 'Lahirnya Alviero Studio 1 — Junrejo',
      badge: 'Cabang Pertama (Pusat)',
      badgeStyle: 'green',
      description: 'Dibuka di kawasan sejuk Junrejo. Hadir dengan fasilitas ikonik Limbo Putih Seamless (Infinity Curve) tanpa batas sudut lantai, pencahayaan softbox besar berdifuser ganda, dan ruangan berdaya tampung luas yang menjadi favorit wisudawan serta keluarga besar di Malang Raya.'
    },
    {
      id: 'milestone-2',
      icon: 'sparkles',
      title: 'Ekspansi Alviero Studio 2 — Dinoyo (Gajayana)',
      badge: 'Cabang Kedua (Pusat Kota)',
      badgeStyle: 'dark',
      description: 'Merespons antusiasme ribuan mahasiswa dan keluarga muda di pusat Kota Malang, Alviero Studio membuka cabang kedua di Ruko Gajayana Dinoyo. Menghadirkan teknologi modern Self Studio Nirkabel mandiri tanpa rasa canggung, spotlight pencahayaan warna warni (RGB), serta dekorasi tematik cream yang homey dan berkarakter.'
    },
    {
      id: 'milestone-3',
      icon: 'award',
      title: 'Lebih dari 10.000++ Momen Berharga Terabadikan',
      badge: 'Kepercayaan Pelanggan',
      badgeStyle: 'amber',
      description: 'Mulai dari wisuda sarjana, pernikahan & prewedding romantis, momen kehamilan ibu (maternity), ulang tahun ceria, hingga potret kebersamaan keluarga dan sahabat. Alviero Studio terus bertumbuh sebagai studio foto terpercaya dengan rating ulasan bintang 5 di Google Maps.'
    }
  ];

  const valuesSectionTitle = history.valuesSectionTitle || 'Visi, Misi & Nilai Luhur Pelayanan Alviero Studio';
  const values: ValueItem[] = history.values || [
    {
      id: 'value-1',
      icon: 'heart',
      title: 'Keramahan Tulus',
      description: 'Fotografer dan staf yang sabar, hangat, serta siap membimbing pose hingga klien merasa percaya diri.'
    },
    {
      id: 'value-2',
      icon: 'shield',
      title: 'Transparan & Jujur',
      description: 'Tidak ada biaya tersembunyi. Seluruh file asli beresolusi penuh dibagikan langsung via Google Drive.'
    },
    {
      id: 'value-3',
      icon: 'star',
      title: 'Kualitas Abadi',
      description: 'Pencahayaan presisi dan kalibrasi warna tajam untuk hasil cetak bingkai yang awet dinikmati puluhan tahun.'
    }
  ];

  const quote = history.quote || {
    text: '"Bagi kami, setiap jepretan bukan sekadar gambar, melainkan prasasti kenangan indah yang akan Anda tersenyumi kembali di masa depan."',
    author: '— Tim Manajemen Alviero Studio Foto Malang'
  };

  const operationalHoursText = studioConfig.operationalHours 
    ? `Buka setiap hari: ${studioConfig.operationalHours} di Junrejo & Dinoyo`
    : 'Buka setiap hari: 08:00 - 21:00 WIB di Junrejo & Dinoyo';

  
  const renderFormattedText = (text?: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={index} className="font-bold text-[#2A2A2A]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <strong key={index} className="font-bold text-[#2A2A2A]">
            {part.slice(1, -1)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderMilestoneIcon = (icon?: string) => {
    switch (icon) {
      case 'sparkles':
        return <Sparkles className="w-4 h-4 stroke-[2]" />;
      case 'award':
        return <Award className="w-4 h-4 stroke-[2]" />;
      case 'camera':
        return <Camera className="w-4 h-4 stroke-[2]" />;
      case 'users':
        return <Users className="w-4 h-4 stroke-[2]" />;
      case 'pin':
      default:
        return <MapPin className="w-4 h-4 stroke-[2]" />;
    }
  };

  const getMilestoneIconContainerStyle = (icon?: string) => {
    if (icon === 'sparkles') {
      return 'bg-[#3A3A3A] text-[#A9BCA7] border-2 border-white';
    }
    if (icon === 'award') {
      return 'bg-[#FAF8F5] text-[#5C725A] border-2 border-[#E8DDD6]';
    }
    return 'bg-[#5C725A] text-white border-2 border-white';
  };

  const getMilestoneBadgeStyle = (badgeStyle?: string) => {
    if (badgeStyle === 'dark') {
      return 'text-[#3A3A3A] bg-[#F2E9E4] border-[#E8DDD6]';
    }
    if (badgeStyle === 'amber') {
      return 'text-amber-700 bg-amber-50 border-amber-200';
    }
    return 'text-[#5C725A] bg-[#EFF6EE] border-[#C8DBC5]';
  };

  const renderValueIcon = (icon?: string, index: number = 0) => {
    const effectiveIcon = icon || (index === 0 ? 'heart' : index === 1 ? 'shield' : 'star');
    switch (effectiveIcon) {
      case 'shield':
        return <ShieldCheck className="w-4 h-4" />;
      case 'star':
        return <Star className="w-4 h-4" />;
      case 'heart':
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#FDFBF7] rounded-3xl border border-[#E8DDD6] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Luxury Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#A9BCA7] via-[#6E856C] to-[#3A3A3A]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-7 border-b border-[#E8DDD6] bg-white flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FAF8F5] border border-[#E8DDD6] flex items-center justify-center shrink-0 shadow-2xs">
              <Camera className="w-5 h-5 text-[#5C725A]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest text-[#5C725A] uppercase">
                <Sparkles className="w-3 h-3 text-[#5C725A]" />
                <span>{header.tag}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-serif font-black text-[#3A3A3A] tracking-wide uppercase">
                {header.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup Jendela Sejarah"
            className="w-9 h-9 rounded-full bg-[#FAF8F5] hover:bg-[#3A3A3A] text-stone-600 hover:text-white border border-[#E8DDD6] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-7 sm:space-y-9 flex-1 bg-[#FDFBF7]">
          
          {/* 1. Prologue / Filosofi Pendirian */}
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#E8DDD6] shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF8F5] rounded-bl-full pointer-events-none -mr-8 -mt-8 opacity-60" />
            
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C725A] bg-[#EFF6EE] px-2.5 py-1 rounded-full border border-[#C8DBC5]">
              <BookOpen className="w-3 h-3 text-[#5C725A]" />
              <span>{prologue.badge}</span>
            </div>

            <h3 className="text-base sm:text-xl font-serif font-bold text-[#3A3A3A] leading-snug">
              {prologue.title}
            </h3>

            {prologue.paragraph1 && (
              <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed text-justify">
                {renderFormattedText(prologue.paragraph1)}
              </p>
            )}

            {prologue.paragraph2 && (
              <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed text-justify">
                {renderFormattedText(prologue.paragraph2)}
              </p>
            )}
          </div>

          {/* 2. Tonggak Perjalanan / Milestones */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5C725A]" />
              <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] uppercase tracking-wider">
                {milestonesSectionTitle}
              </h4>
            </div>

            <div className="relative pl-4 sm:pl-6 space-y-6 before:absolute before:left-8 sm:before:left-11 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E8DDD6]">
              {milestones.map((m, idx) => (
                <div key={m.id || idx} className="relative flex items-start gap-4 sm:gap-5 pl-1">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 ${getMilestoneIconContainerStyle(m.icon)}`}>
                    {renderMilestoneIcon(m.icon)}
                  </div>
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DDD6] shadow-xs flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="text-xs font-serif font-bold text-[#3A3A3A] uppercase tracking-wide">
                        {m.title}
                      </span>
                      {m.badge && (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getMilestoneBadgeStyle(m.badgeStyle)}`}>
                          {m.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 font-sans leading-relaxed">
                      {renderFormattedText(m.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Visi, Misi & Nilai Luhur Pelayanan (Dynamic Values / C.R.E.A.T.E.) */}
          {(() => {
            const visiItem = values.find(v => v.title.toLowerCase().includes('visi')) || (values.length >= 2 ? values[0] : null);
            const misiItem = values.find(v => v.title.toLowerCase().includes('misi')) || (values.length >= 2 ? values[1] : null);
            const createItem = values.find(v => 
              v.id === 'value-3' || 
              v.title.toLowerCase().includes('create') || 
              v.title.toLowerCase().includes('nilai luhur') || 
              v.description.toLowerCase().includes('create')
            ) || (values.length >= 3 ? values[2] : null);

            const isSpecialVisiMisiCreate = !!(
              visiItem && misiItem && createItem && 
              (createItem.description.toLowerCase().includes('create') || createItem.description.includes('*C -') || createItem.description.includes('C - '))
            );

            const parseCreatePoints = (text?: string) => {
              if (!text) return [];
              const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
              const points: { letter: string; title: string; desc: string }[] = [];
              
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const match = line.replace(/^\*+|\*+$/g, '').match(/^([A-Za-z])\s*[-–]\s*(.+)$/);
                if (match) {
                  const letter = match[1].toUpperCase();
                  const title = match[2].trim();
                  const nextLine = (i + 1 < lines.length && !lines[i + 1].startsWith('*') && !lines[i + 1].match(/^[A-Za-z]\s*[-–]/))
                    ? lines[i + 1].replace(/^\*+|\*+$/g, '').trim()
                    : '';
                  points.push({ letter, title, desc: nextLine });
                }
              }
              return points;
            };

            if (isSpecialVisiMisiCreate && visiItem && misiItem && createItem) {
              const createPoints = parseCreatePoints(createItem.description);
              return (
                <div className="bg-[#FAF8F5] p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#E8DDD6] space-y-4 sm:space-y-5">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#5C725A] uppercase bg-[#EFF6EE] px-3 py-1 rounded-full border border-[#D5E6D3] inline-flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#5C725A]" />
                      KOMITMEN &amp; NILAI UTAMA
                    </span>
                    <h4 className="font-serif font-black text-sm sm:text-base text-[#2A2A2A] uppercase tracking-wider">
                      {valuesSectionTitle}
                    </h4>
                  </div>

                  {/* Visi & Misi Cards - Balanced 2 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 items-stretch">
                    {/* Visi */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DDD6] shadow-2xs space-y-2.5 flex flex-col justify-start">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-[#EFF6EE] text-[#5C725A] border border-[#D5E6D3] flex items-center justify-center shrink-0 shadow-2xs">
                          <Heart className="w-4 h-4 fill-[#5C725A]/20" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#5C725A] uppercase tracking-wider bg-[#EFF6EE] px-2.5 py-0.5 rounded-full border border-[#D5E6D3]">
                          Arah &amp; Tujuan
                        </span>
                      </div>
                      <h5 className="font-serif font-bold text-base sm:text-lg text-[#2A2A2A] tracking-tight">
                        {visiItem.title}
                      </h5>
                      <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed text-justify">
                        {renderFormattedText(visiItem.description)}
                      </p>
                    </div>

                    {/* Misi */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DDD6] shadow-2xs space-y-2.5 flex flex-col justify-start">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF0E6] text-[#8A5A36] border border-[#EAD5C3] flex items-center justify-center shrink-0 shadow-2xs">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#8A5A36] uppercase tracking-wider bg-[#FAF0E6] px-2.5 py-0.5 rounded-full border border-[#EAD5C3]">
                          Komitmen Layanan
                        </span>
                      </div>
                      <h5 className="font-serif font-bold text-base sm:text-lg text-[#2A2A2A] tracking-tight">
                        {misiItem.title}
                      </h5>
                      <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed text-justify">
                        {renderFormattedText(misiItem.description)}
                      </p>
                    </div>
                  </div>

                  {/* Core Values: C.R.E.A.T.E. Breakdown */}
                  <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8DDD6] shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2E9E4] pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#2A2A2A] text-[#A9BCA7] flex items-center justify-center shrink-0 shadow-2xs">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-serif font-bold text-sm sm:text-base text-[#2A2A2A] tracking-tight">
                            {createItem.title}
                          </h5>
                          <p className="text-[11px] text-stone-500 font-sans italic">
                            The Values behind every moment we capture
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#5C725A] uppercase tracking-widest bg-[#EFF6EE] px-2.5 py-1 rounded-full border border-[#D5E6D3] self-start sm:self-auto">
                        6 Pilar Utama
                      </span>
                    </div>

                    {createPoints.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                        {createPoints.map((pt, pIdx) => {
                          const isSage = pIdx % 2 === 0;
                          return (
                            <div 
                              key={pIdx} 
                              className="bg-[#FAF8F5] border border-[#EFE5DC] rounded-xl p-3 sm:p-3.5 space-y-1.5 hover:border-[#A9BCA7] hover:bg-white transition-all shadow-2xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded-md font-serif font-black text-xs flex items-center justify-center shadow-2xs ${
                                  isSage 
                                    ? 'bg-[#EFF6EE] text-[#5C725A] border border-[#D5E6D3]' 
                                    : 'bg-[#FAF0E6] text-[#8A5A36] border border-[#EAD5C3]'
                                }`}>
                                  {pt.letter}
                                </span>
                                <span className="font-serif font-bold text-xs sm:text-sm text-[#2A2A2A] tracking-tight">
                                  {pt.title}
                                </span>
                              </div>
                              {pt.desc && (
                                <p className="text-[11px] text-stone-600 font-sans leading-relaxed pl-8">
                                  {pt.desc}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-stone-600 font-sans leading-relaxed whitespace-pre-line">
                        {renderFormattedText(createItem.description)}
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E8DDD6] space-y-3.5">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] uppercase tracking-wider text-center">
                  {valuesSectionTitle}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                  {values.map((v, vIdx) => (
                    <div key={v.id || vIdx} className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E8DDD6] space-y-2 text-center flex flex-col shadow-2xs">
                      <div className="w-8 h-8 mx-auto rounded-lg bg-[#EFF6EE] text-[#5C725A] flex items-center justify-center shrink-0">
                        {renderValueIcon(v.icon, vIdx)}
                      </div>
                      <h5 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] tracking-wide">{v.title}</h5>
                      <div className="text-[11px] text-stone-600 font-sans leading-relaxed whitespace-pre-line text-left">
                        {renderFormattedText(v.description)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* 4. Kutipan Penutup */}
          {quote.text && (
            <div className="text-center space-y-1 py-1">
              <p className="font-serif italic text-xs sm:text-sm text-stone-600">
                {renderFormattedText(quote.text)}
              </p>
              {quote.author && (
                <p className="text-[11px] font-mono font-bold text-[#5C725A] uppercase tracking-widest">
                  {quote.author}
                </p>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8DDD6] flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20">
          <div className="text-xs text-stone-500 font-sans hidden sm:block">
            {operationalHoursText}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-[#E8DDD6] bg-[#FAF8F5] hover:bg-[#F2E9E4] text-[#3A3A3A] font-serif text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer active:scale-95"
            >
              Tutup
            </button>

            {onExploreStudios && (
              <button
                onClick={() => {
                  onClose();
                  onExploreStudios();
                }}
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-[#3A3A3A] hover:bg-[#2A2A2A] text-white font-serif text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <span>Pilih Studio &amp; Paket</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A9BCA7]" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
