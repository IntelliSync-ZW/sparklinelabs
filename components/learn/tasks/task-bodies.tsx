"use client";

import { Check, X } from "lucide-react";
import type { ItemFeedback, TaskSubmission } from "@/lib/learning/results";
import { PromptBlock } from "@/components/learn/blocks/prompt-block";
import { initialMatching, MatchingBoard, matchingRows, type MatchingState } from "@/components/learn/interactive/matching-board";
import { ReorderList } from "@/components/learn/interactive/reorder";
import type { PublicTask } from "./types";

// ---------------------------------------------------------------------------
// One body per task type. Each defines how to start, when it can be submitted,
// and how to turn the learner's work into a submission. The server grades it.
// ---------------------------------------------------------------------------

export type Feedback = ReadonlyMap<string, ItemFeedback>;

type BodyProps<V> = {
  task: PublicTask;
  value: V;
  onChange: (next: V) => void;
  feedback: Feedback;
  disabled: boolean;
};

export type TaskKind<V> = {
  initial: (task: PublicTask) => V;
  isComplete: (task: PublicTask, value: V) => boolean;
  toSubmission: (task: PublicTask, value: V) => TaskSubmission;
  Body: (props: BodyProps<V>) => React.ReactNode;
};

const mark = (fb?: ItemFeedback) =>
  fb ? (
    <span
      className={`grid size-5 shrink-0 place-items-center rounded-full text-white ${fb.correct ? "bg-emerald-500" : "bg-red-500"}`}
      role="img"
      aria-label={fb.correct ? "Correct" : "Wrong"}
    >
      {fb.correct ? <Check className="size-3" strokeWidth={3} /> : <X className="size-3" strokeWidth={3} />}
    </span>
  ) : null;

const rowTone = (fb?: ItemFeedback) =>
  !fb ? "border-border" : fb.correct ? "border-emerald-500/60 bg-emerald-500/5" : "border-red-500/60 bg-red-500/5";

function Reveal({ fb }: { fb?: ItemFeedback }) {
  if (!fb || (!fb.expected && !fb.explanation)) return null;
  return (
    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
      {fb.expected && !fb.correct && <span className="font-semibold text-foreground">Answer: {fb.expected}. </span>}
      {fb.explanation}
    </p>
  );
}

// ── Classification ───────────────────────────────────────────────────────────

