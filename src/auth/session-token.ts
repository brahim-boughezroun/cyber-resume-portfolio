import { createHash, randomBytes } from "node:crypto";

export const SESSION_COOKIE_NAME = "cyber_blog_session";

export const SESSION_DURATION_MS =
  1000 * 60 * 60 * 24 * 14;

/**
 * Create a cryptographically secure random session token.
 *
 * This raw token will be stored only in the browser cookie.
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Convert the raw session token into a SHA-256 hash.
 *
 * Only this hash is stored in PostgreSQL.
 */
export function hashSessionToken(token: string): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

/**
 * Calculate when a new session should expire.
 */
export function createSessionExpirationDate(): Date {
  return new Date(Date.now() + SESSION_DURATION_MS);
}