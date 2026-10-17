import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import { getAuthorAccess } from "@/lib/member-posts/auth";

export const runtime = "nodejs";

// Under Vercel's 4.5 MB request limit; raise only if hosting allows
const MAX_BYTES = 4 * 1024 * 1024;
// SVG is deliberately excluded: it can carry scripts
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

// Check the real file signature, not just the browser-reported type
function isImage(b: Buffer) {
  const hex = b.subarray(0, 4).toString("hex");
  return (
    hex.startsWith("ffd8ff") || // jpeg
    hex === "89504e47" || // png
    hex === "47494638" || // gif
    (b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP")
  );
}

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

/** Image upload for the author dashboard (inline images and cover images). */
export async function POST(req: Request) {
  const access = await getAuthorAccess();
  if (!access.ok) return fail(access.reason, access.reason === "UNAUTHENTICATED" ? 401 : 403);

  // Refuse oversized bodies before reading them
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES + 64 * 1024) {
    return fail("TOO_LARGE", 413);
  }

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recent = await writeClient.fetch<number>(
    `count(*[_type == "sanity.imageAsset" && source.id == $uid && _createdAt > $since])`,
    { uid: access.userId, since },
  );
  if (recent >= 30) return fail("UPLOAD_RATE_LIMITED", 429);

  const file = await req
    .formData()
    .then((f) => f.get("file"))
    .catch(() => null);
  if (!(file instanceof File)) return fail("NO_FILE", 400);
  if (!TYPES.has(file.type)) return fail("BAD_TYPE", 415);
  if (file.size > MAX_BYTES) return fail("TOO_LARGE", 413);

  const buf = Buffer.from(await file.arrayBuffer());
  if (!isImage(buf)) return fail("BAD_TYPE", 415);

  try {
    const asset = await writeClient.assets.upload("image", buf, {
      filename: file.name.replace(/[^\w.-]/g, "_").slice(0, 100),
      contentType: file.type,
      // Lets the rate limit (and any cleanup script) find an author's uploads
      source: { name: "member-upload", id: access.userId },
    });
    return NextResponse.json({ assetId: asset._id, url: asset.url });
  } catch (e) {
    console.error("[member-posts] upload failed", e);
    return fail("UPLOAD_FAILED", 502);
  }
}
