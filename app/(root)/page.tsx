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
import { FaqSection } from "@/components/faq";
import { homepageFaqs } from "@/lib/constants";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions Engineering Zimbabwe | Sparkline Labs",
  description:
    "We engineer digital systems for Zimbabwean and African businesses - from operational workflows and integrations to custom platforms, automation and internal tools. The team behind Propertyzone.",
  alternates: { canonical: "https://www.sparklinelabs.co.zw" },
  openGraph: {
    title: "Solutions Engineering Zimbabwe | Sparkline Labs",
    description:
      "We engineer digital systems for Zimbabwean and African businesses - from operational workflows and integrations to custom platforms, automation and internal tools. The team behind Propertyzone.",
    url: "https://www.sparklinelabs.co.zw",
  },
};

const homepageFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homepageFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.sparklinelabs.co.zw/#professionalservice",
  "name": "Sparkline Labs",
  "url": "https://www.sparklinelabs.co.zw",
  "image": "https://www.sparklinelabs.co.zw/og-image.png",
  "description": "We engineer digital systems for Zimbabwean and African businesses - from operational workflows and integrations to custom platforms, automation and internal tools.",
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
          "name": "Digital Systems",
          "description": "Customer-facing platforms, internal systems and business applications designed around the way your organisation actually operates.",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Integrations and automation",
          "description": "Connect the systems you already use, remove repetitive handovers, and automate the parts of your operation that should not require someone copying information between WhatsApp, spreadsheets, email and business software.",
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Solution architecture",
          "description": "Not sure whether you need new software, an integration, automation or a change to the way your existing systems work? We map the problem, design the solution and give you a practical implementation plan before a build begins.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqSchema) }}
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
                Problems we&apos;ve engineered around.
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
                What we&apos;re learning from building in Zimbabwe.
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
              See all our discoveries
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTA />

      <FaqSection
        faqs={homepageFaqs}
        heading="Common questions about Sparkline Labs"
      />
    </>
  );
}
