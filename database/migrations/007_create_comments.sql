BEGIN;

CREATE TABLE comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  post_id BIGINT NOT NULL
    REFERENCES posts(id)
    ON DELETE CASCADE,

  -- Nullable so comments may remain if an account is deleted.
  user_id BIGINT
    REFERENCES users(id)
    ON DELETE SET NULL,

  -- Points to another comment when this comment is a reply.
  parent_id BIGINT
    REFERENCES comments(id)
    ON DELETE CASCADE,

  content TEXT NOT NULL
    CHECK (
      CHAR_LENGTH(TRIM(content)) BETWEEN 1 AND 3000
    ),

  status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
    CHECK (
      status IN (
        'PENDING',
        'APPROVED',
        'REJECTED',
        'SPAM'
      )
    ),

  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMIT;