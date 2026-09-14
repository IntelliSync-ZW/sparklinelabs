import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/sanity/lib/fetch";
import { liveProductsQuery } from "@/sanity/lib/queries";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";
import { FaqSection } from "@/components/faq";
import { productsFaqs } from "@/lib/constants";

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

const STATIC_LIVE: LiveProduct[] = [
  {
    _id: "propertyzone",
    name: "Propertyzone",
    slug: { current: "propertyzone" },
    tagline: "Zimbabwe's intent-first property platform.",
    description:
      'Propertyzone is a property listing and lead management platform that connects verified buyers, renters, agents, and landlords. Built around intent, not just impressions. Every enquiry carries a "what are you here to do" signal so agents stop drowning in unqualified leads.',
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
    screenshot: "/propertyzone.png",
  },
  {
    _id: "agency-crm",
    name: "Agency CRM",
    slug: { current: "agency-crm" },
    tagline: "The Core Sales Pipeline & Deal Tracking Engine for Propertyzone.",
    description:
      "Agency CRM is built directly into Propertyzone to give EAC-registered real estate agencies a structured pipeline to track deals from initial WhatsApp enquiry through to viewing, negotiation, and commission payout.",
    status: "live",
    statusDate: "2026",
    href: "https://www.propzone.co.zw/en/",
    features: [
      "Direct WhatsApp enquiry inbox with intent tag context (buy, rent, invest).",
      "Visual deal stages: New Lead → Viewing Scheduled → Offer Made → Under Contract → Commission Paid.",
      "Comprehensive deal accounting, commission splitting, and transaction tracking.",
      "Agent performance attribution and lead response velocity metrics.",
      "Available to all verified EAC-registered agency subscribers on Propertyzone.",
    ],
    screenshot: "/crm.png",
  },
];

export const metadata: Metadata = {
  title: "Digital Products Engineered in Zimbabwe | Sparkline Labs",
  description:
    "Explore digital products engineered by Sparkline Labs for real African operating conditions, including Propertyzone, our Zimbabwe property platform.",
  keywords: [
    "Propertyzone Zimbabwe",
    "Agency CRM Zimbabwe",
    "Zimbabwe real estate platform",
    "EAC registered agency software",
    "sales pipeline tracking Zimbabwe",
    "WhatsApp lead routing Zimbabwe",
    "property listing platform Zimbabwe",
    "propzone.co.zw",
    "Sparkline Labs products",
  ],
  alternates: { canonical: "https://www.sparklinelabs.co.zw/products" },
  openGraph: {
    title: "Products | Propertyzone and Agency CRM | Sparkline Labs",
    description:
      "Propertyzone and Agency CRM are live in Zimbabwe, serving EAC-registered agencies. WhatsApp Lead Router in design. No vapourware.",
    url: "https://www.sparklinelabs.co.zw/products",
    type: "website",
  },
};

