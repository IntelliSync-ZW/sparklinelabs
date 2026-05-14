import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE, WHATSAPP_BETA_MESSAGE, WHATSAPP_NOTIFY_MESSAGE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Products we've built and run. Propertyzone is our flagship real estate platform, live in Zimbabwe. Two more products in active development.",
  keywords: [
    "Propertyzone",
    "real estate platform Zimbabwe",
    "property listing Zimbabwe",
    "agency CRM Zimbabwe",
    "WhatsApp lead routing",
    "Sparkline Labs products",
  ],
  alternates: { canonical: "https://sparklinelabs.co.zw/products" },
  openGraph: {
    title: "Products | Sparkline Labs",
    description:
      "Propertyzone is live. Agency CRM in private beta. WhatsApp Lead Router in design. No vapourware.",
    url: "https://sparklinelabs.co.zw/products",
  },
};

const propertyZoneFeatures = [
  "Intent-tagged listings: buy, rent, invest, viewing-only.",
  "Verified buyer and renter profiles, reducing time-waster enquiries.",
  "Direct agent-client messaging routed to WhatsApp.",
  "Lead qualification and engagement tracking dashboards.",
  "Suburb-level content depth (Pamusha) with neighbourhood reviews, school proximity, security info, and a growing real estate glossary.",
  "SEO-optimised listing pages with JSON-LD, OG image generation, and structured data for buy/rent intent.",
];

const productsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "SoftwareApplication",
        name: "Propertyzone",
        description:
          "A property listing and lead management platform connecting verified buyers, renters, agents, and landlords in Zimbabwe.",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://propzone.co.zw",
      },
    },
  ],
};

export default function ProductsPage() {
  const waProjectLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;
  const waBetaLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_BETA_MESSAGE}`;
  const waNotifyLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_NOTIFY_MESSAGE}`;

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

      {/* Propertyzone featured */}
      <section id="propertyzone" className="py-20 md:py-32 px-6 bg-secondary scroll-mt-20">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Live - launched 2025
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-1">
            Propertyzone
          </h2>
          <a
            href="https://propzone.co.zw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-muted-foreground hover:text-accent transition-colors underline underline-offset-4 block mb-4"
          >
            propzone.co.zw
          </a>
          <p className="text-xl text-muted-foreground mb-2">
            Zimbabwe&apos;s intent-first property platform.
          </p>

          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-4">
            Propertyzone is a property listing and lead management platform that
            connects verified buyers, renters, agents, and landlords. Built
            around intent, not just impressions. Every enquiry carries a
            &ldquo;what are you here to do&rdquo; signal so agents stop drowning
            in unqualified leads.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">
                What it does
              </p>
              <ul className="space-y-2">
                {propertyZoneFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground flex items-center justify-center mt-0.5">
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
                EAC-registered real estate agencies in Zimbabwe, with active
                expansion to Nigeria. Property seekers searching for honest,
                detail-rich listings instead of stock photos and missing
                addresses.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="group bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <a
                href="https://propzone.co.zw"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit propzone.co.zw
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent" asChild>
              <Link href="/work/propertyzone">Read the full case study</Link>
            </Button>
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
            {/* Agency CRM */}
            <div className="border border-border rounded-2xl p-8">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 mb-4 block">
                Private beta - Q2 2026
              </span>
              <h3 className="text-2xl font-semibold mb-3">Agency CRM</h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                A CRM built around how Zimbabwean agencies actually work.
                WhatsApp-first lead handling, USD/ZWL dual pricing, manual-first
                workflows that agents can run before automating. Currently in
                closed beta with 3 agencies.
              </p>
              <Button variant="outline" className="bg-transparent" asChild>
                <a href={waBetaLink} target="_blank" rel="noopener noreferrer">
                  Request beta access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* WhatsApp Lead Router */}
            <div className="border border-border rounded-2xl p-8">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground mb-4 block">
                In design - Q3 2026
              </span>
              <h3 className="text-2xl font-semibold mb-3">
                WhatsApp Lead Router
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                A routing layer that takes inbound WhatsApp enquiries from
                Propertyzone or any portal that integrates it, and auto-assigns
                them to agents based on suburb, listing reference number, and
                response SLA.
              </p>
              <Button variant="outline" className="bg-transparent" asChild>
                <a href={waNotifyLink} target="_blank" rel="noopener noreferrer">
                  Get notified at launch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
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
