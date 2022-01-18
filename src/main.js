import Keycloak from 'keycloak-js'
import { createApp } from 'vue'
import App from './App.vue'
import config from './config.json'

const keycloak = Keycloak(config.keycloak)
window.keycloak = keycloak
keycloak
  .init({
    onLoad: 'check-sso',
  })
  .then(async auth => {
    if (!auth) {
      const response = await fetch(config.anonymous_authenticator)
      const { access_token, refresh_token } = await response.json()
      const auth = await keycloak.init({
        token: access_token,
        refreshToken: refresh_token,
        checkLoginIframe: false, // WHY?
      })
    }
    const app = createApp(App, { keycloak })

    app.mount('#app')
  })
