import { defineField, defineType } from "sanity";

export const assessmentQuestionRef = defineType({
  name: "assessmentQuestionRef",
  title: "Assessment Question",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "reference",
      to: [{ type: "courseQuestion" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "points",
      title: "Points",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});
