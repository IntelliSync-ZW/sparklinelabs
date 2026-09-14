import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/faq";
import { WhatsAppLeadTrigger } from "@/components/whatsapp-lead-capture";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Software Development Zimbabwe | Systems Engineering",
  description:
    "Custom software engineering for Zimbabwean businesses. We build production systems, platforms and business applications designed around real workflows, users and data.",
  keywords: [
    "systems engineering Zimbabwe",
    "custom software development Zimbabwe",
    "business systems Zimbabwe",
    "SaaS development Africa",
    "software engineering Harare",
    "production software Zimbabwe",
    "Sparkline Labs systems engineering",
  ],
  alternates: {
    canonical: "https://www.sparklinelabs.co.zw/services/systems-engineering",
  },
  openGraph: {
    title: "Systems Engineering for Zimbabwean Businesses | Sparkline Labs",
    description:
      "Build software that works in the real world. We engineer business platforms, customer-facing products, internal systems, SaaS products and digital products around real operating conditions.",
    url: "https://www.sparklinelabs.co.zw/services/systems-engineering",
    type: "website",
    images: [
      {
        url: "/systems-engineering-og.jpg",
        width: 1200,
        height: 630,
        alt: "Systems Engineering for Zimbabwean Businesses",
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
      name: "Systems Engineering for Zimbabwean Businesses",
      item: "https://www.sparklinelabs.co.zw/services/systems-engineering",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.sparklinelabs.co.zw/services/systems-engineering#service",
  name: "Systems Engineering for Zimbabwean Businesses",
  description:
    "We build software around real users, imperfect data, permissions, workflows, integrations, failure conditions and the operational realities of production.",
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

const SYSTEM_TYPES = [
  {
    type: "Business platforms",
    examples: "CRM, operations, property, finance and workflow systems",
  },
  {
    type: "Customer-facing products",
    examples: "Portals, marketplaces, booking systems and web applications",
  },
  {
    type: "Internal tools",
    examples:
      "Dashboards, approvals, administration and operational interfaces",
  },
  {
    type: "SaaS products",
    examples:
      "Multi-user products designed around repeatable business workflows",
  },
  {
    type: "Integrations",
    examples: "Systems that need to exchange data and trigger actions",
  },
  {
    type: "Digital products",
    examples: "Products that combine software, data and customer experience",
  },
];

const DELIVERY_STEPS = [
  {
    step: "01",
    title: "Understand",
    description:
      "We translate the business requirement into workflows, roles, information and outcomes.",
  },
  {
    step: "02",
    title: "Architect",
    description:
      "We define how the system should be structured and how its major components should interact.",
  },
  {
    step: "03",
    title: "Engineer",
    description:
      "We build the application, data layer, integrations and interfaces required for the solution.",
  },
  {
    step: "04",
    title: "Test",
    description:
      "We test real workflows, permissions, exceptions and failure conditions rather than only checking whether the happy path works.",
  },
  {
    step: "05",
    title: "Deploy",
    description:
      "We move the system into a production environment with the operational requirements that come with it.",
  },
  {
    step: "06",
    title: "Improve",
    description:
      "Production reveals things that no specification can predict completely. We use that information to improve the system rather than pretending the first release is the final one.",
  },
];

const PRODUCTION_COMPARISONS = [
  { demo: "One user", production: "Multiple roles and permissions" },
  { demo: "The happy path", production: "Exceptions and failed actions" },
  { demo: "Clean data", production: "Real, inconsistent inputs" },
  { demo: "One payment", production: "Reconciliation and failure recovery" },
  {
    demo: "A working form",
    production: "Validation, security and auditability",
  },
  { demo: "A fast response", production: "Performance under real usage" },
  { demo: "A finished screen", production: "The workflow behind it" },
  { demo: "A successful action", production: "What happens when it fails" },
];

const OPERATING_CONDITIONS = [
  "Connectivity",
  "Existing infrastructure",
  "Third-party dependencies",
  "Device constraints",
  "Data quality",
  "User capability",
  "Maintenance requirements",
  "Future changes",
];

const GOOD_FIT = [
  "An existing process needs to become software",
  "Spreadsheets and manual work are becoming difficult to manage",
  "Customers need a digital platform or portal",
  "Several teams need one system of record",
  "You are launching a SaaS or marketplace product",
  "Existing systems need a new application around them",
  "Your current software has become difficult to extend",
  "A prototype needs to become a real production system",
];

const FAQS = [
  {
    question: "Do you build custom software?",
    answer:
      "Yes, when custom software is the appropriate solution. We also work with integrations, existing platforms, automation and modernisation where those make more sense.",
  },
  {
    question: "What types of software do you build?",
    answer:
      "We build business systems, customer-facing platforms, internal tools, SaaS products, marketplaces, portals and other software around specific business requirements.",
  },
  {
    question: "Can you take an existing prototype into production?",
    answer:
      "Yes. A prototype can be useful even when it is not production-ready. We can assess the architecture, data model, security, workflows and operational requirements and determine what needs to change.",
  },
  {
    question: "Can you work on software another company started?",
    answer:
      "Yes. We can assess the current system, understand its constraints and determine whether it should be extended, repaired, modernised or partially replaced.",
  },
  {
    question: "How do you handle changing requirements?",
    answer:
      "Requirements will change. The important thing is having an architecture and development process that can absorb meaningful changes without turning every new requirement into a complete rebuild.",
  },
];

function InlineCtaBar({ waLink }: { waLink: string }) {
  return (
    <div className="flex items-center justify-between gap-6 flex-wrap rounded-xl border border-border bg-secondary/50 px-6 py-5">
      <p className="text-base text-foreground font-medium">
        Have a system that works in the demo but worries you in production?
      </p>
      <WhatsAppLeadTrigger
        size="sm"
        className="group shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
        href={waLink}
      >
        Talk to us
        <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </WhatsAppLeadTrigger>
    </div>
  );
}

export default function SystemsEngineeringPage() {
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
            Services · Systems Engineering
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-4 text-balance">
            Systems Engineering
          </h1>
          <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-5">
            Build software that works in the real world.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            A working demo is not the same thing as a working system.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            Real software has to deal with real users, imperfect data,
            permissions, failed payments, duplicate records, changing
            requirements, third-party systems, slow connections and the edge
            cases nobody remembered to mention in the original brief.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Sparkline Labs engineers business software around those realities.
            We build customer-facing platforms, internal systems, SaaS products,
            operational tools and digital products with the architecture, data
            and workflows needed to survive beyond the demo.
          </p>
          <WhatsAppLeadTrigger
            size="lg"
            className="group bg-accent text-accent-foreground hover:bg-accent/90"
            href={waLink}
          >
            Talk to us about what you need to build
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </WhatsAppLeadTrigger>
        </div>
      </section>

      <div className="px-6 py-8 bg-secondary/40">
        <div className="container mx-auto max-w-3xl">
          <div className="relative w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src="/systems-engineering-og.jpg"
              alt="Business application interface being engineered as part of a custom digital system"
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

      <article className="pb-16 md:pb-24 px-6">
        <div className="container mx-auto max-w-3xl space-y-12 md:space-y-16">
          <section className="space-y-5 pt-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Software Is Easy to Demonstrate. Production Is Harder.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A demo can show the happy path. A production system has to answer
              the uncomfortable questions.
            </p>
            <div className="grid gap-2.5">
              {[
                "What happens when two people edit the same record?",
                "What happens when a payment succeeds but the callback fails?",
                "What happens when a user should have access to one thing but not another?",
                "What happens when the data is incomplete?",
                "What happens when the customer changes their mind halfway through a workflow?",
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
              These are not polish issues to solve at the end. They are part of
              the engineering.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              What We Build
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/60">
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      Type of system
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      Examples
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SYSTEM_TYPES.map(({ type, examples }, index) => (
                    <tr
                      key={type}
                      className={`border-b border-border last:border-0 ${index % 2 === 0 ? "bg-background" : "bg-secondary/30"}`}
                    >
                      <td className="px-5 py-3.5 font-semibold text-foreground align-top whitespace-nowrap">
                        {type}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground leading-relaxed">
                        {examples}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The technology is selected around the problem. Not because a
              particular framework happens to be fashionable.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              We Do Not Start With the Screen
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A common software process starts with:{" "}
              <strong className="text-foreground">
                What should the interface look like?
              </strong>
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We prefer to start with:
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {[
                "What needs to happen?",
                "Who is involved?",
                "What information exists?",
                "Who can change it?",
                "What happens next?",
                "What can fail?",
                "What needs to be recorded?",
              ].map((question) => (
                <div
                  key={question}
                  className="px-4 py-3 rounded-lg border border-border bg-card text-sm font-medium text-foreground"
                >
                  {question}
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The interface becomes the expression of a system that has already
              been thought through.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              From Requirement to Production
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {DELIVERY_STEPS.map(({ step, title, description }) => (
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

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Propertyzone: Software Built Around a Real Operating Problem
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Propertyzone is a good example of the difference between building
              features and engineering a system. The platform has to connect
              property inventory, agencies, users, discovery, enquiries and the
              information surrounding a property.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              That means the engineering cannot stop at:{" "}
              <em>&ldquo;Can we display a listing?&rdquo;</em> The system has to
              support what happens before the listing is discovered, when
              someone enquires, when an agent responds and when information
              changes.
            </p>
            <div className="relative w-full overflow-hidden rounded-xl border border-border group hover:border-accent transition-colors duration-300">
              <Image
                src="/pz-screenshot-seo-ai.png"
                alt="Propertyzone property discovery and enquiry experience in production"
                width={1200}
                height={675}
                loading="lazy"
                sizes="(min-width: 768px) 768px, 100vw"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Propertyzone in production: structured property data, discovery
              and enquiry connected in one platform.
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
              The Difference Between a Demo and Production
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/60">
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      A demo can show
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      Production has to handle
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTION_COMPARISONS.map(({ demo, production }, index) => (
                    <tr
                      key={demo}
                      className={`border-b border-border last:border-0 ${index % 2 === 0 ? "bg-background" : "bg-secondary/30"}`}
                    >
                      <td className="px-5 py-3.5 text-muted-foreground align-top">
                        {demo}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-foreground align-top">
                        {production}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              This is why we treat production engineering as its own discipline.
            </p>
            <InlineCtaBar waLink={waLink} />
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Data Is Part of the Product
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Software is often described through its screens. The data
              underneath determines whether the system can actually be trusted.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We think about:
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {[
                "what information should exist",
                "where it comes from",
                "who owns it",
                "what can change",
                "what should never be overwritten",
                "how duplicates are handled",
                "how relationships are represented",
                "what should be audited",
                "what happens when data is incomplete",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base text-muted-foreground leading-relaxed"
                >
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Good engineering makes those rules explicit. That becomes
              particularly important when a system connects several teams or
              external platforms.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Build for Real Users, Not Ideal Users
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Users do not behave like requirements documents. They forget. They
              enter incomplete information. They repeat actions. They
              misunderstand instructions. They leave halfway through a process.
              They return six weeks later. They use mobile devices. They follow
              workflows differently from how the original specification imagined
              them.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Good systems account for that. That does not mean making every
              product complicated. It means making the important failures
              predictable and recoverable.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              We Also Know When Not to Build
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Custom software is not automatically better software. An existing
              platform may already solve the problem. An integration may be
              enough. A process may need to be simplified before it is
              automated. A small internal tool may solve what appears to require
              an entire platform.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Our role is not to maximise the amount of software we build. It is
              to make the solution fit the business.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Built With the Environment in Mind
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Software designed in a perfect environment can struggle in the
              real one. We consider the operating conditions around the system,
              including:
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {OPERATING_CONDITIONS.map((item) => (
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
              A technically elegant system that cannot be operated reliably is
              not a successful system.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              When Systems Engineering Is the Right Fit
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              You may need systems engineering when:
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
                The right system can change how a business operates.
              </p>
            </div>
            <WhatsAppLeadTrigger
              size="lg"
              className="group bg-accent text-accent-foreground hover:bg-accent/90"
              href={waLink}
            >
              Let&apos;s work out what that system should look like
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </WhatsAppLeadTrigger>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              From Architecture to Software
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Good engineering starts with good decisions. That is why Systems
              Engineering works closely with our{" "}
              <Link
                href="/services/solution-architecture"
                className="text-foreground underline underline-offset-4 hover:text-accent transition-colors"
              >
                Solution Architecture
              </Link>{" "}
              capability. Architecture helps determine what should exist and how
              the solution should work. Engineering turns those decisions into
              software that people can actually use. When those two disciplines
              are separated too far, important assumptions get lost. We prefer
              to keep them connected.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent group"
              asChild
            >
              <Link href="/services/solution-architecture">
                Explore Solution Architecture
                <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </section>

          <section className="border-t border-border pt-10 space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Build Software That Survives Contact With the Business.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-medium">
                Start with the problem.
              </p>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              We&apos;ll work out what the system needs to become.
            </p>
            <WhatsAppLeadTrigger
              size="lg"
              className="group bg-accent text-accent-foreground hover:bg-accent/90"
              href={waLink}
            >
              Talk to Sparkline Labs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </WhatsAppLeadTrigger>
          </section>
        </div>
      </article>

      <FaqSection faqs={FAQS} heading="Questions about systems engineering" />
    </>
  );
}
