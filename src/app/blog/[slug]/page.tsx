import { blogPosts } from "@/data/blog";
import { notFound } from "next/navigation";
import { AuthorCard } from "@/components/blog/author-card";
import { PostCard } from "@/components/blog/post-card";
import { ShareButtons } from "@/components/blog/share-buttons";
import type { Metadata } from "next";
import Link from "next/link";
type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = blogPosts.find(
    (article) =>
      article.slug === slug &&
      article.status === "published",
  );

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

  // find() searches the array and returns the first matching article.
  const post = blogPosts.find((article) => article.slug === slug);

  // Stop rendering when no article matches the URL.
  if (!post || post.status !== "published") {
    notFound();
  }
  const relatedPosts = blogPosts
    .filter((article) => {
      // Do not recommend the article currently being read.
      if (article.id === post.id) {
        return false;
      }

      // Draft articles must never appear publicly.
      if (article.status !== "published") {
        return false;
      }

      const hasSameCategory = article.category === post.category;

      const hasSharedTag = article.tags.some((tag) => post.tags.includes(tag));

      return hasSameCategory || hasSharedTag;
    })
    .slice(0, 2);
  return (
    <main className="min-h-screen bg-[#020704] px-6 py-20 text-[#d9ffe3]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/blog"
          className="mb-10 inline-flex text-xs font-bold tracking-[0.16em] text-[#7ba487] transition hover:text-[#38ff7a]"
        >
          ← BACK TO ALL ARTICLES
        </Link>
        <p className="text-xs font-bold tracking-[0.25em] pb-4 text-[#38ff7a]">
          ARTICLE://DYNAMIC_ROUTE
        </p>
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.14em]">
          <span className="text-[#38ff7a]">{post.category}</span>

          <span aria-hidden="true" className="text-[#426c4e]">
            /
          </span>

          <time dateTime={post.publishedAt} className="text-[#7ba487]">
            {formatPublishedDate(post.publishedAt)}
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
              key={tag}
              className="border border-[rgba(56,255,122,0.2)] bg-[rgba(56,255,122,0.05)] px-3 py-1.5 text-xs font-bold text-[#82b991]"
            >
              #{tag.toLowerCase().replaceAll(" ", "-")}
            </span>
          ))}
        </div>
        <section className="mt-12 border-t border-[rgba(56,255,122,0.2)] pt-10">
          <div className="space-y-6">
            {post.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-base leading-8 text-[#b5d8be] md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
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
function formatPublishedDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
