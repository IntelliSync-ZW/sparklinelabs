import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTA } from "@/components/cta";
import { FaqSection } from "@/components/faq";
import { WA_PROJECT_LINK, waLink } from "@/lib/config";
import {
  ENGAGEMENTS,
  type Engagement,
  type PriceLine,
  type ReadingLink,
} from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Website, Software & SEO Prices in Zimbabwe",
  description:
    "How much does a website, custom software or SEO cost in Zimbabwe? Business websites from $350, custom software from $1,000, automation from $500 and SEO from $250 a month.",
  keywords: [
    "website prices Zimbabwe",
    "how much does a website cost in Zimbabwe",
    "website design cost Harare",
    "custom software development cost Zimbabwe",
    "SEO prices Zimbabwe",
    "SEO packages Zimbabwe",
    "business automation cost Zimbabwe",
    "SEO training Zimbabwe",
  ],
  alternates: {
    canonical: "https://www.sparklinelabs.co.zw/pricing",
  },
  openGraph: {
    title: "Website, Software & SEO Prices in Zimbabwe | Sparkline Labs",
    description:
      "Starting prices for websites, custom software, automation, modernisation and SEO in Zimbabwe, and what moves the final figure.",
    url: "https://www.sparklinelabs.co.zw/pricing",
    type: "website",
  },
};

const PRICE_FACTORS = [
  {
    title: "System complexity",
    description:
      "How many users, roles, workflows, exceptions and integrations are involved.",
  },
  {
    title: "Documentation",
    description:
      "Undocumented systems have to be understood before they can be changed safely.",
  },
  {
    title: "What the business actually needs",
    description:
      "Two businesses asking for the same thing rarely need the same thing.",
  },
];

const AFTER_LAUNCH = [
  {
    title: "Support and bug fixes",
    price: "Free",
    suffix: "for 2 months",
    description:
      "Every system we build includes two months of support and bug fixes after launch.",
  },
  {
    title: "Ongoing maintenance",
    price: "From $150",
    suffix: "per month, from month 3",
    description:
      "Keeping the system updated, secure and running well. We discuss what it should cover as the free period comes to an end.",
  },
];

const NOT_INCLUDED = [
  {
    title: "Domain registration",
    description:
      "A .co.zw domain costs roughly $2 to $6 a year, depending on the registrar.",
  },
  {
    title: "Hosting and infrastructure",
    description:
      "Servers, databases and other infrastructure, priced by the provider and the size of the system.",
  },
  {
    title: "Business email",
    description:
      "Email services such as Google Workspace or Microsoft 365, priced per user by the provider.",
  },
  {
    title: "Paid advertising",
    description:
      "We do not currently run Google Ads or other paid campaigns, and ad spend is paid to the platforms directly. Our systems track which campaigns and platforms produce enquiries.",
  },
  {
    title: "Other third-party services",
    description:
      "Paid tools and APIs the system depends on, such as the WhatsApp Business API, billed by each provider.",
  },
];

const BUDGET_READING: ReadingLink[] = [
  {
    href: "/blog/seo-and-digital-strategy/software-total-cost-of-ownership-zimbabwe",
    label: "The Hidden Cost of Software Nobody Budgets For",
  },
  {
    href: "/blog/software-industry/will-ai-make-software-cheaper-zimbabwe",
    label: "Will AI Make Software Cheaper? Why the Code Cost Was Never the Problem",
  },
];

const FAQS = [
  {
    question: "How do we get an exact quote?",
    answer:
      "<p>Tell us what isn't working on WhatsApp. We ask about the workflow, the systems involved and what the business needs, then confirm the price before any work begins.</p>",
  },
  {
    question: "Do you charge for a discovery phase?",
    answer:
      "<p>Not always. A paid discovery only makes sense when the problem or the solution is genuinely unclear. If the workflow is already understood, we move straight to a pilot or the build.</p>",
  },
  {
    question: "Can we start small and add to the system later?",
    answer:
      "<p>Yes. We often start with the smallest version that solves the problem and build on it once the workflow has proven itself. We design the architecture so that new requirements do not force a rebuild.</p>",
  },
  {
    question: "Can you take over a system another company built?",
    answer:
      "<p>Yes. We assess what exists before quoting. Well-documented systems can often be extended. Undocumented or legacy systems usually fall under technical modernisation pricing. Our <a href=\"/blog/solutions-engineering/zimbabwe-software-handover-checklist-developer\">software handover checklist</a> shows what you should have before a developer leaves.</p>",
  },
  {
    question: "Do you sell SEO packages based on a number of keywords?",
    answer:
      "<p>No. Keyword counts say little about whether the right people will find the business. We explain why in <a href=\"/blog/seo-and-digital-strategy/seo-packages-zimbabwe-keyword-packages-search-intent\">What's Actually Included in 20-Keyword SEO Packages?</a></p>",
  },
  {
    question: "What does the SEO training cover?",
    answer:
      "<p>Basic, non-technical SEO fundamentals for your content team: internal linking, producing useful content and keeping the site's information current. It does not cover technical SEO.</p>",
  },
  {
    question: "Can you train our team if you did not build our website?",
    answer:
      "<p>Yes, though we do not recommend it. Not every website is built to the standard we work to, and good content cannot fully make up for a weak structure. Where we do train teams on sites we did not build, we adapt the training to the site without compromising on what we teach.</p>",
  },
];

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
      name: "Pricing",
      item: "https://www.sparklinelabs.co.zw/pricing",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer.replace(/<[^>]+>/g, ""),
    },
  })),
};

