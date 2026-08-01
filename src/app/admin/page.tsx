import {
  ArrowRight,
  ExternalLink,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      {/* Page header */}
      <header className="mb-8">
        <p className="text-sm font-medium text-indigo-600">
          Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Overview
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage your blog articles, publishing workflow,
          categories, tags and comments from one place.
        </p>
      </header>

      {/* Welcome panel */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="max-w-2xl">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-semibold text-slate-950">
            Your admin workspace is ready
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            The dashboard is protected by your custom
            authentication system. Start by opening the posts
            section, where we will add article management next.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Manage posts

              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View public blog

              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main admin areas */}
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <Link
          href="/admin/posts"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-indigo-50 group-hover:text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>

            <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
          </div>

          <h2 className="mt-5 font-semibold text-slate-950">
            Posts
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            View published posts, drafts, scheduled articles
            and archived content.
          </p>
        </Link>

        <Link
          href="/blog"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-indigo-50 group-hover:text-indigo-600">
              <ExternalLink className="h-5 w-5" />
            </div>

            <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
          </div>

          <h2 className="mt-5 font-semibold text-slate-950">
            Public blog
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Open the public experience and confirm how your
            published content appears to visitors.
          </p>
        </Link>
      </section>
    </main>
  );
}