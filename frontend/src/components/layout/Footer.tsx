export function Footer() {
  return (
    <footer className="mt-12 rounded-3xl border border-ink-100/80 bg-white/80 p-5 text-sm text-ink-500 shadow-sm backdrop-blur dark:border-ink-800 dark:bg-ink-950/80 dark:text-ink-400">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-ink-900 dark:text-ink-100">SupportCopilot</p>
          <p>AI Powered Customer Support Platform</p>
        </div>
        <div className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <span>Built for the Digital Heroes Full Stack Developer Trial Task.</span>
          <span>Developed by Aravind Kumar</span>
          <span>Version 1.0.0</span>
          <span>© 2026 SupportCopilot</span>
        </div>
      </div>
      <div className="mt-4 border-t border-ink-100 pt-3 text-xs text-ink-400 dark:border-ink-800">
        Powered by React • Node.js • Express • Prisma • PostgreSQL • Gemini AI
      </div>
    </footer>
  );
}
