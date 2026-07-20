"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { deleteSessionByTokenHash } from "../../../database/repositories/session.repository";
import {
  hashSessionToken,
  SESSION_COOKIE_NAME,
} from "../../auth/session-token";

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  const sessionToken =
    cookieStore.get(SESSION_COOKIE_NAME)?.value;

  /*
   * When a token exists, hash it and delete the matching
   * session from PostgreSQL.
   */
  if (sessionToken) {
    const tokenHash = hashSessionToken(sessionToken);

    await deleteSessionByTokenHash(tokenHash);
  }

  /*
   * Remove the raw session token from the browser.
   *
   * We do this even when the database session was already
   * missing or expired.
   */
  cookieStore.delete(SESSION_COOKIE_NAME);

  redirect("/login");
}