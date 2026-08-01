import type { LucideIcon } from "lucide-react";

import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  FileText,
} from "lucide-react";
import Link from "next/link";

import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { getAdminPosts } from "../../../database/repositories/post.repository";

export const dynamic = "force-dynamic";

type MetricDefinition = {
  label: string;
  description: string;
  count: number;
  icon: LucideIcon;
  wrapperClassName: string;
  iconClassName: string;
};

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

export default async function AdminPage() {
  const posts = await getAdminPosts();

  const publishedCount = posts.filter(
    (post) => post.status === "PUBLISHED",
  ).length;

  const draftCount = posts.filter(
    (post) => post.status === "DRAFT",
  ).length;

  const scheduledCount = posts.filter(
    (post) => post.status === "SCHEDULED",
  ).length;

  const recentPosts = posts.slice(0, 5);

  const metrics: MetricDefinition[] = [
    {
      label: "Published",
      description: "Visible on your public blog",
      count: publishedCount,
      icon: CheckCircle2,
      wrapperClassName:
        "border-[#d5e8da] bg-[#f2f8f3]",
      iconClassName:
        "bg-[#dceee0] text-[#39724a]",
    },
    {
      label: "Drafts",
      description: "Articles still in progress",
      count: draftCount,
      icon: FileText,
      wrapperClassName:
        "border-[#e9dfba] bg-[#fbf8ed]",
      iconClassName:
        "bg-[#f2e9c8] text-[#866e24]",
    },
    {
      label: "Scheduled",
      description: "Waiting to be published",
      count: scheduledCount,
      icon: CalendarClock,
      wrapperClassName:
        "border-[#dfd9ef] bg-[#f6f4fb]",
      iconClassName:
        "bg-[#e8e2f4] text-[#66558c]",
    },
  ];

  return (
    <main className="px-4 py-7 sm:px-6 lg:px-7 xl:px-10">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium text-[#888883]">
            Workspace overview
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#1c1c1c]">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#777772]">
            Review your latest articles and publishing
            activity.
          </p>
        </div>

        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0f766e] transition hover:text-[#095e58]"
        >
          View all articles

          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </header>

      {/* Compact workflow summaries */}
      <section className="mt-7 grid gap-3 lg:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className={[
                "rounded-[10px] border px-4 py-3.5",
                metric.wrapperClassName,
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center",
                    "rounded-md",
                    metric.iconClassName,
                  ].join(" ")}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#686863]">
                    {metric.label}
                  </p>

                  <p className="mt-0.5 truncate text-[11px] text-[#92928d]">
                    {metric.description}
                  </p>
                </div>

                <span className="text-xl font-semibold text-[#2a2a27]">
                  {metric.count}
                </span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Recent articles */}
      <section className="mt-6 overflow-hidden rounded-[10px] border border-[#e3e3de] bg-white">
        <div className="flex items-center justify-between border-b border-[#e8e8e3] px-4 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-[#292926]">
              Recent articles
            </h2>

            <p className="mt-0.5 text-[11px] text-[#92928d]">
              Ordered by the latest modification
            </p>
          </div>

          <span className="text-xs text-[#888883]">
            {posts.length} total
          </span>
        </div>

        {recentPosts.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-medium text-[#3d3d39]">
              No articles found
            </p>

            <p className="mt-1 text-xs text-[#92928d]">
              Your database does not contain any articles.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead className="bg-[#f7f7f4]">
                  <tr className="border-b border-[#e8e8e3]">
                    <th className="px-4 py-2.5 text-[11px] font-medium text-[#777772]">
                      Article
                    </th>

                    <th className="px-4 py-2.5 text-[11px] font-medium text-[#777772]">
                      Status
                    </th>

                    <th className="px-4 py-2.5 text-[11px] font-medium text-[#777772]">
                      Category
                    </th>

                    <th className="px-4 py-2.5 text-right text-[11px] font-medium text-[#777772]">
                      Last modified
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#ecece7]">
                  {recentPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="transition hover:bg-[#fafaf8]"
                    >
                      <td className="px-4 py-3">
                        <p className="max-w-sm truncate text-sm font-medium text-[#292926]">
                          {post.title}
                        </p>

                        <p className="mt-0.5 max-w-sm truncate text-[11px] text-[#969691]">
                          /blog/{post.slug}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <AdminStatusBadge
                          status={post.status}
                        />
                      </td>

                      <td className="px-4 py-3 text-xs text-[#686863]">
                        {post.category?.name ??
                          "Uncategorized"}
                      </td>

                      <td className="px-4 py-3 text-right text-xs text-[#686863]">
                        {formatRelativeDate(
                          post.updatedAt,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-[#ecece7] md:hidden">
              {recentPosts.map((post) => (
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
                        {post.category?.name ??
                          "Uncategorized"}
                      </p>
                    </div>

                    <AdminStatusBadge
                      status={post.status}
                    />
                  </div>

                  <p className="mt-3 text-[11px] text-[#888883]">
                    Updated{" "}
                    {formatRelativeDate(
                      post.updatedAt,
                    )}
                  </p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}