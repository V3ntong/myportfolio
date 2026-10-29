export type Profile = {
  name: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
};

export type QuickFact = {
  label: string;
  value: string;
};

export type SectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export type UiLabels = {
  quickFacts: string;
  role: string;
  screenshot: string;
  github: string;
  liveDemo: string;
  degree: string;
  relevantCoursework: string;
  viewCredential: string;
  inProgress: string;
  directEmailPrefix: string;
};

export type AboutContent = {
  paragraphs: string[];
  lookingForTitle: string;
  lookingFor: string[];
  quickFacts: QuickFact[];
};

export type Project = {
  id: string;
  title: string;
  description: string;
  role: string;
  tech: string[];
  githubUrl: string;
  liveUrl: string;
  imageAlt: string;
};

export type TechItem = {
  name: string;
  icon?: string;
};

export type TechCategory = {
  name: string;
  items: TechItem[];
  wide?: boolean;
};

export type ExperienceEntry = {
  id: string;
  role: string;
  organization: string;
  period: string;
  bullets: string[];
};

export type EducationEntry = {
  degree: string;
  school: string;
  period: string;
  summary: string;
  coursework: string[];
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  inProgress?: boolean;
};

export type ContactLink = {
  id: "email" | "github" | "linkedin";
  label: string;
  value: string;
  href: string;
};

export type SocialLinkId =
  | "github"
  | "x"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "email"
  | "discord";

export type SocialLink = {
  id: SocialLinkId;
  label: string;
  letter: string;
  href: string;
};

export type ContactFormCopy = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
  errorFallback: string;
  unconfigured: string;
  invalidRequest: string;
  validationSummary: string;
  validation: {
    name: string;
    email: string;
    message: string;
  };
  responseNote: string;
};

export type ContactContent = {
  line: string;
  description: string;
  links: ContactLink[];
  form: ContactFormCopy;
};

export const profile: Profile = {
  name: "Melvin Maquilan",
  role: "Full-Stack Developer",
  email: "[REPLACE] you@example.com",
  github: "[REPLACE] github.com/your-handle",
  linkedin: "[REPLACE] linkedin.com/in/your-handle",
};

export const sections: Record<
  | "about"
  | "projects"
  | "techStack"
  | "experience"
  | "education"
  | "certifications"
  | "contact",
  SectionCopy
> = {
  about: {
    eyebrow: "01 — About",
    title: "About Me",
    description: "A little about how I work and what I'm looking for next.",
  },
  projects: {
    eyebrow: "02 — Projects",
    title: "Things I've built",
    description:
      "A few projects where I handled the idea, the interface, and the code behind it.",
  },
  techStack: {
    eyebrow: "03 — Tech Stack",
    title: "Tools I work with",
    description:
      "The languages, frameworks, and platforms I reach for most often.",
  },
  experience: {
    eyebrow: "04 — Experience",
    title: "Where I've worked",
    description:
      "Freelance builds and team projects where I shipped real features.",
  },
  education: {
    eyebrow: "05 — Education",
    title: "Education",
    description: "The academic foundation behind the work.",
  },
  certifications: {
    eyebrow: "06 — Certifications",
    title: "Certifications",
    description:
      "Courses and credentials I've completed or am currently working through.",
  },
  contact: {
    eyebrow: "07 — Contact",
    title: "Contact",
    description: "",
  },
};

export const labels: UiLabels = {
  quickFacts: "Quick facts",
  role: "Role",
  screenshot: "Screenshot",
  github: "GitHub",
  liveDemo: "Live Demo",
  degree: "Degree",
  relevantCoursework: "Relevant coursework",
  viewCredential: "View credential",
  inProgress: "In progress",
  directEmailPrefix: "You can also reach me at",
};

export const aboutContent: AboutContent = {
  paragraphs: [
    "I'm a full-stack developer currently studying computer science, and I like building things from idea to working product.",
    "I enjoy the whole process: shaping the idea, designing the interface, wiring up the data, and polishing the details until it feels right. Right now I'm focused on web and mobile apps, with a growing interest in AI and cloud tools.",
  ],
  lookingForTitle: "Currently looking for",
  lookingFor: ["Internships", "Junior roles", "Freelance work"],
  quickFacts: [
    {
      label: "Interests",
      value: "[REPLACE] UI design, AI experiments, and mobile apps",
    },
    {
      label: "Currently learning",
      value: "[REPLACE] Cloud deployment and applied AI",
    },
    {
      label: "Open to",
      value: "Internships, junior roles, and freelance work",
    },
  ],
};

