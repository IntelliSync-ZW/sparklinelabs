import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { caseStudyBySlugQuery } from "@/sanity/lib/queries";
import { PortableTextRenderer, type RichTextValue } from "@/components/portable-text";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";
import { FaqSection } from "@/components/faq";
import { propertyzoneCaseStudyFaqs } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Building Propertyzone — Engineering a Property Platform Around What Happens After the Click",
  description:
    "Propertyzone is not a better-looking property directory. It is an attempt to solve what happens between a property enquiry and an actual conversation, viewing and sale. How Sparkline Labs engineered a lead infrastructure platform for Zimbabwean real estate.",
  keywords: [
    "Building Propertyzone",
    "Propertyzone case study",
    "Zimbabwe real estate technology",
    "WhatsApp lead routing Zimbabwe",
    "solutions engineering Zimbabwe",
    "PropTech Africa",
    "Sparkline Labs",
  ],
  alternates: { canonical: "https://www.sparklinelabs.co.zw/work/propertyzone" },
  openGraph: {
    title: "Building Propertyzone — Engineering a Property Platform Around What Happens After the Click",
    description:
      "A deep dive into building Propertyzone. Diagnosing 13,223 WhatsApp enquiries, unanswered leads, and engineering lead infrastructure around how African property markets actually operate.",
    url: "https://www.sparklinelabs.co.zw/work/propertyzone",
    type: "article",
    publishedTime: "2026-03-15T00:00:00.000Z",
    authors: ["Sparkline Labs"],
    images: [
      {
        url: "/propertyzone.png",
        width: 1200,
        height: 630,
        alt: "Building Propertyzone - Solutions Engineering Case Study by Sparkline Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Building Propertyzone — Solutions Engineering Case Study",
    description:
      "Engineering a property platform around the part of Zimbabwean real estate that usually happens after the click.",
    images: ["/propertyzone.png"],
  },
};

type ArticleAuthor = {
  articleRole?: string;
  author: {
    _id: string;
    name: string;
    slug?: { current: string };
    role?: string;
    company?: string;
    avatar?: { url: string; alt?: string };
    socials?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
      bluesky?: string;
    };
  };
};

type CaseStudy = {
  _id: string;
  title: string;
  slug: { current: string };
  summary?: string;
  headline?: string;
  industry?: string;
  clientName?: string;
  publishedAt?: string;
  readingTime?: number;
  team?: string;
  started?: string;
  live?: string;
  heroImage?: { url: string; alt?: string };
  body?: unknown[];
  problem?: unknown[];
  solution?: unknown[];
  outcomes?: unknown[];
  outcomeMetrics?: { value: string; label: string }[];
  whatsNext?: unknown[];
  testimonialQuote?: string;
  testimonialAuthor?: string;
  authors?: ArticleAuthor[];
  seo?: { title?: string; description?: string; ogImage?: string };
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://www.sparklinelabs.co.zw/work/propertyzone#article",
  headline: "Building Propertyzone: Engineering a property platform around what happens after the click",
  description:
    "Propertyzone is not a better-looking property directory. It is an attempt to solve what happens between a property enquiry and an actual conversation, viewing and sale.",
  image: "https://www.sparklinelabs.co.zw/propertyzone.png",
  datePublished: "2026-03-15",
  author: {
    "@type": "Organization",
    name: "Sparkline Labs",
    url: "https://www.sparklinelabs.co.zw",
  },
  publisher: {
    "@type": "Organization",
    name: "Sparkline Labs",
    logo: { "@type": "ImageObject", url: "https://www.sparklinelabs.co.zw/icon.svg" },
  },
  isPartOf: { "@id": "https://www.sparklinelabs.co.zw/work#collectionpage" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sparklinelabs.co.zw" },
      { "@type": "ListItem", position: 2, name: "Work", item: "https://www.sparklinelabs.co.zw/work" },
      { "@type": "ListItem", position: 3, name: "Propertyzone", item: "https://www.sparklinelabs.co.zw/work/propertyzone" },
    ],
  },
  about: {
    "@type": "SoftwareApplication",
    name: "Propertyzone",
    url: "https://www.propzone.co.zw/en/",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Real Estate Platform",
    operatingSystem: "Web",
    areaServed: { "@type": "Country", name: "Zimbabwe" },
  },
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.propzone.co.zw/#software",
  name: "Propertyzone",
  alternateName: "propzone.co.zw",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Real Estate Platform",
  operatingSystem: "Web",
  url: "https://www.propzone.co.zw/en/",
  description:
    "Zimbabwe's intent-first property listing and lead management platform. Verified EAC-registered agents, intent-tagged listings, structured infrastructure data, and WhatsApp-first lead routing.",
  creator: { "@id": "https://www.sparklinelabs.co.zw/#organization" },
  inLanguage: "en-ZW",
  areaServed: { "@type": "Country", name: "Zimbabwe" },
  availableOnDevice: "Desktop, Mobile",
};

