<script setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted } from 'vue'
import Lightbox from '../components/Lightbox.vue'

const { t, locale } = useI18n()
const isVisible = ref(false)
const sectionRef = ref(null)

const THUMBNAIL_CAP = 4

const newsItems = [
  {
    id: 'camp',
    cover: '/news-camp.jpg',
    slug: 'camp-2026',
    extras: []
  },
  {
    id: 'magazine',
    cover: '/news-magazine.jpg',
    extras: [
      '/news-magazine-2.png',
      '/news-magazine-3.jpg',
      '/news-magazine-4.jpg',
      '/news-magazine-5.jpg'
    ]
  },
  {
    id: 'tournament',
    cover: '/news-tournament.jpg',
    extras: [
      '/news-tournament-2.jpg',
      '/news-tournament-3.jpg',
      '/news-tournament-4.jpg',
      '/news-tournament-5.jpg',
      '/news-tournament-6.jpg'
    ]
  }
]

function slidesFor(item) {
  const title = t(`news.list.${item.id}.title`)
  return [item.cover, ...item.extras].map((src, i) => ({
    src,
    alt: title,
    caption: title
  }))
}

// Compute visible thumbnails (up to 3 + 1 overflow OR up to 4 if no overflow).
function visibleThumbnails(item) {
  const extras = item.extras
  if (extras.length === 0) return []
  if (extras.length <= THUMBNAIL_CAP) {
    return extras.map((src, i) => ({ src, index: i + 1, overflowCount: 0 }))
  }
  // More extras than cap → show (cap - 1) thumbnails + 1 with overflow badge
  const visible = extras.slice(0, THUMBNAIL_CAP - 1).map((src, i) => ({
    src,
    index: i + 1,
    overflowCount: 0
  }))
  visible.push({
    src: extras[THUMBNAIL_CAP - 1],
    index: THUMBNAIL_CAP,
    overflowCount: extras.length - (THUMBNAIL_CAP - 1)
  })
  return visible
}

// One lightbox ref per news item, populated by template ref-fn.
const lightboxRefs = {}
function setLightboxRef(id) {
  return (el) => {
    if (el) lightboxRefs[id] = el
  }
}

function openLightbox(itemId, startIndex) {
  const lb = lightboxRefs[itemId]
  if (lb) lb.open(startIndex)
}

