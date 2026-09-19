<script setup>
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Lightbox from '../components/Lightbox.vue'

const { t } = useI18n()
const isVisible = ref(false)
const sectionRef = ref(null)
const lightboxRef = ref(null)

const players = [
  { id: 'ng', image: '/player-ng.jpg', rank: '01' },
  { id: 'hu', image: '/player-hu.jpg', rank: '02' },
  { id: 'kenneth', image: '/player-kenneth.png', rank: '03' },
  { id: 'angela', image: '/player-angela.png', rank: '04' }
]

const slides = computed(() =>
  players.map(p => ({
    src: p.image,
    alt: t(`players.list.${p.id}.name`),
    caption: `${t(`players.list.${p.id}.name`)} · ${t(`players.list.${p.id}.title`)}`
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
  <section id="players" class="players" ref="sectionRef">
    <div class="container" :class="{ visible: isVisible }">
      <div class="players-header">
        <span class="players-label">
          <span class="players-label-line"></span>
          <span class="players-label-text">{{ t('nav.players') }}</span>
          <span class="players-label-line"></span>
        </span>
        <h2 class="players-title">{{ t('players.title') }}</h2>
        <p class="players-description">{{ t('players.description') }}</p>
      </div>

      <div class="players-grid">
        <div
          v-for="(player, index) in players"
          :key="player.id"
          class="player-card"
          :style="{ '--index': index }"
        >
          <div class="player-rank">{{ player.rank }}</div>
          <button
            type="button"
            class="player-avatar"
            :aria-label="t(`players.list.${player.id}.name`)"
            @click="openLightbox(index)"
          >
            <img :src="player.image" :alt="t(`players.list.${player.id}.name`)" />
          </button>
          <div class="player-info">
            <h3 class="player-name">{{ t(`players.list.${player.id}.name`) }}</h3>
            <span class="player-achievement">{{ t(`players.list.${player.id}.title`) }}</span>
          </div>
          <div class="player-border"></div>
        </div>
      </div>
    </div>

    <Lightbox ref="lightboxRef" triggerless :items="slides" />
  </section>
</template>

<style scoped>
.players {
  position: relative;
  padding: var(--spacing-2xl, 8rem) var(--spacing-md, 2rem);
  background: var(--color-background, #0A0A0A);
  overflow: hidden;
}

.container {
  position: relative;
  max-width: var(--container-max-width, 1400px);
  margin: 0 auto;
  z-index: 1;
}

/* Header */
.players-header {
  text-align: center;
  margin-bottom: var(--spacing-xl, 5rem);
}

.players-label {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm, 1rem);
  margin-bottom: var(--spacing-md, 2rem);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.container.visible .players-label {
  opacity: 1;
  transform: translateY(0);
}

.players-label-line {
  width: 30px;
  height: 1px;
  background: var(--color-border-light, #3A3A3A);
}

.players-label-text {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-text-muted, #666);
}

.players-title {
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

.container.visible .players-title {
  opacity: 1;
  transform: translateY(0);
}

.players-description {
  font-size: 1.1rem;
  color: var(--color-text-light, #B0B0B0);
  max-width: 500px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.2s;
}

.container.visible .players-description {
  opacity: 1;
  transform: translateY(0);
}

/* Grid */
.players-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md, 2rem);
}

/* Card */
.player-card {
  position: relative;
  background: var(--color-background-elevated, #1A1A1A);
  border: 1px solid var(--color-border, #2A2A2A);
  padding: var(--spacing-lg, 3rem) var(--spacing-md, 2rem);
  text-align: center;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--index) * 0.1s + 0.3s);
}

.container.visible .player-card {
  opacity: 1;
  transform: translateY(0);
}

.player-card:hover {
  border-color: var(--color-primary, #BFFF00);
}

.player-rank {
  position: absolute;
  top: var(--spacing-sm, 1rem);
  right: var(--spacing-sm, 1rem);
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-border, #2A2A2A);
  line-height: 1;
  transition: color 0.3s ease;
}

.player-card:hover .player-rank {
  color: var(--color-primary-glow, rgba(191, 255, 0, 0.3));
}

.player-avatar {
  width: 140px;
  height: 140px;
  margin: 0 auto var(--spacing-md, 2rem);
  border: 2px solid var(--color-primary, #BFFF00);
  position: relative;
  overflow: hidden;
  padding: 0;
  background: transparent;
  cursor: zoom-in;
  display: block;
}

.player-avatar::before {
  content: '';
  position: absolute;
  inset: -8px;
  border: 1px solid var(--color-border, #2A2A2A);
  pointer-events: none;
  z-index: 1;
}

.player-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.player-card:hover .player-avatar img {
  transform: scale(1.05);
}

.player-name {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text, #fff);
  margin-bottom: var(--spacing-xs, 0.5rem);
}

.player-achievement {
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted, #666);
}

.player-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-primary, #BFFF00);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.player-card:hover .player-border {
  transform: scaleX(1);
}

/* Responsive */
@media (max-width: 1024px) {
  .players-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .players {
    padding: var(--spacing-xl, 5rem) var(--spacing-md, 2rem);
  }

  .players-grid {
    grid-template-columns: 1fr;
    max-width: 320px;
    margin: 0 auto;
  }
}
</style>
