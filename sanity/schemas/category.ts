import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const categorySchema = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "color",
      title: "Color (Tailwind class)",
      description: "e.g. text-blue-600 — used for the category pill",
      type: "string",
    }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});
