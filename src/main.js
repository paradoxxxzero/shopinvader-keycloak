import Keycloak from 'keycloak-js'
import { createApp } from 'vue'
import App from './App.vue'
import config from '../config.json'

const silentCheckSsoRedirectUri = `${window.location.origin}/${config.sso_page}`

;(async () => {
  // Save hash in case of guest login redirect
  const hashState = location.hash
  let redoAuth = false

  const keycloak = new Keycloak(config.keycloak)
  const keycloakGuest = new Keycloak(config.keycloak_guest)

  window.keycloak = keycloak
  window.keycloakGuest = keycloakGuest
  let auth

  try {
    auth = await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri,
    })
  } catch (e) {
    if (hashState) {
      // This should be a guest login, restore hash and redo auth after
      location.hash = hashState
      redoAuth = true
    } else {
      throw e
    }
  }

  const guestAuth = await keycloakGuest.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri,
  })

  if (redoAuth) {
    auth = await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri,
    })
  }

  if (!auth && !guestAuth) {
    // No guest auth available, create user:
    if (config.guest_creator === 'oidc-guest-provider') {
      keycloakGuest.login({
        idpHint: 'oidc-guest-provider',
      })
    } else if (config.guest_creator === 'guest-authenticator') {
      const authUrl = `${config.keycloak_guest.url}/realms/${
        config.keycloak_guest.realm
      }/authorize-guest?redirect_uri=${encodeURIComponent(
        window.location.href
      )}`

      location.replace(authUrl)
    }
    // This should not be reached, but it is sometimes so we return to avoid
    // app rendering without any user
    return
  }

  const app = createApp(App, {
    keycloaks: { auth: keycloak, guest: keycloakGuest },
  })

  app.mount('#app')
})()
