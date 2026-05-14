import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_PROJECT_MESSAGE } from "@/lib/config";

export function CTA() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;

  return (
    <section className="py-20 md:py-32 px-6 bg-secondary">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6 text-balance">
          Got a project? Let&apos;s talk on WhatsApp.
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed">
          Send a message describing what you want built. We respond within two
          working hours during weekdays (Harare time) with whether it&apos;s a
          fit and what the next step is. No pitch deck. No discovery call until
          we&apos;ve both decided it&apos;s worth one.
        </p>
        <Button
          size="lg"
          className="text-base px-8 py-6 group bg-accent text-accent-foreground hover:bg-accent/90"
          asChild
        >
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            Start on WhatsApp
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
    </section>
  );
}
