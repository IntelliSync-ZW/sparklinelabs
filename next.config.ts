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
  async redirects() {
    return [
      {
        source: "/blog/is-zimbabwean-real-estate-ready-for-ai",
        destination:
          "/blog/proptech-real-estate/zimbabwe-real-estate-ai-readiness-data-infrastructure",
        permanent: true,
      },
      {
        source:
          "/blog/building-for-the-distribution-bottleneck-why-we-engineered-a-whatsapp-first-matching-engine",
        destination:
          "/blog/seo-digital-strategy/building-for-the-distribution-bottleneck-why-we-engineered-a-whatsapp-first-matching-engine",
        permanent: true,
      },
      {
        source: "/blog/winning-the-market-where-connectivity-is-a-luxury",
        destination:
          "/blog/seo-digital-strategy/winning-the-market-where-connectivity-is-a-luxury",
        permanent: true,
      },
      {
        source:
          "/blog/whatsapp-as-a-crm-channel-what-we-learned-from-propertyzone-s-lead-flow",
        destination:
          "/blog/seo-digital-strategy/whatsapp-as-a-crm-channel-what-we-learned-from-propertyzone-s-lead-flow",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
