import type React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Author dashboard: a plain working frame, without the marketing header, footer or analytics.
export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-foreground"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
            <Image src="/icon.svg" alt="" width={28} height={28} />
            <span className="hidden sm:inline">Sparkline Labs</span>
          </Link>
          <span className="h-5 w-px bg-border" aria-hidden="true" />
          <nav aria-label="Author dashboard">
            <Link href="/dashboard/posts" className="text-sm font-medium">
              My posts
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/blog" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline">
              View blog
            </Link>
            <UserButton />
          </div>
        </div>
      </header>
      <main id="dashboard-main">{children}</main>
    </div>
  );
}
