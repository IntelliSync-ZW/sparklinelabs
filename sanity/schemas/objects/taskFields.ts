import { defineArrayMember, defineField } from "sanity";

// ---------------------------------------------------------------------------
// Shared task anatomy — used by both the reusable `courseTask` document and the
// `inlineTask` object, so a task looks and behaves the same wherever it lives.
// ---------------------------------------------------------------------------

export const TASK_TYPES = [
  { title: "Classification table (choose a category per row)", value: "classification" },
  { title: "Multiple choice", value: "multiple_choice" },
  { title: "Matching (reorder keys and options until each row aligns)", value: "matching" },
  { title: "Ordering (put steps in the right sequence)", value: "ordering" },
  { title: "Source verification (judge claims)", value: "source_verification" },
  { title: "Prompt practice (run a prompt, reflect on the output)", value: "prompt_practice" },
  { title: "Written response", value: "written" },
  { title: "Action checklist", value: "checklist" },
] as const;

/** Types scored on the server against an answer key. The rest are self-checked against the rubric. */
export const AUTO_GRADED_TASK_TYPES = ["classification", "multiple_choice", "matching", "ordering", "source_verification"];

type TaskParent = { taskType?: string } | undefined;
const isType = (...types: string[]) => ({ parent }: { parent?: TaskParent }) =>
  !types.includes(parent?.taskType ?? "");

const instructionBlock = defineArrayMember({
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
});

