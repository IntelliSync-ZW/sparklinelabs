import type { Metadata } from "next";
import { fetchLegalPage } from "@/sanity/lib/fetch";
import { legalPageBySlugQuery } from "@/sanity/lib/queries";
import { FALLBACK_TERMS_OF_SERVICE, type LegalPageData } from "@/lib/legal-data";
import { LegalPageView } from "@/components/legal/legal-page-view";

export const dynamic = "force-static";
export const revalidate = 300;

async function getTermsData(): Promise<LegalPageData> {
  try {
    const sanityData = await fetchLegalPage<LegalPageData | null>(
      legalPageBySlugQuery,
      { slug: "terms-of-service" }
    );
    if (sanityData && sanityData.sections && sanityData.sections.length > 0) {
      return sanityData;
    }
  } catch {
    /* Fallback to static legal data if Sanity is unreachable or unconfigured */
  }
  return FALLBACK_TERMS_OF_SERVICE;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getTermsData();
  const title = data.seo?.title || `${data.title} | Sparkline Labs`;
  const description =
    data.seo?.description ||
    "Statutory Terms of Service, technical SLA conditions, IP allocation, and operating mandate for Sparkline Labs (Private) Limited. Governed by Zimbabwean law.";
  const canonicalUrl = "https://www.sparklinelabs.co.zw/terms-of-service";

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Sparkline Labs",
      locale: "en_ZW",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TermsOfServicePage() {
  const data = await getTermsData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: data.title,
    description: data.seo?.description || data.preamble,
    url: "https://www.sparklinelabs.co.zw/terms-of-service",
    publisher: {
      "@type": "Organization",
      name: "Sparkline Labs (Private) Limited",
      url: "https://www.sparklinelabs.co.zw",
    },
    dateModified: data.lastUpdated,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LegalPageView data={data} />
    </>
  );
}
