BEGIN;

CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- The user who created the article.
  author_id BIGINT NOT NULL
    REFERENCES users(id)
    ON DELETE RESTRICT,

  -- A category may be removed without deleting the article.
  category_id BIGINT
    REFERENCES categories(id)
    ON DELETE SET NULL,

  title VARCHAR(220) NOT NULL,

  -- Used in URLs such as /blog/building-rihla-ai.
  slug VARCHAR(240) NOT NULL UNIQUE,

  excerpt TEXT NOT NULL,

  -- Markdown article content will be stored here.
  content TEXT NOT NULL DEFAULT '',

  cover_image_url TEXT,

  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
    CHECK (
      status IN (
        'DRAFT',
        'PUBLISHED',
        'ARCHIVED',
        'SCHEDULED'
      )
    ),

  featured BOOLEAN NOT NULL DEFAULT FALSE,

  published_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMIT;