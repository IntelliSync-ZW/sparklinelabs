import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SearchCheck } from "lucide-react";
import { findCertificate } from "@/lib/learning/certificates";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verify a certificate | Sparkline Labs AI Training",
  description: "Check that a Sparkline Labs AI Training certificate is genuine by entering its certificate number.",
  alternates: { canonical: "https://www.sparklinelabs.co.zw/ai-training/certificates" },
};

/** Anyone (an employer, say) can check a certificate number here. */
export default async function VerifyCertificatePage({ searchParams }: { searchParams: Promise<{ number?: string }> }) {
  const { number } = await searchParams;
  const query = number?.trim() ?? "";

  let notFoundMessage = false;
  if (query) {
    const cert = await findCertificate(query);
    if (cert) redirect(`/ai-training/certificates/${cert.number}`);
    notFoundMessage = true;
  }

  return (
    <section className="px-6 pt-32 pb-24 md:pt-40">
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto mb-6 grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent">
          <SearchCheck className="size-7" />
        </span>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">Verify a certificate</h1>
        <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
          Enter the certificate number printed at the bottom left of a Sparkline Labs certificate.
        </p>

        <form method="get" className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="number" className="sr-only">
            Certificate number
          </label>
          <input
            id="number"
            name="number"
            defaultValue={query}
            placeholder="SL-XXXX-XXXX-XXXX"
            autoComplete="off"
            spellCheck={false}
            required
            className="flex-1 rounded-lg border border-border bg-background px-4 py-3 font-mono text-base uppercase tracking-wider"
          />
          <button type="submit" className="rounded-lg bg-accent px-6 py-3 text-base font-semibold text-accent-foreground hover:bg-accent/90">
            Verify
          </button>
        </form>

        {notFoundMessage && (
          <p role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">
            We couldn&apos;t find a certificate with the number <span className="font-mono font-semibold">{query}</span>. Check it
            against the certificate and try again.
          </p>
        )}
      </div>
    </section>
  );
}
