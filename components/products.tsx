import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { WHATSAPP_NUMBER, WHATSAPP_BETA_MESSAGE } from "@/lib/config";

const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_BETA_MESSAGE}`;

const inDevelopment = [
  {
    pill: "Private beta · Q2 2026",
    pillColor: "text-amber-600",
    name: "Agency CRM",
    description:
      "A CRM built around how Zimbabwean agencies actually work: WhatsApp-first lead handling, USD/ZWL dual pricing, manual-first workflows that agents can run before automating.",
  },
  {
    pill: "In design · Q3 2026",
    pillColor: "text-muted-foreground",
    name: "WhatsApp Lead Router",
    description:
      "A routing layer that takes inbound WhatsApp enquiries from Propertyzone (and any portal that adds it) and assigns them to agents based on suburb, listing ref, and response SLA.",
  },
];

export function Products() {
  return (
    <section
      id="products"
      className="py-20 md:py-32 px-6 bg-secondary scroll-mt-20"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            What we&apos;ve built
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            One product live. More on the way.
          </h2>
        </div>

        {/* Featured product */}
        <div className="bg-background border border-border rounded-2xl p-8 md:p-10 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Live
            </span>
          </div>

          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
            Propertyzone
          </h3>
          <p className="text-lg text-muted-foreground mb-4">
            Zimbabwe&apos;s intent-first property platform
          </p>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-6">
            A property listing and lead management platform for verified buyers,
            renters, agents, and landlords. Built around intent, not just
            impressions.
          </p>

          <ul className="space-y-2 mb-8">
            {[
              "Intent-tagged listings (buy / rent / invest)",
              "Verified buyer and renter profiles",
              "Direct WhatsApp-routed enquiries",
              "Suburb-level content depth with neighbourhood reviews",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-base">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4">
            <Button
              className="group bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <a
                href="https://www.propzone.co.zw/en/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit propzone.co.zw
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="outline" className="bg-transparent" asChild>
              <Link href="/work/propertyzone">Read the case study</Link>
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-10" />

        {/* In development */}
        <div className="mb-8">
          <h3 className="text-xl font-medium text-muted-foreground mb-6 uppercase tracking-widest text-sm">
            Currently in development
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {inDevelopment.map((item, index) => (
              <div
                key={index}
                className="border border-border rounded-xl p-6"
              >
                <span className={`text-sm font-medium ${item.pillColor} mb-3 block`}>
                  {item.pill}
                </span>
                <h4 className="text-xl font-semibold mb-2">{item.name}</h4>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          We ship one product to live status before announcing the next. No vapourware.
        </p>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="group text-base bg-transparent border-accent hover:bg-accent px-8 py-6"
            asChild
          >
            <Link href="/products">
              See all products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
