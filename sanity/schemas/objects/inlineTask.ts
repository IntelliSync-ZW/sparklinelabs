import { defineType } from "sanity";
import { taskFields } from "./taskFields";

export const inlineTask = defineType({
  name: "inlineTask",
  title: "Inline Task",
  type: "object",
  fields: taskFields,
  preview: {
    select: { title: "title", subtitle: "taskType" },
  },
});
