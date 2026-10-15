import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/** `courseHref` is the published free course URL; omit it while the course is unpublished. */
export function AiTrainingHero({ courseHref }: { courseHref?: string }) {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6">
      <div className="container mx-auto">
        <div className="text-center">
          <p className="text-base uppercase tracking-widest opacity-70 font-medium mb-6">
            AI Training — Zimbabwe
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl max-w-5xl mx-auto font-semibold tracking-tight leading-[1.05] text-balance text-center mb-8">
            AI Training in Zimbabwe for Work, Business and Research
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed text-pretty text-center">
            Practical training for using ChatGPT, Gemini and other AI tools to
            research, write, analyse information and make better decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {courseHref ? (
              <Button
                size="lg"
                className="text-base px-8 py-6 group bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link href={courseHref}>
                  Start the Free AI Course
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="text-base px-8 py-6" disabled>
                Free AI Course — Coming Soon
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 bg-transparent"
              asChild
            >
              <Link href="#course-structure">
                Explore AI Training
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
