"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const getLink = (anchor: string) => {
    return isHome ? anchor : `/${anchor}`;
  };

  return (
    <footer className="py-12 px-6 border-t border-border bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight flex gap-2 items-center"
            >
              <Image
                src="/icon.svg"
                alt="sparkline labs logo"
                width={32}
                height={32}
                className="aspect-square"
              />
              <span>sparkline labs</span>
            </Link>
            <div className="flex items-center gap-6 text-base text-muted-foreground">
              <Link
                href={getLink("#services")}
                className="hover:text-accent transition-colors"
              >
                Services
              </Link>
              <Link
                href="/products"
                className="hover:text-accent transition-colors"
              >
                Products
              </Link>
              <Link
                href={getLink("#process")}
                className="hover:text-accent transition-colors"
              >
                Process
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6 text-base text-muted-foreground">
            <Link
              href="mailto:hello@sparklinelabs.com"
              className="hover:text-accent transition-colors"
            >
              hello@sparklinelabs.com
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-base text-muted-foreground">
          © {new Date().getFullYear()} Sparkline Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
