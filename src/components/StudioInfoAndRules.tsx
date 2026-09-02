import React, { useState } from 'react';
import { StudioBranch } from '../types';
import { STUDIO_RULES, STUDIO_DISCLAIMER, REVIEWS, STUDIO_BRANCHES } from '../data/pricelistData';
import {
  MapPin, Clock, ShieldCheck, Star, Camera, Heart, Instagram,
  MessageCircle, Navigation, Award, Copy, Check, ChevronDown, ChevronUp,
  HelpCircle, AlertCircle, FileText, Calendar, CreditCard, Sparkles, Image as ImageIcon
} from 'lucide-react';

interface StudioInfoAndRulesProps {
  selectedBranch?: StudioBranch;
}

export const StudioInfoAndRules: React.FC<StudioInfoAndRulesProps> = ({
  selectedBranch = 'cabang-1'
}) => {
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const currentBranchInfo = STUDIO_BRANCHES.find(b => b.id === selectedBranch) || STUDIO_BRANCHES[0];
  const addressText = currentBranchInfo.address;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressText);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const faqs = [
    {
      q: 'Berapa lama proses pengerjaan edit foto dan cetak?',
      a: 'Proses file edit maksimal 7 hari dan cetaknya 5 hari (kecuali pass foto yang bisa langsung jadi kilat) dihitung sejak Anda memilih foto di link drive.'
    },
    {
      q: 'Bagaimana jika saya terlambat datang ke studio?',
      a: 'Apabila studio tidak ramai, Anda boleh mengajukan jam kosong tanpa pengurangan menit. Namun jika jadwal penuh, keterlambatan dihitung dari 5 menit pertama dan dialihkan ke sesi berikutnya.'
    },
    {
      q: 'Berapa DP untuk booking jadwal foto?',
      a: 'DP minimal 50% dari total harga paket. Pelunasan dapat diselesaikan sebelum atau setelah sesi foto di studio melalui Cash atau Transfer.'
    },
    {
      q: 'Apakah bisa request foto di luar jam operasional?',
      a: 'Bisa! Jam operasional normal adalah setiap hari 08:00 - 21:00. Request di luar jam operasional dikenakan charge 35K (kecuali wisuda outdoor tanpa biaya charge).'
    },
    {
      q: 'Apakah saya bisa membawa binatang peliharaan (Pet-friendly)?',
      a: 'Bisa! Alviero Studio menyambut binatang peliharaan kucing/anjing kecil selama membawa alas pampers/kandang saat masuk studio.'
    },
    {
      q: 'Apakah soft file foto asli resolusi tinggi diberikan gratis?',
      a: 'Ya! Seluruh file asli Google Drive akan dikirim di hari yang sama dan maksimal H+1 apabila kondisi studio sedang ramai.'
    }
  ];

  return (
    <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      
      {/* ==================================================================== */}
      {/* 1. OFFICIAL DISCLAIMER POSTER (100% Exact from User Uploaded Image) */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 relative overflow-hidden">
        {/* Subtle Decorative Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />

        {/* Title Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto pt-2">
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-red-600 tracking-wider uppercase">
            DISCLAIMER
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Ketentuan, Kebijakan Operasional & Tata Tertib Resmi Alviero Studio
          </p>
        </div>

        {/* Disclaimer Sections Grid */}
        <div className="space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed max-w-4xl mx-auto">
          
          {/* 1. Umum */}
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <h3 className="font-extrabold text-red-600 text-sm sm:text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
              <span>• Umum</span>
            </h3>
            <ol className="space-y-2 pl-4 list-decimal text-slate-700">
              <li>
                Jam operasional setiap hari 08:00 - 21:00, <span className="text-red-600 font-bold">bisa request diluar jam operasional</span> dengan ada charge 35K (kecuali wisuda outdoor tanpa biaya charge)
              </li>
              <li>
                Jika telat akan dikenakan biaya tambahan <span className="text-red-600 font-bold">Rp. 25.000</span> dan melebihi jam 21.00 akan dikenakan tambahan biaya sebesar <span className="text-red-600 font-bold">Rp. 35.000</span>
              </li>
              <li>
                Link allfile via googledrive akan dikirim di hari yang sama dan maksimal H+1 apabila kondisi studio ramai
              </li>
            </ol>
          </div>

          {/* 2. File Edit dan Cetak */}
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <h3 className="font-extrabold text-red-600 text-sm sm:text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
              <span>• File Edit dan Cetak</span>
            </h3>
            <ol className="space-y-2 pl-4 list-decimal text-slate-700">
              <li>
                Proses File edit maksimal 7 hari dan Cetaknya 5 hari (<span className="text-red-600 font-bold">Kecuali pass foto</span>) dihitung dari kakaknya pilih foto, apabila lebih cepat selesai langsung kami infokan kembali, apabila tidak bisa diambil bisa diganti dengan file edit yang akan dijelaskan ketika pengiriman link foto allfilenya
              </li>
              <li>
                File cetak diambil kembali di Studio, belum bisa request pengiriman dalam bentuk paket, untuk pengiriman via Grab, go send dan sejenisnya di perbolehkan dengan catatan yg memesan dari client
              </li>
              <li>
                Cetakan Foto maksimal 1 bulan untuk pengambilan, diatas 1 bulan kerusakan atau kehilangan cetakan diluar tanggung jawab studio
              </li>
              <li>
                Pilihan foto yg di edit dan di cetak maksimal 1 bulan, diatas 1 bulan sudah tidak bisa di proses
              </li>
              <li>
                File yang diedit sebatas pembersihan dibagian background dan editing dasar di pencahayaan dan tone warna, apabila ada request edit dari client bisa langsung konfirmasi ke bagian admin studio
              </li>
            </ol>
          </div>

          {/* 3. Keterlambatan dan Reschedule */}
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <h3 className="font-extrabold text-red-600 text-sm sm:text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
              <span>• Keterlambatan dan Reschedule</span>
            </h3>
            <ol className="space-y-2 pl-4 list-decimal text-slate-700">
              <li>
                Apabila ada keterlambatan dan kondisi studio tidak terlalu ramai masih boleh terlambat tanpa batasan atau boleh mengajukan pergantian jam di jam yang kosong tanpa pengurangan menit foto selama jam setelahnya atau jam yang dipilih masih ready
              </li>
              <li>
                Apabila dalam kondisi ramai dan tidak ada jam kosong setelahnya, tetap bisa difotokan di jam yang belum bisa dipastikan, jika di jam setelahnya terlambat bisa di gunakan untuk foto dengan ada pengurangan menit foto sesuai ketentuan yang berlaku, atau apabila tidak ada waktu yang pasti bisa mengajukan resechedule di hari lain
              </li>
              <li>
                Dalam kondisi ramai atau full, keterlambatan dihitung dari 5 menit pertama dari jam booking dan akan di alihkan ke client lain yang sudah siap
              </li>
              <li>
                Boleh mengajukan resechedule ke hari lain tanpa ada biaya tambahan apapun selama hari dan jam yang diajukan masih ready
              </li>
            </ol>
          </div>

          {/* 4. Reservasi dan Pembayaran */}
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <h3 className="font-extrabold text-red-600 text-sm sm:text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
              <span>• Reservasi dan Pembayaran</span>
            </h3>
            <ol className="space-y-2 pl-4 list-decimal text-slate-700">
              <li>
                <span className="text-red-600 font-bold">DP minimal 50%</span> dari total harga
              </li>
              <li>
                Pelunasan bisa di selesaikan sebelum hari H atau di hari H sebelum atau setelah foto di studio via Cash atau via transfer
              </li>
              <li>
                Jika ada pembatalan sepihak maka DP tidak bisa dikembalikan
              </li>
              <li>
                Untuk paket yang diambil masih bisa upgrade paket, tetapi tidak bisa downgrade paket yaa kak 😊
              </li>
            </ol>
          </div>

          {/* 5. Background Dan Properti */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-red-600 text-sm sm:text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
              <span>• Background Dan Properti</span>
            </h3>
            <ol className="space-y-2 pl-4 list-decimal text-slate-700">
              <li>
                Properti setiap background bisa berubah2, boleh request properti yg ada di studio apabila keadaan studio tidak ramai, dan belum bisa request properti apabila keadaan studio sedang ramai
              </li>
            </ol>
          </div>

        </div>

        {/* Quick CTA Box */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="font-bold text-slate-900 text-xs sm:text-sm">
              Punya Pertanyaan Seputar Disclaimer & Jadwal?
            </div>
            <p className="text-xs text-slate-500">
              Konsultasikan kebutuhan sesi fotomu langsung dengan tim admin Alviero Studio.
            </p>
          </div>

          <a
            href={`https://wa.me/${currentBranchInfo.whatsappNumber || (selectedBranch === 'cabang-2' ? '6285168879214' : '6287777538164')}?text=Halo%20Admin%20${encodeURIComponent(currentBranchInfo.name)},%20saya%20sudah%20membaca%20Disclaimer%20dan%20mau%20konsultasi%20booking`}
            target="_blank"
            rel="noreferrer"
            className="min-h-[40px] px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-amber-300" />
            <span>Chat WhatsApp ({currentBranchInfo.badge})</span>
          </a>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. Interactive FAQ Section                                           */}
      {/* ==================================================================== */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDD6] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#6E856C] font-extrabold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Pertanyaan Umum (FAQ)</span>
        </div>
        <h3 className="text-xl font-extrabold text-[#3A3A3A]">Hal Yang Sering Ditanyakan</h3>

        <div className="space-y-2 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx} className="border border-[#E8DDD6] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#3A3A3A] bg-[#FDFBF7] hover:bg-[#F2E9E4] flex items-center justify-between gap-2 cursor-pointer transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#6E856C] shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs text-stone-600 leading-relaxed border-t border-[#E8DDD6] animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. Location & Contact Section                                       */}
      {/* ==================================================================== */}
      <div className="bg-[#2A2A2A] text-white rounded-3xl p-6 sm:p-10 border border-[#3A3A3A] shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#A9BCA7]/20 text-[#A9BCA7] text-xs font-bold px-3 py-1 rounded-full border border-[#A9BCA7]/40">
            <MapPin className="w-3.5 h-3.5" />
            <span>Lokasi & Jam Operasional</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white font-serif">
            Kunjungi Alviero Studio Foto
          </h3>

          <div className="space-y-3 text-xs text-stone-200 pt-2">
            <a
              href="https://maps.app.goo.gl/oxtptpr3RSDL9zCj6"
              target="_blank"
              rel="noreferrer"
              title="Buka Studio 1 di Google Maps"
              className="flex items-start gap-2 bg-[#3A3A3A] hover:bg-[#4A4A4A] p-3 rounded-2xl border border-[#4A4A4A] hover:border-[#A9BCA7] transition-all cursor-pointer group"
            >
              <MapPin className="w-4 h-4 text-[#A9BCA7] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <strong className="text-white block font-bold group-hover:text-[#A9BCA7] transition-colors">Studio 1 (Karangploso) ↗</strong>
                <span className="text-stone-300 break-all underline decoration-stone-500 hover:decoration-[#A9BCA7]">https://maps.app.goo.gl/oxtptpr3RSDL9zCj6</span>
              </div>
            </a>

            <a
              href="https://maps.app.goo.gl/W4Jojd1B9TBZxWWP9"
              target="_blank"
              rel="noreferrer"
              title="Buka Studio 2 di Google Maps"
              className="flex items-start gap-2 bg-[#3A3A3A] hover:bg-[#4A4A4A] p-3 rounded-2xl border border-[#4A4A4A] hover:border-[#A9BCA7] transition-all cursor-pointer group"
            >
              <MapPin className="w-4 h-4 text-[#A9BCA7] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <strong className="text-white block font-bold group-hover:text-[#A9BCA7] transition-colors">Studio 2 (Dinoyo Gajayana) ↗</strong>
                <span className="text-stone-300 break-all underline decoration-stone-500 hover:decoration-[#A9BCA7]">https://maps.app.goo.gl/W4Jojd1B9TBZxWWP9</span>
              </div>
            </a>

            <div className="flex items-center gap-2 pt-1 text-stone-300">
              <Clock className="w-4 h-4 text-[#A9BCA7] shrink-0" />
              <span>Buka Setiap Hari: 08:00 - 21:00 WIB</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <a
              href="https://maps.app.goo.gl/oxtptpr3RSDL9zCj6"
              target="_blank"
              rel="noreferrer"
              className="bg-[#6E856C] hover:bg-[#5C725A] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              Maps Studio 1
            </a>
            <a
              href="https://maps.app.goo.gl/W4Jojd1B9TBZxWWP9"
              target="_blank"
              rel="noreferrer"
              className="bg-[#5C725A] hover:bg-[#4A5D48] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              Maps Studio 2
            </a>
            <button
              onClick={handleCopyAddress}
              className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 border border-[#4A4A4A] cursor-pointer active:scale-95"
            >
              {copiedAddress ? <Check className="w-3.5 h-3.5 text-[#A9BCA7]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAddress ? 'Alamat Tersalin!' : 'Salin Alamat'}</span>
            </button>
          </div>
        </div>

        {/* Map Location Card */}
        <div className="bg-[#1F1F1F] rounded-2xl p-6 border border-[#3A3A3A] text-center space-y-3">
          <div className="w-16 h-16 bg-[#A9BCA7]/20 text-[#A9BCA7] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            📍
          </div>
          <h4 className="font-extrabold text-sm text-white font-serif">Alviero Self Photo Studio</h4>
          <p className="text-xs text-stone-300">
            Lantai 2 • Akses Tangga Nyaman • Fasilitas Lengkap
          </p>
          <div className="pt-2">
            <span className="inline-block bg-[#2A2A2A] text-[#A9BCA7] text-[11px] font-bold px-3 py-1.5 rounded-xl border border-[#3A3A3A]">
              🟢 Slot Hari Ini Masih Tersedia (08:00 - 21:00 WIB)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
