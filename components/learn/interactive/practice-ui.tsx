import { Fragment } from "react";
import { AlertCircle, Check, CheckCircle2, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Shared look for practice blocks: quick checks, tasks, knowledge checks and the
// end-of-lesson assessment. Hairline-ruled regions instead of cards, native form
// controls, grouped option lists, small radii and no shadows.
// ---------------------------------------------------------------------------

/**
 * The region a practice block sits in: a hairline above and below, no card.
 * Give the element `data-practice` so back-to-back blocks share a single rule.
 * The dark color-scheme makes native radios, checkboxes and selects dark too.
 */
export const practiceFrame =
  "my-12 border-y border-border py-6 dark:[color-scheme:dark] [&:has(+[data-practice])]:mb-0 [[data-practice]+&]:mt-0 [[data-practice]+&]:border-t-0";

export const buttonPrimary =
  "inline-flex h-9 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40";
export const buttonSecondary =
  "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40";
export const buttonQuiet =
  "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

/** Native text inputs and selects. */
export const fieldClass =
  "w-full rounded-md border border-border bg-background px-3 text-[0.9375rem] text-foreground placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60";

export type Status = "correct" | "wrong" | undefined;

/** Background tint for a row once it has been marked. */
export const statusTint = (status: Status) =>
  status === "correct" ? "bg-emerald-500/[0.06]" : status === "wrong" ? "bg-red-500/[0.06]" : "";

/** "Practice · Classify" on the left, meta on the right, then the title. */
export function PracticeHeader({
  icon: Icon,
  label,
  meta = [],
  title,
  subtitle,
  as: Tag = "h4",
}: {
  icon: React.ElementType;
  label: string;
  meta?: React.ReactNode[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  as?: "h2" | "h3" | "h4";
}) {
  const items = meta.filter((item) => item !== null && item !== undefined && item !== false && item !== "");
  return (
    <header className="mb-5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Icon className="size-3.5" aria-hidden="true" /> {label}
        </p>
        {items.length > 0 && (
          <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
            {items.map((item, i) => (
              <Fragment key={i}>
                {i > 0 && <span aria-hidden="true">·</span>}
                {item}
              </Fragment>
            ))}
          </p>
        )}
      </div>
      {title && (
        <Tag className={`mt-2 font-semibold leading-snug tracking-tight text-foreground ${Tag === "h2" ? "text-2xl" : "text-lg"}`}>
          {title}
        </Tag>
      )}
      {subtitle && <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted-foreground">{subtitle}</p>}
    </header>
  );
}

/** A small check or cross at the end of a marked row. */
export function StatusMark({ status }: { status: Status }) {
  if (!status) return null;
  const Icon = status === "correct" ? Check : X;
  return (
    <span role="img" aria-label={status === "correct" ? "Correct" : "Wrong"} className="mt-0.5 shrink-0">
      <Icon
        aria-hidden="true"
        strokeWidth={2.5}
        className={`size-4 ${status === "correct" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
      />
    </span>
  );
}

/**
 * Options as one grouped list with native radios or checkboxes, the way a
 * settings screen lays them out. Rows can show a mark and a note once checked.
 */
export function ChoiceList({
  name,
  multiple,
  options,
  selected,
  onToggle,
  disabled,
  statusOf,
  noteOf,
  label,
  className = "",
}: {
  name: string;
  multiple: boolean;
  options: { id: string; label: React.ReactNode; detail?: React.ReactNode }[];
  selected: readonly string[];
  /** Radios: the option chosen. Checkboxes: the option flipped. */
  onToggle: (id: string) => void;
  disabled?: boolean;
  statusOf?: (id: string) => Status;
  noteOf?: (id: string) => React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div
      role={multiple ? "group" : "radiogroup"}
      aria-label={label}
      className={`divide-y divide-border overflow-hidden rounded-md border border-border bg-background ${className}`}
    >
      {options.map((option) => {
        const status = statusOf?.(option.id);
        const note = noteOf?.(option.id);
        return (
          <label
            key={option.id}
            className={`flex gap-3 px-3.5 py-2.5 transition-colors ${statusTint(status)} ${
              disabled ? "cursor-default" : "cursor-pointer hover:bg-secondary/60"
            }`}
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              checked={selected.includes(option.id)}
              disabled={disabled}
              onChange={() => onToggle(option.id)}
              className="mt-[0.2rem] size-4 shrink-0 accent-[var(--accent)]"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[0.9375rem] leading-snug text-foreground">{option.label}</span>
              {option.detail && <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{option.detail}</span>}
              {note && <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{note}</span>}
            </span>
            <StatusMark status={status} />
          </label>
        );
      })}
    </div>
  );
}

/** A one-line outcome: an icon and plain text, no box. */
export function ResultNote({ tone, children }: { tone: "success" | "warning" | "error"; children: React.ReactNode }) {
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;
  const color =
    tone === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "warning"
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";
  return (
    <p className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
      <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/** Explanatory text set off by a thin rule, e.g. feedback after answering. */
export function Aside({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "hint" }) {
  return (
    <div
      className={`border-l-2 pl-3 text-sm leading-relaxed text-muted-foreground ${
        tone === "hint" ? "border-amber-500/60" : "border-border"
      }`}
    >
      {children}
    </div>
  );
}
