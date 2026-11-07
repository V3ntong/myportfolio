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
  iconDark?: string;
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
  role: "Lead Developer",
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
      "Where I'm starting from, and what I'm ready to take on next.",
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
    "I'm a lead developer currently studying computer science, and I like building things from idea to working product.",
    "I enjoy the whole process: shaping the idea, designing the interface, wiring up the data, and polishing the details until it feels right. Right now I'm focused on web and mobile apps, with a growing interest in AI, ML, and cloud tools.",
  ],
  lookingForTitle: "Currently looking for",
  lookingFor: [
    "Internships",
    "Junior roles",
    "Freelance work",
    "Web development",
    "Web commissions",
  ],
  quickFacts: [
    {
      label: "Interests",
      value: "Mobile, web dev, web apps, AI and ML",
    },
    {
      label: "Currently learning",
      value: "DevOps, cloud, and cybersecurity",
    },
    {
      label: "Open to",
      value:
        "Internships, junior roles, freelance work, web development, and web commissions",
    },
  ],
};

export const projects: Project[] = [
  {
    id: "kah-ken-sha-ney",
    title: "KAH KEN SHA NEY",
    description:
      "A lost & found mobile app with item reporting, claiming, an admin dashboard, and a chatbot.",
    role: "Lead Developer",
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
    role: "Lead Developer",
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
    role: "Lead Developer",
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
    role: "Lead Developer",
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
      { name: "Vue.js", icon: "/icons/vue.svg" },
      { name: "Angular", icon: "/icons/angular.svg" },
      { name: "Svelte", icon: "/icons/svelte.svg" },
      { name: "Next.js", icon: "/icons/nextjs_icon_dark.svg" },
      { name: "TypeScript", icon: "/icons/typescript.svg" },
      { name: "Tailwind CSS", icon: "/icons/tailwindcss.svg" },
    ],
  },
  {
    name: "Backend",
    items: [
      { name: "Node.js", icon: "/icons/nodejs.svg" },
      { name: "NestJS", icon: "/icons/nestjs.svg" },
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
      {
        name: "MySQL",
        icon: "/icons/mysql-icon-light.svg",
        iconDark: "/icons/mysql-icon-dark.svg",
      },
      { name: "Firestore", icon: "/icons/firebase.svg" },
      { name: "Supabase", icon: "/icons/supabase.svg" },
    ],
  },
  {
    name: "DevOps & Cloud",
    items: [
      {
        name: "AWS",
        icon: "/icons/aws_light.svg",
        iconDark: "/icons/aws_dark.svg",
      },
      { name: "GCP", icon: "/icons/google-cloud.svg" },
      { name: "Azure", icon: "/icons/azure.svg" },
      { name: "GitHub Actions" },
      { name: "Jenkins" },
      { name: "GitLab CI", icon: "/icons/gitlab.svg" },
      { name: "Terraform", icon: "/icons/terraform.svg" },
      { name: "AWS CloudFormation" },
      { name: "Docker", icon: "/icons/docker.svg" },
      { name: "Kubernetes", icon: "/icons/kubernetes.svg" },
      { name: "Prometheus" },
      { name: "Grafana", icon: "/icons/grafana.svg" },
      { name: "Datadog", icon: "/icons/datadog.svg" },
    ],
  },
  {
    name: "AI & Machine Learning",
    items: [
      {
        name: "TensorFlow",
        icon: "/icons/tensorflow-icon-light.svg",
        iconDark: "/icons/tensorflow-icon-dark.svg",
      },
      { name: "PyTorch" },
      { name: "LangChain", icon: "/icons/langchain-logo.svg" },
      { name: "Transformers" },
      {
        name: "OpenAI",
        icon: "/icons/openai.svg",
        iconDark: "/icons/openai_dark.svg",
      },
      {
        name: "Anthropic",
        icon: "/icons/anthropic_black.svg",
        iconDark: "/icons/anthropic_white.svg",
      },
      { name: "Mistral", icon: "/icons/mistral-ai_logo.svg" },
      { name: "Hugging Face", icon: "/icons/hugging_face.svg" },
      { name: "LlamaIndex" },
      { name: "AutoGPT" },
      { name: "Claude Code", icon: "/icons/claude-ai-icon.svg" },
      {
        name: "Codex",
        icon: "/icons/codex_light.svg",
        iconDark: "/icons/codex_dark.svg",
      },
    ],
  },
  {
    name: "Security & Identity",
    items: [
      { name: "AWS IAM" },
      { name: "Azure AD" },
      { name: "Okta" },
      { name: "SAP CDC" },
      { name: "Auth0", icon: "/icons/auth0.svg" },
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
      { name: "WordPress", icon: "/icons/wordpress.svg" },
      { name: "Strapi", icon: "/icons/strapi.svg" },
      { name: "Bubble" },
      { name: "Webflow", icon: "/icons/webflow.svg" },
      { name: "Microsoft Power Platform" },
      { name: "n8n", icon: "/icons/n8n.svg" },
    ],
  },
  {
    name: "Developer Tools",
    wide: true,
    items: [
      { name: "Git", icon: "/icons/git.svg" },
      { name: "GitHub", icon: "/icons/github_light.svg" },
      { name: "GitLab", icon: "/icons/gitlab.svg" },
      { name: "Bitbucket" },
      { name: "VS Code", icon: "/icons/vscode.svg" },
      { name: "Antigravity", icon: "/icons/antigravity.svg" },
      { name: "JetBrains IntelliJ", icon: "/icons/intellijidea.svg" },
      { name: "PyCharm", icon: "/icons/pycharm.svg" },
      { name: "Slack", icon: "/icons/slack.svg" },
      { name: "Discord", icon: "/icons/discord.svg" },
      { name: "Teams", icon: "/icons/microsoft-teams.svg" },
      { name: "JIRA" },
      { name: "Trello", icon: "/icons/trello.svg" },
      { name: "ClickUp", icon: "/icons/clickup.svg" },
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    id: "getting-started",
    role: "Lead Developer",
    organization: "Open to internships and junior roles",
    period: "No formal experience yet",
    bullets: [
      "I don't have work experience at the moment, but I can assure you I'll make it work.",
      "The projects on this site are how I've built my skills — every one taken from first idea to working product.",
      "I learn quickly, communicate clearly, and care about shipping things that actually work.",
    ],
  },
];

export const education: EducationEntry = {
  degree: "BS Computer Science",
  school: "St Mary's College of Tagum Inc.",
  period: "Expected graduation 2027–2028",
  summary:
    "Coursework focused on software engineering, databases, and web development.",
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
    name: "e-Certification: Google Cloud",
    issuer: "Google Cloud",
    date: "2026",
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
