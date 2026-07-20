"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { login } from "../../auth/auth.service";
import { SESSION_COOKIE_NAME } from "../../auth/session-token";

import type { LoginActionState } from "./login-state";

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  if (
    typeof emailValue !== "string" ||
    typeof passwordValue !== "string"
  ) {
    return {
      error: "Invalid email or password.",
    };
  }

  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent");

  const result = await login({
    email: emailValue,
    password: passwordValue,
    userAgent,
    ipAddress: null,
  });

  if (!result.success) {
    return {
      error: "Invalid email or password.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    result.sessionToken,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: result.expiresAt,
    },
  );

  redirect("/admin");
}