/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* neutral gray */
        input: "var(--color-input)", /* subtle blue-gray */
        ring: "var(--color-ring)", /* deep blue */
        background: "var(--color-background)", /* pure white with warmth */
        foreground: "var(--color-foreground)", /* near-black with blue undertones */
        primary: {
          DEFAULT: "var(--color-primary)", /* deep blue */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* calming green */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* clear red */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* subtle blue-gray */
          foreground: "var(--color-muted-foreground)", /* medium gray */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* warm amber */
          foreground: "var(--color-accent-foreground)", /* dark text */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* pure white */
          foreground: "var(--color-popover-foreground)", /* near-black */
        },
        card: {
          DEFAULT: "var(--color-card)", /* pure white */
          foreground: "var(--color-card-foreground)", /* near-black */
        },
        success: {
          DEFAULT: "var(--color-success)", /* positive green */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber */
          foreground: "var(--color-warning-foreground)", /* dark text */
        },
        error: {
          DEFAULT: "var(--color-error)", /* clear red */
          foreground: "var(--color-error-foreground)", /* white */
        },
        surface: {
          DEFAULT: "var(--color-surface)", /* subtle blue-gray */
          foreground: "var(--color-surface-foreground)", /* near-black */
        },
        text: {
          primary: "var(--color-text-primary)", /* near-black */
          secondary: "var(--color-text-secondary)", /* medium gray */
        },
      },
      borderRadius: {
        lg: "12px", /* cards and containers */
        md: "8px", /* interactive elements */
        sm: "6px", /* small components */
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'], /* modern sans-serif for headings */
        body: ['Source Sans 3', 'sans-serif'], /* humanist for body text */
        caption: ['Inter', 'sans-serif'], /* consistent with headings */
        mono: ['JetBrains Mono', 'monospace'], /* monospace for data */
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        "breathing": "breathing 4s ease-in-out infinite",
        "skeleton-pulse": "skeleton-pulse 1.5s ease-in-out infinite",
        "fade-in": "fadeIn 200ms ease-out",
        "slide-up": "slideUp 300ms ease-out",
        "scale-in": "scaleIn 200ms ease-out",
      },
      keyframes: {
        breathing: {
          "0%, 100%": {
            transform: "scale(0.98)",
          },
          "50%": {
            transform: "scale(1.02)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        slideUp: {
          "0%": {
            transform: "translateY(10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        scaleIn: {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '1500': '1500ms',
      },
      boxShadow: {
        'gentle': '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'gentle-hover': '0 2px 6px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.05)',
        'crisis': '0 4px 12px rgba(239, 68, 68, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
      zIndex: {
        'crisis': '1000',
        'navigation': '100',
        'dropdown': '200',
        'modal': '300',
        'avatar': '500',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}