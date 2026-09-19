<script setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted, computed } from 'vue'

const { t, locale } = useI18n()
const isVisible = ref(false)
const sectionRef = ref(null)

function scrollTo(id) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const titleLines = computed(() => {
  if (locale.value === 'zh') {
    return [
      { text: '藤飞壁球', accent: false },
      { text: '俱乐部', accent: true }
    ]
  }
  return [
    { text: 'FLY', accent: false },
    { text: 'SQUASH', accent: false },
    { text: 'CLUB', accent: true }
  ]
})

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <section id="hero" class="hero" ref="sectionRef">
    <!-- Background layers -->
    <div class="hero-bg">
      <div class="hero-bg-image"></div>
      <div class="hero-bg-overlay"></div>
      <div class="hero-bg-pattern"></div>
    </div>

    <!-- Diagonal accent -->
    <div class="hero-diagonal"></div>

    <!-- Content -->
    <div class="hero-content" :class="{ visible: isVisible }">
      <div class="hero-label">
        <span class="hero-label-line"></span>
        <span class="hero-label-text">Shanghai, China</span>
      </div>

      <h1 class="hero-title">
        <span
          v-for="(line, index) in titleLines"
          :key="index"
          class="hero-title-line"
        >
          <span
            class="hero-title-word"
            :class="{ accent: line.accent }"
            :style="{ '--line-delay': `${0.3 + index * 0.1}s` }"
          >
            {{ line.text }}
          </span>
        </span>
      </h1>

      <p class="hero-subtitle">{{ t('home.hero.subtitle') }}</p>

      <a href="#contact" class="hero-cta" @click.prevent="scrollTo('contact')">
        <span class="hero-cta-text">{{ t('home.hero.cta') }}</span>
        <span class="hero-cta-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </a>
    </div>

    <!-- Scroll indicator -->
    <div class="hero-scroll">
      <span class="hero-scroll-text">Scroll</span>
      <span class="hero-scroll-line"></span>
    </div>

    <!-- Stats overlay -->
    <div class="hero-stats" :class="{ visible: isVisible }">
      <div class="hero-stat">
        <span class="hero-stat-number">3</span>
        <span class="hero-stat-label">{{ t('home.hero.stats.locations') }}</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat-number">10</span>
        <span class="hero-stat-label">{{ t('home.hero.stats.courts') }}</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat-number">15</span>
        <span class="hero-stat-label">{{ t('home.hero.stats.coaches') }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* Background Layers */
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-bg-image {
  position: absolute;
  inset: 0;
  background: url('/fsc_facade.avif') center/cover no-repeat;
  transform: scale(1.1);
  animation: slowZoom 20s ease-in-out infinite alternate;
}

@keyframes slowZoom {
  from { transform: scale(1.1); }
  to { transform: scale(1.15); }
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.75) 100%
  );
}

.hero-bg-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image:
    linear-gradient(var(--color-primary, #BFFF00) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-primary, #BFFF00) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* Diagonal Accent */
.hero-diagonal {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: var(--color-background, #0A0A0A);
  clip-path: polygon(0 100%, 100% 0, 100% 100%);
  z-index: 2;
}

/* Content */
.hero-content {
  position: relative;
  z-index: 3;
  max-width: var(--container-max-width, 1400px);
  margin: 0 auto;
  padding: 0 var(--spacing-md, 2rem);
  padding-top: 100px;
}

/* Label */
.hero-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 1rem);
  margin-bottom: var(--spacing-md, 2rem);
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.6s ease 0.2s;
}

.hero-content.visible .hero-label {
  opacity: 1;
  transform: translateX(0);
}

.hero-label-line {
  width: 40px;
  height: 2px;
  background: var(--color-primary, #BFFF00);
}

.hero-label-text {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-primary, #BFFF00);
}

/* Title */
.hero-title {
  margin-bottom: var(--spacing-md, 2rem);
}

.hero-title-line {
  display: block;
  /* overflow: hidden; */
  padding: 0 0 0.1em 0;
}

.hero-title-word {
  display: block;
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: clamp(4rem, 15vw, 12rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: var(--color-text, #fff);
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-content.visible .hero-title-word {
  opacity: 1;
  transform: translateY(0);
  transition-delay: var(--line-delay, 0.3s);
}

.hero-title-word.accent {
  color: var(--color-primary, #BFFF00);
  -webkit-text-stroke: 2px var(--color-primary, #BFFF00);
  text-shadow: 0 0 60px var(--color-primary-glow, rgba(191, 255, 0, 0.3));
}

/* Subtitle */
.hero-subtitle {
  font-family: var(--font-body, 'DM Sans', sans-serif);
  font-size: 1.25rem;
  color: var(--color-text-light, #B0B0B0);
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: var(--spacing-lg, 3rem);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.7s;
}

@media (max-width: 768px) {
  .hero-subtitle {
    max-width: 400px;
  }
}

.hero-content.visible .hero-subtitle {
  opacity: 1;
  transform: translateY(0);
}

/* CTA Button */
.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm, 1rem);
  background: var(--color-primary, #BFFF00);
  color: var(--color-background, #0A0A0A);
  padding: 1rem 2rem;
  text-decoration: none;
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.9s;
}

.hero-content.visible .hero-cta {
  opacity: 1;
  transform: translateY(0);
}

.hero-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-text, #fff);
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-cta:hover::before {
  transform: translateX(0);
}

.hero-cta-text,
.hero-cta-icon {
  position: relative;
  z-index: 1;
}

.hero-cta-icon {
  display: flex;
  transition: transform 0.3s ease;
}

.hero-cta-icon svg {
  width: 20px;
  height: 20px;
}

.hero-cta:hover .hero-cta-icon {
  transform: translateX(5px);
}

/* Scroll Indicator */
.hero-scroll {
  position: absolute;
  left: var(--spacing-md, 2rem);
  bottom: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm, 1rem);
  z-index: 3;
}

.hero-scroll-text {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-muted, #666);
  writing-mode: vertical-rl;
}

.hero-scroll-line {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, var(--color-primary, #BFFF00), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 1; height: 60px; }
  50% { opacity: 0.5; height: 40px; }
}

/* Stats */
.hero-stats {
  position: absolute;
  right: var(--spacing-md, 2rem);
  bottom: 200px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 2rem);
  z-index: 3;
}

.hero-stat {
  text-align: right;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.6s ease;
}

.hero-stats.visible .hero-stat:nth-child(1) { transition-delay: 1s; opacity: 1; transform: translateX(0); }
.hero-stats.visible .hero-stat:nth-child(2) { transition-delay: 1.1s; opacity: 1; transform: translateX(0); }
.hero-stats.visible .hero-stat:nth-child(3) { transition-delay: 1.2s; opacity: 1; transform: translateX(0); }

.hero-stat-number {
  display: block;
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary, #BFFF00);
  line-height: 1;
}

.hero-stat-label {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted, #666);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    padding-top: 120px;
  }

  .hero-diagonal {
    height: 80px;
  }

  .hero-scroll,
  .hero-stats {
    display: none;
  }

  .hero-title-word {
    font-size: clamp(3rem, 20vw, 6rem);
  }
}
</style>
