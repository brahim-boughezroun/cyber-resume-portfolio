CREATE TABLE sessions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  user_id BIGINT NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  token_hash TEXT NOT NULL UNIQUE,

  expires_at TIMESTAMPTZ NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  last_used_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  ip_address VARCHAR(45),

  user_agent TEXT
);

CREATE INDEX sessions_user_id_index
  ON sessions(user_id);

CREATE INDEX sessions_expires_at_index
  ON sessions(expires_at);