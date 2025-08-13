import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Medical application specific colors
        "medical-blue": {
          DEFAULT: "var(--medical-blue)",
          dark: "var(--medical-blue-dark)",
        },
        "health-green": {
          DEFAULT: "var(--health-green)",
          dark: "var(--health-green-dark)",
        },
        "medical-purple": "var(--medical-purple)",
        "medical-amber": "var(--medical-amber)",
        // Risk level colors
        "risk-low": "var(--risk-low)",
        "risk-medium": "var(--risk-medium)",
        "risk-high": "var(--risk-high)",
        "risk-critical": "var(--risk-critical)",
        // Status colors
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
        },
        info: {
          DEFAULT: "var(--info)",
          foreground: "var(--info-foreground)",
        },
        // Voice assistant colors
        "voice-active": "var(--voice-active)",
        "voice-listening": "var(--voice-listening)",
        "voice-processing": "var(--voice-processing)",
        // Offline/online indicators
        "offline-indicator": "var(--offline-indicator)",
        "online-indicator": "var(--online-indicator)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Consolas", "monospace"],
        // Medical application specific fonts
        inter: ["Inter", "system-ui", "sans-serif"],
        source: ["Source Sans Pro", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Medical data display sizes
        "health-score": ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        "metric-value": ["1.875rem", { lineHeight: "1.3", fontWeight: "600" }],
        "risk-level": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
      },
      spacing: {
        // Medical layout specific spacing
        section: "var(--spacing-section)",
        card: "var(--spacing-card)",
        // Specific medical component spacing
        "voice-button": "3rem",
        "avatar-size": "6rem",
        "body-diagram": "16rem",
      },
      boxShadow: {
        // Medical themed shadows
        "medical-sm": "var(--shadow-sm)",
        medical: "var(--shadow)",
        "medical-md": "var(--shadow-md)",
        "medical-lg": "var(--shadow-lg)",
        "medical-xl": "var(--shadow-xl)",
        "medical-2xl": "var(--shadow-2xl)",
        // Specific component shadows
        "emergency-alert": "0 4px 12px 0 rgb(239 68 68 / 0.15)",
        "voice-active": "0 0 20px 5px rgb(239 68 68 / 0.3)",
        "health-card": "0 2px 8px 0 rgb(37 99 235 / 0.1)",
      },
      backgroundImage: {
        // Medical gradients
        "gradient-medical": "var(--gradient-medical)",
        "gradient-health": "var(--gradient-health)",
        "gradient-emergency": "var(--gradient-emergency)",
        // Specific component backgrounds
        "hero-medical": "linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(263, 70%, 58%) 100%)",
        "doctor-portal": "linear-gradient(135deg, hsl(263, 70%, 58%) 0%, hsl(217, 91%, 60%) 100%)",
      },
      animation: {
        // Medical specific animations
        heartbeat: "heartbeat 2s ease-in-out infinite",
        "pulse-medical": "pulse-medical 2s ease-in-out infinite",
        "voice-listening": "voice-listening 1.5s ease-in-out infinite",
        // Loading animations for medical data
        "skeleton-medical": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        // Progress animations
        "progress-fill": "progress-fill 2s ease-in-out",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        "pulse-medical": {
          "0%, 100%": { backgroundColor: "hsl(217, 91%, 60%, 0.1)" },
          "50%": { backgroundColor: "hsl(217, 91%, 60%, 0.2)" },
        },
        "voice-listening": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-value, 0%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      // Medical application specific breakpoints
      screens: {
        "medical-sm": "640px", // Mobile medical forms
        "medical-md": "768px", // Tablet medical dashboard
        "medical-lg": "1024px", // Desktop medical interface
        "medical-xl": "1280px", // Large medical displays
        "medical-2xl": "1536px", // Medical workstation displays
      },
      // Medical grid systems
      gridTemplateColumns: {
        "medical-layout": "250px 1fr", // Sidebar + main content
        "medical-dashboard": "repeat(auto-fit, minmax(300px, 1fr))", // Responsive medical cards
        "symptom-checker": "1fr 2fr", // Body diagram + form
        "follow-up": "repeat(auto-fit, minmax(250px, 1fr))", // Follow-up cards
      },
      // Medical component heights
      height: {
        "chat-window": "600px",
        "body-diagram": "400px",
        "medical-card": "fit-content",
        "symptom-form": "auto",
      },
      // Medical component max widths
      maxWidth: {
        "medical-form": "500px",
        "chat-message": "400px",
        "medical-card": "350px",
        "diagnosis-result": "800px",
      },
      // Z-index layers for medical components
      zIndex: {
        "voice-assistant": "50",
        "emergency-alert": "60",
        "offline-banner": "55",
        "medical-modal": "70",
      },
      // Medical component opacity levels
      opacity: {
        "medical-overlay": "0.95",
        "voice-inactive": "0.7",
        "offline-content": "0.6",
      },
      // Medical transitions
      transitionProperty: {
        "medical": "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
        "voice": "background-color, transform, box-shadow",
        "health-metric": "color, background-color, border-color",
      },
      transitionDuration: {
        "medical": "200ms",
        "voice": "150ms",
        "health-metric": "300ms",
      },
      transitionTimingFunction: {
        "medical": "cubic-bezier(0.4, 0, 0.2, 1)",
        "voice": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "health-bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    // Custom plugin for medical utilities
    function({ addUtilities, theme }: { addUtilities: Function, theme: Function }) {
      const medicalUtilities = {
        '.medical-focus': {
          '&:focus': {
            outline: '2px solid ' + theme('colors.medical-blue.DEFAULT'),
            outlineOffset: '2px',
          },
        },
        '.risk-indicator': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.25rem 0.75rem',
          borderRadius: theme('borderRadius.full'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
        },
        '.health-metric': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        },
        '.medical-button': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem 1rem',
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          transition: theme('transitionProperty.medical'),
          transitionDuration: theme('transitionDuration.medical'),
          transitionTimingFunction: theme('transitionTimingFunction.medical'),
        },
        '.voice-button': {
          position: 'relative',
          '&.listening': {
            animation: 'voice-listening 1.5s ease-in-out infinite',
          },
          '&.active': {
            backgroundColor: theme('colors.voice-active'),
            boxShadow: theme('boxShadow.voice-active'),
          },
        },
        '.medical-card': {
          backgroundColor: theme('colors.card.DEFAULT'),
          color: theme('colors.card.foreground'),
          border: '1px solid ' + theme('colors.border'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.medical-sm'),
        },
        '.emergency-mode': {
          backgroundColor: theme('colors.destructive'),
          color: theme('colors.destructive.foreground'),
          borderColor: theme('colors.destructive'),
        },
        '.offline-mode': {
          backgroundColor: theme('colors.offline-indicator'),
          color: '#000',
        },
        '.online-mode': {
          backgroundColor: theme('colors.online-indicator'),
          color: '#fff',
        },
      };
      
      addUtilities(medicalUtilities);
    },
  ],
} satisfies Config;
