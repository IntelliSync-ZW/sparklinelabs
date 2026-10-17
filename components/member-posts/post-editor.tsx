"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/editor";
import { Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPost, saveDraft, submitForReview } from "@/lib/member-posts/actions";
import type { ActionResult } from "@/lib/member-posts/types";
import { errorMessage } from "@/lib/member-posts/errors";
import {
  EXCERPT_MAX,
  TITLE_MAX,
  TITLE_MIN,
  type CoverImage,
} from "@/lib/member-posts/schemas";
import { cn } from "@/lib/utils";
import { CoverImageField } from "./cover-image-field";
import { Dialog, inputClass } from "./dialog";

// The editor cannot render on the server (see body-editor.tsx)
const BodyEditor = dynamic(() => import("./body-editor").then((m) => m.BodyEditor), {
  ssr: false,
  loading: () => (
    <div className="min-h-92.5 animate-pulse rounded-xl border border-border bg-secondary/40" aria-hidden="true" />
  ),
});

type Draft = {
  title: string;
  excerpt: string;
  body: PortableTextBlock[];
  coverImage?: CoverImage;
};

const AUTOSAVE_MS = 1500;

/** Checks that would fail on the server anyway; autosave waits until they pass. */
function findProblem(d: Draft): string | null {
  const title = d.title.trim().length;
  if (title < TITLE_MIN) return `Add a title of at least ${TITLE_MIN} characters to save.`;
  if (title > TITLE_MAX) return `Shorten the title to ${TITLE_MAX} characters to save.`;
  if (d.coverImage && !d.coverImage.alt.trim()) return "Add alt text to the cover image to save.";
  if (d.body.some((b) => b._type === "image" && !String((b as { alt?: string }).alt ?? "").trim())) {
    return "Every image needs alt text. Edit the image to add it.";
  }
  return null;
}

/**
 * Edits a post's draft. With `postId` null (a new post) nothing exists in
 * Sanity until the first valid save, which creates the post.
 */
export function PostEditor({ postId: initialId, initial }: { postId: string | null; initial: Draft }) {
  const router = useRouter();
  const [postId, setPostId] = useState(initialId);
  const idRef = useRef(initialId);
  const [title, setTitle] = useState(initial.title);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [body, setBody] = useState(initial.body);
  const [coverImage, setCoverImage] = useState(initial.coverImage);

  const draft = useMemo(() => ({ title, excerpt, body, coverImage }), [title, excerpt, body, coverImage]);
  const serialized = useMemo(() => JSON.stringify(draft), [draft]);
  const [savedSerialized, setSavedSerialized] = useState(serialized);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, startSubmit] = useTransition();

  const problem = findProblem(draft);
  const dirty = serialized !== savedSerialized;

  // Refs for the async save loop, which outlives any one render
  const latest = useRef({ draft, serialized });
  const lastSaved = useRef(serialized);
  const inFlight = useRef<Promise<boolean> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    latest.current = { draft, serialized };
  }, [draft, serialized]);

  /** Saves the latest state. Saves run one at a time, so the newest content always lands last. */
  const save = useCallback(async (): Promise<boolean> => {
    while (inFlight.current) await inFlight.current;
    const { draft: current, serialized: snapshot } = latest.current;
    if (snapshot === lastSaved.current) return true;
    if (findProblem(current)) return false;

    setSaving(true);
    const id = idRef.current;
    const call: Promise<ActionResult<string | undefined>> = id ? saveDraft(id, current) : createPost(current);
    const request = call.then(
      (res) => {
        if (res.ok) {
          if (!id && res.data) {
            idRef.current = res.data;
            setPostId(res.data);
            // Point the address bar at the new post without remounting the editor
            window.history.replaceState(null, "", `/dashboard/posts/${res.data}/edit`);
          }
          lastSaved.current = snapshot;
          setSavedSerialized(snapshot);
          setServerError(null);
        } else {
          setServerError(errorMessage(res.error));
        }
        return res.ok;
      },
      () => {
        setServerError("Could not reach the server. Check your connection; your changes are kept here.");
        return false;
      },
    );
    inFlight.current = request;
    try {
      return await request;
    } finally {
      inFlight.current = null;
      setSaving(false);
    }
  }, []);

  // Autosave shortly after the last change
  useEffect(() => {
    if (serialized === lastSaved.current) return;
    timer.current = setTimeout(() => void save(), AUTOSAVE_MS);
    return () => clearTimeout(timer.current);
  }, [serialized, save]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty && !saving) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, saving]);

  // Flush pending changes when navigating away inside the app
  useEffect(
    () => () => {
      if (latest.current.serialized !== lastSaved.current) void save();
    },
    [save],
  );

  function saveNow() {
    clearTimeout(timer.current);
    void save();
  }

  function submit() {
    clearTimeout(timer.current);
    startSubmit(async () => {
      const id = (await save()) ? idRef.current : null;
      if (!id) {
        setConfirmOpen(false);
        return;
      }
      const res = await submitForReview(id);
      if (res.ok) {
        router.push("/dashboard/posts?submitted=1");
      } else {
        setServerError(errorMessage(res.error));
        setConfirmOpen(false);
      }
    });
  }

  // A new post that hasn't been touched gets a hint, not an error
  const untouchedNew = postId === null && !dirty;
  const shownProblem = untouchedNew ? null : problem;
  const statusText = saving
    ? "Saving…"
    : (shownProblem ??
      serverError ??
      (dirty
        ? "Unsaved changes"
        : untouchedNew
          ? "Give your post a title to start. It saves automatically after that."
          : "All changes saved"));
  const statusIsError = !saving && Boolean(shownProblem || serverError);

  const ids = { title: useId(), excerpt: useId(), body: useId() };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3">
        <p
          role="status"
          aria-live="polite"
          className={cn("min-w-0 flex-1 text-sm", statusIsError ? "text-destructive" : "text-muted-foreground")}
        >
          {statusText}
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={saveNow} disabled={saving || !dirty || !!problem}>
            <Save aria-hidden="true" />
            Save
          </Button>
          <Button type="button" size="sm" onClick={() => setConfirmOpen(true)} disabled={submitting || !!problem}>
            <Send aria-hidden="true" />
            Submit for review
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={ids.title} className="text-sm font-medium">
          Title
        </label>
        <input
          id={ids.title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
          placeholder="Post title"
          className={cn(inputClass, "py-2.5 text-2xl font-semibold tracking-tight")}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <label htmlFor={ids.excerpt} className="text-sm font-medium">
            Excerpt <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <span className="text-xs text-muted-foreground">
            {excerpt.length}/{EXCERPT_MAX}
          </span>
        </div>
        <textarea
          id={ids.excerpt}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          maxLength={EXCERPT_MAX}
          rows={3}
          placeholder="A short summary shown on blog cards"
          className={inputClass}
        />
      </div>

      <CoverImageField value={coverImage} onChange={setCoverImage} />

      <div className="space-y-1.5">
        <p id={ids.body} className="text-sm font-medium">
          Body
        </p>
        <BodyEditor initialBody={initial.body} onChange={setBody} labelledBy={ids.body} />
      </div>

      <Dialog
        open={confirmOpen}
        onClose={() => !submitting && setConfirmOpen(false)}
        title="Submit for review?"
        description="An editor will review the post and either publish it or send it back with notes. You cannot edit it while it is in review."
      >
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} disabled={submitting}>
            Keep editing
          </Button>
          <Button type="button" onClick={submit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit for review"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
