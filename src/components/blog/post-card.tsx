// Link is the Next.js component used for internal navigation.
//
// We use it instead of a normal <a> element when navigating
// between pages inside the same Next.js application.
import Link from "next/link";

// Import the BlogPost type so the component knows
// what kind of article data it should receive.
import type { PostSummary } from "@/types/post";

// Props are values passed from a parent component
// into a child component.
//
// This component expects one prop named "post".
// That prop must follow the BlogPost type.
type PostCardProps = {
  post: PostSummary;
};

// This helper function converts a machine-friendly date
// into a human-readable date.
//
// Input:
// "2026-07-17"
//
// Output:
// "Jul 17, 2026"
function formatPublishedDate(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return formatter.format(date);
}

// This is a reusable React component.
//
// The destructuring syntax { post } extracts the post property
// from the props object.
//
// This:
//
// function PostCard({ post }: PostCardProps)
//
// is similar to:
//
// function PostCard(props: PostCardProps) {
//   const post = props.post;
// }
export function PostCard({ post }: PostCardProps) {
  const displayedDate = post.publishedAt ?? post.createdAt;
  return (
    // <article> is a semantic HTML element.
    // It tells browsers and search engines that this block
    // represents independent article content.
    //
    // "group" is a Tailwind utility that allows child elements
    // to react when the parent is hovered.
    <article className="group relative flex h-full flex-col overflow-hidden border border-[rgba(56,255,122,0.2)] bg-[rgba(4,18,10,0.72)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(56,255,122,0.55)]">
      {/* Top status bar of the article card */}
      <div className="flex items-center justify-between border-b border-[rgba(56,255,122,0.14)] px-5 py-3">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#38ff7a]">
          {/* JavaScript expressions are placed inside curly brackets. */}
          {/* toUpperCase() converts post_001 into POST_001. */}
          ARTICLE://{post.id.toUpperCase()}
        </span>

        {/* Decorative online-status indicator */}
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-[#38ff7a] shadow-[0_0_12px_#38ff7a]"
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col p-6">
        {/* Article metadata: category and date */}
        <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em]">
          <span className="text-[#38ff7a]">
            {post.category?.name ?? "Uncategorized"}
          </span>

          {/* aria-hidden removes decorative content from screen readers. */}
          <span aria-hidden="true" className="text-[#426c4e]">
            /
          </span>

          {/* <time> is a semantic element representing a date. */}
          <time
            dateTime={displayedDate.toISOString()}
            className="text-[#7ba487]"
          >
            {formatPublishedDate(displayedDate)}
          </time>
        </div>

        {/* Article title */}
        <h2 className="text-xl font-bold leading-snug text-[#d9ffe3] transition group-hover:text-[#a8ffc1] md:text-2xl">
          <Link href={`/blog/${post.slug}`}>
            {/*
              This span covers the entire card.

              Because the card has "relative" and this span has
              "absolute inset-0", clicking almost anywhere on the card
              opens the article.
            */}
            <span className="absolute inset-0" aria-hidden="true" />

            {/* The visible article title */}
            {post.title}
          </Link>
        </h2>

        {/* Article description */}
        <p className="mt-4 flex-1 text-sm leading-7 text-[#7ba487]">
          {post.excerpt}
        </p>

        {/* Article tags */}
        <div className="relative z-10 mt-6 flex flex-wrap gap-2">
          {/*
            map() loops through every tag.

            For each tag, it returns one <span> element.

            Example:
            ["Next.js", "PostgreSQL"]

            becomes:

            <span>#next.js</span>
            <span>#postgresql</span>
          */}
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="border border-[rgba(56,255,122,0.15)] bg-[rgba(56,255,122,0.04)] px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-[#82b991]"
            >
              #{tag.slug}
            </span>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-7 flex items-center justify-between border-t border-[rgba(56,255,122,0.12)] pt-5">
          <span className="text-xs text-[#7ba487]">
            {post.readingTime} MIN READ
          </span>

          <span className="text-xs font-bold tracking-[0.16em] text-[#38ff7a]">
            DECRYPT →
          </span>
        </div>
      </div>
    </article>
  );
}
