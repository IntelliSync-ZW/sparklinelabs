import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { FreeCourseOverview } from "./featured-course";

const numberWords = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

export function CourseStructure({ course }: { course: FreeCourseOverview | null }) {
  const modules = course?.modules ?? [];
  if (modules.length === 0) return null;

  const published = course?.status === "published";
  const count = numberWords[modules.length] ?? String(modules.length);

  return (
    <section className="py-20 md:py-32 px-6" id="course-structure">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-4">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              Course Structure
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-6">
              {count} module{modules.length === 1 ? "" : "s"}. Practical from day one.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Each module builds on the last. Every lesson requires you to
              demonstrate what you have learned before moving on.
            </p>
          </div>

          <div className="md:col-span-8">
            <div className="divide-y divide-border">
              {modules.map((module) => {
                const body = (
                  <>
                    <span className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground pt-0.5 shrink-0 w-8">
                      {String(module.number).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium mb-1">{module.title}</h3>
                      {module.description && (
                        <p className="text-base text-muted-foreground line-clamp-2">{module.description}</p>
                      )}
                      {module.lessonCount > 0 && (
                        <p className="text-sm text-muted-foreground/80 mt-2">
                          {module.lessonCount} lesson{module.lessonCount === 1 ? "" : "s"}
                        </p>
                      )}
                    </div>
                    {published && (
                      <ChevronRight className="size-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0 mt-0.5" />
                    )}
                  </>
                );
                const className =
                  "group flex gap-6 py-6 first:pt-0 last:pb-0 hover:bg-secondary -mx-4 px-4 rounded-lg transition-colors";

                return published ? (
                  <Link key={module._id} href={`/ai-training/${course!.slug}/${module.slug}`} className={className}>
                    {body}
                  </Link>
                ) : (
                  <div key={module._id} className={className}>
                    {body}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
