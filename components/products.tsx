import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/sanity/lib/fetch";
import { liveProductsQuery } from "@/sanity/lib/queries";

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
    tagline: "A digital operating system for Zimbabwean property agencies.",
    description:
      "A property platform engineered around the realities of Zimbabwean property agencies - structured listing data, verified demand, lead routing, agency workflows and direct WhatsApp communication.",
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


export async function Products() {
  let liveProducts: LiveProduct[] = [];

  try {
    liveProducts = await fetchProducts<LiveProduct[]>(liveProductsQuery);
  } catch {
    /* Sanity not configured */
  }

  if (!liveProducts || liveProducts.length === 0) liveProducts = STATIC_LIVE;

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
            Systems we&apos;ve put into production.
          </h2>
        </div>

        {/* Flagship Product */}
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
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
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

        <p className="text-sm text-muted-foreground text-center">
          We ship one product to live status before announcing the next.
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
