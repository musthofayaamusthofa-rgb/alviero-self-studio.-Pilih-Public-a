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
