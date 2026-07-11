export type Skill = {
  name: string;
  level: number;
};

export type Experience = {
  period: string;
  title: string;
  company: string;
  achievements: string[];
};

export type Project = {
  name: string;
  description: string;
  tech: string[];
  cta: string;
  url: string;
  icon: string;
};

export const portfolio = {
  name: "BRAHIM BOUGHEZROUN",
  initials: "BB",
  role: "AI & FULL-STACK DEVELOPER",
  years: "2+ YEAR BUILDING PROJECTS",

  tagline:
    "Building intelligent web products, developer tools, and computer-vision experiences",

  domain: "brahim-boughezroun",

  about:
    "BTS Artificial Intelligence Development student from Morocco, focused on building practical AI and full-stack applications. I work with Python, Next.js, databases, computer vision, APIs, and automation to transform ideas into useful digital products. I enjoy learning through real projects, solving technical problems, and creating software that combines strong functionality with modern user experiences.",

  coreSkills: [
    "AI Application Development",
    "Full-Stack Development",
    "Computer Vision",
    "REST API Development",
    "Database Design",
    "Developer Tools & Automation",
  ],

  skills: [
    {
      name: "Python",
      level: 84,
    },
    {
      name: "Next.js / React / Node.js",
      level: 60,
    },
    {
      name: "JavaScript / TypeScript",
      level: 77,
    },
    {
      name: "Computer Vision",
      level: 75,
    },
    {
      name: "SQL / NoSQL Databases",
      level: 90,
    },
    {
      name: "REST API Development",
      level: 68,
    },
    {
      name: "Git & GitHub",
      level: 92,
    },

  ] satisfies Skill[],

  tools: [
    "Python",
    "JavaScript",
    "TypeScript",
    "Next.js",
    "React",
    "Node.js",
    "MongoDB",
    "OpenCV",
    "MediaPipe",
    "Git & GitHub",
    "neo4j",
    "Postman",
    "claude-code",
    "codex",
    "LangChain",
    "N8N"
  ],

  capabilities: [
    {
      title: "AI Prototyping",
      description:
        "Build practical AI assistants, RAG experiments, automation systems, and LLM-powered applications.",
    },
    {
      title: "Full-Stack Apps",
      description:
        "Develop responsive web applications with modern interfaces, APIs, authentication, and databases.",
    },
    {
      title: "Developer Tools",
      description:
        "Build command-line tools and workflows that help developers track, automate, and understand their work.",
    },
  ],

  experience: [
    {
      period: "2025 — PRESENT",
      title: "TECH CONTENT CREATOR",
      company: "INSTAGRAM & SOCIAL MEDIA",
      achievements: [
        "Create educational content about artificial intelligence, web development, Claude Code, and developer tools",
        "Transform technical concepts and project lessons into accessible short-form videos",
        "Share practical experiments involving AI applications, computer vision, automation, and software development",
      ],
    },
    {
      period: "2024 — 2025",
      title: "FULL-STACK DEVELOPMENT STUDENT",
      company: "OFPPT · ISTA TAN-TAN",
      achievements: [
        "Studied full-stack web development with HTML, CSS, JavaScript, databases, and backend technologies PHP and Node.js",
        "Built web applications with responsive interfaces, CRUD operations, APIs, and database integration",
        "Developed practical programming and software-development skills through academic projects",
      ],
    },
    {
      period: "2025 — 2027",
      title: "BTS DIA STUDENT",
      company: "CENTRE DE PRÉPARATION BTS DIA · EL OUATYA",
      achievements: [
        "Studying artificial intelligence development, Python, algorithms, databases, networks, and operating systems",
        "Applying software-engineering concepts through academic and personal projects",
        "Collaborating on technical presentations, workshops, and student-led technology activities",
      ],
    },
  ] satisfies Experience[],

  certifications: [
    {
      short: "DIA",
      description:
        "BTS Développement en Intelligence Artificielle — 2025 to Present",
    },
    {
      short: "DEV",
      description:
        "Développement Informatique, ISTA Tan-Tan — 2024 to 2025",
    },
    {
      short: "BAC",
      description:
        "Baccalauréat Sciences Physiques, Lycée Mohammed V — 2024",
    },
    {
      short: "CV",
      description:
        "Project-Based Computer Vision with OpenCV and MediaPipe",
    },
  ],

  projects: [
    {
      name: "AGENTTRACE FOR CLAUDE CODE",
      description:
        "A local command-line tool that records Claude Code activity, including commands, file changes, Git operations, and session events, then generates readable audit reports.",
      tech: ["Python", "Typer", "Rich", "Pydantic"],
      cta: "VIEW REPOSITORY",
      url: "https://github.com/brahim-boughezroun/AgentTrace-for-Claude-Code",
      icon: "⌬",
    },
    {
      name: "FACIAL EXPRESSION EMOJI DETECTOR",
      description:
        "A real-time computer-vision application that analyzes facial landmarks, detects expressions such as smiling or opening the mouth, and displays matching emoji overlays.",
      tech: ["Python", "OpenCV", "MediaPipe", "NumPy"],
      cta: "OPEN PROJECT",
      url: "https://github.com/brahim-boughezroun/Real-Time-Facial-Expression-Emoji-Detector",
      icon: "◎",
    },
    {
      name: "E-STORE SALES OPERATIONS",
      description:
        "A sales-management application for handling products, stock operations, and sales through a dynamic interface connected to REST API endpoints.",
      tech: ["JavaScript", "HTML / CSS", "REST API", "Postman"],
      cta: "VIEW REPOSITORY",
      url: "https://github.com/brahim-boughezroun/e-store-sales-operations",
      icon: "◈",
    },
  ] satisfies Project[],

  contact: {
    email: "con.brahim.boughezroun@gmail.com",
    phone: "+212 715 541 320",
    message:
      "Connection ready. Let's build an intelligent digital product together.",
  },

  socials: [
    {
      label: "GitHub",
      url: "https://github.com/brahim-boughezroun",
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/brahim-boughezroun-78b73274/",
    },
    {
      label: "Instagram",
      url: "https://www.instagram.com/brahim_boughezroun/",
    },
  ],
};