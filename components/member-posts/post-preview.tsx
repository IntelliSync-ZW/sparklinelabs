import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { PortableTextRenderer, type RichTextValue } from "@/components/portable-text";
import { Button } from "@/components/ui/button";
import type { AuthorAccess } from "@/lib/member-posts/auth";
import type { MyPost } from "@/lib/member-posts/queries";
import { countReviewComments } from "@/lib/member-posts/review-comments";
import { SanityPreviewImage } from "./sanity-image";
import { StartEditingButton } from "./start-editing-button";

/** Read-only view of a post, rendered with the same components as the public blog. */
export function PostPreview({ post }: { post: MyPost }) {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{post.title || "Untitled"}</h1>
      {post.excerpt && <p className="mt-3 text-lg text-muted-foreground">{post.excerpt}</p>}
      {post.coverImage && (
        <SanityPreviewImage
          image={post.coverImage}
          width={1200}
          alt={post.coverImage.alt ?? ""}
          className="mt-6 w-full rounded-xl border border-border"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      )}
      <PortableTextRenderer value={post.body as RichTextValue} className="mt-8" />
    </article>
  );
}

const Banner = ({ tone = "info", title, children }: { tone?: "info" | "warning"; title: string; children?: React.ReactNode }) => (
  <div
    className={
      tone === "warning"
        ? "rounded-xl border border-destructive/30 bg-destructive/5 p-4"
        : "rounded-xl border border-border bg-secondary/60 p-4"
    }
  >
    <p className="font-medium">{title}</p>
    {children && <div className="mt-1 text-sm text-muted-foreground">{children}</div>}
  </div>
);

const LiveLink = ({ href }: { href?: string }) =>
  href ? (
    <Link
      href={href}
      target="_blank"
      className="mt-2 inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
    >
      View the live post <ExternalLink className="size-3.5" aria-hidden="true" />
    </Link>
  ) : null;

const LIVE_DRAFT_NOTE =
  "Your changes are saved as a draft. Readers keep seeing the published version until an editor publishes your changes.";

/** Explains the post's state: why it is locked, what the editor asked for, or how live edits work. */
export function StatusBanner({ post }: { post: MyPost }) {
  switch (post.lockedBecause ?? post.status) {
    case "editing":
      return post.live ? (
        <Banner title="Editing a published post">
          <p>{LIVE_DRAFT_NOTE} When you are done, submit the changes for review.</p>
          <LiveLink href={post.liveUrl} />
        </Banner>
      ) : null;
    case "changes_requested": {
      const comments = countReviewComments(post.body);
      return (
        <Banner tone="warning" title="An editor asked for changes">
          {post.reviewNote && <p className="whitespace-pre-line text-foreground">{post.reviewNote}</p>}
          {comments > 0 && (
            <p className={post.reviewNote ? "mt-2" : undefined}>
              They also left {comments} comment{comments === 1 ? "" : "s"} on the text, highlighted in yellow below.
            </p>
          )}
          {!post.reviewNote && comments === 0 && <p>Make your changes, then submit the post again.</p>}
          {post.live && <p className="mt-2">{LIVE_DRAFT_NOTE}</p>}
        </Banner>
      );
    }
    case "submitted":
      return (
        <Banner title="In review">
          <p>
            An editor is reviewing {post.live ? "your changes" : "this post"}. If they ask for changes it will open for
            editing again.
            {post.live && " Until they publish, readers see the current published version."}
          </p>
          <LiveLink href={post.liveUrl} />
        </Banner>
      );
    case "published":
      return (
        <Banner title="Published">
          <p className="mb-3">
            To make changes, start editing. Your changes are saved as a draft, and the published version stays live
            until an editor publishes them.
          </p>
          <div className="flex flex-wrap items-start gap-x-4">
            {post.canStartEditing && <StartEditingButton postId={post.id} />}
            <LiveLink href={post.liveUrl} />
          </div>
        </Banner>
      );
    case "editor_draft":
      return (
        <Banner title="With editors">
          <p>An editor is working on this post in the Studio, so it is read-only here.</p>
          <LiveLink href={post.liveUrl} />
        </Banner>
      );
    case "unsupported_content":
      return (
        <Banner title="Read-only">
          <p>
            This post has content the dashboard editor cannot handle, so it is read-only here to keep that content
            safe. Ask an editor to make changes.
          </p>
          <LiveLink href={post.liveUrl} />
        </Banner>
      );
    default:
      return null;
  }
}

/** Shown in place of the dashboard when the session lacks author access. */
export function AccessNotice({ reason }: { reason: Extract<AuthorAccess, { ok: false }>["reason"] }) {
  const copy = {
    UNAUTHENTICATED: {
      title: "Sign in to continue",
      body: "The author dashboard is for Sparkline Labs contributors.",
    },
    FORBIDDEN: {
      title: "No author access",
      body: "Your account is not set up as an author. If an editor has just given you access, sign out and back in.",
    },
    NO_AUTHOR_PROFILE: {
      title: "Author profile not linked",
      body: "Your account has author access but is not linked to an author profile yet. Ask an editor to link it, then sign out and back in.",
    },
  }[reason];
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{copy.title}</h1>
      <p className="mt-3 text-muted-foreground">{copy.body}</p>
      {reason === "UNAUTHENTICATED" && (
        <SignInButton mode="modal">
          <Button className="mt-6">Sign in</Button>
        </SignInButton>
      )}
    </div>
  );
}
