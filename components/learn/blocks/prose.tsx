import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Link2 } from "lucide-react";
import type { PortableTextValue } from "./types";

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

function plainText(value: unknown): string {
  const children = (value as { children?: { text?: string }[] } | undefined)?.children;
  return children?.map((c) => c.text ?? "").join("") ?? "";
}

/** Heading with a hover "link to this section" anchor. */
function AnchoredHeading({
  as: Tag,
  value,
  className,
  children,
}: {
  as: "h3" | "h4";
  value: unknown;
  className: string;
  children: React.ReactNode;
}) {
  const id = slugify(plainText(value));
  return (
    <Tag id={id || undefined} className={`group scroll-mt-24 ${className}`}>
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label="Link to this heading"
          className="ml-2 inline-block align-middle text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/70 focus-visible:text-muted-foreground"
        >
          <Link2 className="size-4" />
        </a>
      )}
    </Tag>
  );
}

/** Rich text for lesson bodies. Headings start at H3 (the section title is the H2). */
export const proseComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-[1.0625rem] leading-8 text-foreground/80 last:mb-0">{children}</p>
    ),
    h3: ({ children, value }) => (
      <AnchoredHeading as="h3" value={value} className="mt-10 mb-3 text-xl font-semibold tracking-tight text-foreground">
        {children}
      </AnchoredHeading>
    ),
    h4: ({ children, value }) => (
      <AnchoredHeading as="h4" value={value} className="mt-8 mb-2 text-lg font-semibold text-foreground">
        {children}
      </AnchoredHeading>
    ),
    h5: ({ children }) => <h5 className="mt-6 mb-1 text-base font-semibold text-foreground">{children}</h5>,
    h6: ({ children }) => (
      <h6 className="mt-6 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</h6>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-7 border-l-4 border-accent/60 pl-5 text-lg italic leading-8 text-foreground/70">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-5 ml-1 space-y-2 text-foreground/80 marker:text-accent [&>li]:relative [&>li]:list-none [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-3 [&>li]:before:size-1.5 [&>li]:before:rounded-full [&>li]:before:bg-accent/70 [&>li]:before:content-['']">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-5 ml-6 list-decimal space-y-2 text-foreground/80 marker:font-semibold marker:text-accent">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-[1.0625rem] leading-8">{children}</li>,
    number: ({ children }) => <li className="pl-1 text-[1.0625rem] leading-8">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline underline-offset-4">{children}</span>,
    "strike-through": ({ children }) => <s className="opacity-70">{children}</s>,
    code: ({ children }) => (
      <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="font-medium text-foreground underline decoration-accent/50 underline-offset-4 transition-colors hover:decoration-accent"
        >
          {children}
        </a>
      );
    },
  },
};

export function Prose({ value }: { value: PortableTextValue }) {
  return <PortableText value={value} components={proseComponents} />;
}
