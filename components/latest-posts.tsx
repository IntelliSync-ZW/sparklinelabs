import { fetchPosts } from "@/sanity/lib/fetch";
import { latestPostsQuery } from "@/sanity/lib/queries";
import Link from "next/link";

type Post = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function LatestPosts() {
  let posts: Post[] = [];
  try {
    posts = await fetchPosts<Post[]>(latestPostsQuery);
  } catch {
    /* Sanity not configured */
  }

  if (posts.length === 0) {
    return (
      <div className="border border-border rounded-xl p-8 text-center">
        <p className="text-muted-foreground text-lg">First post lands this week.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.slug.current}
          href={`/blog/${post.slug.current}`}
          className="group border border-border rounded-xl p-6 hover:border-foreground transition-colors"
        >
          {post.publishedAt && (
            <time className="text-sm text-muted-foreground block mb-2">
              {formatDate(post.publishedAt)}
            </time>
          )}
          <h3 className="text-lg font-semibold mb-2 group-hover:underline">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}

export function LatestPostsSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="border border-border rounded-xl p-6 animate-pulse">
          <div className="h-3 bg-muted rounded w-20 mb-2" />
          <div className="h-5 bg-muted rounded w-4/5 mb-3" />
          <div className="space-y-1.5">
            <div className="h-3 bg-muted rounded" />
            <div className="h-3 bg-muted rounded w-4/5" />
            <div className="h-3 bg-muted rounded w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
