/**
 * Inline review comments: a `reviewComment` annotation editors add to text in
 * Studio (Sanity's own comments need a paid plan). Authors see them highlighted
 * in the dashboard editor and resolve them, which removes the annotation.
 *
 * Dependency-free, so both the Studio schema and the dashboard can use it.
 */

export const REVIEW_COMMENT = "reviewComment";

export type InlineComment = {
  key: string;
  comment: string;
  /** The commented text. */
  quote: string;
  blockKey: string;
  firstSpanKey: string;
  lastSpanKey: string;
  lastSpanLength: number;
};

type Span = { _key?: string; text?: string; marks?: string[] };
type Block = { _type?: string; _key?: string; markDefs?: { _type?: string; _key?: string; comment?: string }[]; children?: Span[] };

/** Comments that still mark some text, in reading order. */
export function findReviewComments(body: unknown): InlineComment[] {
  if (!Array.isArray(body)) return [];
  const found: InlineComment[] = [];
  for (const block of body as Block[]) {
    if (block?._type !== "block" || !block._key) continue;
    for (const def of block.markDefs ?? []) {
      if (def._type !== REVIEW_COMMENT || !def._key) continue;
      const spans = (block.children ?? []).filter((s) => s.marks?.includes(def._key!) && s._key);
      if (!spans.length) continue;
      const last = spans[spans.length - 1];
      found.push({
        key: def._key,
        comment: def.comment ?? "",
        quote: spans.map((s) => s.text ?? "").join(""),
        blockKey: block._key,
        firstSpanKey: spans[0]._key!,
        lastSpanKey: last._key!,
        lastSpanLength: (last.text ?? "").length,
      });
    }
  }
  return found;
}

export const countReviewComments = (body: unknown) => findReviewComments(body).length;
