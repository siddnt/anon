/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Design System Colors
        "primary": "#f5533d",
        "primary-hover": "#e4422c",
        "background-light": "#f8f6f5",
        "background-dashboard": "#FFFDFB",
        "surface": "#FFFFFF",
        "text-main": "#2D3436",
        "text-muted": "#A8B3C4",
        "accent-blue": "#9EE3FB",
        "accent-mint": "#A8E6CF",
        // shadcn compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px",
        "card": "32px",
      },
      boxShadow: {
        'plush': '0 12px 32px -8px rgba(245, 83, 61, 0.3)',
        'card': '0 8px 24px -4px rgba(45, 52, 54, 0.05)',
        'hover-card': '0 16px 32px -4px rgba(45, 52, 54, 0.1)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      animation: {
        'drift-up-1': 'driftUp 20s linear infinite',
        'drift-up-2': 'driftUp 25s linear infinite 5s',
        'drift-up-3': 'driftUp 22s linear infinite 10s',
        'drift-up-4': 'driftUp 28s linear infinite 2s',
        'gradient-pan': 'gradientPan 15s ease infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'bounce-dot': 'bounceDot 1.4s infinite ease-in-out both',
      },
      keyframes: {
        driftUp: {
          '0%': { transform: 'translateY(100vh) rotate(var(--start-rot))' },
          '100%': { transform: 'translateY(-100vh) rotate(var(--end-rot))' },
        },
        gradientPan: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
