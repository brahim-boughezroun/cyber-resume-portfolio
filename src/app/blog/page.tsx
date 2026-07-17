import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#020704] px-6 py-12 text-[#d9ffe3]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-sm font-bold tracking-[0.18em] text-[#38ff7a]"
        >
          ← RETURN TO PORTFOLIO
        </Link>

        <section className="py-24">
          <p className="mb-4 text-xs font-bold tracking-[0.3em] text-[#38ff7a]">
            BRAHIM://WRITING_ARCHIVE
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-7xl">
            Technical field notes from my journey building AI and full-stack
            systems.
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-[#7ba487] md:text-lg">
            I document what I build, the concepts I learn, the mistakes I make,
            and the engineering decisions behind my projects.
          </p>
        </section>

        <section className="border-t border-[rgba(56,255,122,0.28)] py-12">
          <p className="text-sm text-[#7ba487]">
            Blog article system initialization in progress...
          </p>
        </section>
      </div>
    </main>
  );
}