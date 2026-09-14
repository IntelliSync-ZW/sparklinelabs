import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WHATSAPP_NUMBER, WHATSAPP_SEO_MESSAGE } from "@/lib/config";

export const metadata: Metadata = {
  title: "SEO Zimbabwe & AI Search Visibility",
  description:
    "Improve how your business is discovered across Google, local search and AI search. Sparkline Labs combines technical SEO, content, digital freshness and engineering.",
  keywords: [
    "SEO Zimbabwe",
    "search visibility Zimbabwe",
    "AI discovery",
    "local SEO Harare",
    "technical SEO Africa",
    "Google Business Profile Zimbabwe",
    "AEO GEO search",
    "Sparkline Labs SEO",
    "digital freshness",
    "search architecture Zimbabwe",
  ],
  alternates: {
    canonical:
      "https://www.sparklinelabs.co.zw/services/search-visibility-ai-discovery",
  },
  openGraph: {
    title:
      "Search Visibility & AI Discovery for Zimbabwean Businesses | Sparkline Labs",
    description:
      "Make your business easier to find, easier to understand, and easier to choose. Technical SEO, local search, content architecture and AI discovery for African businesses.",
    url: "https://www.sparklinelabs.co.zw/services/search-visibility-ai-discovery",
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.sparklinelabs.co.zw",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Services",
      item: "https://www.sparklinelabs.co.zw/services",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Search Visibility & AI Discovery for Zimbabwean Businesses",
      item: "https://www.sparklinelabs.co.zw/services/search-visibility-ai-discovery",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id":
    "https://www.sparklinelabs.co.zw/services/search-visibility-ai-discovery#service",
  name: "Search Visibility & AI Discovery for Zimbabwean Businesses",
  description:
    "Make your business easier to find, easier to understand, and easier to choose. We combine technical SEO, local search, content architecture and AI discovery to help businesses surface in both traditional and AI-powered search.",
  provider: {
    "@type": "Organization",
    name: "Sparkline Labs",
    url: "https://www.sparklinelabs.co.zw",
  },
  areaServed: [
    { "@type": "Country", name: "Zimbabwe" },
    { "@type": "Country", name: "Nigeria" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Search Visibility Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Technical SEO" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Local Search" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Search Architecture" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Content" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Digital Freshness" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "AI Discovery" },
      },
    ],
  },
};

const WHAT_WE_WORK_ON = [
  {
    area: "Technical SEO",
    covers:
      "Crawlability, indexation, site structure, performance, metadata and technical issues",
  },
  {
    area: "Local Search",
    covers:
      "Google Business Profile, location signals, local relevance and service-area visibility",
  },
  {
    area: "Search Architecture",
    covers:
      "Designing pages and internal links around how customers actually search",
  },
  {
    area: "Content",
    covers:
      "Useful commercial pages, supporting articles, original research and first-hand expertise",
  },
  {
    area: "Digital Freshness",
    covers:
      "Keeping important business information current, consistent and trustworthy",
  },
  {
    area: "AI Discovery",
    covers:
      "Strengthening the information and authority that help businesses surface in AI-mediated search",
  },
];

const SEARCH_SIGNALS = [
  { search: "Relevant impressions", business: "Enquiries" },
  { search: "Commercial search visibility", business: "Qualified leads" },
  { search: "Local visibility", business: "Bookings" },
  { search: "Important page traffic", business: "Sales" },
  { search: "Search Console performance", business: "Sign-ups" },
  {
    search: "AI search visibility where measurable",
    business: "Other defined business outcomes",
  },
];

const HOW_WE_APPROACH = [
  {
    step: "01",
    title: "Diagnose",
    description:
      "We understand the business, audience, search landscape and current digital presence.",
  },
  {
    step: "02",
    title: "Structure",
    description:
      "We determine what information needs to exist, where it belongs and how the different parts connect.",
  },
  {
    step: "03",
    title: "Improve",
    description:
      "We make the technical, content, local and experience changes required.",
  },
  {
    step: "04",
    title: "Measure",
    description:
      "We track whether visibility is improving and whether that visibility is producing something useful for the business.",
  },
];

