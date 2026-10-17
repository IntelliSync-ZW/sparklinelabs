import "server-only";
import { writeClient } from "@/sanity/lib/write-client";
import { requireAuthor } from "./auth";
import { ID_RE, isEditableBody } from "./schemas";
import type { MyPostRow, PostStatus } from "./types";

/*
 * Per-author reads through the token client (raw perspective, so drafts are
 * included). Never cache these: call them only from dynamic Server Components.
 */

const AUTHOR_STATUSES = new Set(["editing", "submitted", "changes_requested"]);

type Raw = {
  _id: string;
  _updatedAt: string;
  title?: string;
  reviewStatus?: string;
  reviewNote?: string;
  commentCount?: number;
};

/** Drafts without a reviewStatus were started by editors in Studio. */
const draftStatus = (reviewStatus?: string): PostStatus =>
  AUTHOR_STATUSES.has(reviewStatus ?? "") ? (reviewStatus as PostStatus) : "editor_draft";

/**
 * One row per post. A draft, when there is one, sets the status: for a live
 * post it holds changes that are not published yet.
 */
export async function listMyPosts(): Promise<MyPostRow[]> {
  const { authorId } = await requireAuthor();
  const rows = await writeClient.fetch<Raw[]>(
    `*[_type == "post" && $authorId in authors[].author._ref && !(_id in path("versions.**"))]{
      _id, _updatedAt, title, reviewStatus, reviewNote,
      "commentCount": math::sum(body[_type == "block"]{"n": count(markDefs[_type == "reviewComment"])}.n)
    }`,
    { authorId },
  );

  const byId = new Map<string, { published?: Raw; draft?: Raw }>();
  for (const r of rows) {
    const id = r._id.replace(/^drafts\./, "");
    const versions = byId.get(id) ?? {};
    if (r._id.startsWith("drafts.")) versions.draft = r;
    else versions.published = r;
    byId.set(id, versions);
  }

  return [...byId]
    .map(([id, { published, draft }]): MyPostRow => {
      const latest = draft ?? published!;
      return {
        id,
        title: latest.title || "Untitled",
        status: draft ? draftStatus(draft.reviewStatus) : "published",
        live: Boolean(published),
        reviewNote: draft?.reviewNote,
        commentCount: draft?.commentCount ?? 0,
        updatedAt: [draft?._updatedAt, published?._updatedAt].filter(Boolean).sort().at(-1)!,
      };
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

type PostDoc = Raw & {
  excerpt?: string;
  body?: unknown[];
  coverImage?: { asset?: { _ref?: string }; alt?: string };
  slug?: string;
  categorySlug?: string;
};

export type MyPost = {
  id: string;
  title: string;
  excerpt: string;
  body: unknown[];
  coverImage?: PostDoc["coverImage"];
  status: PostStatus;
  /** A published version exists. */
  live: boolean;
  reviewNote?: string;
  /** Why the author cannot edit, when they cannot. */
  lockedBecause?: PostStatus | "unsupported_content";
  /** A published post with no draft yet, which the author may start editing. */
  canStartEditing: boolean;
  /** Public URL of a published post. */
  liveUrl?: string;
};

/** The author's view of one post, or null when it is missing or not theirs. */
export async function getMyPost(id: string): Promise<MyPost | null> {
  const { authorId } = await requireAuthor();
  if (!ID_RE.test(id)) return null;
  const rows = await writeClient.fetch<PostDoc[]>(
    `*[_id in [$id, $draftId] && $authorId in authors[].author._ref]{
      _id, _updatedAt, title, excerpt, body, coverImage, reviewStatus, reviewNote,
      "slug": slug.current, "categorySlug": category->slug.current
    }`,
    { id, draftId: `drafts.${id}`, authorId },
  );
  const published = rows.find((r) => r._id === id);
  const draft = rows.find((r) => r._id === `drafts.${id}`);
  if (!published && !draft) return null;

  const status: PostStatus = draft ? draftStatus(draft.reviewStatus) : "published";
  // The author's own draft while one exists; an editor's Studio draft stays behind the live post
  const doc = (draft && (status !== "editor_draft" || !published) ? draft : published)!;
  const editableBody = isEditableBody(doc.body);

  let lockedBecause: MyPost["lockedBecause"];
  if (status === "editing" || status === "changes_requested") {
    if (!editableBody) lockedBecause = "unsupported_content";
  } else if (status === "published" && !editableBody) {
    lockedBecause = "unsupported_content";
  } else {
    lockedBecause = status;
  }

  return {
    id,
    title: doc.title ?? "",
    excerpt: doc.excerpt ?? "",
    body: doc.body ?? [],
    coverImage: doc.coverImage?.asset?._ref ? doc.coverImage : undefined,
    status,
    live: Boolean(published),
    reviewNote: draft?.reviewNote,
    lockedBecause,
    canStartEditing: status === "published" && editableBody,
    liveUrl:
      published?.slug && published.categorySlug
        ? `/blog/${published.categorySlug}/${published.slug}`
        : undefined,
  };
}
