import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchPosts, sanityFetch } from "@/sanity/lib/fetch";
import {
  postBySlugQuery,
  allPostSlugsWithCategoryQuery,
} from "@/sanity/lib/queries";
import { PortableTextRenderer, type RichTextValue } from "@/components/portable-text";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";
import { ViewTracker } from "@/components/blog/view-tracker";
import { TableOfContents } from "@/components/blog/table-of-contents";

type ArticleAuthor = {
  articleRole?: string;
  author: {
    _id: string;
    name: string;
    slug?: { current: string };
    role?: string;
    company?: string;
    bio?: unknown[];
    avatar?: { url: string; alt?: string };
    socials?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
      instagram?: string;
      youtube?: string;
      tiktok?: string;
      bluesky?: string;
      medium?: string;
      devto?: string;
    };
    email?: string;
    website?: string;
  };
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: number;
  tags?: string[];
  category?: { title: string; slug: { current: string }; color?: string };
  coverImage?: { url: string; alt?: string };
  body?: unknown[];
  authors?: ArticleAuthor[];
  seo?: { title?: string; description?: string; ogImage?: string };
};

type Props = { params: Promise<{ category: string; slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const posts = await fetchPosts<{ slug: string; category?: string }[]>(
      allPostSlugsWithCategoryQuery
    );
    return posts.map(({ slug, category }) => ({
      category: category ?? "uncategorised",
      slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
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
  const postCategory = post.category?.slug.current ?? categorySlug;
  const canonicalUrl = `${baseUrl}/blog/${postCategory}/${slug}`;
  const authorNames = post.authors?.map((a) => a.author.name) ?? ["Sparkline Labs"];

  return {
    title: post.seo?.title ?? `${post.title} | Sparkline Labs`,
    description: post.seo?.description ?? post.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.seo?.title ?? post.title,
      description: post.seo?.description ?? post.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: authorNames,
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

function roleLabel(role?: string): string | null {
  if (!role) return null;
  const labels: Record<string, string> = {
    lead_author: "Lead Author",
    co_author: "Co-author",
    editor: "Editor",
    contributor: "Contributor",
    photographer: "Photographer",
    illustrator: "Illustrator",
    researcher: "Researcher",
  };
  return labels[role] ?? role;
}

export default async function BlogPostPage({ params }: Props) {
  const { category: categorySlugParam, slug } = await params;
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

  const currentCategorySlug = post.category?.slug.current ?? categorySlugParam;
  const postUrl = `https://www.sparklinelabs.co.zw/blog/${currentCategorySlug}/${post.slug.current}`;

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
    author: post.authors && post.authors.length > 0
      ? post.authors.map((a) => ({
        "@type": "Person",
        name: a.author.name,
        jobTitle: a.author.role,
        worksFor: a.author.company ? { "@type": "Organization", name: a.author.company } : undefined,
        ...(a.author.avatar?.url && { image: a.author.avatar.url }),
        ...(a.author.slug?.current && {
          url: `https://www.sparklinelabs.co.zw/blog/authors/${a.author.slug.current}`,
          "@id": `https://www.sparklinelabs.co.zw/blog/authors/${a.author.slug.current}#person`,
        }),
        sameAs: [
          a.author.website,
          a.author.socials?.twitter,
          a.author.socials?.linkedin,
          a.author.socials?.github,
          a.author.socials?.bluesky,
          a.author.socials?.medium,
          a.author.socials?.devto,
        ].filter(Boolean),
      }))
      : [{ "@type": "Organization", name: "Sparkline Labs" }],
    publisher: {
      "@id": "https://www.sparklinelabs.co.zw/#organization",
    },
    isPartOf: { "@id": "https://www.sparklinelabs.co.zw/blog#blog" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sparklinelabs.co.zw" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.sparklinelabs.co.zw/blog" },
        ...(post.category
          ? [
            {
              "@type": "ListItem",
              position: 3,
              name: post.category.title,
              item: `https://www.sparklinelabs.co.zw/blog/${post.category.slug.current}`,
            },
            { "@type": "ListItem", position: 4, name: post.title, item: postUrl },
          ]
          : [{ "@type": "ListItem", position: 3, name: post.title, item: postUrl }]),
      ],
    },
  };

  return (
    <>
      {/* Client-side view tracker — fires once per session per post via cookie */}
      <ViewTracker postId={post._id} slug={post.slug.current} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Header / Hero */}
      <section className="pt-32 pb-8 px-6">
        <div className="container mx-auto max-w-3xl">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            {post.category && (
              <>
                <span>/</span>
                <Link
                  href={`/blog/${post.category.slug.current}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {post.category.title}
                </Link>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.15] mb-6 text-balance">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 text-justify">
              {post.excerpt}
            </p>
          )}

          {/* Integrated Author & Metadata Byline Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border text-sm">
            {/* Authors */}
            {post.authors && post.authors.length > 0 ? (
              <div className="flex flex-wrap items-center gap-4">
                {post.authors.map(({ author, articleRole }) => {
                  const authorHref = author.slug?.current
                    ? `/blog/authors/${author.slug.current}`
                    : null;
                  return (
                    <div key={author._id} className="flex items-center gap-3">
                      {authorHref ? (
                        <Link
                          href={authorHref}
                          className="h-10 w-10 rounded-full overflow-hidden border border-border bg-secondary shrink-0 relative group/avatar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {author.avatar?.url ? (
                            <Image
                              src={author.avatar.url}
                              alt={author.name}
                              fill
                              sizes="40px"
                              className="object-cover transition-transform duration-300 group-hover/avatar:scale-105"
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center font-semibold text-xs text-muted-foreground">
                              {author.name.charAt(0)}
                            </span>
                          )}
                        </Link>
                      ) : (
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-border bg-secondary shrink-0 relative">
                          {author.avatar?.url ? (
                            <Image
                              src={author.avatar.url}
                              alt={author.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center font-semibold text-xs text-muted-foreground">
                              {author.name.charAt(0)}
                            </span>
                          )}
                        </div>
                      )}
                      <div>
                        {authorHref ? (
                          <Link
                            href={authorHref}
                            className="font-medium text-foreground hover:underline block leading-tight"
                          >
                            {author.name}
                          </Link>
                        ) : (
                          <span className="font-medium text-foreground block leading-tight">
                            {author.name}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground block mt-0.5">
                          {roleLabel(articleRole) ?? author.role ?? author.company ?? "Author"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <span className="font-medium text-foreground">Sparkline Labs</span>
            )}

            {/* Publishing Date & Reading Time */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {post.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.publishedAt)}
                </span>
              )}
              {post.publishedAt && post.readingTime && <span>·</span>}
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime} min read
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cover image */}
      {post.coverImage?.url && (
        <div className="px-6 mb-12">
          <div className="container mx-auto max-w-3xl">
            <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-secondary">
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

      {/* Main Content */}
      <article className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-3xl">
          {/* Inline sticky TOC — just below the cover image, starts closed */}
          {post.body && post.body.length > 0 && (
            <TableOfContents body={post.body as unknown[]} />
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Body */}
          {post.body && post.body.length > 0 && (
            <PortableTextRenderer value={post.body as RichTextValue} />
          )}

          {/* Editorial Author Bio Section */}
          {post.authors && post.authors.length > 0 && (
            <div className="mt-16 border-t border-border pt-12">
              <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-8">
                About the {post.authors.length > 1 ? "Authors" : "Author"}
              </p>
              <div className="space-y-10">
                {post.authors.map(({ author, articleRole }) => {
                  const authorHref = author.slug?.current
                    ? `/blog/authors/${author.slug.current}`
                    : null;
                  return (
                    <div
                      key={author._id}
                      className="flex flex-col sm:flex-row gap-6 items-start"
                    >
                      {authorHref ? (
                        <Link
                          href={authorHref}
                          className="h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden border border-border bg-secondary shrink-0 relative group/avatar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {author.avatar?.url ? (
                            <Image
                              src={author.avatar.url}
                              alt={author.name}
                              fill
                              sizes="96px"
                              className="object-cover transition-transform duration-300 group-hover/avatar:scale-105"
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-muted-foreground">
                              {author.name.charAt(0)}
                            </span>
                          )}
                        </Link>
                      ) : (
                        <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden border border-border bg-secondary shrink-0 relative">
                          {author.avatar?.url ? (
                            <Image
                              src={author.avatar.url}
                              alt={author.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-muted-foreground">
                              {author.name.charAt(0)}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          {authorHref ? (
                            <Link
                              href={authorHref}
                              className="text-xl md:text-2xl font-semibold tracking-tight text-foreground hover:underline"
                            >
                              {author.name}
                            </Link>
                          ) : (
                            <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
                              {author.name}
                            </h3>
                          )}
                          {articleRole && (
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                              {roleLabel(articleRole)}
                            </span>
                          )}
                        </div>
                        {(author.role || author.company) && (
                          <p className="text-sm text-muted-foreground font-medium mb-3">
                            {author.role}
                            {author.role && author.company && " at "}
                            {author.company}
                          </p>
                        )}
                        {author.bio && author.bio.length > 0 && (
                          <div className="text-base text-muted-foreground leading-relaxed mb-4">
                            <PortableTextRenderer value={author.bio as RichTextValue} />
                          </div>
                        )}
                        {authorHref && (
                          <div className="pt-2">
                            <Link
                              href={authorHref}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-accent transition-colors group/authorlink"
                            >
                              <span>All articles by {author.name}</span>
                              <span className="transition-transform group-hover/authorlink:translate-x-1">→</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
