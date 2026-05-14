import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";

export const metadata: Metadata = {
  // Ensure metadataBase is set in your root layout or here
  title: "Building Zimbabwe’s Most Trusted Property Portal: Propertyzone Case Study",
  description:
    "See how Sparkline Labs solved the trust gap in Zimbabwean real estate. A deep dive into the architecture, verified agent workflows, and ROI of Propertyzone.",
  keywords: [
    "Zimbabwe real estate software",
    "EAC registered property portal development",
    "custom SaaS Zimbabwe",
    "Sparkline Labs case study",
    "Propertyzone architecture",
  ],
  alternates: { 
    canonical: "https://www.sparklinelabs.co.zw/work/propertyzone" 
  },
  openGraph: {
    title: "How We Built Propertyzone: Solving Trust in ZW Real Estate",
    description:
      "A technical and business breakdown of Zimbabwe's intent-first property platform. Architecture, cost-efficiency, and sales outcomes.",
    url: "https://www.sparklinelabs.co.zw/work/propertyzone",
    type: "article",
    publishedTime: "2024-05-13T00:00:00.000Z", // Use actual date
    authors: ["Sparkline Labs"],
    images: [
      {
        url: "/propertyzone.png", // Ensure this is a high-quality summary card
        width: 1200,
        height: 630,
        alt: "Propertyzone Case Study by Sparkline Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Propertyzone: A Case Study in African PropTech",
    description: "Solving the 'low-trust' problem in the Zimbabwean market through intent-first design.",
    images: ["/propertyzone.png"],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Building Zimbabwe’s Most Trusted Property Portal: Propertyzone Case Study",
  description:
    "See how Sparkline Labs solved the trust gap in Zimbabwean real estate. A deep dive into the architecture, verified agent workflows, and ROI of Propertyzone.",
  image: "https://www.sparklinelabs.co.zw/propertyzone.png",
  datePublished: "2026-01-01",
  dateModified: "2026-01-01",
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

export default function PropertyzoneCaseStudy() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Case study
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6 text-balance">
            Building Propertyzone - Zimbabwe&apos;s intent-first property
            platform.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            What we built, what it cost, what we learned, and what&apos;s next.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Live in production
            </span>
            <span>Reading time: ~6 min</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-3xl space-y-16">

          {/* Problem */}
          <section>
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              The problem
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                By late 2025, the two dominant property portals in Zimbabwe had
                captured most of the listing inventory but were optimised for
                impressions, not intent. Agents got dozens of enquiries a day,
                most of them from people who weren&apos;t actually buying or
                renting. Time-wasters.
              </p>
              <p>Three problems compounded:</p>
              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li>
                  No intent signal on enquiries. An agent couldn&apos;t tell,
                  before responding, whether the lead was a serious buyer with
                  budget or a window-shopper.
                </li>
                <li>
                  Listings were thin. Stock photos, missing addresses, no
                  suburb-level context, no school proximity, no borehole status:
                  all the things a Zimbabwean buyer actually cares about.
                </li>
                <li>
                  Agencies were paying flat monthly listing fees regardless of
                  whether they got a single qualified lead.
                </li>
              </ol>
              <p>
                We weren&apos;t trying to replace the incumbents. We were trying
                to give agents a third channel that solved the intent and
                qualification problem, and a pricing model where they paid for
                outcomes, not impressions.
              </p>
            </div>
          </section>

          {/* What we built */}
          <section>
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              What we built
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Propertyzone shipped to production in late February 2026. The core
                components:
              </p>

              <div className="space-y-6 mt-6">
                {[
                  {
                    title: "Intent-tagged listings",
                    body: "Every enquiry on Propertyzone carries an intent flag: buy, rent, invest, or viewing-only. Agents see the intent before they respond, so they can prioritise their pipeline instead of triaging it.",
                  },
                  {
                    title: "Verified buyer and renter profiles",
                    body: "Users sign up before enquiring. Phone, email, and a verified location reduce the volume of throwaway enquiries dramatically.",
                  },
                  {
                    title: "WhatsApp-routed messaging",
                    body: "Every direct enquiry routes to the agent's WhatsApp with the listing reference, intent tag, and qualification data already in the message. The agent never has to ask \"which property?\" on their first reply.",
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
                ].map((item) => (
                  <div key={item.title}>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Outcomes */}
          <section>
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Outcomes
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <ul className="space-y-3 list-disc list-inside ml-4">
                <li>EAC-registered agencies live on the platform</li>
                <li>Verified listings published</li>
                <li>Verified buyer and renter accounts active</li>
                <li>Mobile PageSpeed score improved on listings and detail pages</li>
              </ul>
              <p>
                What we learned: agencies don&apos;t sign up to portals, they
                get onboarded by humans. The onboarding model works only when
                paired with manual listing upload on the agency&apos;s behalf
                during weeks 1 and 2. The friction of &ldquo;publish your
                listings yourself&rdquo; is what kills most onboarding.
              </p>
            </div>
          </section>

          {/* What's next */}
          <section>
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              What&apos;s next
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Expansion to Nigeria is in scoping: a market with similar
                structural problems (impression-optimised portals, low buyer
                intent signal) at roughly 20x the addressable inventory.
              </p>
              <p>
                On the platform itself: the Agency CRM (Q2 2026) and the
                WhatsApp Lead Router (Q3 2026) are both built to interoperate
                with Propertyzone, turning the portal into a lead engine for
                agencies running their own pipelines.
              </p>
              <p>
                Propertyzone is live and accepting agency partners now. Visit{" "}
                <a
                  href="https://www.propzone.co.zw/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 text-foreground"
                >
                  propzone.co.zw
                </a>{" "}
                to see active listings or to apply as an agency.
              </p>
            </div>
          </section>

          {/* Tech and team */}
          <section>
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Tech and team
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 text-base">
              {[
                {
                  label: "Team",
                  value:
                    "Sparkline Labs founders (product strategy + frontend, backend infrastructure, financial and legal)",
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

          {/* End CTA */}
          <section className="border-t border-border pt-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Want this for your business?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-xl">
              We build platforms like Propertyzone for clients with
              category-specific problems. Property, payments, logistics, service
              businesses with pipeline-heavy workflows. Two-week paid discovery.
              Outcome-tied pricing. Zero retainers.
            </p>
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
          </section>
        </div>
      </article>
    </>
  );
}
