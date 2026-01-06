import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { Services } from "@/components/services";
import { Products } from "@/components/products";
import { Process } from "@/components/process";
import { WhySparkline } from "@/components/why-sparkline";
import { CTA } from "@/components/cta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sparkline Labs | Software Solutions That Scale Your Business",
  description:
    "Transform your ideas into powerful software. Custom development, SaaS products, and technical consulting to accelerate your growth.",
  alternates: {
    canonical: "https://sparklinelabs.co.zw",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sparkline Labs",
  url: "https://sparklinelabs.co.zw",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://sparklinelabs.co.zw/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Software Development",
  provider: {
    "@type": "Organization",
    name: "Sparkline Labs",
  },
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Software Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom Development",
          description: "Bespoke software built for your unique needs",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "System Integration",
          description: "Connect your tools into one seamless workflow",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Technical Consulting",
          description: "Expert guidance on architecture and strategy",
        },
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Hero />
      <Problem />
      <Services />
      <Products />
      <Process />
      <WhySparkline />
      <CTA />
    </>
  );
}
