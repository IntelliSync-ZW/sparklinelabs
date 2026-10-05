import { defineField, defineType } from "sanity";

export const courseSession = defineType({
  name: "courseSession",
  title: "Course Session",
  type: "document",

  fields: [
    defineField({
      name: "course",
      title: "Course",
      type: "reference",
      to: [{ type: "course" }],
    }),

    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "sessionType",
      title: "Session type",
      type: "string",
      options: {
        list: [
          { title: "Free public class", value: "public" },
          { title: "Paid cohort lab", value: "cohort" },
          { title: "Workshop", value: "workshop" },
        ],
      },
    }),

    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
    }),

    defineField({
      name: "meetingUrl",
      title: "Meeting URL",
      type: "url",
    }),

    defineField({
      name: "recordingUrl",
      title: "Recording URL",
      type: "url",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});
