import { database } from "../migrations/client";

type SessionRow = {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  last_used_at: Date;
  ip_address: string | null;
  user_agent: string | null;
};

export type Session = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
};

type CreateSessionInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
};

/**
 * Convert PostgreSQL's snake_case format into
 * the camelCase format used by TypeScript.
 */
function mapSessionRow(row: SessionRow): Session {
  return {
    id: row.id,
    userId: row.user_id,
    tokenHash: row.token_hash,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
  };
}

/**
 * Save a new login session in PostgreSQL.
 *
 * Important:
 * tokenHash is stored here, not the original session token.
 */
export async function createSession(
  input: CreateSessionInput,
): Promise<Session> {
  const result = await database.query<SessionRow>(
    `
      INSERT INTO sessions (
        user_id,
        token_hash,
        expires_at,
        ip_address,
        user_agent
      )
      VALUES ($1, $2, $3, $4, $5)

      RETURNING
        id,
        user_id,
        token_hash,
        expires_at,
        created_at,
        last_used_at,
        ip_address,
        user_agent
    `,
    [
      input.userId,
      input.tokenHash,
      input.expiresAt,
      input.ipAddress ?? null,
      input.userAgent ?? null,
    ],
  );

  return mapSessionRow(result.rows[0]);
}

/**
 * Find a session using the hashed token.
 *
 * Later, the browser sends the raw token.
 * The authentication service hashes it and calls this function.
 */
export async function findSessionByTokenHash(
  tokenHash: string,
): Promise<Session | null> {
  const result = await database.query<SessionRow>(
    `
      SELECT
        id,
        user_id,
        token_hash,
        expires_at,
        created_at,
        last_used_at,
        ip_address,
        user_agent
      FROM sessions
      WHERE token_hash = $1
      LIMIT 1
    `,
    [tokenHash],
  );

  const session = result.rows[0];

  if (!session) {
    return null;
  }

  return mapSessionRow(session);
}

/**
 * Update the time when a valid session was last used.
 */
export async function updateSessionLastUsedAt(
  sessionId: string,
): Promise<void> {
  await database.query(
    `
      UPDATE sessions
      SET last_used_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
    [sessionId],
  );
}

/**
 * Delete one session during logout.
 */
export async function deleteSessionByTokenHash(
  tokenHash: string,
): Promise<void> {
  await database.query(
    `
      DELETE FROM sessions
      WHERE token_hash = $1
    `,
    [tokenHash],
  );
}

/**
 * Remove sessions that have passed their expiration date.
 */
export async function deleteExpiredSessions(): Promise<number> {
  const result = await database.query(
    `
      DELETE FROM sessions
      WHERE expires_at <= CURRENT_TIMESTAMP
    `,
  );

  return result.rowCount ?? 0;
}