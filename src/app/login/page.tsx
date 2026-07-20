import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login | Brahim Blog",
  description:
    "Secure administrator access for the Brahim Blog dashboard.",
};

export default function LoginPage() {
  return (
    <main
      className="
        flex min-h-screen items-center justify-center
        bg-black px-4 py-12 text-emerald-50
      "
    >
      <section
        className="
          w-full max-w-md rounded-xl
          border border-emerald-500/30
          bg-emerald-950/20 p-6
          shadow-2xl shadow-emerald-950/30
          backdrop-blur-sm sm:p-8
        "
      >
        <div className="mb-8">
          <p
            className="
              mb-3 font-mono text-xs uppercase
              tracking-[0.3em] text-emerald-400
            "
          >
            Secure access portal
          </p>

          <h1 className="text-3xl font-bold text-white">
            Admin Login
          </h1>

          <p className="mt-3 text-sm leading-6 text-emerald-100/60">
            Authenticate to manage posts, categories,
            tags, and comments.
          </p>
        </div>

        <LoginForm />

        <div
          className="
            mt-6 border-t border-emerald-500/20
            pt-5 text-center
          "
        >
          <Link
            href="/blog"
            className="
              text-sm text-emerald-300 transition
              hover:text-emerald-100
            "
          >
            ← Return to public blog
          </Link>
        </div>
      </section>
    </main>
  );
}