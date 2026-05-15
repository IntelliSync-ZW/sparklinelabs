import { Suspense } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { Services } from "@/components/services";
import { Products } from "@/components/products";
import { Process } from "@/components/process";
import { WhySparkline } from "@/components/why-sparkline";
import { CTA } from "@/components/cta";
import { LatestWork, LatestWorkSkeleton } from "@/components/latest-work";
import { LatestPosts, LatestPostsSkeleton } from "@/components/latest-posts";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Software Development Zimbabwe | Sparkline Labs",
  description:
    "Harare-based software studio building platforms, internal tools, and SaaS for Zimbabwean businesses. Native Paynow and EcoCash integration, WhatsApp-first architecture, USD billing. Two-week paid discovery. The team behind Propertyzone.",
  alternates: { canonical: "https://www.sparklinelabs.co.zw" },
  openGraph: {
    title: "Custom Software Development Zimbabwe | Sparkline Labs",
    description:
      "Harare-based. Paynow, EcoCash, WhatsApp-native. Two-week paid discovery, outcome-tied pricing, zero retainers. The team behind Propertyzone.",
    url: "https://www.sparklinelabs.co.zw",
  },
};

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.sparklinelabs.co.zw/#professionalservice",
  "name": "Sparkline Labs",
  "url": "https://www.sparklinelabs.co.zw",
  "image": "https://www.sparklinelabs.co.zw/og-image.png",
  "description": "Harare-based software studio specialising in custom platforms, Paynow and EcoCash payment integrations, and WhatsApp-first business tools for Zimbabwean and African enterprises.",
  "priceRange": "$$",
  "currenciesAccepted": "USD, ZWL",
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
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Software Development Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Custom Platform Development",
          "description": "End-to-end web platforms built for Zimbabwean conditions: ZESA-resilient architecture, offline-capable design, WhatsApp-native workflows, and USD/ZWL dual billing from day one.",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Payment Integration",
          "description": "Native integrations with Paynow, EcoCash, ZimSwitch, and international payment rails for businesses operating in Zimbabwe and across Africa.",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "WhatsApp Business Infrastructure",
          "description": "Lead routing, automated qualification, and client communication systems built on the WhatsApp Business API - the default primary channel for Zimbabwean businesses.",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Technical Discovery",
          "description": "A structured two-week engagement producing architecture docs, a build roadmap, and a flat-fee proposal. Outcome-tied pricing, zero retainers.",
        },
      },
    ],
  },
};

function ProductsSkeleton() {
  return (
    <section className="py-20 md:py-32 px-6 bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-pulse">
          <div className="h-4 bg-muted rounded w-32 mx-auto mb-4" />
          <div className="h-10 bg-muted rounded w-72 mx-auto" />
        </div>
        <div className="bg-background border border-border rounded-2xl p-8 md:p-10 mb-10 animate-pulse">
          <div className="h-4 bg-muted rounded w-12 mb-4" />
          <div className="h-8 bg-muted rounded w-48 mb-3" />
          <div className="h-4 bg-muted rounded w-full max-w-lg mb-2" />
          <div className="h-4 bg-muted rounded w-4/5 max-w-md" />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      <Hero />
      <Problem />
      <Services />
      <Suspense fallback={<ProductsSkeleton />}>
        <Products />
      </Suspense>
      <Process />
      <WhySparkline />

      {/* Selected work */}
      <section className="py-20 md:py-32 px-6 bg-secondary">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
                Selected work
              </p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
                Things we&apos;ve shipped.
              </h2>
            </div>
            <Link
              href="/work"
              className="hidden md:inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              See all work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Suspense fallback={<LatestWorkSkeleton />}>
            <LatestWork />
          </Suspense>
          <div className="mt-6 md:hidden">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              See all work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest writing */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
                Latest writing
              </p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
                What we&apos;ve been figuring out.
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              See all posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Suspense fallback={<LatestPostsSkeleton />}>
            <LatestPosts />
          </Suspense>
          <div className="mt-6 md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              See all posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