export const projects: Project[] = [
  {
    id: "kah-ken-sha-ney",
    title: "KAH KEN SHA NEY",
    description:
      "A lost & found mobile app with item reporting, claiming, an admin dashboard, and a chatbot.",
    role: "[REPLACE] Lead mobile developer",
    tech: ["Flutter", "Firebase"],
    githubUrl: "#",
    liveUrl: "#",
    imageAlt: "Screenshot placeholder for the KAH KEN SHA NEY mobile app",
  },
  {
    id: "face-recognition",
    title: "Face Recognition Web App",
    description:
      "Identifies people from a live camera feed, uploaded photos, and video.",
    role: "[REPLACE] Full-stack developer",
    tech: ["Python", "SQL Server"],
    githubUrl: "#",
    liveUrl: "#",
    imageAlt: "Screenshot placeholder for the face recognition web app",
  },
  {
    id: "student-records",
    title: "Student Records System",
    description:
      "Create a database, add students, and view every record in a clean table view.",
    role: "[REPLACE] Full-stack developer",
    tech: ["React", "FastAPI", "SQL Server"],
    githubUrl: "#",
    liveUrl: "#",
    imageAlt: "Screenshot placeholder for the student records system",
  },
  {
    id: "developer-portfolio",
    title: "Developer Portfolio",
    description:
      "This site: a single-page portfolio with animated sections and a light/dark theme.",
    role: "[REPLACE] Designer & developer",
    tech: ["Next.js", "Tailwind CSS", "GSAP"],
    githubUrl: "#",
    liveUrl: "#",
    imageAlt: "Screenshot placeholder for this developer portfolio",
  },
];

