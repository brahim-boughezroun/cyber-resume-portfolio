INSERT INTO categories (
  name,
  slug,
  description
)
VALUES
  (
    'Artificial Intelligence',
    'artificial-intelligence',
    'Articles about AI systems, machine learning, LLMs, RAG, and automation.'
  ),
  (
    'Web Development',
    'web-development',
    'Frontend, backend, databases, authentication, and full-stack development.'
  ),
  (
    'Cybersecurity',
    'cybersecurity',
    'Application security, authentication, privacy, and secure engineering.'
  ),
  (
    'Build in Public',
    'build-in-public',
    'Lessons, decisions, mistakes, and progress from real projects.'
  )
ON CONFLICT (slug) DO NOTHING;