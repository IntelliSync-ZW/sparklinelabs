import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { allCaseStudiesQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected case studies from Sparkline Labs. How we built Propertyzone, custom platforms, internal tools, and SaaS products for Zimbabwean and African businesses.",
  alternates: { canonical: "https://sparklinelabs.co.zw/work" },
  openGraph: {
    title: "Work | Sparkline Labs",
    description: "Case studies - how we ship software in Zimbabwe.",
    url: "https://sparklinelabs.co.zw/work",
  },
};

type CaseStudy = {
  title: string;
  slug: { current: string };
  industry: string;
  clientName: string;
  heroImage: string;
  publishedAt: string;
  productRef?: { name: string; href: string };
};

export const revalidate = 300;

export default async function WorkPage() {
  let caseStudies: CaseStudy[] = [];

  try {
    caseStudies = await client.fetch<CaseStudy[]>(allCaseStudiesQuery);
  } catch {
    // Sanity not configured yet
  }

  return (
    <>
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <p className="text-base uppercase tracking-widest text-muted-foreground mb-4">
            Selected work
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance">
            Things we&apos;ve shipped.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Case studies from custom builds and our own products. Real problems,
            real outcomes, real numbers.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-4xl">
          {caseStudies.length === 0 ? (
            /* Static fallback until Sanity is populated */
            <div className="border border-border rounded-2xl overflow-hidden">
              <div className="p-8">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 mb-4 block">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Live in production
                </span>
                <h2 className="text-3xl font-semibold mb-2">
                  Building Propertyzone
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Zimbabwe&apos;s intent-first property platform - real estate
                  tech built for the conditions that exist on the ground.
                </p>
                <Link
                  href="/work/propertyzone"
                  className="inline-flex items-center gap-2 text-base font-medium hover:underline"
                >
                  Read the case study
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {caseStudies.map((study) => (
                <div
                  key={study.slug.current}
                  className="border border-border rounded-2xl overflow-hidden"
                >
                  {study.heroImage && (
                    <div className="relative h-64 w-full">
                      <Image
                        src={study.heroImage}
                        alt={study.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    {study.industry && (
                      <span className="text-sm uppercase tracking-widest text-muted-foreground block mb-2">
                        {study.industry}
                      </span>
                    )}
                    <h2 className="text-3xl font-semibold mb-2">{study.title}</h2>
                    <Link
                      href={`/work/${study.slug.current}`}
                      className="inline-flex items-center gap-2 text-base font-medium hover:underline"
                    >
                      Read case study
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
