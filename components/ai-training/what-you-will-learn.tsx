import { Brain, Shield, Lightbulb, Lock } from "lucide-react";

const skills = [
  {
    icon: Brain,
    title: "Use AI",
    description: "Research, writing, analysis and everyday work.",
  },
  {
    icon: Shield,
    title: "Verify AI",
    description:
      "Fact-check answers, inspect citations and identify unsupported claims.",
  },
  {
    icon: Lightbulb,
    title: "Think With AI",
    description: "Use AI to challenge assumptions and compare decisions.",
  },
  {
    icon: Lock,
    title: "Work Safely",
    description:
      "Understand privacy, sensitive information and AI limitations.",
  },
];

export function WhatYouWillLearn() {
  return (
    <section
      className="py-20 md:py-32 px-6 bg-secondary"
      id="what-you-will-learn"
    >
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            What You Will Learn
          </p>
          <h2 className="text-4xl md:text-5xl text-center font-semibold tracking-tight text-balance max-w-2xl mx-auto">
            Four practical skills for working with AI.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {skills.map((item, index) => (
            <div
              key={index}
              className="group p-6 md:p-8 border border-border rounded-xl bg-background transition-all hover:border-foreground hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-accent text-background flex items-center justify-center mb-5 transition-transform group-hover:scale-110">
                <item.icon className="size-5" />
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-2">
                {item.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
