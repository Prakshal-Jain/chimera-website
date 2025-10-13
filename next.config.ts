import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  base: 'https://chimeraauto.com/',
  basePath: '',
  // Removed output: "export" to allow dynamic API routes
  reactStrictMode: true,
  images: { unoptimized: true }
};

export default nextConfig;
