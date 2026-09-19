<script setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted } from 'vue'

const { t } = useI18n()
const isVisible = ref(false)
const sectionRef = ref(null)

const programs = [
  { id: 'personal', image: '/program-personal.jpg' },
  { id: 'group', image: '/program-group.jpg' },
  { id: 'social', image: '/program-social.jpg' },
  { id: 'camp', image: '/program-camp.jpg' }
]

function goToContact() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
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
  <section id="activities" class="activities" ref="sectionRef">
    <div class="activities-bg"></div>

    <div class="container" :class="{ visible: isVisible }">
      <div class="activities-header">
        <span class="activities-label">
          <span class="activities-label-line"></span>
          <span class="activities-label-text">{{ t('activities.eyebrow') }}</span>
          <span class="activities-label-line"></span>
        </span>
        <h2 class="activities-title">{{ t('activities.title') }}</h2>
        <p class="activities-description">{{ t('activities.description') }}</p>
      </div>

      <div class="programs-grid">
        <article
          v-for="(program, index) in programs"
          :key="program.id"
          class="program-card"
          :style="{ '--index': index }"
          role="link"
          tabindex="0"
          :aria-label="`${t(`activities.list.${program.id}.title`)} — ${t('activities.cta')}`"
          @click="goToContact"
          @keydown.enter.prevent="goToContact"
          @keydown.space.prevent="goToContact"
        >
          <div class="program-image">
            <img :src="program.image" :alt="t(`activities.list.${program.id}.title`)" />
            <div class="program-image-overlay"></div>
          </div>
          <div class="program-body">
            <h3 class="program-title">{{ t(`activities.list.${program.id}.title`) }}</h3>
            <p class="program-text">{{ t(`activities.list.${program.id}.text`) }}</p>
            <span class="program-cta">{{ t('activities.cta') }} <span class="program-cta-arrow" aria-hidden="true">→</span></span>
          </div>
          <div class="program-accent"></div>
        </article>
      </div>
    </div>

    <!-- Decorative elements -->
    <div class="activities-decor activities-decor-1"></div>
    <div class="activities-decor activities-decor-2"></div>
  </section>
</template>

<style scoped>
.activities {
  position: relative;
  padding: var(--spacing-2xl, 8rem) var(--spacing-md, 2rem);
  background: var(--color-background, #0A0A0A);
  overflow: hidden;
}

.activities-bg {
  position: absolute;
  inset: 0;
  opacity: 0.02;
  background-image:
    linear-gradient(var(--color-primary, #BFFF00) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-primary, #BFFF00) 1px, transparent 1px);
  background-size: 80px 80px;
}

.container {
  position: relative;
  max-width: var(--container-max-width, 1400px);
  margin: 0 auto;
  z-index: 1;
}

/* Header */
.activities-header {
  text-align: center;
  margin-bottom: var(--spacing-xl, 5rem);
}

.activities-label {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm, 1rem);
  margin-bottom: var(--spacing-md, 2rem);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.container.visible .activities-label {
  opacity: 1;
  transform: translateY(0);
}

.activities-label-line {
  width: 30px;
  height: 1px;
  background: var(--color-border-light, #3A3A3A);
}

.activities-label-text {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-text-muted, #666);
}

.activities-title {
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

.container.visible .activities-title {
  opacity: 1;
  transform: translateY(0);
}

.activities-description {
  font-size: 1.1rem;
  color: var(--color-text-light, #B0B0B0);
  max-width: 600px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.2s;
}

.container.visible .activities-description {
  opacity: 1;
  transform: translateY(0);
}

/* Grid */
.programs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md, 2rem);
}

.program-card {
  position: relative;
  background: var(--color-background-elevated, #1A1A1A);
  border: 1px solid var(--color-border, #2A2A2A);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--index) * 0.1s + 0.3s);
}

.container.visible .program-card {
  opacity: 1;
  transform: translateY(0);
}

.program-card:hover,
.program-card:focus-visible {
  border-color: var(--color-primary, #BFFF00);
}

.program-card:focus-visible {
  outline: 2px solid var(--color-primary, #BFFF00);
  outline-offset: 2px;
}

.program-image {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.program-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.program-card:hover .program-image img {
  transform: scale(1.05);
}

.program-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(10, 10, 10, 0.7));
  pointer-events: none;
}

.program-body {
  padding: var(--spacing-md, 2rem);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm, 1rem);
}

.program-title {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text, #fff);
}

.program-text {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--color-text-light, #B0B0B0);
}

.program-cta {
  margin-top: auto;
  padding-top: var(--spacing-sm, 1rem);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-primary, #BFFF00);
}

.program-cta-arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

.program-card:hover .program-cta-arrow,
.program-card:focus-visible .program-cta-arrow {
  transform: translateX(4px);
}

.program-accent {
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

.program-card:hover .program-accent {
  transform: scaleX(1);
}

/* Decorative Elements */
.activities-decor {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 1px solid var(--color-border, #2A2A2A);
  pointer-events: none;
}

.activities-decor-1 {
  top: 15%;
  right: 5%;
  transform: rotate(45deg);
}

.activities-decor-2 {
  bottom: 15%;
  left: 5%;
  transform: rotate(45deg);
}

/* Responsive */
@media (max-width: 1024px) {
  .programs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .activities {
    padding: var(--spacing-xl, 5rem) var(--spacing-md, 2rem);
  }

  .programs-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }

  .activities-decor {
    display: none;
  }
}
</style>
