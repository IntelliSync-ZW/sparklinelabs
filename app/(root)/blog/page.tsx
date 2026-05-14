import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { latestPostsQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Building Software for Africa: Engineering & Strategy Blog",
  description:
    "Hard-earned lessons on building resilient software in Zimbabwe. Engineering Paynow integrations, WhatsApp-first architectures, and distribution strategies for African SMEs.",
  alternates: { 
    canonical: "https://www.sparklinelabs.co.zw/blog" 
  },
  keywords: [
    "Software development Zimbabwe",
    "Paynow integration guide",
    "WhatsApp Business API Africa",
    "Offline-first web apps",
    "Zimbabwe tech ecosystem",
    "SaaS distribution Africa"
  ],
  openGraph: {
    title: "Engineering for the African Market | Sparkline Labs Blog",
    description:
      "Deep dives into payment rails, WhatsApp infrastructure, and commercial models that work in Zimbabwe.",
    url: "https://www.sparklinelabs.co.zw/blog",
    siteName: "Sparkline Labs",
    locale: "en_ZW",
    type: "website",
    images: [
      {
        url: "/blog-og-image.png", // Create a specific high-contrast image for the blog home
        width: 1200,
        height: 630,
        alt: "Sparkline Labs Blog - Software Engineering for Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Engineering & Strategy for Zimbabwe",
    description: "How to build and scale software where trust is low and infrastructure is inconsistent.",
    images: ["/blog-og-image.png"],
  },
};

type Post = {
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  coverImage?: string;
};

export const revalidate = 300;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  let posts: Post[] = [];

  try {
    posts = await client.fetch<Post[]>(latestPostsQuery);
  } catch {
    // Sanity not configured yet
  }

  return (
    <>
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Intelligence
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance">
            Engineering for the Zimbabwean Reality.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
           Hard-won playbooks from shipping {" "}
            <a
              href="https://www.propzone.co.zw/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Propertyzone
            </a>{" "}
            and high-stakes custom builds. We document how to navigate local payment rails, 
      deploy WhatsApp as primary infrastructure, and design commercial models that 
      actually capture revenue from African SMEs.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-3xl">
          {posts.length === 0 ? (
            <div className="border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground text-lg">
                First post lands this week.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <article key={post.slug.current} className="py-8">
                  <Link href={`/blog/${post.slug.current}`} className="group block">
                    <time className="text-sm text-muted-foreground block mb-2">
                      {formatDate(post.publishedAt)}
                    </time>
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
          )}
        </div>
      </section>
    </>
  );
}
