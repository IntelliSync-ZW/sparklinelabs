/** Shared by the dashboard's server queries and client components. */

export type PostStatus =
  | "editing"
  | "submitted"
  | "changes_requested"
  | "published"
  | "editor_draft";

export type MyPostRow = {
  id: string;
  title: string;
  status: PostStatus;
  /** A published version exists (the status then describes the draft of changes, if any). */
  live: boolean;
  reviewNote?: string;
  /** Inline review comments editors left in the draft's text. */
  commentCount: number;
  updatedAt: string;
};

export const STATUS_LABEL: Record<PostStatus, string> = {
  editing: "Draft",
  changes_requested: "Changes requested",
  submitted: "In review",
  editor_draft: "With editors",
  published: "Published",
};

/** Statuses in which the author can still edit, delete and submit. */
export const EDITABLE_STATUSES: ReadonlySet<PostStatus> = new Set(["editing", "changes_requested"]);

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };
