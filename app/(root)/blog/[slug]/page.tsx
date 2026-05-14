import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { postBySlugQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";

type Post = {
  title: string;
  slug: { current: string };
  excerpt: string;
  body: unknown[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  ogImage?: string;
  tags?: string[];
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let post: Post | null = null;
  try {
    post = await client.fetch<Post>(postBySlugQuery, { slug });
  } catch {
    // Sanity not configured yet
  }

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://sparklinelabs.co.zw/blog/${post.slug.current}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://sparklinelabs.co.zw/blog/${post.slug.current}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author ?? "Sparkline Labs"],
      images: post.ogImage ? [{ url: post.ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
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

export const revalidate = 300;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

  let post: Post | null = null;
  try {
    post = await client.fetch<Post>(postBySlugQuery, { slug });
  } catch {
    // Sanity not configured yet
  }

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author ?? "Sparkline Labs",
      url: "https://sparklinelabs.co.zw",
    },
    publisher: {
      "@type": "Organization",
      name: "Sparkline Labs",
      logo: { "@type": "ImageObject", url: "https://sparklinelabs.co.zw/icon.svg" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="pt-32 pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-3xl">
          <header className="mb-12">
            <time className="text-sm text-muted-foreground block mb-4">
              {formatDate(post.publishedAt)}
            </time>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4 text-balance">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground border-t border-border pt-6">
              <span>By {post.author ?? "Sparkline Labs"}</span>
              {post.tags?.map((tag) => (
                <span key={tag} className="bg-secondary rounded-full px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {post.body && (
            <div className="prose prose-neutral dark:prose-invert max-w-none text-lg leading-relaxed">
              <PortableText value={post.body as Parameters<typeof PortableText>[0]["value"]} />
            </div>
          )}

          {/* End-of-post CTA */}
          <div className="mt-16 border-t border-border pt-12">
            <h3 className="text-2xl font-semibold mb-3">
              Building something like this?
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-xl">
              We build platforms, internal tools, and integrations for
              Zimbabwean and African businesses. Outcome-tied pricing, two-week
              paid discovery.
            </p>
            <Button
              className="group bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                Start on WhatsApp
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}