function articleLink(item) {
  return `/${locale.value}/news/${item.slug}`
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) isVisible.value = true
    },
    { threshold: 0.15 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <section id="news" class="news" ref="sectionRef">
    <div class="news-diagonal-top"></div>

    <div class="container" :class="{ visible: isVisible }">
      <div class="news-header">
        <span class="news-label">
          <span class="news-label-line"></span>
          <span class="news-label-text">{{ t('news.eyebrow') }}</span>
        </span>
        <h2 class="news-title">{{ t('news.title') }}</h2>
        <p class="news-description">{{ t('news.description') }}</p>
      </div>

      <div class="news-grid">
        <article
          v-for="(item, index) in newsItems"
          :key="item.id"
          class="news-card"
          :style="{ '--index': index }"
        >
          <router-link
            v-if="item.slug"
            :to="articleLink(item)"
            class="news-image"
            :aria-label="t(`news.list.${item.id}.title`)"
          >
            <img :src="item.cover" :alt="t(`news.list.${item.id}.title`)" />
          </router-link>
          <button
            v-else
            type="button"
            class="news-image"
            :aria-label="t(`news.list.${item.id}.title`)"
            @click="openLightbox(item.id, 0)"
          >
            <img :src="item.cover" :alt="t(`news.list.${item.id}.title`)" />
          </button>

          <div class="news-body">
            <span class="news-tag">{{ t(`news.list.${item.id}.tag`) }}</span>
            <h3 class="news-card-title">{{ t(`news.list.${item.id}.title`) }}</h3>
            <p class="news-card-text">{{ t(`news.list.${item.id}.body`) }}</p>
            <router-link
              v-if="item.slug"
              :to="articleLink(item)"
              class="news-readmore"
            >
              {{ t('news.readMore') }} <span aria-hidden="true">→</span>
            </router-link>
          </div>

          <div v-if="item.extras.length" class="news-thumbs">
            <button
              v-for="thumb in visibleThumbnails(item)"
              :key="thumb.src"
              type="button"
              class="news-thumb"
              :class="{ 'has-overflow': thumb.overflowCount > 0 }"
              :aria-label="thumb.overflowCount > 0
                ? `View ${thumb.overflowCount + 1} more images`
                : `View image ${thumb.index + 1}`"
              @click="openLightbox(item.id, thumb.index)"
            >
              <img :src="thumb.src" alt="" />
              <span v-if="thumb.overflowCount > 0" class="news-thumb-overflow">+{{ thumb.overflowCount }}</span>
            </button>
          </div>

          <div class="news-accent"></div>

          <Lightbox
            :ref="setLightboxRef(item.id)"
            triggerless
            :items="slidesFor(item)"
          />
        </article>
      </div>
    </div>

    <div class="news-diagonal-bottom"></div>
  </section>
</template>

<style scoped>
.news {
  position: relative;
  padding: var(--spacing-2xl, 8rem) var(--spacing-md, 2rem);
  background: var(--color-background-elevated, #1A1A1A);
  overflow: hidden;
}

.news-diagonal-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: var(--color-background, #0A0A0A);
  clip-path: polygon(0 0, 100% 0, 100% 0, 0 100%);
}

.news-diagonal-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: var(--color-background, #0A0A0A);
  clip-path: polygon(0 100%, 100% 0, 100% 100%);
}

.container {
  position: relative;
  max-width: var(--container-max-width, 1400px);
  margin: 0 auto;
  z-index: 1;
}

/* Header */
.news-header {
  margin-bottom: var(--spacing-xl, 5rem);
}

.news-label {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm, 1rem);
  margin-bottom: var(--spacing-md, 2rem);
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.6s ease;
}

.container.visible .news-label {
  opacity: 1;
  transform: translateX(0);
}

.news-label-line {
  width: 40px;
  height: 2px;
  background: var(--color-primary, #BFFF00);
}

.news-label-text {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-primary, #BFFF00);
}

.news-title {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text, #fff);
  margin-bottom: var(--spacing-sm, 1rem);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease 0.1s;
}

.container.visible .news-title {
  opacity: 1;
  transform: translateY(0);
}

.news-description {
  font-size: 1.1rem;
  color: var(--color-text-light, #B0B0B0);
  max-width: 600px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.2s;
}

.container.visible .news-description {
  opacity: 1;
  transform: translateY(0);
}

/* Grid */
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md, 2rem);
  align-items: stretch;
}

.news-card {
  position: relative;
  background: var(--color-background, #0A0A0A);
  border: 1px solid var(--color-border, #2A2A2A);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--index) * 0.1s + 0.3s);
}

.container.visible .news-card {
  opacity: 1;
  transform: translateY(0);
}

.news-card:hover {
  border-color: var(--color-primary, #BFFF00);
}

/* Cover image as button */
.news-image {
  width: 100%;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: zoom-in;
  aspect-ratio: 16/10;
  overflow: hidden;
  display: block;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.news-body {
  padding: var(--spacing-md, 2rem);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm, 1rem);
}

.news-tag {
  display: inline-block;
  align-self: flex-start;
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-background, #0A0A0A);
  background: var(--color-primary, #BFFF00);
  padding: 0.3rem 0.75rem;
}

.news-card-title {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text, #fff);
}

.news-card-text {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text-light, #B0B0B0);
}

a.news-image {
  cursor: pointer;
}

.news-readmore {
  margin-top: auto;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-primary, #BFFF00);
  text-decoration: none;
  transition: gap 0.2s ease;
}

.news-readmore:hover {
  gap: 0.7rem;
}

/* Thumbnail strip — bottom of card */
.news-thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  padding: 0 var(--spacing-md, 2rem) var(--spacing-md, 2rem);
}

.news-thumb {
  position: relative;
  padding: 0;
  margin: 0;
  background: transparent;
  border: 1px solid var(--color-border, #2A2A2A);
  cursor: zoom-in;
  aspect-ratio: 1;
  overflow: hidden;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.news-thumb:hover {
  border-color: var(--color-primary, #BFFF00);
  transform: scale(1.05);
}

.news-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s ease;
}

.news-thumb.has-overflow img {
  opacity: 0.45;
}

.news-thumb-overflow {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-primary, #BFFF00);
  background: rgba(10, 10, 10, 0.5);
  pointer-events: none;
}

.news-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--color-primary, #BFFF00);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.news-card:hover .news-accent {
  transform: scaleX(1);
}

/* Responsive */
@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
  }
}

@media (max-width: 640px) {
  .news {
    padding: var(--spacing-xl, 5rem) var(--spacing-md, 2rem);
  }

  /* Comfortable touch target on phones */
  .news-readmore {
    padding: 0.6rem 0;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }

  .news-diagonal-top,
  .news-diagonal-bottom {
    height: 50px;
  }
}
</style>
