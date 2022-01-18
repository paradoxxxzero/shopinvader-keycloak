import config from '../../config.json'

const { shopinvader_url, shopinvader_website_unique_key } = config

export default class ShopinvaderService {
  constructor(keycloak) {
    this.keycloak = keycloak
  }

  async fetch(method, service, endpoint = '', body = undefined) {
    try {
      await this.keycloak.updateToken(30)
    } catch (e) {
      console.error('Unable to refresh Token', e)
    }
    const response = await fetch(
      shopinvader_url + [service, endpoint].join('/'),
      {
        method,
        headers: {
          'Content-Type': body ? 'application/json' : undefined,
          'Website-Unique-Key': shopinvader_website_unique_key,
          Authorization: `Bearer ${this.token}`,
          'Sess-Cart-Id':
            localStorage.getItem(`shopinvaderCart_${this.email}`) || '0',
        },
        body,
      }
    )

    if (response.status !== 200) {
      console.error('Fail to fetch', response)
      return
    }
    return await response.json()
  }

  get email() {
    return this.keycloak.tokenParsed?.email
  }

  get token() {
    return this.keycloak.token
  }
}
