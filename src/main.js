import Keycloak from 'keycloak-js'
import { createApp } from 'vue'
import App from './App.vue'

const initOptions = {
  url: 'https://auth.noukies.akretion.com/auth',
  realm: 'shopinvader-keycloak-test',
  clientId: 'shopinvader-test',
}

const keycloak = Keycloak(initOptions)
window.keycloak = keycloak
await keycloak.init({
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/sso.html',
})

const app = createApp(App, { keycloak })

app.mount('#app')
