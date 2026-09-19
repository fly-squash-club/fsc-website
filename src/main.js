import { createApp } from 'vue'
import i18n from './i18n'
import App from './App.vue'
import router from './router.js'
import './theme.css'

const app = createApp(App)

app.use(router)
app.use(i18n)

router.beforeEach((to) => {
  const locale = to.params.locale
  if (locale && i18n.global.locale.value !== locale) {
    i18n.global.locale.value = locale
  }
})

app.mount('#app')
