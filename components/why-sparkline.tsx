import { Zap, Shield, Users, Clock } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Speed Without Sacrifice",
    description: "Ship faster without cutting corners on quality.",
  },
  {
    icon: Shield,
    title: "Built to Last",
    description: "Scalable architecture that grows with you.",
  },
  {
    icon: Users,
    title: "Your Team, Extended",
    description: "We work alongside you, not in a silo.",
  },
  {
    icon: Clock,
    title: "No Surprises",
    description: "Transparent timelines. Clear communication.",
  },
];

export function WhySparkline() {
  return (
    <section className="py-20 md:py-32 px-6">
      <div className="container mx-auto">
        {/* Unique asymmetric layout */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          {/* Left column - Large statement */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              Why Sparkline Labs
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
              We obsess over
              <span className="block mt-2 relative">
                your success
                <span className="absolute -bottom-2 left-0 w-24 h-1 bg-foreground"></span>
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Not billable hours. Not scope creep. Just outcomes that move your
              business forward.
            </p>
          </div>

          {/* Right column - Staggered reason cards */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className={`group p-6 md:p-8 border border-border rounded-xl transition-all hover:border-foreground hover:shadow-lg ${
                    index % 2 === 1 ? "md:translate-y-8" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <reason.icon className="w-5 h-5" />
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
