import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, BarChart3, Rocket, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore our SaaS products: FlowSync for workflow automation, DataPulse for actionable analytics, and LaunchKit for rapid MVP deployment.",
  keywords: [
    "SaaS products",
    "workflow automation",
    "analytics dashboard",
    "MVP toolkit",
    "propertyzone",
    "DataPulse",
    "LaunchKit",
  ],
  openGraph: {
    title: "Our Products | Sparkline Labs",
    description:
      "SaaS tools we built and run. Automate workflows, gain insights, and launch faster.",
    url: "https://sparklinelabs.co.zw/products",
    type: "website",
    images: [
      {
        url: "/og-products.jpg",
        width: 1200,
        height: 630,
        alt: "Sparkline Labs Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Products | Sparkline Labs",
    description: "SaaS tools we built and run. Automate, analyze, and launch.",
    images: ["/og-products.jpg"],
  },
  alternates: {
    canonical: "https://sparklinelabs.co.zw/products",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const products = [
  {
  id: "propertyzone",
  name: "propertyzone",
  tagline: "Only serious property buyers and renters",
  description:
    "propertyzone connects verified buyers, renters, agents, and sellers in one focused marketplace — built to surface real intent, not empty enquiries.",
  icon: Home,
  color: "bg-neutral-100",
  textColor: "text-neutral-900",
  image: "/workflow-automation-dashboard-clean-minimal-light.jpg",
  features: [
    "Intent-based enquiries (buy, rent, invest)",
    "Verified buyer & renter profiles",
    "Direct agent–client messaging",
    "Lead qualification & engagement tracking",
  ],
  cta: "Explore Properties",
  href: "https://propzone.co.zw",
},
  {
    id: "datapulse",
    name: "DataPulse",
    tagline: "Analytics that make sense",
    description:
      "Transform raw data into clear insights. DataPulse gives you the metrics that matter, without the complexity.",
    icon: BarChart3,
    color: "bg-neutral-900",
    textColor: "text-white",
    image: "/analytics-dashboard-charts-minimal-dark-theme.jpg",
    features: [
      "Real-time dashboards",
      "Custom reports in clicks",
      "AI-powered insights",
      "Team collaboration built-in",
    ],
    cta: "See Your Data",
    href: "#",
  },
  {
    id: "launchkit",
    name: "LaunchKit",
    tagline: "Ship MVPs in weeks, not months",
    description:
      "Pre-built modules, authentication, payments, and more. Everything you need to go from idea to live product fast.",
    icon: Rocket,
    color: "bg-neutral-200",
    textColor: "text-neutral-900",
    image: "/startup-dashboard-launch-progress-clean-interface.jpg",
    features: [
      "Auth, payments, emails ready",
      "Modern tech stack",
      "Deploy with one click",
      "Scale when you need to",
    ],
    cta: "Build Faster",
    href: "#",
  },
];

const productsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: products.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SoftwareApplication",
      name: product.name,
      description: product.description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free trial available",
      },
    },
  })),
};

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              Our Products
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance">
              Tools we built.
              <br />
              <span className="text-muted-foreground">Problems we solved.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
              We don&apos;t just build for clients. We create products that
              address real pain points we&apos;ve experienced ourselves.
            </p>
          </div>
        </div>
      </section>

      {/* Products Detail Sections */}
      {products.map((product, index) => {
        const Icon = product.icon;
        const isEven = index % 2 === 0;

        return (
          <section
            key={product.id}
            id={product.id}
            className={`py-20 md:py-32 px-6 scroll-mt-20 ${
              index % 2 === 1 ? "bg-secondary" : ""
            }`}
          >
            <div className="container mx-auto">
              <div
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  isEven ? "" : "lg:grid-flow-dense"
                }`}
              >
                {/* Content */}
                <div className={isEven ? "" : "lg:col-start-2"}>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`p-2 rounded-lg ${
                        product.textColor === "text-white"
                          ? "bg-neutral-800"
                          : "bg-neutral-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm uppercase tracking-widest text-muted-foreground">
                      {product.name}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 text-balance">
                    {product.tagline}
                  </h2>

                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                    {product.description}
                  </p>

                  <ul className="space-y-3 mb-10">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                          <Check className="w-3 h-3 text-background" />
                        </div>
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="group text-base px-8">
                      {product.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-base px-8 bg-transparent"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>

                {/* Image Card */}
                <div className={isEven ? "" : "lg:col-start-1 lg:row-start-1"}>
                  <div
                    className={`relative ${product.color} rounded-3xl p-6 pt-8 min-h-[400px] md:min-h-[500px] overflow-hidden`}
                  >
                    <div className="relative z-10 mb-4">
                      <span
                        className={`text-sm uppercase tracking-widest ${product.textColor} opacity-60`}
                      >
                        {product.name}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-4 right-4 translate-y-8">
                      <div className="rounded-t-xl overflow-hidden shadow-2xl">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={`${product.name} dashboard interface`}
                          width={600}
                          height={400}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-balance">
            Need something custom?
          </h2>
          <p className="text-xl md:text-2xl opacity-80 mb-10 max-w-2xl mx-auto">
            Our products are great. But sometimes you need something built just
            for you. Let&apos;s talk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              className="group text-base px-8 bg-transparent border-background text-background hover:bg-background hover:text-foreground"
              asChild
            >
              <Link href="/#services">
                View Services
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="group text-base px-8 bg-background text-foreground hover:bg-background/90"
            >
              Start a Project
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
