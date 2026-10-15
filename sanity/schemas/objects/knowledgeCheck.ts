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
    defineField({ name: "feedbackOnPass", title: "Feedback on pass", type: "text", rows: 2 }),
    defineField({ name: "feedbackOnFail", title: "Feedback on retry", type: "text", rows: 2 }),
  ],
  validation: (Rule) =>
    Rule.custom((value: { source?: string; questions?: unknown[]; ref?: unknown } | undefined) => {
      if (!value) return true;
      if (value.source === "library" && !value.ref) return "Pick a library assessment";
      if (value.source !== "library" && !value.questions?.length) return "Add at least one question";
      return true;
    }),
  preview: {
    select: { title: "title", refTitle: "ref.title", source: "source", required: "required", passingScore: "passingScore" },
    prepare: ({ title, refTitle, source, required, passingScore }) => ({
      title: (source === "library" ? refTitle : title) || "Knowledge check",
      subtitle: `${required ? "Required" : "Optional"} · pass ${passingScore ?? 80}%`,
    }),
  },
});
