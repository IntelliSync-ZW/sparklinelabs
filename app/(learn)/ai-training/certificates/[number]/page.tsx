import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { findCertificate } from "@/lib/learning/certificates";
import {
  CertificateDocument,
  formatCertificateDate,
} from "@/components/learn/certificate/certificate-document";
import { CertificateActions } from "@/components/learn/certificate/certificate-actions";

// Looked up per request so a verification always reflects the database.
export const dynamic = "force-dynamic";

type Params = { number: string };

const BASE_URL = "https://www.sparklinelabs.co.zw";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { number } = await params;
  const cert = await findCertificate(decodeURIComponent(number));
  return {
    title: cert
      ? `${cert.certificateTitle}: ${cert.recipientName}`
      : "Certificate not found",
    description: cert
      ? `Verified ${cert.certificateTitle.toLowerCase()} for ${cert.courseTitle}, issued by Sparkline Labs.`
      : undefined,
    // Certificates carry a personal name: shareable by link, but kept out of search results.
    robots: { index: false, follow: false },
  };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { number } = await params;
  const cert = await findCertificate(decodeURIComponent(number));
  if (!cert) notFound();
  // One canonical address per certificate, however the number was typed.
  if (decodeURIComponent(number) !== cert.number)
    redirect(`/ai-training/certificates/${cert.number}`);

  const verifyUrl = `${BASE_URL}/ai-training/certificates/${cert.number}`;

  return (
    <div className="min-h-screen bg-secondary print:bg-background">
      {/* One landscape A4 page when printed or saved as PDF, with the colours kept. */}
      <style>{`
        @page { size: A4 landscape; margin: 0; }
        @media print {
          .certificate-sheet { width: 297mm; height: 210mm; aspect-ratio: auto; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <header className="border-b border-border bg-background print:hidden">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/ai-training"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Sparkline Labs AI Training
          </Link>
          <Link
            href="/ai-training/certificates"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Verify another
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 sm:py-12 print:max-w-none print:p-0">
        <p className="mx-auto flex max-w-3xl items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm print:hidden">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            <span className="font-semibold">Verified certificate.</span> Issued
            by Sparkline Labs to {cert.recipientName} for {cert.courseTitle}
            {cert.issuedAt ? ` on ${formatCertificateDate(cert.issuedAt)}` : ""}
            .
          </span>
        </p>

        <CertificateDocument
          certificateTitle={cert.certificateTitle}
          recipientName={cert.recipientName}
          courseTitle={cert.courseTitle}
          completionDate={cert.completionDate}
          number={cert.number}
          verifyUrl={verifyUrl}
        />

        <CertificateActions verifyUrl={verifyUrl} />

        {cert.courseSlug && (
          <p className="text-center text-sm text-muted-foreground print:hidden">
            <Link
              href={`/ai-training/${cert.courseSlug}`}
              className="underline underline-offset-4 hover:text-foreground"
            >
              About {cert.courseTitle}
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}
