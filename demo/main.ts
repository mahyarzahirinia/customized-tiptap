import { createApp } from "vue";
import "./assets/main.css";
import App from "./App.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import { md3 } from "vuetify/blueprints";
import CustomizedTipTapPlugin from "../src";

const app = createApp(App);
const vuetify = createVuetify({
  blueprint: md3,
  icons: { defaultSet: "mdi" },
  components,
  directives,
});

app.use(vuetify);
app.use(CustomizedTipTapPlugin);
app.mount("#app");