function ReadingList({
  links,
  heading = "Further reading",
}: {
  links: ReadingLink[];
  heading?: string;
}) {
  return (
    <div>
      <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
        {heading}
      </p>
      <ul className="space-y-3">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-base md:text-lg text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 inline-flex items-start gap-2"
            >
              {label}
              <ArrowRight className="h-4 w-4 mt-1.5 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PriceRow({ line }: { line: PriceLine }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-8 gap-y-2 py-6 border-t border-border first:border-t-0 first:pt-0">
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-foreground">{line.name}</h3>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
          {line.description}
        </p>
      </div>
      <div className="sm:text-right order-first sm:order-none">
        <p className="text-base uppercase tracking-widest text-muted-foreground">
          {line.prefix}
        </p>
        <p className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">
          {line.amount}
        </p>
        {line.suffix && (
          <p className="text-base text-muted-foreground">{line.suffix}</p>
        )}
      </div>
    </div>
  );
}

function EngagementSection({ engagement }: { engagement: Engagement }) {
  const ctaLink = waLink(encodeURIComponent(engagement.cta.message));

  return (
    <section
      id={engagement.id}
      className="scroll-mt-28 py-16 md:py-20 border-t border-border grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16"
    >
      <div className="md:sticky md:top-28 md:self-start space-y-4">
        <p className="text-base uppercase tracking-widest text-muted-foreground">
          {engagement.number} · {engagement.title}
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
          {engagement.heading}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {engagement.summary}
        </p>
        <Link
          href={engagement.href}
          className="text-base font-medium text-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
        >
          Full service overview
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-10">
        <div>
          {engagement.lines.map((line) => (
            <PriceRow key={line.name} line={line} />
          ))}
        </div>

        {engagement.notes && (
          <div className="pl-5 border-l-2 border-accent space-y-3">
            <p className="text-base uppercase tracking-widest text-muted-foreground">
              Good to know
            </p>
            {engagement.notes.map((note) => (
              <p
                key={note}
                className="text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                {note}
              </p>
            ))}
          </div>
        )}

        <ReadingList links={engagement.reading} />

        <div className="pt-8 border-t border-border">
          <Button
            size="lg"
            className="group text-base bg-accent text-accent-foreground hover:bg-accent/90"
            asChild
          >
            <a href="#whatsapp" data-whatsapp-href={ctaLink}>
              {engagement.cta.label}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pb-20 px-6">
        <div className="container mx-auto max-w-5xl grid gap-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16 md:items-end">
          <div>
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-3">
              Pricing
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-4 text-balance">
              Website, Software and SEO Prices in Zimbabwe
            </h1>
            <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-5">
              What it costs to work with us.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4 max-w-xl">
              We start from the business problem, not a predetermined
              technology package. So every figure on this page is a starting
              point, not a fixed price. Most are once off, and none include
              hosting or domains.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
              The final price depends on how complex the system is, how well
              what already exists is documented, and what the business actually
              needs. We confirm it once we understand the problem.
            </p>
            <Button
              size="lg"
              className="group bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <a href="#whatsapp" data-whatsapp-href={WA_PROJECT_LINK}>
                Tell us what isn&apos;t working
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>

          {/* Index */}
          <nav aria-label="Starting prices by service">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-3">
              At a glance
            </p>
            <ol className="divide-y divide-border border-y border-border">
              {ENGAGEMENTS.map((e) => (
                <li key={e.id}>
                  <a
                    href={`#${e.id}`}
                    className="group flex items-baseline justify-between gap-4 py-3.5 text-lg"
                  >
                    <span className="text-foreground group-hover:underline underline-offset-4">
                      {e.title}
                    </span>
                    <span className="text-muted-foreground tabular-nums whitespace-nowrap">
                      {e.startingPrice}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* Engagements */}
      <div className="px-6">
        <div className="container mx-auto max-w-5xl">
          {ENGAGEMENTS.map((engagement) => (
            <EngagementSection key={engagement.id} engagement={engagement} />
          ))}
        </div>
      </div>

      {/* After launch */}
      <section id="after-launch" className="px-6 py-16 md:py-24 border-t border-border scroll-mt-28">
        <div className="container mx-auto max-w-5xl grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <div className="space-y-4">
            <p className="text-base uppercase tracking-widest text-muted-foreground">
              After launch
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
              Once-off build prices, then support and maintenance
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most of our prices are once off. You pay for the build, not a
              subscription to keep it. Only search visibility and maintenance
              after the free support period are monthly.
            </p>
          </div>
          <div className="space-y-10">
            <div>
              {AFTER_LAUNCH.map((item) => (
                <div
                  key={item.title}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-8 gap-y-2 py-6 border-t border-border first:border-t-0 first:pt-0"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                      {item.description}
                    </p>
                  </div>
                  <div className="sm:text-right order-first sm:order-none">
                    <p className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">
                      {item.price}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {item.suffix}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pl-5 border-l-2 border-accent space-y-3">
              <p className="text-base uppercase tracking-widest text-muted-foreground">
                Maintenance is not search visibility
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Maintenance keeps the system working. It does not make the
                business easier to find. A $350 website, for example, still
                needs ongoing{" "}
                <a
                  href="#search-visibility-ai-discovery"
                  className="text-foreground underline underline-offset-4 hover:text-accent transition-colors"
                >
                  search visibility and AI discovery
                </a>{" "}
                work to keep earning enquiries, and that is priced separately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Not included */}
      <section id="not-included" className="px-6 py-16 md:py-24 border-t border-border scroll-mt-28">
        <div className="container mx-auto max-w-5xl grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <div className="space-y-4">
            <p className="text-base uppercase tracking-widest text-muted-foreground">
              Not included
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
              We do not sell hosting or domains
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our prices cover our work. Domains, hosting, email and other
              third-party services are priced differently by each provider,
              and the business pays for them directly.
            </p>
          </div>
          <div className="space-y-10">
            <ul className="divide-y divide-border border-y border-border">
              {NOT_INCLUDED.map((item) => (
                <li key={item.title} className="py-5 space-y-1">
                  <p className="text-xl font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                Your accounts, in your name, from day one
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Most of what a business expects to be handed over at the end
                of a project is already in its rightful place. Your domain,
                hosting and other accounts are registered in your name, paid
                from your card or accounts, and the passwords are yours. You
                give us access so we can make sure your systems run on them
                properly. What we hand over is the source code.
              </p>
              <ReadingList
                links={[
                  {
                    href: "/blog/solutions-engineering/zimbabwe-software-handover-checklist-developer",
                    label: "The Software Handover Test: 37 Things a Business Should Own",
                  },
                  {
                    href: "/blog/seo-and-digital-strategy/software-total-cost-of-ownership-zimbabwe",
                    label: "The Hidden Cost of Software Nobody Budgets For",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* One engagement, not four acronyms */}
      <section className="px-6 py-16 md:py-24 bg-secondary">
        <div className="container mx-auto max-w-3xl space-y-6">
          <p className="text-base uppercase tracking-widest text-muted-foreground">
            On search visibility
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">
            We do not sell SEO, AEO, GEO or AIO separately.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            They are not services we offer on their own. Our search visibility
            and AI discovery work exists to make sure the business is easy to
            find, understand and choose, in Google and in AI-generated answers.
            One engagement covers all of it.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            The same applies to content. We do not charge for content
            production as a separate service or deliverable. It is a means to
            visibility, not the thing you are paying for.
          </p>
          <ReadingList
            links={[
              {
                href: "/blog/seo-and-digital-strategy/ai-optimization-zimbabwe-aeo-geo-ai-search-visibility",
                label: "When AI Visibility Becomes an Information Architecture Problem",
              },
              {
                href: "/blog/seo-and-digital-strategy/built-not-found-zimbabwe-seo-ai-visibility",
                label: "Built, But Not Found",
              },
            ]}
          />
        </div>
      </section>

      {/* What moves the price */}
      <section className="px-6 py-16 md:py-24">
        <div className="container mx-auto max-w-5xl grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                What moves the final price
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                The starting price covers the simplest version of each
                engagement. These are the things that take it higher.
              </p>
            </div>
            <ReadingList links={BUDGET_READING} heading="Before you budget" />
          </div>
          <ol className="divide-y divide-border border-y border-border">
            {PRICE_FACTORS.map((f, i) => (
              <li key={f.title} className="flex gap-6 py-5">
                <span className="text-base font-mono text-muted-foreground pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="space-y-1">
                  <p className="text-xl font-medium text-foreground">
                    {f.title}
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FaqSection faqs={FAQS} heading="Questions about pricing" />

      <CTA />
    </>
  );
}
