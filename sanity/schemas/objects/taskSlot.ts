import { defineField, defineType } from "sanity";

// A place where a task is attached (a section's practice, or a lesson project).
// Whether it gates progress belongs to the placement, not the task itself,
// so a library task can be required in one lesson and optional in another.
export const taskSlot = defineType({
  name: "taskSlot",
  title: "Task",
  type: "object",
  fields: [
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Write it here", value: "inline" },
          { title: "Use a task from the library", value: "library" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "inline",
    }),
    defineField({
      name: "inline",
      title: "Task",
      type: "inlineTask",
      hidden: ({ parent }) => parent?.source === "library",
    }),
    defineField({
      name: "ref",
      title: "Library task",
      type: "reference",
      to: [{ type: "courseTask" }],
      hidden: ({ parent }) => parent?.source !== "library",
    }),
    defineField({
      name: "required",
      title: "Required to continue",
      type: "boolean",
      initialValue: true,
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value: { source?: string; inline?: unknown; ref?: unknown } | undefined) => {
      if (!value) return true;
      if (value.source === "library" && !value.ref) return "Pick a library task";
      if (value.source !== "library" && !value.inline) return "Fill in the task";
      return true;
    }),
  preview: {
    select: { inlineTitle: "inline.title", refTitle: "ref.title", required: "required", source: "source" },
    prepare: ({ inlineTitle, refTitle, required, source }) => ({
      title: (source === "library" ? refTitle : inlineTitle) || "Untitled task",
      subtitle: `${required ? "Required" : "Optional"} · ${source === "library" ? "Library" : "Inline"}`,
    }),
  },
});
