# Melvin Maquilan — Developer Portfolio

A personal portfolio website showcasing the work, skills, and background of **Melvin Maquilan**, a full-stack developer studying Computer Science. Built with Next.js, it features a distinctive halftone portrait hero, an animated sidebar navigation, light/dark theme switching with a circular reveal transition, and a clean, accessible, responsive layout.

> **Status:** In active development. Several content sections are still placeholders pending real content. See [`DEVELOPMENT_STATUS.md`](./DEVELOPMENT_STATUS.md) for the full status, roadmap, and open tasks.

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16.4.3 (App Router) |
| UI | React 19.3.0, TypeScript 5 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/turbopack`), CSS custom properties / design tokens |
| Animation | GSAP 3.15 + `@gsap/react`, Motion 14.6 |
| Theming | `next-themes` 0.4.6 (light/dark, system-aware) |
| Utilities | `cn` 0.5.0 |
| Linting | ESLint 9 + `eslint-config-next` 16.4.3 |
| Build tooling | Turbopack (Next.js default) |

## Project Structure

```
portfolio/
├── myportfolio/                # Next.js application
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── SidebarNav.tsx
│   │   ├── LineSidebar.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── ScrollBlur.tsx
│   │   ├── HalftoneReveal.tsx
│   │   ├── SplitText.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── backgrounds/
│   │   ├── sections/
│   │   └── ui/
│   ├── public/images/owner/
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── eslint.config.mjs
│   └── package.json
├── Developer Portfolio Blueprint.docx
├── README.md
└── DEVELOPMENT_STATUS.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or yarn / pnpm / bun)

### Install

```bash
cd myportfolio
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The page auto-updates as you edit.

### Production build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Features

### Implemented

- Responsive single-page layout with section navigation (desktop sidebar + mobile drawer)
- Active-section tracking via `IntersectionObserver`
- Smooth scrolling with reduced-motion support
- Light/dark theme switching with View Transitions API circular reveal (fallback for unsupported browsers)
- WebGL halftone portrait reveal on the hero
- Scroll-driven bottom blur
- GSAP split-text and animated content entrance animations
- Design tokens for colors, spacing, typography (light + dark)

### Planned (see Development Status)

- Real content for About, Projects, Tech Stack, Experience, Education, Certifications, Contact
- Project cards / case studies with GitHub and live links
- Résumé download
- SEO metadata & Open Graph
- Contact form (optional)
- Accessibility & performance audit
- Deployment to Vercel

## Accessibility & UX Notes

- Honors `prefers-reduced-motion` (disables animations, instant theme swap)
- Keyboard navigation: `Escape` closes mobile nav
- Semantic sections with `aria-labelledby`
- Theme toggle has accessible label and title

## Assumptions & Notes

- The portfolio is **static-first** (no backend, database, or auth) per the project blueprint.
- Content is currently placeholder in most sections; do not treat placeholder text as final.
- `myportfolio/AGENTS.md` contains Next.js 16 agent rules — read before editing framework code (breaking changes vs. older Next.js).

## Deployment

Optimized for Vercel. Run `npm run build` to verify, then deploy the `myportfolio` directory (or connect the repo to Vercel).

## License

Private project. All rights reserved.