export const taskFields = [
  // ── Header ────────────────────────────────────────────────────────────────
  defineField({
    name: "title",
    title: "Task title",
    type: "string",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "taskType",
    title: "Task type",
    type: "string",
    options: { list: [...TASK_TYPES] },
    initialValue: "classification",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "objective",
    title: "Objective",
    type: "string",
    description: "One line: what the learner will be able to do after this task.",
    validation: (Rule) => Rule.max(160),
  }),
  defineField({
    name: "estimatedMinutes",
    title: "Estimated minutes",
    type: "number",
    validation: (Rule) => Rule.integer().positive(),
  }),
  defineField({
    name: "points",
    title: "Points",
    type: "number",
    initialValue: 10,
    validation: (Rule) => Rule.integer().min(0),
  }),
  defineField({
    name: "passingScore",
    title: "Passing score (%)",
    type: "number",
    initialValue: 80,
    validation: (Rule) => Rule.min(0).max(100),
    hidden: ({ parent }) => !AUTO_GRADED_TASK_TYPES.includes((parent as TaskParent)?.taskType ?? ""),
  }),

  // ── Brief ─────────────────────────────────────────────────────────────────
  defineField({
    name: "context",
    title: "Context / brief (optional)",
    type: "array",
    of: [instructionBlock],
    description: "Short scene-setting shown above the steps.",
  }),
  defineField({
    name: "steps",
    title: "Steps",
    type: "array",
    description: "Numbered instructions. Keep each step to one action.",
    of: [
      defineArrayMember({
        type: "object",
        name: "taskStep",
        fields: [
          defineField({ name: "title", title: "Step", type: "string", validation: (Rule) => Rule.required() }),
          defineField({ name: "detail", title: "Detail (optional)", type: "text", rows: 2 }),
        ],
        preview: { select: { title: "title", subtitle: "detail" } },
      }),
    ],
  }),
  defineField({
    name: "deliverable",
    title: "Expected deliverable",
    type: "text",
    rows: 2,
    placeholder: "e.g., Paste the corrected response with 2 verified citations.",
  }),

  // ── Classification ────────────────────────────────────────────────────────
  defineField({
    name: "classificationOptions",
    title: "Categories",
    type: "array",
    of: [{ type: "string" }],
    description: "The choices available on every row (e.g. Lookup, Calculation, Generation).",
    hidden: isType("classification"),
    validation: (Rule) =>
      Rule.custom((value, ctx) =>
        (ctx.parent as TaskParent)?.taskType === "classification" && (!Array.isArray(value) || value.length < 2)
          ? "Add at least two categories"
          : true
      ),
  }),
  defineField({
    name: "classificationColumns",
    title: "Column headers",
    type: "object",
    fields: [
      defineField({ name: "itemLabel", title: "Item column", type: "string", initialValue: "Task" }),
      defineField({ name: "answerLabel", title: "Answer column", type: "string", initialValue: "Category" }),
    ],
    options: { columns: 2 },
    hidden: isType("classification"),
  }),
  defineField({
    name: "classificationRows",
    title: "Rows",
    type: "array",
    hidden: isType("classification"),
    of: [
      defineArrayMember({
        type: "object",
        name: "classificationRow",
        fields: [
          defineField({ name: "item", title: "Item", type: "string", validation: (Rule) => Rule.required() }),
          defineField({
            name: "correctAnswer",
            title: "Correct category",
            type: "string",
            validation: (Rule) =>
              Rule.required().custom((value, ctx) => {
                const doc = ctx.document as { classificationOptions?: string[] } | undefined;
                // Inline tasks nest one level deeper; walk the path to find the sibling options.
                const options =
                  doc?.classificationOptions ??
                  findSiblingOptions(ctx.document, ctx.path as (string | { _key: string })[]);
                if (!value || !options) return true;
                return options.includes(value) ? true : `Must be one of: ${options.join(", ")}`;
              }),
          }),
          defineField({ name: "explanation", title: "Why", type: "text", rows: 2 }),
        ],
        preview: {
          select: { title: "item", subtitle: "correctAnswer" },
        },
      }),
    ],
  }),

  // ── Multiple choice ───────────────────────────────────────────────────────
  defineField({
    name: "question",
    title: "Question",
    type: "text",
    rows: 2,
    hidden: isType("multiple_choice"),
  }),
  defineField({
    name: "allowMultiple",
    title: "Allow multiple answers",
    type: "boolean",
    initialValue: false,
    hidden: isType("multiple_choice"),
  }),
  defineField({
    name: "choices",
    title: "Choices",
    type: "array",
    hidden: isType("multiple_choice"),
    of: [
      defineArrayMember({
        type: "object",
        name: "taskChoice",
        fields: [
          defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
          defineField({ name: "isCorrect", title: "Correct", type: "boolean", initialValue: false }),
          defineField({ name: "explanation", title: "Explanation", type: "text", rows: 2 }),
        ],
        preview: {
          select: { title: "label", isCorrect: "isCorrect" },
          prepare: ({ title, isCorrect }) => ({ title, subtitle: isCorrect ? "✓ Correct" : "" }),
        },
      }),
    ],
  }),

  // ── Matching ──────────────────────────────────────────────────────────────
  ...matchingFields(isType("matching")),

  // ── Ordering ──────────────────────────────────────────────────────────────
  defineField({
    name: "orderingItems",
    title: "Items in the correct order",
    type: "array",
    of: [{ type: "string" }],
    description: "Enter items in the correct order. Learners see them shuffled.",
    hidden: isType("ordering"),
  }),

  // ── Source verification ───────────────────────────────────────────────────
  defineField({
    name: "claims",
    title: "Claims to verify",
    type: "array",
    hidden: isType("source_verification"),
    of: [
      defineArrayMember({
        type: "object",
        name: "verificationClaim",
        fields: [
          defineField({ name: "claim", title: "Claim", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
          defineField({
            name: "verdict",
            title: "Correct verdict",
            type: "string",
            options: {
              list: [
                { title: "Supported", value: "supported" },
                { title: "Not supported", value: "unsupported" },
                { title: "Cannot be verified", value: "unverifiable" },
              ],
              layout: "radio",
            },
            validation: (Rule) => Rule.required(),
          }),
          defineField({ name: "explanation", title: "Explanation", type: "text", rows: 2 }),
          defineField({ name: "sourceUrl", title: "Reference source (shown after submit)", type: "url" }),
        ],
        preview: { select: { title: "claim", subtitle: "verdict" } },
      }),
    ],
  }),

  // ── Prompt practice ───────────────────────────────────────────────────────
  defineField({
    name: "starterPrompt",
    title: "Starter prompt",
    type: "text",
    rows: 5,
    hidden: isType("prompt_practice"),
  }),
  defineField({
    name: "targetAiTool",
    title: "Suggested AI tool",
    type: "string",
    options: {
      list: [
        { title: "Any AI assistant", value: "any" },
        { title: "ChatGPT", value: "chatgpt" },
        { title: "Claude", value: "claude" },
        { title: "Gemini", value: "gemini" },
        { title: "Perplexity", value: "perplexity" },
      ],
    },
    initialValue: "any",
    hidden: isType("prompt_practice"),
  }),

  // ── Written response ──────────────────────────────────────────────────────
  defineField({
    name: "wordRange",
    title: "Word range",
    type: "object",
    fields: [
      defineField({ name: "min", title: "Min", type: "number" }),
      defineField({ name: "max", title: "Max", type: "number" }),
    ],
    options: { columns: 2 },
    hidden: isType("written", "prompt_practice"),
  }),
  defineField({
    name: "responsePlaceholder",
    title: "Response placeholder",
    type: "string",
    hidden: isType("written", "prompt_practice"),
  }),

  // ── Checklist ─────────────────────────────────────────────────────────────
  defineField({
    name: "checklistItems",
    title: "Checklist items",
    type: "array",
    of: [{ type: "string" }],
    hidden: isType("checklist"),
  }),

  // ── Support & review ──────────────────────────────────────────────────────
  defineField({
    name: "rubric",
    title: "Success criteria / rubric",
    type: "array",
    description: "Shown to the learner up front. For written and prompt tasks they self-check against it.",
    of: [
      defineArrayMember({
        type: "object",
        name: "rubricCriterion",
        fields: [
          defineField({ name: "criterion", title: "Criterion", type: "string", validation: (Rule) => Rule.required() }),
          defineField({ name: "description", title: "What good looks like", type: "text", rows: 2 }),
        ],
        preview: { select: { title: "criterion", subtitle: "description" } },
      }),
    ],
    validation: (Rule) =>
      Rule.custom((value, ctx) => {
        const type = (ctx.parent as TaskParent)?.taskType ?? "";
        const needsRubric = ["written", "prompt_practice"].includes(type);
        return needsRubric && (!Array.isArray(value) || value.length === 0)
          ? "Written and prompt tasks need at least one rubric criterion"
          : true;
      }),
  }),
  defineField({
    name: "hints",
    title: "Hints",
    type: "array",
    of: [{ type: "text", rows: 2 }],
    description: "Revealed one at a time, in order.",
  }),
  defineField({
    name: "modelAnswer",
    title: "Model answer",
    type: "array",
    of: [instructionBlock],
    description: "Shown after the learner submits.",
  }),
];

/**
 * Two-column matching: each pair is a key and the option that belongs beside it.
 * Learners see both columns shuffled independently and reorder them until every
 * row aligns. Shared with `courseQuestion` so quizzes can use the same format.
 */
export function matchingFields(hidden: (ctx: { parent?: TaskParent }) => boolean) {
  return [
    defineField({
      name: "matchColumns",
      title: "Column headers",
      type: "object",
      fields: [
        defineField({ name: "keyLabel", title: "Keys column", type: "string", initialValue: "Term" }),
        defineField({ name: "optionLabel", title: "Options column", type: "string", initialValue: "Meaning" }),
      ],
      options: { columns: 2 },
      hidden,
    }),
    defineField({
      name: "matchPairs",
      title: "Pairs (in the correct alignment)",
      type: "array",
      description: "Enter each key next to its correct option. Both columns are shuffled for the learner.",
      hidden,
      validation: (Rule) =>
        Rule.custom((pairs: { key?: string; option?: string }[] | undefined, ctx) => {
          if (hidden({ parent: ctx.parent as TaskParent })) return true;
          if (!pairs || pairs.length < 2) return "Add at least two pairs";
          const norm = (v?: string) => (v ?? "").trim().toLowerCase();
          if (new Set(pairs.map((p) => norm(p.key))).size !== pairs.length) return "Keys must be unique";
          if (new Set(pairs.map((p) => norm(p.option))).size !== pairs.length) return "Options must be unique";
          return true;
        }),
      of: [
        defineArrayMember({
          type: "object",
          name: "matchPair",
          fields: [
            defineField({ name: "key", title: "Key", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "option", title: "Matching option", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "explanation", title: "Why they match", type: "text", rows: 2 }),
          ],
          preview: {
            select: { key: "key", option: "option" },
            prepare: ({ key, option }) => ({ title: `${key || "?"}  ↔  ${option || "?"}` }),
          },
        }),
      ],
    }),
  ];
}

function findSiblingOptions(
  doc: unknown,
  path: (string | { _key: string })[] | undefined
): string[] | undefined {
  if (!doc || !path) return undefined;
  // Walk down to the object that owns `classificationRows`.
  const idx = path.lastIndexOf("classificationRows");
  let node: unknown = doc;
  for (const seg of path.slice(0, idx)) {
    if (node == null) return undefined;
    if (typeof seg === "string") node = (node as Record<string, unknown>)[seg];
    else node = (node as { _key: string }[]).find((n) => n._key === seg._key);
  }
  return (node as { classificationOptions?: string[] } | undefined)?.classificationOptions;
}
