"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Shield,
  Scale,
  Database,
  Lock,
  Code,
  FileText,
  AlertTriangle,
  DollarSign,
  UserCheck,
  Globe,
  BookOpen,
  Share2,
  ChevronDown,
  Link2,
  Check,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Layers,
} from "lucide-react";
import type { LegalPageData, LegalSection } from "@/lib/legal-data";
import { PortableTextRenderer } from "@/components/portable-text";
import { Button } from "@/components/ui/button";

const ICON_MAP: Record<string, React.ElementType> = {
  shield: Shield,
  scale: Scale,
  database: Database,
  lock: Lock,
  code: Code,
  "file-text": FileText,
  "alert-triangle": AlertTriangle,
  "dollar-sign": DollarSign,
  "user-check": UserCheck,
  globe: Globe,
  "book-open": BookOpen,
  "share-2": Share2,
};

function getSectionIcon(iconName?: string): React.ElementType {
  if (!iconName) return FileText;
  return ICON_MAP[iconName] ?? FileText;
}

export function LegalPageView({ data }: { data: LegalPageData }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() => {
    // Open all sections by default for readability
    const initial: Record<string, boolean> = {};
    data.sections.forEach((s) => {
      initial[s.id] = true;
    });
    return initial;
  });

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tocDetailsRef = useRef<HTMLDetailsElement | null>(null);

  const allExpanded = data.sections.every((s) => expandedSections[s.id]);

  const toggleAll = () => {
    const nextState = !allExpanded;
    const updated: Record<string, boolean> = {};
    data.sections.forEach((s) => {
      updated[s.id] = nextState;
    });
    setExpandedSections(updated);
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyLink = async (id: string) => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  };

  const scrollToSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: true }));
    if (tocDetailsRef.current) {
      tocDetailsRef.current.open = false;
    }
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isPrivacy = data.slug.current.includes("privacy");

  // Gather intro paragraphs (regular text, no alert box styling)
  const allIntroParagraphs = data.preamble.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header / Hero Section — Centered on large devices, alert-like removed */}
      <section className="pt-28 pb-12 px-6 border-b border-border">
        <div className="container mx-auto max-w-4xl flex flex-col items-start">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 justify-start">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{data.title}</span>
          </div>

          <div className="space-y-5 max-w-3xl">
            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center justify-start gap-2.5 text-xs text-muted-foreground">
              {data.version && (
                <span className="px-2.5 py-1 rounded-md bg-secondary border border-border font-mono text-[11px] font-medium text-foreground">
                  {data.version}
                </span>
              )}
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/60 border border-border/70">
                <Calendar className="size-3.5" />
                Last Updated: {data.lastUpdated}
              </span>
              {data.effectiveDate && (
                <span className="px-2.5 py-1 rounded-md bg-secondary/60 border border-border/70">
                  Effective: {data.effectiveDate}
                </span>
              )}
            </div>

            {/* Document Title */}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
              {data.h1}
            </h1>

            {/* Intro text as regular paragraphs (alert box removed) */}
            <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed text-balance text-justify">
              {allIntroParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-4xl px-6 pt-8">
        {/* Table of Contents — Identical to blog detail page style, sticky, never at bottom of mobile */}
        <div
          className="sticky z-20 mb-8"
          style={{ top: "calc(var(--header-height, 60px) + 1rem)" }}
        >
          <details
            ref={tocDetailsRef}
            className="group rounded-md border border-border bg-background/95 backdrop-blur-sm shadow-xs"
          >
            <summary className="flex cursor-pointer select-none list-none items-center justify-between px-4 py-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <span>On this page</span>
                <span className="text-xs font-normal normal-case text-muted-foreground">
                  ({data.sections.length} sections)
                </span>
              </span>
              {/* Chevron — flips when open, pure CSS */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>

            {/* Scrollable list — capped so it never exceeds the remaining viewport */}
            <nav
              className="overflow-y-auto px-4 pb-3"
              style={{
                maxHeight: "calc(100vh - var(--header-height, 60px) - 6rem)",
              }}
            >
              <ul className="space-y-0.5 border-l border-border py-1">
                {data.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(section.id);
                      }}
                      className="block py-1 text-sm leading-snug text-muted-foreground transition-colors hover:text-foreground pl-4 font-medium"
                    >
                      {section.sectionNumber ? `${section.sectionNumber} ` : ""}
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between py-2 mb-6 border-b border-border text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Layers className="size-4" />
            <span>{data.sections.length} Document Sections</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {allExpanded ? "Collapse All Sections" : "Expand All Sections"}
          </Button>
        </div>

        {/* Document Sections */}
        <div className="space-y-6">
          {data.sections.map((section: LegalSection) => {
            const IconComponent = getSectionIcon(section.icon);
            const isOpen = expandedSections[section.id] ?? true;

            return (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                className="border border-border rounded-xl overflow-hidden bg-card/60 backdrop-blur-xs transition-shadow hover:border-border/80 scroll-mt-24 shadow-xs"
              >
                {/* Section Header */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleSection(section.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleSection(section.id);
                    }
                  }}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer select-none hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <div className="p-2.5 rounded-lg bg-secondary border border-border text-accent shrink-0">
                      <IconComponent className="size-5" />
                    </div>
                    <div>
                      {section.sectionNumber && (
                        <span className="text-xs font-mono font-medium text-accent tracking-wider uppercase">
                          Section {section.sectionNumber}
                        </span>
                      )}
                      <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
                        {section.title}
                      </h2>
                      {section.summary && (
                        <p className="text-xs md:text-sm text-muted-foreground mt-0.5 line-clamp-1">
                          {section.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(section.id);
                      }}
                      className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy anchor link to section"
                      aria-label={`Copy link to section ${section.title}`}
                    >
                      {copiedId === section.id ? (
                        <Check className="size-4 text-green-500" />
                      ) : (
                        <Link2 className="size-4" />
                      )}
                    </button>
                    <ChevronDown
                      className={`size-5 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-foreground" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Section Content */}
                {isOpen && (
                  <div className="px-5 pb-6 md:px-6 md:pb-8 pt-2 border-t border-border/60 space-y-6 text-muted-foreground leading-relaxed text-sm md:text-base">
                    {/* Dynamic Sanity Portable Text Content if available */}
                    {section.content && (
                      <div className="sanity-legal-content">
                        <PortableTextRenderer value={section.content} />
                      </div>
                    )}

                    {/* Structured Subsections Fallback */}
                    {section.subsections &&
                      section.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="space-y-3 pt-2 first:pt-0">
                          <h3 className="text-base md:text-lg font-semibold text-foreground tracking-tight flex items-center gap-2">
                            {sub.title}
                          </h3>

                          {sub.paragraphs.map((p, pIdx) => (
                            <p
                              key={pIdx}
                              className="text-muted-foreground leading-relaxed"
                            >
                              {p}
                            </p>
                          ))}

                          {/* Bulleted List if present */}
                          {sub.list && sub.list.length > 0 && (
                            <ul className="list-disc ml-5 space-y-2 text-muted-foreground">
                              {sub.list.map((item, lIdx) => (
                                <li key={lIdx} className="leading-relaxed pl-1">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Structured Table if present */}
                          {sub.table && (
                            <div className="my-4 overflow-x-auto rounded-lg border border-border">
                              <table className="w-full text-left text-xs md:text-sm border-collapse">
                                <thead className="bg-secondary/70 border-b border-border text-foreground font-semibold">
                                  <tr>
                                    {sub.table.headers.map((h, hIdx) => (
                                      <th key={hIdx} className="p-3">
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                  {sub.table.rows.map((row, rIdx) => (
                                    <tr
                                      key={rIdx}
                                      className="hover:bg-muted/30 transition-colors"
                                    >
                                      {row.map((cell, cIdx) => (
                                        <td
                                          key={cIdx}
                                          className={`p-3 text-muted-foreground ${
                                            cIdx === 0
                                              ? "font-medium text-foreground"
                                              : ""
                                          }`}
                                        >
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {/* Highlighted Note / Callout if present */}
                          {sub.callout && (
                            <div className="p-4 rounded-lg bg-secondary/70 border-l-3 border-accent text-xs md:text-sm text-foreground">
                              <p className="leading-relaxed">{sub.callout}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Legal Bureau Contact Card at bottom of document */}
        <div className="mt-12 border border-border rounded-xl p-6 bg-secondary/30 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground flex items-center gap-2">
                <Shield className="size-4 text-accent" />
                Legal & Compliance Bureau
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                For statutory requests under Chapter 12:07, formal inquiries, or
                service of process:
              </p>
            </div>
            <Link
              href={isPrivacy ? "/terms-of-service" : "/privacy-policy"}
              className="text-xs font-medium text-accent hover:underline flex items-center gap-1 shrink-0"
            >
              {isPrivacy
                ? "Review Terms of Service →"
                : "Review Privacy Policy →"}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-2.5">
              <Mail className="size-3.5 text-accent shrink-0" />
              <a
                href={`mailto:${isPrivacy ? "privacy@sparklinelabs.co.zw" : "legal@sparklinelabs.co.zw"}`}
                className="hover:text-foreground transition-colors truncate font-medium"
              >
                {isPrivacy
                  ? "privacy@sparklinelabs.co.zw"
                  : "legal@sparklinelabs.co.zw"}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="size-3.5 text-accent shrink-0" />
              <a
                href="#whatsapp"
                data-whatsapp-href="https://wa.me/263714638508"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors font-medium"
              >
                +263 71 463 8508 (Corporate Desk)
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="size-3.5 text-accent shrink-0" />
              <span>Harare, Zimbabwe</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Sparkline Labs (Private) Limited</span>
            <span className="font-mono">Registered in Zimbabwe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
