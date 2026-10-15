import { Briefcase, Target } from "lucide-react";
import { Prose } from "./prose";
import type { PortableTextValue } from "./types";

type ScenarioValue = { title?: string; badge?: string; body?: PortableTextValue; questionOrChallenge?: string };

/** A short case study: a situation, then a challenge for the learner to think through. */
export function ScenarioBlock({ value }: { value: ScenarioValue }) {
  return (
    <section className="my-10 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary/80 to-background">
      <header className="flex items-center gap-3 border-b border-border bg-secondary px-6 py-3">
        <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground">
          <Briefcase className="size-4" />
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {value.badge || "Case study"}
        </span>
      </header>

      <div className="px-6 py-6">
        {value.title && <h4 className="mb-4 text-xl font-semibold tracking-tight text-foreground">{value.title}</h4>}
        {value.body && <Prose value={value.body} />}

        {value.questionOrChallenge && (
          <div className="mt-6 flex gap-3 rounded-xl border-2 border-dashed border-accent/40 bg-accent/5 p-4">
            <Target className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-accent">Your challenge</p>
              <p className="leading-relaxed text-foreground">{value.questionOrChallenge}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
