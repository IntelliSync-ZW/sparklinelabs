import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allPostSlugsQuery, allCaseStudySlugsQuery } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.sparklinelabs.co.zw";
  const now = new Date();

  let posts: { slug: string; _updatedAt: string }[] = [];
  let caseStudies: { slug: string; _updatedAt: string }[] = [];

  try {
    [posts, caseStudies] = await Promise.all([
      sanityFetch<{ slug: string; _updatedAt: string }[]>({
        query: allPostSlugsQuery,
        tags: ["post"],
        revalidate: 3600,
      }),
      sanityFetch<{ slug: string; _updatedAt: string }[]>({
        query: allCaseStudySlugsQuery,
        tags: ["caseStudy"],
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
  ];

  const caseStudyRoutes = caseStudies
    .filter((c) => c.slug !== "propertyzone")
    .map((c) => ({
      url: `${baseUrl}/work/${c.slug}`,
      lastModified: new Date(c._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    }));

  const postRoutes = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseStudyRoutes, ...postRoutes];
}
