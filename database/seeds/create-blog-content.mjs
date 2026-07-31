import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const adminEmail = process.env.ADMIN_EMAIL
  ?.trim()
  .toLowerCase();

if (!databaseUrl || !adminEmail) {
  throw new Error(
    "DATABASE_URL and ADMIN_EMAIL are required.",
  );
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const posts = [
  {
    title:
      "Building Rihla AI: From an Idea to a Full-Stack Travel Assistant",
    slug: "building-rihla-ai",
    excerpt:
      "How I designed an AI travel assistant using Next.js, FastAPI, PostgreSQL, Clerk, and the OpenAI API.",
    content: `
# Building Rihla AI

Rihla AI started as an internship project: build an intelligent travel assistant focused on Agadir.

The frontend uses Next.js and TypeScript, while FastAPI handles the backend logic. PostgreSQL stores users, conversations, and messages.

The biggest lesson was that an AI application is more than an LLM call. It also needs authentication, data storage, validation, error handling, and a clear user experience.
    `.trim(),
    category: {
      name: "Artificial Intelligence",
      slug: "artificial-intelligence",
      description:
        "Practical articles about AI systems, agents, RAG and machine learning.",
    },
    tags: [
      { name: "Next.js", slug: "nextjs" },
      { name: "FastAPI", slug: "fastapi" },
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "OpenAI", slug: "openai" },
    ],
    status: "PUBLISHED",
    featured: true,
    publishedAt: "2026-07-17T12:00:00.000Z",
  },
  {
    title:
      "How Database Session Authentication Actually Works",
    slug: "database-session-authentication",
    excerpt:
      "A practical explanation of passwords, hashes, session tokens, cookies, expiration, and protected server routes.",
    content: `
# Database Session Authentication

Authentication verifies who a user is. Authorization decides what that authenticated user is allowed to access or modify.

A secure login system never stores the original password. It stores a password hash created with a trusted algorithm such as Argon2.

After successful login, the server generates a random session token. The browser receives the raw token inside a secure cookie, while the database stores only a hash of that token.

Every protected request must validate the session and check the user's permissions on the server. Hiding an admin button in the interface is not enough security.
    `.trim(),
    category: {
      name: "Web Development",
      slug: "web-development",
      description:
        "Articles about frontend, backend, databases, authentication and web security.",
    },
    tags: [
      { name: "Authentication", slug: "authentication" },
      { name: "Security", slug: "security" },
      { name: "PostgreSQL", slug: "postgresql" },
    ],
    status: "PUBLISHED",
    featured: false,
    publishedAt: "2026-07-12T12:00:00.000Z",
  },
  {
    title: "Understanding Retrieval-Augmented Generation",
    slug: "understanding-rag",
    excerpt:
      "A beginner-friendly breakdown of embeddings, vector search, retrieval, context, and how RAG improves an AI assistant.",
    content: `
# Understanding Retrieval-Augmented Generation

A language model only knows the information available in its training data and the context included in the current request.

Retrieval-Augmented Generation adds an information-retrieval step before the model generates its answer.

Documents are divided into smaller chunks and converted into numerical representations called embeddings. Similar embeddings are stored close together inside a vector database.

When a user asks a question, the system searches for the most relevant chunks and adds them to the model's context. The model then generates an answer based on the retrieved information.
    `.trim(),
    category: {
      name: "Artificial Intelligence",
      slug: "artificial-intelligence",
      description:
        "Practical articles about AI systems, agents, RAG and machine learning.",
    },
    tags: [
      { name: "RAG", slug: "rag" },
      { name: "Embeddings", slug: "embeddings" },
      { name: "LLMs", slug: "llms" },
    ],
    status: "PUBLISHED",
    featured: false,
    publishedAt: "2026-07-07T12:00:00.000Z",
  },
  {
    title:
      "What I Learned Building AgentTrace for Claude Code",
    slug: "building-agenttrace",
    excerpt:
      "The architecture and engineering decisions behind a Python CLI that records coding-agent activity and generates audit reports.",
    content: `
# Building AgentTrace

AgentTrace started from a simple question: how can developers understand what an AI coding agent changed during a development session?

The project records commands, modified files, Git activity, and important events inside structured JSON and JSONL files.

Typer provides the command-line interface, Rich improves terminal output, and Pydantic validates the recorded data before it is stored.

The main lesson was that observability is important for AI agents. Developers need more than a final result—they need a clear history of the actions that produced it.
    `.trim(),
    category: {
      name: "Build in Public",
      slug: "build-in-public",
      description:
        "Technical lessons and decisions from projects built in public.",
    },
    tags: [
      { name: "Python", slug: "python" },
      { name: "CLI", slug: "cli" },
      { name: "Open Source", slug: "open-source" },
    ],
    status: "PUBLISHED",
    featured: false,
    publishedAt: "2026-07-02T12:00:00.000Z",
  },
  {
    title:
      "Building a Blog Authentication System from Scratch",
    slug: "blog-authentication-from-scratch",
    excerpt:
      "Notes about building password hashing, secure sessions, cookies, and role-based authorization.",
    content: `
# Building Authentication From Scratch

This article is currently being written.

It will explain password hashing, secure session tokens, HttpOnly cookies, expiration and role-based authorization.
    `.trim(),
    category: {
      name: "Web Development",
      slug: "web-development",
      description:
        "Articles about frontend, backend, databases, authentication and web security.",
    },
    tags: [
      { name: "Authentication", slug: "authentication" },
      { name: "Next.js", slug: "nextjs" },
      { name: "Security", slug: "security" },
    ],
    status: "DRAFT",
    featured: false,
    publishedAt: null,
  },
];

