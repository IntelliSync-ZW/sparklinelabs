import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FaqSection } from "@/components/faq";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Solution Architecture Zimbabwe",
  description:
    "Solution architecture for Zimbabwean businesses. We map the problem, workflows and systems before deciding what should be built, integrated or automated.",
  keywords: [
    "solution architecture Zimbabwe",
    "software architecture Africa",
    "systems design Zimbabwe",
    "technical architecture Harare",
    "business process mapping Zimbabwe",
    "Sparkline Labs architecture",
    "custom software planning Zimbabwe",
  ],
  alternates: {
    canonical: "https://www.sparklinelabs.co.zw/services/solution-architecture",
  },
  openGraph: {
    title: "Solution Architecture for Zimbabwean Businesses | Sparkline Labs",
    description:
      "Before you build software, make sure you are solving the right problem. We map business problems, workflows and constraints to determine what should actually be built.",
    url: "https://www.sparklinelabs.co.zw/services/solution-architecture",
    type: "website",
    images: [
      {
        url: "/solution-architecture-og.jpg",
        width: 1200,
        height: 630,
        alt: "Solution Architecture for Zimbabwean Businesses",
      },
    ],
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
      name: "Solution Architecture for Zimbabwean Businesses",
      item: "https://www.sparklinelabs.co.zw/services/solution-architecture",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id":
    "https://www.sparklinelabs.co.zw/services/solution-architecture#service",
  name: "Solution Architecture for Zimbabwean Businesses",
  description:
    "We map the business problem, the workflows, the information, the people and the constraints, then determine what should be built, integrated, automated, replaced or left alone.",
  provider: {
    "@type": "Organization",
    name: "Sparkline Labs",
    url: "https://www.sparklinelabs.co.zw",
  },
  areaServed: [
    { "@type": "Country", name: "Zimbabwe" },
    { "@type": "Country", name: "Nigeria" },
  ],
};

const WHAT_WE_EXAMINE = [
  { area: "Business processes", covers: "How work actually happens today" },
  {
    area: "Users and roles",
    covers: "Who does what, and where responsibility sits",
  },
  {
    area: "Information",
    covers: "What data exists, where it lives and how it moves",
  },
  {
    area: "Systems",
    covers: "What should connect, remain, change or disappear",
  },
  {
    area: "Workflows",
    covers: "What should happen automatically and what still needs judgement",
  },
  {
    area: "Exceptions",
    covers: "What happens when reality does not follow the happy path",
  },
  {
    area: "Scale",
    covers: "What the solution needs to handle as the business grows",
  },
  {
    area: "Constraints",
    covers:
      "Budget, infrastructure, connectivity, integrations and operational realities",
  },
  {
    area: "Future change",
    covers: "What should be possible without rebuilding everything",
  },
];

const WHAT_WE_PRODUCE = [
  "Process maps",
  "System and integration architecture",
  "Data models",
  "User and permission models",
  "Workflow definitions",
  "Technical decisions",
  "Product structure",
  "Implementation priorities",
  "MVP boundaries",
  "Future-state architecture",
];

const HOW_WE_WORK = [
  {
    step: "01",
    title: "Understand",
    description: "We map the business problem and how the work happens today.",
  },
  {
    step: "02",
    title: "Challenge",
    description:
      "We test assumptions, identify gaps and question whether software is actually the right intervention.",
  },
  {
    step: "03",
    title: "Structure",
    description:
      "We define workflows, information, systems, responsibilities and technical boundaries.",
  },
  {
    step: "04",
    title: "Design",
    description:
      "We turn those decisions into a practical architecture that engineering can build.",
  },
  {
    step: "05",
    title: "Build with intent",
    description:
      "Where Sparkline is responsible for implementation, the architecture becomes the foundation for the engineering work.",
  },
];

const GOOD_FIT = [
  "You are considering building a new business system",
  "Your current systems no longer fit the way the business operates",
  "Several platforms need to work together",
  "You are replacing spreadsheets and manual processes",
  "Different teams need one source of truth",
  "An existing project keeps accumulating features without becoming clearer",
  "You have a product idea but do not know what the first version should contain",
  "You are about to spend significant money on software development",
];

