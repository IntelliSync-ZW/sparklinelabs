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
    default: "Sparkline Labs - Custom software for African businesses",
    template: "%s | Sparkline Labs",
  },
  description:
    "We build custom software, internal tools, and SaaS products for Zimbabwean and African businesses. Outcome-tied pricing, manual-first design. We built Propertyzone.",
  keywords: [
    "custom software development Zimbabwe",
    "software developer Harare",
    "Next.js developer Zimbabwe",
    "SaaS development Africa",
    "internal tools Zimbabwe",
    "Paynow integration developer",
    "WhatsApp integration Zimbabwe",
    "real estate platform Zimbabwe",
    "Propertyzone",
    "Sparkline Labs",
  ],
  authors: [{ name: "Sparkline Labs", url: "https://sparklinelabs.co.zw" }],
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
    url: "https://sparklinelabs.co.zw",
    siteName: "Sparkline Labs",
    title: "Sparkline Labs - Custom software for African businesses",
    description:
      "We build custom software for Zimbabwean and African businesses. Outcome-tied pricing, manual-first design. We built Propertyzone.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sparkline Labs - Custom software for African businesses",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparkline Labs - Custom software for African businesses",
    description:
      "Custom software for Zimbabwean and African businesses. Outcome-tied pricing. We built Propertyzone.",
    images: ["/og-image.jpg"],
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
    canonical: "https://sparklinelabs.co.zw",
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sparkline Labs",
  url: "https://sparklinelabs.co.zw",
  logo: "https://sparklinelabs.co.zw/icon.svg",
  foundingDate: "2024",
  description:
    "We build custom software, internal tools, and SaaS products for Zimbabwean and African businesses. Outcome-tied pricing, manual-first design.",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "sales@sparklinelabs.co.zw",
      availableLanguage: ["English"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Harare",
    addressCountry: "ZW",
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
      </head>
      <body className={`font-sans antialiased ${dmSans.className}`}>
        <Header />
        <main className="min-h-screen bg-background">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
