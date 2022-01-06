import Keycloak from "keycloak-js";
import { createApp } from "vue";
import App from "./App.vue";

const initOptions = {
  url: "https://auth.noukies.akretion.com/auth",
  realm: "shopinvader-keycloak-test",
  clientId: "shopinvader-test",
};

const keycloak = Keycloak(initOptions);
await keycloak.init({ onLoad: "check-sso" });

const app = createApp(App, { keycloak });

app.mount("#app");
