// ─────────────────────────────────────────────────────────────────────────────
// News article content (detail pages).
//
// HOW TO ADD A NEW ARTICLE
//   1. Copy one whole entry below (from a `'slug': { ... }` line to its closing
//      `},`) and paste it as a new entry.
//   2. Change the slug (the quoted key, e.g. 'camp-2026') to something unique and
//      URL-friendly — lowercase, words separated by hyphens, no spaces.
//   3. Edit `cover`, `date`, and the `en` / `zh` content.
//   4. To link a card in the News section to this page, set the matching item's
//      `slug` in src/sections/News.vue to this slug.
//
// CONTENT BLOCKS — the `blocks` array is the body of the page, rendered top to
// bottom. Each block is one of:
//   { type: 'lead',       text: '...' }            // larger intro paragraph
//   { type: 'heading',    text: '...' }            // section heading
//   { type: 'subheading', text: '...' }            // smaller heading
//   { type: 'paragraph',  text: '...' }            // normal paragraph
//   { type: 'list',       items: ['...', '...'] }  // bulleted list
//   { type: 'image',      src: '/news-...png', alt: '...' }
//   { type: 'divider' }                            // thin horizontal rule
//
// Images must live in the `public/` folder and be referenced with a leading "/".
// ─────────────────────────────────────────────────────────────────────────────

