"use client";

import { useRef } from "react";
import Image from "next/image";
import { Expand, X } from "lucide-react";

type ImageValue = {
  alt?: string;
  caption?: string;
  asset?: { url?: string; metadata?: { dimensions?: { width?: number; height?: number } } } | null;
};

/** An image with a caption; click to view it full screen. */
export function FigureBlock({ value }: { value: ImageValue }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const url = value.asset?.url;
  if (!url) return null;

  const width = value.asset?.metadata?.dimensions?.width ?? 1600;
  const height = value.asset?.metadata?.dimensions?.height ?? 900;

  return (
    <figure className="my-9">
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="group relative block w-full overflow-hidden rounded-xl border border-border"
        aria-label={`Enlarge image${value.alt ? `: ${value.alt}` : ""}`}
      >
        <Image src={url} alt={value.alt ?? ""} width={width} height={height} sizes="(max-width: 768px) 100vw, 768px" className="h-auto w-full" />
        <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg bg-background/80 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Expand className="size-4" />
        </span>
      </button>
      {value.caption && <figcaption className="mt-2.5 text-center text-sm text-muted-foreground">{value.caption}</figcaption>}

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto max-h-[92vh] max-w-[96vw] rounded-xl bg-background p-2 backdrop:bg-black/80"
      >
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-background/90 shadow"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
        <Image src={url} alt={value.alt ?? ""} width={width} height={height} sizes="96vw" className="h-auto max-h-[88vh] w-auto max-w-full rounded-lg" />
      </dialog>
    </figure>
  );
}
