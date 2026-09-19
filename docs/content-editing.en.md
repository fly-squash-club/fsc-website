# Editing the FSC Website — Content Guide

**Who this is for:** anyone at Fly Squash Club who needs to change text, photos,
coaches, programs or news on flysquash.com. **No programming experience needed.**

> **The golden rule:** the website is bilingual. Almost every change must be made
> **twice** — once in the English file and once in the Chinese file. If you only
> change one, that language will show the old text.

---

## 1. How editing works

All website content lives in text files on GitHub. You edit a file, save it
("commit"), and the website rebuilds and goes live automatically in about a minute.

There is no separate login or admin panel — **GitHub is the admin panel.**

**The basic loop, every time:**

1. Go to the repository: `https://github.com/fly-squash-club/fsc-website`
2. Click into the file you want to change (paths are given below).
3. Click the **pencil icon** (✏️ "Edit this file") at the top right.
4. Make your change.
5. Scroll down, write a short note of what you changed, click **Commit changes**.
6. Wait ~1 minute, then refresh flysquash.com.

If something looks wrong, see **Section 7: Undoing a mistake** — nothing you do
here is permanent or unrecoverable.

---

## 2. Changing existing text

All of the site's wording lives in exactly two files:

| Language | File |
|---|---|
| English | `src/locales/en.json` |
| Chinese | `src/locales/zh.json` |

The two files have **identical structure** — the same labels in the same order.
Find the same spot in both and change the text on the right-hand side of the colon.

Example — changing the club's email address. In **both** files, find:

```
"email": "Email",
```

Only edit text **between the quotation marks**. For example, to change a program
description in `en.json`:

```
"personal": {
  "title": "Personal Training",
  "text": "One-on-one coaching tailored to your technique, fitness, and goals."
}
```

You may change `Personal Training` and the `text` sentence. Do **not** change
`"personal"`, `"title"` or `"text"` — those are labels the website uses to find
the content.

### The 4 formatting rules (important)

These files are in a format called JSON, which is strict about punctuation:

1. Every piece of text must be wrapped in **double quotes**: `"like this"`
2. Every line except the last in a block ends with a **comma**
3. Never delete a `{`, `}`, `[` or `]`
4. If your text needs a double quote inside it, use a Chinese quote 「」 or a
   single quote instead — a stray `"` will break the page

If you break one of these rules, the site build fails and **the live site keeps
showing the previous version** (it does not go blank). GitHub will show a red ✗.
See Section 7.

---

## 3. Adding a news article

News articles have two parts: the **card** on the homepage, and the optional
**full article page**.

### 3a. The card text

In `src/locales/en.json` and `zh.json`, find the `"news"` → `"list"` section.
Copy an existing entry and change the values:

```
"tournament": {
  "tag": "Event",
  "title": "2026 Shanghai Women's Spring Open",
  "body": "A short summary that appears on the homepage card."
}
```

The label (`"tournament"`) must be the same in both language files.

### 3b. The card image

Put the image in `public/` (see Section 5) and reference it in
`src/sections/News.vue`, in the list near the top of the file:

```js
const newsItems = [
  { id: 'camp', cover: '/news-camp.jpg', slug: 'camp-2026', extras: [] },
  ...
]
```

- `id` — must match the label used in the language files (`"tournament"` above)
- `cover` — the main image
- `extras` — optional extra photos shown as small thumbnails
- `slug` — **only** if this article has a full detail page (see next)

### 3c. A full article page (optional)

Only some articles need their own page. These live in
`src/content/newsArticles.js`, which has full instructions written at the top
of the file.

In short: copy the whole existing `'camp-2026': { ... }` block, give it a new
name (lowercase, hyphens, no spaces — e.g. `'winter-camp-2027'`), and edit the
`en` and `zh` content inside. Then add that same name as the `slug` in
`News.vue` so the card links to it.

The article body is built from simple blocks, stacked top to bottom:

