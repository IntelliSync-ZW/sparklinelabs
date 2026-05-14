import Image from "next/image";

export function Problem() {
  return (
    <section className="py-20 md:py-32 px-6 bg-secondary">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              The reality
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-balance">
              Most software sold into Zimbabwe doesn&apos;t fit Zimbabwe.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
              Foreign SaaS breaks on local payment rails, assumes 24/7 power,
              and prices in currencies your customers don&apos;t hold. Local
              builds often ship without a roadmap and stall after launch,
              leaving you with code nobody can extend.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We build for the conditions that actually exist on the ground: USD
              pricing, WhatsApp as a primary channel, offline-tolerant flows,
              and operators who need to run the system manually before it ever
              sees automation.
            </p>
          </div>

          <div className="relative aspect-square rounded-xl overflow-hidden">
            <Image
              src="/abstract-minimal-black-and-white-geometric-shapes-.jpg"
              alt="Precision and clarity"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
