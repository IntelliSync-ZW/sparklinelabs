"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { writeClient } from "@/sanity/lib/write-client";
import { requireAuthor } from "./auth";
import { getEditableDraft } from "./guards";
import {
  ID_RE,
  assertValidMarks,
  hasContent,
  isEditableBody,
  postInputSchema,
} from "./schemas";
import { withParsedTables } from "./stl";
import type { ActionResult } from "./types";

/*
 * Author writes. Every action re-checks the Clerk session and post ownership,
 * validates with Zod, and only ever writes to `drafts.<id>`; publishing stays
 * with editors in Studio.
 */

const KNOWN = new Set([
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NO_AUTHOR_PROFILE",
  "NOT_FOUND",
  "LOCKED",
  "INVALID_MARK",
  "RATE_LIMITED",
  "INCOMPLETE",
  "INVALID_TABLE",
  "UNSAFE_TABLE_LINK",
]);

async function run<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e instanceof ZodError) return { ok: false, error: "INVALID_INPUT" };
    if (e instanceof Error && KNOWN.has(e.message)) return { ok: false, error: e.message };
    // ifRevisionId mismatch: the draft changed between the ownership check and the write
    if ((e as { statusCode?: number })?.statusCode === 409) return { ok: false, error: "CONFLICT" };
    console.error("[member-posts]", e);
    return { ok: false, error: "SERVER_ERROR" };
  }
}

const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
    .replace(/-$/, "");

/** Same format as existing posts (plain kebab-case), with the id appended only on a clash. */
async function uniqueSlug(title: string, id: string) {
  const base = slugify(title) || "post";
  const taken = await writeClient.fetch<boolean>(
    `defined(*[_type == "post" && slug.current == $slug && !(_id in [$id, $draftId])][0]._id)`,
    { slug: base, id, draftId: `drafts.${id}` },
  );
  return taken ? `${base}-${id.slice(0, 8)}` : base;
}

/**
 * Create a new post on its first save, so opening "New post" leaves nothing
 * behind until the author has written a title. Returns the id for later saves.
 */
export async function createPost(input: unknown): Promise<ActionResult<string>> {
  return run(async () => {
    const { authorId } = await requireAuthor();
    const data = postInputSchema.parse(input);
    assertValidMarks(data.body);

    const authorExists = await writeClient.fetch<boolean>(
      `defined(*[_type == "author" && _id == $authorId][0]._id)`,
      { authorId },
    );
    if (!authorExists) throw new Error("NO_AUTHOR_PROFILE");

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recent = await writeClient.fetch<number>(
      `count(*[_type == "post" && $authorId in authors[].author._ref && defined(reviewStatus) && _createdAt > $since])`,
      { authorId, since },
    );
    if (recent >= 10) throw new Error("RATE_LIMITED");

    const id = crypto.randomUUID();
    await writeClient.create({
      _id: `drafts.${id}`,
      _type: "post",
      title: data.title,
      excerpt: data.excerpt ?? "",
      body: withParsedTables(data.body),
      ...(data.coverImage && { coverImage: data.coverImage }),
      slug: { _type: "slug", current: await uniqueSlug(data.title, id) },
      authors: [
        {
          _type: "articleAuthor",
          _key: id.slice(0, 12),
          author: { _type: "reference", _ref: authorId },
          articleRole: "lead_author",
        },
      ],
      reviewStatus: "editing",
    });
    return id;
  });
}

/**
 * Start editing a published post: copy it into `drafts.<id>`. Readers keep
 * seeing the published version until an editor publishes the draft in Studio.
 */
export async function startEditing(id: string): Promise<ActionResult> {
  const res = await run(async () => {
    const { authorId } = await requireAuthor();
    if (typeof id !== "string" || !ID_RE.test(id)) throw new Error("NOT_FOUND");
    const published = await writeClient.fetch<Record<string, unknown> | null>(
      `*[_id == $id && _type == "post" && $authorId in authors[].author._ref][0]`,
      { id, authorId },
    );
    if (!published) throw new Error("NOT_FOUND");
    // Don't create a draft the dashboard editor could not edit or discard
    if (!isEditableBody(published.body)) throw new Error("LOCKED");

    // Every field except system ones (_id, _rev, timestamps) and the last review's note
    const fields = Object.fromEntries(
      Object.entries(published).filter(
        ([k]) => !k.startsWith("_") && k !== "reviewNote" && k !== "submittedAt",
      ),
    );
    // Never overwrite an existing draft, such as one an editor started in Studio;
    // the edit page then shows that draft's state instead
    await writeClient.createIfNotExists({
      ...fields,
      _id: `drafts.${id}`,
      _type: "post",
      reviewStatus: "editing",
    });
    return undefined;
  });
  if (!res.ok) return res;
  revalidatePath("/dashboard/posts");
  revalidatePath(`/dashboard/posts/${id}/edit`);
  redirect(`/dashboard/posts/${id}/edit`);
}

/** Save the author's fields (autosave and the Save button). */
export async function saveDraft(id: string, input: unknown): Promise<ActionResult> {
  return run(async () => {
    const { authorId } = await requireAuthor();
    const draft = await getEditableDraft(id, authorId);
    const data = postInputSchema.parse(input);
    assertValidMarks(data.body);

    const patch = writeClient
      .patch(`drafts.${id}`)
      .ifRevisionId(draft._rev)
      .set({
        title: data.title,
        excerpt: data.excerpt ?? "",
        body: withParsedTables(data.body),
        // A live post keeps its URL, whatever happens to the title
        ...(!draft.isLive && {
          slug: { _type: "slug", current: await uniqueSlug(data.title, id) },
        }),
      });
    if (data.coverImage) patch.set({ coverImage: data.coverImage });
    else patch.unset(["coverImage"]);
    await patch.commit();
    return undefined;
  });
}

/** Submit for review. The post is then locked for the author until an editor responds. */
export async function submitForReview(id: string): Promise<ActionResult> {
  const res = await run(async () => {
    const { authorId } = await requireAuthor();
    const draft = await getEditableDraft(id, authorId);
    // Re-validate what is stored, not what the browser last sent
    const data = postInputSchema.pick({ title: true, body: true }).parse(draft);
    if (!hasContent(data.body)) throw new Error("INCOMPLETE");
    await writeClient
      .patch(`drafts.${id}`)
      .ifRevisionId(draft._rev)
      .set({ reviewStatus: "submitted", submittedAt: new Date().toISOString() })
      .commit();
    return undefined;
  });
  revalidatePath("/dashboard/posts");
  return res;
}

/** Delete the author's draft. For a live post this discards unpublished changes; the live post stays. */
export async function deleteDraft(id: string): Promise<ActionResult> {
  const res = await run(async () => {
    const { authorId } = await requireAuthor();
    await getEditableDraft(id, authorId);
    await writeClient.delete(`drafts.${id}`);
    return undefined;
  });
  revalidatePath("/dashboard/posts");
  return res;
}
