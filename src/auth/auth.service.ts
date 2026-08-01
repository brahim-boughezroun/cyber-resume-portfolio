import { verify } from "@node-rs/argon2";

import {
  findUserByEmail,
  type SafeUser,
} from "../../database/repositories/user.repository";

import { createSession } from "../../database/repositories/session.repository";

import {
  createSessionExpirationDate,
  generateSessionToken,
  hashSessionToken,
} from "./session-token";

type LoginInput = {
  email: string;
  password: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

type SuccessfulLoginResult = {
  success: true;
  user: SafeUser;
  sessionToken: string;
  expiresAt: Date;
};

type FailedLoginResult = {
  success: false;
  error: "INVALID_CREDENTIALS";
};

export type LoginResult =
  | SuccessfulLoginResult
  | FailedLoginResult;

/**
 * Verify an email and password, then create a new session.
 *
 * This service does not create the browser cookie.
 * It returns the raw token so the login action can place it
 * inside an HttpOnly cookie.
 */
export async function login(
  input: LoginInput,
): Promise<LoginResult> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    return {
      success: false,
      error: "INVALID_CREDENTIALS",
    };
  }

  // Find the account and its password hash.
  const user = await findUserByEmail(email);

  if (!user) {
    return {
      success: false,
      error: "INVALID_CREDENTIALS",
    };
  }

  /*
   * Argon2 compares the submitted password with the
   * password hash stored in PostgreSQL.
   */
  let passwordIsValid = false;

  try {
    passwordIsValid = await verify(
      user.passwordHash,
      password,
    );
  } catch {
    passwordIsValid = false;
  }

  if (!passwordIsValid) {
    return {
      success: false,
      error: "INVALID_CREDENTIALS",
    };
  }

  // Generate a new random secret for this login session.
  const sessionToken = generateSessionToken();

  // Store only its SHA-256 hash in PostgreSQL.
  const tokenHash = hashSessionToken(sessionToken);

  // The session and cookie will expire at the same time.
  const expiresAt = createSessionExpirationDate();

  await createSession({
    userId: user.id,
    tokenHash,
    expiresAt,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
  });

  /*
   * Explicitly create the safe user object.
   * passwordHash must never leave the authentication service.
   */
  const safeUser: SafeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    success: true,
    user: safeUser,
    sessionToken,
    expiresAt,
  };
}
