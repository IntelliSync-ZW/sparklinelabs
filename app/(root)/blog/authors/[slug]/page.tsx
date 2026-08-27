import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Globe, Mail } from "lucide-react";
import { fetchAuthors, sanityFetch } from "@/sanity/lib/fetch";
import { authorBySlugQuery, allAuthorSlugsQuery } from "@/sanity/lib/queries";
import { PortableTextRenderer, type RichTextValue } from "@/components/portable-text";

import { PostCard, type Post } from "@/components/blog/blog-list";

type Author = {
  _id: string;
  name: string;
  slug: { current: string };
  role?: string;
  company?: string;
  bio?: unknown[];
  avatar?: { url: string; alt?: string };
  email?: string;
  website?: string;
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
  posts?: Post[];
};

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const authors = await fetchAuthors<{ slug: string }[]>(allAuthorSlugsQuery);
    return authors.map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let author: Author | null = null;
  try {
    author = await sanityFetch<Author>({
      query: authorBySlugQuery,
      params: { slug },
      tags: ["author"],
    });
  } catch {
    /* Sanity not configured */
  }

  if (!author) return { title: "Author Profile" };

  const baseUrl = "https://www.sparklinelabs.co.zw";
  const canonicalUrl = `${baseUrl}/blog/authors/${slug}`;

  return {
    title: `${author.name} — ${author.role || "Author & Engineer"} | Sparkline Labs`,
    description:
      author.role
        ? `${author.name} (${author.role}${author.company ? ` at ${author.company}` : ""}). Read technical playbooks and articles on Sparkline Labs.`
        : `Read articles and technical playbooks authored by ${author.name} on Sparkline Labs.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${author.name} | Sparkline Labs`,
      description: `Read technical playbooks authored by ${author.name}.`,
      url: canonicalUrl,
      type: "profile",
      images: author.avatar?.url
        ? [{ url: author.avatar.url, width: 800, height: 800, alt: author.name }]
        : [],
    },
    twitter: {
      card: "summary",
      title: `${author.name} | Sparkline Labs`,
      description: `Author profile and articles by ${author.name}.`,
    },
  };
}

export default async function AuthorDetailPage({ params }: Props) {
  const { slug } = await params;

  let author: Author | null = null;
  try {
    author = await sanityFetch<Author>({
      query: authorBySlugQuery,
      params: { slug },
      tags: ["author"],
    });
  } catch {
    /* Sanity not configured */
  }

  if (!author) notFound();

  const baseUrl = "https://www.sparklinelabs.co.zw";
  const canonicalUrl = `${baseUrl}/blog/authors/${author.slug.current}`;

  const sameAsLinks = [
    author.website,
    author.socials?.twitter,
    author.socials?.linkedin,
    author.socials?.github,
    author.socials?.bluesky,
    author.socials?.medium,
    author.socials?.devto,
    author.socials?.youtube,
    author.socials?.instagram,
    author.socials?.tiktok,
  ].filter(Boolean) as string[];

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: `${author.name} - Author Profile`,
        isPartOf: { "@id": `${baseUrl}/blog#blog` },
        mainEntity: { "@id": `${canonicalUrl}#person` },
      },
      {
        "@type": "Person",
        "@id": `${canonicalUrl}#person`,
        name: author.name,
        jobTitle: author.role,
        worksFor: author.company
          ? { "@type": "Organization", name: author.company }
          : { "@id": `${baseUrl}/#organization` },
        image: author.avatar?.url,
        url: canonicalUrl,
        email: author.email ? `mailto:${author.email}` : undefined,
        sameAs: sameAsLinks,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
          { "@type": "ListItem", position: 3, name: "Authors", item: `${baseUrl}/blog/authors` },
          { "@type": "ListItem", position: 4, name: author.name, item: canonicalUrl },
        ],
      },
    ],
  };

  const posts = author.posts ?? [];
  const hasContactOrSocials = Boolean(author.email || sameAsLinks.length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      {/* Hero / Profile Header */}
      <section className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <span>/</span>
            <Link href="/blog/authors" className="hover:text-foreground transition-colors">
              Authors
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">{author.name}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Avatar */}
            <div className="relative h-28 w-28 md:h-40 md:w-40 rounded-2xl overflow-hidden border border-border bg-secondary shrink-0 shadow-xs">
              {author.avatar?.url ? (
                <Image
                  src={author.avatar.url}
                  alt={author.avatar.alt ?? author.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                  priority
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-muted-foreground">
                  {author.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Author details */}
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                Author & Contributor
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight">
                {author.name}
              </h1>

              {(author.role || author.company) && (
                <p className="text-lg md:text-xl text-muted-foreground font-medium mb-5">
                  {author.role}
                  {author.role && author.company && " at "}
                  {author.company}
                </p>
              )}


              {/* Contact & Social Links */}
              {hasContactOrSocials && (
                <div className="flex flex-wrap items-center gap-3 text-xs py-4 border-b border-border">
                  {author.website && (
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-full border border-border bg-card text-foreground hover:border-foreground/50 transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5" /> Website
                    </a>
                  )}
                  {author.email && (
                    <a
                      href={`mailto:${author.email}`}
                      className="inline-flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-full border border-border bg-card text-foreground hover:border-foreground/50 transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" /> {author.email}
                    </a>
                  )}
                  {author.socials?.twitter && (
                    <a
                      href={author.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
                    >
                      Twitter / X
                    </a>
                  )}
                  {author.socials?.linkedin && (
                    <a
                      href={author.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                  {author.socials?.github && (
                    <a
                      href={author.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
                    >
                      GitHub
                    </a>
                  )}
                  {author.socials?.bluesky && (
                    <a
                      href={author.socials.bluesky}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
                    >
                      Bluesky
                    </a>
                  )}
                  {author.socials?.medium && (
                    <a
                      href={author.socials.medium}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
                    >
                      Medium
                    </a>
                  )}
                  {author.socials?.devto && (
                    <a
                      href={author.socials.devto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
                    >
                      Dev.to
                    </a>
                  )}
                  {author.socials?.youtube && (
                    <a
                      href={author.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
                    >
                      YouTube
                    </a>
                  )}
                  {author.socials?.instagram && (
                    <a
                      href={author.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {author.socials?.tiktok && (
                    <a
                      href={author.socials.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
                    >
                      TikTok
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          {author.bio && author.bio.length > 0 && (
            <div className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-4xl mt-4">
              <PortableTextRenderer value={author.bio as RichTextValue} className="text-justify" />
            </div>
          )}

          {/* Section Divider */}
          <div className="border-t border-border mt-14" />
        </div>
      </section>

      {/* Articles Section */}
      <section className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Writing
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-1">
              Articles by {author.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? "article" : "articles"} published
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground text-base">
                No published articles yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.slug.current} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
