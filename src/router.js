import { createRouter, createWebHistory } from 'vue-router'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './i18n'
import Home from './Home.vue'
import NewsArticle from './NewsArticle.vue'

const routes = [
  {
    path: '/',
    redirect: `/${DEFAULT_LOCALE}`
  },
  {
    path: '/:locale/news/:slug',
    name: 'news-article',
    component: NewsArticle
  },
  {
    path: '/:locale',
    name: 'home',
    component: Home
  }
]

/**
 * Vertical offset that keeps a scrolled-to section clear of the fixed header.
 * Router-driven scrolling uses window.scrollTo, which ignores the CSS
 * `scroll-margin-top` in shared/styles/base.css — so the value has to be
 * applied here too. Keep the two in sync.
 */
const HEADER_OFFSET = 90

/**
 * A section to scroll to on the *next* navigation — set by the nav links and
 * the article's back link when the target isn't on the current page.
 *
 * Deliberately a module variable rather than history state: it is a one-shot
 * instruction, and anything written into a history entry sticks to it. Storing
 * it there meant that after arriving from an article, every later refresh of
 * the home page jumped back to whichever section you had originally asked for,
 * no matter where you had scrolled since.
 */
let pendingSection = null

export function requestSectionScroll(id) {
  pendingSection = id
}

/**
 * Resolve once `selector` exists in the DOM, or with null if it never shows up.
 * Needed because a route change renders its component after navigation is
 * confirmed, so anchor targets aren't available immediately.
 */
function waitForElement(selector, timeout = 1000) {
  return new Promise((resolve) => {
    const start = Date.now()
    const tick = () => {
      const el = document.querySelector(selector)
      if (el) return resolve(el)
      if (Date.now() - start > timeout) return resolve(null)
      // setTimeout, not requestAnimationFrame: rAF never fires in a background
      // tab, which would leave this promise — and the navigation awaiting it —
      // pending forever if the page is opened in a new tab.
      window.setTimeout(tick, 50)
    }
    tick()
  })
}

/**
 * Resolve once the document is tall enough to reach `top`, or after `timeout`.
 * Restoring a scroll position on a fresh load can otherwise land short, because
 * images below the fold haven't loaded yet and the page is still growing.
 */
function waitForScrollHeight(top, timeout = 1000) {
  return new Promise((resolve) => {
    const start = Date.now()
    const tick = () => {
      const reachable =
        document.documentElement.scrollHeight >= top + window.innerHeight
      if (reachable || Date.now() - start > timeout) return resolve()
      window.setTimeout(tick, 50)
    }
    tick()
  })
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  async scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // Someone arrived with an anchor in the URL (an external or bookmarked
      // deep link such as /en#news). The target may not exist yet — the page
      // component has to mount first — so wait for it before scrolling. The
      // jump is deliberately instant: this is a page arrival, and smooth-
      // scrolling several thousand pixels on load is slow and disorienting.
      const el = await waitForElement(to.hash)
      return el
        ? { el: to.hash, top: HEADER_OFFSET, behavior: 'instant' }
        : { top: 0, behavior: 'instant' }
    }
    // A section was requested before this navigation (see requestSectionScroll).
    // Consume it: it applies to this navigation only. Handled here rather than
    // in the page component because vue-router applies its own scroll after the
    // component mounts, overriding anything done from onMounted.
    const requested = pendingSection
    pendingSection = null
    if (requested) {
      const el = await waitForElement(`#${requested}`)
      if (el) return { el: `#${requested}`, top: HEADER_OFFSET, behavior: 'instant' }
    }
    // Only the language changed on the same page: keep the reader exactly where
    // they are. Sending them back to the top would lose their place — halfway
    // through an article, most painfully.
    if (to.name === from.name && to.params.locale !== from.params.locale) {
      return false
    }
    // Reload, or browser back/forward: put the reader back where they were,
    // without animating there.
    if (savedPosition) {
      await waitForScrollHeight(savedPosition.top)
      return { ...savedPosition, behavior: 'instant' }
    }
    // Any other page arrival (e.g. opening a news article) starts at the top.
    // Instant, not smooth: `scroll-behavior: smooth` in base.css would otherwise
    // animate the whole way up from wherever the reader was, which reads as the
    // page scrolling itself before the new one appears.
    return { top: 0, behavior: 'instant' }
  }
})

// Guard to validate locale
router.beforeEach((to, from, next) => {
  const locale = to.params.locale

  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    return next(`/${DEFAULT_LOCALE}`)
  }

  next()
})

/**
 * Keep the scroll position recorded on the current history entry up to date.
 *
 * vue-router turns off the browser's own scroll restoration and manages
 * scrolling itself, but it only records a position when you navigate. That left
 * `history.state.scroll` frozen at wherever the page was first entered — so
 * reloading after scrolling, or after clicking through the nav, put the reader
 * back at the top. Saving it as they scroll means a refresh returns them to
 * where they actually are.
 */
if (typeof window !== 'undefined') {
  let pending = null

  const saveScrollPosition = () => {
    const state = window.history.state
    if (!state) return
    window.history.replaceState(
      { ...state, scroll: { left: window.scrollX, top: window.scrollY } },
      ''
    )
  }

  window.addEventListener(
    'scroll',
    () => {
      if (pending) return
      pending = window.setTimeout(() => {
        pending = null
        saveScrollPosition()
      }, 250)
    },
    { passive: true }
  )

  // pagehide rather than beforeunload: it also fires on mobile browsers, where
  // beforeunload is unreliable.
  window.addEventListener('pagehide', saveScrollPosition)
}

export default router
