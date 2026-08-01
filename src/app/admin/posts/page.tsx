import {
  Archive,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Plus,
} from "lucide-react";
import Link from "next/link";

import { getAdminPosts } from "../../../../database/repositories/post.repository";
import type {
  PostStatus,
  PostSummary,
} from "@/types/post";

/**
 * Always request the latest admin data from PostgreSQL.
 *
 * Without this, Next.js may cache the page and continue
 * showing old post information after an article changes.
 */
export const dynamic = "force-dynamic";

type StatusDefinition = {
  status: PostStatus;
  label: string;
  description: string;
  icon: typeof FileText;
};

const statusDefinitions: StatusDefinition[] = [
  {
    status: "PUBLISHED",
    label: "Published",
    description: "Visible to visitors",
    icon: CheckCircle2,
  },
  {
    status: "DRAFT",
    label: "Drafts",
    description: "Private working copies",
    icon: FileText,
  },
  {
    status: "SCHEDULED",
    label: "Scheduled",
    description: "Waiting for publication",
    icon: CalendarClock,
  },
  {
    status: "ARCHIVED",
    label: "Archived",
    description: "Removed from the public blog",
    icon: Archive,
  },
];

function formatDate(date: Date | null): string {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

function getStatusClasses(
  status: PostStatus,
): string {
  switch (status) {
    case "PUBLISHED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "DRAFT":
      return "border-slate-200 bg-slate-100 text-slate-700";

    case "SCHEDULED":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "ARCHIVED":
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getStatusLabel(
  status: PostStatus,
): string {
  switch (status) {
    case "PUBLISHED":
      return "Published";

    case "DRAFT":
      return "Draft";

    case "SCHEDULED":
      return "Scheduled";

    case "ARCHIVED":
      return "Archived";
  }
}

function StatusBadge({
  status,
}: {
  status: PostStatus;
}) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-2.5 py-1",
        "text-xs font-semibold",
        getStatusClasses(status),
      ].join(" ")}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function PublicPostAction({
  post,
}: {
  post: PostSummary;
}) {
  const isPublic =
    post.status === "PUBLISHED" &&
    (
      post.publishedAt === null ||
      post.publishedAt <= new Date()
    );

  if (!isPublic) {
    return (
      <span className="text-xs font-medium text-slate-400">
        Not public
      </span>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
    >
      <Eye className="h-4 w-4" />

      View
    </Link>
  );
}

export default async function AdminPostsPage() {
  const posts = await getAdminPosts();

  const statusCounts = statusDefinitions.reduce(
    (counts, item) => {
      counts[item.status] = posts.filter(
        (post) => post.status === item.status,
      ).length;

      return counts;
    },
    {
      DRAFT: 0,
      PUBLISHED: 0,
      SCHEDULED: 0,
      ARCHIVED: 0,
    } satisfies Record<PostStatus, number>,
  );

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      {/* Page header */}
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

        {/*
         * This remains disabled until we create:
         * /admin/posts/new
         */}
        <button
          type="button"
          disabled
          title="The create-post form will be built next."
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white opacity-50"
        >
          <Plus className="h-4 w-4" />

          New post
        </button>
      </header>

      {/* Status summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>

            <span className="text-2xl font-bold text-slate-950">
              {posts.length}
            </span>
          </div>

          <h2 className="mt-4 text-sm font-semibold text-slate-950">
            All posts
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Every article in the database
          </p>
        </article>

        {statusDefinitions.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.status}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="text-2xl font-bold text-slate-950">
                  {statusCounts[item.status]}
                </span>
              </div>

              <h2 className="mt-4 text-sm font-semibold text-slate-950">
                {item.label}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {item.description}
              </p>
            </article>
          );
        })}
      </section>

      {/* Posts collection */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-950">
              All articles
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Ordered by the most recently updated
            </p>
          </div>

          <p className="text-sm text-slate-500">
            {posts.length}{" "}
            {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText className="h-6 w-6" />
            </div>

            <h3 className="mt-5 font-semibold text-slate-950">
              No posts found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Your database does not contain any blog
              articles yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Article
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Updated
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Published
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="max-w-sm truncate text-sm font-semibold text-slate-950">
                          {post.title}
                        </p>

                        <p className="mt-1 max-w-sm truncate font-mono text-xs text-slate-400">
                          /blog/{post.slug}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={post.status} />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {post.category?.name ?? "Uncategorized"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(post.updatedAt)}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(post.publishedAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <PublicPostAction post={post} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-slate-200 md:hidden">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-slate-950">
                        {post.title}
                      </h3>

                      <p className="mt-1 truncate font-mono text-xs text-slate-400">
                        /blog/{post.slug}
                      </p>
                    </div>

                    <StatusBadge status={post.status} />
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-xs font-medium text-slate-400">
                        Category
                      </dt>

                      <dd className="mt-1 text-sm text-slate-700">
                        {post.category?.name ??
                          "Uncategorized"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs font-medium text-slate-400">
                        Updated
                      </dt>

                      <dd className="mt-1 text-sm text-slate-700">
                        {formatDate(post.updatedAt)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock3 className="h-4 w-4" />

                      {post.readingTime} min read
                    </span>

                    <PublicPostAction post={post} />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}