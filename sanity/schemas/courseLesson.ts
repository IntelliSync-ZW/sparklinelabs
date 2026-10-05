import { defineField, defineType } from "sanity";

export const courseLesson = defineType({
  name: "courseLesson",
  title: "Course Lesson",
  type: "document",

  fields: [
    defineField({
      name: "module",
      title: "Module",
      type: "reference",
      to: [{ type: "courseModule" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "title",
      title: "Lesson title",
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
      name: "order",
      title: "Lesson order",
      type: "number",
      validation: (Rule) => Rule.required().integer().positive(),
    }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
        ],
      },
      initialValue: "draft",
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
      name: "estimatedMinutes",
      title: "Estimated minutes",
      type: "number",
    }),

    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "learningOutcomes",
      title: "Learning outcomes",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
    }),

    defineField({
      name: "transcript",
      title: "Transcript",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "body",
      title: "Lesson body",
      type: "array",
      of: [
        { type: "block" },
        { type: "callout" },
        { type: "promptBlock" },
        { type: "image" },
        { type: "stlTableBlock" },
      ],
    }),

    defineField({
      name: "tasks",
      title: "Tasks",
      type: "array",
      of: [{ type: "lessonTaskRef" }],
    }),

    defineField({
      name: "assessment",
      title: "End-of-lesson assessment",
      type: "reference",
      to: [{ type: "courseAssessment" }],
    }),

    defineField({
      name: "passingScore",
      title: "Lesson assessment passing score",
      type: "number",
      initialValue: 80,
      validation: (Rule) => Rule.min(0).max(100),
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
});
