import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  base: 'https://chimeraauto.com/',
  basePath: '',
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true }
};

export default nextConfig;
