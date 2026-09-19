# Fly Squash Club — Official Website / 藤飞壁球俱乐部官网

The website for Fly Squash Club (FSC), Shanghai — live at **[flysquash.com](https://flysquash.com)**.

Bilingual (English / 中文), built with Vue 3 + Vite, hosted on Vercel.

---

## Documentation / 文档

| Guide | 文档 | For whom / 适用对象 |
|---|---|---|
| [Editing content](docs/content-editing.en.md) | [内容编辑指南](docs/content-editing.zh.md) | Club staff updating text, photos, coaches, news — no coding needed<br>俱乐部同事更新文字、图片、教练、新闻，无需编程基础 |
| [Handover checklist](docs/handover.en.md) | [交接清单](docs/handover.zh.md) | Transferring the GitHub, Vercel and GoDaddy accounts<br>GitHub、Vercel、GoDaddy 三个账号的交接 |
| [Technical guide](docs/technical.en.md) | [技术文档](docs/technical.zh.md) | Developers maintaining or extending the site<br>负责维护与开发的技术人员 |

**Start here / 从这里开始:**
- Updating the website day to day → **[内容编辑指南](docs/content-editing.zh.md)** / [Editing content](docs/content-editing.en.md)
- Taking ownership of the accounts → **[交接清单](docs/handover.zh.md)** / [Handover checklist](docs/handover.en.md)

---

## Quick start (developers)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

Deploy to production:

```bash
./deploy.sh      # requires `vercel login`
```

> **Note:** pushing to `main` deploys automatically via Vercel. `deploy.sh`
> remains available as a manual fallback, but it publishes the local working
> tree rather than what is committed — see the
> [Technical guide](docs/technical.en.md#deployment).

---

## Repository layout

```
src/           Application code — see docs/technical.en.md
public/        Images, served at the site root
docs/          Documentation (English + 中文)
index.html     Page shell
vercel.json    Hosting + build configuration
```

## Content at a glance

| To change… | Edit |
|---|---|
| Any wording (EN) | `src/locales/en.json` |
| Any wording (ZH) | `src/locales/zh.json` |
| Coaches | `src/sections/Coaches.vue` |
| News cards | `src/sections/News.vue` |
| News article pages | `src/content/newsArticles.js` |
| Photos | `public/` |
