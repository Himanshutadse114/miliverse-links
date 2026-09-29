# Miliverse Links 💗

Mili's cute link-in-bio page for Meesho affiliate finds — like Linktree, but ours.

- Public page: `/` — pastel, sweet, mobile-first. Shows product cards with
  **Shop on Meesho 🛍️** (affiliate link) and **Watch reel 🎬** (Instagram reel) buttons.
- Admin panel: `/admin` — password protected. Add / edit / delete / reorder links.

## How it works

Links are stored in **Vercel KV** (Redis), so the admin panel updates the live
site instantly — no redeploy needed.

## Setup (Vercel)

1. Import this repo in Vercel.
2. Create a KV store: Vercel dashboard → Storage → Create → KV, then connect it
   to the project (this adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`).
3. Set environment variable `ADMIN_PASSWORD` to a strong password.
4. Deploy. Visit `/admin` to log in and add links.

## Local dev

```bash
npm install
# create .env.local with KV_REST_API_URL, KV_REST_API_TOKEN, ADMIN_PASSWORD
npm run dev
```

Without KV configured, the public page falls back to built-in seed links so it
still renders.

## Workflow

When a new reel goes up: open `/admin`, tap **+ Add link**, paste the product
name, price, the Meesho affiliate link and the Instagram reel link — done, it's
live on the page immediately.
