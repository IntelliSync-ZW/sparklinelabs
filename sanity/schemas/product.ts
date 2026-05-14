import { defineField, defineType } from "sanity";

export const productSchema = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string", validation: (r) => r.max(80) }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Live", value: "live" },
          { title: "Private Beta", value: "private_beta" },
          { title: "In Design", value: "in_design" },
          { title: "Archived", value: "archived" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "statusDate", title: "Status Date", type: "string" }),
    defineField({ name: "href", title: "External URL", type: "url" }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
      validation: (r) => r.max(6),
    }),
    defineField({ name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "screenshot", title: "Screenshot", type: "image", options: { hotspot: true } }),
    defineField({ name: "order", title: "Sort Order", type: "number" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
