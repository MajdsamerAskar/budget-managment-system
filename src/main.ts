import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import { Chart, registerables } from 'chart.js';
import 'primeicons/primeicons.css'
import App from './App.vue';
import router from './router';
import './assets/style.css'
import './assets/responsive-fixes.css'

const app = createApp(App);

Chart.register(...registerables);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
      cssLayer: false
    }
  }
})
app.use(ToastService);
app.use(ConfirmationService);
app.directive('tooltip', Tooltip);

app.mount('#app');