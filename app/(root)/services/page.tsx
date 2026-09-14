import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchServicesPage } from "@/sanity/lib/fetch";
import { servicesPageQuery } from "@/sanity/lib/queries";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";
import { FaqSection } from "@/components/faq";
import { servicesFaqs } from "@/lib/constants";

type ServiceItem = {
  stepNumber: string;
  title: string;
  description: string;
  imageUrl?: string;
  image?: string;
  alt?: string;
  id?: string;
};

type ServicesPageData = {
  h1: string;
  intro: string;
  services: ServiceItem[];
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
};

const STATIC_SERVICES: ServiceItem[] = [
  {
    stepNumber: "01",
    title: "Solution architecture",
    id: "solution-architecture",
    description: `<p>We work out what should actually be built before development begins.</p>

<p>A business problem does not always require new software. We examine your workflow, existing systems, users and constraints to determine whether the right answer is a new platform, an integration, automation, modernisation or a change to the process itself.</p>

<p>We turn that understanding into a practical technical plan covering the system structure, data, integrations, workflows and implementation priorities.</p>

<p>Typical work: Workflow mapping, system architecture, technical requirements, feasibility studies, integration planning and prototypes.</p>

<p>Related: <a href="/blog/solutions-engineering/zimbabwe-technology-decision-framework-build-buy-integrate">Build, Buy, Integrate or Change the Process?</a></p>`,
    image: "/solutions-architecture.png",
    alt: "Business workflow and system architecture being mapped before software implementation.",
  },
  {
    stepNumber: "02",
    title: "Systems engineering",
    id: "systems-engineering",
    description: `<p>We build the software that makes the solution work in practice.</p>

<p>When an existing product cannot properly support the way your business operates, we design and engineer a system around those requirements.</p>

<p>This can include customer-facing platforms, internal business systems, portals, dashboards and SaaS products. We consider the real environment in which the software will be used, including mobile usage, connectivity, integrations and operational workflows.</p>

<p>Typical work: Custom platforms, business applications, portals, dashboards, SaaS products and workflow systems.</p>

<p>Related: <a href="/work/propertyzone">Propertyzone</a> · <a href="/blog/solutions-engineering/what-zimbabwean-businesses-need-from-software">What Does a Zimbabwean Business Actually Need From Software?</a></p>`,
    image: "/systems-engineering.png",
    alt: "Business application interface being engineered as part of a custom digital system.",
  },
  {
    stepNumber: "03",
    title: "Integration & automation",
    id: "integration-automation",
    description: `<p>Connect the systems you already use and remove unnecessary manual work.</p>

<p>Many businesses do not have a software shortage. They have a systems disconnect. Information moves between WhatsApp, spreadsheets, websites, CRMs, payment systems and email through people manually copying and forwarding it.</p>

<p>We connect those systems and automate the handoffs where doing so improves speed, accuracy and visibility.</p>

<p>Typical work: WhatsApp integrations, lead capture, payment integrations, CRM connections, data synchronisation, notifications and workflow automation.</p>

<p>Related: <a href="/blog/seo-and-digital-strategy/whatsapp-lead-capture-crm-scoring-zimbabwe-propertyzone">Can WhatsApp Leads Be Captured and Scored Automatically in Zimbabwe?</a></p>`,
    image: "/automation.png",
    alt: "Business systems connected into a single automated workflow.",
  },
  {
    stepNumber: "04",
    title: "Search Visibility & AI Discovery",
    id: "search-visibility-ai-discovery",
    description: `<p>Make your business easier to find, easier to understand, and easier to choose.</p>

<p>Search has changed. Beyond ranking on Google, your business now needs to appear accurately in AI-generated answers, knowledge panels, voice results and LLM-powered tools that millions of people use to research decisions. Most African businesses are invisible in this new layer.</p>

<p>We structure your digital presence — your website content, schema markup, entity data and information architecture — so that both search engines and AI systems can read, understand and confidently surface your business when it is relevant.</p>

<p>Typical work: Technical SEO, structured data and schema markup, entity optimisation, content architecture, AI-readability audits, local search visibility and search-engine-friendly copywriting.</p>

<p>Related: <a href="/blog/seo-and-digital-strategy">Digital strategy writing</a></p>`,
    image: "/search-visibility-ai-discovery.png",
    alt: "Business digital presence structured for search engine and AI discovery.",
  },
  {
    stepNumber: "05",
    title: "Technical modernisation",
    id: "technical-modernisation",
    description: `<p>Improve the software you already have instead of replacing everything.</p>

<p>Existing systems can become slow, fragile or difficult to change as a business grows. We assess what is worth keeping, identify the technical problems holding the system back and modernise the underlying architecture progressively.</p>

<p>The goal is to make software more reliable, maintainable and easier to extend without creating unnecessary disruption.</p>

<p>Typical work: Legacy-system assessment, architecture improvements, performance work, database improvements, codebase modernisation and incremental replacement.</p>

<p>Related: <a href="/blog/software-industry/wordpress-era-ai-tools-zimbabwe-software-trust">The WordPress Era Never Ended. It Just Learned to Prompt.</a></p>`,
    image: "/technical-modernisation.png",
    alt: "Existing software architecture being modernised while functional components are retained.",
  },
];

const DEFAULT_H1 = "We solve operational problems with technology.";
const DEFAULT_INTRO =
  "You don't always need new software. Sometimes you need two systems connected. Sometimes a manual process needs automation. Sometimes the problem is the workflow itself. And sometimes the only sensible answer is to build something new.\n\nSparkline Labs works across all four.";

