const steps = [
  {
    number: "01",
    title: "Understand the problem",
    description:
      "We map the workflow, constraints, users, existing systems and business outcome. You leave with a clear definition of the problem, the recommended solution and a fixed-price implementation proposal.",
  },
  {
    number: "02",
    title: "Prove the solution",
    description:
      "We test the riskiest part of the solution first. If the approach does not work in your actual operating environment, we find that out before you commit to a full build.",
  },
  {
    number: "03",
    title: "Engineer and deploy",
    description:
      "We implement the agreed solution with weekly demonstrations, clear milestones and a fixed scope. Whether the solution involves software, integrations, automation or a combination of them, the objective stays the same: put the agreed capability into production.",
  },
  {
    number: "04",
    title: "Operate and improve",
    description:
      "Your team takes ownership of the system. We document the important parts, train the people responsible for operating it, and only automate further once the real workflow has proven itself.",
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
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance text-center">
            Understand first. Engineer second.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <span className="text-6xl md:text-7xl font-semibold text-primary-foreground/50 mb-4 block">
                {step.number}
              </span>
              <h3 className="text-xl font-medium mb-3">{step.title}</h3>
              <p className="text-lg text-primary-foreground/80 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
