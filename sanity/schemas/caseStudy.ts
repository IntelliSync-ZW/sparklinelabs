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
];

export const caseStudySchema = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  icon: CaseIcon,
  fields: [
    // Identity
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

    // Media
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),

    // Dates
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

    // Content sections — all portable text
    defineField({
      name: "problem",
      title: "The Problem",
      type: "array",
      of: richTextBlock,
    }),
    defineField({
      name: "solution",
      title: "What We Built",
      description: "Use H3 headings inside this field to separate each built component",
      type: "array",
      of: richTextBlock,
    }),
    defineField({
      name: "outcomes",
      title: "Outcomes",
      type: "array",
      of: richTextBlock,
    }),
    defineField({
      name: "outcomeMetrics",
      title: "Outcome Metrics",
      description: "Key numbers shown as highlighted stat blocks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", description: "e.g. 12" }),
            defineField({ name: "label", title: "Label", type: "string", description: "e.g. agencies live" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
    defineField({
      name: "whatsNext",
      title: "What's Next",
      type: "array",
      of: richTextBlock,
    }),

    // Team metadata
    defineField({
      name: "team",
      title: "Team",
      type: "string",
      initialValue: "Sparkline Labs founders",
    }),
    defineField({ name: "started", title: "Started (year)", type: "string" }),
    defineField({ name: "live", title: "Live (year)", type: "string" }),

    // Testimonial (optional)
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
