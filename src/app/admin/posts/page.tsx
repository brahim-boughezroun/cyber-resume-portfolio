import type { LucideIcon } from "lucide-react";

import {
  CalendarClock,
  CheckCircle2,
  Eye,
  FileText,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { getAdminPosts } from "../../../../database/repositories/post.repository";
import type {
  PostStatus,
  PostSummary,
} from "@/types/post";

export const dynamic = "force-dynamic";

type AdminPostsPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    status?: string | string[];
    category?: string | string[];
    sort?: string | string[];
  }>;
};

type SortOption =
  | "updated-desc"
  | "updated-asc"
  | "title-asc";

type SummaryDefinition = {
  label: string;
  description: string;
  count: number;
  icon: LucideIcon;
  wrapperClassName: string;
  iconClassName: string;
};

const allowedStatuses: PostStatus[] = [
  "DRAFT",
  "PUBLISHED",
  "SCHEDULED",
  "ARCHIVED",
];

function getSearchParameter(
  value: string | string[] | undefined,
): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function isPostStatus(
  value: string,
): value is PostStatus {
  return allowedStatuses.includes(
    value as PostStatus,
  );
}

function isSortOption(
  value: string,
): value is SortOption {
  return [
    "updated-desc",
    "updated-asc",
    "title-asc",
  ].includes(value);
}

