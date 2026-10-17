"use client";

import { useActionState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startEditing } from "@/lib/member-posts/actions";
import { errorMessage } from "@/lib/member-posts/errors";

/** Copies a published post into a draft and opens it in the editor (the action redirects). */
export function StartEditingButton({ postId }: { postId: string }) {
  const [state, action, pending] = useActionState(() => startEditing(postId), null);
  return (
    <form action={action} className="space-y-2">
      <Button type="submit" size="sm" disabled={pending}>
        <Pencil aria-hidden="true" />
        {pending ? "Opening editor…" : "Edit post"}
      </Button>
      {state && !state.ok && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage(state.error)}
        </p>
      )}
    </form>
  );
}