const classification: TaskKind<Record<string, string>> = {
  initial: () => ({}),
  isComplete: (task, v) => (task.classificationRows ?? []).every((r) => v[r._key]),
  toSubmission: (_t, answers) => ({ type: "classification", answers }),
  Body: ({ task, value, onChange, feedback, disabled }) => (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-[1fr_auto] gap-3 bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground sm:grid-cols-[1fr_14rem]">
        <span>{task.classificationColumns?.itemLabel || "Task"}</span>
        <span>{task.classificationColumns?.answerLabel || "Category"}</span>
      </div>
      <ul className="divide-y divide-border">
        {(task.classificationRows ?? []).map((row) => {
          const fb = feedback.get(row._key);
          return (
            <li key={row._key} className={`border-l-4 px-4 py-3 ${rowTone(fb)}`}>
              <div className="grid grid-cols-[1fr_auto] items-start gap-3 sm:grid-cols-[1fr_14rem]">
                <span className="flex items-start gap-2 text-sm leading-snug">
                  {mark(fb)}
                  {row.item}
                </span>
                <select
                  value={value[row._key] ?? ""}
                  disabled={disabled}
                  onChange={(e) => onChange({ ...value, [row._key]: e.target.value })}
                  aria-label={`Category for: ${row.item}`}
                  className="w-full min-w-28 rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
                >
                  <option value="">Choose…</option>
                  {(task.classificationOptions ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <Reveal fb={fb} />
            </li>
          );
        })}
      </ul>
    </div>
  ),
};

// ── Multiple choice ──────────────────────────────────────────────────────────

const multipleChoice: TaskKind<string[]> = {
  initial: () => [],
  isComplete: (_t, v) => v.length > 0,
  toSubmission: (_t, choices) => ({ type: "multiple_choice", choices }),
  Body: ({ task, value, onChange, feedback, disabled }) => {
    const multi = Boolean(task.allowMultiple);
    return (
      <div>
        {task.question && <p className="mb-3 text-base font-medium leading-snug">{task.question}</p>}
        <div role={multi ? "group" : "radiogroup"} className="space-y-2">
          {(task.choices ?? []).map((choice) => {
            const picked = value.includes(choice._key);
            const fb = feedback.get(choice._key);
            return (
              <div key={choice._key}>
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 ${
                    fb ? rowTone(fb) : picked ? "border-accent bg-accent/5" : "border-border hover:bg-secondary"
                  }`}
                >
                  <input
                    type={multi ? "checkbox" : "radio"}
                    name={`mc-${task.id ?? task.title}`}
                    checked={picked}
                    disabled={disabled}
                    onChange={() =>
                      onChange(multi ? (picked ? value.filter((v) => v !== choice._key) : [...value, choice._key]) : [choice._key])
                    }
                    className="mt-1 size-4 accent-[var(--accent)]"
                  />
                  <span className="flex-1 text-sm leading-snug">{choice.label}</span>
                  {picked && mark(fb)}
                </label>
                {picked && fb?.explanation && <p className="ml-4 mt-1.5 text-sm text-muted-foreground">{fb.explanation}</p>}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

// ── Matching ─────────────────────────────────────────────────────────────────

const matching: TaskKind<MatchingState> = {
  initial: (task) => initialMatching(task.matchKeys, task.matchOptions),
  isComplete: (_t, v) => v.keys.length > 0,
  toSubmission: (_t, v) => ({ type: "matching", rows: matchingRows(v) }),
  Body: ({ task, value, onChange, feedback, disabled }) => (
    <MatchingBoard
      keyLabels={Object.fromEntries((task.matchKeys ?? []).map((k) => [k._key, k.key]))}
      columns={task.matchColumns}
      state={value}
      onChange={onChange}
      disabled={disabled}
      rowStatus={(keyId) => {
        const fb = feedback.get(keyId);
        return fb ? (fb.correct ? "correct" : "wrong") : undefined;
      }}
    />
  ),
};

// ── Ordering ─────────────────────────────────────────────────────────────────

type OrderItems = { id: string | number; text: string }[];

const ordering: TaskKind<OrderItems> = {
  initial: (task) => (task.orderingItems ?? []).map((text, i) => ({ id: i, text })),
  isComplete: (_t, v) => v.length > 0,
  toSubmission: (_t, v) => ({ type: "ordering", order: v.map((i) => i.text) }),
  Body: ({ value, onChange, feedback, disabled }) => (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Put the steps in the right order — drag, or use the arrows.</p>
      <ReorderList
        items={value}
        onChange={onChange}
        disabled={disabled}
        statusAt={(i) => {
          const fb = feedback.get(String(i));
          return fb ? (fb.correct ? "correct" : "wrong") : undefined;
        }}
      />
    </div>
  ),
};

// ── Source verification ──────────────────────────────────────────────────────

const verdicts = [
  { value: "supported", label: "Supported" },
  { value: "unsupported", label: "Not supported" },
  { value: "unverifiable", label: "Can't be verified" },
];

const verification: TaskKind<Record<string, string>> = {
  initial: () => ({}),
  isComplete: (task, v) => (task.claims ?? []).every((c) => v[c._key]),
  toSubmission: (_t, v) => ({ type: "source_verification", verdicts: v }),
  Body: ({ task, value, onChange, feedback, disabled }) => (
    <ul className="space-y-3">
      {(task.claims ?? []).map((claim) => {
        const fb = feedback.get(claim._key);
        return (
          <li key={claim._key} className={`rounded-xl border border-l-4 px-4 py-3 ${rowTone(fb)}`}>
            <p className="mb-2 flex items-start gap-2 text-sm font-medium leading-snug">
              {mark(fb)}
              {claim.claim}
            </p>
            <div role="radiogroup" aria-label={claim.claim} className="flex flex-wrap gap-2">
              {verdicts.map((v) => (
                <label
                  key={v.value}
                  className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm ${
                    value[claim._key] === v.value ? "border-accent bg-accent/10 font-medium" : "border-border hover:bg-secondary"
                  } ${disabled ? "pointer-events-none opacity-70" : ""}`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={`claim-${claim._key}`}
                    checked={value[claim._key] === v.value}
                    onChange={() => onChange({ ...value, [claim._key]: v.value })}
                  />
                  {v.label}
                </label>
              ))}
            </div>
            <Reveal fb={fb} />
          </li>
        );
      })}
    </ul>
  ),
};

