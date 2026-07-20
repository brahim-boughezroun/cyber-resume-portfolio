BEGIN;

-- Find posts written by one author.
CREATE INDEX posts_author_id_index
  ON posts(author_id);

-- Find posts inside one category.
CREATE INDEX posts_category_id_index
  ON posts(category_id);

-- Public blog queries frequently use status and publication date.
CREATE INDEX posts_status_published_at_index
  ON posts(status, published_at DESC);

-- Helps retrieve featured public posts.
CREATE INDEX posts_featured_index
  ON posts(featured)
  WHERE featured = TRUE;

-- Helps find every post using a particular tag.
CREATE INDEX post_tags_tag_id_index
  ON post_tags(tag_id);

-- Helps retrieve comments for an article.
CREATE INDEX comments_post_id_index
  ON comments(post_id);

-- Helps retrieve comments written by a user.
CREATE INDEX comments_user_id_index
  ON comments(user_id);

-- Helps retrieve replies to a comment.
CREATE INDEX comments_parent_id_index
  ON comments(parent_id);

-- Helps the admin find comments waiting for moderation.
CREATE INDEX comments_status_index
  ON comments(status);

COMMIT;