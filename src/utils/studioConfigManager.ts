import { useState, useEffect } from 'react';
import bundledConfig from '../data/studioConfig.json';
import { StudioBranch } from '../types';

export interface PaymentConfig {
  bcaAccountNumber: string;
  bcaAccountName: string;
  bcaBankName: string;
  qrisImageUrl: string;
}

const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  bcaAccountNumber: '0113324021',
  bcaAccountName: 'Muhammad Azzam Fakhri',
  bcaBankName: 'Bank Central Asia (BCA)',
  qrisImageUrl: '/images/qris-alviero.png',
};

// In-memory active configuration
let currentConfig: any = (() => {
  if (typeof window !== 'undefined') {
    try {
      const activeSaved = localStorage.getItem('alviero_studio_config_active');
      if (activeSaved) {
        const parsed = JSON.parse(activeSaved);
        if (parsed && typeof parsed === 'object' && parsed.backgrounds) {
          return { ...bundledConfig, ...parsed };
        }
      }
      const draftSaved = localStorage.getItem('alviero_studio_config_draft');
      if (draftSaved) {
        const parsedDraft = JSON.parse(draftSaved);
        if (parsedDraft && typeof parsedDraft === 'object' && parsedDraft.backgrounds) {
          return { ...bundledConfig, ...parsedDraft };
        }
      }
    } catch (e) {
      console.warn('[ConfigManager] LocalStorage read error:', e);
    }
  }
  return bundledConfig;
})();

type ConfigListener = (config: any) => void;
const listeners = new Set<ConfigListener>();

function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn(currentConfig);
    } catch (err) {
      console.error('[ConfigManager] Listener error:', err);
    }
  });
}

