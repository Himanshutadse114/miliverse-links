# Miliverse Links 💗

Mili's cute link-in-bio page for Meesho affiliate finds — like Linktree, but ours.

- Public page: `/` — pastel, sweet, mobile-first. Shows product cards with
  **Shop on Meesho 🛍️** (affiliate link) and **Watch reel 🎬** (Instagram reel) buttons.
- Admin panel: `/admin` — add / edit / delete / reorder links.

## How it works (no database, no env vars)

Links live in **`data/links.json`** in this repo — that file is the source of truth.

- The public page paints instantly from the copy bundled at build time, then
  quietly refreshes from the live file on GitHub, so new products appear
  within a few minutes — **no redeploy needed** when links change.
- The `/admin` panel edits `data/links.json` straight through the GitHub API.
  It asks for a **fine-grained personal access token** once (stored only in
  that browser's localStorage) with in-panel instructions to create one:
  repository access limited to this repo, **Contents → Read and write**.

## Workflow

When a new reel goes up: open `/admin`, unlock with the GitHub token, tap
**add link**, paste the product name, price, the Meesho affiliate link and the
Instagram reel link — it goes live on the page within a few minutes.

## Local dev

```bash
npm install
npm run dev
```

## Deploy

Hosted on Vercel, deployed from this repo's `main` branch.
