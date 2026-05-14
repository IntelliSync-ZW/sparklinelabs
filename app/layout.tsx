import type React from "react";
import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparklinelabs.co.zw"),
  title: {
    default: "Sparkline Labs | Custom Software for Zimbabwean Businesses",
    template: "%s | Sparkline Labs",
  },
  description:
    "Harare-based software studio building custom platforms, SaaS, and internal tools for Zimbabwean and African businesses. Native Paynow and EcoCash integration, WhatsApp-first architecture, USD billing. The team behind Propertyzone.",
  keywords: [
    "custom software development Zimbabwe",
    "software developer Harare",
    "Next.js developer Zimbabwe",
    "SaaS development Africa",
    "Paynow integration Zimbabwe",
    "EcoCash integration developer",
    "ZimSwitch payment integration",
    "WhatsApp Business API Zimbabwe",
    "real estate platform Zimbabwe",
    "internal tools Zimbabwe",
    "Propertyzone",
    "Sparkline Labs",
  ],
  authors: [{ name: "Sparkline Labs", url: "https://www.sparklinelabs.co.zw" }],
  creator: "Sparkline Labs",
  publisher: "Sparkline Labs",
  category: "Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_ZW",
    url: "https://www.sparklinelabs.co.zw",
    siteName: "Sparkline Labs",
    title: "Sparkline Labs | Custom Software for Zimbabwean Businesses",
    description:
      "Harare-based software studio. Native Paynow, EcoCash, and WhatsApp-first architecture. The team behind Propertyzone.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sparkline Labs - Custom software for African businesses",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparkline Labs | Custom Software for Zimbabwean Businesses",
    description:
      "Harare-based. Paynow, EcoCash, WhatsApp-native. The team behind Propertyzone.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.sparklinelabs.co.zw",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  applicationName: "Sparkline Labs",
  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light dark",
};

const linkedSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.sparklinelabs.co.zw/#website",
      "url": "https://www.sparklinelabs.co.zw",
      "name": "Sparkline Labs",
      "publisher": { "@id": "https://www.sparklinelabs.co.zw/#organization" },
      "alternateName": ["Sparkline"],
    },
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": "https://www.sparklinelabs.co.zw/#organization",
      "name": "Sparkline Labs",
      "legalName": "Sparkline Labs",
      "url": "https://www.sparklinelabs.co.zw",
      "logo": "https://www.sparklinelabs.co.zw/icon.svg",
      "image": "https://www.sparklinelabs.co.zw/og-image.png",
      "foundingDate": "2024",
      "description": "Harare-based software studio building custom platforms, Paynow and EcoCash payment integrations, and WhatsApp-first business tools for Zimbabwean and African enterprises. The team behind Propertyzone.",
      "priceRange": "$$",
      "currenciesAccepted": "USD, ZWL",
      "paymentAccepted": "USD, ZWL, Paynow, EcoCash",
      "knowsAbout": [
        "Paynow payment gateway integration",
        "EcoCash mobile money integration",
        "ZimSwitch interbank payment systems",
        "WhatsApp Business API",
        "Real estate technology Zimbabwe",
        "Property listing platforms",
        "USD/ZWL dual-currency billing",
        "Next.js TypeScript SaaS development",
        "EAC estate agency software",
        "ZESA-resilient offline-first architecture",
        "Internal tooling for Zimbabwean businesses"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Harare",
        "addressRegion": "Harare Province",
        "addressCountry": "ZW",
      },
      "areaServed": [
        { "@type": "Country", "name": "Zimbabwe" },
        { "@type": "Country", "name": "Nigeria" },
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "sales",
          "email": "sales@sparklinelabs.co.zw",
          "availableLanguage": ["English"],
        },
      ],
      "sameAs": [
        "https://www.linkedin.com/company/sparklinelabszw",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(linkedSchema),
          }}
        />
      </head>
      <body className={`font-sans antialiased ${dmSans.className}`}>
        {children}
      </body>
    </html>
  );
}
