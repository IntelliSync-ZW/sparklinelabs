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
    title: "Sparkline Labs - Custom software for African businesses",
    description:
      "We build custom software for Zimbabwean and African businesses. Outcome-tied pricing, manual-first design. We built Propertyzone.",
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
    title: "Sparkline Labs - Custom software for African businesses",
    description:
      "Custom software for Zimbabwean and African businesses. Outcome-tied pricing. We built Propertyzone.",
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
      "@id": "https://sparklinelabs.co.zw/#website",
      "url": "https://sparklinelabs.co.zw",
      "name": "Sparkline Labs", // This is the trigger for the Site Name
      "publisher": {
        "@id": "https://sparklinelabs.co.zw/#organization"
      },
      "alternateName": ["Sparkline"], // Optional: Helps Google understand shorthand
    },
    {
      "@type": "Organization",
      "@id": "https://sparklinelabs.co.zw/#organization",
      "name": "Sparkline Labs",
      "url": "https://sparklinelabs.co.zw",
      "logo": "https://sparklinelabs.co.zw/icon.svg",
      "foundingDate": "2024",
      "description": "We build custom software, internal tools, and SaaS products for Zimbabwean and African businesses. Outcome-tied pricing, manual-first design.",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "sales",
          "email": "sales@sparklinelabs.co.zw",
          "availableLanguage": ["English"],
        },
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Harare",
        "addressCountry": "ZW",
      },
      // Add social links here if you have them for the agency
      "sameAs": [
        "https://www.linkedin.com/company/sparklinelabszw", 
      ],
    }
  ]
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
