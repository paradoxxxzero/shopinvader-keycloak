import config from '../../config.json'
import { keycloak } from 'keycloak-js'

const { url, website_unique_key } = config.shopinvader

export default class ShopinvaderService {
  constructor(keycloaks) {
    this.keycloaks = keycloaks
  }

  async fetch({
    service,
    method = 'GET',
    endpoint = '',
    body = undefined,
    headers = {},
    allowAnonymous = false,
  }) {
    if (this.isGuest && !allowAnonymous) {
      return
    }
    // Always use token from guest if present because the cart transfert request
    // use the guest token to transfer to the user
    const keycloak = this.isGuest ? this.keycloaks.guest : this.keycloaks.user

    try {
      // Refresh token if needed
      await keycloak.updateToken()
    } catch (e) {
      console.error('Unable to refresh Token', e)
    }

    // Fetch shopinvader api service endpoint
    const response = await fetch(`${url}${[service, endpoint].join('/')}`, {
      method,
      headers: {
        'Content-Type': body ? 'application/json' : undefined,
        'Website-Unique-Key': website_unique_key,
        Authorization: `Bearer ${keycloak.token}`,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (response.status !== 200) {
      console.error('Fail to fetch', response)
      return
    }
    return await response.json()
  }

  get email() {
    return this.isGuest
      ? this.keycloaks.guest.tokenParsed?.email
      : this.keycloaks.user.tokenParsed?.email
  }

  get isGuest() {
    return this.keycloaks.guest.authenticated
  }

  get isUser() {
    return this.keycloaks.user.authenticated
  }

  get isBoth() {
    return (
      this.keycloaks.user.authenticated && this.keycloaks.guest.authenticated
    )
  }
}
