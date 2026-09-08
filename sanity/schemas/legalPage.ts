import { defineField, defineType, defineArrayMember } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const legalPageSchema = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Document Title",
      type: "string",
      description: "e.g. Terms of Service, Privacy Policy",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "h1",
      title: "H1 / Hero Title",
      type: "string",
      description: "Primary headline displayed at top of the page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "version",
      title: "Version String",
      type: "string",
      description: "e.g. V 1.0, V 1.2",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated Date",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "effectiveDate",
      title: "Effective Date",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),
    defineField({
      name: "preambleHeading",
      title: "Preamble / Mandate Heading",
      type: "string",
      description: "e.g. Mandatory Legal Acknowledgment, Statutory Preamble and Data Stewardship",
    }),
    defineField({
      name: "preamble",
      title: "Preamble / Mandate Text",
      type: "text",
      rows: 4,
      description: "Opening statutory mandate or legal overview",
    }),
    defineField({
      name: "sections",
      title: "Legal Sections",
      type: "array",

      of: [
        defineArrayMember({
          type: "object",
          name: "legalSection",
          title: "Section",
          fields: [
            defineField({
              name: "id",
              title: "Section Anchor ID",
              type: "string",
              description: "URL-safe ID for hash linking (e.g. statutory-definitions)",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "sectionNumber",
              title: "Section Number",
              type: "string",
              description: "e.g. 1.0, 2.0",
            }),
            defineField({
              name: "title",
              title: "Section Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon Name",
              type: "string",
              description: "Lucide icon identifier (e.g. scale, shield, database, lock, code, file-text, alert-triangle, dollar-sign)",
              options: {
                list: [
                  { title: "Scale (Legal / Compliance)", value: "scale" },
                  { title: "Shield (Security / Protection)", value: "shield" },
                  { title: "Database (Data / Records)", value: "database" },
                  { title: "Lock (Security / Encryption)", value: "lock" },
                  { title: "Code (Technical / Systems)", value: "code" },
                  { title: "File Text (Agreement / Terms)", value: "file-text" },
                  { title: "Dollar Sign (Commercial / Billing)", value: "dollar-sign" },
                  { title: "Alert Triangle (Liability / Disclaimers)", value: "alert-triangle" },
                  { title: "User Check (Eligibility / Accounts)", value: "user-check" },
                  { title: "Globe (Jurisdiction / Infrastructure)", value: "globe" },
                  { title: "Book Open (Definitions)", value: "book-open" },
                  { title: "Share 2 (Disclosures / Subprocessors)", value: "share-2" },
                ],
              },
            }),
            defineField({
              name: "summary",
              title: "Brief Summary (optional)",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "content",
              title: "Content",
              type: "array",
              of: [
                { type: "block" },
                { type: "stlTableBlock" },
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "sectionNumber",
            },
            prepare({ title, subtitle }) {
              return {
                title: `${subtitle ? `${subtitle} ` : ""}${title || "Untitled Section"}`,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "version",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled Legal Document",
        subtitle: subtitle ? `Version ${subtitle}` : undefined,
      };
    },
  },
});
