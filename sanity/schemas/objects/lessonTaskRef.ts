import { defineField, defineType } from "sanity";

export const lessonTaskRef = defineType({
  name: "lessonTaskRef",
  title: "Lesson Task",
  type: "object",
  fields: [
    defineField({
      name: "task",
      title: "Task",
      type: "reference",
      to: [{ type: "courseTask" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "requirement",
      title: "Requirement",
      type: "string",
      options: {
        list: [
          { title: "Optional practice", value: "optional" },
          { title: "Required to continue", value: "required" },
        ],
      },
      initialValue: "optional",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
