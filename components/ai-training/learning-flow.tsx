import { ChevronDown } from "lucide-react";

const steps = [
  { label: "Learn", highlight: false },
  { label: "Practise", highlight: false },
  { label: "Complete Required Task", highlight: true },
  { label: "Pass Assessment", highlight: true },
  { label: "Unlock Next Lesson", highlight: false },
  { label: "Complete Course", highlight: false },
  { label: "Optional Certificate", highlight: false },
];

export function LearningFlow() {
  return (
    <section className="py-20 md:py-32 px-6 bg-secondary" id="how-learning-works">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            How Learning Works
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance max-w-2xl mx-auto">
            You earn each lesson. You don&apos;t click past it.
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
            Progressive unlocking means the certificate means something — because
            completion required actual work.
          </p>
        </div>

        <div className="max-w-xs mx-auto">
          <div className="flex flex-col items-center gap-0">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center w-full">
                <div
                  className={`w-full rounded-xl px-6 py-4 text-center font-medium transition-all ${
                    step.highlight
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-background border border-border"
                  }`}
                >
                  {step.label}
                </div>
                {index < steps.length - 1 && (
                  <div className="flex flex-col items-center py-1">
                    <ChevronDown className="size-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
