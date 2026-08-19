import React, { useState } from 'react';
import { PACKAGES, CATEGORIES } from '../data/pricelistData';
import { PackageItem, PackageCategory } from '../types';
import { 
  Camera, Clock, Users, Printer, FileText, CheckCircle2, Sparkles, 
  ArrowRight, Star, Filter, Scale, X, GraduationCap, Trees, 
  UserCheck, Home, HeartHandshake, User, Heart, Mail, Sliders
} from 'lucide-react';

interface PackageCatalogProps {
  onSelectPackageForBooking: (packageId: string) => void;
}

export const PackageCatalog: React.FC<PackageCatalogProps> = ({ onSelectPackageForBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(0); // 0 = all
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Helper icon lookup
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
      case 'Trees': return <Trees className="w-4 h-4" />;
      case 'UserCheck': return <UserCheck className="w-4 h-4" />;
      case 'Users': return <Users className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4" />;
      case 'User': return <User className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Heart': return <Heart className="w-4 h-4" />;
      case 'Camera': return <Camera className="w-4 h-4" />;
      case 'Mail': return <Mail className="w-4 h-4" />;
      case 'Sliders': return <Sliders className="w-4 h-4" />;
      default: return <Camera className="w-4 h-4" />;
    }
  };

  const filteredPackages = PACKAGES.filter((pkg) => {
    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchesPrice = maxPrice === 0 || pkg.price <= maxPrice;
    return matchesCategory && matchesPrice;
  });

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(item => item !== id));
    } else {
      if (compareIds.length >= 3) {
        alert('Maksimal membandingkan 3 paket sekaligus');
        return;
      }
      setCompareIds([...compareIds, id]);
    }
  };

  const comparePackages = PACKAGES.filter(p => compareIds.includes(p.id));
  const activeCategoryInfo = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <section className="py-4 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-5 sm:p-10 text-white overflow-hidden shadow-2xl border border-indigo-900/50">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 top-0 w-64 h-64 bg-amber-500/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Katalog Resmi Alviero Studio - 12 Kategori Paket Lengkap</span>
          </div>

          <h1 className="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Pilihan Paket Foto Lengkap <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-indigo-200 to-white">
              Studio & Outdoor Ter-Aesthetic
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Tersedia 12 kategori foto spesial: Graduation (Indoor/Outdoor), Pass Foto, Group, Family, Maternity, Personal, Prewed, Couple, Sewa Studio, Undangan, serta Self Studio (Special, Normal & Spotlight).
          </p>

          {/* Feature Badges */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-200 font-medium">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
              <Camera className="w-4 h-4 text-indigo-300 shrink-0" />
              <span>Studio & Outdoor Pro</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
              <FileText className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Gratis Semua Soft Files</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
              <Printer className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Cetak & Frame Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Grid Overview (12 Categories Quick Jump) */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-slate-900 text-xs sm:text-base flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Pilih Kategori Layanan Studio (12 Kategori)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium hidden sm:block">
            Total {PACKAGES.length} Sub Paket
          </span>
        </div>

        {/* Categories Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[56px] p-3 rounded-2xl text-xs font-bold transition-all text-left flex flex-col justify-between border cursor-pointer active:scale-98 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Camera className="w-4 h-4 text-indigo-400" />
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                33 Paket
              </span>
            </div>
            <span className="font-black">Semua Layanan</span>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[56px] p-3 rounded-2xl text-xs transition-all text-left flex flex-col justify-between border cursor-pointer active:scale-98 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className={isSelected ? 'text-white' : 'text-indigo-600'}>
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}>
                    {cat.subPackageCount} Sub
                  </span>
                </div>
                <div>
                  <div className="font-extrabold line-clamp-1">{cat.name}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Category Information Banner */}
        {activeCategoryInfo && (
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                {getCategoryIcon(activeCategoryInfo.iconName)}
              </div>
              <div>
                <div className="font-black text-slate-900 text-sm">{activeCategoryInfo.name}</div>
                <div className="text-slate-600 text-[11px] sm:text-xs">{activeCategoryInfo.description}</div>
              </div>
            </div>
            <div className="bg-white border border-indigo-200 text-indigo-700 font-extrabold px-3 py-1.5 rounded-xl shrink-0">
              {activeCategoryInfo.subPackageNote}
            </div>
          </div>
        )}

        {/* Filter Budget */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto py-1 scroll-mask-x">
            <span className="text-xs font-bold text-slate-500 shrink-0">Filter Budget:</span>
            <button
              onClick={() => setMaxPrice(0)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all active:scale-95 ${
                maxPrice === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semua Harga
            </button>
            <button
              onClick={() => setMaxPrice(100000)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all active:scale-95 ${
                maxPrice === 100000 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              &le; 100 Ribu
            </button>
            <button
              onClick={() => setMaxPrice(200000)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all active:scale-95 ${
                maxPrice === 200000 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              &le; 200 Ribu
            </button>

            {compareIds.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="min-h-[36px] bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1 hover:bg-indigo-100 transition-colors shrink-0 ml-auto cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-600" />
                <span>Bandingkan ({compareIds.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Special Sub-Category Toggle for Self Studio */}
      {selectedCategory === 'self-studio' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Kategori Self Studio Memiliki 3 Kelompok Sub Paket:</span>
            <p className="text-xs text-amber-900 font-medium">1. Sub Paket Special (2) • 2. Sub Paket Normal (2) • 3. Sub Paket Color Spotlight (2)</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] bg-white border border-amber-300 text-amber-900 font-bold px-2.5 py-1 rounded-lg">Total 6 Sub Paket</span>
          </div>
        </div>
      )}

      {/* Package Cards Grid */}
      {filteredPackages.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3">
          <p className="text-slate-600 font-semibold text-sm">Tidak ditemukan paket sesuai filter kategori atau harga ini.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setMaxPrice(0); }}
            className="min-h-[40px] inline-flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <span>Reset Filter</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredPackages.map((pkg) => {
            const isComparing = compareIds.includes(pkg.id);
            const categoryObj = CATEGORIES.find(c => c.id === pkg.category);

            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group relative ${
                  pkg.popular 
                    ? 'border-indigo-500 shadow-lg shadow-indigo-100 ring-2 ring-indigo-500/20' 
                    : 'border-slate-200/90 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Tag Badge */}
                {pkg.tag && (
                  <div className="absolute top-3.5 left-3.5 z-10 bg-slate-900/90 backdrop-blur-md text-amber-300 font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/10">
                    <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span>{pkg.tag}</span>
                  </div>
                )}

                {/* Compare Checkbox Button */}
                <button
                  onClick={() => toggleCompare(pkg.id)}
                  title="Bandingkan paket"
                  className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full backdrop-blur-md text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center ${
                    isComparing 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white/90 text-slate-700 hover:bg-white border border-slate-200'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                </button>

                <div>
                  {/* Image Banner */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>

                    {/* Category Label inside Image Overlay */}
                    <div className="absolute top-3.5 left-3.5 right-14 flex items-center gap-2">
                      <span className="bg-indigo-900/80 backdrop-blur-md text-indigo-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-indigo-400/30">
                        {categoryObj?.name || pkg.category}
                      </span>
                      {pkg.subCategory && (
                        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md">
                          Sub: {pkg.subCategory}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <h3 className="font-extrabold text-base sm:text-lg text-white leading-snug drop-shadow-sm">
                          {pkg.name}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-black text-lg sm:text-xl text-amber-300">
                          Rp {pkg.price.toLocaleString('id-ID')}
                        </div>
                        {pkg.originalPrice && (
                          <div className="text-[11px] text-slate-300 line-through">
                            Rp {pkg.originalPrice.toLocaleString('id-ID')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Package Meta Info */}
                  <div className="p-4 sm:p-5 space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {pkg.description}
                    </p>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900">{pkg.durationMinutes} Min Foto</div>
                          <div className="text-[10px] text-slate-500">+{pkg.selectionTimeMinutes} min pilih</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-700">
                        <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900">{pkg.includedPeople} Orang</div>
                          <div className="text-[10px] text-slate-500">Sudah termasuk</div>
                        </div>
                      </div>
                    </div>

                    {/* Highlights checklist */}
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Fasilitas Terdaftar:
                      </div>
                      {pkg.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action CTA */}
                <div className="p-4 sm:p-5 pt-0">
                  <button
                    onClick={() => onSelectPackageForBooking(pkg.id)}
                    className={`w-full min-h-[44px] py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 ${
                      pkg.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Pilih Paket & Reservasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Package Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-6 shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">Perbandingan Paket Studio</h3>
              </div>
              <button 
                onClick={() => setShowCompareModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparePackages.map((pkg) => (
                <div key={pkg.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
                  <div className="font-extrabold text-slate-900 text-base">{pkg.name}</div>
                  <div className="text-xl font-black text-indigo-600">Rp {pkg.price.toLocaleString('id-ID')}</div>
                  <div className="text-xs text-slate-600 space-y-1.5">
                    <div>⏱️ Durasi: <strong>{pkg.durationMinutes} Menit</strong></div>
                    <div>👥 Peserta: <strong>{pkg.includedPeople} Orang</strong></div>
                    <div>🖨️ Cetakan: <strong>{pkg.includedPrints}</strong></div>
                    <div>📁 Soft Files: <strong>Gratis Google Drive</strong></div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCompareModal(false);
                      onSelectPackageForBooking(pkg.id);
                    }}
                    className="w-full min-h-[40px] py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 cursor-pointer active:scale-95"
                  >
                    Pilih Paket Ini
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
