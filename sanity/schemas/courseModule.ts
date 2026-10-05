import { defineField, defineType } from "sanity";

export const courseModule = defineType({
  name: "courseModule",
  title: "Course Module",
  type: "document",

  fields: [
    defineField({
      name: "course",
      title: "Course",
      type: "reference",
      to: [{ type: "course" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "number",
      title: "Module number",
      type: "number",
      validation: (Rule) => Rule.required().integer().positive(),
    }),

    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "accessLevel",
      title: "Access level",
      type: "string",
      options: {
        list: [
          { title: "Free", value: "free" },
          { title: "Registration required", value: "registration" },
          { title: "Paid", value: "paid" },
        ],
      },
      initialValue: "free",
    }),

    defineField({
      name: "lessons",
      title: "Lessons",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "courseLesson" }],
        },
      ],
    }),

    defineField({
      name: "moduleAssessment",
      title: "Module assessment",
      type: "reference",
      to: [{ type: "courseAssessment" }],
    }),
  ],
});
