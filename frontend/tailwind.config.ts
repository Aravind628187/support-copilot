import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral scale
        ink: {
          50: '#F8F9FB',
          100: '#F1F2F5',
          200: '#E4E7EC',
          300: '#D0D5DD',
          400: '#8891A0',
          500: '#667085',
          600: '#4B5565',
          700: '#344054',
          800: '#1B2130',
          900: '#111827',
          950: '#0B0E14',
        },

        // Primary Accent
        accent: {
          50: '#EEF1FF',
          100: '#DDE3FF',
          400: '#5B72F5',
          500: '#3654D1',
          600: '#2C44B0',
          700: '#243890',
        },

        // AI Accent
        ai: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          400: '#9B7BFA',
          500: '#7C5CFC',
          600: '#6941D6',
        },

        success: {
          50: '#F0FDF4',
          500: '#16A34A',
          600: '#15803D',
        },

        warning: {
          50: '#FFFBEB',
          500: '#D97706',
          600: '#B45309',
        },

        danger: {
          50: '#FEF2F2',
          500: '#DC2626',
          600: '#B91C1C',
        },
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.5' }],
        lg: ['20px', { lineHeight: '1.2' }],
        xl: ['24px', { lineHeight: '1.2' }],
        '2xl': ['32px', { lineHeight: '1.2' }],
        '3xl': ['48px', { lineHeight: '1.2' }],
      },

      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
      },

      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        lg: '12px',
        pill: '9999px',
      },

      transitionDuration: {
        micro: '150ms',
        DEFAULT: '200ms',
        max: '300ms',
      },

      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      maxWidth: {
        prose: '680px',
        shell: '1280px',
      },

      screens: {
        xs: '480px',
      },

      boxShadow: {
        sm: '0 1px 2px rgba(11,14,20,0.06)',
        DEFAULT:
          '0 1px 2px rgba(11,14,20,0.06), 0 4px 12px rgba(11,14,20,0.06)',
        lg:
          '0 4px 12px rgba(11,14,20,0.08), 0 12px 32px rgba(11,14,20,0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;