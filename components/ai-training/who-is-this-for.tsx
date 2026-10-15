import { Briefcase, Building2, GraduationCap, Users } from "lucide-react";

const audiences = [
  {
    icon: Briefcase,
    title: "Professionals",
    description: "Use AI for reports, research, writing and everyday work.",
  },
  {
    icon: Building2,
    title: "Business Owners",
    description:
      "Use AI for business research, customer communication and operations.",
  },
  {
    icon: GraduationCap,
    title: "Students",
    description: "Research, understand and write more effectively.",
  },
  {
    icon: Users,
    title: "Organisations",
    description: "Build practical AI literacy across teams.",
  },
];

export function WhoIsThisFor() {
  return (
    <section className="py-20 md:py-32 px-6 bg-secondary" id="who-is-this-for">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Who It Is For
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance text-center max-w-2xl mx-auto">
            Built for anyone who works with information.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {audiences.map((audience, index) => (
            <div
              key={index}
              className="group p-6 md:p-8 border border-border rounded-xl bg-background transition-all hover:border-foreground hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-accent text-background flex items-center justify-center mb-5 transition-transform group-hover:scale-110">
                <audience.icon className="size-5" />
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-2">
                {audience.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
