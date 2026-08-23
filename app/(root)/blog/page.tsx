import { Suspense } from "react";
import type { Metadata } from "next";
import { BlogList, PostGridSkeleton } from "@/components/blog/blog-list";

export const metadata: Metadata = {
  title: "Engineering for Zimbabwe | Sparkline Labs",
  description:
    "Hard-earned playbooks from building software in Zimbabwe. Paynow and EcoCash integration guides, WhatsApp Business API patterns, USD/ZWL billing architecture, and distribution strategies for African SMEs. Written by the team behind Propertyzone.",
  keywords: [
    "software development Zimbabwe blog",
    "Paynow integration guide",
    "EcoCash API integration",
    "WhatsApp Business API Africa",
    "offline-first web apps Zimbabwe",
    "SaaS distribution Africa",
    "USD ZWL dual currency billing",
    "Zimbabwean tech ecosystem",
    "property technology Zimbabwe",
  ],
  alternates: { canonical: "https://www.sparklinelabs.co.zw/blog" },
  openGraph: {
    title: "Engineering for Zimbabwe | Sparkline Labs",
    description:
      "Paynow guides, WhatsApp infrastructure patterns, and real distribution strategies for the Zimbabwean market.",
    url: "https://www.sparklinelabs.co.zw/blog",
    siteName: "Sparkline Labs",
    locale: "en_ZW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering for Zimbabwe | Sparkline Labs",
    description:
      "How to build and scale software where infrastructure is inconsistent and WhatsApp is the primary channel.",
  },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://www.sparklinelabs.co.zw/blog#blog",
  name: "Sparkline Labs — Engineering for Zimbabwe",
  description:
    "Hard-earned playbooks from building software in Zimbabwe. Paynow and EcoCash integrations, WhatsApp Business API patterns, and distribution strategies that work for African SMEs.",
  url: "https://www.sparklinelabs.co.zw/blog",
  publisher: { "@id": "https://www.sparklinelabs.co.zw/#organization" },
  inLanguage: "en-ZW",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sparklinelabs.co.zw" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.sparklinelabs.co.zw/blog" },
    ],
  },
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">
            Intelligence
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance max-w-3xl">
            Engineering for the Zimbabwean Reality.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Hard-won playbooks from shipping{" "}
            <a
              href="https://www.propzone.co.zw/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Propertyzone
            </a>{" "}
            and high-stakes custom builds. We document how to navigate local
            payment rails, deploy WhatsApp as primary infrastructure, and design
            commercial models that actually capture revenue from African SMEs.
          </p>
        </div>
      </section>

      {/* Blog list — categories + filter + grid */}
      <section className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <Suspense fallback={<PostGridSkeleton />}>
            <BlogList currentPage={page} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
