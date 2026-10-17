// Marks a Clerk user as a blog author and links them to their Sanity author document.
// Run: pnpm exec tsx scripts/make-author.ts <clerkUserId> <sanityAuthorId>
// sanityAuthorId is the published _id of the author document (no "drafts." prefix).
import "dotenv/config";
import { createClerkClient } from "@clerk/backend";

const [userId, sanityAuthorId] = process.argv.slice(2);
if (!userId || !sanityAuthorId || !/^[a-zA-Z0-9_-]{1,128}$/.test(sanityAuthorId)) {
  console.error("Usage: pnpm exec tsx scripts/make-author.ts <clerkUserId> <sanityAuthorId>");
  process.exit(1);
}

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
const user = await clerk.users.getUser(userId);
// Keep any roles the user already has
const roles = [...new Set([...(user.publicMetadata.roles ?? []), "author" as const])];
await clerk.users.updateUserMetadata(userId, { publicMetadata: { roles, sanityAuthorId } });
console.log("Updated", userId, { roles, sanityAuthorId });
console.log("The change reaches the app when the user's session token refreshes (or they sign out and in).");
