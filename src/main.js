import Keycloak from 'keycloak-js'
import { createApp } from 'vue'
import App from './App.vue'
import config from '../config.json'

const GUEST_MARK = '___guest___'

const urlHash = ({ add = '', remove = '' }) =>
  window.location.pathname +
  window.location.search +
  ((window.location.hash || '#') + add).replace(remove, '').replace(/^#$/, '')

;(async () => {
  const keycloak = new Keycloak(config.keycloak)
  const keycloakGuest = new Keycloak(config.keycloak_guest)
  window.keycloak = keycloak
  window.keycloakGuest = keycloakGuest

  // If we are in guest callback, we mustn't try to init normal keycloak as it
  // will erase the callback state.
  const isGuestLogin = window.location.hash.includes(GUEST_MARK)

  const auth =
    !isGuestLogin &&
    (await keycloak.init({
      onLoad: 'check-sso',
      // checkLoginIframe: false,
      // silentCheckSsoRedirectUri: window.location.origin + '/sso.html',
    }))

  if (!auth) {
    if (!isGuestLogin) {
      history.replaceState(
        window.history.state,
        null,
        urlHash({ add: GUEST_MARK })
      )
    }
    const guestAuth = await keycloakGuest.init({
      onLoad: 'check-sso',
      // checkLoginIframe: false,
      // silentCheckSsoRedirectUri: window.location.origin + '/sso.html',
    })
    if (!guestAuth) {
      // No guest auth available, create user:
      const authUrl = `${config.keycloak_guest.url}/auth/realms/${
        config.keycloak_guest.realm
      }/authorize-guest?redirect_uri=${encodeURIComponent(urlHash())}`

      location.replace(authUrl)
    }
    history.replaceState(
      window.history.state,
      null,
      urlHash({ remove: GUEST_MARK })
    )
  }

  const app = createApp(App, { keycloak, keycloakGuest })

  app.mount('#app')
})()
