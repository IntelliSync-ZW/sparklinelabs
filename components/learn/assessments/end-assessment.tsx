"use client";

import { useMemo, useState } from "react";
import { Award, Lock, RotateCcw } from "lucide-react";
import { isScoredTaskType, type EndAnswers, type GradeResult, type ItemFeedback } from "@/lib/learning/results";
import { Prose } from "@/components/learn/blocks/prose";
import type { PortableTextValue } from "@/components/learn/blocks/types";
import { matchingRows, type MatchingState } from "@/components/learn/interactive/matching-board";
import { buttonPrimary, buttonSecondary, PracticeHeader, ResultNote } from "@/components/learn/interactive/practice-ui";
import { taskKinds } from "@/components/learn/tasks/task-bodies";
import type { PublicTask } from "@/components/learn/tasks/types";
import {
  initialValue,
  isAnswered,
  QuestionInput,
  Verdict,
  type PublicQuestion,
  type QuestionValue,
} from "./knowledge-check";

export type PublicEndItem = {
  _key: string;
  _type: "assessmentQuestionRef" | "assessmentTaskItem";
  points?: number | null;
  question?: PublicQuestion["question"];
  task?: PublicTask | null;
};

export type PublicEndAssessment = {
  title?: string | null;
  instructions?: PortableTextValue | null;
  passingScore?: number | null;
  items?: PublicEndItem[] | null;
};

const isQuestion = (item: PublicEndItem) => item._type === "assessmentQuestionRef";
const asQuestion = (item: PublicEndItem): PublicQuestion => ({ _key: item._key, points: item.points ?? 1, question: item.question });

function initialFor(item: PublicEndItem): unknown {
  if (isQuestion(item)) return initialValue(asQuestion(item));
  const kind = item.task ? taskKinds[item.task.taskType] : undefined;
  return kind && item.task ? kind.initial(item.task) : null;
}

function itemReady(item: PublicEndItem, value: unknown): boolean {
  if (isQuestion(item)) return isAnswered(asQuestion(item), value as QuestionValue);
  const kind = item.task ? taskKinds[item.task.taskType] : undefined;
  return Boolean(kind && item.task && kind.isComplete(item.task, value));
}

/** Points this item adds to the score. Self-checked tasks add none. */
function itemPoints(item: PublicEndItem): number {
  if (isQuestion(item)) return item.points ?? 1;
  return isScoredTaskType(item.task?.taskType) ? (item.points ?? 10) : 0;
}

/**
 * The scored assessment at the end of every lesson: questions and tasks in one
 * submission, marked on the server. Passing it completes the lesson, and the
 * best score counts towards the certificate. Opens once every section is done.
 */
