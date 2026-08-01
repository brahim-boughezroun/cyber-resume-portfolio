import { redirect } from "next/navigation";

import type { SafeUser } from
  "../../database/repositories/user.repository";

import { getCurrentUser } from "./current-user";

/**
 * Require a valid authenticated user.
 *
 * Visitors without a valid session are redirected
 * to the login page.
 */
export async function requireUser(): Promise<SafeUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Require an authenticated ADMIN user.
 *
 * First, requireUser() checks authentication.
 * Then, this function checks authorization.
 */
export async function requireAdmin(): Promise<SafeUser> {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/blog");
  }

  return user;
}