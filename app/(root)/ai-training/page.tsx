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
import { aiTrainingFaqs } from "@/lib/constants";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "AI Training in Zimbabwe — ChatGPT, Gemini & Practical AI Skills",
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
    title: "AI Training in Zimbabwe — Practical Skills for Work and Business",
    description:
      "Free, practical AI training for Zimbabweans. Learn ChatGPT, Gemini, fact-checking and responsible AI use. Self-paced. Certificate available.",
    url: "https://www.sparklinelabs.co.zw/ai-training",
  },
};

// ─── Structured Data ──────────────────────────────────────────────────────────

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Sparkline AI Foundations",
  description:
    "Practical AI training for Zimbabweans covering ChatGPT, Gemini, research, writing, fact-checking, and responsible AI use.",
  url: "https://www.sparklinelabs.co.zw/ai-training",
  provider: {
    "@type": "Organization",
    name: "Sparkline Labs",
    url: "https://www.sparklinelabs.co.zw",
  },
  educationalLevel: "Beginner",
  isAccessibleForFree: true,
  courseMode: ["self-paced", "online"],
  inLanguage: "en",
};

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

export default function AiTrainingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <AiTrainingHero />
      <WhatYouWillLearn />
      <FeaturedCourse />
      <WhyDifferent />
      <CourseStructure />
      <LearningFlow />
      <Certificate />
      <WhoIsThisFor />

      <FaqSection
        faqs={aiTrainingFaqs}
        heading="Common questions about the AI course"
        subheading="Straightforward answers — no marketing copy."
      />

      <AiTrainingCta />
    </>
  );
}
