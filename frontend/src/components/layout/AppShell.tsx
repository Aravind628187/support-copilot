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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f5f7fb] text-ink-950 dark:bg-[#070a12] dark:text-ink-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_-8%,_rgba(59,130,246,0.16),_transparent_26%),radial-gradient(circle_at_88%_8%,_rgba(124,92,252,0.15),_transparent_24%),radial-gradient(circle_at_60%_90%,_rgba(59,130,246,0.08),_transparent_25%)]" />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} theme={theme} onToggleTheme={toggle} />
        <main className="flex flex-1 overflow-y-auto pb-20 sm:pb-0">
          <div className="relative mx-auto flex min-h-full w-full max-w-[1440px] flex-1 flex-col p-3 sm:p-4 lg:p-5 xl:p-6">
            <div className="flex flex-1 flex-col rounded-[24px] border border-white/80 bg-white/80 shadow-[0_28px_90px_-42px_rgba(15,23,42,0.24)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0e18]/90 dark:shadow-[0_28px_90px_-38px_rgba(0,0,0,0.7)]">
              <div className="relative flex flex-1 flex-col overflow-hidden rounded-[24px]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(59,130,246,0.045)_0%,_rgba(124,92,252,0.035)_45%,_rgba(236,72,153,0.03)_100%)]" />
                <div className="relative flex flex-1 flex-col p-4 sm:p-5 lg:p-6 xl:p-7">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      </div>
      <Footer />
      <MobileNav />
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onToggleTheme={toggle}
      />
    </div>
  );
}
