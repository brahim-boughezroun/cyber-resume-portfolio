import { database } from "../../src/database/client";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllCategories(): Promise<Category[]> {
  const result = await database.query<CategoryRow>(
    `
      SELECT
        id,
        name,
        slug,
        description,
        created_at,
        updated_at
      FROM categories
      ORDER BY name ASC
    `,
  );

  return result.rows.map(mapCategoryRow);
}

export async function findCategoryById(
  id: string,
): Promise<Category | null> {
  const result = await database.query<CategoryRow>(
    `
      SELECT
        id,
        name,
        slug,
        description,
        created_at,
        updated_at
      FROM categories
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  const category = result.rows[0];

  return category
    ? mapCategoryRow(category)
    : null;
}

export async function findCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const normalizedSlug = slug.trim().toLowerCase();

  const result = await database.query<CategoryRow>(
    `
      SELECT
        id,
        name,
        slug,
        description,
        created_at,
        updated_at
      FROM categories
      WHERE slug = $1
      LIMIT 1
    `,
    [normalizedSlug],
  );

  const category = result.rows[0];

  return category
    ? mapCategoryRow(category)
    : null;
}