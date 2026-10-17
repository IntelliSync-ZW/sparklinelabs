"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteDraft } from "@/lib/member-posts/actions";
import { errorMessage } from "@/lib/member-posts/errors";
import {
  EDITABLE_STATUSES,
  STATUS_LABEL,
  type MyPostRow,
  type PostStatus,
} from "@/lib/member-posts/types";
import { cn } from "@/lib/utils";
import { Dialog, inputClass } from "./dialog";

const BADGE: Record<PostStatus, string> = {
  editing: "bg-secondary text-secondary-foreground",
  changes_requested: "bg-destructive/10 text-destructive",
  submitted: "bg-accent/10 text-accent dark:bg-accent/40 dark:text-accent-foreground",
  editor_draft: "bg-secondary text-muted-foreground",
  published: "bg-primary text-primary-foreground",
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

/** Status, plus a "Live" marker when a published version exists alongside a draft of changes. */
export function StatusBadge({ status, live = false }: { status: PostStatus; live?: boolean }) {
  return (
    <span className="inline-flex flex-wrap gap-1">
      <span className={cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium", BADGE[status])}>
        {STATUS_LABEL[status]}
      </span>
      {live && status !== "published" && (
        <span
          className={cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium", BADGE.published)}
          title="A published version is live; this draft holds unpublished changes"
        >
          Live
        </span>
      )}
    </span>
  );
}

/** Every post linked to the author. Rows arrive from listMyPosts() newest first. */
export function MyPostsTable({ data }: { data: MyPostRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | PostStatus>("");
  const [toDelete, setToDelete] = useState<MyPostRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((r) => (!status || r.status === status) && (!q || r.title.toLowerCase().includes(q)));
  }, [data, query, status]);

  function confirmDelete() {
    if (!toDelete) return;
    const { id } = toDelete;
    startTransition(async () => {
      const res = await deleteDraft(id);
      setError(res.ok ? null : errorMessage(res.error));
      setToDelete(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-55 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search titles"
            aria-label="Search titles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={cn(inputClass, "pl-9")}
          />
        </div>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className={cn(inputClass, "w-auto")}
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Title</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 font-medium">Reviewer note</th>
              <th scope="col" className="px-4 py-3 font-medium">Last updated</th>
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  {data.length === 0 ? "No posts yet. Start one with New post." : "No posts match your search."}
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const editable = EDITABLE_STATUSES.has(r.status);
                return (
                  <tr key={r.id} className="border-t border-border align-top">
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/posts/${r.id}/edit`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {r.title || "Untitled"}
                      </Link>
                      <span className="block text-xs text-muted-foreground">
                        {editable ? "Edit" : r.status === "published" ? "View or edit" : "View"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} live={r.live} />
                    </td>
                    <td className="max-w-xs px-4 py-3 text-muted-foreground">
                      {r.status === "changes_requested" && (
                        <>
                          {r.reviewNote && <span className="line-clamp-3">{r.reviewNote}</span>}
                          {r.commentCount > 0 && (
                            <span className="block text-xs font-medium text-foreground">
                              {r.commentCount} comment{r.commentCount === 1 ? "" : "s"} in the text
                            </span>
                          )}
                        </>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      <time dateTime={r.updatedAt} suppressHydrationWarning>
                        {dateFormat.format(new Date(r.updatedAt))}
                      </time>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editable && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={pending}
                          onClick={() => setToDelete(r)}
                          aria-label={`${r.live ? "Discard changes to" : "Delete"} ${r.title || "untitled post"}`}
                        >
                          <Trash2 aria-hidden="true" />
                          {r.live ? "Discard changes" : "Delete"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={!!toDelete}
        onClose={() => !pending && setToDelete(null)}
        title={toDelete?.live ? "Discard your changes?" : "Delete this draft?"}
        description={
          toDelete?.live
            ? `Your unpublished changes to “${toDelete.title || "Untitled"}” will be discarded. The published post stays as it is.`
            : `“${toDelete?.title || "Untitled"}” will be deleted. This cannot be undone.`
        }
      >
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setToDelete(null)} disabled={pending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={confirmDelete} disabled={pending}>
            {pending ? "Working…" : toDelete?.live ? "Discard changes" : "Delete draft"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
