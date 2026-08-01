import {
  Bell,
  ChevronDown,
} from "lucide-react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";

import { requireAdmin } from "../../auth/authorization";
import { logoutAction } from "./actions";

type AdminLayoutProps = {
  children: React.ReactNode;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  /**
   * This remains the security boundary.
   *
   * Nothing inside the admin interface is rendered
   * until the server confirms the user is an admin.
   */
  const user = await requireAdmin();
  const initials = getInitials(user.name);

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#1c1c1c]">
      <AdminSidebar
        userName={user.name}
        logoutAction={logoutAction}
      />

      <div className="lg:pl-[260px]">
        {/* Desktop top bar */}
        <header className="hidden h-16 items-center justify-between border-b border-[#e7e7e2] bg-[#fafaf8] px-7 lg:flex xl:px-10">
          <div>
            <p className="text-[17px] font-semibold tracking-[-0.02em] text-[#1c1c1c]">
              Brahim Blog
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled
              title="Notifications will be added with comments"
              aria-label="Notifications"
              className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border border-[#e4e4df] bg-white text-[#8a8a85]"
            >
              <Bell className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dceeea] text-xs font-semibold text-[#0f665f]">
                {initials || "AD"}
              </div>

              <div className="hidden xl:block">
                <p className="max-w-40 truncate text-xs font-medium text-[#333330]">
                  {user.name}
                </p>

                <p className="text-[10px] text-[#90908a]">
                  Administrator
                </p>
              </div>

              <ChevronDown className="h-4 w-4 text-[#969690]" />
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}