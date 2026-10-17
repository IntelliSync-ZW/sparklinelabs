"use client";

import { createContext, useContext, useEffect, useId, useMemo, useState } from "react";
import { useEditor, type BlockPath, type EditorSelection } from "@portabletext/editor";
import { STL, type SanityTable } from "structured-table";
import { STLReact } from "@/components/stl-render-react/latest";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/member-posts/errors";
import { ALT_MAX, CAPTION_MAX, SAFE_HREF, STL_MAX } from "@/lib/member-posts/schemas";
import { uploadImage } from "@/lib/member-posts/upload-image";
import { Dialog, inputClass } from "./dialog";
import { SanityPreviewImage } from "./sanity-image";

/*
 * The image, table and link dialogs. They render beside the editable area
 * (not inside it), so their inputs never feed the editor's own key and input
 * handlers. Toolbar buttons and block previews open them through context.
 */

export type ImageValue = {
  _key: string;
  _type: "image";
  asset?: { _type: "reference"; _ref: string };
  alt?: string;
  caption?: string;
};

export type TableValue = {
  _key: string;
  _type: "stlTableBlock";
  stlString?: string;
  stlParsed?: string;
  caption?: string;
};

type Selection = NonNullable<EditorSelection>;

type DialogRequest =
  | { kind: "image"; at?: Selection; editing?: { path: BlockPath; value: ImageValue } }
  | { kind: "table"; at?: Selection; editing?: { path: BlockPath; value: TableValue } }
  | { kind: "link"; at: Selection };

const OpenDialogContext = createContext<(request: DialogRequest) => void>(() => {});

export const useOpenDialog = () => useContext(OpenDialogContext);

export function EditorDialogs({ children }: { children: React.ReactNode }) {
  const editor = useEditor();
  const [request, setRequest] = useState<DialogRequest | null>(null);
  const close = () => setRequest(null);
  const done = () => {
    setRequest(null);
    editor.send({ type: "focus" });
  };

  return (
    <OpenDialogContext.Provider value={setRequest}>
      {children}
      <Dialog
        open={request?.kind === "image"}
        onClose={close}
        title={request?.kind === "image" && request.editing ? "Edit image" : "Insert image"}
        description="Alt text describes the image for people who cannot see it. It is required."
      >
        {request?.kind === "image" && <ImageForm request={request} onCancel={close} onDone={done} />}
      </Dialog>
      <Dialog
        open={request?.kind === "table"}
        onClose={close}
        title={request?.kind === "table" && request.editing ? "Edit table" : "Insert table"}
        description="Write the table in STL (Structured Table Language). The preview updates as you type."
        className="w-[min(calc(100%-2rem),64rem)]"
      >
        {request?.kind === "table" && <TableForm request={request} onCancel={close} onDone={done} />}
      </Dialog>
      <Dialog open={request?.kind === "link"} onClose={close} title="Add link">
        {request?.kind === "link" && <LinkForm at={request.at} onCancel={close} onDone={done} />}
      </Dialog>
    </OpenDialogContext.Provider>
  );
}

function FormActions({
  onCancel,
  submitLabel,
  busy,
  disabled,
}: {
  onCancel: () => void;
  submitLabel: string;
  busy?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-end gap-2 pt-1">
      <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
        Cancel
      </Button>
      <Button type="submit" disabled={busy || disabled}>
        {busy ? "Uploading…" : submitLabel}
      </Button>
    </div>
  );
}

function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

// ── Image ────────────────────────────────────────────────────────────────────

const MAX_UPLOAD = 4 * 1024 * 1024;
const IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/gif";

