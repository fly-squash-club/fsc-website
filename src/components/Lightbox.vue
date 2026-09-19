<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  // Single-image mode
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' },
  // Carousel mode: array of { src, alt?, caption? }
  items: { type: Array, default: () => [] },
  // External trigger control — when used as the gallery's external lightbox
  // (Carousel is opened via thumbnail click); leave undefined for self-trigger mode.
  triggerless: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const isOpen = ref(false)
const index = ref(0)
let touchStartX = null

const slides = computed(() => {
  if (props.items && props.items.length) return props.items
  if (props.src) return [{ src: props.src, alt: props.alt, caption: props.caption }]
  return []
})

const current = computed(() => slides.value[index.value] || {})
const total = computed(() => slides.value.length)
const hasMany = computed(() => total.value > 1)

function open(startIndex = 0) {
  index.value = Math.max(0, Math.min(startIndex, total.value - 1))
  isOpen.value = true
}
function close() {
  isOpen.value = false
  emit('close')
}
function next() {
  if (!hasMany.value) return
  index.value = (index.value + 1) % total.value
}
function prev() {
  if (!hasMany.value) return
  index.value = (index.value - 1 + total.value) % total.value
}

function onKey(e) {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}

function onTouchStart(e) {
  touchStartX = e.changedTouches[0].clientX
}
function onTouchEnd(e) {
  if (touchStartX === null) return
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 40) {
    dx < 0 ? next() : prev()
  }
  touchStartX = null
}

watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

defineExpose({ open, close })
</script>

<template>
  <button
    v-if="!triggerless && slides.length"
    type="button"
    class="trigger"
    :aria-label="alt || current.alt || 'Open image'"
    @click="open(0)"
  >
    <img :src="slides[0].src" :alt="slides[0].alt || ''" />
  </button>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="lightbox-backdrop"
        role="dialog"
        aria-modal="true"
        @click.self="close"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <button type="button" class="lightbox-close" aria-label="Close" @click="close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="6" y1="6" x2="18" y2="18"/>
            <line x1="18" y1="6" x2="6" y2="18"/>
          </svg>
        </button>

        <button
          v-if="hasMany"
          type="button"
          class="lightbox-nav lightbox-prev"
          aria-label="Previous image"
          @click="prev"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 6 9 12 15 18"/>
          </svg>
        </button>

        <button
          v-if="hasMany"
          type="button"
          class="lightbox-nav lightbox-next"
          aria-label="Next image"
          @click="next"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 6 15 12 9 18"/>
          </svg>
        </button>

        <figure class="lightbox-figure" @click.self="close">
          <img :key="current.src" :src="current.src" :alt="current.alt || ''" class="lightbox-image" />
          <figcaption v-if="current.caption || hasMany" class="lightbox-caption">
            <span v-if="current.caption">{{ current.caption }}</span>
            <span v-if="hasMany" class="lightbox-counter">{{ index + 1 }} / {{ total }}</span>
          </figcaption>
        </figure>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.trigger {
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.trigger:hover {
  transform: scale(1.02);
}

.trigger img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.lightbox-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: var(--spacing-md, 2rem);
  cursor: zoom-out;
}

.lightbox-close,
.lightbox-nav {
  position: fixed;
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2001;
}

.lightbox-close {
  top: var(--spacing-md, 2rem);
  right: var(--spacing-md, 2rem);
}

.lightbox-nav {
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-prev {
  left: var(--spacing-md, 2rem);
}

.lightbox-next {
  right: var(--spacing-md, 2rem);
}

.lightbox-close:hover,
.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #fff;
}

.lightbox-close svg,
.lightbox-nav svg {
  width: 22px;
  height: 22px;
}

.lightbox-figure {
  max-width: min(92vw, 900px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm, 1rem);
  margin: 0;
  cursor: default;
}

.lightbox-image {
  max-width: 100%;
  max-height: 78vh;
  object-fit: contain;
  background: #fff;
  padding: 12px;
}

.lightbox-caption {
  font-family: var(--font-display, 'Oswald', sans-serif);
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.lightbox-counter {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--color-primary, #BFFF00);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .lightbox-nav {
    width: 38px;
    height: 38px;
  }
  .lightbox-prev {
    left: 0.75rem;
  }
  .lightbox-next {
    right: 0.75rem;
  }
}
</style>
