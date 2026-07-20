"use client";

import { useActionState } from "react";

import { loginAction } from "./actions";
import { initialLoginActionState } from "./login-state";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialLoginActionState,
  );

  return (
    <form
      action={formAction}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-emerald-100"
        >
          Admin email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          placeholder="admin@example.com"
          className="
            w-full rounded-md border border-emerald-500/30
            bg-black/40 px-4 py-3 text-emerald-50
            outline-none transition
            placeholder:text-emerald-100/30
            focus:border-emerald-400
            focus:ring-2 focus:ring-emerald-400/20
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-emerald-100"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          placeholder="Enter your password"
          className="
            w-full rounded-md border border-emerald-500/30
            bg-black/40 px-4 py-3 text-emerald-50
            outline-none transition
            placeholder:text-emerald-100/30
            focus:border-emerald-400
            focus:ring-2 focus:ring-emerald-400/20
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          aria-live="polite"
          className="
            rounded-md border border-red-500/30
            bg-red-500/10 px-4 py-3 text-sm
            text-red-200
          "
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="
          w-full rounded-md border border-emerald-400
          bg-emerald-400 px-4 py-3
          font-semibold text-black transition
          hover:bg-emerald-300
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isPending
          ? "AUTHENTICATING..."
          : "ACCESS ADMIN SYSTEM"}
      </button>
    </form>
  );
}