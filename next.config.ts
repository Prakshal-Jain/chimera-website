import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '',
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true }
};

export default nextConfig;
