export const POST_STATUSES = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "SCHEDULED",
] as const;

export type PostStatus =
  (typeof POST_STATUSES)[number];

export type PostAuthor = {
  id: string;
  name: string;
};

export type PostCategory = {
  id: string;
  name: string;
  slug: string;
};

export type PostTag = {
  id: string;
  name: string;
  slug: string;
};

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  status: PostStatus;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: PostAuthor;
  category: PostCategory | null;
  tags: PostTag[];
  readingTime: number;
};

export type PostDetails = PostSummary & {
  content: string;
};