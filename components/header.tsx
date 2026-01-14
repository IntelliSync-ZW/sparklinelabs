"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const getHref = (anchor: string) => (isHome ? anchor : `/${anchor}`);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight flex gap-2 items-center"
          >
            <Image
              src="/icon.svg"
              alt="sparkline labs logo"
              width={44}
              height={44}
              className="aspect-square"
            />
            <span>sparkline labs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href={getHref("#services")}
              className="text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </Link>
            <Link
              href="/products"
              className="text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <Link
              href={getHref("#process")}
              className="text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              Process
            </Link>
            <Button className="ml-4 bg-accent text-accent-foreground hover:bg-accent/90">Start a Project</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-border mt-4">
            <div className="flex flex-col gap-4">
              <Link
                href={getHref("#services")}
                className="text-base text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/products"
                className="text-base text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                href={getHref("#process")}
                className="text-base text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Process
              </Link>
              <Button className="w-fit">Start a Project</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
