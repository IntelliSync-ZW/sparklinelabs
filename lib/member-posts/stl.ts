import "server-only";
import { STL, type SanityTable } from "structured-table";
import { SAFE_HREF } from "./schemas";

// Link cells use `href` and button cells use `url` (structured-table 0.3)
const URL_KEYS = new Set(["href", "url", "link", "src"]);
// Cell attributes that reach the page outside the table: arbitrary classes
// (`fixed inset-0` would cover the page) and element ids (button targetId).
const STRIPPED_KEYS = new Set(["class", "targetId"]);

function sanitize(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(sanitize);
  if (!node || typeof node !== "object") return node;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(node)) {
    if (STRIPPED_KEYS.has(k)) continue;
    if (URL_KEYS.has(k) && typeof v === "string" && !SAFE_HREF.test(v.trim())) {
      throw new Error("UNSAFE_TABLE_LINK");
    }
    out[k] = sanitize(v);
  }
  return out;
}

function parseTable(stlString: string): SanityTable {
  let parsed: SanityTable;
  try {
    parsed = STL.parse(stlString);
  } catch {
    throw new Error("INVALID_TABLE");
  }
  // The parser returns an empty table, rather than throwing, for input it cannot read
  if (!parsed || !Array.isArray(parsed.body) || parsed.body.length === 0) {
    throw new Error("INVALID_TABLE");
  }
  return sanitize(parsed) as SanityTable;
}

/**
 * The public site renders stlParsed directly, so it is always rebuilt here from
 * stlString; the browser's copy is never stored.
 */
export function withParsedTables<T extends { _type: string }>(body: T[]): T[] {
  return body.map((block) => {
    if (block._type !== "stlTableBlock") return block;
    const { stlString } = block as T & { stlString: string };
    return { ...block, stlParsed: JSON.stringify(parseTable(stlString)) };
  });
}
