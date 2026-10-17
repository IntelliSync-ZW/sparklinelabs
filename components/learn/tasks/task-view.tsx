"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  ClipboardList,
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
import {
  Aside,
  buttonPrimary,
  buttonQuiet,
  buttonSecondary,
  practiceFrame,
  PracticeHeader,
  ResultNote,
} from "@/components/learn/interactive/practice-ui";
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

  const selfChecked = task.taskType === "written" || task.taskType === "prompt_practice" || task.taskType === "checklist";

  return (
    <section data-practice className={practiceFrame} aria-label={`${heading}: ${task.title ?? meta.label}`}>
      <PracticeHeader
        icon={meta.Icon}
        label={`${heading} · ${meta.label}`}
        meta={[
          required ? "Required" : "Optional",
          scored && "Scored",
          task.estimatedMinutes ? `${task.estimatedMinutes} min` : null,
          initiallyPassed && !passed && (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" aria-hidden="true" /> Completed
            </span>
          ),
        ]}
        title={task.title}
        subtitle={task.objective}
      />

      <div className="space-y-5">
        {task.context && (
          <div className="[&_p]:text-[0.97rem] [&_p]:leading-7">
            <Prose value={task.context} />
          </div>
        )}

        {task.steps && task.steps.length > 0 && (
          <ol className="list-decimal space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed marker:text-muted-foreground">
            {task.steps.map((step) => (
              <li key={step._key} className="pl-1">
                <span className="text-foreground">{step.title}</span>
                {step.detail && <span className="block text-sm text-muted-foreground">{step.detail}</span>}
              </li>
            ))}
          </ol>
        )}

        {task.deliverable && (
          <p className="text-sm leading-relaxed">
            <span className="font-medium text-foreground">You&apos;ll hand in: </span>
            <span className="text-muted-foreground">{task.deliverable}</span>
          </p>
        )}

        {/* Work area */}
        <kind.Body task={task} value={value} onChange={setValue} feedback={feedback} disabled={passed || pending} />

        {/* Hints */}
        {hints.length > 0 && !passed && (
          <div className="space-y-2">
            {hints.slice(0, hintsShown).map((hint, i) => (
              <Aside key={i} tone="hint">
                <span className="font-medium text-foreground">Hint {i + 1}. </span>
                {hint}
              </Aside>
            ))}
            {hintsShown < hints.length && (
              <button type="button" onClick={() => setHintsShown((n) => n + 1)} className={buttonQuiet}>
                <Lightbulb className="size-3.5" /> Show hint {hintsShown + 1} of {hints.length}
              </button>
            )}
          </div>
        )}

        {/* Actions, then the result below them */}
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {passed ? (
              <button type="button" onClick={reset} className={buttonSecondary}>
                <RotateCcw className="size-4" /> Practise again
              </button>
            ) : signedIn ? (
              <button type="button" onClick={submit} disabled={!ready || pending} className={buttonPrimary}>
                {pending ? "Checking…" : selfChecked ? "Submit" : "Check answers"}
              </button>
            ) : (
              <a href="#sign-in" className={buttonSecondary}>
                <Lock className="size-4" /> Sign in to submit
              </a>
            )}
            {!ready && !passed && signedIn && <span className="text-xs text-muted-foreground">Finish the task to submit it.</span>}
          </div>
          <div aria-live="polite" className="space-y-3 [&:not(:empty)]:mt-4">
            {result && !result.ok && <ResultNote tone="error">{result.message ?? "That didn't work. Please try again."}</ResultNote>}
            {result?.ok && !result.passed && (
              <ResultNote tone="warning">
                <span className="font-medium">{result.score}%. </span>
                {result.message ?? "Not quite. Adjust your answers and try again."}
              </ResultNote>
            )}
            {passed && result?.ok && (
              <>
                <ResultNote tone="success">
                  <span className="font-medium">{selfChecked ? "Task complete" : `Task passed with ${result.score}%`}</span>
                  {result.attempt > 1 && <span className="text-muted-foreground"> · attempt {result.attempt}</span>}
                </ResultNote>
                {result.modelAnswer && (
                  <details className="group border-t border-border pt-3">
                    <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                      <ChevronRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden="true" />
                      Compare with the model answer
                    </summary>
                    <div className="mt-3 pl-5.5">
                      <Prose value={result.modelAnswer} />
                    </div>
                  </details>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
