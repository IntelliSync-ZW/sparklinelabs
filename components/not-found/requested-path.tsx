"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";

/** The address the visitor tried, shown inside the 404 illustration. Wraps at / and - rather than mid-word. */
export function RequestedPath({ prefix = "sparklinelabs.co.zw" }: { prefix?: string }) {
  const pathname = usePathname();
  const path = pathname && pathname !== "/" ? pathname : "/this-page";
  const parts = path.split(/(?<=[/-])/);
  return (
    <span>
      {prefix}
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          <wbr />
        </Fragment>
      ))}
    </span>
  );
}
