"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Check, CheckCircle2, Lock, RotateCcw, Target, X } from "lucide-react";
import type { CheckAnswers, GradeResult, ItemFeedback } from "@/lib/learning/results";
import { Prose } from "@/components/learn/blocks/prose";
import type { PortableTextValue } from "@/components/learn/blocks/types";
import { initialMatching, MatchingBoard, matchingRows, type MatchingState } from "@/components/learn/interactive/matching-board";

export type PublicQuestion = {
  _key: string;
  points?: number;
  question?: {
    _id: string;
    questionType?: string | null;
    question?: PortableTextValue;
    options?: { id: string; label: string }[] | null;
    matchColumns?: { keyLabel?: string; optionLabel?: string } | null;
    matchKeys?: { _key: string; key: string }[] | null;
    matchOptions?: string[] | null;
  } | null;
};

export type PublicCheck = {
  required?: boolean;
  scored?: boolean;
  title?: string;
  passingScore?: number;
  feedbackOnPass?: string;
  feedbackOnFail?: string;
  questions?: PublicQuestion[] | null;
};

export type QuestionValue = string | string[] | MatchingState;
type Value = QuestionValue;

export function initialValue(q: PublicQuestion): Value {
  const type = q.question?.questionType;
  if (type === "multiple_choice") return [];
  if (type === "matching") return initialMatching(q.question?.matchKeys, q.question?.matchOptions);
  return "";
}

export function isAnswered(q: PublicQuestion, v: Value): boolean {
  if (q.question?.questionType === "matching") return (v as MatchingState).keys.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return typeof v === "string" && v.trim().length > 0;
}

export const tone = (fb?: ItemFeedback) =>
  !fb ? "border-border" : fb.correct ? "border-emerald-500/60 bg-emerald-500/5" : "border-red-500/60 bg-red-500/5";

export function Verdict({ fb }: { fb?: ItemFeedback }) {
  if (!fb) return null;
  return (
    <span
      role="img"
      aria-label={fb.correct ? "Correct" : "Wrong"}
      className={`grid size-5 shrink-0 place-items-center rounded-full text-white ${fb.correct ? "bg-emerald-500" : "bg-red-500"}`}
    >
      {fb.correct ? <Check className="size-3" strokeWidth={3} /> : <X className="size-3" strokeWidth={3} />}
    </span>
  );
}

