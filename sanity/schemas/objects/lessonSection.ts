import { defineArrayMember, defineField, defineType } from "sanity";
import { removableObjectInput } from "../../components/removable-object-input";

// A lesson is an ordered list of sections. Each section has three parts:
//   content  — reading material and ungraded blocks
//   practice — one optional task
//   check    — one optional graded knowledge check
// There is no manual "mark as complete". A section completes when the learner
// passes its required check and/or task; a section with neither completes once read.
export const lessonSection = defineType({
  name: "lessonSection",
  title: "Lesson Section",
  type: "object",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "practice", title: "Practice & check" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Section title (H2)",
      type: "string",
      group: "content",
      description: "Renders as the section heading. Headings inside the content start at H3.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "sectionId",
      title: "Anchor",
      type: "slug",
      group: "settings",
      options: {
        source: (_doc, ctx) => (ctx.parent as { title?: string })?.title ?? "",
        maxLength: 30,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .slice(0, 30),
      },
      description: "Used for #links and progress tracking. Don't change it after learners have started.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "estimatedMinutes",
      title: "Estimated minutes",
      type: "number",
      group: "settings",
      validation: (Rule) => Rule.integer().positive(),
    }),

    defineField({
      name: "content",
      title: "Content",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H3 (Subsection)", value: "h3" },
            { title: "H4 (Topic)", value: "h4" },
            { title: "H5 (Subtopic)", value: "h5" },
            { title: "H6 (Minor)", value: "h6" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({ type: "callout" }),
        defineArrayMember({ type: "promptBlock" }),
        defineArrayMember({ type: "scenarioBlock" }),
        defineArrayMember({ type: "comparisonBlock" }),
        defineArrayMember({ type: "stepsBlock" }),
        defineArrayMember({ type: "keyTermBlock" }),
        defineArrayMember({ type: "checkpointBlock" }),
        defineArrayMember({ type: "videoBlock" }),
        defineArrayMember({ type: "resourceBlock" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
        defineArrayMember({ type: "stlTableBlock" }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "practice",
      title: "Practice task (optional)",
      type: "taskSlot",
      group: "practice",
      components: { input: removableObjectInput("task") },
    }),

    defineField({
      name: "check",
      title: "Knowledge check (optional)",
      type: "knowledgeCheck",
      group: "practice",
      components: { input: removableObjectInput("knowledge check") },
    }),
  ],

  preview: {
    select: {
      title: "title",
      minutes: "estimatedMinutes",
      content: "content",
      practiceRequired: "practice.required",
      practiceSource: "practice.source",
      practiceTitle: "practice.inline.title",
      practiceRef: "practice.ref",
      checkRequired: "check.required",
      checkSource: "check.source",
      checkQuestions: "check.questions",
      checkRef: "check.ref",
    },
    prepare({
      title,
      minutes,
      content,
      practiceRequired,
      practiceSource,
      practiceTitle,
      practiceRef,
      checkRequired,
      checkSource,
      checkQuestions,
      checkRef,
    }) {
      // Mirrors the site: an untouched (default-filled) task or check doesn't count.
      const hasTask = practiceSource === "library" ? Boolean(practiceRef) : Boolean(practiceTitle);
      const hasCheck = checkSource === "library" ? Boolean(checkRef) : Array.isArray(checkQuestions) && checkQuestions.length > 0;
      const blocks = Array.isArray(content) ? content.length : 0;
      const parts = [
        `${blocks} block${blocks === 1 ? "" : "s"}`,
        minutes ? `⏱ ${minutes} min` : null,
        hasTask ? `📝 Task${practiceRequired ? " (req)" : ""}` : null,
        hasCheck ? `🎯 Check${checkRequired ? " (req)" : ""}` : null,
        !hasTask && !hasCheck ? "Completes when read" : null,
      ].filter(Boolean);
      return { title: title || "Untitled section", subtitle: parts.join(" · ") };
    },
  },
});
