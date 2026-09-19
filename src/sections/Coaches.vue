<script setup>
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Lightbox from '../components/Lightbox.vue'

const { t, te, locale } = useI18n()
const isVisible = ref(false)
const sectionRef = ref(null)
const lightboxRef = ref(null)

// Each coach lists its poster per locale. The original three have dedicated
// English posters; the newer coaches only have Chinese posters so far, so they
// reuse the same image for both locales until English versions are produced.
const coaches = [
  { id: 'jack',    zh: '/coach-jack.png',    en: '/coach-jack-en.jpg' },
  { id: 'lim',     zh: '/coach-lim.png',     en: '/coach-lim-en.jpg' },
  { id: 'celine',  zh: '/coach-celine.png',  en: '/coach-celine-en.jpg' },
  { id: 'ivan',    zh: '/coach-ivan.jpg',    en: '/coach-ivan.jpg' },
  { id: 'xiaoxia', zh: '/coach-xiaoxia.jpg', en: '/coach-xiaoxia.jpg' },
  { id: 'gigi',    zh: '/coach-gigi.jpg',    en: '/coach-gigi.jpg' },
  { id: 'blackhu', zh: '/coach-blackhu.jpg', en: '/coach-blackhu.jpg' },
  { id: 'ali',     zh: '/coach-ali.jpg',     en: '/coach-ali.jpg' }
]

function imageFor(coach) {
  return locale.value === 'en' ? coach.en : coach.zh
}

const slides = computed(() =>
  coaches.map(c => ({
    src: imageFor(c),
    alt: t(`coaches.list.${c.id}.name`),
    caption: `${t(`coaches.list.${c.id}.name`)} · ${t(`coaches.list.${c.id}.role`)}`
  }))
)

function openLightbox(index) {
  lightboxRef.value?.open(index)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
      }
    },
    { threshold: 0.15 }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <section id="coaches" class="coaches" ref="sectionRef">
    <!-- Diagonal top -->
    <div class="coaches-diagonal-top"></div>

    <div class="container" :class="{ visible: isVisible }">
      <div class="coaches-header">
        <span class="coaches-label">
          <span class="coaches-label-line"></span>
          <span class="coaches-label-text">{{ t('nav.coaches') }}</span>
        </span>
        <h2 class="coaches-title">{{ t('coaches.title') }}</h2>
        <p class="coaches-description">{{ t('coaches.description') }}</p>
      </div>

      <div class="coaches-grid">
        <div
          v-for="(coach, index) in coaches"
          :key="coach.id"
          class="coach-card"
          :style="{ '--index': index }"
        >
          <button
            type="button"
            class="coach-image-wrapper"
            :aria-label="t(`coaches.list.${coach.id}.name`)"
            @click="openLightbox(index)"
          >
            <div class="coach-image">
              <img :src="imageFor(coach)" :alt="t(`coaches.list.${coach.id}.name`)" />
            </div>
            <div v-if="te(`coaches.list.${coach.id}.experience`)" class="coach-overlay">
              <span class="coach-experience">{{ t(`coaches.list.${coach.id}.experience`) }}</span>
            </div>
          </button>

          <div class="coach-info">
            <span class="coach-role">{{ t(`coaches.list.${coach.id}.role`) }}</span>
            <h3 class="coach-name">{{ t(`coaches.list.${coach.id}.name`) }}</h3>
          </div>

          <div class="coach-accent"></div>
        </div>
      </div>
    </div>

    <!-- Diagonal bottom -->
    <div class="coaches-diagonal-bottom"></div>

    <Lightbox ref="lightboxRef" triggerless :items="slides" />
  </section>
</template>

<style scoped>
.coaches {
  position: relative;
  padding: var(--spacing-2xl, 8rem) var(--spacing-md, 2rem);
  background: var(--color-background-elevated, #1A1A1A);
  overflow: hidden;
}

/* Diagonal cuts */
.coaches-diagonal-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: var(--color-background, #0A0A0A);
  clip-path: polygon(0 0, 100% 0, 100% 0, 0 100%);
}

.coaches-diagonal-bottom {
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
.coaches-header {
  margin-bottom: var(--spacing-xl, 5rem);
}

.coaches-label {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm, 1rem);
  margin-bottom: var(--spacing-md, 2rem);
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.6s ease;
}

.container.visible .coaches-label {
  opacity: 1;
  transform: translateX(0);
}

.coaches-label-line {
  width: 40px;
  height: 2px;
  background: var(--color-primary, #BFFF00);
}

.coaches-label-text {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-primary, #BFFF00);
}

.coaches-title {
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

.container.visible .coaches-title {
  opacity: 1;
  transform: translateY(0);
}

.coaches-description {
  font-size: 1.1rem;
  color: var(--color-text-light, #B0B0B0);
  max-width: 500px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.2s;
}

.container.visible .coaches-description {
  opacity: 1;
  transform: translateY(0);
}

/* Grid */
.coaches-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md, 2rem);
}

/* Card */
.coach-card {
  position: relative;
  background: var(--color-background, #0A0A0A);
  overflow: hidden;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--index) * 0.1s + 0.3s);
}

.container.visible .coach-card {
  opacity: 1;
  transform: translateY(0);
}

.coach-image-wrapper {
  position: relative;
  aspect-ratio: 5/6;
  overflow: hidden;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: zoom-in;
  display: block;
  width: 100%;
}

.coach-image {
  width: 100%;
  height: 100%;
}

.coach-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.coach-card:hover .coach-image img {
  transform: scale(1.05);
}

.coach-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  padding: var(--spacing-md, 2rem);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.coach-card:hover .coach-overlay {
  opacity: 1;
}

.coach-experience {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--color-primary, #BFFF00);
}

.coach-info {
  padding: var(--spacing-md, 2rem);
  border-top: 1px solid var(--color-border, #2A2A2A);
}

.coach-role {
  display: block;
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-primary, #BFFF00);
  margin-bottom: var(--spacing-xs, 0.5rem);
}

.coach-name {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text, #fff);
  transition: color 0.3s ease;
}

.coach-card:hover .coach-name {
  color: var(--color-primary, #BFFF00);
}

.coach-accent {
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

.coach-card:hover .coach-accent {
  transform: scaleX(1);
}

/* Responsive */
@media (max-width: 1024px) {
  .coaches-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .coaches {
    padding: var(--spacing-xl, 5rem) var(--spacing-md, 2rem);
  }

  .coaches-diagonal-top,
  .coaches-diagonal-bottom {
    height: 50px;
  }

  .coaches-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>
