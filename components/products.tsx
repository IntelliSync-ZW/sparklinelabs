import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/sanity/lib/fetch";
import { liveProductsQuery, inDevelopmentProductsQuery } from "@/sanity/lib/queries";

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
    tagline: "Zimbabwe's intent-first property platform",
    description:
      "A property listing and lead management platform for verified buyers, renters, agents, and landlords. Built around intent, not just impressions.",
    status: "live",
    href: "https://www.propzone.co.zw/en/",
    features: [
      "Intent-tagged listings (buy / rent / invest)",
      "Verified buyer and renter profiles",
      "Direct WhatsApp-routed enquiries",
      "Suburb-level content depth with neighbourhood reviews",
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
      "A CRM built around how Zimbabwean agencies actually work: WhatsApp-first lead handling, USD/ZWL dual pricing, manual-first workflows that agents can run before automating.",
  },
  {
    _id: "wa-lead-router",
    name: "WhatsApp Lead Router",
    status: "in_design",
    statusDate: "Q3 2026",
    description:
      "A routing layer that takes inbound WhatsApp enquiries from Propertyzone (and any portal that adds it) and assigns them to agents based on suburb, listing ref, and response SLA.",
  },
];

function statusPill(status: string, statusDate?: string) {
  const label = statusDate ?? status;
  if (status === "live") return { label: `Live${statusDate ? ` · ${statusDate}` : ""}`, color: "text-green-600" };
  if (status === "private_beta") return { label: `Private beta · ${label}`, color: "text-amber-600" };
  return { label: `In design · ${label}`, color: "text-muted-foreground" };
}

export async function Products() {

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
  const isPropertyzone = featured.slug?.current === "propertyzone" || featured._id === "propertyzone";

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
        <div className="bg-background border border-border flex flex-col md:flex-row gap-4 rounded-2xl p-8 md:p-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Live
              </span>
            </div>

            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
              {featured.name}
            </h3>
            {featured.tagline && (
              <p className="text-lg text-muted-foreground mb-4">{featured.tagline}</p>
            )}
            {featured.description && (
              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-6">
                {featured.description}
              </p>
            )}

            {featured.features && featured.features.length > 0 && (
              <ul className="space-y-2 mb-8">
                {featured.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-base">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-4">
              {featured.href && (
                <Button
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
                <Button variant="outline" className="bg-transparent" asChild>
                  <Link href="/work/propertyzone">Read the case study</Link>
                </Button>
              )}
            </div>
          </div>

          {isPropertyzone && (
            <Image
              src="/propertyzone.png"
              loading="lazy"
              width={720}
              height={500}
              alt="Propertyzone Preview Image"
              className="rounded-lg w-full my-auto aspect-video"
            />
          )}
          {!isPropertyzone && featured.screenshot && (
            <Image
              src={featured.screenshot}
              loading="lazy"
              width={720}
              height={500}
              alt={`${featured.name} screenshot`}
              className="rounded-lg w-full my-auto aspect-video object-cover"
            />
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-10" />

        {/* In development */}
        <div className="mb-8">
          <h3 className="text-xl font-medium text-muted-foreground mb-6 uppercase tracking-widest text-sm">
            Currently in development
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {devProducts.map((item) => {
              const pill = statusPill(item.status, item.statusDate);
              return (
                <div key={item._id} className="border border-border rounded-xl p-6">
                  <span className={`text-sm font-medium ${pill.color} mb-3 block`}>
                    {pill.label}
                  </span>
                  <h4 className="text-xl font-semibold mb-2">{item.name}</h4>
                  {(item.description ?? item.tagline) && (
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {item.description ?? item.tagline}
                    </p>
                  )}
                </div>
              );
            })}
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
