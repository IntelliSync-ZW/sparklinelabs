import type { PortableText } from "@portabletext/react";

/** A single item in a lesson section's `content` array, as returned by GROQ. */
export type ContentItem = {
  _key: string;
  _type: string;
  [key: string]: unknown;
};

export type PortableTextValue = Parameters<typeof PortableText>[0]["value"];
