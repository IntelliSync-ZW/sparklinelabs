import { defineArrayMember, defineField, defineType } from "sanity";

// A lesson is split into parts, each with its own heading, and each part holds
// an ordered list of sections. Learners see them as "Part 1 · Section 1".
// Progress is still tracked per section; parts only group and label them.
export const lessonPart = defineType({
  name: "lessonPart",
  title: "Lesson Part",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Part heading (H2)",
      type: "string",
      description: 'Shown under a "Part N" label above the part\'s sections.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 2,
      description: "Optional. A sentence or two under the heading about what this part covers.",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [defineArrayMember({ type: "lessonSection" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", sections: "sections" },
    prepare: ({ title, sections }) => {
      const count = Array.isArray(sections) ? sections.length : 0;
      return { title: title || "Untitled part", subtitle: `${count} section${count === 1 ? "" : "s"}` };
    },
  },
});