const FAQS = [
  {
    question: "What does a solution architect do?",
    answer:
      "A solution architect connects a business problem to a practical technical solution. That includes understanding workflows, users, information, systems, integrations, constraints and future requirements before major implementation decisions are made.",
  },
  {
    question: "Do I need a solution architect for a small project?",
    answer:
      "Not always. A small, well-understood project may not require a separate architecture phase. The larger the number of users, systems, workflows and business rules involved, the more valuable early architectural decisions tend to become.",
  },
  {
    question: "Is solution architecture the same as software development?",
    answer:
      "No. Architecture determines what the solution should be and how its major parts should work together. Software engineering is the implementation of those decisions. The two should work closely together.",
  },
  {
    question: "Can you work with software we already have?",
    answer:
      "Yes. Existing systems are often part of the solution rather than something to discard immediately. We can assess what should remain, what needs to change and what should connect to something new.",
  },
  {
    question: "Do you only work with large businesses?",
    answer:
      "No. The architecture required depends on the complexity of the problem, not simply the size of the company. A small business with several disconnected workflows can have a surprisingly complex systems problem.",
  },
];

function InlineCtaBar({ waLink, label }: { waLink: string; label: string }) {
  return (
    <div className="flex items-center justify-between gap-6 flex-wrap rounded-xl border border-border bg-secondary/50 px-6 py-5">
      <p className="text-base text-foreground font-medium">{label}</p>
      <Button
        size="sm"
        className="group shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
        asChild
      >
        <a href="#whatsapp" data-whatsapp-href={waLink}>
          Talk to us about your system
          <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      </Button>
    </div>
  );
}

