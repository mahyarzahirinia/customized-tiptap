import { createApp } from "vue";
import "./assets/main.css";
import App from "./App.vue";
import CustomizedTipTapPlugin from "../src";

const app = createApp(App);

app.use(CustomizedTipTapPlugin);
app.mount("#app");