const client = await pool.connect();

try {
  await client.query("BEGIN");

  const adminResult = await client.query(
    `
      SELECT id
      FROM users
      WHERE email = $1
        AND role = 'ADMIN'
      LIMIT 1
    `,
    [adminEmail],
  );

  const admin = adminResult.rows[0];

  if (!admin) {
    throw new Error(
      `No admin account found for ${adminEmail}. Run npm run seed:admin first.`,
    );
  }

  for (const post of posts) {
    const categoryResult = await client.query(
      `
        INSERT INTO categories (
          name,
          slug,
          description
        )
        VALUES ($1, $2, $3)

        ON CONFLICT (slug)
        DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description

        RETURNING id
      `,
      [
        post.category.name,
        post.category.slug,
        post.category.description,
      ],
    );

    const categoryId = categoryResult.rows[0].id;

    const postResult = await client.query(
      `
        INSERT INTO posts (
          author_id,
          category_id,
          title,
          slug,
          excerpt,
          content,
          cover_image_url,
          status,
          featured,
          published_at
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          NULL,
          $7,
          $8,
          $9
        )

        ON CONFLICT (slug)
        DO UPDATE SET
          author_id = EXCLUDED.author_id,
          category_id = EXCLUDED.category_id,
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          cover_image_url = EXCLUDED.cover_image_url,
          status = EXCLUDED.status,
          featured = EXCLUDED.featured,
          published_at = EXCLUDED.published_at

        RETURNING id
      `,
      [
        admin.id,
        categoryId,
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.status,
        post.featured,
        post.publishedAt,
      ],
    );

    const postId = postResult.rows[0].id;

    // Remove old relationships before recreating them.
    await client.query(
      `
        DELETE FROM post_tags
        WHERE post_id = $1
      `,
      [postId],
    );

    for (const tag of post.tags) {
      const tagResult = await client.query(
        `
          INSERT INTO tags (
            name,
            slug
          )
          VALUES ($1, $2)

          ON CONFLICT (slug)
          DO UPDATE SET
            name = EXCLUDED.name

          RETURNING id
        `,
        [tag.name, tag.slug],
      );

      const tagId = tagResult.rows[0].id;

      await client.query(
        `
          INSERT INTO post_tags (
            post_id,
            tag_id
          )
          VALUES ($1, $2)

          ON CONFLICT (post_id, tag_id)
          DO NOTHING
        `,
        [postId, tagId],
      );
    }

    console.log(`Seeded: ${post.title}`);
  }

  await client.query("COMMIT");

  const summary = await pool.query(
    `
      SELECT
        status,
        COUNT(*)::int AS total
      FROM posts
      GROUP BY status
      ORDER BY status
    `,
  );

  console.log("Blog content seeded successfully.");
  console.table(summary.rows);
} catch (error) {
  await client.query("ROLLBACK");

  console.error("Failed to seed blog content:", error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}