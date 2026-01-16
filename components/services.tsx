import Image from "next/image";

const services = [
  {
    title: "Custom Development",
    description: "Web apps and platforms built exactly for your workflow.",
    color: "bg-neutral-900",
    textColor: "text-white",
    image: "/minimal-code-editor-dark-theme-interface.jpg",
  },
  {
    title: "System Integration",
    description: "Connect your tools. Automate everything.",
    color: "bg-neutral-200",
    textColor: "text-neutral-900",
    image: "/connected-systems-flowchart-minimal-diagram.jpg",
  },
  {
    title: "Technical Strategy",
    description: "Expert guidance on architecture and scaling.",
    color: "bg-neutral-800",
    textColor: "text-white",
    image: "/whiteboard-planning-strategy-minimal.jpg",
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 md:py-32 px-6 scroll-mt-20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Services
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            We build what you need
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative ${service.color} hover:border-accent rounded-2xl min-h-[380px] flex flex-col overflow-hidden transition-transform hover:-translate-y-1`}
            >
              <div className="relative z-10 p-6 pb-0">
                <h3
                  className={`text-xl md:text-2xl font-medium mb-2 ${service.textColor}`}
                >
                  {service.title}
                </h3>
                <p
                  className={`text-base ${service.textColor} opacity-80 leading-relaxed`}
                >
                  {service.description}
                </p>
              </div>

              <div className="relative flex-1 mt-auto pt-8">
                <div className="absolute bottom-0 left-4 right-4 translate-y-6 rounded-t-lg overflow-hidden shadow-2xl">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