const GOOD_FIT = [
  "Competitors consistently appear for searches that matter to your business",
  "Your website contains useful information but is difficult to discover",
  "Local customers struggle to find you",
  "Your digital presence has become outdated",
  "You have expertise that your website does not communicate",
  "People find the website but do not take the next step",
  "You are rebuilding a website and want search considered from the beginning",
];

const ORIGINAL_INFO_TYPES = [
  "Original research",
  "Industry benchmarks",
  "Real project lessons",
  "First-hand analysis",
  "Detailed case studies",
  "Local market knowledge",
  "Specific answers to difficult customer questions",
];

const EXAMPLE_SEARCHES = [
  '"SEO agency Harare"',
  '"accounting firms Zimbabwe"',
  '"best lodges in Harare"',
  '"houses for sale in Borrowdale"',
];

const RELATED_LINKS = [
  {
    href: "/blog/seo-and-digital-strategy/built-not-found-zimbabwe-seo-ai-visibility",
    label: "Built, But Not Found",
  },
  {
    href: "/blog/seo-and-digital-strategy/digital-freshness-trust-zimbabwe-2026-website-audit",
    label: "Digital Freshness",
  },
  { href: "/work/propertyzone", label: "Propertyzone" },
  {
    href: "/blog/seo-and-digital-strategy",
    label: "Search & AI Visibility Research",
  },
];

function InlineCtaBar({ waLink }: { waLink: string }) {
  return (
    <div className="flex items-center justify-between gap-6 flex-wrap rounded-xl border border-border bg-secondary/50 px-6 py-5">
      <p className="text-base text-foreground font-medium">
        Not sure where your search visibility stands?
      </p>
      <Button
        size="sm"
        className="group shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
        asChild
      >
        <a href="#whatsapp" data-whatsapp-href={waLink}>
          Commission a site audit
          <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      </Button>
    </div>
  );
}

