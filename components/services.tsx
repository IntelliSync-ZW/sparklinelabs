import Image from "next/image";
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
};

const STATIC_SERVICES: ServiceItem[] = [
  {
    stepNumber: "01",
    title: "Solution architecture",
    description:
      "We understand the business problem, map the existing workflow and determine what the solution should actually look like before implementation begins.",
    color: "bg-neutral-900/70",
    textColor: "text-white",
    image: "/whiteboard-planning-strategy-minimal.jpg",
  },
  {
    stepNumber: "02",
    title: "Systems engineering",
    description:
      "We design and build the platforms, internal tools and business applications required to put the solution into operation.",
    color: "bg-neutral-200/80",
    textColor: "text-neutral-900",
    image: "/minimal-code-editor-dark-theme-interface.jpg",
  },
  {
    stepNumber: "03",
    title: "Integration & automation",
    description:
      "We connect the tools you already use and automate repetitive work across WhatsApp, payments, spreadsheets, CRMs, email and other business systems.",
    color: "bg-neutral-800/80",
    textColor: "text-neutral-100",
    image: "/connected-systems-flowchart-minimal-diagram.jpg",
  },
  {
    stepNumber: "04",
    title: "Technical modernisation",
    description:
      "Already have software that almost works? We diagnose the bottlenecks, improve the architecture and replace what needs replacing without throwing away what still works.",
    color: "bg-neutral-900/70",
    textColor: "text-white",
    image: "/clean-code-editor-interface-minimal-dark-theme.jpg",
  },
];

const getStyleForIndex = (index: number) => {
  const styles = [
    { color: "bg-neutral-900/70", textColor: "text-white", image: "/whiteboard-planning-strategy-minimal.jpg" },
    { color: "bg-neutral-200/80", textColor: "text-neutral-900", image: "/minimal-code-editor-dark-theme-interface.jpg" },
    { color: "bg-neutral-800/80", textColor: "text-neutral-100", image: "/connected-systems-flowchart-minimal-diagram.jpg" },
    { color: "bg-neutral-900/70", textColor: "text-white", image: "/clean-code-editor-interface-minimal-dark-theme.jpg" },
  ];
  return styles[index % styles.length];
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
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            How we solve operational problems
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const defaultStyles = getStyleForIndex(index);
            const cardColor = service.color || defaultStyles.color;
            const textColor = service.textColor || defaultStyles.textColor;
            const cardImg = service.imageUrl || service.image || defaultStyles.image;

            return (
              <div key={index} className="group relative rounded-2xl min-h-95 overflow-hidden border border-border bg-card">
                <div className="relative flex-1 mt-auto pt-8">
                  <div className="rounded-t-lg overflow-hidden shadow-2xl">
                    <Image
                      src={cardImg || "/placeholder.svg"}
                      alt={service.title}
                      width={400}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div
                  className={`absolute inset-0 top-0 left-4 right-4 translate-y-6 ${cardColor} hover:border-accent flex rounded-2xl flex-col transition-transform hover:-translate-y-1`}
                >
                  <div className="relative z-10 p-6 pb-0">
                    <span className={`text-xs font-mono uppercase tracking-wider block mb-2 ${textColor} opacity-60`}>
                      {service.stepNumber}
                    </span>
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
