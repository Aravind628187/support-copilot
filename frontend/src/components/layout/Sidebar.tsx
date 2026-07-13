import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  BookOpen,
  Users,
  ShieldCheck,
  UserRound,
  BarChart3,
  Sparkles,
  FileText,
  CalendarCheck,
  Bell,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const primaryNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/kb', label: 'Knowledge', icon: BookOpen },
];

const secondaryNavItems = [
  { to: '/assistant', label: 'AI Center', icon: Sparkles },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/calendar', label: 'Calendar', icon: CalendarCheck },
  { to: '/integrations', label: 'Integrations', icon: Settings },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const adminNavItems = [
  { to: '/team', label: 'Team', icon: Users },
  { to: '/audit', label: 'Audit Log', icon: ShieldCheck },
];

export function Sidebar() {
  const { user } = useAuth();

  return (
    <nav
      aria-label="Primary"
      className="hidden w-80 shrink-0 overflow-y-auto border-r border-ink-200/80 bg-white/75 p-4 backdrop-blur-xl dark:border-ink-800 dark:bg-ink-950/80 sm:flex"
    >
      <div className="sticky top-0 space-y-4 pb-4">
        <div className="rounded-[28px] border border-ink-100/80 bg-gradient-to-br from-accent-50 to-violet-50 p-4 shadow-sm dark:border-ink-800 dark:from-accent-500/10 dark:to-violet-500/10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-600 text-base font-semibold text-white shadow-lg shadow-accent-600/20">
              S
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-950 dark:text-white">SupportCopilot</p>
              <p className="text-xs uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">Enterprise HQ</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink-600 dark:text-ink-400">
            A unified operations console for your customer support intelligence.
          </p>
        </div>

        <div className="space-y-2">
          {primaryNavItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-accent-50 text-accent-700 shadow-sm shadow-accent-200/60 dark:bg-accent-500/10 dark:text-accent-200'
                    : 'text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-900',
                )
              }
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-ink-100 text-ink-600 dark:bg-ink-900 dark:text-ink-300">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="rounded-[28px] border border-ink-100/80 bg-ink-50/80 p-4 dark:border-ink-800 dark:bg-ink-950/60">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">Workspace status</p>
          <div className="mt-3 grid gap-3">
            <div className="rounded-3xl bg-white/80 p-3 text-sm shadow-sm dark:bg-ink-900/90">
              <p className="text-2xl font-semibold text-ink-950 dark:text-white">{user?.role === 'ADMIN' ? 'Admin' : 'Agent'}</p>
              <p className="text-xs text-ink-500 dark:text-ink-400">Role</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-3 text-sm shadow-sm dark:bg-ink-900/90">
              <p className="text-2xl font-semibold text-ink-950 dark:text-white">{user?.name ? user.name.split(' ').slice(0, 2).join(' ') : 'Team member'}</p>
              <p className="text-xs text-ink-500 dark:text-ink-400">Signed in</p>
            </div>
          </div>
        </div>

        <div className="space-y-1 rounded-[28px] border border-ink-100/80 bg-ink-50/80 p-4 dark:border-ink-800 dark:bg-ink-950/60">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">Operations</p>
          {secondaryNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-3xl px-4 py-3 text-sm transition-all duration-200',
                  isActive
                    ? 'bg-accent-50 text-accent-700 shadow-sm shadow-accent-200/50 dark:bg-accent-500/10 dark:text-accent-200'
                    : 'text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-900',
                )
              }
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-ink-100 text-ink-600 dark:bg-ink-900 dark:text-ink-300">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {user?.role === 'ADMIN' && (
          <div className="space-y-1 rounded-[28px] border border-ink-100/80 bg-ink-50/80 p-4 dark:border-ink-800 dark:bg-ink-950/60">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink-500 dark:text-ink-400">Administration</p>
            {adminNavItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-3xl px-4 py-3 text-sm transition-all duration-200',
                    isActive
                      ? 'bg-accent-50 text-accent-700 shadow-sm shadow-accent-200/50 dark:bg-accent-500/10 dark:text-accent-200'
                      : 'text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-900',
                  )
                }
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-ink-100 text-ink-600 dark:bg-ink-900 dark:text-ink-300">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        )}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              'mt-4 flex items-center gap-3 rounded-3xl border border-ink-100/80 bg-white/95 px-4 py-3 text-sm font-semibold shadow-sm transition-all duration-200 dark:border-ink-800 dark:bg-ink-900/95',
              isActive
                ? 'text-accent-700 dark:text-accent-200'
                : 'text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-900',
            )
          }
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-accent-100 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
