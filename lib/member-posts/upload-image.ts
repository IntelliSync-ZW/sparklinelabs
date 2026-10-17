// Client-safe: posts to the authenticated upload route, no token involved.
export async function uploadImage(file: File): Promise<{ assetId: string; url: string }> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/member-posts/upload", { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "UPLOAD_FAILED");
  return json;
}
