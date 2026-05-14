import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { latestPostsQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on building software in Zimbabwe: payment rails, WhatsApp as infrastructure, offline-tolerant architecture, commercial models for African SMEs.",
  alternates: { canonical: "https://sparklinelabs.co.zw/blog" },
  openGraph: {
    title: "Blog | Sparkline Labs",
    description:
      "Notes from building software in Zimbabwe: what works, what doesn't, and why.",
    url: "https://sparklinelabs.co.zw/blog",
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
            Notes
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance">
            Notes from building software in Zimbabwe.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            What we&apos;ve learned shipping{" "}
            <a
              href="https://www.propzone.co.zw/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Propertyzone
            </a>{" "}
            and custom builds: payment rails, WhatsApp as infrastructure,
            offline-tolerant architecture, and the commercial models that work
            for African SMEs.
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
