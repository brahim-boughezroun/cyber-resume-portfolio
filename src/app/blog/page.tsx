import { PostCard } from "@/components/blog/post-card";

import { getPublishedPosts } from "../../../database/repositories/post.repository";

/**
 * Always load the latest posts from PostgreSQL.
 *
 * Without this setting, Next.js may try to cache the page.
 */
export const dynamic = "force-dynamic";

/**
 * This is an async Server Component.
 *
 * Server Components run on the server, so they can safely
 * communicate directly with PostgreSQL.
 */
export default async function BlogPage() {
  const publishedPosts = await getPublishedPosts();

  return (
    <main className="min-h-screen bg-[#020704] text-[#d9ffe3]">
      {/* Decorative background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,255,122,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(56,255,122,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Hero section */}
        <section className="grid min-h-[560px] items-center gap-14 py-20 lg:grid-cols-[1.3fr_0.7fr] lg:py-28">
          <div>
            <p className="mb-5 text-xs font-bold tracking-[0.3em] text-[#38ff7a]">
              BRAHIM://WRITING_ARCHIVE
            </p>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-0.04em] md:text-6xl lg:text-7xl">
              Engineering notes from building{" "}
              <span className="text-[#38ff7a]">
                AI systems
              </span>{" "}
              and full-stack products.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-[#7ba487] md:text-lg">
              Practical articles about artificial
              intelligence, backend architecture,
              databases, security, and lessons from real
              projects.
            </p>
          </div>

          {/* Blog statistics */}
          <aside className="border border-[rgba(56,255,122,0.22)] bg-[rgba(4,18,10,0.68)] p-6">
            <div className="mb-6 flex items-center justify-between border-b border-[rgba(56,255,122,0.15)] pb-4">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#38ff7a]">
                ARCHIVE_STATUS
              </span>

              <span className="animate-pulse text-xs text-[#38ff7a]">
                ● ONLINE
              </span>
            </div>

            <dl className="space-y-5">
              <div className="flex items-center justify-between">
                <dt className="text-xs tracking-[0.12em] text-[#7ba487]">
                  PUBLISHED_FILES
                </dt>

                <dd className="text-2xl font-bold text-[#d9ffe3]">
                  {String(publishedPosts.length).padStart(
                    2,
                    "0",
                  )}
                </dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-xs tracking-[0.12em] text-[#7ba487]">
                  PRIMARY_TOPICS
                </dt>

                <dd className="text-sm font-bold text-[#a8ffc1]">
                  AI / WEB / SECURITY
                </dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-xs tracking-[0.12em] text-[#7ba487]">
                  ACCESS_LEVEL
                </dt>

                <dd className="text-sm font-bold text-[#38ff7a]">
                  PUBLIC
                </dd>
              </div>
            </dl>
          </aside>
        </section>

        {/* Articles */}
        <section className="border-t border-[rgba(56,255,122,0.2)] py-16 md:py-20">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-[#38ff7a]">
                $ LS ./LATEST_TRANSMISSIONS
              </p>

              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Latest articles
              </h2>
            </div>

            <p className="text-sm text-[#7ba487]">
              {publishedPosts.length} records found
            </p>
          </div>

          {publishedPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {publishedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          ) : (
            <div className="border border-[rgba(56,255,122,0.2)] bg-[rgba(4,18,10,0.68)] p-8 text-center">
              <p className="text-sm font-bold tracking-[0.15em] text-[#38ff7a]">
                NO_PUBLISHED_ARTICLES
              </p>

              <p className="mt-3 text-sm text-[#7ba487]">
                The archive currently contains no public
                articles.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}