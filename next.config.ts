import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  images: {
    remotePatterns: [
      // Sanity CDN (primary image delivery)
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      // Sanity CMS direct asset delivery (non-CDN fallback)
      {
        protocol: "https",
        hostname: "*.sanity.io",
        pathname: "/images/**",
      },
      // Sanity asset pipeline (files/assets)
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/files/**",
      },
    ],
  },
};

export default nextConfig;
