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
        slate: {
          950: "#020617", // The deep navy background from your code
        },
        brand: {
          primary: "#2563eb", // blue-600
          accent: "#10b981", // emerald-500
        },
      },
    },
  },
  plugins: [],
};
export default config;
