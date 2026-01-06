import type React from "react";
import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sparklinelabs.co.zw"),
  title: {
    default: "Sparkline Labs | Software Solutions That Scale Your Business",
    template: "%s | Sparkline Labs",
  },
  description:
    "We build software that solves real problems. Custom development, SaaS products, and technical consulting to help your business grow faster.",
  keywords: [
    "software development",
    "SaaS products",
    "custom software",
    "web development",
    "mobile apps",
    "API development",
    "technical consulting",
    "startup development",
    "MVP development",
    "software agency",
    "tech consulting",
  ],
  authors: [{ name: "Sparkline Labs", url: "https://sparklinelabs.co.zw" }],
  creator: "Sparkline Labs",
  publisher: "Sparkline Labs",
  category: "Technology",
  classification: "Business",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sparklinelabs.co.zw",
    siteName: "Sparkline Labs",
    title: "Sparkline Labs | Software Solutions That Scale Your Business",
    description:
      "We build software that solves real problems. Custom development, SaaS products, and technical consulting.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sparkline Labs - Software Solutions",
        type: "image/jpeg",
      },
      {
        url: "/og-image-square.jpg",
        width: 600,
        height: 600,
        alt: "Sparkline Labs Logo",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sparklinelabs",
    creator: "@sparklinelabs",
    title: "Sparkline Labs | Software Solutions That Scale Your Business",
    description:
      "We build software that solves real problems. Custom development, SaaS products, and technical consulting.",
    images: {
      url: "/og-image.jpg",
      alt: "Sparkline Labs - Software Solutions",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://sparklinelabs.co.zw",
    languages: {
      "en-US": "https://sparklinelabs.co.zw",
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sparkline Labs",
  },
  applicationName: "Sparkline Labs",
  referrer: "origin-when-cross-origin",
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    other: {
      "msvalidate.01": "bing-verification-code",
    },
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sparkline Labs",
  legalName: "Sparkline Labs Inc.",
  url: "https://sparklinelabs.co.zw",
  logo: "https://sparklinelabs.co.zw/icon.svg",
  foundingDate: "2024",
  description:
    "We build software that solves real problems. Custom development, SaaS products, and technical consulting.",
  sameAs: [
    "https://twitter.com/sparklinelabs",
    "https://linkedin.com/company/sparklinelabs",
    "https://github.com/sparklinelabs",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "hello@sparklinelabs.com",
      availableLanguage: ["English"],
    },
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@sparklinelabs.com",
      availableLanguage: ["English"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
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
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={`font-sans antialiased ${dmSans.className}`}>
        <Header />
        <main className="min-h-screen bg-background">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
