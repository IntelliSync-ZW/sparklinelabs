"use client";

import Link from "next/link";
import Image from "next/image";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";
import { WhatsAppLeadTrigger } from "@/components/whatsapp-lead-capture";

const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

export function Footer() {
  // hide address from the 18th of September 2026  onwards
  const hideAddress = new Date() >= new Date("2026-09-18");
  return (
    <footer className="py-12 px-6 border-t border-border bg-background">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight flex gap-2 items-center mb-3"
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
            <p className="text-base text-muted-foreground">
              Solutions engineering for African businesses.
            </p>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Company
            </p>
            <div className="flex flex-col gap-3 text-base text-muted-foreground">
              <Link
                href="/services"
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
                href="/work"
                className="hover:text-accent transition-colors"
              >
                Work
              </Link>
              <Link
                href="/blog"
                className="hover:text-accent transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/blog/authors"
                className="hover:text-accent transition-colors"
              >
                Authors
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Contact
            </p>
            <div className="flex flex-col gap-3 text-base text-muted-foreground">
              <WhatsAppLeadTrigger
                href={waLink}
                variant="link"
                className="h-auto justify-start p-0 text-base text-muted-foreground hover:text-accent"
              >
                WhatsApp ({WHATSAPP_NUMBER})
              </WhatsAppLeadTrigger>
              <a
                href="mailto:sales@sparklinelabs.co.zw"
                className="hover:text-accent transition-colors"
              >
                sales@sparklinelabs.co.zw
              </a>
              {!hideAddress && (
                <>
                  <p>2270 106 Close,</p>
                  <p>Budiriro 1, Harare</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-base text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} Sparkline Labs. All rights
            reserved.
          </span>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <Link
              href="/terms-of-service"
              className="hover:text-accent transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-accent transition-colors"
            >
              Privacy Policy
            </Link>
            <a
              href="https://www.propzone.co.zw/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              We built Propertyzone.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
