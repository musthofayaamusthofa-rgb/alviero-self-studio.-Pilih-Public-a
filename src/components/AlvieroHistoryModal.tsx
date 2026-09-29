import React from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  MapPin, 
  Heart, 
  Award, 
  CheckCircle2, 
  Camera, 
  BookOpen, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';

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
  if (!isOpen) return null;

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
                <span>Dokumentasi Resmi Alviero Studio</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-serif font-black text-[#3A3A3A] tracking-wide uppercase">
                Sejarah &amp; Perjalanan Alviero Studio
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
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#A9BCA7]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-1.5 bg-[#FAF6F0] text-[#5C725A] text-[10.5px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#E8DDD6]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Awal Mula Pendirian</span>
            </div>

            <h3 className="font-serif font-bold text-base sm:text-xl text-[#3A3A3A] leading-snug">
              Dedikasi Mengabadikan Setiap Detik Berharga Tanpa Batas Rasa Kaku
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
              <strong>Alviero Studio Foto</strong> didirikan atas dasar kecintaan mendalam terhadap seni visual fotografi serta tekad untuk menghadirkan ruang studio yang hangat, ramah, dan bebas dari rasa canggung bagi siapa saja. Berangkat dari keresahan masyarakat bahwa sesi foto studio kerap kali terkesan kaku, mahal, dan penuh batasan, Alviero Studio hadir membawa konsep segar: <em>"Kenyamanan maksimal, pelayanan bersahabat, dan kualitas visual setara majalah terkemuka."</em>
            </p>

            <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
              Sejak hari pertama berdiri di Malang, komitmen Alviero Studio tetap teguh: <strong>memberikan seluruh file asli tanpa biaya tambahan</strong>, mengutamakan pengarahan pose yang sabar dan natural, serta menyediakan tata cahaya berstandar profesional yang menonjolkan kecantikan asli setiap klien.
            </p>
          </div>

          {/* 2. Timeline Perjalanan & Ekspansi Studio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5C725A]" />
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#3A3A3A] uppercase tracking-wider">
                Tonggak Perjalanan Alviero Studio
              </h3>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 sm:before:left-5 before:w-0.5 before:bg-[#E8DDD6]">
              
              {/* Milestone 1: Studio 1 Karangploso */}
              <div className="relative flex items-start gap-4 sm:gap-5 pl-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#5C725A] text-white flex items-center justify-center shrink-0 shadow-sm border-2 border-white z-10">
                  <MapPin className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DDD6] shadow-xs flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-xs font-serif font-bold text-[#3A3A3A] uppercase tracking-wide">
                      Lahirnya Alviero Studio 1 — Karangploso
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#5C725A] bg-[#EFF6EE] px-2 py-0.5 rounded-full border border-[#CCE0CB]">
                      Cabang Pertama (Pusat)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    Dibuka di kawasan sejuk Karangploso, Kabupaten Malang. Hadir dengan fasilitas ikonik <strong>Limbo Putih Seamless (Infinity Curve)</strong> tanpa batas sudut lantai, pencahayaan softbox besar berdifuser ganda, dan ruangan berdaya tampung luas yang menjadi favorit wisudawan serta keluarga besar di Malang Raya.
                  </p>
                </div>
              </div>

              {/* Milestone 2: Studio 2 Dinoyo */}
              <div className="relative flex items-start gap-4 sm:gap-5 pl-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3A3A3A] text-[#A9BCA7] flex items-center justify-center shrink-0 shadow-sm border-2 border-white z-10">
                  <Sparkles className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DDD6] shadow-xs flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-xs font-serif font-bold text-[#3A3A3A] uppercase tracking-wide">
                      Ekspansi Alviero Studio 2 — Dinoyo (Gajayana)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#3A3A3A] bg-[#F2E9E4] px-2 py-0.5 rounded-full border border-[#E8DDD6]">
                      Cabang Kedua (Pusat Kota)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    Merespons antusiasme ribuan mahasiswa dan keluarga muda di pusat Kota Malang, Alviero Studio membuka cabang kedua di <strong>Ruko Gajayana Dinoyo</strong>. Menghadirkan teknologi modern <strong>Self Studio Nirkabel</strong> mandiri tanpa rasa canggung, spotlight pencahayaan warna warni (RGB), serta dekorasi tematik cream yang homey dan berkarakter.
                  </p>
                </div>
              </div>

              {/* Milestone 3: Ribuan Klien Bahagia */}
              <div className="relative flex items-start gap-4 sm:gap-5 pl-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FAF8F5] text-[#5C725A] flex items-center justify-center shrink-0 shadow-sm border-2 border-[#E8DDD6] z-10">
                  <Award className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DDD6] shadow-xs flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-xs font-serif font-bold text-[#3A3A3A] uppercase tracking-wide">
                      Lebih dari 10.000++ Momen Berharga Terabadikan
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Kepercayaan Pelanggan
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    Mulai dari wisuda sarjana, pernikahan &amp; prewedding romantis, momen kehamilan ibu (maternity), ulang tahun ceria, hingga potret kebersamaan keluarga dan sahabat. Alviero Studio terus bertumbuh sebagai studio foto terpercaya dengan rating ulasan bintang 5 di Google Maps.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Tiga Pilar Filosofi Layanan Kami */}
          <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E8DDD6] space-y-3.5">
            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3A3A3A] uppercase tracking-wider text-center">
              Tiga Nilai Luhur Pelayanan Alviero Studio
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-[#E8DDD6] space-y-1.5 text-center">
                <div className="w-8 h-8 mx-auto rounded-lg bg-[#EFF6EE] text-[#5C725A] flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <h5 className="font-serif font-bold text-xs text-[#3A3A3A]">Keramahan Tulus</h5>
                <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                  Fotografer dan staf yang sabar, hangat, serta siap membimbing pose hingga klien merasa percaya diri.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E8DDD6] space-y-1.5 text-center">
                <div className="w-8 h-8 mx-auto rounded-lg bg-[#EFF6EE] text-[#5C725A] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h5 className="font-serif font-bold text-xs text-[#3A3A3A]">Transparan &amp; Jujur</h5>
                <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                  Tidak ada biaya tersembunyi. Seluruh file asli beresolusi penuh dibagikan langsung via Google Drive.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E8DDD6] space-y-1.5 text-center">
                <div className="w-8 h-8 mx-auto rounded-lg bg-[#EFF6EE] text-[#5C725A] flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
                <h5 className="font-serif font-bold text-xs text-[#3A3A3A]">Kualitas Abadi</h5>
                <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                  Pencahayaan presisi dan kalibrasi warna tajam untuk hasil cetak bingkai yang awet dinikmati puluhan tahun.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Kutipan Penutup */}
          <div className="text-center space-y-1 py-1">
            <p className="font-serif italic text-xs sm:text-sm text-stone-600">
              "Bagi kami, setiap jepretan bukan sekadar gambar, melainkan prasasti kenangan indah yang akan Anda tersenyumi kembali di masa depan."
            </p>
            <p className="text-[11px] font-mono font-bold text-[#5C725A] uppercase tracking-widest">
              — Tim Manajemen Alviero Studio Foto Malang
            </p>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8DDD6] flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20">
          <div className="text-xs text-stone-500 font-sans hidden sm:block">
            Buka setiap hari: <strong>08:00 - 21:00 WIB</strong> di Karangploso &amp; Dinoyo
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
