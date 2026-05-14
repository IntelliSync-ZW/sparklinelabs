import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { Services } from "@/components/services";
import { Products } from "@/components/products";
import { Process } from "@/components/process";
import { WhySparkline } from "@/components/why-sparkline";
import { CTA } from "@/components/cta";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { latestPostsQuery, allCaseStudiesQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom software for African businesses",
  description:
    "We build custom software, internal tools, and SaaS products for Zimbabwean and African businesses. Outcome-tied pricing, two-week paid discovery, zero retainers. We're the team behind Propertyzone.",
  alternates: { canonical: "https://sparklinelabs.co.zw" },
  openGraph: {
    title: "Sparkline Labs - Custom software for African businesses",
    description:
      "We build for Zimbabwean and African businesses. USD pricing, WhatsApp-first, Paynow on the rails. We built Propertyzone.",
    url: "https://sparklinelabs.co.zw",
  },
};

type Post = {
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
};

type CaseStudy = {
  title: string;
  slug: { current: string };
  industry: string;
  heroImage?: string;
  publishedAt: string;
  productRef?: { name: string; href: string };
};

export const revalidate = 300;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sparkline Labs",
  url: "https://sparklinelabs.co.zw",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Software Development",
  provider: {
    "@type": "Organization",
    name: "Sparkline Labs",
  },
  areaServed: ["Zimbabwe", "Africa"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Software Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom Platforms",
          description:
            "End-to-end web platforms and internal tools built on Next.js and TypeScript",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Integrations and Automation",
          description:
            "WhatsApp, Paynow, EcoCash, and CRM integrations for Zimbabwean businesses",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Technical Strategy",
          description:
            "Architecture, roadmap, and build proposal: flat fee, two-week turnaround",
        },
      },
    ],
  },
};

export default async function Home() {
  let posts: Post[] = [];
  let caseStudies: CaseStudy[] = [];

  try {
    [posts, caseStudies] = await Promise.all([
      client.fetch<Post[]>(latestPostsQuery),
      client.fetch<CaseStudy[]>(allCaseStudiesQuery),
    ]);
  } catch {
    // Sanity not configured yet; sections render with empty state copy
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Hero />
      <Problem />
      <Services />
      <Products />
      <Process />
      <WhySparkline />

      {/* Selected work strip */}
      <section className="py-20 md:py-32 px-6 bg-secondary">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
                Selected work
              </p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
                Things we&apos;ve shipped.
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

          {caseStudies.length === 0 ? (
            <div className="border border-border rounded-2xl p-8">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 mb-4 block">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Live in production
              </span>
              <h3 className="text-2xl font-semibold mb-2">
                Building Propertyzone
              </h3>
              <p className="text-base text-muted-foreground mb-4">
                Zimbabwe&apos;s intent-first property platform. From zero to live agencies in production.
              </p>
              <Link
                href="/work/propertyzone"
                className="inline-flex items-center gap-2 text-base font-medium hover:underline"
              >
                Read case study
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {caseStudies.slice(0, 2).map((study) => (
                <div
                  key={study.slug.current}
                  className="border border-border rounded-2xl p-8"
                >
                  {study.industry && (
                    <span className="text-sm uppercase tracking-widest text-muted-foreground block mb-2">
                      {study.industry}
                    </span>
                  )}
                  <h3 className="text-2xl font-semibold mb-2">{study.title}</h3>
                  <Link
                    href={`/work/${study.slug.current}`}
                    className="inline-flex items-center gap-2 text-base font-medium hover:underline"
                  >
                    Read case study
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}

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

      {/* Latest writing strip */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
                Latest writing
              </p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
                What we&apos;ve been figuring out.
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

          {posts.length === 0 ? (
            <div className="border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground text-lg">
                First post lands this week.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug.current}
                  href={`/blog/${post.slug.current}`}
                  className="group border border-border rounded-xl p-6 hover:border-foreground transition-colors"
                >
                  <time className="text-sm text-muted-foreground block mb-2">
                    {formatDate(post.publishedAt)}
                  </time>
                  <h3 className="text-lg font-semibold mb-2 group-hover:underline">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              See all posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
