import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAuthorAccessForPage } from "@/lib/member-posts/auth";
import { PostEditor } from "@/components/member-posts/post-editor";
import { AccessNotice } from "@/components/member-posts/post-preview";

export const metadata: Metadata = { title: "New post" };

// A blank editor. Nothing is stored until the first save creates the post.
export default async function NewPostPage() {
  const access = await getAuthorAccessForPage();
  if (!access.ok) return <AccessNotice reason={access.reason} />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <Link
        href="/dashboard/posts"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        My posts
      </Link>
      <PostEditor postId={null} initial={{ title: "", excerpt: "", body: [] }} />
    </div>
  );
}