export default function SearchVisibilityPage() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_SEO_MESSAGE}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 border-b border-border">
        <div className="container mx-auto max-w-3xl">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-3">
            Services · Search &amp; AI Discovery
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-4 text-balance">
            Search Visibility &amp; AI Discovery
          </h1>
          <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-5">
            Be found when the right people are looking.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            A good website is not automatically a visible one. We help
            businesses improve how they are discovered across Google Search,
            Google Maps and AI-powered search experiences, then make sure the
            experience after the click is good enough to turn attention into
            action.
          </p>
          <p className="text-base text-muted-foreground mb-8">
            Our work combines technical SEO, local search, content architecture,
            digital freshness, website engineering and AI discovery.
          </p>
          <Button
            size="lg"
            className="group bg-accent text-accent-foreground hover:bg-accent/90"
            asChild
          >
            <a href="#whatsapp" data-whatsapp-href={waLink}>
              Assess your search visibility
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </section>

      {/* Hero image */}
      <div className="px-6 py-8 bg-secondary/40">
        <div className="container mx-auto max-w-3xl">
          <div className="relative w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src="/search-visibility-ai-discovery.png"
              alt="Business digital presence structured for search engine and AI discovery"
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Main article */}
      <article className="pb-16 md:pb-24 px-6">
        <div className="container mx-auto max-w-3xl space-y-12 md:space-y-16">
          {/* Search visibility is more than rankings */}
          <section className="space-y-5 pt-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Search Visibility Is More Than Rankings
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Ranking for a keyword is only useful when it helps the right
              person discover your business. We look at the full path.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { q: "Can people find you?", n: "01" },
                { q: "Can they understand what you do?", n: "02" },
                { q: "Can they trust what they find?", n: "03" },
                { q: "Can they take the next step?", n: "04" },
              ].map(({ q, n }) => (
                <div
                  key={n}
                  className="p-4 rounded-xl border border-border bg-card flex items-start gap-3"
                >
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/50 pt-0.5 shrink-0">
                    {n}
                  </span>
                  <p className="text-sm font-medium text-foreground">{q}</p>
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              That means search work can involve your website structure,
              technical foundations, local presence, content, Google Business
              Profile, outdated information, or even the enquiry journey itself.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Sometimes the problem is SEO. Sometimes SEO simply exposes a
              bigger problem.
            </p>
          </section>

          {/* What we work on */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              What We Work On
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/60">
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      Area
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      What it covers
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {WHAT_WE_WORK_ON.map(({ area, covers }, i) => (
                    <tr
                      key={area}
                      className={`border-b border-border last:border-0 ${
                        i % 2 === 0 ? "bg-background" : "bg-secondary/30"
                      }`}
                    >
                      <td className="px-5 py-3.5 font-semibold text-foreground align-top whitespace-nowrap">
                        {area}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground leading-relaxed">
                        {covers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We do not sell a fixed list of SEO activities and call the job
              finished. We start with the problem, then decide what needs to
              change.
            </p>

            {/* Mid-page CTA #1 — natural after showing the scope of work */}
            <InlineCtaBar waLink={waLink} />
          </section>

          {/* SEO hasn't disappeared because AI arrived */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              SEO Has Not Disappeared Because AI Arrived
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              AI Overviews, AI Mode and other generative search experiences have
              changed how people can discover information. They have not made
              the foundations of search irrelevant.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Google&apos;s current guidance is unusually direct on this point:
              foundational SEO remains the basis for success in AI Search, and
              Google&apos;s generative search features are built on its existing
              ranking systems. That is why we do not treat SEO, AEO and GEO as
              competing disciplines.
            </p>
            <blockquote className="border-l-4 border-accent pl-5 py-0.5">
              <p className="text-xl md:text-2xl font-semibold text-foreground leading-snug">
                Good SEO is still good GEO.
              </p>
            </blockquote>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The terminology may keep changing. Useful information, technical
              accessibility, relevance, expertise and a good website remain
              useful regardless of what the search interface looks like.
            </p>
          </section>

          {/* AEO and GEO without the hype */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              AEO and GEO Without the Hype
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              There is a lot of bad advice around AI search. You do not need to
              rewrite your website into awkward snippets for bots. You do not
              need to manufacture mentions of your brand. You do not need to
              create content that sounds like it was written for a machine.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Google explicitly advises against these approaches and says that
              special files such as{" "}
              <code className="text-sm font-mono bg-secondary px-1.5 py-0.5 rounded">
                llms.txt
              </code>{" "}
              are not required for Google Search. It instead recommends focusing
              on people, useful content, genuine expertise and strong web
              experiences.
            </p>
            <div className="p-6 rounded-2xl border border-border bg-secondary/50 space-y-4">
              <p className="text-xs uppercase font-mono tracking-widest text-muted-foreground">
                Our approach
              </p>
              <p className="text-lg font-semibold text-foreground">
                Create information worth retrieving.
              </p>
              <ul className="space-y-2 text-base text-muted-foreground leading-relaxed">
                {[
                  "Make the business clear.",
                  "Make the information useful.",
                  "Make the website technically sound.",
                  "Show genuine expertise.",
                  "Keep important information current.",
                  "Then make the path from discovery to enquiry work.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Your website needs to keep up with your business */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Your Website Needs to Keep Up With Your Business
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A website can be technically live and still feel abandoned. Old
              service information, outdated dates, broken journeys, neglected
              pages and information that no longer reflects the real business
              can quietly reduce trust. That is the problem we describe as{" "}
              <strong className="text-foreground">digital freshness</strong>.
            </p>

            {/* Digital Freshness diagnostic widget */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/50">
                <p className="text-xs uppercase tracking-widest font-mono text-muted-foreground">
                  Digital Freshness — diagnostic view
                </p>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { label: "Services", status: "current" },
                    { label: "Location", status: "current" },
                    { label: "Contact details", status: "stale" },
                    { label: "Operating hours", status: "current" },
                    { label: "Recent work", status: "stale" },
                    { label: "Pricing", status: "contradictory" },
                  ].map(({ label, status }) => (
                    <div
                      key={label}
                      className={`rounded-lg border px-3.5 py-2.5 flex items-center gap-2 text-sm ${
                        status === "current"
                          ? "border-green-500/30 bg-green-500/5 text-foreground"
                          : status === "stale"
                            ? "border-yellow-500/40 bg-yellow-500/5 text-muted-foreground"
                            : "border-destructive/30 bg-destructive/5 text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          status === "current"
                            ? "bg-green-500"
                            : status === "stale"
                              ? "bg-yellow-400"
                              : "bg-destructive"
                        }`}
                      />
                      <span className="font-medium">{label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/60 mt-4 leading-relaxed">
                  The website is still online. Some of the information it
                  presents no longer matches the real business. Both things can
                  be true at the same time.
                </p>
              </div>
            </div>

            <blockquote className="border-l-4 border-border pl-5 py-0.5">
              <p className="text-lg font-semibold text-foreground">
                Freshness is not changing a date.
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                It means keeping the information people rely on aligned with
                reality.
              </p>
            </blockquote>

            <Button
              variant="outline"
              size="sm"
              className="bg-transparent group"
              asChild
            >
              <Link href="/blog/seo-and-digital-strategy/digital-freshness-trust-zimbabwe-2026-website-audit">
                Read the Digital Freshness research
                <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </section>

          {/* We build for how people actually search */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              We Build for How People Actually Search
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A customer does not always search for your company name. They
              might search for:
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {EXAMPLE_SEARCHES.map((q) => (
                <div
                  key={q}
                  className="px-4 py-3 rounded-lg border border-border bg-secondary/40 font-mono text-sm text-foreground"
                >
                  {q}
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Or they may ask a much longer question that combines location,
              intent and specific requirements. Our job is not simply to add
              those phrases to a page. It is to make sure the business has
              useful, relevant information that can answer those questions. That
              means building around{" "}
              <strong className="text-foreground">search intent</strong>, not
              just keywords.
            </p>
          </section>

          {/* Original information matters more than more content */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Original Information Matters More Than More Content
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The internet already has enough generic articles. Businesses have
              a much stronger advantage when they publish information that comes
              from their own experience, expertise, research and work.
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {ORIGINAL_INFO_TYPES.map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <p className="text-sm font-medium text-foreground">{type}</p>
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Google&apos;s current guidance encourages exactly this type of
              non-commodity content and emphasises first-hand experience,
              internal expertise and unique perspectives. This is one reason our
              search work is closely connected to the research and engineering
              work we publish.
            </p>
          </section>

          {/* Propertyzone: building visibility into the product */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Propertyzone: Building Visibility Into the Product
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Propertyzone is a useful example of what this looks like when
              search is considered as part of the product rather than added
              afterwards. Property discovery involves more than listing
              properties. Someone might search for a specific property, a
              suburb, a type of home, a location or guidance about where to
              live. That requires structured information, useful pages and clear
              relationships between properties, locations and the people
              searching for them.
            </p>
            <div className="relative w-full overflow-hidden rounded-xl border border-border group hover:border-accent transition-colors duration-300">
              <Image
                src="/pz-screenshot-seo-ai.png"
                alt="Propertyzone property listing page showing structured location and listing information"
                width={1200}
                height={675}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="inline-block bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3.5 py-1.5 text-xs text-muted-foreground">
                  Propertyzone — search visibility built into the product
                  architecture
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent group"
              asChild
            >
              <Link href="/work/propertyzone">
                See the Propertyzone work
                <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </section>

          {/* What we measure */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              What We Measure
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We care about search visibility, but visibility is not the final
              outcome. We look at the metrics that matter to the business.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/60">
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      Search signals
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      Business signals
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SEARCH_SIGNALS.map(({ search, business }, i) => (
                    <tr
                      key={search}
                      className={`border-b border-border last:border-0 ${
                        i % 2 === 0 ? "bg-background" : "bg-secondary/30"
                      }`}
                    >
                      <td className="px-5 py-3 text-muted-foreground">
                        {search}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {business}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Google similarly recommends focusing measurement on concrete
              business goals such as leads, sales and sign-ups rather than
              becoming distracted by noisy metrics. Its current guidance also
              notes new Search Console reporting for impressions from AI
              features.
            </p>
          </section>

          {/* When search visibility is the right problem to solve */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              When Search Visibility Is the Right Problem to Solve
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              You may be a good fit when:
            </p>
            <ul className="space-y-2.5">
              {GOOD_FIT.map((item) => (
                <li key={item} className="flex items-start gap-3.5">
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
            <div className="p-5 rounded-xl border border-border bg-secondary/50 space-y-2">
              <p className="text-base font-semibold text-foreground">
                Sometimes we will recommend something else first.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A search campaign will not fix a confusing proposition, a broken
                enquiry process or a website that no longer represents the
                business. When that happens, we address the underlying problem.
              </p>
            </div>

            {/* Mid-page CTA #2 — after the "good fit" list, reader is self-qualifying */}
            <InlineCtaBar waLink={waLink} />
          </section>

          {/* How we approach it */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              How We Approach It
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {HOW_WE_APPROACH.map(({ step, title, description }) => (
                <div
                  key={step}
                  className="p-5 rounded-xl border border-border bg-card space-y-2"
                >
                  <span className="text-3xl font-light font-mono text-muted-foreground/20 block">
                    {step}
                  </span>
                  <h3 className="text-base font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Search should lead somewhere */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Search Should Lead Somewhere
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Getting found is only the beginning. When someone arrives, they
              should quickly understand what you do, why it matters, why they
              should trust you and what they can do next.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              That is why Search Visibility &amp; AI Discovery sits alongside
              Sparkline&apos;s wider work in{" "}
              <Link
                href="/services/solution-architecture"
                className="text-foreground underline underline-offset-4 hover:text-accent transition-colors"
              >
                solution architecture
              </Link>
              ,{" "}
              <Link
                href="/services#systems-engineering"
                className="text-foreground underline underline-offset-4 hover:text-accent transition-colors"
              >
                systems engineering
              </Link>
              ,{" "}
              <Link
                href="/services#integration-automation"
                className="text-foreground underline underline-offset-4 hover:text-accent transition-colors"
              >
                integration and automation
              </Link>{" "}
              and{" "}
              <Link
                href="/services#technical-modernisation"
                className="text-foreground underline underline-offset-4 hover:text-accent transition-colors"
              >
                technical modernisation
              </Link>
              .
            </p>
            <div className="grid gap-2.5">
              {[
                "A visibility problem can become a website problem.",
                "A website problem can become an engineering problem.",
                "An enquiry problem can become an automation problem.",
              ].map((line) => (
                <div
                  key={line}
                  className="px-4 py-3 rounded-lg border border-border bg-secondary/30 text-sm text-muted-foreground"
                >
                  {line}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              We can work across those boundaries.
            </p>
          </section>

          {/* End CTA */}
          <section className="border-t border-border pt-10 space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Start With the Problem, Not an SEO Package
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              You do not need to know whether you need SEO, local SEO, GEO, AEO
              or a website rebuild before talking to us. Tell us what customers
              are searching for, what they currently find and where the journey
              breaks. We&apos;ll work from there.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="group bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <a href="#whatsapp" data-whatsapp-href={waLink}>
                  Assess your search visibility
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent group"
                asChild
              >
                <Link href="/services">
                  All services
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Related links */}
            <div className="pt-6 border-t border-border/50">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Related
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2.5">
                {RELATED_LINKS.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 inline-flex items-center gap-1.5"
                  >
                    {label}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
