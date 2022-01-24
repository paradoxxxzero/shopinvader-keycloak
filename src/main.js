import Keycloak from 'keycloak-js'
import { createApp } from 'vue'
import App from './App.vue'
import config from '../config.json'

const GUEST_MARK = '___guest___'

const urlHash = ({ add = '', remove = '' } = {}) =>
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
  if (window.location.hash.includes(GUEST_MARK)) {
    localStorage.setItem('hash', window.location.hash)
    window.location.hash = ''
  }

  const auth = await keycloak.init({
    onLoad: 'check-sso',
    // checkLoginIframe: false,
    // silentCheckSsoRedirectUri: window.location.origin + '/sso.html',
  })

  if (localStorage.getItem('hash')) {
    window.location.hash = localStorage.getItem('hash')
    localStorage.removeItem('hash')
  }

  // if (!auth) {
  if (!window.location.hash.includes(GUEST_MARK)) {
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
  if (!auth && !guestAuth) {
    // No guest auth available, create user:
    const authUrl = `${config.keycloak_guest.url}/realms/${
      config.keycloak_guest.realm
    }/authorize-guest?redirect_uri=${encodeURIComponent(window.location.href)}`

    location.replace(authUrl)
  }
  if (window.location.hash.includes(GUEST_MARK)) {
    history.replaceState(
      window.history.state,
      null,
      urlHash({ remove: GUEST_MARK })
    )
  }

  const app = createApp(App, {
    keycloaks: { auth: keycloak, guest: keycloakGuest },
  })

  app.mount('#app')
})()
