# FSC Website — Technical Guide

For a developer taking over the site. Assumes working knowledge of Git and Node.

---

## Stack

| | |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Build tool | Vite 7 |
| Routing | vue-router 4 (history mode) |
| i18n | vue-i18n 11 (`en` / `zh`, English is the default) |
| Hosting | Vercel (project `fsc-dynamic`) |
| DNS | GoDaddy |
| Dependencies | 3 runtime packages. No CSS framework, no state library, no backend. |

The site is a **static, client-rendered SPA**. There is no server, no database
and no API. Everything is built to static files and served from Vercel's CDN.

---

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # serve the built output
```

Node 18+ recommended.

---

## Project layout

```
├── index.html              Page shell + static meta/OG tags
├── vercel.json             Build config + SPA rewrite
├── deploy.sh               Manual production deploy (see below)
├── public/                 Images, served at the site root
└── src/
    ├── main.js             App bootstrap, i18n route guard
    ├── router.js           Routes + scroll behaviour
    ├── App.vue             Shell → Layout + <router-view>
    ├── Layout.vue          Header, nav, mobile menu, footer
    ├── Home.vue            The one-page site: stacks the sections
    ├── NewsArticle.vue     News detail page template
    ├── meta.js             <title>, description, Open Graph tags
    ├── theme.css           Design tokens (colours, spacing, fonts)
    ├── shared/styles/      Global base CSS
    ├── components/
    │   └── Lightbox.vue    Image viewer (keyboard + touch swipe)
    ├── content/
    │   └── newsArticles.js Article content, keyed by slug
    ├── locales/
    │   ├── en.json         ALL English copy
    │   └── zh.json         ALL Chinese copy
    └── sections/           One file per homepage section
        ├── Hero.vue  About.vue  Coaches.vue  Players.vue
        └── Activities.vue  News.vue  Contact.vue
```

### Content vs. code

All user-facing text is in `src/locales/*.json`. Components reference it with
`t('some.key')` — they contain no hard-coded copy. Structural content (which
coaches exist, which news cards appear) is a plain array at the top of the
relevant section component. This is deliberate: non-technical staff edit JSON
and simple arrays, never templates or CSS. See `docs/content-editing.en.md`.

---

## Routing

| Path | Page |
|---|---|
| `/` | Redirects to `/en` |
| `/:locale` | Homepage (`/en`, `/zh`) |
| `/:locale/news/:slug` | News article (`/en/news/camp-2026`) |

A `beforeEach` guard validates the locale and redirects unknown values to `/en`.
A second guard in `main.js` syncs `i18n.global.locale` to the URL, so the URL is
the single source of truth for language.

Because this is an SPA with history-mode routing, `vercel.json` rewrites all
paths to `/index.html` so deep links and refreshes work.

---

## Deployment

### Automatic: push to `main`

The Vercel project is connected to this repository, so every push to `main`
builds and deploys to production, and every pull request gets its own preview
URL. The application lives at the repository root, so Vercel needs no Root
Directory setting.

### Manual CLI deploy (fallback)

```bash
./deploy.sh
```

This runs `vercel --prod`, uploading **the local working tree — not git**.
Uncommitted changes will ship. 

If you see "The specified token is not valid", run `vercel login` first.

### How the Git connection is configured

Connecting the Vercel project to the GitHub repo (Vercel → Project → Settings →
Git) makes every push to `main` deploy automatically, and every pull request get
a preview URL. This also lets non-technical staff publish by editing files in
GitHub's web UI, with no laptop or CLI involved. `deploy.sh` still works afterwards as a manual fallback.

### Rollback

```bash
vercel ls --prod                              # list recent production deploys
vercel alias set <deployment-url> flysquash.com   # promote an older one
```

Or, in the Vercel dashboard: Deployments → pick a previous one → **Promote to
Production**. Rollback takes effect in seconds.

---

## Domains and DNS

- `flysquash.com` (apex) and `www.flysquash.com` (308 → apex)
- Also aliased at `fsc-dynamic.opez.com`
- DNS is at **GoDaddy**; domain config is in the Vercel dashboard, not in this repo

| Record | Value |
|---|---|
| `A` @ | `76.76.21.21` |
| `CNAME` www | `cname.vercel-dns.com` |

TLS certificates are issued and renewed automatically by Vercel.

---

## Conventions and gotchas

**Images.** Everything in `public/` ships as-is — there is no image pipeline.
Compress before committing: target <400 KB, ≤1200px wide, JPG for photos. The
coach posters were originally 1.8–2.2 MB PNGs; converting them to 1200px JPEGs
cut ~7.7 MB to ~1.4 MB.

**Scoped CSS and slots.** Sections are passed into `Layout.vue` through
`<slot />`, so they carry *Home.vue's* scope ID, not Layout's. A `section {...}`
rule inside Layout's `<style scoped>` will silently never match. Rules that must
apply to sections belong in `src/shared/styles/base.css` — this is why
`scroll-margin-top` lives there.

**Section reveal animations.** Each section uses an `IntersectionObserver` to add
a `.visible` class, which triggers CSS transitions. Cards stagger via
`transition-delay: calc(var(--index) * 0.1s)`.

**Bilingual parity.** `en.json` and `zh.json` must keep identical key structures.
A key present in only one file falls back to English (`fallbackLocale: 'en'`).

**Coach posters are images, not markup.** Each coach's biography is baked into
their poster image. Adding a coach means adding a picture, not writing HTML.

**SEO limits.** Meta and Open Graph tags are set at runtime by `meta.js`.
Crawlers that don't execute JavaScript see only the static fallbacks in
`index.html`. If per-article link previews become important (e.g. for WeChat
sharing), the site would need prerendering or SSR — a meaningful change.

---

## Known limitations / future work

- No automated tests and no CI checks beyond the Vercel build
- No analytics installed
- No sitemap.xml or robots.txt
- Images are committed to the repo rather than served from a CDN/image service
- Per-article social previews need prerendering (see above)
- Mainland-China access to GitHub/Vercel can be slow; worth verifying from
  Shanghai before relying on a GitHub-based editing workflow
