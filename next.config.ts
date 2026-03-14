import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false, // disable dev mode
  experimental: {
    proxyClientMaxBodySize: "20mb",
  },
};

export default nextConfig;
