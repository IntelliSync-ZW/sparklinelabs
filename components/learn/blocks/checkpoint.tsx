"use client";

import { useState } from "react";
import { CheckCircle2, CircleHelp, RotateCcw, XCircle } from "lucide-react";

type Option = { _key?: string; label?: string; isCorrect?: boolean; feedback?: string };
type CheckpointValue = { question?: string; options?: Option[] };

/**
 * A quick, ungraded question inside the reading. One right answer gives instant
 * feedback on click; several right answers use checkboxes and a Check button.
 */
export function CheckpointBlock({ value }: { value: CheckpointValue }) {
  const options = value.options ?? [];
  const multi = options.filter((o) => o.isCorrect).length > 1;
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  const answered = multi ? checked : picked.length > 0;
  const allCorrect =
    answered &&
    options.every((o, i) => Boolean(o.isCorrect) === picked.includes(i)) &&
    picked.length === options.filter((o) => o.isCorrect).length;

  function choose(i: number) {
    if (answered && !multi) return;
    if (multi) {
      if (checked) return;
      setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
    } else {
      setPicked([i]);
    }
  }

  function reset() {
    setPicked([]);
    setChecked(false);
  }

  return (
    <section className="my-10 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5">
      <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
        <CircleHelp className="size-3.5" /> Quick check
      </p>
      <p className="mb-4 text-lg font-medium leading-snug text-foreground">{value.question}</p>

      <div role={multi ? "group" : "radiogroup"} aria-label={value.question} className="space-y-2.5">
        {options.map((option, i) => {
          const isPicked = picked.includes(i);
          const show = answered && (isPicked || (multi && option.isCorrect));
          const correct = Boolean(option.isCorrect);
          const tone = !show
            ? "border-border bg-background hover:border-sky-500/50"
            : correct
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-red-500 bg-red-500/10";
          return (
            <div key={option._key ?? i}>
              <button
                type="button"
                role={multi ? "checkbox" : "radio"}
                aria-checked={isPicked}
                onClick={() => choose(i)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${tone}`}
              >
                <span
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center border-2 ${
                    multi ? "rounded" : "rounded-full"
                  } ${isPicked ? "border-sky-500 bg-sky-500 text-white" : "border-muted-foreground/40"}`}
                >
                  {show ? (
                    correct ? <CheckCircle2 className="size-4 text-emerald-500" /> : <XCircle className="size-4 text-red-500" />
                  ) : isPicked ? (
                    <span className="size-2 rounded-full bg-white" />
                  ) : null}
                </span>
                <span className="text-foreground">{option.label}</span>
              </button>
              {show && isPicked && option.feedback && (
                <p className="ml-12 mt-1.5 text-sm leading-relaxed text-muted-foreground">{option.feedback}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3" aria-live="polite">
        {multi && !checked && (
          <button
            type="button"
            disabled={picked.length === 0}
            onClick={() => setChecked(true)}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:opacity-40"
          >
            Check answer
          </button>
        )}
        {answered && (
          <>
            <span className={`text-sm font-semibold ${allCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {allCorrect ? "Correct!" : "Not quite. Have another look."}
            </span>
            {!allCorrect && (
              <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                <RotateCcw className="size-3.5" /> Try again
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
