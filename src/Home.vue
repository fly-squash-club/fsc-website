<script setup>
import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { setPageMeta } from './meta.js'
import HeroSection from './sections/Hero.vue'
import AboutSection from './sections/About.vue'
import CoachesSection from './sections/Coaches.vue'
import PlayersSection from './sections/Players.vue'
import ActivitiesSection from './sections/Activities.vue'
import NewsSection from './sections/News.vue'
import ContactSection from './sections/Contact.vue'

const { t, locale } = useI18n()

// Re-applies automatically when the language changes.
watchEffect(() => {
  setPageMeta({
    title: '',
    description: t('about.description'),
    image: '/fsc_courts.jpg',
    locale: locale.value
  })
})
</script>

<template>
  <div class="home">
    <HeroSection />
    <AboutSection />
    <CoachesSection />
    <PlayersSection />
    <ActivitiesSection />
    <NewsSection />
    <ContactSection />
  </div>
</template>
