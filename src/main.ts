import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { Chart, registerables } from 'chart.js';
import 'primeicons/primeicons.css'
import App from './App.vue';
import router from './router';
// Your custom styles LAST (to override PrimeVue)
import './assets/style.css'
import './assets/responsive-fixes.css' // Add this new file// PrimeVue CSS


const app = createApp(App);

Chart.register(...registerables);

// Register plugins
app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark-mode' // optional
        }
    }
})
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');