export default function SolutionArchitecturePage() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

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
            Services · Solution Architecture
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-4 text-balance">
            Solution Architecture
          </h1>
          <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-5">
            Before you build software, make sure you are solving the right
            problem.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            The hardest part of a software project is often not writing the
            code. It is deciding what the software should actually do.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            Businesses come to us with fragmented processes, spreadsheets,
            WhatsApp conversations, existing systems, customer complaints and
            ideas for a new platform. Our job is to turn that reality into a
            system that makes sense.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            We map the problem, the workflows, the information, the people and
            the constraints, then determine what should be built, integrated,
            automated, replaced or left alone.
          </p>
          <Button
            size="lg"
            className="group bg-accent text-accent-foreground hover:bg-accent/90"
            asChild
          >
            <a href="#whatsapp" data-whatsapp-href={waLink}>
              Talk to us about your system
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
              src="/solution-architecture-og.jpg"
              alt="Business workflow and system architecture being mapped before software implementation"
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
              priority
              fetchPriority="high"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>
        </div>
      </div>

      {/* Main article */}
      <article className="pb-8 px-6">
        <div className="container mx-auto max-w-3xl space-y-12 md:space-y-16">
          {/* Software should solve the business */}
          <section className="space-y-5 pt-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Software Should Solve the Business, Not Just the Brief
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A brief might say: <em>&ldquo;We need a CRM.&rdquo;</em>
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              But the real problem could be: sales enquiries are arriving from
              five places, nobody knows who owns them, follow-ups are
              inconsistent and management cannot see what is happening.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-5 rounded-xl border border-border bg-card space-y-1.5">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">
                  The brief
                </p>
                <p className="text-base font-medium text-foreground">
                  &ldquo;We need a CRM.&rdquo;
                </p>
                <p className="text-sm text-muted-foreground">
                  Asks for software.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-accent/30 bg-accent/5 space-y-1.5">
                <p className="text-xs font-mono uppercase tracking-widest text-accent/70">
                  The real problem
                </p>
                <p className="text-base font-medium text-foreground">
                  Enquiries are lost and invisible.
                </p>
                <p className="text-sm text-muted-foreground">
                  Asks for a solution.
                </p>
              </div>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Those are very different problems. That distinction shapes
              everything we do.
            </p>
          </section>

          {/* What solution architecture covers */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              What Solution Architecture Covers
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/60">
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      We examine
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      What we are trying to understand
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {WHAT_WE_EXAMINE.map(({ area, covers }, i) => (
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
              The result is not a diagram for its own sake. It is a clearer
              answer to:{" "}
              <strong className="text-foreground">
                What should we build, why should we build it, and how should it
                work?
              </strong>
            </p>
          </section>

          {/* The most expensive decision */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              The Most Expensive Software Decision Can Happen Before Development
              Starts
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              It is easy to start building too early. A business sees a
              competitor&apos;s platform and wants something similar. A team
              starts designing screens. A developer starts setting up the
              database. Then six months later, everyone discovers that the
              original assumption was wrong.
            </p>
            <div className="grid gap-2.5">
              {[
                "Important workflows were missed.",
                "Permissions were never defined.",
                "Edge cases were ignored.",
                "Information exists in the wrong places.",
              ].map((line) => (
                <div
                  key={line}
                  className="px-4 py-3 rounded-lg border border-border bg-secondary/30 text-sm text-muted-foreground"
                >
                  {line}
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The system technically works, but the business has to work around
              it.
            </p>
            <blockquote className="border-l-4 border-accent pl-5 py-0.5">
              <p className="text-lg md:text-xl font-semibold text-foreground leading-snug">
                Good architecture reduces that risk before it becomes expensive.
              </p>
            </blockquote>

            {/* Mid-page CTA #1 */}
            <InlineCtaBar
              waLink={waLink}
              label="Have us pressure-test the idea before development begins."
            />
          </section>

          {/* We do not assume everything needs custom software */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              We Do Not Assume Everything Needs Custom Software
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Sometimes the right answer is a new application. Sometimes it is
              an integration. Sometimes it is automation. Sometimes an existing
              platform is sufficient. Sometimes the current system can be
              repaired. And sometimes the business has a process problem that
              software should not be used to hide.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-5 rounded-xl border border-border bg-secondary/40 space-y-1">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">
                  The wrong starting question
                </p>
                <p className="text-base font-medium text-muted-foreground italic">
                  &ldquo;What technology should we use?&rdquo;
                </p>
              </div>
              <div className="p-5 rounded-xl border border-accent/30 bg-accent/5 space-y-1">
                <p className="text-xs font-mono uppercase tracking-widest text-accent/70">
                  The right starting question
                </p>
                <p className="text-base font-semibold text-foreground">
                  &ldquo;What needs to become better?&rdquo;
                </p>
              </div>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Then technology follows the decision.
            </p>
          </section>

          {/* Architecture is where business rules become explicit */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Architecture Is Where Business Rules Become Explicit
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A system needs to know more than what happens when everything goes
              correctly. Consider a property enquiry: someone sees a listing,
              asks a question and an agent responds. But what happens if&hellip;
            </p>
            <div className="p-5 rounded-xl border border-border bg-secondary/40 space-y-2">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "The property has already been taken?",
                  "The buyer changes their requirements?",
                  "Several agents are involved?",
                  "The enquiry comes through WhatsApp?",
                  "The customer does not respond?",
                  "The property information changes?",
                  "The same person enquires about several properties?",
                ].map((q) => (
                  <li key={q} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              These are not minor development details. They are part of the
              architecture. A system that only handles the happy path is not
              finished.
            </p>
          </section>

          {/* Propertyzone */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Propertyzone: Architecture Before Features
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Propertyzone is a good example of why the distinction matters. The
              platform is not simply a collection of property listings. Behind
              each listing is a set of relationships between properties,
              locations, agencies, enquiries, users and the information required
              to help someone move from discovery toward an actual conversation.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The architecture had to account for both sides of the marketplace:
              what exists, and what someone is looking for. That shaped how the
              product handles structured property information, discovery,
              enquiries and the wider journey around a property.
            </p>
            <div className="relative w-full overflow-hidden rounded-xl border border-border group hover:border-accent transition-colors duration-300">
              <Image
                src="/pz-screenshot-seo-ai.png"
                alt="Propertyzone listing and discovery experience — the visible result of careful system design"
                width={1200}
                height={675}
                loading="lazy"
                sizes="(min-width: 768px) 768px, 100vw"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="inline-block bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3.5 py-1.5 text-xs text-muted-foreground">
                  Propertyzone — architecture connects inventory, user intent
                  and enquiry data
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

          {/* What we produce */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              What We Produce
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Depending on the project, solution architecture can produce:
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {WHAT_WE_PRODUCE.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <p className="text-sm font-medium text-foreground">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The deliverable is not a document that gets filed away. It becomes
              the foundation for the engineering work that follows.
            </p>
          </section>

          {/* The best architecture is usually less complicated */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              The Best Architecture Is Usually Less Complicated Than the First
              Idea
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Complexity can make a proposal sound impressive. It does not
              necessarily make the system better. We look for opportunities to
              remove unnecessary steps, duplicated data, disconnected systems
              and features that do not meaningfully improve the outcome.
            </p>
            <div className="grid gap-2.5">
              {[
                "Sometimes that means building less.",
                "Sometimes it means integrating something that already exists.",
                "Sometimes it means redesigning the workflow before touching the software.",
              ].map((line) => (
                <div
                  key={line}
                  className="px-4 py-3 rounded-lg border border-border bg-secondary/30 text-sm text-muted-foreground"
                >
                  {line}
                </div>
              ))}
            </div>
            <blockquote className="border-l-4 border-border pl-5 py-0.5">
              <p className="text-lg font-semibold text-foreground">
                Simpler is not always better.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Unnecessary complexity is always expensive.
              </p>
            </blockquote>

            {/* Mid-page CTA #2 */}
            <InlineCtaBar
              waLink={waLink}
              label="Bring us the messy process or the ambitious idea. We will help determine what actually needs to exist."
            />
          </section>

          {/* Built for the environment */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Built for the Environment the Business Actually Operates In
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Architecture has to survive contact with reality. That includes:
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {[
                "Existing software",
                "Third-party systems",
                "Unreliable or variable connectivity",
                "Operational workarounds",
                "Different user roles",
                "Manual processes",
                "Data quality",
                "Growth",
                "Maintenance",
                "Real customer behaviour",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-card"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We do not design a theoretical system and leave the implementation
              team to discover the difficult parts later. The difficult parts
              are exactly what architecture is supposed to expose.
            </p>
          </section>

          {/* How we work */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              How We Work
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {HOW_WE_WORK.map(({ step, title, description }) => (
                <div
                  key={step}
                  className={`p-5 rounded-xl border border-border bg-card space-y-2 ${
                    step === "05" ? "sm:col-span-2" : ""
                  }`}
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

          {/* When to involve us */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              When You Should Involve Us
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Solution architecture is particularly valuable when:
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
            <div className="p-5 rounded-xl border border-border bg-secondary/50">
              <p className="text-base font-semibold text-foreground">
                Sometimes a conversation now is cheaper than a rebuild later.
              </p>
            </div>
          </section>

          {/* When we would tell you not to build */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              And When We Would Tell You Not to Build
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We are comfortable saying no.
            </p>
            <div className="grid gap-2.5">
              {[
                "We may recommend against custom software when an existing solution already handles the requirement properly.",
                "We may recommend fixing a process before automating it.",
                "We may recommend repairing an existing system rather than replacing it.",
                "We may recommend a smaller first version when the business has not yet validated the larger idea.",
              ].map((line) => (
                <div
                  key={line}
                  className="px-4 py-3 rounded-lg border border-border bg-secondary/30 text-sm text-muted-foreground leading-relaxed"
                >
                  {line}
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The objective is not to create more software. It is to create the{" "}
              <strong className="text-foreground">right solution</strong>.
            </p>
          </section>

          {/* From architecture to engineering */}
          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              From Architecture to Engineering
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Once the decisions are clear, the next question is execution. That
              is where Sparkline&apos;s{" "}
              <Link
                href="/services#systems-engineering"
                className="text-foreground underline underline-offset-4 hover:text-accent transition-colors"
              >
                systems engineering
              </Link>{" "}
              capability takes over. The architecture defines what needs to
              exist and how the pieces should work together. Engineering turns
              that into software that has to survive real users, real data and
              real exceptions.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent group"
              asChild
            >
              <Link href="/services#systems-engineering">
                Explore Systems Engineering
                <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </section>

          {/* End CTA */}
          <section className="border-t border-border pt-10 space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Build Less Blindly.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-medium">
                Build what the business actually needs.
              </p>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Tell us what is happening today, what is not working, and what you
              are considering building. We will start from there.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="group bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <a href="#whatsapp" data-whatsapp-href={waLink}>
                  Talk to Sparkline Labs
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
            <div className="pt-6 border-t border-border/50">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Related
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2.5">
                {[
                  {
                    href: "/blog/solutions-engineering/zimbabwe-technology-decision-framework-build-buy-integrate",
                    label: "Build, Buy, Integrate or Change the Process?",
                  },
                  {
                    href: "/blog/solutions-engineering/why-buying-software-before-understanding-the-problem-is-expensive",
                    label:
                      "Why Buying Software Before Understanding the Problem Is Expensive",
                  },
                  { href: "/work/propertyzone", label: "Propertyzone" },
                  {
                    href: "/services/search-visibility-ai-discovery",
                    label: "Search Visibility & AI Discovery",
                  },
                ].map(({ href, label }) => (
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

      <FaqSection faqs={FAQS} heading="Questions about solution architecture" />
    </>
  );
}
