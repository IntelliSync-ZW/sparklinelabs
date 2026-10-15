import Link from "next/link";
import { ArrowLeft, BookOpen, SearchX } from "lucide-react";
import { TriedCertificateNumber } from "@/components/not-found/tried-certificate-number";

/**
 * Shown when a certificate number isn't in the register: an empty certificate
 * with a "no record" stamp, the likely causes, and a way to check again.
 */
export default function CertificateNotFound() {
  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4 sm:px-6">
          <Link href="/ai-training" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Sparkline Labs AI Training
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_1fr]">
        {/* A void certificate: the frame is there, the record isn't. */}
        <div aria-hidden="true" className="relative mx-auto aspect-[297/210] w-full max-w-lg overflow-hidden rounded-sm bg-background shadow-lg">
          <div className="absolute inset-[4%] rounded-[0.625rem] border border-dashed border-muted-foreground/40" />
          <div className="absolute inset-x-[4%] top-[4%] h-[1.4%] rounded-t-[0.625rem] bg-muted-foreground/25" />
          <div className="relative flex h-full flex-col items-center justify-center gap-[5%] px-[12%] text-center">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground/60 sm:text-xs">Sparkline Labs</p>
            <p className="text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground/50 sm:text-[0.65rem]">Certificate of Completion</p>
            <div className="h-[9%] w-3/4 border-b-2 border-dashed border-muted-foreground/30" />
            <div className="h-[5%] w-1/2 rounded-full bg-muted-foreground/15" />
            <div className="h-[4%] w-2/3 rounded-full bg-muted-foreground/10" />
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <span className="-rotate-12 rounded-lg border-4 border-red-500/80 px-5 py-2 text-center font-mono text-lg font-bold uppercase tracking-[0.2em] text-red-500/90 sm:text-2xl">
              No record
              <br />
              found
            </span>
          </div>
        </div>

        <div>
          <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent">
            <SearchX className="size-6" />
          </span>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            We can&apos;t find that certificate.
          </h1>
          <p className="mb-3 text-lg leading-relaxed text-muted-foreground">
            No certificate in the Sparkline Labs register carries this number.
          </p>
          <TriedCertificateNumber />

          <ul className="my-6 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-accent">1.</span>
              <span>
                Check for a typing slip. Numbers look like <span className="font-mono text-foreground">SL-7K4Q-9XWD-2M3P</span> and never
                use 0, O, 1, I or L.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent">2.</span>
              <span>If you followed a link, it may have been cut short. Copy the number from the certificate itself.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent">3.</span>
              <span>If this is your own certificate, claim it from the course page once you&apos;ve finished the course.</span>
            </li>
          </ul>

          <form action="/ai-training/certificates" method="get" className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="number" className="sr-only">
              Certificate number
            </label>
            <input
              id="number"
              name="number"
              placeholder="SL-XXXX-XXXX-XXXX"
              autoComplete="off"
              spellCheck={false}
              required
              className="flex-1 rounded-lg border border-border bg-background px-4 py-3 font-mono text-base uppercase tracking-wider"
            />
            <button type="submit" className="rounded-lg bg-accent px-6 py-3 text-base font-semibold text-accent-foreground hover:bg-accent/90">
              Check again
            </button>
          </form>

          <Link
            href="/ai-training"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <BookOpen className="size-4" /> About Sparkline Labs AI Training
          </Link>
        </div>
      </main>
    </div>
  );
}
