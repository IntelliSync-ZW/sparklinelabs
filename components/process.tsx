const steps = [
  {
    number: "01",
    title: "Listen",
    description:
      "We understand your goals before writing a single line of code.",
  },
  {
    number: "02",
    title: "Plan",
    description: "A clear roadmap from where you are to where you want to be.",
  },
  {
    number: "03",
    title: "Build",
    description: "Weekly progress. Clear communication. No surprises.",
  },
  {
    number: "04",
    title: "Launch",
    description: "Ship with confidence and iterate based on real feedback.",
  },
];

export function Process() {
  return (
    <section
      id="process"
      className="py-20 md:py-32 px-6 bg-primary text-primary-foreground scroll-mt-20"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-base uppercase tracking-widest text-primary-foreground/60 mb-4">
            How we work
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            Simple. Transparent. Effective.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <span className="text-6xl md:text-7xl font-semibold text-primary-foreground/10 mb-4 block">
                {step.number}
              </span>
              <h3 className="text-2xl font-medium mb-3">{step.title}</h3>
              <p className="text-lg text-primary-foreground/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
