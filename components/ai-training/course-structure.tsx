const modules = [
  {
    number: "01",
    title: "Understanding AI",
    description: "What generative AI is, how it works and what it actually does.",
  },
  {
    number: "02",
    title: "Getting Better Results From AI",
    description: "How to write prompts that produce useful, accurate responses.",
  },
  {
    number: "03",
    title: "Research, Sources & Fact-Checking",
    description: "How to verify AI answers and identify unsupported claims.",
  },
  {
    number: "04",
    title: "AI for Writing & Everyday Work",
    description: "Practical AI use for reports, emails, summaries and communication.",
  },
  {
    number: "05",
    title: "Safe & Responsible AI Use",
    description: "Privacy, data boundaries, limitations and when not to use AI.",
  },
];

export function CourseStructure() {
  return (
    <section className="py-20 md:py-32 px-6" id="course-structure">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-4">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              Course Structure
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-6">
              Five modules. Practical from day one.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Each module builds on the last. Every lesson requires you to
              demonstrate what you have learned before moving on.
            </p>
          </div>

          <div className="md:col-span-8">
            <div className="divide-y divide-border">
              {modules.map((module, index) => (
                <div
                  key={index}
                  className="group flex gap-6 py-6 first:pt-0 last:pb-0 hover:bg-secondary -mx-4 px-4 rounded-lg transition-colors"
                >
                  <span className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground pt-0.5 shrink-0 w-8">
                    {module.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{module.title}</h3>
                    <p className="text-base text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
