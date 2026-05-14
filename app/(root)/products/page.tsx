import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/sanity/lib/fetch";
import { liveProductsQuery, inDevelopmentProductsQuery } from "@/sanity/lib/queries";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE, WHATSAPP_BETA_MESSAGE, WHATSAPP_NOTIFY_MESSAGE } from "@/lib/config";

type LiveProduct = {
  _id: string;
  name: string;
  slug: { current: string };
  tagline?: string;
  description?: string;
  status: string;
  statusDate?: string;
  href?: string;
  features?: string[];
  screenshot?: string;
};

type DevProduct = {
  _id: string;
  name: string;
  status: string;
  statusDate?: string;
  description?: string;
  tagline?: string;
};

const STATIC_LIVE: LiveProduct[] = [
  {
    _id: "propertyzone",
    name: "Propertyzone",
    slug: { current: "propertyzone" },
    tagline: "Zimbabwe's intent-first property platform.",
    description:
      "Propertyzone is a property listing and lead management platform that connects verified buyers, renters, agents, and landlords. Built around intent, not just impressions. Every enquiry carries a \"what are you here to do\" signal so agents stop drowning in unqualified leads.",
    status: "live",
    statusDate: "2026",
    href: "https://www.propzone.co.zw/en/",
    features: [
      "Intent-tagged listings: buy, rent, invest, viewing-only.",
      "Verified buyer and renter profiles, reducing time-waster enquiries.",
      "Direct agent-client messaging routed to WhatsApp.",
      "Lead qualification and engagement tracking dashboards.",
      "Suburb-level content depth with neighbourhood reviews, school proximity, security info, and a growing real estate glossary.",
      "SEO-optimised listing pages with JSON-LD, OG image generation, and structured data for buy/rent intent.",
    ],
  },
];

const STATIC_DEV: DevProduct[] = [
  {
    _id: "agency-crm",
    name: "Agency CRM",
    status: "private_beta",
    statusDate: "Q2 2026",
    description:
      "A CRM built around how Zimbabwean agencies actually work. WhatsApp-first lead handling, USD/ZWL dual pricing, manual-first workflows that agents can run before automating. Currently in closed beta with 3 agencies.",
  },
  {
    _id: "wa-lead-router",
    name: "WhatsApp Lead Router",
    status: "in_design",
    statusDate: "Q3 2026",
    description:
      "A routing layer that takes inbound WhatsApp enquiries from Propertyzone or any portal that integrates it, and auto-assigns them to agents based on suburb, listing reference number, and response SLA.",
  },
];

export const metadata: Metadata = {
  title: "Products | Propertyzone and More | Sparkline Labs",
  description:
    "Software products built and operated by Sparkline Labs. Propertyzone is Zimbabwe's intent-first property platform, live and serving EAC-registered agencies. Agency CRM and WhatsApp Lead Router in active development. No vapourware.",
  keywords: [
    "Propertyzone Zimbabwe",
    "Zimbabwe real estate platform",
    "EAC registered agency software",
    "agency CRM Zimbabwe",
    "WhatsApp lead routing Zimbabwe",
    "property listing platform Zimbabwe",
    "propzone.co.zw",
    "Sparkline Labs products",
  ],
  alternates: { canonical: "https://www.sparklinelabs.co.zw/products" },
  openGraph: {
    title: "Products | Propertyzone and More | Sparkline Labs",
    description:
      "Propertyzone is live in Zimbabwe, serving EAC-registered agencies. Agency CRM in private beta. WhatsApp Lead Router in design. No vapourware.",
    url: "https://www.sparklinelabs.co.zw/products",
    type: "website",
  },
};

function statusPill(status: string, statusDate?: string) {
  if (status === "live") {
    return { label: `Live${statusDate ? ` · launched ${statusDate}` : ""}`, color: "text-green-600" };
  }
  if (status === "private_beta") {
    return { label: `Private beta · ${statusDate ?? ""}`, color: "text-amber-600" };
  }
  return { label: `In design · ${statusDate ?? ""}`, color: "text-muted-foreground" };
}

