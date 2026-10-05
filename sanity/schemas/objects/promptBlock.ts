import { defineArrayMember, defineField, defineType } from "sanity";

export const promptBlock = defineType({
  name: "promptBlock",
  title: "Prompt Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Block Title",
      type: "string",
      initialValue: "Try this prompt",
      placeholder: "e.g., Executive Summary Generator, Fact-Check Prompt",
    }),

    defineField({
      name: "targetAiTool",
      title: "Target AI Tool (Optional)",
      type: "string",
      options: {
        list: [
          { title: "Any AI Assistant", value: "any" },
          { title: "ChatGPT (GPT-4o)", value: "chatgpt" },
          { title: "Google Gemini", value: "gemini" },
          { title: "Claude (Anthropic)", value: "claude" },
          { title: "Perplexity AI", value: "perplexity" },
        ],
      },
      initialValue: "any",
    }),

    defineField({
      name: "prompt",
      title: "Prompt Text",
      type: "text",
      rows: 6,
      description: "The verbatim prompt template for the student to copy and execute.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "expectedOutput",
      title: "What to Look For in the Output",
      type: "text",
      rows: 3,
      placeholder: "e.g., Notice how the model structures the response with bullet points and explicit citations.",
    }),

    defineField({
      name: "whyItWorks",
      title: "Why It Works (Technique Breakdown)",
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
          },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: "title",
      prompt: "prompt",
      tool: "targetAiTool",
    },
    prepare({ title, prompt, tool }) {
      const toolMap: Record<string, string> = {
        any: "Any AI",
        chatgpt: "ChatGPT",
        gemini: "Gemini",
        claude: "Claude",
        perplexity: "Perplexity",
      };
      const toolLabel = tool ? toolMap[tool] || tool : "Prompt";
      const snippet = prompt ? `${prompt.slice(0, 45)}...` : "Empty prompt";
      return {
        title: title || "Prompt Block",
        subtitle: `[${toolLabel}] ${snippet}`,
      };
    },
  },
});
