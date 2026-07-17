// "import type" imports only a TypeScript type.
//
// It is used during development to check our data structure.
// It does not add JavaScript code to the final browser bundle.
import type { BlogPost } from "@/types/blog";

// blogPosts is an array of blog articles.
//
// BlogPost[] means:
// "This variable must be an array where every object
// follows the BlogPost type."
export const blogPosts: BlogPost[] = [
  {
    // Temporary unique ID.
    // Later, PostgreSQL will generate this automatically.
    id: "post_001",

    // The title displayed on the article card and article page.
    title: "Building Rihla AI: From an Idea to a Full-Stack Travel Assistant",

    // The slug is used inside the article URL.
    //
    // Result:
    // /blog/building-rihla-ai
    slug: "building-rihla-ai",

    // Short summary displayed inside the article card.
    excerpt:
      "How I designed an AI travel assistant using Next.js, FastAPI, PostgreSQL, Clerk, and the OpenAI API.",

    // The main subject of the article.
    category: "Artificial Intelligence",

    // Additional technologies and concepts discussed in the article.
    tags: ["Next.js", "FastAPI", "PostgreSQL", "OpenAI"],

    // Publication date in ISO-like YYYY-MM-DD format.
    publishedAt: "2026-07-17",

    // Estimated reading time in minutes.
    readingTime: 9,

    // This article can later appear in a special featured section.
    featured: true,

    // Only published articles should appear publicly.
    status: "published",
  },
  {
    id: "post_002",
    title: "How Database Session Authentication Actually Works",
    slug: "database-session-authentication",
    excerpt:
      "A practical explanation of passwords, hashes, session tokens, cookies, expiration, and protected server routes.",
    category: "Web Development",
    tags: ["Authentication", "Security", "PostgreSQL"],
    publishedAt: "2026-07-12",
    readingTime: 7,
    featured: false,
    status: "published",
  },
  {
    id: "post_003",
    title: "Understanding Retrieval-Augmented Generation",
    slug: "understanding-rag",
    excerpt:
      "A beginner-friendly breakdown of embeddings, vector search, retrieval, context, and how RAG improves an AI assistant.",
    category: "Artificial Intelligence",
    tags: ["RAG", "Embeddings", "LLMs"],
    publishedAt: "2026-07-07",
    readingTime: 8,
    featured: false,
    status: "published",
  },
  {
    id: "post_004",
    title: "What I Learned Building AgentTrace for Claude Code",
    slug: "building-agenttrace",
    excerpt:
      "The architecture and engineering decisions behind a Python CLI that records coding-agent activity and generates audit reports.",
    category: "Build in Public",
    tags: ["Python", "CLI", "Open Source"],
    publishedAt: "2026-07-02",
    readingTime: 6,
    featured: false,
    status: "published",
  },

  // Example of a draft article.
  //
  // Because its status is "draft", the blog page will hide it
  // using the filter() function.
  {
    id: "post_005",
    title: "Building a Blog Authentication System from Scratch",
    slug: "blog-authentication-from-scratch",
    excerpt:
      "Notes about building password hashing, secure sessions, cookies, and role-based authorization.",
    category: "Web Development",
    tags: ["Authentication", "Next.js", "Security"],
    publishedAt: "2026-07-20",
    readingTime: 10,
    featured: false,
    status: "draft",
  },
];