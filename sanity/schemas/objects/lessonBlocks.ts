import { defineArrayMember, defineField, defineType } from "sanity";

// ---------------------------------------------------------------------------
// Additional lesson content blocks. Each renders with its own distinct design.
// ---------------------------------------------------------------------------

export const comparisonBlock = defineType({
  name: "comparisonBlock",
  title: "Comparison (Weak vs Strong)",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title (optional)", type: "string" }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      options: {
        list: [
          { title: "Prompt (monospace)", value: "prompt" },
          { title: "Text", value: "text" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "prompt",
    }),
    defineField({
      name: "weak",
      title: "Weak / Don't",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string", initialValue: "Weak" }),
        defineField({ name: "body", title: "Content", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
        defineField({ name: "note", title: "Why it falls short", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "strong",
      title: "Strong / Do",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string", initialValue: "Strong" }),
        defineField({ name: "body", title: "Content", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
        defineField({ name: "note", title: "Why it works", type: "text", rows: 2 }),
      ],
    }),
    defineField({ name: "takeaway", title: "Takeaway (optional)", type: "string" }),
  ],
  preview: {
    select: { title: "title", weak: "weak.label", strong: "strong.label" },
    prepare: ({ title, weak, strong }) => ({
      title: title || "Comparison",
      subtitle: `⚖️ ${weak || "Weak"} vs ${strong || "Strong"}`,
    }),
  },
});

export const stepsBlock = defineType({
  name: "stepsBlock",
  title: "Steps / Procedure",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title (optional)", type: "string" }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      validation: (Rule) => Rule.required().min(2),
      of: [
        defineArrayMember({
          type: "object",
          name: "procedureStep",
          fields: [
            defineField({ name: "title", title: "Step", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "body", title: "Detail", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", steps: "steps" },
    prepare: ({ title, steps }) => ({
      title: title || "Steps",
      subtitle: `🪜 ${Array.isArray(steps) ? steps.length : 0} steps`,
    }),
  },
});

export const keyTermBlock = defineType({
  name: "keyTermBlock",
  title: "Key Term",
  type: "object",
  fields: [
    defineField({ name: "term", title: "Term", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "definition", title: "Definition", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: "example", title: "Example (optional)", type: "text", rows: 2 }),
    defineField({ name: "alsoKnownAs", title: "Also known as", type: "array", of: [{ type: "string" }] }),
  ],
  preview: {
    select: { title: "term", subtitle: "definition" },
    prepare: ({ title, subtitle }) => ({ title: `📖 ${title || "Term"}`, subtitle }),
  },
});

// Ungraded, instant-feedback question inline with the reading.
export const checkpointBlock = defineType({
  name: "checkpointBlock",
  title: "Checkpoint (quick question)",
  type: "object",
  fields: [
    defineField({ name: "question", title: "Question", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({
      name: "options",
      title: "Options",
      type: "array",
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .custom((opts: { isCorrect?: boolean }[] | undefined) =>
            opts?.some((o) => o.isCorrect) ? true : "Mark at least one option correct"
          ),
      of: [
        defineArrayMember({
          type: "object",
          name: "checkpointOption",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "isCorrect", title: "Correct", type: "boolean", initialValue: false }),
            defineField({ name: "feedback", title: "Feedback when chosen", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "label", isCorrect: "isCorrect" },
            prepare: ({ title, isCorrect }) => ({ title, subtitle: isCorrect ? "✓ Correct" : "" }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "question" },
    prepare: ({ title }) => ({ title: title || "Checkpoint", subtitle: "❓ Checkpoint" }),
  },
});

export const videoBlock = defineType({
  name: "videoBlock",
  title: "Video",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      description: "YouTube, Vimeo or Loom link.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "chapters",
      title: "Chapters",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "videoChapter",
          fields: [
            defineField({
              name: "time",
              title: "Time (mm:ss)",
              type: "string",
              validation: (Rule) => Rule.regex(/^\d{1,2}:\d{2}(:\d{2})?$/, { name: "timestamp" }),
            }),
            defineField({ name: "label", title: "Label", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "time" } },
        }),
      ],
    }),
    defineField({ name: "transcript", title: "Transcript", type: "array", of: [{ type: "block" }] }),
  ],
  preview: {
    select: { title: "title", subtitle: "url" },
    prepare: ({ title, subtitle }) => ({ title: `🎬 ${title || "Video"}`, subtitle }),
  },
});

export const resourceBlock = defineType({
  name: "resourceBlock",
  title: "Resource / Download",
  type: "object",
  fields: [
    defineField({
      name: "resource",
      title: "Resource",
      type: "reference",
      to: [{ type: "courseResource" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "note", title: "Why it's useful (optional)", type: "string" }),
  ],
  preview: {
    select: { title: "resource.title", subtitle: "resource.resourceType" },
    prepare: ({ title, subtitle }) => ({ title: `📎 ${title || "Resource"}`, subtitle }),
  },
});
