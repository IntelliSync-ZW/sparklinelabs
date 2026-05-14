const steps = [
  {
    number: "01",
    title: "Discovery (paid, 1 week)",
    description:
      "A scoping call, a written brief, a 1-page architecture diagram, and a fixed-price build proposal. You leave week one with a yes/no decision, not a follow-up next steps deck.",
  },
  {
    number: "02",
    title: "Pilot (2 weeks, fixed price)",
    description:
      "We build the riskiest slice first. If the pilot doesn't validate the approach, we stop. You keep everything we built, no cancellation fee.",
  },
  {
    number: "03",
    title: "Build (4-8 weeks, fixed price)",
    description:
      "Weekly demo. Weekly progress note. Fixed scope, fixed price, fixed timeline. Scope changes get re-quoted, not absorbed.",
  },
  {
    number: "04",
    title: "Handover and operate",
    description:
      "We train your team to run the system manually first. We automate after we've seen the workflow run for real, with real data, in your hands.",
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
            Four stages. No retainers. No scope theatre.
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
