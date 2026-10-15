import { defineField, defineType } from "sanity";
import { taskFields } from "./objects/taskFields";

// Reusable task library. Attach to a section or lesson through a `taskSlot`.
export const courseTask = defineType({
  name: "courseTask",
  title: "Course Task",
  type: "document",

  fields: [
    ...taskFields.slice(0, 1),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    ...taskFields.slice(1),
  ],

  preview: {
    select: { title: "title", subtitle: "taskType" },
  },
});
