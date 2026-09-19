<script setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted } from 'vue'
import Lightbox from '../components/Lightbox.vue'

const { t } = useI18n()
const isVisible = ref(false)
const sectionRef = ref(null)

const stores = ['hongqiao', 'longyang', 'yangpu']

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
  <section id="contact" class="contact" ref="sectionRef">
    <div class="contact-bg"></div>

    <div class="container" :class="{ visible: isVisible }">
      <div class="contact-header">
        <span class="contact-label">
          <span class="contact-label-line"></span>
          <span class="contact-label-text">{{ t('contact.eyebrow') }}</span>
          <span class="contact-label-line"></span>
        </span>
        <h2 class="contact-title">{{ t('contact.title') }}</h2>
        <p class="contact-description">{{ t('contact.description') }}</p>
      </div>

      <div class="contact-grid">
        <!-- Email Card -->
        <div class="contact-card" :style="{ '--index': 0 }">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="card-title">{{ t('contact.email') }}</h3>
          <a href="mailto:fly_squash@163.com" class="card-link">fly_squash@163.com</a>
          <div class="card-accent"></div>
        </div>

        <!-- WeChat Card -->
        <div class="contact-card wechat-card" :style="{ '--index': 1 }">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 14 L 4 11.5 C 2.8 10.3, 2 9, 2 7.5 C 2 4.5, 5 2, 8.5 2 C 12 2, 15 4.5, 15 7.5 C 15 10.5, 12 13, 8.5 13 C 7.5 13, 6.5 12.8, 5.7 12.5 Z"/>
              <circle cx="6.5" cy="7" r="0.7" fill="currentColor"/>
              <circle cx="10.5" cy="7" r="0.7" fill="currentColor"/>
              <path d="M21 21 L 20 19 C 21.2 18, 22 16.8, 22 15 C 22 12.5, 19.5 10.5, 16.5 10.5 C 13.5 10.5, 11 12.5, 11 15 C 11 17.5, 13.5 19.5, 16.5 19.5 C 17.5 19.5, 18.5 19.3, 19.3 19 Z"/>
              <circle cx="15" cy="14.5" r="0.6" fill="currentColor"/>
              <circle cx="18" cy="14.5" r="0.6" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="card-title">{{ t('contact.wechat') }}</h3>
          <div class="qr-frame">
            <Lightbox src="/contact-wechat-qr.png" :alt="t('contact.wechatScan')" :caption="t('contact.wechatScan')" />
          </div>
          <p class="qr-hint">{{ t('contact.wechatScan') }}</p>
          <div class="card-accent"></div>
        </div>

        <!-- Locations Card -->
        <div class="contact-card locations-card" :style="{ '--index': 2 }">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <h3 class="card-title">{{ t('contact.location') }}</h3>
          <ul class="store-list">
            <li v-for="store in stores" :key="store" class="store-item">
              <span class="store-name">{{ t(`contact.stores.${store}.name`) }}</span>
              <span class="store-address">{{ t(`contact.stores.${store}.address`) }}</span>
              <a :href="`tel:${t(`contact.stores.${store}.phone`).replace(/\s/g, '')}`" class="store-phone">{{ t(`contact.stores.${store}.phone`) }}</a>
            </li>
          </ul>
          <div class="card-accent"></div>
        </div>

        <!-- Follow Us Card -->
        <div class="contact-card follow-card" :style="{ '--index': 3 }">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </div>
          <h3 class="card-title">{{ t('contact.socials') }}</h3>
          <div class="follow-frame">
            <Lightbox src="/contact-follow.png" :alt="t('contact.socials')" :caption="t('contact.followHint')" />
          </div>
          <p class="qr-hint">{{ t('contact.followHint') }}</p>
          <div class="card-accent"></div>
        </div>
      </div>
    </div>

    <!-- Decorative element -->
    <div class="contact-decor"></div>
  </section>
</template>

<style scoped>
.contact {
  position: relative;
  padding: var(--spacing-2xl, 8rem) var(--spacing-md, 2rem);
  background: var(--color-background, #0A0A0A);
  overflow: hidden;
}

.contact-bg {
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
.contact-header {
  text-align: center;
  margin-bottom: var(--spacing-xl, 5rem);
}

.contact-label {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm, 1rem);
  margin-bottom: var(--spacing-md, 2rem);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.container.visible .contact-label {
  opacity: 1;
  transform: translateY(0);
}

.contact-label-line {
  width: 30px;
  height: 1px;
  background: var(--color-border-light, #3A3A3A);
}

.contact-label-text {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-text-muted, #666);
}

.contact-title {
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

.container.visible .contact-title {
  opacity: 1;
  transform: translateY(0);
}

.contact-description {
  font-size: 1.1rem;
  color: var(--color-text-light, #B0B0B0);
  max-width: 500px;
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.2s;
}

.container.visible .contact-description {
  opacity: 1;
  transform: translateY(0);
}

/* Grid */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md, 2rem);
  align-items: stretch;
}

/* Card */
.contact-card {
  position: relative;
  background: var(--color-background-elevated, #1A1A1A);
  border: 1px solid var(--color-border, #2A2A2A);
  padding: var(--spacing-lg, 3rem) var(--spacing-md, 2rem);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--index) * 0.1s + 0.3s);
}

.container.visible .contact-card {
  opacity: 1;
  transform: translateY(0);
}

.contact-card:hover {
  border-color: var(--color-primary, #BFFF00);
}

.card-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto var(--spacing-md, 2rem);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-primary, #BFFF00);
}

.card-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-primary, #BFFF00);
}

.card-title {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-primary, #BFFF00);
  margin-bottom: var(--spacing-sm, 1rem);
}

.card-link {
  font-family: var(--font-body, 'DM Sans', sans-serif);
  font-size: 0.95rem;
  color: var(--color-text, #fff);
  text-decoration: none;
  transition: color 0.3s ease;
  word-break: break-all;
}

.card-link:hover {
  color: var(--color-primary, #BFFF00);
}

.card-accent {
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

.contact-card:hover .card-accent {
  transform: scaleX(1);
}

/* WeChat / Follow QR */
.qr-frame,
.follow-frame {
  width: 140px;
  margin: 0 auto var(--spacing-sm, 1rem);
  padding: 8px;
  background: #fff;
  border: 1px solid var(--color-border, #2A2A2A);
}

.qr-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted, #666);
  line-height: 1.5;
}

/* Locations */
.store-list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm, 1rem);
  text-align: left;
}

.store-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: var(--spacing-sm, 1rem) 0;
  border-top: 1px solid var(--color-border, #2A2A2A);
}

.store-item:first-child {
  border-top: none;
  padding-top: 0;
}

.store-name {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text, #fff);
}

.store-address {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--color-text-light, #B0B0B0);
}

.store-phone {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  color: var(--color-primary, #BFFF00);
  text-decoration: none;
  transition: color 0.3s ease;
}

.store-phone:hover {
  color: var(--color-text, #fff);
}

/* Decorative Element */
.contact-decor {
  position: absolute;
  bottom: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  border: 1px solid var(--color-border, #2A2A2A);
  transform: rotate(45deg);
  pointer-events: none;
}

/* Responsive */
@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  /* Phone/email are the primary conversion actions — keep them easy to tap */
  .card-link,
  .store-phone {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
}

@media (max-width: 640px) {
  .contact {
    padding: var(--spacing-xl, 5rem) var(--spacing-md, 2rem);
  }

  .contact-grid {
    grid-template-columns: 1fr;
    max-width: 380px;
    margin: 0 auto;
  }

  .contact-decor {
    display: none;
  }
}
</style>
