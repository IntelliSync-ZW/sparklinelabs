import {
  PortableText,
  type PortableTextReactComponents,
  type PortableTextProps,
} from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export type RichTextValue = PortableTextProps["value"];

const components: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }) => (
      <p className="text-lg text-muted-foreground leading-relaxed mb-5 last:mb-0">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold tracking-tight text-foreground mt-12 mb-5 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-foreground mt-8 mb-3 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-6 py-1 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 space-y-2 my-5 text-lg text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 space-y-2 my-5 text-lg text-muted-foreground">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <span className="underline underline-offset-4">{children}</span>
    ),
    code: ({ children }) => (
      <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded border border-border">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const isExternal = href.startsWith("http") || href.startsWith("//");
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-accent transition-colors"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          className="underline underline-offset-4 hover:text-accent transition-colors"
        >
          {children}
        </Link>
      );
    },
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl = urlFor(value).width(1200).quality(90).url();
      return (
        <figure className="my-8">
          <div className="relative w-full overflow-hidden rounded-xl border border-border">
            <Image
              src={imageUrl}
              alt={value.alt ?? ""}
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

type Props = {
  value: PortableTextProps["value"];
  className?: string;
};

export function PortableTextRenderer({ value, className }: Props) {
  if (!value) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