export default async function ProductsPage() {
  const waProjectLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

  let liveProducts: LiveProduct[] = [];

  try {
    liveProducts = await fetchProducts<LiveProduct[]>(liveProductsQuery);
  } catch {
    /* Sanity not configured */
  }

  if (!liveProducts || liveProducts.length === 0) liveProducts = STATIC_LIVE;

  const propertyzoneSchemaItem = {
    "@type": "ListItem",
    position: 1,
    item: {
      "@type": "SoftwareApplication",
      name: "Propertyzone",
      alternateName: "propzone.co.zw",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Real Estate Platform",
      operatingSystem: "Web",
      url: "https://www.propzone.co.zw/en/",
      description:
        "Zimbabwe's intent-first property listing and lead management platform. Connects verified buyers, renters, EAC-registered agents, and landlords. Quality Score ranking based on imagery, verified utility data (borehole yield, solar capacity, ZESA reliability), and listing completeness.",
      featureList: [
        "Intent-tagged listings: buy, rent, invest, viewing-only",
        "Verified buyer and renter profiles",
        "WhatsApp-routed agent enquiries",
        "Quality Score ranking algorithm",
        "Suburb-level content with ZESA reliability, borehole yield, and solar capacity data",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description:
          "10 free leads for the first 10 agencies; volume-based pricing thereafter.",
      },
      creator: { "@id": "https://www.sparklinelabs.co.zw/#organization" },
      inLanguage: "en-ZW",
      areaServed: { "@type": "Country", name: "Zimbabwe" },
    },
  };

  const crmSchemaItem = {
    "@type": "ListItem",
    position: 2,
    item: {
      "@type": "SoftwareApplication",
      name: "Agency CRM",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "CRM & Sales Pipeline Tracking",
      operatingSystem: "Web",
      url: "https://www.propzone.co.zw/en/",
      description:
        "Core sales pipeline and deal tracking system for Propertyzone subscribers. WhatsApp-first lead handling, stage-based deal progression, and commission tracking.",
      creator: { "@id": "https://www.sparklinelabs.co.zw/#organization" },
      inLanguage: "en-ZW",
      areaServed: { "@type": "Country", name: "Zimbabwe" },
    },
  };

  const otherProducts = liveProducts
    .filter(
      (p) =>
        p.slug?.current !== "propertyzone" &&
        p._id !== "propertyzone" &&
        p._id !== "agency-crm" &&
        p.name !== "Agency CRM",
    )
    .map((p, i) => ({
      "@type": "ListItem",
      position: i + 3,
      item: {
        "@type": "SoftwareApplication",
        name: p.name,
        description: p.description ?? p.tagline,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        creator: { "@id": "https://www.sparklinelabs.co.zw/#organization" },
        ...(p.href && { url: p.href }),
      },
    }));

  const productsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sparkline Labs Products",
    url: "https://www.sparklinelabs.co.zw/products",
    itemListElement: [propertyzoneSchemaItem, crmSchemaItem, ...otherProducts],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: productsFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              Products we&apos;ve engineered from real problems.
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance">
              Two products live.
              <br />
              <span className="text-muted-foreground">
                One in active development.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
              We don&apos;t build products because a technology trend makes them
              possible. We build them when a real operating problem is large
              enough to deserve a system.
            </p>
          </div>
        </div>
      </section>

      {/* Live products */}
      {liveProducts.map((product, idx) => {
        const isPropertyzone =
          product.slug?.current === "propertyzone" ||
          product._id === "propertyzone";
        const isAgencyCRM =
          product.slug?.current === "agency-crm" ||
          product._id === "agency-crm" ||
          product.name === "Agency CRM";

        return (
          <section
            key={product._id}
            id={product.slug?.current ?? `product-${idx}`}
            className={`py-20 md:py-32 px-6 scroll-mt-20 ${idx % 2 === 0 ? "bg-secondary" : "bg-background border-t border-border"}`}
          >
            <div className="container mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  {isAgencyCRM ? "Live · Core Propertyzone Module" : "Live"}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-1">
                {product.name}
              </h2>
              {product.href && (
                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-muted-foreground hover:text-accent transition-colors underline underline-offset-4 block mb-4"
                >
                  {new URL(product.href).hostname.replace("www.", "")}
                </a>
              )}
              {product.tagline && (
                <p className="text-xl text-muted-foreground mb-2">
                  {product.tagline}
                </p>
              )}

              {product.description && (
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-6">
                  {product.description}
                </p>
              )}

              {product.features && product.features.length > 0 && (
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">
                      What it does
                    </p>
                    <ul className="space-y-2">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <div className="shrink-0 w-5 h-5 rounded-full bg-foreground flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-background" />
                          </div>
                          <span className="text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">
                      Who it&apos;s for
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {isAgencyCRM
                        ? "Active EAC-registered agency subscribers on Propertyzone who need structured sales pipeline management, WhatsApp response logs, and automated deal stage tracking."
                        : "EAC-registered real estate agencies in Zimbabwe, with active expansion to Nigeria. Property seekers searching for honest, detail-rich listings instead of stock photos and missing addresses."}
                    </p>
                  </div>
                </div>
              )}

              {product.screenshot && (
                <div className="relative w-full overflow-hidden rounded-2xl border border-border mb-8">
                  <Image
                    src={product.screenshot}
                    alt={`${product.name} screenshot`}
                    width={1200}
                    height={675}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {product.href && (
                  <Button
                    size="lg"
                    className="group bg-accent text-accent-foreground hover:bg-accent/90"
                    asChild
                  >
                    <a
                      href={product.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {isAgencyCRM
                        ? "Access on Propertyzone"
                        : `Visit ${new URL(product.href).hostname.replace("www.", "")}`}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                )}
                {isPropertyzone && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent"
                    asChild
                  >
                    <Link href="/work/propertyzone">
                      Read the full case study
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* Bottom CTA */}
      <section className="py-20 md:py-32 px-6 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-balance text-center">
            Need something we haven&apos;t built yet?
          </h2>
          <p className="text-xl md:text-2xl opacity-80 mb-10 max-w-2xl mx-auto text-center">
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
              <a href="#whatsapp" data-whatsapp-href={waProjectLink}>
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

      <FaqSection faqs={productsFaqs} heading="Questions about our products" />
    </>
  );
}
