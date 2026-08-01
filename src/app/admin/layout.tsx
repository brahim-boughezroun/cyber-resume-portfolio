import { AdminSidebar } from "@/components/admin/admin-sidebar";

import { requireAdmin } from "../../auth/authorization";
import { logoutAction } from "./actions";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  /**
   * This remains the security boundary.
   *
   * The dashboard UI is rendered only after the server
   * confirms that the current user is an administrator.
   */
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <AdminSidebar
        userName={user.name}
        logoutAction={logoutAction}
      />

      {/*
       * On desktop, the sidebar uses 18rem of width.
       *
       * lg:pl-72 adds the same amount of space to the
       * content so it does not appear behind the sidebar.
       */}
      <div className="lg:pl-72">
        <div className="mx-auto min-h-screen max-w-[1600px]">
          {children}
        </div>
      </div>
    </div>
  );
}