export default async function ProductsPage() {
  const waProjectLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;
  const waBetaLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_BETA_MESSAGE}`;
  const waNotifyLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_NOTIFY_MESSAGE}`;

  let liveProducts: LiveProduct[] = [];
  let devProducts: DevProduct[] = [];

  try {
    liveProducts = await fetchProducts<LiveProduct[]>(liveProductsQuery);
    devProducts = await fetchProducts<DevProduct[]>(inDevelopmentProductsQuery);
  } catch {
    /* Sanity not configured */
  }

  if (!liveProducts || liveProducts.length === 0) liveProducts = STATIC_LIVE;
  if (!devProducts || devProducts.length === 0) devProducts = STATIC_DEV;

  const featured = liveProducts[0];
  const isPropertyzone =
    featured.slug?.current === "propertyzone" || featured._id === "propertyzone";

  const propertyzoneSchemaItem = {
    "@type": "ListItem",
    "position": 1,
    "item": {
      "@type": "SoftwareApplication",
      "name": "Propertyzone",
      "alternateName": "propzone.co.zw",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Real Estate Platform",
      "operatingSystem": "Web",
      "url": "https://www.propzone.co.zw/en/",
      "description": "Zimbabwe's intent-first property listing and lead management platform. Connects verified buyers, renters, EAC-registered agents, and landlords. Quality Score ranking based on imagery, verified utility data (borehole yield, solar capacity, ZESA reliability), and listing completeness.",
      "featureList": [
        "Intent-tagged listings: buy, rent, invest, viewing-only",
        "Verified buyer and renter profiles",
        "WhatsApp-routed agent enquiries",
        "Quality Score ranking algorithm",
        "Suburb-level content with ZESA reliability, borehole yield, and solar capacity data",
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "10 free leads for the first 10 agencies; volume-based pricing thereafter.",
      },
      "creator": { "@id": "https://www.sparklinelabs.co.zw/#organization" },
      "inLanguage": "en-ZW",
      "areaServed": { "@type": "Country", "name": "Zimbabwe" },
    },
  };

  const otherProducts = liveProducts
    .filter((p) => p.slug?.current !== "propertyzone" && p._id !== "propertyzone")
    .map((p, i) => ({
      "@type": "ListItem",
      "position": i + 2,
      "item": {
        "@type": "SoftwareApplication",
        "name": p.name,
        "description": p.description ?? p.tagline,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "creator": { "@id": "https://www.sparklinelabs.co.zw/#organization" },
        ...(p.href && { "url": p.href }),
      },
    }));

  const productsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Sparkline Labs Products",
    "url": "https://www.sparklinelabs.co.zw/products",
    "itemListElement": [propertyzoneSchemaItem, ...otherProducts],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              Products
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance">
              One product live.
              <br />
              <span className="text-muted-foreground">
                Two in active development.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
              We build products in the same domains we build for clients:
              property, payments, and pipeline-heavy workflows. Our flagship is
              Propertyzone. Everything else is still in the kitchen, and
              we&apos;ll tell you exactly where it is on the menu.
            </p>
          </div>
        </div>
      </section>

      {/* Featured product */}
      <section id={featured.slug?.current ?? "product"} className="py-20 md:py-32 px-6 bg-secondary scroll-mt-20">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              {statusPill(featured.status, featured.statusDate).label}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-1">
            {featured.name}
          </h2>
          {featured.href && (
            <a
              href={featured.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-muted-foreground hover:text-accent transition-colors underline underline-offset-4 block mb-4"
            >
              {new URL(featured.href).hostname.replace("www.", "")}
            </a>
          )}
          {featured.tagline && (
            <p className="text-xl text-muted-foreground mb-2">{featured.tagline}</p>
          )}

          {featured.description && (
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-4">
              {featured.description}
            </p>
          )}

          {featured.features && featured.features.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">
                  What it does
                </p>
                <ul className="space-y-2">
                  {featured.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-background" />
                      </div>
                      <span className="text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {isPropertyzone && (
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">
                    Who it&apos;s for
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    EAC-registered real estate agencies in Zimbabwe, with active
                    expansion to Nigeria. Property seekers searching for honest,
                    detail-rich listings instead of stock photos and missing
                    addresses.
                  </p>
                </div>
              )}
            </div>
          )}

          {isPropertyzone && !featured.features && (
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">
                Who it&apos;s for
              </p>
              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                EAC-registered real estate agencies in Zimbabwe, with active
                expansion to Nigeria. Property seekers searching for honest,
                detail-rich listings instead of stock photos and missing
                addresses.
              </p>
            </div>
          )}

          {isPropertyzone && featured.screenshot && (
            <div className="relative w-full overflow-hidden rounded-2xl border border-border mb-8">
              <Image
                src={featured.screenshot}
                alt={`${featured.name} screenshot`}
                width={1200}
                height={675}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            {featured.href && (
              <Button
                size="lg"
                className="group bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <a href={featured.href} target="_blank" rel="noopener noreferrer">
                  Visit {new URL(featured.href).hostname.replace("www.", "")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            )}
            {isPropertyzone && (
              <Button variant="outline" size="lg" className="bg-transparent" asChild>
                <Link href="/work/propertyzone">Read the full case study</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* In development */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight mb-10">
            Currently in development
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {devProducts.map((item) => {
              const pill = statusPill(item.status, item.statusDate);
              const isAgencyCRM = item._id === "agency-crm" || item.name === "Agency CRM";
              const isWaRouter = item._id === "wa-lead-router" || item.name === "WhatsApp Lead Router";
              return (
                <div key={item._id} className="border border-border rounded-2xl p-8">
                  <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${pill.color} mb-4 block`}>
                    {pill.label}
                  </span>
                  <h3 className="text-2xl font-semibold mb-3">{item.name}</h3>
                  {(item.description ?? item.tagline) && (
                    <p className="text-base text-muted-foreground leading-relaxed mb-6">
                      {item.description ?? item.tagline}
                    </p>
                  )}
                  {isAgencyCRM && (
                    <Button variant="outline" className="bg-transparent" asChild>
                      <a href={waBetaLink} target="_blank" rel="noopener noreferrer">
                        Request beta access
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {isWaRouter && (
                    <Button variant="outline" className="bg-transparent" asChild>
                      <a href={waNotifyLink} target="_blank" rel="noopener noreferrer">
                        Get notified at launch
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            We ship one product to live status before announcing the next. No
            vapourware.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 md:py-32 px-6 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-balance">
            Need something we haven&apos;t built yet?
          </h2>
          <p className="text-xl md:text-2xl opacity-80 mb-10 max-w-2xl mx-auto">
            Most of our revenue comes from custom builds: internal tools, SaaS
            MVPs, and platform work for businesses that need something specific.
            If you&apos;ve got a project, send us a WhatsApp message and
            we&apos;ll come back within two working hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="group text-base px-8 bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <a href={waProjectLink} target="_blank" rel="noopener noreferrer">
                Start on WhatsApp
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group text-base px-8 bg-transparent border-background/30 text-background hover:bg-background/10"
              asChild
            >
              <Link href="/#process">
                See how we work
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
