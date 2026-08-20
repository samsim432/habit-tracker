import { useEffect } from 'react';

export function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key.toLowerCase() === key.toLowerCase() && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback]);
}