export const techStack: TechCategory[] = [
  {
    name: "Frontend",
    items: [
      { name: "React", icon: "/icons/react_light.svg" },
      { name: "Next.js", icon: "/icons/nextjs_icon_dark.svg" },
      { name: "TypeScript", icon: "/icons/typescript.svg" },
      { name: "Tailwind CSS", icon: "/icons/tailwindcss.svg" },
    ],
  },
  {
    name: "Backend",
    items: [
      { name: "FastAPI", icon: "/icons/fastapi.svg" },
      { name: "Flask", icon: "/icons/flask-light.svg" },
      { name: "Django", icon: "/icons/django.svg" },
      { name: "Laravel", icon: "/icons/laravel.svg" },
    ],
  },
  {
    name: "Database",
    items: [
      { name: "SQL Server", icon: "/icons/sql-server.svg" },
      { name: "SQLite", icon: "/icons/sqlite.svg" },
      { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
      { name: "MySQL", icon: "/icons/mysql-icon-light.svg" },
      { name: "Firestore", icon: "/icons/firebase.svg" },
      { name: "Supabase", icon: "/icons/supabase.svg" },
    ],
  },
  {
    name: "DevOps & Cloud",
    items: [
      { name: "AWS" },
      { name: "GCP" },
      { name: "Azure" },
      { name: "GitHub Actions" },
      { name: "Jenkins" },
      { name: "GitLab CI" },
      { name: "Terraform" },
      { name: "AWS CloudFormation" },
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "Prometheus" },
      { name: "Grafana" },
      { name: "Datadog" },
    ],
  },
  {
    name: "AI & Machine Learning",
    items: [
      { name: "TensorFlow" },
      { name: "PyTorch" },
      { name: "LangChain" },
      { name: "Transformers" },
      { name: "OpenAI" },
      { name: "Anthropic" },
      { name: "Mistral" },
      { name: "Hugging Face" },
      { name: "LlamaIndex" },
      { name: "AutoGPT" },
      { name: "Claude Code" },
      { name: "Codex" },
    ],
  },
  {
    name: "Security & Identity",
    items: [
      { name: "AWS IAM" },
      { name: "Azure AD" },
      { name: "Okta" },
      { name: "SAP CDC" },
      { name: "Auth0" },
      { name: "Cognito" },
      { name: "AES" },
      { name: "RSA" },
      { name: "SHA" },
      { name: "GDPR" },
      { name: "SOC 2" },
      { name: "ISO 27001" },
    ],
  },
  {
    name: "CMS & No-Code",
    items: [
      { name: "WordPress" },
      { name: "Strapi" },
      { name: "Bubble" },
      { name: "Webflow" },
      { name: "Microsoft Power Platform" },
      { name: "n8n" },
    ],
  },
  {
    name: "Developer Tools",
    wide: true,
    items: [
      { name: "Git", icon: "/icons/git.svg" },
      { name: "GitHub", icon: "/icons/github_light.svg" },
      { name: "GitLab" },
      { name: "Bitbucket" },
      { name: "VS Code", icon: "/icons/vscode.svg" },
      { name: "Antigravity", icon: "/icons/antigravity.svg" },
      { name: "JetBrains IntelliJ" },
      { name: "PyCharm" },
      { name: "Slack" },
      { name: "Discord" },
      { name: "Teams" },
      { name: "JIRA" },
      { name: "Trello" },
      { name: "ClickUp" },
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    id: "freelance",
    role: "[REPLACE] Freelance Web Developer",
    organization: "[REPLACE] Self-employed",
    period: "[REPLACE] 2024 — Present",
    bullets: [
      "[REPLACE] Built responsive web interfaces for small clients, from first sketch to deployment.",
      "[REPLACE] Worked directly with clients to scope features, review progress, and ship on schedule.",
      "[REPLACE] Used React, Next.js, and Tailwind CSS to keep the codebase consistent and easy to maintain.",
    ],
  },
  {
    id: "student-projects",
    role: "[REPLACE] Student Project Developer",
    organization: "[REPLACE] University / School",
    period: "[REPLACE] 2023 — 2025",
    bullets: [
      "[REPLACE] Collaborated on team projects covering mobile apps, databases, and full-stack web tools.",
      "[REPLACE] Owned features end to end, including data modeling, UI implementation, and testing.",
    ],
  },
];

export const education: EducationEntry = {
  degree: "[REPLACE] BS Computer Science",
  school: "[REPLACE] University / School Name",
  period: "[REPLACE] Expected graduation 20XX",
  summary:
    "[REPLACE] Coursework focused on software engineering, databases, and web development.",
  coursework: [
    "Data Structures",
    "Algorithms",
    "Database Systems",
    "Web Development",
    "Operating Systems",
  ],
};

export const certifications: Certification[] = [
  {
    id: "certificate-one",
    name: "[REPLACE] Certificate Name",
    issuer: "[REPLACE] Issuing Organization",
    date: "[REPLACE] 2026",
    credentialUrl: "#",
  },
  {
    id: "certificate-two",
    name: "[REPLACE] Certificate Name",
    issuer: "[REPLACE] Issuing Organization",
    date: "[REPLACE] 2026",
    credentialUrl: "#",
  },
  {
    id: "certificate-three",
    name: "[REPLACE] Certificate Name",
    issuer: "[REPLACE] Issuing Organization",
    date: "[REPLACE] Expected 2026",
    credentialUrl: "#",
    inProgress: true,
  },
];

export const socialLinks: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    letter: "C",
    href: "https://github.com/your-handle", // [REPLACE]
  },
  {
    id: "x",
    label: "X / Twitter",
    letter: "O",
    href: "https://x.com/[REPLACE]",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    letter: "N",
    href: "https://linkedin.com/in/your-handle", // [REPLACE]
  },
  {
    id: "instagram",
    label: "Instagram",
    letter: "T",
    href: "https://instagram.com/[REPLACE]",
  },
  {
    id: "facebook",
    label: "Facebook",
    letter: "A",
    href: "https://facebook.com/[REPLACE]",
  },
  {
    id: "email",
    label: "Email",
    letter: "C",
    href: "mailto:you@example.com", // [REPLACE]
  },
  {
    id: "discord",
    label: "Discord",
    letter: "T",
    href: "https://discord.com/users/[REPLACE]",
  },
];

export const contactContent: ContactContent = {
  line: "Open to opportunities. Let's talk.",
  description:
    "Have a role, a project, or an idea you want to build? Send a message and I'll get back to you.",
  links: [
    {
      id: "email",
      label: "Email",
      value: profile.email,
      href: "mailto:you@example.com",
    },
    {
      id: "github",
      label: "GitHub",
      value: profile.github,
      href: "https://github.com/[REPLACE]",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: profile.linkedin,
      href: "https://www.linkedin.com/in/[REPLACE]",
    },
  ],
  form: {
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    messageLabel: "Message",
    messagePlaceholder: "Tell me a little about what you have in mind…",
    submit: "Send message",
    submitting: "Sending…",
    success: "Message sent. Thanks for reaching out — I'll get back to you soon.",
    errorFallback:
      "Something went wrong sending your message. Please try again or email me directly.",
    unconfigured:
      "The contact form isn't connected yet. Please email me directly using the link on the left.",
    invalidRequest: "Invalid request. Please refresh the page and try again.",
    validationSummary: "Please fix the highlighted fields and try again.",
    validation: {
      name: "Please enter your name.",
      email: "Please enter a valid email address.",
      message: "Please write at least 10 characters.",
    },
    responseNote: "I usually reply within a couple of days.",
  },
};
