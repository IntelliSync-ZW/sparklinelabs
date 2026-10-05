import { defineField, defineType } from "sanity";

export const courseAssessment = defineType({
  name: "courseAssessment",
  title: "Course Assessment",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Assessment title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "assessmentType",
      title: "Assessment type",
      type: "string",
      options: {
        list: [
          { title: "Lesson", value: "lesson" },
          { title: "Module", value: "module" },
          { title: "Final", value: "final" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "instructions",
      title: "Instructions",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "passingScore",
      title: "Passing score",
      type: "number",
      initialValue: 80,
      validation: (Rule) => Rule.required().min(0).max(100),
    }),

    defineField({
      name: "attemptLimit",
      title: "Attempt limit",
      type: "number",
      description: "Leave empty for unlimited attempts.",
    }),

    defineField({
      name: "randomiseQuestions",
      title: "Randomise questions",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "questions",
      title: "Questions",
      type: "array",
      of: [{ type: "assessmentQuestionRef" }],
    }),
  ],
});
