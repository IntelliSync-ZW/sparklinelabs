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
      name: "lessonType",
      title: "Lesson type",
      type: "string",
      description: "Sets the icon in the curriculum sidebar.",
      options: {
        list: [
          { title: "Reading", value: "reading" },
          { title: "Video", value: "video" },
          { title: "Practice", value: "practice" },
          { title: "Quiz", value: "quiz" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "reading",
    }),

    defineField({
      name: "duration",
      title: "Estimated duration",
      type: "object",
      fields: [
        defineField({
          name: "value",
          title: "Value",
          type: "number",
          validation: (Rule) => Rule.positive(),
        }),
        defineField({
          name: "unit",
          title: "Unit",
          type: "string",
          options: {
            list: [
              { title: "Seconds", value: "seconds" },
              { title: "Minutes", value: "minutes" },
              { title: "Hours", value: "hours" },
            ],
            layout: "radio",
            direction: "horizontal",
          },
          initialValue: "minutes",
        }),
      ],
      options: {
        columns: 2,
      },
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
      name: "image",
      title: "Lesson Image (Optional)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
      description: "Optional cover or visual banner for this lesson.",
    }),

    defineField({
      name: "body",
      title: "Lesson Sections",
      description:
        "The lesson body is composed of ordered sections. Students progress through the lesson section by section. Each section title renders as an H2, with internal headings starting strictly at H3.",
      type: "array",
      of: [{ type: "lessonSection" }],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "keyTakeaways",
      title: "Key takeaways",
      type: "array",
      of: [{ type: "string" }],
      description: "Shown as a recap at the end of the lesson.",
    }),

    defineField({
      name: "endAssessment",
      title: "End-of-lesson assessment",
      type: "lessonAssessment",
      description:
        "Required. Scored, and counts towards the certificate. The lesson completes when its sections are done and this is passed.",
      validation: (Rule) =>
        Rule.custom((value: { items?: unknown[] } | undefined) =>
          value?.items?.length ? true : "Every lesson needs an end-of-lesson assessment with at least one question or task"
        ),
    }),

    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [{ type: "reference", to: [{ type: "courseResource" }] }],
    }),

    defineField({
      name: "sources",
      title: "Sources / references",
      type: "array",
      of: [{ type: "reference", to: [{ type: "courseSource" }] }],
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
});
