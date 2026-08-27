import { Zap, Shield, Users, Clock } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Engineering tied to an outcome",
    description:
      "We define what is being solved, what will be delivered and what it will cost before implementation begins.",
  },
  {
    icon: Shield,
    title: "Workflow before automation",
    description:
      "We understand the real process before automating it. That prevents expensive systems from being built around assumptions that don't survive contact with the business.",
  },
  {
    icon: Users,
    title: "Engineered for local conditions",
    description:
      "WhatsApp-first customers, local payment rails, unreliable connectivity, mobile-first users and the operational realities of African businesses are design inputs, not afterthoughts.",
  },
  {
    icon: Clock,
    title: "Direct engineering",
    description:
      "You work directly with the people understanding the problem, designing the solution and engineering the system. No layers of account managers translating your business into tickets.",
  },
];

export function WhySparkline() {
  return (
    <section className="py-20 md:py-32 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          {/* Left column */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              Why Sparkline
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
              We engineer around the business, not around the technology.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We don&apos;t start with a technology stack or a list of features. We start with the operational problem and work backwards to the simplest system capable of solving it. The result may be an integration, an automation, an internal tool, or an entirely new platform.
            </p>
          </div>

          {/* Right column */}
          <div className="md:col-span-7">
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className={`group p-6 md:p-8 border border-border rounded-xl transition-all hover:border-foreground hover:shadow-lg ${index % 2 === 1 ? "md:translate-y-8" : ""
                    }`}
                >
                  <div className="w-12 h-12 rounded-full bg-accent text-background flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <reason.icon className="size-5" />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {reason.description}
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
