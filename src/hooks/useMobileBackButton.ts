import { useEffect, useRef } from 'react';

export interface UseMobileBackButtonOptions {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
  hash?: string;
  enabled?: boolean;
}

/**
 * Custom Hook untuk menangani tombol Back fisik / Swipe Back pada perangkat mobile (PWA Experience).
 *
 * Alur Kerja:
 * 1. Saat isOpen bernilai true, hook mendorong (pushState) state ke dalam history browser.
 * 2. Jika user menekan tombol Back di HP (popstate), modal ditutup via onClose() tanpa keluar dari web.
 * 3. Jika user menutup modal via tombol UI (tombol 'X', batal, dll), hook otomatis memanggil
 *    history.back() agar stack history browser tetap sinkron dan bersih.
 */
export function useMobileBackButton(
  isOpenOrOptions: boolean | UseMobileBackButtonOptions,
  onCloseArg?: () => void,
  idArg: string = 'modal'
) {
  const options: UseMobileBackButtonOptions =
    typeof isOpenOrOptions === 'boolean'
      ? {
          isOpen: isOpenOrOptions,
          onClose: onCloseArg || (() => {}),
          id: idArg,
          enabled: true,
        }
      : {
          enabled: true,
          id: 'modal',
          ...isOpenOrOptions,
        };

  const { isOpen, onClose, id = 'modal', hash, enabled = true } = options;

  // Menyimpan status apakah state history pernah didorong oleh instance modal ini
  const isPushedRef = useRef<boolean>(false);
  // Menandai jika penutupan dipicu oleh event popstate (tombol back HP)
  const isPoppedByBackButtonRef = useRef<boolean>(false);
  // Menyimpan referensi callback onClose terbaru untuk mencegah stale closures
  const onCloseRef = useRef<() => void>(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return;

    if (isOpen) {
      // Reset flag popstate saat modal dibuka
      isPoppedByBackButtonRef.current = false;

      const stateData = {
        isAlvieroModal: true,
        modalId: id,
        timestamp: Date.now(),
      };

      const targetHash = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';
      const targetUrl = targetHash
        ? `${window.location.pathname}${window.location.search}${targetHash}`
        : window.location.href;

      // 1. Dorong state baru ke history stack browser
      window.history.pushState(stateData, '', targetUrl);
      isPushedRef.current = true;

      // 2. Dengarkan event popstate saat user menekan tombol back fisik / gesture swipe back
      const handlePopState = () => {
        if (isPushedRef.current) {
          // Tandai bahwa modal ditutup karena event popstate dari HP
          isPoppedByBackButtonRef.current = true;
          isPushedRef.current = false;
          onCloseRef.current();
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);

        // 3. Jika modal ditutup oleh tombol 'X' atau klik backdrop (bukan karena tombol back HP),
        // panggil history.back() secara manual agar tumpukan history tetap sinkron dan bersih.
        if (isPushedRef.current) {
          isPushedRef.current = false;
          if (!isPoppedByBackButtonRef.current) {
            window.history.back();
          }
        }
      };
    }
  }, [isOpen, id, hash, enabled]);
}

export default useMobileBackButton;
