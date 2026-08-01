"use client";

import type { LucideIcon } from "lucide-react";

import {
  BookOpen,
  ExternalLink,
  FilePlus2,
  FileText,
  FolderTree,
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

type NavigationItem = {
  name: string;
  href?: string;
  icon: LucideIcon;
  disabled?: boolean;
};

const workspaceNavigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Articles",
    href: "/admin/posts",
    icon: FileText,
  },
];

const contentNavigation: NavigationItem[] = [
  {
    name: "New article",
    icon: FilePlus2,
    disabled: true,
  },
  {
    name: "Categories",
    icon: FolderTree,
    disabled: true,
  },
  {
    name: "Tags",
    icon: Tags,
    disabled: true,
  },
  {
    name: "Comments",
    icon: MessageSquare,
    disabled: true,
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

function isNavigationActive(
  pathname: string,
  href: string,
): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname.startsWith(href);
}

export function AdminSidebar({
  userName,
  logoutAction,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const initials = getInitials(userName);

  function renderNavigationItem(
    item: NavigationItem,
  ) {
    const Icon = item.icon;

    if (!item.href || item.disabled) {
      return (
        <div
          key={item.name}
          aria-disabled="true"
          title={`${item.name} will be implemented later`}
          className="flex cursor-not-allowed items-center gap-3 px-3 py-2 text-sm text-[#aaa9a4]"
        >
          <Icon className="h-[18px] w-[18px]" />

          <span>{item.name}</span>
        </div>
      );
    }

    const active = isNavigationActive(
      pathname,
      item.href,
    );

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={[
          "flex items-center gap-3 rounded-md px-3 py-2",
          "text-sm font-medium transition-colors",
          active
            ? "bg-white text-[#1c1c1c] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            : "text-[#666661] hover:bg-white/70 hover:text-[#1c1c1c]",
        ].join(" ")}
      >
        <Icon className="h-[18px] w-[18px]" />

        <span>{item.name}</span>
      </Link>
    );
  }

  return (
    <>
      {/* Mobile navigation bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#e7e7e2] bg-[#fafaf8] px-4 lg:hidden">
        <Link
          href="/admin"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dcdcd6] bg-white text-[#0f766e]">
            <BookOpen className="h-4 w-4" />
          </span>

          <span className="text-sm font-semibold text-[#1c1c1c]">
            Brahim Studio
          </span>
        </Link>

        <button
          type="button"
          aria-label="Open admin navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[#deded8] bg-white text-[#5f5f5a] transition hover:bg-[#f2f2ef]"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>
      </header>

      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[260px]",
          "flex-col border-r border-[#e4e4df]",
          "bg-[#f5f5f2] transition-transform duration-200",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        {/* Workspace identity */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="flex min-w-0 items-center gap-2.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d9d9d3] bg-white text-[#0f766e]">
              <BookOpen className="h-4 w-4" />
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1c1c1c]">
                Brahim Studio
              </p>

              <p className="truncate text-[11px] text-[#8a8a85]">
                Publishing workspace
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close admin navigation"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#777772] hover:bg-white lg:hidden"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Navigation groups */}
        <div className="flex-1 overflow-y-auto px-3 pb-6 pt-2">
          <div className="space-y-1">
            {workspaceNavigation.map(
              renderNavigationItem,
            )}
          </div>

          <div className="mt-6">
            <p className="mb-2 rounded-md bg-[#ecece8] px-3 py-1.5 text-[11px] font-medium text-[#8c8c86]">
              Content
            </p>

            <div className="space-y-1">
              {contentNavigation.map(
                renderNavigationItem,
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 rounded-md bg-[#ecece8] px-3 py-1.5 text-[11px] font-medium text-[#8c8c86]">
              Website
            </p>

            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#666661] transition hover:bg-white/70 hover:text-[#1c1c1c]"
            >
              <ExternalLink className="h-[18px] w-[18px]" />

              <span>View public blog</span>
            </Link>
          </div>
        </div>

        {/* User account */}
        <div className="border-t border-[#e0e0da] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dceeea] text-xs font-semibold text-[#0f665f]">
              {initials || "AD"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#222220]">
                {userName}
              </p>

              <p className="text-[11px] text-[#8b8b86]">
                Administrator
              </p>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                title="Sign out"
                aria-label="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-md text-[#777772] transition hover:bg-white hover:text-red-600"
              >
                <LogOut className="h-[17px] w-[17px]" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}