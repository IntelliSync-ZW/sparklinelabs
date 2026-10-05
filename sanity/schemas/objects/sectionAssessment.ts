import { defineArrayMember, defineField, defineType } from "sanity";

export const sectionAssessment = defineType({
  name: "sectionAssessment",
  title: "Section Assessment",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Assessment Title (Optional)",
      type: "string",
      initialValue: "Section Knowledge Check",
    }),

    defineField({
      name: "assessmentMode",
      title: "Assessment Source",
      type: "string",
      options: {
        list: [
          { title: "Embedded Questions (Quick check)", value: "inline" },
          { title: "Course Assessment Document (Reusable)", value: "reference" },
        ],
        layout: "radio",
      },
      initialValue: "inline",
    }),

    defineField({
      name: "assessmentRef",
      title: "Course Assessment Document",
      type: "reference",
      to: [{ type: "courseAssessment" }],
      hidden: ({ parent }) => parent?.assessmentMode !== "reference",
    }),

    defineField({
      name: "instructions",
      title: "Instructions / Prompt",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H3 (Subsection)", value: "h3" },
            { title: "H4 (Topic)", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
        }),
      ],
      description: "Brief guidance for the student before starting the check.",
    }),

    defineField({
      name: "questions",
      title: "Assessment Questions",
      type: "array",
      of: [{ type: "assessmentQuestionRef" }],
      hidden: ({ parent }) => parent?.assessmentMode === "reference",
      description: "Questions student must answer for this section.",
    }),

    defineField({
      name: "passingScore",
      title: "Passing Score (%)",
      type: "number",
      initialValue: 80,
      validation: (Rule) => Rule.min(0).max(100),
    }),

    defineField({
      name: "requiredToAdvance",
      title: "Required to Advance",
      type: "boolean",
      initialValue: true,
      description: "When enabled, student must achieve the passing score to unlock the next section.",
    }),

    defineField({
      name: "feedbackOnPass",
      title: "Feedback on Pass",
      type: "text",
      rows: 2,
      placeholder: "Great job! You have demonstrated key mastery of this section.",
    }),

    defineField({
      name: "feedbackOnFail",
      title: "Feedback on Retry",
      type: "text",
      rows: 2,
      placeholder: "Review the section material above and try again.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      passingScore: "passingScore",
      required: "requiredToAdvance",
      mode: "assessmentMode",
    },
    prepare({ title, passingScore, required, mode }) {
      const modeLabel = mode === "reference" ? "Document Ref" : "Embedded Questions";
      return {
        title: title || "Section Assessment",
        subtitle: `${required ? "🔒 Gated" : "Optional"} · Pass: ${passingScore ?? 80}% · ${modeLabel}`,
      };
    },
  },
});
