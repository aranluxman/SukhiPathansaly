# Sukhi Pathansaly Wellness

A black-and-gold personal wellness dashboard built as a Mother's Day gift for Sukhi Pathansaly.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Recharts
- dnd-kit
- localStorage persistence
- Static export for Cloudflare Pages

## Features

- Dashboard summary with daily quote and quick actions
- Workout tracker with a 7-day minutes chart
- Meal and calorie log with adjustable daily goal
- Recipe page with NotebookLM link plus manual recipe saver
- Goals and milestones with edit, complete, and delete flows
- Google-Tasks-inspired lists with drag reorder
- Sleep log with quality tracking and weekly chart
- Appointments calendar for doctor, dentist, gym, and wellness bookings
- Static-safe wellness chat UI

## Run Locally

```bash
npm install
npm run dev
```

## Build For Cloudflare Pages

```bash
npm run build
```

Cloudflare Pages can use:

- Build command: `npm run build`
- Build output directory: `out`

The `wrangler.toml` file is configured with `pages_build_output_dir = "./out"`.

The chat page is intentionally static-safe for Cloudflare Pages export. Live Claude responses should be added with Cloudflare Pages Functions or Workers so the API key stays server-side.
