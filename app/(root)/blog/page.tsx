import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchPosts } from "@/sanity/lib/fetch";
import { allPostsQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      "Paynow guides, WhatsApp infrastructure patterns, and real distribution strategies for the Zimbabwean market. From the team that built Propertyzone.",
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

type Post = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://www.sparklinelabs.co.zw/blog#blog",
  "name": "Sparkline Labs — Engineering for Zimbabwe",
  "description": "Hard-earned playbooks from building software in Zimbabwe. Paynow and EcoCash integrations, WhatsApp Business API patterns, and distribution strategies that work for African SMEs.",
  "url": "https://www.sparklinelabs.co.zw/blog",
  "publisher": { "@id": "https://www.sparklinelabs.co.zw/#organization" },
  "inLanguage": "en-ZW",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sparklinelabs.co.zw" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.sparklinelabs.co.zw/blog" },
    ],
  },
  "about": [
    { "@type": "Thing", "name": "Software development in Zimbabwe" },
    { "@type": "Thing", "name": "Paynow payment integration" },
    { "@type": "Thing", "name": "EcoCash mobile money API" },
    { "@type": "Thing", "name": "WhatsApp Business API" },
    { "@type": "Thing", "name": "African technology markets" },
    { "@type": "Thing", "name": "SaaS distribution in Africa" },
  ],
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function PostsList() {
  let posts: Post[] = [];
  try {
    posts = await fetchPosts<Post[]>(allPostsQuery);
  } catch {
    /* Sanity not configured */
  }

  if (posts.length === 0) {
    return (
      <div className="border border-border rounded-xl p-8 text-center">
        <p className="text-muted-foreground text-lg">First post lands this week.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {posts.map((post) => (
        <article key={post.slug.current} className="py-8">
          <Link href={`/blog/${post.slug.current}`} className="group block">
            {post.publishedAt && (
              <time className="text-sm text-muted-foreground block mb-2">
                {formatDate(post.publishedAt)}
              </time>
            )}
            <h2 className="text-2xl font-semibold tracking-tight mb-2 group-hover:underline">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                {post.excerpt}
              </p>
            )}
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              Read post
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </article>
      ))}
    </div>
  );
}

function PostsSkeleton() {
  return (
    <div className="divide-y divide-border">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="py-8 animate-pulse">
          <div className="h-3 bg-muted rounded w-24 mb-3" />
          <div className="h-6 bg-muted rounded w-3/4 mb-3" />
          <div className="space-y-1.5 mb-4">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-4/5" />
          </div>
          <div className="h-4 bg-muted rounded w-20" />
        </div>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Intelligence
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance">
            Engineering for the Zimbabwean Reality.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Hard-won playbooks from shipping{" "}
            <a
              href="https://www.propzone.co.zw/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Propertyzone
            </a>{" "}
            and high-stakes custom builds. We document how to navigate local
            payment rails, deploy WhatsApp as primary infrastructure, and design
            commercial models that actually capture revenue from African SMEs.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-3xl">
          <Suspense fallback={<PostsSkeleton />}>
            <PostsList />
          </Suspense>
        </div>
      </section>
    </>
  );
}
