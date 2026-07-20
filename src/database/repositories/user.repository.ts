import { database } from "../migrations/client";

export type UserRole = "ADMIN" | "READER";

type UserDatabaseRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SafeUser = Omit<AuthUser, "passwordHash">;

/**
 * Find a user by email during login.
 *
 * This function returns passwordHash because the authentication
 * service needs it to verify the submitted password.
 */
export async function findUserByEmail(
  email: string,
): Promise<AuthUser | null> {
  const normalizedEmail = email.trim().toLowerCase();

  const result = await database.query<UserDatabaseRow>(
    `
      SELECT
        id,
        name,
        email,
        password_hash,
        role,
        email_verified_at,
        created_at,
        updated_at
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [normalizedEmail],
  );

  const user = result.rows[0];

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.password_hash,
    role: user.role,
    emailVerifiedAt: user.email_verified_at,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

/**
 * Find a user using their database ID.
 *
 * This version does not return passwordHash because normal
 * application pages should not receive password information.
 */
export async function findUserById(
  id: string,
): Promise<SafeUser | null> {
  const result = await database.query<
    Omit<UserDatabaseRow, "password_hash">
  >(
    `
      SELECT
        id,
        name,
        email,
        role,
        email_verified_at,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  const user = result.rows[0];

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerifiedAt: user.email_verified_at,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}