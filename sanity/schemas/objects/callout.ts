import { defineArrayMember, defineField, defineType } from "sanity";

export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Important Note", value: "important" },
          { title: "Tip / Pro Tip", value: "tip" },
          { title: "Warning / Gotcha", value: "warning" },
          { title: "Practical Example", value: "example" },
          { title: "Zimbabwe Local Context", value: "zimbabwe" },
        ],
      },
      initialValue: "important",
    }),
    defineField({
      name: "title",
      title: "Title (Optional)",
      type: "string",
      placeholder: "e.g., Key Takeaway, Pro Tip, Caution",
    }),
    defineField({
      name: "body",
      title: "Body",
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
  ],

  preview: {
    select: {
      title: "title",
      type: "type",
    },
    prepare({ title, type }) {
      const typeIcons: Record<string, string> = {
        important: "💡 Important",
        tip: "✨ Pro Tip",
        warning: "⚠️ Warning",
        example: "📝 Example",
        zimbabwe: "🇿🇼 Zimbabwe Context",
      };
      return {
        title: title || "Callout",
        subtitle: type ? typeIcons[type] || type : "Callout",
      };
    },
  },
});
