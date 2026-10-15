import { BookMarked, Quote } from "lucide-react";

type KeyTermValue = { term?: string; definition?: string; example?: string; alsoKnownAs?: string[] };

/** A glossary entry: the term, its definition, and an optional worked example. */
export function KeyTermBlock({ value }: { value: KeyTermValue }) {
  return (
    <dl className="my-9 rounded-xl border border-border bg-secondary/60 p-5">
      <p className="mb-3 inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        <BookMarked className="size-3.5" /> Key term
      </p>
      <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <dfn className="text-2xl font-semibold not-italic tracking-tight text-foreground">{value.term}</dfn>
        {value.alsoKnownAs?.map((alias) => (
          <span key={alias} className="rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
            {alias}
          </span>
        ))}
      </dt>
      <dd className="mt-2 text-[1.0625rem] leading-8 text-foreground/80">{value.definition}</dd>
      {value.example && (
        <dd className="mt-3 flex gap-2 rounded-lg bg-background px-4 py-3 text-sm italic leading-relaxed text-muted-foreground">
          <Quote className="mt-0.5 size-4 shrink-0 text-accent" />
          {value.example}
        </dd>
      )}
    </dl>
  );
}
