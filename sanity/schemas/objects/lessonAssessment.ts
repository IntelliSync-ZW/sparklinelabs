import { defineArrayMember, defineField, defineType } from "sanity";
import { AUTO_GRADED_TASK_TYPES, isBlankTask } from "./taskFields";

// ---------------------------------------------------------------------------
// The end-of-lesson assessment: an ordered mix of questions and tasks. It is
// always scored and counts towards the course certificate. A lesson completes
// only when its sections are done and this assessment is passed.
// ---------------------------------------------------------------------------

/** One task inside an end-of-lesson assessment. */
export const assessmentTaskItem = defineType({
  name: "assessmentTaskItem",
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
      name: "points",
      title: "Points",
      type: "number",
      initialValue: 10,
      description:
        "Self-checked tasks (written response, prompt practice, checklist) must be completed but never add points: they can't be marked by the server.",
      validation: (Rule) => Rule.required().integer().min(1),
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value: { source?: string; ref?: unknown; inline?: unknown } | undefined) => {
      if (!value) return true;
      if (value.source === "library") return value.ref ? true : "Pick a library task, or remove this item";
      // Adding an item means the author wants a task here, so a blank one is an error.
      return isBlankTask(value.inline) ? "Fill in the task, or remove this item" : true;
    }),
  preview: {
    select: { source: "source", inlineTitle: "inline.title", inlineType: "inline.taskType", refTitle: "ref.title", refType: "ref.taskType", points: "points" },
    prepare: ({ source, inlineTitle, inlineType, refTitle, refType, points }) => {
      const type = source === "library" ? refType : inlineType;
      const scored = AUTO_GRADED_TASK_TYPES.includes(type ?? "");
      return {
        title: `📝 ${(source === "library" ? refTitle : inlineTitle) || "Untitled task"}`,
        subtitle: scored ? `${points ?? 10} pts · ${type}` : `Not scored (self-checked) · ${type ?? "task"}`,
      };
    },
  },
});

export const lessonAssessment = defineType({
  name: "lessonAssessment",
  title: "End-of-lesson assessment",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "End-of-lesson assessment",
    }),
    defineField({
      name: "instructions",
      title: "Instructions (optional)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "passingScore",
      title: "Pass mark (%)",
      type: "number",
      initialValue: 80,
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      name: "items",
      title: "Questions and tasks",
      description: "Choose the questions and tasks, in order. Every scored item counts towards the certificate.",
      type: "array",
      of: [
        defineArrayMember({ type: "assessmentQuestionRef", title: "Question" }),
        defineArrayMember({ type: "assessmentTaskItem", title: "Task" }),
      ],
      validation: (Rule) => Rule.required().min(1).error("Add at least one question or task"),
    }),
  ],
  preview: {
    select: { title: "title", items: "items", passingScore: "passingScore" },
    prepare: ({ title, items, passingScore }) => ({
      title: title || "End-of-lesson assessment",
      subtitle: `${Array.isArray(items) ? items.length : 0} item(s) · pass ${passingScore ?? 80}%`,
    }),
  },
});