export async function generateMetadata(): Promise<Metadata> {
  let pageData: ServicesPageData | null = null;
  try {
    pageData = await fetchServicesPage<ServicesPageData>(servicesPageQuery);
  } catch {
    /* ignore */
  }

  const seo = pageData?.seo;
  const title = seo?.title || "Solutions Engineering Services Zimbabwe";
  const description =
    seo?.description ||
    "Solutions engineering for Zimbabwean and African businesses. We diagnose operational problems and engineer the right combination of software, integrations, automation and digital systems.";
  const ogImageUrl = seo?.ogImage;

  return {
    title,
    description,
    alternates: { canonical: "https://www.sparklinelabs.co.zw/services" },
    openGraph: {
      title,
      description,
      url: "https://www.sparklinelabs.co.zw/services",
      type: "website",
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl }],
      }),
    },
  };
}

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
  ],
};

const servicesFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: servicesFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default async function ServicesPage() {
  const waProjectLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

  let pageData: ServicesPageData | null = null;
  try {
    pageData = await fetchServicesPage<ServicesPageData>(servicesPageQuery);
  } catch {
    /* Sanity not configured or empty */
  }

  const h1 = pageData?.h1 || DEFAULT_H1;
  const intro = pageData?.intro || DEFAULT_INTRO;
  const services =
    pageData?.services && pageData.services.length > 0
      ? pageData.services
      : STATIC_SERVICES;

  // Reusable fallback images for mapping sanity results
  const fallbackImages = [
    "/solutions-architecture.png",
    "/systems-engineering.png",
    "/automation.png",
    "/search-visibility-ai-discovery.png",
    "/technical-modernisation.png",
  ];

  const getServiceDetailHref = (id?: string, stepNumber?: string) => {
    if (id === "solution-architecture" || stepNumber === "01") {
      return "/services/solution-architecture";
    }
    if (id === "systems-engineering" || stepNumber === "02") {
      return "/services/systems-engineering";
    }
    if (id === "integration-automation" || stepNumber === "03") {
      return "/services/integration-automation";
    }
    if (id === "technical-modernisation" || stepNumber === "05") {
      return "/services/technical-modernisation";
    }
    if (id === "search-visibility-ai-discovery" || stepNumber === "04") {
      return "/services/search-visibility-ai-discovery";
    }
    return null;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesFaqSchema) }}
      />
      {/* Hero */}
      <section className="mt-18 pb-20 min-h-180 px-6 border-b border-border bg-background relative">
        <Image
          src="/services-hero.png"
          alt="Services"
          fill
          className="object-cover aspect-9/16 md:aspect-auto absolute inset-0 z-1"
        />
        <div className="bg-foreground/80 z-5 text-background flex absolute inset-0 flex-col items-center justify-center text-center ">
          <div className="max-w-3xl mx-auto w-full text-center ">
            <p className="text-base uppercase tracking-widest text-muted mb-4">
              Services
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance text-center">
              {h1}
            </h1>
            <div className="text-xl md:text-2xl text-muted leading-relaxed whitespace-pre-line">
              {intro}
            </div>
          </div>
        </div>
      </section>

      {/* Services List - Staggered Layout */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col gap-20 md:gap-32">
            {services.map((service, idx) => {
              const isEven = idx % 2 === 0;
              const imgUrl =
                service.imageUrl ||
                service.image ||
                fallbackImages[idx % fallbackImages.length];
              const detailHref = getServiceDetailHref(
                service.id,
                service.stepNumber,
              );

              return (
                <div
                  key={idx}
                  id={service.id}
                  className={`flex flex-col ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-10 md:gap-16 items-center`}
                >
                  {/* Text Column */}
                  <div className="flex-1 w-full">
                    <span className="text-5xl md:text-7xl font-light font-mono text-muted-foreground/20 block mb-2">
                      {service.stepNumber}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                      {detailHref ? (
                        <Link
                          href={detailHref}
                          className="hover:text-accent transition-colors inline-flex items-center gap-2 group/title"
                        >
                          <span>{service.title}</span>
                          <ArrowRight className="h-6 w-6 opacity-0 -translate-x-2 transition-all group-hover/title:opacity-100 group-hover/title:translate-x-0" />
                        </Link>
                      ) : (
                        service.title
                      )}
                    </h2>
                    <div
                      className="text-base md:text-lg text-muted-foreground leading-relaxed typeset"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                    {detailHref && (
                      <div className="mt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="group"
                        >
                          <Link href={detailHref}>
                            Explore full service overview
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Image Column */}
                  <div className="flex-1 w-full">
                    {detailHref ? (
                      <Link href={detailHref} className="block group">
                        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border shadow-md hover:border-accent transition-colors duration-300">
                          <Image
                            src={imgUrl || "/placeholder.svg"}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                    ) : (
                      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border shadow-md group hover:border-accent transition-colors duration-300">
                        <Image
                          src={imgUrl || "/placeholder.svg"}
                          alt={service.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-balance text-center">
            Not every problem needs new software.
          </h2>
          <p className="text-xl md:text-2xl opacity-80 mb-10 max-w-2xl mx-auto">
            We diagnose before we build. Let&apos;s map out your systems and
            workflows on a brief WhatsApp alignment call. No sales pitches, just
            engineering context.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="group text-base px-8 bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <a href="#whatsapp" data-whatsapp-href={waProjectLink}>
                Tell us what isn&apos;t working
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group text-base px-8 bg-transparent border-background/30 text-background hover:bg-background/10"
              asChild
            >
              <Link href="/products">
                Explore our products
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <FaqSection faqs={servicesFaqs} heading="Questions about our services" />
    </>
  );
}
