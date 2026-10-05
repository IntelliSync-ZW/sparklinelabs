import { defineField, defineType } from "sanity";

export const promptBlock = defineType({
  name: "promptBlock",
  title: "Prompt Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Try this prompt",
    }),
    defineField({
      name: "prompt",
      title: "Prompt",
      type: "text",
      rows: 8,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whyItWorks",
      title: "Why it works",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});