// Setup BroadcastChannel & Window Listeners in browser
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined') {
  try {
    if ('BroadcastChannel' in window) {
      broadcastChannel = new BroadcastChannel('alviero_config_sync');
      broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'CONFIG_UPDATED' && event.data.config) {
          currentConfig = { ...bundledConfig, ...event.data.config };
          notifyListeners();
        }
      };
    }
  } catch (e) {
    console.warn('[ConfigManager] BroadcastChannel init error:', e);
  }

  // Cross-tab storage listener
  window.addEventListener('storage', (e) => {
    if (e.key === 'alviero_studio_config_active' || e.key === 'alviero_studio_config_draft') {
      try {
        if (e.newValue) {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') {
            currentConfig = { ...bundledConfig, ...parsed };
            notifyListeners();
          }
        }
      } catch (err) {
        console.warn('[ConfigManager] Storage event parse error:', err);
      }
    }
  });

  // Background fetch to ensure latest configuration from Cloud / GitHub / Server is applied
  const fetchLatestConfig = async () => {
    try {
      let latest: any = null;

      // 1. Coba ambil real-time dari /api/config (langsung dari GitHub Cloud tanpa delay build Vercel)
      try {
        const apiRes = await fetch('/api/config', { cache: 'no-store' });
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData && apiData.data && apiData.data.backgrounds) {
            latest = apiData.data;
          }
        }
      } catch {
        // Abaikan jika offline / lokal dev biasa
      }

      // 2. Fallback ke /data/studioConfig.json
      if (!latest) {
        const res = await fetch(`/data/studioConfig.json?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.backgrounds) {
            latest = data;
          }
        }
      }

      if (latest && latest.backgrounds) {
        const isNotAdminPage = typeof window !== 'undefined' && !window.location.pathname.includes('/adminsalto');
        const currentUpdated = currentConfig?.lastUpdated ? new Date(currentConfig.lastUpdated).getTime() : 0;
        const newUpdated = latest.lastUpdated ? new Date(latest.lastUpdated).getTime() : 0;

        // Terapkan jika di halaman publik atau timestamp konfigurasi baru lebih baru
        if (isNotAdminPage || newUpdated >= currentUpdated || !currentUpdated) {
          currentConfig = { ...bundledConfig, ...latest };
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('alviero_studio_config_active', JSON.stringify(currentConfig));
            } catch {}
          }
          notifyListeners();
        }
      }
    } catch {
      // Offline or network error - keep using currentConfig
    }
  };

  // Run on mount and on window focus
  if (document.readyState === 'complete') {
    fetchLatestConfig();
  } else {
    window.addEventListener('load', fetchLatestConfig);
  }
  window.addEventListener('focus', fetchLatestConfig);
}

/**
 * Mendapatkan konfigurasi studio aktif saat ini secara sinkron.
 */
export function getStudioConfig(): any {
  return currentConfig;
}

/**
 * Memperbarui konfigurasi studio secara reaktif, menyimpannya ke localStorage,
 * dan menyebarkannya (broadcast) ke seluruh tab yang sedang terbuka.
 */
export function updateActiveConfig(newConfig: any) {
  if (!newConfig || typeof newConfig !== 'object') return;
  currentConfig = { ...bundledConfig, ...newConfig };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('alviero_studio_config_active', JSON.stringify(currentConfig));
      localStorage.setItem('alviero_studio_config_draft', JSON.stringify(currentConfig));
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'CONFIG_UPDATED', config: currentConfig });
      }
    } catch (e) {
      console.warn('[ConfigManager] LocalStorage write error:', e);
    }
  }

  notifyListeners();
}

/**
 * Berlangganan perubahan konfigurasi studio secara real-time.
 */
export function subscribeStudioConfig(listener: ConfigListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * React Hook untuk menggunakan studio config yang selalu reaktif dan otomatis re-render.
 */
export function useStudioConfig(): any {
  const [cfg, setCfg] = useState(currentConfig);

  useEffect(() => {
    const unsubscribe = subscribeStudioConfig((updated) => {
      setCfg({ ...updated });
    });
    return unsubscribe;
  }, []);

  return cfg;
}

/**
 * Mengambil payment config aktif
 */
export function getPaymentConfig(cfg?: any): PaymentConfig {
  const activeCfg = cfg || currentConfig;
  return {
    ...DEFAULT_PAYMENT_CONFIG,
    ...(activeCfg?.paymentConfig || {}),
  };
}

/**
 * Mengambil fasilitas studio berdasarkan cabang yang dipilih
 */
export function getFacilitiesByBranch(branch: StudioBranch = 'cabang-1', cfg?: any): any[] {
  const activeCfg = cfg || currentConfig;
  const items: any[] = activeCfg?.facilityItems || bundledConfig.facilityItems || [];
  return items.filter((f) => {
    if (f.active === false) return false;
    if (!f.branchId || f.branchId === 'all') return true;
    return f.branchId === branch;
  });
}

/**
 * Mengambil peralatan studio berdasarkan cabang yang dipilih
 */
export function getEquipmentByBranch(branch: StudioBranch = 'cabang-1', cfg?: any): any[] {
  const activeCfg = cfg || currentConfig;
  const items: any[] = activeCfg?.equipmentItems || bundledConfig.equipmentItems || [];
  return items.filter((e) => {
    if (e.active === false) return false;
    if (!e.branchId || e.branchId === 'all') return true;
    return e.branchId === branch;
  });
}

/**
 * Parsing nilai harga fleksibel dari format string (misal: "295K", "Rp 350.000", "55k", "1.2jt", 295000)
 * menjadi angka numerik murni dalam Rupiah.
 */
export function parsePriceToNumber(val: any, fallback = 0): number {
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  if (!val || typeof val !== 'string') return fallback;
  const str = val.trim();
  if (!str) return fallback;

  // 1. Cek format "1.400K" atau "1.800K"
  const dotKMatch = str.match(/^([\d.]+)\s*k$/i);
  if (dotKMatch) {
    const rawNum = parseFloat(dotKMatch[1].replace(/\./g, ''));
    if (!isNaN(rawNum)) return Math.round(rawNum * 1000);
  }

  // 2. Cek satuan ribuan: 'k', 'rb', 'ribu' (contoh: 295k, 295K, 295rb)
  const kMatch = str.match(/^([\d.,]+)\s*(k|rb|ribu)$/i);
  if (kMatch) {
    const numPart = parseFloat(kMatch[1].replace(/,/g, '.'));
    if (!isNaN(numPart)) return Math.round(numPart * 1000);
  }

  // 3. Cek satuan jutaan: 'jt', 'juta', 'm' (contoh: 1.2jt, 1.4m)
  const jtMatch = str.match(/^([\d.,]+)\s*(jt|juta|m)$/i);
  if (jtMatch) {
    const numPart = parseFloat(jtMatch[1].replace(/,/g, '.'));
    if (!isNaN(numPart)) return Math.round(numPart * 1000000);
  }

  // 4. Ekstrak digit angka murni: "Rp 295.000" atau "295000"
  const digits = str.replace(/[^\d]/g, '');
  if (digits) {
    const parsed = parseInt(digits, 10);
    if (!isNaN(parsed)) return parsed;
  }

  return fallback;
}

/**
 * Parsing durasi menit dari format teks (misal: "25 Menit Unlimited Foto", "60 Menit", "15 Menit")
 */
export function parseDurationMinutes(val: any, fallback = 30): number {
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  if (!val || typeof val !== 'string') return fallback;
  const m = val.match(/(\d+)\s*menit/i);
  if (m) {
    const parsed = parseInt(m[1], 10);
    if (!isNaN(parsed)) return parsed;
  }
  const digits = val.replace(/[^\d]/g, '');
  if (digits) {
    const parsed = parseInt(digits, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return fallback;
}

/**
 * Format angka atau string harga ke tampilan singkat khas Alviero (misal: 255000 -> "255K")
 */
export function formatPriceDisplay(val: any, fallback = ''): string {
  if (val === undefined || val === null || val === '') return fallback;
  if (typeof val === 'string') {
    if (val.trim().endsWith('K') || val.trim().endsWith('k')) return val.trim().toUpperCase();
    const parsed = parsePriceToNumber(val, 0);
    if (parsed >= 1000) return `${Math.round(parsed / 1000)}K`;
    return val;
  }
  if (typeof val === 'number') {
    if (val >= 1000) return `${Math.round(val / 1000)}K`;
    return `Rp ${val}`;
  }
  return fallback;
}

/**
 * Mengambil daftar paket foto yang sudah disinkronkan secara reaktif dengan studioConfig.studioPackages.
 * Harga, durasi, nama, dan detail yang diubah admin di dashboard otomatis menimpa data statis.
 */
export function getActivePackages(cfg?: any, basePackages: any[] = []): any[] {
  const activeCfg = cfg || currentConfig;
  const configuredPackages: any[] = [
    ...(activeCfg?.studioPackages || activeCfg?.indoorPackages || []),
    ...(activeCfg?.bundlingPackages || []),
    ...(activeCfg?.outdoorPackages || [])
  ];

  if (!configuredPackages || configuredPackages.length === 0) {
    return basePackages;
  }

  const configuredMap = new Map<string, any>();
  configuredPackages.forEach((cp) => {
    if (cp && cp.id) {
      configuredMap.set(cp.id, cp);
    }
  });

  const merged = basePackages.map((bp) => {
    const cp = configuredMap.get(bp.id);
    if (!cp) return bp;

    const dynamicPrice = parsePriceToNumber(cp.price, bp.price);
    const dynamicOrigPrice = cp.originalPrice ? parsePriceToNumber(cp.originalPrice, bp.originalPrice) : bp.originalPrice;
    const dynamicDuration = cp.duration ? parseDurationMinutes(cp.duration, bp.durationMinutes) : bp.durationMinutes;

    return {
      ...bp,
      name: cp.name || bp.name,
      tag: cp.subtitle || cp.tag || bp.tag,
      price: dynamicPrice,
      originalPrice: dynamicOrigPrice,
      durationMinutes: dynamicDuration,
      includedPeople: cp.people ? (parseInt(cp.people.replace(/[^\d]/g, ''), 10) || bp.includedPeople) : bp.includedPeople,
      includedPrints: cp.print || bp.includedPrints,
      description: cp.note || bp.description,
      image: (Array.isArray(cp.imageUrls) && cp.imageUrls[0]) || cp.imageUrl || bp.image,
      popular: cp.badge ? (cp.badge.toLowerCase().includes('favorit') || cp.badge.toLowerCase().includes('best')) : bp.popular,
      facilities: cp.facilities || bp.facilities,
      rawConfig: cp
    };
  });

  // Tambahkan paket baru dari dashboard jika ada yang belum terdaftar di basePackages
  const existingIds = new Set(basePackages.map((bp) => bp.id));
  configuredPackages.forEach((cp) => {
    if (cp && cp.id && !existingIds.has(cp.id)) {
      merged.push({
        id: cp.id,
        name: cp.name || 'Paket Baru',
        category: cp.category || 'pro-studio',
        tag: cp.subtitle || '',
        price: parsePriceToNumber(cp.price, 0),
        originalPrice: cp.originalPrice ? parsePriceToNumber(cp.originalPrice, 0) : undefined,
        durationMinutes: cp.duration ? parseDurationMinutes(cp.duration, 30) : 30,
        selectionTimeMinutes: 10,
        includedPeople: cp.people ? (parseInt(cp.people.replace(/[^\d]/g, ''), 10) || 2) : 2,
        includedPrints: cp.print || '-',
        softFilesIncluded: true,
        description: cp.note || '',
        highlights: [cp.duration, cp.background, cp.people, cp.edit, cp.print].filter(Boolean),
        image: (Array.isArray(cp.imageUrls) && cp.imageUrls[0]) || cp.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
        backdropCount: cp.background && (cp.background.includes('2') || cp.background.includes('dua')) ? 2 : 1,
        facilities: cp.facilities || [],
        rawConfig: cp
      });
    }
  });

  return merged;
}

/**
 * Mengambil grup opsi Self Studio yang telah disinkronkan harganya dari dashboard
 */
export function getActiveSelfStudioSubPackages(cfg?: any, baseGroups: any[] = []): any[] {
  const activeCfg = cfg || currentConfig;
  const configuredPackages: any[] = activeCfg?.studioPackages || [];
  if (!configuredPackages || configuredPackages.length === 0) {
    return baseGroups;
  }

  const configuredMap = new Map<string, any>();
  configuredPackages.forEach((cp) => {
    if (cp && cp.id) {
      configuredMap.set(cp.id, cp);
    }
  });

  return baseGroups.map((group) => {
    return {
      ...group,
      options: group.options.map((opt: any) => {
        const cp = configuredMap.get(opt.id);
        if (!cp) return opt;
        return {
          ...opt,
          name: cp.name || opt.name,
          price: parsePriceToNumber(cp.price, opt.price),
          durationMinutes: cp.duration ? parseDurationMinutes(cp.duration, opt.durationMinutes) : opt.durationMinutes
        };
      })
    };
  });
}

/**
 * Mengambil daftar add-ons aktif dari konfigurasi dashboard
 */
function parseAddOnPrice(raw: any): number | null {
  if (typeof raw === 'number') {
    return (raw > 0 && raw < 100000000) ? raw : null;
  }
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const firstOption = trimmed.split('/')[0].trim();
  const kMatch = firstOption.match(/([0-9.,]+)\s*k/i);
  if (kMatch) {
    const cleanDigits = kMatch[1].replace(/[.,]/g, '');
    const num = parseInt(cleanDigits, 10);
    if (!isNaN(num) && num > 0) return num * 1000;
  }
  const cleanDigits = firstOption.replace(/[^\d]/g, '');
  if (cleanDigits) {
    const num = parseInt(cleanDigits, 10);
    if (!isNaN(num) && num > 0 && num < 100000000) return num;
  }
  return null;
}

export function getActiveAddOns(cfg?: any, baseAddOns: any[] = []): any[] {
  const activeCfg = cfg || currentConfig;
  const configured = activeCfg?.addOns;
  const rawList: any[] = (configured && Array.isArray(configured) && configured.length > 0)
    ? configured.map((item: any) => ({ ...item }))
    : baseAddOns.map((item: any) => ({ ...item }));

  const labPrices = activeCfg?.labPrintPrices;
  const framePrices = activeCfg?.framePrices;

  // Sinkronisasi otomatis dengan Cetak Foto Lab
  if (Array.isArray(labPrices)) {
    labPrices.forEach((lab: any) => {
      if (!lab || !lab.code) return;
      const cleanCode = String(lab.code).toLowerCase().replace(/[^a-z0-9]/g, '');
      const numPrice = (typeof lab.price === 'number' && lab.price > 0)
        ? lab.price
        : (parseAddOnPrice(lab.priceDisplay) || parseAddOnPrice(lab.price) || 0);

      const isPassFoto = String(lab.code).toLowerCase().includes('pass');
      const targetId = isPassFoto ? `passfoto-print-${cleanCode.replace('pass', '')}` : `global-print-${cleanCode}`;

      const existingIdx = rawList.findIndex((a: any) => a.id === targetId || (a.category === 'frame' && a.id.toLowerCase() === targetId));
      const desc = lab.size
        ? `Cetak foto lab ukuran ${lab.code} (${lab.size}) kertas Glossy Lab premium.`
        : (lab.note || `Cetak foto lab ukuran ${lab.code} kertas Glossy Lab premium.`);

      if (existingIdx !== -1) {
        rawList[existingIdx] = {
          ...rawList[existingIdx],
          price: numPrice > 0 ? numPrice : rawList[existingIdx].price,
          name: `Cetak Lab Uk ${lab.code}`,
          description: desc,
          active: lab.active !== false
        };
      } else if (!isPassFoto) {
        rawList.push({
          id: targetId,
          name: `Cetak Lab Uk ${lab.code}`,
          price: numPrice,
          unit: 'foto',
          description: desc,
          category: 'frame',
          isSelfStudioOnly: false,
          applicableCategories: ['all'],
          applicableBranches: ['all'],
          active: lab.active !== false
        });
      }
    });
  }

  // Sinkronisasi otomatis dengan Bingkai Foto
  if (Array.isArray(framePrices)) {
    framePrices.forEach((fr: any) => {
      if (!fr || !fr.code) return;
      const cleanCode = String(fr.code).toLowerCase().replace(/[^a-z0-9]/g, '');
      const numPrice = (typeof fr.price === 'number' && fr.price > 0)
        ? fr.price
        : (parseAddOnPrice(fr.priceDisplay) || parseAddOnPrice(fr.price) || 0);

      const targetId = `global-frame-${cleanCode}`;
      const existingIdx = rawList.findIndex((a: any) => a.id === targetId || (a.category === 'frame' && a.id.toLowerCase() === targetId));

      const sizeStr = fr.size || fr.dim || '';
      const typeStr = fr.type ? fr.type.toLowerCase() : 'minimalis modern';
      const desc = sizeStr
        ? `Bingkai pigura ${typeStr} ukuran ${fr.code} (${sizeStr}).`
        : (fr.desc || `Bingkai pigura ${typeStr} ukuran ${fr.code}.`);

      if (existingIdx !== -1) {
        rawList[existingIdx] = {
          ...rawList[existingIdx],
          price: numPrice > 0 ? numPrice : rawList[existingIdx].price,
          name: `Bingkai Uk ${fr.code}`,
          description: desc,
          active: fr.active !== false
        };
      } else {
        rawList.push({
          id: targetId,
          name: `Bingkai Uk ${fr.code}`,
          price: numPrice,
          unit: 'bingkai',
          description: desc,
          category: 'frame',
          isSelfStudioOnly: false,
          applicableCategories: ['all'],
          applicableBranches: ['all'],
          active: fr.active !== false
        });
      }
    });
  }

  return rawList.filter((a: any) => a.active !== false);
}

/**
 * Mengambil pengumuman teks berjalan (announcement ticker)
 */
export function getActiveAnnouncement(cfg?: any): { active: boolean; text: string } {
  const activeCfg = cfg || currentConfig;
  const ann = activeCfg?.announcement;
  if (!ann) {
    return { active: false, text: '' };
  }
  if (typeof ann === 'string') {
    const trimmed = ann.trim();
    return { active: trimmed.length > 0, text: trimmed };
  }
  if (typeof ann === 'object') {
    return {
      active: Boolean(ann.active),
      text: (ann.text || '').trim()
    };
  }
  return { active: false, text: '' };
}

/**
 * Mengambil daftar tarif cetak foto lab aktif
 */
export function getActiveLabPrintItems(cfg?: any, fallback: any[] = []): any[] {
  const activeCfg = cfg || currentConfig;
  if (activeCfg?.labPrintPrices && Array.isArray(activeCfg.labPrintPrices) && activeCfg.labPrintPrices.length > 0) {
    return activeCfg.labPrintPrices.filter((i: any) => i.active !== false);
  }
  return fallback;
}

/**
 * Mengambil gambar banner simulasi skala cetak foto lab
 */
export function getActiveLabPrintBanner(cfg?: any): string {
  const activeCfg = cfg || currentConfig;
  return activeCfg?.labPrintBannerImage || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85';
}

/**
 * Mengambil daftar katalog bingkai foto aktif
 */
export function getActiveFrameItems(cfg?: any, fallback: any[] = []): any[] {
  const activeCfg = cfg || currentConfig;
  if (activeCfg?.framePrices && Array.isArray(activeCfg.framePrices) && activeCfg.framePrices.length > 0) {
    return activeCfg.framePrices.filter((i: any) => i.active !== false);
  }
  return fallback;
}

/**
 * Mengambil daftar katalog album foto eksklusif aktif
 */
export function getActiveAlbumItems(cfg?: any, fallback: any[] = []): any[] {
  const activeCfg = cfg || currentConfig;
  if (activeCfg?.albumPrices && Array.isArray(activeCfg.albumPrices) && activeCfg.albumPrices.length > 0) {
    return activeCfg.albumPrices.filter((i: any) => i.active !== false);
  }
  return fallback;
}

/**
 * Mengambil daftar ulasan klien (Google Reviews)
 */
export function getActiveReviews(cfg?: any, fallback: any[] = []): any[] {
  const activeCfg = cfg || currentConfig;
  if (activeCfg?.clientReviews && Array.isArray(activeCfg.clientReviews) && activeCfg.clientReviews.length > 0) {
    return activeCfg.clientReviews.filter((r: any) => r.active !== false);
  }
  return fallback;
}

/**
 * Mengambil seksi aturan studio & disclaimer resmi
 */
export function getActiveDisclaimer(cfg?: any, fallback: any = null): any {
  const activeCfg = cfg || currentConfig;
  if (activeCfg?.disclaimer && activeCfg.disclaimer.sections) {
    return activeCfg.disclaimer;
  }
  return fallback;
}

export const DEFAULT_PHOTO_STRIP_CONFIG = {
  active: true,
  navLabel: 'Photo Strip',
  mobileNavLabel: 'Strip',
  badgeText: 'Interactive Photo Grid Customizer & Live Frame Generator',
  title: 'Kustomisasi Grid & Bingkai Alviero',
  subtitle: 'Pilih tata letak format 3R/4R, tentukan tema warna bingkai resmi Alviero Studio, posisikan foto secara utuh, dan unduh hasil PNG siap cetak!',
  instructionText: 'Klik "Crop Utuh & Posisi" pada foto untuk zoom, geser wajah, atau putar sudut foto agar pas dengan bingkai.',
  footerNote: '✦ Dicetak dengan kualitas lab studio beresolusi tinggi di Alviero Studio Foto!',
  defaultGrid: 'grid-4-3r',
  defaultTheme: 'A',
  enableFilters: true,
  enableStickers: true,
  enableShutterSound: true,
  enableCrop: true,
  stickers: ['', '💖', '⭐', '✨', '🎀', '🌸', '🍀', '🔥'],
  samplePhotos: [
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
  ],
  grids: [
    {
      id: 'grid-1-3r',
      name: 'Grid 1 (3R)',
      shortLabel: '1 Foto (3R)',
      sizeLabel: '3R (8.9 x 12.7 cm)',
      description: '1 Foto Utuh Portrait Minimalis dengan Logo Alviero',
      active: true
    },
    {
      id: 'grid-3-4r',
      name: 'Grid 3 (4R)',
      shortLabel: '3 Foto (4R Strip)',
      sizeLabel: '4R (10.2 x 15.2 cm)',
      description: 'Photo Strip 4R Twin 3-Cut (2 Kolom Strip Berdampingan)',
      active: true
    },
    {
      id: 'grid-4-3r',
      name: 'Grid 4 (3R)',
      shortLabel: '4 Foto 2x2 (3R)',
      sizeLabel: '3R (8.9 x 12.7 cm)',
      description: '2x2 Grid Klasik 4 Foto dengan Logo Alviero',
      active: true
    },
    {
      id: 'grid-6-4r',
      name: 'Grid 6 (4R)',
      shortLabel: '6 Foto 2x3 (4R)',
      sizeLabel: '4R (10.2 x 15.2 cm)',
      description: '2x3 Grid 6 Foto Memanjang Eksklusif',
      active: true
    }
  ],
  themes: [
    {
      id: 'A',
      name: 'Putih Classic',
      badge: 'A',
      previewBg: '#FFFFFF',
      previewTextColor: '#1E293B',
      borderColor: '#E2E8F0',
      description: 'Bingkai putih bersih minimalis elegan dengan logo Alviero',
      active: true,
      customOverlays: {}
    },
    {
      id: 'B',
      name: 'Cute Doodles & Paper',
      badge: 'B',
      previewBg: '#F8FAFC',
      previewTextColor: '#334155',
      borderColor: '#CBD5E1',
      description: 'Tekstur kertas grid buku dengan stiker & ornamen pastel lucu',
      active: true,
      customOverlays: {}
    },
    {
      id: 'C',
      name: 'Retro Terracotta',
      badge: 'C',
      previewBg: '#EA580C',
      previewTextColor: '#FFFFFF',
      borderColor: '#C2410C',
      description: 'Nuansa warna hangat retro terracotta dengan frame polaroid',
      active: true,
      customOverlays: {}
    },
    {
      id: 'D',
      name: 'Noir Best Moment',
      badge: 'D',
      previewBg: '#0F172A',
      previewTextColor: '#FFFFFF',
      borderColor: '#334155',
      description: 'Bingkai hitam pekat Y2K modern beraksen Best Moment',
      active: true,
      customOverlays: {}
    },
    {
      id: 'E',
      name: '35mm Vintage Film',
      badge: 'E',
      previewBg: '#18181B',
      previewTextColor: '#FACC15',
      borderColor: '#3F3F46',
      description: 'Klise strip film 35mm berlubang perforasi vintage aesthetic',
      active: true,
      customOverlays: {}
    }
  ]
};

/**
 * Mengambil konfigurasi Photo Strip Customizer secara lengkap & ternormalisasi
 */
export function getActivePhotoStripConfig(cfg?: any): typeof DEFAULT_PHOTO_STRIP_CONFIG {
  const activeCfg = cfg || currentConfig;
  const raw = activeCfg?.photoStripConfig || {};

  const mergedGrids = DEFAULT_PHOTO_STRIP_CONFIG.grids.map((defGrid) => {
    const found = Array.isArray(raw.grids) ? raw.grids.find((g: any) => g && g.id === defGrid.id) : null;
    return found ? { ...defGrid, ...found } : defGrid;
  });

  const mergedThemes = DEFAULT_PHOTO_STRIP_CONFIG.themes.map((defTheme) => {
    const found = Array.isArray(raw.themes) ? raw.themes.find((t: any) => t && t.id === defTheme.id) : null;
    return found
      ? {
          ...defTheme,
          ...found,
          customOverlays: { ...(defTheme.customOverlays || {}), ...(found.customOverlays || {}) }
        }
      : defTheme;
  });

  const samplePhotos =
    Array.isArray(raw.samplePhotos) && raw.samplePhotos.filter(Boolean).length > 0
      ? raw.samplePhotos.filter(Boolean)
      : DEFAULT_PHOTO_STRIP_CONFIG.samplePhotos;

  const stickers =
    Array.isArray(raw.stickers) && raw.stickers.length > 0
      ? raw.stickers
      : DEFAULT_PHOTO_STRIP_CONFIG.stickers;

  return {
    ...DEFAULT_PHOTO_STRIP_CONFIG,
    ...raw,
    active: raw.active !== false,
    enableFilters: raw.enableFilters !== false,
    enableStickers: raw.enableStickers !== false,
    enableShutterSound: raw.enableShutterSound !== false,
    enableCrop: raw.enableCrop !== false,
    samplePhotos,
    stickers,
    grids: mergedGrids,
    themes: mergedThemes
  };
}

/**
 * Mengambil daftar 16 kategori menu paket foto dengan menggabungkan (merge)
 * konfigurasi aktif dari dashboard ke atas struktur fallback komponen UI.
 */
export function getActiveCategories(cfg?: any, fallback: any[] = []): any[] {
  const activeCfg = cfg || currentConfig;
  const configuredList: any[] = Array.isArray(activeCfg?.categories) ? activeCfg.categories : [];

  if (configuredList.length === 0) {
    return fallback;
  }

  // Jika pemanggil memberikan array fallback (seperti mainMenuButtons / studioFotoSubButtons / defaultPhotoStudioGridItems),
  // pertahankan seluruh properti penting UI (targetPackageIds, specialView, sheetCategory, cardBg, dll.)
  // sambil menimpa nama, judul, subjudul, badge, ikon, foto thumbnail, dan status aktif dari dashboard.
  if (fallback && fallback.length > 0) {
    const catMap = new Map<string, any>();
    configuredList.forEach((c: any) => {
      if (c && c.id) {
        catMap.set(c.id, c);
      }
    });

    const mergedFallback = fallback
      .filter((fbItem: any) => {
        const matched = catMap.get(fbItem.id);
        return matched ? matched.active !== false : true;
      })
      .map((fbItem: any) => {
        const matched = catMap.get(fbItem.id);
        if (!matched) return fbItem;
        const customImg = matched.image || matched.thumbnailImage || fbItem.img || fbItem.image;
        return {
          ...fbItem,
          name: matched.label || matched.name || fbItem.name,
          label: matched.label || matched.name || fbItem.label || fbItem.name,
          title: matched.title || fbItem.title,
          subtitle: matched.tagline || matched.subtitle || fbItem.subtitle,
          badge: matched.badge !== undefined ? matched.badge : (matched.badgeText !== undefined ? matched.badgeText : fbItem.badge),
          icon: matched.icon || fbItem.icon,
          img: customImg,
          image: customImg,
          targetPackageIds: Array.isArray(matched.targetPackageIds) ? matched.targetPackageIds : (fbItem.targetPackageIds || []),
          sheetCategory: matched.sheetCategory || fbItem.sheetCategory || ''
        };
      });

    // Sertakan kartu kategori baru yang ditambahkan mandiri via dashboard (yang belum ada di fallback bawaan)
    const fallbackIds = new Set(fallback.map((fb: any) => fb.id));
    const extraCategories = configuredList
      .filter((c: any) => c && c.id && !fallbackIds.has(c.id) && c.active !== false)
      .map((c: any) => {
        const customImg = c.image || c.thumbnailImage || '';
        return {
          id: c.id,
          name: c.name || c.label || c.id,
          label: c.label || c.name || c.id,
          title: c.title || `PRICELIST ${(c.name || c.label || c.id).toUpperCase()}`,
          subtitle: c.tagline || c.subtitle || '',
          badge: c.badge !== undefined ? c.badge : (c.badgeText !== undefined ? c.badgeText : ''),
          icon: c.icon || '📸',
          img: customImg,
          image: customImg,
          targetPackageIds: Array.isArray(c.targetPackageIds) ? c.targetPackageIds : [],
          sheetCategory: c.sheetCategory || '',
          colorBg: 'bg-[#faf8f5]',
          colorBorder: 'border-[#e8ddd6]',
          colorText: 'text-[#3A3A3A]'
        };
      });

    return [...mergedFallback, ...extraCategories];
  }

  return configuredList.filter((c: any) => c && c.active !== false);
}

export interface TimeSlotItemConfig {
  time: string;
  maxCapacity?: number;
  allowedServices?: string[];
  shiftName?: string;
  earlyCharge?: number;
  active?: boolean;
  applicableBranches?: string[];
  activeByBranch?: Record<string, boolean>;
}

/**
 * Mengambil daftar konfigurasi slot waktu aktif secara dinamis dari dashboard / studioConfig
 */
export function getActiveTimeSlotObjects(
  cfg?: any,
  branch: string = 'cabang-1',
  serviceType: 'indoor' | 'outdoor' | 'both' = 'indoor'
): TimeSlotItemConfig[] {
  const activeCfg = cfg || currentConfig;
  const rawSlots: any[] = activeCfg?.timeSlots;
  if (!Array.isArray(rawSlots)) return [];

  return rawSlots
    .filter((slot: any) => {
      if (!slot || !slot.time) return false;

      // 1. Filter Cabang Studio
      const branches = slot.applicableBranches || ['cabang-1', 'cabang-2'];
      if (!branches.includes(branch)) return false;

      // 2. Status Aktif (Mendukung toggle aktif per cabang maupun global)
      if (slot.activeByBranch && slot.activeByBranch[branch] !== undefined) {
        if (!slot.activeByBranch[branch]) return false;
      } else if (slot.active === false) {
        return false;
      }

      // 3. Layanan Diizinkan (indoor vs outdoor)
      const allowed = Array.isArray(slot.allowedServices) ? slot.allowedServices : ['indoor'];
      if (serviceType === 'indoor') {
        return allowed.includes('indoor');
      } else if (serviceType === 'outdoor') {
        return allowed.includes('outdoor');
      }
      return allowed.includes('indoor') || allowed.includes('outdoor');
    })
    .sort((a, b) => a.time.localeCompare(b.time));
}

/**
 * Mengambil array string jam slot aktif (contoh: ['07:00', '08:00', '08:30', ...])
 */
export function getActiveTimeSlots(
  cfg?: any,
  branch: string = 'cabang-1',
  serviceType: 'indoor' | 'outdoor' | 'both' = 'indoor',
  isSelfStudio: boolean = false
): string[] {
  const slotObjs = getActiveTimeSlotObjects(cfg, branch, serviceType);
  return slotObjs
    .filter(slot => {
      if (isSelfStudio && slot.time < '08:00') {
        return false;
      }
      return true;
    })
    .map(slot => slot.time);
}

/**
 * Mengambil informasi biaya tambahan jam (ekstra pagi / overtime) dari konfigurasi slot dinamis
 */
export function getSlotExtraChargeInfo(
  slotTime: string,
  cfg?: any,
  branch: string = 'cabang-1',
  is60MinSession: boolean = false
): { fee: number; shiftName: string; isExtra: boolean } {
  if (!slotTime) return { fee: 0, shiftName: '', isExtra: false };

  const norm = slotTime.length === 4 ? '0' + slotTime : slotTime;
  const activeCfg = cfg || currentConfig;
  const rawSlots: any[] = activeCfg?.timeSlots;

  const slot = Array.isArray(rawSlots)
    ? rawSlots.find((s: any) => {
        if (!s || !s.time) return false;
        const sTime = s.time.length === 4 ? '0' + s.time : s.time;
        if (sTime !== norm) return false;
        const branches = s.applicableBranches || ['cabang-1', 'cabang-2'];
        return branches.includes(branch);
      })
    : null;

  let fee = slot && typeof slot.earlyCharge === 'number' ? slot.earlyCharge : 0;
  let shiftName = slot?.shiftName || '';

  // Kasus khusus sesi 60 menit di slot 20:30 (melebihi jam tutup 21:00)
  if (is60MinSession && norm === '20:30') {
    if (fee === 0) {
      fee = 35000;
    }
    if (!shiftName) {
      shiftName = 'Overtime Melebihi Jam Tutup Studio';
    }
  }

  return {
    fee,
    shiftName,
    isExtra: fee > 0
  };
}
