import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, ArrowRight } from "lucide-react";

const courseFeatures = [
  "Free",
  "Beginner level",
  "Self-paced",
  "15 lessons",
  "Practical assessments",
  "Certificate of Completion available",
];

export function FeaturedCourse() {
  return (
    <section className="py-20 md:py-32 px-6" id="free-course">
      <div className="container mx-auto">
        <div className="mb-12">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Featured Course
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            The free course to start with.
          </h2>
        </div>

        <div className="bg-secondary border border-border rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-accent bg-accent/10 rounded-full px-4 py-1.5 mb-6">
                <BookOpen className="size-4" />
                Free Course
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                Sparkline AI Foundations
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                A structured, self-paced introduction to practical AI use. Built around
                how people actually work in Zimbabwe.
              </p>
              <Button
                size="lg"
                className="text-base px-8 py-6 group bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link href="/ai-training/free-ai-course" id="course-card-cta">
                  Start Free Course
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div>
              <ul className="space-y-4">
                {courseFeatures.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="size-5 text-accent shrink-0" />
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
