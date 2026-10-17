import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { getAuthorAccessForPage } from "@/lib/member-posts/auth";
import { listMyPosts } from "@/lib/member-posts/queries";
import { MyPostsTable } from "@/components/member-posts/my-posts-table";
import { NewPostButton } from "@/components/member-posts/new-post-button";
import { AccessNotice } from "@/components/member-posts/post-preview";

export const metadata: Metadata = { title: "My posts" };

export default async function MyPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const access = await getAuthorAccessForPage();
  if (!access.ok) return <AccessNotice reason={access.reason} />;
  const [posts, { submitted }] = await Promise.all([listMyPosts(), searchParams]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My posts</h1>
          <p className="mt-1 text-muted-foreground">
            Write drafts and submit them for review. An editor publishes them to the blog.
          </p>
        </div>
        <NewPostButton />
      </div>

      {submitted === "1" && (
        <p role="status" className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          Your post was sent for review. You will see the editor&apos;s response here.
        </p>
      )}

      <MyPostsTable data={posts} />
    </div>
  );
}
