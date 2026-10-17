import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ENGAGEMENTS } from "@/lib/pricing";

export function PricingSnapshot() {
  return (
    <section id="pricing" className="py-20 md:py-32 px-6 bg-secondary scroll-mt-20">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              Pricing
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
              Starting prices, before we scope the problem.
            </h2>
            <p className="mt-4 text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Most prices are once off and start from a minimum. The final
              price depends on system complexity, documentation and what the
              business actually needs.
            </p>
          </div>
          <Link
            href="/pricing"
            className="hidden md:inline-flex shrink-0 items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
          >
            See full pricing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ol className="divide-y divide-border border-y border-border">
          {ENGAGEMENTS.map((e) => (
            <li key={e.id}>
              <Link
                href={`/pricing#${e.id}`}
                className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-1 py-6"
              >
                <span className="text-base font-mono text-muted-foreground">
                  {e.number}
                </span>
                <span className="text-xl md:text-2xl font-medium text-foreground group-hover:text-accent transition-colors">
                  {e.title}
                </span>
                <span className="col-start-2 sm:col-start-auto text-xl md:text-2xl font-semibold tracking-tight text-foreground tabular-nums whitespace-nowrap">
                  {e.startingPrice}
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-8 md:hidden">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
          >
            See full pricing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
