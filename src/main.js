import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const app = createApp(App);

const requireComponent = require.context(
  "./components",
  true,
  /App[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach((filename) => {
  let baseConfigComponent = requireComponent(filename);
  baseConfigComponent = baseConfigComponent.default || baseConfigComponent;
  let baseComponentName =
    baseConfigComponent.name ||
    filename.replace(/^.+\//, "").replace(/\.+$/, "").replace(".vue", "");

  app.component(baseComponentName, baseConfigComponent);
});
app.use(store);
app.use(router);
app.mount("#app");


