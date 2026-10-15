"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { ListTree, X } from "lucide-react";

const subscribeNoop = () => () => {};

/**
 * Curriculum drawer for small screens. The tree itself is rendered on the server
 * and passed in.
 *
 * The drawer is portalled to <body>: the header uses `backdrop-blur`, and a
 * backdrop-filter turns its element into the containing block for `fixed`
 * descendants, which would clip a full-screen drawer to the 56px header bar.
 */
export function MobileCurriculum({ children, title }: { children: React.ReactNode; title: string }) {
  // The drawer is open only for the page it was opened on, so navigating closes it.
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (value: boolean) => setOpenPath(value ? pathname : null);

  // `document` only exists in the browser; false during server rendering.
  const canPortal = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null);
    };
    document.addEventListener("keydown", onKeyDown);

    // Stop the page behind the drawer from scrolling, and move focus into it.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary transition-colors"
        aria-expanded={open}
        aria-controls="mobile-curriculum"
      >
        <ListTree className="size-4" /> Lessons
      </button>

      {open &&
        canPortal &&
        createPortal(
          <div className="lg:hidden fixed inset-0 z-50" id="mobile-curriculum" role="dialog" aria-modal="true" aria-label={title}>
            <button
              type="button"
              aria-label="Close lessons"
              tabIndex={-1}
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col border-r border-border bg-background shadow-2xl">
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
                <p className="truncate text-sm font-semibold">{title}</p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1.5 hover:bg-secondary"
                  aria-label="Close lessons"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
