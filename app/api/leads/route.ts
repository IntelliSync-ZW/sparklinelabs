import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: "published",
});

type LeadPayload = {
  name?: string;
  phone?: string;
  company?: string;
  service?: string;
  pageTitle: string;
  pageUrl: string;
  channel: "whatsapp" | "email";
  captureStatus: "captured" | "skipped";
};

function isValidPayload(payload: Partial<LeadPayload>): payload is LeadPayload {
  return Boolean(
    payload.pageTitle?.trim() &&
    payload.pageUrl?.trim() &&
    /^https?:\/\//.test(payload.pageUrl) &&
    ["whatsapp", "email"].includes(payload.channel ?? "") &&
    ["captured", "skipped"].includes(payload.captureStatus ?? "") &&
    (payload.captureStatus === "skipped" ||
      Boolean(payload.name?.trim() && payload.phone?.trim())),
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<LeadPayload>;

    if (!isValidPayload(payload)) {
      return NextResponse.json(
        { error: "Name, phone, page title and page URL are required." },
        { status: 400 },
      );
    }

    const createdAt = new Date().toISOString();
    const lead = await writeClient.create({
      _type: "contactLead",
      ...(payload.name?.trim() && { name: payload.name.trim() }),
      ...(payload.phone?.trim() && { phone: payload.phone.trim() }),
      ...(payload.company?.trim() && { company: payload.company.trim() }),
      ...(payload.service?.trim() && { service: payload.service.trim() }),
      pageTitle: payload.pageTitle.trim(),
      pageUrl: payload.pageUrl.trim(),
      channel: payload.channel,
      captureStatus: payload.captureStatus,
      stage: "new",
      stageHistory: [
        { _key: `new-${Date.now()}`, stage: "new", changedAt: createdAt },
      ],
      createdAt,
    });

    return NextResponse.json({ id: lead._id }, { status: 201 });
  } catch (error) {
    console.error("Unable to save contact lead", error);
    return NextResponse.json({ error: "Unable to save lead" }, { status: 500 });
  }
}
