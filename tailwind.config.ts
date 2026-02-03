// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          active: "var(--color-primary-active)",
          light: "var(--color-primary-light)",
        },
        navy: {
          DEFAULT: "var(--color-navy)",
          dark: "var(--color-navy-dark)",
        },
        power: {
          teal: {
            DEFAULT: "var(--color-power-teal)",
            hover: "var(--color-power-teal-hover)",
            light: "var(--color-power-teal-light)",
          },
          purple: {
            DEFAULT: "var(--color-power-purple)",
            hover: "var(--color-power-purple-hover)",
            light: "var(--color-power-purple-light)",
          },
          orange: {
            DEFAULT: "var(--color-power-orange)",
            hover: "var(--color-power-orange-hover)",
            light: "var(--color-power-orange-light)",
          },
        },
        success: {
          DEFAULT: "var(--color-success)",
          hover: "var(--color-success-hover)",
          light: "var(--color-success-light)",
          dark: "var(--color-success-dark)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          hover: "var(--color-warning-hover)",
          light: "var(--color-warning-light)",
          dark: "var(--color-warning-dark)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          hover: "var(--color-error-hover)",
          light: "var(--color-error-light)",
          dark: "var(--color-error-dark)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          hover: "var(--color-info-hover)",
          light: "var(--color-info-light)",
          dark: "var(--color-info-dark)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          raised: "var(--color-surface-raised)",
          sunken: "var(--color-surface-sunken)",
        },
        ink: {
          900: "var(--color-ink-900)",
          700: "var(--color-ink-700)",
          500: "var(--color-ink-500)",
          400: "var(--color-ink-400)",
          300: "var(--color-ink-300)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          light: "var(--color-border-light)",
          hover: "var(--color-border-hover)",
          focus: "var(--color-border-focus)",
        },
        // Legacy/Direct mappings if needed, but prefer the above structure
        brand: {
          indigo: "var(--color-primary)", // Remap indigo to primary to fix clash
          green: "var(--color-success)",
          orange: "var(--color-power-orange)",
        },
        // VS Code Explorer Theme

      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      animation: {
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"], // Ensure Inter is used if configured in layout
      }
    },
  },
  plugins: [],
};
export default config;
