import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "propertyzone",
    tagline: "List, manage and discover properties",
    description: "Connect buyers, renters and landlords in one platform.",
    color: "bg-neutral-100",
    textColor: "text-neutral-900",
    image: "/workflow-automation-dashboard-clean-minimal-light.jpg",
  },
  {
    name: "DataPulse",
    tagline: "Analytics that make sense",
    description: "See insights. Act fast.",
    color: "bg-neutral-900",
    textColor: "text-white",
    image: "/analytics-dashboard-charts-minimal-dark-theme.jpg",
  },
  {
    name: "LaunchKit",
    tagline: "Ship MVPs in weeks, not months",
    description: "Pre-built modules. Rapid deployment.",
    color: "bg-neutral-200",
    textColor: "text-neutral-900",
    image: "/startup-dashboard-launch-progress-clean-interface.jpg",
  },
];

export function Products() {
  return (
    <section
      id="products"
      className="py-20 md:py-32 px-6 bg-secondary scroll-mt-20"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Our Products
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance mb-6">
            SaaS tools we built and run
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We create products that solve real problems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {products.map((product, index) => (
            <div
              key={index}
              className={`group relative ${product.color} rounded-2xl min-h-[420px] flex flex-col overflow-hidden transition-transform hover:-translate-y-1`}
            >
              <div className="relative z-10 p-6 pb-0">
                <p
                  className={`text-sm uppercase tracking-widest ${product.textColor} opacity-60 mb-2`}
                >
                  {product.name}
                </p>
                <h3
                  className={`text-xl md:text-2xl font-medium mb-2 ${product.textColor}`}
                >
                  {product.tagline}
                </h3>
                <p
                  className={`text-base ${product.textColor} opacity-80 leading-relaxed`}
                >
                  {product.description}
                </p>
              </div>

              <div className="relative flex-1 mt-auto pt-8">
                <div className="absolute bottom-0 left-4 right-4 translate-y-6 rounded-t-lg overflow-hidden shadow-2xl">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="group text-base bg-transparent px-8 py-6"
            asChild
          >
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
