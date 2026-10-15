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
    defineField({
      name: "scored",
      title: "Scored (counts towards the certificate)",
      type: "boolean",
      initialValue: false,
      description:
        "Only for required tasks. Self-checked types (written response, prompt practice, checklist) are never scored.",
      hidden: ({ parent }) => !parent?.required,
    }),
  ],
  validation: (Rule) =>
    // Optional: an untouched slot means "no task". The inline task's own fields
    // validate once the author starts filling it in.
    Rule.custom((value: { source?: string; ref?: unknown } | undefined) =>
      value?.source === "library" && !value.ref ? "Pick a library task, or switch back to writing one here" : true
    ),
  preview: {
    select: { inlineTitle: "inline.title", refTitle: "ref.title", required: "required", scored: "scored", source: "source" },
    prepare: ({ inlineTitle, refTitle, required, scored, source }) => ({
      title: (source === "library" ? refTitle : inlineTitle) || "Untitled task",
      subtitle: `${required ? (scored ? "Required · scored" : "Required") : "Optional"} · ${source === "library" ? "Library" : "Inline"}`,
    }),
  },
});
