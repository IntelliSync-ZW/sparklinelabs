import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/** `courseHref` is the published free course URL; omit it while the course is unpublished. */
export function AiTrainingCta({ courseHref }: { courseHref?: string }) {
  return (
    <section className="py-20 md:py-32 px-6 bg-secondary">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6 text-balance text-center">
          {courseHref ? "Start the Free AI Course" : "The Free AI Course Is Coming Soon"}
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Learn the tools. Verify the answers. Apply AI properly.
        </p>
        {courseHref ? (
          <Button
            size="lg"
            className="text-base px-8 py-6 group bg-accent text-accent-foreground hover:bg-accent/90"
            asChild
          >
            <Link href={courseHref}>
              Start for Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        ) : (
          <Button size="lg" className="text-base px-8 py-6 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="#free-course">Register your interest</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
