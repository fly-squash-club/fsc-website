<script setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted } from 'vue'

const { t } = useI18n()
const isVisible = ref(false)
const sectionRef = ref(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
      }
    },
    { threshold: 0.2 }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <section id="about" class="about" ref="sectionRef">
    <div class="about-bg"></div>

    <div class="container" :class="{ visible: isVisible }">
      <div class="about-header">
        <span class="about-label">
          <span class="about-label-line"></span>
          <span class="about-label-text">{{ t('nav.about') }}</span>
          <span class="about-label-line"></span>
        </span>
        <h2 class="about-title">{{ t('about.title') }}</h2>
      </div>

      <div class="about-content">
        <p class="about-description">{{ t('about.description') }}</p>

        <div class="about-features">
          <div class="feature">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="3" width="16" height="18"/>
                <line x1="4" y1="13" x2="20" y2="13"/>
                <line x1="12" y1="13" x2="12" y2="21"/>
                <rect x="4" y="13" width="4.5" height="4"/>
                <rect x="15.5" y="13" width="4.5" height="4"/>
              </svg>
            </div>
            <h3 class="feature-title">{{ t('about.features.courts.title') }}</h3>
            <p class="feature-text">{{ t('about.features.courts.text') }}</p>
          </div>

          <div class="feature">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="10" cy="11" r="0.8" fill="currentColor"/>
                <circle cx="14" cy="11" r="0.8" fill="currentColor"/>
              </svg>
            </div>
            <h3 class="feature-title">{{ t('about.features.coaching.title') }}</h3>
            <p class="feature-text">{{ t('about.features.coaching.text') }}</p>
          </div>

          <div class="feature">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="7" r="2.5"/>
                <path d="M6 19 C 6 15, 9 13.5, 12 13.5 C 15 13.5, 18 15, 18 19"/>
                <circle cx="5.5" cy="9" r="2"/>
                <path d="M2 18 C 2 14.8, 3.4 13.5, 5 13.5"/>
                <circle cx="18.5" cy="9" r="2"/>
                <path d="M19 13.5 C 20.6 13.5, 22 14.8, 22 18"/>
              </svg>
            </div>
            <h3 class="feature-title">{{ t('about.features.community.title') }}</h3>
            <p class="feature-text">{{ t('about.features.community.text') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative elements -->
    <div class="about-decor about-decor-1"></div>
    <div class="about-decor about-decor-2"></div>
  </section>
</template>

<style scoped>
.about {
  position: relative;
  padding: var(--spacing-2xl, 8rem) var(--spacing-md, 2rem);
  background: var(--color-background, #0A0A0A);
  overflow: hidden;
}

.about-bg {
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
  max-width: 1100px;
  margin: 0 auto;
  z-index: 1;
}

/* Header */
.about-header {
  text-align: center;
  margin-bottom: var(--spacing-xl, 5rem);
}

.about-label {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm, 1rem);
  margin-bottom: var(--spacing-md, 2rem);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.container.visible .about-label {
  opacity: 1;
  transform: translateY(0);
}

.about-label-line {
  width: 30px;
  height: 1px;
  background: var(--color-border-light, #3A3A3A);
}

.about-label-text {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-text-muted, #666);
}

.about-title {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text, #fff);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease 0.1s;
}

.container.visible .about-title {
  opacity: 1;
  transform: translateY(0);
}

/* Content */
.about-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl, 5rem);
}

.about-description {
  font-size: 1.25rem;
  line-height: 1.8;
  color: var(--color-text-light, #B0B0B0);
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease 0.2s;
}

.container.visible .about-description {
  opacity: 1;
  transform: translateY(0);
}

/* Features */
.about-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg, 3rem);
}

.feature {
  text-align: center;
  padding: var(--spacing-lg, 3rem) var(--spacing-md, 2rem);
  background: var(--color-background-elevated, #1A1A1A);
  border: 1px solid var(--color-border, #2A2A2A);
  position: relative;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.6s ease;
}

.container.visible .feature:nth-child(1) { transition-delay: 0.3s; opacity: 1; transform: translateY(0); }
.container.visible .feature:nth-child(2) { transition-delay: 0.4s; opacity: 1; transform: translateY(0); }
.container.visible .feature:nth-child(3) { transition-delay: 0.5s; opacity: 1; transform: translateY(0); }

.feature::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--color-primary, #BFFF00);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.feature:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto var(--spacing-md, 2rem);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-primary, #BFFF00);
}

.feature-icon svg {
  width: 32px;
  height: 32px;
  color: var(--color-primary, #BFFF00);
}

.feature-title {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text, #fff);
  margin-bottom: var(--spacing-sm, 1rem);
}

.feature-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-muted, #666);
}

/* Decorative Elements */
.about-decor {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid var(--color-border, #2A2A2A);
  pointer-events: none;
}

.about-decor-1 {
  top: 10%;
  right: -100px;
  transform: rotate(45deg);
}

.about-decor-2 {
  bottom: 10%;
  left: -100px;
  transform: rotate(45deg);
}

/* Responsive */
@media (max-width: 768px) {
  .about {
    padding: var(--spacing-xl, 5rem) var(--spacing-md, 2rem);
  }

  .about-features {
    grid-template-columns: 1fr;
    gap: var(--spacing-md, 2rem);
  }

  .about-decor {
    display: none;
  }
}
</style>
