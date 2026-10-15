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
    <section className="py-16 md:py-20 px-6 bg-secondary" id="how-learning-works">
      <div className="container mx-auto">
        <div className="text-center mb-10">
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

        <ol className="relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 max-w-5xl mx-auto">
          {/* Connecting line behind the step numbers (large screens only) */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute left-[7%] right-[7%] top-5.5 h-px bg-border"
          />
          {steps.map((step, index) => (
            <li
              key={step.label}
              className="relative flex flex-col items-center text-center gap-2"
            >
              <span
                className={`relative z-10 flex size-11 items-center justify-center rounded-full text-sm font-semibold border ${
                  step.highlight
                    ? "bg-accent text-accent-foreground border-accent shadow-md"
                    : "bg-background text-muted-foreground border-border"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`text-sm leading-snug text-balance ${
                  step.highlight ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
