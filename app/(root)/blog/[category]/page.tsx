import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";
import { BlogList, PostGridSkeleton } from "@/components/blog/blog-list";
import { FaqSection } from "@/components/faq";
import { fetchCategories, sanityFetch } from "@/sanity/lib/fetch";
import {
  allCategoriesQuery,
  postCategoryBySlugQuery,
} from "@/sanity/lib/queries";
import {
  solutionsEngineeringFaqs,
  softwareIndustryFaqs,
  seoDigitalStrategyFaqs,
  proptechFaqs,
} from "@/lib/constants";

type Category = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
};

type FaqItem = { question: string; answer: string };

const CATEGORY_FAQS: Record<string, FaqItem[]> = {
  "solutions-engineering": solutionsEngineeringFaqs,
  "software-industry": softwareIndustryFaqs,
  "seo-and-digital-strategy": seoDigitalStrategyFaqs,
  "proptech-real-estate": proptechFaqs,
};

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  let categories: Category[] = [];
  try {
    categories = await fetchCategories<Category[]>(allCategoriesQuery);
  } catch {
    /* Sanity not configured */
  }

  const category = categories.find((c) => c.slug.current === categorySlug);
  if (!category) return { title: "Blog" };

  return {
    title: `${category.title} Articles | Sparkline Labs`,
    description:
      category.description ??
      `Read the latest engineering playbooks and insights on ${category.title} from Sparkline Labs.`,
    alternates: {
      canonical: `https://www.sparklinelabs.co.zw/blog/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: categorySlug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);

  if (categorySlug === "authors") notFound();

  let categories: Category[] = [];
  try {
    categories = await fetchCategories<Category[]>(allCategoriesQuery);
  } catch {
    /* Sanity not configured */
  }

  const category = categories.find((c) => c.slug.current === categorySlug);

  // If not a recognized category, check if this is an old post URL (e.g. /blog/my-old-post-slug)
  if (!category) {
    let postData: { slug: string; category?: string } | null = null;
    try {
      postData = await sanityFetch<{ slug: string; category?: string }>({
        query: postCategoryBySlugQuery,
        params: { slug: categorySlug },
        tags: ["post"],
      });
    } catch {
      /* fetch failed */
    }

    if (postData?.slug) {
      const targetCategory = postData.category ?? "uncategorised";
      redirect(`/blog/${targetCategory}/${postData.slug}`, RedirectType.replace);
    }

    notFound();
  }

  const categoryFaqs = CATEGORY_FAQS[categorySlug] ?? null;

  const faqSchema = categoryFaqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: categoryFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4">
            Topic
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance max-w-3xl">
            {category.title}
          </h1>
          {category.description && (
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Blog list */}
      <section className="pb-20 md:pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <Suspense fallback={<PostGridSkeleton />}>
            <BlogList activeCategory={categorySlug} currentPage={page} />
          </Suspense>
        </div>
      </section>

      {/* Category FAQ */}
      {categoryFaqs && (
        <FaqSection
          faqs={categoryFaqs}
          heading={`Questions about ${category.title}`}
        />
      )}
    </>
  );
}
