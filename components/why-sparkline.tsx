import { Zap, Shield, Users, Clock } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Outcome-tied pricing",
    description:
      "Flat fee per deliverable. No hourly bills, no scope creep, no discovery extension invoices.",
  },
  {
    icon: Shield,
    title: "Manual-first design",
    description:
      "We run the workflow manually with you before we automate it. Saves you money. Stops you automating the wrong thing.",
  },
  {
    icon: Users,
    title: "Zimbabwe-native stack",
    description:
      "USD billing, WhatsApp routing, Paynow / EcoCash integration, ZESA-tolerant architecture. Each one shipped in production.",
  },
  {
    icon: Clock,
    title: "Founder-led delivery",
    description:
      "Code is written by the founders. No offshoring. No agency middlemen. You talk to the people building it.",
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
              We built{" "}
              <a
                href="https://propzone.co.zw"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                Propertyzone
              </a>
              . Now we build for you.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We don&apos;t sell retainers. We sell outcomes: a defined
              deliverable for a fixed price, on a fixed timeline. That&apos;s
              the same commercial model we use for{" "}
              <a
                href="https://propzone.co.zw"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Propertyzone
              </a>
              , and it&apos;s the only one we offer clients.
            </p>
          </div>

          {/* Right column */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className={`group p-6 md:p-8 border border-border rounded-xl transition-all hover:border-foreground hover:shadow-lg ${
                    index % 2 === 1 ? "md:translate-y-8" : ""
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
