"use client";

import { useId, useMemo } from "react";
import { useEditor, useEditorSelector, type EditorSelection } from "@portabletext/editor";
import { Check, MessageSquareText, TextSelect } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REVIEW_COMMENT, findReviewComments, type InlineComment } from "@/lib/member-posts/review-comments";

/** The text a comment covers, as an editor selection. */
const rangeOf = (c: InlineComment): NonNullable<EditorSelection> => ({
  anchor: { path: [{ _key: c.blockKey }, "children", { _key: c.firstSpanKey }], offset: 0 },
  focus: { path: [{ _key: c.blockKey }, "children", { _key: c.lastSpanKey }], offset: c.lastSpanLength },
});

/**
 * Editors' inline review comments, listed beside the highlighted text. Resolving
 * removes the comment from the draft (saved with the next autosave).
 */
export function ReviewCommentsPanel() {
  const editor = useEditor();
  const value = useEditorSelector(editor, (s) => s.context.value);
  const comments = useMemo(() => findReviewComments(value), [value]);
  const headingId = useId();
  if (!comments.length) return null;

  return (
    <section
      aria-labelledby={headingId}
      className="space-y-3 rounded-xl border border-yellow-500/40 bg-yellow-50 p-4 dark:bg-yellow-500/10"
    >
      <div>
        <h2 id={headingId} className="flex items-center gap-2 text-sm font-semibold">
          <MessageSquareText className="size-4" aria-hidden="true" />
          Comments from the editor ({comments.length})
        </h2>
        <p className="text-xs text-muted-foreground">
          The text they refer to is highlighted below. Resolve each comment once you have dealt with it.
        </p>
      </div>
      <ol className="space-y-2">
        {comments.map((c) => (
          <li key={c.key} className="rounded-lg border border-border bg-background p-3">
            <p className="line-clamp-2 border-l-2 border-yellow-500 pl-2 text-sm italic text-muted-foreground">
              “{c.quote}”
            </p>
            <p className="mt-2 whitespace-pre-line text-sm">{c.comment}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  editor.send({ type: "select", at: rangeOf(c) });
                  editor.send({ type: "focus" });
                }}
              >
                <TextSelect aria-hidden="true" />
                Show in text
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  editor.send({ type: "annotation.remove", annotation: { name: REVIEW_COMMENT }, at: rangeOf(c) })
                }
              >
                <Check aria-hidden="true" />
                Resolve
              </Button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
