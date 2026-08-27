import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";

export function Hero() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6">
      <div className="container mx-auto">
        <div className="text-center">
          <p className="text-base uppercase tracking-widest opacity-70 font-medium mb-6">
            Solutions Engineering - Harare, Zimbabwe
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl max-w-6xl mx-auto font-semibold tracking-tight leading-[1.05] text-balance mb-8">
            We engineer systems African businesses can actually run.
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed text-pretty">
            We&apos;re the team behind Propertyzone. We design and engineer the digital systems businesses need to operate better: connecting people, processes, data and software around the conditions that actually exist in Zimbabwe and across Africa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="text-base px-8 py-6 group bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                Tell us what isn&apos;t working
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 bg-transparent"
              asChild
            >
              <a
                href="https://www.propzone.co.zw/en/"
                target="_blank"
                rel="noopener noreferrer"
              >
                See what we&apos;ve engineered
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
