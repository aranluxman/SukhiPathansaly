# Sukhi Wellness Design

The site is a personal, app-first wellness space for Sukhi Pathansaly. It uses a clean white interface, Inter typography, soft card shadows, blush pink accents, rounded controls, subtle hover states, and a CSS-only first-visit Mother's Day welcome overlay.

The app has five routes: Home, Workouts, Meals, Recipes, and Goals. Home summarizes today's localStorage data and links into the trackers. Workouts, Meals, and Goals provide real create, update where requested, delete, and summary flows. Recipes embeds the supplied NotebookLM notebook and includes a direct open link.

Persistence stays fully client-side through `lib/storage.ts`, with separate localStorage keys for workouts, meals, goals, and the welcome experience. The app is deployable as static assets using `next.config.js` with `output: 'export'` and a Cloudflare Pages `wrangler.toml` pointing at `./out`.
