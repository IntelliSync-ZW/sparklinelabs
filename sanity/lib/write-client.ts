import "server-only";
import { createClient } from "next-sanity";

const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error("Missing SANITY_API_TOKEN");

/**
 * Write-enabled Sanity client for the author dashboard. The token bypasses
 * Sanity roles, so every caller must check the Clerk session and post
 * ownership first (see lib/member-posts).
 */
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  // Sees drafts.* as well as published documents
  perspective: "raw",
});
