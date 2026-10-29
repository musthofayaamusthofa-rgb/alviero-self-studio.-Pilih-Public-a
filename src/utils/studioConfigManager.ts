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
  const configuredPackages: any[] = activeCfg?.studioPackages || activeCfg?.indoorPackages || [];

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
export function getActiveAddOns(cfg?: any, baseAddOns: any[] = []): any[] {
  const activeCfg = cfg || currentConfig;
  const configured = activeCfg?.addOns;
  if (configured && Array.isArray(configured) && configured.length > 0) {
    return configured.filter((a: any) => a.active !== false);
  }
  return baseAddOns;
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

/**
 * Mengambil konfigurasi Photo Strip Customizer
 */
export function getActivePhotoStripConfig(cfg?: any): any {
  const activeCfg = cfg || currentConfig;
  return activeCfg?.photoStripConfig || {
    footerText: 'ALVIERO SELF STUDIO',
    watermarkEnabled: true,
    themes: []
  };
}

/**
 * Mengambil daftar 16 kategori menu paket foto
 */
export function getActiveCategories(cfg?: any, fallback: any[] = []): any[] {
  const activeCfg = cfg || currentConfig;
  if (activeCfg?.categories && Array.isArray(activeCfg.categories) && activeCfg.categories.length > 0) {
    return activeCfg.categories.filter((c: any) => c.active !== false);
  }
  return fallback;
}
