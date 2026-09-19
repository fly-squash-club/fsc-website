<script setup>
import { useRoute } from 'vue-router'
import Layout from './Layout.vue'

const route = useRoute()
</script>

<template>
  <Layout>
    <router-view v-slot="{ Component }">
      <!--
        Keyed by language (and article), so switching language rebuilds the page
        rather than patching the text in place. That makes the entrance
        animations run exactly as they do on a first visit: fresh elements start
        from their hidden state and transition in.

        Restarting CSS transitions on elements already on screen is the
        alternative, and it is unreliable — the browser coalesces the reset and
        the restore into a single style change, so the content simply snaps.
      -->
      <component :is="Component" :key="`${route.params.locale}/${route.params.slug ?? ''}`" />
    </router-view>
  </Layout>
</template>
