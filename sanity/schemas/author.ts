import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

export const authorSchema = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),

    // ── Professional ──────────────────────────────────────────────────────────
    defineField({
      name: "role",
      title: "Role / Title",
      description: "e.g. Senior Engineer, Co-founder, Design Lead",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Company",
      description: "Leave blank if Sparkline Labs",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
    }),

    // ── Contact ───────────────────────────────────────────────────────────────
    defineField({
      name: "email",
      title: "Email",
      type: "email",
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),

    // ── Socials ───────────────────────────────────────────────────────────────
    defineField({
      name: "socials",
      title: "Socials",
      type: "object",
      fields: [
        defineField({ name: "twitter", title: "Twitter / X", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "github", title: "GitHub", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok", type: "url" }),
        defineField({ name: "bluesky", title: "Bluesky", type: "url" }),
        defineField({ name: "medium", title: "Medium", type: "url" }),
        defineField({ name: "devto", title: "Dev.to", type: "url" }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "avatar" },
  },
});
