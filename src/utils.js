import config from '../config.json'

export const createGuestUser = keycloak => {
  const redirectUri = `${window.location.origin}/guest`
  if (config.guest_creator === 'oidc-guest-provider') {
    // Use direct login with oidc-guest-provider to generate a guest user
    keycloak.login({
      idpHint: 'oidc-guest-provider',
      redirectUri,
    })
  } else if (config.guest_creator === 'guest-authenticator') {
    // Redirect on the guest-authenticator page to create an new guest user
    const authUrl = `${config.keycloak_guest.url}/realms/${
      config.keycloak_guest.realm
    }/authorize-guest?redirect_uri=${encodeURIComponent(redirectUri)}`

    location.replace(authUrl)
  }
}

export const silentLogout = keycloak =>
  new Promise(resolve => {
    // This is heavily inspired from
    // https://github.com/keycloak/keycloak/blob/dea123169f75b4c8fd253d89ea8ef1d6e73a1694/adapters/oidc/js/src/main/js/keycloak.js#L196-L215
    var ifrm = document.createElement('iframe')
    ifrm.setAttribute(
      'src',
      keycloak.createLogoutUrl({
        redirectUri: keycloak.silentCheckSsoRedirectUri,
      })
    )
    ifrm.setAttribute('title', 'keycloak-silent-logout')
    ifrm.style.display = 'none'
    document.body.appendChild(ifrm)

    var messageCallback = function (event) {
      if (
        event.origin !== window.location.origin ||
        ifrm.contentWindow !== event.source
      ) {
        return
      }

      // Remove token since we are logged out
      keycloak.clearToken()
      document.body.removeChild(ifrm)
      window.removeEventListener('message', messageCallback)
      resolve()
    }

    window.addEventListener('message', messageCallback)
  })
