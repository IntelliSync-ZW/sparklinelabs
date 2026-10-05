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
          { title: "Section", value: "section" },
          { title: "Lesson", value: "lesson" },
          { title: "Module", value: "module" },
          { title: "Final", value: "final" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "course",
      title: "Course",
      type: "reference",
      to: [{ type: "course" }],
      description: "Link this assessment directly to a course (for final assessments).",
      hidden: ({ parent }) => parent?.assessmentType && parent?.assessmentType !== "final",
    }),

    defineField({
      name: "module",
      title: "Course Module",
      type: "reference",
      to: [{ type: "courseModule" }],
      description: "Link this assessment directly to a module (for module assessments).",
      hidden: ({ parent }) => parent?.assessmentType && parent?.assessmentType !== "module",
    }),

    defineField({
      name: "lesson",
      title: "Course Lesson",
      type: "reference",
      to: [{ type: "courseLesson" }],
      description: "Link this assessment directly to a lesson (for lesson assessments).",
      hidden: ({ parent }) =>
        parent?.assessmentType &&
        parent?.assessmentType !== "lesson" &&
        parent?.assessmentType !== "section",
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
