import { fetchCaseStudies } from "@/sanity/lib/fetch";
import { allCaseStudiesQuery } from "@/sanity/lib/queries";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CaseStudy = {
  title: string;
  slug: { current: string };
  industry?: string;
  publishedAt?: string;
};

export async function LatestWork() {
  let caseStudies: CaseStudy[] = [];
  try {
    caseStudies = await fetchCaseStudies<CaseStudy[]>(allCaseStudiesQuery);
  } catch {
    /* Sanity not configured */
  }

  if (caseStudies.length === 0) {
    return (
      <div className="border border-border rounded-2xl p-8">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 mb-4 block">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Live in production
        </span>
        <h3 className="text-2xl font-semibold mb-2">Building Propertyzone</h3>
        <p className="text-base text-muted-foreground mb-4">
          Zimbabwe&apos;s intent-first property platform. From zero to live agencies in production.
        </p>
        <Link
          href="/work/propertyzone"
          className="inline-flex items-center gap-2 text-base font-medium hover:underline"
        >
          Read case study
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {caseStudies.slice(0, 2).map((study) => (
        <div key={study.slug.current} className="border border-border rounded-2xl p-8">
          {study.industry && (
            <span className="text-sm uppercase tracking-widest text-muted-foreground block mb-2">
              {study.industry}
            </span>
          )}
          <h3 className="text-2xl font-semibold mb-4">{study.title}</h3>
          <Link
            href={`/work/${study.slug.current}`}
            className="inline-flex items-center gap-2 text-base font-medium hover:underline"
          >
            Read case study
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ))}
    </div>
  );
}

export function LatestWorkSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[0, 1].map((i) => (
        <div key={i} className="border border-border rounded-2xl p-8 animate-pulse">
          <div className="h-3 bg-muted rounded w-24 mb-3" />
          <div className="h-6 bg-muted rounded w-3/4 mb-4" />
          <div className="h-4 bg-muted rounded w-32" />
        </div>
      ))}
    </div>
  );
}
