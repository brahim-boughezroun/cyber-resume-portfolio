// This type describes the exact structure of one blog article.
//
// A TypeScript type works like a contract.
// Any object declared as BlogPost must contain all these properties
// with the correct value types.


export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  status: "draft" | "published";
};