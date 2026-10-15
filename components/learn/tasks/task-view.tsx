"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  ClipboardList,
  Clock,
  ListChecks,
  ListOrdered,
  Lightbulb,
  PenLine,
  RotateCcw,
  Search,
  Shuffle,
  Sparkles,
  Table2,
  Lock,
} from "lucide-react";
import type { GradeResult, ItemFeedback, TaskSubmission } from "@/lib/learning/results";
import { Prose } from "@/components/learn/blocks/prose";
import { taskKinds, type Feedback } from "./task-bodies";
import type { PublicTask } from "./types";

const typeMeta: Record<string, { label: string; Icon: React.ElementType }> = {
  classification: { label: "Classify", Icon: Table2 },
  multiple_choice: { label: "Multiple choice", Icon: ListChecks },
  matching: { label: "Match", Icon: Shuffle },
  ordering: { label: "Put in order", Icon: ListOrdered },
  source_verification: { label: "Verify sources", Icon: Search },
  prompt_practice: { label: "Prompt practice", Icon: Sparkles },
  written: { label: "Written response", Icon: PenLine },
  checklist: { label: "Checklist", Icon: CheckSquare },
};

/**
 * A practice task: the brief, the work area for its type, and the result. Grading
 * happens on the server (`onSubmit`); this component never sees an answer key.
 */
export function TaskView({
  task,
  required,
  scored = false,
  initiallyPassed,
  signedIn,
  onSubmit,
  heading = "Practice",
}: {
  task: PublicTask;
  required: boolean;
  /** Counts towards the certificate. Only ever true for required, server-marked tasks. */
  scored?: boolean;
  initiallyPassed: boolean;
  signedIn: boolean;
  onSubmit: (submission: TaskSubmission) => Promise<GradeResult>;
  heading?: string;
}) {
  const kind = taskKinds[task.taskType];
  const meta = typeMeta[task.taskType] ?? { label: "Task", Icon: ClipboardList };
  const [value, setValue] = useState(() => kind?.initial(task));
  const [result, setResult] = useState<GradeResult | null>(null);
  const [pending, setPending] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);

  const feedback: Feedback = useMemo(
    () => new Map<string, ItemFeedback>(result?.ok ? result.feedback.map((f) => [f.id, f]) : []),
    [result]
  );

  if (!kind) return null;

  const passed = result?.ok === true && result.passed;
  const ready = kind.isComplete(task, value);
  const hints = task.hints ?? [];

  async function submit() {
    setPending(true);
    try {
      setResult(await onSubmit(kind.toSubmission(task, value)));
    } catch {
      setResult({ ok: false, reason: "unavailable", message: "Something went wrong. Please try again." });
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setValue(kind.initial(task));
    setResult(null);
    setHintsShown(0);
  }

  return (
    <section className="my-10 overflow-hidden rounded-2xl border-2 border-accent/30 bg-card shadow-sm" aria-label={`${heading}: ${task.title ?? meta.label}`}>
      {/* Header */}
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-accent/20 bg-accent/10 px-5 py-3">
        <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
          <meta.Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-accent">
            {heading} · {meta.label}
          </p>
          <h3 className="truncate text-lg font-semibold leading-tight text-foreground">{task.title}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span
            className={`rounded-full px-2.5 py-1 ${
              required ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            {required ? "Required" : "Optional"}
          </span>
          {scored && <span className="rounded-full border border-accent/40 px-2.5 py-1 text-accent">Scored</span>}
          {task.estimatedMinutes ? (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3.5" /> {task.estimatedMinutes} min
            </span>
          ) : null}
          {initiallyPassed && !passed && (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" /> Completed
            </span>
          )}
        </div>
      </header>

      <div className="space-y-5 px-5 py-5">
        {task.objective && (
          <p className="text-base font-medium leading-snug text-foreground">
            <span className="text-accent">Goal · </span>
            {task.objective}
          </p>
        )}

        {task.context && (
          <div className="text-[0.97rem] [&_p]:text-[0.97rem] [&_p]:leading-7">
            <Prose value={task.context} />
          </div>
        )}

        {task.steps && task.steps.length > 0 && (
          <ol className="space-y-2.5 rounded-xl bg-secondary/50 p-4">
            {task.steps.map((step, i) => (
              <li key={step._key} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed">
                  <span className="font-medium text-foreground">{step.title}</span>
                  {step.detail && <span className="block text-muted-foreground">{step.detail}</span>}
                </span>
              </li>
            ))}
          </ol>
        )}

        {task.deliverable && (
          <p className="flex gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm">
            <ClipboardList className="mt-0.5 size-4 shrink-0 text-accent" />
            <span>
              <span className="font-semibold">You&apos;ll hand in: </span>
              {task.deliverable}
            </span>
          </p>
        )}

        {/* Work area */}
        <kind.Body task={task} value={value} onChange={setValue} feedback={feedback} disabled={passed || pending} />

        {/* Hints */}
        {hints.length > 0 && !passed && (
          <div className="space-y-2">
            {hints.slice(0, hintsShown).map((hint, i) => (
              <p key={i} className="flex gap-2 rounded-lg bg-amber-500/10 px-4 py-2.5 text-sm leading-relaxed">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  <span className="font-semibold">Hint {i + 1}: </span>
                  {hint}
                </span>
              </p>
            ))}
            {hintsShown < hints.length && (
              <button
                type="button"
                onClick={() => setHintsShown((n) => n + 1)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
              >
                <Lightbulb className="size-4" /> Show hint {hintsShown + 1} of {hints.length}
              </button>
            )}
          </div>
        )}

        {/* Result */}
        <div aria-live="polite" className="space-y-3">
          {result && !result.ok && (
            <p className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
              {result.message ?? "That didn't work. Please try again."}
            </p>
          )}
          {result?.ok && !result.passed && (
            <p className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <span className="font-semibold">{result.score}%: </span>
                {result.message ?? "Not quite. Adjust your answers and try again."}
              </span>
            </p>
          )}
          {passed && result?.ok && (
            <div className="space-y-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="size-5" />
                {task.taskType === "written" || task.taskType === "prompt_practice" || task.taskType === "checklist"
                  ? "Task complete"
                  : `Task passed: ${result.score}%`}
                {result.attempt > 1 && <span className="font-normal text-muted-foreground">· attempt {result.attempt}</span>}
              </p>
              {result.modelAnswer && (
                <details className="rounded-lg border border-border bg-background">
                  <summary className="cursor-pointer px-4 py-2.5 text-sm font-medium">Compare with the model answer</summary>
                  <div className="px-4 pb-4">
                    <Prose value={result.modelAnswer} />
                  </div>
                </details>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {passed ? (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <RotateCcw className="size-4" /> Practise again
            </button>
          ) : signedIn ? (
            <button
              type="button"
              onClick={submit}
              disabled={!ready || pending}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending ? "Checking…" : task.taskType === "written" || task.taskType === "prompt_practice" || task.taskType === "checklist" ? "Submit" : "Check answers"}
            </button>
          ) : (
            <a href="#sign-in" className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold hover:bg-secondary/70">
              <Lock className="size-4" /> Sign in to submit
            </a>
          )}
          {!ready && !passed && signedIn && <span className="text-xs text-muted-foreground">Finish the task to submit it.</span>}
        </div>
      </div>
    </section>
  );
}
