import { slugifyHeading } from "@/components/portable-text";

type PortableTextBlock = {
  _type: string;
  _key: string;
  style?: string;
  children?: { _type: string; text?: string }[];
};

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function extractTocItems(body: unknown[]): TocItem[] {
  const items: TocItem[] = [];
  for (const block of body) {
    const b = block as PortableTextBlock;
    if (b._type !== "block") continue;
    if (b.style !== "h2" && b.style !== "h3") continue;
    const text = b.children?.map((c) => c.text ?? "").join("") ?? "";
    if (!text.trim()) continue;
    items.push({
      id: slugifyHeading(text),
      text,
      level: b.style === "h2" ? 2 : 3,
    });
  }
  return items;
}

type Props = {
  body: unknown[];
};

export function TableOfContents({ body }: Props) {
  const items = extractTocItems(body);
  if (items.length < 2) return null;

  return (
    /*
      Sticky wrapper — clears the fixed header while scrolling.
      The inner nav is scrollable if the list exceeds the available viewport.
      --header-height is defined in globals.css (:root { --header-height: 73px; })
    */
    <div
      className="sticky z-10 mb-8"
      style={{ top: "calc(var(--header-height) + 1rem)" }}
    >
      <details className="group rounded-md border border-border bg-background/95 backdrop-blur-sm">
        <summary className="flex cursor-pointer select-none list-none items-center justify-between px-4 py-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors [&::-webkit-details-marker]:hidden">
          <span>On this page</span>
          {/* Chevron — flips when open, pure CSS */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </summary>

        {/* Scrollable list — capped so it never exceeds the remaining viewport */}
        <nav
          className="overflow-y-auto px-4 pb-3"
          style={{
            maxHeight: "calc(100vh - var(--header-height) - 6rem)",
          }}
        >
          <ul className="space-y-0.5 border-l border-border py-1">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={[
                    "block py-1 text-sm leading-snug text-muted-foreground transition-colors hover:text-foreground",
                    item.level === 2 ? "pl-4 font-medium" : "pl-7 text-xs",
                  ].join(" ")}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </details>
    </div>
  );
}
