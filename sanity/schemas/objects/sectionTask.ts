import { defineArrayMember, defineField, defineType } from "sanity";

export const sectionTask = defineType({
  name: "sectionTask",
  title: "Section Task",
  type: "object",
  fields: [
    defineField({
      name: "taskMode",
      title: "Task Mode",
      type: "string",
      options: {
        list: [
          { title: "Direct Inline Task", value: "inline" },
          { title: "Course Task Document (Reusable)", value: "reference" },
        ],
        layout: "radio",
      },
      initialValue: "inline",
    }),

    defineField({
      name: "taskRef",
      title: "Course Task Document",
      type: "reference",
      to: [{ type: "courseTask" }],
      hidden: ({ parent }) => parent?.taskMode !== "reference",
    }),

    defineField({
      name: "title",
      title: "Task Title (Optional)",
      type: "string",
      placeholder: "e.g., Audit an AI Output for Hallucinations",
    }),

    defineField({
      name: "taskType",
      title: "Task Type",
      type: "string",
      options: {
        list: [
          { title: "Classification / Matching Table (e.g. Choose Job Type)", value: "classification" },
          { title: "Prompt Output Evaluation", value: "prompt_evaluation" },
          { title: "Practical Exercise", value: "practical" },
          { title: "Source Verification Check", value: "source_verification" },
          { title: "Short Answer", value: "short_answer" },
          { title: "Long / Structured Response", value: "long_answer" },
          { title: "Action Checklist / Self-attestation", value: "checkbox" },
        ],
      },
      initialValue: "classification",
      hidden: ({ parent }) => parent?.taskMode === "reference",
    }),

    defineField({
      name: "classificationInstruction",
      title: "Task Instructions / Prompt",
      type: "string",
      placeholder: "e.g., For each task, choose the job type.",
      initialValue: "For each task, choose the job type.",
      hidden: ({ parent }) => parent?.taskMode === "reference" || parent?.taskType !== "classification",
    }),

    defineField({
      name: "classificationOptions",
      title: "Available Options / Categories",
      type: "array",
      of: [{ type: "string" }],
      description: "Options the student can choose from for each row (e.g. 'Lookup', 'Calculation', 'Generation').",
      hidden: ({ parent }) => parent?.taskMode === "reference" || parent?.taskType !== "classification",
    }),

    defineField({
      name: "classificationColumns",
      title: "Column Headers",
      type: "object",
      fields: [
        defineField({ name: "taskLabel", title: "Task Column Label", type: "string", initialValue: "Task" }),
        defineField({ name: "answerLabel", title: "Answer Column Label", type: "string", initialValue: "Answer" }),
        defineField({ name: "whyLabel", title: "Explanation Column Label", type: "string", initialValue: "Why" }),
      ],
      options: { columns: 3 },
      hidden: ({ parent }) => parent?.taskMode === "reference" || parent?.taskType !== "classification",
    }),

    defineField({
      name: "classificationRows",
      title: "Task Items / Rows",
      type: "array",
      description: "List of items to classify with the correct answer and explanation.",
      of: [
        defineArrayMember({
          type: "object",
          name: "classificationRow",
          title: "Row",
          fields: [
            defineField({
              name: "task",
              title: "Task / Prompt / Scenario",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "correctAnswer",
              title: "Correct Answer",
              type: "string",
              description: "Must match one of the available options above (e.g., 'Lookup').",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "explanation",
              title: "Why / Explanation",
              type: "text",
              rows: 2,
              description: "Rationale shown to student explaining why this answer is correct.",
            }),
          ],
          preview: {
            select: {
              task: "task",
              correctAnswer: "correctAnswer",
              explanation: "explanation",
            },
            prepare({ task, correctAnswer, explanation }) {
              return {
                title: task || "Untitled row",
                subtitle: `Answer: ${correctAnswer || "—"} | ${explanation ? explanation.slice(0, 45) + "…" : "No explanation"}`,
              };
            },
          },
        }),
      ],
      hidden: ({ parent }) => parent?.taskMode === "reference" || parent?.taskType !== "classification",
    }),

    defineField({
      name: "promptToTest",
      title: "Prompt to Run / Evaluate (Optional)",
      type: "text",
      rows: 4,
      description: "If this task requires the student to test a prompt in an AI tool, paste the starting prompt here.",
      hidden: ({ parent }) => parent?.taskMode === "reference" || parent?.taskType === "classification",
    }),

    defineField({
      name: "instructions",
      title: "Task Instructions",
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
      hidden: ({ parent }) => parent?.taskMode === "reference",
    }),

    defineField({
      name: "deliverable",
      title: "Expected Deliverable / Output",
      type: "text",
      rows: 2,
      placeholder: "e.g., Paste the corrected response with 2 verified citations.",
      hidden: ({ parent }) => parent?.taskMode === "reference",
    }),

    defineField({
      name: "requirement",
      title: "Progression Requirement",
      type: "string",
      options: {
        list: [
          { title: "Required to advance to next section", value: "required" },
          { title: "Optional practice", value: "optional" },
        ],
        layout: "radio",
      },
      initialValue: "optional",
    }),
  ],

  preview: {
    select: {
      title: "title",
      taskRefTitle: "taskRef.title",
      mode: "taskMode",
      requirement: "requirement",
    },
    prepare({ title, taskRefTitle, mode, requirement }) {
      const displayTitle = mode === "reference" ? taskRefTitle || "Referenced Task" : title || "Inline Task";
      const isReq = requirement === "required";
      return {
        title: displayTitle,
        subtitle: `${isReq ? "🔒 Required Task" : "Optional Task"} · Mode: ${mode || "inline"}`,
      };
    },
  },
});
