import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";

import 'primevue/resources/themes/aura-light-green/theme.css'
import "./style.css";

const app = createApp(App);
app.use(PrimeVue).use(router);
app.mount("#app");
