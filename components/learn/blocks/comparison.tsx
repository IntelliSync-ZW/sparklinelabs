import { Check, X } from "lucide-react";

type Side = { label?: string; body?: string; note?: string };
type ComparisonValue = { title?: string; format?: "prompt" | "text"; weak?: Side; strong?: Side; takeaway?: string };

function Panel({ side, tone, format }: { side?: Side; tone: "weak" | "strong"; format: "prompt" | "text" }) {
  if (!side?.body) return null;
  const weak = tone === "weak";
  const Icon = weak ? X : Check;
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border ${
        weak ? "border-red-500/30 bg-red-500/5" : "border-emerald-500/40 bg-emerald-500/5"
      }`}
    >
      <div
        className={`flex items-center gap-2 px-4 py-2 text-sm font-bold ${
          weak ? "bg-red-500/10 text-red-700 dark:text-red-300" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        }`}
      >
        <span className={`grid size-5 place-items-center rounded-full text-white ${weak ? "bg-red-500" : "bg-emerald-500"}`}>
          <Icon className="size-3" strokeWidth={3} />
        </span>
        {side.label || (weak ? "Weak" : "Strong")}
      </div>
      <div className="flex-1 px-4 py-3">
        {format === "prompt" ? (
          <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-foreground">{side.body}</pre>
        ) : (
          <p className="leading-relaxed text-foreground">{side.body}</p>
        )}
      </div>
      {side.note && (
        <p className="border-t border-border/60 px-4 py-2.5 text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">{weak ? "Why it falls short: " : "Why it works: "}</span>
          {side.note}
        </p>
      )}
    </div>
  );
}

/** Weak vs strong, side by side — red and green panels with a different icon each. */
export function ComparisonBlock({ value }: { value: ComparisonValue }) {
  const format = value.format ?? "prompt";
  return (
    <section className="my-10">
      {value.title && <h4 className="mb-3 text-lg font-semibold text-foreground">{value.title}</h4>}
      <div className="grid gap-4 md:grid-cols-2">
        <Panel side={value.weak} tone="weak" format={format} />
        <Panel side={value.strong} tone="strong" format={format} />
      </div>
      {value.takeaway && (
        <p className="mt-4 rounded-lg bg-secondary px-4 py-3 text-sm font-medium text-foreground">
          <span className="text-accent">Takeaway · </span>
          {value.takeaway}
        </p>
      )}
    </section>
  );
}
