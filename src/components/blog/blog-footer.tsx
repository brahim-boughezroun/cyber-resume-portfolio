import Link from "next/link";

export function BlogFooter() {
  return (
    <footer className="border-t border-[rgba(56,255,122,0.2)] bg-[#020704]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-xs tracking-[0.12em] text-[#7ba487] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-bold text-[#a8ffc1]">
            BRAHIM://WRITING_ARCHIVE
          </p>

          <p className="mt-2">
            AI, full-stack engineering, and lessons from real projects.
          </p>
        </div>

        <div className="flex flex-wrap gap-5">
          <Link
            href="/blog"
            className="transition hover:text-[#38ff7a]"
          >
            ALL ARTICLES
          </Link>

          <Link
            href="/"
            className="font-bold text-[#38ff7a] transition hover:text-[#a8ffc1]"
          >
            RETURN TO PORTFOLIO →
          </Link>
        </div>
      </div>
    </footer>
  );
}