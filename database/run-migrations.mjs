import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const currentFilePath = fileURLToPath(import.meta.url);
const databaseDirectory = path.dirname(currentFilePath);

const migrationsDirectory = path.join(
  databaseDirectory,
  "migrations",
);

const baselineMode = process.argv.includes("--baseline");

const pool = new Pool({
  connectionString: databaseUrl,
});

const client = await pool.connect();

/**
 * Create a checksum for a migration file.
 *
 * If an old migration is edited after it was applied,
 * its checksum will change and the runner will reject it.
 */
function createMigrationChecksum(content) {
  return createHash("sha256")
    .update(content)
    .digest("hex");
}

try {
  /*
   * This table tracks which migration files have already run.
   *
   * The runner creates it automatically because it is required
   * before other migrations can be tracked.
   */
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      checksum CHAR(64) NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const migrationFiles = (
    await readdir(migrationsDirectory)
  )
    .filter((filename) => filename.endsWith(".sql"))
    .sort();

  const appliedResult = await client.query(`
    SELECT filename, checksum
    FROM schema_migrations
    ORDER BY filename
  `);

  const appliedMigrations = new Map(
    appliedResult.rows.map((row) => [
      row.filename,
      row.checksum,
    ]),
  );

  if (migrationFiles.length === 0) {
    console.log("No migration files were found.");
  }

  for (const filename of migrationFiles) {
    const migrationPath = path.join(
      migrationsDirectory,
      filename,
    );

    const migrationSql = await readFile(
      migrationPath,
      "utf8",
    );

    const checksum =
      createMigrationChecksum(migrationSql);

    const savedChecksum =
      appliedMigrations.get(filename);

    /*
     * The migration already exists in schema_migrations.
     * We skip it, but first confirm it was not edited.
     */
    if (savedChecksum) {
      if (savedChecksum !== checksum) {
        throw new Error(
          `Migration ${filename} was changed after being applied.`,
        );
      }

      console.log(`Skipped: ${filename}`);
      continue;
    }

    /*
     * Baseline mode records migrations without executing them.
     *
     * We need this once because your current tables were already
     * created manually in pgAdmin.
     */
    if (baselineMode) {
      await client.query(
        `
          INSERT INTO schema_migrations (
            filename,
            checksum
          )
          VALUES ($1, $2)
        `,
        [filename, checksum],
      );

      console.log(`Baselined: ${filename}`);
      continue;
    }

    try {
      console.log(`Applying: ${filename}`);

      await client.query(migrationSql);

      await client.query(
        `
          INSERT INTO schema_migrations (
            filename,
            checksum
          )
          VALUES ($1, $2)
        `,
        [filename, checksum],
      );

      console.log(`Applied: ${filename}`);
    } catch (error) {
      /*
       * Some migration files contain BEGIN and COMMIT.
       * ROLLBACK resets the connection when one fails.
       */
      try {
        await client.query("ROLLBACK");
      } catch {
        // The migration may not have opened a transaction.
      }

      throw error;
    }
  }

  console.log(
    baselineMode
      ? "Migration baseline completed."
      : "Database migrations completed.",
  );
} catch (error) {
  console.error("Migration process failed:", error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}