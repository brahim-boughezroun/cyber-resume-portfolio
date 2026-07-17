import Link from "next/link";

export default function BlogNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020704] px-6 text-[#d9ffe3]">
      <div className="w-full max-w-2xl border border-[rgba(56,255,122,0.25)] bg-[rgba(4,18,10,0.75)] p-8 md:p-12">
        <p className="text-xs font-bold tracking-[0.25em] text-[#38ff7a]">
          ERROR://ARTICLE_NOT_FOUND
        </p>

        <h1 className="mt-6 text-4xl font-bold md:text-6xl">
          Transmission unavailable.
        </h1>

        <p className="mt-6 leading-8 text-[#7ba487]">
          This article does not exist, is still a draft, or has been removed
          from the public archive.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/blog"
            className="border border-[#38ff7a] bg-[#38ff7a] px-5 py-3 text-xs font-bold tracking-[0.14em] text-[#020704]"
          >
            RETURN TO BLOG
          </Link>

          <Link
            href="/"
            className="border border-[rgba(56,255,122,0.3)] px-5 py-3 text-xs font-bold tracking-[0.14em] text-[#38ff7a]"
          >
            OPEN PORTFOLIO
          </Link>
        </div>
      </div>
    </main>
  );
}