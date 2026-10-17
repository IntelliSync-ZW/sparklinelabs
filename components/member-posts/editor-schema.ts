import { defineSchema } from "@portabletext/editor";
import { DECORATORS, LISTS, STYLES } from "@/lib/member-posts/schemas";

/**
 * Editor schema: the subset of the post `body` field authors can use. Kept in
 * step with the Zod schemas in lib/member-posts/schemas.ts.
 */
export const schemaDefinition = defineSchema({
  decorators: DECORATORS.map((name) => ({ name })),
  styles: STYLES.map((name) => ({ name })),
  lists: LISTS.map((name) => ({ name })),
  annotations: [
    { name: "link", fields: [{ name: "href", type: "string" }] },
    // Added by editors in Studio; the toolbar offers no way to create one
    { name: "reviewComment", fields: [{ name: "comment", type: "string" }] },
  ],
  inlineObjects: [],
  blockObjects: [
    {
      name: "image",
      fields: [
        { name: "asset", type: "object" },
        { name: "alt", type: "string" },
        { name: "caption", type: "string" },
        { name: "hotspot", type: "object" },
        { name: "crop", type: "object" },
      ],
    },
    {
      // Same type and fields as sanity-plugin-stl-table
      name: "stlTableBlock",
      fields: [
        { name: "stlString", type: "string" },
        { name: "stlParsed", type: "string" },
        { name: "caption", type: "string" },
      ],
    },
  ],
});
