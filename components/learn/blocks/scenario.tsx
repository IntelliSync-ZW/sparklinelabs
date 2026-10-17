import { Briefcase } from "lucide-react";
import { Prose } from "./prose";
import type { PortableTextValue } from "./types";

type ScenarioValue = { title?: string; badge?: string; body?: PortableTextValue; questionOrChallenge?: string };

/** A short case study: a situation, then a challenge for the learner to think through. */
export function ScenarioBlock({ value }: { value: ScenarioValue }) {
  return (
    <aside aria-label={value.title || value.badge || "Case study"} className="my-10 border-l-2 border-accent/50 pl-5">
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Briefcase className="size-3.5" aria-hidden="true" /> {value.badge || "Case study"}
      </p>
      {value.title && <h4 className="mt-2 mb-3 text-lg font-semibold leading-snug tracking-tight text-foreground">{value.title}</h4>}
      {value.body && (
        <div className={value.title ? "" : "mt-3"}>
          <Prose value={value.body} />
        </div>
      )}

      {value.questionOrChallenge && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">Your challenge</p>
          <p className="text-[1.0625rem] font-medium leading-relaxed text-foreground">{value.questionOrChallenge}</p>
        </div>
      )}
    </aside>
  );
}
