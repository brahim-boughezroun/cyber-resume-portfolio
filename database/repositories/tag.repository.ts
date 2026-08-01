import { database } from "../../src/database/client";

type TagRow = {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Convert the PostgreSQL row format into
 * the TypeScript format used by the application.
 */
function mapTagRow(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Return every tag ordered alphabetically.
 */
export async function getAllTags(): Promise<Tag[]> {
  const result = await database.query<TagRow>(
    `
      SELECT
        id,
        name,
        slug,
        created_at,
        updated_at
      FROM tags
      ORDER BY name ASC
    `,
  );

  return result.rows.map(mapTagRow);
}

/**
 * Find one tag using its database ID.
 */
export async function findTagById(
  id: string,
): Promise<Tag | null> {
  const result = await database.query<TagRow>(
    `
      SELECT
        id,
        name,
        slug,
        created_at,
        updated_at
      FROM tags
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  const tag = result.rows[0];

  return tag ? mapTagRow(tag) : null;
}

/**
 * Find one tag using its URL slug.
 */
export async function findTagBySlug(
  slug: string,
): Promise<Tag | null> {
  const normalizedSlug = slug.trim().toLowerCase();

  const result = await database.query<TagRow>(
    `
      SELECT
        id,
        name,
        slug,
        created_at,
        updated_at
      FROM tags
      WHERE slug = $1
      LIMIT 1
    `,
    [normalizedSlug],
  );

  const tag = result.rows[0];

  return tag ? mapTagRow(tag) : null;
}