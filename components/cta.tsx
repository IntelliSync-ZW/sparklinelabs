import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";

export function CTA() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

  return (
    <section className="py-20 md:py-32 px-6 bg-secondary">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6 text-balance">
          Something in your business isn&apos;t working? Let&apos;s look at it.
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Tell us what is slowing the business down, where work is being duplicated, what your customers struggle with, or what you wish your existing systems could do. We&apos;ll tell you whether technology can solve it, what we&apos;d recommend, and what the next step would be.
        </p>
        <Button
          size="lg"
          className="text-base px-8 py-6 group bg-accent text-accent-foreground hover:bg-accent/90"
          asChild
        >
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            Describe the problem
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
    </section>
  );
}
