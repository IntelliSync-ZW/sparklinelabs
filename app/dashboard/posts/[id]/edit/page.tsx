import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { PortableTextBlock } from "@portabletext/editor";
import { getAuthorAccessForPage } from "@/lib/member-posts/auth";
import { getMyPost } from "@/lib/member-posts/queries";
import type { CoverImage } from "@/lib/member-posts/schemas";
import { StatusBadge } from "@/components/member-posts/my-posts-table";
import { PostEditor } from "@/components/member-posts/post-editor";
import { AccessNotice, PostPreview, StatusBanner } from "@/components/member-posts/post-preview";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const access = await getAuthorAccessForPage();
  if (!access.ok) return <AccessNotice reason={access.reason} />;
  const post = await getMyPost(id);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/dashboard/posts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          My posts
        </Link>
        <StatusBadge status={post.status} live={post.live} />
      </div>

      <StatusBanner post={post} />

      {post.lockedBecause ? (
        <PostPreview post={post} />
      ) : (
        <PostEditor
          postId={post.id}
          initial={{
            title: post.title,
            excerpt: post.excerpt,
            // isEditableBody() has already checked the body against the editor's schema
            body: post.body as PortableTextBlock[],
            coverImage: post.coverImage
              ? ({ ...post.coverImage, alt: post.coverImage.alt ?? "" } as CoverImage)
              : undefined,
          }}
        />
      )}
    </div>
  );
}
