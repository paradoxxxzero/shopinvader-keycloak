import Keycloak from 'keycloak-js'
import { createApp } from 'vue'
import App from './App.vue'
import config from '../config.json'

const keycloak = Keycloak(config.keycloak)
window.keycloak = keycloak
const uri = new URL(window.location.href)
keycloak
  .init({
    onLoad: 'check-sso',
    checkLoginIframe: false,
    silentCheckSsoRedirectUri: window.location.origin + '/sso.html',
  })
  .then(async auth => {
    if (!auth) {
      if (uri.searchParams.get('anon')) {
        throw new Error("Can't get anon auth")
      }
      uri.searchParams.append('anon', true)
      const authUrl = `${config.keycloak_guest.url}/auth/realms/${
        config.keycloak_guest.realm
      }/authorize-guest?redirect_uri=${encodeURIComponent(uri.toString())}`
      location.replace(authUrl)
    }

    const app = createApp(App, { keycloak })

    app.mount('#app')
  })
