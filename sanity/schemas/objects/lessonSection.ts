import { defineArrayMember, defineField, defineType } from "sanity";

export const lessonSection = defineType({
  name: "lessonSection",
  title: "Lesson Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section Title (H2)",
      type: "string",
      description:
        "Renders as the primary section heading (<h2>). Headings inside this section's content must strictly start at <h3>.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "sectionId",
      title: "Section Anchor / ID",
      type: "slug",
      options: {
        source: "title",
        maxLength: 30,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .slice(0, 30),
      },
      description:
        "Anchor slug automatically generated from the section title (max 30 characters). Used for URL hash links and progress tracking.",
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return true;
          if (slug.current.length > 30) {
            return "Section anchor must be 30 characters or fewer";
          }
          return true;
        }),
    }),

    defineField({
      name: "order",
      title: "Section Number",
      type: "number",
      description: "Sequential order of this section within the lesson.",
      validation: (Rule) => Rule.integer().positive(),
    }),

    defineField({
      name: "defaultOpen",
      title: "Default Open",
      description:
        "When toggled on, this section is expanded/open by default on page load. When off, it starts collapsed.",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "duration",
      title: "Estimated Duration",
      type: "object",
      description: "Estimated time to complete this section.",
      fields: [
        defineField({
          name: "value",
          title: "Value",
          type: "number",
          validation: (Rule) => Rule.positive(),
        }),
        defineField({
          name: "unit",
          title: "Unit",
          type: "string",
          options: {
            list: [
              { title: "Seconds", value: "seconds" },
              { title: "Minutes", value: "minutes" },
              { title: "Hours", value: "hours" },
            ],
            layout: "radio",
            direction: "horizontal",
          },
          initialValue: "minutes",
        }),
      ],
      options: {
        columns: 2,
      },
    }),

    defineField({
      name: "progression",
      title: "Progression & Section Gating",
      type: "object",
      description: "Controls how students unlock and advance past this section.",
      fields: [
        defineField({
          name: "required",
          title: "Required to Advance",
          type: "boolean",
          initialValue: true,
          description: "Student must complete this section before unlocking the next section.",
        }),
        defineField({
          name: "completionType",
          title: "Completion Gate",
          type: "string",
          options: {
            list: [
              { title: "Read / Scroll (Auto-complete when section is viewed)", value: "read" },
              { title: "Manual Checkbox ('Mark as Understood')", value: "manual" },
              { title: "Prompt Interaction (Run & test prompt)", value: "prompt" },
              { title: "Pass Section Assessment", value: "assessment" },
              { title: "Complete Section Task", value: "task" },
            ],
          },
          initialValue: "read",
        }),
      ],
    }),

    // ── Section Content (Strictly H3 and below) ───────────────────────────────
    defineField({
      name: "content",
      title: "Section Content",
      description:
        "Body content for this section. All headings strictly start from H3 down to H6 (H1 and H2 are forbidden to maintain semantic hierarchy).",
      type: "array",
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
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({ type: "callout" }),
        defineArrayMember({ type: "promptBlock" }),
        defineArrayMember({ type: "scenarioBlock" }),
        defineArrayMember({ type: "sectionTask" }),
        defineArrayMember({ type: "lessonTaskRef" }),
        defineArrayMember({ type: "sectionAssessment" }),
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

    // ── Dedicated Section Task (Optional) ─────────────────────────────────────
    defineField({
      name: "task",
      title: "Section Task (Optional)",
      description: "Attach an interactive practice task or challenge to this section.",
      type: "array",
      of: [
        defineArrayMember({
          type: "sectionTask",
          title: "Inline Task",
        }),
        defineArrayMember({
          type: "reference",
          title: "Course Task Reference",
          to: [{ type: "courseTask" }],
        }),
      ],
      validation: (Rule) => Rule.max(1),
    }),

    // ── Dedicated Section Assessment (Optional) ───────────────────────────────
    defineField({
      name: "assessment",
      title: "Section Assessment (Optional)",
      description: "Attach a knowledge check or quiz to this section.",
      type: "array",
      of: [
        defineArrayMember({
          type: "sectionAssessment",
          title: "Inline Assessment",
        }),
        defineArrayMember({
          type: "reference",
          title: "Course Assessment Reference",
          to: [{ type: "courseAssessment" }],
        }),
      ],
      validation: (Rule) => Rule.max(1),
    }),
  ],

  preview: {
    select: {
      title: "title",
      order: "order",
      defaultOpen: "defaultOpen",
      durationValue: "duration.value",
      durationUnit: "duration.unit",
      required: "progression.required",
      completionType: "progression.completionType",
      content: "content",
      task: "task",
      assessment: "assessment",
    },
    prepare({
      title,
      order,
      defaultOpen,
      durationValue,
      durationUnit,
      required,
      completionType,
      content,
      task,
      assessment,
    }) {
      const blockCount = Array.isArray(content) ? content.length : 0;
      const orderText = order ? `§${order}. ` : "";
      const lockText = required ? "🔒 Gated" : "🔓 Open";
      const openBadge = defaultOpen ? "📂 Open" : "📁 Collapsed";
      const durText = durationValue ? ` · ⏱️ ${durationValue} ${durationUnit || "min"}` : "";
      const taskBadge = Array.isArray(task) && task.length > 0 ? " · 📝 Task" : "";
      const quizBadge = Array.isArray(assessment) && assessment.length > 0 ? " · 🎯 Quiz" : "";
      return {
        title: `${orderText}${title || "Untitled Section (H2)"}`,
        subtitle: `${openBadge} · ${lockText} · Gate: ${completionType || "read"}${durText}${taskBadge}${quizBadge} · ${blockCount} block(s)`,
      };
    },
  },
});
