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
    const keycloak = this.isGuest ? this.keycloaks.guest : this.keycloaks.auth

    try {
      await keycloak.updateToken(30)
    } catch (e) {
      console.error('Unable to refresh Token', e)
    }
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
      : this.keycloaks.auth.tokenParsed?.email
  }

  get isGuest() {
    return this.keycloaks.guest.authenticated
  }

  get isAuth() {
    return this.keycloaks.auth.authenticated
  }

  get isBoth() {
    return (
      this.keycloaks.auth.authenticated && this.keycloaks.guest.authenticated
    )
  }
}
