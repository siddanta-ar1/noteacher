import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Not using 'output: export' since we have API routes
  // Capacitor will connect to the running Next.js server
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
