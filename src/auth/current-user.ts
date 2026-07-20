import { cookies } from "next/headers";

import {
  findUserById,
  type SafeUser,
} from "../../database/repositories/user.repository";

import {
  deleteSessionByTokenHash,
  findSessionByTokenHash,
  updateSessionLastUsedAt,
} from "../../database/repositories/session.repository";

import {
  hashSessionToken,
  SESSION_COOKIE_NAME,
} from "./session-token";

/**
 * Read and validate the current browser session.
 *
 * Returns:
 * - SafeUser when the session is valid
 * - null when the visitor is not authenticated
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
  const cookieStore = await cookies();

  const sessionToken =
    cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // No cookie means the visitor has not logged in.
  if (!sessionToken) {
    return null;
  }

  /*
   * The browser stores the raw token.
   * PostgreSQL stores only its SHA-256 hash.
   */
  const tokenHash = hashSessionToken(sessionToken);

  const session =
    await findSessionByTokenHash(tokenHash);

  // The cookie exists, but the database session does not.
  if (!session) {
    return null;
  }

  // Check whether the session has expired.
  if (session.expiresAt.getTime() <= Date.now()) {
    await deleteSessionByTokenHash(tokenHash);

    return null;
  }

  // Load the user connected to the valid session.
  const user = await findUserById(session.userId);

  // The session points to a user that no longer exists.
  if (!user) {
    await deleteSessionByTokenHash(tokenHash);

    return null;
  }

  /*
   * Avoid updating the database on every single request.
   * Update last_used_at only when more than 15 minutes passed.
   */
  const fifteenMinutesInMilliseconds =
    1000 * 60 * 15;

  const shouldUpdateLastUsedAt =
    Date.now() - session.lastUsedAt.getTime() >
    fifteenMinutesInMilliseconds;

  if (shouldUpdateLastUsedAt) {
    await updateSessionLastUsedAt(session.id);
  }

  return user;
}