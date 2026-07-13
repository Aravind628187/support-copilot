import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Sparkles, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';

const items = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/assistant', label: 'AI', icon: Sparkles },
  { to: '/analytics', label: 'Insights', icon: BarChart3 },
];

export function MobileNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-ink-200/80 bg-white/95 backdrop-blur dark:border-ink-800 dark:bg-ink-950/95 sm:hidden"
    >
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold transition-colors duration-200',
              isActive ? 'text-accent-700' : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white',
            )
          }
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
