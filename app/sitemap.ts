import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { allPostSlugsQuery, allCaseStudySlugsQuery } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sparklinelabs.co.zw";
  const now = new Date();

  let posts: { slug: string; _updatedAt: string }[] = [];
  let caseStudies: { slug: string; _updatedAt: string }[] = [];

  try {
    [posts, caseStudies] = await Promise.all([
      client.fetch<{ slug: string; _updatedAt: string }[]>(allPostSlugsQuery),
      client.fetch<{ slug: string; _updatedAt: string }[]>(allCaseStudySlugsQuery),
    ]);
  } catch {
    // Sanity not configured yet; return static routes only
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  const caseStudyRoutes = caseStudies.map((c) => ({
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
