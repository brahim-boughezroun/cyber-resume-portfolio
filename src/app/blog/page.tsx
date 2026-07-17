// Import Next.js Link for internal navigation.
import Link from "next/link";

// Import the reusable article-card component.
import { PostCard } from "@/components/blog/post-card";

// Import temporary article data.
// Later, this import will be replaced by a database query.
import { blogPosts } from "@/data/blog";

// In the Next.js App Router, a file named page.tsx
// becomes the page for its folder.
//
// This file is located at:
//
// src/app/blog/page.tsx
//
// Therefore, it creates:
//
// /blog
export default function BlogPage() {
  // filter() creates a new array containing only items
  // that pass a condition.
  //
  // Here, only articles with status === "published" remain.
  //
  // Draft articles stay in blogPosts but are hidden publicly.
  const publishedPosts = blogPosts.filter(
    (post) => post.status === "published",
  );

  return (
    // <main> represents the primary content of the page.
    <main className="min-h-screen bg-[#020704] text-[#d9ffe3]">
      {/*
        Decorative background grid.

        fixed:
        Keeps the background fixed while scrolling.

        inset-0:
        Sets top, right, bottom, and left to zero.

        pointer-events-none:
        Prevents this decorative element from blocking clicks.

        aria-hidden:
        Tells screen readers to ignore it.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          // Inline style is useful here because the CSS value
          // is long and highly specific.
          backgroundImage:
            "linear-gradient(rgba(56,255,122,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(56,255,122,0.025) 1px, transparent 1px)",

          // Each grid square is 48 by 48 pixels.
          backgroundSize: "48px 48px",
        }}
      />

      {/* Blog header */}
      <header className="relative z-10 border-b border-[rgba(56,255,122,0.2)] bg-[rgba(2,7,4,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Brand link returns the user to the portfolio homepage. */}
          <Link href="/" className="group">
            <span className="block text-[10px] font-bold tracking-[0.25em] text-[#38ff7a]">
              SEC://PORTFOLIO
            </span>

            <span className="mt-1 block text-sm font-bold tracking-[0.08em] text-[#a8ffc1]">
              BRAHIM BOUGHEZROUN
            </span>
          </Link>

          {/* Main blog navigation */}
          <nav
            aria-label="Blog navigation"
            className="flex items-center gap-6 text-xs font-bold tracking-[0.14em]"
          >
            <Link
              href="/"
              className="text-[#7ba487] transition hover:text-[#38ff7a]"
            >
              PORTFOLIO
            </Link>

            {/* BLOG is plain text because this is already the current page. */}
            <span aria-current="page" className="text-[#38ff7a]">
              BLOG
            </span>
          </nav>
        </div>
      </header>

      {/* Main content container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Hero section */}
        <section className="grid min-h-[560px] items-center gap-14 py-20 lg:grid-cols-[1.3fr_0.7fr] lg:py-28">
          <div>
            <p className="mb-5 text-xs font-bold tracking-[0.3em] text-[#38ff7a]">
              BRAHIM://WRITING_ARCHIVE
            </p>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-[-0.04em] md:text-6xl lg:text-7xl">
              Engineering notes from building{" "}
              <span className="text-[#38ff7a]">AI systems</span> and full-stack
              products.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-[#7ba487] md:text-lg">
              Practical articles about artificial intelligence, backend
              architecture, databases, security, and lessons from real
              projects.
            </p>
          </div>

          {/* Archive statistics panel */}
          <aside className="border border-[rgba(56,255,122,0.22)] bg-[rgba(4,18,10,0.68)] p-6">
            <div className="mb-6 flex items-center justify-between border-b border-[rgba(56,255,122,0.15)] pb-4">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#38ff7a]">
                ARCHIVE_STATUS
              </span>

              <span className="animate-pulse text-xs text-[#38ff7a]">
                ● ONLINE
              </span>
            </div>

            {/*
              A description list is useful for label-value information.

              dt = description term
              dd = description value
            */}
            <dl className="space-y-5">
              <div className="flex items-center justify-between">
                <dt className="text-xs tracking-[0.12em] text-[#7ba487]">
                  PUBLISHED_FILES
                </dt>

                <dd className="text-2xl font-bold text-[#d9ffe3]">
                  {/*
                    publishedPosts.length returns the number of articles.

                    padStart(2, "0") displays:
                    4 as 04
                    9 as 09
                    12 as 12
                  */}
                  {String(publishedPosts.length).padStart(2, "0")}
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

        {/* Article listing section */}
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

            {/* Display the number of published articles. */}
            <p className="text-sm text-[#7ba487]">
              {publishedPosts.length} records found
            </p>
          </div>

          {/*
            Responsive article grid.

            Default:
            One column.

            md:grid-cols-2:
            Two columns on medium and larger screens.
          */}
          <div className="grid gap-6 md:grid-cols-2">
            {/*
              map() loops over every published article.

              For every article, it creates one PostCard component.
            */}
            {publishedPosts.map((post) => (
              <PostCard
                // React uses key to track this item between renders.
                key={post.id}
                // Pass the complete article object to PostCard.
                post={post}
              />
            ))}
          </div>
        </section>

        {/* Blog footer */}
        <footer className="flex flex-col gap-4 border-t border-[rgba(56,255,122,0.2)] py-10 text-xs tracking-[0.12em] text-[#7ba487] md:flex-row md:items-center md:justify-between">
          <p>BRAHIM://WRITING_ARCHIVE</p>

          <Link
            href="/"
            className="font-bold text-[#38ff7a] transition hover:text-[#a8ffc1]"
          >
            ← RETURN TO PORTFOLIO
          </Link>
        </footer>
      </div>
    </main>
  );
}