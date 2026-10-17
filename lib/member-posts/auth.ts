import "server-only";
import { auth } from "@clerk/nextjs/server";
import { ID_RE } from "./schemas";

export type AuthorAccess =
  | { ok: true; userId: string; authorId: string }
  | { ok: false; reason: "UNAUTHENTICATED" | "FORBIDDEN" | "NO_AUTHOR_PROFILE" };

/**
 * Reads the author role and linked Sanity author from Clerk public metadata,
 * carried in the session token. Users cannot edit public metadata, and neither
 * value is ever taken from the browser.
 */
export async function getAuthorAccess(): Promise<AuthorAccess> {
  const { userId, sessionClaims } = await auth();
  if (!userId) return { ok: false, reason: "UNAUTHENTICATED" };
  const meta = sessionClaims?.metadata;
  if (!meta?.roles?.includes("author")) return { ok: false, reason: "FORBIDDEN" };
  if (!meta.sanityAuthorId || !ID_RE.test(meta.sanityAuthorId)) {
    return { ok: false, reason: "NO_AUTHOR_PROFILE" };
  }
  return { ok: true, userId, authorId: meta.sanityAuthorId };
}

/**
 * For dashboard pages: signed-out visitors go to sign-in and come back here;
 * any other failure is returned for the page to explain with <AccessNotice>.
 */
export async function getAuthorAccessForPage(): Promise<AuthorAccess> {
  const access = await getAuthorAccess();
  if (!access.ok && access.reason === "UNAUTHENTICATED") {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }
  return access;
}

/** Used by every action, query and route: throws the reason code when access is missing. */
export async function requireAuthor() {
  const access = await getAuthorAccess();
  if (!access.ok) throw new Error(access.reason);
  return { userId: access.userId, authorId: access.authorId };
}
