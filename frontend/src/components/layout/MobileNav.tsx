import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

const items = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/kb', label: 'Docs', icon: BookOpen },
];

export function MobileNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900 sm:hidden"
    >
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium min-h-[44px]',
              isActive ? 'text-accent-600 dark:text-accent-400' : 'text-ink-400',
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
