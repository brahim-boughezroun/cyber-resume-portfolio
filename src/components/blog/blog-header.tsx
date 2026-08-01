import Link from "next/link";

export function BlogHeader() {
  return (
    <header className="border-b border-[rgba(56,255,122,0.2)] bg-[rgba(2,7,4,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/">
          <span className="block text-[10px] font-bold tracking-[0.25em] text-[#38ff7a]">
            SEC://PORTFOLIO
          </span>

          <span className="mt-1 block text-sm font-bold tracking-[0.08em] text-[#a8ffc1]">
            BRAHIM BOUGHEZROUN
          </span>
        </Link>

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

          <Link
            href="/blog"
            className="text-[#38ff7a] transition hover:text-[#a8ffc1]"
          >
            BLOG
          </Link>
        </nav>
      </div>
    </header>
  );
}