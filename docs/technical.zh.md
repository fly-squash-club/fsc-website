# 藤飞壁球俱乐部官网 — 技术文档

面向接手本项目的开发人员，默认读者熟悉 Git 与 Node。

---

## 技术栈

| | |
|---|---|
| 框架 | Vue 3（组合式 API，`<script setup>`） |
| 构建工具 | Vite 7 |
| 路由 | vue-router 4（history 模式） |
| 国际化 | vue-i18n 11（`en` / `zh`，默认英文） |
| 托管 | Vercel（项目名 `fsc-dynamic`） |
| DNS | GoDaddy |
| 依赖 | 仅 3 个运行时依赖。无 CSS 框架、无状态管理库、无后端。 |

本站是**纯静态、客户端渲染的单页应用（SPA）**，没有服务器、数据库或 API，
构建产物为静态文件，由 Vercel 的 CDN 分发。

---

## 本地运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物输出到 dist/
npm run preview  # 预览构建产物
```

建议使用 Node 18 及以上版本。

---

## 目录结构

```
├── index.html              页面外壳 + 静态 meta / OG 标签
├── vercel.json             构建配置 + SPA 重写规则
├── deploy.sh               手动发布到生产环境
├── public/                 图片，按网站根路径提供访问
└── src/
    ├── main.js             应用入口、i18n 路由守卫
    ├── router.js           路由与滚动行为
    ├── App.vue             外壳 → Layout + <router-view>
    ├── Layout.vue          页头、导航、移动端菜单、页脚
    ├── Home.vue            单页首页：按顺序拼装各区块
    ├── NewsArticle.vue     新闻详情页模板
    ├── meta.js             <title>、描述、Open Graph 标签
    ├── theme.css           设计变量（颜色、间距、字体）
    ├── shared/styles/      全局基础样式
    ├── components/
    │   └── Lightbox.vue    图片查看器（支持键盘与触摸滑动）
    ├── content/
    │   └── newsArticles.js 新闻详情内容，按 slug 索引
    ├── locales/
    │   ├── en.json         全部英文文案
    │   └── zh.json         全部中文文案
    └── sections/           首页各区块，每个区块一个文件
        ├── Hero.vue  About.vue  Coaches.vue  Players.vue
        └── Activities.vue  News.vue  Contact.vue
```

### 内容与代码分离

所有面向用户的文字都存放在 `src/locales/*.json`，组件通过 `t('some.key')` 引用，
内部不写死任何文案。结构性内容（有哪些教练、有哪些新闻卡片）是相关区块组件顶部的
一个普通数组。这样设计是刻意为之：非技术同事只需编辑 JSON 和简单数组，
不必接触模板或 CSS。详见 `docs/content-editing.zh.md`。

---

## 路由

| 路径 | 页面 |
|---|---|
| `/` | 重定向至 `/en` |
| `/:locale` | 首页（`/en`、`/zh`） |
| `/:locale/news/:slug` | 新闻详情页（`/en/news/camp-2026`） |

`beforeEach` 守卫校验语言参数，非法值重定向到 `/en`。`main.js` 中的第二个守卫
将 `i18n.global.locale` 与 URL 同步，因此 **URL 是语言的唯一来源**。

由于采用 history 模式的单页应用，`vercel.json` 将所有路径重写到 `/index.html`，
以保证深层链接和刷新页面都能正常工作。

---

## 发布部署

### 自动发布：推送到 `main`

Vercel 项目已与本仓库连接，推送到 `main` 分支即自动构建并发布到生产环境，
每个 PR 也会生成独立的预览地址。网站代码位于仓库根目录，因此 Vercel
无需设置 Root Directory。

### 命令行手动发布（备用方案）

```bash
./deploy.sh
```

该脚本执行 `vercel --prod`，上传的是**本地工作目录，而非 git 内容**——
未提交的改动也会一并发布。

若提示 token 失效，先执行 `vercel login`。

### Git 连接的配置说明

在 Vercel 项目中连接 GitHub 仓库（Vercel → Project → Settings → Git）后，
每次推送到 `main` 分支都会自动发布，每个 PR 还会生成预览地址。
这也让非技术同事可以直接在 GitHub 网页上修改并发布，无需电脑环境或命令行。
连接后 `deploy.sh` 仍可作为手动备用方案。

### 回滚

```bash
vercel ls --prod                                   # 列出最近的生产部署
vercel alias set <deployment-url> flysquash.com    # 将旧版本切为线上版本
```

也可在 Vercel 控制台操作：Deployments → 选择历史版本 → **Promote to Production**。
回滚可在数秒内生效。

---

## 域名与 DNS

- `flysquash.com`（主域名）与 `www.flysquash.com`（308 跳转至主域名）
- 另有别名 `fsc-dynamic.opez.com`
- DNS 在 **GoDaddy**；域名绑定配置在 Vercel 控制台，不在代码仓库中

| 记录类型 | 主机记录 | 记录值 |
|---|---|---|
| `A` | @ | `76.76.21.21` |
| `CNAME` | www | `cname.vercel-dns.com` |

TLS 证书由 Vercel 自动签发和续期。

---

## 约定与注意事项

**图片。** `public/` 中的文件原样发布，**没有**图片处理流程。提交前请先压缩：
目标小于 400 KB、宽度不超过 1200px、照片使用 JPG。教练海报原为 1.8–2.2 MB 的 PNG，
转换为 1200px 的 JPG 后，总体积从约 7.7 MB 降至约 1.4 MB。

**scoped 样式与插槽。** 各区块是通过 `<slot />` 传入 `Layout.vue` 的，因此它们携带的是
*Home.vue* 的 scope ID，而非 Layout 的。写在 Layout `<style scoped>` 中的
`section {...}` 规则会**静默失效**。需要作用于区块的样式应放在
`src/shared/styles/base.css` —— `scroll-margin-top` 就是因此放在那里的。

**滚动定位。** 页内导航使用 `scrollIntoView()`，会遵循 CSS 的 `scroll-margin-top`；
而路由驱动的滚动使用 `window.scrollTo`，**不遵循**该属性，因此 `router.js` 中另有
`HEADER_OFFSET` 常量。修改页头高度时，两处都要同步更新。

**区块进场动画。** 每个区块使用 `IntersectionObserver` 添加 `.visible` 类来触发
CSS 过渡；卡片通过 `transition-delay: calc(var(--index) * 0.1s)` 实现依次出现。

**双语一致性。** `en.json` 与 `zh.json` 的键结构必须保持完全一致。
只存在于其中一个文件的键会回退到英文（`fallbackLocale: 'en'`）。

**教练简介是图片，不是网页文字。** 每位教练的介绍都直接做在海报图片里，
新增教练是加一张图，而不是写 HTML。

**SEO 限制。** meta 与 Open Graph 标签由 `meta.js` 在运行时写入。
不执行 JavaScript 的爬虫只能读到 `index.html` 中的静态兜底内容。
若将来需要每条新闻都有独立的分享预览（例如微信分享），则需引入预渲染或 SSR，
这属于较大的改动。

---

## 已知限制与后续可做的事

- 没有自动化测试，除 Vercel 构建外没有 CI 检查
- 未接入任何数据统计
- 没有 sitemap.xml 与 robots.txt
- 图片直接提交在仓库中，未使用 CDN 或图片服务
- 单条新闻的社交分享预览需要预渲染（见上）
- 中国大陆访问 GitHub / Vercel 可能较慢，若要依赖 GitHub 网页编辑流程，
  建议先在上海实测确认
