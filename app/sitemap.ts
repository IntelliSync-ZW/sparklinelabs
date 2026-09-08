import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  allPostSlugsWithCategoryQuery,
  allCaseStudySlugsQuery,
  allCategoriesQuery,
  allAuthorSlugsQuery,
} from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.sparklinelabs.co.zw";
  const now = new Date();

  let posts: { slug: string; category?: string; _updatedAt: string }[] = [];
  let caseStudies: { slug: string; _updatedAt: string }[] = [];
  let categories: { slug: { current: string } }[] = [];
  let authors: { slug: string; _updatedAt: string }[] = [];

  try {
    [posts, caseStudies, categories, authors] = await Promise.all([
      sanityFetch<{ slug: string; category?: string; _updatedAt: string }[]>({
        query: allPostSlugsWithCategoryQuery,
        tags: ["post"],
        revalidate: 3600,
      }),
      sanityFetch<{ slug: string; _updatedAt: string }[]>({
        query: allCaseStudySlugsQuery,
        tags: ["caseStudy"],
        revalidate: 3600,
      }),
      sanityFetch<{ slug: { current: string } }[]>({
        query: allCategoriesQuery,
        tags: ["category"],
        revalidate: 3600,
      }),
      sanityFetch<{ slug: string; _updatedAt: string }[]>({
        query: allAuthorSlugsQuery,
        tags: ["author"],
        revalidate: 3600,
      }),
    ]);
  } catch {
    /* Sanity not configured; return static routes only */
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/work/propertyzone`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/blog/authors`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${baseUrl}/terms-of-service`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];


  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/blog/${cat.slug.current}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const authorRoutes = authors.map((a) => ({
    url: `${baseUrl}/blog/authors/${a.slug}`,
    lastModified: new Date(a._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const caseStudyRoutes = caseStudies
    .filter((c) => c.slug !== "propertyzone")
    .map((c) => ({
      url: `${baseUrl}/work/${c.slug}`,
      lastModified: new Date(c._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    }));

  const postRoutes = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.category ?? "uncategorised"}/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...authorRoutes,
    ...caseStudyRoutes,
    ...postRoutes,
  ];
}
