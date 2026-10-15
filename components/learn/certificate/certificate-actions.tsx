"use client";

import { useState } from "react";
import { Check, Link2, Printer } from "lucide-react";

/** Save as PDF via the browser's print dialog, and copy the verification link. */
export function CertificateActions({ verifyUrl }: { verifyUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; the link is shown on the certificate itself.
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
      >
        <Printer className="size-4" /> Download PDF / print
      </button>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
      >
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        <span aria-live="polite">{copied ? "Link copied" : "Copy verification link"}</span>
      </button>
    </div>
  );
}