export function QuestionInput({
  q,
  value,
  onChange,
  disabled,
  fb,
}: {
  q: PublicQuestion;
  value: Value;
  onChange: (v: Value) => void;
  disabled: boolean;
  fb?: ItemFeedback;
}) {
  const question = q.question;
  const options = question?.options ?? [];
  const type = question?.questionType;

  switch (type) {
    case "single_choice":
    case "true_false": {
      // True/false questions without options fall back to two fixed choices.
      const choices = options.length > 0 ? options : [{ id: "true", label: "True" }, { id: "false", label: "False" }];
      return (
        <div role="radiogroup" className="space-y-2">
          {choices.map((o) => (
            <label
              key={o.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm ${
                value === o.id ? "border-accent bg-accent/5" : "border-border hover:bg-secondary"
              } ${disabled ? "pointer-events-none opacity-80" : ""}`}
            >
              <input type="radio" name={`q-${q._key}`} checked={value === o.id} onChange={() => onChange(o.id)} className="size-4 accent-[var(--accent)]" />
              {o.label}
            </label>
          ))}
        </div>
      );
    }
    case "multiple_choice":
      return (
        <div role="group" className="space-y-2">
          <p className="text-xs text-muted-foreground">Select all that apply.</p>
          {options.map((o) => {
            const picked = (value as string[]).includes(o.id);
            return (
              <label
                key={o.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm ${
                  picked ? "border-accent bg-accent/5" : "border-border hover:bg-secondary"
                } ${disabled ? "pointer-events-none opacity-80" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={picked}
                  onChange={() => onChange(picked ? (value as string[]).filter((v) => v !== o.id) : [...(value as string[]), o.id])}
                  className="size-4 accent-[var(--accent)]"
                />
                {o.label}
              </label>
            );
          })}
        </div>
      );
    case "short_answer":
      return (
        <input
          type="text"
          value={value as string}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Your answer"
          placeholder="Type your answer"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
        />
      );
    case "matching":
      return (
        <MatchingBoard
          keyLabels={Object.fromEntries((question?.matchKeys ?? []).map((k) => [k._key, k.key]))}
          columns={question?.matchColumns}
          state={value as MatchingState}
          onChange={onChange}
          disabled={disabled}
          rowStatus={(keyId) => {
            const row = fb?.rows?.find((r) => r.id === keyId);
            return row ? (row.correct ? "correct" : "wrong") : undefined;
          }}
        />
      );
    default:
      return null;
  }

}

/**
 * A graded quiz at the end of a section. Answers are sent to the server, which
 * marks them against the key it loads itself; the page only learns right and
 * wrong (and the answers, once the learner has passed).
 */
export function KnowledgeCheckView({
  check,
  required,
  scored = false,
  initiallyPassed,
  signedIn,
  onSubmit,
}: {
  check: PublicCheck;
  required: boolean;
  /** Counts towards the certificate. Only ever true for required checks. */
  scored?: boolean;
  initiallyPassed: boolean;
  signedIn: boolean;
  onSubmit: (answers: CheckAnswers) => Promise<GradeResult>;
}) {
  const questions = check.questions ?? [];
  const [values, setValues] = useState<Record<string, Value>>(() => Object.fromEntries(questions.map((q) => [q._key, initialValue(q)])));
  const [result, setResult] = useState<GradeResult | null>(null);
  const [pending, setPending] = useState(false);

  const feedback = useMemo(
    () => new Map<string, ItemFeedback>(result?.ok ? result.feedback.map((f) => [f.id, f]) : []),
    [result]
  );
  const passed = result?.ok === true && result.passed;
  const ready = questions.every((q) => isAnswered(q, values[q._key]));

  if (questions.length === 0) return null;

  async function submit() {
    setPending(true);
    try {
      const answers: CheckAnswers = {};
      for (const q of questions) {
        const v = values[q._key];
        answers[q._key] = q.question?.questionType === "matching" ? matchingRows(v as MatchingState) : (v as string | string[]);
      }
      setResult(await onSubmit(answers));
    } catch {
      setResult({ ok: false, reason: "unavailable", message: "Something went wrong. Please try again." });
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setValues(Object.fromEntries(questions.map((q) => [q._key, initialValue(q)])));
    setResult(null);
  }

  return (
    <section className="my-10 overflow-hidden rounded-2xl border-2 border-violet-500/30 bg-card shadow-sm" aria-label={check.title || "Knowledge check"}>
      <header className="flex flex-wrap items-center gap-3 border-b border-violet-500/20 bg-violet-500/10 px-5 py-3">
        <span className="grid size-9 place-items-center rounded-lg bg-violet-600 text-white">
          <Target className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-300">Knowledge check</p>
          <h3 className="truncate text-lg font-semibold leading-tight">{check.title || "Check your understanding"}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className={`rounded-full px-2.5 py-1 ${required ? "bg-violet-600 text-white" : "bg-secondary text-muted-foreground"}`}>
            {required ? "Required" : "Optional"}
          </span>
          {scored && <span className="rounded-full border border-violet-500/40 px-2.5 py-1 text-violet-700 dark:text-violet-300">Scored</span>}
          <span className="text-muted-foreground">Pass mark {check.passingScore ?? 80}%</span>
          {initiallyPassed && !passed && (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" /> Passed
            </span>
          )}
        </div>
      </header>

      <div className="space-y-6 px-5 py-5">
        <ol className="space-y-6">
          {questions.map((q, i) => {
            const fb = feedback.get(q._key);
            return (
              <li key={q._key} className={`rounded-xl border border-l-4 p-4 ${tone(fb)}`}>
                <div className="mb-3 flex items-start gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold">{i + 1}</span>
                  <div className="min-w-0 flex-1 text-base font-medium [&_p]:mb-0 [&_p]:text-base [&_p]:leading-snug [&_p]:text-foreground">
                    {q.question?.question && <Prose value={q.question.question} />}
                  </div>
                  <Verdict fb={fb} />
                </div>
                <div className="sm:pl-10">
                  <QuestionInput
                    q={q}
                    value={values[q._key]}
                    onChange={(v) => setValues((prev) => ({ ...prev, [q._key]: v }))}
                    disabled={passed || pending}
                    fb={fb}
                  />
                  {fb && (fb.explanation || (passed && fb.expected && !fb.correct)) && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {passed && fb.expected && !fb.correct && q.question?.questionType !== "matching" && (
                        <span className="font-semibold text-foreground">
                          Answer:{" "}
                          {fb.expected
                            .split(", ")
                            .map((id) => q.question?.options?.find((o) => o.id === id)?.label ?? id)
                            .join(", ")}
                          .{" "}
                        </span>
                      )}
                      {fb.explanation}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

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
                {check.feedbackOnFail || result.message || "Review the questions marked wrong and try again."}
              </span>
            </p>
          )}
          {passed && result?.ok && (
            <p className="flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
              <span>
                Passed with {result.score}%{result.attempt > 1 ? ` · attempt ${result.attempt}` : ""}
                {check.feedbackOnPass && <span className="block font-normal text-muted-foreground">{check.feedbackOnPass}</span>}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {passed ? (
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
              <RotateCcw className="size-4" /> Retake
            </button>
          ) : signedIn ? (
            <button
              type="button"
              onClick={submit}
              disabled={!ready || pending}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending ? "Marking…" : "Submit answers"}
            </button>
          ) : (
            <a href="#sign-in" className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold hover:bg-secondary/70">
              <Lock className="size-4" /> Sign in to submit
            </a>
          )}
          {!ready && !passed && signedIn && <span className="text-xs text-muted-foreground">Answer every question to submit.</span>}
        </div>
      </div>
    </section>
  );
}
