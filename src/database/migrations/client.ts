import { Pool } from "pg";

// Read the private database connection string from .env.local.
const databaseUrl = process.env.DATABASE_URL;

// Stop immediately when the database configuration is missing.
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is missing. Add it to your .env.local file.",
  );
}

// Extend globalThis so TypeScript knows it may contain a database pool.
const globalForDatabase = globalThis as typeof globalThis & {
  databasePool?: Pool;
};

// Reuse the existing pool during development.
// This avoids creating many PostgreSQL connections when Next.js reloads files.
export const database =
  globalForDatabase.databasePool ??
  new Pool({
    connectionString: databaseUrl,
    max: 5,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.databasePool = database;
}

// Handle unexpected errors from inactive connections.
database.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});