export const newsArticles = {
  'camp-2026': {
    cover: '/news-camp-poster.jpg',
    date: '2026-07-21',

    en: {
      tag: 'Announcement',
      title: '2026 Summer Essential — FSC × Elite Squash Master Camp',
      subtitle: 'Two elite coaches. Small-group intensive training. Two sessions across two branches.',
      blocks: [
        {
          type: 'lead',
          text: 'Following our 2025 partnership, FSC teams up with Elite Squash again for summer 2026. Two of squash’s biggest names return to lead a small-group intensive camp — from fundamentals and advanced technique to match play and competitive mindset, every session is hands-on. Progress this summer at FSC, doubled.'
        },
        { type: 'heading', text: 'Highlights' },
        {
          type: 'list',
          items: [
            'Co-led by ES founder Hadrian Stiff and Asian Games champion Ng Eain Yow',
            'Two sessions across two branches',
            'Exclusive 1-on-1 private lessons available with both coaches'
          ]
        },
        { type: 'heading', text: 'A Dream Coaching Team' },
        { type: 'subheading', text: 'Hadrian Stiff · Elite Squash senior master coach & founder' },
        {
          type: 'paragraph',
          text: 'As Elite Squash’s lead senior coach and founder, Hadrian has spent over 20 years in squash coaching. He understands exactly where players of every level get stuck, brings a mature, rigorous yet adaptable teaching system, and tailors the training rhythm to balance solid fundamentals with real match application.'
        },
        { type: 'subheading', text: 'Ng Eain Yow · FSC signed star player' },
        {
          type: 'paragraph',
          text: 'A leader of Asia’s new squash generation and a core member of the Malaysian national team, Ng Eain Yow began his professional path at age nine. He shares his on-court experience, advanced techniques, and in-match tactical thinking, with targeted one-on-one guidance — a rare chance to train up close with a champion.'
        },
        { type: 'heading', text: 'Two Sessions, Two Branches' },
        {
          type: 'list',
          items: [
            'Session 1 · Hongqiao — July 21–25, 2026',
            'Session 2 · Longyang — July 27–31, 2026'
          ]
        },
        {
          type: 'paragraph',
          text: 'Both sessions share identical content and teaching standards, with small-group training throughout so every player gets the coaches’ attention. Each camp builds progressively, so whether you’re pushing for the next level or after a systematic tune-up, you’ll find a rhythm that fits.'
        },
        { type: 'heading', text: 'Pricing' },
        {
          type: 'list',
          items: [
            'FSC Club member: ¥12,888 / person',
            'Non-member: ¥13,888 / person'
          ]
        },
        { type: 'heading', text: 'Exclusive Perk — 1-on-1 Private Lessons' },
        {
          type: 'list',
          items: [
            'Hadrian Stiff — ¥1,800 / hour · daily 12:00–13:00 and 16:00–17:00 (two slots only)',
            'Ng Eain Yow — ¥1,200 / hour · daily 12:00–13:00 and 16:00–17:00 (two slots only)'
          ]
        },
        { type: 'image', src: '/news-camp-group.jpg', alt: 'FSC squash camp group photo' },
        { type: 'heading', text: 'Registration' },
        {
          type: 'list',
          items: [
            'Who: squash lovers aged 6 and up',
            'Session 1 · Hongqiao — July 21–25, 2026',
            'Session 2 · Longyang — July 27–31, 2026',
            'Daily: 9:30–12:00 (morning) · 13:30–16:00 (afternoon)'
          ]
        },
        { type: 'subheading', text: 'Locations' },
        {
          type: 'list',
          items: [
            'Hongqiao — 288 Zhuguang Road, Qingpu District, Shanghai',
            'Longyang — 2233 Longyang Road, Pudong New Area, Shanghai'
          ]
        },
        { type: 'subheading', text: 'Register' },
        {
          type: 'list',
          items: [
            'Hongqiao — 153 1689 8019',
            'Longyang — 153 1692 7005'
          ]
        }
      ]
    },

    zh: {
      tag: '重磅预告',
      title: '2026年暑期必冲｜FSC × Elite Squash 壁球大师特训营',
      subtitle: '双名师坐镇，小班特训，两期双店随心选。',
      blocks: [
        {
          type: 'lead',
          text: '2026年暑期必冲！壁球大师特训营来袭，双名师坐镇，小班特训。本次延续2025年与 ES 俱乐部再度合作，两位壁球圈实力派大咖坐镇——不管是基础动作打磨、高阶技巧提升，还是实战对抗、赛场心态培养，全都手把手带教，这个暑期在藤飞进步速度直接翻倍！'
        },
        { type: 'heading', text: '核心亮点' },
        {
          type: 'list',
          items: [
            'ES 创始人 Hadrian 与亚运冠军伍恩祐双带教',
            '两期特训班双店可选',
            '更有两位教练专属 1v1 私教'
          ]
        },
        { type: 'heading', text: '神仙教练天团' },
        { type: 'subheading', text: 'Hadrian Stiff｜Elite Squash 资深名教、创始人' },
        {
          type: 'paragraph',
          text: '作为 Elite Squash 的核心资深教练、更是创始人，Hadrian 在壁球教学深耕 20 余年，摸透了不同水平学员的提升痛点。教学体系成熟，风格严谨又不刻板，会针对性定制训练节奏，兼顾基础规范和实战应用，这次全程把控核心教学，质量超有保障。'
        },
        { type: 'subheading', text: 'Ng Eain Yow（伍恩祐）｜藤飞签约明星球员' },
        {
          type: 'paragraph',
          text: '亚洲壁球年轻一代的领军人物伍恩祐，九岁起踏上壁球专业道路，更是马来西亚国家壁球队的核心人物。他会把职业赛场的实战经验、独家高阶技巧、临场战术思维全部分享，还有一对一针对性指导，近距离跟着冠军练球，感受职业选手的训练逻辑。'
        },
        { type: 'heading', text: '两期特训随心选 双店开营' },
        {
          type: 'list',
          items: [
            '第一期｜虹桥店：2026年7月21日 — 7月25日',
            '第二期｜龙阳店：2026年7月27日 — 7月31日'
          ]
        },
        {
          type: 'paragraph',
          text: '两期课程内容、教学标准完全一致，全程小班精细化训练，保证每位学员都能被教练关注到。每期都会循序渐进安排训练，无论想冲进阶还是系统性提升，都能找到适合自己的节奏，突破训练瓶颈。'
        },
        { type: 'heading', text: '会员入营更优惠' },
        {
          type: 'list',
          items: [
            'FSC Club 会员价：12888 元 / 人',
            '非会员价：13888 元 / 人'
          ]
        },
        { type: 'heading', text: '专属福利 · 1v1 私教' },
        {
          type: 'list',
          items: [
            'Hadrian 教练：1800 元 / 小时 · 每天 12:00–13:00 / 16:00–17:00（仅设两节）',
            '伍恩祐 教练：1200 元 / 小时 · 每天 12:00–13:00 / 16:00–17:00（仅设两节）'
          ]
        },
        { type: 'image', src: '/news-camp-group.jpg', alt: '藤飞壁球特训营合影' },
        { type: 'heading', text: '报名须知' },
        {
          type: 'list',
          items: [
            '适合人群：6 岁以上壁球爱好者',
            '第一期虹桥店：2026年7月21日 — 7月25日',
            '第二期龙阳店：2026年7月27日 — 7月31日',
            '每天：上午 9:30–12:00 · 下午 13:30–16:00'
          ]
        },
        { type: 'subheading', text: '地点' },
        {
          type: 'list',
          items: [
            '虹桥店：上海市青浦区诸光路 288 号文化影视科技产业集聚区内',
            '龙阳店：上海市浦东新区龙阳路 2233 号盈丰天地 1F'
          ]
        },
        { type: 'subheading', text: '报名方式' },
        {
          type: 'list',
          items: [
            '虹桥店：153 1689 8019',
            '龙阳店：153 1692 7005'
          ]
        }
      ]
    }
  }
}

export function getArticle(slug) {
  return newsArticles[slug] || null
}
