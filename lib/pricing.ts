// Starting prices for every engagement. The pricing page renders this in full;
// the services page reads `startingPrice` so both always quote the same figure.

export type PriceLine = {
  name: string;
  /** Label shown before the amount, e.g. "From" or "Recommended". */
  prefix: string;
  amount: string;
  /** Shown after the amount, e.g. "per month". */
  suffix?: string;
  description: string;
};

export type ReadingLink = {
  href: string;
  label: string;
};

export type Engagement = {
  id: string;
  number: string;
  /** Service name, as used across the site. */
  title: string;
  /** Section heading on the pricing page, phrased the way people search. */
  heading: string;
  href: string;
  /** Short directional price used in indexes and on the services page. */
  startingPrice: string;
  summary: string;
  lines: PriceLine[];
  /** Conditions the client should know before engaging. */
  notes?: string[];
  reading: ReadingLink[];
  /** WhatsApp call to action at the end of the service's pricing section. */
  cta: { label: string; message: string };
};

export const ENGAGEMENTS: Engagement[] = [
  {
    id: "solution-architecture",
    cta: {
      label: "Talk to us about your workflow",
      message: "Hi Sparkline, I'd like to discuss solution architecture for my business",
    },
    number: "01",
    title: "Solution Architecture",
    heading: "Solution architecture and software planning costs",
    href: "/services/solution-architecture",
    startingPrice: "From $300",
    summary:
      "We work out what should actually be built before development begins. We only recommend it where the workflow is unique to the business and cannot be served by an existing product or a well-known way of working.",
    lines: [
      {
        name: "Small builds",
        prefix: "From",
        amount: "$300",
        description:
          "Mapping the workflow, the information and the systems involved, then deciding what should be built, integrated or left alone. If an existing tool already fits, we will tell you.",
      },
    ],
    reading: [
      {
        href: "/blog/solutions-engineering/zimbabwe-technology-decision-framework-build-buy-integrate",
        label: "Build, Buy, Integrate or Change the Process?",
      },
      {
        href: "/blog/solutions-engineering/why-buying-software-before-understanding-the-problem-is-expensive",
        label: "Why Buying Software Before Understanding the Problem Is Expensive",
      },
      {
        href: "/blog/solutions-engineering/custom-software-types-zimbabwe-what-it-means",
        label: "Seven Different Things Businesses Call “Custom Software”",
      },
    ],
  },
  {
    id: "systems-engineering",
    cta: {
      label: "Get a quote for your build",
      message: "Hi Sparkline, I'd like a quote for a website or business system",
    },
    number: "02",
    title: "Systems Engineering",
    heading: "Website and custom software development prices",
    href: "/services/systems-engineering",
    startingPrice: "From $350",
    summary:
      "Applied to every new build. We treat a website as the entire system, not a brochure, so even the smallest one is built to capture and measure the enquiries it brings in.",
    lines: [
      {
        name: "Business website",
        prefix: "From",
        amount: "$350",
        description:
          "A website that tracks enquiries and Google Analytics key events as a minimum.",
      },
      {
        name: "Website with a lead management system",
        prefix: "From",
        amount: "$750",
        description:
          "For websites that need a database, lead assignment, lead tracking and the WhatsApp Business API. The final price depends on the requirements.",
      },
      {
        name: "Custom business software",
        prefix: "From",
        amount: "$1,000",
        description:
          "Mobile, desktop or web systems that map the business workflow end to end, from lead generation to deal tracking or other operations. Priced by complexity.",
      },
    ],
    notes: [
      "We do not currently run Google Ads or other paid campaigns. What we build is the foundation that makes them measurable: campaign and platform attribution, so every enquiry can be traced back to where it came from. Whether your internal marketing team or a third-party agency runs the ads, the business can see which campaign or platform is producing results and decide where to spend more.",
    ],
    reading: [
      {
        href: "/blog/seo-and-digital-strategy/zimbabwe-website-whatsapp-click-conversion-system",
        label: "What Should Happen After Someone Clicks “WhatsApp”?",
      },
      {
        href: "/blog/seo-and-digital-strategy/website-leads-operations-gap-zimbabwe",
        label: "When Your Website Generates Leads but Your Business Still Loses Them",
      },
      {
        href: "/blog/solutions-engineering/when-whatsapp-stops-being-enough-signs-business-outgrown-chats",
        label: "When Has a Business Outgrown WhatsApp?",
      },
    ],
  },
  {
    id: "integration-automation",
    cta: {
      label: "Connect your systems",
      message: "Hi Sparkline, I'd like to discuss integrating and automating our systems",
    },
    number: "03",
    title: "Integration & Automation",
    heading: "Business automation and system integration costs",
    href: "/services/integration-automation",
    startingPrice: "From $500",
    summary:
      "Connecting the systems you already use and removing unnecessary manual handoffs. Usually paired with solution architecture.",
    lines: [
      {
        name: "Integration & automation",
        prefix: "From",
        amount: "$500",
        description:
          "Priced by the number of systems involved and the complexity of the workflow between them.",
      },
    ],
    notes: [
      "We cannot automate a workflow that is not understood, or integrate tools when nobody has defined how they should communicate. That is why this work usually starts with solution architecture.",
      "Where the systems involved are legacy and cannot support the integration, such as an older PHP monolith, the work becomes technical modernisation and is priced at that rate.",
    ],
    reading: [
      {
        href: "/blog/solutions-engineering/hidden-cost-manual-work-zimbabwean-businesses",
        label: "The Hidden Cost of Manual Work",
      },
      {
        href: "/blog/seo-and-digital-strategy/whatsapp-lead-capture-crm-scoring-zimbabwe-propertyzone",
        label: "Can WhatsApp Leads Be Captured and Scored Automatically?",
      },
      {
        href: "/blog/solutions-engineering/spreadsheet-problem-when-excel-becomes-unofficial-database-zimbabwe",
        label: "When a Spreadsheet Becomes an Unofficial Database",
      },
    ],
  },
  {
    id: "technical-modernisation",
    cta: {
      label: "Tell us about your existing system",
      message: "Hi Sparkline, I'd like to discuss modernising our existing system",
    },
    number: "04",
    title: "Technical Modernisation",
    heading: "Legacy system modernisation costs",
    href: "/services/technical-modernisation",
    startingPrice: "From $750",
    summary:
      "Improving the software you already have. It costs more than a new build because existing data, logic and behaviour have to be understood and migrated without disrupting the business.",
    lines: [
      {
        name: "Simple systems",
        prefix: "From",
        amount: "$750",
        description: "Systems that can be modernised without a full rebuild.",
      },
      {
        name: "Complex or legacy systems",
        prefix: "From",
        amount: "$1,000",
        description:
          "Systems with no documentation, or built on legacy technology where a full rebuild may be the safer option.",
      },
    ],
    reading: [
      {
        href: "/blog/solutions-engineering/zimbabwe-software-rebuild-cycle-institutional-knowledge",
        label: "Why Zimbabwean Businesses Keep Rebuilding Their Software",
      },
      {
        href: "/blog/solutions-engineering/zimbabwe-software-handover-checklist-developer",
        label: "The Software Handover Test",
      },
      {
        href: "/blog/solutions-engineering/zimbabwe-slow-systems-perceived-latency-operational-cost",
        label: "What Slow Business Systems Cost Operations",
      },
    ],
  },
  {
    id: "search-visibility-ai-discovery",
    cta: {
      label: "Assess your search visibility",
      message: "Hi Sparkline, I'd like to assess my search visibility",
    },
    number: "05",
    title: "Search Visibility & AI Discovery",
    heading: "SEO and AI search visibility pricing",
    href: "/services/search-visibility-ai-discovery",
    startingPrice: "From $250/month",
    summary:
      "A monthly engagement priced around the business's requirements: a fee for the work we do, plus an agreed budget for the activity that earns visibility.",
    lines: [
      {
        name: "Work done",
        prefix: "From",
        amount: "$250",
        suffix: "per month",
        description:
          "Our ongoing work on your visibility. Most engagements first need groundwork from systems engineering or solution architecture: the lead attribution flow, key event set-up, website structure and content hierarchy.",
      },
      {
        name: "Agreed budget",
        prefix: "Recommended",
        amount: "$500+",
        suffix: "per month",
        description:
          "Paid on top of the work fee, and covers link building and similar activity. It varies with the business's budget and needs, but we recommend at least $500 for an engagement that produces results.",
      },
      {
        name: "Team training",
        prefix: "From",
        amount: "$150",
        suffix: "per 1-hour session",
        description:
          "Basic, non-technical SEO fundamentals taught to your content team, at the same price regardless of team size. When the engagement ends, your team can carry on with internal linking, content production and the other work that keeps the site fresh.",
      },
    ],
    notes: [
      "Search visibility does not hold still once the engagement ends. A site that stops being updated loses the digital freshness that keeps it trusted by search engines and AI systems. Training means your team can keep that going without depending on us for every update.",
    ],
    reading: [
      {
        href: "/blog/seo-and-digital-strategy/seo-packages-zimbabwe-keyword-packages-search-intent",
        label: "What’s Actually Included in 20-Keyword SEO Packages?",
      },
      {
        href: "/blog/seo-and-digital-strategy/link-building-zimbabwe-backlinks-seo-domain-rating-authority",
        label: "Link Building and the Authority That Actually Affects Rankings",
      },
      {
        href: "/blog/seo-and-digital-strategy/seo-reporting-zimbabwe-decision-support-ga4-search-console",
        label: "The Measurement Stack That Connects Rankings to Revenue",
      },
      {
        href: "/blog/seo-and-digital-strategy/digital-freshness-trust-zimbabwe-2026-website-audit",
        label: "Website Freshness and Trust: What a 106-Website Audit Found",
      },
    ],
  },
];

export const STARTING_PRICE_BY_ID: Record<string, string> = Object.fromEntries(
  ENGAGEMENTS.map((e) => [e.id, e.startingPrice]),
);
