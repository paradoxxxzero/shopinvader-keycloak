import Keycloak from 'keycloak-js'
import { createApp } from 'vue'
import App from './App.vue'

const config = {
  url: 'https://auth.noukies.akretion.com/auth',
  realm: 'shopinvader-keycloak-test',
  clientId: 'shopinvader-test',
}

const keycloak = Keycloak(config)
window.keycloak = keycloak
keycloak
  .init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/sso.html',
  })
  .then(async auth => {
    if (!auth) {
      const response = await fetch('http://localhost:3001/auth')
      const { access_token, refresh_token } = await response.json()
      const auth = await keycloak.init({
        token: access_token,
        refreshToken: refresh_token,
        // onLoad: 'check-sso',
        checkLoginIframe: false, // WHY ?
        // silentCheckSsoRedirectUri: window.location.origin + '/sso.html',
      })
      console.log(auth)
    }
    const app = createApp(App, { keycloak })

    app.mount('#app')
  })
