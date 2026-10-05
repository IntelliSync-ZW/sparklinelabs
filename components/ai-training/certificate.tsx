import { Award } from "lucide-react";

const tiers = [
  {
    label: "Complete the course",
    value: "Free",
    note: "No cost to learn",
  },
  {
    label: "Digital learning record",
    value: "Free",
    note: "Issued on completion",
  },
  {
    label: "Official certificate",
    value: "US$5",
    note: "Optional, one-time fee",
  },
];

export function Certificate() {
  return (
    <section className="py-20 md:py-32 px-6" id="certificate">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-2 flex md:flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-accent text-background flex items-center justify-center">
                <Award className="size-8" />
              </div>
            </div>

            <div className="md:col-span-10">
              <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
                Certificate
              </p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-6">
                Complete the course. Get a record of your learning.
              </h2>

              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                {tiers.map((item) => (
                  <div
                    key={item.label}
                    className="p-6 border border-border rounded-xl bg-secondary"
                  >
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-2xl font-semibold mb-1">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.note}</p>
                  </div>
                ))}
              </div>

              <p className="text-base text-muted-foreground leading-relaxed">
                The certificate confirms completion of the course requirements. It is
                not a professional accreditation or certification — it is a record
                that you completed the work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
