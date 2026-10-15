import { Download, ExternalLink, FileText, Newspaper, PlayCircle, FileDown } from "lucide-react";

type ResourceValue = {
  note?: string;
  resource?: {
    title?: string;
    resourceType?: string | null;
    description?: string | null;
    url?: string | null;
    fileUrl?: string | null;
  } | null;
};

const icons = { pdf: FileText, template: FileDown, video: PlayCircle, article: Newspaper, external: ExternalLink } as const;

/** A download or link card pointing at a course resource. */
export function ResourceBlock({ value }: { value: ResourceValue }) {
  const r = value.resource;
  if (!r) return null;
  const href = r.fileUrl ?? r.url;
  const Icon = icons[(r.resourceType as keyof typeof icons) ?? "external"] ?? ExternalLink;
  const isDownload = Boolean(r.fileUrl) || r.resourceType === "pdf" || r.resourceType === "template";

  const body = (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
        <Icon className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {r.resourceType ?? "Resource"}
        </span>
        <span className="block font-semibold leading-snug text-foreground">{r.title}</span>
        {(value.note || r.description) && (
          <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">{value.note || r.description}</span>
        )}
      </span>
      {href && (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground">
          {isDownload ? <Download className="size-4" /> : <ExternalLink className="size-4" />}
          {isDownload ? "Download" : "Open"}
        </span>
      )}
    </>
  );
  const className = "my-8 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm";

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} transition-colors hover:border-accent/50`}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}
