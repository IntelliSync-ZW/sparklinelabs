import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, Home, Layers, Mail, Newspaper, Wrench } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RequestedPath } from "@/components/not-found/requested-path";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for doesn't exist or has moved.",
};

const destinations = [
  { href: "/", label: "Home", detail: "Start from the top", Icon: Home },
  { href: "/services", label: "Services", detail: "Systems, integrations and automation", Icon: Wrench },
  { href: "/products", label: "Products", detail: "Propertyzone and what we're building", Icon: Layers },
  { href: "/work", label: "Our work", detail: "Problems we've engineered around", Icon: Briefcase },
  { href: "/blog", label: "Blog", detail: "What we're learning from building", Icon: Newspaper },
  { href: "/ai-training", label: "AI Training", detail: "Free, practical AI skills for work", Icon: BookOpen },
];

/**
 * Site-wide 404. We connect systems that should talk to each other, so the
 * illustration is an integration map with one connection that goes nowhere.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="px-6 pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="container mx-auto grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-4 text-base font-medium uppercase tracking-widest text-muted-foreground">Error 404</p>
              <h1 className="mb-6 text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
                This link doesn&apos;t connect to anything.
              </h1>
              <p className="mb-10 text-xl leading-relaxed text-muted-foreground">
                We spend our days connecting systems that should talk to each other. This one doesn&apos;t: the page
                you asked for isn&apos;t here. It may have moved, or the link may be mistyped or out of date.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/"
                  className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-accent px-7 py-3.5 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Go to the homepage
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="mailto:info@sparklinelabs.co.zw?subject=Broken%20link%20on%20sparklinelabs.co.zw"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border px-7 py-3.5 text-base font-medium transition-colors hover:bg-secondary"
                >
                  <Mail className="size-5" /> Report this link
                </a>
              </div>
            </div>

            <IntegrationMap />
          </div>
        </section>

        <section className="border-t border-border bg-secondary px-6 py-16 md:py-20">
          <div className="container mx-auto">
            <h2 className="mb-8 text-2xl font-semibold tracking-tight md:text-3xl">Where you might have been heading</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map(({ href, label, detail, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-accent/50"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 font-semibold">
                      {label}
                      <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                    <span className="block text-sm text-muted-foreground">{detail}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/**
 * Three familiar systems feed into one hub; the hub's last connection, to the
 * requested page, is cut. Drawn in SVG with the site tokens so it scales cleanly.
 */
function IntegrationMap() {
  const sources = [
    { y: 50, label: "Website" },
    { y: 150, label: "WhatsApp" },
    { y: 250, label: "Spreadsheet" },
  ];

  return (
    <figure aria-hidden="true" className="mx-auto w-full max-w-xl">
      <svg viewBox="0 0 560 300" className="w-full" role="presentation">
        {/* Working connections: source → hub */}
        {sources.map((s) => (
          <path
            key={s.label}
            d={`M150 ${s.y} C 205 ${s.y}, 205 150, 248 150`}
            fill="none"
            className="stroke-accent"
            strokeWidth="2"
          />
        ))}

        {/* The broken connection: hub → requested page */}
        <path d="M312 150 L 392 150" className="stroke-accent" strokeWidth="2" />
        <path d="M410 150 L 452 150" className="stroke-destructive" strokeWidth="2" strokeDasharray="5 6" />
        {/* The break itself */}
        <g className="stroke-destructive" strokeWidth="2.5" strokeLinecap="round">
          <line x1="394" y1="140" x2="404" y2="160" />
          <line x1="402" y1="140" x2="412" y2="160" />
        </g>

        {/* Source systems */}
        {sources.map((s) => (
          <g key={s.label}>
            <rect x="10" y={s.y - 22} width="140" height="44" rx="10" className="fill-background stroke-border" strokeWidth="1.5" />
            <circle cx="32" cy={s.y} r="5" className="fill-accent" />
            <text x="46" y={s.y + 5} className="fill-foreground text-[15px] font-medium">
              {s.label}
            </text>
          </g>
        ))}

        {/* Hub */}
        <rect x="248" y="118" width="64" height="64" rx="16" className="fill-accent" />
        <path
          d="M262 160 l9 -10 l7 6 l9 -14 l7 9 l6 -8"
          fill="none"
          className="stroke-accent-foreground"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* The page that isn't there */}
        <rect x="452" y="110" width="98" height="80" rx="10" className="fill-secondary stroke-destructive" strokeWidth="1.5" strokeDasharray="6 5" />
        <text x="501" y="146" textAnchor="middle" className="fill-destructive text-[24px] font-semibold">
          404
        </text>
        <text x="501" y="170" textAnchor="middle" className="fill-muted-foreground text-[12px]">
          no page
        </text>
      </svg>
      <figcaption className="mt-3 text-center font-mono text-sm text-muted-foreground">
        <RequestedPath />
      </figcaption>
    </figure>
  );
}
