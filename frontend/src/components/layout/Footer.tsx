import {
  Github,
  Linkedin,
  Mail,
  Globe,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-ink-200/70 bg-gradient-to-br from-white/90 via-white/80 to-ink-50/80 px-5 pb-24 pt-8 text-xs text-ink-600 shadow-[0_-12px_32px_-24px_rgba(15,23,42,0.18)] backdrop-blur dark:border-ink-800 dark:from-ink-950/85 dark:via-ink-950 dark:to-ink-900 dark:text-ink-400 sm:px-8 sm:py-8">
      <div className="mx-auto grid w-full max-w-shell gap-4 sm:grid-cols-[1.5fr_2fr] lg:grid-cols-[1.2fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <p className="text-sm font-semibold text-ink-950 dark:text-white">
            SupportCopilot
          </p>

          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
            AI powered customer support platform for enterprise operations.
          </p>
        </div>

        {/* About */}
        <div className="grid gap-2 text-xs leading-6 text-ink-500 dark:text-ink-400">
          <span>
            Originally developed for the Digital Heroes Full Stack Developer
            Trial Task.
          </span>
          <span>Developed by Aravind Kumar</span>
          <span>B.Tech CSE (AI & ML)</span>
        </div>

        {/* Links */}
        <div className="grid gap-3 text-xs">
          <a
            href="https://aravind-kumar-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-ink-600 transition hover:text-indigo-600 dark:text-ink-300 dark:hover:text-indigo-400"
          >
            <Globe size={16} />
            <span>Portfolio</span>
          </a>

          <a
            href="https://github.com/Aravind628187"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-ink-600 transition hover:text-indigo-600 dark:text-ink-300 dark:hover:text-indigo-400"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/chinthamanuaravindkumar/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-ink-600 transition hover:text-indigo-600 dark:text-ink-300 dark:hover:text-indigo-400"
          >
            <Linkedin size={16} />
            <span>LinkedIn</span>
          </a>

          <a
            href="mailto:chithamanaravind@gmail.com"
            className="flex items-center gap-2 text-ink-600 transition hover:text-indigo-600 dark:text-ink-300 dark:hover:text-indigo-400"
          >
            <Mail size={16} />
            <span>chithamanaravind@gmail.com</span>
          </a>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-shell border-t border-ink-200/80 pt-4 text-xs text-ink-500 dark:border-ink-800 dark:text-ink-400">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>Version 2.0.0 • 2026</span>

          <span>© 2026 SupportCopilot</span>

          <span>
            Powered by React • TypeScript • Node.js • Express • Prisma •
            PostgreSQL • Gemini AI
          </span>
        </div>
      </div>
    </footer>
  );
}
