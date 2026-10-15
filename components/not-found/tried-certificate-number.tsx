"use client";

import { usePathname } from "next/navigation";

/** The certificate number from the URL, so the visitor can compare it with their copy. */
export function TriedCertificateNumber() {
  const pathname = usePathname();
  const raw = decodeURIComponent(pathname?.split("/").filter(Boolean).pop() ?? "");
  if (!raw || raw === "certificates") return null;
  return (
    <p className="text-sm text-muted-foreground">
      Number checked: <span className="font-mono font-semibold tracking-wider text-foreground">{raw.slice(0, 40)}</span>
    </p>
  );
}
