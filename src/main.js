import Keycloak, { keycloak } from 'keycloak-js'
import { createApp, ref } from 'vue'
import App from './App.vue'
import config from '../config.json'
import { createGuestUser } from './utils'

// This url is required to do initial silent login check
const silentCheckSsoRedirectUri = `${window.location.origin}/${config.sso_page}`

// Here we check that we are in guest process login,
// if so we need to start by initializing guest keycloak first
// otherwise user keycloak will remove the state parameter/hash from the url and
// the guest keycloak won't be able to login.
const isGuestLogin = window.location.pathname === '/guest'

if (isGuestLogin) {
  // Remove the guest from url now that we know we are in guest login
  // This assumes that guest login always redirect to home page
  const url = new URL(window.location.href)
  url.pathname = ''
  window.history.replaceState(null, null, url.toString())
}

// Let's create both keycloak instances
const keycloaks = {
  user: new Keycloak(config.keycloak_user),
  guest: new Keycloak(config.keycloak_guest),
}

// We use a auth state to notify app the current login status
const state = ref('loading')

// Create the app and mount it
const app = createApp(App, {
  keycloaks: { user: keycloaks.user, guest: keycloaks.guest },
  state,
})
app.mount('#app')

// As specified above we need to init the keycloak in the right order
const sortedKeycloaks = [keycloaks.user, keycloaks.guest]
if (isGuestLogin) {
  // We are in guest login so let's start with guest keycloak
  sortedKeycloaks.reverse()
}

// Rest of login process is done async
;(async () => {
  const auths = []
  for (const keycloak of sortedKeycloaks) {
    if (state.value !== 'fail') {
      try {
        // Init the keycloak and get the authentication status
        auths.push(
          await keycloak.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri,
          })
        )
      } catch (e) {
        console.error('Error on keycloak init', keycloak, e)
        state.value = 'fail'
      }
    }
  }

  if (state.value !== 'fail' && !auths.some(x => x)) {
    // No auth available, create a guest user by logging in the special realm:
    return createGuestUser(keycloaks.guest)
  }

  // If nothing went wrong, it's a success
  if (state.value !== 'fail') {
    state.value = 'success'
  }
})()
