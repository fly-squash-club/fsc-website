<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { SUPPORTED_LOCALES } from './i18n'
import { requestSectionScroll } from './router.js'
import Lightbox from './components/Lightbox.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const currentLocale = computed(() => route.params.locale || 'en')
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const wechatLightboxRef = ref(null)

const navLinks = [
  { id: 'about', label: 'nav.about' },
  { id: 'coaches', label: 'nav.coaches' },
  { id: 'players', label: 'nav.players' },
  { id: 'activities', label: 'nav.activities' },
  { id: 'news', label: 'nav.news' },
  { id: 'contact', label: 'nav.contact' }
]

const stores = [
  { id: 'hongqiao', phone: '15316898019' },
  { id: 'longyang', phone: '15316927005' },
  { id: 'yangpu', phone: '18916334089' }
]

function openWechatLightbox() {
  wechatLightboxRef.value?.open(0)
}

const localeLabels = {
  en: 'EN',
  zh: '中文'
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function switchLocale(newLocale) {
  if (newLocale === currentLocale.value) return
  // Stay on whatever page we're on (e.g. a news article) and just swap the
  // locale segment — previously this always jumped back to the home page.
  // Deliberately drops any #hash: the site scrolls to sections without using
  // anchors, so a leftover one would keep yanking the reader back to it.
  router.push({
    name: route.name || 'home',
    params: { ...route.params, locale: newLocale },
    query: route.query
  })
}

function scrollTo(id) {
  isMobileMenuOpen.value = false

  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    return
  }

  // The section isn't on this page — we're reading a news article. Go back to
  // the home page and let the router scroll to the section once it has
  // rendered. Neither a #hash nor history state, so nothing sticks to the URL
  // or the history entry afterwards (see router.js).
  requestSectionScroll(id)
  router.push({ name: 'home', params: { locale: currentLocale.value } })
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <div class="layout">
    <!-- Header -->
    <header class="header" :class="{ scrolled: isScrolled }">
      <div class="header-content">
        <a href="#hero" @click.prevent="scrollTo('hero')" class="logo">
          <img src="/fsc_logo_mark_tbg.png" alt="Fly Squash Club" />
        </a>

        <nav class="nav">
          <a
            v-for="(link, index) in navLinks"
            :key="link.id"
            :href="`#${link.id}`"
            class="nav-link"
            :style="{ '--delay': `${index * 0.05}s` }"
            @click.prevent="scrollTo(link.id)"
          >
            <span class="nav-link-text">{{ t(link.label) }}</span>
            <span class="nav-link-line"></span>
          </a>
        </nav>

        <div class="header-actions">
          <div class="locale-switcher">
            <button
              v-for="loc in SUPPORTED_LOCALES"
              :key="loc"
              class="locale-btn"
              :class="{ active: currentLocale === loc }"
              @click="switchLocale(loc)"
            >
              {{ localeLabels[loc] }}
            </button>
          </div>

          <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{ open: isMobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Animated accent line -->
      <div class="header-accent"></div>
    </header>

    <!-- Mobile Navigation Overlay -->
    <nav class="nav-mobile" :class="{ open: isMobileMenuOpen }">
      <a
        v-for="link in navLinks"
        :key="link.id"
        :href="`#${link.id}`"
        class="nav-link-mobile"
        @click.prevent="scrollTo(link.id)"
      >
        {{ t(link.label) }}
      </a>
    </nav>

    <!-- Main Content -->
    <main class="main">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-accent"></div>

      <div class="footer-content">
        <div class="footer-brand">
          <img src="/fsc_logo_horizontal_white.png" alt="Fly Squash Club" class="footer-logo" />
          <p class="footer-tagline">{{ t('home.hero.subtitle') }}</p>
        </div>

        <div class="footer-grid">
          <div class="footer-section">
            <h4>{{ t('nav.sitemap') }}</h4>
            <nav class="footer-nav">
              <a
                v-for="link in navLinks"
                :key="link.id"
                :href="`#${link.id}`"
                @click.prevent="scrollTo(link.id)"
              >
                {{ t(link.label) }}
              </a>
            </nav>
          </div>

          <div class="footer-section">
            <h4>{{ t('nav.contact') }}</h4>
            <div class="footer-contact">
              <p>
                <span class="store-tag">{{ t('contact.email') }}:</span>
                <a href="mailto:fly_squash@163.com">fly_squash@163.com</a>
              </p>
              <p v-for="store in stores" :key="store.id">
                <span class="store-tag">{{ t(`contact.stores.${store.id}.name`) }}:</span>
                <a :href="`tel:${store.phone}`">{{ t(`contact.stores.${store.id}.phone`) }}</a>
              </p>
            </div>
          </div>

          <div class="footer-section">
            <h4>{{ t('contact.socials') }}</h4>
            <div class="footer-socials">
              <button type="button" class="social-icon" aria-label="WeChat" @click="openWechatLightbox">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.036 2.87c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/></svg>
              </button>
              <a href="https://www.xiaohongshu.com/user/profile/604b0be7000000000100680c" class="social-icon xhs-icon" aria-label="小红书" target="_blank" rel="noopener">
                <span class="xhs-mask" aria-hidden="true"></span>
              </a>
              <a href="https://www.instagram.com/shanghai_fsc/" class="social-icon" aria-label="Instagram" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} Fly Squash Club. {{ t('footer.rights') }}</p>
        <div class="footer-court-pattern"></div>
      </div>

      <Lightbox ref="wechatLightboxRef" triggerless :src="'/contact-wechat-qr.png'" :alt="t('contact.wechat')" :caption="t('contact.wechatScan')" />
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
}

/* ===== HEADER ===== */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: transparent;
  transition: background var(--transition-normal, 0.4s), backdrop-filter var(--transition-normal, 0.4s);
}

.header.scrolled {
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
}

.header-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--spacing-sm) var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.logo {
  position: relative;
  z-index: 10;
}

.logo img {
  height: 45px;
  transition: transform var(--transition-fast, 0.2s), opacity var(--transition-fast, 0.2s);
  opacity: 1;
}

.logo:hover img {
  transform: scale(1.05);
}

/* Navigation */
.nav {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  position: relative;
  color: var(--color-text);
  text-decoration: none;
  font-family: var(--font-display, sans-serif);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: var(--spacing-xs) 0;
  overflow: hidden;
}

.nav-link-text {
  display: block;
  transition: transform var(--transition-fast, 0.2s);
}

.nav-link-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-primary);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--transition-fast, 0.2s);
}

.nav-link:hover .nav-link-text {
  transform: translateY(-2px);
}

.nav-link:hover .nav-link-line {
  transform: scaleX(1);
  transform-origin: left;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.locale-switcher {
  display: flex;
  border: 1px solid var(--color-border-light, #3A3A3A);
  overflow: hidden;
}

.locale-btn {
  background: transparent;
  border: none;
  color: var(--color-text-light);
  font-family: var(--font-display, sans-serif);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  padding: 0.5rem 0.75rem;
  min-width: 3.2rem;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast, 0.2s);
}

.locale-btn:first-child {
  border-right: 1px solid var(--color-border-light, #3A3A3A);
}

.locale-btn.active {
  background: var(--color-primary);
  color: var(--color-background);
}

.locale-btn:hover:not(.active) {
  background: var(--color-border, #2A2A2A);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 999;
}

.mobile-menu-btn span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--color-text);
  transition: all var(--transition-fast, 0.2s);
  transform-origin: center;
}

.mobile-menu-btn.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.mobile-menu-btn.open span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile Navigation Overlay */
.nav-mobile {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.98);
  backdrop-filter: blur(10px);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* gap: var(--spacing-sm); */
  gap: 1.5rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 998;
}

@media (max-width: 768px) {
  .nav-mobile {
    display: flex;
  }
}

.nav-mobile.open {
  opacity: 1;
  visibility: visible;
}

.nav-link-mobile {
  color: white;
  text-decoration: none;
  font-family: var(--font-display, sans-serif);
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1rem;
  transition: color 0.3s ease, transform 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.nav-mobile.open .nav-link-mobile {
  opacity: 1;
  transform: translateY(0);
  animation: slideInUp 0.4s ease forwards;
}

.nav-link-mobile:hover {
  color: var(--color-primary, #00d9ff);
  transform: translateX(10px);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header Accent Line */
.header-accent {
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  opacity: 0;
  transition: opacity var(--transition-normal, 0.4s);
}

.header.scrolled .header-accent {
  opacity: 1;
}

/* ===== MAIN ===== */
.main {
  flex: 1;
}

/* ===== FOOTER ===== */
.footer {
  background: var(--color-background-dark, #000);
  position: relative;
  overflow: hidden;
}

.footer-accent {
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent-secondary, #00D4FF), var(--color-primary));
  background-size: 200% 100%;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.footer-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-xl);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.footer-logo {
  display: block;
  height: 72px;
  width: auto;
  object-fit: contain;
}

.footer-tagline {
  font-family: var(--font-display, sans-serif);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.footer-section h4 {
  font-family: var(--font-display, sans-serif);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.footer-nav a {
  color: var(--color-text-light);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color var(--transition-fast, 0.2s);
}

.footer-nav a:hover {
  color: var(--color-primary);
}

.footer-contact p {
  color: var(--color-text-light);
  font-size: 0.9rem;
  line-height: 1.8;
  margin: 0;
}

.footer-contact a {
  color: var(--color-text-light);
  text-decoration: none;
  transition: color var(--transition-fast, 0.2s);
}

.footer-contact a:hover {
  color: var(--color-primary);
}

.footer-contact .store-tag {
  display: inline-block;
  min-width: 5.5rem;
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted, #666);
  margin-right: 0.25rem;
}

.footer-socials {
  display: flex;
  gap: var(--spacing-sm);
}

.social-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-light, #3A3A3A);
  background: transparent;
  color: var(--color-text-light);
  cursor: pointer;
  padding: 0;
  transition: all var(--transition-fast, 0.2s);
}

.social-icon svg {
  width: 16px;
  height: 16px;
}

.xhs-mask {
  display: block;
  width: 28px;
  height: 28px;
  background-color: currentColor;
  -webkit-mask: url(/xiaohongshu-mask.png) center/contain no-repeat;
  mask: url(/xiaohongshu-mask.png) center/contain no-repeat;
}

.social-icon:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-background);
  transform: translateY(-3px);
}

.footer-bottom {
  border-top: 1px solid var(--color-border, #2A2A2A);
  padding: var(--spacing-md);
  text-align: center;
  position: relative;
}

.footer-bottom p {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.footer-court-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
  background-image:
    linear-gradient(var(--color-primary) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-primary) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .nav {
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
    width: 44px;
    height: 44px;
  }

  /* Larger touch targets for footer links on phones */
  .footer-nav a,
  .footer-contact a {
    display: inline-flex;
    align-items: center;
    min-height: 40px;
  }

  /* Hide desktop nav on mobile */
  .nav {
    display: none;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }

  .footer-section:last-child {
    grid-column: span 2;
  }
}

/* Section scroll offset lives in shared/styles/base.css — a scoped rule here
   never reaches the <section> elements, which arrive through <slot />. */

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-section:last-child {
    grid-column: span 1;
  }
}
</style>