export default async function PropertyzoneCaseStudy() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

  let study: CaseStudy | null = null;
  try {
    study = await sanityFetch<CaseStudy>({
      query: caseStudyBySlugQuery,
      params: { slug: "propertyzone" },
      tags: ["caseStudy"],
    });
  } catch {
    /* Sanity not configured or empty — static fallback below */
  }

  // If Sanity has a rich body or sections populated
  if (study && (study.body?.length || study.problem?.length || study.solution?.length)) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
        <section className="pt-32 pb-8 px-6">
          <div className="container mx-auto max-w-3xl">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              Case study · Property Tech
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6 text-balance">
              {study.title}
            </h1>
            {study.headline && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {study.headline}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Live in production
              </span>
              {study.readingTime && <span>~{study.readingTime} min read</span>}
            </div>
          </div>
        </section>

        {study.heroImage?.url && (
          <div className="px-6 mb-16">
            <div className="container mx-auto max-w-3xl">
              <div className="relative w-full overflow-hidden rounded-2xl border border-border">
                <Image
                  src={study.heroImage.url}
                  alt={study.heroImage.alt ?? "Propertyzone"}
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        )}

        <article className="pb-8 px-6">
          <div className="container mx-auto max-w-3xl space-y-16">
            {study.outcomeMetrics && study.outcomeMetrics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {study.outcomeMetrics.map((m) => (
                  <div key={m.label} className="border border-border rounded-xl p-5 text-center">
                    <p className="text-3xl font-semibold tracking-tight">{m.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            )}

            {study.body && study.body.length > 0 && (
              <div className="space-y-12">
                <PortableTextRenderer value={study.body as RichTextValue} />
              </div>
            )}

            {!study.body && study.problem && study.problem.length > 0 && (
              <section>
                <h2 className="text-3xl font-semibold tracking-tight mb-6">The problem</h2>
                <PortableTextRenderer value={study.problem as RichTextValue} />
              </section>
            )}
            {!study.body && study.solution && study.solution.length > 0 && (
              <section>
                <h2 className="text-3xl font-semibold tracking-tight mb-6">What we built</h2>
                <PortableTextRenderer value={study.solution as RichTextValue} />
              </section>
            )}
            {!study.body && study.outcomes && study.outcomes.length > 0 && (
              <section>
                <h2 className="text-3xl font-semibold tracking-tight mb-6">Outcomes</h2>
                <PortableTextRenderer value={study.outcomes as RichTextValue} />
              </section>
            )}

            <EndCTA waLink={waLink} />
          </div>
          <FaqSection
            faqs={propertyzoneCaseStudyFaqs}
            heading="Questions about building Propertyzone"
          />
        </article>
      </>
    );
  }

  // Static fallback — Complete solutions engineering perspective
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Case study · Solutions Engineering
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6 text-balance">
            Building Propertyzone
          </h1>
          <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-6">
            Engineering a property platform around the part of Zimbabwean real estate that usually happens after the click.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Live in production
            </span>
            <span>~10 min read</span>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <div className="px-6 mb-16">
        <div className="container mx-auto max-w-3xl">
          <div className="relative w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src="/propertyzone.png"
              alt="Propertyzone - Solutions Engineering Case Study"
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Main Narrative Article */}
      <article className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-3xl space-y-16 text-lg leading-relaxed text-muted-foreground">

          {/* Lead Intro */}
          <section className="space-y-6">
            <p className="text-xl md:text-2xl text-foreground leading-relaxed font-normal">
              Propertyzone is not a better-looking property directory. It is an attempt to solve what happens between a property enquiry and an actual conversation, viewing and sale.
            </p>
            <p>
              A property portal can successfully generate an enquiry and still fail the agent. That distinction became difficult to ignore in Zimbabwe.
            </p>
          </section>

          {/* Metrics Highlight Card */}
          <section className="p-8 rounded-2xl border border-border bg-secondary/50 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">13,223</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Enquiries (30 days)</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold tracking-tight text-destructive">2,410</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">No Response</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">5h 20m</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Avg Response Time</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold tracking-tight text-green-600">78%</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Won by First Reply</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border/80 text-sm space-y-3">
              <p>
                Those figures were shared at the Zimbabwe Real Estate and Tech Summit and reported by Techzim in March 2026. PropertyBook&apos;s data suggested an average response time of 5 hours 20 minutes, while roughly one in four enquiries received no response at all. The same summit coverage reported that 78% of buyers ultimately worked with the agent who responded first.
              </p>
              <a
                href="https://www.techzim.co.zw/2026/03/propertybook-unanswered-property-leads/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground hover:text-accent font-medium transition-colors underline underline-offset-4"
              >
                Techzim&apos;s report on unanswered property enquiries
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>

          {/* Section 1 */}
          <section className="space-y-6">
            <p>
              For us, the interesting problem was not simply that agents needed another portal. It was that the property enquiry itself was being treated as the product.
            </p>
            <p className="text-foreground font-medium">
              We wanted to build around what happens next.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              The problem was never just &ldquo;not enough leads&rdquo;
            </h2>
            <p>
              For years, the digital property journey has largely been built around one metric: <strong className="text-foreground">Did the buyer enquire?</strong>
            </p>
            <p>
              But an enquiry is only an event. Someone asking about a house is not necessarily ready to buy it. They may be browsing. They may be comparing prices. They may be asking for somebody else. They may not have their financing arranged. They may be looking in the wrong suburb. They may have clicked WhatsApp simply because it was the easiest button on the screen.
            </p>
            <p>
              And when dozens of those messages arrive across WhatsApp, phone calls, email and property portals, the agent has to work out manually:
            </p>
            <ul className="space-y-2 pl-6 list-disc text-base md:text-lg">
              <li>Who is this person?</li>
              <li>What are they actually looking for?</li>
              <li>Are they buying or renting?</li>
              <li>What is their budget?</li>
              <li>Where do they want to be?</li>
              <li>How soon do they want to move?</li>
              <li>Is the property they asked about still relevant?</li>
              <li>Did somebody already respond?</li>
              <li>What happens if that agent is unavailable?</li>
            </ul>
            <p>
              The software problem is therefore much larger than generating an enquiry. It is the problem of turning an enquiry into something an agency can actually work.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              We separated the enquiry from the lead
            </h2>
            <p>
              This became one of the core design decisions behind Propertyzone.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 p-6 rounded-xl border border-border bg-card">
              <div className="space-y-2">
                <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground">Inbound Event</span>
                <p className="font-semibold text-foreground text-lg">An enquiry</p>
                <p className="text-sm text-muted-foreground">An interaction without context, intent, or readiness.</p>
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase font-mono tracking-widest text-accent">Qualified Asset</span>
                <p className="font-semibold text-foreground text-lg">A lead</p>
                <p className="text-sm text-muted-foreground">An enquiry structured with enough context to become actionable.</p>
              </div>
            </div>
            <p>
              That means the system needs to preserve more than a phone number and a message. It needs to understand intent. A buyer looking for a three-bedroom house in Mount Pleasant with a particular budget is materially different from someone casually asking, &ldquo;Is this still available?&rdquo;
            </p>
            <p>
              The platform therefore structures the information surrounding the interaction instead of leaving it buried inside an undifferentiated message stream.
            </p>
            <p className="text-foreground font-medium">
              The objective is simple: Give the agent enough context to act before they have to start interrogating the customer.
            </p>
            <p>
              That is why Propertyzone captures structured buyer and renter information, connects it to property intent and routes the conversation into the channel agents already use. The software is not trying to force a Zimbabwean property agent to abandon WhatsApp. It is trying to make WhatsApp more useful.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              Why WhatsApp became part of the architecture
            </h2>
            <p>
              A conventional SaaS approach would have been to build a dashboard and expect agents to keep checking it. That would have ignored the market.
            </p>
            <p>
              Zimbabwean agents already coordinate clients, listings, viewings, documents and other agents through WhatsApp. The better engineering question was therefore not:
            </p>
            <blockquote className="border-l-4 border-muted pl-6 italic text-muted-foreground">
              &ldquo;How do we get agents to use our application more?&rdquo;
            </blockquote>
            <p>It was:</p>
            <blockquote className="border-l-4 border-accent pl-6 text-foreground font-medium">
              &ldquo;How do we get the useful information from our system to the place the agent is already working?&rdquo;
            </blockquote>
            <p>
              Propertyzone consequently treats WhatsApp as a delivery layer rather than an afterthought. A direct enquiry can carry the property reference and relevant context into the agent&apos;s existing workflow instead of making the agent reconstruct the conversation from scratch.
            </p>
            <div className="p-5 rounded-xl border border-border bg-card text-sm md:text-base space-y-2">
              <p className="font-semibold text-foreground">A much smaller operational jump:</p>
              <p className="text-foreground">property viewed → enquiry → agent response → conversation</p>
              <p className="text-muted-foreground/60 text-xs">rather than: property viewed → form → dashboard → login → find enquiry → identify property → respond</p>
            </div>
            <p>
              That difference sounds small. At scale, it is operational design.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              The real bottleneck is response capacity
            </h2>
            <p>
              The Techzim summit reporting made the problem visible at market level. The numbers are not simply a story about missed revenue. They expose a workflow problem.
            </p>
            <p>
              If an agency receives a large volume of inbound messages, the limiting resource is no longer the listing catalogue. It is human attention.
            </p>
            <p>
              Agents are expected to remember who asked for what, reply across multiple channels, find alternatives when the requested property is unavailable, follow up with previous prospects and keep listings current while simultaneously conducting viewings and negotiations.
            </p>
            <p className="p-4 rounded-xl border-l-4 border-destructive bg-destructive/5 text-foreground">
              That creates a particularly dangerous category of failure: <strong>the lead that exists, but nobody acts on.</strong>
            </p>
            <p>
              The problem is not solved merely by generating more enquiries. Generating another 1,000 enquiries into a broken follow-up process could make the agency less effective, not more.
            </p>
            <p>
              Propertyzone was therefore designed around the operational question: <strong>How much useful work can we remove from the agent without removing the human relationship that closes the transaction?</strong>
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              From property search to lead infrastructure
            </h2>
            <p>
              This is where Propertyzone differs from treating a portal as a catalogue. The product combines several systems that are normally disconnected:
            </p>

            <div className="grid gap-6">
              <div className="p-6 rounded-xl border border-border bg-card space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Structured property data</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  A listing is not just a title, price and paragraph. Propertyzone structures the attributes that materially affect a Zimbabwean property decision, including tenure, utilities, water, power, solar, borehole information, location and other property-specific information.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Intent-aware enquiries</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  The platform is designed to distinguish between people merely interacting with a listing and prospects whose requirements can be understood and acted upon.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Verified professional supply</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Propertyzone restricts its professional supply to EAC-registered agencies, creating an explicit trust layer around the marketplace rather than treating every listing source as equivalent.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Lead and property matching</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  A buyer&apos;s requirements are useful beyond the first property they enquire about. A customer looking for a particular property today may become a perfect match for another property tomorrow. That makes the lead itself an asset. The system can therefore move toward the reverse relationship as well: <em>new property → find relevant existing demand</em>.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card space-y-2">
                <h3 className="text-xl font-semibold text-foreground">WhatsApp-first execution</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  The system meets agents in the channel they already use rather than trying to retrain the entire market around another inbox.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Local information as structured data</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Propertyzone also treats the surrounding neighbourhood as part of the property decision. Its property pages expose structured information around water, electricity, security, tenure, and utility scoring. Because &ldquo;three-bedroom house in Harare North&rdquo; is not enough information for real buying decisions.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              The agency website is part of the problem too
            </h2>
            <p>
              We did not only look at portals. A large part of the Zimbabwean property journey still ends up on the agency&apos;s own website.
            </p>
            <p>
              Those websites can be useful catalogue and branding systems. They can show available properties, agent names, phone numbers, WhatsApp buttons and contact forms. But there is an important distinction between having a contact mechanism and having a lead system.
            </p>
            <p>
              A buyer can arrive at an agency website, see a property, click WhatsApp or submit an enquiry and still leave the system with little structured context about what they actually want. That means the website becomes another point where demand is generated but not necessarily captured in a way the agency can systematically work.
            </p>
            <p>
              The problem is therefore not that agency websites should disappear. It is that they should become entry points into the agency&apos;s lead workflow.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              The next layer: connecting the agency&apos;s own website to the lead engine
            </h2>
            <p>
              This is an important evolution of the product. Propertyzone should not only capture demand generated inside Propertyzone. It should become infrastructure that can sit underneath an agency&apos;s wider digital presence.
            </p>
            <p>A property seeker should be able to come from:</p>
            <ul className="space-y-1.5 pl-6 list-disc text-base">
              <li>Google → agency website → property page → enquiry</li>
              <li>Facebook → property landing page → WhatsApp</li>
              <li>Propertyzone → enquiry</li>
              <li>WhatsApp → agent</li>
            </ul>
            <p>
              and still produce a coherent lead record. The source should change; the lead should not disappear.
            </p>
            <p>
              That means the next phase of the system should extend the same structured workflow to agency websites through lightweight integrations and enquiry components. The website remains the agency&apos;s brand. Propertyzone becomes part of the operational infrastructure underneath it.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              What we are building towards
            </h2>
            <p>
              The first version of Propertyzone focused on proving the marketplace and the underlying workflow. The next challenge is making the system increasingly useful after the lead arrives:
            </p>
            <div className="grid gap-4">
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="font-semibold text-foreground">Response management</p>
                <p className="text-sm text-muted-foreground mt-1">
                  A visible lifecycle: Received → Contacted → Qualified → Viewing → Negotiation → Closed / Lost. Making &ldquo;unanswered enquiry&rdquo; a system state rather than an invisible failure.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="font-semibold text-foreground">Response-time intelligence</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tracking response velocity: how quickly were enquiries answered, which sources generate the strongest opportunities, and which agents carry the most load.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="font-semibold text-foreground">Lead ownership and reassignment</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ensuring leads don&apos;t drop when an agent is on leave or offline. The relationship belongs to the agency, not an individual memory.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="font-semibold text-foreground">Lead recycling & matching</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Prospects who didn&apos;t buy Property A are surfaced when Property B enters the system, converting historical demand into an active sales asset.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="font-semibold text-foreground">Automated routing</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Intelligent distribution considering property type, suburb, agent specialization, current workload, and availability.
                </p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              The data layer matters as much as the interface
            </h2>
            <p>
              Another lesson from building Propertyzone is that the visible product is only the top layer. A conventional listing can be stored as a block of text. A useful property system needs something much more structured. It needs to understand:
            </p>
            <div className="p-4 rounded-xl border border-border bg-secondary/40 font-mono text-sm text-center text-foreground">
              property → location → infrastructure → tenure → agency → agent → buyer → enquiry → lead → viewing → outcome
            </div>
            <p>
              Once that relationship exists, software can start doing useful work: asking which buyers match this property, which leads have gone untouched, and which infrastructure attributes drive real interest.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              Designing for the Zimbabwean operating environment
            </h2>
            <p>
              Propertyzone was built around conditions that generic software tends to treat as edge cases: mobile devices, WhatsApp, variable connectivity, and field work.
            </p>
            <p>
              A workflow that assumes perfect connectivity, desktop-first usage and constant dashboard monitoring is not a neutral design choice; it is a poor fit. That is why the system has been engineered around lightweight interactions, WhatsApp delivery, caching and workflows that do not assume the agent is sitting at a desk refreshing a CRM all day.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              What we learned building it
            </h2>
            <p>
              The most important lesson was not about property listings. It was about software adoption.
            </p>
            <p>
              Businesses do not adopt systems because the software exists. They adopt them when the software removes a problem they already feel every day. An agent does not wake up wanting a new CRM. They want fewer unanswered enquiries, fewer repetitive WhatsApp conversations, and their customer history to survive staff movement.
            </p>
          </section>

          {/* Section 13 */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              Propertyzone is therefore more than a property portal
            </h2>
            <p>
              The visible interface is property search. The underlying product is much closer to a property demand and lead infrastructure layer. It connects inventory with intent with agents with conversation with follow-up with data.
            </p>
            <p className="text-foreground font-medium">
              The goal is to reduce the distance between: &ldquo;I&apos;m looking for a property&rdquo; and &ldquo;I&apos;m now speaking to the right professional about the right property.&rdquo;
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
              What Sparkline Labs actually built
            </h2>
            <p>
              Propertyzone is our live example of how we approach solutions engineering. We started with a market problem rather than a technology category. We studied how property was actually being searched for, discussed and sold, and built the system around those realities.
            </p>
            <blockquote className="border-l-4 border-accent pl-6 py-1 text-foreground font-medium">
              &ldquo;There is a measurable failure in the workflow. What software architecture can remove it without asking the market to change how it already works?&rdquo;
            </blockquote>
            <p>
              Propertyzone is our answer so far. And we are still building.
            </p>
          </section>

          {/* End CTA */}
          <EndCTA waLink={waLink} />
        </div>
      </article>

      <FaqSection
        faqs={propertyzoneCaseStudyFaqs}
        heading="Questions about building Propertyzone"
      />
    </>
  );
}

function EndCTA({ waLink }: { waLink: string }) {
  return (
    <section className="border-t border-border pt-12 space-y-6">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-left">
        For Businesses with the Same Kind of Problem
      </h2>
      <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
        Propertyzone is one example of a broader way we work at Sparkline Labs. We look for operational bottlenecks that are currently being handled through WhatsApp messages, spreadsheets, forms, manual follow-up and people remembering what happened yesterday. Then we turn those workflows into systems.
      </p>
      <p className="text-base text-foreground font-medium">
        Custom platforms. Internal tools. Lead systems. Integrations. Automation. Built around the business as it actually operates.
      </p>
      <div className="flex flex-wrap gap-4 pt-2">
        <Button
          size="lg"
          className="group bg-accent text-accent-foreground hover:bg-accent/90"
          asChild
        >
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            Book an alignment call on WhatsApp
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
        <Button variant="outline" size="lg" className="bg-transparent" asChild>
          <Link href="/work">All case studies</Link>
        </Button>
        <Button variant="outline" size="lg" className="bg-transparent" asChild>
          <a
            href="https://www.propzone.co.zw/en/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit propzone.co.zw
          </a>
        </Button>
      </div>
    </section>
  );
}
