import { useEffect } from 'react';

export const useAutoHideScrollbar = () => {
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = (e: Event) => {
      const target = (e.target as HTMLElement) || document.body;

      // Add scrolling class to html, body, and target element
      document.documentElement.classList.add('is-scrolling');
      document.body.classList.add('is-scrolling');

      if (target && target instanceof HTMLElement && target !== document.body && target !== document.documentElement) {
        target.classList.add('is-scrolling');
      }

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      // Auto hide scrollbar after 800ms of inactivity
      scrollTimer = setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
        document.body.classList.remove('is-scrolling');

        const activeScrollingElements = document.querySelectorAll('.is-scrolling');
        activeScrollingElements.forEach((el) => {
          el.classList.remove('is-scrolling');
        });
      }, 800);
    };

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);
};
