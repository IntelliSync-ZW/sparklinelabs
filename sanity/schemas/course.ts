import { defineField, defineType } from "sanity";

export const course = defineType({
  name: "course",
  title: "Course",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Course title",
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
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" },
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
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }, { type: "callout" }],
    }),

    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "level",
      title: "Level",
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
        ],
      },
      initialValue: "beginner",
    }),

    defineField({
      name: "durationMinutes",
      title: "Estimated duration",
      type: "number",
    }),

    defineField({
      name: "outcomes",
      title: "Learning outcomes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "finalAssessment",
      title: "Final assessment (Optional override)",
      description: "Optional. You can also link this course directly from a Course Assessment document.",
      type: "reference",
      to: [{ type: "courseAssessment" }],
    }),

    defineField({
      name: "completionRules",
      title: "Completion rules",
      type: "object",
      fields: [
        defineField({
          name: "minimumAssessmentScore",
          title: "Minimum final assessment score",
          type: "number",
          initialValue: 80,
          validation: (Rule) => Rule.min(0).max(100),
        }),

        defineField({
          name: "allLessonsRequired",
          title: "All lessons required",
          type: "boolean",
          initialValue: true,
        }),

        defineField({
          name: "allRequiredTasksPassed",
          title: "All required tasks passed",
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),

    defineField({
      name: "certificate",
      title: "Certificate",
      type: "object",
      fields: [
        defineField({
          name: "enabled",
          title: "Certificate enabled",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "priceUsd",
          title: "Certificate price USD",
          type: "number",
          initialValue: 5,
        }),
        defineField({
          name: "certificateTitle",
          title: "Certificate title",
          type: "string",
          initialValue: "Certificate of Completion",
        }),
      ],
    }),

    defineField({
      name: "whatsappGroupUrl",
      title: "WhatsApp group link",
      description:
        "Shown to learners who register their interest while the course is not live yet, so they can join the group and hear the day it launches. Paste the group invite link (https://chat.whatsapp.com/...).",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["https"] }).custom((value) => {
          if (!value) return true;
          try {
            const host = new URL(value).hostname;
            return host === "wa.me" || host === "whatsapp.com" || host.endsWith(".whatsapp.com")
              ? true
              : "This should be a WhatsApp link (chat.whatsapp.com or wa.me)";
          } catch {
            return "Enter a valid link";
          }
        }),
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
});
