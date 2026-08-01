"use client";

import {
  ExternalLink,
  FileText,
  Folder,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Tags,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type AdminSidebarProps = {
  userName: string;
  logoutAction: () => Promise<void>;
};

const navigation = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Posts",
    href: "/admin/posts",
    icon: FileText,
  },
];

const upcomingNavigation = [
  {
    name: "Categories",
    icon: Folder,
  },
  {
    name: "Tags",
    icon: Tags,
  },
  {
    name: "Comments",
    icon: MessageSquare,
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AdminSidebar({
  userName,
  logoutAction,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const initials = getInitials(userName);

  return (
    <>
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            B
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950">
              Brahim CMS
            </p>

            <p className="text-xs text-slate-500">
              Content management
            </p>
          </div>
        </Link>

        <button
          type="button"
          aria-label="Open admin navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        {/* Sidebar header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">
          <Link
            href="/admin"
            className="flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
              B
            </div>

            <div>
              <p className="font-semibold text-slate-950">
                Brahim CMS
              </p>

              <p className="text-xs text-slate-500">
                Blog administration
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close admin navigation"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={[
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Coming next
          </p>

          <div className="space-y-1">
            {upcomingNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400"
                >
                  <Icon className="h-5 w-5" />

                  <span className="flex-1">
                    {item.name}
                  </span>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Soon
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="border-t border-slate-200 p-4">
          <Link
            href="/blog"
            onClick={() => setIsOpen(false)}
            className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <ExternalLink className="h-5 w-5" />

            <span>View public blog</span>
          </Link>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {initials || "AD"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {userName}
                </p>

                <p className="text-xs text-slate-500">
                  Administrator
                </p>
              </div>
            </div>

            <form
              action={logoutAction}
              className="mt-3"
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />

                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}