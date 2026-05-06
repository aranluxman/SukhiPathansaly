# Sukhi Wellness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a polished static Next.js wellness app for Sukhi Pathansaly.

**Architecture:** The App Router hosts one route per section, with client components for localStorage-backed workflows. Shared storage helpers live in `lib/storage.ts`, shared navigation and icons live in `components`, and all styling is Tailwind plus global CSS animations.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, React 18, localStorage, Cloudflare Pages static export.

---

### Task 1: Project Foundation

**Files:**
- Create: `package.json`, `next.config.js`, `wrangler.toml`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css`

- [x] Configure Next.js 14 with `output: 'export'`.
- [x] Configure Tailwind, Inter font, global styles, and Cloudflare Pages output.

### Task 2: Shared App Shell

**Files:**
- Create: `components/Navbar.tsx`, `components/WelcomeModal.tsx`, `components/Icons.tsx`

- [x] Build responsive navigation with active states and mobile hamburger behavior.
- [x] Build first-visit Mother's Day overlay using localStorage and CSS-only floral/heart animation.

### Task 3: Persistence Layer

**Files:**
- Create: `lib/storage.ts`, `lib/quotes.ts`

- [x] Add typed localStorage helpers for workouts, meals, goals, and numeric settings.
- [x] Add daily rotating wellness quotes.

### Task 4: Pages And Workflows

**Files:**
- Create: `app/page.tsx`, `app/workouts/page.tsx`, `app/meals/page.tsx`, `app/recipes/page.tsx`, `app/goals/page.tsx`

- [x] Implement the dashboard summary cards and quick-add actions.
- [x] Implement workout logging, weekly summary, newest-first cards, and delete.
- [x] Implement meal logging, adjustable calorie goal, grouped meal cards, and delete.
- [x] Implement NotebookLM recipe iframe and direct external link.
- [x] Implement goals create, edit, mark complete, delete, sorting, and completed stat.

### Task 5: Verification And Publish

**Files:**
- Generated: `package-lock.json`, static `out/`

- [x] Install dependencies.
- [x] Run build verification.
- [x] Smoke-test app routes locally.
- [x] Push the project to `aranluxman/SukhiPathansaly`.
