import { defineField, defineType } from "sanity";

export const contactLeadSchema = defineType({
  name: "contactLead",
  title: "Contact Lead",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as
            | { captureStatus?: string }
            | undefined;
          return parent?.captureStatus === "skipped" || value
            ? true
            : "Name is required for captured leads";
        }),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as
            | { captureStatus?: string }
            | undefined;
          return parent?.captureStatus === "skipped" || value
            ? true
            : "Phone is required for captured leads";
        }),
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "captureStatus",
      title: "Capture Status",
      type: "string",
      options: {
        list: [
          { title: "Captured details", value: "captured" },
          { title: "Skipped details", value: "skipped" },
        ],
      },
      initialValue: "captured",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "channel",
      title: "Channel",
      type: "string",
      options: {
        list: [
          { title: "WhatsApp", value: "whatsapp" },
          { title: "Email", value: "email" },
        ],
      },
      initialValue: "whatsapp",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stage",
      title: "Stage",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Qualified", value: "qualified" },
          { title: "Proposal", value: "proposal" },
          { title: "Won", value: "won" },
          { title: "Lost", value: "lost" },
        ],
        layout: "dropdown",
      },
      initialValue: "new",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stageHistory",
      title: "Stage History",
      type: "array",
      of: [
        {
          type: "object",
          name: "leadStageChange",
          fields: [
            defineField({
              name: "stage",
              title: "Stage",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "changedAt",
              title: "Changed At",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "stage", subtitle: "changedAt" },
          },
        },
      ],
    }),
    defineField({
      name: "service",
      title: "Service",
      type: "string",
    }),
    defineField({
      name: "pageTitle",
      title: "Enquiry Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageUrl",
      title: "Enquiry Page URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "pageTitle",
    },
  },
});
