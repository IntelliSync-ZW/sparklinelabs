import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

// Write-enabled Sanity client (server only — token never sent to browser)
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(req: NextRequest) {
  let postId: string | undefined;

  try {
    const body = await req.json();
    postId = typeof body?.postId === "string" ? body.postId.trim() : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  // Basic sanity-id guard (prevent injection / garbage)
  if (!/^[a-zA-Z0-9_-]{5,}$/.test(postId)) {
    return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
  }

  try {
    await writeClient
      .patch(postId)
      .setIfMissing({ viewCount: 0 })
      .inc({ viewCount: 1 })
      .commit({ autoGenerateArrayKeys: true });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[view-tracker] Sanity patch failed:", err);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}

// Disallow all other methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
