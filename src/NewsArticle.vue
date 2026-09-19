<script setup>
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getArticle } from './content/newsArticles.js'
import { setPageMeta } from './meta.js'
import { requestSectionScroll } from './router.js'

const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n()

const slug = computed(() => route.params.slug)
const article = computed(() => getArticle(slug.value))
const content = computed(() => {
  const a = article.value
  if (!a) return null
  return a[locale.value] || a.en
})

const homeLink = computed(() => `/${locale.value}`)

// Go back to the home page and land on a section. Not an anchor and not history
// state: the site scrolls to sections directly, so either would linger — in the
// URL, or on the history entry — and misdirect later navigation (see router.js).
function goToSection(id) {
  requestSectionScroll(id)
  router.push({ path: homeLink.value })
}

// Title / link-preview tags for this article, kept in sync with the language.
watchEffect(() => {
  const c = content.value
  if (!c) return
  setPageMeta({
    title: c.title,
    description: c.subtitle || '',
    image: article.value?.cover,
    locale: locale.value
  })
})

// No scrolling here on purpose: router.js handles scroll position for every
// navigation. Doing it from onMounted as well fights the router (it applies its
// own scroll after mount) and, inheriting `scroll-behavior: smooth`, animated
// the page all the way up from the news section before the article appeared.

// ── Entrance animations ─────────────────────────────────────────────────────
// Same idiom as the home page sections: elements start offset and transparent,
// then transition in — the masthead on arrival, body blocks as they scroll into
// view. A language switch rebuilds this component from scratch (see App.vue),
// so switching languages replays exactly this, with no special-casing.
const isVisible = ref(false)
const bodyRef = ref(null)
const footRef = ref(null)
let observer = null

function revealBlocksInView() {
  const blocks = [...(bodyRef.value?.children ?? []), footRef.value].filter(Boolean)
  blocks.forEach((block) => {
    const rect = block.getBoundingClientRect()
    const onScreen = rect.top < window.innerHeight && rect.bottom > 0
    // Reveal what the reader can already see directly rather than relying on
    // the observer to report it, then leave the rest to the observer.
    if (onScreen) block.classList.add('in-view')
    else observer?.observe(block)
  })
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('in-view')
        observer.unobserve(entry.target)
      })
    },
    // threshold 0 with a bottom margin, rather than a ratio: a block taller than
    // the viewport can never reach a 10%-visible threshold and would stay
    // invisible forever.
    { threshold: 0, rootMargin: '0px 0px -8% 0px' }
  )

  // Let the start state paint before animating in. A timer rather than
  // requestAnimationFrame, which never fires in a background tab and would
  // leave the article invisible there.
  const timer = window.setTimeout(() => {
    isVisible.value = true
    revealBlocksInView()
  }, 30)

  onUnmounted(() => {
    window.clearTimeout(timer)
    observer?.disconnect()
  })
})
</script>

<template>
  <article class="article">
    <div class="article-bg"></div>

    <div v-if="content" class="article-inner" :class="{ visible: isVisible }">
      <a :href="homeLink" class="article-back" @click.prevent="goToSection('news')">
        <span aria-hidden="true">←</span> {{ t('nav.news') }}
      </a>

      <header class="article-head">
        <span v-if="content.tag" class="article-tag">{{ content.tag }}</span>
        <h1 class="article-title">{{ content.title }}</h1>
        <p v-if="content.subtitle" class="article-subtitle">{{ content.subtitle }}</p>
      </header>

      <div v-if="article.cover" class="article-cover">
        <img :src="article.cover" :alt="content.title" />
      </div>

      <div class="article-body" ref="bodyRef">
        <template v-for="(block, i) in content.blocks" :key="i">
          <p v-if="block.type === 'lead'" class="block-lead">{{ block.text }}</p>
          <h2 v-else-if="block.type === 'heading'" class="block-heading">{{ block.text }}</h2>
          <h3 v-else-if="block.type === 'subheading'" class="block-subheading">{{ block.text }}</h3>
          <p v-else-if="block.type === 'paragraph'" class="block-paragraph">{{ block.text }}</p>
          <ul v-else-if="block.type === 'list'" class="block-list">
            <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
          </ul>
          <figure v-else-if="block.type === 'image'" class="block-image">
            <img :src="block.src" :alt="block.alt || ''" />
          </figure>
          <hr v-else-if="block.type === 'divider'" class="block-divider" />
        </template>
      </div>

      <div class="article-foot" ref="footRef">
        <a :href="homeLink" class="article-cta" @click.prevent="goToSection('contact')">
          {{ t('home.hero.cta') }} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>

    <div v-else class="article-missing">
      <h1>404</h1>
      <router-link :to="homeLink" class="article-cta">{{ t('nav.home') }}</router-link>
    </div>
  </article>
</template>

