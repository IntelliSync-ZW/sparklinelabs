import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6">
      <div className="container mx-auto">
        <div className="text-center">
          <p className="text-base uppercase tracking-widest opacity-70 font-medium mb-6">
            Software that works as hard as you do
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl max-w-6xl mx-auto font-semibold tracking-tight leading-[1.05] text-balance mb-8">
            Your vision, built to perform
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed text-pretty">
            Custom software and powerful SaaS tools that help you move faster,
            serve better, and scale without limits.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8 py-6 group">
              Start a Project
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 bg-transparent"
            >
              Explore Our Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
