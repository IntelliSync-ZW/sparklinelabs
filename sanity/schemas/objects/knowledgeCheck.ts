import { defineField, defineType } from "sanity";

// A graded quiz attached to the end of a section.
export const knowledgeCheck = defineType({
  name: "knowledgeCheck",
  title: "Knowledge Check",
  type: "object",
  fields: [
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Write questions here", value: "inline" },
          { title: "Use an assessment from the library", value: "library" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "inline",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Knowledge check",
      hidden: ({ parent }) => parent?.source === "library",
    }),
    defineField({
      name: "questions",
      title: "Questions",
      type: "array",
      of: [{ type: "assessmentQuestionRef" }],
      hidden: ({ parent }) => parent?.source === "library",
    }),
    defineField({
      name: "ref",
      title: "Library assessment",
      type: "reference",
      to: [{ type: "courseAssessment" }],
      hidden: ({ parent }) => parent?.source !== "library",
    }),
    defineField({
      name: "passingScore",
      title: "Passing score (%)",
      type: "number",
      initialValue: 80,
      description: "Ignored when using a library assessment (it has its own).",
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "required",
      title: "Required to continue",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "scored",
      title: "Scored (counts towards the certificate)",
      type: "boolean",
      initialValue: false,
      description: "Only for required checks. Optional checks are practice and never scored.",
      hidden: ({ parent }) => !parent?.required,
    }),
    defineField({ name: "feedbackOnPass", title: "Feedback on pass", type: "text", rows: 2 }),
    defineField({ name: "feedbackOnFail", title: "Feedback on retry", type: "text", rows: 2 }),
  ],
  validation: (Rule) =>
    // Optional: with no questions (or no library pick) the section simply has no check.
    Rule.custom((value: { source?: string; ref?: unknown } | undefined) =>
      value?.source === "library" && !value.ref ? "Pick a library assessment, or switch back to writing questions here" : true
    ),
  preview: {
    select: { title: "title", refTitle: "ref.title", source: "source", required: "required", scored: "scored", passingScore: "passingScore" },
    prepare: ({ title, refTitle, source, required, scored, passingScore }) => ({
      title: (source === "library" ? refTitle : title) || "Knowledge check",
      subtitle: `${required ? (scored ? "Required · scored" : "Required") : "Optional"} · pass ${passingScore ?? 80}%`,
    }),
  },
});
