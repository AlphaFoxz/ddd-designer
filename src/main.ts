import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
import App from './App.vue'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      prefix: 'p',
      darkModeSelector: 'light',
      cssLayer: false,
    },
  },
})
app.mount('#app')
