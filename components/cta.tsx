import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 md:py-32 px-6 bg-secondary">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6 text-balance">
          Ready to build something great?
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed">
          No pitch decks. No pressure. Just a real conversation about your goals.
        </p>
        <Button size="lg" className="text-base px-8 py-6 group bg-accent text-accent-foreground hover:bg-accent/90">
          Schedule a Call
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  )
}
