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
              Great ideas deserve great execution
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              You need software that delivers. Not promises. Not delays. Just
              results that move your business forward.
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
