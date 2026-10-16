import { Check } from "lucide-react";

export function formatCertificateDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Harare" }).format(
    new Date(iso)
  );
}

/** Shown on every certificate: it records learning, it is not an accreditation. */
export const CERTIFICATE_DISCLAIMER =
  "This Certificate of Completion confirms that the learner completed the course and passed its required assessments. It is a record of learning, not an academic qualification, professional accreditation or regulated certification. Sparkline Labs is not an accreditation body.";

// The certificate is always printed on paper-white, whatever theme the site is in.
const palette = {
  "--c-paper": "#fcfbf8",
  "--c-ink": "#16202e",
  "--c-muted": "#5b6574",
  "--c-accent": "oklch(0.32 0.05 255)",
  "--c-rule": "#d9d5cc",
} as React.CSSProperties;

function Corner({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute size-[3.2cqw] border-[var(--c-accent)] ${className}`} />;
}

/**
 * The certificate itself, at A4 landscape proportions. Every size is in `cqw`
 * (a percentage of the sheet's width), so it looks identical on a phone, on a
 * desktop and printed as a one-page PDF.
 */
export function CertificateDocument({
  recipientName,
  courseTitle,
  completionDate,
  number,
  verifyUrl,
}: {
  recipientName: string;
  courseTitle: string;
  completionDate: string;
  number: string;
  verifyUrl: string;
}) {
  const verifyHost = verifyUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/[^/]+$/, "");

  return (
    <article
      style={{ ...palette, containerType: "inline-size" }}
      className="certificate-sheet relative mx-auto aspect-[297/210] w-full min-w-[640px] max-w-5xl overflow-hidden bg-[var(--c-paper)] text-[var(--c-ink)] shadow-xl print:max-w-none print:shadow-none"
      aria-label={`Certificate of Completion for ${recipientName}`}
    >
      {/* Frame: a heavy outer rule, a fine inner rule and four corner brackets. */}
      <div aria-hidden="true" className="absolute inset-[2.2cqw] border-[0.35cqw] border-[var(--c-accent)]" />
      <div aria-hidden="true" className="absolute inset-[3.2cqw] border-[0.1cqw] border-[var(--c-accent)]/60" />
      <Corner className="left-[4.2cqw] top-[4.2cqw] border-l-[0.2cqw] border-t-[0.2cqw]" />
      <Corner className="right-[4.2cqw] top-[4.2cqw] border-r-[0.2cqw] border-t-[0.2cqw]" />
      <Corner className="bottom-[4.2cqw] left-[4.2cqw] border-b-[0.2cqw] border-l-[0.2cqw]" />
      <Corner className="bottom-[4.2cqw] right-[4.2cqw] border-b-[0.2cqw] border-r-[0.2cqw]" />

      <div className="relative flex h-full flex-col items-center px-[9cqw] py-[6.2cqw] text-center">
        {/* Issuer */}
        <header className="flex flex-col items-center gap-[0.5cqw]">
          <p className="text-[1.5cqw] font-bold uppercase tracking-[0.42em] text-[var(--c-accent)]">Sparkline Labs</p>
          <p className="text-[1.05cqw] uppercase tracking-[0.3em] text-[var(--c-muted)]">AI Training</p>
        </header>

        {/* Title: the one thing the reader must not misread */}
        <div className="mt-[2.6cqw] flex flex-col items-center">
          <h1 className="text-[5.4cqw] font-light uppercase leading-none tracking-[0.1em]">Certificate</h1>
          <div className="mt-[1cqw] flex items-center gap-[1.4cqw]">
            <span aria-hidden="true" className="h-px w-[7cqw] bg-[var(--c-accent)]/50" />
            <p className="text-[1.9cqw] font-semibold uppercase tracking-[0.34em] text-[var(--c-accent)]">of Completion</p>
            <span aria-hidden="true" className="h-px w-[7cqw] bg-[var(--c-accent)]/50" />
          </div>
        </div>

        {/* Recipient and course */}
        <div className="mt-[3cqw] flex w-full flex-col items-center">
          <p className="text-[1.25cqw] text-[var(--c-muted)]">This is to certify that</p>
          <p className="mt-[0.8cqw] w-full border-b border-[var(--c-rule)] pb-[1cqw] text-[4.4cqw] font-semibold leading-tight tracking-tight text-balance">
            {recipientName}
          </p>
          <p className="mt-[1.4cqw] text-[1.25cqw] text-[var(--c-muted)]">has completed the online course</p>
          <p className="mt-[0.6cqw] text-[2.5cqw] font-semibold leading-snug text-[var(--c-accent)] text-balance">{courseTitle}</p>
          <p className="mt-[0.9cqw] text-[1.15cqw] text-[var(--c-muted)]">
            and passed every required assessment on {formatCertificateDate(completionDate)}.
          </p>
        </div>

        {/* Seal, number and verification */}
        <footer className="mt-auto grid w-full grid-cols-[1fr_auto_1fr] items-end gap-[2cqw]">
          <div className="text-left">
            <p className="text-[0.95cqw] uppercase tracking-[0.18em] text-[var(--c-muted)]">Certificate no.</p>
            <p className="mt-[0.2cqw] font-mono text-[1.35cqw] font-semibold tracking-wider">{number}</p>
          </div>

          <div className="flex flex-col items-center gap-[0.5cqw]">
            <span className="grid size-[7.6cqw] place-items-center rounded-full border-[0.25cqw] border-[var(--c-accent)] p-[0.5cqw]">
              <span className="grid size-full place-items-center rounded-full bg-[var(--c-accent)] text-[var(--c-paper)]">
                <Check className="size-[45%]" strokeWidth={2.5} />
              </span>
            </span>
            <span className="text-[0.85cqw] font-semibold uppercase tracking-[0.3em] text-[var(--c-accent)]">Completed</span>
          </div>

          <div className="text-right">
            <p className="text-[0.95cqw] uppercase tracking-[0.18em] text-[var(--c-muted)]">Verify this certificate</p>
            <p className="mt-[0.2cqw] text-[1.15cqw] font-medium">{verifyHost}</p>
            <p className="text-[0.95cqw] text-[var(--c-muted)]">Enter the certificate number</p>
          </div>
        </footer>

        <p className="mt-[2cqw] max-w-[78cqw] border-t border-[var(--c-rule)] pt-[1cqw] text-[0.88cqw] leading-relaxed text-[var(--c-muted)]">
          {CERTIFICATE_DISCLAIMER}
        </p>
      </div>
    </article>
  );
}
