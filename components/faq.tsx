type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  faqs: FaqItem[];
  heading?: string;
  subheading?: string;
};

export function FaqSection({
  faqs,
  heading = "Frequently asked questions",
  subheading,
}: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-4 text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {subheading}
            </p>
          )}
        </div>

        <div className="divide-y divide-border">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group py-6 first:pt-0 last:pb-0"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-6 list-none [&::-webkit-details-marker]:hidden">
                <span className="text-lg font-medium leading-snug">
                  {faq.question}
                </span>
                {/* Plus / minus icon */}
                <span
                  className="mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 4v12M4 10h12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>

              {/* Answer rendered as rich HTML with typeset styles */}
              <div
                className="typeset mt-4 text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
