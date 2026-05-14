import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { caseStudyBySlugQuery } from "@/sanity/lib/queries";
import { PortableTextRenderer, type RichTextValue } from "@/components/portable-text";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Building Zimbabwe's Most Trusted Property Portal: Propertyzone Case Study",
  description:
    "See how Sparkline Labs solved the trust gap in Zimbabwean real estate. A deep dive into the architecture, verified agent workflows, and ROI of Propertyzone.",
  keywords: [
    "Zimbabwe real estate software",
    "EAC registered property portal development",
    "custom SaaS Zimbabwe",
    "Sparkline Labs case study",
    "Propertyzone architecture",
  ],
  alternates: { canonical: "https://www.sparklinelabs.co.zw/work/propertyzone" },
  openGraph: {
    title: "How We Built Propertyzone: Solving Trust in ZW Real Estate",
    description:
      "A technical and business breakdown of Zimbabwe's intent-first property platform. Architecture, cost-efficiency, and sales outcomes.",
    url: "https://www.sparklinelabs.co.zw/work/propertyzone",
    type: "article",
    publishedTime: "2026-05-01T00:00:00.000Z",
    authors: ["Sparkline Labs"],
    images: [
      {
        url: "/propertyzone.png",
        width: 1200,
        height: 630,
        alt: "Propertyzone Case Study by Sparkline Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Propertyzone: A Case Study in African PropTech",
    description:
      "Solving the low-trust problem in the Zimbabwean market through intent-first design.",
    images: ["/propertyzone.png"],
  },
};

type CaseStudy = {
  _id: string;
  title: string;
  slug: { current: string };
  summary?: string;
  headline?: string;
  publishedAt?: string;
  readingTime?: number;
  team?: string;
  started?: string;
  live?: string;
  heroImage?: { url: string; alt?: string };
  problem?: unknown[];
  solution?: unknown[];
  outcomes?: unknown[];
  outcomeMetrics?: { value: string; label: string }[];
  whatsNext?: unknown[];
  testimonialQuote?: string;
  testimonialAuthor?: string;
  seo?: { title?: string; description?: string; ogImage?: string };
};

// Static fallback sections shown when Sanity entry doesn't exist yet
const STATIC_SECTIONS = [
  {
    heading: "The problem",
    items: [
      {
        body: "By late 2025, the two dominant property portals in Zimbabwe had captured most of the listing inventory but were optimised for impressions, not intent. Agents got dozens of enquiries a day, most of them from people who weren't actually buying or renting. Three problems compounded: no intent signal on enquiries, thin listings with missing suburb-level context, and agencies paying flat monthly fees regardless of qualified leads received.",
      },
    ],
  },
  {
    heading: "What we built",
    items: [
      {
        title: "Intent-tagged listings",
        body: "Every enquiry carries an intent flag: buy, rent, invest, or viewing-only. Agents see the intent before they respond, so they can prioritise their pipeline instead of triaging it.",
      },
      {
        title: "Verified buyer and renter profiles",
        body: "Users sign up before enquiring. Phone, email, and a verified location reduce the volume of throwaway enquiries dramatically.",
      },
      {
        title: "WhatsApp-routed messaging",
        body: "Every direct enquiry routes to the agent's WhatsApp with the listing reference, intent tag, and qualification data already in the message. The agent never has to ask which property on their first reply.",
      },
      {
        title: "Where to Live",
        body: "Suburb-level content depth: neighbourhood reviews covering security, schools, water reliability, ZESA reliability, distance to CBD, and amenities. Plus an 80-plus term Zimbabwe real estate glossary with alphabet navigation, JSON-LD structured data, and client-side search.",
      },
      {
        title: "Performance",
        body: "The mobile PageSpeed score moved meaningfully across both the listings and property detail pages. LCP optimisation on the hero, caching, lazy-loading, and dynamic imports on everything below the fold.",
      },
      {
        title: "Pricing model",
        body: "The first 10 agencies on the platform receive 10 free verified leads. After that, pricing is volume-based. All active Agent Accounts have equal access to the platform's professional toolset, analytics, and security features regardless of plan size. We do not sell premium placement packages: we sell listing capacity. Ranking is earned through Quality Score. Listings with high-resolution imagery, comprehensive descriptions, and verified utility data (borehole yield, solar capacity, ZESA reliability) naturally outrank incomplete listings. Purchasing higher volume plans does not bypass this quality requirement. The integrity of data provided to buyers is the product.",
      },
    ],
  },
  {
    heading: "Outcomes",
    items: [
      {
        body: "EAC-registered agencies live on the platform. Verified listings published. Verified buyer and renter accounts active. Mobile PageSpeed score improved on listings and detail pages.",
      },
      {
        body: "What we learned: agencies don't sign up to portals, they get onboarded by humans. The onboarding model works only when paired with manual listing upload on the agency's behalf during weeks 1 and 2. The friction of publish your listings yourself is what kills most onboarding.",
      },
    ],
  },
  {
    heading: "What's next",
    items: [
      {
        body: "Expansion to Nigeria is in scoping: a market with similar structural problems at roughly 20x the addressable inventory.",
      },
      {
        body: "The Agency CRM (Q2 2026) and the WhatsApp Lead Router (Q3 2026) are both built to interoperate with Propertyzone, turning the portal into a lead engine for agencies running their own pipelines.",
      },
    ],
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Building Zimbabwe's Most Trusted Property Portal: Propertyzone Case Study",
  description:
    "See how Sparkline Labs solved the trust gap in Zimbabwean real estate.",
  image: "https://www.sparklinelabs.co.zw/propertyzone.png",
  datePublished: "2026-05-01",
  author: {
    "@type": "Organization",
    name: "Sparkline Labs",
    url: "https://www.sparklinelabs.co.zw",
  },
  publisher: {
    "@type": "Organization",
    name: "Sparkline Labs",
    logo: {
      "@type": "ImageObject",
      url: "https://www.sparklinelabs.co.zw/icon.svg",
    },
  },
  about: {
    "@type": "SoftwareApplication",
    name: "Propertyzone",
    url: "https://www.propzone.co.zw/en/",
    applicationCategory: "BusinessApplication",
  },
};

export default async function PropertyzoneCaseStudy() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

  let study: CaseStudy | null = null;
  try {
    study = await sanityFetch<CaseStudy>({
      query: caseStudyBySlugQuery,
      params: { slug: "propertyzone" },
      tags: ["caseStudy"],
    });
  } catch {
    /* Sanity not configured yet — static fallback below */
  }

  // Sanity-driven render
  if (study) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <section className="pt-32 pb-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              Case study
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6 text-balance">
              {study.title}
            </h1>
            {study.headline && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {study.headline}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Live in production
              </span>
              {study.readingTime && <span>~{study.readingTime} min read</span>}
            </div>
          </div>
        </section>

        {study.heroImage?.url && (
          <div className="px-6 mb-16">
            <div className="container mx-auto max-w-3xl">
              <div className="relative w-full overflow-hidden rounded-2xl border border-border">
                <Image
                  src={study.heroImage.url}
                  alt={study.heroImage.alt ?? "Propertyzone"}
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        )}

        <article className="pb-20 md:pb-32 px-6">
          <div className="container mx-auto max-w-3xl space-y-16">
            {study.outcomeMetrics && study.outcomeMetrics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {study.outcomeMetrics.map((m) => (
                  <div key={m.label} className="border border-border rounded-xl p-5 text-center">
                    <p className="text-3xl font-semibold tracking-tight">{m.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            )}
            {study.problem && study.problem.length > 0 && (
              <section>
                <h2 className="text-3xl font-semibold tracking-tight mb-6">The problem</h2>
                <PortableTextRenderer value={study.problem as RichTextValue} />
              </section>
            )}
            {study.solution && study.solution.length > 0 && (
              <section>
                <h2 className="text-3xl font-semibold tracking-tight mb-6">What we built</h2>
                <PortableTextRenderer value={study.solution as RichTextValue} />
              </section>
            )}
            {study.outcomes && study.outcomes.length > 0 && (
              <section>
                <h2 className="text-3xl font-semibold tracking-tight mb-6">Outcomes</h2>
                <PortableTextRenderer value={study.outcomes as RichTextValue} />
              </section>
            )}
            {study.testimonialQuote && (
              <blockquote className="border-l-4 border-accent pl-6 py-2">
                <p className="text-xl italic text-muted-foreground leading-relaxed mb-3">
                  &ldquo;{study.testimonialQuote}&rdquo;
                </p>
                {study.testimonialAuthor && (
                  <cite className="text-sm font-medium text-foreground not-italic">
                    {study.testimonialAuthor}
                  </cite>
                )}
              </blockquote>
            )}
            {study.whatsNext && study.whatsNext.length > 0 && (
              <section>
                <h2 className="text-3xl font-semibold tracking-tight mb-6">What&apos;s next</h2>
                <PortableTextRenderer value={study.whatsNext as RichTextValue} />
              </section>
            )}
            {(study.team || study.started || study.live) && (
              <section>
                <h2 className="text-3xl font-semibold tracking-tight mb-6">Team</h2>
                <div className="grid sm:grid-cols-3 gap-6 text-base">
                  {[
                    { label: "Team", value: study.team },
                    { label: "Started", value: study.started },
                    { label: "Live", value: study.live },
                  ]
                    .filter((i) => i.value)
                    .map((item) => (
                      <div key={item.label}>
                        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-1">
                          {item.label}
                        </p>
                        <p className="text-foreground">{item.value}</p>
                      </div>
                    ))}
                </div>
              </section>
            )}
            <EndCTA waLink={waLink} />
          </div>
        </article>
      </>
    );
  }

  // Static fallback — shown before Sanity is populated
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Case study
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6 text-balance">
            Building Propertyzone - Zimbabwe&apos;s intent-first property platform.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            What we built, what it cost, what we learned, and what&apos;s next.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Live in production
            </span>
            <span>~6 min read</span>
          </div>
        </div>
      </section>

      <div className="px-6 mb-16">
        <div className="container mx-auto max-w-3xl">
          <div className="relative w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src="/propertyzone.png"
              alt="Propertyzone listing interface"
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <article className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-3xl space-y-16">
          {STATIC_SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="text-3xl font-semibold tracking-tight mb-6">
                {section.heading}
              </h2>
              <div className="space-y-6">
                {section.items.map((item, i) => (
                  <div key={i}>
                    {"title" in item && item.title && (
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                    )}
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-3xl font-semibold tracking-tight mb-6">Team</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-base">
              {[
                {
                  label: "Team",
                  value: "Sparkline Labs founders (product strategy + frontend, backend infrastructure, financial and legal)",
                },
                { label: "Started", value: "2025" },
                { label: "Live", value: "2026" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className="text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <EndCTA waLink={waLink} />
        </div>
      </article>
    </>
  );
}

function EndCTA({ waLink }: { waLink: string }) {
  return (
    <section className="border-t border-border pt-12">
      <h2 className="text-3xl font-semibold tracking-tight mb-4">
        Want this for your business?
      </h2>
      <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-xl">
        We build platforms like Propertyzone for clients with category-specific
        problems. Property, payments, logistics, service businesses with
        pipeline-heavy workflows. Two-week paid discovery. Outcome-tied pricing.
        Zero retainers.
      </p>
      <div className="flex flex-wrap gap-4">
        <Button
          size="lg"
          className="group bg-accent text-accent-foreground hover:bg-accent/90"
          asChild
        >
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            Book a call on WhatsApp
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
        <Button variant="outline" size="lg" className="bg-transparent" asChild>
          <Link href="/work">All case studies</Link>
        </Button>
        <Button variant="outline" size="lg" className="bg-transparent" asChild>
          <a
            href="https://www.propzone.co.zw/en/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit propzone.co.zw
          </a>
        </Button>
      </div>
    </section>
  );
}
