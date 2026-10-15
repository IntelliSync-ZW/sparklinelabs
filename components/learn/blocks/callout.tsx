import { AlertTriangle, BookOpen, Lightbulb, MapPin, Sparkles } from "lucide-react";
import { Prose } from "./prose";
import type { PortableTextValue } from "./types";

type CalloutValue = { type?: string; title?: string; body?: PortableTextValue };

function Body({ body }: { body?: PortableTextValue }) {
  if (!body || (Array.isArray(body) && body.length === 0)) return null;
  return (
    <div className="text-[0.97rem] [&_li]:text-[0.97rem] [&_li]:leading-7 [&_p]:text-[0.97rem] [&_p]:leading-7">
      <Prose value={body} />
    </div>
  );
}

/**
 * Five callout types, each with its own silhouette so a learner can tell them
 * apart at a glance, not just by colour.
 */
export function Callout({ value }: { value: CalloutValue }) {
  switch (value.type) {
    // Tip — soft green card with a floating bulb badge.
    case "tip":
      return (
        <aside className="relative my-9 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 pb-5 pt-7">
          <span className="absolute -top-4 left-5 grid size-9 place-items-center rounded-full bg-emerald-500 text-white shadow-md">
            <Lightbulb className="size-5" />
          </span>
          <p className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">{value.title || "Pro tip"}</p>
          <Body body={value.body} />
        </aside>
      );

    // Warning — amber, hazard-stripe edge.
    case "warning":
      return (
        <aside className="my-9 overflow-hidden rounded-xl border border-amber-500/40 bg-amber-500/10">
          <div
            aria-hidden="true"
            className="h-2"
            style={{ backgroundImage: "repeating-linear-gradient(45deg,#f59e0b 0 10px,#18181b 10px 20px)" }}
          />
          <div className="flex gap-4 px-5 py-4">
            <AlertTriangle className="mt-0.5 size-6 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="min-w-0">
              <p className="mb-1 text-sm font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                {value.title || "Watch out"}
              </p>
              <Body body={value.body} />
            </div>
          </div>
        </aside>
      );

    // Example — a card with a folder tab.
    case "example":
      return (
        <aside className="relative my-10">
          <span className="absolute -top-3 left-4 inline-flex items-center gap-1.5 rounded-t-lg border border-b-0 border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="size-3.5" /> Example
          </span>
          <div className="rounded-xl rounded-tl-none border border-border bg-card px-6 py-5 shadow-sm">
            {value.title && <p className="mb-2 font-semibold text-foreground">{value.title}</p>}
            <Body body={value.body} />
          </div>
        </aside>
      );

    // Zimbabwe context — flag-colour stripe.
    case "zimbabwe":
      return (
        <aside className="my-9 flex overflow-hidden rounded-xl border border-border bg-card">
          <div
            aria-hidden="true"
            className="w-2 shrink-0"
            style={{ backgroundImage: "linear-gradient(to bottom,#319208 0 25%,#ffd200 25% 50%,#de2010 50% 75%,#18181b 75% 100%)" }}
          />
          <div className="min-w-0 px-5 py-4">
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="size-4 text-[#319208]" /> {value.title || "Zimbabwe context"}
            </p>
            <Body body={value.body} />
          </div>
        </aside>
      );

    // Important — accent rule with a solid chip.
    default:
      return (
        <aside className="my-9 rounded-r-xl border-l-4 border-accent bg-accent/10 py-4 pl-5 pr-5">
          <p className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-accent">
            <Sparkles className="size-4" /> {value.title || "Important"}
          </p>
          <Body body={value.body} />
        </aside>
      );
  }
}