// ── Written response and prompt practice (self-checked against the rubric) ───

type ResponseValue = { response: string; rubric: Record<string, boolean> };

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const response: TaskKind<ResponseValue> = {
  initial: () => ({ response: "", rubric: {} }),
  isComplete: (task, v) => {
    const words = countWords(v.response);
    const { min, max } = task.wordRange ?? {};
    if (!words || (min && words < min) || (max && words > max)) return false;
    return (task.rubric ?? []).every((r) => v.rubric[r._key]);
  },
  toSubmission: (_t, v) => ({ type: "response", response: v.response, rubric: v.rubric }),
  Body: ({ task, value, onChange, disabled }) => {
    const words = countWords(value.response);
    const { min, max } = task.wordRange ?? {};
    const outOfRange = words > 0 && ((min && words < min) || (max && words > max));
    const isPrompt = task.taskType === "prompt_practice";
    return (
      <div className="space-y-4">
        {isPrompt && task.starterPrompt && (
          <PromptBlock value={{ title: "Starter prompt", prompt: task.starterPrompt, targetAiTool: task.targetAiTool }} />
        )}
        <div>
          <label htmlFor={`resp-${task.id ?? task.title}`} className="mb-1.5 block text-sm font-semibold">
            {isPrompt ? "Paste the AI's response, and add your own notes" : "Your response"}
          </label>
          <textarea
            id={`resp-${task.id ?? task.title}`}
            value={value.response}
            disabled={disabled}
            onChange={(e) => onChange({ ...value, response: e.target.value })}
            rows={isPrompt ? 8 : 7}
            placeholder={task.responsePlaceholder || "Write here…"}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed"
          />
          <p className={`mt-1 text-xs ${outOfRange ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
            {words} word{words === 1 ? "" : "s"}
            {min || max ? ` · aim for ${min ? `${min}` : "any"}${max ? `–${max}` : "+"}` : ""}
          </p>
        </div>

        {(task.rubric ?? []).length > 0 && (
          <fieldset className="rounded-xl border border-border bg-secondary/40 p-4">
            <legend className="px-1 text-sm font-semibold">Check your work</legend>
            <p className="mb-3 text-xs text-muted-foreground">Tick each criterion once your response meets it.</p>
            <ul className="space-y-2.5">
              {(task.rubric ?? []).map((item) => (
                <li key={item._key}>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(value.rubric[item._key])}
                      disabled={disabled}
                      onChange={(e) => onChange({ ...value, rubric: { ...value.rubric, [item._key]: e.target.checked } })}
                      className="mt-1 size-4 accent-[var(--accent)]"
                    />
                    <span className="text-sm leading-snug">
                      <span className="font-medium">{item.criterion}</span>
                      {item.description && <span className="block text-muted-foreground">{item.description}</span>}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        )}
      </div>
    );
  },
};

// ── Checklist ────────────────────────────────────────────────────────────────

const checklist: TaskKind<boolean[]> = {
  initial: (task) => (task.checklistItems ?? []).map(() => false),
  isComplete: (_t, v) => v.length > 0 && v.every(Boolean),
  toSubmission: (_t, checked) => ({ type: "checklist", checked }),
  Body: ({ task, value, onChange, disabled }) => (
    <ul className="space-y-2">
      {(task.checklistItems ?? []).map((item, i) => (
        <li key={`${i}-${item}`}>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-4 py-3 hover:bg-secondary">
            <input
              type="checkbox"
              checked={Boolean(value[i])}
              disabled={disabled}
              onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.checked : v)))}
              className="mt-1 size-4 accent-[var(--accent)]"
            />
            <span className="text-sm leading-snug">{item}</span>
          </label>
        </li>
      ))}
    </ul>
  ),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const taskKinds: Record<string, TaskKind<any>> = {
  classification,
  multiple_choice: multipleChoice,
  matching,
  ordering,
  source_verification: verification,
  written: response,
  prompt_practice: response,
  checklist,
};
