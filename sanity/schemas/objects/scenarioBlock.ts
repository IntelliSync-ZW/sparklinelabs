import { defineArrayMember, defineField, defineType } from "sanity";

export const scenarioBlock = defineType({
  name: "scenarioBlock",
  title: "Scenario Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Scenario Title (Optional)",
      type: "string",
      placeholder: "e.g., Cross-Border Payment Dispute, Fact-Checking Draft Policy",
    }),

    defineField({
      name: "badge",
      title: "Scenario Label / Badge (Optional)",
      type: "string",
      placeholder: "e.g., Real-World Case, Workplace Dilemma, Research Simulation",
      initialValue: "Real-World Scenario",
    }),

    defineField({
      name: "body",
      title: "Scenario Text",
      description: "The narrative description of the case or workplace situation.",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H4", value: "h4" },
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
                  },
                ],
              },
            ],
          },
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "questionOrChallenge",
      title: "Challenge / Prompt Question (Optional)",
      type: "text",
      rows: 2,
      placeholder: "e.g., How would you prompt an AI to identify the hidden risk in this document?",
    }),
  ],

  preview: {
    select: {
      title: "title",
      badge: "badge",
      body: "body",
    },
    prepare({ title, badge, body }) {
      const firstBlock = Array.isArray(body)
        ? body.find(
            (b: { _type?: string; children?: Array<{ text?: string }> }) =>
              b._type === "block" && Array.isArray(b.children)
          )
        : null;
      const snippet = firstBlock?.children
        ? firstBlock.children.map((c: { text?: string }) => c.text || "").join("")
        : "";

      return {
        title: title || (snippet ? `${snippet.slice(0, 45)}...` : "Scenario Block"),
        subtitle: `🎭 ${badge || "Scenario"}`,
      };
    },
  },
});
