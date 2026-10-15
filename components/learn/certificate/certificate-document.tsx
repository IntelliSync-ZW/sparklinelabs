import { Award } from "lucide-react";

export function formatCertificateDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Harare" }).format(
    new Date(iso)
  );
}

/**
 * The certificate itself, at A4 landscape proportions. Built from the site
 * tokens (background, foreground, accent, border, DM Sans) so it matches the
 * rest of Sparkline Labs; it prints edge to edge as one page.
 */
export function CertificateDocument({
  certificateTitle,
  recipientName,
  courseTitle,
  completionDate,
  number,
  verifyUrl,
}: {
  certificateTitle: string;
  recipientName: string;
  courseTitle: string;
  completionDate: string;
  number: string;
  verifyUrl: string;
}) {
  return (
    <article
      className="certificate-sheet relative mx-auto aspect-[297/210] w-full max-w-5xl overflow-hidden bg-background text-foreground shadow-xl print:max-w-none print:shadow-none"
      aria-label={`${certificateTitle} for ${recipientName}`}
    >
      {/* Frame: a thin accent rule inset from the edge. */}
      <div aria-hidden="true" className="absolute inset-[3%] rounded-[0.625rem] border border-accent/70" />
      <div aria-hidden="true" className="absolute inset-x-[3%] top-[3%] h-[1.2%] rounded-t-[0.625rem] bg-accent" />

      <div className="relative flex h-full flex-col items-center justify-between px-[9%] py-[8%] text-center">
        <header className="flex flex-col items-center gap-[0.4em] text-[clamp(0.55rem,1.4vw,0.9rem)]">
          <p className="font-semibold tracking-[0.3em] text-accent uppercase">Sparkline Labs</p>
          <p className="text-muted-foreground tracking-[0.2em] uppercase">{certificateTitle}</p>
        </header>

        <div className="flex flex-col items-center gap-[0.6em]">
          <p className="text-[clamp(0.6rem,1.5vw,1rem)] text-muted-foreground">This certifies that</p>
          <p className="text-[clamp(1.4rem,4.6vw,3.25rem)] font-semibold leading-tight tracking-tight text-balance">
            {recipientName}
          </p>
          <div aria-hidden="true" className="my-[0.3em] h-px w-[min(60%,22rem)] bg-border" />
          <p className="text-[clamp(0.6rem,1.5vw,1rem)] text-muted-foreground">has successfully completed</p>
          <p className="text-[clamp(0.9rem,2.6vw,1.75rem)] font-semibold text-accent text-balance">{courseTitle}</p>
          <p className="text-[clamp(0.55rem,1.3vw,0.9rem)] text-muted-foreground">
            and passed every required assessment, completing it on {formatCertificateDate(completionDate)}.
          </p>
        </div>

        <footer className="grid w-full grid-cols-[1fr_auto_1fr] items-end gap-4 text-[clamp(0.5rem,1.1vw,0.75rem)]">
          <div className="text-left">
            <p className="text-muted-foreground uppercase tracking-wider">Certificate no.</p>
            <p className="font-mono font-semibold tracking-wider">{number}</p>
          </div>
          <span className="grid size-[clamp(2.5rem,7vw,4.5rem)] place-items-center rounded-full border-2 border-accent text-accent">
            <Award className="size-1/2" strokeWidth={1.5} />
          </span>
          <div className="text-right">
            <p className="text-muted-foreground uppercase tracking-wider">Verify with the number at</p>
            {/* The number is printed bottom left, so the address stays short enough not to wrap. */}
            <p className="font-medium">{verifyUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/[^/]+$/, "")}</p>
          </div>
        </footer>
      </div>
    </article>
  );
}
