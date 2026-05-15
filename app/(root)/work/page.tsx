import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchCaseStudies } from "@/sanity/lib/fetch";
import { allCaseStudiesQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Case Studies | Software Built for Zimbabwe",
  description:
    "How Sparkline Labs designs, builds, and ships software for the Zimbabwean market. From Propertyzone - an intent-first property platform serving EAC-registered agencies - to custom internal tools. Real problems, verifiable outcomes, documented process.",
  keywords: [
    "software case studies Zimbabwe",
    "Propertyzone case study",
    "custom platform development Zimbabwe",
    "real estate technology Africa",
    "Sparkline Labs work",
  ],
  alternates: { canonical: "https://www.sparklinelabs.co.zw/work" },
  openGraph: {
    title: "Case Studies | Software Built for Zimbabwe | Sparkline Labs",
    description:
      "How we built Propertyzone, custom platforms, and internal tools for Zimbabwean businesses. Real numbers, real outcomes.",
    url: "https://www.sparklinelabs.co.zw/work",
    type: "website",
  },
};

type CaseStudy = {
  title: string;
  slug: { current: string };
  industry?: string;
  clientName?: string;
  heroImage?: string;
  publishedAt?: string;
  productRef?: { name: string; href: string };
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.sparklinelabs.co.zw/work#collectionpage",
  "name": "Case Studies | Sparkline Labs",
  "description": "Software built for the Zimbabwean market. Case studies from custom platform builds, Paynow and EcoCash integrations, and our own products.",
  "url": "https://www.sparklinelabs.co.zw/work",
  "isPartOf": { "@id": "https://www.sparklinelabs.co.zw/#website" },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sparklinelabs.co.zw" },
      { "@type": "ListItem", "position": 2, "name": "Work", "item": "https://www.sparklinelabs.co.zw/work" },
    ],
  },
};

async function CaseStudiesGrid() {
  let caseStudies: CaseStudy[] = [];
  try {
    caseStudies = await fetchCaseStudies<CaseStudy[]>(allCaseStudiesQuery);
  } catch {
    /* Sanity not configured */
  }

  if (caseStudies.length === 0) {
    return (
      <div className="border border-border rounded-2xl overflow-hidden">
        <div className="p-8">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 mb-4 block">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Live in production
          </span>
          <h2 className="text-3xl font-semibold mb-2">Building Propertyzone</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Zimbabwe&apos;s intent-first property platform - real estate tech
            built for the conditions that exist on the ground.
          </p>
          <Link
            href="/work/propertyzone"
            className="inline-flex items-center gap-2 text-base font-medium hover:underline"
          >
            Read the case study
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {caseStudies.map((study) => (
        <div key={study.slug.current} className="border border-border rounded-2xl overflow-hidden">
          {study.heroImage && (
            <div className="relative h-64 w-full">
              <Image src={study.heroImage} alt={study.title} fill className="object-cover" />
            </div>
          )}
          <div className="p-8">
            {study.industry && (
              <span className="text-sm uppercase tracking-widest text-muted-foreground block mb-2">
                {study.industry}
              </span>
            )}
            <h2 className="text-3xl font-semibold mb-4">{study.title}</h2>
            <Link
              href={`/work/${study.slug.current}`}
              className="inline-flex items-center gap-2 text-base font-medium hover:underline"
            >
              Read case study
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function CaseStudiesSkeleton() {
  return (
    <div className="space-y-8">
      {[0, 1].map((i) => (
        <div key={i} className="border border-border rounded-2xl overflow-hidden animate-pulse">
          <div className="h-64 bg-muted w-full" />
          <div className="p-8">
            <div className="h-3 bg-muted rounded w-24 mb-3" />
            <div className="h-7 bg-muted rounded w-2/3 mb-4" />
            <div className="h-4 bg-muted rounded w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Selected work
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance">
            Things we&apos;ve shipped.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Case studies from custom builds and our own products. Real problems,
            real outcomes, real numbers.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <Suspense fallback={<CaseStudiesSkeleton />}>
            <CaseStudiesGrid />
          </Suspense>
        </div>
      </section>
    </>
  );
}
