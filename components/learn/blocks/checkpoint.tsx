"use client";

import { useId, useState } from "react";
import { CircleHelp, RotateCcw } from "lucide-react";
import {
  Aside,
  buttonPrimary,
  buttonQuiet,
  ChoiceList,
  practiceFrame,
  PracticeHeader,
  ResultNote,
} from "@/components/learn/interactive/practice-ui";

type Option = { _key?: string; label?: string; isCorrect?: boolean; feedback?: string };
type Question = {
  _key?: string;
  question?: string;
  answerType?: "single" | "multiple";
  options?: Option[];
  /** Shown once the question is answered, right or wrong. */
  feedback?: string;
};
type CheckpointValue = { questions?: Question[] };

/**
 * A quick, ungraded check inside the reading: one or more questions with instant
 * feedback. "One answer" questions use radios, "Select all that apply" ones use
 * checkboxes; either way the learner picks, then checks.
 */
export function CheckpointBlock({ value }: { value: CheckpointValue }) {
  const questions = (value.questions ?? []).filter((q) => (q.options?.length ?? 0) > 0);
  // Right/wrong per answered question, by index. Cleared when the learner tries again.
  const [results, setResults] = useState<Record<number, boolean>>({});
  if (questions.length === 0) return null;

  const many = questions.length > 1;
  const answered = Object.keys(results).length;
  const right = Object.values(results).filter(Boolean).length;

  function record(index: number, correct: boolean | null) {
    setResults((r) => {
      const next = { ...r };
      if (correct === null) delete next[index];
      else next[index] = correct;
      return next;
    });
  }

  return (
    <section data-practice aria-label="Quick check" className={practiceFrame}>
      <PracticeHeader icon={CircleHelp} label="Quick check" meta={[many && `${questions.length} questions`]} />

      <div className="divide-y divide-border">
        {questions.map((q, i) => (
          <div key={q._key ?? i} className="py-6 first:pt-0 last:pb-0">
            <CheckpointQuestion
              question={q}
              position={many ? `Question ${i + 1} of ${questions.length}` : undefined}
              onResult={(correct) => record(i, correct)}
            />
          </div>
        ))}
      </div>

      {many && answered === questions.length && (
        <p className="mt-6 text-sm font-medium text-foreground" aria-live="polite">
          You got {right} of {questions.length} right.
        </p>
      )}
    </section>
  );
}

function CheckpointQuestion({
  question,
  position,
  onResult,
}: {
  question: Question;
  /** "Question 2 of 3", when the check has more than one question. */
  position?: string;
  /** Right or wrong once checked; null when the learner resets to try again. */
  onResult: (correct: boolean | null) => void;
}) {
  const name = useId();
  const options = question.options ?? [];
  const ids = options.map((o, i) => o._key ?? String(i));
  // Questions saved before the answer type existed fall back to counting right answers.
  const multi = question.answerType ? question.answerType === "multiple" : options.filter((o) => o.isCorrect).length > 1;
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const isCorrect = (id: string) => Boolean(options[ids.indexOf(id)]?.isCorrect);
  const allCorrect = checked && ids.every((id) => isCorrect(id) === picked.includes(id));

  function toggle(id: string) {
    setPicked((p) => (multi ? (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]) : [id]));
  }

  function check() {
    const correct = ids.every((id) => isCorrect(id) === picked.includes(id));
    setChecked(true);
    onResult(correct);
  }

  function reset() {
    setPicked([]);
    setChecked(false);
    onResult(null);
  }

  return (
    <div>
      {position && <p className="mb-1 text-xs text-muted-foreground">{position}</p>}
      <p className="text-[1.0625rem] font-medium leading-snug text-foreground">{question.question}</p>
      {multi && <p className="mt-0.5 text-sm text-muted-foreground">Select all that apply.</p>}

      <ChoiceList
        className="mt-3"
        name={name}
        multiple={multi}
        label={question.question}
        options={options.map((o, i) => ({ id: ids[i], label: o.label }))}
        selected={picked}
        onToggle={toggle}
        disabled={checked}
        statusOf={(id) => (checked && picked.includes(id) ? (isCorrect(id) ? "correct" : "wrong") : undefined)}
        noteOf={(id) => (checked && picked.includes(id) ? options[ids.indexOf(id)]?.feedback : undefined)}
      />

      <div className="mt-3 flex min-h-9 flex-wrap items-center gap-x-4 gap-y-2" aria-live="polite">
        {!checked ? (
          <button type="button" disabled={picked.length === 0} onClick={check} className={buttonPrimary}>
            Check answer
          </button>
        ) : (
          <>
            <ResultNote tone={allCorrect ? "success" : "error"}>{allCorrect ? "Correct." : "Not quite."}</ResultNote>
            {!allCorrect && (
              <button type="button" onClick={reset} className={buttonQuiet}>
                <RotateCcw className="size-3.5" /> Try again
              </button>
            )}
          </>
        )}
      </div>

      {checked && question.feedback && (
        <div className="mt-3">
          <Aside>
            <p className="whitespace-pre-line">{question.feedback}</p>
          </Aside>
        </div>
      )}
    </div>
  );
}
