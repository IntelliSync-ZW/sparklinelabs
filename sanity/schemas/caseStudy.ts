import { defineField, defineType, defineArrayMember } from "sanity";
import { CaseIcon } from "@sanity/icons";

const richTextBlock = [
  { type: "block" },
  {
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({ name: "alt", title: "Alt text", type: "string" }),
      defineField({ name: "caption", title: "Caption", type: "string" }),
    ],
  },
  { type: "stlTableBlock" },
];

export const caseStudySchema = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  icon: CaseIcon,
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      description: "Short description for cards and previews (~200 chars)",
      type: "text",
      rows: 3,
      validation: (r) => r.max(220),
    }),
    defineField({
      name: "headline",
      title: "Sub-headline",
      description: "Shown below the H1 in the case study hero",
      type: "string",
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
    }),
    defineField({
      name: "clientName",
      title: "Client Name",
      description: "Leave blank for own products",
      type: "string",
    }),
    defineField({
      name: "productRef",
      title: "Related Product",
      type: "reference",
      to: [{ type: "product" }],
    }),

    // ── Media ─────────────────────────────────────────────────────────────────
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),

    // ── Dates ─────────────────────────────────────────────────────────────────
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time (minutes)",
      type: "number",
    }),

    // ── Authors (with per-article roles) ─────────────────────────────────────
    defineField({
      name: "authors",
      title: "Authors",
      description: "Add one or more authors and specify their role on this case study",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "articleAuthor",
          fields: [
            defineField({
              name: "author",
              title: "Author",
              type: "reference",
              to: [{ type: "author" }],
              validation: (r) => r.required(),
            }),
            defineField({
              name: "articleRole",
              title: "Role on this Article",
              description: "e.g. Lead Author, Editor, Contributor, Photographer",
              type: "string",
              options: {
                list: [
                  { title: "Lead Author", value: "lead_author" },
                  { title: "Co-author", value: "co_author" },
                  { title: "Editor", value: "editor" },
                  { title: "Contributor", value: "contributor" },
                  { title: "Photographer", value: "photographer" },
                  { title: "Illustrator", value: "illustrator" },
                  { title: "Researcher", value: "researcher" },
                ],
              },
            }),
          ],
          preview: {
            select: {
              name: "author.name",
              role: "articleRole",
              media: "author.avatar",
            },
            prepare({ name, role, media }) {
              const roleLabel: Record<string, string> = {
                lead_author: "Lead Author",
                co_author: "Co-author",
                editor: "Editor",
                contributor: "Contributor",
                photographer: "Photographer",
                illustrator: "Illustrator",
                researcher: "Researcher",
              };
              return {
                title: name ?? "Unknown Author",
                subtitle: role ? roleLabel[role] ?? role : undefined,
                media,
              };
            },
          },
        }),
      ],
    }),

    // ── Flexible Body ────────────────────────────────────────────────────────
    defineField({
      name: "body",
      title: "Body",
      description: "Full case study narrative with headings, images, quotes, lists, and tables",
      type: "array",
      of: richTextBlock,
    }),

    // ── Highlights & Key Metrics (Optional) ──────────────────────────────────
    defineField({
      name: "outcomeMetrics",
      title: "Key Metrics / Highlights",
      description: "Highlight metrics or numbers shown as stat blocks (e.g. 13,223 enquiries, 2,410 unanswered)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", description: "e.g. 13,223 or 78%" }),
            defineField({ name: "label", title: "Label", type: "string", description: "e.g. WhatsApp enquiries recorded" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),

    // ── Project metadata & Team ───────────────────────────────────────────────
    defineField({ name: "team", title: "Team / Delivery", type: "string" }),
    defineField({ name: "started", title: "Started (year)", type: "string" }),
    defineField({ name: "live", title: "Live (year)", type: "string" }),

    // ── Legacy structured sections (Optional for backwards compatibility) ────
    defineField({
      name: "problem",
      title: "The Problem (Legacy)",
      type: "array",
      of: richTextBlock,
      hidden: true,
    }),
    defineField({
      name: "solution",
      title: "What We Built (Legacy)",
      type: "array",
      of: richTextBlock,
      hidden: true,
    }),
    defineField({
      name: "outcomes",
      title: "Outcomes (Legacy)",
      type: "array",
      of: richTextBlock,
      hidden: true,
    }),
    defineField({
      name: "whatsNext",
      title: "What's Next (Legacy)",
      type: "array",
      of: richTextBlock,
      hidden: true,
    }),

    // ── Testimonial (optional) ────────────────────────────────────────────────
    defineField({
      name: "testimonialQuote",
      title: "Testimonial Quote",
      type: "text",
    }),
    defineField({
      name: "testimonialAuthor",
      title: "Testimonial Author",
      type: "string",
    }),

    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [
    {
      title: "Published Date, Newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "industry", media: "heroImage" },
  },
});
