"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Award } from "lucide-react";
import { claimCertificateAction } from "@/lib/learning/actions";

/** The learner confirms the name to print, then the server issues the certificate. */
export function ClaimCertificate({ courseId, defaultName }: { courseId: string; defaultName: string }) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function claim(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await claimCertificateAction({ courseId, recipientName: name });
      if (result.ok) router.push(`/ai-training/certificates/${result.number}`);
      else setError(result.message);
    });
  }

  return (
    <form onSubmit={claim} className="mx-auto max-w-md text-left">
      <label htmlFor="certificate-name" className="mb-1.5 block text-sm font-semibold">
        Name on your certificate
      </label>
      <input
        id="certificate-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        maxLength={80}
        autoComplete="name"
        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-base"
      />
      <p className="mt-1.5 text-xs text-muted-foreground">Check the spelling: the name can&apos;t be changed after the certificate is issued.</p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending || name.trim().length < 2}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        <Award className="size-5" /> {pending ? "Issuing…" : "Claim my certificate"}
      </button>
    </form>
  );
}
