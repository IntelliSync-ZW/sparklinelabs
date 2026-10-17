import { z } from "zod";

/**
 * Payload validation for the author dashboard. Sanity does not run Studio
 * validation on API writes, so these schemas are the real limits. Zod strips
 * unknown keys, which is what stops an author from sending `authors`,
 * `reviewNote` or any other field the server owns.
 *
 * The allowed styles, decorators, lists and links are the subset of the post
 * `body` field (sanity/schemas/post.ts) that the editor offers.
 */

/** Base document ids the dashboard accepts. No dots, so never a drafts./versions. id. */
export const ID_RE = /^[a-zA-Z0-9_-]{1,128}$/;

/** Links authors may add: http(s), mailto, and same-site paths such as /services. */
export const SAFE_HREF = /^(https?:\/\/|mailto:|\/(?!\/))/i;

export const DECORATORS = ["strong", "em", "underline", "code"] as const;
export const STYLES = ["normal", "h2", "h3", "h4", "blockquote"] as const;
export const LISTS = ["bullet", "number"] as const;

export const TITLE_MIN = 3;
export const TITLE_MAX = 120;
export const EXCERPT_MAX = 700; // matches the Studio rule on post.excerpt
export const ALT_MAX = 200;
export const CAPTION_MAX = 300;
export const STL_MAX = 20_000;

const key = z.string().min(1).max(64);
const href = z.string().trim().max(2048).regex(SAFE_HREF);

const imageRef = z.object({
  _type: z.literal("reference"),
  _ref: z.string().regex(/^image-[a-zA-Z0-9]+-\d+x\d+-(jpg|png|webp|gif)$/),
});

// Kept so a crop an editor sets in Studio survives the author's next save
const unit = z.number().min(0).max(1);
const hotspot = z.object({
  _type: z.literal("sanity.imageHotspot").optional(),
  x: unit,
  y: unit,
  height: unit,
  width: unit,
});
const crop = z.object({
  _type: z.literal("sanity.imageCrop").optional(),
  top: unit,
  bottom: unit,
  left: unit,
  right: unit,
});

const textBlock = z.object({
  _type: z.literal("block"),
  _key: key,
  style: z.enum(STYLES).default("normal"),
  listItem: z.enum(LISTS).optional(),
  level: z.number().int().min(1).max(6).optional(),
  markDefs: z
    .array(
      z.discriminatedUnion("_type", [
        z.object({ _type: z.literal("link"), _key: key, href }),
        // Editors' inline review comments (see review-comments.ts); authors resolve them by removing
        z.object({ _type: z.literal("reviewComment"), _key: key, comment: z.string().max(2000) }),
      ]),
    )
    .max(50)
    .default([]),
  children: z
    .array(
      z.object({
        _type: z.literal("span"),
        _key: key,
        text: z.string().max(10_000),
        marks: z.array(z.string().max(64)).max(10).default([]),
      }),
    )
    .min(1)
    .max(500),
});

const imageBlock = z.object({
  _type: z.literal("image"),
  _key: key,
  asset: imageRef,
  alt: z.string().trim().min(1).max(ALT_MAX),
  caption: z.string().trim().max(CAPTION_MAX).optional(),
  hotspot: hotspot.optional(),
  crop: crop.optional(),
});

// STL table (sanity-plugin-stl-table). Any stlParsed the browser sends is
// stripped here and rebuilt on the server from stlString (see stl.ts).
const stlTableBlock = z.object({
  _type: z.literal("stlTableBlock"),
  _key: key,
  stlString: z.string().trim().min(1).max(STL_MAX),
  caption: z.string().trim().max(CAPTION_MAX).optional(),
});

export const bodySchema = z
  .array(z.discriminatedUnion("_type", [textBlock, imageBlock, stlTableBlock]))
  .max(1000);

export const coverImageSchema = z.object({
  _type: z.literal("image"),
  asset: imageRef,
  alt: z.string().trim().min(1).max(ALT_MAX),
  hotspot: hotspot.optional(),
  crop: crop.optional(),
});

export const postInputSchema = z.object({
  title: z.string().trim().min(TITLE_MIN).max(TITLE_MAX),
  excerpt: z.string().trim().max(EXCERPT_MAX).optional(),
  body: bodySchema,
  coverImage: coverImageSchema.optional(),
});

export type PostInput = z.infer<typeof postInputSchema>;
export type PostBody = PostInput["body"];
export type CoverImage = z.infer<typeof coverImageSchema>;

/** Every span mark must be a known decorator or a markDefs key in its block. */
export function assertValidMarks(body: PostBody) {
  for (const block of body) {
    if (block._type !== "block") continue;
    const allowed = new Set<string>([...DECORATORS, ...block.markDefs.map((d) => d._key)]);
    for (const span of block.children)
      for (const m of span.marks) if (!allowed.has(m)) throw new Error("INVALID_MARK");
  }
}

/**
 * Whether the dashboard editor can round-trip a stored body. An editor may add
 * content in Studio that the author's editor cannot represent (another block
 * type, an h4, a strike-through); such a draft is read-only for the author
 * rather than silently losing that content on the next save.
 */
export function isEditableBody(body: unknown): boolean {
  const parsed = bodySchema.safeParse(body ?? []);
  if (!parsed.success) return false;
  try {
    assertValidMarks(parsed.data);
    return true;
  } catch {
    return false;
  }
}

/** True when the body holds something besides empty paragraphs. */
export function hasContent(body: PostBody): boolean {
  return body.some(
    (b) => b._type !== "block" || b.children.some((c) => c.text.trim().length > 0),
  );
}
