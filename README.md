# Sukhi Pathansaly Wellness

A personal wellness dashboard built as a Mother's Day gift for Sukhi Pathansaly.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- localStorage persistence
- Static export for Cloudflare Pages

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
