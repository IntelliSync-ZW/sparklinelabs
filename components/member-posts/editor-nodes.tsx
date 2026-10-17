"use client";

import { useMemo } from "react";
import {
  defineAnnotation,
  defineBlockObject,
  defineDecorator,
  defineTextBlock,
  useEditor,
  type BlockObjectRenderProps,
  type RegistrableNode,
  type TextBlockRenderProps,
} from "@portabletext/editor";
import { Pencil, Trash2 } from "lucide-react";
import { STL, type SanityTable } from "structured-table";
import { STLReact } from "@/components/stl-render-react/latest";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOpenDialog, type ImageValue, type TableValue } from "./editor-dialogs";
import { SanityPreviewImage } from "./sanity-image";

/*
 * How the editor draws each node (@portabletext/editor 8 node registrations,
 * mounted with <NodePlugin>). Styles follow the public post renderer in
 * components/portable-text.tsx, scaled down for editing.
 */

// Each non-numbered block restarts the numbering of the next numbered list
const restartNumbering = { counterReset: "list-item" } as const;

function TextBlockView({ attributes, children, node }: TextBlockRenderProps) {
  if (node.listItem) {
    const numbered = node.listItem === "number";
    return (
      <div
        {...attributes}
        className={cn("my-1 pl-1 leading-relaxed", numbered ? "list-decimal" : "list-disc")}
        style={{
          display: "list-item",
          marginLeft: `${Math.min(node.level ?? 1, 6) * 1.5}rem`,
          ...(!numbered && restartNumbering),
        }}
      >
        {children}
      </div>
    );
  }
  switch (node.style) {
    case "h2":
      return (
        <h2 {...attributes} style={restartNumbering} className="mt-8 mb-3 text-2xl font-semibold tracking-tight first:mt-0">
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 {...attributes} style={restartNumbering} className="mt-6 mb-2 text-xl font-semibold tracking-tight first:mt-0">
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 {...attributes} style={restartNumbering} className="mt-5 mb-2 text-lg font-semibold first:mt-0">
          {children}
        </h4>
      );
    case "blockquote":
      return (
        <blockquote
          {...attributes}
          style={restartNumbering}
          className="my-4 border-l-4 border-accent py-1 pl-4 italic text-muted-foreground"
        >
          {children}
        </blockquote>
      );
    default:
      return (
        <p {...attributes} style={restartNumbering} className="my-3 leading-relaxed">
          {children}
        </p>
      );
  }
}

/** Shared frame for image and table blocks: the engine's spacer plus non-editable chrome. */
function BlockFrame({
  attributes,
  children,
  readOnly,
  selected,
  label,
  onEdit,
  onRemove,
  content,
}: Pick<BlockObjectRenderProps, "attributes" | "children" | "readOnly" | "selected"> & {
  label: string;
  onEdit: () => void;
  onRemove: () => void;
  content: React.ReactNode;
}) {
  return (
    <div {...attributes} className="my-4">
      {children}
      <div
        contentEditable={false}
        draggable={!readOnly}
        className={cn(
          "select-none rounded-lg border p-3",
          selected ? "border-ring ring-2 ring-ring/30" : "border-border",
        )}
      >
        {content}
        {!readOnly && (
          <div className="mt-2 flex justify-end gap-1">
            <Button type="button" size="sm" variant="outline" onClick={onEdit}>
              <Pencil aria-hidden="true" />
              Edit {label}
            </Button>
            <Button type="button" size="icon-sm" variant="ghost" onClick={onRemove} aria-label={`Remove ${label}`}>
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ImageBlockView(props: BlockObjectRenderProps) {
  const editor = useEditor();
  const open = useOpenDialog();
  const value = props.node as ImageValue;
  return (
    <BlockFrame
      {...props}
      label="image"
      onEdit={() => open({ kind: "image", editing: { path: props.path, value } })}
      onRemove={() => editor.send({ type: "delete.block", at: props.path })}
      content={
        <figure>
          {value.asset?._ref && (
            <SanityPreviewImage
              image={value}
              width={900}
              alt={value.alt ?? ""}
              className="mx-auto max-h-105 w-auto rounded-md"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          )}
          <figcaption className="mt-2 text-sm text-muted-foreground">
            {value.alt ? (
              <>Alt: {value.alt}</>
            ) : (
              <span className="text-destructive">Missing alt text: edit the image to add it.</span>
            )}
            {value.caption && <> · Caption: {value.caption}</>}
          </figcaption>
        </figure>
      }
    />
  );
}

function TableBlockView(props: BlockObjectRenderProps) {
  const editor = useEditor();
  const open = useOpenDialog();
  const value = props.node as TableValue;
  // Same fast path as the site: stlParsed, falling back to parsing stlString
  const table = useMemo(() => {
    try {
      if (value.stlParsed) return JSON.parse(value.stlParsed) as SanityTable;
      if (value.stlString) return STL.parse(value.stlString);
    } catch {}
    return null;
  }, [value.stlParsed, value.stlString]);

  return (
    <BlockFrame
      {...props}
      label="table"
      onEdit={() => open({ kind: "table", editing: { path: props.path, value } })}
      onRemove={() => editor.send({ type: "delete.block", at: props.path })}
      content={
        <>
          {/* Links and buttons in the preview stay inert inside the editor */}
          <div className="pointer-events-none overflow-x-auto">
            {table?.body?.length ? (
              <STLReact.Table data={table} />
            ) : (
              <p className="text-sm text-destructive">This table could not be read. Edit it to fix the STL.</p>
            )}
          </div>
          {value.caption && <p className="mt-2 text-sm text-muted-foreground">Caption: {value.caption}</p>}
        </>
      }
    />
  );
}

// Module-level so <NodePlugin> registers them once
export const editorNodes: RegistrableNode[] = [
  defineTextBlock({ type: "block", render: (p) => <TextBlockView {...p} /> }),
  defineDecorator({ type: "strong", render: ({ children }) => <strong className="font-semibold">{children}</strong> }),
  defineDecorator({ type: "em", render: ({ children }) => <em>{children}</em> }),
  defineDecorator({
    type: "underline",
    render: ({ children }) => <span className="underline underline-offset-4">{children}</span>,
  }),
  defineDecorator({
    type: "code",
    render: ({ children }) => (
      <code className="rounded border border-border bg-secondary px-1 py-0.5 font-mono text-[0.9em]">{children}</code>
    ),
  }),
  defineAnnotation({
    type: "link",
    render: ({ annotation, children }) => (
      <span className="text-accent underline underline-offset-4" title={String(annotation.href ?? "")}>
        {children}
      </span>
    ),
  }),
  defineAnnotation({
    type: "reviewComment",
    render: ({ annotation, children }) => (
      <mark
        className="rounded-sm bg-yellow-200/80 text-inherit underline decoration-yellow-500 decoration-2 underline-offset-4 dark:bg-yellow-500/30"
        title={`Editor's comment: ${String(annotation.comment ?? "")}`}
      >
        {children}
      </mark>
    ),
  }),
  defineBlockObject({ type: "image", render: (p) => <ImageBlockView {...p} /> }),
  defineBlockObject({ type: "stlTableBlock", render: (p) => <TableBlockView {...p} /> }),
];
