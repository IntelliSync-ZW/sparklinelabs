"use client";

import { useId, useRef, useState } from "react";
import { ImageUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/member-posts/errors";
import { ALT_MAX, type CoverImage } from "@/lib/member-posts/schemas";
import { uploadImage } from "@/lib/member-posts/upload-image";
import { inputClass } from "./dialog";
import { SanityPreviewImage } from "./sanity-image";

const MAX_UPLOAD = 4 * 1024 * 1024;

/** The post's cover image (`coverImage`): upload, preview, required alt text, remove. */
export function CoverImageField({
  value,
  onChange,
}: {
  value?: CoverImage;
  onChange: (value: CoverImage | undefined) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headingId = useId();
  const altId = useId();
  const missingAlt = !!value && !value.alt.trim();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_UPLOAD) {
      setError(errorMessage("TOO_LARGE"));
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const { assetId } = await uploadImage(file);
      // A new asset starts without the old image's crop
      onChange({ _type: "image", asset: { _type: "reference", _ref: assetId }, alt: value?.alt ?? "" });
    } catch (err) {
      setError(errorMessage((err as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby={headingId} className="space-y-3 rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id={headingId} className="text-sm font-medium">
            Cover image
          </h2>
          <p className="text-xs text-muted-foreground">Shown on blog cards and at the top of the post.</p>
        </div>
        <div className="flex gap-1">
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => input.current?.click()}>
            <ImageUp aria-hidden="true" />
            {busy ? "Uploading…" : value ? "Replace" : "Add cover image"}
          </Button>
          {value && (
            <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => onChange(undefined)}>
              <Trash2 aria-hidden="true" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {value && (
        <div className="grid gap-4 sm:grid-cols-[220px_1fr] sm:items-start">
          <SanityPreviewImage
            image={value}
            width={440}
            alt=""
            className="w-full rounded-md border border-border"
            sizes="220px"
          />
          <div className="space-y-1.5">
            <label htmlFor={altId} className="text-sm font-medium">
              Alt text <span className="text-destructive">*</span>
            </label>
            <input
              id={altId}
              value={value.alt}
              onChange={(e) => onChange({ ...value, alt: e.target.value })}
              maxLength={ALT_MAX}
              aria-invalid={missingAlt}
              aria-describedby={missingAlt ? `${altId}-hint` : undefined}
              placeholder="Describe the image for people who cannot see it"
              className={inputClass}
            />
            {missingAlt && (
              <p id={`${altId}-hint`} className="text-xs text-destructive">
                Add alt text so the post can be saved.
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <input
        ref={input}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onFile}
      />
    </section>
  );
}