function formatDate(date: Date | null): string {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

function formatRelativeDate(date: Date): string {
  const difference = date.getTime() - Date.now();
  const absoluteDifference = Math.abs(difference);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;

  const formatter = new Intl.RelativeTimeFormat(
    "en",
    {
      numeric: "auto",
    },
  );

  if (absoluteDifference < minute) {
    return "just now";
  }

  if (absoluteDifference < hour) {
    return formatter.format(
      Math.round(difference / minute),
      "minute",
    );
  }

  if (absoluteDifference < day) {
    return formatter.format(
      Math.round(difference / hour),
      "hour",
    );
  }

  if (absoluteDifference < month) {
    return formatter.format(
      Math.round(difference / day),
      "day",
    );
  }

  return formatter.format(
    Math.round(difference / month),
    "month",
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
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
      <span className="text-[11px] text-[#aaa9a4]">
        Private
      </span>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      title="View public article"
      aria-label={`View ${post.title}`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dfdfda] bg-white text-[#6d6d68] transition hover:border-[#b8d8d3] hover:bg-[#f2faf8] hover:text-[#0f766e]"
    >
      <Eye className="h-4 w-4" />
    </Link>
  );
}

export default async function AdminPostsPage({
  searchParams,
}: AdminPostsPageProps) {
  const parameters = await searchParams;
  const allPosts = await getAdminPosts();

  const query = getSearchParameter(
    parameters.q,
  ).trim();

  const statusValue = getSearchParameter(
    parameters.status,
  );

  const categoryValue = getSearchParameter(
    parameters.category,
  );

  const sortValue = getSearchParameter(
    parameters.sort,
  );

  const selectedStatus = isPostStatus(
    statusValue,
  )
    ? statusValue
    : "";

  const selectedSort = isSortOption(sortValue)
    ? sortValue
    : "updated-desc";

  const categories = Array.from(
    new Map(
      allPosts
        .filter(
          (
            post,
          ): post is PostSummary & {
            category: NonNullable<
              PostSummary["category"]
            >;
          } => post.category !== null,
        )
        .map((post) => [
          post.category.slug,
          post.category,
        ]),
    ).values(),
  ).sort((first, second) =>
    first.name.localeCompare(second.name),
  );

  const normalizedQuery = query.toLowerCase();

  const filteredPosts = allPosts.filter(
    (post) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          post.title,
          post.slug,
          post.excerpt,
          post.author.name,
          post.category?.name ?? "",
          post.tags
            .map((tag) => tag.name)
            .join(" "),
        ].some((value) =>
          value
            .toLowerCase()
            .includes(normalizedQuery),
        );

      const matchesStatus =
        selectedStatus.length === 0 ||
        post.status === selectedStatus;

      const matchesCategory =
        categoryValue.length === 0 ||
        post.category?.slug === categoryValue;

      return (
        matchesQuery &&
        matchesStatus &&
        matchesCategory
      );
    },
  );

  const posts = [...filteredPosts].sort(
    (first, second) => {
      switch (selectedSort) {
        case "updated-asc":
          return (
            first.updatedAt.getTime() -
            second.updatedAt.getTime()
          );

        case "title-asc":
          return first.title.localeCompare(
            second.title,
          );

        case "updated-desc":
        default:
          return (
            second.updatedAt.getTime() -
            first.updatedAt.getTime()
          );
      }
    },
  );

  const statusCounts: Record<
    PostStatus,
    number
  > = {
    DRAFT: allPosts.filter(
      (post) => post.status === "DRAFT",
    ).length,

    PUBLISHED: allPosts.filter(
      (post) => post.status === "PUBLISHED",
    ).length,

    SCHEDULED: allPosts.filter(
      (post) => post.status === "SCHEDULED",
    ).length,

    ARCHIVED: allPosts.filter(
      (post) => post.status === "ARCHIVED",
    ).length,
  };

  const summaries: SummaryDefinition[] = [
    {
      label: "Drafts in progress",
      description: "Continue writing and reviewing",
      count: statusCounts.DRAFT,
      icon: FileText,
      wrapperClassName:
        "border-[#e9dfba] bg-[#fbf8ed]",
      iconClassName:
        "bg-[#f2e9c8] text-[#866e24]",
    },
    {
      label: "Scheduled",
      description: "Waiting for publication",
      count: statusCounts.SCHEDULED,
      icon: CalendarClock,
      wrapperClassName:
        "border-[#dfd9ef] bg-[#f6f4fb]",
      iconClassName:
        "bg-[#e8e2f4] text-[#66558c]",
    },
    {
      label: "Published",
      description: "Live on the public blog",
      count: statusCounts.PUBLISHED,
      icon: CheckCircle2,
      wrapperClassName:
        "border-[#d5e8da] bg-[#f2f8f3]",
      iconClassName:
        "bg-[#dceee0] text-[#39724a]",
    },
  ];

  const hasFilters =
    query.length > 0 ||
    selectedStatus.length > 0 ||
    categoryValue.length > 0 ||
    selectedSort !== "updated-desc";

  return (
    <main className="px-4 py-7 sm:px-6 lg:px-7 xl:px-10">
      {/* Page title */}
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium text-[#888883]">
            Content
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#1c1c1c]">
            Articles
          </h1>

          <p className="mt-2 text-sm text-[#777772]">
            Search, review and manage your blog content.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="The article editor will be built next"
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-md bg-[#0f766e] px-4 py-2.5 text-sm font-medium text-white opacity-60"
        >
          <Plus className="h-4 w-4" />

          New article
        </button>
      </header>

      {/* Search and filters */}
      <form
        method="get"
        className="mt-7 flex flex-col gap-3 rounded-[10px] border border-[#e3e3de] bg-white p-3 lg:flex-row lg:items-center"
      >
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">
            Search articles
          </span>

          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a95]" />

          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search articles by title, slug or tag"
            className="h-10 w-full rounded-md border border-[#deded9] bg-[#fcfcfa] pl-9 pr-3 text-sm text-[#2c2c29] outline-none transition placeholder:text-[#aaa9a4] focus:border-[#8dbdb6] focus:bg-white focus:ring-2 focus:ring-[#dceeea]"
          />
        </label>

        <label>
          <span className="sr-only">
            Filter by status
          </span>

          <select
            name="status"
            defaultValue={selectedStatus}
            className="h-10 w-full min-w-40 rounded-md border border-[#deded9] bg-[#fcfcfa] px-3 text-sm text-[#555550] outline-none focus:border-[#8dbdb6] focus:ring-2 focus:ring-[#dceeea] lg:w-auto"
          >
            <option value="">All statuses</option>
            <option value="PUBLISHED">
              Published
            </option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">
              Scheduled
            </option>
            <option value="ARCHIVED">
              Archived
            </option>
          </select>
        </label>

        <label>
          <span className="sr-only">
            Filter by category
          </span>

          <select
            name="category"
            defaultValue={categoryValue}
            className="h-10 w-full min-w-40 rounded-md border border-[#deded9] bg-[#fcfcfa] px-3 text-sm text-[#555550] outline-none focus:border-[#8dbdb6] focus:ring-2 focus:ring-[#dceeea] lg:w-auto"
          >
            <option value="">All categories</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.slug}
              >
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">
            Sort articles
          </span>

          <select
            name="sort"
            defaultValue={selectedSort}
            className="h-10 w-full min-w-40 rounded-md border border-[#deded9] bg-[#fcfcfa] px-3 text-sm text-[#555550] outline-none focus:border-[#8dbdb6] focus:ring-2 focus:ring-[#dceeea] lg:w-auto"
          >
            <option value="updated-desc">
              Last updated
            </option>

            <option value="updated-asc">
              Oldest updated
            </option>

            <option value="title-asc">
              Title A–Z
            </option>
          </select>
        </label>

        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#176f68] px-4 text-sm font-medium text-white transition hover:bg-[#105f59]"
        >
          <SlidersHorizontal className="h-4 w-4" />

          Apply
        </button>

        {hasFilters && (
          <Link
            href="/admin/posts"
            className="inline-flex h-10 items-center justify-center px-2 text-sm font-medium text-[#0f766e] hover:text-[#095e58]"
          >
            Clear filters
          </Link>
        )}
      </form>

      {/* Workflow summaries */}
      <section className="mt-4 grid gap-3 lg:grid-cols-3">
        {summaries.map((summary) => {
          const Icon = summary.icon;

          return (
            <article
              key={summary.label}
              className={[
                "rounded-[10px] border px-4 py-3.5",
                summary.wrapperClassName,
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center",
                    "rounded-md",
                    summary.iconClassName,
                  ].join(" ")}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#5e5e59]">
                    {summary.label}
                  </p>

                  <p className="mt-0.5 truncate text-[11px] text-[#92928d]">
                    {summary.description}
                  </p>
                </div>

                <span className="text-xl font-semibold text-[#292926]">
                  {summary.count}
                </span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Articles table */}
      <section className="mt-5 overflow-hidden rounded-[10px] border border-[#e3e3de] bg-white">
        <div className="flex flex-col justify-between gap-2 border-b border-[#e8e8e3] px-4 py-3.5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-semibold text-[#292926]">
              Articles
            </h2>

            <p className="mt-0.5 text-[11px] text-[#92928d]">
              {posts.length} of {allPosts.length} articles
              shown
            </p>
          </div>

          <p className="text-[11px] text-[#92928d]">
            {statusCounts.ARCHIVED} archived
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Search className="mx-auto h-5 w-5 text-[#aaa9a4]" />

            <h3 className="mt-3 text-sm font-medium text-[#393936]">
              No matching articles
            </h3>

            <p className="mt-1 text-xs text-[#92928d]">
              Change your search or clear the active
              filters.
            </p>

            {hasFilters && (
              <Link
                href="/admin/posts"
                className="mt-4 inline-flex text-sm font-medium text-[#0f766e]"
              >
                Clear all filters
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead className="bg-[#f7f7f4]">
                  <tr className="border-b border-[#e8e8e3]">
                    <th className="px-4 py-2.5 text-[11px] font-medium text-[#70706b]">
                      Article
                    </th>

                    <th className="px-4 py-2.5 text-[11px] font-medium text-[#70706b]">
                      Author
                    </th>

                    <th className="px-4 py-2.5 text-[11px] font-medium text-[#70706b]">
                      Status
                    </th>

                    <th className="px-4 py-2.5 text-[11px] font-medium text-[#70706b]">
                      Topics
                    </th>

                    <th className="px-4 py-2.5 text-[11px] font-medium text-[#70706b]">
                      Last modified
                    </th>

                    <th className="px-4 py-2.5 text-right text-[11px] font-medium text-[#70706b]">
                      View
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#ecece7]">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="transition hover:bg-[#fafaf8]"
                    >
                      <td className="px-4 py-3">
                        <p className="max-w-xs truncate text-sm font-medium text-[#292926]">
                          {post.title}
                        </p>

                        <p className="mt-0.5 max-w-xs truncate text-[11px] text-[#94948f]">
                          /blog/{post.slug}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e7efed] text-[10px] font-semibold text-[#346b65]">
                            {getInitials(
                              post.author.name,
                            )}
                          </span>

                          <span className="max-w-28 truncate text-xs text-[#62625d]">
                            {post.author.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <AdminStatusBadge
                          status={post.status}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex max-w-52 flex-wrap gap-1.5">
                          {post.category && (
                            <span className="rounded-full bg-[#f0f0ed] px-2 py-1 text-[10px] text-[#656560]">
                              {post.category.name}
                            </span>
                          )}

                          {post.tags
                            .slice(0, 2)
                            .map((tag) => (
                              <span
                                key={tag.id}
                                className="rounded-full border border-[#e2e2dd] bg-white px-2 py-1 text-[10px] text-[#777772]"
                              >
                                {tag.name}
                              </span>
                            ))}

                          {!post.category &&
                            post.tags.length === 0 && (
                              <span className="text-[11px] text-[#aaa9a4]">
                                No topics
                              </span>
                            )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-xs text-[#5f5f5a]">
                          {formatRelativeDate(
                            post.updatedAt,
                          )}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#9a9a95]">
                          {formatDate(post.updatedAt)}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <PublicPostAction
                          post={post}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-[#ecece7] md:hidden">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium text-[#292926]">
                        {post.title}
                      </h3>

                      <p className="mt-1 truncate text-[11px] text-[#969691]">
                        /blog/{post.slug}
                      </p>
                    </div>

                    <AdminStatusBadge
                      status={post.status}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.category && (
                      <span className="rounded-full bg-[#f0f0ed] px-2 py-1 text-[10px] text-[#656560]">
                        {post.category.name}
                      </span>
                    )}

                    {post.tags
                      .slice(0, 2)
                      .map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full border border-[#e2e2dd] px-2 py-1 text-[10px] text-[#777772]"
                        >
                          {tag.name}
                        </span>
                      ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#eeeeea] pt-3">
                    <div>
                      <p className="text-[11px] text-[#696964]">
                        Updated{" "}
                        {formatRelativeDate(
                          post.updatedAt,
                        )}
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#9a9a95]">
                        {post.author.name}
                      </p>
                    </div>

                    <PublicPostAction
                      post={post}
                    />
                  </div>
                </article>
              ))}
            </div>

            {/* Table footer */}
            <div className="flex items-center justify-between border-t border-[#e8e8e3] bg-[#fcfcfa] px-4 py-3">
              <p className="text-[11px] text-[#858580]">
                Page 1 of 1
              </p>

              <p className="text-[11px] text-[#858580]">
                Showing {posts.length} articles
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}