<style scoped>
/* ── Entrance animations ────────────────────────────────────────────────────
   Mirrors the home page sections: 0.6s, the same cubic-bezier, and a short
   stagger. The masthead animates on arrival; body blocks animate as they
   scroll into view (the `in-view` class is added by an IntersectionObserver). */
.article-back,
.article-tag,
.article-title,
.article-subtitle,
.article-cover {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.article-inner.visible .article-back,
.article-inner.visible .article-tag,
.article-inner.visible .article-title,
.article-inner.visible .article-subtitle,
.article-inner.visible .article-cover {
  opacity: 1;
  transform: translateY(0);
}

.article-inner.visible .article-back { transition-delay: 0.05s; }
.article-inner.visible .article-tag { transition-delay: 0.12s; }
.article-inner.visible .article-title { transition-delay: 0.18s; }
.article-inner.visible .article-subtitle { transition-delay: 0.26s; }
.article-inner.visible .article-cover { transition-delay: 0.34s; }

.article-body > *,
.article-foot {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

.article-body > .in-view,
.article-foot.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* If JavaScript never runs, the article must still be readable. */
@media (prefers-reduced-motion: reduce) {
  .article-back,
  .article-tag,
  .article-title,
  .article-subtitle,
  .article-cover,
  .article-body > *,
  .article-foot {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.article {
  position: relative;
  min-height: 100vh;
  background: var(--color-background, #0A0A0A);
  padding: calc(var(--spacing-2xl, 8rem) + 2rem) var(--spacing-md, 2rem) var(--spacing-2xl, 8rem);
  overflow: hidden;
}

.article-bg {
  position: absolute;
  inset: 0;
  opacity: 0.02;
  background-image:
    linear-gradient(var(--color-primary, #BFFF00) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-primary, #BFFF00) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
}

.article-inner {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
  z-index: 1;
}

/* Back link */
.article-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-light, #B0B0B0);
  text-decoration: none;
  transition: color 0.2s ease;
}

.article-back:hover {
  color: var(--color-primary, #BFFF00);
}

/* Header */
.article-head {
  margin: var(--spacing-lg, 3rem) 0 var(--spacing-md, 2rem);
}

.article-tag {
  display: inline-block;
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-background, #0A0A0A);
  background: var(--color-primary, #BFFF00);
  padding: 0.3rem 0.75rem;
  margin-bottom: var(--spacing-md, 2rem);
}

.article-title {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-text, #fff);
}

.article-subtitle {
  margin-top: var(--spacing-sm, 1rem);
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--color-text-light, #B0B0B0);
}

/* Cover */
.article-cover {
  margin: var(--spacing-md, 2rem) 0;
  border: 1px solid var(--color-border, #2A2A2A);
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: auto;
  display: block;
}

/* Body blocks */
.article-body {
  margin-top: var(--spacing-lg, 3rem);
}

.block-lead {
  font-size: 1.2rem;
  line-height: 1.7;
  color: var(--color-text, #fff);
  margin-bottom: var(--spacing-lg, 3rem);
}

.block-heading {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--color-text, #fff);
  margin: var(--spacing-lg, 3rem) 0 var(--spacing-sm, 1rem);
  padding-left: 1rem;
  border-left: 3px solid var(--color-primary, #BFFF00);
}

.block-subheading {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary, #BFFF00);
  margin: var(--spacing-md, 2rem) 0 var(--spacing-xs, 0.5rem);
}

.block-paragraph {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--color-text-light, #B0B0B0);
  margin-bottom: var(--spacing-md, 2rem);
}

.block-list {
  list-style: none;
  margin: 0 0 var(--spacing-md, 2rem);
  padding: 0;
}

.block-list li {
  position: relative;
  padding-left: 1.5rem;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text-light, #B0B0B0);
  margin-bottom: 0.6rem;
}

.block-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 6px;
  height: 6px;
  background: var(--color-primary, #BFFF00);
}

.block-image {
  margin: var(--spacing-lg, 3rem) 0;
  border: 1px solid var(--color-border, #2A2A2A);
  overflow: hidden;
}

.block-image img {
  width: 100%;
  height: auto;
  display: block;
}

.block-divider {
  border: none;
  border-top: 1px solid var(--color-border, #2A2A2A);
  margin: var(--spacing-lg, 3rem) 0;
}

/* Footer CTA */
.article-foot {
  margin-top: var(--spacing-xl, 5rem);
  padding-top: var(--spacing-lg, 3rem);
  border-top: 1px solid var(--color-border, #2A2A2A);
}

.article-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-background, #0A0A0A);
  background: var(--color-primary, #BFFF00);
  padding: 0.9rem 1.6rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.article-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(191, 255, 0, 0.25);
}

/* Missing */
.article-missing {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg, 3rem);
}

.article-missing h1 {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 5rem;
  color: var(--color-text, #fff);
}

@media (max-width: 640px) {
  .article {
    padding-top: calc(var(--spacing-xl, 5rem) + 2rem);
  }
}
</style>
