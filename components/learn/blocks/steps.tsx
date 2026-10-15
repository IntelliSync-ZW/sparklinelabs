type StepsValue = { title?: string; steps?: { _key?: string; title?: string; body?: string }[] };

/** A procedure as a numbered timeline. */
export function StepsBlock({ value }: { value: StepsValue }) {
  const steps = value.steps ?? [];
  if (steps.length === 0) return null;
  return (
    <section className="my-10 rounded-2xl border border-border bg-card px-6 py-6">
      {value.title && <h4 className="mb-5 text-lg font-semibold text-foreground">{value.title}</h4>}
      <ol className="relative space-y-6">
        {steps.map((step, i) => (
          <li key={step._key ?? i} className="relative flex gap-4">
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="absolute left-4 top-9 -bottom-6 w-0.5 -translate-x-1/2 bg-border" />
            )}
            <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
              {i + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="font-semibold leading-snug text-foreground">{step.title}</p>
              {step.body && <p className="mt-1 leading-relaxed text-muted-foreground">{step.body}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
