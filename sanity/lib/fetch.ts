import type { QueryParams } from "next-sanity";
import { client } from "./client";

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      ...(revalidate !== false && { revalidate }),
      ...(tags.length > 0 && { tags }),
    },
  });
}

// Named helpers with typed revalidation windows
export const fetchPosts = <T>(query: string, params?: QueryParams) =>
  sanityFetch<T>({ query, params, tags: ["post"], revalidate: 60 });

export const fetchCaseStudies = <T>(query: string, params?: QueryParams) =>
  sanityFetch<T>({ query, params, tags: ["caseStudy"], revalidate: 60 });

export const fetchProducts = <T>(query: string, params?: QueryParams) =>
  sanityFetch<T>({ query, params, tags: ["product"], revalidate: 300 });
