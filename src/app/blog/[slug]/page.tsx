import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/blog/markdown-content";

import { AuthorCard } from "@/components/blog/author-card";
import { PostCard } from "@/components/blog/post-card";
import { ShareButtons } from "@/components/blog/share-buttons";

import {
  getPublishedPostBySlug,
  getPublishedPosts,
} from "../../../../database/repositories/post.repository";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Generate the browser title and description
 * for each article dynamically.
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Brahim Blog",
    };
  }

  return {
    title: `${post.title} | Brahim Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  /**
   * Find the article using the slug from the URL.
   *
   * Example URL:
   * /blog/building-rihla-ai
   *
   * slug:
   * building-rihla-ai
   */
  const post = await getPublishedPostBySlug(slug);

  /**
   * Display the Next.js 404 page when:
   *
   * - The article does not exist.
   * - The article is a draft.
   * - The article is archived.
   * - Its publication date is in the future.
   */
  if (!post) {
    notFound();
  }

  /**
   * Load published articles so we can calculate
   * related posts.
   */
  const publishedPosts = await getPublishedPosts();

  /**
   * A Set stores unique tag IDs.
   *
   * It lets us quickly check whether another
   * article shares a tag with the current article.
   */
  const currentTagIds = new Set(post.tags.map((tag) => tag.id));

  const relatedPosts = publishedPosts
    .filter((article) => {
      // Do not recommend the current article.
      if (article.id === post.id) {
        return false;
      }

      const hasSameCategory = article.category?.id === post.category?.id;

      const hasSharedTag = article.tags.some((tag) =>
        currentTagIds.has(tag.id),
      );

      return hasSameCategory || hasSharedTag;
    })
    .slice(0, 2);

  /**
   * A published post should normally have publishedAt.
   *
   * We use createdAt as a safe fallback.
   */
  const displayedDate = post.publishedAt ?? post.createdAt;

  /**
   * The article is stored as one Markdown string.
   *
   * For now, we split it into text blocks using
   * empty lines.
   *
   * Later, we will install a proper Markdown renderer.
   */

  return (
    <main className="min-h-screen bg-[#020704] px-6 py-20 text-[#d9ffe3]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/blog"
          className="mb-10 inline-flex text-xs font-bold tracking-[0.16em] text-[#7ba487] transition hover:text-[#38ff7a]"
        >
          ← BACK TO ALL ARTICLES
        </Link>

        <p className="pb-4 text-xs font-bold tracking-[0.25em] text-[#38ff7a]">
          ARTICLE://{post.id}
        </p>

        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.14em]">
          <span className="text-[#38ff7a]">
            {post.category?.name ?? "Uncategorized"}
          </span>

          <span aria-hidden="true" className="text-[#426c4e]">
            /
          </span>

          <time
            dateTime={displayedDate.toISOString()}
            className="text-[#7ba487]"
          >
            {formatPublishedDate(displayedDate)}
          </time>

          <span aria-hidden="true" className="text-[#426c4e]">
            /
          </span>

          <span className="text-[#7ba487]">{post.readingTime} MIN READ</span>
        </div>

        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
          {post.title}
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#7ba487]">
          {post.excerpt}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="border border-[rgba(56,255,122,0.2)] bg-[rgba(56,255,122,0.05)] px-3 py-1.5 text-xs font-bold text-[#82b991]"
            >
              #{tag.slug}
            </span>
          ))}
        </div>

        <section className="mt-12 border-t border-[rgba(56,255,122,0.2)] pt-10">
          <MarkdownContent content={post.content} />
        </section>

        <ShareButtons title={post.title} />

        <AuthorCard />

        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-[rgba(56,255,122,0.2)] pt-10">
            <p className="text-xs font-bold tracking-[0.25em] text-[#38ff7a]">
              $ LS ./RELATED_TRANSMISSIONS
            </p>

            <h2 className="mt-4 text-2xl font-bold text-[#d9ffe3]">
              Related articles
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function formatPublishedDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}
