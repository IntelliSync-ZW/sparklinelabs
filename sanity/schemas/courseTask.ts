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
      name: "taskType",
      title: "Task type",
      type: "string",
      options: {
        list: [
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
