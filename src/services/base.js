import config from '../../config.json'
import { keycloak } from 'keycloak-js'

const { url, website_unique_key } = config.shopinvader

export default class ShopinvaderService {
  constructor(keycloaks) {
    this.keycloaks = keycloaks
  }

  async fetch(
    method,
    service,
    endpoint = '',
    body = undefined,
    allowAnonymous = false
  ) {
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
        'Sess-Cart-Id':
          localStorage.getItem(`shopinvaderCart_${this.email}`) || '0',
      },
      body,
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
    return !this.keycloaks.auth.authenticated
  }
}
