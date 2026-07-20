import Link from "next/link";

import { requireAdmin } from "../../auth/authorization";
import { logoutAction } from "./actions";
type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-black text-emerald-50">
      <header
        className="
          border-b border-emerald-500/20
          bg-emerald-950/20
        "
      >
        <div
          className="
            mx-auto flex max-w-6xl items-center
            justify-between gap-4 px-6 py-4
          "
        >
          <div>
            <Link
              href="/admin"
              className="font-mono font-bold text-emerald-300"
            >
              CYBER BLOG ADMIN
            </Link>

            <p className="mt-1 text-xs text-emerald-100/50">
              Authenticated as {user.name}
            </p>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/admin"
              className="text-emerald-100/70 hover:text-emerald-300"
            >
              Dashboard
            </Link>

            <Link
              href="/blog"
              className="text-emerald-100/70 hover:text-emerald-300"
            >
              Public blog
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="
      rounded-md border border-red-500/30
      bg-red-500/10 px-3 py-2
      text-sm text-red-200 transition
      hover:border-red-400/60
      hover:bg-red-500/20
    "
              >
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
