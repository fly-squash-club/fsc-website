/**
 * Page metadata (<title>, description, Open Graph / social preview tags).
 *
 * The app is a client-rendered SPA, so these are applied imperatively whenever
 * a page renders or the language changes. Static fallbacks for crawlers that
 * don't run JavaScript live in index.html.
 */

const SITE_NAME = {
  en: 'Fly Squash Club',
  zh: '藤飞壁球俱乐部'
}

function upsert(selector, create) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  return el
}

function setMeta(name, content) {
  if (!content) return
  const el = upsert(`meta[name="${name}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('name', name)
    return m
  })
  el.setAttribute('content', content)
}

function setProperty(property, content) {
  if (!content) return
  const el = upsert(`meta[property="${property}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute('property', property)
    return m
  })
  el.setAttribute('content', content)
}

function absoluteUrl(path) {
  if (!path) return ''
  try {
    return new URL(path, window.location.origin).href
  } catch {
    return ''
  }
}

/**
 * @param {object} opts
 * @param {string} opts.title        Page title (site name is appended unless it already matches)
 * @param {string} opts.description  Short summary for search results / link previews
 * @param {string} opts.image        Path to a preview image, e.g. '/news-camp-poster.jpg'
 * @param {string} opts.locale       'en' | 'zh'
 */
export function setPageMeta({ title, description, image, locale = 'en' }) {
  const siteName = SITE_NAME[locale] || SITE_NAME.en
  const fullTitle = !title || title === siteName ? siteName : `${title} | ${siteName}`

  document.title = fullTitle
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'

  setMeta('description', description)
  setProperty('og:title', fullTitle)
  setProperty('og:description', description)
  setProperty('og:type', 'website')
  setProperty('og:site_name', siteName)
  setProperty('og:locale', locale === 'zh' ? 'zh_CN' : 'en_US')
  setProperty('og:url', window.location.href)

  const img = absoluteUrl(image)
  if (img) {
    setProperty('og:image', img)
    setMeta('twitter:image', img)
  }
  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', fullTitle)
  setMeta('twitter:description', description)
}

export { SITE_NAME }
