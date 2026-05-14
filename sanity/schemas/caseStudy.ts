import { defineField, defineType } from "sanity";

export const caseStudySchema = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "clientName", title: "Client Name", type: "string" }),
    defineField({ name: "industry", title: "Industry", type: "string" }),
    defineField({ name: "productRef", title: "Product", type: "reference", to: [{ type: "product" }] }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "problem", title: "Problem", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "solution", title: "Solution", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "outcomes", title: "Outcomes", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "techStack", title: "Tech Stack", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "testimonialQuote", title: "Testimonial Quote", type: "text" }),
    defineField({ name: "testimonialAuthor", title: "Testimonial Author", type: "string" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
