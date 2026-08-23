import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { fetchCategories, fetchPosts } from "@/sanity/lib/fetch";
import {
  allCategoriesQuery,
  paginatedPostsQuery,
  paginatedPostsByCategoryQuery,
} from "@/sanity/lib/queries";

export const POSTS_PER_PAGE = 50;

// ─── Types ────────────────────────────────────────────────────────────────────

export type Category = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  color?: string;
  image?: { url: string; alt?: string };
  postCount?: number;
};

export type ArticleAuthor = {
  articleRole?: string;
  author: {
    _id: string;
    name: string;
    slug?: { current: string };
    role?: string;
    avatar?: { url: string; alt?: string };
  };
};

export type Post = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  readingTime?: number;
  category?: {
    title: string;
    slug: { current: string };
    color?: string;
    image?: { url: string; alt?: string };
  };
  coverImage?: { url: string; alt?: string };
  authors?: ArticleAuthor[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

function CategoryFilterBar({
  categories,
  activeCategory,
}: {
  categories: Category[];
  activeCategory?: string;
}) {
  const baseTab =
    "relative shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap";
  const active =
    "bg-foreground text-background";
  const inactive =
    "text-muted-foreground hover:text-foreground hover:bg-secondary";

  return (
    <div className="mb-10">
      <div
        className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide"
        role="tablist"
        aria-label="Filter articles by topic"
      >
        <Link
          href="/blog"
          role="tab"
          aria-selected={!activeCategory}
          className={`${baseTab} ${!activeCategory ? active : inactive}`}
        >
          All articles
        </Link>
        {categories.map((cat) => {
          const isActive = cat.slug.current === activeCategory;
          return (
            <Link
              key={cat._id}
              href={`/blog/${cat.slug.current}`}
              role="tab"
              aria-selected={isActive}
              className={`${baseTab} ${isActive ? active : inactive}`}
            >
              {cat.title}
              {cat.postCount !== undefined && cat.postCount > 0 && (
                <span
                  className={`ml-1.5 text-xs tabular-nums ${isActive ? "text-background/60" : "text-muted-foreground"}`}
                >
                  {cat.postCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      {/* Divider */}
      <div className="mt-4 h-px bg-border" />
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

export function PostCard({ post }: { post: Post }) {
  const categorySlug = post.category?.slug?.current ?? "uncategorised";
  const href = `/blog/${categorySlug}/${post.slug.current}`;

  return (
    <article className="group flex flex-col">
      {/* Cover image */}
      <Link href={href} className="block overflow-hidden rounded-xl mb-4 aspect-video bg-secondary relative">
        {post.coverImage?.url ? (
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt ?? post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-secondary to-muted flex items-center justify-center">
            <span className="text-muted-foreground/30 text-4xl font-bold select-none">
              {post.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Category pill on image */}
        {post.category && (
          <span
            className={`absolute top-3 left-3 text-xs font-medium uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white ${post.category.color ?? ""}`}
          >
            {post.category.title}
          </span>
        )}
      </Link>

      {/* Meta row */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2.5">
        {post.publishedAt && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.publishedAt)}
          </span>
        )}
        {post.readingTime && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} min read
          </span>
        )}
      </div>

      {/* Title */}
      <Link href={href}>
        <h2 className="text-lg font-semibold tracking-tight leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
          {post.title}
        </h2>
      </Link>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
          {post.excerpt}
        </p>
      )}

      {/* Author avatars */}
      {post.authors && post.authors.length > 0 && (
        <div className="flex items-center gap-2 mt-auto">
          <div className="flex -space-x-2">
            {post.authors.slice(0, 3).map(({ author }, i) => {
              const authorHref = author.slug?.current
                ? `/blog/authors/${author.slug.current}`
                : null;
              const content = (
                <div
                  className="h-7 w-7 rounded-full overflow-hidden border-2 border-background bg-secondary relative shrink-0 transition-transform duration-200 hover:scale-110 hover:z-20"
                  style={{ zIndex: post.authors!.length - i }}
                  title={author.name}
                >
                  {author.avatar?.url ? (
                    <Image
                      src={author.avatar.url}
                      alt={author.name}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      {author.name.charAt(0)}
                    </span>
                  )}
                </div>
              );

              return authorHref ? (
                <Link key={author._id} href={authorHref} tabIndex={-1}>
                  {content}
                </Link>
              ) : (
                <div key={author._id}>{content}</div>
              );
            })}
          </div>
          <span className="text-xs text-muted-foreground">
            {post.authors.slice(0, 2).map(({ author }, idx) => {
              const authorHref = author.slug?.current
                ? `/blog/authors/${author.slug.current}`
                : null;
              return (
                <span key={author._id}>
                  {idx > 0 && ", "}
                  {authorHref ? (
                    <Link
                      href={authorHref}
                      className="hover:text-foreground hover:underline"
                    >
                      {author.name}
                    </Link>
                  ) : (
                    author.name
                  )}
                </span>
              );
            })}
            {post.authors.length > 2 && ` +${post.authors.length - 2}`}
          </span>
        </div>
      )}
    </article>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ category }: { category?: string }) {
  return (
    <div className="py-24 text-center border border-dashed border-border rounded-2xl">
      <p className="text-muted-foreground text-lg mb-2">
        {category
          ? `No articles in this topic yet.`
          : "First post lands this week."}
      </p>
      {category && (
        <Link href="/blog" className="text-sm text-accent underline underline-offset-4">
          Browse all articles →
        </Link>
      )}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse flex flex-col gap-3">
          <div className="aspect-video rounded-xl bg-muted" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded" />
          <div className="h-3 bg-muted rounded w-4/5" />
        </div>
      ))}
    </div>
  );
}

// ─── Pagination Component ───────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  activeCategory,
}: {
  currentPage: number;
  totalPages: number;
  activeCategory?: string;
}) {
  const getPageUrl = (page: number) => {
    const base = activeCategory ? `/blog/${activeCategory}` : "/blog";
    return page === 1 ? base : `${base}?page=${page}`;
  };

  // Build page numbers with ellipsis
  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return (
    <nav
      className="mt-16 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4 text-sm"
      aria-label="Blog pagination"
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-secondary hover:border-foreground/40 transition-colors font-medium"
        >
          ← Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border/40 text-muted-foreground/40 cursor-not-allowed font-medium select-none">
          ← Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p === "ellipsis") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                …
              </span>
            );
          }
          const isCurrent = p === currentPage;
          return (
            <Link
              key={p}
              href={getPageUrl(p)}
              aria-current={isCurrent ? "page" : undefined}
              className={`h-9 min-w-9 px-2 flex items-center justify-center rounded-lg font-medium transition-colors ${isCurrent
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
            >
              {p}
            </Link>
          );
        })}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-secondary hover:border-foreground/40 transition-colors font-medium"
        >
          Next →
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border/40 text-muted-foreground/40 cursor-not-allowed font-medium select-none">
          Next →
        </span>
      )}
    </nav>
  );
}

// ─── Main BlogList server component ──────────────────────────────────────────

type PaginatedResult = {
  posts: Post[];
  total: number;
};

export async function BlogList({
  activeCategory,
  currentPage = 1,
}: {
  activeCategory?: string;
  currentPage?: number;
}) {
  const page = Math.max(1, currentPage);
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  let categories: Category[] = [];
  let posts: Post[] = [];
  let total = 0;

  try {
    const [cats, result] = await Promise.all([
      fetchCategories<Category[]>(allCategoriesQuery),
      fetchPosts<PaginatedResult>(
        activeCategory ? paginatedPostsByCategoryQuery : paginatedPostsQuery,
        activeCategory
          ? { category: activeCategory, start, end }
          : { start, end }
      ),
    ]);
    categories = cats ?? [];
    posts = result?.posts ?? [];
    total = result?.total ?? 0;
  } catch {
    /* Sanity not configured — render empty states */
  }

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div>
      {/* 2 ── Filter tab bar */}
      <CategoryFilterBar
        categories={categories}
        activeCategory={activeCategory}
      />

      {/* 3 ── Post grid */}
      {posts.length === 0 ? (
        <EmptyState category={activeCategory} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.slug.current} post={post} />
            ))}
          </div>

          {/* 4 ── Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              activeCategory={activeCategory}
            />
          )}
        </>
      )}
    </div>
  );
}

export { PostGridSkeleton };
