import {
  FileText,
  Plus,
} from "lucide-react";

export default function AdminPostsPage() {
  return (
    <main className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Content
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Posts
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create, edit and manage your blog articles.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="The create-post form will be built after the posts table."
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white opacity-50"
        >
          <Plus className="h-4 w-4" />

          New post
        </button>
      </header>

      <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <FileText className="h-6 w-6" />
        </div>

        <h2 className="mt-5 font-semibold text-slate-950">
          Posts dashboard shell created
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          The next step will connect this page to PostgreSQL
          and display all posts in a searchable management
          table.
        </p>
      </section>
    </main>
  );
}