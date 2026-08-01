import { database } from "../../src/database/client";
import { calculateReadingTime } from "../../src/lib/reading-time";

import type {
  PostCategory,
  PostDetails,
  PostStatus,
  PostSummary,
  PostTag,
} from "../../src/types/post";

/**
 * This type represents one row returned by PostgreSQL.
 *
 * PostgreSQL uses snake_case:
 * cover_image_url
 *
 * Our TypeScript application uses camelCase:
 * coverImageUrl
 */
type PostSummaryRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  status: PostStatus;
  featured: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;

  author_id: string;
  author_name: string;

  category_id: string | null;
  category_name: string | null;
  category_slug: string | null;

  tags: PostTag[];
};

/**
 * Convert a PostgreSQL row into the PostSummary format
 * used by the application.
 */
function mapPostSummaryRow(
  row: PostSummaryRow,
): PostSummary {
  let category: PostCategory | null = null;

  /**
   * A post may not have a category.
   *
   * We only create the category object when all required
   * category values exist.
   */
  if (
    row.category_id &&
    row.category_name &&
    row.category_slug
  ) {
    category = {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
    };
  }

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverImageUrl: row.cover_image_url,
    status: row.status,
    featured: row.featured,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,

    author: {
      id: row.author_id,
      name: row.author_name,
    },

    category,
    tags: row.tags,

    /**
     * Reading time is calculated from the article content.
     */
    readingTime: calculateReadingTime(row.content),
  };
}

/**
 * Convert a PostgreSQL row into a complete article.
 *
 * PostDetails contains everything from PostSummary,
 * plus the full article content.
 */
function mapPostDetailsRow(
  row: PostSummaryRow,
): PostDetails {
  return {
    ...mapPostSummaryRow(row),
    content: row.content,
  };
}

/**
 * Return all published articles.
 *
 * Used by:
 * /blog
 */
export async function getPublishedPosts(): Promise<
  PostSummary[]
> {
  const result = await database.query<PostSummaryRow>(
    `
      SELECT
        p.id::text AS id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.cover_image_url,
        p.status,
        p.featured,
        p.published_at,
        p.created_at,
        p.updated_at,

        u.id::text AS author_id,
        u.name AS author_name,

        c.id::text AS category_id,
        c.name AS category_name,
        c.slug AS category_slug,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', t.id::text,
              'name', t.name,
              'slug', t.slug
            )
          ) FILTER (
            WHERE t.id IS NOT NULL
          ),
          '[]'::json
        ) AS tags

      FROM posts p

      INNER JOIN users u
        ON u.id = p.author_id

      LEFT JOIN categories c
        ON c.id = p.category_id

      LEFT JOIN post_tags pt
        ON pt.post_id = p.id

      LEFT JOIN tags t
        ON t.id = pt.tag_id

      WHERE p.status = 'PUBLISHED'
        AND (
          p.published_at IS NULL
          OR p.published_at <= CURRENT_TIMESTAMP
        )

      GROUP BY
        p.id,
        u.id,
        u.name,
        c.id,
        c.name,
        c.slug

      ORDER BY
        COALESCE(
          p.published_at,
          p.created_at
        ) DESC
    `,
  );

  return result.rows.map(mapPostSummaryRow);
}

/**
 * Return one published article using its URL slug.
 *
 * Example:
 *
 * getPublishedPostBySlug("building-rihla-ai")
 *
 * Used by:
 * /blog/[slug]
 */
export async function getPublishedPostBySlug(
  slug: string,
): Promise<PostDetails | null> {
  /**
   * Normalize the slug before sending it to PostgreSQL.
   *
   * "  Building-Rihla-AI  "
   *
   * becomes:
   *
   * "building-rihla-ai"
   */
  const normalizedSlug = slug
    .trim()
    .toLowerCase();

  const result = await database.query<PostSummaryRow>(
    `
      SELECT
        p.id::text AS id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.cover_image_url,
        p.status,
        p.featured,
        p.published_at,
        p.created_at,
        p.updated_at,

        u.id::text AS author_id,
        u.name AS author_name,

        c.id::text AS category_id,
        c.name AS category_name,
        c.slug AS category_slug,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', t.id::text,
              'name', t.name,
              'slug', t.slug
            )
          ) FILTER (
            WHERE t.id IS NOT NULL
          ),
          '[]'::json
        ) AS tags

      FROM posts p

      INNER JOIN users u
        ON u.id = p.author_id

      LEFT JOIN categories c
        ON c.id = p.category_id

      LEFT JOIN post_tags pt
        ON pt.post_id = p.id

      LEFT JOIN tags t
        ON t.id = pt.tag_id

      WHERE p.slug = $1
        AND p.status = 'PUBLISHED'
        AND (
          p.published_at IS NULL
          OR p.published_at <= CURRENT_TIMESTAMP
        )

      GROUP BY
        p.id,
        u.id,
        u.name,
        c.id,
        c.name,
        c.slug

      LIMIT 1
    `,
    [normalizedSlug],
  );

  const post = result.rows[0];

  return post
    ? mapPostDetailsRow(post)
    : null;
}