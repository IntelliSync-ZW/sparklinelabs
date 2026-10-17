"use client";

import { StatusMark } from "./practice-ui";
import { moveItem, ReorderCell } from "./reorder";

export type MatchingState = { keys: string[]; options: string[] };

/** Start with both columns in the order the server shuffled them. */
export function initialMatching(keys?: { _key: string }[] | null, options?: string[] | null): MatchingState {
  return { keys: (keys ?? []).map((k) => k._key), options: [...(options ?? [])] };
}

/** The rows as the learner has aligned them: row i pairs keys[i] with options[i]. */
export function matchingRows(state: MatchingState): { keyId: string; option: string }[] {
  return state.keys.map((keyId, i) => ({ keyId, option: state.options[i] }));
}

/**
 * Two columns, reordered independently, until every row lines up. Row i is the
 * pair (key i, option i); a row turns green or red once it has been checked.
 */
export function MatchingBoard({
  keyLabels,
  columns,
  state,
  onChange,
  rowStatus,
  disabled,
}: {
  /** Key text by id. */
  keyLabels: Record<string, string>;
  columns?: { keyLabel?: string; optionLabel?: string } | null;
  state: MatchingState;
  onChange: (next: MatchingState) => void;
  rowStatus?: (keyId: string) => "correct" | "wrong" | undefined;
  disabled?: boolean;
}) {
  const count = state.keys.length;
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Reorder <strong className="font-medium text-foreground">both</strong> columns (drag an item, or use its arrows)
        until each row pairs the right key with its option.
      </p>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-2 gap-y-2 sm:gap-x-4">
        <p className="px-2 text-xs font-medium text-muted-foreground">{columns?.keyLabel || "Term"}</p>
        <p className="px-2 text-xs font-medium text-muted-foreground">{columns?.optionLabel || "Meaning"}</p>

        {state.keys.map((keyId, i) => {
          const status = rowStatus?.(keyId);
          const option = state.options[i];
          return (
            <div key={keyId} className="contents">
              <ReorderCell
                column="keys"
                index={i}
                count={count}
                label={keyLabels[keyId] ?? keyId}
                status={status}
                disabled={disabled}
                onMove={(from, to) => onChange({ ...state, keys: moveItem(state.keys, from, to) })}
              >
                <span className="flex items-start gap-2">
                  <span className="min-w-0 flex-1">{keyLabels[keyId]}</span>
                  <StatusMark status={status} />
                </span>
              </ReorderCell>
              <ReorderCell
                column="options"
                index={i}
                count={count}
                label={option}
                status={status}
                disabled={disabled}
                onMove={(from, to) => onChange({ ...state, options: moveItem(state.options, from, to) })}
              >
                {option}
              </ReorderCell>
            </div>
          );
        })}
      </div>
    </div>
  );
}
