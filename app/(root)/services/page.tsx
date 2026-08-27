import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchServicesPage } from "@/sanity/lib/fetch";
import { servicesPageQuery } from "@/sanity/lib/queries";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";

type ServiceItem = {
  stepNumber: string;
  title: string;
  description: string;
  imageUrl?: string;
  image?: string;
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
    description:
      "We understand the business problem, map the existing workflow and determine what the solution should actually look like before implementation begins.",
    image: "/whiteboard-planning-strategy-minimal.jpg",
  },
  {
    stepNumber: "02",
    title: "Systems engineering",
    description:
      "We design and build the platforms, internal tools and business applications required to put the solution into operation.",
    image: "/minimal-code-editor-dark-theme-interface.jpg",
  },
  {
    stepNumber: "03",
    title: "Integration & automation",
    description:
      "We connect the tools you already use and automate repetitive work across WhatsApp, payments, spreadsheets, CRMs, email and other business systems.",
    image: "/connected-systems-flowchart-minimal-diagram.jpg",
  },
  {
    stepNumber: "04",
    title: "Technical modernisation",
    description:
      "Already have software that almost works? We diagnose the bottlenecks, improve the architecture and replace what needs replacing without throwing away what still works.",
    image: "/clean-code-editor-interface-minimal-dark-theme.jpg",
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
  const title = seo?.title || "Solutions Engineering Services Zimbabwe | Sparkline Labs";
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
  const services = pageData?.services && pageData.services.length > 0 ? pageData.services : STATIC_SERVICES;

  // Reusable fallback images for mapping sanity results
  const fallbackImages = [
    "/whiteboard-planning-strategy-minimal.jpg",
    "/minimal-code-editor-dark-theme-interface.jpg",
    "/connected-systems-flowchart-minimal-diagram.jpg",
    "/clean-code-editor-interface-minimal-dark-theme.jpg",
  ];

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 border-b border-border bg-background">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              Services
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance">
              {h1}
            </h1>
            <div className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl whitespace-pre-line">
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
              const imgUrl = service.imageUrl || service.image || fallbackImages[idx % fallbackImages.length];

              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                    } gap-10 md:gap-16 items-center`}
                >
                  {/* Text Column */}
                  <div className="flex-1 w-full">
                    <span className="text-5xl md:text-7xl font-light font-mono text-muted-foreground/20 block mb-2">
                      {service.stepNumber}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                      {service.title}
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Image Column */}
                  <div className="flex-1 w-full">
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-md group hover:border-accent transition-colors duration-300">
                      <Image
                        src={imgUrl || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-balance">
            Let&apos;s build the right solution together.
          </h2>
          <p className="text-xl md:text-2xl opacity-80 mb-10 max-w-2xl mx-auto">
            We diagnose before we build. Let&apos;s map out your systems and workflows on a brief WhatsApp alignment call. No sales pitches, just engineering context.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="group text-base px-8 bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <a href={waProjectLink} target="_blank" rel="noopener noreferrer">
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
    </>
  );
}
