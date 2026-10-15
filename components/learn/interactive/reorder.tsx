"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";

/** Move the item at `from` to position `to`, shifting the others. */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return [...list];
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export type CellStatus = "correct" | "wrong" | undefined;

const statusClass: Record<string, string> = {
  correct: "border-emerald-500 bg-emerald-500/10",
  wrong: "border-red-500 bg-red-500/10",
  none: "border-border bg-background",
};

/**
 * One draggable cell in a reorderable column. Drag it onto another cell in the
 * same column to move it there, or use the arrow buttons - which also work with
 * a keyboard or a touch screen, where HTML5 drag and drop does not.
 */
export function ReorderCell({
  column,
  index,
  count,
  label,
  status,
  disabled,
  onMove,
  children,
}: {
  /** Cells only accept drops from the same column. */
  column: string;
  index: number;
  count: number;
  /** Used in the buttons' accessible names, e.g. the item's text. */
  label: string;
  status?: CellStatus;
  disabled?: boolean;
  onMove: (from: number, to: number) => void;
  children: React.ReactNode;
}) {
  const [over, setOver] = useState(false);

  return (
    <div
      draggable={!disabled}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", JSON.stringify({ column, index }));
      }}
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (disabled) return;
        try {
          const from = JSON.parse(e.dataTransfer.getData("text/plain")) as { column: string; index: number };
          if (from.column === column) onMove(from.index, index);
        } catch {
          // Not one of ours (e.g. a file dragged in) - ignore.
        }
      }}
      className={`flex h-full min-w-0 items-stretch gap-1 rounded-lg border p-1.5 transition-colors ${
        statusClass[status ?? "none"]
      } ${over ? "ring-2 ring-accent" : ""} ${disabled ? "" : "cursor-grab active:cursor-grabbing"}`}
    >
      <GripVertical aria-hidden="true" className="my-auto size-4 shrink-0 text-muted-foreground/60" />
      <div className="min-w-0 flex-1 self-center px-1 text-sm leading-snug text-foreground break-words">{children}</div>
      {!disabled && (
        <div className="flex shrink-0 flex-col justify-center">
          <button
            type="button"
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0}
            aria-label={`Move “${label}” up`}
            className="rounded p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-25"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, index + 1)}
            disabled={index === count - 1}
            aria-label={`Move “${label}” down`}
            className="rounded p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-25"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/** A single reorderable list - used by the ordering task. */
export function ReorderList({
  items,
  onChange,
  statusAt,
  disabled,
}: {
  items: { id: string | number; text: string }[];
  onChange: (next: { id: string | number; text: string }[]) => void;
  statusAt?: (index: number) => CellStatus;
  disabled?: boolean;
}) {
  return (
    <ol className="space-y-2">
      {items.map((item, i) => (
        <li key={item.id} className="flex items-stretch gap-3">
          <span className="grid w-7 shrink-0 place-items-center text-sm font-semibold text-muted-foreground">{i + 1}</span>
          <div className="min-w-0 flex-1">
            <ReorderCell
              column="list"
              index={i}
              count={items.length}
              label={item.text}
              status={statusAt?.(i)}
              disabled={disabled}
              onMove={(from, to) => onChange(moveItem(items, from, to))}
            >
              {item.text}
            </ReorderCell>
          </div>
        </li>
      ))}
    </ol>
  );
}
