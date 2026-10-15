import { defineField, defineType } from "sanity";
import { matchingFields } from "./objects/taskFields";

export const courseQuestion = defineType({
  name: "courseQuestion",
  title: "Course Question",
  type: "document",

  fields: [
    defineField({
      name: "questionType",
      title: "Question type",
      type: "string",
      options: {
        list: [
          { title: "Single choice", value: "single_choice" },
          { title: "Multiple choice", value: "multiple_choice" },
          { title: "True/false", value: "true_false" },
          { title: "Short answer", value: "short_answer" },
          { title: "Matching (align keys with options)", value: "matching" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "question",
      title: "Question",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "options",
      title: "Options",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Option ID",
              type: "string",
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
            }),
            defineField({
              name: "isCorrect",
              title: "Correct",
              type: "boolean",
            }),
            defineField({
              name: "explanation",
              title: "Explanation",
              type: "text",
              rows: 3,
            }),
          ],
        },
      ],
    }),

    ...matchingFields(({ parent }) => (parent as { questionType?: string })?.questionType !== "matching"),

    defineField({
      name: "correctAnswer",
      title: "Correct answer",
      type: "string",
    }),

    defineField({
      name: "explanation",
      title: "Answer explanation",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});
