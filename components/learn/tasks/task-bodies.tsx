"use client";

import { useId } from "react";
import type { ItemFeedback, TaskSubmission } from "@/lib/learning/results";
import { PromptBlock } from "@/components/learn/blocks/prompt-block";
import { initialMatching, MatchingBoard, matchingRows, type MatchingState } from "@/components/learn/interactive/matching-board";
import { ReorderList } from "@/components/learn/interactive/reorder";
import { ChoiceList, fieldClass, StatusMark, statusTint, type Status } from "@/components/learn/interactive/practice-ui";
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

const statusOf = (fb?: ItemFeedback): Status => (fb ? (fb.correct ? "correct" : "wrong") : undefined);

function Reveal({ fb }: { fb?: ItemFeedback }) {
  if (!fb || (!fb.expected && !fb.explanation)) return null;
  return (
    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
      {fb.expected && !fb.correct && <span className="font-medium text-foreground">Answer: {fb.expected}. </span>}
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
    <div className="overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-border bg-secondary/50 px-3.5 py-2 text-xs font-medium text-muted-foreground sm:grid-cols-[1fr_13rem]">
        <span>{task.classificationColumns?.itemLabel || "Item"}</span>
        <span>{task.classificationColumns?.answerLabel || "Category"}</span>
      </div>
      <ul className="divide-y divide-border">
        {(task.classificationRows ?? []).map((row) => {
          const fb = feedback.get(row._key);
          return (
            <li key={row._key} className={`px-3.5 py-2.5 ${statusTint(statusOf(fb))}`}>
              <div className="grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[1fr_13rem]">
                <span className="flex items-start gap-2 text-[0.9375rem] leading-snug">
                  <span className="min-w-0 flex-1">{row.item}</span>
                  <StatusMark status={statusOf(fb)} />
                </span>
                <select
                  value={value[row._key] ?? ""}
                  disabled={disabled}
                  onChange={(e) => onChange({ ...value, [row._key]: e.target.value })}
                  aria-label={`Category for: ${row.item}`}
                  className={`${fieldClass} h-8 min-w-28 px-2 text-sm`}
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
  Body: function MultipleChoiceBody({ task, value, onChange, feedback, disabled }) {
    const name = useId();
    const multi = Boolean(task.allowMultiple);
    return (
      <div>
        {task.question && <p className="text-[1.0625rem] font-medium leading-snug">{task.question}</p>}
        {multi && <p className="mt-0.5 text-sm text-muted-foreground">Select all that apply.</p>}
        <ChoiceList
          className={task.question || multi ? "mt-3" : ""}
          name={name}
          multiple={multi}
          label={task.question ?? undefined}
          options={(task.choices ?? []).map((c) => ({ id: c._key, label: c.label }))}
          selected={value}
          onToggle={(id) => onChange(multi ? (value.includes(id) ? value.filter((v) => v !== id) : [...value, id]) : [id])}
          disabled={disabled}
          statusOf={(id) => (value.includes(id) ? statusOf(feedback.get(id)) : undefined)}
          noteOf={(id) => (value.includes(id) ? feedback.get(id)?.explanation : undefined)}
        />
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
      <p className="text-sm text-muted-foreground">Put the steps in the right order. Drag them, or use the arrows.</p>
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
    <ul className="divide-y divide-border overflow-hidden rounded-md border border-border">
      {(task.claims ?? []).map((claim) => {
        const fb = feedback.get(claim._key);
        return (
          <li key={claim._key} className={`px-3.5 py-3 ${statusTint(statusOf(fb))}`}>
            <p className="mb-2.5 flex items-start gap-2 text-[0.9375rem] leading-snug">
              <span className="min-w-0 flex-1">{claim.claim}</span>
              <StatusMark status={statusOf(fb)} />
            </p>
            {/* A segmented control built on native radios. */}
            <div
              role="radiogroup"
              aria-label={claim.claim}
              className={`grid w-full grid-cols-3 gap-0.5 rounded-md border border-border bg-secondary/60 p-0.5 sm:inline-grid sm:w-auto ${disabled ? "opacity-70" : ""}`}
            >
              {verdicts.map((v) => {
                const on = value[claim._key] === v.value;
                return (
                  <label
                    key={v.value}
                    className={`grid place-items-center rounded-[5px] px-2 py-1.5 text-center text-[0.8125rem] leading-tight transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent sm:px-3 sm:py-1 sm:text-sm ${
                      on ? "bg-background font-medium text-foreground ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
                    } ${disabled ? "pointer-events-none" : "cursor-pointer"}`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name={`claim-${claim._key}`}
                      checked={on}
                      disabled={disabled}
                      onChange={() => onChange({ ...value, [claim._key]: v.value })}
                    />
                    {v.label}
                  </label>
                );
              })}
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
          <label htmlFor={`resp-${task.id ?? task.title}`} className="mb-1.5 block text-sm font-medium">
            {isPrompt ? "Paste the AI's response, and add your own notes" : "Your response"}
          </label>
          <textarea
            id={`resp-${task.id ?? task.title}`}
            value={value.response}
            disabled={disabled}
            onChange={(e) => onChange({ ...value, response: e.target.value })}
            rows={isPrompt ? 8 : 7}
            placeholder={task.responsePlaceholder || "Write here…"}
            className={`${fieldClass} block py-2.5 leading-relaxed`}
          />
          <p className={`mt-1 text-xs ${outOfRange ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
            {words} word{words === 1 ? "" : "s"}
            {min || max ? ` · aim for ${min ? `${min}` : "any"}${max ? `–${max}` : "+"}` : ""}
          </p>
        </div>

        {(task.rubric ?? []).length > 0 && (
          <fieldset>
            <legend className="text-sm font-medium">Check your work</legend>
            <p className="mb-2 text-xs text-muted-foreground">Tick each criterion once your response meets it.</p>
            <ChoiceList
              name={`rubric-${task.id ?? task.title}`}
              multiple
              options={(task.rubric ?? []).map((item) => ({ id: item._key, label: item.criterion, detail: item.description }))}
              selected={Object.keys(value.rubric).filter((key) => value.rubric[key])}
              onToggle={(id) => onChange({ ...value, rubric: { ...value.rubric, [id]: !value.rubric[id] } })}
              disabled={disabled}
            />
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
    <ChoiceList
      name={`checklist-${task.id ?? task.title}`}
      multiple
      options={(task.checklistItems ?? []).map((item, i) => ({ id: String(i), label: item }))}
      selected={value.flatMap((on, i) => (on ? [String(i)] : []))}
      onToggle={(id) => onChange(value.map((on, i) => (String(i) === id ? !on : on)))}
      disabled={disabled}
    />
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
