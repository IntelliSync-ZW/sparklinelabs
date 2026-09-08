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

export const fetchCategories = <T>(query: string, params?: QueryParams) =>
  sanityFetch<T>({ query, params, tags: ["category"], revalidate: 300 });

export const fetchAuthors = <T>(query: string, params?: QueryParams) =>
  sanityFetch<T>({ query, params, tags: ["author"], revalidate: 300 });

export const fetchServicesPage = <T>(query: string, params?: QueryParams) =>
  sanityFetch<T>({ query, params, tags: ["servicesPage"], revalidate: 300 });

export const fetchLegalPage = <T>(query: string, params?: QueryParams) =>
  sanityFetch<T>({ query, params, tags: ["legalPage"], revalidate: 300 });

