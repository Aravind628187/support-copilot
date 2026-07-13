export function Footer() {
  return (
    <footer className="mt-8 rounded-[16px] border border-ink-200/70 bg-gradient-to-br from-white/90 via-white/80 to-ink-50/80 p-4 text-xs text-ink-600 shadow-[0_12px_32px_-18px_rgba(15,23,42,0.12)] backdrop-blur dark:border-ink-800 dark:from-ink-950/85 dark:via-ink-950 dark:to-ink-900 dark:text-ink-400">
      <div className="grid gap-4 sm:grid-cols-[1.5fr_2fr] lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-sm font-semibold text-ink-950 dark:text-white">SupportCopilot</p>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
            AI powered customer support platform for enterprise operations.
          </p>
        </div>
        <div className="grid gap-2 text-xs leading-6 text-ink-500 dark:text-ink-400">
          <span>Originally developed for the Digital Heroes Full Stack Developer Trial Task.</span>
          <span>Developed by Aravind Kumar</span>
          <span>B.Tech CSE (AI & ML)</span>
        </div>
        <div className="grid gap-2 text-xs leading-6 text-ink-500 dark:text-ink-400">
          <span>Portfolio</span>
          <span>GitHub</span>
          <span>LinkedIn</span>
          <span>Email</span>
        </div>
      </div>
      <div className="mt-6 border-t border-ink-200/80 pt-4 text-xs text-ink-500 dark:border-ink-800 dark:text-ink-400">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>Current Version • 2026</span>
          <span>© 2026 SupportCopilot</span>
          <span>Powered by React • TypeScript • Node.js • Express • Prisma • PostgreSQL • Gemini AI</span>
        </div>
      </div>
    </footer>
  );
}
