import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { fetchAuthors } from "@/sanity/lib/fetch";
import { allAuthorsQuery } from "@/sanity/lib/queries";
import { PortableTextRenderer, type RichTextValue } from "@/components/portable-text";

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
  postCount?: number;
};

export const metadata: Metadata = {
  title: "Authors & Contributors | Sparkline Labs",
  description:
    "Meet the engineers, founders, and technical writers sharing battle-tested playbooks on building software for Zimbabwe and African markets.",
  alternates: { canonical: "https://www.sparklinelabs.co.zw/blog/authors" },
  openGraph: {
    title: "Authors & Contributors | Sparkline Labs",
    description:
      "Meet the engineers and domain experts sharing playbooks on software development in Zimbabwe.",
    url: "https://www.sparklinelabs.co.zw/blog/authors",
    siteName: "Sparkline Labs",
    locale: "en_ZW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Authors & Contributors | Sparkline Labs",
    description:
      "Meet the team writing about Zimbabwean tech infrastructure, payment integrations, and SME distribution.",
  },
};

export default async function AuthorsIndexPage() {
  let authors: Author[] = [];
  try {
    authors = await fetchAuthors<Author[]>(allAuthorsQuery);
  } catch {
    /* Sanity not configured */
  }

  const baseUrl = "https://www.sparklinelabs.co.zw";
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/blog/authors#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
          { "@type": "ListItem", position: 3, name: "Authors", item: `${baseUrl}/blog/authors` },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/blog/authors#itemlist`,
        name: "Sparkline Labs Authors & Contributors",
        description: "List of authors contributing technical playbooks and articles.",
        itemListElement: authors.map((author, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Person",
            "@id": `${baseUrl}/blog/authors/${author.slug.current}#person`,
            name: author.name,
            jobTitle: author.role,
            worksFor: author.company ? { "@type": "Organization", name: author.company } : { "@id": `${baseUrl}/#organization` },
            image: author.avatar?.url,
            url: `${baseUrl}/blog/authors/${author.slug.current}`,
            sameAs: [
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
            ].filter(Boolean),
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">Authors</span>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">
            Our Voice
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance max-w-3xl">
            Authors & Contributors.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            The engineers, product architects, and builders documenting real-world technical playbooks for software engineering in Zimbabwe and across Africa.
          </p>
        </div>
      </section>

      {/* Authors Grid */}
      <section className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-5xl">
          {authors.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground text-lg">Author directory updating soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {authors.map((author) => {
                const profileUrl = `/blog/authors/${author.slug.current}`;
                return (
                  <Link
                    key={author._id}
                    href={profileUrl}
                    className="group border border-border rounded-2xl p-6 md:p-7 bg-card flex flex-col justify-between hover:border-foreground/40 transition-colors"
                  >
                    <div>
                      {/* Avatar & Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="shrink-0 relative h-16 w-16 rounded-2xl overflow-hidden border border-border bg-secondary">
                          {author.avatar?.url ? (
                            <Image
                              src={author.avatar.url}
                              alt={author.avatar.alt ?? author.name}
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-muted-foreground">
                              {author.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-accent transition-colors leading-tight">
                            {author.name}
                          </h2>
                          {(author.role || author.company) && (
                            <p className="text-sm text-muted-foreground font-medium mt-1">
                              {author.role}
                              {author.role && author.company && " at "}
                              {author.company}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bio preview */}
                      {author.bio && author.bio.length > 0 && (
                        <div className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                          <PortableTextRenderer value={author.bio as RichTextValue} />
                        </div>
                      )}
                    </div>

                    {/* Footer Row */}
                    <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1.5 font-medium">
                        <BookOpen className="h-3.5 w-3.5" />
                        {author.postCount ?? 0} {author.postCount === 1 ? "article" : "articles"}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:text-accent transition-colors">
                        <span>Read articles</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