```js
{ type: 'lead',       text: 'Larger opening paragraph' }
{ type: 'heading',    text: 'A section heading' }
{ type: 'subheading', text: 'A smaller heading' }
{ type: 'paragraph',  text: 'A normal paragraph' }
{ type: 'list',       items: ['First point', 'Second point'] }
{ type: 'image',      src: '/news-photo.jpg', alt: 'Description' }
{ type: 'divider' }
```

---

## 4. Adding or removing a coach

Coaches are shown as poster images. Each coach needs **three** things:

**1. The poster image** — add it to `public/`, named `coach-<name>.jpg`
(see Section 5 for the size rules — posters are large files and must be shrunk).

**2. An entry in `src/sections/Coaches.vue`**, in the list near the top:

```js
{ id: 'ivan', zh: '/coach-ivan.jpg', en: '/coach-ivan.jpg' },
```

- `id` — a short nickname, lowercase, no spaces
- `zh` / `en` — the poster to show in each language. If there's only a Chinese
  poster, point both at the same file (as above). When an English poster is made
  later, change the `en` value to it.
- The order of this list is the order they appear on the site.

**3. Their name and title** in `src/locales/en.json` and `zh.json`, under
`"coaches"` → `"list"`:

```
"ivan": { "name": "Ivan Yuen", "role": "S-Level Consultant" }
```

The `id` and the label here must match exactly.

`"experience"` is optional — if you include it (e.g. `"15+ Years"`) it appears
when a visitor hovers over the photo. Leave it out if you don't have a figure.

**To remove a coach:** delete their line from `Coaches.vue`. You can leave their
name in the language files; it simply won't be shown.

---

## 5. Photos and images

All images live in the folder `public/`. Reference them with a `/` in front,
e.g. a file `public/coach-ali.jpg` is written as `/coach-ali.jpg`.

**To replace a photo without changing any code:** upload a new file with the
**exact same name**. In GitHub: open the `public` folder → **Add file** →
**Upload files**.

### Image size matters — please read

Photos straight from a phone or designer are often 2–5 MB. That makes the site
slow, especially on mobile data. **Before uploading, shrink the image.**

Target: **under 400 KB**, no more than **1200 pixels wide**, saved as **JPG**.

On a Mac, the quickest way is the built-in Preview app:
*Tools → Adjust Size* (set width to 1200), then *File → Export*, choose JPEG and
set quality to about 80%.

A useful rule: if the file is over 1 MB, it's too big.

### Naming

Use lowercase and hyphens, no spaces or Chinese characters in the file name:

- Good: `coach-ali.jpg`, `news-camp-2027.jpg`
- Bad: `教练 Ali.png`, `Coach Ali (final).PNG`

---

## 6. Things you should NOT edit

Leave these alone unless a developer is helping:

- Any file ending in `.css` (visual design)
- `src/Layout.vue`, `router.js`, `main.js`, `meta.js` (site structure)
- The `dist/` folder, if you ever see it (generated automatically)
- Anything in `node_modules/`

---

## 7. Undoing a mistake

**Nothing you do can permanently break the website.** Every change is saved
with a full history, and the live site only updates if the build succeeds.

**If the site build fails** (you'll see a red ✗ next to your change on GitHub):
the live website simply keeps showing the previous version. Fix the mistake —
usually a missing comma or quotation mark — and commit again.

**To undo a change that did go live:**

1. On GitHub, go to the **Commits** list
2. Find your change, click the **`...`** menu → **Revert**
3. Confirm — this creates a new change that undoes it, and the site updates

**To roll the whole site back immediately** (emergency): see the Technical Guide,
*Rollback* section, or contact whoever manages the Vercel account.

---

## 8. Quick reference

| I want to change… | File |
|---|---|
| Any wording, in English | `src/locales/en.json` |
| Any wording, in Chinese | `src/locales/zh.json` |
| Which coaches appear | `src/sections/Coaches.vue` |
| Which news cards appear | `src/sections/News.vue` |
| Full news article pages | `src/content/newsArticles.js` |
| Any photo | upload to `public/` |
| Addresses / phone numbers | both `locales` files, `"contact"` → `"stores"` |
