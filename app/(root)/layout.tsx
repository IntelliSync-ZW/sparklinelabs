import type React from "react";
import Script from "next/script";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";


export default function RootPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Header />
        <main className="min-h-screen bg-background">{children}</main>
        <Footer />

        {/* Google Analytics 4 — excluded from /studio */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BYLVWTRZGL"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BYLVWTRZGL');
          `}
        </Script>
    </>
  );
}
