const differences = [
  {
    number: "01",
    title: "Progressive learning",
    description:
      "You cannot unlock the next lesson until you complete the required work.",
  },
  {
    number: "02",
    title: "Practical assessment",
    description:
      "You demonstrate the skill instead of only answering questions.",
  },
  {
    number: "03",
    title: "Source verification",
    description: "Learn how to check whether AI is actually telling you the truth.",
  },
  {
    number: "04",
    title: "Zimbabwean context",
    description:
      "Examples and workflows built around how people work locally.",
  },
];

export function WhyDifferent() {
  return (
    <section className="py-20 md:py-32 px-6 bg-secondary" id="why-different">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-5 flex flex-col justify-center">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              Why This Course Is Different
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
              Not generic. Not theoretical.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Most AI courses teach you to click buttons. This course teaches you to
              think — and then verify what the AI is telling you.
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              {differences.map((item, index) => (
                <div
                  key={index}
                  className={`group p-6 md:p-8 border border-border rounded-xl bg-background transition-all hover:border-foreground hover:shadow-lg ${
                    index % 2 === 1 ? "md:translate-y-8" : ""
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
                    {item.number}
                  </p>
                  <h3 className="text-lg md:text-xl font-medium mb-2">{item.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
