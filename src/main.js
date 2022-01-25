import Keycloak from 'keycloak-js'
import { createApp } from 'vue'
import App from './App.vue'
import config from '../config.json'

const silentCheckSsoRedirectUri = `${window.location.origin}/${config.sso_page}`

;(async () => {
  const keycloak = new Keycloak(config.keycloak)
  const keycloakGuest = new Keycloak(config.keycloak_guest)

  window.keycloak = keycloak
  window.keycloakGuest = keycloakGuest

  const auth = await keycloak.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri,
  })

  const guestAuth = await keycloakGuest.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri,
  })

  if (!auth && !guestAuth) {
    // No guest auth available, create user:
    const authUrl = `${config.keycloak_guest.url}/realms/${
      config.keycloak_guest.realm
    }/authorize-guest?redirect_uri=${encodeURIComponent(window.location.href)}`

    location.replace(authUrl)
    // This should not be reached, but it is sometimes so we return to be safe
    return
  }

  const app = createApp(App, {
    keycloaks: { auth: keycloak, guest: keycloakGuest },
  })

  app.mount('#app')
})()
