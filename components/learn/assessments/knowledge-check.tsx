"use client";

import { useId, useMemo, useState } from "react";
import { CheckCircle2, Lock, RotateCcw, Target } from "lucide-react";
import type { CheckAnswers, GradeResult, ItemFeedback } from "@/lib/learning/results";
import { Prose } from "@/components/learn/blocks/prose";
import type { PortableTextValue } from "@/components/learn/blocks/types";
import { initialMatching, MatchingBoard, matchingRows, type MatchingState } from "@/components/learn/interactive/matching-board";
import {
  buttonPrimary,
  buttonSecondary,
  ChoiceList,
  fieldClass,
  practiceFrame,
  PracticeHeader,
  ResultNote,
  StatusMark,
} from "@/components/learn/interactive/practice-ui";

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

/** Right or wrong for a whole question, once marked. */
export function Verdict({ fb }: { fb?: ItemFeedback }) {
  return <StatusMark status={fb ? (fb.correct ? "correct" : "wrong") : undefined} />;
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
  const name = useId();
  const question = q.question;
  const options = question?.options ?? [];
  const type = question?.questionType;

  switch (type) {
    case "single_choice":
    case "true_false": {
      // True/false questions without options fall back to two fixed choices.
      const choices = options.length > 0 ? options : [{ id: "true", label: "True" }, { id: "false", label: "False" }];
      return (
        <ChoiceList
          name={name}
          multiple={false}
          options={choices}
          selected={typeof value === "string" && value ? [value] : []}
          onToggle={(id) => onChange(id)}
          disabled={disabled}
        />
      );
    }
    case "multiple_choice": {
      const picked = value as string[];
      return (
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Select all that apply.</p>
          <ChoiceList
            name={name}
            multiple
            options={options}
            selected={picked}
            onToggle={(id) => onChange(picked.includes(id) ? picked.filter((v) => v !== id) : [...picked, id])}
            disabled={disabled}
          />
        </div>
      );
    }
    case "short_answer":
      return (
        <input
          type="text"
          value={value as string}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Your answer"
          placeholder="Type your answer"
          className={`${fieldClass} h-9`}
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
    <section data-practice className={practiceFrame} aria-label={check.title || "Knowledge check"}>
      <PracticeHeader
        icon={Target}
        label="Knowledge check"
        meta={[
          required ? "Required" : "Optional",
          scored && "Scored",
          `Pass mark ${check.passingScore ?? 80}%`,
          initiallyPassed && !passed && (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" aria-hidden="true" /> Passed
            </span>
          ),
        ]}
        title={check.title || "Check your understanding"}
      />

      <ol className="divide-y divide-border">
        {questions.map((q, i) => {
          const fb = feedback.get(q._key);
          return (
            <li key={q._key} className="py-5 first:pt-0">
              <div className="mb-3 flex items-start gap-3">
                <span className="w-5 shrink-0 pt-px text-sm tabular-nums text-muted-foreground">{i + 1}.</span>
                <div className="min-w-0 flex-1 [&_p]:mb-0 [&_p]:text-[1.0625rem] [&_p]:font-medium [&_p]:leading-snug [&_p]:text-foreground">
                  {q.question?.question && <Prose value={q.question.question} />}
                </div>
                <Verdict fb={fb} />
              </div>
              <div className="sm:pl-8">
                <QuestionInput
                  q={q}
                  value={values[q._key]}
                  onChange={(v) => setValues((prev) => ({ ...prev, [q._key]: v }))}
                  disabled={passed || pending}
                  fb={fb}
                />
                {fb && (fb.explanation || (passed && fb.expected && !fb.correct)) && (
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {passed && fb.expected && !fb.correct && q.question?.questionType !== "matching" && (
                      <span className="font-medium text-foreground">
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

      <div className="mt-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {passed ? (
            <button type="button" onClick={reset} className={buttonSecondary}>
              <RotateCcw className="size-4" /> Retake
            </button>
          ) : signedIn ? (
            <button type="button" onClick={submit} disabled={!ready || pending} className={buttonPrimary}>
              {pending ? "Marking…" : "Submit answers"}
            </button>
          ) : (
            <a href="#sign-in" className={buttonSecondary}>
              <Lock className="size-4" /> Sign in to submit
            </a>
          )}
          {!ready && !passed && signedIn && <span className="text-xs text-muted-foreground">Answer every question to submit.</span>}
        </div>

        <div aria-live="polite" className="[&:not(:empty)]:mt-4">
          {result && !result.ok && <ResultNote tone="error">{result.message ?? "That didn't work. Please try again."}</ResultNote>}
          {result?.ok && !result.passed && (
            <ResultNote tone="warning">
              <span className="font-medium">{result.score}%. </span>
              {check.feedbackOnFail || result.message || "Review the questions marked wrong and try again."}
            </ResultNote>
          )}
          {passed && result?.ok && (
            <ResultNote tone="success">
              <span className="font-medium">
                Passed with {result.score}%{result.attempt > 1 ? ` · attempt ${result.attempt}` : ""}
              </span>
              {check.feedbackOnPass && <span className="block text-muted-foreground">{check.feedbackOnPass}</span>}
            </ResultNote>
          )}
        </div>
      </div>
    </section>
  );
}
