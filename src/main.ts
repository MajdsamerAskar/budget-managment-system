import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { Chart, registerables } from 'chart.js';

import App from './App.vue';
import router from './router';

// PrimeVue CSS
import 'primeicons/primeicons.css';

const app = createApp(App);

Chart.register(...registerables);

// Register plugins
app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark-mode',
      cssLayer: false
    }
  }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');