export function EndAssessmentView({
  assessment,
  unlocked,
  initiallyPassed,
  signedIn,
  onSubmit,
}: {
  assessment: PublicEndAssessment;
  /** Every section of the lesson is complete. */
  unlocked: boolean;
  initiallyPassed: boolean;
  signedIn: boolean;
  onSubmit: (answers: EndAnswers) => Promise<GradeResult>;
}) {
  const items = useMemo(() => (assessment.items ?? []).filter((i) => isQuestion(i) || i.task), [assessment.items]);
  const [values, setValues] = useState<Record<string, unknown>>(() => Object.fromEntries(items.map((i) => [i._key, initialFor(i)])));
  const [result, setResult] = useState<GradeResult | null>(null);
  const [pending, setPending] = useState(false);

  const feedback = useMemo(
    () => new Map<string, ItemFeedback>(result?.ok ? result.feedback.map((f) => [f.id, f]) : []),
    [result]
  );

  if (items.length === 0) return null;

  const passed = result?.ok === true && result.passed;
  const disabled = !unlocked || passed || pending;
  const ready = items.every((item) => itemReady(item, values[item._key]));
  const totalPoints = items.reduce((sum, item) => sum + itemPoints(item), 0);
  const passMark = assessment.passingScore ?? 80;

  async function submit() {
    setPending(true);
    try {
      const answers: EndAnswers = {};
      for (const item of items) {
        const value = values[item._key];
        if (isQuestion(item)) {
          answers[item._key] =
            item.question?.questionType === "matching" ? matchingRows(value as MatchingState) : (value as string | string[]);
        } else if (item.task) {
          answers[item._key] = taskKinds[item.task.taskType].toSubmission(item.task, value);
        }
      }
      setResult(await onSubmit(answers));
    } catch {
      setResult({ ok: false, reason: "unavailable", message: "Something went wrong. Please try again." });
    } finally {
      setPending(false);
    }
  }

  function retake() {
    setValues(Object.fromEntries(items.map((i) => [i._key, initialFor(i)])));
    setResult(null);
  }

  return (
    <section
      id="assessment"
      className="my-14 scroll-mt-24 border-t-2 border-accent border-b border-b-border pt-6 pb-6 dark:[color-scheme:dark]"
      aria-label={assessment.title || "End-of-lesson assessment"}
    >
      <PracticeHeader
        icon={Award}
        label="Scored · counts towards your certificate"
        meta={[`Pass mark ${passMark}%`, totalPoints > 0 && `${totalPoints} points`]}
        title={assessment.title || "End-of-lesson assessment"}
        as="h2"
      />

      <div className="space-y-5">
        {!unlocked && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="size-4" aria-hidden="true" /> Finish every section above to open the assessment.
          </p>
        )}
        {initiallyPassed && !passed && unlocked && (
          <ResultNote tone="success">You&apos;ve passed this assessment. Retake it any time; your best score counts.</ResultNote>
        )}
        {assessment.instructions && (
          <div className="[&_p]:text-[0.97rem] [&_p]:leading-7">
            <Prose value={assessment.instructions} />
          </div>
        )}

        <ol className={`divide-y divide-border ${unlocked ? "" : "select-none opacity-50"}`} inert={!unlocked}>
          {items.map((item, index) => {
            const fb = feedback.get(item._key);
            const points = itemPoints(item);
            return (
              <li key={item._key} className="py-6 first:pt-0">
                <div className="mb-3 flex items-start gap-3">
                  <span className="w-5 shrink-0 pt-px text-sm tabular-nums text-muted-foreground">{index + 1}.</span>
                  <div className="min-w-0 flex-1">
                    {isQuestion(item) ? (
                      <div className="[&_p]:mb-0 [&_p]:text-[1.0625rem] [&_p]:font-medium [&_p]:leading-snug [&_p]:text-foreground">
                        {item.question?.question && <Prose value={item.question.question} />}
                      </div>
                    ) : (
                      <>
                        <p className="text-[1.0625rem] font-medium leading-snug">{item.task?.title}</p>
                        {item.task?.objective && <p className="mt-0.5 text-sm text-muted-foreground">{item.task.objective}</p>}
                      </>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {points > 0 ? `${points} point${points === 1 ? "" : "s"}` : "Not scored (self-checked), but required"}
                    </p>
                  </div>
                  <Verdict fb={fb} />
                </div>

                <div className="sm:pl-8">
                  {isQuestion(item) ? (
                    <>
                      <QuestionInput
                        q={asQuestion(item)}
                        value={values[item._key] as QuestionValue}
                        onChange={(v) => setValues((prev) => ({ ...prev, [item._key]: v }))}
                        disabled={disabled}
                        fb={fb}
                      />
                      {fb?.explanation && <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{fb.explanation}</p>}
                    </>
                  ) : (
                    item.task && (
                      <TaskItemBody
                        task={item.task}
                        value={values[item._key]}
                        onChange={(v) => setValues((prev) => ({ ...prev, [item._key]: v }))}
                        rows={fb?.rows}
                        disabled={disabled}
                      />
                    )
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {passed ? (
              <button type="button" onClick={retake} className={buttonSecondary}>
                <RotateCcw className="size-4" /> Retake to improve your score
              </button>
            ) : signedIn ? (
              <button type="button" onClick={submit} disabled={!unlocked || !ready || pending} className={buttonPrimary}>
                {pending ? "Marking…" : "Submit assessment"}
              </button>
            ) : (
              <a href="#sign-in" className={buttonSecondary}>
                <Lock className="size-4" /> Sign in to take the assessment
              </a>
            )}
            {unlocked && !ready && !passed && signedIn && (
              <span className="text-xs text-muted-foreground">Complete every item to submit.</span>
            )}
          </div>

          <div aria-live="polite" className="[&:not(:empty)]:mt-4">
            {result && !result.ok && <ResultNote tone="error">{result.message ?? "That didn't work. Please try again."}</ResultNote>}
            {result?.ok && !result.passed && (
              <ResultNote tone="warning">
                <span className="font-medium">{result.score}%. </span>
                You need {passMark}% to pass. {result.message}
              </ResultNote>
            )}
            {passed && result?.ok && (
              <ResultNote tone="success">
                <span className="font-medium">
                  Passed with {result.score}%{result.attempt > 1 ? ` on attempt ${result.attempt}` : ""}.
                </span>{" "}
                Your best score counts towards the certificate.
              </ResultNote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** A task inside the assessment: just the work area, no hints (this is the test). */
function TaskItemBody({
  task,
  value,
  onChange,
  rows,
  disabled,
}: {
  task: PublicTask;
  value: unknown;
  onChange: (next: unknown) => void;
  rows?: ItemFeedback[];
  disabled: boolean;
}) {
  const kind = taskKinds[task.taskType];
  const feedback = useMemo(() => new Map((rows ?? []).map((r) => [r.id, r])), [rows]);
  if (!kind) return null;
  return (
    <div className="space-y-3">
      {task.steps && task.steps.length > 0 && (
        <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          {task.steps.map((step) => (
            <li key={step._key}>
              <span className="text-foreground">{step.title}</span>
              {step.detail && <span> {step.detail}</span>}
            </li>
          ))}
        </ol>
      )}
      <kind.Body task={task} value={value} onChange={onChange} feedback={feedback} disabled={disabled} />
    </div>
  );
}
