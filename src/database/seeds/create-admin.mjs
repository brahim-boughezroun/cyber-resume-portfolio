import { hash } from "@node-rs/argon2";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const adminName = process.env.ADMIN_NAME?.trim();
const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;

if (!databaseUrl || !adminName || !adminEmail || !adminPassword) {
  throw new Error(
    "DATABASE_URL, ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required.",
  );
}

if (adminPassword.length < 16) {
  throw new Error(
    "ADMIN_PASSWORD must contain at least 16 characters.",
  );
}

const pool = new Pool({
  connectionString: databaseUrl,
});

try {
  /*
   * Argon2id is the package's default algorithm.
   *
   * The real password is transformed into a secure hash.
   * Only this hash will be saved in PostgreSQL.
   */
  const passwordHash = await hash(adminPassword, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
    outputLen: 32,
  });

  const result = await pool.query(
    `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role,
        email_verified_at
      )
      VALUES ($1, $2, $3, 'ADMIN', CURRENT_TIMESTAMP)

      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        role = 'ADMIN',
        email_verified_at = COALESCE(
          users.email_verified_at,
          CURRENT_TIMESTAMP
        )

      RETURNING id, name, email, role
    `,
    [adminName, adminEmail, passwordHash],
  );

  console.log("Admin account created or updated:");
  console.table(result.rows);
} catch (error) {
  console.error("Failed to create admin account:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}