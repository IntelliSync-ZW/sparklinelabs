import type React from "react";
import Script from "next/script";

// Focus-mode layout for lesson pages: no marketing header, footer or lead-capture widget.
export default function LearnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}

      <Script src="https://www.googletagmanager.com/gtag/js?id=G-BYLVWTRZGL" strategy="afterInteractive" />
      <Script id="ga4-init-learn" strategy="afterInteractive">
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
