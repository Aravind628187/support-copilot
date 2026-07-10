import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  BookOpen,
  Plus,
  Moon,
  LogOut,
  Search,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface Command {
  id: string;
  label: string;
  group: 'Navigate' | 'Actions';
  icon: React.ComponentType<{ className?: string }>;
  run: () => void | Promise<void>;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onToggleTheme,
}: CommandPaletteProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  


  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const commands = useMemo<Command[]>(
    () => [
      {
        id: 'dashboard',
        label: 'Go to Dashboard',
        group: 'Navigate',
        icon: LayoutDashboard,
        run: () => navigate('/'),
      },
      {
        id: 'tickets',
        label: 'Go to Tickets',
        group: 'Navigate',
        icon: Ticket,
        run: () => navigate('/tickets'),
      },
      {
        id: 'kb',
        label: 'Go to Knowledge Base',
        group: 'Navigate',
        icon: BookOpen,
        run: () => navigate('/kb'),
      },
      {
        id: 'new-ticket',
        label: 'Create New Ticket',
        group: 'Actions',
        icon: Plus,
        run: () => navigate('/tickets?new=1'),
      },
      {
        id: 'theme',
        label: 'Toggle Dark Mode',
        group: 'Actions',
        icon: Moon,
        run: onToggleTheme,
      },
      {
        id: 'logout',
        label: 'Log Out',
        group: 'Actions',
        icon: LogOut,
        run: async () => {
          await logout();
          navigate('/login');
        },
      },
    ],
    [navigate, logout, onToggleTheme]
  );

  const filtered = useMemo(
    () =>
      commands.filter((command) =>
        command.label.toLowerCase().includes(query.toLowerCase())
      ),
    [commands, query]
  );

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const grouped = {
    Navigate: filtered.filter((c) => c.group === 'Navigate'),
    Actions: filtered.filter((c) => c.group === 'Actions'),
  };

  const execute = async (command: Command) => {
    await command.run();
    onClose();
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) =>
        Math.min(prev + 1, filtered.length - 1)
      );
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const command = filtered[activeIndex];

      if (command) {
       await execute(command);
      }
    }
  };

  let currentIndex = -1;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-ink-200 bg-white shadow-2xl dark:border-ink-800 dark:bg-ink-900"
      >
        <div className="flex items-center gap-2 border-b border-ink-200 px-4 dark:border-ink-800">
          <Search className="h-4 w-4 text-ink-400" />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
          />

          <kbd className="rounded border border-ink-200 px-2 py-1 text-xs dark:border-ink-700">
            Esc
          </kbd>
        </div>

        <div
          id="command-list"
          className="max-h-80 overflow-y-auto py-2"
        >
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-ink-400">
              No matching commands
            </div>
          )}

          {(['Navigate', 'Actions'] as const).map((group) => {
            const items = grouped[group];

            if (!items.length) return null;

            return (
              <div key={group}>
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  {group}
                </div>

                {items.map((command) => {
                  currentIndex++;
                  const selected = currentIndex === activeIndex;
                  const Icon = command.icon;

                  return (
                    <button
                      key={command.id}
                      onClick={() => execute(command)}
                      onMouseEnter={() => setActiveIndex(currentIndex)}
                      className={cn(
                        'mx-2 flex w-[calc(100%-16px)] items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        selected
                          ? 'bg-accent-500 text-white'
                          : 'text-ink-800 hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-ink-800'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {command.label}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}