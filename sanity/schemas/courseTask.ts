import { defineField, defineType } from "sanity";

export const courseTask = defineType({
  name: "courseTask",
  title: "Course Task",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Task title",
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
      name: "lesson",
      title: "Course Lesson",
      type: "reference",
      to: [{ type: "courseLesson" }],
      description: "Link this task directly to a course lesson.",
    }),

    defineField({
      name: "module",
      title: "Course Module",
      type: "reference",
      to: [{ type: "courseModule" }],
      description: "Link this task directly to a course module (optional).",
    }),

    defineField({
      name: "taskType",
      title: "Task type",
      type: "string",
      options: {
        list: [
          { title: "Classification / Matching Table (e.g. Choose Job Type)", value: "classification" },
          { title: "Multiple choice", value: "multiple_choice" },
          { title: "Short answer", value: "short_answer" },
          { title: "Long answer", value: "long_answer" },
          { title: "Structured response", value: "structured" },
          { title: "Source verification", value: "source_verification" },
          { title: "Practical submission", value: "practical" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "classificationInstruction",
      title: "Task Instructions / Prompt",
      type: "string",
      placeholder: "e.g., For each task, choose the job type.",
      initialValue: "For each task, choose the job type.",
      hidden: ({ parent }) => parent?.taskType !== "classification",
    }),

    defineField({
      name: "classificationOptions",
      title: "Available Options / Categories",
      type: "array",
      of: [{ type: "string" }],
      description: "Options the student can choose from for each row (e.g. 'Lookup', 'Calculation', 'Generation').",
      hidden: ({ parent }) => parent?.taskType !== "classification",
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
      hidden: ({ parent }) => parent?.taskType !== "classification",
    }),

    defineField({
      name: "classificationRows",
      title: "Task Items / Rows",
      type: "array",
      description: "List of items to classify with the correct answer and explanation.",
      of: [
        {
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
        },
      ],
      hidden: ({ parent }) => parent?.taskType !== "classification",
    }),

    defineField({
      name: "instructions",
      title: "Instructions",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "submissionFields",
      title: "Submission fields",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "key",
              title: "Key",
              type: "string",
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
            }),
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Text", value: "text" },
                  { title: "Textarea", value: "textarea" },
                  { title: "URL", value: "url" },
                  { title: "Select", value: "select" },
                  { title: "Checkbox", value: "checkbox" },
                ],
              },
            }),
            defineField({
              name: "required",
              title: "Required",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "options",
              title: "Options",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
        },
      ],
    }),

    defineField({
      name: "evaluationType",
      title: "Evaluation type",
      type: "string",
      options: {
        list: [
          { title: "Automatic", value: "automatic" },
          { title: "Manual", value: "manual" },
        ],
      },
      initialValue: "automatic",
    }),

    defineField({
      name: "passingScore",
      title: "Passing score",
      type: "number",
      initialValue: 80,
      validation: (Rule) => Rule.min(0).max(100),
    }),

    defineField({
      name: "correctRules",
      title: "Automatic grading rules",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "field",
              title: "Field",
              type: "string",
            }),
            defineField({
              name: "operator",
              title: "Operator",
              type: "string",
              options: {
                list: [
                  { title: "Equals", value: "equals" },
                  { title: "Contains", value: "contains" },
                  { title: "Not equals", value: "not_equals" },
                ],
              },
            }),
            defineField({
              name: "expectedValue",
              title: "Expected value",
              type: "string",
            }),
            defineField({
              name: "points",
              title: "Points",
              type: "number",
              initialValue: 1,
            }),
          ],
        },
      ],
    }),
  ],
});
