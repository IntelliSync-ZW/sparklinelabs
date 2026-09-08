import type { Metadata } from "next";
import { fetchLegalPage } from "@/sanity/lib/fetch";
import { legalPageBySlugQuery } from "@/sanity/lib/queries";
import { FALLBACK_PRIVACY_POLICY, type LegalPageData } from "@/lib/legal-data";
import { LegalPageView } from "@/components/legal/legal-page-view";

export const dynamic = "force-static";
export const revalidate = 300;

async function getPrivacyData(): Promise<LegalPageData> {
  try {
    const sanityData = await fetchLegalPage<LegalPageData | null>(
      legalPageBySlugQuery,
      { slug: "privacy-policy" }
    );
    if (sanityData && sanityData.sections && sanityData.sections.length > 0) {
      return sanityData;
    }
  } catch {
    /* Fallback to static legal data if Sanity is unreachable or unconfigured */
  }
  return FALLBACK_PRIVACY_POLICY;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPrivacyData();
  const title = data.seo?.title || `${data.title} | Sparkline Labs`;
  const description =
    data.seo?.description ||
    "Official Data Governance and Privacy Policy of Sparkline Labs (Private) Limited under the Cyber Security and Data Protection Act [Chapter 12:07] of Zimbabwe.";
  const canonicalUrl = "https://www.sparklinelabs.co.zw/privacy-policy";

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

export default async function PrivacyPolicyPage() {
  const data = await getPrivacyData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: data.title,
    description: data.seo?.description || data.preamble,
    url: "https://www.sparklinelabs.co.zw/privacy-policy",
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
