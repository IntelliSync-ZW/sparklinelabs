import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { fetchCaseStudies, sanityFetch } from "@/sanity/lib/fetch";
import { caseStudyBySlugQuery, allCaseStudySlugsQuery } from "@/sanity/lib/queries";
import { PortableTextRenderer, type RichTextValue } from "@/components/portable-text";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";
import Link from "next/link";

type CaseStudy = {
  _id: string;
  title: string;
  slug: { current: string };
  summary?: string;
  headline?: string;
  industry?: string;
  clientName?: string;
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
  productRef?: { name: string; slug: { current: string }; href: string };
  seo?: { title?: string; description?: string; ogImage?: string };
};

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await fetchCaseStudies<{ slug: string }[]>(
      allCaseStudySlugsQuery
    );
    return slugs
      .filter((s) => s.slug !== "propertyzone")
      .map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let study: CaseStudy | null = null;
  try {
    study = await sanityFetch<CaseStudy>({
      query: caseStudyBySlugQuery,
      params: { slug },
      tags: ["caseStudy"],
    });
  } catch {
    /* Sanity not configured */
  }

  if (!study) return { title: "Case Study" };

  const baseUrl = "https://www.sparklinelabs.co.zw";
  return {
    title: study.seo?.title ?? study.title,
    description: study.seo?.description ?? study.summary,
    alternates: { canonical: `${baseUrl}/work/${slug}` },
    openGraph: {
      title: study.seo?.title ?? study.title,
      description: study.seo?.description ?? study.summary,
      url: `${baseUrl}/work/${slug}`,
      type: "article",
      publishedTime: study.publishedAt,
      images: study.seo?.ogImage
        ? [{ url: study.seo.ogImage, width: 1200, height: 630 }]
        : study.heroImage?.url
        ? [{ url: study.heroImage.url, width: 1200, height: 630 }]
        : [],
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

  let study: CaseStudy | null = null;
  try {
    study = await sanityFetch<CaseStudy>({
      query: caseStudyBySlugQuery,
      params: { slug },
      tags: ["caseStudy"],
    });
  } catch {
    /* Sanity not configured */
  }

  if (!study) notFound();

  const pageUrl = `https://www.sparklinelabs.co.zw/work/${study.slug.current}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: study.title,
    description: study.summary,
    image: study.heroImage?.url ?? `https://www.sparklinelabs.co.zw/og-image.png`,
    datePublished: study.publishedAt,
    author: {
      "@type": "Organization",
      name: "Sparkline Labs",
      url: "https://www.sparklinelabs.co.zw",
    },
    publisher: {
      "@type": "Organization",
      name: "Sparkline Labs",
      logo: { "@type": "ImageObject", url: "https://www.sparklinelabs.co.zw/icon.svg" },
    },
    isPartOf: { "@id": "https://www.sparklinelabs.co.zw/work#collectionpage" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sparklinelabs.co.zw" },
        { "@type": "ListItem", position: 2, name: "Work", item: "https://www.sparklinelabs.co.zw/work" },
        { "@type": "ListItem", position: 3, name: study.title, item: pageUrl },
      ],
    },
    ...(study.productRef && {
      about: {
        "@type": "SoftwareApplication",
        name: study.productRef.name,
        url: study.productRef.href,
        applicationCategory: "BusinessApplication",
      },
    }),
  };

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
            {study.industry ? `Case study · ${study.industry}` : "Case study"}
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
            {study.publishedAt && (
              <time dateTime={study.publishedAt}>
                {formatDate(study.publishedAt)}
              </time>
            )}
            {study.readingTime && <span>~{study.readingTime} min read</span>}
          </div>
        </div>
      </section>

      {/* Hero image */}
      {study.heroImage?.url && (
        <div className="px-6 mb-16">
          <div className="container mx-auto max-w-3xl">
            <div className="relative w-full overflow-hidden rounded-2xl border border-border">
              <Image
                src={study.heroImage.url}
                alt={study.heroImage.alt ?? study.title}
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

          {/* Outcome metrics */}
          {study.outcomeMetrics && study.outcomeMetrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {study.outcomeMetrics.map((m) => (
                <div
                  key={m.label}
                  className="border border-border rounded-xl p-5 text-center"
                >
                  <p className="text-3xl font-semibold tracking-tight text-foreground">
                    {m.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Problem */}
          {study.problem && study.problem.length > 0 && (
            <section>
              <h2 className="text-3xl font-semibold tracking-tight mb-6">
                The problem
              </h2>
              <PortableTextRenderer value={study.problem as RichTextValue} />
            </section>
          )}

          {/* What we built */}
          {study.solution && study.solution.length > 0 && (
            <section>
              <h2 className="text-3xl font-semibold tracking-tight mb-6">
                What we built
              </h2>
              <PortableTextRenderer value={study.solution as RichTextValue} />
            </section>
          )}

          {/* Outcomes */}
          {study.outcomes && study.outcomes.length > 0 && (
            <section>
              <h2 className="text-3xl font-semibold tracking-tight mb-6">
                Outcomes
              </h2>
              <PortableTextRenderer value={study.outcomes as RichTextValue} />
            </section>
          )}

          {/* Testimonial */}
          {study.testimonialQuote && (
            <blockquote className="border-l-4 border-accent pl-6 py-2 my-8">
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

          {/* What's next */}
          {study.whatsNext && study.whatsNext.length > 0 && (
            <section>
              <h2 className="text-3xl font-semibold tracking-tight mb-6">
                What&apos;s next
              </h2>
              <PortableTextRenderer value={study.whatsNext as RichTextValue} />
            </section>
          )}

          {/* Team */}
          {(study.team || study.started || study.live) && (
            <section>
              <h2 className="text-3xl font-semibold tracking-tight mb-6">
                Team
              </h2>
              <div className="grid sm:grid-cols-3 gap-6 text-base">
                {study.team && (
                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-1">
                      Team
                    </p>
                    <p className="text-foreground">{study.team}</p>
                  </div>
                )}
                {study.started && (
                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-1">
                      Started
                    </p>
                    <p className="text-foreground">{study.started}</p>
                  </div>
                )}
                {study.live && (
                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-1">
                      Live
                    </p>
                    <p className="text-foreground">{study.live}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* End CTA */}
          <section className="border-t border-border pt-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Want this for your business?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-xl">
              We build platforms like this for clients with category-specific
              problems. Property, payments, logistics, service businesses with
              pipeline-heavy workflows. Two-week paid discovery. Outcome-tied
              pricing. Zero retainers.
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
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
