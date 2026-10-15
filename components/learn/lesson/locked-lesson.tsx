import Link from "next/link";
import { CheckCircle2, Lock } from "lucide-react";
import { InlineSignIn } from "@/components/ai-training/inline-sign-in";
import type { LessonLink } from "./types";

/**
 * Shown instead of a lesson the learner has not unlocked yet. The title, summary
 * and outcomes stay visible so the page still describes the lesson.
 */
export function LockedLesson({
  title,
  summary,
  outcomes,
  signedIn,
  resume,
}: {
  title: string;
  summary?: string | null;
  outcomes?: string[] | null;
  signedIn: boolean;
  /** Where to send a signed-in learner: the lesson they should finish first. */
  resume: LessonLink | null;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-8 py-14">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
        <Lock className="size-3.5" /> {signedIn ? "Locked" : "Sign in required"}
      </div>
      <h1 className="mb-4 text-3xl sm:text-4xl font-semibold tracking-tight text-balance">{title}</h1>
      {summary && <p className="mb-8 text-lg text-muted-foreground leading-relaxed">{summary}</p>}

      {outcomes && outcomes.length > 0 && (
        <ul className="mb-10 space-y-2">
          {outcomes.map((outcome) => (
            <li key={outcome} className="flex items-start gap-2.5 text-muted-foreground">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-accent" />
              {outcome}
            </li>
          ))}
        </ul>
      )}

      {signedIn ? (
        <div className="rounded-xl border border-border bg-secondary/50 p-6">
          <p className="font-semibold mb-1">Finish the previous lesson to unlock this one.</p>
          <p className="mb-4 text-sm text-muted-foreground">Lessons open in order so every step builds on the last.</p>
          {resume && (
            <Link
              href={resume.href}
              className="inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Continue: {resume.title}
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-2 text-xl font-bold tracking-tight">Sign in to start learning</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            Free account. Lessons unlock in order and your progress is saved.
          </p>
          <InlineSignIn />
        </div>
      )}
    </div>
  );
}
