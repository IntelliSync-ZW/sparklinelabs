import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { fetchServicesPage } from "@/sanity/lib/fetch";
import { servicesPageQuery } from "@/sanity/lib/queries";

type ServiceItem = {
  stepNumber: string;
  title: string;
  description: string;
  imageUrl?: string;
  color?: string;
  textColor?: string;
  image?: string;
  alt: string;
  href?: string;
};

const STATIC_SERVICES: ServiceItem[] = [
  {
    stepNumber: "01",
    title: "Solution architecture",
    href: "/services/solution-architecture",
    description:
      "We understand the business problem, map the existing workflow and determine what the solution should actually look like before implementation begins.",
    color: "bg-neutral-900/70",
    textColor: "text-white",
    image: "/solutions-architecture.png",
    alt: "Business workflow and system architecture being mapped before software implementation."
  },
  {
    stepNumber: "02",
    title: "Systems engineering",
    href: "/services#systems-engineering",
    description:
      "We design and build the platforms, internal tools and business applications required to put the solution into operation.",
    color: "bg-neutral-200/80",
    textColor: "text-neutral-900",
    image: "/systems-engineering.png",
    alt: "Business application interface being engineered as part of a custom digital system."
  },
  {
    stepNumber: "03",
    title: "Integration & automation",
    href: "/services#integration-automation",
    description:
      "We connect the tools you already use and automate repetitive work across WhatsApp, payments, spreadsheets, CRMs, email and other business systems.",
    color: "bg-neutral-800/80",
    textColor: "text-neutral-100",
    image: "/automation.png",
    alt: "Business systems connected into a single automated workflow."
  },
  {
    stepNumber: "04",
    title: "Search Visibility & AI Discovery",
    href: "/services/search-visibility-ai-discovery",
    description:
      "Make your business easier to find, easier to understand, and easier to choose. We structure your digital presence so search engines and AI tools surface you accurately when it matters.",
    color: "bg-neutral-200/80",
    textColor: "text-neutral-900",
    image: "/search-visibility-ai-discovery.png",
    alt: "Business digital presence structured for search engine and AI discovery."
  },
];

const getStyleForIndex = (index: number) => {
  const styles = [
    { color: "bg-neutral-900/70", textColor: "text-white", image: "/solutions-architecture.png" },
    { color: "bg-neutral-200/80", textColor: "text-neutral-900", image: "/systems-engineering.png" },
    { color: "bg-neutral-800/80", textColor: "text-neutral-100", image: "/automation.png" },
    { color: "bg-neutral-200/80", textColor: "text-neutral-900", image: "/search-visibility-ai-discovery.png" },
    { color: "bg-neutral-900/70", textColor: "text-white", image: "/technical-modernisation.png" },
  ];
  return styles[index % styles.length];
};

const getServiceHref = (stepNumber: string, fallbackHref?: string) => {
  if (fallbackHref) return fallbackHref;
  switch (stepNumber) {
    case "01":
      return "/services/solution-architecture";
    case "02":
      return "/services#systems-engineering";
    case "03":
      return "/services#integration-automation";
    case "04":
      return "/services/search-visibility-ai-discovery";
    case "05":
      return "/services#technical-modernisation";
    default:
      return "/services";
  }
};

export async function Services() {
  let services: ServiceItem[] = [];

  try {
    const pageData = await fetchServicesPage<{ services?: ServiceItem[] }>(servicesPageQuery);
    if (pageData?.services && pageData.services.length > 0) {
      services = pageData.services;
    }
  } catch {
    /* Sanity not configured or empty */
  }

  if (services.length === 0) {
    services = STATIC_SERVICES;
  }

  return (
    <section id="services" className="py-20 md:py-32 px-6 scroll-mt-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Services
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance text-center">
            How we solve operational problems
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const defaultStyles = getStyleForIndex(index);
            const cardColor = service.color || defaultStyles.color;
            const textColor = service.textColor || defaultStyles.textColor;
            const cardImg = service.imageUrl || service.image || defaultStyles.image;
            const href = getServiceHref(service.stepNumber, service.href);

            return (
              <Link
                key={index}
                href={href}
                className="group relative rounded-2xl min-h-95 overflow-hidden border border-border bg-card block transition-all duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="relative flex-1 mt-auto">
                  <div className="rounded-t-lg overflow-hidden shadow-2xl">
                    <Image
                      src={cardImg || "/placeholder.svg"}
                      alt={service.alt}
                      width={400}
                      height={300}
                      className="w-full h-auto aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div
                  className={`absolute inset-0 top-0 left-1 right-1 translate-y-6 ${cardColor} hover:border-accent flex rounded-2xl flex-col transition-transform group-hover:-translate-y-1`}
                >
                  <div className="relative z-10 p-6 pb-0 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-mono uppercase tracking-wider ${textColor} opacity-60`}>
                        {service.stepNumber}
                      </span>
                      <ArrowUpRight className={`h-4 w-4 ${textColor} opacity-0 group-hover:opacity-80 transition-opacity`} />
                    </div>
                    <h3
                      className={`text-xl md:text-2xl font-medium mb-2 ${textColor}`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`text-sm md:text-base ${textColor} opacity-90 leading-relaxed`}
                    >
                      {service.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
