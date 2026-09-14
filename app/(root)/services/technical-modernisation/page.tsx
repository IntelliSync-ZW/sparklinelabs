import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/faq";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Software Modernisation Zimbabwe | Legacy Systems Modernisation",
  description:
    "Modernise existing software without throwing away what still works. We refactor, re-architect, migrate and replace legacy systems where the business needs it.",
  keywords: [
    "technical modernisation Zimbabwe",
    "legacy software modernisation Zimbabwe",
    "software modernisation Africa",
    "legacy application development Harare",
    "technical debt Zimbabwe",
    "software architecture modernisation",
    "Sparkline Labs modernisation",
  ],
  alternates: {
    canonical:
      "https://www.sparklinelabs.co.zw/services/technical-modernisation",
  },
  openGraph: {
    title: "Technical Modernisation for Zimbabwean Businesses | Sparkline Labs",
    description:
      "Improve what already exists before you replace it. We modernise software, infrastructure and technical foundations so businesses can extend the useful life of what they already have.",
    url: "https://www.sparklinelabs.co.zw/services/technical-modernisation",
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
      name: "Technical Modernisation for Zimbabwean Businesses",
      item: "https://www.sparklinelabs.co.zw/services/technical-modernisation",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id":
    "https://www.sparklinelabs.co.zw/services/technical-modernisation#service",
  name: "Technical Modernisation for Zimbabwean Businesses",
  description:
    "We modernise existing software, infrastructure and technical foundations so businesses can extend the useful life of what they already have without being trapped by it.",
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

const MODERNISATION_AREAS = [
  {
    area: "Legacy applications",
    covers: "Refactoring, restructuring and improving older codebases",
  },
  {
    area: "Architecture",
    covers: "Reducing unnecessary complexity and improving system boundaries",
  },
  {
    area: "Infrastructure",
    covers:
      "Improving deployment, hosting, environments and operational reliability",
  },
  {
    area: "Performance",
    covers: "Identifying and removing technical bottlenecks",
  },
  {
    area: "Data",
    covers: "Cleaning up models, access patterns and data flows",
  },
  {
    area: "Integrations",
    covers: "Replacing fragile connections and preparing systems for new ones",
  },
  {
    area: "Security",
    covers:
      "Addressing outdated dependencies, access patterns and technical weaknesses",
  },
  {
    area: "Deployment",
    covers: "Improving repeatability, testing and release processes",
  },
  {
    area: "Scalability",
    covers:
      "Preparing systems for increased users, transactions or operational demands",
  },
];

const MODERNISATION_APPROACHES = [
  {
    title: "Refactoring",
    description:
      "Improve difficult code without changing the business behaviour unnecessarily.",
  },
  {
    title: "Re-platforming",
    description:
      "Move software onto a more suitable infrastructure or deployment environment.",
  },
  {
    title: "Re-architecting",
    description:
      "Change how the major parts of the system interact when the existing architecture has become a constraint.",
  },
  {
    title: "Incremental replacement",
    description:
      "Replace components progressively rather than forcing a single high-risk rewrite.",
  },
  {
    title: "Migration",
    description:
      "Move data, functionality or workloads to a new environment while protecting continuity.",
  },
  {
    title: "Stabilisation",
    description:
      "Address the technical problems creating immediate operational risk before pursuing larger changes.",
  },
];

const SYSTEM_KNOWLEDGE = [
  "pricing",
  "approvals",
  "user permissions",
  "customer records",
  "financial transactions",
  "reporting",
  "integrations",
  "exceptions",
  "operational workarounds",
];

const RISK_QUESTIONS = [
  {
    question: "What could fail?",
    reason: "Identifies operational and technical risk",
  },
  {
    question: "What cannot be interrupted?",
    reason: "Protects critical business functions",
  },
  {
    question: "What data must be preserved?",
    reason: "Prevents expensive migration mistakes",
  },
  {
    question: "What should change first?",
    reason: "Creates a practical sequence",
  },
  { question: "What can wait?", reason: "Avoids unnecessary scope" },
  {
    question: "What will the business need next?",
    reason: "Prevents modernisation from becoming another dead end",
  },
];

const GOOD_FIT = [
  "Your existing software is difficult to change",
  "Developers spend more time understanding the system than improving it",
  "A legacy dependency is becoming a business risk",
  "Performance is deteriorating",
  "You need integrations the system was never designed to support",
  "Infrastructure has become difficult to manage",
  "Technical debt is slowing product development",
  "You want to replace the system gradually rather than all at once",
  "The software still works but no longer fits the business",
];

const DELIVERY_STEPS = [
  {
    step: "01",
    title: "Assess",
    description:
      "Understand the codebase, infrastructure, data, dependencies and operational requirements.",
  },
  {
    step: "02",
    title: "Stabilise",
    description:
      "Address the problems creating immediate risk or blocking progress.",
  },
  {
    step: "03",
    title: "Prioritise",
    description:
      "Separate urgent technical issues from improvements that can happen later.",
  },
  {
    step: "04",
    title: "Modernise",
    description:
      "Refactor, re-platform, re-architect, migrate or replace the components that need intervention.",
  },
  {
    step: "05",
    title: "Improve",
    description:
      "Leave the business with a system that is easier to operate, maintain and change.",
  },
];

const FAQS = [
  {
    question: "What is technical modernisation?",
    answer:
      "Technical modernisation is the process of improving an existing software system so that it is easier to maintain, operate, integrate, secure and evolve. It does not necessarily mean replacing the entire system.",
  },
  {
    question: "Is technical modernisation the same as a rewrite?",
    answer:
      "No. A rewrite is one possible strategy. Modernisation may instead involve refactoring, infrastructure changes, incremental replacement, migration or architectural improvements.",
  },
  {
    question: "Can you modernise software another company built?",
    answer:
      "Yes. The first step is understanding what exists and identifying the constraints. The goal is to improve the system without assuming that everything the previous team built is unusable.",
  },
  {
    question: "How do we know whether to modernise or rebuild?",
    answer:
      "We assess the architecture, codebase, data, dependencies, business rules and future requirements. The decision should be based on risk, cost, maintainability and what the business needs next.",
  },
  {
    question: "Can modernisation happen without downtime?",
    answer:
      "Often, yes. The approach depends on the system, but incremental changes can reduce the need for a single high-risk migration or replacement.",
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
          Talk to us
          <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      </Button>
    </div>
  );
}

export default function TechnicalModernisationPage() {
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

      <section className="pt-32 pb-12 px-6 border-b border-border">
        <div className="container mx-auto max-w-3xl">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-3">
            Services · Technical Modernisation
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-4 text-balance">
            Technical Modernisation
          </h1>
          <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-5">
            Improve what already exists before you replace it.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            Not every business needs a new system. Sometimes the software is
            fundamentally useful, but the technology underneath has become
            difficult to maintain, expensive to change or unable to support what
            the business now needs.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            Sparkline Labs modernises existing software, infrastructure and
            technical foundations so businesses can extend the useful life of
            what they already have without being trapped by it.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            We assess what should stay, what should change and what should
            eventually be replaced.
          </p>
          <Button
            size="lg"
            className="group bg-accent text-accent-foreground hover:bg-accent/90"
            asChild
          >
            <a href="#whatsapp" data-whatsapp-href={waLink}>
              Talk to us about your existing system
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </section>

      <div className="px-6 py-8 bg-secondary/40">
        <div className="container mx-auto max-w-3xl">
          <div className="relative w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src="/technical-modernisation.png"
              alt="Existing software architecture being modernised while functional components are retained"
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <article className="pb-16 md:pb-24 px-6">
        <div className="container mx-auto max-w-3xl space-y-12 md:space-y-16">
          <section className="space-y-5 pt-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Old Software Is Not Always the Problem
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A system can be old and still be perfectly useful. A newer system
              can also be badly designed. The real question is whether the
              technology still supports the business.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Problems usually become visible through symptoms:
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {[
                "Every change takes too long.",
                "Small fixes keep breaking other things.",
                "Nobody wants to touch the code.",
                "The system depends on one person.",
                "New integrations are becoming difficult.",
                "Performance has deteriorated.",
                "Security and infrastructure have fallen behind.",
                "The business has outgrown the original design.",
              ].map((symptom) => (
                <div
                  key={symptom}
                  className="px-4 py-3 rounded-lg border border-border bg-secondary/30 text-sm text-muted-foreground"
                >
                  {symptom}
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Those symptoms do not automatically mean{" "}
              <em>&ldquo;rewrite everything.&rdquo;</em> They mean the system
              needs to be understood.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              What We Modernise
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/60">
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      Area
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      What we can address
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MODERNISATION_AREAS.map(({ area, covers }, index) => (
                    <tr
                      key={area}
                      className={`border-b border-border last:border-0 ${index % 2 === 0 ? "bg-background" : "bg-secondary/30"}`}
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
              The scope depends on what is actually holding the system back.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              A Rewrite Is Not a Strategy
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              <em>&ldquo;Let&apos;s rebuild it from scratch&rdquo;</em> can
              sound attractive. You get a clean codebase, a modern stack and a
              fresh start.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Then the team discovers that the old system contained years of
              business rules, exceptions and operational knowledge that were
              never documented. The new version looks cleaner. The business
              works worse.
            </p>
            <div className="p-5 rounded-xl border border-accent/30 bg-accent/5">
              <p className="text-lg md:text-xl font-semibold text-foreground">
                We do not recommend a rewrite simply because the technology is
                old.
              </p>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We first determine what the existing system knows, what it does
              well, where it is failing and what the business now needs.
              Sometimes the answer is a rebuild. Often it is not.
            </p>
            <InlineCtaBar
              waLink={waLink}
              label="Before you commission a rewrite, let us assess what you already have."
            />
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              The First Step Is Understanding the System
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Modernisation starts with technical archaeology. We need to
              understand:
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {[
                "How the system is structured",
                "Where the data lives",
                "How users interact with it",
                "Which systems it depends on",
                "Which parts are fragile",
                "Which parts are business-critical",
                "What nobody wants to touch",
              ].map((item) => (
                <div
                  key={item}
                  className="px-4 py-3 rounded-lg border border-border bg-card text-sm font-medium text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              That assessment creates a practical modernisation path instead of
              another large technical project built on assumptions.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Modernisation Can Happen Without Stopping the Business
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Replacing an important system in one move can introduce enormous
              risk. For many businesses, a better approach is incremental.
            </p>
            <div className="p-5 rounded-xl border border-accent/30 bg-accent/5 text-sm md:text-base font-semibold text-foreground overflow-x-auto whitespace-nowrap">
              Understand <span className="text-accent">→</span> Stabilise{" "}
              <span className="text-accent">→</span> Isolate{" "}
              <span className="text-accent">→</span> Improve{" "}
              <span className="text-accent">→</span> Replace selectively
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              That can mean introducing a new service around an existing system,
              moving one workflow at a time, replacing one component, improving
              the data model or gradually moving workloads into a more
              maintainable environment.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The business continues operating while the technology improves
              underneath it.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              What Modernisation Actually Looks Like
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {MODERNISATION_APPROACHES.map(({ title, description }) => (
                <div
                  key={title}
                  className="p-5 rounded-xl border border-border bg-card space-y-2"
                >
                  <h3 className="text-base font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              These approaches are not interchangeable. The right one depends on
              the system.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              The Real Value Is Often Hidden Inside the Old System
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A mature system may contain years of decisions that never made it
              into the documentation. There may be rules around:
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {SYSTEM_KNOWLEDGE.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card text-sm font-medium text-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Modernisation should preserve the knowledge that matters while
              removing the technical constraints that no longer serve the
              business. That is why we treat the existing system as something to
              investigate, not simply something to condemn.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Propertyzone: Engineering for Change
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A production platform does not finish evolving when it launches.
              As usage, content, workflows and requirements change, the
              underlying system has to remain capable of supporting them.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Propertyzone is an example of why software architecture and
              engineering need to anticipate change rather than optimise only
              for the first release. The objective is not merely to build
              something that works today. It is to create a foundation that can
              continue changing without every new requirement becoming a crisis.
            </p>
            <div className="relative w-full overflow-hidden rounded-xl border border-border group hover:border-accent transition-colors duration-300">
              <Image
                src="/pz-screenshot-seo-ai.png"
                alt="Propertyzone listing and discovery experience as a growing production system"
                width={1200}
                height={675}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Propertyzone in production: preserving a useful product while
              improving the technology underneath it.
            </p>
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

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Modernisation Should Make the Next Change Cheaper
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              One of the best tests of a modernisation project is what happens
              after it.
            </p>
            <div className="grid gap-2.5">
              {[
                "Can the team add a feature without touching five unrelated parts of the system?",
                "Can a new integration be introduced without creating another fragile dependency?",
                "Can developers understand the codebase?",
                "Can the system be tested before release?",
                "Can the business change direction without starting again?",
              ].map((question) => (
                <div
                  key={question}
                  className="px-4 py-3 rounded-lg border border-border bg-secondary/30 text-sm text-muted-foreground"
                >
                  {question}
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Modernisation is successful when the{" "}
              <strong className="text-foreground">
                next reasonable change becomes easier
              </strong>
              .
            </p>
            <InlineCtaBar
              waLink={waLink}
              label="Make the next change easier."
            />
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              We Look at Risk, Not Just Technology
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A modernisation decision should consider more than the technical
              stack. We look at:
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/60">
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      Question
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      Why it matters
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RISK_QUESTIONS.map(({ question, reason }, index) => (
                    <tr
                      key={question}
                      className={`border-b border-border last:border-0 ${index % 2 === 0 ? "bg-background" : "bg-secondary/30"}`}
                    >
                      <td className="px-5 py-3.5 font-semibold text-foreground align-top whitespace-nowrap">
                        {question}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground leading-relaxed">
                        {reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              This keeps the project connected to the business rather than
              turning it into a technology exercise.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              When Modernisation Is the Right Move
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              You may need technical modernisation when:
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
            <div className="p-5 rounded-xl border border-accent/30 bg-accent/5 space-y-1">
              <p className="text-lg font-semibold text-foreground">
                Your system may not need to be replaced.
              </p>
              <p className="text-lg font-semibold text-foreground">
                It may need to be given room to evolve.
              </p>
            </div>
            <Button
              size="lg"
              className="group bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <a href="#whatsapp" data-whatsapp-href={waLink}>
                Let&apos;s assess what is actually holding it back
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              When We Would Recommend Replacement
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Modernisation has limits. We may recommend replacement when the
              existing architecture creates more risk than value, the system
              cannot support essential requirements without disproportionate
              effort, the underlying platform is no longer viable, or the cost
              of continued intervention is higher than moving to a new
              foundation.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The decision should come from evidence. Not from the fact that the
              code is old.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              How We Work
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {DELIVERY_STEPS.map(({ step, title, description }) => (
                <div
                  key={step}
                  className={`p-5 rounded-xl border border-border bg-card space-y-2 ${step === "05" ? "sm:col-span-2" : ""}`}
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

          <section className="border-t border-border pt-10 space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Do Not Replace a System Just Because It Is Old.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-medium">
                Understand it first.
              </p>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Then decide what deserves to stay, what needs to change and what
              should eventually go.
            </p>
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
          </section>
        </div>
      </article>

      <FaqSection
        faqs={FAQS}
        heading="Questions about technical modernisation"
      />
    </>
  );
}
