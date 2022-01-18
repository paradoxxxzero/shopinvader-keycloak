import Keycloak from 'keycloak-js'
import { createApp } from 'vue'
import App from './App.vue'
import config from '../config.json'

const keycloak = Keycloak(config.keycloak)
window.keycloak = keycloak
keycloak
  .init({
    onLoad: 'check-sso',
    checkLoginIframe: false,
    silentCheckSsoRedirectUri: window.location.origin + '/sso.html',
  })
  .then(async auth => {
    if (!auth) {
      let access_token = localStorage.getItem('anonymous_access_token')
      let refresh_token = localStorage.getItem('anonymous_refresh_token')
      if (!access_token || !refresh_token) {
        const response = await fetch(config.anonymous_authenticator)
        ;({ access_token, refresh_token } = await response.json())

        // Is it really safe?
        localStorage.setItem('anonymous_access_token', access_token)
        localStorage.setItem('anonymous_refresh_token', refresh_token)
      }

      const auth = await keycloak.init({
        token: access_token,
        refreshToken: refresh_token,
        checkLoginIframe: false,
      })
      if (!auth) {
        console.error("Couldn't get auth")
      }
    }
    const app = createApp(App, { keycloak })

    app.mount('#app')
  })
