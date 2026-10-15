import type { Metadata } from "next";
import { FaqSection } from "@/components/faq";
import { AiTrainingHero } from "@/components/ai-training/hero";
import { WhatYouWillLearn } from "@/components/ai-training/what-you-will-learn";
import { FeaturedCourse } from "@/components/ai-training/featured-course";
import { WhyDifferent } from "@/components/ai-training/why-different";
import { CourseStructure } from "@/components/ai-training/course-structure";
import { LearningFlow } from "@/components/ai-training/learning-flow";
import { Certificate } from "@/components/ai-training/certificate";
import { WhoIsThisFor } from "@/components/ai-training/who-is-this-for";
import { AiTrainingCta } from "@/components/ai-training/final-cta";
import { isCoursePublished, type FreeCourseOverview } from "@/components/ai-training/featured-course";
import { aiTrainingFaqs } from "@/lib/constants";
import { fetchLearning } from "@/sanity/lib/fetch";
import { freeCourseOverviewQuery } from "@/sanity/lib/queries";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "AI Training in Zimbabwe: ChatGPT, Gemini & Practical AI Skills",
  description:
    "Free, practical AI training for Zimbabweans. Learn to use ChatGPT and Gemini for research, writing, analysis and work. Verify AI answers, understand limitations and apply AI responsibly.",
  keywords: [
    "AI training Zimbabwe",
    "ChatGPT course Zimbabwe",
    "Gemini AI training Zimbabwe",
    "free AI course Zimbabwe",
    "AI skills Zimbabwe",
    "AI for business Zimbabwe",
    "how to use AI Zimbabwe",
    "AI literacy Zimbabwe",
    "AI prompts Zimbabwe",
    "fact-check AI Zimbabwe",
    "AI writing Zimbabwe",
    "practical AI course",
    "Sparkline AI Foundations",
  ],
  alternates: {
    canonical: "https://www.sparklinelabs.co.zw/ai-training",
  },
  openGraph: {
    title: "AI Training in Zimbabwe: Practical Skills for Work and Business",
    description:
      "Free, practical AI training for Zimbabweans. Learn ChatGPT, Gemini, fact-checking and responsible AI use. Self-paced. Certificate available.",
    url: "https://www.sparklinelabs.co.zw/ai-training",
  },
};

// ─── Structured Data ──────────────────────────────────────────────────────────

function buildCourseSchema(course: FreeCourseOverview) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDescription,
    url: `https://www.sparklinelabs.co.zw/ai-training/${course.slug}`,
    provider: {
      "@type": "Organization",
      name: "Sparkline Labs",
      url: "https://www.sparklinelabs.co.zw",
    },
    educationalLevel: course.level === "advanced" ? "Advanced" : course.level === "intermediate" ? "Intermediate" : "Beginner",
    isAccessibleForFree: true,
    courseMode: ["self-paced", "online"],
    inLanguage: "en",
    syllabusSections: (course.modules ?? []).map((m) => ({
      "@type": "Syllabus",
      name: m.title,
      description: m.description,
    })),
  };
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: aiTrainingFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AiTrainingPage() {
  const course = await fetchLearning<FreeCourseOverview | null>(freeCourseOverviewQuery);
  const published = isCoursePublished(course);
  const courseHref = published ? `/ai-training/${course.slug}` : undefined;

  return (
    <>
      {/* Only advertise the Course to search engines once it is actually available */}
      {published && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCourseSchema(course)) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <AiTrainingHero courseHref={courseHref} />
      <WhatYouWillLearn />
      <FeaturedCourse course={course} />
      <WhyDifferent />
      <CourseStructure course={course} />
      <LearningFlow />
      <Certificate />
      <WhoIsThisFor />

      <FaqSection
        faqs={aiTrainingFaqs}
        heading="Common questions about the AI course"
        subheading="Straightforward answers. No marketing copy."
      />

      <AiTrainingCta courseHref={courseHref} />
    </>
  );
}
