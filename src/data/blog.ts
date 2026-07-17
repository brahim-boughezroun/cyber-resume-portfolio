import type { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "post_001",
    title: "Building Rihla AI: From an Idea to a Full-Stack Travel Assistant",
    slug: "building-rihla-ai",
    excerpt:
      "How I designed an AI travel assistant using Next.js, FastAPI, PostgreSQL, Clerk, and the OpenAI API.",
    content: [
      "Rihla AI started as an internship project: build an intelligent travel assistant focused on Agadir.",
      "The frontend uses Next.js and TypeScript, while FastAPI handles the backend logic. PostgreSQL stores users, conversations, and messages.",
      "The biggest lesson was that an AI application is more than an LLM call. It also needs authentication, data storage, validation, error handling, and a clear user experience.",
    ],
    category: "Artificial Intelligence",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "OpenAI"],
    publishedAt: "2026-07-17",
    readingTime: 9,
    featured: true,
    status: "published",
  },
  {
    id: "post_002",
    title: "How Database Session Authentication Actually Works",
    slug: "database-session-authentication",
    excerpt:
      "A practical explanation of passwords, hashes, session tokens, cookies, expiration, and protected server routes.",
    content: [
      "Authentication verifies who a user is. Authorization decides what that authenticated user is allowed to access or modify.",
      "A secure login system never stores the original password. It stores a password hash created with a trusted algorithm such as Argon2.",
      "After successful login, the server generates a random session token. The browser receives the raw token inside a secure cookie, while the database stores only a hash of that token.",
      "Every protected request must validate the session and check the user's permissions on the server. Hiding an admin button in the interface is not enough security.",
    ],
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
    content: [
      "A language model only knows the information available in its training data and the context included in the current request.",
      "Retrieval-Augmented Generation adds an information-retrieval step before the model generates its answer.",
      "Documents are divided into smaller chunks and converted into numerical representations called embeddings. Similar embeddings are stored close together inside a vector database.",
      "When a user asks a question, the system searches for the most relevant chunks and adds them to the model's context. The model then generates an answer based on the retrieved information.",
    ],
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
    content: [
      "AgentTrace started from a simple question: how can developers understand what an AI coding agent changed during a development session?",
      "The project records commands, modified files, Git activity, and important events inside structured JSON and JSONL files.",
      "Typer provides the command-line interface, Rich improves terminal output, and Pydantic validates the recorded data before it is stored.",
      "The main lesson was that observability is important for AI agents. Developers need more than a final result—they need a clear history of the actions that produced it.",
    ],
    category: "Build in Public",
    tags: ["Python", "CLI", "Open Source"],
    publishedAt: "2026-07-02",
    readingTime: 6,
    featured: false,
    status: "published",
  },
  {
    id: "post_005",
    title: "Building a Blog Authentication System from Scratch",
    slug: "blog-authentication-from-scratch",
    excerpt:
      "Notes about building password hashing, secure sessions, cookies, and role-based authorization.",
    content: [],
    category: "Web Development",
    tags: ["Authentication", "Next.js", "Security"],
    publishedAt: "2026-07-20",
    readingTime: 10,
    featured: false,
    status: "draft",
  },
];