function ImageForm({
  request,
  onCancel,
  onDone,
}: {
  request: Extract<DialogRequest, { kind: "image" }>;
  onCancel: () => void;
  onDone: () => void;
}) {
  const editor = useEditor();
  const editing = request.editing;
  const [file, setFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [alt, setAlt] = useState(editing?.value.alt ?? "");
  const [caption, setCaption] = useState(editing?.value.caption ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ids = { file: useId(), alt: useId(), caption: useId() };

  useEffect(() => {
    if (!localPreview) return;
    return () => URL.revokeObjectURL(localPreview);
  }, [localPreview]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_UPLOAD) {
      setError(errorMessage("TOO_LARGE"));
      return;
    }
    setError(null);
    setFile(f);
    setLocalPreview(URL.createObjectURL(f));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!alt.trim()) {
      setError("Add alt text describing the image.");
      return;
    }
    if (editing) {
      editor.send({
        type: "block.set",
        at: editing.path,
        props: { alt: alt.trim(), caption: caption.trim() },
      });
      onDone();
      return;
    }
    if (!file) {
      setError(errorMessage("NO_FILE"));
      return;
    }
    setBusy(true);
    try {
      const { assetId } = await uploadImage(file);
      editor.send({
        type: "insert.block",
        block: {
          _type: "image",
          asset: { _type: "reference", _ref: assetId },
          alt: alt.trim(),
          ...(caption.trim() && { caption: caption.trim() }),
        },
        placement: "auto",
        ...(request.at && { at: request.at }),
      });
      onDone();
    } catch (err) {
      setError(errorMessage((err as Error).message));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {editing?.value.asset ? (
        <SanityPreviewImage
          image={editing.value}
          width={720}
          alt=""
          className="max-h-64 w-auto rounded-md border border-border"
        />
      ) : (
        <div className="space-y-2">
          <label htmlFor={ids.file} className="text-sm font-medium">
            Image file
          </label>
          <input
            id={ids.file}
            type="file"
            accept={IMAGE_TYPES}
            onChange={onFile}
            className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-input file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />
          <p className="text-xs text-muted-foreground">JPEG, PNG, WebP or GIF, up to 4 MB.</p>
          {localPreview && (
            // A local blob: URL, which next/image cannot optimise
            // eslint-disable-next-line @next/next/no-img-element
            <img src={localPreview} alt="" className="max-h-64 w-auto rounded-md border border-border" />
          )}
        </div>
      )}
      <div className="space-y-1.5">
        <label htmlFor={ids.alt} className="text-sm font-medium">
          Alt text <span className="text-destructive">*</span>
        </label>
        <input
          id={ids.alt}
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          maxLength={ALT_MAX}
          required
          placeholder="e.g. Bar chart of monthly sign-ups, rising from 40 to 310"
          className={inputClass}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={ids.caption} className="text-sm font-medium">
          Caption <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id={ids.caption}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={CAPTION_MAX}
          className={inputClass}
        />
      </div>
      <FormError message={error} />
      <FormActions onCancel={onCancel} submitLabel={editing ? "Save image" : "Insert image"} busy={busy} />
    </form>
  );
}

// ── Table ────────────────────────────────────────────────────────────────────

const STARTER = `#table
cols: 2

[header]
Column A | Column B

[body]
Value 1 | Value 2`;

/** Mirrors the server check in lib/member-posts/stl.ts so problems show before saving. */
function hasUnsafeLink(node: unknown): boolean {
  if (Array.isArray(node)) return node.some(hasUnsafeLink);
  if (!node || typeof node !== "object") return false;
  return Object.entries(node).some(([k, v]) =>
    (k === "href" || k === "url") && typeof v === "string"
      ? !SAFE_HREF.test(v.trim())
      : hasUnsafeLink(v),
  );
}

function parseStl(stl: string): { table: SanityTable | null; error: string | null } {
  if (!stl.trim()) return { table: null, error: "Write the table in STL." };
  try {
    const table = STL.parse(stl);
    if (!table?.body?.length) return { table: null, error: "Add at least one row under [body]." };
    if (hasUnsafeLink(table)) {
      return { table, error: "Links must start with https://, mailto: or / (a path on this site)." };
    }
    return { table, error: null };
  } catch (e) {
    return { table: null, error: (e as Error).message || "This STL could not be read." };
  }
}

function TableForm({
  request,
  onCancel,
  onDone,
}: {
  request: Extract<DialogRequest, { kind: "table" }>;
  onCancel: () => void;
  onDone: () => void;
}) {
  const editor = useEditor();
  const editing = request.editing;
  const [stl, setStl] = useState(editing?.value.stlString ?? STARTER);
  const [caption, setCaption] = useState(editing?.value.caption ?? "");
  const { table, error } = useMemo(() => parseStl(stl), [stl]);
  const ids = { stl: useId(), caption: useId() };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!table || error) return;
    // stlParsed is for the editor preview only; the server rebuilds it from stlString
    const props = { stlString: stl, stlParsed: JSON.stringify(table), caption: caption.trim() };
    if (editing) {
      editor.send({ type: "block.set", at: editing.path, props });
    } else {
      editor.send({
        type: "insert.block",
        block: { _type: "stlTableBlock", ...props },
        placement: "auto",
        ...(request.at && { at: request.at }),
      });
    }
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor={ids.stl} className="text-sm font-medium">
              Table (STL)
            </label>
            <textarea
              id={ids.stl}
              value={stl}
              onChange={(e) => setStl(e.target.value)}
              rows={14}
              maxLength={STL_MAX}
              spellCheck={false}
              className={`${inputClass} font-mono text-xs leading-relaxed`}
            />
            <p className="text-xs text-muted-foreground">
              Separate cells with <code>|</code>. Links: <code>[link text=&quot;Docs&quot; href=&quot;https://…&quot;]</code>
            </p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={ids.caption} className="text-sm font-medium">
              Caption <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id={ids.caption}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={CAPTION_MAX}
              className={inputClass}
            />
          </div>
        </div>
        <div className="min-w-0 space-y-1.5">
          <p className="text-sm font-medium">Preview</p>
          <div className="pointer-events-none overflow-x-auto rounded-md border border-border p-2">
            {table ? (
              <STLReact.Table data={table} />
            ) : (
              <p className="p-2 text-sm text-muted-foreground">Nothing to preview yet.</p>
            )}
          </div>
          <FormError message={error} />
        </div>
      </div>
      <FormActions onCancel={onCancel} submitLabel={editing ? "Save table" : "Insert table"} disabled={!table || !!error} />
    </form>
  );
}

// ── Link ─────────────────────────────────────────────────────────────────────

function LinkForm({ at, onCancel, onDone }: { at: Selection; onCancel: () => void; onDone: () => void }) {
  const editor = useEditor();
  const [href, setHref] = useState("");
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = href.trim();
    if (!SAFE_HREF.test(value)) {
      setError("Use a full address starting with https://, a mailto: address, or a path on this site such as /services.");
      return;
    }
    editor.send({ type: "annotation.add", annotation: { name: "link", value: { href: value } }, at });
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor={id} className="text-sm font-medium">
          Link address
        </label>
        <input
          id={id}
          value={href}
          onChange={(e) => setHref(e.target.value)}
          placeholder="https://"
          inputMode="url"
          autoComplete="url"
          maxLength={2048}
          className={inputClass}
        />
      </div>
      <FormError message={error} />
      <FormActions onCancel={onCancel} submitLabel="Add link" />
    </form>
  );
}
