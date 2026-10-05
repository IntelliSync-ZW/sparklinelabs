import { defineField, defineType } from "sanity";

export const courseResource = defineType({
  name: "courseResource",
  title: "Course Resource",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "resourceType",
      title: "Resource type",
      type: "string",
      options: {
        list: [
          { title: "Article", value: "article" },
          { title: "PDF", value: "pdf" },
          { title: "External link", value: "external" },
          { title: "Template", value: "template" },
          { title: "Video", value: "video" },
        ],
      },
    }),

    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),

    defineField({
      name: "file",
      title: "File",
      type: "file",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
});
