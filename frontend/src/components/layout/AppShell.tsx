import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { CommandPalette } from '../ui/CommandPalette';
import { useDarkMode } from '../../hooks/useDarkMode';

export function AppShell() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { theme, toggle } = useDarkMode();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-ink-50 text-ink-950 dark:bg-ink-950 dark:text-ink-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.16),_transparent_22%)]" />
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} theme={theme} onToggleTheme={toggle} />
        <main className="flex flex-1 overflow-y-auto pb-20 sm:pb-0">
          <div className="relative mx-auto flex min-h-full w-full max-w-shell flex-1 flex-col p-3 sm:p-4 lg:p-6">
            <div className="flex flex-1 flex-col rounded-[16px] border border-white/80 bg-white/90 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.14)] backdrop-blur dark:border-white/10 dark:bg-ink-950/80 dark:shadow-[0_24px_80px_-40px_rgba(0,0,0,0.45)]">
              <div className="relative flex flex-1 flex-col overflow-hidden rounded-[16px]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(59,130,246,0.05)_0%,_rgba(236,72,153,0.04)_40%,_rgba(79,70,229,0.04)_100%)]" />
                <div className="relative flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
                  <div className="flex-1">
                    <Outlet />
                  </div>
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onToggleTheme={toggle}
      />
    </div>
  );
}
