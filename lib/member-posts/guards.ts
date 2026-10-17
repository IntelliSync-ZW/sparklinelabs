import "server-only";
import { writeClient } from "@/sanity/lib/write-client";
import { ID_RE, isEditableBody } from "./schemas";

const EDITABLE = new Set(["editing", "changes_requested"]);

type Row = {
  _id: string;
  _rev: string;
  authorRefs: string[] | null;
  reviewStatus?: string;
  title?: string;
  body?: unknown;
};

/**
 * Loads the draft an author may write to. An author owns a post when its
 * `authors[]` references their author document. The browser only sends the
 * base id; the `drafts.` prefix is added here and ID_RE rejects any dot.
 *
 * A published post can have an editable draft too (see startEditing): writes
 * still only touch `drafts.<id>`, and the live post changes only when an
 * editor publishes in Studio. `isLive` tells callers a published version exists.
 */
export async function getEditableDraft(baseId: unknown, authorId: string) {
  if (typeof baseId !== "string" || !ID_RE.test(baseId)) throw new Error("NOT_FOUND");
  const rows = await writeClient.fetch<Row[]>(
    `*[_id in [$id, $draftId]]{_id, _rev, "authorRefs": authors[].author._ref, reviewStatus, title, body}`,
    { id: baseId, draftId: `drafts.${baseId}` },
  );
  const draft = rows.find((r) => r._id === `drafts.${baseId}`);
  const published = rows.find((r) => r._id === baseId);
  // Same error for "missing" and "not yours", so ids can't be probed
  if (!draft || !draft.authorRefs?.includes(authorId)) throw new Error("NOT_FOUND");
  // Submitted posts and drafts that editors started in Studio are read-only
  if (!EDITABLE.has(draft.reviewStatus ?? "")) throw new Error("LOCKED");
  // So is a draft holding content the dashboard editor cannot round-trip
  if (!isEditableBody(draft.body)) throw new Error("LOCKED");
  return { ...draft, isLive: Boolean(published) };
}
