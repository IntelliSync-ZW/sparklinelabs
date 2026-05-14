import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchPosts, sanityFetch } from "@/sanity/lib/fetch";
import { postBySlugQuery, allPostSlugsQuery } from "@/sanity/lib/queries";
import { PortableTextRenderer, type RichTextValue } from "@/components/portable-text";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: number;
  tags?: string[];
  category?: { title: string; slug: { current: string }; color?: string };
  coverImage?: { url: string; alt?: string };
  body?: unknown[];
  seo?: { title?: string; description?: string; ogImage?: string };
};

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await fetchPosts<{ slug: string }[]>(allPostSlugsQuery);
    return slugs.map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let post: Post | null = null;
  try {
    post = await sanityFetch<Post>({
      query: postBySlugQuery,
      params: { slug },
      tags: ["post"],
    });
  } catch {
    /* Sanity not configured */
  }

  if (!post) return { title: "Blog Post" };

  const baseUrl = "https://www.sparklinelabs.co.zw";
  return {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    alternates: { canonical: `${baseUrl}/blog/${slug}` },
    openGraph: {
      title: post.seo?.title ?? post.title,
      description: post.seo?.description ?? post.excerpt,
      url: `${baseUrl}/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author] : ["Sparkline Labs"],
      images: post.seo?.ogImage
        ? [{ url: post.seo.ogImage, width: 1200, height: 630 }]
        : post.coverImage?.url
        ? [{ url: post.coverImage.url, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.title ?? post.title,
      description: post.seo?.description ?? post.excerpt,
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

  let post: Post | null = null;
  try {
    post = await sanityFetch<Post>({
      query: postBySlugQuery,
      params: { slug },
      tags: ["post"],
    });
  } catch {
    /* Sanity not configured */
  }

  if (!post) notFound();

  const postUrl = `https://www.sparklinelabs.co.zw/blog/${post.slug.current}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url ?? `https://www.sparklinelabs.co.zw/og-image.png`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "en-ZW",
    ...(post.tags && post.tags.length > 0 && { keywords: post.tags.join(", ") }),
    ...(post.category && { articleSection: post.category.title }),
    author: {
      "@type": post.author ? "Person" : "Organization",
      name: post.author ?? "Sparkline Labs",
      url: "https://www.sparklinelabs.co.zw",
    },
    publisher: {
      "@id": "https://www.sparklinelabs.co.zw/#organization",
    },
    isPartOf: { "@id": "https://www.sparklinelabs.co.zw/blog#blog" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sparklinelabs.co.zw" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.sparklinelabs.co.zw/blog" },
        { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-10 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {post.category && (
              <span
                className={`text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full bg-secondary ${post.category.color ?? ""}`}
              >
                {post.category.title}
              </span>
            )}
            {post.publishedAt && (
              <time
                dateTime={post.publishedAt}
                className="text-sm text-muted-foreground"
              >
                {formatDate(post.publishedAt)}
              </time>
            )}
            {post.readingTime && (
              <span className="text-sm text-muted-foreground">
                ~{post.readingTime} min read
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-5 text-balance">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Cover image */}
      {post.coverImage?.url && (
        <div className="px-6 mb-12">
          <div className="container mx-auto max-w-3xl">
            <div className="relative w-full overflow-hidden rounded-2xl border border-border">
              <Image
                src={post.coverImage.url}
                alt={post.coverImage.alt ?? post.title}
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
        <div className="container mx-auto max-w-3xl">
          {/* Byline */}
          {(post.author || (post.tags && post.tags.length > 0)) && (
            <div className="flex flex-wrap items-center gap-3 mb-10 pb-8 border-b border-border text-sm text-muted-foreground">
              {post.author && <span>By {post.author}</span>}
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary rounded-full px-3 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Body */}
          {post.body && post.body.length > 0 && (
            <PortableTextRenderer value={post.body as RichTextValue} />
          )}

          {/* End-of-post CTA */}
          <div className="mt-16 border-t border-border pt-12">
            <h2 className="text-2xl font-semibold tracking-tight mb-3">
              Building something like this?
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-xl">
              We build platforms, internal tools, and integrations for
              Zimbabwean and African businesses. Outcome-tied pricing, two-week
              paid discovery.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                className="group bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  Start on WhatsApp
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="outline" className="bg-transparent" asChild>
                <Link href="/blog">All posts</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
