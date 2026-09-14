import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/faq";
import { WhatsAppLeadTrigger } from "@/components/whatsapp-lead-capture";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Business Process Automation & System Integration Zimbabwe",
  description:
    "Connect business systems and automate repetitive work across WhatsApp, payments, CRMs, websites and internal tools with integration engineering from Sparkline Labs.",
  keywords: [
    "business process automation Zimbabwe",
    "systems integration Zimbabwe",
    "WhatsApp automation Zimbabwe",
    "API integrations Harare",
    "workflow automation Africa",
    "payment integration Zimbabwe",
    "Sparkline Labs automation",
  ],
  alternates: {
    canonical:
      "https://www.sparklinelabs.co.zw/services/integration-automation",
  },
  openGraph: {
    title:
      "Integration & Automation for Zimbabwean Businesses | Sparkline Labs",
    description:
      "Connect the work your business is already doing. We connect systems, automate repetitive work and design reliable handoffs between people and technology.",
    url: "https://www.sparklinelabs.co.zw/services/integration-automation",
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
      name: "Integration & Automation for Zimbabwean Businesses",
      item: "https://www.sparklinelabs.co.zw/services/integration-automation",
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id":
    "https://www.sparklinelabs.co.zw/services/integration-automation#service",
  name: "Integration & Automation for Zimbabwean Businesses",
  description:
    "We connect systems, automate repetitive work and design the handoffs between people and technology so information can move without being repeatedly copied, chased or forgotten.",
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

const CONNECTION_AREAS = [
  {
    area: "Business systems",
    covers:
      "Connect CRMs, accounting systems, websites, internal applications and other platforms",
  },
  {
    area: "Customer enquiries",
    covers: "Capture, route, qualify and track enquiries across channels",
  },
  {
    area: "Payments",
    covers:
      "Connect payment events with orders, invoices, records and reconciliation workflows",
  },
  {
    area: "WhatsApp workflows",
    covers:
      "Move conversations into structured business processes where appropriate",
  },
  {
    area: "Internal processes",
    covers:
      "Automate approvals, notifications, task creation and repetitive administration",
  },
  {
    area: "Data movement",
    covers:
      "Synchronise information between systems without repeated manual entry",
  },
  {
    area: "APIs and integrations",
    covers:
      "Build the technical connections that allow separate systems to work together",
  },
];

const AUTOMATION_CAPABILITIES = [
  {
    title: "Customer journeys",
    description:
      "Capture enquiries, assign ownership, trigger follow-ups and keep communication connected.",
  },
  {
    title: "Internal administration",
    description:
      "Create tasks, notify the right person, move records between stages and reduce repetitive data entry.",
  },
  {
    title: "Operational workflows",
    description:
      "Trigger actions when an order, payment, application or other business event occurs.",
  },
  {
    title: "Data synchronisation",
    description:
      "Keep important information aligned across systems instead of asking people to update several places.",
  },
  {
    title: "Reporting",
    description:
      "Bring information together so management does not have to manually compile the same report every week.",
  },
];

const OPERATING_SYSTEMS = [
  "Websites",
  "Accounting software",
  "CRMs",
  "Spreadsheets",
  "Payment platforms",
  "Messaging channels",
  "Internal databases",
  "Third-party services",
];

const GOOD_FIT = [
  "Staff repeatedly enter the same information into several systems",
  "Enquiries arrive through channels that are difficult to track",
  "Teams spend too much time chasing updates",
  "Reports are compiled manually",
  "Customers receive inconsistent follow-up",
  "Important information lives in disconnected systems",
  "Payments and records need to stay synchronised",
  "An existing workflow works, but requires too much manual intervention",
];

const FAQS = [
  {
    question: "What is business process automation?",
    answer:
      "It is the use of software and connected systems to handle defined parts of a business workflow with less manual intervention. The right approach still keeps people involved where judgement, accountability or customer interaction matters.",
  },
  {
    question: "Can you integrate systems we did not build?",
    answer:
      "Yes. Existing software is often where the greatest integration opportunities exist. We assess the available APIs, data structures and technical constraints before deciding what is practical.",
  },
  {
    question: "Can you automate WhatsApp enquiries?",
    answer:
      "Yes, where the workflow and platform requirements support it. The goal is not to turn every conversation into a bot. It can be as simple as capturing, routing, recording and following up enquiries more reliably.",
  },
  {
    question: "Can you connect payments to our internal system?",
    answer:
      "Yes, where the payment provider exposes the necessary integration capabilities. We can design the workflow around successful payments, failures, reconciliation and the records that need to be updated.",
  },
  {
    question: "Will automation replace our staff?",
    answer:
      "Usually the goal is the opposite. Good automation reduces repetitive administrative work so people can spend more time on decisions, customers and activities that require human judgement.",
  },
];

function InlineCtaBar({ waLink, label }: { waLink: string; label: string }) {
  return (
    <div className="flex items-center justify-between gap-6 flex-wrap rounded-xl border border-border bg-secondary/50 px-6 py-5">
      <p className="text-base text-foreground font-medium">{label}</p>
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

export default function IntegrationAutomationPage() {
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
            Services · Integration &amp; Automation
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-4 text-balance">
            Integration &amp; Automation
          </h1>
          <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-5">
            Connect the work that your business is already doing.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            Businesses rarely operate from one system. A customer may start on
            your website, move to WhatsApp, get recorded in a spreadsheet,
            become an invoice in another system and eventually end up in
            someone&apos;s personal notes.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            The software may all work perfectly. The business process does not.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Sparkline Labs connects systems, automates repetitive work and
            designs the handoffs between people and technology so information
            can move without being repeatedly copied, chased or forgotten.
          </p>
          <WhatsAppLeadTrigger
            size="lg"
            className="group bg-accent text-accent-foreground hover:bg-accent/90"
            href={waLink}
          >
            Show us where work gets stuck
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </WhatsAppLeadTrigger>
        </div>
      </section>

      <div className="px-6 py-8 bg-secondary/40">
        <div className="container mx-auto max-w-3xl">
          <div className="relative w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src="/automation.png"
              alt="Business systems connected into a single automated workflow"
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
              Most Automation Problems Are Really Handoff Problems
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A business does not usually need automation because its employees
              are incapable of doing the work. It needs automation because the
              same information is being moved between people and systems over
              and over again.
            </p>
            <div className="grid gap-2.5">
              {[
                "A website enquiry becomes a WhatsApp message.",
                "A WhatsApp message becomes a spreadsheet row.",
                "The spreadsheet becomes an email.",
                "The email becomes a task.",
                "Someone forgets the task.",
                "The customer follows up.",
              ].map((step) => (
                <div
                  key={step}
                  className="px-4 py-3 rounded-lg border border-border bg-secondary/30 text-sm text-muted-foreground"
                >
                  {step}
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              That is not a people problem. It is a system design problem.
            </p>
            <InlineCtaBar
              waLink={waLink}
              label="Find the unnecessary handoffs."
            />
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              What We Connect and Automate
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/60">
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      Area
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-foreground">
                      What we can improve
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CONNECTION_AREAS.map(({ area, covers }, index) => (
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
              The objective is not to automate everything. It is to remove work
              that should not require somebody to repeat the same action.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Automation Should Remove Repetition, Not Judgement
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We do not believe a good automation strategy means removing humans
              from every workflow. People should still make decisions where
              judgement matters.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Software is better at:
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {[
                "remembering",
                "copying",
                "validating",
                "routing",
                "checking",
                "triggering",
                "recording",
                "notifying",
              ].map((ability) => (
                <div
                  key={ability}
                  className="px-4 py-3 rounded-lg border border-border bg-card text-sm font-medium text-foreground"
                >
                  {ability}
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A good system lets people spend less time moving information
              around and more time doing the work that actually requires them.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Start With the Workflow, Not the Tool
            </h2>
            <blockquote className="border-l-4 border-accent pl-5 py-0.5">
              <p className="text-lg md:text-xl font-semibold text-foreground">
                &ldquo;Which automation platform should we use?&rdquo;
              </p>
            </blockquote>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We begin with:
            </p>
            <blockquote className="border-l-4 border-accent pl-5 py-0.5">
              <p className="text-lg md:text-xl font-semibold text-foreground">
                &ldquo;What happens from beginning to end?&rdquo;
              </p>
            </blockquote>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We map the current process, identify the handoffs, find repeated
              work and determine where the system should take over.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Only then do we decide whether the answer is:
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {[
                "an API integration",
                "a workflow automation",
                "a new internal tool",
                "a website change",
                "a database connection",
                "a WhatsApp workflow",
                "a combination of several systems",
              ].map((answer) => (
                <li
                  key={answer}
                  className="flex items-start gap-3 text-base text-muted-foreground leading-relaxed"
                >
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {answer}
                </li>
              ))}
            </ul>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              That keeps the technology subordinate to the business problem.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              A Simple Example
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A poorly connected process might look like:
            </p>
            <div className="p-5 rounded-xl border border-border bg-secondary/40 text-sm md:text-base font-medium text-foreground overflow-x-auto whitespace-nowrap">
              Website <span className="text-muted-foreground">→</span> Email{" "}
              <span className="text-muted-foreground">→</span> Someone notices{" "}
              <span className="text-muted-foreground">→</span> Spreadsheet{" "}
              <span className="text-muted-foreground">→</span> Salesperson{" "}
              <span className="text-muted-foreground">→</span> Follow-up
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A properly designed process could become:
            </p>
            <div className="p-5 rounded-xl border border-accent/30 bg-accent/5 text-sm md:text-base font-semibold text-foreground overflow-x-auto whitespace-nowrap">
              Website <span className="text-accent">→</span> Structured enquiry{" "}
              <span className="text-accent">→</span> Assignment{" "}
              <span className="text-accent">→</span> Notification{" "}
              <span className="text-accent">→</span> Follow-up{" "}
              <span className="text-accent">→</span> Recorded outcome
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The second process does not necessarily require more software. It
              requires fewer places for information to disappear.
            </p>
            <InlineCtaBar
              waLink={waLink}
              label="Let's find where your information disappears."
            />
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Propertyzone: Connecting Discovery to Enquiry
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Propertyzone demonstrates why integration is more than connecting
              APIs. A property platform has to bring together property
              information, agency information, users, discovery and enquiries.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Someone can discover a property, decide to ask about it and start
              a conversation without understanding any of the systems
              underneath. That experience depends on those systems actually
              working together.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The objective is not simply to make information available. It is
              to make the transition from{" "}
              <strong className="text-foreground">
                discovery → enquiry → response
              </strong>{" "}
              as clear and reliable as possible.
            </p>
            <div className="relative w-full overflow-hidden rounded-xl border border-border group hover:border-accent transition-colors duration-300">
              <Image
                src="/pz-screenshot-seo-ai.png"
                alt="Propertyzone property discovery and enquiry experience in production"
                width={1200}
                height={675}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Propertyzone in production: the transition from structured
              property information to enquiry.
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
              Automation Is Only Useful When the Underlying Process Makes Sense
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Automating a broken process simply allows the broken process to
              happen faster. That is why we look for problems before triggers.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              For example, if nobody has agreed who owns a customer enquiry,
              creating an automated notification does not solve the underlying
              problem. It simply sends the confusion to more people.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Before automating, we ask:
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {[
                "Who owns this?",
                "What starts the process?",
                "What information is required?",
                "What happens next?",
                "What happens when something fails?",
                "Who handles the exception?",
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
              Those decisions make the automation useful.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              What We Can Automate
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {AUTOMATION_CAPABILITIES.map(({ title, description }) => (
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
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              The Exception Is Part of the Design
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A workflow is not finished because the happy path works.
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {[
                "the API is unavailable?",
                "the payment fails?",
                "the customer submits the form twice?",
                "the data is incomplete?",
                "someone changes the record manually?",
                "the external system changes its response?",
              ].map((question) => (
                <div
                  key={question}
                  className="px-4 py-3 rounded-lg border border-border bg-secondary/30 text-sm text-muted-foreground"
                >
                  What happens when {question}
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Reliable automation needs clear failure handling, logging and
              recovery. This is where integration becomes engineering rather
              than simply connecting two applications.
            </p>
            <InlineCtaBar
              waLink={waLink}
              label="Have an automation that works until something goes wrong? Let's examine it."
            />
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Built for the Systems You Already Have
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Most businesses do not start from zero. They already have:
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {OPERATING_SYSTEMS.map((system) => (
                <div
                  key={system}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card text-sm font-medium text-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {system}
                </div>
              ))}
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We do not automatically replace them. We determine what should
              remain, what should connect and where a new layer is justified.
              Sometimes the best solution is a small integration between two
              existing systems. Sometimes the systems themselves need to change.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              When Integration and Automation Make Sense
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
            <div className="p-5 rounded-xl border border-border bg-secondary/50">
              <p className="text-base font-semibold text-foreground">
                The best automation often feels almost invisible.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                People simply notice that the work gets done.
              </p>
            </div>
            <WhatsAppLeadTrigger
              size="lg"
              className="group bg-accent text-accent-foreground hover:bg-accent/90"
              href={waLink}
            >
              Show us the process
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </WhatsAppLeadTrigger>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              What We Will Not Automate
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We do not automate a process simply because it is repetitive. Some
              repetition exists for a reason. Some decisions need a human. Some
              workflows need to be redesigned before automation makes sense. And
              some processes should remain deliberately manual because the value
              comes from the human interaction.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              The question is not:
            </p>
            <blockquote className="border-l-4 border-border pl-5 py-0.5">
              <p className="text-lg md:text-xl font-semibold text-foreground">
                &ldquo;Can we automate this?&rdquo;
              </p>
            </blockquote>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              It is:
            </p>
            <blockquote className="border-l-4 border-accent pl-5 py-0.5">
              <p className="text-lg md:text-xl font-semibold text-foreground">
                &ldquo;Should this be automated?&rdquo;
              </p>
            </blockquote>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              That is the more useful question.
            </p>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              From Connected Systems to Better Operations
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Integration becomes most valuable when it improves the way the
              business actually works. That is why this service often overlaps
              with Sparkline&apos;s other capabilities.
            </p>
            <div className="grid gap-2.5">
              <Link
                href="/services/solution-architecture"
                className="px-4 py-3 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
              >
                A fragmented workflow may require{" "}
                <strong className="text-foreground">
                  Solution Architecture
                </strong>
                .
              </Link>
              <Link
                href="/services/systems-engineering"
                className="px-4 py-3 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
              >
                A new operational system may require{" "}
                <strong className="text-foreground">Systems Engineering</strong>
                .
              </Link>
              <div className="px-4 py-3 rounded-lg border border-border bg-card text-sm text-muted-foreground">
                An older system may require{" "}
                <strong className="text-foreground">
                  Technical Modernisation
                </strong>
                .
              </div>
              <Link
                href="/services/search-visibility-ai-discovery"
                className="px-4 py-3 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:border-accent hover:text-foreground transition-colors"
              >
                A customer journey may also need better{" "}
                <strong className="text-foreground">
                  Search Visibility &amp; AI Discovery
                </strong>{" "}
                before the workflow even begins.
              </Link>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We can work across those boundaries because the business problem
              does not always respect service categories.
            </p>
          </section>

          <section className="border-t border-border pt-10 space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Stop Moving the Same Information Twice.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-medium">
                Find the handoffs, connect the systems and let the software
                carry the repetitive work.
              </p>
            </div>
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

      <FaqSection
        faqs={FAQS}
        heading="Questions about integration and automation"
      />
    </>
  );
}
