import Image from "next/image";

export function Problem() {
  return (
    <section className="py-20 md:py-32 px-6 bg-secondary">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
              The operating reality
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 text-balance">
              Most digital solutions are designed around assumptions Zimbabwean businesses don&apos;t have.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
              A system can be technically excellent and still be wrong for the business using it. It can assume constant connectivity, force customers away from WhatsApp, ignore local payment rails, create work instead of removing it, or depend on a process nobody inside the business can actually maintain. <br />
              We start with the operating reality first: how your team works, where information gets lost, what customers already use, what constraints cannot be removed, and where technology can create a measurable improvement.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Then we engineer around those conditions - whether that means changing a workflow, connecting existing tools, automating a repetitive process, or building a completely new system.
            </p>
          </div>

          <div className="relative aspect-4/3 rounded-xl overflow-hidden">
            <Image
              src="/reality.png"
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
