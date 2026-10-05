import { defineField, defineType } from "sanity";

export const courseSource = defineType({
  name: "courseSource",
  title: "Course Source",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "publisher",
      title: "Publisher",
      type: "string",
    }),

    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "sourceType",
      title: "Source type",
      type: "string",
      options: {
        list: [
          { title: "Government", value: "government" },
          { title: "Official documentation", value: "official" },
          { title: "Academic", value: "academic" },
          { title: "Research", value: "research" },
          { title: "Legal", value: "legal" },
          { title: "Other", value: "other" },
        ],
      },
    }),

    defineField({
      name: "publishedDate",
      title: "Published date",
      type: "date",
    }),
  ],
});
