# TechLibrary

A server-rendered blog built with **Astro 5**, with authentication handled by **WorkOS AuthKit**. Anyone can browse the post list; reading a full post requires signing in.

## Features

- **Content collections**: posts are Markdown files with a typed frontmatter schema (Zod), including optimized cover images via `astro:assets`.
- **SSR on Netlify**: `output: "server"` with the `@astrojs/netlify` adapter; post pages are resolved per request.
- **WorkOS AuthKit login**: OAuth code flow with an `/api/callback` endpoint that stores a sealed session in an `httpOnly`, `secure`, `SameSite=Lax` cookie.
- **Route protection with middleware**: `src/middleware.ts` guards every `/post/*` route, refreshes expired sessions transparently, and redirects to `/login` when there's no valid session.
- **Session-aware UI**: the home page greets signed-in users by name; logout clears the session cookie and ends the WorkOS session.
- **Tailwind CSS v4** with the Typography plugin for post content.

## Tech stack

| Area | Tools |
|---|---|
| Framework | Astro 5 (SSR), TypeScript |
| Auth | WorkOS AuthKit (`@workos-inc/node`) |
| Styling | Tailwind CSS v4, `@tailwindcss/typography` |
| Deployment | Netlify adapter |

## Project structure

```
src/
├── content/          # Markdown posts + collection schema
├── lib/workos.ts     # WorkOS client and session helpers
├── middleware.ts     # Auth guard for /post/* routes
├── pages/
│   ├── index.astro       # Home (session-aware greeting)
│   ├── blog.astro        # Post list
│   ├── post/[slug].astro # Single post (protected)
│   ├── login.astro       # Redirects to WorkOS AuthKit
│   ├── logout.astro      # Clears session
│   └── api/callback.astro# OAuth callback, sets sealed session cookie
├── components/       # Header, PostList, Post, Prose, ...
└── layouts/          # Base layout
```

## Getting started

**Prerequisites:** Node.js 18.17+ and a [WorkOS](https://workos.com) account with AuthKit enabled. In the WorkOS dashboard, add `http://localhost:4321/api/callback` as a redirect URI.

```bash
git clone https://github.com/aomkhamphaung/techlibrary-astro.git
cd techlibrary-astro
npm install
cp .env.example .env   # then fill in your WorkOS values
npm run dev            # http://localhost:4321
```

### Environment variables

| Variable | Description |
|---|---|
| `WORKOS_API_KEY` | WorkOS secret API key (`sk_...`) |
| `WORKOS_CLIENT_ID` | WorkOS client ID (`client_...`) |
| `WORKOS_COOKIE_PASSWORD` | 32+ character secret used to seal the session cookie |

Generate a cookie password with `openssl rand -base64 32`.

## Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |

## Notes

- Posts in `src/content/posts` are placeholder content.
- The OAuth redirect URI in `src/pages/login.astro` points to localhost; change it to your deployed URL before deploying.
