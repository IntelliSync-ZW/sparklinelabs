import { STLReact } from "@/components/stl-render-react/latest";

type TableValue = { stlParsed?: unknown; stlString?: string };

function parse(value: TableValue): { body?: unknown } | null {
  let data = value.stlParsed;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch { data = null; }
  }
  if (!data && typeof value.stlString === "string") {
    try { data = JSON.parse(value.stlString); } catch { data = null; }
  }
  return data && (data as { body?: unknown }).body ? (data as { body?: unknown }) : null;
}

/**
 * A structured table. The table's own stylesheet (`.st-theme-border`) draws the
 * rounded border, the cell borders and padding, and scrolls sideways on narrow
 * screens — so this wrapper adds spacing only. Adding a border or overflow here
 * doubles the frame and clips the table's own.
 */
export function TableBlock({ value }: { value: TableValue }) {
  const data = parse(value);
  if (!data) return null;
  return (
    <div className="my-9 w-full">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <STLReact.Table data={data as any} />
    </div>
  );
}
